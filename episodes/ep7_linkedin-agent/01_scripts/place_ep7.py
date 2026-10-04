#!/usr/bin/env python3
"""Ep7 placement v1 (4 Oct 2026), built on Ep6 place_v4.py (Henry-approved format):
- Hook: Henry full frame, muted, watching the reel on his phone (take 3.0-8.6 s); the reel in the window over the phone with its own
  audio: "Claude can now run your entire LinkedIn completely free" (0.00-2.67) + "remove anything that sounds AI-written,
  preventing you from getting flagged" (29.10-32.00). Pill "Cooked or Cracked?" on top. Reel words captioned.
- Egg sting over a straight-to-camera hold: end-of-take smile (383.65) then the peace sign (385.05), cut on the egg crack (+34).
- CARD beats: Henry's card + a framed real screen panel in the top band (LinkedIn activity, Buffer Sent, challenge chart,
  the reel's "won't get flagged" UI, SkillSpector result, the repo's "do not post" fine print, his prompt, Buffer publish,
  the live post, LinkedIn User Agreement 8.2 item 13, the Buffer permissions), small stickers on key words.
- THEN VS NOW save card over L15 + L18; verdict and CTA on the big card with the CRACKED / GHOST stamps, confetti on CRACKED.
- Voice: take26-voice-v1.wav on VOX (Adobe Enhance swaps in once the cut is locked). No creator names anywhere.
Writes place-ep7-adds.json, place-ep7-pos.json, plates-ep7.json."""
import json, re, os
FPS = 30
cut = json.load(open('cut-ep7-v2.json')); items = cut['items']
W = [tuple(w) for w in json.load(open('/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep7_LinkedIn-Agent/04_raw-footage/transcripts/take26-words.json'))]
PL = json.load(open('plate-assets-ep7.json')) if os.path.exists('plate-assets-ep7.json') else {}
A = dict(take='b478270184', voice='84ca819c04', reel='469202b901',
         sting='f2a2cec326', pop='6240bb0252', click='3c8865c0dd', whoosh='17d6a4db45', boom='20d06e616d', typing='07be333642', ding='2b8bab8a3c',
         jingle='fad634a377', score='cd8b84b93b', pill='7c4174b280', frame='04f83b962d', stamp='a49ed1f8ff',
         confetti='7e3cda31be', caption='86b6934a44', backdrop='470e79c892', save='1147e36539')
A.update(PL)
V = json.load(open('tracks-ep7.json'))
INK = "#171411"; ACC = "#DF825F"; PAPER = "#FFFEFA"
FULL = dict(left=0, top=0, width=1080, height=1920, fit="cover")
CB = dict(left=225, top=800, width=630, height=1120, fit="cover")            # Henry's card
BIG = dict(left=163, top=590, width=754, height=1340, fit="cover")          # verdict + CTA
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
SEGS = [(0.00, 80), (29.10, 87)]               # reel source start, frames
REACT = 3.0                                    # take: phone up, chin on hand, muted
WIN = dict(left=640, top=905, width=300, height=533, fit="cover")
f = 0
for i, (rs, n) in enumerate(SEGS):
    vid('reel', 'HEN', f, rs, n, decibelAdjustment=0.0, audioFadeInDurationFrames=0 if i == 0 else 2, audioFadeOutDurationFrames=3, **WIN)
    if i: sfx('whoosh', f - 4, -20, 24)
    f += n
