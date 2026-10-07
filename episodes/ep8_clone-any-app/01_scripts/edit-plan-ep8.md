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

## Pass 2 status (7 Oct 2026, 05:45 SGT)
- Timeline `f98c82dc0a` "Ep8 v1 — pass 2b (tight pauses)" in ChatCut project `cb036817`; 196 items from `place_ep8.py` (tracks in `tracks-ep8.json`). Pass 2a (`100299a6`) kept as fallback.
- Export `05_cuts/pass2/ep8-pass2b-export.mp4` (77.3 s, 1080x1920 30p, raw lav at -22 LUFS); phone copy `ep8-pass2b-phone.mp4` (24 MB, -14.1 LUFS, highpass 70 + 2.5:1 comp + two-pass loudnorm) sent to Henry.
- QA done on the export: 12-frame cue sheet (`sheet-2b.jpg`, pops land on Loom / Buffer / cooked / 10), safe-area lines clean, no black tail, join audit clean (no cut on speech; pauses 0.24 to 0.53 s, one 0.85 s paragraph break before "Not everything"), unprimed Whisper verbatim on every line (L08 "but" verified on the isolated piece; the full-file listen hears "I think" across that join, a context guess).
- Cut changes vs pass 1/2a: `tighten_cut_ep8.py` (L04 in 99.10, L08 306.11 to 307.93, L11 out 398.26, L12 in 375.98 so "Not" is whole, 0.08/0.10 s margins, L01 keeps its breath). Explainers start earlier by their line's head trim (SHIFT in place_ep8.py). COOKED verdict stamp fills the top zone at "Well, this is cooked".
- Open: Adobe Enhanced voice swap (needs Henry's "download"), Drive folder to Viewer (needs "viewer"), ManyChat CLONE automation, final sync to the public repo, learning-log entry. Henry's notes on pass 2 decide pass 3.

## Pass 3 status (7 Oct 2026, 11:35 SGT), after Henry's pass 2 notes
- Notes: voice too soft ("maxing out my sound"), the "why" not clear, start more direct, check the whole script for choppiness.
- Cut v3 (build_cut_ep8.py LINES): hook, L04 two apps, L4a thesis (127.34-137.45, one piece), L05, L06, L07, L08, L11 verdict, L09, L10, LMa licence (422.92-429.45), L12, L13. Out: L01 hedge, L9a repository line (runtime; L11 carries storage). 90.8 s, verdict at 51%.
- New: B01b_features-not-app explainer (`02_graphics/explainers/B01b_features-not-app/`, asset `5d200edc46`, cues from energy bursts: clone 94, features 206, not 236, entire 246, itself 282), LICENCE stamp on LMa, verdict stamp at "Well, this is cooked". Stamp beats in beats.json carry `stamp:{label,word,icon}`.
- Word timing: both Whisper passes drift up to 1 s on L4a and LMa; `place_ep8.py` ENERGY_ALIGN spreads the line's own words over the energy runs (char-proportional). Caption highlights on L4a can sit up to 1 s off; explainer cues were set by hand from the runs.
- Sound: VOX +3 dB, every SFX -3 dB in the placer; `05_cuts/pass3/mix_v3.sh` (highpass 90, -3 dB @250, +7 dB @2.8k, +5 dB shelf 5k, 3:1 comp, two-pass loudnorm -12, limiter -1). Result: 2-4 kHz from -16 to -7 dB vs low-mids, -11.3 LUFS integrated, speech RMS -14.8 dBFS. Files: `ep8-pass3-export.mp4` (ChatCut), `ep8-pass3-master.mp4` (remixed audio), `ep8-pass3-phone.mp4` (28 MB, sent).
- QA on the export: 12-frame sheet (`sheet-v3.jpg`) with safe-area lines, no black tail, join audit clean (pauses 0.24-0.59 s), Whisper verbatim (its "cool" at 1:21 is the known cooked/cool guess).
- ChatCut: timeline `df09fedae9` in cb036817, tracks in `tracks-ep8.json`. Two other sessions switch the window; the Showreel session cannot receive messages, so wait for its project folder to go quiet (8 min) before `target_project`, and `read_project` before every `edit_item`.
- Open: Adobe voice swap ("download"), Drive to Viewer ("viewer"), ManyChat, repo sync, learning-log entry, retro.

## Pass 4 status (7 Oct 2026, 12:15 SGT), after Henry's pass 3 notes
- Notes: the sting hold looked tired and silent (it was him mid-sentence at 450.5 s with the sound off, read as "oh hold on"); lower the jingle; "I have installed Loom" is wrong, he cloned it; the Buffer clone's "why" (storage, Instagram, Meta) must be there.
- Opener: no hold shot. Reel hook 0-93, then L04 starts at 93 with the egg jingle under it (A1, -17 dB after the global -3), the egg title on STK at 140/1420 800x320 for 72 frames, captions start after it (CAP0 = 169). Series rule restored: the sting overlaps the first beat, never its own silent shot.
- Cut: L05 = first sentence only (177.60-182.16); L9a back (398.28-405.25, NO STORAGE stamp) between L11 and L09. 91.3 s, verdict at 43%.
- The L9a out point was first cut 0.14 s inside "data" (join audit flagged it): fixed in ChatCut by hand (items 41666a56/754f2b0c 205 to 209 f, hold 5d41ef4a 1675/5 f) and in the cut files (tighten MANUAL L9a out 405.25); re-exported as `ep8-pass4-export.mp4` (first render kept as `ep8-pass4a-export.mp4`).
- Captions: L9a per-piece Whisper wrote "post" and "anything"; the cards say "posts" and "any data" (FIX dict). One word to confirm with Henry: "photos or any data" vs "photos or anything" (the full-take pass says data, the export listen says anything).
- QA on the export: 12-frame sheet (`sheet-v4.jpg`) and opener sheet (`sheet-v4a.jpg`), safe-area lines clean, no black tail, join audit clean (pauses 0.24-0.52 s), Whisper verbatim. Voice chain unchanged: `ep8-pass4-master.mp4`, `ep8-pass4-phone.mp4` (28.5 MB, -11.3 LUFS) sent.
- ChatCut: timeline `df09fedae9` renamed "Ep8 v4 — pass 4 …" (pass 3 items deleted, pass 4 items added). Window handed back.
- Open: Adobe voice swap ("download"), Drive Viewer ("viewer"), ManyChat, repo sync, learning log, retro.
