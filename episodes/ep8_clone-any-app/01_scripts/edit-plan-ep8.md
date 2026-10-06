# Ep8 edit plan (7 Oct 2026), Ep7 v9 DNA

Project: ChatCut `cb036817` (duplicate of Ep7). Target 75 to 90 s. 1080x1920, 30 fps.

## Opener (series format, Ep7 v7 final)
1. Hook, 0:00 to 0:03.1 (93 f): Henry full frame watching his phone, muted: part1 31.60 to 34.70. Reel window under the chin over the phone (Ep4 position: 370x658 at 486/880, frame to x 880): the reel's own first line with its audio, `02_graphics/hook/reel-first-line-0-3.3.mp4` 0.0 to 3.10 (the copier scanning the logo, the receipt with subscriptions crossed out; the reel cuts to the creator's face at 3.1, stop there). Hook title in the top band (Ep7 style, Fraunces): "Clone any app with Claude?" / "I gave it one hour".
2. Sting, 0:03.1 to 0:06.1 (90 f): straight-to-lens silent hold part1 450.50 to 453.50; egg jingle title MG (COOKED / CRACKED? eggs) in the top band with the 72 f sting audio and the whoosh on the crack; under his chin the result teaser: his own recorder's share page playing (`02_graphics/rerecord/loom-demo.mp4` 4.6 to 7.6, the share page) in a framed window; episode title under it "Clone any app with Claude".
3. Then the speech cut from L01 ("Well, not sure...").

Opener offset for the beats: 93 + 90 = 183 f before cut frame 0 (check after placing; the first speech item starts 3 f later than the scoreboard per Ep7 lesson).

## Main section layout
Ruled-paper backdrop full frame; Henry in the big card (Ep7 CB: 630x1120 at 225/760); scoreboard left (x 70, y 735..1000) from the end of the sting, tick COOKED at the verdict word (B09 frame of "cooked"); explainer per beat in the top zone 980x500 at 50/234 (B11 at 820x420 / 130/236); word captions over the card y 1430..1650 from `01_scripts/words-cut-ep8-v2.json` (+ offset; insert "Not" at the start of L12, the per-piece transcriber dropped it).
B04 and B05 are the clone clips in a window frame instead of MGs: loom-demo.mp4 (9 s, 1960x1000 → 980x500) and slotline-demo.mp4 (14 s). Stamps "6 min" and "8 min" top-left of the clip.

## Cut (01_scripts/cut-ep8-v2.json), 12 lines, 73.6 s speech, 77.2 s with 0.3 s breaths
L01 42.09–45.57 · L04 99.26–103.74 · L05 177.60–186.70 · L06 186.72–197.05 · L07 233.75–238.35 · L08 306.06–307.80 · L09 405.72–414.93 · L10 415.08–417.42 · L11 386.72–398.34 · L12 376.07–382.85 · L13 part2 143.88–154.08. Pieces (pause squeezes) inside each line are in the json.

## Sound
Egg sting at the hold; bubble pop on every MG entrance (max 5 cues per beat, 18 f apart); whoosh on the window swaps (B04, B05); Vine Boom trimmed to 20 f under the COOKED stamp; typing loop under the terminal strip in B03 (-6 dB). Levels per the scrapbook skill (pops -9, whoosh -12, boom -19). Voice: Adobe Podcast Enhance on part1 and part2 lav (a:1) after lock, presence chain, loudnorm -14.

## QA before Henry sees it
Safe-area lines on key frames, join_audit + unprimed Whisper on the export, frame sheet at 22 frames across the beats, loudness, no black tail frames.
