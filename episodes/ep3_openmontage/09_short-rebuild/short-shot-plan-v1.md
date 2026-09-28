# Build Failure Forensics, Ep 1: "Why Perfect Parts Never Fit". 9:16 Short rebuild (28 Sep 2026)

Base: OpenMontage's script (kept, tightened). Voice: Higgsfield preset Elodie (female, British, calm; Gemini ranked her first of 22 female presets for a soothing technical narrator). Video: Higgsfield, Kling 3.0 standard, sound off, 9:16, one clip per shot, image-first so every shot is planned before any video credit is spent. Captions burned in the edit. Music: the Lyria bed from the OpenMontage run (already paid for).

## Costs on Henry's Ultra plan ($1 = 31 credits, from higgsfield.ai/pricing on 28 Sep 2026)

| Item | Credits | USD | Note |
|---|---|---|---|
| Kling 3.0 std, 5 s, sound off, 9:16 | 7.5 | $0.24 | pro 8.75, 4K more. 1.5 credits per second |
| Kling 3.0 std, 10 s | 15 | $0.48 | for the two long lines |
| GPT Image 2.5 still, 9:16 | 0.25 | $0.008 | cheapest still |
| Nano Banana 2 still, 9:16 | 1.5 | $0.05 | better at diagrams and text |
| Elodie narration, whole script (seed_audio) | 6.7 | $0.22 | per-line takes cost about the same in total |
| Lyria music | 0 | $0 | reuse from the run |

Two paths for nine shots, about 63 s of picture:

| Path | Credits | USD | Why |
|---|---|---|---|
| A. Text-to-video only, Kling 3.0 std | 95 | $3.06 | fewest steps, least control |
| B. Image first (GPT Image 2.5) then Kling image-to-video | 97 | $3.13 | +$0.07 buys a still to approve per shot, and a locked look |
| Voice, either path | 6.7 | $0.22 | |
| Total path B | ~104 | ~$3.35 | vs OpenMontage's $0.12 with a robot voice and one AI image |

Decision: path B. Plan all shots, approve nine stills, then animate. Spare credits stay for one re-roll each.

## Style lock (paste at the front of every image prompt)
Photoreal macro, engineering workshop at night. Graphite black background, warm brass and steel parts, one cyan rim light from the left, shallow depth of field, fine machining marks visible, no people, no text, no logos. Vertical 9:16 framing with the subject in the upper two thirds so captions sit in the lower third.

## Shots (VO tightened, target 62 s at about 150 words per minute)

| # | Time | VO (Elodie) | Still (after the style lock) | Motion for Kling | Clip |
|---|---|---|---|---|---|
| 1 | 0:00 to 0:05 | These parts fit perfectly in CAD. In real life, they jam. | A brass pin half-inserted in a steel bore, stuck at an angle, a hairline red gap on one side | Slow push in on the jammed pin, dust motes drift, the pin twitches once and stops | 5 s |
| 2 | 0:05 to 0:10 | Build Failure Forensics. Broken things tell you what the drawing forgot. | A cracked 3D-printed bracket under a loupe on a worn work mat, an engineer's ruler beside it | Loupe lowers over the crack, focus racks from the ruler to the crack | 5 s (title card overlaid in the edit) |
| 3 | 0:10 to 0:18 | CAD gives you exact numbers. Manufacturing gives you a range. A ten millimetre pin lands a little big. The hole lands a little small. Zero gap is a trap. | Two 3D-printed pins side by side on a caliper jaw, one a hair thicker, a grey printed block with a bore behind them | Caliper jaws close on the thicker pin, the digital readout blurs, camera drifts to the block | 8 s |
| 4 | 0:18 to 0:24 | That range is tolerance. How far a real part drifts from the number. | A row of five identical steel pins on black, each a fraction different in diameter, cyan light grazing them | Slow lateral dolly along the row, light shifts across each pin | 6 s |
| 5 | 0:24 to 0:30 | Clearance is different. It is the gap you choose, so the two ranges never collide. | A steel pin sitting cleanly in a bore with a visible even ring of space around it, seen from above | Pin drops into the bore and seats, a ring of light traces the even gap | 6 s |
| 6 | 0:30 to 0:41 | Want movement? Clearance fit. Want it located with light force? Transition fit. Want it locked for good? Interference fit. Same geometry, three jobs. | Three identical bore blocks in a row, each with a pin: one spinning free, one seated flush, one pressed in with a faint stress mark | Left pin spins, middle pin rocks slightly then settles, right pin is pressed home by an arbor press from above | 10 s |
| 7 | 0:41 to 0:49 | There is no magic gap for every printer or material. Print a fit gauge first. Five pins, five gaps, one test. | A small 3D-printed fit gauge, five labelled holes, five matching pins beside it, on the work mat | A hand in a black glove tests pins in each hole, one seats perfectly | 8 s |
| 8 | 0:49 to 0:55 | Put the winning number in your design. Then print the real part. | A finished printed bracket with a steel pin sliding cleanly through its bore, the gauge blurred behind it | Pin slides through smoothly, camera orbits a quarter turn | 6 s |
| 9 | 0:55 to 1:02 | Perfect in CAD is only the start. Next time: why a crack tells you exactly how your part was built. | The cracked bracket from shot 2, now lit so the crack's layer lines glow cyan, loupe resting beside it | Slow push into the crack until the layer lines fill the frame, then fade | 7 s |

