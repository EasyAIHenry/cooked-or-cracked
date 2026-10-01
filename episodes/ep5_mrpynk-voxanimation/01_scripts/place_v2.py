#!/usr/bin/env python3
"""Pass 2 placement: speech (from cut-ep5-v2.json) + hook + sting + every super. Emits place-v2-adds.json."""
import json, sys
sys.path.insert(0,'.')
from build_cut import env, sil_thr
cut=json.load(open('cut-ep5-v2.json')); items=cut['items']
A={'take0001':'712f2db1d8','take0003':'49603afbea','take0004':'47e07a6d54','take0005':'37c8441249','take0006':'66594ce81e','take0008':'704e625793','take0011':'3db6c46f5c','take0012':'10d81ea802','take0015':'4a74e58105','take0016':'e9e734e731',
   'final':'ba9e6b0070','reel':'1f7d127bb5','sting':'10b1975108','pop':'7f30ed40ce','click':'726d10a028','skA':'5cb4958537','skB':'af608b2644',
   'pill':'b24189e823','frame':'801c4edd67','jingle':'8a7de95372','stamp':'ab781ea4e2','tags':'d8be38e27c','score':'5a6b6900ee','confetti':'862f4ed791','strip':'01f304d485','topics':'084f933412','styles':'997b0379a5','chips':'69feafb749','loader':'e891d19b8f'}
V1='ece067afb6'; V2='85892c25d6'; V3='21a283596c'; V4='def8a9e889'; V5='115a36a776'; V6='79113b45fd'; JING='834c492e62'
FULL=dict(left=0,top=0,width=1080,height=1920,fit="cover")
INK="#171411"; ACC="#DF825F"; PAPER="#FFFEFA"
def us(t): return int(round(t*1e6))
adds=[]
def vid(asset,track,f,src,n,**kw): adds.append(dict(type="video",assetId=A[asset],trackId=track,startFrame=f,sourceIn=us(src),durationFrames=n,**kw))
def mg(asset,track,f,n,l,t,w,h,props): adds.append(dict(type="motion-graphic",assetId=A[asset],trackId=track,startFrame=f,durationFrames=n,left=l,top=t,width=w,height=h,keepAspectRatio=False,propertyOverrides=props))
def stamp(f,n,label,word,icon,accent=False,zone='bottom'):
    props={"serif":"Fraunces","hand":"Kalam","paper":PAPER,"ink":INK,"accent":ACC,"wordColor":ACC if accent else INK,"label":label,"word":word,"wordSize":150,"icon":icon}
    if zone=='bottom': mg('stamp',V4,f,n,160,1130,760,304,props)
    elif zone=='sting': mg('stamp',V5,f,n,40,1180,640,256,props)
def frame_mg(track,f,n,l,t,w,h,border,radius): mg('frame',track,f,n,l,t,w,h,{"border":border,"radius":radius,"paper":"#FFFFFF"})
# ---- walk the cut and record label -> (start, frames) ----
pos={}; f=0; prev=None; order=[]
HOOK=132
for k,it in enumerate(items):
    if 'spacer' in it and it['spacer']==132 and k==0: f=HOOK; continue
    if 'spacer' in it:
        n=it['spacer']; lbl=it.get('label','')
        if n==90: pos['STING']=(f,90)
        elif n==261: pos['RESULT']=(f,261)
        else:
            nxt=next((j for j in items[k+1:] if 'take' in j),None)
            src=None
            if nxt:
                lead=nxt['in']-n/30; e,fl=env(nxt['take']); seg=e[int(lead*100):int(nxt['in']*100)]
                if lead>=0 and len(seg) and seg.max()<sil_thr(nxt['take'])+4: src=(nxt['take'],lead)
            if src is None: src=(prev['take'],prev['in']+prev['frames']/30)
            vid(src[0],V1,f,src[1],n,muted=True,**FULL)
        f+=n; continue
    vid(it['take'],V1,f,it['in'],it['frames'],decibelAdjustment=0,**FULL)
    pos[it['label']]=(f,it['frames']); order.append(it['label']); prev=it; f+=it['frames']
