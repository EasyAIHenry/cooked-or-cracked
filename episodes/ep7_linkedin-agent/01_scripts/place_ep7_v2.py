#!/usr/bin/env python3
"""Ep7 placement v2 (4 Oct 2026, Henry's notes on v1), from place_ep7.py:
- Order: hook (reel claim) + sting -> the repo (11 skills, scan 9/100, writes not posts, his prompt, 10 min, Buffer then vs Claude
  now, LinkedIn-verified apps) -> his May challenge, briefly -> Buffer vs Claude advice -> CRACKED -> one CTA (GHOST).
- Reference footage holds: his prompt recording plays ~4x across ~15 s (v1 squeezed 61 s into 3.9 s), every panel >= 2.5 s.
- Henry's Reels safe area (his guide, 4 Oct): x 45..1030 and y 230..1625, and x <= 880 below y 960 (action rail).
  Reel window 290x516 at 564/905 (frame to x 878), big card 700x1244 at 168/676 (frame to x 880), captions centred in
  120..880, stamps / save card / jingle from y 236.
- Captions: text from the full-take Whisper per line, times from a DTW pass on the cut audio (words-v3-aligned.json).
- First speech frame: the scoreboard starts 3 frames later and only one whoosh plays (v1 had two on frame 239).
Writes place-ep7-v2-adds.json, place-ep7-v2-pos.json, plates-ep7-v2.json."""
import json, re, os
FPS = 30
cut = json.load(open('cut-ep7-v3.json')); items = cut['items']
AL = json.load(open('words-v3-aligned.json'))           # [cut_s, word, base, ('interp')]
# words the DTW pass placed late, pinned to the energy onsets in the take (source s) -> cut time via the cut items
SRC_FIX = {('V01', 3): 335.00, ('V01', 4): 335.14, ('V01', 5): 335.22, ('V01', 6): 335.44}
def src2cut(base, src):
    cum = 0
    for it in items:
        n = it.get('frames', it.get('spacer', 0))
        if 'take' in it and it['label'].split('.')[0] == base and it['in'] - 0.01 <= src < it['in'] + n / 30: return cum / 30 + src - it['in']
        cum += n
    raise ValueError((base, src))
for (bs, k), src in SRC_FIX.items():
    w = [x for x in AL if x[2] == bs][k]; w[0] = src2cut(bs, src)
PL = json.load(open('plate-assets-ep7-v2.json')) if os.path.exists('plate-assets-ep7-v2.json') else {}
A = dict(take='b478270184', voice='84ca819c04', reel='469202b901',
         sting='f2a2cec326', pop='6240bb0252', click='3c8865c0dd', whoosh='17d6a4db45', boom='20d06e616d', typing='07be333642', ding='2b8bab8a3c',
         jingle='fad634a377', score='cd8b84b93b', pill='7c4174b280', frame='04f83b962d', stamp='a49ed1f8ff',
         confetti='7e3cda31be', caption='86b6934a44', backdrop='470e79c892', save='1147e36539')
A.update(PL)
V = json.load(open(os.environ.get('TRACKS', 'tracks-ep7-v2.json')))
INK = "#171411"; ACC = "#DF825F"; PAPER = "#FFFEFA"
FULL = dict(left=0, top=0, width=1080, height=1920, fit="cover")
CB = dict(left=225, top=800, width=630, height=1120, fit="cover")            # Henry's card (frame to x 867)
BIG = dict(left=168, top=676, width=700, height=1244, fit="cover")          # verdict + CTA (frame to x 880)
def us(t): return int(round(t * 1e6))
adds = []
def vid(asset, track, f, src, n, **kw):
    adds.append(dict(type="video", assetId=A[asset], trackId=V[track], startFrame=f, sourceIn=us(src), durationFrames=n, **kw))
def aud(asset, track, f, src, n, **kw):
    adds.append(dict(type="audio", assetId=A[asset], trackId=V[track], startFrame=f, sourceIn=us(src), durationFrames=n, **kw))
