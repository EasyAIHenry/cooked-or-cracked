#!/usr/bin/env python3
"""Score Instagram creators + reels from Apify instagram-scraper datasets.

Usage: python3 score.py --reels <datasetId> --details <datasetId> [--out runs/DATE]
Datasets are read by ID from the public Apify API (no token needed).
Writes leads.json, creators.csv, report.md, and updates seen.json / watchlist.json.
"""
import argparse, json, csv, statistics, urllib.request, datetime as dt
from pathlib import Path

HERE = Path(__file__).parent
API = "https://api.apify.com/v2/datasets/{}/items?clean=true&format=json&limit=5000&fields={}"
REEL_F = "ownerUsername,ownerFullName,shortCode,url,videoPlayCount,videoViewCount,likesCount,commentsCount,timestamp,videoDuration,caption,isPinned,paidPartnership,type,productType"
DET_F = "username,fullName,followersCount,biography,verified,relatedProfiles"


def fetch(ds, fields):
    with urllib.request.urlopen(API.format(ds, fields), timeout=120) as r:
        return json.load(r)


def plays(r):
    return r.get("videoPlayCount") or r.get("videoViewCount") or 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--reels", required=True)
    ap.add_argument("--details", help="profile details dataset (weekly is enough; follower counts are cached)")
    ap.add_argument("--discovery", help="hashtag reels dataset; high-play unknown accounts become candidates")
    ap.add_argument("--discovery-min-plays", type=int, default=30000)
    ap.add_argument("--out")
    ap.add_argument("--fresh-days", type=int, default=7)
    ap.add_argument("--min-multiple", type=float, default=2.5)
    a = ap.parse_args()

    now = dt.datetime.now(dt.timezone.utc)
    out = Path(a.out or HERE / "runs" / now.astimezone().strftime("%Y-%m-%d"))
    out.mkdir(parents=True, exist_ok=True)

    hist_f, prof_f = HERE / "history.json", HERE / "profiles.json"
    hist = json.loads(hist_f.read_text()) if hist_f.exists() else {}
    for r in fetch(a.reels, REEL_F):
        if r.get("shortCode") and plays(r) > 0 and r.get("ownerUsername"):
            hist[r["shortCode"]] = {**hist.get(r["shortCode"], {}), **r, "scannedAt": now.isoformat()}
    cutoff = now - dt.timedelta(days=30)
    hist = {k: v for k, v in hist.items() if dt.datetime.fromisoformat(v["timestamp"].replace("Z", "+00:00")) >= cutoff}
    hist_f.write_text(json.dumps(hist))
    reels = list(hist.values())

    det = json.loads(prof_f.read_text()) if prof_f.exists() else {}
    if a.details:
        for d in fetch(a.details, DET_F):
            if d.get("username") and d.get("followersCount") is not None:
                det[d["username"]] = d
        prof_f.write_text(json.dumps(det))

    by = {}
    for r in reels:
        by.setdefault(r["ownerUsername"], []).append(r)

    creators, leads = [], []
    for u, rs in by.items():
        p = [plays(r) for r in rs]
        med = statistics.median(p)
        fol = (det.get(u) or {}).get("followersCount") or 0
        eng = [(r.get("likesCount", 0) + r.get("commentsCount", 0)) / plays(r) for r in rs if r.get("likesCount", -1) >= 0]
        com = [r.get("commentsCount", 0) / plays(r) for r in rs]
        best = max(rs, key=plays)
        c = dict(
            username=u, name=(det.get(u) or {}).get("fullName") or rs[0].get("ownerFullName", ""),
            followers=fol, reels_30d=len(rs), median_plays=int(med), total_plays=sum(p),
            reach_ratio=round(med / fol, 2) if fol else None,
            eng_rate=round(statistics.median(eng) * 100, 2) if eng else None,
            comment_rate=round(statistics.median(com) * 100, 2),
            comment_gate=statistics.median(com) > 0.02,
            best_plays=plays(best), best_url=best.get("url"),
        )
        # "Doing well" = consistent reach (median) x cadence, boosted when reach beats follower count
        c["momentum"] = round(med * min(len(rs), 20) / 1000 * (1 + min(c["reach_ratio"] or 0, 3)), 1)
        creators.append(c)
        if len(rs) < 4:
            continue  # not enough baseline for an outlier call
        for r in rs:
            ts = dt.datetime.fromisoformat(r["timestamp"].replace("Z", "+00:00"))
            age = (now - ts).days
            mult = plays(r) / med if med else 0
            if age <= a.fresh_days and mult >= a.min_multiple and not r.get("isPinned"):
                leads.append(dict(
                    username=u, url=r["url"], shortCode=r["shortCode"], plays=plays(r),
                    multiple=round(mult, 1), age_days=age, likes=r.get("likesCount"),
                    comments=r.get("commentsCount"), duration=r.get("videoDuration"),
                    comment_gate=(r.get("commentsCount", 0) / plays(r)) > 0.02,
                    paid=r.get("paidPartnership"), caption=(r.get("caption") or "")[:220].replace("\n", " "),
                ))

    creators = [c for c in creators if c["reels_30d"] >= 4]
    creators.sort(key=lambda c: c["momentum"], reverse=True)

    seen_f = HERE / "seen.json"
    seen = set(json.loads(seen_f.read_text())) if seen_f.exists() else set()
    for l in leads:
        l["new"] = l["shortCode"] not in seen
        # lead score: outlier strength x absolute reach, fresher is better
        l["score"] = round(min(l["multiple"], 10) * (l["plays"] ** 0.5) / (1 + l["age_days"] * 0.15), 1)
    leads.sort(key=lambda l: l["score"], reverse=True)
    seen_f.write_text(json.dumps(sorted(seen | {l["shortCode"] for l in leads})))

    # auto-discovery: related profiles of scanned creators become candidates
    wl_f = HERE / "watchlist.json"
    wl = json.loads(wl_f.read_text()) if wl_f.exists() else {"creators": [], "candidates": []}
    known = set(by) | {u for k in ("creators", "candidates", "pending", "dropped") for u in wl.get(k, [])}
    for d in det.values():
        for rp in d.get("relatedProfiles") or []:
            n = rp.get("username")
            if n and n not in known and not rp.get("is_private"):
                wl.setdefault("pending", []).append(n); known.add(n)
    new_faces = []
    if a.discovery:
        best = {}
        for r in fetch(a.discovery, REEL_F):
            u = r.get("ownerUsername")
            cap = r.get("caption") or ""
            letters = [ch for ch in cap if ch.isalpha()]; ascii_share = sum(ch.isascii() for ch in letters) / max(len(letters), 1)
            if u and ascii_share > 0.95 and plays(r) >= a.discovery_min_plays and plays(r) > best.get(u, {}).get("p", 0):
                best[u] = {"p": plays(r), "url": r.get("url"), "cap": (r.get("caption") or "")[:100].replace("\n", " ")}
        for u, b in sorted(best.items(), key=lambda x: -x[1]["p"]):
            if u not in known:
                wl.setdefault("pending", []).append(u); known.add(u); new_faces.append((u, b))
    wl_f.write_text(json.dumps(wl, indent=2))

    (out / "leads.json").write_text(json.dumps(leads, indent=2))
    (out / "creators.json").write_text(json.dumps(creators, indent=2))
    with open(out / "creators.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(creators[0])); w.writeheader(); w.writerows(creators)

    L = [f"# Lead Scout — {out.name}", "", f"{len(reels)} reels from {len(by)} creators scanned.", "",
         "## Top creators (30-day momentum)", "", "| # | Creator | Followers | Reels/30d | Median plays | Reach/followers | Eng % | Comment-gate |", "|---|---|---|---|---|---|---|---|"]
    for i, c in enumerate(creators[:15], 1):
        L.append(f"| {i} | @{c['username']} | {c['followers']:,} | {c['reels_30d']} | {c['median_plays']:,} | {c['reach_ratio']} | {c['eng_rate']} | {'yes' if c['comment_gate'] else ''} |")
    L += ["", f"## Episode leads (last {a.fresh_days}d, ≥{a.min_multiple}x creator median)", ""]
    for i, l in enumerate(leads[:10], 1):
        L.append(f"{i}. **@{l['username']}** — {l['plays']:,} plays, **{l['multiple']}x** their median, {l['age_days']}d old{' · NEW' if l['new'] else ''}{' · comment-gate' if l['comment_gate'] else ''}  \n   {l['url']}  \n   _{l['caption'][:140]}_")
    if not leads:
        L.append("No outliers today. Lower --min-multiple or widen the watchlist.")
    if new_faces:
        L += ["", "## New faces (from hashtags, added to pending — vet, then promote to candidates)", ""]
        for u, b in new_faces[:10]:
            L.append(f"- @{u} — {b['p']:,} plays · {b['url']} · _{b['cap']}_")
    (out / "report.md").write_text("\n".join(L) + "\n")
    print("\n".join(L))


if __name__ == "__main__":
    main()
