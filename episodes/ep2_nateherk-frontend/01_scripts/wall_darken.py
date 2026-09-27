import sys, subprocess, numpy as np, cv2, mediapipe as mp
from mediapipe.tasks import python as mpt
from mediapipe.tasks.python import vision
S=sys.argv[1]; IN=S+"/p2/base_1080.mp4"; OUT=sys.argv[2]; AMT=float(sys.argv[3]); LIMIT=int(sys.argv[4]) if len(sys.argv)>4 else 0
W,H=1080,1920
seg=vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(
    base_options=mpt.BaseOptions(model_asset_path=S+"/p2/selfie_multiclass.tflite"),
    running_mode=vision.RunningMode.IMAGE, output_confidence_masks=True))
dec=subprocess.Popen(["ffmpeg","-loglevel","error","-i",IN,"-vf","fps=30","-f","rawvideo","-pix_fmt","rgb24","-"],stdout=subprocess.PIPE)
enc=subprocess.Popen(["ffmpeg","-loglevel","error","-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r","30","-i","-","-c:v","libx264","-crf","15","-preset","medium","-pix_fmt","yuv420p","-r","30",OUT],stdin=subprocess.PIPE)
prev=None; n=0
def ss(a,b,x): t=np.clip((x-a)/(b-a),0,1); return t*t*(3-2*t)
while True:
    buf=dec.stdout.read(W*H*3)
    if len(buf)<W*H*3: break
    f=np.frombuffer(buf,np.uint8).reshape(H,W,3)
    sm=cv2.resize(f,(540,960),interpolation=cv2.INTER_AREA)
    r=seg.segment(mp.Image(image_format=mp.ImageFormat.SRGB,data=np.ascontiguousarray(sm)))
    bg=np.squeeze(r.confidence_masks[0].numpy_view()).astype(np.float32)
    s=sm.astype(np.float32)/255.; Y=s@np.array([.299,.587,.114],np.float32); sat=s.max(2)-s.min(2)
    m=bg*ss(0.48,0.58,Y)*(1-ss(0.06,0.12,sat))
    m=cv2.dilate(m,np.ones((5,5),np.uint8))
    m=cv2.GaussianBlur(m,(0,0),1.6)
    if prev is not None: m=0.6*m+0.4*prev
    prev=m
    M=cv2.resize(m,(W,H),interpolation=cv2.INTER_LINEAR)[...,None]
    o=f.astype(np.float32)*(1-AMT*M)
    enc.stdin.write(np.clip(o,0,255).astype(np.uint8).tobytes())
    if n%30==0:
        cv2.imwrite(S+f"/p2/mask_{n:04d}.png",(m*255).astype(np.uint8))
    n+=1
    if LIMIT and n>=LIMIT: break
enc.stdin.close(); enc.wait(); dec.kill(); print("frames",n)
