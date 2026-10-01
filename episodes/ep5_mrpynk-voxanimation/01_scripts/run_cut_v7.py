import json, sys
sys.path.insert(0,'.')
from build_cut import build, onset, offset, env
import numpy as np
D='/Users/henrychua/Downloads/'
SRC={
 'take0001':D+'Video_1074790464_DJI_20260930224009_0001_D_MP4_471160069_38000_202693022408_video_original.MP4',
 'take0003':D+'Video_1074790592_DJI_20260930224703_0003_D_MP4_730417133_60000_202693022472_video_original.mov',
 'take0004':D+'Video_1074790656_DJI_20260930225221_0004_D_MP4_1206969049_99000_2026930225220_video_original.MP4',
 'take0005':D+'Video_1074790720_DJI_20260930225411_0005_D_MP4_2562032123_212000_2026930225410_video_original.mov',
 'take0006':D+'Video_1074790784_DJI_20260930230122_0006_D_MP4_1089957934_90000_202693023122_video_original.MP4',
 'take0008':D+'Video_1074790912_DJI_20260930230913_0008_D_MP4_390220802_32000_202693023912_video_original.MP4',
 'take0011':D+'Video_1074791104_DJI_20260930231643_0011_D_MP4_685424644_56000_2026930231642_video_original.MP4',
 'take0012':D+'Video_1074791168_DJI_20260930233209_0012_D_MP4_772419737_63000_202693023328_video_original.mov',
 'take0015':D+'Video_1074791360_DJI_20260930233413_0015_D_MP4_771354961_63000_2026930233412_video_original.MP4',
 'take0016':D+'Video_1074791424_DJI_20260930233529_0016_D_MP4_315724348_26000_2026930233528_video_original.MP4',
}
# (take, first word start, last word start, label)  -- last word end handled by offset()
groups = [
 [('take0001',29.08,30.40,'intent',{'in':29.06,'out':30.86})],
 [('take0005',18.64,23.72,'ask',{'in':18.55,'out':24.10})],
 [('take0006',0.91,9.02,'topics',{'in':0.85})],
 [('take0008',18.42,21.60,'style1',{'in':18.36}),('take0008',7.28,11.79,'style2',{'in':7.22})],
 [('take0011',28.21,38.89,'budget',{'in':28.05,'out':39.55})],
 [('take0016',3.40,4.39,'done1',{'in':3.35}),('take0016',5.52,6.83,'done2',{'in':5.47})],
 [('take0012',0.00,1.20,'wow'),('take0015',7.47,13.58,'receipts',{'out':14.00})],
 [('take0012',14.66,17.03,'verdict')],
 [('take0015',57.56,61.89,'cta')],
]
FPS=30
items=[{"spacer":132},{"spacer":0}]  # hook 132 f placeholder (muted Henry + reel), then intent follows
items=[{"spacer":132}]
out=[]
for gi,g in enumerate(groups):
    its=build(g)
    out.append(its)
# assemble with breaths: 0.28 s (8 f) between groups, 0.16 s (5f) between lines inside a group handled by build's squeeze; between separate lines in a group add 5 f spacer
timeline=[{"spacer":132}]
for gi,its in enumerate(out):
    if gi==1: timeline.append({"spacer":90})   # sting hold after intent
    for k,it in enumerate(its):
        timeline.append(it)
    if gi==5: timeline.append({"spacer":261,"label":"RESULT full frame 8.7s"})  # result after 'done'
    timeline.append({"spacer":14 if gi==3 else 8})
timeline.pop()
tot=sum(i.get('frames',i.get('spacer',0)) for i in timeline)
json.dump({"fps":FPS,"sources":SRC,"items":timeline},open('cut-ep5-v7.json','w'),indent=1)
for i in timeline:
    if 'take' in i: print(f"{i['take']} in={i['in']:8.3f} f={i['frames']:4d} ({i['frames']/30:5.2f}s) {i['label']}")
    else: print(f"  spacer {i['spacer']} {i.get('label','')}")
print(f"TOTAL {tot} f = {tot/30:.1f} s")
# reel hook cut points
e,fl=env('reel'); print('reel onset which:',onset('reel',5.20),' offset minutes:',offset('reel',8.87), ' next word what:',onset('reel',9.56))