HK = f
vid('take', 'V1', 0, REACT, HK, muted=True, **FULL)
frame_mg(0, HK, (WIN['left'], WIN['top'], WIN['width'], WIN['height']), 24, 59)
mg('pill', 'TOP', 0, HK, 190, 232, 700, 150, {"text": "Cooked or Cracked?", "ink": INK, "paper": "#FFFFFF"}); pop(2)
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
HOLD = [(383.65, 34), (385.05, 38)]            # end-of-take smile, then the peace sign (cut on the egg crack)
fh = S0
for src, n in HOLD: vid('take', 'V1', fh, src, n, muted=True, **FULL); fh += n
aud('sting', 'A1', S0, 0, 72, decibelAdjustment=-8)
mg('jingle', 'TOP', S0, STING, 140, 200, 800, 320, {"word1": "COOKED", "word2": "OR", "word3": "CRACKED?", "beat1": 6, "beat2": 21, "beat3": 28, "accent": ACC, "gold": "#F2C14E"})
for b in (6, 21, 28): pop(S0 + b, -12)
sfx('whoosh', S0 + 34, -14, 24)

# ---------------- walk the speech cut ----------------
M0 = S0 + STING
def mode_of(base): return 'big' if base in ('L17', 'L20') else 'card'
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
def wf(word_src):
    for sp in speech:
        if not sp['muted'] and sp['src'] - 0.10 <= word_src < sp['src'] + sp['n'] / 30: return sp['f'] + max(0, int(round((word_src - sp['src']) * 30)))
    best = min((sp for sp in speech if not sp['muted']), key=lambda sp: min(abs(word_src - sp['src']), abs(word_src - sp['src'] - sp['n'] / 30)))
    fr = best['f'] if word_src < best['src'] else best['f'] + best['n'] - 1
    print('WARN word at', word_src, 'falls in a squeezed gap; snapped to frame', fr); return fr
def word(text, after):
    t = re.sub(r'[^a-z0-9]', '', text.lower())
    for a, b, w in W:
        if a >= after and re.sub(r'[^a-z0-9]', '', w.lower()).startswith(t): return a
    raise ValueError(text)
def W_(text, after): return wf(word(text, after))
B = lambda b: pos[b]
# spacers belong to the line before; the big card starts at the verdict line
for sp in speech:
    if sp['muted'] and sp['f'] >= B('L17')[0]: sp['mode'] = 'big'

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
swish(M0)

# ---------------- panels (V1) ----------------
plates = []
def plate(name, f0, f1, **p):
    plates.append(dict(name=name, frames=f1 - f0, **p))
    key = f'plate_{name}'
    adds.append(dict(type="video", assetId=A.get(key, key.upper()), trackId=V['V1'], startFrame=f0, sourceIn=0, durationFrames=f1 - f0, muted=True, **FULL))
    swish(f0)
plate('activity', M0, B('L02')[0])
plate('sent', B('L02')[0], B('L05')[0])
plate('chart', B('L05')[0], B('L07')[0])
plate('reel_ui', B('L07')[0], B('L08')[0])
plate('scan', B('L08')[0], B('L10')[0])
plate('fineprint', B('L10')[0], B('L11')[0])
plate('prompt', B('L11')[0], B('L12')[0])
plate('publish', B('L12')[0], B('L16')[0])
plate('live', B('L16')[0], B('L14')[0])
fapps = W_('third', 174.5)
plate('ua', B('L14')[0], W_('LinkedIn', 176.0) - 2)
plate('perm', W_('LinkedIn', 176.0) - 2, B('L15')[0])
SAVE0 = B('L15')[0]; VER0 = B('L17')[0]
mg('backdrop', 'V1', SAVE0, END - SAVE0, 0, 0, 1080, 1920, {"paper": PAPER, "line": "#D9D6D1", "accent": ACC}); swish(SAVE0)
mg('save', 'TOP', SAVE0, VER0 - SAVE0, 70, 226, 940, 500, {"title": "THEN VS NOW", "sub": "my LinkedIn, May vs this week",
   "lines": "Research in May  by hand|Research now  Claude, from my files|Who posts  Buffer, LinkedIn approved|My bills  same as before|Repo check  SkillSpector 9/100|Start with  Buffer, then Claude",
   "footerA": "", "footerB": "", "serif": "Fraunces", "hand": "Kalam", "sans": "Inter", "paper": PAPER, "ink": INK, "accent": ACC})
pop(SAVE0)

