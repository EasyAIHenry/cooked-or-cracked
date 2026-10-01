#!/usr/bin/env python3
"""Pass 3 placement: shortened cut (cut-ep5-v3.json), explainer framing, Higgsfield icons, credits table, result-as-background, SFX."""
import json, sys
sys.path.insert(0,'.')
from build_cut import env, sil_thr
cut=json.load(open('cut-ep5-v3.json')); items=cut['items']
A={'take0001':'712f2db1d8','take0003':'49603afbea','take0004':'47e07a6d54','take0005':'37c8441249','take0006':'66594ce81e','take0008':'704e625793','take0011':'3db6c46f5c','take0012':'10d81ea802','take0015':'4a74e58105','take0016':'e9e734e731',
   'final':'ba9e6b0070','reel':'1f7d127bb5','sting':'10b1975108','pop':'7f30ed40ce','click':'726d10a028','ding':'3ebb484d2c','whoosh':'517a402cc7',
   'skA':'5cb4958537','stArchive':'55469ba5cf','stRadio':'dbe8e9238b','stLagoon':'200633942a','icCooper':'535b7914a4','icAtlas':'4f6a70d1bd','icAmelia':'f8f0cf386b',
   'pill':'b24189e823','frame':'801c4edd67','jingle':'8a7de95372','stamp':'ab781ea4e2','tags':'d8be38e27c','score':'5a6b6900ee','confetti':'862f4ed791','strip':'01f304d485','topics':'084f933412','styles':'997b0379a5','loader':'e891d19b8f',
   'backdrop':'37892ea06e','credits':'e41b1098b7','thumbs':'f64397accf'}
V1='ece067afb6'; V2='85892c25d6'; V3='21a283596c'; V4='def8a9e889'; V5='115a36a776'; V6='79113b45fd'; V7='cc3e9688bd'; GAL=['cc3e9688bd','af1ec36eea','a762989c74']; JING='834c492e62'; SFX='54e0609d33'; SFX_TRACKS=['54e0609d33','5508fad823','d5526336e4']; sfx_used={t:[] for t in SFX_TRACKS}
# V0 for the backdrop / background result must sit UNDER V1: we use V1 for backdrop/result-bg and put Henry on V2 during explainer beats.
FULL=dict(left=0,top=0,width=1080,height=1920,fit="cover")
INK="#171411"; ACC="#DF825F"; PAPER="#FFFEFA"
def us(t): return int(round(t*1e6))
adds=[]
def vid(asset,track,f,src,n,**kw): adds.append(dict(type="video",assetId=A[asset],trackId=track,startFrame=f,sourceIn=us(src),durationFrames=n,**kw))
def img(asset,track,f,n,l,t,w,h): adds.append(dict(type="image",assetId=A[asset],trackId=track,startFrame=f,durationFrames=n,left=l,top=t,width=w,height=h,fit="cover"))
def mg(asset,track,f,n,l,t,w,h,props): adds.append(dict(type="motion-graphic",assetId=A[asset],trackId=track,startFrame=f,durationFrames=n,left=l,top=t,width=w,height=h,keepAspectRatio=False,propertyOverrides=props))
def sfx(asset,f,db,n):
    for t in SFX_TRACKS:
        if all(f>=e or f+n<=s for s,e in sfx_used[t]):
            sfx_used[t].append((f,f+n)); adds.append(dict(type="audio",assetId=A[asset],trackId=t,startFrame=f,sourceIn=0,durationFrames=n,decibelAdjustment=db)); return
    print('SFX dropped (no free track)',asset,f)
def pop(f): sfx('pop',f,-9,10)
def click(f): sfx('click',f,-9,7)
def stamp(f,n,label,word,icon,accent=False,box=(160,1130,760,304),track=None):
    props={"serif":"Fraunces","hand":"Kalam","paper":PAPER,"ink":INK,"accent":ACC,"wordColor":ACC if accent else INK,"label":label,"word":word,"wordSize":150,"icon":icon}
    l,t,w,h=box; mg('stamp',track or V4,f,n,l,t,w,h,props); pop(f)
def frame_mg(track,f,n,l,t,w,h,border,radius): mg('frame',track,f,n,l,t,w,h,{"border":border,"radius":radius,"paper":"#FFFFFF"})
# ---------- walk the cut ----------
pos={}; f=0; prev=None; order=[]; HOOK=132
speech=[]  # (start, frames, take, in) for Henry items (to re-layout per beat)
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
# ---------- framing modes per timeline range ----------
# mode 'full': Henry full frame on V1.  mode 'A' (0.78) / 'B' (0.60): paper backdrop on V1, Henry card on V2 with frame on V3, graphics above.
CARD={'A':dict(l=119,t=422,w=842,h=1498,fb=9,fr=20), 'B':dict(l=216,t=768,w=648,h=1152,fb=12,fr=26)}
def card_frame(m): c=CARD[m]; return (c['l']-12,c['t']-12,c['w']+24,c['h']+24,c['fb'],c['fr'])
ranges=[]  # (start,end,mode,bg) bg: None | 'paper' | 'result'
hs,he=beat('higgs'); ranges.append((hs,he,'A','paper'))
ts,te=beat('topics'); ss,se=beat('style'); bs,be=beat('budget'); ranges.append((ts,be,'B','paper'))
ws,we=beat('wow'); cs,ce=beat('cta'); rs,rn=pos['RESULT']; ranges.append((ws,ce,'B','result'))
def mode_at(fr):
    for s,e,m,bg in ranges:
        if s<=fr<e: return m
    return 'full'
