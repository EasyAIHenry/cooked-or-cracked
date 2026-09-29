# De-myth sheet: Paulo Shimas, "Claude can now edit 100% of your videos"

Reel: https://www.instagram.com/p/Dd1u7XyyPav/ (posted 28 Sep 2026, 48.5 s)
Numbers on 29 Sep: 32,136 plays, 749 likes, 3,758 comments. 4.2x his 11-post median (7,622). Comment rate 11.7%. Gate "EDIT".
His guide: `03_reference/pauloshimas-guide.pdf` (13 pages, "Let Claude Edit Your Videos", The Creator Stack).
Gemini audit: `pauloshimas-audit-report.md` (9.5/10 as a creator; ignore its "Opus 5.5 does not exist" line, that is Gemini's cutoff, not a fact).

## His claim, in his words
Caption: "Claude can now edit 100% of your videos. You just ask."
On screen, the whole reel: "Claude Opus 5.5 edited 100% of this video", with the edited version on top and his raw single take ("ORIGINAL") underneath.

## What he does in the reel (0:00 to 0:48)
| Time | He says on camera | What appears |
|---|---|---|
| 0:00 | "Your editing days might be over. What Claude can do now will blow your mind." | kinetic titles EDITING DAYS / OVER / MIND on black |
| 0:04 | "Zoom in on my hand and put the Claude logo right here, in 3D." | punch-in, 3D Claude logo sitting on his palm |
| 0:09 | "Nice. Now throw it straight at the camera." | logo flies at the lens, glass crack full frame |
| 0:14 | "Split the scene into layers. The wall, me, and the text." | 3D exploded layers panel, like a Photoshop layer stack |
| 0:19 | "Now hide my layer." / "Okay, bring me back." | he vanishes from the room, then returns |
| 0:22 | "Put me in a frame on the right, and on the left, show how a reel goes viral." | he shrinks into a card right, explainer builds left (hook 3 s, watch to the end, share) |
| 0:33 | "Back to full screen. Now float my best reels behind me in 3D." | phone screens float behind him, one "hits" him ("Ow") |
| 0:39 | "Last one. Make me the star of a documentary. Make it dramatic." | cutout on yellow, "PAULO SHIMAS, RETIRED EDITOR", "ONE MAN. ONE TAKE. ZERO EDITING." |
| 0:45 | "Crazy, right? Comment EDIT for the full guide." | comment card with the guide cover |

## The stack (verified 29 Sep 2026 on this Mac)
| # | He says | It actually is | Install | Cost | On this Mac |
|---|---|---|---|---|---|
| 1 | Claude Code, the editor | Anthropic's CLI / desktop Code tab | claude.ai/download | Pro $20/mo or higher | installed |
| 2 | HyperFrames, the engine | `heygen-com/hyperframes`, Apache-2.0, HeyGen. Claude writes HTML + GSAP, it renders MP4 in headless Chrome. CLI 0.8.91, plugin 0.8.91 (21 skills) | `claude plugin marketplace add heygen-com/hyperframes` then `claude plugin install hyperframes@hyperframes` | free | CLI 0.8.91 (latest). Plugin 0.7.31 from 4 Jul, update pending Henry's OK |
| 3 | Whisper, the ears | whisper.cpp on Mac. HyperFrames calls it through `npx hyperframes transcribe` | `brew install whisper-cpp` | free | 1.9.4 installed. small.en model downloaded on first use |
| 4 | FFmpeg, the eyes and scissors | frames, cuts, audio | `brew install ffmpeg` | free | 9.0.2 installed |
| 5 | Python 3 | runs faster-whisper on Windows, small scripts | `brew install python` | free | 3.9.6 (system) + 3.12 via brew. Not upgraded: switching `python3` would break the audit script |
| 6 | Node.js 22+ | runs HyperFrames | `brew install node` | free | 24.15.0 installed |

Extras the guide doesn't mention: headless Chrome is downloaded by HyperFrames (already cached here). Docker is optional. Kokoro TTS and MusicGen are optional. `npx hyperframes doctor` passes every required check here.

## Receipts so far (29 Sep 2026)
- `npx hyperframes doctor`: all required checks pass. Optional: Kokoro TTS, MusicGen, Docker not running.
- Whisper on his own reel: 145 words, word timings, 44 s including the first small.en model download. It wrote "Claude" as "Clav" twice, the exact error his guide warns about on page 03.
- Henry's usual footage (iPhone HEVC, HLG 10-bit, 50 fps, 1728x3072 vertical): `hyperframes init` + render of a 6 s slice took 8 s + 35 s. Output stays HLG 10-bit at 30 fps and the colours match the source. No SDR conversion needed.
- Install time: see `install-timing.md`.

## Security (skillspector + manual sweep, 29 Sep 2026)
See `hyperframes-security-scan.md`. Short version: skillspector scores most of the 21 skills CRITICAL, as it does for every large agent repo (Ep3 lesson). Manual sweep of the plugin skills: no invisible unicode, no injection phrases, no curl-to-shell (the HeyGen installer pipe found in Ep3 is gone), no shell=True. Outbound hosts: CDNs, Google Fonts, Gemini API, HeyGen API, one PostHog anonymous telemetry call (turn off with `npx hyperframes telemetry disable`).

## What "works" means (decide before the test)
Same take, his prompts word for word, his loop (plan, cut, build, preview, notes, render). Timer runs from the first prompt to the final MP4.

| Edit | Pass | Fail |
|---|---|---|
| Transcript + frames (his first prompt) | word timings, names right after the fix, a description of what's in the shot | wrong names after the fix, or it can't see the frames |
| Beat sheet | a table you approve without rewriting more than 2 rows | you rewrite it |
| Cut the dead air | no cut inside a word, pauses about 0.3 s, one listen, no audible jumps | clipped words or robotic pacing |
| Captions | in sync on the word, safe zone respected | drift over 0.2 s or text under the app buttons |
| 3D logo on the hand, thrown at the camera | logo sits on the palm and tracks the punch-in, crack lands on the word "camera" | floats off the hand or looks like a flat sticker |
| Layers: wall, me, text, hide me, bring me back | clean cutout edges, the room is empty when you vanish | halo around the hair, ghost of you left in the room |
| Frame right, explainer left | explainer builds on your words | text lands late or overlaps |
| Reels floating in 3D behind you | you stay in front of the screens | screens cover you |
| Documentary ending | cutout + titles + dramatic sound | looks like a template |
| Whole thing | you'd post it without opening ChatCut, under 2 h and 3 notes rounds | you need ChatCut to finish it |

## One-hour test plan (timer on screen)
Set up: new folder `~/coc-ep4-test/`, put `take.mp4`, `claude-logo.svg`, `cooked-or-cracked-logo.png`, `reels/` (Ep1 to Ep3 cuts) and a `CLAUDE.md` with his style rules in it. Fresh Claude Code session in that folder. Screen record the whole thing (`screencapture -x -v`, in segments).

0:00 to 0:05, his first prompt, word for word (guide page 03):
```
My video is take.mp4 in this folder. Transcribe it with Whisper, with a timestamp for every word, and save the words and times to take.words.json. Then use FFmpeg to pull one frame per second and look at the frames. Tell me what I say, when I say it and what is in the shot at each moment. These names must be spelled right: Henry Chua, Claude, HyperFrames, Cooked or Cracked, ChatCut, Paulo Shimas.
```
0:05 to 0:10, plan first (page 05), word for word:
```
Before you build anything, write a beat sheet for this edit as a table: start and end time, my exact words, what appears on screen, where the text sits, and the sound. Format: vertical 9:16 for Reels. Keep all text out of the bottom 20% of the screen and away from the right edge, where the app buttons are. Wait for my OK before you build.
```
0:10 to 0:15, cut the dead air (page 06):
```
Cut every pause longer than 0.3 seconds and every breath, using the word timings. Never cut inside a word, and keep a short beat before each punchline. Tell me the new length.
```
0:15 to 0:45, build. The effects are said on camera, so one line:
```
Build the edit from the approved beat sheet. Every request I say on camera is an effect: build it on the exact word. Add captions word by word, two or three words at a time, bold and white, the key word in yellow, at 65% of the screen height. Save a version before each round.
```
0:45 to 0:55, preview (`npx hyperframes preview`) and notes, one change per line with the time (page 05). Count the rounds.
0:55 to 1:00, render: "render it" or `npx hyperframes render -o final.mp4`. Note the clock, the render time and `/cost` or `/usage`.

If it goes past 1 h, keep going but log where the time went. If it is bad, the same take goes into ChatCut for the B side.

## Likely gotchas (from the docs, not tested yet)
- Whisper names: "Claude" becomes "Clav" (confirmed on his reel). Names go in the first prompt.
- His 3D and cutout effects need prep on the day: an open still hand for one second, a 2 s clean plate of the empty room at the end of the take, distance from the wall. Without the clean plate "hide my layer" leaves a hole.
- He films horizontal 16:9 (his "ORIGINAL" panel is 16:9) and reframes to 9:16. Vertical works, but the split-screen original/edited look needs 16:9.
- `remove-background` runs a local model on the whole take. On a 4K 50 fps take expect minutes, not seconds. Downscale to 1080p first if it drags.
- 50 fps in, 30 fps out. Fine for Reels.
- `hyperframes init` checks GitHub for AI skills on every run. Set `HYPERFRAMES_SKIP_SKILLS=1` so it can't install anything unscanned.
- Claude usage: the build is many rounds of HTML + snapshots. Watch `/usage`; on Pro this could hit the 5-hour limit.
