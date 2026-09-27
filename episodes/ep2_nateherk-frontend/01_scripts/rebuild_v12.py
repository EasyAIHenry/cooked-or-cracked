import json, sys, wave, math
import numpy as np
SP=sys.argv[1]
def load(p):
    w=wave.open(p); sr=w.getframerate(); return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768, sr
A={"t1":load(SP+"/audio/take1.wav"),"t2":load(SP+"/audio/take2.wav")}
THR={}
for k,(a,sr) in A.items():
    fr=a[:len(a)//160*160].reshape(-1,160); THR[k]=np.percentile(20*np.log10(np.sqrt((fr**2).mean(1))+1e-9),10)+12
def db(k,t,win=0.02):
    a,sr=A[k]; s=int((t-win/2)*sr); e=int((t+win/2)*sr); seg=a[max(0,s):e]; return 20*np.log10(np.sqrt(np.mean(seg**2))+1e-9) if len(seg) else -120
def send(k,t0,t1):
    t=t1
    while t>t0 and db(k,t-0.01)<THR[k]: t-=0.005
    return t
# key, take, tin, tout, flags (S sentence end, fi keep-in + fade, fo keep-out + fade, M muted breath, P take1 punch)
SEG=[
 ("hook","t2",8.88,12.513,"S"),("test","t2",12.54,14.34,"S"),
 ("shop","t1",122.868,129.501,"S P"),("repos","t2",20.28,25.90,"S"),("sp9","t2",25.90,26.20,"M"),
 ("nicely","t2",99.46,102.323,"fi S"),
 ("whynot","t2",116.16,117.727,""),("higgs","t2",117.84,120.95,"S NC"),
 ("believe","t2",131.12,132.353,""),("forme","t2",133.155,134.688,"fo"),("sp7","t2",134.688,134.955,"M"),
 ("swirls","t2",137.36,140.228,""),("perfectly","t2",140.285,140.952,"fo"),("sp2","t2",140.952,141.185,"M"),
 ("takesvideo","t2",144.30,147.833,"fi S"),("splices","t2",148.379,155.012,"S"),
 ("million","t2",157.99,161.957,""),("cracked","t2",161.98,166.07,"S"),
 ("spice","t1",227.62,232.06,"fo P"),("sp8","t1",232.06,232.36,"M"),
 ("order","t2",189.70,192.20,"fo"),("cup","t1",354.55,357.95,"S P"),  ("sixty","t2",277.68,286.11,"fo"),("last","t2",289.30,296.628,"fi S"),
 ("biz","t2",226.30,228.44,"fo"),("giveyou","t2",239.40,242.94,"fi fo"),("sp4","t2",242.945,243.245,"M"),
 ("afterwards","t2",247.52,249.42,""),("m250","t2",249.42,252.52,"S"),
 ("verdict","t2",167.22,169.88,"fi S"),("cta","t2",334.89,338.257,"S"),
]
TAIL={"verdict":0.35,"believe":0.20,"putit":0.16,"intoclaude":0.16,"spice":0.14,"sixty":0.10}
def speech_mask(k,t0,t1):
    ts=np.arange(t0,t1,0.01); return ts,np.array([db(k,t+0.005,0.01)>THR[k] for t in ts])
segs=[]
for key,k,tin,tout,fl in SEG:
    if "M" in fl: segs.append(dict(key=key,take=k,tin=tin,dur=int(round((tout-tin)*30)),fl=fl)); continue
    se=send(k,tin,tout); tail=TAIL.get(key,0.24 if "S" in fl else 0.10)
    ntout=tout if "fo" in fl else min(tout,se+tail)
    ts,m=speech_mask(k,tin,ntout)
    if "fi" not in fl and m.any():
        st=ts[np.argmax(m)]
        if st-tin>0.15: tin=st-0.08
    ts,m=speech_mask(k,tin,ntout)
    if "NC" in fl: m=np.ones_like(m)
    else: m=np.array([db(k,t+0.005,0.01)>THR[k]-6 for t in ts]) if len(ts) else m
    # silent runs >=0.30 s strictly inside speech -> keep 0.10 s each side
    cuts=[]; i=0; n=len(m)
    idx=np.where(m)[0]
    if len(idx):
        a0,a1=idx[0],idx[-1]; i=a0
        while i<a1:
            if not m[i]:
                j=i
                while j<a1 and not m[j]: j+=1
                if (j-i)*0.01>=0.35: cuts.append((ts[i]+0.10,ts[j]-0.10))
                i=j
            else: i+=1
    pieces=[]; cur=tin
    for c0,c1 in cuts: pieces.append((cur,c0)); cur=c1
    pieces.append((cur,ntout))
    for pi,(p0,p1) in enumerate(pieces):
        f=fl
        if pi>0: f=f.replace("fi","")
        if pi<len(pieces)-1: f=f.replace("fo","")
        segs.append(dict(key=key if len(pieces)==1 else f"{key}#{pi}",base=key,take=k,tin=p0,dur=int(round((p1-p0)*30)),fl=f))
T={"V1":"d7595c8e-84c8-4591-8ffc-0e656e97b2df","V2":"5a47acef-e703-4829-8602-b05cde7f5cbe","V3":"9249631a-a811-4dd0-afc5-986b89cb5257","V4":"fe8322bf-438a-4bae-94b6-44b9190f0268","V5":"8635223e-6dfe-4082-b0d7-fb164cda3afa","V6":"8555775f-8fc7-4628-921d-cab5567e4ece","V7":"be771951-825b-4de5-b969-9b698b2ee57a","A1":"8b2ba879-d37c-494c-992e-e9e735d5db4d"}
AS={"t1":"f7bd70fd63","t2":"58319e2ea9","nate":"f2031d8f4d","pipe":"10ae5d6113","sting":"22f8bc2a57","title":"35c181939a","pill":"981c184252","frame":"c8cdd10a26","gh1":"621a890bd2","gh2":"5661d58a1e","gh3":"63c859330a","gh4":"7278e05420","gh5":"d56fd4f915","shops":"9be3241665","maps":"0272aa0290","logo":"71a10837c6","grid":"d8f3016274","bkp":"449a1033d9","bkh":"486bd61938","bk7":"a74b7c3e99","b3":"5f4a85a02a","b4":"493ad7359e","b5":"8e50e3aa69","v03":"35ee680dee","v04":"4f88613b00","v05":"503d791caa","v06":"084bba7bad","v07":"920b3890c8"}
adds=[]
def add(track,asset,start,dur,**kw):
    d={"type":kw.pop("type","video"),"assetId":AS[asset],"trackId":T[track],"startFrame":int(start),"durationFrames":int(dur)}; d.update(kw); adds.append(d)
FACE2=dict(left=-54,top=-96,width=1188,height=2112)
FACE1=dict(left=-54,top=-96,width=1188,height=2112)
LAST_TEST=[x["key"] for x in segs if x.get("base",x["key"])=="test"][-1]
T2_GAP=0.256
PREV=[None]
frame=0; pos={}; PIECES=[]
def tl(key,t):
    for b,t0,f0,d in PIECES:
        if b==key and t0<=t<=t0+d/30: return f0+int(round((t-t0)*30))
    raise KeyError((key,t))
add("V1","t2",0,104,sourceIn=2400000,decibelAdjustment=-60,**FACE2); frame=104
for s in segs:
    # take2.MP4 has a 0.256 s hole in its audio timestamps at 66.88 s; our wav closes it, ChatCut plays it.
    kw={"sourceIn":int(round((s["tin"]+(T2_GAP if s["take"]=="t2" and s["tin"]>66.88 else 0))*1e6))}
    if "fi" in s["fl"]: kw["audioFadeInDurationFrames"]=1
    if "fo" in s["fl"]: kw["audioFadeOutDurationFrames"]=1
    if "M" in s["fl"]:
        # still hold of the previous clip's last frame, so the mouth doesn't move in silence
        pv=PREV[0]; pe=pv["tin"]+pv["dur"]/30-0.04
        kw["sourceIn"]=int(round((pe+(T2_GAP if pv["take"]=="t2" and pe>66.88 else 0))*1e6)); kw["playbackRate"]=0.1; kw["decibelAdjustment"]=-60
    kw.update(FACE1 if s["take"]=="t1" else FACE2)
    add("V1",s["take"],frame,s["dur"],**kw)
    if "M" not in s["fl"]: PREV[0]=s
    b=s.get("base",s["key"]); pos[b]=(pos[b][0] if b in pos else frame,frame+s["dur"]); PIECES.append((b,s["tin"],frame,s["dur"])); frame+=s["dur"]
    if s["key"]==LAST_TEST:
        add("V1","t2",frame,78,sourceIn=int(round((s["tin"]+s["dur"]/30)*1e6)),decibelAdjustment=-60,**FACE2)
        add("V7","title",frame,75,type="motion-graphic",left=40,top=140,width=1000,height=400,propertyOverrides={"word1":"COOKED","word2":"OR","word3":"CRACKED?","beat1":6,"beat2":21,"beat3":28,"accent":"#DF825F"})
        add("A1","sting",frame,78,type="audio",sourceIn=0,volume=0.56)
        frame+=78
TOTAL=frame
add("V5","nate",0,104,sourceIn=0,left=580,top=905,width=360,height=640,borderRadius=20,volume=0.54,audioFadeOutDurationFrames=3)
add("V6","frame",0,104,type="motion-graphic",keepAspectRatio=False,left=572,top=897,width=376,height=656,propertyOverrides={"border":12,"radius":28,"paper":"#FFFFFF"})
add("V7","pill",0,104,type="motion-graphic",left=190,top=240,width=700,height=150,propertyOverrides={"text":"Cooked or Cracked?","ink":"#171411","paper":"#FFFFFF"})
def span(k0,k1=None): return pos[k0][0], pos[k1 or k0][1]
WIN=dict(left=48,top=150,width=300,height=533,borderRadius=18)
def window(asset,f0,f1,src,rate=None):
    kw=dict(sourceIn=int(round(src*1e6)),**WIN)
    if rate: kw["playbackRate"]=rate
    if asset=="pipe": kw["decibelAdjustment"]=-60
    add("V4",asset,f0,f1-f0,**kw)
def frame_mg(f0,f1): add("V6","frame",f0,f1-f0,type="motion-graphic",keepAspectRatio=False,left=40,top=142,width=316,height=549,propertyOverrides={"border":12,"radius":28,"paper":"#FFFFFF"})
CARD={"gh":(1060,781),"shops":(1060,590),"maps":(820,1046),"logo":(760,760),"grid":(1060,941),"bkp":(1060,628),"bkh":(1060,750),"bk7":(1060,1093)}
def card(asset,f0,f1,rot,kind,cy=1225,video=None,vsrc=0,vrate=None,maxh=620,maxw=1000):
    W,H=CARD[kind]; sc=min(1.0,maxh/H,maxw/W); w,h=round(W*sc),round(H*sc)
    add("V3",asset,f0,f1-f0,type="image",left=round(540-w/2),top=round(cy-h/2),width=w,height=h,rotation=rot)
    if video:
        vw,vh=round((W-120)*sc),round((H-120)*sc)
        kw=dict(sourceIn=int(round(vsrc*1e6)),left=round(540-w/2+60*sc),top=round(cy-h/2+60*sc),width=vw,height=vh,rotation=rot,keepAspectRatio=False)
        if vrate: kw["playbackRate"]=vrate
        add("V4",video,f0,f1-f0,**kw)
# shop line cards
f0,f1=span("shop"); L=f1-f0
TOPC=dict(cy=292,maxh=330,maxw=900)  # top centre, above the head, inside the safe zone
card("logo",f0,f0+int(L*0.45),1.5,"logo",**TOPC); card("maps",f0+int(L*0.45),f1,-1.5,"maps",**TOPC)
f0,f1=span("repos"); n=f1-f0
for i,(g,r) in enumerate([("gh1",-1.5),("gh2",1.2),("gh3",-1.0),("gh4",1.5),("gh5",-1.2)]):
    card(g,f0+i*n//5,f0+(i+1)*n//5 if i<4 else f1,r,"gh",**TOPC)
f0,f1=span("nicely"); window("b4",f0,f1,0,rate=round(min(1.0,3.66/((f1-f0)/30)),3)); frame_mg(f0,f1)
f0,f1=span("whynot","higgs"); card("bkh",f0,f1,1.2,"bkh",video="b5",vrate=round(min(1.0,2.5/((f1-f0)/30))-0.005,3))
f0,f1=span("swirls","perfectly"); window("v04",f0,f1,57.3); frame_mg(f0,f1)
f0,f1=span("sp2","takesvideo"); window("pipe",f0,f1,1.3); frame_mg(f0,f1)
f0,f1=span("splices"); m=f0+int((f1-f0)*0.4); card("grid",f0,m,-1.0,"grid"); window("v05",m,f1,14.2); frame_mg(m,f1)
f0,_=span("million"); f1=min(pos["cracked"][0]+57,pos["cracked"][1]); card("bk7",f0,f1,0.8,"bk7",video="v07",vsrc=5.8)
f0,f1=span("spice","sp8"); window("v03",f0,f1,0.0); frame_mg(f0,f1)
f0,f1=span("order"); window("v06",f0,f1,6.8); frame_mg(f0,f1)
f0,f1=span("cup"); window("v06",f0,f1,13.0); frame_mg(f0,f1)
json.dump({"adds":adds,"segs":segs,"pos":pos,"total":TOTAL},open(SP+"/p2/v12_payload.json","w"))
print("TOTAL",TOTAL,"= %.1f s"%(TOTAL/30),"adds",len(adds))
for b,t0,f0,d in PIECES: print(f"{b:11s} {t0:8.3f} {d:4d}f @{f0/30:6.2f}s")
