#!/usr/bin/env python3
"""Render a ChatCut motion-graphic (Remotion runtime JSX) locally and build a contact sheet, so an MG can be judged
before it goes into ChatCut.

Usage: python3 mgcheck.py <beat_dir> [--frames 0,12,40,...] [--still N]
<beat_dir> must contain:
  mg.jsx     ChatCut MG code: `const Component = ({ item }) => { ... }` using the globals useCurrentFrame, interpolate,
             spring, Easing, interpolateColors, random, AbsoluteFill (no imports, no useVideoConfig, props via item.props).
  meta.json  {"width": 980, "height": 500, "duration": 120, "props": {...},
              "place": {"left": 50, "top": 234, "width": 980, "height": 500},   # where it sits on the 1080x1920 frame
              "sheetFrames": [0, 10, ...]}                                          # optional
Writes <beat_dir>/out/: sheet.jpg (context frames at 0.5 scale, phone-like layout with Henry's card placeholder),
  detail.png (full-res MG-only still), mg.mp4 (MG-only preview video, transparent areas shown on paper).
Exit code 1 and the error text on a compile/render failure.
"""
import json, os, re, shutil, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
NODE_MODULES = '/Users/henrychua/Content Creation/Tutorial_Claude-Code-Mods/03_remotion/node_modules'
args = sys.argv[1:]
if not args: print(__doc__); sys.exit(2)
bd = os.path.abspath(args[0])
frames_arg = args[args.index('--frames') + 1] if '--frames' in args else None
still_arg = int(args[args.index('--still') + 1]) if '--still' in args else None
meta = json.load(open(os.path.join(bd, 'meta.json')))
code = open(os.path.join(bd, 'mg.jsx')).read()
W, H, D = int(meta['width']), int(meta['height']), int(meta['duration'])
place = meta.get('place', {'left': (1080 - W) // 2, 'top': 234, 'width': W, 'height': H})
rd = os.path.join(bd, '.render'); out = os.path.join(bd, 'out')
os.makedirs(out, exist_ok=True)
if not os.path.exists(rd):
    shutil.copytree(os.path.join(HERE, 'template'), rd)
    os.symlink(NODE_MODULES, os.path.join(rd, 'node_modules'))
src = os.path.join(rd, 'src'); os.makedirs(src, exist_ok=True)
if re.search(r'^\s*import\s', code, re.M) or 'useVideoConfig' in code:
    print('ERROR: ChatCut MG code must not use imports or useVideoConfig'); sys.exit(1)
if 'const Component' not in code:
    print('ERROR: code must define `const Component = ({ item }) => ...`'); sys.exit(1)
open(os.path.join(src, 'MG.tsx'), 'w').write(
    "// @ts-nocheck\nimport React from 'react';\n"
    "import { useCurrentFrame, interpolate, spring, Easing, interpolateColors, random, AbsoluteFill } from 'remotion';\n"
    + code + "\nexport default Component;\n")
props = json.dumps(meta.get('props', {}))
open(os.path.join(src, 'index.tsx'), 'w').write("""// @ts-nocheck
import React from 'react';
import { Composition, registerRoot, AbsoluteFill, staticFile } from 'remotion';
import { loadFont } from '@remotion/fonts';
import MG from './MG';
loadFont({ family: 'Fraunces', url: staticFile('fonts/Fraunces-normal-900.woff2'), weight: '900' });
loadFont({ family: 'Fraunces', url: staticFile('fonts/Fraunces-normal-900.woff2'), weight: '700' });
loadFont({ family: 'Kalam', url: staticFile('fonts/Kalam-normal-700.woff2'), weight: '700' });
loadFont({ family: 'Kalam', url: staticFile('fonts/Kalam-normal-700.woff2'), weight: '400' });
for (const w of ['400','500','600','700','800','900']) loadFont({ family: 'Inter', url: staticFile('fonts/Inter_24pt-ExtraBold.ttf'), weight: w });
const PROPS = %s;
const PAPER = { backgroundColor: '#FFFEFA', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,#E4E1DC 40px,transparent 41px)' };
const Solo = () => <AbsoluteFill style={PAPER}><MG item={{ props: PROPS }} /></AbsoluteFill>;
const Context = () => (
  <AbsoluteFill style={PAPER}>
    <div style={{ position: 'absolute', left: 213, top: 748, width: 654, height: 1144, background: '#fff', borderRadius: 26, boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }} />
    <div style={{ position: 'absolute', left: 225, top: 760, width: 630, height: 1120, borderRadius: 16, background: 'linear-gradient(#8a8f8c,#3d4a5e)' }}>
      <div style={{ position: 'absolute', left: 215, top: 120, width: 200, height: 260, borderRadius: 100, background: '#c9a48a' }} />
      <div style={{ position: 'absolute', left: 20, top: 670, width: 590, height: 120, borderRadius: 12, background: '#FFFEFA', color: '#171411', fontFamily: 'Fraunces', fontWeight: 900, fontSize: 52, textAlign: 'center', lineHeight: '120px' }}>caption here</div>
    </div>
    <div style={{ position: 'absolute', left: 70, top: 735, width: 300, height: 265, color: '#171411', fontFamily: 'Fraunces', fontWeight: 900, fontSize: 30 }}>[ ] COOKED<br/>[ ] CRACKED</div>
    <div style={{ position: 'absolute', left: %d, top: %d, width: %d, height: %d }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: %d, height: %d, transform: 'scale(%f, %f)', transformOrigin: '0 0' }}><MG item={{ props: PROPS }} /></div>
    </div>
    <div style={{ position: 'absolute', left: 45, top: 230, width: 985, height: 1395, border: '3px dashed rgba(255,0,0,0.35)' }} />
  </AbsoluteFill>
);
const Root = () => (<>
  <Composition id="Solo" component={Solo} durationInFrames={%d} fps={30} width={%d} height={%d} />
  <Composition id="Context" component={Context} durationInFrames={%d} fps={30} width={1080} height={1920} />
</>);
registerRoot(Root);
""" % (props, place['left'], place['top'], place['width'], place['height'], W, H, place['width'] / W, place['height'] / H, D, W, H, D))
def run(cmd):
    p = subprocess.run(cmd, cwd=rd, capture_output=True, text=True)
    if p.returncode != 0:
        print('ERROR running', ' '.join(cmd[:4]), '\n', (p.stdout[-3000:] + '\n' + p.stderr[-3000:])); sys.exit(1)
    return p
npx = 'npx'
run([npx, 'remotion', 'render', 'src/index.tsx', 'Context', os.path.join(out, 'context.mp4'), '--scale=0.5', '--concurrency=3', '--log=error'])
run([npx, 'remotion', 'render', 'src/index.tsx', 'Solo', os.path.join(out, 'mg.mp4'), '--concurrency=3', '--log=error'])
fr = [int(x) for x in frames_arg.split(',')] if frames_arg else meta.get('sheetFrames') or [round(i * (D - 1) / 11) for i in range(12)]
fr = [f for f in fr if 0 <= f < D]
# context sheet with frame labels (PIL; this ffmpeg has no drawtext)
from PIL import Image, ImageDraw
tiles = []
for f in fr:
    p = os.path.join(out, f'.f{f}.png')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(out, 'context.mp4'), '-vf', f"select='eq(n\\,{f})'", '-frames:v', '1', '-fps_mode', 'passthrough', p], check=True)
    im = Image.open(p).convert('RGB').crop((0, 100, 540, 540))   # top half of the phone frame: explainer zone + card top
    d = ImageDraw.Draw(im); d.rectangle((0, 0, 70, 22), fill=(0, 0, 0)); d.text((5, 5), f'f{f}', fill=(255, 255, 255))
    tiles.append(im); os.remove(p)
cols = 4; rows = -(-len(tiles) // cols)
sheet = Image.new('RGB', (cols * 540, rows * 440), 'white')
for i, t in enumerate(tiles): sheet.paste(t, ((i % cols) * 540, (i // cols) * 440))
sheet.save(os.path.join(out, 'sheet.jpg'), quality=88)
sf = still_arg if still_arg is not None else fr[-1]
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(out, 'mg.mp4'), '-vf', f"select='eq(n\\,{sf})'", '-frames:v', '1', '-fps_mode', 'passthrough', os.path.join(out, 'detail.png')], check=True)
print('OK', os.path.join(out, 'sheet.jpg'), os.path.join(out, 'detail.png'), 'frames', fr)
