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
def sstart(k,t0,t1):
    t=t0
    while t<t1 and db(k,t+0.01)<THR[k]: t+=0.005
    return t
def send(k,t0,t1):
    t=t1
    while t>t0 and db(k,t-0.01)<THR[k]: t-=0.005
    return t
# (key, take, tin, tout, flags) flags: S sentence-final, fi fade-in start (keep tin), fo fade-out (keep tout), P punch-in
SEG=[
 ("hook","t2",8.88,12.513,"S"),("test","t2",12.54,14.34,"S"),
 ("shop","t1",122.868,129.501,"S"),("putit","t1",143.76,145.827,""),("intoclaude","t1",146.24,147.673,""),("connectors","t1",147.84,151.573,"S"),
 ("notbad","t2",98.5097,99.043,"fi"),("sp1","t2",99.043,99.243,"M"),("nicely","t2",99.39,102.323,"S"),("whynot","t2",116.16,117.727,""),("higgs","t2",117.84,118.807,"S"),
 ("crazy","t2",128.08,130.047,""),("believe","t2",131.12,132.353,""),("forme","t2",133.155,134.688,"fo"),
 ("swirls","t2",137.36,140.228,""),("perfectly","t2",140.285,140.952,"fo"),("sp2","t2",140.952,141.185,"M"),
 ("takesvideo","t2",144.30,147.833,"fi S"),("splices","t2",148.379,155.012,"S"),
 ("million","t2",157.99,161.957,""),("cracked","t2",161.98,169.88,"S"),
 ("order","t2",189.70,195.967,"S"),("toppings","t2",197.075,202.008,"S"),
 ("pos","t2",214.91,228.977,""),("onewill","t2",229.15,231.017,""),("peoples","t2",231.23,232.83,""),("improve","t2",232.99,235.09,"S"),
 ("numbertwo","t2",235.15,236.417,""),("giveyou","t2",236.812,242.945,"S"),("afterwards","t2",247.52,249.42,""),("m250","t2",249.42,252.52,"S"),
 ("sixty","t2",277.68,283.28,""),("twenty","t2",289.695,296.628,"fi S"),("score","t1",416.57,420.57,"S P"),("cta","t2",334.89,338.257,"S"),
]
segs=[]
for key,k,tin,tout,fl in SEG:
    TAIL={"believe":0.20,"putit":0.16,"intoclaude":0.16,"pos":0.18,"sixty":0.18}
    if "M" in fl:
        segs.append(dict(key=key,take=k,tin=tin,dur=int(round((tout-tin)*30)),fl=fl)); continue
    ss=sstart(k,tin,tout); se=send(k,tin,tout)
    ntin=tin
    KEEP={"hook","swirls","order","afterwards","giveyou","cta","crazy","believe"}
    if "fi" not in fl and key not in KEEP and ss-tin>0.20: ntin=ss-0.15
    tail=TAIL.get(key, 0.20 if "S" in fl else 0.08)
    ntout=tout if "fo" in fl else min(tout,se+tail)
    d=int(round((ntout-ntin)*30))
    segs.append(dict(key=key,take=k,tin=ntin,dur=d,fl=fl))
# assemble V1 with opener and sting hold
T={"V1":"d7595c8e-84c8-4591-8ffc-0e656e97b2df","V2":"5a47acef-e703-4829-8602-b05cde7f5cbe","V3":"9249631a-a811-4dd0-afc5-986b89cb5257","V4":"fe8322bf-438a-4bae-94b6-44b9190f0268","V5":"8635223e-6dfe-4082-b0d7-fb164cda3afa","V6":"8555775f-8fc7-4628-921d-cab5567e4ece","V7":"be771951-825b-4de5-b969-9b698b2ee57a","A1":"8b2ba879-d37c-494c-992e-e9e735d5db4d"}
A_={"t1":"f7bd70fd63","t2":"58319e2ea9","nate":"f2031d8f4d","pipe":"10ae5d6113","sting":"22f8bc2a57","title":"35c181939a","pill":"981c184252","frame":"c8cdd10a26","paper":"616877b341","gh1":"621a890bd2","gh2":"5661d58a1e","gh3":"63c859330a","gh4":"7278e05420","gh5":"d56fd4f915","shops":"9be3241665","maps":"0272aa0290","logo":"71a10837c6","grid":"d8f3016274","bkp":"449a1033d9","bkh":"486bd61938","bk7":"a74b7c3e99","b3":"5f4a85a02a","b4":"493ad7359e","b5":"8e50e3aa69","v04":"4f88613b00","v05":"503d791caa","v06":"084bba7bad","v07":"920b3890c8"}
adds=[]
def add(track,asset,start,dur,**kw):
    d={"type":kw.pop("type","video"),"assetId":A_[asset],"trackId":T[track],"startFrame":int(start),"durationFrames":int(dur)}; d.update(kw); adds.append(d)
