#!/usr/bin/env python3
"""Ep9 pass-1 speech cut: pick lines from the take, snap each join to the quiet between words, write the
cut list (with every kept word re-timed onto the cut timeline) and render the SDR, un-mirrored 1080x1920 cut.

Usage: python3 build_cut_ep9.py [--render]
"""
import json, os, subprocess, sys
import numpy as np

EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TAKE = f"{EP}/04_raw-footage/take/DJI_20261009165934_0001_D.MP4"
WORDS = json.load(open(f"{EP}/04_raw-footage/transcripts/take01-words.json"))
OUT = f"{EP}/05_cuts/pass1"
MIC_LAG = 0.047          # audio track a:1 runs 47 ms behind the picture (cross-correlated against a:0)
GAP = 0.20               # breath kept between lines

# (id, source in, source out, text) - in/out are the first word's start and the last word's end from Whisper
LINES = [
    ("R01", 0.00, 4.25, "[the reel plays: I used to pay ManyChat 60 bucks a month to DM people a link when they commented a word.]"),
    ("H02", 27.88, 39.44, "I'm gonna give you guys free ManyChat. Hear me out, free ManyChat. I have cracked the code itself. So if you were to download the repo, you're not gonna be able to install everything. He has made it very clear. Shout out to him."),
    ("H05", 39.44, 42.88, "But what I've done is I have a step-by-step guide."),
    ("HOLD", 309.00, 311.60, "[sting: silent smile to camera]"),
    ("H07", 46.82, 48.15, "instant crack, bang."),
    ("H08", 51.68, 56.96, "Comment down below chat and you can have my whole workflow. Within 30 minutes, you're gonna get it done."),
    ("S00", 95.84, 101.88, "Will Meta ban you? No, it uses Meta's own API, same as ManyChat itself."),
    ("S01", 119.93, 122.56, "Step one, scan the code that I have for you guys."),
    ("S02", 132.44, 136.24, "Step two, make it your own private copy on GitHub."),
    ("S03", 146.74, 149.60, "Step three, Neon, it's a free database."),
    ("S04", 154.04, 162.30, "Step four, Redis, a free waiting line. Instagram allows 750 DMs an hour. The rest actually wait for their turn."),
    ("S05", 164.76, 168.36, "Step five, Resend, it emails you a login link."),
    ("S06", 171.20, 175.98, "Step six, Netlify, it puts your dashboard online for free."),
    ("S07", 220.56, 228.28, "Step seven, the Meta app, everything connects to it. Tick all four permissions, you add yourself as a tester, and then publish."),
    ("S08", 237.58, 247.00, "Step eight, now this is where we have a thing called the worker. So we put the worker on a free Google server, it sends the DM for you every day."),
    ("S09", 252.62, 256.74, "What's crazy is that all these steps above are free."),
    ("S10", 292.88, 294.04, "You just need to have Claude."),
    ("C01", 321.28, 323.42, "Comment chat and I'll send you my guide."),
]
# Joins inside one sentence get a shorter gap than a new line.
TIGHT = set()
# Out-points set by hand from the energy plot (Whisper's word end was early)
NOSNAP_OUT = {"S04"}


def load_env():
    wav = f"{EP}/04_raw-footage/transcripts/take01-a1-16k.wav"
    if not os.path.exists(wav):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", TAKE, "-map", "0:a:1", "-ac", "1", "-ar", "16000", wav], check=True)
    import wave
    w = wave.open(wav); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    hop = 160  # 10 ms
    n = len(a) // hop
    rms = np.sqrt((a[: n * hop].reshape(n, hop) ** 2).mean(1) + 1e-12)
    return 20 * np.log10(rms)


ENV = load_env()


def db_at(t):  # picture time -> mic envelope
    i = int(round((t + MIC_LAG) * 100))
    return ENV[max(0, min(i, len(ENV) - 1))]


def prev_word_end(t):
    ends = [we for ws, we, x in WORDS if we <= t + 0.005]
    return max(ends) if ends else 0.0


def next_word_start(t):
    starts = [ws for ws, we, x in WORDS if ws >= t - 0.005]
    return min(starts) if starts else 1e9


