#!/usr/bin/env python3
"""Ep7 panel source images (1888x1056 = 2x the 944x528 panel) for render_plates_ep7.py.
Every number comes from a file: Buffer export (posts.csv), skillspector-scan.txt, linkedin-posts brief.md, the receipts folder."""
import os, csv, statistics as st
from PIL import Image, ImageDraw, ImageFont
EP = '/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep7_LinkedIn-Agent'
R = f'{EP}/02_graphics/receipts'; OUT = f'{EP}/02_graphics/panels'; os.makedirs(OUT, exist_ok=True)
FD = os.path.expanduser('~/Library/Fonts')
def F(name, size): return ImageFont.truetype(f'{FD}/{name}', size)
BLACK, BOLD, XB = 'Inter_18pt-Black.ttf', 'Inter_18pt-Bold.ttf', 'Inter_18pt-ExtraBold.ttf'
MONO = '/System/Library/Fonts/Menlo.ttc'
PAPER, INK, ACC, GREY, DARK = '#FFFEFA', '#171411', '#DF825F', '#8A8580', '#0C1013'
W, H = 1888, 1056

# 1. Challenge chart: median impressions per post, May window vs rest of 2026 (Buffer export)
rows = [r for r in csv.DictReader(open(f'{EP}/06_research/linkedin-baseline/posts.csv')) if r['sent'] >= '2026-03-01']
win = [r for r in rows if '2026-05-04' <= r['sent'][:10] <= '2026-06-02']; rest = [r for r in rows if r not in win]
med = lambda L: st.median(float(r['impressions']) for r in L if r['impressions'])
mw, mr = med(win), med(rest); tot = int(sum(float(r['impressions']) for r in win if r['impressions']))
im = Image.new('RGB', (W, H), PAPER); d = ImageDraw.Draw(im)
for y in range(150, H, 64): d.line([(0, y), (W, y)], fill='#ECE7E0', width=2)
d.text((90, 60), 'My 30-day LinkedIn challenge', font=F(BLACK, 76), fill=INK)
d.text((92, 160), f'4 May to 2 Jun 2026  ·  {len(win)} posts  ·  {tot:,} impressions', font=F(BOLD, 44), fill=GREY)
base = 930; top = 420; scale = (base - top) / 240
for i, (lab, v, col) in enumerate([('May challenge', mw, ACC), ('Rest of my year', mr, INK)]):
    x = 300 + i * 700; h = v * scale
    d.rounded_rectangle([x, base - h, x + 420, base], radius=18, fill=col)
    d.text((x + 210, base - h - 20), f'{int(v)}', font=F(BLACK, 120), fill=col, anchor='mb')
    d.text((x + 210, base + 24), lab, font=F(XB, 48), fill=INK, anchor='mt')
d.text((92, 225), 'Median impressions per post', font=F(XB, 44), fill=ACC)
im.save(f'{OUT}/chart_challenge.png'); print('chart', mw, mr, tot, len(win))

# 2. SkillSpector result card (lines copied from 06_research/skillspector-scan.txt)
im = Image.new('RGB', (W, H), '#11161A'); d = ImageDraw.Draw(im); m = F(MONO, 50); mb = ImageFont.truetype(MONO, 50, index=1)
d.rounded_rectangle([0, 0, W, 86], radius=0, fill='#1D252B')
for i, c in enumerate(('#FF5F57', '#FEBC2E', '#28C840')): d.ellipse([40 + i * 52, 26, 74 + i * 52, 60], fill=c)
y = 140
lines = [('$ skillspector scan --no-llm linkedin-agent-skill', '#9FB3C2', m),
         ('', None, m),
         ('SkillSpector Security Report   v2.11.2', '#FFFFFF', mb),
         ('', None, m),
         ('  Risk Assessment', '#9FB3C2', m),
         ('  Score           9/100', '#7EE787', mb),
         ('  Severity        LOW', '#7EE787', mb),
         ('  Recommendation  SAFE', '#7EE787', mb),
         ('', None, m),
         ('  Issues (2): MEDIUM, notes saved to ~/.claude/linkedin', '#E3B341', m)]
for t, c, f in lines:
    if t: d.text((70, y), t, font=f, fill=c)
    y += 78
im.save(f'{OUT}/scan_skillspector.png')

# 3. Proof check card (from linkedin-posts/2026-10-05_ai-driving-license-batch2/brief.md, "Proof checked")
im = Image.new('RGB', (W, H), '#FFFFFF'); d = ImageDraw.Draw(im)
d.rectangle([0, 0, W, 96], fill='#F3F1EE'); d.text((60, 22), 'brief.md  ·  proof checked against my project files', font=F(BOLD, 44), fill=INK)
items = ['Lesson 29 Sep, taught by Lysander, Zero Context x SAIGA  ->  00_README.md',
         'IMG_1560 = batch 1 recap teaser (155 s, 9:16)  ->  06_cuts',
         'Class covered character sheets, scene replacement  ->  ig-caption-v5.md',
         'Student quote "didn\'t work at all" until class  ->  teaser captions',
         'Batch 2: Mon 5 Oct, 7.30 pm to 10 pm, 50 Niven Road  ->  poster']