def mg(asset, track, f, n, l, t, w, h, props):
    adds.append(dict(type="motion-graphic", assetId=A[asset], trackId=V[track], startFrame=f, durationFrames=n, left=l, top=t,
                     width=w, height=h, keepAspectRatio=False, propertyOverrides=props))
sfx_used = {k: [] for k in ('A2', 'A3', 'A4')}
def sfx(asset, f, db, n, src=0.0):
    for t in ('A2', 'A3', 'A4'):
        if all(f >= e or f + n <= s for s, e in sfx_used[t]):
            sfx_used[t].append((f, f + n)); aud(asset, t, f, src, n, decibelAdjustment=db); return
    print('SFX dropped', asset, f)
def pop(f, db=-9): sfx('pop', f, db, 10)
def swish(f): sfx('whoosh', f, -18, 24)
def frame_mg(f, n, box, border, radius):
    l, t, w, h = box; mg('frame', 'FRM', f, n, l - border, t - border, w + 2 * border, h + 2 * border, {"border": border, "radius": radius, "paper": "#FFFFFF"})

# ---------------- hook ----------------
SEGS = [(0.00, 80), (29.10, 87)]
REACT = 3.0
WIN = dict(left=564, top=905, width=290, height=516, fit="cover")
f = 0
for i, (rs, n) in enumerate(SEGS):
    vid('reel', 'HEN', f, rs, n, decibelAdjustment=0.0, audioFadeInDurationFrames=0 if i == 0 else 2, audioFadeOutDurationFrames=3, **WIN)
    if i: sfx('whoosh', f - 4, -20, 24)
    f += n
HK = f
vid('take', 'V1', 0, REACT, HK, muted=True, **FULL)
frame_mg(0, HK, (WIN['left'], WIN['top'], WIN['width'], WIN['height']), 24, 57)
mg('pill', 'TOP', 0, HK, 190, 236, 700, 150, {"text": "Cooked or Cracked?", "ink": INK, "paper": "#FFFFFF"}); pop(2)
REEL = [(0, 0.02, "Claude can now run", [0.02, 0.22, 0.38, 0.54]),
        (0, 0.70, "your entire LinkedIn", [0.70, 0.92, 1.25]),
        (0, 1.75, "completely free", [1.75, 2.41]),
        (1, 29.16, "remove anything that sounds", [29.16, 29.45, 29.84, 30.03]),
        (1, 30.32, "AI-written", [30.32]),
        (1, 30.86, "preventing you from getting flagged", [30.86, 31.19, 31.29, 31.43, 31.67])]
seg_f0 = [0, SEGS[0][1]]
reel_caps = []
for seg, t0, txt, tt in REEL:
    f0 = seg_f0[seg] + int(round((t0 - SEGS[seg][0]) * 30))
    reel_caps.append((f0, txt, [int(round((x - t0) * 30)) for x in tt]))

# ---------------- sting ----------------
S0 = HK; STING = 72
HOLD = [(383.65, 34), (385.05, 38)]
fh = S0
for src, n in HOLD: vid('take', 'V1', fh, src, n, muted=True, **FULL); fh += n
aud('sting', 'A1', S0, 0, 72, decibelAdjustment=-8)
mg('jingle', 'TOP', S0, STING, 140, 236, 800, 320, {"word1": "COOKED", "word2": "OR", "word3": "CRACKED?", "beat1": 6, "beat2": 21, "beat3": 28, "accent": ACC, "gold": "#F2C14E"})
for b in (6, 21, 28): pop(S0 + b, -12)
sfx('whoosh', S0 + 34, -14, 24)

