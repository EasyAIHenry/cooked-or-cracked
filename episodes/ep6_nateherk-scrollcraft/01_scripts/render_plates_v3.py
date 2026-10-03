#!/usr/bin/env python3
"""Render the v3 panel plates (1080x1920, 30 fps, exact frame counts from plates-v3.json).
Each plate: the source blurred + darkened as the full-frame backdrop, and the sharp source in a white-bordered panel
(944x528 inside, tilted -0.8 deg, soft shadow) in the top band above Henry's card (card top = 788).
Motion: slow push-in for stills; scrolls for the code, the harness sheet; the Google listing pans to its website field
on the spoken word "website"."""
import json, subprocess, sys, os
G = "/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep6_NateHerk-ScrollCraft/02_graphics/screens"
OUT = "/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep6_NateHerk-ScrollCraft/02_graphics/plates-v3"
SC = "/private/tmp/claude-501/-Users-henrychua-Content-Creation/9dd12cf8-7412-43a0-a58f-e559ad802c0d/scratchpad"
HAR = "/Users/henrychua/Content Creation/scrollcraft/builds/supersystems/lab/ep6-broll-desktop/sheet.png"
os.makedirs(OUT, exist_ok=True)
PW, PH = 944, 528          # panel inside
SRC = {
    'ig_header':          dict(img=f"{G}/ig-supersystems-header.png", crop=(0, 0, 1221, 687), move='push'),
    'google':             dict(img=f"{G}/google-maps-supersystems.png", move='google'),
    'figma_overview':     dict(img=f"{G}/figma-overview.png", crop=(20, 0, 1444, 812), move='push'),
    'figma_selected':     dict(img=f"{G}/figma-desktop-selected.png", crop=(0, 40, 1152, 648), move='push'),
    'ig_grid':            dict(img=f"{G}/ig-supersystems-grid.png", crop=(0, 0, 1371, 771), move='push'),
    'code':               dict(img=f"{SC}/code/code-full.png", move='scroll', travel=1500, bar=51),
    'github':             dict(img=f"{G}/github-scroll-craft.png", crop=(0, 0, 1456, 819), move='push'),
    'harness':            dict(img=HAR, move='scroll', travel=None),
    'higgsfield':         dict(img=f"{G}/higgsfield-seedance-job.png", crop=(20, 0, 1444, 812), move='push'),
    'higgsfield_details': dict(img=f"{G}/higgsfield-seedance-job.png", crop=(866, 436, 616, 347), move='push'),
}
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-2500:]); sys.exit(1)
def render(name, frames, pan_at=None):
    # NB: re-renders overwrite the file ChatCut uses; render to a new name (SUFFIX) and swap the item
    s = SRC[name]; out = f"{OUT}/plate_{name}{os.environ.get('SUFFIX', '_r2')}.mp4"
    motion_frames = frames; frames = frames + 6; D = frames / 30 + 0.2   # +6 spare frames: ChatCut reads clip ends a hair short
    if s['move'] == 'push':
        x, y, w, h = s['crop']
        content = (f"[0:v]crop={w}:{h}:{x}:{y},scale={PW*2}:{PH*2}:flags=lanczos,"
                   f"zoompan=z='1+0.05*on/{max(1,motion_frames)}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={PW}x{PH}:fps=30[c]")
        bgsrc = f"[0:v]crop={w}:{h}:{x}:{y}"
    elif s['move'] == 'google':
        # 773x1568 portrait -> width 944 (x1.2212). Window shows title + rating first, then the address / wa.me / instagram.com rows.
        k = PW / 773; H = round(1568 * k); y0 = round(480 * k); y1 = H - PH; T = (pan_at or 0) / 30
        ease = f"min(1,max(0,(t-{T:.3f})/0.6))"
        content = (f"[0:v]scale={PW}:{H}:flags=lanczos,crop={PW}:{PH}:0:'{y0}+({y1}-{y0})*(3*pow({ease},2)-2*pow({ease},3))'[c]")
        bgsrc = "[0:v]crop=773:700:0:400"
    else:  # scroll a tall image
        info = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', s['img']], capture_output=True, text=True).stdout.split()
        iw, ih = int(info[-3]), int(info[-1]); H = round(ih * PW / iw)
        travel = s['travel'] or (H - PH); travel = min(travel, H - PH)
        sc = f"[0:v]scale={PW}:{H}:flags=lanczos"
        body = f"crop={PW}:{PH}:0:'{travel}*min(1,t/{motion_frames/30:.3f})'"
        if s.get('bar'):
            bar = s['bar']
            content = (f"{sc},split[s1][s2];[s1]{body}[b];[s2]crop={PW}:{bar}:0:0[bar];[b][bar]overlay=0:0[c]")
        else:
            content = f"{sc},{body}[c]"
        bgsrc = f"[0:v]crop={iw}:{min(ih, round(iw*1.0))}:0:0"
    fc = (f"{content};"
          f"{bgsrc},scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=36:3,eq=brightness=-0.34:saturation=0.70[bg];"
          f"[c]pad={PW+16}:{PH+16}:8:8:white,format=rgba,rotate=-0.8*PI/180:c=none:ow=rotw(-0.8*PI/180):oh=roth(-0.8*PI/180)[p];"
          f"color=black@0.55:s={PW+16}x{PH+16}:d={D:.2f},format=rgba,rotate=-0.8*PI/180:c=none:ow=rotw(-0.8*PI/180):oh=roth(-0.8*PI/180),boxblur=14:2[sh];"
          f"[bg][sh]overlay=66:250:shortest=1[b1];[b1][p]overlay=54:232:shortest=1,format=yuv420p[v]")
    run(['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-framerate', '30', '-t', f"{D:.2f}", '-i', s['img'], '-filter_complex', fc,
         '-map', '[v]', '-frames:v', str(frames), '-r', '30', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-pix_fmt', 'yuv420p', out])
    print('rendered', out, frames)
plates = json.load(open(os.environ.get('PLATES', 'plates-v3.json')))   # v4: PLATES=plates-v4.json SUFFIX=_r4
only = sys.argv[1:]
for p in plates:
    if only and p['name'] not in only: continue
    render(p['name'], p['frames'], p.get('pan_at'))
