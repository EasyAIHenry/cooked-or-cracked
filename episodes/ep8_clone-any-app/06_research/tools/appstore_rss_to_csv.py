#!/usr/bin/env python3
"""Apple customer-reviews RSS (JSON) -> reviews.csv for replica-entrepreneur. Stdlib only.
usage: appstore_rss_to_csv.py <app_id> <out.csv> [pages=1..10] [country=us]"""
import csv, json, sys, urllib.request
app, out = sys.argv[1], sys.argv[2]
pages = int(sys.argv[3]) if len(sys.argv) > 3 else 1
country = sys.argv[4] if len(sys.argv) > 4 else "us"
rows = []
for page in range(1, pages + 1):
    url = f"https://itunes.apple.com/{country}/rss/customerreviews/page={page}/id={app}/sortBy=mostRecent/json"
    with urllib.request.urlopen(url, timeout=30) as r: feed = json.load(r)["feed"]
    for e in feed.get("entry", []):
        if "im:rating" not in e: continue
        link = next((l["attributes"]["href"] for l in e.get("link", []) if isinstance(l, dict) and l.get("attributes", {}).get("rel") == "related"), f"https://apps.apple.com/{country}/app/id{app}?see-all=reviews")
        rows.append({"source": "App Store", "url": link, "date": (e.get("updated", {}).get("label") or "")[:10], "rating": e["im:rating"]["label"], "text": (e["title"]["label"] + ". " + e["content"]["label"]).replace("\n", " ").strip()})
with open(out, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["source", "url", "date", "rating", "text"]); w.writeheader(); w.writerows(rows)
print(f"{len(rows)} reviews -> {out}; distinct urls {len({r['url'] for r in rows})}")
