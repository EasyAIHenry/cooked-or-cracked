#!/usr/bin/env python3
"""Assemble the 9:16 Short: clips + Elodie takes + Lyria bed + title card + word-highlight captions."""
import json, subprocess, os, re, sys
R = os.path.dirname(os.path.abspath(__file__))
os.chdir(R)
CLIP_LEN = {1:6,2:7,3:13,4:8,5:8,6:12,7:10,8:6,9:9}
VO_IN = 0.25  # seconds of picture before the voice starts in each shot
SCRIPT = {
1:"These parts fit perfectly in CAD. In real life, they jam.",
2:"Build Failure Forensics. Broken things tell you what the drawing forgot.",
3:"CAD gives you exact numbers. Manufacturing gives you a range. A ten millimetre pin lands a little big. The hole lands a little small. Zero gap is a trap.",
4:"That range is tolerance. How far a real part drifts from the number.",
5:"Clearance is different. It is the gap you choose, so the two ranges never collide.",
6:"Want movement? Clearance fit. Want it located with light force? Transition fit. Want it locked for good? Interference fit. Same geometry, three jobs.",
7:"There is no magic gap for every printer or material. Print a fit gauge first. Five pins, five gaps, one test.",
8:"Put the winning number in your design. Then print the real part.",
9:"Perfect in CAD is only the start. Next time: why a crack tells you exactly how your part was built."}
FONT = os.path.expanduser("~/Library/Fonts/Inter_18pt-ExtraBold.ttf")
FONT_B = os.path.expanduser("~/Library/Fonts/Inter_18pt-Bold.ttf")
MUSIC = "../06_research/openmontage-run/../../03_reference/openmontage-output/../../../DRIVE_Cooked-or-Cracked_Ep3_OpenMontage/09_short-rebuild/music.mp3"
MUSIC = "music.mp3"
W,H,FPS = 1080,1920,30

def dur(f):
    return float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f],capture_output=True,text=True).stdout)

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-2000:]); sys.exit(1)

# 1. per-shot video with its voice
words = json.load(open("vo/trim/words.json"))
offsets, t = {}, 0.0
for i in range(1,10):
    L = CLIP_LEN[i]
    offsets[i] = t
    vo = f"vo/trim/vo{i}.wav"
    run(["ffmpeg","-v","error","-y","-i",f"clips/c{i}.mp4","-i",vo,
         "-filter_complex",
         f"[0:v]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS},trim=0:{L},setpts=PTS-STARTPTS[v];"
         f"[1:a]adelay={int(VO_IN*1000)}|{int(VO_IN*1000)},apad=whole_dur={L}[a]",
         "-map","[v]","-map","[a]","-t",str(L),"-c:v","libx264","-preset","fast","-crf","16","-pix_fmt","yuv420p","-c:a","aac","-ar","48000",f"clips/shot{i}.mp4"])
    t += L
TOTAL = t
open("clips/concat.txt","w").write("".join(f"file 'shot{i}.mp4'\n" for i in range(1,10)))
run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i","clips/concat.txt","-c","copy","clips/assembly.mp4"])

# 2. captions and title card as PNG overlays (this ffmpeg has no drawtext or libass)
from PIL import Image, ImageDraw, ImageFont
os.makedirs("clips/png", exist_ok=True)
CAP_FONT = ImageFont.truetype(FONT, 66)
ORANGE, WHITE = (223,130,95,255), (255,255,255,255)
def render_cue(idx, ws, active):
    img = Image.new("RGBA", (W, 260), (0,0,0,0)); d = ImageDraw.Draw(img)
    # wrap into lines of max ~18 chars per line? keep one line unless too wide
    lines=[[]]
    for w in ws:
        trial=" ".join(x for x,_ in lines[-1]+[(w,0)])
        if d.textlength(trial, font=CAP_FONT) > W-140 and lines[-1]: lines.append([])
        lines[-1].append((w, len(lines[-1])))
    y = 20
    for ln in lines:
        text=" ".join(w for w,_ in ln); tw=d.textlength(text, font=CAP_FONT); x=(W-tw)/2
        for w,_ in ln:
            col = ORANGE if (w is active) else WHITE
            # shadow
            d.text((x+3,y+3), w, font=CAP_FONT, fill=(0,0,0,200)); d.text((x,y), w, font=CAP_FONT, fill=col, stroke_width=3, stroke_fill=(0,0,0,255))
            x += d.textlength(w+" ", font=CAP_FONT)
        y += 84
    f=f"clips/png/cue{idx:03d}.png"; img.save(f); return f