# place Henry speech items with the framing of their beat
for sp in speech:
    m=mode_at(sp['f'])
    kw=dict(muted=True) if sp['muted'] else dict(decibelAdjustment=0)
    if m=='full': vid(sp['take'],V1,sp['f'],sp['src'],sp['n'],**kw,**FULL)
    else:
        c=CARD[m]; vid(sp['take'],V2,sp['f'],sp['src'],sp['n'],left=c['l'],top=c['t'],width=c['w'],height=c['h'],fit="cover",**kw)
# backdrops, card frames per range
for s,e,m,bg in ranges:
    l,t,w,h,fb,fr=card_frame(m); frame_mg(V3,s,e-s,l,t,w,h,fb,fr)
    if bg=='paper': mg('backdrop',V1,s,e-s,0,0,1080,1920,{"paper":PAPER,"line":"#D9D6D1","accent":ACC})
    elif bg=='result': vid('final',V1,s,15.8+(s-ws)/30,e-s,muted=True,**FULL)   # continues from where the full-frame result stopped
# ---------- hook (tight framing) ----------
vid('take0001',V1,0,14.70,HOOK,muted=True,left=-191,top=-339,width=1271,height=2259,fit="cover")
# re-frame the intent + breath items placed above (take0001 within 132..194)
for a in adds:
    if a.get('type')=='video' and a['assetId']==A['take0001'] and 132<=a['startFrame']<194: a.update(left=-191,top=-339,width=1271,height=2259)
vid('reel',V2,0,5.15,128,left=620,top=850,width=315,height=560,fit="cover",decibelAdjustment=-8,audioFadeInDurationFrames=1,audioFadeOutDurationFrames=2)
frame_mg(V3,0,128,606,836,343,588,26,53)
mg('pill',V4,0,HOOK,260,105,560,120,{"text":"Cooked or Cracked?","ink":INK,"paper":"#FFFFFF"}); pop(2)
s,e=beat('intent'); stamp(s,pos['STING'][0]-s,"his claim","VOX IN MINUTES","video")
# ---------- sting ----------
s,n=pos['STING']
vid('take0001',V1,s,31.20,90,muted=True,**FULL)
adds.append(dict(type="audio",assetId=A['sting'],trackId=JING,startFrame=s,sourceIn=0,durationFrames=69,decibelAdjustment=-8))
mg('jingle',V4,s,90,165,160,750,300,{"word1":"COOKED","word2":"OR","word3":"CRACKED?","beat1":6,"beat2":21,"beat3":28,"accent":ACC})
for b in (6,21,28): sfx('pop',s+b,-12,10)
vid('final',V2,s,42.6,90,muted=True,left=720,top=1000,width=315,height=560,fit="cover")
frame_mg(V3,s,90,706,986,343,588,26,53)
stamp(s+40,50,"easy motion graphics","IN 30 MINUTES","rocket",box=(40,1180,640,256),track=V5)
SPEECH0=s+90
# ---------- install / ask / arc / voice: full frame, typed cards over the chest ----------
s,e=beat('install'); mg('strip',V4,s,e-s,90,1100,900,378,{"label":"in Claude Code","text":"/vox-animation","typeStart":4,"cpf":0.5,"fontSize":48,"paper":PAPER,"ink":INK,"accent":ACC}); pop(s)
s,e=beat('ask'); mg('strip',V4,s,e-s,90,1100,900,378,{"label":"the ask","text":"the most controversial unsolved mystery cases in the world","typeStart":2,"cpf":1.0,"fontSize":42,"paper":PAPER,"ink":INK,"accent":ACC}); pop(s)
s,e=beat('arc'); mg('strip',V4,s,e-s,90,1100,900,378,{"label":"the arc","text":"from the start to the cliffhanger. end on what we may never know","typeStart":2,"cpf":1.1,"fontSize":42,"paper":PAPER,"ink":INK,"accent":ACC}); pop(s)
s,e=beat('voice'); mg('strip',V4,s,e-s,90,1100,900,378,{"label":"the voice","text":"a narrator that fits the mystery feel","typeStart":2,"cpf":0.7,"fontSize":42,"paper":PAPER,"ink":INK,"accent":ACC}); pop(s)
# ---------- higgs: mode A, stamp above the head ----------
stamp(hs,he-hs,"my generator","HIGGSFIELD + SEEDANCE 2.5","api",box=(140,110,800,320))
# ---------- stitch: loader over the chest (full frame) ----------
s,e=beat('stitch'); mg('loader',V4,s,e-s+8,90,1130,900,234,{"cmd":"$ assemble.sh projects/amelia-earhart","doneText":"final.mp4  60 s  6 blocks","barStart":6,"barEnd":max(30,e-s-10),"paper":PAPER,"ink":INK,"accent":ACC}); sfx('whoosh',s,-12,40)
# ---------- topics: mode B, three Higgsfield icon animations above the head, cursor picks Amelia ----------
t2=pos['topics.2'][0]; t3=pos['topics.3'][0]
ICON=(290,290); xs=[40,395,750]; ytop=130
for i,(asset,px) in enumerate(zip(['icCooper','icAtlas','icAmelia'],[t2-ts,t2-ts+12,t2-ts+24])):
    vid(asset,GAL[i],ts+px,0.0,te-(ts+px),muted=True,left=xs[i],top=ytop,width=ICON[0],height=ICON[1],fit="cover")
