#!/usr/bin/env python3
"""Ep6 placement v2 (2 Oct 2026, QA round 1 fixes on v1).
- Hook: Henry's own claim line at frame 0 ("He says that Claude + Seedance builds sites like this"), Nate's reel MUTED in the window cutting
  through his finished results every ~0.5 s (Ep2 rule), then "Let's try this", egg sting. Silent cold open and the 'wow' reaction removed.
- Henry's card covers to END (muted tail), 24 CREDITS stamp ends when the site's own headline appears, WhatsApp button lifted into view
  above the card (desktop take on BG2 over a #0C1013 fill), click SFX on 'click', bigger one-column receipt card.
Tracks are the new timeline 1bf165ae80."""
import json, re
FPS=30
cut=json.load(open('cut-ep6-v3.json')); items=cut['items']
for it in items:
    if it.get('label')=='hook.2': it['in']=55.00; it['frames']=27     # /s/ of 'sites' starts 55.04 (3 kHz scan)
W=[(a,b,t) for a,b,t in json.load(open('chatcut-words.json')) if not t.startswith('[')]
A=dict(take='06ee92e665',reel='74291b3c6d',desk='d6006b2474',mob='3dab26c0e3',tear='a1d08362af',rev='931f34028d',figma='acdcca3c9b',hero='9861f331b4',
       sting='05ceb95054',pop='47146b2911',click='1e38c75cf9',whoosh='82e8ce3761',riser='a852b666b7',boom='b865f17941',
       jingle='4a2f5d1f1f',score='8ba6a6eb88',pill='9529e2257e',frame='454f292f1d',stamp='607e7f52e6',confetti='6fa1636903',caption='a38210f407',backdrop='ab659d7829',save='83a7631d01')
V=dict(V1='06d630d029',BG2='56e7bc4a30',V2='51f5727c64',V3='0ca09e4546',V4='6d5caa92da',V5='17eb33bce5',V6='e79a82a620',V7='59e043bcf5',V8='4c840e568e',A1='ea9f606423',A2='40f91e932f',A3='62c24f521e',A4='dc94d2eb59')
INK="#171411"; ACC="#DF825F"; PAPER="#FFFEFA"
FULL=dict(left=0,top=0,width=1080,height=1920,fit="cover")
def us(t): return int(round(t*1e6))
adds=[]
def vid(asset,track,f,src,n,**kw): adds.append(dict(type="video",assetId=A[asset],trackId=V[track],startFrame=f,sourceIn=us(src),durationFrames=n,**kw))
def mg(asset,track,f,n,l,t,w,h,props): adds.append(dict(type="motion-graphic",assetId=A[asset],trackId=V[track],startFrame=f,durationFrames=n,left=l,top=t,width=w,height=h,keepAspectRatio=False,propertyOverrides=props))
sfx_used={k:[] for k in ('A2','A3','A4')}
def sfx(asset,f,db,n,src=0.0):
    if any(x.get('type')=='audio' and x['assetId']==A[asset] and abs(x['startFrame']-f)<3 for x in adds): return   # no stacked duplicates
    for t in ('A2','A3','A4'):
        if all(f>=e or f+n<=s for s,e in sfx_used[t]):
            sfx_used[t].append((f,f+n)); adds.append(dict(type="audio",assetId=A[asset],trackId=V[t],startFrame=f,sourceIn=us(src),durationFrames=n,decibelAdjustment=db)); return
    print('SFX dropped',asset,f)
def pop(f,db=-9): sfx('pop',f,db,10)
def swish(f): sfx('whoosh',f,-18,24)
def stamp(f,n,label,word,icon,accent=False):   # WHATSAPP clipped its last P at wordSize 150 (QA r2), so 118
    mg('stamp','V4',f,n,130,228,820,328,{"serif":"Fraunces","hand":"Kalam","paper":PAPER,"ink":INK,"accent":ACC,"wordColor":ACC if accent else INK,"label":label,"word":word,"wordSize":118 if word=="WHATSAPP" else 150,"icon":icon}); pop(f)
