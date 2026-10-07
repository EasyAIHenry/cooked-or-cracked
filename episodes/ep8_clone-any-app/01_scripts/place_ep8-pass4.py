#!/usr/bin/env python3
"""Ep8 placement v1 (7 Oct 2026), Ep7 v9 DNA: paper backdrop, Henry in a card in the bottom half, one explainer per beat in the
top zone, word captions over the card, scoreboard left, series opener (creator reel line in the window under his chin, egg sting
with his result as the teaser and the episode title), COOKED verdict, CLONE CTA beat.

Inputs: cut-ep8-v2.json (segments with pieces, seconds in the take), words-cut-ep8-v2.json (cut-timeline seconds),
02_graphics/explainers/beats.json + cues-ep8.json, assets-ep8.json (name -> ChatCut asset id), tracks-ep8.json (name -> track id).
Writes place-ep8-adds.json (edit_item adds, batched by the caller) and place-ep8-pos.json (frame map for QA)."""
import json, re, os
EP = '/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep8_Clone-Any-App'
S = f'{EP}/01_scripts'; X = f'{EP}/02_graphics/explainers'
FPS = 30
cut = json.load(open(f'{S}/cut-ep8-v2.json'))['segments']
W = json.load(open(f'{S}/words-cut-ep8-v2.json'))                 # [cut_s, cut_e, word, line]
A = json.load(open(f'{S}/assets-ep8.json'))                        # take1, take2, card1, card2, voice1, voice2, reel, teaser, loomdemo, slotdemo,
                                                                   # sting, pop, click, whoosh, boom, typing, jingle, score, frame, stamp, title, caption, backdrop, B01..B11
V = json.load(open(f'{S}/tracks-ep8.json'))                        # V1, HEN, FRM, STK, TOP, FRM2 (clip window frames, above TOP), SCO, CAP, VOX, A1, A2, A3, A4
INK = "#171411"; ACC = "#DF825F"; PAPER = "#FFFEFA"; GOLD = "#F2C14E"
FULL = dict(left=0, top=0, width=1080, height=1920, fit="cover")
CB = dict(left=225, top=760, width=630, height=1120, fit="cover")            # Henry's card (Ep7 v3 onward)
BIG = dict(left=168, top=676, width=700, height=1244, fit="cover")          # verdict + CTA
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
def frame_mg(f, n, box, border, radius, track='FRM'):
    l, t, w, h = box; mg('frame', track, f, n, l - border, t - border, w + 2 * border, h + 2 * border, {"border": border, "radius": radius, "paper": "#FFFFFF"})

# ---------------- hook: Henry watching the phone, the reel's first line in the window with its audio ----------------
HK = 93                                                             # the reel cuts to the creator's face at 3.10 s
REACT = 31.60                                                        # part1: watching the phone
WIN = dict(left=486, top=880, width=370, height=658, fit="cover")    # under the chin, over the phone; frame ends x 880
vid('hook', 'V1', 0, REACT - 31.0, HK, muted=True, **FULL)             # part1_hook_31-36.mp4 starts at take 31.0
vid('reel', 'HEN', 0, 0.0, HK, decibelAdjustment=0.0, audioFadeInDurationFrames=1, audioFadeOutDurationFrames=2, **WIN)
frame_mg(0, HK, (WIN['left'], WIN['top'], WIN['width'], WIN['height']), 24, 57)
mg('title', 'TOP', 0, HK, 140, 236, 800, 231, {"line1": "Clone any app with Claude?", "line2": "I gave it one hour", "size1": 72,
   "serif": "Fraunces", "hand": "Kalam", "paper": PAPER, "ink": INK, "accent": ACC}); pop(2)

# ---------------- sting (v4): no hold shot. Henry's first line starts straight after the reel; the egg jingle sings under it,
# lower, with the title over his chest for 72 frames while the word captions wait. (Pass 3's silent straight-to-lens hold showed
# him mid-sentence with the sound off: "awkward silence", "I look really tired".)
S0 = HK; JINGLE = 72
aud('sting', 'A1', S0, 0, JINGLE, decibelAdjustment=-14)
mg('jingle', 'STK', S0, JINGLE, 140, 1420, 800, 320, {"word1": "COOKED", "word2": "OR", "word3": "CRACKED?", "beat1": 6, "beat2": 21, "beat3": 28, "accent": ACC, "gold": GOLD})
for b in (6, 21, 28): pop(S0 + b, -15)
M0 = S0
BREATH = 9
TAKE = {'part1': ('card1', 'voice1'), 'part2': ('card2', 'voice2')}
CUT0 = sum(sg['dur'] + 0.3 for sg in cut if sg['label'].startswith('H00'))   # H00 sits first in the cut json; beats/words count it
cut = [sg for sg in cut if not sg['label'].startswith('H00')]
f = M0; pos = {}; speech = []
for k, seg in enumerate(cut):
    lab = seg['label'][:3]; card, voice = TAKE[seg['take']]
    for q, (x, y) in enumerate(seg['pieces']):
        n = int(round((y - x) * FPS))
        speech.append(dict(f=f, n=n, src=x, muted=False, card=card, voice=voice, base=lab)); pos.setdefault(lab, [f, f]); pos[lab][1] = f + n; f += n
    if k + 1 < len(cut):
        nxt = cut[k + 1]; ncard, _ = TAKE[nxt['take']]
        speech.append(dict(f=f, n=BREATH, src=nxt['pieces'][0][0] - BREATH / FPS, muted=True, card=ncard, voice=None, base=lab)); f += BREATH