def snap_in(t):
    """Move the in-point back to the quietest 10 ms in the 300 ms before the word (never into the previous word),
    so plosives stay whole."""
    lo = prev_word_end(t)
    cands = [t - k / 100 for k in range(0, 31) if t - k / 100 >= lo]
    floor = min(db_at(c) for c in cands)
    quiet = [c for c in cands if db_at(c) <= floor + 3]
    return max(0.0, max(quiet) - 0.02)


def snap_out(t):
    """Move the out-point forward to the first quiet 10 ms in the 300 ms after the word, so tails stay whole."""
    hi = next_word_start(t)
    cands = [t + k / 100 for k in range(0, 31) if t + k / 100 <= hi - 0.02]
    if not cands:
        return t
    floor = min(db_at(c) for c in cands)
    return min(c for c in cands if db_at(c) <= floor + 3) + 0.02


def build():
    segs, t = [], 0.0
    for i, (lid, a, b, text) in enumerate(LINES):
        sa, sb = (a, b) if lid in ("HOLD", "R01") else (snap_in(a), b) if lid in NOSNAP_OUT else (snap_in(a), snap_out(b))
        if segs:
            t += 0.06 if lid in TIGHT else GAP
        dur = sb - sa
        words = [] if lid in ("HOLD", "R01") else [{"w": x, "t": round(t + (ws - sa), 3), "e": round(t + (we - sa), 3)}
                 for ws, we, x in WORDS if ws >= sa - 0.01 and we <= sb + 0.05]
        segs.append({"id": lid, "src_in": round(sa, 3), "src_out": round(sb, 3), "start": round(t, 3),
                     "end": round(t + dur, 3), "text": text, "words": words})
        t += dur
    return segs, t


def render(segs, total):
    os.makedirs(OUT, exist_ok=True)
    vf, af, n = [], [], len(segs)
    for i, s in enumerate(segs):
        d = s["src_out"] - s["src_in"]
        pad = 0 if i == n - 1 else round(segs[i + 1]["start"] - s["end"], 3)
        vf.append(f"[0:v]trim={s['src_in']}:{s['src_out'] + pad},setpts=PTS-STARTPTS[v{i}]")
        af.append(f"[0:a:1]atrim={s['src_in'] + MIC_LAG}:{s['src_out'] + MIC_LAG},asetpts=PTS-STARTPTS,"
                  f"afade=t=in:d=0.01,afade=t=out:st={d - 0.012:.3f}:d=0.012{',volume=0' if s['id'] in ('HOLD', 'R01') else ''},apad=pad_dur={pad}[a{i}]")
    fc = ";".join(vf + af) + ";" + "".join(f"[v{i}][a{i}]" for i in range(n)) + f"concat=n={n}:v=1:a=1[vc][ac];" \
        "[vc]scale_vt=w=1080:h=1920:color_matrix=bt709:color_primaries=bt709:color_transfer=bt709,hwdownload," \
        "format=p010le,format=yuv420p,fps=30[vo]"
    out = f"{OUT}/henry-cut-v3.mp4"
    cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-hwaccel", "videotoolbox",
           "-hwaccel_output_format", "videotoolbox_vld", "-i", TAKE, "-filter_complex", fc,
           "-map", "[vo]", "-map", "[ac]", "-c:v", "h264_videotoolbox", "-b:v", "16M",
           "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
           "-c:a", "pcm_s16le", "-ar", "48000", out.replace(".mp4", ".mov")]
    subprocess.run(cmd, check=True)
    return out.replace(".mp4", ".mov")


if __name__ == "__main__":
    segs, total = build()
    json.dump({"total": round(total, 3), "segments": segs}, open(f"{EP}/01_scripts/cut-ep9-v3.json", "w"), indent=1)
    for s in segs:
        print(f"{s['start']:6.2f}-{s['end']:6.2f} [{s['src_in']:7.2f}-{s['src_out']:7.2f}] {s['id']:5} {s['text']}")
    print(f"TOTAL {total:.2f} s")
    if "--render" in sys.argv:
        print(render(segs, total))
