#!/usr/bin/env python3
"""Ep6 placement v4 (3 Oct 2026, Henry's notes on v3): sting hold = his straight-to-camera smile (549.75) + two thumbs up (68.80) instead of
the leaning-back 509 s shot ("weird angle, makes me look fat"); jingle on TOP of him, not across his chest; from the verdict line to the
end his card is bigger (fills the gap under the CRACKED / SITE stamps); the receipt card ends when the verdict line starts.
Based on placement v3 (3 Oct 2026, Henry's notes on v2).
- Hook: Henry full frame silently reviewing (take synced to the reel: reel t = take t - 0.58, he watched it on his phone),
  Nate's reel in the usual window over the phone with his own audio (claim 0.00-3.09 + "they literally watch the house
  being built in real time" 26.36-29.72), Nate's words captioned. Henry: "me in the majority frame, Nate in the smaller frame".
- Egg sting, then "I tested it on a real shop..." (no "And").
- CARD beats: Henry's card + a framed real screenshot panel in the top band (Instagram, Google Maps, Figma, Claude Code's
  index.html, Nate's GitHub, scroll-craft harness sheet, Higgsfield job), small stickers on the key words.
- PIP beats (teardown, flip, real photo, the site scroll, the WhatsApp button): the visual full frame, unblocked,
  Henry in the bottom-right corner cam, no stickers, no scoreboard.
- Voice: Adobe Podcast Enhance WAV on its own audio track (take17_v picture muted everywhere).
Writes place-v3-adds.json, place-v3-pos.json and plates-v3.json (panel clips to render; asset ids come from plate-assets-v3.json)."""
import json, re, os
FPS = 30
cut = json.load(open('cut-ep6-v4.json')); items = cut['items']
W = [(a, b, t) for a, b, t in json.load(open('chatcut-words.json')) if not t.startswith('[')]
PL = json.load(open('plate-assets-v4.json'))
A = dict(take='06ee92e665', voice=PL.get('voice', 'VOICE'), reel='74291b3c6d', desk='d6006b2474', mob='3dab26c0e3',
         tear='a1d08362af', rev='931f34028d', hero='9861f331b4',
         sting='05ceb95054', pop='47146b2911', click='1e38c75cf9', whoosh='82e8ce3761', boom='b865f17941',
         jingle='4a2f5d1f1f', score='8ba6a6eb88', pill='9529e2257e', frame='454f292f1d', stamp='607e7f52e6',
         confetti='6fa1636903', caption='a38210f407', backdrop='ab659d7829', save='83a7631d01')
A.update({k: v for k, v in PL.items() if k != 'voice'})
V = json.load(open('tracks-v4.json')) if os.path.exists('tracks-v4.json') else {k: k for k in
     ('V1', 'BG2', 'HEN', 'FRM', 'STK', 'TOP', 'SCO', 'CAP', 'CON', 'A1', 'A2', 'A3', 'A4', 'VOX')}
INK = "#171411"; ACC = "#DF825F"; PAPER = "#FFFEFA"; DARK = "#0C1013"
FULL = dict(left=0, top=0, width=1080, height=1920, fit="cover")
CB = dict(left=225, top=800, width=630, height=1120, fit="cover")            # Henry's card
CAM = dict(left=740, top=950, width=270, height=480, fit="cover")           # corner cam (hook + PIP)
BIG = dict(left=163, top=590, width=754, height=1340, fit="cover")          # verdict + CTA: card fills the gap under the stamp
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
    if any(x.get('type') == 'audio' and x['assetId'] == A[asset] and abs(x['startFrame'] - f) < 3 for x in adds): return
    for t in ('A2', 'A3', 'A4'):
        if all(f >= e or f + n <= s for s, e in sfx_used[t]):
            sfx_used[t].append((f, f + n)); aud(asset, t, f, src, n, decibelAdjustment=db); return
    print('SFX dropped', asset, f)
def pop(f, db=-9): sfx('pop', f, db, 10)
def swish(f): sfx('whoosh', f, -18, 24)
def frame_mg(f, n, box, border, radius):
    l, t, w, h = box; mg('frame', 'FRM', f, n, l - border, t - border, w + 2 * border, h + 2 * border, {"border": border, "radius": radius, "paper": "#FFFFFF"})

