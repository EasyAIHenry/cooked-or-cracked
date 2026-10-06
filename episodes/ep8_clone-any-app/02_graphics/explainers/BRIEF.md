# Ep8 explainer animations: shared brief (7 Oct 2026)

Same system as Ep7 v9 (Henry: "everything that I said has to be meaningfully animated... tastefully", 5 Oct). Every beat of what Henry says gets its own explainer in the top zone, timed to his words. Paper cut-outs on a notebook page. Not stickers, not kinetic captions (word captions run separately at the bottom of his card).

## The reel (context)
Series "Cooked or Cracked": Henry tests an AI creator's claim and gives a verdict. Audience: men 18 to 34 who build things, on phones, from the Reels tab. Layout of every main-section frame (1080x1920): ruled-paper backdrop full frame; Henry talks to camera in a framed card at x 213..867, y 748..1892 (bottom half); word captions over his card at y 1430..1650; a small COOKED/CRACKED checkbox scoreboard at the left (x 70..370, y 735..1000). Your animation lives in the top zone: canvas 980x500 placed 1:1 at left 50, top 234 (x 50..1030, y 234..734). Never draw outside your canvas; Henry's card starts 14 px below it.

Two beats (B04, B05) are real screen recordings of the clones, not MGs: `02_graphics/rerecord/loom-demo.mp4` and `slotline-demo.mp4` (1960x1000, scaled to 980x500 in the top zone, with a window frame). Their stamps are small and sit over the clip's top-left.

## Facts (use only these; no invented numbers; never name the reviewed creator or the repo author)
- The claim Henry tests: a reel says Claude can clone any app so you never pay a subscription again; the repo has 11 free skills.
- Henry's test, 7 Oct, timer on: two apps he pays for. A screen recorder ("Loom" is said out loud, so the word may appear once as plain text, never its logo or colours) and a post scheduler ("Buffer", same rule). Henry's clones: a recorder that records the screen and gives a share link (6 minutes from first command to a compiled app; parity score 63 / 100; 6 of 7 must-haves), and a post queue he named "Slotline" (8 minutes; weekly slots, queue, calendar, a scheduler; parity 66 / 100; 5 of 8 must-haves; it posts to a local test network only).
- Security scan: 60 / 100 HIGH on the reviewed pack; the finding was a word list in a lint tool. (Not spoken in the cut; use only if a beat needs a receipt, small.)
- What blocks the "any app" claim: cloud storage and streaming, posting to real platforms (Instagram needs a Meta developer app and review; Meta is strict on third-party apps), licensed content. The repo's own README: "No guarantee of a perfect clone."
- Verdict: COOKED. Real-use line: not everything needs the cloud; some things are great installed on your local drive.
- CTA: comment CLONE, Henry sends his workflow: a guide with 10 apps worth cloning in an hour, and his own free skills repo (7 skills).

