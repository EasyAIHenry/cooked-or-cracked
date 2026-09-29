import numpy as np, subprocess, colorsys, sys
W,H=1080,1920
def grab(path, t, matrix):
    cmd=["ffmpeg","-v","error","-ss",str(t),"-i",path,"-frames:v","1","-vf",
         f"scale=in_color_matrix={matrix}:in_range=tv:out_range=pc:flags=accurate_rnd+full_chroma_int+bicubic,format=rgb48le","-f","rawvideo","-"]
    b=subprocess.run(cmd,capture_output=True).stdout
    return np.frombuffer(b,dtype='<u2').reshape(H,W,3).astype(np.float64)/65535.0
a=0.17883277; b=1-4*a; c=0.5-a*np.log(4*a)
def hlg_inv(E):
    return np.where(E<=0.5, E**2/3.0, (np.exp((E-c)/a)+b)/12.0)
M=np.array([[1.6605,-0.5876,-0.0728],[-0.1246,1.1329,-0.0083],[-0.0182,-0.1006,1.1187]])
def convert(rgb_hlg, gamut=True, ootf=True, white=203.0, lw=1000.0):
    E=hlg_inv(np.clip(rgb_hlg,0,1))
    if ootf:
        Ys=0.2627*E[...,0]+0.6780*E[...,1]+0.0593*E[...,2]
        Fd=lw*np.power(np.maximum(Ys,1e-9),0.2)[...,None]*E
    else:
        Fd=lw*E
    if gamut: Fd=Fd@M.T
    L=np.clip(Fd/white,0,None)
    # soft knee above 0.85
    k=0.85
    L=np.where(L<=k, L, k+(1-k)*np.tanh((L-k)/(1-k)))
    return np.clip(L,0,1)**(1/2.4)
def boxstats(img, box):
    x0,y0,x1,y1=box; cc=img[y0:y1,x0:x1].reshape(-1,3).mean(0)
    h,l,s=colorsys.rgb_to_hls(*cc); return cc,h*360,s,l
t=float(sys.argv[1]) if len(sys.argv)>1 else 6.2
hlg=grab("roughcut_hlg.mov",t,"bt2020")
hlg709=grab("roughcut_hlg.mov",t,"bt709")
hf=grab("final/assets/ungraded/base.mp4",t,"bt709")
cands={"ref(gamut+ootf)":convert(hlg),"nogamut+ootf":convert(hlg,gamut=False),"nogamut,709mtx":convert(hlg709,gamut=False),"ref,709mtx":convert(hlg709)}
boxes={'wall':(60,560,300,1000),'table':(100,1600,900,1900),'cheek':(560,700,620,760),'jacket':(300,1300,420,1450)}
def show(name,img):
    s=" | ".join(f"{k}: {np.round(boxstats(img,b)[0],3)} h{boxstats(img,b)[1]:.0f} s{boxstats(img,b)[2]:.2f}" for k,b in boxes.items())
    print(f"{name:18s} {s}")
show("HF output",hf)
for k,v in cands.items():
    d=np.abs(v-hf).mean(); show(k,v); print(f"{'':18s} mean abs diff vs HF = {d:.4f}")
np.save("lutfit/hf.npy",hf.astype(np.float32)); np.save("lutfit/hlg.npy",hlg.astype(np.float32))