# ---------------- hook: Nate's reel full frame, Henry's reaction cam ----------------
OFF = 0.58                                   # reel t -> take t (audio cross-correlation, 2 windows agree)
SEGS = [(0.00, 93), (26.36, 101)]            # claim / "they literally watch the house being built in real time"
f = 0
WIN = dict(left=680, top=905, width=300, height=533, fit="cover")   # Henry's usual review layout: him full frame, the reel over his phone
for i, (rs, n) in enumerate(SEGS):
    vid('take', 'V1', f, rs + OFF, n, muted=True, **FULL)
    vid('reel', 'HEN', f, rs, n, decibelAdjustment=-3.5, audioFadeInDurationFrames=0 if i == 0 else 2, audioFadeOutDurationFrames=3, **WIN)
    if i: sfx('whoosh', f - 4, -20, 24)
    f += n
HK = f
frame_mg(0, HK, (WIN['left'], WIN['top'], WIN['width'], WIN['height']), 24, 59)
mg('pill', 'TOP', 0, HK, 190, 232, 700, 150, {"text": "Cooked or Cracked?", "ink": INK, "paper": "#FFFFFF"}); pop(2)
# Nate's words, captioned (his burnt-in captions are tiny inside the window); reel word times from large-v3
NATE = [(0, 0.00, "Claude Code plus Seedance 2.5", [0.00, 0.16, 0.32, 0.62, 0.98]),
        (0, 1.48, "can build websites", [1.48, 1.70, 1.92]),
        (0, 2.18, "that look like this", [2.18, 2.40, 2.56, 2.76]),
        (1, 26.38, "So as someone scrolls", [26.38, 26.52, 26.58, 26.76]),
        (1, 27.08, "down on the website", [27.08, 27.32, 27.42, 27.48]),
        (1, 27.86, "they literally watch the house", [27.86, 28.00, 28.18, 28.48, 28.64]),
        (1, 28.82, "being built in real time", [28.82, 29.00, 29.24, 29.34, 29.48])]
seg_f0 = [0, SEGS[0][1]]
nate_caps = []
for seg, t0, txt, tt in NATE:
    f0 = seg_f0[seg] + int(round((t0 - SEGS[seg][0]) * 30))
    nate_caps.append((f0, txt, [int(round((x - t0) * 30)) for x in tt]))

# ---------------- sting ----------------
S0 = HK; STING = 72                                  # the sting sound is loud to 2.2 s, so 2.4 s
HOLD = [(549.75, 34), (68.80, 38)]                   # end-of-take smile to camera, then two thumbs up (cut lands on the egg crack, +34)
fh = S0
for src, n in HOLD: vid('take', 'V1', fh, src, n, muted=True, **FULL); fh += n
aud('sting', 'A1', S0, 0, 72, decibelAdjustment=-8)
mg('jingle', 'TOP', S0, STING, 140, 200, 800, 320, {"word1": "COOKED", "word2": "OR", "word3": "CRACKED?", "beat1": 6, "beat2": 21, "beat3": 28, "accent": ACC, "gold": "#F2C14E"})
for b in (6, 21, 28): pop(S0 + b, -12)
sfx('whoosh', S0 + 34, -14, 24)

# ---------------- walk the speech cut ----------------
M0 = S0 + STING
PIP_LABELS = ('seed.b', 'seed.c')
def mode_of(lab):
    if lab.split('.')[0] in ('result', 'biz') or lab.rsplit('.', 1)[0] in PIP_LABELS or lab in PIP_LABELS: return 'pip'
    return 'big' if lab.split('.')[0] in ('verdict', 'cta') else 'card'
f = M0; pos = {}; plab = {}; speech = []; prev = None
for k, it in enumerate(items):
    if 'spacer' in it:
        n = it['spacer']; nxt = next((j for j in items[k + 1:] if 'take' in j), None)
        speech.append(dict(f=f, n=n, src=(nxt['in'] - n / 30) if nxt else 0, muted=True, mode=speech[-1]['mode'])); f += n; continue
    lab = it['label']; base = lab.split('.')[0]; line = lab if lab.count('.') < 2 else lab.rsplit('.', 1)[0]
    line = '.'.join(lab.split('.')[:2]) if '.' in lab and not lab.split('.')[1].isdigit() else base
    m = mode_of(line)
    speech.append(dict(f=f, n=it['frames'], src=it['in'], muted=False, mode=m, label=lab, line=line))
    pos.setdefault(base, [f, f]); pos[base][1] = f + it['frames']
    plab.setdefault(line, [f, f]); plab[line][1] = f + it['frames']
    f += it['frames']
