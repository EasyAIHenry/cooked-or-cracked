#!/usr/bin/env python3
"""Ep7 pass-1 speech cut from take 26.
Lines are (first_word_time, last_word_time, label) from transcripts/take26-words.json (Whisper medium).
Boundaries are refined on a 10 ms RMS envelope: start at the energy rise before the first word
(never before the previous word's end), end after the last word's decay plus a short tail.
Writes 01_scripts/cut-ep7-v1.json (segments in seconds) for the preview render and ChatCut placement.
"""
import json, wave, sys, numpy as np

EP = '/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep7_LinkedIn-Agent'
WAV = f'{EP}/04_raw-footage/transcripts/take26-16k.wav'
WORDS = json.load(open(f'{EP}/04_raw-footage/transcripts/take26-words.json'))

# (first word start, last word start, label, version) -- version 'full' lines also go in the short cut unless marked
LINES = [
    (11.18, 13.32, 'L01 hook: People have told me that I have a ghostwriter on LinkedIn.', 'both'),
    (14.00, 15.41, 'L01 hook: Honestly, it\'s just AI.', 'both'),
    (17.96, 23.63, 'L02 I ran a challenge in May ... 30 days straight, no fail, Monday to Friday.', 'both'),
    (26.80, 29.64, 'L03 So 36 posts in 30 days, Claude wrote them.', 'both'),
    (30.20, 32.11, 'L03 Buffer is the app that I\'m using, posted them.', 'both'),
    (32.52, 35.02, 'L03 And the research and manual work was still on me.', 'both'),
    (35.44, 40.48, 'L04 So what I paid was actually a Max plan for Claude and a one-year plan for Buffer', 'full'),
    (52.76, 61.38, 'L05 36 posts, 9600 impressions, a median of 134 per post against 217 for the rest of my year.', 'both'),
    (65.24, 68.29, 'L06 More posts didn\'t mean it reached more people.', 'both'),
    (71.27, 78.29, 'L07 This reel says free Claude skills run your whole LinkedIn inside your Claude plan and you won\'t get flagged.', 'both'),
    (79.12, 83.25, 'L07 Now it came out after my challenge, so I tested it.', 'full'),
    (94.55, 100.14, 'L08 Before you install anything, just a tip, just go on NVIDIA to clear the repos that you are actually doing.', 'both'),
    (100.60, 101.31, 'L08 It can get quite dangerous.', 'both'),
    (117.36, 121.70, 'L09 And this one\'s got 9 out of 100, which is kind of low risk', 'both'),
    (132.84, 136.53, 'L10 So the true test is, does it run on my LinkedIn?', 'full'),
    (138.08, 141.29, 'L10 It writes, but it doesn\'t really post.', 'both'),
    (144.19, 147.26, 'L11 I dropped a poster, a photo and a video of my next event.', 'both'),
    (151.91, 156.56, 'L12 Claude actually checked my old project files and then used Buffer to write it.', 'both'),
    (157.56, 159.27, 'L12 And totally it took about 10 minutes.', 'both'),
    (356.28, 359.92, 'L16 MID CTA: If you like what you see, comment GHOST and I\'ll send you my workflow.', 'both'),
    (164.62, 171.82, 'L13 But now with this prompt, it can be done entirely through Claude, as long as you have the right measures to connect to LinkedIn.', 'full'),
    (173.14, 179.59, 'L14 So always please check your third-party apps, if it\'s LinkedIn verified, you don\'t want to get kicked out of LinkedIn', 'both'),
    (252.18, 258.79, 'L15 The skills are free and my bills kind of never change, same Claude Max plan, same Buffer.', 'both'),
    (259.56, 263.98, 'L15 What changed this time is the research I did by hand, Claude now does from my files.', 'both'),
    (326.52, 329.34, 'L18 If you just started and don\'t really know what to do, use Buffer.', 'both'),
    (329.90, 333.40, 'L18 Only use Claude to do this if you\'re experienced and you\'re comfortable with it.', 'both'),
    (333.76, 335.43, 'L17 VERDICT: Overall the verdict is, this is cracked.', 'both'),
    (303.96, 307.05, 'L19 I\'m going to cancel my one year plan and start using this instead.', 'both'),
    (360.84, 364.38, 'L20 CTA: If you like what you see, comment GHOST and I\'ll send you my workflow.', 'both'),
]

w = wave.open(WAV); sr = w.getframerate()
x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
hop = int(sr * 0.01); m = len(x) // hop
e = 20 * np.log10(np.sqrt((x[:m * hop].reshape(m, hop) ** 2).mean(1) + 1e-12) + 1e-9)
floor = np.percentile(e, 10); thr = max(floor + 8, -45.0)

def word_at(t):
    return min(WORDS, key=lambda w: abs(w[0] - t))

def prev_end(t):
    ends = [b for a, b, _ in WORDS if a < t - 0.05]
    return max(ends) if ends else 0.0

def next_start(t):
    s = [a for a, b, _ in WORDS if a > t + 0.05]
    return min(s) if s else len(e) / 100

def onset(t):
    i = int(t * 100); lo = max(0, int(prev_end(t) * 100) - 5, i - 40)
    seg = e[lo:i + 15]; idx = np.where(seg > thr)[0]
    j = lo + idx[0] if len(idx) else i
    while j > lo and e[j - 1] > floor + 5: j -= 1
    return max(lo, j - 6) / 100          # 60 ms lead-in

def offset(t_start_last, t_end_last):
    i = int(t_end_last * 100); hi = min(len(e) - 1, int(next_start(t_start_last) * 100) - 4, i + 80)
    seg = e[i:hi]; idx = np.where(seg > thr)[0]
    j = i + idx[-1] if len(idx) else i
    return min(hi, j + 12) / 100         # 120 ms tail

segs = []
for a, b, label, ver in LINES:
    wa = word_at(a); wb = word_at(b)
    s = onset(wa[0]); t = offset(wb[0], wb[1])
    segs.append({'in': round(s, 3), 'out': round(t, 3), 'dur': round(t - s, 3), 'label': label, 'version': ver})

# Hand fixes from the pass-1 Whisper QA (4 Oct 2026): clipped 'th' of 'thirty', late 'this reel', tail leaking the next 'Comment'.
OVERRIDES = {'L05': ('in', 52.45), 'L07 This reel': ('in', 70.60), 'L19': ('out', 307.35), 'L14': ('out', 179.86)}
for s in segs:
    for k, (f, v) in OVERRIDES.items():
        if s['label'].startswith(k):
            s[f] = v; s['dur'] = round(s['out'] - s['in'], 3)

full = sum(s['dur'] for s in segs); short = sum(s['dur'] for s in segs if s['version'] == 'both')
json.dump({'take': 'DJI_20261004182152_0026_D.MP4', 'segments': segs}, open(f'{EP}/01_scripts/cut-ep7-v1.json', 'w'), indent=1)
for s in segs: print(f"{s['in']:8.2f} {s['out']:8.2f} {s['dur']:5.2f}  {s['version']:4}  {s['label']}")
print(f'full speech {full:.1f} s ({len(segs)} segs), short {short:.1f} s; floor {floor:.1f} dB thr {thr:.1f}')
