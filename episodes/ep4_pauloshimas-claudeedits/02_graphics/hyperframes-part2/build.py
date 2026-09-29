#!/usr/bin/env python3
"""Builds index.html for Part 2 (Paulo Shimas method: every effect is said on camera,
Claude writes the edit as a HyperFrames composition). Times are on the rough-cut timeline."""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
WORDS = json.load(open(os.path.join(HERE, "..", "words_final.json")))
DUR = 48.62
SVG_D = re.search(r' d="([^"]+)"', open(os.path.join(HERE, "assets", "claude.svg")).read()).group(1)

# ---------- captions: 2-3 words, break at punctuation, key word in orange ----------
KEYS = {"palm", "claude", "flick", "nice", "harder", "screens", "background", "text", "hide",
        "frame", "whisper", "ffmpeg", "hyperframes", "full", "screen", "episodes", "last",
        "documentary", "dramatic", "cool", "awesome", "cooked", "edit"}
def norm(t): return t.lower().strip(".,!?'\"")
def is_key(w):
    n = norm(w["text"])
    if 35.57 < w["start"] < 37.17: return False
    if n in KEYS: return True
    if n == "me" and 10.47 < w["start"] < 10.67: return True          # "background, ME, and then the text"
    if n == "three" and 7.92 < w["start"] < 8.22: return True         # "three screens"
    if n == "one" and 34.17 < w["start"] < 34.37: return True         # "Last one"
    if n == "back" and (abs(w["start"]-15.44)<0.05 or abs(w["start"]-39.15)<0.05): return True    # "bring me back"
    return False
def show(t):
    t = t.rstrip(",.")
    return t
chunks, cur = [], []
for i, w in enumerate(WORDS):
    cur.append(w)
    nxt = WORDS[i + 1] if i + 1 < len(WORDS) else None
    brk = (len(cur) >= 3 or w["text"][-1] in ".,!?" or nxt is None or nxt["start"] - w["end"] > 0.35)
    if brk:
        chunks.append(cur); cur = []
# merge any chunk that would be on screen under 0.3 s into the next one (no overlapping captions)
merged, i = [], 0
while i < len(chunks):
    c = chunks[i]
    if i + 1 < len(chunks) and chunks[i + 1][0]["start"] - c[0]["start"] < 0.3 and len(c) + len(chunks[i + 1]) <= 4:
        chunks[i + 1] = c + chunks[i + 1]; i += 1; continue
    merged.append(c); i += 1
chunks = merged
cap_html, cap_js = [], []
for i, c in enumerate(chunks):
    s = c[0]["start"]
    nxt = chunks[i + 1][0]["start"] if i + 1 < len(chunks) else DUR
    e = min(nxt, c[-1]["end"] + 0.45)
    e = max(e, min(s + 0.35, nxt))
    e = min(e, DUR)
    spans = " ".join(f'<span class="w{" k" if is_key(w) else ""}">{show(w["text"])}</span>' for w in c)
    cap_html.append(f'<div id="cap{i}" class="cap clip" data-start="{s:.2f}" data-duration="{e - s:.2f}" data-track-index="40">{spans}</div>')
    cap_js.append(f'tl.fromTo("#cap{i}",{{scale:0.86,opacity:0}},{{scale:1,opacity:1,duration:0.12,ease:"back.out(2)"}},{s:.2f});')

# ---------- sound effects ----------
SFX_LEN = {"whoosh": 0.45, "whoosh_long": 0.8, "whoosh_rev": 0.6, "pop": 0.14, "click": 0.05, "shine": 1.1,
           "glass": 1.6, "boom": 2.2, "hit": 0.9, "riser": 1.0, "flash": 0.35, "bubble-pop": 0.36}
SFX = [(1.82, 'shine', 0.18),
       (3.98, 'whoosh', 0.33),
       (4.23, 'glass', 0.24),
       (4.25, 'hit', 0.17),
       (8.06, 'whoosh_long', 0.27),
       (9.69, 'click', 0.24),
       (10.54, 'click', 0.24),
       (11.24, 'click', 0.24),
       (12.65, 'click', 0.33),
       (12.72, 'pop', 0.21),
       (15.44, 'click', 0.33),
       (15.46, 'shine', 0.17),
       (15.72, 'whoosh', 0.19),
       (16.96, 'whoosh', 0.24),
       (18.46, 'whoosh', 0.23),
       (18.5, 'pop', 0.18),
       (21.51, 'pop', 0.24),
       (23.43, 'pop', 0.24),
       (25.53, 'pop', 0.24),
       (27.02, 'whoosh', 0.24),
       (28.49, 'whoosh', 0.18),
       (28.74, 'whoosh', 0.16),
       (28.99, 'whoosh', 0.16),
       (33.34, 'whoosh_rev', 0.21),
       (35.75, 'hit', 0.19),
       (37.63, 'boom', 0.25),
       (37.19, 'flash', 0.11),
       (39.15, 'whoosh_rev', 0.24),
       (45.4, 'bubble-pop', 0.35)]
sfx_html = []
for i, (t, n, v) in enumerate(SFX):
    sfx_html.append(f'<audio id="sfx{i}" src="sfx/{n}.{"mp3" if n=="bubble-pop" else "wav"}" data-start="{t:.2f}" data-duration="{SFX_LEN[n]:.2f}" data-track-index="{60 + i}" data-volume="{v}"></audio>')