TAIL = 12; last = speech[-1]
speech.append(dict(f=f, n=TAIL, src=last['src'] + last['n'] / FPS, muted=True, card=last['card'], voice=None, base=last['base'])); END = f + TAIL
VER_LINE = 'L11'; CTA_LINE = 'L13'
def mode_of(base, fr): return 'big' if (base in (VER_LINE, CTA_LINE) or fr >= pos[VER_LINE][0]) else 'card'
for sp in speech:
    sp['mode'] = mode_of(sp['base'], sp['f'])
    geo = {'card': CB, 'big': BIG}[sp['mode']]
    vid(sp['card'], 'HEN', sp['f'], sp['src'], sp['n'], muted=True, **geo)
    if not sp['muted']: aud(sp['voice'], 'VOX', sp['f'], sp['src'], sp['n'], decibelAdjustment=0)
runs = []
for sp in speech:
    if runs and runs[-1][2] == sp['mode'] and runs[-1][1] == sp['f']: runs[-1][1] = sp['f'] + sp['n']
    else: runs.append([sp['f'], sp['f'] + sp['n'], sp['mode']])
for a, b, m in runs:
    g = {'card': CB, 'big': BIG}[m]; frame_mg(a, b - a, (g['left'], g['top'], g['width'], g['height']), 12, 26)

# cut-timeline seconds -> timeline frame
def cf(t): return M0 + int(round((t - CUT0) * FPS))
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
def W_(text, line, nth=0):
    hits = [w for w in W if w[3] == line and norm(w[2]).startswith(norm(text))]
    if len(hits) <= nth: raise ValueError((text, line, nth))
    return cf(hits[nth][0])

# ---------------- backdrop + explainers (B04/B05 are the clone screen recordings) ----------------
EXP = json.load(open(f'{X}/beats.json')); CUES = json.load(open(f'{X}/cues-ep8.json'))
EXPROPS = {"serif": "Fraunces", "hand": "Kalam", "sans": "Inter", "paper": PAPER, "ink": INK, "accent": ACC, "gold": GOLD}
mg('backdrop', 'V1', M0, END - M0, 0, 0, 1080, 1920, {"paper": PAPER, "line": "#D9D6D1", "accent": ACC})
CLIPLEN = {'loomdemo': 288, 'slotdemo': 420}                       # 9.6 s and 14 s at 30 fps
CLIP = {'B04_recorder-clip': ('loomdemo', 0.0, '6 MIN', 'first command to a working recorder'),
        'B05_queue-clip': ('slotdemo', 0.0, '8 MIN', 'to a working queue')}
# pass 2b (7 Oct 2026): tighten_cut_ep8.py trimmed the dead air at line heads, but every explainer's cues were timed to the pass-2a
# line starts. Start each MG earlier by its line's trim (later when the head grew) so the pops still land on the words. Clips
# (B04/B05) have no cues and stay on the line start. L12 stays put: B09 cannot stretch the 6 frames it would need.
OLD_IN = {s['label'][:3]: s['in'] for s in json.load(open(f'{S}/cut-ep8-v2-pass2a.json'))['segments']}
SHIFT = {s['label'][:3]: (int(round((s['in'] - OLD_IN[s['label'][:3]]) * FPS)) if s['label'][:3] in OLD_IN else 0) for s in cut}; SHIFT['L12'] = 0
BEAT_IDS = [b['id'] for b in EXP]
BEAT_START = {b['id']: pos[b['lines'][0]][0] - (0 if (b['id'] in CLIP or 'stamp' in b) else SHIFT.get(b['lines'][0], 0)) for b in EXP}
def beat_span(bt):                       # anchor each beat to its line's real frames, less the cue shift; run to the next beat's start
    i = BEAT_IDS.index(bt['id']); s0 = BEAT_START[bt['id']]
    nxt = BEAT_START[BEAT_IDS[i + 1]] if i + 1 < len(BEAT_IDS) else END
    return s0, nxt - s0