TAIL = 12; last = speech[-1]; speech.append(dict(f=f, n=TAIL, src=last['src'] + last['n'] / 30, muted=True, mode=last['mode'])); END = f + TAIL
def wf(word_src):
    for sp in speech:
        if not sp['muted'] and sp['src'] - 0.10 <= word_src < sp['src'] + sp['n'] / 30: return sp['f'] + max(0, int(round((word_src - sp['src']) * 30)))
    raise ValueError(word_src)
def word(text, after):
    t = re.sub(r'[^a-z0-9$]', '', text.lower())
    for a, b, w in W:
        if a >= after and re.sub(r'[^a-z0-9$]', '', w.lower()).startswith(t): return a
    raise ValueError(text)
def W_(text, after): return wf(word(text, after))
B = lambda b: pos[b]; P = lambda l: plab[l]

# Henry: card or corner cam, muted picture; voice from the Adobe WAV on its own track
for sp in speech:
    geo = {'card': CB, 'big': BIG, 'pip': CAM}[sp['mode']]
    vid('take', 'HEN', sp['f'], sp['src'], sp['n'], muted=True, **geo)
    if not sp['muted']:
        kw = dict(fadeOutDurationFrames=2) if sp.get('label') == 'biz.a' else {}   # audio items use fadeOut*, video items audioFadeOut*
        aud('voice', 'VOX', sp['f'], sp['src'], sp['n'], decibelAdjustment=0, **kw)
# frame runs
runs = []
for sp in speech:
    if runs and runs[-1][2] == sp['mode'] and runs[-1][1] == sp['f']: runs[-1][1] = sp['f'] + sp['n']
    else: runs.append([sp['f'], sp['f'] + sp['n'], sp['mode']])
for a, b, m in runs:
    g = {'card': CB, 'big': BIG, 'pip': CAM}[m]
    frame_mg(a, b - a, (g['left'], g['top'], g['width'], g['height']), 12, 26)
swish(M0)

# ---------------- backgrounds / plates ----------------
plates = []
def plate(name, f0, f1, **p):
    plates.append(dict(name=name, frames=f1 - f0, **p))
    key = f'plate_{name}'
    adds.append(dict(type="video", assetId=A.get(key, key.upper()), trackId=V['V1'], startFrame=f0, sourceIn=0, durationFrames=f1 - f0, muted=True, **FULL))
    swish(f0)
def bg(asset, f0, f1, src, track='V1', **kw):
    vid(asset, track, f0, src, f1 - f0, muted=True, **(kw or FULL)); swish(f0)
f523 = W_('523', 62.5) - 3; fweb = W_('but', 64.0)   # pan to the website row from "but they don't really have a website" (QA r2: on "website" it showed 5 frames)
plate('ig_header', M0, f523)
plate('google', f523, B('figma')[0], pan_at=fweb - f523)
fcl = W_('Claude', 128.8) - 3; fthr = W_('their', 136.5) - 3
plate('figma_overview', B('figma')[0], fcl)
plate('figma_selected', fcl, fthr)
plate('ig_grid', fthr, B('build')[0])
fuse = W_('use', 195.0) - 6
plate('code', B('build')[0], fuse)
plate('github', fuse, B('seed')[0])   # Henry 3 Oct: '10 minutes' cut, so the harness sheet goes; GitHub (MIT) holds through "This is free"
plate('higgsfield', B('seed')[0], P('seed.b')[0])
fflip = W_('flip', 243.4); freal = W_('real', 261.8) - 2
bg('tear', P('seed.b')[0], fflip, 0.0)
bg('rev', fflip, freal, max(0.0, 8.0 - (freal - fflip) / 30))
bg('hero', freal, P('seed.d')[0], 0.0)
plate('higgsfield_details', P('seed.d')[0], B('result')[0])
r0 = B('result')[0]; c0 = B('cost')[0]
mg('backdrop', 'V1', r0, c0 - r0, 0, 0, 1080, 1920, {"paper": DARK, "line": DARK, "accent": DARK}); swish(r0)
MOB = dict(left=96, top=0, width=887, height=1920, fit="cover")          # whole mobile page, side bars in the page colour
on_f = W_('on', 302.8)
vid('mob', 'BG2', r0, max(0.0, 9.35 - (on_f - r0) / 30), P('biz.b')[0] - r0, muted=True, **MOB)   # lit peak 9.3-9.5 s (QA r1)
vid('mob', 'BG2', P('biz.b')[0], 24.0, P('biz.c')[0] - P('biz.b')[0], muted=True, **MOB); swish(P('biz.b')[0])
vid('desk', 'BG2', P('biz.c')[0], 48.6, c0 - P('biz.c')[0], muted=True, left=0, top=0, width=3072, height=1920, fit="cover"); swish(P('biz.c')[0])
sfx('click', W_('click', 432.3), -16, 7)   # -10 peaked at -0.4 dBFS (QA r1)
mg('backdrop', 'V1', c0, B('verdict')[0] - c0, 0, 0, 1080, 1920, {"paper": PAPER, "line": "#D9D6D1", "accent": ACC}); swish(c0)
bg('hero', B('verdict')[0], B('cta')[0], 3.0)
mg('backdrop', 'V1', B('cta')[0], END - B('cta')[0], 0, 0, 1080, 1920, {"paper": PAPER, "line": "#D9D6D1", "accent": ACC}); swish(B('cta')[0])