HTML = r"""<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1080, height=1920" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<script type="importmap">{"imports":{"three":"./vendor/three.module.js"}}</script>
<style>
@font-face{font-family:"Fraunces";src:url("assets/fonts/fraunces-latin.woff2") format("woff2");font-weight:600 900;font-display:block}
@font-face{font-family:"Kalam";src:url("assets/fonts/KalamBold.ttf") format("truetype");font-weight:700;font-display:block}
html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#0c0d10;font-family:"Montserrat","Archivo Black",sans-serif}
#root{position:relative;width:1080px;height:1920px;overflow:hidden}
.full{position:absolute;left:0;top:0;width:1080px;height:1920px}
#bgfill{background:radial-gradient(120% 80% at 50% 40%,#23262d 0%,#111217 60%,#08090b 100%)}
#bggrid{background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:60px 60px}
#baseWrap{overflow:hidden;transform-origin:490px 1000px}
#baseWrap video{width:1080px;height:1920px;display:block;object-fit:cover}
#logoWrap{transform-origin:490px 1000px;pointer-events:none}
#logoCanvas{width:1080px;height:1920px;display:block}
/* glass */
#crack{opacity:0}
#flash{background:#fff;opacity:0}
/* 3D layers (Paulo's glass panes) */
#panes{perspective:2300px;perspective-origin:62% 38%;opacity:0}
#pstack{transform-style:preserve-3d}
.pane{position:absolute;left:0;top:0;width:1080px;height:1920px;border-radius:0;overflow:hidden;box-sizing:border-box}
.pane .rim{position:absolute;inset:0;border-radius:46px;border:5px solid rgba(255,255,255,.72);box-shadow:inset 0 0 60px rgba(255,255,255,.10),0 0 46px rgba(210,200,255,.28);opacity:0}
#paneScene .layer{position:absolute;left:0;top:0;width:1080px;height:1920px}
#paneGlass{background:linear-gradient(155deg,rgba(58,50,86,.62),rgba(16,14,26,.78));opacity:0}
#paneText .glass{position:absolute;inset:0;background:linear-gradient(155deg,rgba(58,50,86,.70),rgba(14,12,24,.86));opacity:0}
#ttl{position:absolute;left:0;top:268px;width:1080px;text-align:center;color:#fff}
#ttl .k{font-family:"Montserrat";font-weight:700;font-size:44px;letter-spacing:13px;opacity:0;text-shadow:0 3px 18px rgba(0,0,0,.55)}
#ttl .m{margin-top:6px;font-family:"Archivo Black";font-size:94px;letter-spacing:2px;white-space:nowrap;line-height:1;opacity:0;text-shadow:0 6px 34px rgba(0,0,0,.55),0 0 22px rgba(255,255,255,.35)}
#hiddenPill{position:absolute;left:390px;top:760px;width:300px;height:92px;border-radius:18px;background:rgba(20,18,28,.88);border:3px solid rgba(255,255,255,.55);color:#fff;font-family:"Space Mono";font-weight:700;font-size:40px;letter-spacing:10px;display:flex;align-items:center;justify-content:center;opacity:0}
#layerChip{position:absolute;left:376px;top:1700px;height:120px;padding:0 34px 0 18px;border-radius:28px;background:rgba(20,18,28,.9);display:flex;align-items:center;gap:22px;opacity:0}
#layerChip .n{width:84px;height:84px;border-radius:20px;background:#E0703A;color:#fff;font-family:"Archivo Black";font-size:40px;display:flex;align-items:center;justify-content:center}
#layerChip .t1{font-family:"Space Mono";font-weight:700;font-size:26px;letter-spacing:6px;color:#b9b4c7}
#layerChip .t2{font-family:"Montserrat";font-weight:800;font-size:46px;color:#fff;line-height:1}
#lp{position:absolute;left:746px;top:700px;width:300px;border-radius:22px;background:rgba(24,22,32,.9);border:2px solid rgba(255,255,255,.14);box-shadow:0 24px 60px rgba(0,0,0,.5);padding:14px 10px 12px;opacity:0;font-family:"Montserrat";color:#f2f0f7}
#lp .hd{display:flex;justify-content:space-between;align-items:center;padding:4px 14px 12px;font-weight:700;font-size:25px;color:#e7e3f0}
#lp .row{position:relative;display:flex;align-items:center;gap:14px;height:66px;padding:0 12px;border-radius:14px;font-weight:600;font-size:26px}
#lp .row .hl{position:absolute;inset:0;border-radius:14px;background:rgba(255,255,255,.16);opacity:0}
#lp .row > *{position:relative}
#lp .row .th{width:56px;height:42px;border-radius:8px;overflow:hidden;background:#15131d;border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-family:"Archivo Black";font-size:22px;color:#fff}
#lp .row .th img{width:100%;height:100%;object-fit:cover}
#lp .eyeoff{position:absolute;left:12px;opacity:0}
#cursor{position:absolute;left:0;top:0;width:54px;height:54px;opacity:0;transform-origin:6px 4px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.45))}
/* split: me right, silent clone left */
.card{position:absolute;top:510px;width:389px;height:691px;border-radius:24px;overflow:hidden}
#cloneCard{left:91px;opacity:0;box-shadow:0 30px 80px rgba(0,0,0,.55)}
#cloneCard .inner{position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:0 0;transform:scale(0.36)}
#cloneCard .inner > *{position:absolute;left:0;top:0;width:1080px;height:1920px}
#cloneCard .mir{transform:scaleX(-1)}
.cardRim{position:absolute;top:510px;width:389px;height:691px;border-radius:24px;border:4px solid rgba(255,255,255,.92);box-sizing:border-box;opacity:0}
#rimL{left:91px}
#rimR{left:600px;box-shadow:0 30px 80px rgba(0,0,0,.55)}
.tag{position:absolute;top:1142px;height:46px;padding:0 16px;border-radius:23px;display:flex;align-items:center;gap:8px;font-family:"Space Mono";font-weight:700;font-size:21px;opacity:0}
#tagL{left:116px;background:rgba(20,20,26,.86);color:#fff}
#tagR{left:625px;background:#fff;color:#111}
#xhead{position:absolute;left:0;top:214px;width:1080px;text-align:center}
#xk{font-family:"Space Mono";font-weight:700;font-size:25px;letter-spacing:6px;color:#FF8A3D;opacity:0}
#xt{margin-top:10px;font-family:"Archivo Black";font-size:60px;color:#fff;line-height:1.05}
#xt span{display:inline-block;opacity:0}
#xt .o{color:#FF8A3D}
.stepc{position:absolute;top:372px;width:318px;height:108px;border-radius:22px;background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.14);display:flex;align-items:center;gap:14px;padding:0 14px;box-sizing:border-box;opacity:0}
.stepc .ic{width:74px;height:74px;border-radius:20px;background:#FF8A3D;display:flex;align-items:center;justify-content:center;flex:none}
.stepc .vb{font-family:"Archivo Black";font-size:33px;color:#fff;line-height:1}
.stepc .tool{font-family:"Space Mono";font-weight:700;font-size:22px;color:#c7cbd3;margin-top:6px}
#sc1{left:36px}#sc2{left:381px}#sc3{left:726px}
/* floating screens */
#screens{perspective:1500px}
.scr{position:absolute;border:8px solid #0d0e11;border-radius:34px;overflow:hidden;background:#000;box-shadow:0 30px 70px rgba(0,0,0,.45);opacity:0}
.scr video{width:100%;height:100%;object-fit:cover;display:block}
.scr .tag{position:absolute;left:14px;top:14px;padding:4px 12px;border-radius:14px;background:#FF8A3D;color:#111;font-family:"Space Mono";font-weight:700;font-size:22px}
#scr1{left:34px;top:330px;width:300px;height:533px}
#scr2{left:746px;top:330px;width:300px;height:533px}
#scr3{left:420px;top:64px;width:240px;height:427px}
/* documentary */
#docBg{opacity:0;background:#F6C90E radial-gradient(rgba(0,0,0,.10) 2.2px,transparent 2.8px) 0 0/18px 18px}
#docGlow{opacity:0;background:radial-gradient(60% 45% at 50% 58%,rgba(255,255,255,.55),rgba(255,255,255,0) 70%)}
#dramaBg{opacity:0;background:radial-gradient(70% 50% at 50% 55%,#5a0b0e 0%,#1a0405 55%,#050505 100%)}
#cutDocWrap{opacity:0;transform-origin:540px 1250px}
#cutDocWrap video{width:1080px;height:1920px;display:block;filter:grayscale(1) contrast(1.28) brightness(1.04)}
#docTitles{position:absolute;left:0;top:0;width:1080px;height:600px;opacity:0}
#dkick{position:absolute;left:0;width:1080px;top:214px;text-align:center;font-family:"Space Mono";font-weight:700;font-size:27px;letter-spacing:6px;color:#111}
#dname{position:absolute;left:0;width:1080px;top:246px;text-align:center;font-family:"League Gothic";font-size:196px;line-height:.92;color:#111;letter-spacing:2px}
#dsub{position:absolute;left:190px;width:700px;top:436px;height:62px;background:#111;color:#F6C90E;font-family:"Archivo Black";font-size:34px;display:flex;align-items:center;justify-content:center;border-radius:6px}
#dramaTitles{position:absolute;left:0;top:0;width:1080px;height:640px}
#dt1,#dt2{position:absolute;left:0;width:1080px;text-align:center;font-family:"League Gothic";opacity:0;line-height:.9}
#dt1{top:190px;font-size:206px;color:#fff}
#dt2{top:376px;font-size:132px;color:#E3242B;letter-spacing:2px}
.bar{position:absolute;left:0;width:1080px;background:#000;transform:scaleY(0)}
#barTop{top:0;height:150px;transform-origin:50% 0}
#barBot{top:1700px;height:220px;transform-origin:50% 100%}
#grain{opacity:0;mix-blend-mode:overlay;background:url(assets/grain.png) 0 0/540px 960px}
/* pill + captions + cta */
#pill{position:absolute;left:0;width:1080px;top:132px;display:flex;justify-content:center}
#pill .p{display:flex;align-items:center;gap:12px;padding:10px 26px 10px 18px;border-radius:40px;background:rgba(255,255,255,.93);box-shadow:0 8px 24px rgba(0,0,0,.18);font-family:"Montserrat";font-weight:700;font-size:29px;color:#18181b}
.cap{position:absolute;left:40px;width:1000px;top:1212px;height:96px;display:flex;justify-content:center;align-items:center;gap:16px;font-family:"Montserrat";font-weight:900;font-size:66px;color:#fff;-webkit-text-stroke:2px rgba(0,0,0,.55);paint-order:stroke fill;text-shadow:0 5px 0 rgba(0,0,0,.28),0 0 22px rgba(0,0,0,.35);white-space:nowrap}
.cap .k{color:#FF9A57}
/* series comment stamp (paper-stamp-v4 look) */
#stamp{position:absolute;left:130px;top:228px;width:1000px;height:400px;transform-origin:0 0;transform:scale(0.82)}
#stamp .root{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:8px}
#stLabel{font-family:"Kalam";font-size:60px;font-weight:700;line-height:1.2;color:#171411;background:#FFFEFA;padding:4px 26px;clip-path:polygon(0% 4%,15% 0%,29% 4%,43% 1%,58% 4%,72% 0%,87% 3%,100% 1%,99% 97%,83% 100%,70% 96%,55% 100%,41% 96%,25% 99%,10% 97%,0% 100%);opacity:0}
#stWord{font-family:"Fraunces";font-size:150px;font-weight:900;line-height:1.05;letter-spacing:2px;color:#DF825F;background:#FFFEFA repeating-linear-gradient(0deg,transparent,transparent 9px,#D9D6D1 10px,transparent 11px);padding:0 36px;white-space:nowrap;clip-path:polygon(0% 4%,15% 0%,29% 4%,43% 1%,58% 4%,72% 0%,87% 3%,100% 1%,99% 97%,83% 100%,70% 96%,55% 100%,41% 96%,25% 99%,10% 97%,0% 100%);opacity:0}
#stRule{width:640px;height:40px}
#stBadge{position:absolute;left:16px;top:8px;width:96px;height:96px;border-radius:48px;background:#FFFEFA;box-shadow:4px 5px 0 rgba(23,20,17,0.35);display:flex;align-items:center;justify-content:center;opacity:0}
</style>
</head>
<body>
<div id="root" data-composition-id="part2" data-start="0" data-duration="__DUR__" data-width="1080" data-height="1920">
  <div id="bgfill" class="full"></div>
  <div id="bggrid" class="full"></div>

  <!-- base take (rough cut, SDR) -->
  <div id="baseWrap" class="full">
    <video id="base" src="assets/base.mp4" muted playsinline data-start="0" data-duration="__DUR__" data-track-index="1"></video>
  </div>

  <!-- floating episodes (behind the cutout) -->
  <div id="screens" class="full">
    <div id="scr1" class="scr"><video id="ep1v" src="assets/ep1_clip.mp4" muted playsinline data-start="28.34" data-duration="5.88" data-media-start="0" data-track-index="5"></video><div class="tag">EP 1</div></div>
    <div id="scr2" class="scr"><video id="ep2v" src="assets/ep2_clip.mp4" muted playsinline data-start="28.34" data-duration="5.88" data-media-start="0" data-track-index="6"></video><div class="tag">EP 2</div></div>
    <div id="scr3" class="scr"><video id="ep3v" src="assets/ep3_clip.mp4" muted playsinline data-start="28.34" data-duration="5.88" data-media-start="0" data-track-index="7"></video><div class="tag">EP 3</div></div>
  </div>
  <div id="cutFloatWrap" class="full">
    <video id="cutFloat" src="assets/cutout.webm" muted playsinline data-start="28.20" data-duration="6.07" data-media-start="28.20" data-track-index="9" style="width:1080px;height:1920px;display:block"></video>
  </div>

  <!-- 3D layers, Paulo's glass panes: scene (plate + me), glass, text -->
  <div id="panes" class="full">
    <div id="pstack" class="full">
      <div id="paneScene" class="pane">
        <img id="plateL" class="layer" src="assets/plate.png" />
        <video id="cutL" class="layer" src="assets/cutout.webm" muted playsinline data-start="7.05" data-duration="9.60" data-media-start="7.05" data-track-index="4"></video>
        <div id="hiddenPill">HIDDEN</div>
        <div id="layerChip"><div class="n">02</div><div><div class="t1">LAYER</div><div class="t2">Me</div></div></div>
        <div class="rim"></div>
      </div>
      <div id="paneGlass" class="pane"><div class="rim"></div></div>
      <div id="paneText" class="pane"><div class="glass"></div><div id="ttl"><div class="k">YOUR EDITING DAYS</div><div class="m">MIGHT BE OVER.</div></div><div class="rim"></div></div>
    </div>
  </div>
  <div id="lp">
    <div class="hd"><span>Layers</span><span style="opacity:.6">&#8250;</span></div>
    <div class="row" id="rText"><div class="hl"></div>__EYE__<div class="th">T</div><span>Text</span></div>
    <div class="row" id="rMe"><div class="hl"></div><span class="eyeon">__EYE__</span><span class="eyeoff">__EYEOFF__</span><div class="th"><img src="assets/thumb_me.png"/></div><span class="lbl">Me</span></div>
    <div class="row" id="rBg"><div class="hl"></div>__EYE__<div class="th"><img src="assets/thumb_bg.png"/></div><span>Background</span></div>
  </div>
  <svg id="cursor" viewBox="0 0 24 24"><path d="M3 2 L3 19 L7.5 14.8 L10.4 21.4 L13.4 20.1 L10.6 13.6 L16.8 13.6 Z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>

  <!-- split: silent clone on the left, me on the right -->
  <div id="cloneCard" class="card">
    <div class="inner">
      <img class="mir" src="assets/plate.png" />
      <video id="cloneV" class="mir" src="assets/clone_cut.webm" muted playsinline data-start="18.40" data-duration="9.00" data-media-start="0.80" data-track-index="8"></video>
    </div>
  </div>
  <div id="rimL" class="cardRim"></div><div id="rimR" class="cardRim"></div>
  <div id="tagL" class="tag">__MUTE__CLONE &middot; MUTED</div>
  <div id="tagR" class="tag">__MIC__HENRY</div>
  <div id="xhead"><div id="xk">WHAT HAPPENED HERE</div><div id="xt"><span id="x1">How</span> <span id="x2" class="o">Claude</span> <span id="x3">edits</span> <span id="x4">a</span> <span id="x5">video</span></div></div>
  <div id="sc1" class="stepc"><div class="ic">__EAR__</div><div><div class="vb">LISTENS</div><div class="tool">Whisper</div></div></div>
  <div id="sc2" class="stepc"><div class="ic">__EYEICON__</div><div><div class="vb">LOOKS</div><div class="tool">FFmpeg</div></div></div>
  <div id="sc3" class="stepc"><div class="ic">__BUILD__</div><div><div class="vb">BUILDS</div><div class="tool">HyperFrames</div></div></div>

  <!-- documentary -->
  <div id="docBg" class="full"></div>
  <div id="docGlow" class="full"></div>
  <div id="dramaBg" class="full"></div>
  <div id="cutDocWrap" class="full">
    <video id="cutDoc" src="assets/cutout.webm" muted playsinline data-start="35.67" data-duration="3.85" data-media-start="35.67" data-track-index="12"></video>
  </div>
  <div id="docTitles"><div id="dkick">A COOKED OR CRACKED ORIGINAL</div><div id="dname">HENRY CHUA</div><div id="dsub">THE MAN WHO LET CLAUDE EDIT</div></div>
  <div id="dramaTitles"><div id="dt1">ONE TAKE.</div><div id="dt2">NO EDITING APP.</div></div>
  <div id="barTop" class="bar"></div><div id="barBot" class="bar"></div>
  <div id="grain" class="full"></div>

  <!-- 3D logo + glass -->
  <div id="logoWrap" class="full"><canvas id="logoCanvas" width="1080" height="1920"></canvas></div>
  <svg id="crack" class="full" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg"><g id="crackUnder" fill="none" stroke="rgba(0,0,0,.38)" stroke-width="6" stroke-linecap="round"></g><g id="crackTop" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"></g><circle cx="560" cy="820" r="16" fill="#fff" opacity=".9"/></svg>
  <div id="flash" class="full"></div>

  <!-- pill, captions, CTA -->
  <div id="pill"><div class="p"><svg width="36" height="36" viewBox="0 0 24 24"><path d="__SVGD__" fill="#D97757"/></svg>Edited 100% by Claude</div></div>
  __CAPTIONS__
  <div id="stamp"><div class="root"><div id="stLabel">comment</div><div id="stWord">EDIT</div><svg id="stRule" viewBox="0 0 600 40"><path id="stPath" d="M18 24 Q160 8 300 20 T582 14" fill="none" stroke="#DF825F" stroke-width="13" stroke-linecap="round" stroke-dasharray="640" stroke-dashoffset="640"/></svg></div><div id="stBadge"><svg viewBox="0 0 24 24" width="64" height="64"><g stroke="#171411" stroke-width="2.2" fill="none"><path d="M4 5 H20 V16 H11 L7 20 V16 H4 Z" fill="#FFFEFA"/><circle cx="8.5" cy="10.5" r="1.2" fill="#171411" stroke="none"/><circle cx="12" cy="10.5" r="1.2" fill="#171411" stroke="none"/><circle cx="15.5" cy="10.5" r="1.2" fill="#DF825F" stroke="none"/></g></svg></div></div>

  <!-- audio -->
  <audio id="voice" src="assets/voice.wav" data-start="0" data-duration="__DUR__" data-track-index="20" data-volume="1"></audio>
  __SFX__
</div>

<script>
(function(){
  // ---- glass crack, seeded so every render is identical ----
  function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  const R=mulberry32(7), cx=560, cy=820, P=[];
  for(let i=0;i<16;i++){
    const ang=i/16*Math.PI*2+R()*0.3, len=520+R()*900, seg=6+Math.floor(R()*4); let pts=[[cx,cy]];
    for(let k=1;k<=seg;k++){
      const r=len*k/seg, a=ang+(R()-0.5)*0.32, x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r; pts.push([x,y]);
      if(R()<0.38){const ba=a+(R()<0.5?-1:1)*(0.4+R()*0.5), bl=50+R()*170; P.push(`M${x.toFixed(1)} ${y.toFixed(1)} L${(x+Math.cos(ba)*bl).toFixed(1)} ${(y+Math.sin(ba)*bl).toFixed(1)}`);}
    }
    P.push('M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L'));
  }
  [60,150,290,470].forEach(rad=>{
    let d='';const n=28;
    for(let k=0;k<n;k++){ if(R()<0.3) continue;
      const a0=k/n*Math.PI*2, a1=(k+1)/n*Math.PI*2, r0=rad*(1+(R()-.5)*.28), r1=rad*(1+(R()-.5)*.28);
      d+=`M${(cx+Math.cos(a0)*r0).toFixed(1)} ${(cy+Math.sin(a0)*r0).toFixed(1)} L${(cx+Math.cos(a1)*r1).toFixed(1)} ${(cy+Math.sin(a1)*r1).toFixed(1)} `;}
    P.push(d);
  });
  const ns='http://www.w3.org/2000/svg';
  P.forEach(d=>{['crackUnder','crackTop'].forEach(g=>{const p=document.createElementNS(ns,'path');p.setAttribute('d',d);document.getElementById(g).appendChild(p);});});

  const tl=gsap.timeline({paused:true});
  // ---- 1. palm punch-in, logo, flick, glass (0 - 5.3) ----
  tl.to(["#baseWrap","#logoWrap"],{scale:1.28,duration:0.8,ease:"power2.out"},0.32);
  tl.set("#crack",{opacity:1,scale:0.97,transformOrigin:"560px 820px"},4.25);
  tl.to("#crack",{scale:1,duration:0.12,ease:"power2.out"},4.25);
  tl.set("#flash",{opacity:0},0);
  tl.set("#cutDocWrap",{scale:0.96},0);
  tl.fromTo("#flash",{opacity:0.75},{opacity:0,duration:0.22,ease:"power2.out",immediateRender:false},4.25);
  [[16,-10],[-13,9],[10,-6],[-7,5],[4,-2],[0,0]].forEach((p,i)=>tl.to("#baseWrap",{x:p[0],y:p[1],duration:0.045,ease:"none"},4.25+i*0.045));
  tl.to("#crack",{opacity:0,duration:0.32,ease:"power2.in"},4.98);
  tl.to(["#baseWrap","#logoWrap"],{scale:1,duration:0.65,ease:"power2.inOut"},4.75);

  // ---- 2. layers, exactly like Paulo's reel (7.1 - 16.6) ----
  // scene pane replaces the base video, title appears in the flat scene on "Split"
  tl.to("#panes",{opacity:1,duration:0.14,ease:"none"},7.08);
  tl.set("#baseWrap",{opacity:0},7.24);
  tl.fromTo("#ttl .k",{opacity:0,y:-24,scale:1.15},{opacity:1,y:0,scale:1,duration:0.4,ease:"power3.out",immediateRender:false},7.24);
  tl.fromTo("#ttl .m",{opacity:0,y:40,scale:1.08},{opacity:1,y:0,scale:1,duration:0.4,ease:"power3.out",immediateRender:false},7.34);
  // "three screens": the shot fans out into three glass panes
  tl.to("#pstack",{scale:0.52,x:70,y:210,rotationY:18,rotationX:6,duration:0.9,ease:"power3.inOut"},8.06);
  tl.to(".pane",{borderRadius:46,duration:0.5},8.06);
  tl.to("#paneGlass",{opacity:1,x:-130,y:-290,z:-150,duration:0.9,ease:"power3.inOut"},8.06);
  tl.to("#paneText",{x:-260,y:-580,z:-300,duration:0.9,ease:"power3.inOut"},8.06);
  tl.to("#paneText .glass",{opacity:1,duration:0.6},8.26);
  tl.to(".pane .rim",{opacity:1,duration:0.5},8.30);
  tl.fromTo("#lp",{opacity:0,x:40},{opacity:1,x:0,duration:0.35,ease:"power2.out",immediateRender:false},8.55);
  // row highlights on the spoken layer names
  function hl(row,t){tl.to(row+" .hl",{opacity:1,duration:0.1},t);tl.to(row+" .hl",{opacity:0,duration:0.25},t+0.7);}
  hl("#rBg",9.69); hl("#rMe",10.54); hl("#rText",11.24);
  tl.fromTo("#layerChip",{opacity:0,y:30},{opacity:1,y:0,duration:0.3,ease:"back.out(2)",immediateRender:false},10.54);
  // "hide my layers": cursor clicks the eye, I vanish, HIDDEN tag
  tl.set("#cursor",{x:990,y:1150},0);
  tl.to("#cursor",{opacity:1,duration:0.15},12.10);
  tl.to("#cursor",{x:778,y:862,duration:0.45,ease:"power2.inOut"},12.12);
  tl.to("#cursor",{scale:0.82,duration:0.06},12.65); tl.to("#cursor",{scale:1,duration:0.08},12.71);
  tl.set("#cutL",{opacity:0},12.67);
  tl.set("#rMe .eyeon",{opacity:0},12.67); tl.set("#rMe .eyeoff",{opacity:1},12.67);
  tl.set("#rMe .lbl",{opacity:0.45},12.67); tl.set("#rMe .th",{opacity:0.45},12.67);
  tl.fromTo("#hiddenPill",{opacity:0,scale:0.6},{opacity:1,scale:1,duration:0.25,ease:"back.out(2.2)",immediateRender:false},12.72);
  tl.to("#cursor",{x:900,y:990,duration:0.5,ease:"power2.out"},12.95);
  tl.to("#pstack",{rotationY:14,scale:0.54,duration:2.4,ease:"sine.inOut"},12.95);
  // "bring me back": cursor clicks again, I pop back, then back to full frame
  tl.to("#cursor",{x:778,y:862,duration:0.35,ease:"power2.inOut"},15.05);
  tl.to("#cursor",{scale:0.82,duration:0.06},15.44); tl.to("#cursor",{scale:1,duration:0.08},15.50);
  tl.set("#cutL",{opacity:1},15.46);
  tl.set("#rMe .eyeon",{opacity:1},15.46); tl.set("#rMe .eyeoff",{opacity:0},15.46);
  tl.set("#rMe .lbl",{opacity:1},15.46); tl.set("#rMe .th",{opacity:1},15.46);
  tl.to("#hiddenPill",{opacity:0,scale:0.7,duration:0.15},15.46);
  tl.fromTo("#flash",{opacity:0.3},{opacity:0,duration:0.22,immediateRender:false},15.46);
  tl.to(["#cursor","#lp"],{opacity:0,duration:0.2},15.62);
  tl.to("#layerChip",{opacity:0,duration:0.2},15.62);
  tl.to("#pstack",{scale:1,x:0,y:0,rotationY:0,rotationX:0,duration:0.6,ease:"power3.inOut"},15.72);
  tl.to(["#paneGlass","#paneText"],{x:0,y:0,z:0,duration:0.6,ease:"power3.inOut"},15.72);
  tl.to(["#paneGlass","#paneText .glass",".pane .rim"],{opacity:0,duration:0.4},15.72);
  tl.to(".pane",{borderRadius:0,duration:0.5},15.80);
  tl.to("#ttl",{opacity:0,duration:0.25},16.30);
  tl.set("#baseWrap",{opacity:1},16.34);
  tl.to("#panes",{opacity:0,duration:0.2,ease:"none"},16.36);

  // ---- 3. frame on the right (me) and on the left (silent clone) (16.9 - 27.8) ----
  tl.set("#baseWrap",{transformOrigin:"0px 0px"},16.84);
  tl.to("#baseWrap",{x:600,y:510,scale:0.36,borderRadius:66,duration:0.7,ease:"power3.inOut"},16.96);
  tl.to(["#rimR","#tagR"],{opacity:1,duration:0.2},17.62);
  tl.fromTo("#cloneCard",{opacity:0,x:-120,scale:0.9},{opacity:1,x:0,scale:1,duration:0.45,ease:"back.out(1.6)",immediateRender:false},18.46);
  tl.to(["#rimL","#tagL"],{opacity:1,duration:0.2},18.86);
  tl.fromTo("#xk",{opacity:0,y:-14},{opacity:1,y:0,duration:0.25,immediateRender:false},19.02);
  [["#x1",19.44],["#x2",19.65],["#x3",20.09],["#x4",20.42],["#x5",20.66]].forEach(a=>tl.fromTo(a[0],{opacity:0,y:22},{opacity:1,y:0,duration:0.2,ease:"back.out(2)",immediateRender:false},a[1]));
  [["#sc1",21.51],["#sc2",23.43],["#sc3",25.53]].forEach(a=>{tl.fromTo(a[0],{opacity:0,y:-30,scale:0.85},{opacity:1,y:0,scale:1,duration:0.35,ease:"back.out(1.8)",immediateRender:false},a[1]);tl.fromTo(a[0]+" .ic",{scale:0.4,rotation:-20},{scale:1,rotation:0,duration:0.4,ease:"back.out(2.4)",immediateRender:false},a[1]);});
  tl.to(["#xhead","#sc1","#sc2","#sc3","#rimR","#tagR","#rimL","#tagL"],{opacity:0,duration:0.22},26.95);
  tl.to("#cloneCard",{opacity:0,x:-160,duration:0.35,ease:"power2.in"},26.98);
  tl.to("#baseWrap",{x:0,y:0,scale:1,borderRadius:0,duration:0.65,ease:"power3.inOut"},27.10);
  tl.set("#baseWrap",{transformOrigin:"490px 1000px"},27.85);

  // ---- 4. floating episodes (27.4 - 33.2) ----
  tl.set("#scr1",{rotationY:26,rotationZ:-3,transformPerspective:1500},0);
  tl.set("#scr2",{rotationY:-26,rotationZ:3,transformPerspective:1500},0);
  tl.set("#scr3",{rotationX:14,transformPerspective:1500},0);
  [["#scr1",28.49],["#scr2",28.74],["#scr3",28.99]].forEach(a=>{
    tl.fromTo(a[0],{opacity:0,scale:0.25,y:280},{opacity:1,scale:1,y:0,duration:0.6,ease:"back.out(1.5)"},a[1]);
    tl.to(a[0],{y:-16,duration:1.05,ease:"sine.inOut",yoyo:true,repeat:3},a[1]+0.65);
  });
  tl.to("#scr1",{x:-460,rotationY:60,opacity:0,duration:0.5,ease:"power2.in"},33.34);
  tl.to("#scr2",{x:460,rotationY:-60,opacity:0,duration:0.5,ease:"power2.in"},33.34);
  tl.to("#scr3",{y:-520,opacity:0,duration:0.5,ease:"power2.in"},33.34);

  // ---- 5. documentary, then more dramatic (34.6 - 38.4) ----
  tl.set(["#docBg","#docGlow","#cutDocWrap"],{opacity:1},35.73);
  tl.fromTo("#cutDocWrap",{scale:0.96},{scale:1.03,duration:1.45,ease:"power1.out",immediateRender:false},35.73);
  tl.set("#docTitles",{opacity:1},35.77);
  tl.fromTo("#dkick",{opacity:0,y:-16},{opacity:1,y:0,duration:0.25},35.77);
  tl.fromTo("#dname",{opacity:0,y:60,scale:1.12},{opacity:1,y:0,scale:1,duration:0.35,ease:"power4.out"},35.83);
  tl.fromTo("#dsub",{clipPath:"inset(0 100% 0 0)"},{clipPath:"inset(0 0% 0 0)",duration:0.35,ease:"power2.inOut"},36.09);
  tl.fromTo("#grain",{opacity:0},{opacity:0.22,duration:0.1},35.73);
  tl.to("#grain",{x:-37,y:23,duration:3.7,ease:"steps(40)"},35.73);
  tl.fromTo("#flash",{opacity:0.9},{opacity:0,duration:0.28,ease:"power2.out",immediateRender:false},37.19);
  tl.set(["#docBg","#docGlow","#docTitles"],{opacity:0},37.19);
  tl.set("#dramaBg",{opacity:1},37.19);
  tl.to(["#barTop","#barBot"],{scaleY:1,duration:0.3,ease:"power3.out"},37.19);
  tl.fromTo("#dt1",{opacity:0,scale:1.45},{opacity:1,scale:1,duration:0.24,ease:"power4.out"},37.23);
  tl.fromTo("#dt2",{opacity:0,scale:1.45},{opacity:1,scale:1,duration:0.24,ease:"power4.out"},37.53);
  tl.fromTo("#cutDocWrap",{scale:1.03},{scale:1.14,duration:1.7,ease:"none",immediateRender:false},37.19);
  tl.to(["#dramaBg","#cutDocWrap","#dt1","#dt2","#grain"],{opacity:0,duration:0.25},39.17);
  tl.to(["#barTop","#barBot"],{scaleY:0,duration:0.25,ease:"power2.in"},39.17);

  // ---- pill + CTA ----
  tl.to("#pill",{opacity:0,duration:0.2},28.15); tl.to("#pill",{opacity:1,duration:0.2},34.27);
  tl.to("#pill",{opacity:0,duration:0.15},35.67); tl.to("#pill",{opacity:1,duration:0.2},39.47);
  tl.to("#pill",{opacity:0,duration:0.2},45.35);
  // series comment stamp: label, word, underline, badge (paper-stamp-v4 timings at 30 fps)
  const S0=45.52, f=1/30;
  tl.fromTo("#stLabel",{opacity:0,scale:0.3,rotation:10},{opacity:1,scale:1.08,rotation:-1,duration:7*f,ease:"power2.out",immediateRender:false},S0);
  tl.to("#stLabel",{scale:1,rotation:2,duration:6*f,ease:"power2.inOut"},S0+7*f);
  tl.fromTo("#stBadge",{opacity:0,scale:0.2,rotation:-30},{opacity:1,scale:1.1,rotation:5,duration:8*f,ease:"power2.out",immediateRender:false},S0+4*f);
  tl.to("#stBadge",{scale:1,rotation:-6,duration:8*f,ease:"power2.inOut"},S0+12*f);
  tl.fromTo("#stWord",{opacity:0,scale:0.2,rotation:-14},{opacity:1,scale:1.08,rotation:1,duration:8*f,ease:"power2.out",immediateRender:false},S0+6*f);
  tl.to("#stWord",{scale:1,rotation:-2,duration:7*f,ease:"power2.inOut"},S0+14*f);
  tl.to("#stPath",{strokeDashoffset:0,duration:18*f,ease:"power1.inOut"},S0+20*f);

  // ---- captions ----
  __CAPJS__

  window.__timelines = window.__timelines || {};
  window.__timelines["part2"] = tl;
})();
</script>

<script type="module">
import * as THREE from "three";
import { SVGLoader } from "./vendor/SVGLoader.js";
const canvas=document.getElementById("logoCanvas");
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
renderer.setSize(1080,1920,false); renderer.setPixelRatio(1);
renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();
const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100); cam.position.set(0,0,10);
const svg='<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="__SVGD__"/></svg>';
const shapes=[]; new SVGLoader().parse(svg).paths.forEach(p=>shapes.push(...SVGLoader.createShapes(p)));
const geo=new THREE.ExtrudeGeometry(shapes,{depth:2.6,bevelEnabled:true,bevelThickness:0.55,bevelSize:0.28,bevelSegments:5,curveSegments:12}); geo.center();
const mat=new THREE.MeshStandardMaterial({color:0xD97757,roughness:0.3,metalness:0.18,emissive:0x3a1206,emissiveIntensity:0.35});
const mesh=new THREE.Mesh(geo,mat); scene.add(mesh);
scene.add(new THREE.AmbientLight(0xffffff,0.85));
const key=new THREE.DirectionalLight(0xffffff,2.3); key.position.set(3,5,7); scene.add(key);
const rim=new THREE.DirectionalLight(0xffd7bd,1.3); rim.position.set(-5,-1,-4); scene.add(rim);
const K=2*10*Math.tan(15*Math.PI/180)/1920;          // world units per pixel on the z=0 plane
const px2w=(px,py)=>[(px-540)*K,-(py-960)*K];
const PALM=[[0.64,486,1015],[2.14,508,983],[3.24,475,972],[4.04,432,1058]];
function palmAt(t){ if(t<=PALM[0][0]) return [PALM[0][1],PALM[0][2]];
  for(let i=1;i<PALM.length;i++){ if(t<=PALM[i][0]){ const a=PALM[i-1],b=PALM[i],u=(t-a[0])/(b[0]-a[0]); return [a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u]; } }
  return [PALM[PALM.length-1][1],PALM[PALM.length-1][2]]; }
const clamp=v=>Math.max(0,Math.min(1,v));
const backOut=u=>{const c1=2.2,c3=c1+1;return 1+c3*Math.pow(u-1,3)+c1*Math.pow(u-1,2);};
const BASE=0.0186, T0=1.82, TT=4.00, TI=4.25;
function renderAt(t){
  if(t<T0||t>TI){ mesh.visible=false; renderer.render(scene,cam); return; }
  mesh.visible=true;
  const [px,py]=palmAt(t); let [x,y]=px2w(px,py-62); let z=0;
  let s=BASE*(t-T0<0.42?Math.max(0.001,backOut(clamp((t-T0)/0.42))):1);
  y+=Math.sin((t-T0)*4.2)*0.02;
  let ry=0.5+(t-T0)*1.9, rx=0.32, rz=Math.sin(t*2.1)*0.06;
  if(t>=TT){ const u=clamp((t-TT)/(TI-TT)), e=u*u*u; const [cx,cy]=px2w(560,820);
    x+= (cx-x)*e; y+=(cy-y)*e; z=9.3*e; ry+=u*7; rx+=u*1.3; }
  mesh.position.set(x,y,z); mesh.scale.set(s,-s,s); mesh.rotation.set(rx,ry,rz);
  renderer.render(scene,cam);
}
window.addEventListener("hf-seek",e=>renderAt(e.detail.time));
renderAt(window.__hfThreeTime||0);
</script>
</body>
</html>
"""

