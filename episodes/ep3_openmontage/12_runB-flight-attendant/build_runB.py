#!/usr/bin/env python3
"""Cold Case Cut-outs Ep1 build: Kling clips (slowed then held with paper jitter to fit VO), local paper scenes, Nadine takes, Lyria bed, title, captions."""
import json, subprocess, os, sys, random
from PIL import Image, ImageDraw, ImageFont
R=os.path.dirname(os.path.abspath(__file__)); os.chdir(R)
W,H,FPS=1080,1920,30; VO_IN=0.25
SCRIPT={1:"You think this job is pouring coffee at thirty-five thousand feet. The coffee is the least important thing on the plane.",
2:"Misunderstood Jobs. Tonight: the flight attendant.",
3:"The very first one was a man called Heinrich Kubis, on a zeppelin, in 1912. Years later he survived the Hindenburg fire by jumping out of a window.",
4:"In 1930, airlines hired nurses to do the job. The rule then is the rule now: safety first, service second.",
5:"That smile at the door is a check. Are you unwell, drunk, or fit to open an exit if asked?",
6:"Training runs for weeks: fires, water landings, first aid, and emptying a full plane in ninety seconds with half the doors blocked.",
7:"The law says one attendant for every fifty seats. Not for the drinks. For the exits.",
8:"And on many airlines the pay clock only starts when the cabin door closes. Boarding is free.",
9:"So the coffee is a bonus. Next episode: the job everyone thinks is boring, and never is."}
FONT=os.path.expanduser("~/Library/Fonts/Inter_18pt-ExtraBold.ttf"); FONT_B=os.path.expanduser("~/Library/Fonts/Inter_18pt-Bold.ttf")
def dur(f): return float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f],capture_output=True,text=True).stdout)
def run(cmd):
    r=subprocess.run(cmd,capture_output=True,text=True)
    if r.returncode: print(r.stderr[-1500:]); sys.exit(1)
words=json.load(open("vo/trim/words.json"))
vod={i:dur(f"vo/trim/vo{i}.wav") for i in range(1,10)}
CLIP_LEN={i:round(vod[i]+VO_IN+0.55,2) for i in range(1,10)}
def src(i):
    for c in (f"clips/c{i}.mp4", f"mg/mg{i}.mp4"):
        if os.path.exists(c): return c
    raise SystemExit(f"no source for {i}")
os.makedirs("clips/build",exist_ok=True)
offsets,t={},0.0
for i in range(1,10):
    L=CLIP_LEN[i]; s=src(i); offsets[i]=t
    base=f"[0:v]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS}"
    if s.startswith("clips/"):
        d=dur(s); slow=min(2.0, L/d)              # slow the Kling clip up to 1.8x
        played=d*slow
        if played >= L-0.05:
            vf=f"{base},setpts={slow:.4f}*PTS,trim=0:{L},setpts=PTS-STARTPTS[v]"
        else:                                     # then hold the last frame with a paper jitter
            hold=L-played
            vf=(f"{base},setpts={slow:.4f}*PTS,split[a][b];[b]trim=start={played-0.04:.3f},setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration={hold+0.2:.3f},"
                f"scale=iw*1.06:ih*1.06,zoompan=z='1.0+0.04*on/({hold+0.05:.3f}*{FPS})':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={W}x{H}:fps={FPS},trim=0:{hold+0.05:.3f},setpts=PTS-STARTPTS[hold];[a][hold]concat=n=2:v=1:a=0,trim=0:{L},setpts=PTS-STARTPTS[v]")
    else:
        vf=f"{base},trim=0:{L},setpts=PTS-STARTPTS[v]"
    run(["ffmpeg","-v","error","-y","-i",s,"-i",f"vo/trim/vo{i}.wav","-filter_complex",
         f"{vf};[1:a]adelay={int(VO_IN*1000)}|{int(VO_IN*1000)},apad=whole_dur={L}[a]",
         "-map","[v]","-map","[a]","-t",str(L),"-r",str(FPS),"-c:v","libx264","-preset","fast","-crf","16","-pix_fmt","yuv420p","-c:a","aac","-ar","48000",f"clips/build/shot{i}.mp4"])
    t+=L
