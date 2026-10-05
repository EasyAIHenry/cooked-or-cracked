#!/usr/bin/env python3
"""Level the Adobe-enhanced take26 voice (4 Oct 2026).
Adobe leaves the first ~33 s of the take 5-11 dB low; SPANS lift those lines (source seconds, dB).
EXTRA (v5, Henry: "a bit of small dip when I announced that I did a challenge in May") adds on top of SPANS:
"challenge in May and" sits 9-14 dB under "ran" on the camera mic, and still 3-5 dB under after SPANS.
Float pipeline, 40 ms gain smoothing, then alimiter (latency=1 so it adds no delay).
Usage: python3 level_adobe_ep7.py [out.wav]   (lev2 = challenge lift only; lev3 = + "it's just AI" lift)"""
import subprocess, sys, numpy as np
D = '/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep7_LinkedIn-Agent/04_raw-footage/adobe-enhance'
OUT = sys.argv[1] if len(sys.argv) > 1 else 'take26-adobe-eq-lev2.wav'
sr = 48000
SPANS = [(10.9, 13.8, 10.8), (14.2, 15.8, 5.9), (17.9, 19.75, 5.6), (19.85, 22.6, 5.1), (22.8, 24.0, 4.6), (26.6, 32.3, 1.8)]
EXTRA = [(18.30, 19.62, 3.5),
         (14.84, 15.12, 3.0),     # v8: "it's just" (Gemini review: "AI" trails off)
         (15.12, 15.68, 6.0)]     # v8: "AI" sat 6-9 dB under the line (-16..-27 vs -12 dB)
raw = subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-i', f'{D}/take26-adobe-eq.wav', '-f', 'f32le', '-ac', '1', '-ar', str(sr), '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, '<f4').copy()
g = np.zeros(len(x), dtype=np.float32)
for a, b, db in SPANS: g[int(a * sr):int(b * sr)] = db
for a, b, db in EXTRA: g[int(a * sr):int(b * sr)] += db
k = int(0.04 * sr); g = np.convolve(g, np.ones(k) / k, mode='same')
tmp = f'{D}/.lev.f32'
(x * (10 ** (g / 20))).astype('<f4').tofile(tmp)
subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '1', '-i', tmp,
                '-af', 'alimiter=limit=0.891:attack=2:release=50:level=disabled:latency=1', '-c:a', 'pcm_s16le', f'{D}/{OUT}'], check=True)
subprocess.run(['rm', '-f', tmp])
print('wrote', f'{D}/{OUT}')
