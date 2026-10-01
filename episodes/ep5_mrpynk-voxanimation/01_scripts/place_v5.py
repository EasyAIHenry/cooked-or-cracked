#!/usr/bin/env python3
"""Pass 4 placement on timeline 'Ep5 v4' (cut-ep5-v4.json). Henry's pass-3 notes: light grade, no repo line, today line, fuller ask/arc/voice,
Higgsfield link, bigger generator stamp, cursor tour over the three topics (no frames), style descriptors, loader + titled credits table during budget,
card B at 800 for topics->done and for the reaction, stamps meet the card, bigger hook window + Pynk caption, zoom 1.08, hold without the turn, more SFX."""
import json, sys, os
sys.path.insert(0,'.')
from build_cut import env, sil_thr
cut=json.load(open('cut-ep5-v4.json')); items=cut['items']
A={'take0001':'712f2db1d8','take0004':'47e07a6d54','take0005':'37c8441249','take0006':'66594ce81e','take0008':'704e625793','take0011':'3db6c46f5c','take0012':'10d81ea802','take0015':'4a74e58105','take0016':'e9e734e731',
   'final':'ba9e6b0070','reel':'1f7d127bb5','sting':'10b1975108','pop':'7f30ed40ce','click':'726d10a028','ding':'3ebb484d2c','whoosh':'517a402cc7',
   'stArchive':'55469ba5cf','stRadio':'dbe8e9238b','stLagoon':'200633942a','icCooper':'535b7914a4','icAtlas':'4f6a70d1bd','icAmelia':'f8f0cf386b',
   'pill':'b24189e823','frame':'801c4edd67','jingle':'8a7de95372','stamp':'ab781ea4e2','score':'5a6b6900ee','confetti':'862f4ed791','strip':'01f304d485','loader':'e891d19b8f',
   'backdrop':'37892ea06e','credits2':'e9f7c2c6c4','picker':'cbdbf52ca1','caption':'dfaed928cf'}
A.update(json.load(open('sfx-assets.json')) if os.path.exists('sfx-assets.json') else {})
GR=json.load(open('graded-assets-v2.json')) if os.path.exists('graded-assets-v2.json') else {}
for _t,_g in GR.items(): A[_t]=_g['id']
V1='1aba9305db'; V2='aadaeb9d84'; V3='e704bf573a'; V4='3fc5fa1134'; V5='f82f46acf2'; V6='56ad02168a'; GAL=['e381352316','142d54edf7','4205aa1ea1']; V10='967f320be2'; V11='56cbe17835'
JING='6dcfdba782'; SFX_TRACKS=['1d006b9f7e','138d74217a','b043c27ad2']; sfx_used={t:[] for t in SFX_TRACKS}
FULL=dict(left=0,top=0,width=1080,height=1920,fit="cover")
INK="#171411"; ACC="#DF825F"; PAPER="#FFFEFA"
def us(t): return int(round(t*1e6))
adds=[]
def vid(asset,track,f,src,n,**kw):
    if asset in GR: src=src-GR[asset]['start']
    adds.append(dict(type="video",assetId=A[asset],trackId=track,startFrame=f,sourceIn=us(src),durationFrames=n,**kw))
def img(asset,track,f,n,l,t,w,h): adds.append(dict(type="image",assetId=A[asset],trackId=track,startFrame=f,durationFrames=n,left=l,top=t,width=w,height=h,fit="cover"))
def mg(asset,track,f,n,l,t,w,h,props): adds.append(dict(type="motion-graphic",assetId=A[asset],trackId=track,startFrame=f,durationFrames=n,left=l,top=t,width=w,height=h,keepAspectRatio=False,propertyOverrides=props))
def sfx(asset,f,db,n,src=0.0):
    for t in SFX_TRACKS:
        if all(f>=e or f+n<=s for s,e in sfx_used[t]):
            sfx_used[t].append((f,f+n)); adds.append(dict(type="audio",assetId=A[asset],trackId=t,startFrame=f,sourceIn=us(src),durationFrames=n,decibelAdjustment=db)); return
    print('SFX dropped (no free track)',asset,f)
def pop(f): sfx('pop',f,-9,10)
def click(f): sfx('click',f,-9,7)
def swish(f): sfx('whoosh',f,-18,24)
def typing(f,n): sfx('typing',f,-20,min(n,440)) if 'typing' in A else None
def stamp(f,n,label,word,icon,accent=False,box=(160,1130,760,304),track=None,size=150):
    props={"serif":"Fraunces","hand":"Kalam","paper":PAPER,"ink":INK,"accent":ACC,"wordColor":ACC if accent else INK,"label":label,"word":word,"wordSize":size,"icon":icon}
    l,t,w,h=box; mg('stamp',track or V4,f,n,l,t,w,h,props); pop(f)
