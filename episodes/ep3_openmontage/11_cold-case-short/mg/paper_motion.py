# Paper stop-motion treatment for a still: 12 fps stepped push, jitter, tiny rotation, slide-in.
import sys, random, subprocess, numpy as np
from PIL import Image
src, out, dur = sys.argv[1], sys.argv[2], float(sys.argv[3])
W,H,FPS,STEP = 1080,1920,30,2.5  # a new "hand move" every 2.5 frames -> 12 fps feel
im = Image.open(src).convert("RGB")
big = im.resize((int(W*1.12), int(H*1.12)), Image.LANCZOS)
random.seed(7)
n = int(dur*FPS); frames=[]
p = subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),"-i","-","-c:v","libx264","-crf","16","-pix_fmt","yuv420p",out], stdin=subprocess.PIPE)
last=None
for f in range(n):
    t = f/FPS
    if last is None or f % 3 == 0:   # hold 3 frames per step (10 fps steps)
        scale = 1.0 + 0.05*(t/dur)
        slide = max(0.0, 0.45 - t) / 0.45        # slide-in over the first 0.45 s
        ox = int(random.uniform(-2,2)) + int(60*slide)
        oy = int(random.uniform(-2,2)) + int(25*slide)
        rot = random.uniform(-0.35,0.35)
        w2,h2 = int(W*1.12*scale), int(H*1.12*scale)
        fr = big.resize((w2,h2), Image.BILINEAR).rotate(rot, resample=Image.BILINEAR, center=(w2//2,h2//2))
        cx,cy = w2//2 + ox, h2//2 + oy
        last = fr.crop((cx-W//2, cy-H//2, cx+W//2, cy+H//2))
    p.stdin.write(last.tobytes())
p.stdin.close(); p.wait(); print(out, dur)
