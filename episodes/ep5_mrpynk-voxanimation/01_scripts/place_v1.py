#!/usr/bin/env python3
"""Turn cut-ep5-v1.json into ChatCut edit_item adds (pass 1: speech + hook + sting + result)."""
import json, sys
sys.path.insert(0,'.')
from build_cut import env, sil_thr
import numpy as np
cut=json.load(open('cut-ep5-v1.json'))
ASSET={'take0001':'712f2db1d8','take0003':'49603afbea','take0004':'47e07a6d54','take0005':'37c8441249','take0006':'66594ce81e','take0008':'704e625793','take0011':'3db6c46f5c','take0012':'10d81ea802','take0015':'4a74e58105','take0016':'e9e734e731','final':'ba9e6b0070','reel':'1f7d127bb5','sting':'10b1975108','pill':'b24189e823','frame':'801c4edd67','jingle':'8a7de95372'}
V1='ece067afb6'; V2='85892c25d6'; V3='21a283596c'; V4='def8a9e889'; JING='834c492e62'
FULL=dict(left=0,top=0,width=1080,height=1920,fit="cover")
def us(t): return int(round(t*1e6))
adds=[]; log=[]
items=cut['items']; f=0
# hook: 132 f Henry muted (take0001 from 14.7) + reel window with audio
HOOK=132
adds.append(dict(type="video",assetId=ASSET['take0001'],trackId=V1,startFrame=0,sourceIn=us(14.70),durationFrames=HOOK,muted=True,**FULL))
adds.append(dict(type="video",assetId=ASSET['reel'],trackId=V2,startFrame=0,sourceIn=us(5.15),durationFrames=128,left=620,top=1010,width=315,height=560,fit="cover",decibelAdjustment=-8,audioFadeInDurationFrames=1,audioFadeOutDurationFrames=2))
adds.append(dict(type="motion-graphic",assetId=ASSET['frame'],trackId=V3,startFrame=0,durationFrames=128,left=606,top=996,width=343,height=588,keepAspectRatio=False,propertyOverrides={"border":26,"radius":53,"paper":"#FFFFFF"}))
adds.append(dict(type="motion-graphic",assetId=ASSET['pill'],trackId=V4,startFrame=0,durationFrames=HOOK,left=260,top=330,width=560,height=120,keepAspectRatio=False,propertyOverrides={"text":"Cooked or Cracked?","ink":"#171411","paper":"#FFFFFF"}))
f=HOOK
prev=None
for k,it in enumerate(items):
    if 'spacer' in it and it['spacer']==132: continue  # hook handled
    if 'spacer' in it:
        n=it['spacer']
        if n==90:   # sting hold
            adds.append(dict(type="video",assetId=ASSET['take0001'],trackId=V1,startFrame=f,sourceIn=us(31.2),durationFrames=90,muted=True,**FULL))
            adds.append(dict(type="audio",assetId=ASSET['sting'],trackId=JING,startFrame=f,sourceIn=0,durationFrames=69,decibelAdjustment=-8))
            adds.append(dict(type="motion-graphic",assetId=ASSET['jingle'],trackId=V4,startFrame=f,durationFrames=90,left=165,top=160,width=750,height=300,keepAspectRatio=False,propertyOverrides={"word1":"COOKED","word2":"OR","word3":"CRACKED?","beat1":6,"beat2":21,"beat3":28,"accent":"#DF825F"}))
            adds.append(dict(type="video",assetId=ASSET['final'],trackId=V2,startFrame=f,sourceIn=us(50.0),durationFrames=90,muted=True,left=383,top=1050,width=315,height=560,fit="cover"))
            adds.append(dict(type="motion-graphic",assetId=ASSET['frame'],trackId=V3,startFrame=f,durationFrames=90,left=369,top=1036,width=343,height=588,keepAspectRatio=False,propertyOverrides={"border":26,"radius":53,"paper":"#FFFFFF"}))
            log.append((f,90,'STING hold'))
        elif n==261:  # result full frame
            adds.append(dict(type="video",assetId=ASSET['final'],trackId=V1,startFrame=f,sourceIn=0,durationFrames=261,decibelAdjustment=-6,**FULL))
            log.append((f,261,'RESULT full'))
        else:
            # breath: muted lead-in of the NEXT item's take (silence before its in-point) else previous tail
            nxt=next((j for j in items[k+1:] if 'take' in j),None)
            if nxt:
                lead=nxt['in']-n/30
                e,fl=env(nxt['take']); seg=e[int(lead*100):int(nxt['in']*100)]
                if lead>=0 and len(seg) and seg.max()<sil_thr(nxt['take'])+4:
                    src=(nxt['take'],lead)
                else:
                    src=(prev['take'],prev['in']+prev['frames']/30)
            else:
                src=(prev['take'],prev['in']+prev['frames']/30)
            adds.append(dict(type="video",assetId=ASSET[src[0]],trackId=V1,startFrame=f,sourceIn=us(src[1]),durationFrames=n,muted=True,**FULL))
            log.append((f,n,f'breath {src[0]}@{src[1]:.2f}'))
        f+=n; continue
    adds.append(dict(type="video",assetId=ASSET[it['take']],trackId=V1,startFrame=f,sourceIn=us(it['in']),durationFrames=it['frames'],decibelAdjustment=0,**FULL))
    log.append((f,it['frames'],it['label'])); prev=it; f+=it['frames']
json.dump(adds,open('place-v1-adds.json','w'),indent=0)
for a in log: print(a)
print('items',len(adds),'end frame',f,f'{f/30:.1f}s')