# ---------------- stickers (card beats only) and the verdict / CTA stamps ----------------
def stamp_props(label, wordtxt, icon, accent):
    return {"serif": "Fraunces", "hand": "Kalam", "paper": PAPER, "ink": INK, "accent": ACC, "wordColor": ACC if accent else INK,
            "label": label, "word": wordtxt, "wordSize": 118 if wordtxt == "WHATSAPP" else 150, "icon": icon}
STK = [('Supersystems', 60.5, 'a real shop in Singapore', 'SUPERSYSTEMS', 'person', False),
       ('523', 62.5, 'Google reviews', '523 REVIEWS', 'check', False),
       ('website', 65.9, 'but no', 'WEBSITE', 'none', True),
       ('Figma', 126.2, 'step one', 'FIGMA', 'image', False),
       ('Claude', 128.8, "I didn't draw it", 'CLAUDE DID', 'plugin', False),
       ('five', 134.9, 'their own photos', '5 MINUTES', 'calendar', False),
       ('Claude', 191.5, 'step two', 'CLAUDE CODE', 'plugin', False),
       ('This', 196.5, 'his skill', 'FREE', 'check', True),   # on 'This is free' (sticker ends at the Higgsfield cut)
       ('Seed', 206.0, 'step three', 'SEEDANCE 2.5', 'video', False),
       ('24', 265.5, 'first try', '24 CREDITS', 'money', False)]
SW, SH = 492, 197; SX, SY = 518, 592
stk = sorted(((P('seed.d')[0] if wd == '24 CREDITS' else W_(t, a)), lab, wd, ic, ac) for t, a, lab, wd, ic, ac in STK)
cuts = sorted(set([x['startFrame'] for x in adds if x.get('trackId') == V['V1'] and x['startFrame'] > M0] + [P('seed.b')[0], B('result')[0]]))
for i, (sf, lab, wd, ic, ac) in enumerate(stk):
    n = 45
    if wd == '24 CREDITS': n = B('result')[0] - sf          # holds over Higgsfield's "Generate in 1080p 96" button so 96 is never read as our cost
    if i + 1 < len(stk): n = min(n, stk[i + 1][0] - sf)
    nxt = next((c for c in cuts if c > sf), None)
    if nxt: n = min(n, nxt - sf)                             # stop at the panel change (QA r1)
    mg('stamp', 'STK', sf, n, SX, SY, SW, SH, stamp_props(lab, wd, ic, ac)); pop(sf)
COST_F = c0
VER_F = W_('correct', 516.1); SITE_F = W_('site', 547.8)
mg('stamp', 'STK', VER_F, SITE_F - VER_F, 130, 228, 820, 328, stamp_props('verdict', 'CRACKED', 'trophy', True)); pop(VER_F)
mg('stamp', 'STK', SITE_F, END - SITE_F, 130, 228, 820, 328, stamp_props('comment', 'SITE', 'comment', True)); pop(SITE_F)
mg('save', 'TOP', COST_F, B('verdict')[0] - COST_F, 70, 226, 940, 500, {"title": "MY COST AND TIME", "sub": "receipts, one shop, one evening",
   "lines": "Client scan (Apify)  US$0.75|Instagram checks  US$0.03|Figma design  free plan|Scroll-craft skill  free|Seedance 2.5  24 credits|Total time  18 min",
   "footerA": "", "footerB": "", "serif": "Fraunces", "hand": "Kalam", "sans": "Inter", "paper": PAPER, "ink": INK, "accent": ACC})
