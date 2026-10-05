#!/usr/bin/env python3
"""Render the Ep7 panel plates (1080x1920, 30 fps, exact frame counts from plates-ep7.json), Ep6 style:
the content blurred + darkened as the full-frame backdrop, the sharp content in a white-bordered panel (944x528 inside,
or 297x528 for the portrait reel), tilted -0.8 deg with a soft shadow, in the top band above Henry's card (card top 788).
Stills get a slow push; Henry's prompt recording and the reel play as video; the Buffer publish beat is a 3-still sequence."""
import json, subprocess, sys, os
EP = '/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep7_LinkedIn-Agent'
R = f'{EP}/02_graphics/receipts'; P = f'{EP}/02_graphics/panels'
OUT = f'{EP}/02_graphics/plates'; TMP = f'{OUT}/tmp'; os.makedirs(TMP, exist_ok=True)
SUFFIX = os.environ.get('SUFFIX', '_r1')
PW, PH = (int(v) for v in os.environ.get('PANEL', '944x528').split('x'))   # v3: PANEL=880x492
SRC = {
    'activity':  dict(kind='still', img=f'{R}/05-linkedin-activity-887-followers.jpg', crop=(318, 60, 930, 520)),
    'activity2': dict(kind='still', img=f'{R}/05-linkedin-activity-887-followers.jpg', crop=(318, 60, 930, 520)),
    'skills':    dict(kind='still', img=f'{P}/installed_skills.png'),
    'install':   dict(kind='still', img=f'{P}/install_skillspector.png'),
    'sent':      dict(kind='still', img=f'{R}/04-buffer-sent-153.jpg', crop=(200, 0, 1100, 615)),
    'chart':     dict(kind='still', img=f'{P}/chart_challenge.png'),
    'reel_ui':   dict(kind='video', src=f'{EP}/03_reference/reel-DeChOhIPszm.mp4', ss=24.8, speed=0.9, portrait=True),
    'scan':      dict(kind='still', img=f'{P}/scan_skillspector.png'),
    'fineprint': dict(kind='still', img=f'{R}/02b-repo-fine-print-full.jpg', crop=(290, 305, 720, 402)),
    'prompt':    dict(kind='video', src=f'{EP}/04_raw-footage/henry-cleanshot/henry-prompt-ai-driving-license-1734.mp4', ss=0.0, fit_all=True, crop=(420, 0, 1546, 864)),
    'publish':   dict(kind='seq', parts=[(f'{R}/06-myflow-composer-with-images.jpg', (284, 70, 1000, 559), 0.40),
                                          (f'{R}/09-myflow-publish-now-button.jpg', (150, 0, 765, 428), 0.25),
                                          (f'{R}/11-myflow-live-on-linkedin.jpg', (400, 30, 760, 425), 0.35)]),
    'live':      dict(kind='still', img=f'{R}/11-myflow-live-on-linkedin.jpg', crop=(400, 30, 760, 425)),
    'ua':        dict(kind='still', img=f'{P}/linkedin_ua_item13.png'),
    'perm':      dict(kind='still', img=f'{P}/buffer_permissions.png'),
}
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(' '.join(cmd)[:400]); print(r.stderr[-2500:]); sys.exit(1)
def still_content(img, crop, frames, out, w=PW, h=PH):
    c = f"crop={crop[2]}:{crop[3]}:{crop[0]}:{crop[1]}," if crop else ""
    vf = (f"{c}scale={w*2}:{h*2}:flags=lanczos,setsar=1,"
          f"zoompan=z='1+0.05*on/{max(1,frames)}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={w}x{h}:fps=30")
    run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-loop', '1', '-framerate', '30', '-t', f'{frames/30+0.5:.2f}', '-i', img,
         '-vf', vf, '-frames:v', str(frames), '-c:v', 'libx264', '-crf', '12', '-pix_fmt', 'yuv420p', out])
def video_content(s, frames, out, w, h):
    speed = s.get('speed', 1.0)
    if s.get('fit_all'):
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', s['src']], capture_output=True, text=True).stdout)
        speed = (dur - s['ss']) / (frames / 30)
    c = s.get('crop'); cf = f"crop={c[2]}:{c[3]}:{c[0]}:{c[1]}," if c else ""
    vf = f"setpts=(PTS-STARTPTS)/{speed},fps=30,{cf}scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},setsar=1"
    run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(s['ss']), '-i', s['src'], '-an', '-vf', vf, '-frames:v', str(frames),
         '-c:v', 'libx264', '-crf', '12', '-pix_fmt', 'yuv420p', out])
    print(f'  {os.path.basename(out)} speed x{speed:.2f}')
def render(name, frames):
    s = SRC[name]; n = frames + 6                                   # +6 spare frames (ChatCut reads clip ends a hair short)
    w, h = (297, 528) if s.get('portrait') else (PW, PH)
    content = f'{TMP}/{name}_content.mp4'
    if s['kind'] == 'still': still_content(s['img'], s.get('crop'), n, content, w, h)
    elif s['kind'] == 'video': video_content(s, n, content, w, h)
    else:
        parts = []; left = n
        for i, (img, crop, frac) in enumerate(s['parts']):
            k = left if i == len(s['parts']) - 1 else int(round(n * frac)); left -= k
            pth = f'{TMP}/{name}_part{i}.mp4'; still_content(img, crop, k, pth); parts.append(pth)
        lst = f'{TMP}/{name}_parts.txt'; open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
        run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', content])
    x = (1080 - (w + 16)) // 2
    D = n / 30 + 0.2
    fc = (f"[0:v]split[a][b];"
          f"[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=36:3,eq=brightness=-0.34:saturation=0.70[bg];"
          f"[b]pad={w+16}:{h+16}:8:8:white,format=rgba,rotate=-0.8*PI/180:c=none:ow=rotw(-0.8*PI/180):oh=roth(-0.8*PI/180)[p];"
          f"color=black@0.55:s={w+16}x{h+16}:d={D:.2f},format=rgba,rotate=-0.8*PI/180:c=none:ow=rotw(-0.8*PI/180):oh=roth(-0.8*PI/180),boxblur=14:2[sh];"
          f"[bg][sh]overlay={x+12}:250:shortest=1[b1];[b1][p]overlay={x}:232:shortest=1,scale=out_range=tv,format=yuv420p[v]")  # JPG sources come in full range; flux export hangs on yuvj420p
    out = f'{OUT}/plate_{name}{SUFFIX}.mp4'
    run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', content, '-filter_complex', fc, '-map', '[v]', '-frames:v', str(n), '-r', '30',
         '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-color_range', 'tv', out])
    print('rendered', out, n)
plates = json.load(open(os.environ.get('PLATES', 'plates-ep7.json')))
only = sys.argv[1:]
for p in plates:
    if only and p['name'] not in only: continue
    render(p['name'], p['frames'])
