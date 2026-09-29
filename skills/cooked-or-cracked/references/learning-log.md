# Learning log (append after every episode's retro; newest first)

## Ep4 full cut in ChatCut (29 Sep 2026, evening)
1. "Too yellow" twice: the cause was HyperFrames' `--sdr` step, which skips the BT.2020 to BT.709 gamut conversion. Skin came out sallow (hue 24-27 deg vs 9-15 on his Ep3 upload) and the table came out mustard. Grading around it (saturation, warmth) cannot fix it. The fix was a 3D LUT fitted from HyperFrames' output to a correct HLG conversion of the same frames that keeps HyperFrames' brightness (colour error 0.026 to 0.004, same result on Part 1), then skin smoothing and a light curve. Files: Ep4 `02_graphics/hyperframes-part2/` (hf2ref.cube, graph_N5.txt, lutfit/). Measure against his last approved upload, not against "neutral".
2. The opener follows the Ep3 v7 table, but window sizes come from the new take: in Part 1 his face reached x 728, so Paulo's window shrank to 270x480 at 752/762.
3. Fill the top zone per stretch: tile the render at 0.1 s around every effect boundary so each stamp starts when the top clears and ends before the next effect. Stamps say his own words; never repeat a phrase.
4. Pops: check the voice energy at every pop. Five landed on words and moved into the gaps. Whisper put "cracked" 0.35 s early, so the verdict pop was re-placed by energy. Silent 1-2 s holds in a HyperFrames edit need a fill (light clock tick during "hidden", a riser under the floating screens).
5. Balance sections before the final gain. At 0 dB the sting was 8.6 LU hotter than his voice, so the sting and Paulo's audio went to -8.5 dB and the jingle pops to -17.5 dB. Result: hook -22.2 / sting -21.2 / Part 2 -21.3 LUFS, then one fixed gain to -14 with the latency-compensated limiter.
6. ChatCut Desktop exported every MG correctly in one pass (no green matte). Test once per episode anyway.
7. A word spliced from another day's take reads as "least natural word" to Gemini even after the vowel is rebuilt, yet it is transcribed right 9/9. Offer a 3 s pickup line for verdict words.
8. The real stitch was a doubled consonant: the original "c" of "cooked" stayed in front of the spliced "cra", which carries its own k burst ("k-cracked"). Scan the junction with a 2 ms high-band (first-difference) trace, keep exactly one burst, and replace the other with the room floor. In a paired A/B with the clip order swapped, Gemini picked the fixed version 4/4. Single-clip ratings did not separate the two versions, so use paired tests.
10. The opener needs Henry's intent line right after the creator's claim ("Well, I'm gonna try it out."), or the audience lacks context. Put it in the recording brief for every episode. When it is missing, take a whole phrase from an earlier take, not spliced words, and play it as a voice-over on a shot where his mouth is closed or covered. Ripple everything after it with startDeltaFrames, latest item first.
11. Guide (29 Sep): Henry allowed a longer deck but said 'don't let the audience guess'. The review rounds showed what beginners need: exact button names from the vendor docs (Code tab: Local, Select folder, Manual then Auto), OS-specific lines (Homebrew and its Next steps, the Windows UAC prompt, OneDrive, quitting from the tray, Android HDR paths), moving the file phone to computer and back, the plan placed after the cut, and a one-box-per-prompt pack checked with pdftotext. Check install commands against the live README: `npx skills add --all` installs into the current folder only, and HyperFrames' own `npx hyperframes skills update` installs globally.
9. Henry's v1 note: a stamp that shows for under about 1 s reads as a flicker ("too short, rather remove it"). Drop stamps under 1.2 s together with their scoreboard flash and pop, even if that leaves the top empty for a moment.
12. ManyChat (29 Sep): use the Quick Automation "Auto-DM links from comments". From ManyChat's help: at most 3 public replies (shuffled); the opening DM must stay on, or the follow check, the email ask and the follow-up cannot send; the order is opening DM, email, follow check, link DM, follow-up; the link DM takes up to 3 links. Link the PDF file (drive.google.com/file/d/ID/view), not the folder: one tap fewer. Check it opens for strangers with curl and no cookies (200 plus the file title). The final Ep4 copy is in `01_scripts/ig-captions-ep4.md`; reuse it and swap the keyword, the promise and the page pointers.
13. Hook window content (30 Sep, Henry): play the creator's busiest motion-graphics moment in the opener window, not his talking hook. Henry picked the moment where the scene splits into 3 layers (wall, subject, text) on "Now split the scene into layers..." (v7). My first pick, his frame-on-the-right split screen (v6), was the wrong "split", so confirm the moment when the description could match two. The plain kinetic-text hook looked empty at window size; the effect happening on a spoken command sells the claim, and the "claude edits 100%" stamp in the sting still states it.