# ---------------- hook: Henry's claim line at 0:00, Nate's reel muted in the window ----------------
H0=0
WIN=(680,905,300,533)
pop(2)
caps=[]
# ---------------- walk the cut: wow (full frame), sting, then card B ----------------
f=H0; pos={}; speech=[]; mode='full'; STING=90; S0=None; prev=None
for k,it in enumerate(items):
    if 'spacer' in it:
        if prev and prev.startswith('try'): continue      # the sting replaces this breath
        n=it['spacer']; nxt=next((j for j in items[k+1:] if 'take' in j),None)
        last=speech[-1]; s_src=(last['src']+last['n']/30) if mode=='full' else ((nxt['in']-n/30) if nxt else 0)
        speech.append(dict(f=f,n=n,src=s_src,muted=True,mode=mode)); f+=n; continue
    lab=it['label']; base=lab.split('.')[0]
    if prev and prev.startswith('try') and not lab.startswith('try'):
        S0=f; f+=STING; mode='card'
    speech.append(dict(f=f,n=it['frames'],src=it['in'],muted=False,mode=mode,label=lab))
    pos.setdefault(base,[f,f]); pos[base][1]=f+it['frames']; prev=lab; f+=it['frames']
TAIL=12; last=speech[-1]; speech.append(dict(f=f,n=TAIL,src=last['src']+last['n']/30,muted=True,mode=mode)); END=f+TAIL
def wf(word_src):
    """timeline frame of a source time inside the placed speech"""
    for sp in speech:
        if not sp['muted'] and sp['src']-0.10<=word_src<sp['src']+sp['n']/30: return sp['f']+max(0,int(round((word_src-sp['src'])*30)))
    raise ValueError(word_src)
def word(text,after): 
    t=re.sub(r'[^a-z0-9$]','',text.lower())
    for a,b,w in W:
        if a>=after and re.sub(r'[^a-z0-9$]','',w.lower()).startswith(t): return a
    raise ValueError(text)
CB=dict(left=225,top=800,width=630,height=1120,fit="cover")
for sp in speech:
    kw=dict(muted=True) if sp['muted'] else dict(decibelAdjustment=0)
    if sp.get('label')=='biz.a': kw.update(audioFadeOutDurationFrames=2)
    if sp['mode']=='full': vid('take','V1',sp['f'],sp['src'],sp['n'],**kw,**FULL)
    else: vid('take','V2',sp['f'],sp['src'],sp['n'],**kw,**CB)
M0=S0+STING
mg('frame','V3',M0,END-M0,213,788,654,1144,{"border":12,"radius":26,"paper":"#FFFFFF"}); swish(M0)
# sting
vid('take','V1',S0,509.0,STING,muted=True,**FULL)
adds.append(dict(type="audio",assetId=A['sting'],trackId=V['A1'],startFrame=S0,sourceIn=0,durationFrames=72,decibelAdjustment=-8))
mg('jingle','V5',S0,STING,90,1062,900,360,{"word1":"COOKED","word2":"OR","word3":"CRACKED?","beat1":6,"beat2":21,"beat3":28,"accent":ACC,"gold":"#F2C14E"})
for b in (6,21,28): pop(S0+b,-12)
sfx('whoosh',S0+34,-14,24)
# hook window: Nate's reel MUTED, cutting through his finished results (Ep2: a new result every ~0.5 s)
CUTS=[(22.2,15),(10.2,15),(18.3,15),(19.3,15),(12.3,15),(20.3,15),(21.3,15),(13.1,0)]   # full-frame / split-screen results only; his site showcases sit on beige and read empty at window size (QA r1)
CUTS[-1]=(CUTS[-1][0],S0-sum(n for _,n in CUTS[:-1]))
fw=0
for src_t,n in CUTS:
    vid('reel','V2',fw,src_t,n,muted=True,left=WIN[0],top=WIN[1],width=WIN[2],height=WIN[3],fit="cover"); fw+=n
mg('frame','V3',0,S0,WIN[0]-12,WIN[1]-12,WIN[2]+24,WIN[3]+24,{"border":24,"radius":59,"paper":"#FFFFFF"})
mg('pill','V5',0,S0,190,232,700,150,{"text":"Cooked or Cracked?","ink":INK,"paper":"#FFFFFF"})
# ---------------- backgrounds per beat (V1, full frame) ----------------
def bg(asset,f0,f1,src,**kw):
    vid(asset,'V1',f0,src,f1-f0,muted=True,**(kw or FULL)); swish(f0)
