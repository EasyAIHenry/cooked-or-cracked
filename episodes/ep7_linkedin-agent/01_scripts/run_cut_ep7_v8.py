#!/usr/bin/env python3
"""Ep7 cut v8 (Henry 5 Oct): v6 with the "Pe" of "People" restored (P01a in 10.94; the plosive is 10.98-11.06, the old in-point 11.11 cut it).
Ep7 cut v6 (Henry 5 Oct): v5 + the May challenge result put back ("So how it went? 9,600 impressions, median 134 vs 217... More posts didn't mean it reached more people"); repeated "36 posts" and the 1.3% line left out.\nEp7 cut v5 (Henry 4 Oct night): NVIDIA/skills section out, start on the true test, past (Buffer) then now (prompt drives Buffer), ~1 min.\nEp7 cut v4 (= edit v4, Henry 4 Oct: say it plainly: with this you can post on LinkedIn, in the past I had to use Buffer).
Repo section now: true test -> "it actually does help me do the posting" -> files, 10 min -> "in the past Buffer" -> "now with this prompt, entirely through Claude, as long as..." -> LinkedIn verified.
Ep7 cut v3 (= edit v2, 4 Oct 2026, Henry's notes on v1):
1. Open on the repo: what it is (11 skills, safety scan), then how it works without doing Buffer by hand (his prompt, 10 min,
   "in the past I have to use Buffer ... now entirely on Claude", LinkedIn-verified connection).
2. Then his past, briefly (ghostwriter, May challenge, Claude wrote / Buffer posted).
3. Buffer vs Claude advice, verdict, one CTA at the end (mid CTA dropped).
4. Fluent: line edges trimmed to the voiced sound (breaths out), inner pauses squeezed to 0.16 s, every join capped so the
   silence a viewer hears is ~0.22 s inside a thought and ~0.30 s between sections.
Lines are (first word start, last word start, label, extra) from take26-words.json (Whisper medium, can run ~0.3 s late).
Writes cut-ep7-v8.json (join_audit format)."""
import json, sys, numpy as np
sys.path.insert(0, '.')
from build_cut import build, env, sil_thr
T = 'take26'
EP = '/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep7_LinkedIn-Agent'
W = json.load(open(f'{EP}/04_raw-footage/transcripts/take26-words.json'))
# (first word start, last word start, label, join-before: 'in' = same thought, 'sec' = new section)
LINES = [
    (132.84, 136.53, 'R04 So the true test is, does it run on my LinkedIn?', 'sec'),
    (11.18, 13.32, 'P01a People have told me that I have a ghostwriter on LinkedIn.', 'sec'),
    (14.00, 15.41, 'P01 Honestly, it\'s just AI.', 'in'),
    (17.96, 23.63, 'P02 I ran a challenge in May and I posted 30 days straight, no fail, Monday to Friday.', 'in'),
    (26.80, 32.11, 'P03 So 36 posts in 30 days, Claude wrote them. Buffer is the app that I\'m using, posted them.', 'in'),
    (51.48, 52.11, 'P04a So how it went?', 'sec'),
    (53.95, 61.38, 'P04 9,600 impressions, a median of 134 per post against 217 for the rest of my year.', 'in'),
    (65.24, 68.29, 'P05 More posts didn\'t mean it reached more people.', 'in'),
    (214.00, 222.02, 'R10 What it helped me to do is directly on my LinkedIn, it actually does help me do the posting when I put one video, one photo and a poster inside.', 'sec'),
    (151.91, 154.39, 'R06b Claude actually checked my old project files', 'in'),
    (157.56, 159.27, 'R07 And totally it took about 10 minutes.', 'in'),
    (222.84, 226.46, 'R08 Now this is crazy because in the past I have to use Buffer to do it.', 'in'),
    (164.80, 171.82, 'R05 Now with this prompt, it can be done entirely through Claude, as long as you have the right measures to connect to LinkedIn.', 'in'),
    (173.14, 176.76, 'R09 So always please check your third-party apps, if it\'s LinkedIn verified.', 'in'),
    (326.52, 333.40, 'C02 If you just started and don\'t really know what to do, use Buffer. Only use Claude to do this if you\'re experienced and you\'re comfortable with it.', 'sec'),
    (333.76, 335.43, 'V01 Overall the verdict is, this is cracked.', 'in'),
    (360.84, 364.38, 'Z01 If you like what you see, comment GHOST and I\'ll send you my workflow.', 'sec'),
]
# hand fixes after the join audit / listen (source seconds)
OV = {'R09': {'out': 177.00}, 'R04b': {'out': 140.16}, 'R05': {'in': 164.69}, 'R10': {'in': 213.84}, 'R08': {'in': 222.77, 'out': 226.56},
      'R06b': {'out': 154.70}, 'P01a': {'in': 10.94}, 'P03': {'out': 32.16}, 'V01': {'out': 336.04}}
# sentence ends inside a line (source s): the squeezed gap there gets +2 frames so it reads as a full stop, not a rush
BREAKS = (29.6, 329.5)
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
json.dump(cut, open('cut-ep7-v8.json', 'w'), indent=1)
tot = sum(i.get('frames', i.get('spacer', 0)) for i in items)
print(len([i for i in items if 'take' in i]), 'pieces', len(LINES), 'lines', tot, 'frames', round(tot / 30, 1), 's speech')
print('join pauses (line, s):', report)
for i in items: print(f"  {i.get('label', ''):8} {i.get('in', ''):>9} {i.get('frames', i.get('spacer'))}")