## Ep4 edit, Paulo Shimas method in HyperFrames (29 Sep 2026)
1. Henry's v1 notes: follow the reference reel exactly for show-off effects (Paulo's layers = title in scene, glass panes, Layers panel, cursor clicks the eye, HIDDEN tag). A fade-out inside a small pane does not read as "disappear".
2. "Put me on a frame on the right and on the left" meant two frames: him talking right, a silent clone left. Unused retakes are the clone source; cut them out and mirror.
3. His CTA is always the series comment stamp (paper-stamp-v4 look), in every edit tool.
4. Colour outside ChatCut: HyperFrames' HDR to SDR comes out flatter and brighter. Rebuild the skin shader in FFmpeg (YCbCr mask + bilateral 0.55) and grade to his Ep3 look by measurement (face luma ~0.50, face saturation ~0.46), footage only.
5. Audio: Adobe voice must be cut through the same video+audio concat as the picture (frame padding), or it drifts up to 65 ms. FFmpeg loudnorm in dynamic mode shifts the last 3 s; use fixed gain + alimiter latency=true.

## Ep3 A/B test and pivots (28 Sep 2026, evening)
1. Henry's format for a tool claim is now a same-brief A/B: his way (one prompt, self-approved gates) vs my way (plan every shot, pick the voice from samples, approve stills, animate only what moves), same topic, same style lock, same Gemini prompt for both cuts. Receipts are time, money, gates, Gemini score, and whether the style lock held.
2. Judge with an identical Gemini prompt or the scores are not comparable. Gemini is harsh on any AI motion; use it for relative ranking and facts, and let Henry judge the absolute.
3. Photoreal macro metal is the worst brief for Kling (warps when it moves, stalls when it does not). Paper cut-out animates cleanly first pass; flat 2D shapes are the safe style for Kling 3.0 std.
4. For Shorts pace: Nadine at 151 wpm, nine lines of about 17 words, lands 60 to 70 s with no trimming. Elodie at 120 wpm needs silence trimming.
5. Keep the music fade after loudnorm, or the normaliser lifts the tail back up.
6. A Claude session restart kills terminal tabs and background processes; OpenMontage checkpoints survived and Codex resumed. Keep a timeline file and screencapture segments so nothing is lost. screencapture also stops on its own around the 1 h 40 min mark; check the pid before assuming it is still rolling.
7. Henry pivoted twice mid-episode (engineering to unsolved case to misunderstood job). Cheap style samples (five stills, 1.25 credits) settled the look in one round; use that before any video spend.

## Ep3 groundwork, Dr Alvaro Cintas, OpenMontage "one prompt to a YouTube video" (28 Sep 2026)
Subject reel DdttZS1RTZu, 42k plays, 4.7x his median, gate VIDEO. Groundwork run by Claude with the screen recorded, Codex as the orchestrator because the Claude CLI was logged out.
1. Result: one prompt to a 75 s 1080p MP4 plus a YouTube export bundle in 45 min 22 s, $0.119 in providers, 561k tokens, 12 gates. Gemini rates the output 6/10; the Piper voice is the weak link. Research stage 4/10: honest sources, but it picks a lane in the first query and infers "growing niche" from industry sales.
2. Security gate: skillspector will score any large agent repo 100/100 CRITICAL because it flags every code file and every docs curl. Read the CRITICAL and HIGH lines by hand, run the independent sweep (invisible unicode, injection phrases, pipe-to-shell, eval/shell=True, outbound hosts, hooks, npm postinstall), and give Henry the one-page triage. Took 10 min and was the right call.
3. Pre-flight the agent CLI and the API surface before recording: `claude auth status`, and a direct curl to each Google API the plan will use. The TTS 403 was predicted 40 minutes before it happened.
4. Codex CLI 0.147: `-m gpt-5.6-sol -c model_reasoning_effort=high -c tools.web_search=true`, `--search` is not an exec flag, and prompts go in by `cat file | codex exec ... -` when the terminal tool refuses heredocs.
5. Screen recording: `screencapture -x -v` from the shell records the main display at 3024x1964 and writes the file only on SIGINT, so record in segments and check a frame. Keep the live terminal tab fronted and close dead tabs; the first segment showed a failed tab for 15 min.
6. Monitor the run with a `tail -f | grep` monitor on stage checkpoints, cost lines, tracebacks and the render path, and exclude diff lines (`^\+`) and repeated decision-log JSON, or every event is noise.
7. For the de-myth: the reel's proof footage is a breakdown of an existing channel's Short, not the tool's own output. The tool's real output looks designed but the voice gives it away. That is the honest split for the verdict.

