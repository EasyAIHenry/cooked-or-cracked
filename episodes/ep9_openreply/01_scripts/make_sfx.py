#!/usr/bin/env python3
"""Synthesised SFX for Ep9 (no library licences): swoosh, thud, chime, coin, tick, powerdown. 48 kHz mono WAV."""
import numpy as np, wave, os, sys
SR = 48000
OUT = sys.argv[1]
rng = np.random.default_rng(7)

def save(name, x):
    x = x / (np.abs(x).max() + 1e-9) * 0.9
    w = wave.open(os.path.join(OUT, name + ".wav"), "w"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()

def env(n, a, d):  # attack/decay in samples
    e = np.ones(n); e[:a] = np.linspace(0, 1, a); e[-d:] *= np.linspace(1, 0, d) ** 2; return e

def lp(x, k):  # one-pole low-pass, k in 0..1 (array or scalar)
    y = np.zeros_like(x); s = 0.0; k = np.broadcast_to(k, x.shape)
    for i in range(len(x)):
        s += k[i] * (x[i] - s); y[i] = s
    return y

# swoosh: noise through a sweeping low-pass, 0.35 s
n = int(0.35 * SR); t = np.linspace(0, 1, n)
sw = lp(rng.standard_normal(n), 0.02 + 0.25 * np.sin(np.pi * t) ** 2) * np.sin(np.pi * t) ** 1.5
save("swoosh", sw)
# thud: pitch-dropping sine + short noise click, 0.25 s
n = int(0.25 * SR); t = np.arange(n) / SR
f = 120 * np.exp(-t * 18) + 45
th = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 16)
th[: int(0.006 * SR)] += rng.standard_normal(int(0.006 * SR)) * 0.6
save("thud", th)
# chime: two soft bell tones (DM notification), 0.5 s
n = int(0.5 * SR); t = np.arange(n) / SR
def bell(fr, t0):
    tt = np.clip(t - t0, 0, None); on = (t >= t0)
    return on * (np.sin(2 * np.pi * fr * tt) + 0.3 * np.sin(2 * np.pi * fr * 2.01 * tt)) * np.exp(-tt * 9)
save("chime", bell(1318.5, 0) + bell(1760, 0.09))
# coin: bright blip, 0.18 s
n = int(0.18 * SR); t = np.arange(n) / SR
co = np.sin(2 * np.pi * np.where(t < 0.05, 988, 1319) * t) * np.exp(-t * 18) * env(n, 40, 2000)
save("coin", co)
# tick: tiny click, 0.03 s
n = int(0.03 * SR); t = np.arange(n) / SR
save("tick", (rng.standard_normal(n) * 0.5 + np.sin(2 * np.pi * 3000 * t)) * np.exp(-t * 300))
# powerdown: falling tone + soft noise, 0.6 s
n = int(0.6 * SR); t = np.arange(n) / SR
f = 700 * np.exp(-t * 4.5) + 60
pdn = (np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.8 + lp(rng.standard_normal(n), 0.05) * 0.3) * env(n, 200, int(0.3 * SR))
save("powerdown", pdn)
print("ok")