def frame_mg(track,f,n,l,t,w,h,border,radius): mg('frame',track,f,n,l,t,w,h,{"border":border,"radius":radius,"paper":"#FFFFFF"})
# ---------- walk the cut ----------
pos={}; f=0; prev=None; order=[]; HOOK=132; speech=[]
for k,it in enumerate(items):
    if 'spacer' in it and it['spacer']==132 and k==0: f=HOOK; continue
    if 'spacer' in it:
        n=it['spacer']
        if n==90: pos['STING']=(f,90)
        elif n==261: pos['RESULT']=(f,261)
        else:
            nxt=next((j for j in items[k+1:] if 'take' in j),None); src=None
            if nxt:
                lead=nxt['in']-n/30; e,fl=env(nxt['take']); seg=e[int(lead*100):int(nxt['in']*100)]
                if lead>=0 and len(seg) and seg.max()<sil_thr(nxt['take'])+4: src=(nxt['take'],lead)
            if src is None: src=(prev['take'],prev['in']+prev['frames']/30)
            speech.append(dict(f=f,n=n,take=src[0],src=src[1],muted=True))
        f+=n; continue
    speech.append(dict(f=f,n=it['frames'],take=it['take'],src=it['in'],muted=False))
    pos[it['label']]=(f,it['frames']); order.append(it['label']); prev=it; f+=it['frames']
END=f
def beat(prefix):
    ks=[k for k in order if k==prefix or k.startswith(prefix+'.') or (prefix=='style' and k.startswith('style')) or (prefix=='done' and k.startswith('done'))]
    s=pos[ks[0]][0]; e=pos[ks[-1]][0]+pos[ks[-1]][1]; return s,e
def word_frame(label,src_time):
    s,n=pos[label]; it=next(i for i in items if i.get('label')==label); return s+int(round((src_time-it['in'])*30))
# ---------- framing modes ----------
CARD={'A':dict(l=119,t=422,w=842,h=1498,fb=9,fr=20), 'B':dict(l=225,t=800,w=630,h=1120,fb=12,fr=26)}
def card_frame(m): c=CARD[m]; return (c['l']-12,c['t']-12,c['w']+24,c['h']+24,c['fb'],c['fr'])
ranges=[]
hs,he=beat('higgs'); sts,ste=beat('stitch'); ranges.append((hs,ste,'A','paper'))
ts,te=beat('topics'); ss,se=beat('style'); bs,be=beat('budget'); ds,de=beat('done'); ranges.append((ts,de,'B','paper'))
ws,we=beat('wow'); cs,ce=beat('cta'); rs,rn=pos['RESULT']; ranges.append((ws,ce,'B','result'))
def mode_at(fr):
    for s,e,m,bg in ranges:
        if s<=fr<e: return m
    return 'full'
ZOOM=dict(left=-86,top=-154,width=1166,height=2074,fit="cover")   # hook framing 1.08x, extra off the top and the left
for sp in speech:
    m=mode_at(sp['f'])
    kw=dict(muted=True) if sp['muted'] else dict(decibelAdjustment=0)
    if m=='full':
        if sp['take']=='take0001': vid(sp['take'],V1,sp['f'],sp['src'],sp['n'],**kw,**ZOOM)
        else: vid(sp['take'],V1,sp['f'],sp['src'],sp['n'],**kw,**FULL)
    else:
        c=CARD[m]; vid(sp['take'],V2,sp['f'],sp['src'],sp['n'],left=c['l'],top=c['t'],width=c['w'],height=c['h'],fit="cover",**kw)
for s,e,m,bg in ranges:
    l,t,w,h,fb,fr=card_frame(m); frame_mg(V3,s,e-s,l,t,w,h,fb,fr); swish(s)
    if bg=='paper': mg('backdrop',V1,s,e-s,0,0,1080,1920,{"paper":PAPER,"line":"#D9D6D1","accent":ACC})
    elif bg=='result': vid('final',V1,s,15.8,e-s,muted=True,**FULL)
# ---------- hook ----------
vid('take0001',V1,0,14.70,HOOK,muted=True,**ZOOM)
vid('reel',V2,0,5.15,128,left=560,top=700,width=400,height=711,fit="cover",decibelAdjustment=-6,audioFadeInDurationFrames=1,audioFadeOutDurationFrames=2)
frame_mg(V3,0,128,546,686,428,739,26,53)
mg('pill',V4,0,HOOK,260,40,560,120,{"text":"Cooked or Cracked?","ink":INK,"paper":"#FFFFFF"}); pop(2)
IN_MIN=int(round((8.55-5.15)*30))
stamp(IN_MIN,pos['STING'][0]-IN_MIN,"","IN MINUTES","video",box=(200,150,680,240),size=130,track=V5)
# Pynk's words as caption cards (whisper on the reel, source seconds -> frames from 5.15)
def rf(t): return int(round((t-5.15)*30))
PYNK=[("Which means you can now",[5.50,5.76,6.02,6.17,6.32]),("create viral motion graphics",[6.50,7.10,7.44,7.97]),("in minutes",[8.55,8.70])]
for gi,(txt,tt) in enumerate(PYNK):
    st=rf(tt[0]); en=rf(PYNK[gi+1][1][0]) if gi+1<len(PYNK) else HOOK
    mg('caption',V10,st,en-st,40,1430,1000,220,{"serif":"Fraunces","paper":PAPER,"ink":INK,"accent":ACC,"text":txt,"times":','.join(str(rf(t)-st) for t in tt),"size":54 if len(txt)>22 else 58})