## Ep2 edit, pass 2 v4 notes (27 Sep 2026)
Henry on the first pass-2 preview: "you should have me typing at the background while we have a picture in picture look", cut lines that don't need emphasis (the seven flavours), too many long pauses, target 2:00.
1. Picture-in-picture is the default whenever the screen recording plays: the recording full frame, Henry in a small window low-left, still talking. Face-only shots are reserved for the hook, the reaction, the verdict, the pitch, the score and the CTA.
2. 2:00 was reached by cutting "installed the five repos" (the five GitHub cards moved under "the five connectors"), "I actually wanted it to be 3D", the flavour line, and tightening every pause to about 0.28 s.
3. Order of work he wants: flow and cut first, then animation, then sound and sound effects, then colour.

## Ep2 edit, pass 2 notes (26 Sep 2026)
1. Opener: Henry's chin-hold reaction (muted) under the reviewed reel's own claim, cut at the end of that sentence (3.5 s). His first words follow at 0:03.
2. The sting goes after his hook line ("Well, let's test it out."), over a 2.6 s teaser of the best visual, with the title popping on the sung words. Never before his first words: that cost Ep1 half its audience.
3. Screen recordings: 9:16 browser-pane crops go full frame. Landscape material (GitHub pages, Maps, chat, desktop site) goes on ruled paper as a white-bordered card with a soft shadow and a 1 to 1.5 degree tilt. Cut fresh crops from the original recording at the speed that fits the line (prompt typing 11x, Higgsfield widget 10x, site scroll 3x).
4. When a line comes from the other take on camera, punch in 1.3x on the face. It reads as emphasis, not a continuity error.
5. Levels before the voice chain: reviewed reel and sting about 1 to 2 LU above Henry's voice. Out of the box they were 5 and 7 LU louder.

## Ep2 edit, pass 1 notes (26 Sep 2026)
Henry on the v2 speech cut: remove the extra "so", "nice" should be "nicely", and "have me saying how we can use this for real life cases, it feels rushed".
1. Every review needs a real-life beat after the demo and before the price: who can use this and how. Ep2's is POS ordering, a site for menu and opening hours, two business models (fix existing sites, or build one for shops without), "amazing for small business owners". The review is not done until he says it.
2. Pacing: sentence breaks about 0.3 s, not 0.25 s. Where two sentences ran together with no pause in the source, insert a muted 7 to 8 frame piece of the same shot. It gives a breath with no visible jump.
3. Transcript word times drift, up to 0.3 s in Ep2. The recognizer labelled "shop" as "uh", so striking the "uh" deleted "shop". Half a "So" rode at the end of "for me", and an "S" at the end of "perfectly". Run `scripts/join_audit.py` on every speech cut before showing it, fix each "<<" join at the valley, and check its GAPS list for removed words.
4. Then do one unprimed verbatim listen of the rendered audio (Gemini, gemini-3.1-pro-preview): "transcribe verbatim, include fillers and partial words, list cut-off words". Never put example errors in the prompt. Gemini then reports them whether or not they exist. Test uncertain cut points as short clips padded with 0.4 s of silence.
5. Length went from 1:37 to 2:13 on Henry's call. Keep a trim order in the cut list so he can pull it back.

