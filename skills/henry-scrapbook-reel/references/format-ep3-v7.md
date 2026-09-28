# The current Cooked or Cracked reel format (Ep3 v7, approved by Henry 29 Sep 2026)

Henry: "Oh my god, I love it. This is perfect." Build every new episode to this spec unless he changes it. Numbers are 1080x1920 canvas pixels, 30 fps. Full worked example: Ep3 `01_scripts/cut-ep3-v11.json`, `01_scripts/v8-adds-v1.json`, `01_scripts/v8-adds-overlays.json`, `05_cuts/v5-notes.md`.

## Running order (about 1:30)
| Beat | Frames (Ep3) | Picture | Top zone | Under the face | Sound |
|---|---|---|---|---|---|
| Hook | 0-131 | Henry muted, the reviewed creator's own hook in a 380x676 window right (628/790) with HIS audio at -3 dB | Pill "Cooked or Cracked?" 560x120 at 260/330 | | pop |
| Sting | 131-221 (90 f) | Henry silent hold (a stretch where he is quiet, typing is fine) | Jingle title 850x340 at 115/180, holds (asset duration 100 s) | Best-of teaser of the winning result, 460x383 at 310/1010, static landscape frame 484x407 at 298/998; topic stamp 520x208 at 280/1400 pops at frame 40 | sting v3, pops on the word beats 6/21/28 |
| Install / setup | next | Henry | loader overlay (bar to 100 %) | | pop |
| "What we are testing" | 3-4 s | "let's see what it can do" + "create an informational video" | stamp testing / INFO VIDEO | | pop |
| The ask | under 4 s | topic in two fragments | stamp the ask / TOPIC | | pop |
| Timings | 6-7 s | one number per line | stamps on the spoken numbers (script 4 MINUTES, voice 10 MINUTES, visuals 45 MINUTES) | | pop each |
| Pre-clip claim | | "it's a bit choppy, let me show you what I mean" | stamp his result / CHOPPY | | pop |
| His result | 4 s | FULL FRAME with its own narration, -6 dB in the composite | nothing | nothing | scoreboard OFF |
| Reaction | 2 s | Henry, his clip continues muted in a 300x533 window right (740/240) with static frame 324x557 at 728/228 | narrow stamp 640x256 at 60/260 (BLOCKY) | | pop |
| My way | 11 s | Henry | hero overlay with the two real logos (750x345 at 165/175) from the top of the line | body cards over the chest 720x368 at 180/985 on the spoken words (simplify / no download / no steps) | whoosh, pops on each card |
| Styles | 10 s | Henry | styles strip: five cards, paper cursor hovers with a glow, click on the pick, others go greyscale | the picked card grows in 600x470 at 240/975 | click + pop |
| My result | 3.6 s | FULL FRAME with its narration, -7 dB | nothing | nothing | scoreboard OFF |
| Reaction | 8.6 s | Henry, my clip muted in the right window | narrow stamp my result / UNDER 30 MIN from the first frame back | | pop |
| Price | 5 s | Henry | price tags 750x285 at 165/225 on the spoken prices | confetti full frame at the second tag | clicks, cash register |
| Verdict | 2.5 s | Henry | stamp verdict / COOKED (accent) | | scoreboard tick, pop |
| Tips | 7 s | Henry | five icon chips in HIS order: RESEARCH, SCRIPT, CUT, ANIMATE, VOICE, banner "5 steps, one harness" | | pop |
| CTA | 3.5 s | Henry | stamp comment / PAPER (accent), centred, series format | | pop |

## Rules that came out of Ep3
- Top zone is y 205 to 520 on this framing (hair starts at 537). Stamps 750x300 at 165/215. Nothing ever on the face. Hair position changes per take: measure it on two frames first.
- Scoreboard 220x195 at 60/600 on the left wall, split into segments so it is OFF during every full-frame clip and pops back with Henry. Tick on the verdict word.
- No captions. No screen recordings. Every explanation is a transparent ProRes overlay (Pillow, `02_graphics/overlays/render_overlays.py`) or a paper stamp MG.
- Window frames must be the STATIC frame MGs (no pop). The pop-in frame "looks very weird".
- Result clips: full frame with their own narration while Henry is silent, cut at a sentence end, then muted in the right window while he talks.
- Voice: ChatCut isolate_voice on every speech item, then `composite-ep3-v5.sh`: grade (contrast 1.08, saturation 1.10, gamma 1.05, highlight curve, warmth) + highpass 100, -5 dB 250 Hz, +2 dB 1.6 kHz, +6 dB 3 kHz, +5 dB shelf 4.5 kHz, denoise, 3:1, limiter, two-pass loudnorm -14 LUFS; result clips -6/-7 dB inside their windows.
- Cuts: word-level. Scan energy at 10 ms and cut at the consonant onset, not the whisper timestamp. join_audit, cross-correlate the export against the source, then a Gemini listen of every new join. Three attempts were needed on "actually create".
- Pace: sting 3 s, ask under 4 s, timings under 7 s, whole reel about 1:30.