# ---------- sting: hold without the turn (take0005 silent smile), title, teaser, episode stamp ----------
s,n=pos['STING']
vid('take0005',V1,s,62.10,90,muted=True,**FULL)
adds.append(dict(type="audio",assetId=A['sting'],trackId=JING,startFrame=s,sourceIn=0,durationFrames=69,decibelAdjustment=-8))
mg('jingle',V4,s,90,165,160,750,300,{"word1":"COOKED","word2":"OR","word3":"CRACKED?","beat1":6,"beat2":21,"beat3":28,"accent":ACC})
for b in (6,21,28): sfx('pop',s+b,-12,10)
vid('final',V2,s,42.6,90,muted=True,left=720,top=1000,width=315,height=560,fit="cover")
frame_mg(V3,s,90,706,986,343,588,26,53)
stamp(s+40,50,"easy motion graphics","IN 30 MINUTES","rocket",box=(40,1180,640,256),track=V5)
SPEECH0=s+90
# ---------- today / ask / arc / voice: full frame, typed strips over the chest + typing SFX ----------
def strip(label,text,cps,fs=42):
    s,e=beat(label.split('|')[0]); lab,txt=label.split('|')[1],text
    mg('strip',V4,s,e-s,90,1100,900,378,{"label":lab,"text":txt,"typeStart":3,"cpf":cps,"fontSize":fs,"paper":PAPER,"ink":INK,"accent":ACC}); pop(s); typing(s+3,int(len(txt)/cps)+6)
strip('today|in Claude Code',"/vox-animation",0.35,48)
strip('ask|the ask',"research the most controversial unsolved mystery cases in the world",0.9)
strip('arc|the arc',"end on the part people may never find out",0.8)
strip('voice|the voice',"a narrator that fits the mystery feel",0.7)
# ---------- higgs + stitch: mode A ----------
stamp(hs,ste-hs,"my generator","HIGGSFIELD + SEEDANCE 2.5","api",box=(40,130,1000,400),size=170,track=V6)
mg('strip',V4,hs,he-hs,90,1130,900,378,{"label":"the clips","text":"6 clips x 10 s on Higgsfield, Seedance 2.5, 720p","typeStart":3,"cpf":0.8,"fontSize":42,"paper":PAPER,"ink":INK,"accent":ACC}); pop(hs); typing(hs+3,60)
mg('loader',V4,sts,ste-sts+8,90,1130,900,234,{"cmd":"$ assemble.sh projects/amelia-earhart","doneText":"final.mp4  60 s  6 blocks","barStart":6,"barEnd":max(30,ste-sts-10),"paper":PAPER,"ink":INK,"accent":ACC}); sfx('whoosh',sts,-12,40)
# ---------- topics: mode B, icons pop fast, cursor tours all three, pulses, clicks Amelia ----------
t1=pos['topics.1'][0]; t3=pos['topics.3'][0]
xs=[40,395,750]; ytop=150
for i,(asset,px) in enumerate(zip(['icCooper','icAtlas','icAmelia'],[6,12,18])):
    f0=ts+px; rem=te-f0
    while rem>0:
        n=min(148,rem); vid(asset,GAL[i],f0,0.0,n,muted=True,left=xs[i],top=ytop,width=290,height=290,fit="cover"); f0+=n; rem-=n
    pop(ts+px)
hover1=word_frame('topics.1',2.44); like=word_frame('topics.3',8.36)
mg('picker',V4,ts,te-ts,40,ytop-20,1000,560,{"s1":"D.B. COOPER","s2":"3I/ATLAS","s3":"AMELIA","d1":"","d2":"","d3":"","p1":6,"p2":12,"p3":18,"hoverAt":hover1-ts,"dwell":32,"clickAt":like-ts,"pick":3,"border":False,"slotH":290,"paper":PAPER,"ink":INK,"accent":ACC})
for h in (hover1,hover1+42,hover1+84): click(h)
click(like); swish(like)
# ---------- styles: mode B, three renders with descriptors, cursor tours, clicks LAGOON ----------
for i,(asset,px) in enumerate(zip(['stArchive','stLagoon','stRadio'],[0,6,12])):
    img(asset,GAL[i],ss+px,se-(ss+px),xs[i],ytop,290,387); pop(ss+px)
