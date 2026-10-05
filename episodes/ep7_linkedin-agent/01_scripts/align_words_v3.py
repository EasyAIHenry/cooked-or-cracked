#!/usr/bin/env python3
"""Caption words for cut v3: the TEXT comes from the full-take Whisper (take26-words.json, per line span, so it has context),
the TIMES come from a DTW word pass on the rendered cut audio (05_cuts/v2-qa/words-v3.json), matched with difflib.
Unmatched words are interpolated between their matched neighbours. Output: words-v3-aligned.json = [[cut_s, word, base], ...]."""
import json, re, difflib, importlib.util, os
EP = '/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep7_LinkedIn-Agent'
src = open(os.environ.get('RUNCUT','run_cut_ep7_v3.py')).read()
LINES = eval(src[src.index('LINES = [') + 8: src.index(']\n# hand fixes') + 1])
W = json.load(open(f'{EP}/04_raw-footage/transcripts/take26-words.json'))
exp = []
for ws0, we0, label, join in LINES:
    base = label.split(' ')[0]
    for a, b, w in W:
        if ws0 - 0.05 <= a <= we0 + 0.01: exp.append([None, w, base])
hyp = [(x['offsets']['from'] / 1000, x['text'].strip()) for x in json.load(open(os.environ.get('HYP', f'{EP}/05_cuts/v2-qa/words-v3.json')))['transcription'] if x['text'].strip()]
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
sm = difflib.SequenceMatcher(None, [norm(w) for _, w, _ in exp], [norm(w) for _, w in hyp], autojunk=False)
for i, j, n in sm.get_matching_blocks():
    for k in range(n): exp[i + k][0] = hyp[j + k][0]
# interpolate the gaps
known = [k for k, e in enumerate(exp) if e[0] is not None]
for k, e in enumerate(exp):
    if e[0] is None:
        lo = max([q for q in known if q < k], default=None); hi = min([q for q in known if q > k], default=None)
        if lo is None: e[0] = exp[hi][0] - 0.2 * (hi - k)
        elif hi is None: e[0] = exp[lo][0] + 0.25 * (k - lo)
        else: e[0] = exp[lo][0] + (exp[hi][0] - exp[lo][0]) * (k - lo) / (hi - lo)
        e.append('interp')
json.dump(exp, open(os.environ.get('OUT','words-v3-aligned.json'), 'w'), indent=0)
matched = sum(1 for e in exp if len(e) == 3)
print(f'{len(exp)} words, {matched} timed from the cut, {len(exp) - matched} interpolated')
cur = None
for e in exp:
    if e[2] != cur: cur = e[2]; print(f'\n{cur} @{e[0]:.2f}:', end=' ')
    print(e[1] + ('*' if len(e) > 3 else ''), end=' ')
print()
