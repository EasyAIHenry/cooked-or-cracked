#!/usr/bin/env python3
"""Ep7 cut v3 (= edit v2, 4 Oct 2026, Henry's notes on v1):
1. Open on the repo: what it is (11 skills, safety scan), then how it works without doing Buffer by hand (his prompt, 10 min,
   "in the past I have to use Buffer ... now entirely on Claude", LinkedIn-verified connection).
2. Then his past, briefly (ghostwriter, May challenge, Claude wrote / Buffer posted).
3. Buffer vs Claude advice, verdict, one CTA at the end (mid CTA dropped).
4. Fluent: line edges trimmed to the voiced sound (breaths out), inner pauses squeezed to 0.16 s, every join capped so the
   silence a viewer hears is ~0.22 s inside a thought and ~0.30 s between sections.
Lines are (first word start, last word start, label, extra) from take26-words.json (Whisper medium, can run ~0.3 s late).
Writes cut-ep7-v3.json (join_audit format)."""
import json, sys, numpy as np
sys.path.insert(0, '.')
from build_cut import build, env, sil_thr
T = 'take26'
EP = '/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep7_LinkedIn-Agent'
W = json.load(open(f'{EP}/04_raw-footage/transcripts/take26-words.json'))
# (first word start, last word start, label, join-before: 'in' = same thought, 'sec' = new section)
LINES = [
    (83.84, 86.73, 'R01 Now as you can see here, I installed and it\'s', 'sec'),
    (87.61, 92.94, 'R01b safe to say that there is free skills that are 11 types here.', 'glue'),   # 'safely' (87.08-87.41) lifted out
    (94.55, 101.31, 'R02 Before you install anything, just a tip, just go on NVIDIA to clear the repos that you are actually doing. It can get quite dangerous.', 'in'),
    (117.36, 122.65, 'R03 And this one\'s got 9 out of 100, which is kind of low risk and it\'s great.', 'in'),
    (132.84, 136.53, 'R04 So the true test is, does it run on my LinkedIn?', 'sec'),
    (138.08, 141.29, 'R04b It writes, but it doesn\'t really post.', 'in'),
    (164.62, 171.82, 'R05 But now with this prompt, it can be done entirely through Claude, as long as you have the right measures to connect to LinkedIn.', 'in'),
    (144.19, 147.26, 'R06 I dropped a poster, a photo and a video of my next event.', 'in'),
    (151.91, 154.39, 'R06b Claude actually checked my old project files', 'in'),
    (157.56, 159.27, 'R07 And totally it took about 10 minutes.', 'in'),
    (222.84, 228.70, 'R08 Now this is crazy because in the past I have to use Buffer to do it. Now I can just do it entirely on Claude.', 'in'),
    (173.14, 179.59, 'R09 So always please check your third-party apps, if it\'s LinkedIn verified, you don\'t want to get kicked out of LinkedIn', 'in'),
    (11.18, 13.32, 'P01a People have told me that I have a ghostwriter on LinkedIn.', 'sec'),
    (14.00, 15.41, 'P01 Honestly, it\'s just AI.', 'in'),
    (17.96, 23.63, 'P02 I ran a challenge in May and I posted 30 days straight, no fail, Monday to Friday.', 'in'),
    (26.80, 32.11, 'P03 So 36 posts in 30 days, Claude wrote them. Buffer is the app that I\'m using, posted them.', 'in'),
    (229.40, 234.60, 'C01 It doesn\'t really has a dashboard unless you create it manually, but for Buffer you kind of have a dashboard.', 'sec'),
    (326.52, 333.40, 'C02 If you just started and don\'t really know what to do, use Buffer. Only use Claude to do this if you\'re experienced and you\'re comfortable with it.', 'in'),
    (333.76, 335.43, 'V01 Overall the verdict is, this is cracked.', 'in'),
    (360.84, 364.38, 'Z01 If you like what you see, comment GHOST and I\'ll send you my workflow.', 'sec'),
]
# hand fixes after the join audit / listen (source seconds)
OV = {'R09': {'out': 179.86}, 'R01': {'out': 87.07}, 'R01b': {'in': 87.51}, 'R03': {'in': 117.16, 'out': 121.72},
      'R04b': {'out': 140.16}, 'R02': {'out': 101.80}, 'R05': {'in': 164.43}, 'R06': {'in': 144.59}, 'R06b': {'out': 154.70}, 'P01a': {'in': 11.11}, 'P03': {'out': 32.16},
      'V01': {'out': 336.04}}