y = 170
for t in items:
    d.line([(80, y + 30), (105, y + 55), (150, y + 5)], fill='#2DA44E', width=12); d.text((190, y), t, font=F(BOLD, 42), fill=INK); y += 150
im.save(f'{OUT}/proof_brief.png')

# 4. LinkedIn User Agreement 8.2 with item 13 highlighted (receipt 14, 1254x570)
src = Image.open(f'{R}/14-linkedin-user-agreement-8-2-item13-bots.jpg').convert('RGB')
ov = Image.new('RGBA', src.size, (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
od.rectangle([382, 252, 852, 298], fill=(223, 130, 95, 70)); od.rectangle([380, 250, 854, 300], outline=(223, 130, 95, 255), width=3)
src = Image.alpha_composite(src.convert('RGBA'), ov).convert('RGB')
cw, ch = 500, 280; x0, y0 = 370, 150
src.crop((x0, y0, x0 + cw, y0 + ch)).resize((W, H), Image.LANCZOS).save(f'{OUT}/linkedin_ua_item13.png')

# 5. Buffer API page: the Claude connection's permissions (receipt 16)
p = Image.open(f'{R}/16-buffer-api-claude-integration-9-permissions.webp').convert('RGB'); pw, ph = p.size
k = pw / 2000; box = [int(v * k) for v in (760, 545, 1440, 910)]          # Keys + Active Integrations (display coords x2000)
c = p.crop(box); cw, ch = c.size; tw = int(ch * W / H)
if tw > cw: c = p.crop((box[0] - (tw - cw) // 2, box[1], box[0] - (tw - cw) // 2 + tw, box[3]))
c.resize((W, H), Image.LANCZOS).save(f'{OUT}/buffer_permissions.png')
print('panels written to', OUT, sorted(os.listdir(OUT)))

# 6. Installed skills (v2 opener, 4 Oct): the 11 folders the repo put in ~/.claude/skills (real listing, no names)
import glob
names = sorted(os.path.basename(p) for p in glob.glob(os.path.expanduser('~/.claude/skills/li-*')))
im = Image.new('RGB', (W, H), '#11161A'); d = ImageDraw.Draw(im); m = F(MONO, 52); mb = ImageFont.truetype(MONO, 52, index=1)
d.rectangle([0, 0, W, 86], fill='#1D252B')
for i, c in enumerate(('#FF5F57', '#FEBC2E', '#28C840')): d.ellipse([40 + i * 52, 26, 74 + i * 52, 60], fill=c)
d.text((70, 130), '$ ls ~/.claude/skills | grep li-', font=m, fill='#9FB3C2')
for i, n in enumerate(names):
    col, row = divmod(i, 6)
    d.text((110 + col * 760, 250 + row * 100), n, font=mb, fill='#7EE787')
d.text((70, 900), f'{len(names)} skills installed', font=mb, fill='#FFFFFF')
im.save(f'{OUT}/installed_skills.png'); print('installed', len(names), names)

# 7. SkillSpector install tip (v3, 4 Oct): Henry says "go on NVIDIA to clear the repos"; this card names the tool and shows the
#    exact commands used on his Mac (uv receipt: git https://github.com/NVIDIA/skillspector.git, v2.11.2; scan run with --no-llm)
im = Image.new('RGB', (W, H), '#11161A'); d = ImageDraw.Draw(im); m = F(MONO, 46); mb = ImageFont.truetype(MONO, 46, index=1)
d.rectangle([0, 0, W, 86], fill='#1D252B')
for i, c in enumerate(('#FF5F57', '#FEBC2E', '#28C840')): d.ellipse([40 + i * 52, 26, 74 + i * 52, 60], fill=c)
d.rounded_rectangle([70, 140, 520, 222], radius=16, fill=ACC); d.text((295, 181), 'TIP', font=F(BLACK, 58), fill='#FFFFFF', anchor='mm')
d.text((560, 152), 'before you install any skill', font=F(BOLD, 50), fill='#9FB3C2')
d.text((70, 290), 'Install SkillSpector,', font=F(BLACK, 84), fill='#FFFFFF')
d.text((70, 392), "NVIDIA's free scanner", font=F(BLACK, 84), fill='#7EE787')
d.text((70, 580), '$ uv tool install git+https://github.com/NVIDIA/skillspector', font=m, fill='#9FB3C2')
d.text((70, 680), '$ skillspector scan --no-llm <the repo>', font=mb, fill='#FFFFFF')
d.text((70, 820), 'Scan first. Install only if it comes back LOW / SAFE.', font=F(BOLD, 50), fill='#E3B341')
im.save(f'{OUT}/install_skillspector.png'); print('install tip panel')