def cues_for(i):
    ws = words[str(i)]; sw = SCRIPT[i].split()
    if not ws: return []
    t0, t1 = ws[0]["s"], ws[-1]["e"]
    if len(ws) == len(sw): times = [(w["s"], w["e"]) for w in ws]
    else:
        span = t1 - t0; chars=[len(w) for w in sw]; total=sum(chars); acc=0; times=[]
        for c in chars:
            s = t0 + span*acc/total; acc += c; times.append((s, t0 + span*acc/total))
    out=[]; base = offsets[i] + VO_IN
    for k in range(0, len(sw), 5):
        grp = list(range(k, min(k+5, len(sw))))
        for j in grp:
            s = base + times[j][0]
            e = base + (times[j+1][0] if j+1 < len(sw) else times[j][1] + 0.4)
            out.append((s, e, [sw[m] for m in grp], j-k))
    return out

cues=[]; n=0
for i in range(1,10):
    for s,e,grp,ai in cues_for(i):
        # make distinct string objects so identity marks the active word
        objs=[str(w) for w in grp]; act=objs[ai]
        cues.append((s,e,render_cue(n, objs, act))); n+=1

# title card PNG for shot 2
T = Image.new("RGBA", (W, 300), (0,0,0,0)); d = ImageDraw.Draw(T)
f1 = ImageFont.truetype(FONT, 66); f2 = ImageFont.truetype(FONT_B, 40)
t1="BUILD FAILURE FORENSICS"; t2="Ep 1   Why Perfect Parts Never Fit"
for txt,fnt,y,col in ((t1,f1,40,(255,255,255,255)),(t2,f2,140,(110,214,231,255))):
    tw=d.textlength(txt,font=fnt); d.text(((W-tw)/2+3,y+3),txt,font=fnt,fill=(0,0,0,200)); d.text(((W-tw)/2,y),txt,font=fnt,fill=col,stroke_width=3,stroke_fill=(0,0,0,255))
T.save("clips/png/title.png")

# 3. build the overlay graph
inputs=["-i","clips/assembly.mp4","-stream_loop","-1","-i",MUSIC,"-i","clips/png/title.png"]
for _,_,f in cues: inputs += ["-i", f]
t2s, t2e = offsets[2]+0.3, offsets[2]+CLIP_LEN[2]-0.3
chain=f"[0:v][2:v]overlay=0:150:enable='between(t,{t2s},{t2e})'[v0]"
prev="v0"
for k,(s,e,_) in enumerate(cues):
    chain += f";[{prev}][{k+3}:v]overlay=0:{H-430}:enable='between(t,{s:.2f},{e:.2f})'[v{k+1}]"; prev=f"v{k+1}"
chain += f";[{prev}]format=yuv420p[v]"
chain += f";[1:a]atrim=0:{TOTAL},volume=-15dB,afade=t=out:st={TOTAL-2.5}:d=2.5[m];[0:a][m]amix=inputs=2:duration=first:dropout_transition=0:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11[a]"
open("clips/graph.txt","w").write(chain)
run(["ffmpeg","-v","error","-y",*inputs,"-filter_complex",chain,"-map","[v]","-map","[a]","-t",str(TOTAL),
     "-c:v","libx264","-preset","medium","-crf","18","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart","build-failure-forensics-ep1-short-v1.mp4"])
print("done", TOTAL, "s")
