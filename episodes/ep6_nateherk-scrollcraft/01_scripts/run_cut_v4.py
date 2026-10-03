#!/usr/bin/env python3
"""Ep6 cut v4 (3 Oct 2026, Henry's v3 notes): no Henry hook line (Nate's reel opens the video), setup starts at 'I tested' (no 'And'); rest = v2. Exact in/out from 10 ms energy scans (3 kHz high-pass for fricatives) and adaptive breaths (~0.30 s per sentence break)."""
import json, sys, numpy as np
sys.path.insert(0,'.')
from build_cut import build, env, sil_thr
T='take17'
LINES=[
 (T,57.74,66.51,'setup',{'in':57.70,'out':66.52}),
 (T,125.73,126.85,'figma.a',{'in':125.64}),(T,128.05,129.65,'figma.b',{'in':128.08}),(T,134.41,137.73,'figma.c',{'in':134.47}),
 (T,191.59,194.63,'build.a',{}),(T,195.03,197.35,'build.b',{}),   # Henry 3 Oct: cut 'and it's about 10 minutes'
 (T,205.90,208.07,'seed.a',{}),(T,240.31,244.11,'seed.b',{'in':240.32}),(T,258.75,262.43,'seed.c',{'in':258.66}),(T,263.67,267.72,'seed.d',{}),
 (T,275.16,281.70,'result.a',{}),(T,300.09,303.09,'result.b',{'in':300.13,'out':303.12}),
 (T,329.88,332.24,'biz.a',{'out':332.23}),(T,380.75,383.71,'biz.b',{'in':380.80}),(T,432.16,436.63,'biz.c',{'in':432.18}),
 (T,448.05,449.93,'cost.a',{}),(T,486.25,489.05,'cost.b',{'in':486.30}),
 (T,513.45,519.04,'verdict',{}),
 (T,546.94,549.74,'cta',{}),
]
TARGET=0.30
def edge_sil(take,a,b):
    e,fl=env(take); thr=sil_thr(take); seg=e[int(a*100):int(b*100)]; idx=np.where(seg>thr)[0]
    if not len(idx): return 0,0
    return idx[0]/100, (len(seg)-1-idx[-1])/100
lines=[]
for ln in LINES:
    its=build([ln[:4]+(ln[4],)])
    # trim long lead / tail silence on the first and last piece
    a=its[0]['in']; b=its[-1]['in']+its[-1]['frames']/30
    lead,_=edge_sil(T,a,a+its[0]['frames']/30); _,tail=edge_sil(T,its[-1]['in'],b)
    if lead>0.12 and 'in' not in ln[4]:
        d=lead-0.06; its[0]['in']=round(its[0]['in']+d,3); its[0]['frames']-=int(round(d*30)); lead=0.06
    if tail>0.16 and 'out' not in ln[4]:
        d=tail-0.10; its[-1]['frames']-=int(round(d*30)); tail=0.10
    lines.append((its,lead,tail))
items=[]
for k,(its,lead,tail) in enumerate(lines):
    if k:
        sp=max(0,int(round((TARGET-lines[k-1][2]-lead)*30)))
        if sp: items.append({"spacer":sp})
    items+=its
cut={"fps":30,"sources":{T:"/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep6_NateHerk-ScrollCraft/04_raw-footage/voice/take17_v.mp4"},"items":items}
json.dump(cut,open('cut-ep6-v4.json','w'),indent=1)
tot=sum(i.get('frames',i.get('spacer',0)) for i in items)
print(len([i for i in items if 'take' in i]),'pieces', tot,'frames', round(tot/30,1),'s')