# ---------------- walk the speech cut ----------------
M0 = S0 + STING
def mode_of(base): return 'big' if base in ('V01', 'Z01') else 'card'
f = M0; pos = {}; speech = []
for k, it in enumerate(items):
    if 'spacer' in it:
        n = it['spacer']; nxt = next((j for j in items[k + 1:] if 'take' in j), None)
        speech.append(dict(f=f, n=n, src=(nxt['in'] - n / 30) if nxt else 0, muted=True, mode=speech[-1]['mode'], base=speech[-1]['base'])); f += n; continue
    lab = it['label']; base = lab.split('.')[0]
    speech.append(dict(f=f, n=it['frames'], src=it['in'], muted=False, mode=mode_of(base), label=lab, base=base))
    pos.setdefault(base, [f, f]); pos[base][1] = f + it['frames']
    f += it['frames']
TAIL = 12; last = speech[-1]; speech.append(dict(f=f, n=TAIL, src=last['src'] + last['n'] / 30, muted=True, mode=last['mode'], base=last['base'])); END = f + TAIL
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
def W_(text, base, nth=0):
    hits = [w for w in AL if w[2] == base and norm(w[1]).startswith(norm(text))]
    if len(hits) <= nth: raise ValueError((text, base, nth))
    return M0 + int(round(hits[nth][0] * 30))
B = lambda b: pos[b]
for sp in speech:
    if sp['muted'] and sp['f'] >= B('V01')[0]: sp['mode'] = 'big'
for sp in speech:
    geo = {'card': CB, 'big': BIG}[sp['mode']]
    vid('take', 'HEN', sp['f'], sp['src'], sp['n'], muted=True, **geo)
    if not sp['muted']:
        aud('voice', 'VOX', sp['f'], sp['src'], sp['n'], decibelAdjustment=0)
runs = []
for sp in speech:
    if runs and runs[-1][2] == sp['mode'] and runs[-1][1] == sp['f']: runs[-1][1] = sp['f'] + sp['n']
    else: runs.append([sp['f'], sp['f'] + sp['n'], sp['mode']])
for a, b, m in runs:
    g = {'card': CB, 'big': BIG}[m]
    frame_mg(a, b - a, (g['left'], g['top'], g['width'], g['height']), 12, 26)

# ---------------- panels (V1) ----------------
plates = []
def plate(name, f0, f1, **p):
    plates.append(dict(name=name, frames=f1 - f0, **p))
    key = f'plate_{name}'
    adds.append(dict(type="video", assetId=A.get(key, key.upper()), trackId=V['V1'], startFrame=f0, sourceIn=0, durationFrames=f1 - f0, muted=True, **FULL))
    swish(f0)
NOW2 = W_('Buffer', 'R08') - 3; PRM = W_('prompt', 'R05') - 8; KICK = W_('and', 'R09') - 2
plate('skills', M0, B('R02')[0])
plate('scan', B('R02')[0], B('R04')[0])
plate('activity', B('R04')[0], B('R04b')[0])
plate('fineprint', B('R04b')[0], PRM)                  # holds into "But now with this"
plate('prompt', PRM, B('R07')[0])
plate('publish', B('R07')[0], NOW2)
plate('live', NOW2, B('R09')[0])
plate('perm', B('R09')[0], KICK)                       # "check your third-party apps, if it's LinkedIn verified"
plate('ua', KICK, B('P01a')[0])                        # "you don't want to get kicked out of LinkedIn" (UA 8.2 item 13)
plate('activity2', B('P01a')[0], B('P02')[0])
plate('chart', B('P02')[0], B('P03')[0])
plate('sent', B('P03')[0], B('C01')[0])
SAVE0 = B('C01')[0]; VER0 = B('V01')[0]
mg('backdrop', 'V1', SAVE0, END - SAVE0, 0, 0, 1080, 1920, {"paper": PAPER, "line": "#D9D6D1", "accent": ACC}); swish(SAVE0)
mg('save', 'TOP', SAVE0, VER0 - SAVE0, 70, 236, 940, 500, {"title": "SAVE THIS", "sub": "running my LinkedIn from Claude",
   "lines": "What it is  11 free Claude skills|Repo check  SkillSpector 9/100|Writes posts  yes|Posts on its own  no|With my prompt  drop to live, 10 min|Start with  Buffer, then Claude",
   "footerA": "", "footerB": "", "serif": "Fraunces", "hand": "Kalam", "sans": "Inter", "paper": PAPER, "ink": INK, "accent": ACC})
