#!/usr/bin/env python3
"""Ep7 cut v2 = Henry's 'shortest' (4 Oct 2026): the short pass-1 lines minus L03c (research on me), L15a (skills free / same bills),
L19 (cancel my one-year plan). In/out per line from cut-ep7-v1.json (energy-checked + Whisper-QA'd); inner pauses squeezed
by build_cut.build (0.16 s), ~0.30 s breath between lines (Ep6 run_cut_v4 method)."""
import json, sys, numpy as np
sys.path.insert(0, '.')
from build_cut import build, env, sil_thr
T = 'take26'
DROP = ('L03 And the research', 'L15 The skills are free', 'L19 ')
segs = [s for s in json.load(open('cut-ep7-v1.json'))['segments'] if s['version'] == 'both' and not s['label'].startswith(DROP)]
W = json.load(open('/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep7_LinkedIn-Agent/04_raw-footage/transcripts/take26-words.json'))
def first_last(a, b):
    ws = [w for w in W if a - 0.05 <= w[0] < b]
    return ws[0][0], ws[-1][1]
TARGET = 0.30
def edge_sil(a, b):
    e, fl = env(T); thr = sil_thr(T); seg = e[int(a*100):int(b*100)]; idx = np.where(seg > thr)[0]
    if not len(idx): return 0, 0
    return idx[0]/100, (len(seg)-1-idx[-1])/100
lines = []
for s in segs:
    ws, we = first_last(s['in'], s['out'])
    lab = s['label'].split(' ')[0] + ('.v' if 'VERDICT' in s['label'] else '')
    its = build([(T, ws, we, lab, {'in': s['in'], 'out': s['out']})])
    lead, _ = edge_sil(its[0]['in'], its[0]['in'] + its[0]['frames']/30); _, tail = edge_sil(its[-1]['in'], its[-1]['in'] + its[-1]['frames']/30)
    lines.append((its, lead, tail, s['label']))
items = []
for k, (its, lead, tail, full) in enumerate(lines):
    if k:
        sp = max(0, int(round((TARGET - lines[k-1][2] - lead) * 30)))
        if sp: items.append({"spacer": sp})
    for it in its: it['text'] = full
    items += its
cut = {"fps": 30, "sources": {T: "/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep7_LinkedIn-Agent/04_raw-footage/take/DJI_20261004182152_0026_D.MP4"}, "items": items}
json.dump(cut, open('cut-ep7-v2.json', 'w'), indent=1)
tot = sum(i.get('frames', i.get('spacer', 0)) for i in items)
print(len([i for i in items if 'take' in i]), 'pieces', len(lines), 'lines', tot, 'frames', round(tot/30, 1), 's')
for i in items: print(i.get('label', ''), i.get('in', ''), i.get('frames', i.get('spacer')))
