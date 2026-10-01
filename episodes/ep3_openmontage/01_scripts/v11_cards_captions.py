#!/usr/bin/env python3
"""Ep3 v11 (Henry, 1 Oct 2026): Ep5-style card mode while a result video plays behind him (result keeps running full frame
with its own sound ducked under his voice, Henry in a white-framed card 630x1120 at 225/800), and Ep5 word-highlight
caption cards on every spoken line. Reads a timeline JSON, writes a batch JSON. Usage: v11_cards_captions.py <timeline.json> <out.json> <caption_asset_id> <caption_track_id>"""
import json,sys,re
d=json.load(open(sys.argv[1])); OUT=sys.argv[2]; CAP=sys.argv[3]
W=json.load(open('/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep3_OpenMontage/04_raw-footage/henry-take-ep3.words.json'))
items={it['id']:it for k in ['videoItems','audioItems','motionGraphicItems','imageItems'] for it in d[k]}
def by(prefix): return next(v for k,v in items.items() if k.startswith(prefix))
V1='2fee040c-6590-43e9-8ae3-e5cc98eda9e0'; V2='e71f5703-210c-496c-b4b9-8b1ab07c233c'; FR='3ddaaf27-6188-4938-b46d-ae83d328f844'
VOX='064a53d4-f83d-4fa2-a39c-c09e2555e03a'; CAPT='20016168-95ae-45b1-9b44-ed964eae2ce5'
HIS='18efe440-86de-410b-af8b-76a174744ccd'; MINE='16fafeb2-01da-4c77-b23a-79b256a7baef'; FRAME='b28c868a-6bff-4dfe-83b4-6efe5b0145b2'
CARD=dict(left=225,top=800,width=630,height=1120); CFR=dict(left=213,top=788,width=654,height=1144)
BG_DB=-30
FULL=dict(left=0,top=0,width=1080,height=1920)
upd=[]; dels=[]; adds=[]
# card stretches: (start, end, bg asset, bg sourceIn s)
CARDS=[(708,862,HIS,20.0),(985,1037,HIS,4.1),(1740,2801,MINE,3.6)]
def in_card(f): return any(s<=f<e for s,e,_,_ in CARDS)
# 1. Henry's speech video on V1 inside card stretches -> V2 as the card
for it in d['videoItems']:
    if it['trackId']==V1 and it['assetId'].startswith('6046c9fc') and in_card(it['startFrame']):
        upd.append(dict(id=it['id'],trackId=V2,**CARD))
# 2. remove what the card replaces (work windows, top-right windows, guide pages, their frames)
for p in ['8db0fe1e','bf6ec273','749d7ec7','2cd35efd','e8adce1f','0d164e35','5507fdc6','d576c421','7f588ddc']:
    dels.append(dict(id=by(p)['id']))
# swishes that belonged to removed windows (784 render->his video, 2697/2732/2767 guide pages)
for a in d['audioItems']:
    if a['assetId'].startswith('3705ddfc') and a['startFrame'] in (784,2697,2732,2767): dels.append(dict(id=a['id']))
# work-window frame 205..862 now ends where card 1 starts
upd.append(dict(id=by('26a2fb9b')['id'],durationFrames=708-205,propertyOverrides={"border":22,"radius":53}))
# 3. card frames (white, Ep5 border 12 / radius 26) + backgrounds on V1
fr_reuse={985:by('1131cef6')['id'],1740:by('a57fb30c')['id']}
for s,e,asset,src in CARDS:
    if s in fr_reuse: upd.append(dict(id=fr_reuse[s],startFrame=s,durationFrames=e-s,propertyOverrides={"border":12,"radius":26},**CFR))
    else: adds.append(dict(type='motion-graphic',assetId=FRAME,trackId=FR,startFrame=s,durationFrames=e-s,keepAspectRatio=False,propertyOverrides={"border":12,"radius":26},**CFR))
    adds.append(dict(type='video',assetId=asset,trackId=V1,startFrame=s,sourceIn=int(round(src*1e6)),durationFrames=e-s,decibelAdjustment=BG_DB,**FULL))
# 4. stamps back to full width now the top-right windows are gone; chips move above the card
for p,props in [('4c3cbf60',{"label":"his result","word":"BLOCKY"}),('66cdbeec',{"label":"my result","word":"UNDER 30 MIN","icon":"check"}),('84656519',{"label":"how I'd use it","word":"WEEKLY CONTENT","icon":"calendar"})]:
    upd.append(dict(id=by(p)['id'],left=165,top=215,width=750,height=300,propertyOverrides=props))
upd.append(dict(id=by('5062269f')['id'],left=250,top=520,width=580,height=296,propertyOverrides={"p1":5,"p2":54}))
# 5. captions (Ep5 caption card, own top track)
import captions_lib
CAPT=sys.argv[4]
cards=captions_lib.build(d['audioItems'],CAP,CAPT)
adds+=cards
json.dump(dict(updates=upd,deletes=dels,adds=adds),open(OUT,'w'))
print(len(upd),'updates',len(dels),'deletes',len(adds),'adds,',len(cards),'caption cards')