Total picture 61 s. Captions: five words per cue max, lower third, Fraunces or Inter, orange active word.

## Order of work
1. Voice: nine Elodie takes, one per shot (seed_audio). Measure each take. Any clip runs VO length plus 0.4 s.
2. Stills: nine GPT Image 2.5 stills with the style lock. Review the contact sheet. Re-roll only the ones that break the look.
3. Video: nine Kling 3.0 std image-to-video clips, sound off, durations from step 1.
4. Edit: ffmpeg concat, VO per shot, Lyria bed ducked 14 dB under voice, title card on shot 2, captions from Whisper word times, 1080x1920, export `09_short-rebuild/build-failure-forensics-ep1-short-v1.mp4`.
5. Gemini watch pass, then Henry.

## Actuals (28 Sep 2026)
Elodie reads at about 110 words per minute with pauses up to 1.4 s at full stops. speech_rate +20 made the take longer, not shorter (15.5 s vs 14.0 s), so the pauses were trimmed instead: leading 0.15 s, internal max 0.38 s, trailing 0.25 s. No time-stretch.

| Shot | Take raw | Take trimmed | Clip ordered |
|---|---|---|---|
| 1 | 6.50 | 5.66 | 6 |
| 2 | 6.90 | 5.73 | 7 |
| 3 | 14.00 | 12.25 | 13 |
| 4 | 8.18 | 6.76 | 8 |
| 5 | 8.60 | 7.44 | 8 |
| 6 | 12.80 | 11.49 | 12 |
| 7 | 10.30 | 9.68 | 10 |
| 8 | 5.25 | 4.75 | 6 |
| 9 | 9.38 | 8.25 | 9 |
| Total | 81.9 | 72.0 | 79 s, 118.5 credits, $3.82 |

Stills: GPT Image 2.5, 752x1344, all nine accepted first pass (2.25 credits). Voice: 9 takes plus 1 retry and 1 rate test, about 8 credits. Higgsfield pushed an "IN THE DARK" preset on five of the nine video submissions; declined with declined_preset_id and resubmitted.