## Ep2 update (26 Sep 2026): format pivot
Henry changed Ep2 from "test 5 tools" to "use the tools to build a real site for a local shop with no website" (Pompette, Beauty World), plus a QR order menu. His take after using it: design skills get the layout, fonts and colours right; photoreal visuals still need Higgsfield (GPT Image 2.5 for cones, Kling for the piping clip; Seedance not needed for a single object). He calls the build 60% done, the last 40% under an hour, and would price it at about $1,000 plus $250 a month. Henry rejected the scripted lines ("I don't talk like that"); the series now uses pointer form: `pointers-ep2.md`, bullets he reads while scrolling the build on screen. Lead magnet: `08_guide/design-guide.pdf` (14 pages, screenshots, links checked by `check-links.py`) plus a scroll version on Nate's scrollcraft engine. Keep the verdict split: tools cracked for layout, visuals need another tool.

## Ep2, Nate Herk, "5 free tools turn Claude into a designer" (planned 26 Sep 2026)
Subject reel DdT_OwyFeoj, 337k plays, 7.1x his median, 9,400 comments (FRONTEND gate). Plan: 1 h test of Taste, Impeccable, Playwright CLI, awesome-design-md, img2threejs; 60 to 75 s cut; verdict at the midpoint; save frame; keyword DESIGN; post 15:00 UTC.
Changes applied from Ep1: first line at 0:00, sting overlaps the first graphic, half the runtime, scorecard save frame, new supers (tally, tool card, wipe, terminal strip, time stamp).
Retro: pending insights.

## Ep1, Nate Herk, the Generate skill (Higgsfield vs Kie), posted 25 Sep 2026, 2:12
Insights at 26 Sep 16:04: 10,765 views, 31 s average watch (23%), skip rate 42.9% (good), 50% gone by 0:08, 118 follows (1.1%), 377 saves (3.5%), 227 comments (2.1%, KIE gate), 160 shares, 99.7% non-followers, India 22% / US 11%, men 97%, 25-34 half.
Lessons:
1. Too long. 2:12 with the verdict at 2:05; almost nobody saw it. Cut to 60 to 75 s, verdict at the midpoint.
2. Six seconds before the first claim (Nate window + jingle hold) cost half the audience. Speak at 0:00, overlap the sting.
3. Saves are the top action. The table is the product. Build one clean save frame on purpose.
4. Follow rate 1.1% says the format (sting, scoreboard, paper stamps) converts. Keep it.
5. Global young male audience. Plain English, tool names as text, prices as numbers.
6. Post at the subject's posting hour (Nate: 15:04 UTC).
Edit lessons (from the v4 to v8 builds): the whole scrapbook template, Reels safe zones, jingle rule and export rule live in the `henry-scrapbook-reel` skill. Nine ChatCut gotchas are recorded there; read them before pass 1.

## Ep3 v2 (29 Sep 2026)
- Henry's v1 notes rejected the Ep2 layout for this take: his head sits lower (hair from y ~537), so the top zone is y 205-520; every super goes there, 750x300 stamps at 165/215, nothing ever on the face. Scoreboard on the LEFT wall (60/600). No captions at all. No screen recordings ("take it away"), replaced by transparent ProRes overlays rendered with Pillow (install loader, hero stamp, styles pick, tips icons) in 02_graphics/overlays/render_overlays.py.
- Opener = the reviewed creator's own hook (his claim must be clear in 3-4 s) in the right window with HIS audio, Henry muted. Sting plays on Henry's face after the first line, only the jingle title at the top.
- Result cut-aways: full frame with the clip's own narration while Henry is silent (end on a sentence boundary, whisper the clip first), then the clip continues muted in a 300x533 window right (740/240) while he talks. Clips were ~4 dB louder than Henry: -5 dB on the cut-aways.
- Voice "muffled" fix: ChatCut isolate_voice on every speech item (must `clear` it before deleting the item, or the delete fails with "Audio effect references missing target"), then EQ presence (+5 dB 3 kHz, +4 dB shelf 4.5 kHz, -4 dB 250 Hz) and two-pass loudnorm in ffmpeg.
- Export check: cross-correlate every speech item against the source; a uniform -30 ms offset on all items is AAC encoder delay, not a bad join.
- Gemini 3.1 Pro mislocated graphics ("overlaps the hair") on a 9:16 reel; trust the frame sheet over its layout claims, keep its audio-balance and flow notes.
- Ripple: deleting a speech line means startDeltaFrames on every later item on every track in one batch, earliest first, and re-sending propertyOverrides on every moved MG.