solike=word_frame('style1',20.36); lag=pos['style2.2'][0]+3
mg('picker',V4,ss,se-ss,40,ytop-20,1000,560,{"s1":"ARCHIVE","s2":"LAGOON","s3":"RADIO","d1":"newsprint + files","d2":"paper sea diorama","d3":"1930s broadcast","p1":0,"p2":6,"p3":12,"hoverAt":solike-ss,"dwell":14,"clickAt":lag-ss,"pick":2,"border":True,"slotH":387,"paper":PAPER,"ink":INK,"accent":ACC})
for h in (solike,solike+24,solike+48): click(h)
click(lag); swish(lag)
# ---------- budget: mode B, loader over the chest + titled credits table above ----------
f70=word_frame('budget.2',30.60); f420=word_frame('budget.2',35.26); fbuf=word_frame('budget.3',38.02)
mg('credits2',V4,bs,be-bs,110,215,860,585,{"title":"video rendering options","h1":"1080p","h2":"720p","r1":"per clip","a1":"120","b1":"70","r2":"six clips","a2":"720","b2":"420","r3":"about","a3":"$23","b3":"$14","foot":"and buffer left for changes","p0":0,"p1":f70-bs,"p2":f420-bs-24,"p3":f420-bs+10,"p4":fbuf-bs,"paper":PAPER,"ink":INK,"accent":ACC})
sfx('whoosh',bs,-12,40); click(f70); click(f420-24); click(f420+10); pop(fbuf)
mg('loader',V11,bs,be-bs,150,1250,780,203,{"cmd":"$ seedance 2.5 · 6 clips · 720p","doneText":"6/6 clips ready","barStart":4,"barEnd":be-bs-12,"paper":PAPER,"ink":INK,"accent":ACC})
# ---------- done: mode B, stamp over the chest ----------
stamp(ds,de-ds,"render","DONE","video",box=(160,1180,760,304))
# ---------- result full frame ----------
vid('final',V1,rs,4.70,rn,decibelAdjustment=-6,**FULL); sfx('simple',rs,-12,24) if 'simple' in A else None
# ---------- reaction over the result: stamps just above the card ----------
tick=word_frame('verdict',16.21); f15=word_frame('receipts.1',9.13); f30=word_frame('receipts.3',12.69)
TOP=(140,420,800,320)
stamp(ws,f15-ws,"his claim","MINUTES, NOT DAYS","video",box=TOP)
stamp(f15,f30-f15,"cost","UNDER $15","money",box=TOP)
stamp(f30,tick-f30,"time","30 MINUTES","calendar",box=TOP)
stamp(tick,cs-tick,"verdict","CRACKED","trophy",accent=True,box=TOP)
mg('confetti',V6,tick,min(130,END-tick),0,0,1080,1920,{"paper":PAPER,"ink":INK,"accent":ACC,"extra":"#F2C14E","count":90}); sfx('ding',tick,-16,50)
stamp(cs,END-cs,"comment","AMELIA","comment",accent=True,box=TOP)
# ---------- scoreboard LEFT; off during the full-frame result ----------
mg('score',V5,SPEECH0,rs-SPEECH0,40,620,220,195,{"serif":"Fraunces","paper":PAPER,"ink":INK,"accent":ACC,"top":"COOKED","bottom":"CRACKED","tickAt":6000,"tickTop":False})
mg('score',V5,rs+rn,END-(rs+rn),40,620,220,195,{"serif":"Fraunces","paper":PAPER,"ink":INK,"accent":ACC,"top":"COOKED","bottom":"CRACKED","tickAt":tick-(rs+rn),"tickTop":False})
# ---------- overlap check per track ----------
by={}
for a in adds: by.setdefault(a['trackId'],[]).append((a['startFrame'],a['startFrame']+a['durationFrames'],a['type']))
bad=0
for t,lst in by.items():
    lst.sort()
    for (s1,e1,ty1),(s2,e2,ty2) in zip(lst,lst[1:]):
        if s2<e1: bad+=1; print('OVERLAP',t,(s1,e1,ty1),(s2,e2,ty2))
json.dump(adds,open('place-v5-adds.json','w')); json.dump(dict(pos=pos,END=END,ranges=ranges),open('place-v5-pos.json','w'))
print('END',END,f'{END/30:.1f}s','adds',len(adds),'overlaps',bad)
for k in ['intent','STING','today','ask','arc','voice','higgs','stitch','topics','style','budget','done','RESULT','wow','receipts','verdict','cta']:
    try: print(k, beat(k) if k not in pos else pos[k])
    except Exception as ex: print(k,'?',ex)