# ---------------- stickers (card beats) and the verdict / CTA stamps ----------------
def stamp_props(label, wordtxt, icon, accent, size=150):
    return {"serif": "Fraunces", "hand": "Kalam", "paper": PAPER, "ink": INK, "accent": ACC, "wordColor": ACC if accent else INK,
            "label": label, "word": wordtxt, "wordSize": size, "icon": icon}
STK = [('ghost', 12.4, 'people asked', 'GHOSTWRITER?', 'person', False),
       ('30', 20.0, 'my May challenge', '30 DAYS', 'calendar', False),
       ('36', 26.8, 'Claude wrote', '36 POSTS', 'check', False),
       ('Buffer', 30.1, 'posted with', 'BUFFER', 'plugin', False),
       ('134', 56.9, 'per post', '134 vs 217', 'none', True),
       ('More', 65.1, 'more posts, but', 'LOWER PER POST', 'none', True),
       ('free', 72.2, 'the claim', 'FREE SKILLS', 'plugin', False),
       ("won't", 77.5, 'and', 'NOT FLAGGED?', 'none', True),
       ('Nvidia', 97.3, "NVIDIA's free scanner", 'SKILLSPECTOR', 'check', False),
       ('dangerous', 101.0, 'skip it and it gets', 'DANGEROUS', 'none', True),
       ('9', 118.5, 'risk score', '9 / 100', 'check', True),
       ("doesn't", 139.5, 'it writes, but', 'NO POSTING', 'none', True),
       ('poster', 144.7, 'I dropped', '3 FILES', 'image', False),
       ('project', 153.7, 'Claude checked', 'MY FILES', 'plugin', False),
       ('10', 158.7, 'drop to live', '10 MIN', 'calendar', True),
       ('goals', 358.2, 'comment', 'GHOST', 'comment', True),
       ('LinkedIn', 176.0, "check it's", 'LINKEDIN VERIFIED', 'check', False)]
SW, SH = 492, 197; SX, SY = 518, 592
stk = sorted((W_(t, a), lab, wd, ic, ac) for t, a, lab, wd, ic, ac in STK)
cuts = sorted(set(x['startFrame'] for x in adds if x.get('trackId') == V['V1'] and x['startFrame'] > M0))
for i, (sf, lab, wd, ic, ac) in enumerate(stk):
    n = 45
    if i + 1 < len(stk): n = min(n, stk[i + 1][0] - sf)
    nxt = next((c for c in cuts if c > sf), None)
    if nxt: n = min(n, nxt - sf)
    if n < 12: print('short sticker', wd, n)
    mg('stamp', 'STK', sf, n, SX, SY, SW, SH, stamp_props(lab, wd, ic, ac)); pop(sf)
VER_F = W_('correct', 335.0); CTA_F = W_('goals', 362.5)
mg('stamp', 'STK', VER_F, CTA_F - VER_F, 130, 228, 820, 328, stamp_props('verdict', 'CRACKED', 'trophy', True)); pop(VER_F)
mg('stamp', 'STK', CTA_F, END - CTA_F, 130, 228, 820, 328, stamp_props('comment', 'GHOST', 'comment', True)); pop(CTA_F)
srun = []
for a, b, m in runs:
    if srun and srun[-1][1] == a: srun[-1][1] = b
    else: srun.append([a, b])
for a, b in srun:
    tick = VER_F - a if a <= VER_F < b else (-1 if VER_F >= b else 0)
    props = {"serif": "Fraunces", "paper": PAPER, "ink": INK, "accent": ACC, "top": "COOKED", "bottom": "CRACKED", "tickTop": False,
             "tickAt": tick if tick >= 0 else 99999}
    if VER_F < a: props["tickAt"] = 0
    mg('score', 'SCO', a, b - a, 70, 735, 300, 265, props)