pop(SAVE0)

# ---------------- stickers and the verdict / CTA stamps ----------------
def stamp_props(label, wordtxt, icon, accent, size=150):
    return {"serif": "Fraunces", "hand": "Kalam", "paper": PAPER, "ink": INK, "accent": ACC, "wordColor": ACC if accent else INK,
            "label": label, "word": wordtxt, "wordSize": size, "icon": icon}
STK = [('11', 'R01b', 'installed', '11 SKILLS', 'plugin', False),
       ('Nvidia', 'R02', "NVIDIA's free scanner", 'SKILLSPECTOR', 'check', False),
       ('dangerous', 'R02', 'skip it and it gets', 'DANGEROUS', 'none', True),
       ('9', 'R03', 'risk score', '9 / 100', 'check', True),
       ("doesn't", 'R04b', 'it writes, but', 'NO POSTING', 'none', True),
       ('prompt', 'R05', 'with my', 'ONE PROMPT', 'plugin', False),
       ('poster', 'R06', 'I dropped', '3 FILES', 'image', False),
       ('project', 'R06b', 'Claude checked', 'MY FILES', 'plugin', False),
       ('10', 'R07', 'drop to live', '10 MIN', 'calendar', True),
       ('LinkedIn', 'R09', "check it's", 'LINKEDIN VERIFIED', 'check', False),
       ('ghost', 'P01a', 'people asked', 'GHOSTWRITER?', 'person', False),
       ('30', 'P02', 'my May challenge', '30 DAYS', 'calendar', False),
       ('36', 'P03', 'Claude wrote', '36 POSTS', 'check', False),
       ('Buffer', 'P03', 'posted with', 'BUFFER', 'plugin', False)]
SW, SH = 492, 197; SX, SY = 518, 592
stk = sorted((W_(t, b), lab, wd, ic, ac) for t, b, lab, wd, ic, ac in STK)
cuts = sorted(set(x['startFrame'] for x in adds if x.get('trackId') == V['V1'] and x['startFrame'] > M0))
for i, (sf, lab, wd, ic, ac) in enumerate(stk):
    n = 45
    if i + 1 < len(stk): n = min(n, stk[i + 1][0] - sf)
    nxt = next((c for c in cuts if c > sf), None)
    if nxt: n = min(n, nxt - sf)
    if n < 12: print('short sticker', wd, n)
    mg('stamp', 'STK', sf, n, SX, SY, SW, SH, stamp_props(lab, wd, ic, ac)); pop(sf)
VER_F = W_('correct', 'V01'); CTA_F = W_('goals', 'Z01')
mg('stamp', 'STK', VER_F, CTA_F - VER_F, 130, 236, 820, 328, stamp_props('verdict', 'CRACKED', 'trophy', True)); pop(VER_F)
mg('stamp', 'STK', CTA_F, END - CTA_F, 130, 236, 820, 328, stamp_props('comment', 'GHOST', 'comment', True)); pop(CTA_F)
srun = []
for a, b, m in runs:
    if srun and srun[-1][1] == a: srun[-1][1] = b
    else: srun.append([a, b])
srun[0][0] += 3                                   # stagger off the first speech frame
for a, b in srun:
    props = {"serif": "Fraunces", "paper": PAPER, "ink": INK, "accent": ACC, "top": "COOKED", "bottom": "CRACKED", "tickTop": False,
             "tickAt": (VER_F - a) if a <= VER_F < b else (0 if VER_F < a else 99999)}
    mg('score', 'SCO', a, b - a, 70, 735, 300, 265, props)