B=lambda b: pos[b]
bg('hero',M0,B('figma')[0],0.0)
bg('figma',B('figma')[0],B('build')[0],0.0)
bg('desk',B('build')[0],B('seed')[0],2.5)
s_seed=B('seed')[0]; c_seed=wf(word('so',258.6))-6; d_seed=wf(word("it's",263.6))-6
bg('tear',s_seed,c_seed,0.0)
bg('rev',c_seed,d_seed,max(0.0,8.0-(d_seed-c_seed)/30))
bg('hero',d_seed,B('result')[0],0.0)
on_f=wf(word('on',302.8)); r0=B('result')[0]
bg('mob',r0,B('biz')[0],max(0.0,9.1-(on_f-r0)/30))
b1=wf(word('A',380.7))-6; b2=wf(word('They',432.1))-6
bg('desk',B('biz')[0],b1,10.2)
bg('desk',b1,b2,29.5)
mg('backdrop','V1',b2,B('cost')[0]-b2,0,0,1080,1920,{"paper":"#0C1013","line":"#0C1013","accent":"#0C1013"})
vid('desk','BG2',b2,48.6,B('cost')[0]-b2,muted=True,left=0,top=-599,width=3072,height=1920,fit="cover"); swish(b2)   # button lands at y 608-710, above the card (788)
sfx('click',wf(word('click',432.3)),-10,7)   # click asset is 0.24 s
mg('backdrop','V1',B('cost')[0],B('verdict')[0]-B('cost')[0],0,0,1080,1920,{"paper":PAPER,"line":"#D9D6D1","accent":ACC}); swish(B('cost')[0])
bg('hero',B('verdict')[0],B('cta')[0],3.0)
mg('backdrop','V1',B('cta')[0],END-B('cta')[0],0,0,1080,1920,{"paper":PAPER,"line":"#D9D6D1","accent":ACC}); swish(B('cta')[0])
# ---------------- stamps on the spoken words (top zone) ----------------
S=[]
def at(text,after,label,wordtxt,icon,accent=False): S.append((wf(word(text,after)),label,wordtxt,icon,accent))
at('Supersystems',60.5,'a real shop in Singapore','SUPERSYSTEMS','person')
at('523',62.5,'Google reviews','523 REVIEWS','check')
at('website',65.9,'but no','WEBSITE','none',True)
at('Figma',126.2,'step one','FIGMA','image')
at('Claude',128.8,'I didn\'t draw it','CLAUDE DID','plugin')
at('five',134.9,'their own photos','5 MINUTES','calendar')
at('Claude',191.7,'step two','CLAUDE CODE','plugin')
at('free',196.0,'his skill','FREE','check')
at('10',197.9,'build and checks','10 MINUTES','calendar')
at('Seed',206.2,'step three','SEEDANCE 2.5','video')
at('teardown',242.0,'my way','TEARDOWN','video')
at('flip',243.0,'then','FLIP IT','rocket',True)
at('real',260.9,'ends on their','REAL PHOTO','image')
at('24',264.4,'first try','24 CREDITS','money')
at('parts',279.9,'scroll and the','PC BUILDS','rocket')
at('power',302.0,'last part in','POWER ON','check',True)
at('3D',331.1,'no need for a','3D ARTIST','person')
at('customer',380.9,'customers see','EVERY BUILD','check')
at('WhatsApp',435.6,'one button to','WHATSAPP','comment',True)
COST_F=B('cost')[0]
VER_F=wf(word('correct',516.1))
at('correct',516.1,'verdict','CRACKED','trophy',True)
at('site',547.8,'comment','SITE','comment',True)
S.sort()
for i,(sf,label,wt,icon,acc) in enumerate(S):
    nf=S[i+1][0] if i+1<len(S) else END
    if sf<COST_F<=nf and wt!='CRACKED': nf=COST_F          # the save card takes the top zone during the costs
    for cut_at in (r0,b2):
        if sf<cut_at<nf: nf=cut_at                          # site headline / WhatsApp button need the top band
    stamp(sf,nf-sf,label,wt,icon,acc)