pop(M0 + 1)
mg('confetti', 'CON', VER_F, 130, 0, 0, 1080, 1920, {"paper": PAPER, "ink": INK, "accent": ACC, "extra": "#F2C14E", "count": 90}); sfx('boom', VER_F, -20, 20)
sfx('typing', B('L11')[0], -6, B('L12')[0] - B('L11')[0])
sfx('click', W_('10', 158.7) - 2, -14, 7)

# ---------------- captions ----------------
caps = []; lines = []
# per line: every Whisper word whose start falls in the line's source span (squeezes only remove silence), mapped with snapping;
# Whisper runs up to ~0.35 s late in places, so known leaks are dropped and L09's tail ("and it's great") is kept.
LEAK = {('that', 70.92)}; EXT = {'L09': 0.7}
spans = {}
for sp in speech:
    if sp['muted']: continue
    a, b = sp['src'], sp['src'] + sp['n'] / 30
    s = spans.setdefault(sp['base'], [a, b]); s[0] = min(s[0], a); s[1] = max(s[1], b)
for base, (a, b) in sorted(spans.items(), key=lambda kv: pos[kv[0]][0]):
    b += EXT.get(base, 0.0)
    ws = [(wf(s0), w) for s0, e0, w in W if a - 0.02 <= s0 < b and (re.sub(r'[^a-z]', '', w.lower()), round(s0, 2)) not in LEAK]
    ws.sort(key=lambda x: x[0])
    for k in range(1, len(ws)):
        if ws[k][0] <= ws[k-1][0]: ws[k] = (ws[k-1][0] + 2, ws[k][1])
    lines.append(dict(base=base, words=ws, end=pos[base][1]))
FIX = {'correct.': 'cracked.', 'correct': 'cracked', 'goals': 'GHOST', 'Nvidia': 'NVIDIA', 'medium': 'median', '9600': '9,600',
       'ghost': 'ghostwriter', 'writer': '', 'use': 'used', '217': '217'}
for ln in lines:
    seq = []
    for fr, t in ln['words']:
        tt = FIX.get(t, t)
        if t == 'use' and ln['base'] != 'L12': tt = t
        if t == 'ghost' and ln['base'] != 'L01': tt = 'GHOST'
        if tt == '': continue
        seq.append((fr, tt))
    sents = []; cur = []
    for fr, t in seq:
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
        st = g[0][0]; en = merged[gi + 1][0][0] if gi + 1 < len(merged) else ln['end'] + 3
        txt = ' '.join(re.sub(r'[,.]$', '', w) for _, w in g)
        caps.append((st, max(en, st + 8), txt, [fr - st for fr, _ in g]))
for i, (f0, txt, tt) in enumerate(reel_caps):
    en = reel_caps[i + 1][0] if i + 1 < len(reel_caps) else HK
    caps.append((f0, en, txt, tt))
caps.sort()
for i, (st, en, txt, tt) in enumerate(caps):
    if i + 1 < len(caps): en = min(en, caps[i + 1][0])
    size = 58 if len(txt) <= 22 else 50 if len(txt) <= 30 else 44
    mg('caption', 'CAP', st, en - st, 40, 1430, 1000, 220, {"serif": "Fraunces", "paper": PAPER, "ink": INK, "accent": ACC, "text": txt,
       "times": ','.join(str(x) for x in tt), "size": size})

json.dump(adds, open('place-ep7-adds.json', 'w'))
json.dump(plates, open('plates-ep7.json', 'w'), indent=1)
json.dump(dict(HK=HK, S0=S0, M0=M0, END=END, VER_F=VER_F, CTA_F=CTA_F, SAVE0=SAVE0, pos=pos, runs=runs,
               stickers=[(s[0], s[2]) for s in stk], caps=[(c[0], c[2]) for c in caps]), open('place-ep7-pos.json', 'w'), indent=1)
print('items', len(adds), 'END', END, round(END / 30, 1), 's | hook', HK, 'sting', S0, 'main', M0, 'verdict', VER_F, f'({VER_F/END:.0%})')
print('runs', runs)
for p in plates: print(' plate', p)
print('stickers', [(s[0], s[2]) for s in stk])