pop(M0 + 4)
mg('confetti', 'CON', VER_F, 130, 0, 0, 1080, 1920, {"paper": PAPER, "ink": INK, "accent": ACC, "extra": "#F2C14E", "count": 90}); sfx('boom', VER_F, -20, 20)
sfx('typing', B('R05')[0], -6, 90)
sfx('click', W_('10', 'R07') - 2, -14, 7)

# ---------------- captions ----------------
FIX = {'correct.': 'cracked.', 'correct': 'cracked', 'goals': 'GHOST', 'Nvidia': 'NVIDIA', 'ghost': 'ghostwriter', 'writer': ''}
caps = []
order = sorted(pos, key=lambda b: pos[b][0])
for base in order:
    ws = [(M0 + int(round(w[0] * 30)), FIX.get(w[1], w[1])) for w in AL if w[2] == base]
    ws = [(fr, t) for fr, t in ws if t]
    for k in range(1, len(ws)):
        if ws[k][0] <= ws[k - 1][0]: ws[k] = (ws[k - 1][0] + 2, ws[k][1])
    sents = []; cur = []
    for fr, t in ws:
        cur.append((fr, t))
        if re.search(r'[.,?!]$', t): sents.append(cur); cur = []
    if cur: sents.append(cur)
    groups = []
    for snt in sents:
        k = max(1, -(-len(snt) // 4)); sz = -(-len(snt) // k)
        for j in range(0, len(snt), sz): groups.append(snt[j:j + sz])
    merged = []
    for g in groups:
        if merged and len(g) == 1 and len(merged[-1]) < 5: merged[-1] = merged[-1] + g
        else: merged.append(g)
    for gi, g in enumerate(merged):
        st = max(g[0][0], pos[base][0]); en = merged[gi + 1][0][0] if gi + 1 < len(merged) else pos[base][1] + 3
        txt = ' '.join(re.sub(r'[,.]$', '', w) for _, w in g)
        caps.append((st, max(en, st + 8), txt, [max(0, fr - st) for fr, _ in g]))
for i, (f0, txt, tt) in enumerate(reel_caps):
    en = reel_caps[i + 1][0] if i + 1 < len(reel_caps) else HK
    caps.append((f0, en, txt, tt))
caps.sort()
CAPBOX = (120, 1430, 760, 220)                    # centred at x 500, text kept inside x 120..880
for i, (st, en, txt, tt) in enumerate(caps):
    if i + 1 < len(caps): en = min(en, caps[i + 1][0])
    size = max(36, min(56, int(720 / (0.6 * max(len(txt), 1)))))
    mg('caption', 'CAP', st, en - st, *CAPBOX, {"serif": "Fraunces", "paper": PAPER, "ink": INK, "accent": ACC, "text": txt,
       "times": ','.join(str(x) for x in tt), "size": size})

json.dump(adds, open('place-ep7-v2-adds.json', 'w'))
json.dump(plates, open('plates-ep7-v2.json', 'w'), indent=1)
json.dump(dict(HK=HK, S0=S0, M0=M0, END=END, VER_F=VER_F, CTA_F=CTA_F, SAVE0=SAVE0, pos=pos, runs=runs,
               stickers=[(s[0], s[2]) for s in stk], caps=[(c[0], c[2]) for c in caps]), open('place-ep7-v2-pos.json', 'w'), indent=1)
print('items', len(adds), 'END', END, round(END / 30, 1), 's | hook', HK, 'sting', S0, 'main', M0, 'verdict', VER_F, f'({VER_F/END:.0%})', 'cta', CTA_F)
for p in plates: print(f"  plate {p['name']:10} {p['frames']:4} f  {p['frames']/30:4.1f} s")
print('stickers', [(s[0], s[2]) for s in stk])
print('longest captions', sorted(((len(c[2]), c[2]) for c in caps), reverse=True)[:5])
