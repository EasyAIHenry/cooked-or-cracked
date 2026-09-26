# Learning log (append after every episode's retro; newest first)

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