# save card: costs and time, held until the verdict
mg('save','V5',COST_F,VER_F-COST_F,70,226,940,500,{"title":"MY COST AND TIME","sub":"receipts, one shop, one evening","lines":"Client scan (Apify)  US$0.75|Instagram checks  US$0.03|Figma design  free plan|Seedance 2.5  24 credits|Site build  10 min|Total time  18 min","footerA":"screenshot this","footerB":"send it to a shop owner","serif":"Fraunces","hand":"Kalam","sans":"Inter","paper":PAPER,"ink":INK,"accent":ACC})
pop(COST_F)
# scoreboard: whole video after the sting, tick on the verdict word
mg('score','V6',M0,END-M0,70,735,300,265,{"serif":"Fraunces","paper":PAPER,"ink":INK,"accent":ACC,"top":"COOKED","bottom":"CRACKED","tickAt":VER_F-M0,"tickTop":False}); pop(M0+1)
# confetti on the verdict
mg('confetti','V8',VER_F,130,0,0,1080,1920,{"paper":PAPER,"ink":INK,"accent":ACC,"extra":"#F2C14E","count":90}); sfx('boom',VER_F,-20,20)
# ---------------- captions (Henry + Nate) ----------------
lines=[]; used=set()
for sp in speech:
    if sp['muted']: continue
    a=sp['src']; b=a+sp['n']/30
    ws=[]
    for i,(s0,e0,t) in enumerate(W):
        m=(s0+e0)/2
        if i not in used and a-0.08<=m<b+0.02 and s0<b-0.04:
            used.add(i); ws.append((sp['f']+max(0,int(round((s0-a)*30))),t))
    base=sp['label'].split('.')[0]
    if lines and lines[-1]['base']==base: lines[-1]['words']+=ws; lines[-1]['end']=sp['f']+sp['n']
    else: lines.append(dict(base=base,words=ws,end=sp['f']+sp['n']))
FIX={'Sitdance':'Seedance','CDANCE':'Seedance','80':'18','correct':'cracked','he':'He','build':'builds'}
for ln in lines:
    seq=[]
    for fr,t in ln['words']:
        tt=FIX.get(t,t)
        if seq and seq[-1][1].lower()=='seed' and t.lower().startswith('dance'): seq[-1]=(seq[-1][0],'Seedance'); continue
        if seq and seq[-1][1]=='Claude' and t.lower()=='seed': seq.append((fr,'+'))
        seq.append((fr,tt))
    sents=[];cur=[]
    for fr,t in seq:
        cur.append((fr,t))
        if re.search(r'[.,?!]$',t): sents.append(cur);cur=[]
    if cur: sents.append(cur)
    groups=[]
    for snt in sents:
        k=max(1,-(-len(snt)//4)); sz=-(-len(snt)//k)
        for j in range(0,len(snt),sz): groups.append(snt[j:j+sz])
    merged=[]
    for g in groups:
        if merged and len(g)==1 and len(merged[-1])<5: merged[-1]=merged[-1]+g
        else: merged.append(g)
    groups=merged
    if ln['base']=='hook':                                   # He says that / Claude + Seedance / builds sites like this
        flat=[x for g in groups for x in g]; groups=[flat[:3],flat[3:6],flat[6:]]
    for gi,g in enumerate(groups):
        st=g[0][0]; en=groups[gi+1][0][0] if gi+1<len(groups) else ln['end']+3
        caps.append((st,max(en,st+8),' '.join(re.sub(r'[,.]$','',w) for _,w in g).replace('Claude code','Claude Code'),[fr-st for fr,_ in g]))
caps.sort()
for i,(st,en,txt,tt) in enumerate(caps):
    if i+1<len(caps): en=min(en,caps[i+1][0])
    size=58 if len(txt)<=22 else 50 if len(txt)<=30 else 44
    mg('caption','V7',st,en-st,40,1430,1000,220,{"serif":"Fraunces","paper":PAPER,"ink":INK,"accent":ACC,"text":txt,"times":','.join(str(x) for x in tt),"size":size})
json.dump(adds,open('place-v2-adds.json','w'))
json.dump(dict(H0=H0,S0=S0,M0=M0,END=END,VER_F=VER_F,COST_F=COST_F,pos=pos,stamps=[(s[0],s[2]) for s in S],caps=[(c[0],c[2]) for c in caps]),open('place-v2-pos.json','w'),indent=1)
print('items',len(adds),'END',END,round(END/30,1),'s','sting',S0,'main',M0,'verdict',VER_F)
print(' | '.join(c[2] for c in caps))