mg('thumbs',V4,ts,te-ts,40,ytop-20,1000,520,{"s1":"D.B. COOPER","s2":"3I/ATLAS","s3":"AMELIA","p1":t2-ts,"p2":t2-ts+12,"p3":t2-ts+24,"pick":3,"hoverAt":t3-ts-20,"clickAt":t3-ts+12,"paper":PAPER,"ink":INK,"accent":ACC})
for px in (t2,t2+12,t2+24): pop(px)
click(t3+12)
# ---------- styles: mode B, three style renders above the head, cursor picks lagoon ----------
s2=pos['style2.1'][0]; lagoon=word_frame('style2.1',9.86)
for i,(asset,px) in enumerate(zip(['stArchive','stLagoon','stRadio'],[0,8,16])):
    img(asset,GAL[i],ss+px,se-(ss+px),xs[i],ytop,290,387)
mg('thumbs',V4,ss,se-ss,40,ytop-20,1000,520,{"s1":"ARCHIVE","s2":"LAGOON","s3":"RADIO","p1":0,"p2":8,"p3":16,"pick":2,"hoverAt":s2-ss,"clickAt":max(s2-ss+10,lagoon-ss),"paper":PAPER,"ink":INK,"accent":ACC})
for px in (0,8,16): pop(ss+px)
click(max(s2+10,lagoon))
# ---------- budget: mode B, credits table above the head ----------
f70=word_frame('budget.2',30.44); f420=word_frame('budget.2',35.26)
mg('credits',V4,bs,be-bs,90,120,900,558,{"h1":"1080p","h2":"720p","r1":"per clip","a1":"120","b1":"70","r2":"six clips","a2":"720","b2":"420","r3":"about","a3":"$23","b3":"$14","foot":"saved 300 credits, about $10","p0":0,"p1":f70-bs,"p2":f420-bs-30,"p3":f420-bs+8,"p4":f420-bs+40,"paper":PAPER,"ink":INK,"accent":ACC})
sfx('whoosh',bs,-12,40); click(f70); click(f420-30); click(f420+8); pop(f420+40)
# ---------- done: full frame, stamp over the chest ----------
s,e=beat('done'); stamp(s,e-s,"render","DONE","video")
# ---------- result: full frame from "Amelia Earhart spoke her last words" ----------
vid('final',V1,rs,4.70,rn,decibelAdjustment=-6,**FULL)
# ---------- reaction over the result background (mode B): stamps above the head ----------
tick=word_frame('verdict',16.21); f15=word_frame('receipts.1',9.13); f30=word_frame('receipts.3',12.69)
TOP=(140,110,800,320)
stamp(ws,f15-ws,"his claim","MINUTES, NOT DAYS","video",box=TOP)
stamp(f15,f30-f15,"cost","UNDER $15","money",box=TOP)
stamp(f30,tick-f30,"time","30 MINUTES","calendar",box=TOP)
stamp(tick,cs-tick,"verdict","CRACKED","trophy",accent=True,box=TOP)
mg('confetti',V6,tick,min(130,END-tick),0,0,1080,1920,{"paper":PAPER,"ink":INK,"accent":ACC,"extra":"#F2C14E","count":90}); sfx('ding',tick,-16,50)
stamp(cs,END-cs,"comment","AMELIA","comment",accent=True,box=TOP)
# ---------- scoreboard on the LEFT wall; off during the full-frame result ----------
mg('score',V5,SPEECH0,rs-SPEECH0,40,620,220,195,{"serif":"Fraunces","paper":PAPER,"ink":INK,"accent":ACC,"top":"COOKED","bottom":"CRACKED","tickAt":6000,"tickTop":False})
mg('score',V5,rs+rn,END-(rs+rn),40,620,220,195,{"serif":"Fraunces","paper":PAPER,"ink":INK,"accent":ACC,"top":"COOKED","bottom":"CRACKED","tickAt":tick-(rs+rn),"tickTop":False})
json.dump(adds,open('place-v3-adds.json','w'))
print('END',END,f'{END/30:.1f}s','adds',len(adds))
for k in ['intent','STING','install','ask','arc','voice','higgs','stitch','topics','style','budget','done','RESULT','wow','receipts','verdict','cta']:
    try: print(k, beat(k) if k not in pos else pos[k])
    except Exception as ex: print(k,'?',ex)
