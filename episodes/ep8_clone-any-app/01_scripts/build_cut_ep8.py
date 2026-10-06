#!/usr/bin/env python3
"""Ep8 pass-1 speech cut from part1.MP4 (review) and part2.MP4 (CTA).
Lines are (take, first_word_time, last_word_time, label). Word times from transcripts/<take>-words.json (Whisper medium).
Boundaries refined on a 10 ms RMS envelope of the lav track: start at the energy rise before the first word
(never before the previous word's end), end after the last word's decay plus a short tail.
Writes 01_scripts/cut-ep8-v2.json and renders 05_cuts/pass1/cut-ep8-v2-audio.wav for QA.
"""
import json, wave, subprocess, numpy as np, os, re
EP = '/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep8_Clone-Any-App'
T = f'{EP}/04_raw-footage/transcripts'

LINES = [
    ('part1', 'abs', 32.45, 36.20, 'H00 HOOK (reel audio on his phone): You can now clone any app with Claude, so you never have to pay for a subscription again.'),
    ('part1', 42.62, 'try', 45.6, 'L01 Well, not sure if you can clone every app, but let\'s try.'),
    # dropped 7 Oct (Henry): legal line and Spotify example
    # ('part1', 'abs', 52.90, 57.35, 'L02 If you can clone any app, you\'re just gonna run into some legal issue.'),
    # ('part1', 57.90, 'Spotify', 61.8, 'L03 So let\'s give it for example Spotify. You can\'t clone Spotify.'),
    ('part1', 99.22, 'Buffer', 103.1, 'L04 So today I\'m gonna clone two apps. One is Loom and another is Buffer.'),
    ('part1', 'abs', 177.60, 186.70, 'L05 While there\'s 11 different types of skill sets, I wanted to put to the test whether it works or not. So as you can see, I\'ve actually installed Loom over here.'),
    ('part1', 'abs', 186.72, 197.05, 'L06 It is interesting because I can actually start to screen record my screen and when I\'m done, I can share it with anyone that I want to.'),
    ('part1', 'abs', 233.75, 238.35, 'L07 Now I actually clone Buffer and it\'s actually called Slotline.'),
    ('part1', 306.93, 'Buffer', 308.5, 'L08 But it does look like Buffer.'),
    ('part1', 405.52, 'allowed', 414.5, 'L09 You\'re going to find it as a hassle to connect your Instagram to this. Let\'s not talk about Instagram banning third-party apps that are not even allowed.'),
    ('part1', 415.22, 'that', 417.1, 'L10 So Meta is actually very strict on that.'),
    ('part1', 386.90, 'data', 397.8, 'L11 VERDICT: Overall, I think this is cooked, so it is not going to work if you are going to rely on the internet to actually do streaming or any storage of any cloud data.'),
    ('part1', 376.26, 'itself', 382.4, 'L12 Not everything is needed to be on cloud, I think some things are great if you install it in your local drive itself.'),
    ('part2', 144.00, 'workflow', 153.1, 'L13 CTA: While this is cooked, I\'ve actually created 10 more apps that you can use without the internet and without cloud storage. Comment down below Clone and I\'ll send you my workflow.'),
]

env = {}
for take in ('part1', 'part2'):
    w = wave.open(f'{T}/{take}-16k.wav'); sr = w.getframerate()
    x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    hop = int(sr * 0.01); m = len(x) // hop
    e = 20 * np.log10(np.sqrt((x[:m * hop].reshape(m, hop) ** 2).mean(1) + 1e-12) + 1e-9)
    floor = np.percentile(e, 10); thr = max(floor + 8, -45.0)
    env[take] = (e, floor, thr, json.load(open(f'{T}/{take}-words.json')))

import tempfile
def norm(t): return re.sub(r'[^A-Za-z0-9]', '', t).lower()
def local_words(take, a, b):
    # Whisper on a short window: word times inside it are accurate; the full-take pass drifts by seconds in places.
    w0 = max(0, a - 2.0); w1 = b + 4.0
    tmp = tempfile.mkdtemp(); wav = f'{tmp}/w.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(w0), '-t', str(w1 - w0), '-i', f'{T}/{take}-16k.wav', wav], check=True)
    subprocess.run(['whisper-cli', '-m', os.path.expanduser('~/.cache/hyperframes/whisper/models/ggml-medium.en.bin'), '-f', wav, '-oj', '-ojf', '-of', f'{tmp}/w', '-l', 'en', '-t', '8'], check=True, capture_output=True)
    d = json.load(open(f'{tmp}/w.json')); words = []
    for seg in d['transcription']:
        cur = None
        for t in seg.get('tokens', []):
            txt = t['text']
            if txt.startswith('[_'): continue
            s_ = w0 + t['offsets']['from'] / 1000; e_ = w0 + t['offsets']['to'] / 1000
            if txt.startswith(' ') or cur is None:
                if cur: words.append(cur)
                cur = [s_, e_, txt.strip()]
            else: cur[1] = e_; cur[2] += txt
        if cur: words.append(cur)
    return [w for w in words if w[2]]