for bt in EXP:
    s0, n = beat_span(bt); p = bt.get('place')                        # stamp beats carry no place box
    if bt['id'] in CLIP:
        asset, src, word, label = CLIP[bt['id']]
        n = min(n, CLIPLEN[asset])                                   # an item must fit inside its asset's exact length
        vid(asset, 'TOP', s0, src, n, muted=True, left=p['left'], top=p['top'], width=p['width'], height=p['height'], fit="cover")
        frame_mg(s0, n, (p['left'], p['top'], p['width'], p['height']), 12, 26, track='FRM2')
        mg('stamp', 'STK', s0 + 8, n - 8, 60, 244, 420, 150, {"serif": "Fraunces", "hand": "Kalam", "paper": PAPER, "ink": INK, "accent": ACC,
           "wordColor": ACC, "label": label, "word": word, "wordSize": 110, "icon": "calendar"}); pop(s0 + 8)
        swish(s0); continue
    if 'stamp' in bt:                                                # v3: a reason line carried by the series stamp, top zone
        st = bt['stamp']
        mg('stamp', 'STK', s0 + 8, n - 8, 130, 240, 820, 328, {"serif": "Fraunces", "hand": "Kalam", "paper": PAPER, "ink": INK, "accent": ACC,
           "wordColor": ACC, "label": st['label'], "word": st['word'], "wordSize": 110, "icon": st['icon']}); pop(s0 + 8, -9); swish(s0); continue
    if bt['id'] not in A: print('MISSING explainer asset', bt['id']); continue
    meta = json.load(open(f"{X}/{bt['id']}/meta.json")); n = min(n, meta['duration'])
    mg(bt['id'], 'TOP', s0, n, p['left'], p['top'], p['width'], p['height'], dict(EXPROPS))
    if not bt['id'].startswith('B11'): swish(s0)
    kept = []
    for c in sorted(CUES.get(bt['id'], []), key=lambda c: c['f']):
        if 6 <= c['f'] < n - 4 and len(kept) < 5 and all(abs(c['f'] - k['f']) >= 18 for k in kept): kept.append(c)
    for c in kept: pop(s0 + c['f'], -13)

# ---------------- scoreboard (COOKED ticks on the word), verdict boom, no confetti for a COOKED verdict ----------------
VER_F = W_('cooked', VER_LINE); CTA_F = W_('Comment', CTA_LINE)
srun = []
for a, b, m in runs:
    if srun and srun[-1][1] == a: srun[-1][1] = b
    else: srun.append([a, b])
srun[0][0] += 3                                                       # stagger off the first speech frame (Ep7 export hang lesson)
for a, b in srun:
    props = {"serif": "Fraunces", "paper": PAPER, "ink": INK, "accent": ACC, "top": "COOKED", "bottom": "CRACKED", "tickTop": True,
             "tickAt": (VER_F - a) if a <= VER_F < b else (0 if VER_F < a else 99999)}
    mg('score', 'SCO', a, b - a, 70, 735, 300, 265, props)
pop(M0 + 4)
sfx('boom', VER_F, -20, 20)
# "Well, this is cooked" opens the CTA line: the top zone would sit empty for the 52 frames before B11's counter starts, so the
# series verdict stamp pops there (pass 2b, 7 Oct 2026)
mg('stamp', 'STK', pos[CTA_LINE][0], BEAT_START['B11_clone-cta'] + 52 - pos[CTA_LINE][0], 130, 240, 820, 328, {"serif": "Fraunces", "hand": "Kalam", "paper": PAPER, "ink": INK, "accent": ACC,
   "wordColor": ACC, "label": "the verdict", "word": "COOKED", "wordSize": 110, "icon": "check"}); pop(pos[CTA_LINE][0] + 8, -9)

# ---------------- captions: words on the cut timeline, grouped by sentence, 3 to 5 words a card ----------------
FIX = {'quad': 'Claude', 'quad,': 'Claude,', 'claim': 'clone', 'Clawd': 'Claude', 'cool.': 'cooked.', 'cool': 'cooked', 'code.': 'cooked.', 'code': 'cooked',
       'slot': 'Slotline', 'line': '', 'line.': '', 'line,': '', 'Slotline line': 'Slotline', 'post': 'posts', 'pose': 'posts', 'anything': 'any data', 'buffer': 'Buffer', 'buffer.': 'Buffer.', 'buffer,': 'Buffer,', 'meta': 'Meta', 'No,': 'Now', 'clone.': 'clone'}
