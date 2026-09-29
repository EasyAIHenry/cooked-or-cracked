"""Lengthen the truncated 'a' vowel of the spliced 'cracked' (Part 2 local ~44.07 s) by pitch-synchronous
overlap-add of its last two periods with a natural decay, then take the same number of samples out of the
silent closure before 'it', so everything after 44.18 s keeps its original timing (sync unchanged).
usage: fix_cracked_vowel.py in.wav out.wav"""
import sys, numpy as np, subprocess, json
SR=48000
def load(p):
    info=json.loads(subprocess.run(["ffprobe","-v","error","-show_entries","stream=channels","-of","json",p],capture_output=True,text=True).stdout)
    ch=info["streams"][0]["channels"]
    b=subprocess.run(["ffmpeg","-v","error","-i",p,"-ar",str(SR),"-f","f32le","-"],capture_output=True).stdout
    return np.frombuffer(b,'<f4').astype(np.float64).reshape(-1,ch)
def save(p,x):
    subprocess.run(["ffmpeg","-v","error","-y","-f","f32le","-ar",str(SR),"-ac",str(x.shape[1]),"-i","-","-c:a","pcm_f32le",p],input=x.astype('<f4').tobytes(),check=True)
x=load(sys.argv[1]); m=x.mean(1)
# 1) exact truncation point: the loudest 5 ms block in 44.04-44.10 is the vowel peak; truncation = end of it
blk=240
starts=np.arange(int(44.04*SR),int(44.10*SR),blk)
lv=[np.sqrt((m[s:s+blk]**2).mean()) for s in starts]
T=int(starts[int(np.argmax(lv))]+blk)
# 2) pitch period from the 30 ms before T
seg=m[T-int(0.030*SR):T]; seg=seg-seg.mean()
ac=np.correlate(seg,seg,'full')[len(seg)-1:]
P=int(np.argmax(ac[300:450])+300)
print(f"truncation at {T/SR:.4f}s, period {P} samples = {SR/P:.1f} Hz")
N=int(round(0.035*SR/P))*P           # extension: whole periods, ~35 ms
# 3) synthetic continuation by OLA of Hann-windowed 2-period grains (hop = P)
g=x[T-2*P:T].copy(); w=np.hanning(2*P)[:,None]
L=P+N+2*P
syn=np.zeros((L,x.shape[1]))
for j in range(0,(L-2*P)//P+1):
    syn[j*P:j*P+2*P]+=g*w
# syn index 0 corresponds to time T-2P; steady state from index P onward
s=syn[P:P+P+N]                      # covers [T-P, T+N)
env=np.ones(P+N); dec=np.linspace(0,1,N); env[P:]=10**((-14*dec**1.3)/20)   # decay to -14 dB
s=s*env[:,None]
# 4) splice: x[:T-P] | crossfade x->s over one period | s up to T+N | crossfade into x[T:] over 5 ms
fin=np.linspace(0,1,P)[:,None]
head=x[:T-P]
xf1=x[T-P:T]*(1-fin)+s[:P]*fin
body=s[P:]
cf=240; fo=np.linspace(0,1,cf)[:,None]
tail=x[T:].copy()
tail[:cf]=body[-cf:]*(1-fo)+tail[:cf]*fo
y=np.concatenate([head,xf1,body[:-cf],tail])
# 5) remove the net inserted samples (N - cf) of the quietest closure between the vowel and 'it' (search 44.10-44.22 in the new timeline)
R=N-cf
ym=y.mean(1); lo,hi=int(44.10*SR)+R, int(44.22*SR)+R
best=None
for a in range(lo,hi-R,48):
    e=np.sqrt((ym[a:a+R]**2).mean())
    if best is None or e<best[0]: best=(e,a)
a=best[1]; cf2=192; f2=np.linspace(0,1,cf2)[:,None]
joined=y[a-cf2:a]*(1-f2)+y[a+R-cf2:a+R]*f2
z=np.concatenate([y[:a-cf2],joined,y[a+R:]])
print(f"inserted {R} samples ({R/SR*1000:.1f} ms) at {T/SR:.4f}s; removed quiet span at {(a-R)/SR:.4f}-{a/SR:.4f}s (orig timeline) level {20*np.log10(best[0]+1e-12):.1f} dB")
assert len(z)==len(x), (len(z),len(x))
save(sys.argv[2],z)
