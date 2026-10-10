#!/usr/bin/env python3
"""Ep9 voice: level every line to the same speech loudness, then the series chain (presence EQ, 2:1 comp,
limiter). Writes 02_graphics/remotion/public/voice.wav (the picture is muted in Remotion; this is the voice bed).
Usage: python3 voice_ep9.py <cut json> <cut mov>
"""
import json, subprocess, sys, wave
import numpy as np

EP = "/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep9_OpenReply"
cut = json.load(open(sys.argv[1]))
mov = sys.argv[2]
tmp = f"{EP}/05_cuts/pass1/voice-raw.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", mov, "-vn", "-ac", "1", "-ar", "48000", tmp], check=True)
w = wave.open(tmp); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
sr = 48000


def speech_db(t0, t1):
    x = a[int(t0 * sr): int(t1 * sr)]
    if len(x) < sr // 10:
        return None
    hop = sr // 100
    n = len(x) // hop
    r = np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(1) + 1e-12)
    loud = np.sort(r)[int(n * 0.5):]          # the voiced half of the line
    return 20 * np.log10(loud.mean())


# Level per sentence (a long take can hold a mumbled line next to a loud one)
chunks = []
for s in cut["segments"]:
    if s["id"] in ("HOLD", "R01") or not s["words"]:
        continue
    cur = [s["words"][0]]
    for w0 in s["words"][1:]:
        if cur[-1]["w"].rstrip().endswith((".", "?", "!")):
            chunks.append((s["id"], cur)); cur = []
        cur.append(w0)
    chunks.append((s["id"], cur))
# Each sentence's gain window runs to the midpoint of the pause before and after it (windows never overlap)
bounds = []
for i, (sid, ws) in enumerate(chunks):
    a0 = ws[0]["t"] - 0.15 if i == 0 else (chunks[i - 1][1][-1]["e"] + ws[0]["t"]) / 2
    b0 = ws[-1]["e"] + 0.15 if i == len(chunks) - 1 else (ws[-1]["e"] + chunks[i + 1][1][0]["t"]) / 2
    seg = next(x for x in cut["segments"] if x["id"] == sid)
    bounds.append((sid, max(a0, seg["start"]), min(b0, seg["end"])))
levels = [(sid, a0, b0, speech_db(a0, b0)) for sid, a0, b0 in bounds]
target = float(np.median([l for *_, l in levels if l is not None]))
gains = []
for sid, a0, b0, l in levels:
    if l is None:
        continue
    g = max(-6.0, min(8.0, target - l))
    gains.append((a0, b0, g))
    print(f"{sid:5} {a0:6.2f}-{b0:6.2f} {l:6.1f} dB  gain {g:+.1f}")
vol = ",".join(f"volume=enable='between(t,{a0:.3f},{b0:.3f})':volume={g:+.2f}dB" for a0, b0, g in gains)
chain = (vol + ",highpass=f=80,afftdn=nr=10:nf=-42:tn=1,equalizer=f=250:t=q:w=1:g=-2,equalizer=f=3200:t=q:w=1:g=3.5,highshelf=f=5000:g=3,"
         "acompressor=threshold=-22dB:ratio=2.5:attack=8:release=120:makeup=2,"
         "agate=threshold=0.012:ratio=1.6:range=0.35:attack=4:release=180")
out = f"{EP}/02_graphics/remotion/public/voice.wav"
# Static gain to -16 LUFS (single-pass loudnorm ramps up over the first seconds and left the opening quiet)
mid = f"{EP}/05_cuts/pass1/voice-chain.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", chain, "-ar", "48000", mid], check=True)
r = subprocess.run(["ffmpeg", "-nostats", "-i", mid, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
I = float([l for l in r.splitlines() if l.strip().startswith("I:")][-1].split()[1])
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", mid, "-af", f"volume={-16 - I:.2f}dB,alimiter=limit=0.89", "-ar", "48000", "-ac", "2", out], check=True)
print("chain I", I)
print("target", round(target, 1), "->", out)