frame=0; pos={}
add("V1","t2",0,104,sourceIn=2400000,decibelAdjustment=-60); frame=104
for s in segs:
    kw={"sourceIn":int(round(s["tin"]*1e6))}
    if "fi" in s["fl"]: kw["audioFadeInDurationFrames"]=1
    if "fo" in s["fl"]: kw["audioFadeOutDurationFrames"]=1
    if "P" in s["fl"]: kw.update(left=-158,top=-277,width=1404,height=2496)
    if "M" in s["fl"]: kw["decibelAdjustment"]=-60
    add("V1",s["take"],frame,s["dur"],**kw); pos[s["key"]]=(frame,frame+s["dur"]); frame+=s["dur"]
    if s["key"]=="test":
        add("V1","t2",frame,78,sourceIn=int(round((s["tin"]+s["dur"]/30)*1e6)),decibelAdjustment=-60)
        add("V2","pipe",frame,78,sourceIn=0,playbackRate=1.939,left=0,top=0,width=1080,height=1920,decibelAdjustment=-60)
        add("V7","title",frame,75,type="motion-graphic",left=40,top=140,width=1000,height=400,propertyOverrides={"word1":"COOKED","word2":"OR","word3":"CRACKED?","beat1":6,"beat2":21,"beat3":28,"accent":"#DF825F"})
        add("A1","sting",frame,78,type="audio",sourceIn=0,volume=0.56)
        frame+=78
TOTAL=frame
# opener overlays
add("V5","nate",0,104,sourceIn=0,left=580,top=905,width=360,height=640,borderRadius=20,volume=0.54,audioFadeOutDurationFrames=3)
add("V6","frame",0,104,type="motion-graphic",keepAspectRatio=False,left=572,top=897,width=376,height=656,propertyOverrides={"border":12,"radius":28,"paper":"#FFFFFF"})
add("V7","pill",0,104,type="motion-graphic",left=190,top=240,width=700,height=150,propertyOverrides={"text":"Cooked or Cracked?","ink":"#171411","paper":"#FFFFFF"})
# PiP
PIP=dict(left=40,top=852,width=390,height=693,borderRadius=18)
def pip(keys):
    for k in keys:
        s=next(x for x in segs if x["key"]==k); f0,f1=pos[k]
        add("V5",s["take"],f0,f1-f0,sourceIn=int(round(s["tin"]*1e6)),decibelAdjustment=-60,**PIP)
    f0=pos[keys[0]][0]; f1=pos[keys[-1]][1]
    add("V6","frame",f0,f1-f0,type="motion-graphic",keepAspectRatio=False,left=32,top=844,width=406,height=709,propertyOverrides={"border":10,"radius":26,"paper":"#FFFFFF"})
def paper(f0,f1): add("V2","paper",f0,f1-f0,type="image",left=0,top=0,width=1080,height=1920)
def full(asset,f0,f1,src_s,rate=None):
    kw=dict(sourceIn=int(round(src_s*1e6)),left=0,top=0,width=1080,height=1920)
    if rate: kw["playbackRate"]=rate
    if asset=="pipe": kw["decibelAdjustment"]=-60
    add("V2",asset,f0,f1-f0,**kw)
CARD={"gh":(1060,781),"shops":(1060,590),"maps":(820,1046),"logo":(760,760),"grid":(1060,941),"bkp":(1060,628),"bkh":(1060,750),"bk7":(1060,1093)}
def card(asset,f0,f1,rot,kind,cy=500,video=None,vsrc=0,vrate=None):
    W,H=CARD[kind]; sc=min(1.0,700/H,1060/W); w,h=round(W*sc),round(H*sc)
    add("V3",asset,f0,f1-f0,type="image",left=round(540-w/2),top=round(cy-h/2),width=w,height=h,rotation=rot)
    if video:
        cw,ch=W-120,H-120; vw,vh=round(cw*sc),round(ch*sc)
        kw=dict(sourceIn=int(round(vsrc*1e6)),left=round(540-w/2+60*sc),top=round(cy-h/2+60*sc),width=vw,height=vh,rotation=rot,keepAspectRatio=False)
        if vrate: kw["playbackRate"]=vrate
        add("V4",video,f0,f1-f0,**kw)
