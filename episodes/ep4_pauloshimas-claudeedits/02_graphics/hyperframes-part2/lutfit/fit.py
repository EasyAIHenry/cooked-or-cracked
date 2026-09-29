"""Fit a 3D LUT that maps HyperFrames' SDR output (which skipped the BT.2020->BT.709 gamut step)
to a correct conversion of the same HLG frames, keeping HyperFrames' brightness per pixel."""
import numpy as np, subprocess, colorsys, sys, json
W,H=1080,1920
def grab(path, t, matrix):
    cmd=["ffmpeg","-v","error","-ss",f"{t:.3f}","-i",path,"-frames:v","1","-vf",
         f"scale=in_color_matrix={matrix}:in_range=tv:out_range=pc:flags=accurate_rnd+full_chroma_int+bicubic,format=rgb48le","-f","rawvideo","-"]
    b=subprocess.run(cmd,capture_output=True).stdout
    return np.frombuffer(b,dtype='<u2').reshape(H,W,3).astype(np.float64)/65535.0
a=0.17883277; b=1-4*a; c=0.5-a*np.log(4*a)
def hlg_inv(E): return np.where(E<=0.5, E**2/3.0, (np.exp((E-c)/a)+b)/12.0)
M=np.array([[1.6605,-0.5876,-0.0728],[-0.1246,1.1329,-0.0083],[-0.0182,-0.1006,1.1187]])
K709=np.array([0.2126,0.7152,0.0722])
def g_dec(v): return np.clip(v,0,1)**2.4
def g_enc(l): return np.clip(l,0,1)**(1/2.4)
def target(hlg, hf):
    E=hlg_inv(np.clip(hlg,0,1))
    Ys=0.2627*E[...,0]+0.6780*E[...,1]+0.0593*E[...,2]
    Fd=np.power(np.maximum(Ys,1e-9),0.2)[...,None]*E
    lin=np.clip(Fd@M.T,0,None)                      # correct chromaticity, BT.709 linear
    Yr=lin@K709; Yh=g_dec(hf)@K709                  # keep HyperFrames' brightness
    out=lin*(Yh/np.maximum(Yr,1e-9))[...,None]
    # if scaling pushes a channel over 1, desaturate toward grey at the same Y
    mx=out.max(-1,keepdims=True); over=mx>1
    if over.any():
        Y=Yh[...,None]; t=np.clip((1-Y)/np.maximum(mx-Y,1e-9),0,1)
        out=np.where(over, Y+(out-Y)*t, out)
    return g_enc(out)
if __name__=="__main__":
    times=[float(x) for x in sys.argv[1:]] or [1.0,3.1,6.2,9.5,13.0,17.4,21.0,25.2,29.0,33.9,37.5,41.0,44.2,47.3]
    X=[];Y=[]
    rng=np.random.default_rng(1)
    for t in times:
        hlg=grab("roughcut_hlg.mov",t,"bt2020"); hf=grab("final/assets/ungraded/base.mp4",t,"bt709")
        tg=target(hlg,hf)
        # 2x2 area average to damp chroma subsampling / compression noise
        def ds(z): return z.reshape(H//2,2,W//2,2,3).mean((1,3)).reshape(-1,3)
        x=ds(hf); y=ds(tg); idx=rng.choice(len(x),60000,replace=False)
        X.append(x[idx]); Y.append(y[idx])
    X=np.concatenate(X); Y=np.concatenate(Y)
    np.save("grade/lutfit/X.npy",X.astype(np.float32)); np.save("grade/lutfit/Y.npy",Y.astype(np.float32))
    print("pairs",len(X))
