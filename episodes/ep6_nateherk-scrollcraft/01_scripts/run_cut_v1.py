#!/usr/bin/env python3
"""Ep6 cut v1 (2 Oct 2026): Henry's take DJI_..._0017 (take17), ChatCut word times, energy-refined in/out."""
import json, sys
sys.path.insert(0,'.')
from build_cut import build
T='take17'
LINES=[
 (T,41.81,43.89,'wow'),
 (T,57.59,66.51,'setup'),
 (T,125.73,126.85,'figma.a'),(T,128.05,129.65,'figma.b'),(T,134.41,137.73,'figma.c'),
 (T,191.59,194.63,'build.a'),(T,195.03,199.19,'build.b'),
 (T,205.90,208.07,'seed.a'),(T,240.31,244.11,'seed.b'),(T,258.75,262.43,'seed.c'),(T,263.67,267.72,'seed.d'),
 (T,275.16,281.70,'result.a'),(T,300.09,303.09,'result.b'),
 (T,329.88,332.24,'biz.a'),(T,380.75,383.71,'biz.b'),(T,432.16,436.63,'biz.c'),
 (T,448.05,449.93,'cost.a'),(T,486.25,489.05,'cost.b'),
 (T,513.45,519.04,'verdict'),
 (T,546.94,549.74,'cta'),
]
BREATH=9
items=[]
prev=None
for ln in LINES:
    its=build([ln])
    if prev is not None: items.append({"spacer":BREATH})
    items+=its; prev=ln
cut={"fps":30,"sources":{T:"/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep6_NateHerk-ScrollCraft/04_raw-footage/voice/take17_v.mp4"},"items":items}
json.dump(cut,open('cut-ep6-v1.json','w'),indent=1)
tot=sum(i.get('frames',i.get('spacer',0)) for i in items)
print(len([i for i in items if 'take' in i]),'pieces', tot,'frames', round(tot/30,1),'s')
for i in items:
    if 'take' in i: print(f"{i['label']:10s} in {i['in']:8.3f}  {i['frames']:4d} f")
