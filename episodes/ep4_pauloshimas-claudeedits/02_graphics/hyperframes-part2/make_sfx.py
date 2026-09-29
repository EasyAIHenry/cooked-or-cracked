import numpy as np, wave
SR=48000; rng=np.random.default_rng(11)
def save(name,x,gain=0.9):
    x=np.asarray(x,float); x=x/(np.max(np.abs(x))+1e-9)*gain
    if x.ndim==1: x=np.stack([x,x],1)
    w=wave.open(f"{name}.wav","wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x*32767).astype(np.int16).tobytes()); w.close()
def t(d): return np.arange(int(SR*d))/SR
def lp(x,alpha):
    y=np.zeros_like(x); s=0.0; al=np.broadcast_to(np.asarray(alpha,float),x.shape)
    for i in range(len(x)): s+=al[i]*(x[i]-s); y[i]=s
    return y
def hp(x,alpha): return x-lp(x,alpha)
def whoosh(d,peak=0.55,bright=0.35):
    tt=t(d); n=rng.normal(size=len(tt)); shape=np.sin(np.pi*np.clip(tt/d,0,1))**1.6
    cut=0.015+bright*np.exp(-((tt/d-peak)/0.22)**2)
    return lp(n,cut)*shape
save("whoosh",whoosh(0.45),0.75)
save("whoosh_long",whoosh(0.8,0.6,0.3),0.75)
save("whoosh_rev",whoosh(0.6,0.85,0.35),0.7)
# pop: pitched blip with fast decay
tt=t(0.14); f=900*np.exp(-tt*18)+320; ph=2*np.pi*np.cumsum(f)/SR
save("pop",np.sin(ph)*np.exp(-tt*28)+0.2*hp(rng.normal(size=len(tt)),0.4)*np.exp(-tt*120),0.7)
# click: UI tick
tt=t(0.05); save("click",(np.sin(2*np.pi*2400*tt)*0.6+hp(rng.normal(size=len(tt)),0.5))*np.exp(-tt*160),0.55)
# shine: sparkle chime
d=1.1; tt=t(d); x=np.zeros_like(tt)
for k,fq in enumerate([1568,2093,2637,3136,4186]):
    st=int(SR*0.04*k); tk=tt[:len(tt)-st]
    for h,amp in [(1,1),(2.76,0.35),(5.4,0.15)]: x[st:]+=amp*np.sin(2*np.pi*fq*h*tk)*np.exp(-tk*(4.5+h))
save("shine",x+0.1*hp(rng.normal(size=len(tt)),0.5)*np.exp(-tt*8),0.5)
# glass crack/shatter: sharp transient + many decaying high partials at random offsets + crunchy noise
d=1.6; tt=t(d); x=np.zeros_like(tt)
x+=hp(rng.normal(size=len(tt)),0.6)*np.exp(-tt*35)*1.2
for k in range(70):
    st=int(SR*abs(rng.normal(0,0.18))); fq=rng.uniform(2500,9500); dec=rng.uniform(8,30)
    tk=tt[:len(tt)-st]; x[st:]+=rng.uniform(0.05,0.3)*np.sin(2*np.pi*fq*tk+rng.uniform(0,6))*np.exp(-tk*dec)
for k in range(25):
    st=int(SR*abs(rng.normal(0.05,0.25))); L=int(SR*rng.uniform(0.004,0.02))
    if st+L<len(x): x[st:st+L]+=hp(rng.normal(size=L),0.7)*rng.uniform(0.2,0.6)
thump=np.sin(2*np.pi*np.cumsum(70*np.exp(-tt*6)+40)/SR)*np.exp(-tt*9)
save("glass",x+0.8*thump,0.9)
# impact boom (documentary)
d=2.2; tt=t(d); fb=95*np.exp(-tt*4)+36; bo=np.sin(2*np.pi*np.cumsum(fb)/SR)*np.exp(-tt*2.2)
bo+=0.5*lp(rng.normal(size=len(tt)),0.06)*np.exp(-tt*6)
save("boom",np.tanh(bo*2.4),0.95)
# hit: shorter punchy impact
d=0.9; tt=t(d); fb=140*np.exp(-tt*9)+50; hit=np.sin(2*np.pi*np.cumsum(fb)/SR)*np.exp(-tt*6)+0.6*lp(rng.normal(size=len(tt)),0.2)*np.exp(-tt*25)
save("hit",np.tanh(hit*2),0.9)
# riser 1.0 s
d=1.0; tt=t(d); f=200+1600*(tt/d)**2; ph=2*np.pi*np.cumsum(f)/SR
saw=2*((ph/(2*np.pi))%1)-1
save("riser",(0.3*lp(saw,0.15)+0.7*lp(rng.normal(size=len(tt)),0.03+0.4*(tt/d)**2))*(tt/d)**2,0.6)
# camera flash pop (bright noise burst)
tt=t(0.35); save("flash",hp(rng.normal(size=len(tt)),0.3)*np.exp(-tt*14)+0.3*np.sin(2*np.pi*3000*tt)*np.exp(-tt*30),0.6)
print("ok")