words = [(cf(w[0]), FIX.get(w[2], w[2]), w[3]) for w in W if w[3] != 'H00']
# v3: on the two long single-piece lines both Whisper passes drift by up to a second, so their words are timed from the energy
# envelope instead: the full-take word sequence (text only) spread over the speech bursts in proportion to character count.
ENERGY_ALIGN = {'L4a', 'LMa'}
import wave, numpy as np
def energy_runs(take, t0, t1, thr=-42.0, mingap=0.12):
    w_ = wave.open(f'{EP}/04_raw-footage/transcripts/{take}-16k.wav'); sr = w_.getframerate()
    x = np.frombuffer(w_.readframes(w_.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    seg = x[int(t0 * sr):int(t1 * sr)]; hop = sr // 100; n = len(seg) // hop
    e = 20 * np.log10(np.sqrt((seg[:n * hop].reshape(n, hop) ** 2).mean(1)) + 1e-9); on = e > thr; out = []; i = 0; g = int(mingap * 100)
    while i < n:
        if on[i]:
            j = i
            while j < n and (on[j] or (j + g < n and on[j:j + g].any())): j += 1
            out.append((t0 + i / 100, t0 + j / 100)); i = j
        else: i += 1
    return out
for lab in ENERGY_ALIGN:
    seg = next(s_ for s_ in cut if s_['label'][:3] == lab); x0, x1 = seg['pieces'][0]
    full = json.load(open(f"{EP}/04_raw-footage/transcripts/{seg['take']}-words.json"))
    toks = seg['label'].split()[1:]                                   # the line's own words; the full-take times drift too much to window on
    rr = energy_runs(seg['take'], x0, x1); total = sum(b - a_ for a_, b in rr); chars = sum(len(t) + 1 for t in toks)
    est = []; acc = 0.0
    for t in toks:
        frac = acc / chars; want = frac * total; run_t = 0.0
        for a_, b in rr:
            if want <= run_t + (b - a_) + 1e-9: est.append(a_ + (want - run_t)); break
            run_t += b - a_
        else: est.append(rr[-1][1])
        acc += len(t) + 1
    line_cf = pos[lab][0]
    words = [w_ for w_ in words if w_[2] != lab] + [(line_cf + round((t_ - x0) * FPS), FIX.get(t, t), lab) for t_, t in zip(est, toks)]
    words.sort(key=lambda w_: w_[0])
    print('energy-aligned', lab, [(fr - line_cf, t) for fr, t, l in words if l == lab])
if not any(t == 'Not' for _, t, l in words if l == 'L12'):            # the per-piece transcriber dropped the first word of L12
    i = next(i for i, (_, _, l) in enumerate(words) if l == 'L12'); words.insert(i, (pos['L12'][0], 'Not', 'L12'))
words = [(fr, t, l) for fr, t, l in words if t and '[' not in t and ']' not in t]   # Whisper's [BLANK_AUDIO] tokens
caps = []
for base in sorted(pos, key=lambda b: pos[b][0]):
    ws = [(fr, t) for fr, t, l in words if l == base]
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
caps.sort()
CAP0 = S0 + JINGLE + 4                                                  # the jingle title sits in the caption band; captions start after it
trimmed = []
for st, en, txt, tt in caps:
    if en <= CAP0: continue
    if st < CAP0: tt = [max(0, x - (CAP0 - st)) for x in tt]; st = CAP0
    trimmed.append((st, en, txt, tt))
caps = trimmed
CAPBOX = (120, 1430, 760, 220)
for i, (st, en, txt, tt) in enumerate(caps):
    if i + 1 < len(caps): en = min(en, caps[i + 1][0])
    size = max(36, min(56, int(720 / (0.6 * max(len(txt), 1)))))
    mg('caption', 'CAP', st, en - st, *CAPBOX, {"serif": "Fraunces", "paper": PAPER, "ink": INK, "accent": ACC, "text": txt,
       "times": ','.join(str(x) for x in tt), "size": size})

for a in adds:                                                        # v3 levels: voice +3 dB, every effect -3 dB (Henry: "make sure I'm audible")
    if a['type'] == 'audio': a['decibelAdjustment'] = a.get('decibelAdjustment', 0) + (3 if a['trackId'] == V['VOX'] else -3)
json.dump(adds, open(f'{S}/place-ep8-adds.json', 'w'))
json.dump(dict(HK=HK, S0=S0, M0=M0, END=END, VER_F=VER_F, CTA_F=CTA_F, pos=pos, runs=runs, caps=[(c[0], c[2]) for c in caps]),
          open(f'{S}/place-ep8-pos.json', 'w'), indent=1)
print('items', len(adds), 'END', END, round(END / FPS, 1), 's | hook', HK, 'sting', S0, 'main', M0, 'verdict', VER_F, f'({VER_F/END:.0%})', 'cta', CTA_F)
print('longest captions', sorted(((len(c[2]), c[2]) for c in caps), reverse=True)[:4])
