#!/usr/bin/env python3
"""Join audit for transcript-driven speech cuts (Cooked or Cracked series).

Why: transcript word times drift. In Ep2 they were off by up to 0.3 s, and the
recognizer labelled "shop" as "uh", so striking the "uh" deleted "shop". Half a
"So" also rode at the end of "for me". Run this on every speech cut before
showing it to Henry, then do one unprimed verbatim listen of the --render file.

Input JSON (items in timeline order):
{
  "fps": 30,
  "sources": {"t1": "/path/henry-take1.MP4", "t2": "/path/henry-take2.MP4"},
  "items": [
    {"take": "t2", "in": 8.88, "frames": 109, "label": "hook"},
    {"spacer": 7},
    {"take": "t1", "in": 122.868, "frames": 199, "label": "found a shop"}
  ]
}
"in" is the source in-point in seconds. "frames" is the item length.
{"spacer": N} is a muted N-frame breath (silence in the render).

Output:
  JOINS   loudness at each cut point and the quietest point within 100 ms.
          "<<" means the cut sits inside speech: move it to the valley.
  GAPS    removed stretches under 1.5 s between two items of the same take
          that still contain speech (a mislabelled word).
  PAUSES  silence across each join. Under 0.15 s between two sentences sounds rushed.
  --render out.wav writes the cut's audio (16 kHz mono) for the listen.

Usage: python3 join_audit.py cut.json [--render cut.wav]
"""
import json, os, subprocess, sys, tempfile, wave
import numpy as np

SR = 16000


def load_audio(path, cache):
    if not path.lower().endswith(".wav"):
        out = os.path.join(cache, os.path.basename(path) + ".16k.wav")
        if not os.path.exists(out):
            subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-i", path,
                            "-vn", "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", out], check=True)
        path = out
    w = wave.open(path)
    assert w.getframerate() == SR and w.getnchannels() == 1, "need 16 kHz mono wav"
    return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768


def main():
    cfg = json.load(open(sys.argv[1]))
    render = sys.argv[sys.argv.index("--render") + 1] if "--render" in sys.argv else None
    fps = cfg.get("fps", 30)
    cache = tempfile.gettempdir()
    A = {k: load_audio(v, cache) for k, v in cfg["sources"].items()}

    floor = {}
    for k, a in A.items():
        fr = a[: len(a) // 160 * 160].reshape(-1, 160)
        floor[k] = np.percentile(20 * np.log10(np.sqrt((fr ** 2).mean(1)) + 1e-9), 10)
    thr = {k: f + 12 for k, f in floor.items()}  # speech threshold per take

    def db(k, t, win=0.02):
        a = A[k]; s = int((t - win / 2) * SR); e = int((t + win / 2) * SR)
        seg = a[max(0, s):max(0, e)]
        return 20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-9) if len(seg) else -120

    def valley(k, t0, t1):
        ts = np.arange(t0, t1, 0.005); ds = [db(k, t) for t in ts]; j = int(np.argmin(ds))
        return ts[j], ds[j]

    items = []
    for x in cfg["items"]:
        if "spacer" in x:
            items.append(dict(spacer=True, frames=x["spacer"]))
        else:
            items.append(dict(spacer=False, take=x["take"], tin=x["in"], tout=x["in"] + x["frames"] / fps,
                              frames=x["frames"], label=x.get("label", "")))

    print("JOINS  (dB at cut / quietest point within 100 ms)")
    for n, it in enumerate(items):
        if it["spacer"]:
            continue
        k, tin, tout, th = it["take"], it["tin"], it["tout"], thr[it["take"]]
        a_in, a_pre = db(k, tin), db(k, tin - 0.03)
        v_in, dv_in = valley(k, tin - 0.10, tin + 0.08)
        a_out, a_post = db(k, tout), db(k, tout + 0.03)
        v_out, dv_out = valley(k, tout - 0.10, tout + 0.10)
        f_in = (a_in > th or a_pre > th + 2) and a_in - dv_in > 6
        f_out = (a_out > th or a_post > th + 2) and a_out - dv_out > 6
        print(f"{n:3d} {k} IN {tin:8.3f} {a_in:6.1f}/{v_in:8.3f} {dv_in:6.1f} {'<<' if f_in else '  '}"
              f"  OUT {tout:8.3f} {a_out:6.1f}/{v_out:8.3f} {dv_out:6.1f} {'<<' if f_out else '  '}  {it['label']}")

    print("\nGAPS  (removed stretches under 1.5 s that still hold speech)")
    real = [it for it in items if not it["spacer"]]
    for a, b in zip(real, real[1:]):
        if a["take"] != b["take"]:
            continue
        g0, g1 = a["tout"], b["tin"]
        if 0 < g1 - g0 < 1.5:
            ms = sum(10 for t in np.arange(g0, g1, 0.01) if db(a["take"], t + 0.005, 0.01) > thr[a["take"]])
            if ms >= 60:
                print(f"  {a['take']} {g0:8.3f}-{g1:8.3f}: {ms} ms of speech removed  ({a['label']} -> {b['label']})")

    print("\nPAUSES  (silence across each join, seconds)")
    prev_tail = None
    for it in items:
        if it["spacer"]:
            prev_tail = (prev_tail or 0) + it["frames"] / fps
            continue
        k, th = it["take"], thr[it["take"]]
        t = it["tin"]
        while t < it["tout"] and db(k, t + 0.01) < th:
            t += 0.005
        head = t - it["tin"]
        if prev_tail is not None:
            flag = "  <- rushed?" if prev_tail + head < 0.15 else ""
            print(f"  {prev_tail + head:5.2f}  before '{it['label']}'{flag}")
        t = it["tout"]
        while t > it["tin"] and db(k, t - 0.01) < th:
            t -= 0.005
        prev_tail = it["tout"] - t

    if render:
        parts = []
        for it in items:
            n = int(round(it["frames"] / fps * SR))
            if it["spacer"]:
                parts.append(np.zeros(n, dtype=np.float32))
            else:
                s = int(round(it["tin"] * SR)); parts.append(A[it["take"]][s:s + n])
        y = (np.concatenate(parts) * 32767).clip(-32768, 32767).astype(np.int16)
        w = wave.open(render, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(y.tobytes()); w.close()
        print(f"\nrendered {render} ({len(y) / SR:.1f} s)")


if __name__ == "__main__":
    main()