TOTAL=t
open("clips/build/concat.txt","w").write("".join(f"file 'shot{i}.mp4'\n" for i in range(1,10)))
run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i","clips/build/concat.txt","-c","copy","clips/build/assembly.mp4"])
# captions: cream text, oxblood active word, paper look
os.makedirs("clips/png",exist_ok=True)
CF=ImageFont.truetype(FONT,64); CREAM=(243,235,221,255); OX=(232,120,96,255)
def render_cue(idx,ws,active):
    img=Image.new("RGBA",(W,260),(0,0,0,0)); d=ImageDraw.Draw(img); lines=[[]]
    for w in ws:
        trial=" ".join(x for x,_ in lines[-1]+[(w,0)])
        if d.textlength(trial,font=CF)>W-140 and lines[-1]: lines.append([])
        lines[-1].append((w,0))
    y=20
    for ln in lines:
        text=" ".join(w for w,_ in ln); x=(W-d.textlength(text,font=CF))/2
        for w,_ in ln:
            col=OX if w is active else CREAM
            d.text((x+3,y+3),w,font=CF,fill=(0,0,0,170)); d.text((x,y),w,font=CF,fill=col,stroke_width=3,stroke_fill=(20,16,12,255))
            x+=d.textlength(w+" ",font=CF)
        y+=84
    f=f"clips/png/cue{idx:03d}.png"; img.save(f); return f
def cues_for(i):
    ws=words[str(i)]; sw=SCRIPT[i].split()
    if not ws: return []
    t0,t1=ws[0]["s"],ws[-1]["e"]
    if len(ws)==len(sw): times=[(w["s"],w["e"]) for w in ws]
    else:
        span=t1-t0; chars=[len(w) for w in sw]; total=sum(chars); acc=0; times=[]
        for c in chars: s=t0+span*acc/total; acc+=c; times.append((s,t0+span*acc/total))
    out=[]; base=offsets[i]+VO_IN
    for k in range(0,len(sw),5):
        grp=list(range(k,min(k+5,len(sw))))
        for j in grp:
            s=base+times[j][0]; e=base+(times[j+1][0] if j+1<len(sw) else times[j][1]+0.4)
            out.append((s,e,[sw[m] for m in grp],j-k))
    return out
cues=[]; n=0
for i in range(1,10):
    for s,e,grp,ai in cues_for(i):
        objs=[str(w) for w in grp]; cues.append((s,e,render_cue(n,objs,objs[ai]))); n+=1
T=Image.new("RGBA",(W,300),(0,0,0,0)); d=ImageDraw.Draw(T)
f1=ImageFont.truetype(FONT,68); f2=ImageFont.truetype(FONT_B,40)
for txt,fnt,y,col in (("MISUNDERSTOOD JOBS",f1,40,CREAM),("Ep 1   The Flight Attendant",f2,140,(232,120,96,255))):
    tw=d.textlength(txt,font=fnt); d.text(((W-tw)/2+3,y+3),txt,font=fnt,fill=(0,0,0,170)); d.text(((W-tw)/2,y),txt,font=fnt,fill=col,stroke_width=3,stroke_fill=(20,16,12,255))
T.save("clips/png/title.png")
inputs=["-i","clips/build/assembly.mp4","-stream_loop","-1","-i","music.mp3","-i","clips/png/title.png"]
for _,_,f in cues: inputs+=["-i",f]
t2s,t2e=offsets[2]+0.3,offsets[2]+CLIP_LEN[2]-0.2
chain=f"[0:v][2:v]overlay=0:150:enable='between(t,{t2s},{t2e})'[v0]"; prev="v0"
for k,(s,e,_) in enumerate(cues):
    chain+=f";[{prev}][{k+3}:v]overlay=0:{H-430}:enable='between(t,{s:.2f},{e:.2f})'[v{k+1}]"; prev=f"v{k+1}"
chain+=f";[{prev}]format=yuv420p[v];[1:a]atrim=0:{TOTAL},volume=-14dB[m];[0:a][m]amix=inputs=2:duration=first:dropout_transition=0:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=out:st={TOTAL-4}:d=4[a]"
OUT=sys.argv[1] if len(sys.argv)>1 else "runB-flight-attendant-v1.mp4"
run(["ffmpeg","-v","error","-y",*inputs,"-filter_complex",chain,"-map","[v]","-map","[a]","-t",str(TOTAL),"-c:v","libx264","-preset","medium","-crf","18","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart",OUT])
print("done",round(TOTAL,1),"s", CLIP_LEN)
