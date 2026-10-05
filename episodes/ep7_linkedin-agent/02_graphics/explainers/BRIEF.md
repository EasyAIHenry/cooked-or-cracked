# Ep7 explainer animations: shared brief (5 Oct 2026)

## Why these exist
Henry (the host) watched v8 of his Instagram Reel and said: "it's very static when I say I ran 30 days. There's no explainer animation for that... instead of just showing the screenshots and the screen recording, everything that I said has to be meaningfully animated and it should be done very tastefully... it's not just a supers and word text that come out. It's more than that."
So every beat of what he says gets its own explainer animation that SHOWS the idea (objects, data, process, cause → effect), timed to his words. Think Vox / Kurzgesagt-lite explainer, made of paper cut-outs on a notebook page. Not stickers, not kinetic captions: word captions already run separately at the bottom of the frame.

## The reel (context)
Series "Cooked or Cracked": Henry tests an AI creator's claim and gives a verdict. Audience: men 18-34 who build things, watching on phones from the Reels tab. Layout of every main-section frame (1080x1920): ruled-paper backdrop full frame; Henry talks to camera in a framed card at x 213..867, y 748..1892 (bottom half); word captions over his card at y 1430..1650; a small COOKED/CRACKED checkbox scoreboard at the left (x 70..370, y 735..1000). YOUR animation lives in the top zone: canvas 980x500 placed 1:1 at left 50, top 234 (fills x 50..1030, y 234..734). B12 is smaller (820x420 at 130/236). Never draw outside your canvas; Henry's card starts 14 px below it.

## Facts (use only these; no invented numbers, no creator names, never name the reviewed creator)
- The repo Henry tested: 11 free Claude skills for LinkedIn. They write and score posts; their own README says "These skills write. You post."
- His test: he dropped one video, one photo and a poster into Claude; Claude checked his old project files, wrote the post, and published it to LinkedIn through his Buffer connection (Buffer's API, which is LinkedIn-approved). About 10 minutes, drop to live. Buffer's "Sent" count went 153 → 154.
- The live post: by Henry Chua, text "Lysander shot a sitcom alone on his sofa. AI replaced the set, the props and the cast." Images: a black poster "The AI Driving License" with a yellow date "Mon 5 Oct", and a class group photo.
- His May challenge: 4 May → 2 Jun 2026 (Mon 4 May to Tue 2 Jun), he posted every weekday, Monday to Friday, no fail: 36 posts on 22 posting days. Claude wrote them, Buffer posted them (scheduled by him in the Buffer app). Results: 9,600 impressions total; median 134 impressions per post vs 217 for the rest of his year; engagement about 1.3%, flat. More posts did not mean more reach.
- Past: he had to use the Buffer app by hand. Now: one prompt in Claude does it, through the Buffer API connection to LinkedIn.
- Advice: just started → use Buffer; experienced and comfortable → use Claude. Always check third-party apps are LinkedIn verified (Buffer is an official LinkedIn partner).
- Verdict CRACKED. CTA: comment GHOST and he sends his workflow.

## Visual system (do not drift)
- Palette: paper #FFFEFA, ink #171411, accent #DF825F (orange), gold #F2C14E (sparingly, small highlights only), plus ink at low opacity for greys. No other hues except tiny brand marks drawn in palette (LinkedIn "in" tile may be ink or accent, not LinkedIn blue; Claude = an orange/accent spark/asterisk mark).
- Type: Fraunces 900 for numbers and key words (props.serif); Kalam 700 for handwritten annotations/labels (props.hand); Inter 800 for UI micro-text inside mock apps (props.sans). Fonts come from props; use fontWeight 900/700/800.
- Elements: paper cut-out cards (#FFFEFA, 2.5-3 px ink outline OR torn edge via clip-path, offset shadow `4px 6px 0 rgba(23,20,17,0.22)`), ink line icons (inline SVG, stroke 3-4 px, round caps/joins), orange highlights/underlines, small 1-3° tilts. Flat, editorial, hand-made. Generous whitespace. Max 2-3 focal elements at a time.
- Motion grammar: entrances pop with overshoot (scale 0.3→1.08→1 over ~10-13 frames, or spring damping 12-14), slides/draw-ons with Easing.out(Easing.cubic), counters that roll, bars that grow, lines that draw (strokeDashoffset), ticks that stamp. Every motion is caused by a word. Hold still once settled (no idle pulsing, wobbling or spinning loops). Sub-scene changes inside a beat: quick (6-10 frames) slide/flip/morph, never a slow fade.
- Legibility on a phone: key numbers/words ≥ 80 px tall in canvas units; labels ≥ 30 px; UI micro-text is decorative only (it may be smaller, nothing important relies on it). At most ~8 readable words on screen at once. Nothing touches the canvas edge (≥ 16 px margin) and nothing clips.
- Timing: each visual idea lands 0-4 frames BEFORE its spoken word (frame numbers given per beat, relative to the MG's frame 0). Nothing important appears before its word. Each state should be readable/settled ≥ 15 frames before the next change. The MG hard-cuts at its last frame into the next beat: keep the final state complete and still for the last ~10 frames (no exit animation).

## Code contract (ChatCut motion graphic, Remotion runtime)
- File `mg.jsx`: helpers as top-level `const` allowed; must define `const Component = ({ item }) => { ... }` returning `<div style={rootStyle}>...</div>` where rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" }.
- Globals available (do NOT import): useCurrentFrame, interpolate, spring, Easing, interpolateColors, random, AbsoluteFill. No imports, no useVideoConfig (fps is 30), no Math.random (use random('seed')), no external URLs/images/fonts, no Date.
- Props: `const props = item.props || {};` then read props.serif, props.hand, props.sans, props.paper, props.ink, props.accent, props.gold. Every key you put in meta.json "props" MUST appear literally as `props.KEY` in the code (the validator rejects unused props). No fallbacks like `props.ink || '#000'`.
- Precompute values; keep it deterministic. Inline SVG is fine. Size everything in canvas pixels (canvas = meta width/height).
- `meta.json`: {"width", "height", "duration", "props": {"serif": "Fraunces", "hand": "Kalam", "sans": "Inter", "paper": "#FFFEFA", "ink": "#171411", "accent": "#DF825F", "gold": "#F2C14E"}, "place": {...from beats.json}, "sheetFrames": [list of the frames that show each state and each transition midpoint]}.

## Checking your work (mandatory)
Render with `python3 "/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep7_LinkedIn-Agent/02_graphics/explainers/harness/mgcheck.py" <your beat dir>` (≈ 10 s). It writes out/sheet.jpg (phone-layout context frames at your sheetFrames, cropped to the top half of the screen, with a grey placeholder for Henry's card and the red dashed safe area) and out/detail.png (full-res still of the last sheet frame; pass `--still N` for another frame). READ both images with the Read tool and judge them honestly. Iterate until: it clearly shows what Henry says, it is tasteful and uncluttered, it matches the visual system, every word-cue lands, nothing overlaps/clips, text is legible at phone size. Also look at transition midpoints. Expect 3+ render rounds.

Style references (read 1-2 for the look, do not copy layouts): `~/.claude/skills/henry-scrapbook-reel/references/mg/paper-stamp-v4.jsx`, `save-card-lines.jsx`, `work-split-bar.jsx`, `effect-counter.jsx`.