## Build v1 (28 Sep 2026, about 06:50)
`build-failure-forensics-ep1-short-v1.mp4`: 79 s, 1080x1920, 30 fps, 56 MB. Built by `build_short.py`: each Kling clip trimmed to its ordered length, its Elodie take starts 0.25 s in, hard cuts, Lyria bed at -15 dB with a 2.5 s fade, loudnorm -16 LUFS, title card PNG on shot 2, word-highlight captions as PNG overlays (this Mac's ffmpeg 9 has no drawtext and no libass, and dropped `-filter_complex_script`). Caption word times from faster-whisper small on the trimmed takes; script words substituted for Whisper's "Sad" and "whole".

Higgsfield credits: 269.65 before, 141.70 after. Spend 127.95 credits, about $4.13 at 31 credits per dollar. Breakdown: 9 stills 2.25, voice 11 takes about 8, video 9 clips 118.5.

Kling clips come back at 716x1280, 24 fps in std mode; upscaled in the build. Pro mode (8.75 per 5 s) would be the next step up if the upscale shows.

## Build v2 (28 Sep 2026, about 07:20)
Gemini on v1: 5/10, voice 4/10, six shots read as stills with a slow push, three morphed (3, 6, 7). Henry chose: re-roll the three, and swap the voice after hearing samples.
Voice test: five samples of the same 41 words (ElevenLabs Elodie, Juno, Soraya, Nadine; MiniMax Elodie) via Higgsfield text2speech_v2. Gemini ranked Nadine 9/10 (151 wpm, British, clear). Henry picked Nadine. Nine takes, no pause trimming needed, 59.0 s of speech total.
Re-rolls: shots 3, 6, 7 in Kling 3.0 pro with SHOT 1 / HARD CUT / SHOT 2 timed prompts and named hand actions. Pro returns 1076x1924. All three show real cuts and hand articulation; shot 3's last cut pushes the pin in rather than refusing it.
`build-failure-forensics-ep1-short-v2.mp4`: 68 s, 47 MB. Clip lengths 5,6,11,6,6,12,10,4,8. Music fade 4 s.
Credits: 141.70 before, 73.40 after: 68.3 credits, about $2.20 (three pro clips 61.25, voice samples and takes about 7). Both versions together 196 credits, about $6.33.
Lesson: write every Kling prompt as timed shots with a named physical action; "slow push in" buys a slideshow.

## Gemini on v2 (28 Sep 2026)
Overall 4/10, would not publish as episode 1. Voice (Nadine) 6/10, "slightly rigid". Captions in sync, facts correct, music level right, fade still "slightly abrupt". The three re-rolled shots (3, 6, 7) now move but warp: calipers and pins morph at 0:10 to 0:21, the press and glove morph into the pins in shot 6, fingers duplicate at 0:49 in shot 7. The six untouched shots (1, 2, 4, 5, 8, 9) still read as stills with a slow zoom. Biggest fix per Gemini: real mechanical footage instead of AI clips. Full text: `gemini-review-short-v2.md`.
Read across v1 and v2: photoreal macro of hands and metal is where Kling warps; static metal is where it stalls. The explanatory middle (tolerance bands, three fits) is diagram content anyway.

## v3 direction (28 Sep 2026, Henry's call): Artlist stock plus hybrid
Higgsfield balance 73.4 credits. No further generation planned.
Motion graphics rendered locally with Pillow and ffmpeg (`mg/render_mg.py`, no credits): mg3 11 s (10.00 splits into a 9.97 to 10.03 range, pin and hole bars overlap into a red "0 GAP"), mg4 6 s (five pins under a tolerance band), mg5 6 s (bore, pin, clearance ring, two bands with a gap), mg6 12 s (three fits, spinning, seated, pressed with a red stress ring, "same geometry" bracket). Same palette as the stills, everything draws on with easing, constant 3 percent push so nothing reads as a still.
Stock: Artlist went blank for the browser pane after a few searches and downloads need Henry's licence, so `stock/STOCK-BRIEF.md` lists four slots (stock2, stock3, stock7, stock8) with search terms. `build_short.py` now picks per shot: stock file, else motion graphic, else Kling clip.
`build-failure-forensics-ep1-short-v3-preview.mp4`: 68 s, shots 3 to 6 are motion graphics, shots 1, 2, 7, 8, 9 are Kling stand-ins pending stock. When stock3 arrives, shot 3 becomes 5 s of calliper footage followed by the last 6 s of mg3.