def span(k0,k1=None): return pos[k0][0], pos[k1 or k0][1]
# W1 shop
f0,f1=span("shop"); paper(f0,f1); L=f1-f0
card("shops",f0,f0+int(L*0.58),1.0,"shops"); card("maps",f0+int(L*0.58),f0+int(L*0.84),-1.5,"maps"); card("logo",f0+int(L*0.84),f1,1.5,"logo"); pip(["shop"])
# W2 prompt typing
f0,f1=span("putit","intoclaude"); paper(f0,f1); card("bkp",f0,f1,-1.0,"bkp",video="b3",vsrc=0,vrate=round(7.2/((f1-f0)/30)-0.01,3)); pip(["putit","intoclaude"])
# W3 five repos
f0,f1=span("connectors"); paper(f0,f1); n=f1-f0
for i,(g,r) in enumerate([("gh1",-1.5),("gh2",1.2),("gh3",-1.0),("gh4",1.5),("gh5",-1.2)]):
    card(g,f0+i*n//5,f0+(i+1)*n//5 if i<4 else f1,r,"gh")
pip(["connectors"])
# W4 v1 site
f0,f1=span("notbad","nicely"); full("b4",f0,f1,0,rate=round(min(1.0,3.66/((f1-f0)/30)),3)); pip(["notbad","sp1","nicely"])
# W5 Higgsfield widget
f0,f1=span("whynot","higgs"); paper(f0,f1); card("bkh",f0,f1,1.2,"bkh",video="b5",vsrc=0,vrate=round(min(1.0,2.5/((f1-f0)/30))-0.005,3)); pip(["whynot","higgs"])
# W6 swirl
f0,f1=span("swirls","perfectly"); full("v04",f0,f1,57.3); pip(["swirls","perfectly"])
# W7 kling
f0,f1=span("sp2","takesvideo"); full("pipe",f0,f1,1.5); pip(["sp2","takesvideo"])
# W8 grid then scroll
f0,f1=span("splices"); m=f0+int((f1-f0)*0.4); paper(f0,m); card("grid",f0,m,-1.0,"grid"); full("v05",m,f1,14.2); pip(["splices"])
# W9 desktop site over "million" + first 57f of "cracked"
f0,_=span("million"); f1=pos["cracked"][0]+57; paper(f0,f1); card("bk7",f0,f1,0.8,"bk7",video="v07",vsrc=5.8)
s=next(x for x in segs if x["key"]=="million"); add("V5","t2",pos["million"][0],pos["million"][1]-pos["million"][0],sourceIn=int(round(s["tin"]*1e6)),decibelAdjustment=-60,**PIP)
s=next(x for x in segs if x["key"]=="cracked"); add("V5","t2",pos["cracked"][0],57,sourceIn=int(round(s["tin"]*1e6)),decibelAdjustment=-60,**PIP)
add("V6","frame",f0,f1-f0,type="motion-graphic",keepAspectRatio=False,left=32,top=844,width=406,height=709,propertyOverrides={"border":10,"radius":26,"paper":"#FFFFFF"})
# W10 order page
f0,f1=span("order","toppings"); full("v06",f0,f1,6.8); pip(["order","toppings"])
# W11 POS + website inside "pos" item
s=next(x for x in segs if x["key"]=="pos"); f0=pos["pos"][0]; off=lambda t: f0+int(round((t-s["tin"])*30))
a=off(219.47); b=off(225.12)
full("v06",f0,f0+93,34.0); full("v06",f0+93,a,0.0); full("v05",a,a+48,0.0); full("v05",a+48,b,39.0)
add("V5","t2",f0,b-f0,sourceIn=int(round(s["tin"]*1e6)),decibelAdjustment=-60,**PIP)
add("V6","frame",f0,b-f0,type="motion-graphic",keepAspectRatio=False,left=32,top=844,width=406,height=709,propertyOverrides={"border":10,"radius":26,"paper":"#FFFFFF"})
json.dump({"adds":adds,"segs":segs,"pos":pos,"total":TOTAL},open(SP+"/p2/v4_payload.json","w"))
print("TOTAL frames",TOTAL,"= %.1f s"%(TOTAL/30),"adds",len(adds))
for s_ in segs: print(f"{s_['key']:12s} {s_['take']} {s_['tin']:9.3f} {s_['dur']:4d}f  {pos[s_['key']][0]/30:6.2f}s")
