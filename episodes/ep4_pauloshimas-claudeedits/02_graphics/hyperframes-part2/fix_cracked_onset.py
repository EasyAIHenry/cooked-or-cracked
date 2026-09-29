"""Remove the leftover 'c' of the original 'cooked' (Part 2 local 43.908-43.978) that sits in front of the
spliced Ep2 'cra' (which has its own k burst at ~43.986), replacing it with the neighbouring noise floor.
Length and timing unchanged. usage: fix_cracked_onset.py in.wav out.wav [t0 t1]"""
import sys, numpy as np, subprocess, json
SR=48000
def load(p):
    ch=json.loads(subprocess.run(["ffprobe","-v","error","-show_entries","stream=channels","-of","json",p],capture_output=True,text=True).stdout)["streams"][0]["channels"]
    b=subprocess.run(["ffmpeg","-v","error","-i",p,"-ar",str(SR),"-f","f32le","-"],capture_output=True).stdout
    return np.frombuffer(b,'<f4').astype(np.float64).reshape(-1,ch)
def save(p,x):
    subprocess.run(["ffmpeg","-v","error","-y","-f","f32le","-ar",str(SR),"-ac",str(x.shape[1]),"-i","-","-c:a","pcm_f32le",p],input=x.astype('<f4').tobytes(),check=True)
x=load(sys.argv[1]).copy()
t0=float(sys.argv[3]) if len(sys.argv)>3 else 43.906
t1=float(sys.argv[4]) if len(sys.argv)>4 else 43.979
a,b=int(t0*SR),int(t1*SR)
floor=x[int(43.866*SR):int(43.906*SR)]                 # 40 ms of the room floor just before
fill=np.concatenate([floor]*(int((b-a)/len(floor))+2))[:b-a]
f=int(0.004*SR); ramp=np.linspace(0,1,f)[:,None]
new=x.copy(); new[a:b]=fill
new[a:a+f]=x[a:a+f]*(1-ramp)+fill[:f]*ramp            # fade the old 'c' out into the floor
new[b-f:b]=fill[-f:]*(1-ramp)+x[b-f:b]*ramp            # and back in just before the Ep2 segment's own fade-in
save(sys.argv[2],new)
print(f"replaced {t0:.3f}-{t1:.3f} s with the room floor ({20*np.log10(np.sqrt((floor**2).mean())+1e-12):.1f} dB)")