def refine(take, a, last_text, b):
    e, floor, thr, Wfull = env[take]
    W = local_words(take, a, b)
    first_text = norm(min(Wfull, key=lambda w: abs(w[0] - a))[2])
    fc = [w for w in W if norm(w[2]) == first_text and abs(w[0] - a) < 3.0]
    wa = min(fc, key=lambda w: abs(w[0] - a)) if fc else min(W, key=lambda w: abs(w[0] - a))
    cands = [w for w in W if norm(w[2]) == last_text.lower() and abs(w[0] - b) < 4.0]
    wb = min(cands, key=lambda w: abs(w[0] - b)) if cands else min(W, key=lambda w: abs(w[0] - b))
    ends = [y for x_, y, _ in W if x_ < wa[0] - 0.05]; pe = max(ends) if ends else 0.0
    i = int(wa[0] * 100); lo = max(0, int(pe * 100) - 5, i - 40)
    seg = e[lo:i + 15]; idx = np.where(seg > thr)[0]; j = lo + idx[0] if len(idx) else i
    while j > lo and e[j - 1] > floor + 5: j -= 1
    s = max(lo, j - 6) / 100
    starts = [x_ for x_, y, _ in W if x_ > wb[0] + 0.05]; ns = min(starts) if starts else len(e) / 100
    i2 = int(wb[1] * 100); hi = min(len(e) - 1, int(ns * 100) - 4, i2 + 80)
    seg = e[i2:hi]; idx = np.where(seg > thr)[0]; j2 = i2 + idx[-1] if len(idx) else i2
    t = min(hi, j2 + 12) / 100
    return round(s, 3), round(t, 3), wa[2], wb[2]

def squeeze(take, s, t):
    # cut silences >= 0.35 s inside the line down to 0.20 s (floor+6 dB, keep 0.10 s either side)
    e, floor, thr, W = env[take]
    i0, i1 = int(s * 100), int(t * 100); quiet = e[i0:i1] < floor + 6
    pieces, cur, k = [], i0, i0
    while k < i1:
        if quiet[k - i0]:
            j = k
            while j < i1 and quiet[j - i0]: j += 1
            if (j - k) >= 35 and k > i0 and j < i1:
                pieces.append((cur / 100, (k + 10) / 100)); cur = j - 10
            k = j
        else: k += 1
    pieces.append((cur / 100, t))
    return [(round(a, 3), round(b, 3)) for a, b in pieces if b - a > 0.05]

segs = []
for take, a, last_text, b, label in LINES:
    if a == 'abs': s, t, fw, lw = float(last_text), float(b), 'abs', 'abs'
    else: s, t, fw, lw = refine(take, a, last_text, b)
    pieces = squeeze(take, s, t)
    segs.append({'take': take, 'in': s, 'out': t, 'dur': round(sum(y - x for x, y in pieces), 3), 'raw_dur': round(t - s, 3), 'pieces': pieces, 'label': label, 'first': fw, 'last': lw})
OVERRIDES = {'L12': ('in', -0.10), 'L09': ('in', +0.03), 'L11': ('in', 'abs386.72'), 'L13': ('in', 'abs143.88'), 'L10': ('in', 'abs415.08')}
for sg in segs:
    for k, (f, dv) in OVERRIDES.items():
        if sg['label'].startswith(k):
            v = round(float(dv[3:]) if isinstance(dv, str) else sg[f] + dv, 3)
            sg[f] = v
            if f == 'in':
                sg['pieces'] = [(max(x, v), y) for x, y in sg['pieces'] if y > v + 0.05]
            else:
                sg['pieces'] = [(x, min(y, v)) for x, y in sg['pieces'] if x < v - 0.05]
            sg['dur'] = round(sum(y - x for x, y in sg['pieces']), 3)
json.dump({'segments': segs}, open(f'{EP}/01_scripts/cut-ep8-v2.json', 'w'), indent=1)
for s in segs: print(f"{s['take']} {s['in']:8.2f} {s['out']:8.2f} {s['dur']:5.2f} (raw {s['raw_dur']:5.2f}, {len(s['pieces'])} pcs)  [{s['first']} .. {s['last']}]  {s['label'][:60]}")
print(f"speech total {sum(s['dur'] for s in segs):.1f} s in {len(segs)} segments")

# preview audio: lav track, 0.3 s of real silence between lines
os.makedirs(f'{EP}/05_cuts/pass1', exist_ok=True)
import glob
for f_ in glob.glob(f'{EP}/05_cuts/pass1/seg*.wav'): os.remove(f_)   # stale pieces from earlier runs got concatenated once
parts = []
for k, s in enumerate(segs):
    for q, (x, y) in enumerate(s['pieces']):
        out = f'{EP}/05_cuts/pass1/seg{k:02d}_{q}.wav'
        pad = 'apad=pad_dur=0.3' if q == len(s['pieces']) - 1 else 'anull'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(x), '-t', str(round(y - x, 3)), '-i', f"{T}/{s['take']}.wav", '-af', pad, out], check=True)
        parts.append(out)
with open(f'{EP}/05_cuts/pass1/concat.txt', 'w') as f:
    for p in parts: f.write(f"file '{p}'\n")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{EP}/05_cuts/pass1/concat.txt', f'{EP}/05_cuts/pass1/cut-ep8-v2-audio.wav'], check=True)
print('preview:', f'{EP}/05_cuts/pass1/cut-ep8-v2-audio.wav')