# sentence ends inside a line (source s): the squeezed gap there gets +2 frames so it reads as a full stop, not a rush
BREAKS = (29.6, 226.6, 329.5)
PAUSE = {'in': 0.22, 'sec': 0.30, 'glue': 0.0}   # glue = mid-phrase splice, no gap, no edge trim          # silence heard across a join
e, fl = env(T); THR = sil_thr(T); VOICED = fl + 12
def first_last(a, b):
    ws = [w for w in W if a - 0.05 <= w[0] <= b + 0.01]
    return ws[0][0], ws[-1][1]
def edges(a, b):
    """silence at the head and tail of [a, b): frames below VOICED, but a quiet stretch next to voiced speech within 0.12 s
    (soft consonants: s, f, h, -ld) counts as speech."""
    seg = e[int(a * 100):int(b * 100)]; v = np.where(seg > VOICED)[0]
    if not len(v): return 0.0, 0.0
    i0, i1 = v[0], v[-1]
    k = i0
    while k > 0 and seg[k - 1] > THR and i0 - k < 12: k -= 1
    j = i1
    while j < len(seg) - 1 and seg[j + 1] > THR and j - i1 < 12: j += 1
    return k / 100, (len(seg) - 1 - j) / 100
items = []; prev_tail = None; report = []
for li, (ws0, we0, label, join) in enumerate(LINES):
    glue_next = li + 1 < len(LINES) and LINES[li + 1][3] == 'glue'
    base = label.split(' ')[0]
    ov = dict(OV.get(base, {}))
    its = build([(T, ws0, we0, base, ov)])
    # trim the line's outer silence down to a small margin (lead 0.05 s, tail 0.08 s)
    a0 = its[0]['in']; b1 = its[-1]['in'] + its[-1]['frames'] / 30
    lead, _ = edges(a0, a0 + its[0]['frames'] / 30); _, tail = edges(its[-1]['in'], b1)
    cut_lead = max(0.0, lead - 0.05); cut_tail = max(0.0, tail - 0.08)
    if 'in' not in ov and join != 'glue':
        its[0]['in'] = round(a0 + cut_lead, 3); its[0]['frames'] -= int(round(cut_lead * 30)); lead -= cut_lead
    if 'out' not in ov and not glue_next:
        its[-1]['frames'] -= int(round(cut_tail * 30)); tail -= cut_tail
    for k in range(len(its) - 1):
        end = its[k]['in'] + its[k]['frames'] / 30
        if any(abs(end - b) < 0.2 for b in BREAKS): its[k]['frames'] += 2
    for it in its: it['text'] = label
    if prev_tail is not None:
        sp = int(round((PAUSE[join] - prev_tail - lead) * 30))
        if sp > 0: items.append({'spacer': sp})
        report.append((base, round(prev_tail + lead + max(sp, 0) / 30, 2)))
    items += its; prev_tail = tail
cut = {'fps': 30, 'sources': {T: f'{EP}/04_raw-footage/transcripts/take26-16k.wav'}, 'items': items}
json.dump(cut, open('cut-ep7-v3.json', 'w'), indent=1)
tot = sum(i.get('frames', i.get('spacer', 0)) for i in items)
print(len([i for i in items if 'take' in i]), 'pieces', len(LINES), 'lines', tot, 'frames', round(tot / 30, 1), 's speech')
print('join pauses (line, s):', report)
for i in items: print(f"  {i.get('label', ''):8} {i.get('in', ''):>9} {i.get('frames', i.get('spacer'))}")