END=f
def beat(prefix):
    ks=[k for k in order if k==prefix or k.startswith(prefix+'.') or (prefix=='style' and k.startswith('style'))]
    s=pos[ks[0]][0]; e=pos[ks[-1]][0]+pos[ks[-1]][1]; return s,e
def word_frame(label,src_time):
    """timeline frame of a source time inside item `label`"""
    s,n=pos[label]; it=next(i for i in items if i.get('label')==label); return s+int(round((src_time-it['in'])*30))
# ---- hook ----
vid('take0001',V1,0,14.70,HOOK,muted=True,**FULL)
vid('reel',V2,0,5.15,128,left=620,top=1010,width=315,height=560,fit="cover",decibelAdjustment=-8,audioFadeInDurationFrames=1,audioFadeOutDurationFrames=2)
frame_mg(V3,0,128,606,996,343,588,26,53)
mg('pill',V4,0,HOOK,260,330,560,120,{"text":"Cooked or Cracked?","ink":INK,"paper":"#FFFFFF"})
# intent stamp
s,e=beat('intent'); stamp(s,pos['STING'][0]-s,"his claim","VOX IN MINUTES","video")
# ---- sting ----
s,n=pos['STING']
vid('take0001',V1,s,31.20,90,muted=True,**FULL)
adds.append(dict(type="audio",assetId=A['sting'],trackId=JING,startFrame=s,sourceIn=0,durationFrames=69,decibelAdjustment=-8))
mg('jingle',V4,s,90,165,160,750,300,{"word1":"COOKED","word2":"OR","word3":"CRACKED?","beat1":6,"beat2":21,"beat3":28,"accent":ACC})
vid('final',V2,s,42.6,90,muted=True,left=720,top=1000,width=315,height=560,fit="cover")   # scene 5: plane shadow in the lagoon
frame_mg(V3,s,90,706,986,343,588,26,53)
stamp(s+40,50,"easy motion graphics","IN 30 MINUTES","rocket",zone='sting')
SPEECH0=s+90
# ---- install: typed /vox-animation ----
s,e=beat('install')
mg('strip',V4,s,e-s,90,1100,900,378,{"label":"in Claude Code","text":"/vox-animation","typeStart":4,"cpf":0.5,"fontSize":48,"paper":PAPER,"ink":INK,"accent":ACC})
# ---- the ask ----
s,e=beat('ask')
mg('strip',V4,s,e-s,90,1100,900,378,{"label":"the ask","text":"research the most controversial unsolved mystery cases in the world","typeStart":4,"cpf":0.55,"fontSize":42,"paper":PAPER,"ink":INK,"accent":ACC})
# ---- the arc ----
s,e=beat('arc')
mg('strip',V4,s,e-s,90,1100,900,378,{"label":"the arc","text":"from the beginning to the cliffhanger. end on what people may never find out","typeStart":4,"cpf":0.85,"fontSize":42,"paper":PAPER,"ink":INK,"accent":ACC})
# ---- the voice ----
s,e=beat('voice')
mg('strip',V4,s,e-s,90,1060,900,378,{"label":"the voice","text":"a narrator that fits the mystery feel","typeStart":4,"cpf":0.4,"fontSize":42,"paper":PAPER,"ink":INK,"accent":ACC})
mg('chips',V3,s+60,e-s-60,90,900,900,144,{"v1":"RYAN","v2":"CHRISTOPHER","v3":"JENNY","p1":0,"p2":8,"p3":16,"pick":1,"tickAt":max(30,(e-s-60)-40),"paper":PAPER,"ink":INK,"accent":ACC})
# ---- higgsfield + seedance ----
s,e=beat('higgs'); stamp(s,e-s,"my generator","HIGGSFIELD + SEEDANCE 2.5","api")
# ---- stitch: loader ----
s,e=beat('stitch')
mg('loader',V4,s,e-s+8,90,1130,900,234,{"cmd":"$ assemble.sh projects/amelia-earhart","doneText":"final.mp4  60 s  6 blocks","barStart":6,"barEnd":max(30,e-s-10),"paper":PAPER,"ink":INK,"accent":ACC})
# ---- topics ----
s,e=beat('topics'); s2=pos['topics.2'][0]; s3=pos['topics.3'][0]
mg('topics',V4,s,e-s,160,1000,760,460,{"t1":"D.B. COOPER","t2":"3I/ATLAS","t3":"AMELIA EARHART","p1":s2-s,"p2":s2-s+12,"p3":s2-s+24,"pick":3,"pickAt":s3-s+10,"paper":PAPER,"ink":INK,"accent":ACC})
# ---- styles ----
s,e=beat('style'); s2=pos['style2.1'][0]
lagoon=word_frame('style2.1',9.86)  # "lagoon"
mg('styles',V4,s,e-s,90,1000,900,270,{"s1":"ARCHIVE","s2":"LAGOON","s3":"RADIO","p1":0,"p2":8,"p3":16,"pick":2,"hoverAt":s2-s,"clickAt":max(s2-s+10,lagoon-s),"paper":PAPER,"ink":INK,"accent":ACC})
# style key render in the right window from the click to the end of the budget line
bs,be=beat('budget')
adds.append(dict(type="image",assetId=A['skA'],trackId=V2,startFrame=lagoon,durationFrames=be-lagoon,left=750,top=230,width=300,height=533,fit="cover"))
frame_mg(V3,lagoon,be-lagoon,738,218,324,557,24,59)
# ---- budget: price tags on the numbers ----
f70=word_frame('budget.2',30.44); f420=word_frame('budget.2',35.26)
mg('tags',V4,bs,be-bs,90,1100,900,342,{"serif":"Fraunces","hand":"Kalam","paper":PAPER,"ink":INK,"accent":ACC,"p1":f70-bs,"p2":f420-bs,"a1":"70","n1":"credits per clip","a2":"420","n2":"credits, six clips"})
# ---- done: render stamp ----
s,e=beat('done'); stamp(s,e-s,"render","DONE","video")
# ---- result: nothing over it ----
rs,rn=pos['RESULT']
vid('final',V1,rs,0.0,rn,decibelAdjustment=-6,**FULL)
# ---- reaction: result muted in the right window, receipts ----
ws,we=beat('wow'); rs2,re2=beat('receipts'); vs,ve=beat('verdict'); cs,ce=beat('cta')
vid('final',V2,ws,8.7,ce-ws,muted=True,left=750,top=230,width=300,height=533,fit="cover")
frame_mg(V3,ws,ce-ws,738,218,324,557,24,59)
tick=word_frame('verdict',16.21)
f15=word_frame('receipts.1',9.13); f30=word_frame('receipts.3',12.69)
stamp(ws,f15-ws,"his claim","MINUTES, NOT DAYS","video")
stamp(f15,f30-f15,"cost","UNDER $15","money")
stamp(f30,tick-f30,"time","30 MINUTES","calendar")
# ---- verdict ----
tick=word_frame('verdict',16.21)
stamp(tick,cs-tick,"verdict","CRACKED","trophy",accent=True)
mg('confetti',V6,tick,min(130,END-tick),0,0,1080,1920,{"paper":PAPER,"ink":INK,"accent":ACC,"extra":"#F2C14E","count":90})
# ---- CTA ----
stamp(cs,END-cs,"comment","AMELIA","comment",accent=True)
# ---- scoreboard: right wall, from first speech to end, off during the result ----
mg('score',V5,SPEECH0,rs-SPEECH0,830,800,220,195,{"serif":"Fraunces","paper":PAPER,"ink":INK,"accent":ACC,"top":"COOKED","bottom":"CRACKED","tickAt":6000,"tickTop":False})
mg('score',V5,rs+rn,END-(rs+rn),830,800,220,195,{"serif":"Fraunces","paper":PAPER,"ink":INK,"accent":ACC,"top":"COOKED","bottom":"CRACKED","tickAt":tick-(rs+rn),"tickTop":False})
json.dump(adds,open('place-v2-adds.json','w'))
print('END',END,f'{END/30:.1f}s','adds',len(adds))
for k in ['intent','STING','install','ask','arc','voice','higgs','stitch','topics','style1','budget','done','RESULT','wow','receipts','verdict','cta']:
    ks=[x for x in pos if x==k or x.startswith(k+'.')]; 
    if ks: print(k, pos[ks[0]][0], '->', pos[ks[-1]][0]+pos[ks[-1]][1])
print('tick',tick,'lagoon',lagoon,'f70',f70,'f420',f420,'f15',f15,'f30',f30)
