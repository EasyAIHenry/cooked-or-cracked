#!/usr/bin/env python3
"""Check that an Adobe-enhanced file lines up with the original, and measure what it changed.

usage: align_check.py <original video/audio> <enhanced mp3/wav> [--wav out.wav]

Prints the offset (ms) at four points, the speech RMS and the noise floor before and after.
Offsets should be 0 +/- 1 ms; if they are not, do not swap the audio in, report it.
--wav writes a 48 kHz mono 24-bit WAV of the enhanced file for the editor.
"""
import subprocess, sys, tempfile, os, wave
import numpy as np

SR = 16000

def to16k(path, tmp):
    out = os.path.join(tmp, os.path.basename(path) + ".16k.wav")
    subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-i", path, "-vn", "-ac", "1",
                    "-ar", str(SR), "-c:a", "pcm_s16le", out], check=True)
    w = wave.open(out)
    return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768

def db(x):
    return 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-9)

def main():
    orig, enh = sys.argv[1], sys.argv[2]
    tmp = tempfile.mkdtemp()
    o, e = to16k(orig, tmp), to16k(enh, tmp)
    n = min(len(o), len(e))
    print(f"length original {len(o)/SR:.2f}s, enhanced {len(e)/SR:.2f}s")
    # frame energy to find speech and quiet stretches
    fr = o[: n // 400 * 400].reshape(-1, 400)
    en = 20 * np.log10(np.sqrt((fr ** 2).mean(1)) + 1e-9)
    loud = np.argsort(en)[::-1]
    points = sorted(set(int(i * 400 / SR) for i in loud[:4000:1000]))[:4] or [1]
    worst = 0
    for t in points:
        t = max(0.4, min(t, n / SR - 3.5))
        a = e[int(t * SR):int((t + 3) * SR)]
        b = o[int((t - 0.3) * SR):int((t + 3.3) * SR)]
        a = (a - a.mean()) / (a.std() + 1e-9); b = (b - b.mean()) / (b.std() + 1e-9)
        c = np.correlate(b, a, mode="valid"); k = int(np.argmax(c))
        off = (k / SR - 0.3) * 1000; worst = max(worst, abs(off))
        print(f"  t={t:7.2f}s offset {off:+6.1f} ms  match {c[k]/len(a):.2f}")
    speech = en > np.percentile(en, 70); quiet = en < np.percentile(en, 15)
    def band(x, mask):
        f = x[: n // 400 * 400].reshape(-1, 400)[mask[: n // 400]]
        return db(f.ravel()) if f.size else float("nan")
    print(f"speech RMS  original {band(o, speech):6.1f} dB  enhanced {band(e, speech):6.1f} dB")
    print(f"noise floor original {band(o, quiet):6.1f} dB  enhanced {band(e, quiet):6.1f} dB")
    print("ALIGNED" if worst <= 2 else "NOT ALIGNED: do not swap in, report the offsets")
    if "--wav" in sys.argv:
        out = sys.argv[sys.argv.index("--wav") + 1]
        subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-i", enh, "-ac", "1",
                        "-ar", "48000", "-c:a", "pcm_s24le", out], check=True)
        print(f"wrote {out}")

if __name__ == "__main__":
    main()