pop(COST_F)
# scoreboard on card runs only; the tick lands on the verdict word
srun = []
for a, b, m in runs:                                       # scoreboard: one item per stretch without PIP (card and big merge)
    if m == 'pip': continue
    if srun and srun[-1][1] == a: srun[-1][1] = b
    else: srun.append([a, b])
for a, b in srun:
    tick = VER_F - a if a <= VER_F < b else (-1 if VER_F >= b else 0)
    props = {"serif": "Fraunces", "paper": PAPER, "ink": INK, "accent": ACC, "top": "COOKED", "bottom": "CRACKED", "tickTop": False,
             "tickAt": tick if tick >= 0 else 99999}
    if VER_F < a: props["tickAt"] = 0                                      # after the verdict: already ticked
    mg('score', 'SCO', a, b - a, 70, 735, 300, 265, props)
pop(M0 + 1)
mg('confetti', 'CON', VER_F, 130, 0, 0, 1080, 1920, {"paper": PAPER, "ink": INK, "accent": ACC, "extra": "#F2C14E", "count": 90}); sfx('boom', VER_F, -20, 20)

# ---------------- captions (Henry only; the hook uses Nate's own burnt-in captions) ----------------
caps = []; lines = []; used = set()
for sp in speech:
    if sp['muted']: continue
    a = sp['src']; b = a + sp['n'] / 30; ws = []
    for i, (s0, e0, t) in enumerate(W):
        m = (s0 + e0) / 2
        if i not in used and a - 0.08 <= m < b + 0.02 and s0 < b - 0.04:
            used.add(i); ws.append((sp['f'] + max(0, int(round((s0 - a) * 30))), t))
    base = sp['label'].split('.')[0]
    if lines and lines[-1]['base'] == base: lines[-1]['words'] += ws; lines[-1]['end'] = sp['f'] + sp['n']
    else: lines.append(dict(base=base, words=ws, end=sp['f'] + sp['n']))
FIX = {'Sitdance': 'Seedance', 'CDANCE': 'Seedance', '80': '18', 'correct': 'cracked'}
for ln in lines:
    seq = []
    for fr, t in ln['words']:
        tt = FIX.get(t, t)
        if seq and seq[-1][1].lower() == 'seed' and t.lower().startswith('dance'): seq[-1] = (seq[-1][0], 'Seedance'); continue
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
        txt = ' '.join(re.sub(r'[,.]$', '', w) for _, w in g).replace('Claude code', 'Claude Code')
        caps.append((st, max(en, st + 8), txt, [fr - st for fr, _ in g]))
for i, (f0, txt, tt) in enumerate(nate_caps):
    en = nate_caps[i + 1][0] if i + 1 < len(nate_caps) else HK
    caps.append((f0, en, txt, tt))
caps.sort()
for i, (st, en, txt, tt) in enumerate(caps):
    if i + 1 < len(caps): en = min(en, caps[i + 1][0])
    size = 58 if len(txt) <= 22 else 50 if len(txt) <= 30 else 44
    mg('caption', 'CAP', st, en - st, 40, 1430, 1000, 220, {"serif": "Fraunces", "paper": PAPER, "ink": INK, "accent": ACC, "text": txt,
       "times": ','.join(str(x) for x in tt), "size": size})

json.dump(adds, open('place-v4-adds.json', 'w'))
json.dump(plates, open('plates-v4.json', 'w'), indent=1)
json.dump(dict(HK=HK, S0=S0, M0=M0, END=END, VER_F=VER_F, COST_F=COST_F, pos=pos, plab=plab, runs=runs,
               stickers=[(s[0], s[2]) for s in stk], caps=[(c[0], c[2]) for c in caps]), open('place-v4-pos.json', 'w'), indent=1)
print('items', len(adds), 'END', END, round(END / 30, 1), 's | hook', HK, 'sting', S0, 'main', M0, 'verdict', VER_F, f'({VER_F/END:.0%})')
print('runs', runs)
for p in plates: print(' plate', p)