## Beats (lines from cut-ep8-v2; word frames in beats.json)
| Beat | Line | What it shows |
|---|---|---|
| B01 | L01 "Well, not sure if you can clone every app, but let's try." | The claim as a paper card "CLONE ANY APP" with a drawn question mark that pops on "not sure"; a test flask or stopwatch pops on "let's try". |
| B02 | L04 "So today I'm gonna clone two apps. One is Loom and another is Buffer." | Two app tiles pop on their words: a recorder tile (screen + red dot, label "screen recorder") and a queue tile (calendar + clock, label "post scheduler"). Small price tags US$15 and US$5 a month swing in under them. |
| B03 | L05 "While there's 11 different types of skill sets, I wanted to put to the test whether it works or not. So as you can see, I've actually installed Loom over here." | 11 small skill cards count in on "11" (a counter rolls 1 to 11), arrange in a row; "TEST" stamp on "test"; on "installed" a terminal strip types `ls ~/.claude/skills` and shows 11, tick. |
| B04 | L06 "...screen record my screen and when I'm done, I can share it with anyone..." | SCREEN RECORDING: loom-demo.mp4 in a window frame. Stamp top-left "6 min" with a stopwatch, pops on "screen record". |
| B05 | L07 "Now I actually clone Buffer and it's actually called Slotline." | SCREEN RECORDING: slotline-demo.mp4 in a window frame. Stamp "8 min". |
| B06 | L08 "But it does look like Buffer." | Parity meter: a paper gauge fills to 66 / 100 on "look like"; under it "5 of 8 must-haves" and the tool's words "not shippable yet" stamped. |
| B07 | L09 "You're going to find it as a hassle to connect your Instagram to this. Let's not talk about Instagram banning third-party apps that are not even allowed." | An "in" style camera tile (drawn in palette, not the brand's gradient) with a padlock on "connect"; a "developer app, review" form card slides in; on "banning" a red cross stamps over a generic "third-party app" card. |
| B08 | L10 "So Meta is actually very strict on that." | A rules sheet with three ticked lines and a shield; "STRICT" hand label. Quick beat. |
| B09 | L11 "Overall, I think this is cooked, so it is not going to work if you are going to rely on the internet to actually do streaming or any storage of any cloud data." | COOKED verdict stamp (series stamp, keep) on "cooked"; then a cloud icon with "streaming" and "storage" labels crossed out on their words. |
| B10 | L12 "Not everything is needed to be on cloud, I think some things are great if you install it in your local drive itself." | A laptop/disk card with the two clone tiles dropping into it on "install"; label "on your own disk". |
| B11 | L13 "While this is cooked, I've actually created 10 more apps that you can use without the internet and without cloud storage. Comment down below Clone and I'll send you my workflow." | 10 app cards fan out counting to 10 on "10 more apps"; a crossed cloud on "without cloud storage"; on "Comment" the CLONE pill pops with the guide cover card. CTA beat, slightly smaller canvas 820x420 at 130/236 like Ep7 B12. |

## Visual system (do not drift)
- Palette: paper #FFFEFA, ink #171411, accent #DF825F (orange), gold #F2C14E (sparingly), ink at low opacity for greys. No brand colours: the Instagram tile is ink or accent, the recorder and queue tiles are palette only.
- Type: Fraunces 900 for numbers and key words (props.serif); Kalam 700 for handwritten labels (props.hand); Inter 800 for UI micro-text (props.sans). Fonts from props; weights 900/700/800.
- Elements: paper cut-out cards (2.5 to 3 px ink outline or torn edge via clip-path, offset shadow `4px 6px 0 rgba(23,20,17,0.22)`), ink line icons (inline SVG, stroke 3 to 4 px, round caps), orange highlights, 1 to 3 degree tilts. Flat, editorial, hand-made. Max 2 or 3 focal elements at a time.
- Motion: entrances pop with overshoot (scale 0.3 to 1.08 to 1 over 10 to 13 frames, or spring damping 12 to 14), slides and draw-ons with Easing.out(Easing.cubic), counters roll, bars grow, lines draw (strokeDashoffset), stamps slam. Every motion is caused by a word. Hold still once settled. Sub-scene changes 6 to 10 frames, never a slow fade.
- Legibility: key numbers and words at least 80 px tall in canvas units; labels at least 30 px; at most about 8 readable words on screen; 16 px margin; nothing clips.
- Timing: each visual lands 0 to 4 frames before its word (frames per beat in beats.json, relative to the MG's frame 0). Settled at least 15 frames before the next change. Final state still for the last 10 frames (hard cut into the next beat).

## Code contract (ChatCut motion graphic, Remotion runtime)
- `mg.jsx`: helpers as top-level `const` allowed; define `const Component = ({ item }) => { ... }` returning `<div style={rootStyle}>...</div>`, rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" }.
- Globals (do not import): useCurrentFrame, interpolate, spring, Easing, interpolateColors, random, AbsoluteFill. No imports, no useVideoConfig (fps 30), no Math.random (use random('seed')), no external URLs, images or fonts, no Date.
- Props: `const props = item.props || {};` read props.serif, props.hand, props.sans, props.paper, props.ink, props.accent, props.gold. Every key in meta.json "props" must appear literally as `props.KEY` in the code. No fallbacks.
- `meta.json`: {"width", "height", "duration", "props": {"serif": "Fraunces", "hand": "Kalam", "sans": "Inter", "paper": "#FFFEFA", "ink": "#171411", "accent": "#DF825F", "gold": "#F2C14E"}, "place": {...from beats.json}, "sheetFrames": [...]}.
- ChatCut validator gotchas (Ep7): the wrapped form (`mg.chatcut.jsx`) must have no top-level constants (wrap helpers inside Component); `open` is a blocked global even as a variable name or in a comment; `interpolate` outputRange must be a literal array.

## Checking your work (mandatory)
Render with `python3 "/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep7_LinkedIn-Agent/02_graphics/explainers/harness/mgcheck.py" <your beat dir>`; it writes out/sheet.jpg and out/detail.png. Read both and judge honestly. Iterate until it clearly shows what Henry says, matches the system, every word cue lands, nothing clips, text reads at phone size. Expect 3 or more render rounds.

Style references (look, not layouts): `~/.claude/skills/henry-scrapbook-reel/references/mg/paper-stamp-v4.jsx`, `save-card-lines.jsx`, `work-split-bar.jsx`, `effect-counter.jsx`, and Ep7's `02_graphics/explainers/B0*/mg.jsx`.