## Ep3 v3 (29 Sep 2026)
- Henry's v2 notes: tease the best result under his face (no "his/mine" label) during the first line; loader must not sit idle after 100% (add a second stage); a dragged phrase is cut, not sped up (Gemini blind test: 1.35x and 1.8x pitch-preserved both read as glitches, a straight word-to-word cut at an energy valley passed); he wants real logos in the hero card; icon beats over his chest on "simplify / downloading / steps"; style pick = pointer hovering the strip with a glow, click SFX, chosen card grows BELOW the face, the rest go greyscale; five steps in HIS order RESEARCH, SCRIPT, CUT, ANIMATE, VOICE (never "receipt"); the CTA bubble must be a real speech bubble whose tail points at the Reels comment button (beside the shoulder, 420x383 at 655/880).
- Gemini flags any 0.2 s sentence gap as "colliding"; a 5-frame breath fixed it. Ripple +N means startDeltaFrames on every later item on every track, latest first, with propertyOverrides re-sent on each moved MG.

## Ep3 v5 (29 Sep 2026, Henry rushing to post)
- Window frames must NOT pop on the opener: use the static frame MGs (no opacity/scale animation). Henry: "the border that comes in is very weird".
- Drop the "that's crazy" reaction line: hook → sting on a silent hold with the result teaser under the face and the topic stamp inside the sting hold. Silent hold source for Ep3: take 145.0-149.5.
- When Henry remembers a line that is not on tape, build it from fragments (here "it's a bit choppy" + "let me show you what I mean", two different spots) and tell him.
- Body cards: filled accent panels, white icons, kraft label strips, 48 px ExtraBold labels; thin line icons on small paper squares were rejected as unreadable.
- The CTA stays the series comment stamp, centred top. Henry rejected a speech bubble beside the shoulder.
- Colour: for this take Henry asked for a grade ("well lit, not overexposed"): ffmpeg contrast 1.08 / saturation 1.10 / gamma 1.05 / highlight curve, no vignette; face luma ~0.48. ChatCut custom shaders need credits (submit_shader) and push_asset of .ts fails, so the grade lives in composite-ep3-v5.sh.
- Result clips inside the edit need about -6 dB in the composite to sit level with the isolated voice (the -5 dB item gain alone left them 2-3 dB hot).
- Ep3 v6: Henry wants a 2-3 s "what we're testing" line before the ask ("create an informational video") with a testing stamp. During the sting the topic stamp goes UNDER the teaser window, the jingle title holds on top (extend the jingle MG asset duration to 100 s so it can hold past 75 frames).
- ChatCut can silently revert a delete+add pair (an undo in the app?): re-read the timeline before exporting when a swap was made in the same batch as other edits.
- Ep3 v7: sting hold = 90 f with the topic stamp at frame 40 under the teaser; Henry wants the sting segment "faster like the other videos". Word-onset cuts: whisper word starts are ~80 ms early on plosives after a vowel ("actually create"); scan energy at 10 ms and start at the consonant noise, not the whisper timestamp, then Gemini-listen the export.
- Voice (29 Sep 2026, Ep3 v8): Adobe Podcast Enhance beats ChatCut isolate_voice + heavy EQ for Henry's shirt-clipped lav. Workflow: full take as mono MP3 under 10 MB, upload via Claude in Chrome (file input is findable directly), download (free tier = 64 kbps MP3, timing identical to the take), put it on its own audio track item-for-item under the V1 speech, mute V1, then a light presence chain (+3.5 dB 3.2 kHz, +3 dB shelf 5 kHz, -2 dB 250 Hz). Adobe's raw output reads slightly muffled; the presence lift fixes it. Blind-compare in Gemini with the audio sent inline (Part.from_bytes); file uploads sometimes come back "no audio attached".