EYE = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#e9e9e9" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>'
EYEOFF = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#6b7079" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><path d="M3 3l18 18"/></svg>'
EAR = '<svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M6 8.5a6 6 0 0 1 12 0c0 3.5-3 4.5-3.5 7.5A3.5 3.5 0 0 1 8 16"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-1.5 2-1.5 3"/></svg>'
EYEICON = '<svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3.2"/></svg>'
BUILD = '<svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7l-5 5 5 5"/><path d="M16 7l5 5-5 5"/><path d="M13.5 4l-3 16"/></svg>'
MUTE = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff"/><path d="M17 9l5 6M22 9l-5 6"/></svg>'
MIC = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#111"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12"/></svg>'
BUBBLE = '<svg width="84" height="84" viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#D97757"/><circle cx="8" cy="11" r="1.4" fill="#fff"/><circle cx="12" cy="11" r="1.4" fill="#fff"/><circle cx="16" cy="11" r="1.4" fill="#fff"/></svg>'

out = (HTML.replace("__DUR__", f"{DUR:.2f}").replace("__SVGD__", SVG_D)
       .replace("__CAPTIONS__", "\n  ".join(cap_html)).replace("__CAPJS__", "\n  ".join(cap_js))
       .replace("__SFX__", "\n  ".join(sfx_html)).replace("__EYEOFF__", EYEOFF).replace("__EYEICON__", EYEICON)
       .replace("__EYE__", EYE).replace("__EAR__", EAR).replace("__BUILD__", BUILD).replace("__BUBBLE__", BUBBLE).replace("__MUTE__", MUTE).replace("__MIC__", MIC))
open(os.path.join(HERE, "index.html"), "w").write(out)
print(f"index.html written: {len(chunks)} caption chunks, {len(SFX)} sfx cues")
