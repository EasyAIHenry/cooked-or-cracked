# De-myth sheet: Dr Alvaro Cintas (@drcintas), "an open-source AI that makes entire YouTube videos from start to finish"

Reel: https://www.instagram.com/p/DdttZS1RTZu/ (posted 25 Sep 2026, 37 s)
Numbers on 28 Sep: 42,000 plays, 1,301 likes, 2,497 comments. 4.7x his 12-post median (9,004). Comment gate "VIDEO". Comment rate 5.95%, three times his usual.
Full Gemini audit: `drcintas-audit-report.md` (score 8/10, cracked as a marketer, unproven as a demo). Apify hit its monthly limit, so plays come from the logged-out reels grid (rounded). Security scan: `openmontage-security-scan.md`.

## His claim, in his words
- 0:00 "I just found an open-source AI that makes entire YouTube videos from start to finish."
- 0:04 "It's basically a full production team in one AI."
- 0:07 "It can write scripts, create storyboards, find footage, generate visuals and voiceovers, edit everything, and render the final video."
- 0:24 "So I gave it a YouTube channel idea and one goal: make the entire video for me. No editor, no production team or scriptwriter, just AI."
- 0:30 "And it generated high-quality videos like this right here."
Caption adds: "over 100 production tools, 700 agent skills and knowledge files, reference-based creation, and built-in live web research."
Not stated anywhere: cost, generation time, that Claude Code or another agent runs it, that video generation needs paid keys.

## What his screen shows (from the Gemini forensic pass)
- One real screen recording, 0:20 to 0:23: he types `Create a video using this reference video on the topic of "France vs England The Hundred Years' War"`, and a file list shows `renders/final.mp4 (102 MB)` for a project named bermuda-triangle. Different topic, different project.
- 0:26: prompt `Check this youtube channel and make the entire video` under a YouTube URL, then a panel titled "shot-by-shot breakdown of GeoGlobeTales' Short" (Runtime 1:38, 31 panels, about 165 wpm).
- The "high-quality videos like this" clips are the 2D map and chibi-character footage that his own panel labels as a breakdown of an existing channel's Short. No render progress, no timer, no output playing with its own voiceover.
- Storyboard mockup "How America Bought Louisiana", 17 shots, 4 m 15 s. Not shown rendered.
So the reel shows the tool analysing a reference video. It does not show the tool's own output playing. That is the thing to test.

## The tool (verified 28 Sep 2026 from the repo, commit 08e2151 of 6 Sep 2026)

| # | He says | It actually is | Install or access | Cost |
|---|---|---|---|---|
| 1 | "Makes entire YouTube videos from start to finish", "a full production team in one AI" | `calesthio/OpenMontage`, 61.5k stars, 7.8k forks, 333 open issues, 50 contributors, created 29 Mar 2026, AGPL-3.0. There is no orchestrator program. Your coding agent (Claude Code, Codex, Cursor) reads 700+ markdown "skill" files and runs Python tools stage by stage: research → proposal → script → scene plan → assets → edit → compose. | `git clone https://github.com/calesthio/OpenMontage.git && cd OpenMontage && make setup` (needs Python 3.10+, Node 18+, FFmpeg). Then open the folder in Claude Code and type the prompt. | Repo free. Agent tokens are not. Providers $0 to about $3 per video by their own Prompt Gallery. |
| 2 | "Built-in live web research" | The research stage has `tools_available: []`. It is the agent's own web search (Claude Code WebSearch), told to run 15 to 25 searches and cite 5+ sources. No research code in the repo. | Nothing to install. Needs an agent with web search. | Tokens. |
| 3 | "Write scripts", "generate voiceovers" | Script stage is markdown instructions plus a JSON schema. Narration: Piper TTS offline for free, or ElevenLabs, OpenAI, Google, HeyGen with keys. | `make setup` installs piper-tts. | Free with Piper. |
| 4 | "Find footage, generate visuals", "create storyboards" | Zero keys: Remotion text cards, charts, stat cards, and free archive footage (Archive.org, NASA, Wikimedia). With keys: FLUX images and Veo, Kling, MiniMax video via fal.ai, or Google Imagen and Veo via GOOGLE_API_KEY. | Keys in `.env`. | $0.15 to $1.50 per video with fal.ai. |
| 5 | "Edit everything, and render the final video" | Remotion (React) or HyperFrames (HTML/GSAP) composition, FFmpeg encode, word-level captions, self-review with ffprobe and frame sampling. Explainer pipeline defaults: budget $2, max wall time 20 minutes, 3 revisions per stage. | Included in `make setup`. | Free. |
| 6 | "No editor, no production team or scriptwriter, just AI" | A local board on 127.0.0.1:4750 that reads the project folder. Proposal, script, scene plan and assets pause for a "yes" from you. Not one prompt and walk away. | `python -m backlot open` | Free. |

Note on "start to end": the pipeline ends at `publish`, and `tools/publishers/` only writes an export folder. Nothing uploads to YouTube. The honest gap to test on screen: how many times it stops and asks, and whether the result is a video Henry would upload.

## What "works" means (decide before you test)

| Claim | Pass | Fail |
|---|---|---|
| Install | `make setup` finishes and `make preflight` lists working tools, within 10 minutes. | Errors Henry has to fix by hand. Note each one. |
| Research | It names real channels and real numbers with URLs that open. Compare against `faceless-channel-research.md`. | Made-up channels or numbers, or no sources. |
| Script | A 60 to 90 s script with a hook in the first line, three acts, and facts from the research. | Generic filler, wrong length, no research in it. |
| Visuals | Every scene has a real asset (footage, image or motion graphic) that matches the line. | A slideshow of text cards, or missing assets. |
| Final video | One MP4 with narration, captions, music, that Henry would upload as episode 1 of a faceless channel. | Crashes, silent, or looks like a template. |
| Time and cost | Under 60 minutes wall clock, under $5 in provider spend, tokens noted from `/cost`. | Over an hour, or Henry had to write code. |

## One-hour test plan (start the timer, screen recording on)

0:00 to 0:10, install. In `~/coc-ep3-test/OpenMontage`:
```
make setup
make preflight
```
Say what fails. Add keys to `.env` (Google key for Gemini, Imagen, Google TTS; fal.ai key if we buy one; no HeyGen, no ElevenLabs).

0:10 to 0:15, open Claude Code in the repo folder and type the one prompt. Same prompt every run. His own prompt on screen was "Check this youtube channel and make the entire video"; ours adds the criteria:
```
Research faceless educational YouTube channels and find one niche that is growing and under-served. Then produce the first video for a new faceless channel in that niche: 60 to 90 seconds, educational, narrated, with word-level captions and music. Audience: men 18 to 34 in India, the US and Southeast Asia who build things. Direct it like a creative director and producer on a big Hollywood set: a cold-open hook in the first 5 seconds, three acts, deliberate shot pacing, one visual motif that repeats, a title card, and a closing line that sets up episode 2. Show me the research, the concept options and the itemised cost before you spend anything. Deliver a final MP4 I can upload.
```

0:15 to 0:50, run the pipeline. Answer every gate with the first option unless it is wrong. Note on screen: the clock at each stage, each provider it picks, each dollar it reports, each time it asks.

0:50 to 1:00, play the MP4 full screen. Run `ffprobe` on it. Note length, resolution, whether captions burned in, and `/cost` in Claude Code.

Fill the scorecard in `01_scripts/script-ep3.md` before you record the talking head.

## Likely gotchas (from the repo, not tested yet)
- This Mac's default `python3` is 3.9. The Makefile wants 3.10+ and will use `uv` to build `.venv` with 3.10 if `uv` is present (it is). If it complains, `PYTHON_VERSION=3.12 make setup`.
- `make setup` runs `npm install` in `remotion-composer` (13 packages plus tree) and `npx --yes hyperframes`. First render may pull Chrome for Remotion, about 200 MB.
- The explainer pipeline's `max_wall_time_minutes: 20` is a target, not a cap. Web research alone is 15 to 25 searches.
- Every creative gate waits for a "yes". Count them on screen. The reel says "start to end"; the repo says "every creative decision gets your approval".
- Zero-key visuals are text cards and archive footage. If the output is a slideshow, the repo's own "delivery promise" gate is meant to block it. Watch whether it does.
- With only a Google key, video generation is Veo through `google-genai`. Veo costs per second. Set a budget when it asks.

## Results of the groundwork run (28 Sep 2026, Codex as orchestrator, screen recorded)

Full timeline: `test-timeline.txt`. Run log and every artifact: `openmontage-run/`. Output: `../03_reference/openmontage-output/`.

| Step | What happened | Time | Money |
|---|---|---|---|
| Security scan | skillspector 100/100 CRITICAL, all hits were docs; manual sweep clean | 10 min | $0 |
| `make setup` | Zero errors. uv built a Python 3.10 venv, pip, 199 npm packages, piper-tts, hyperframes cache | 40 s | $0 |
| Preflight | 41 of 117 tools configured with the Gemini key. Piper not listed even though installed | 1 min | $0 |
| Claude Code headless | "OAuth session expired". CLI logged out on this Mac. Switched to Codex | 3 min lost | |
| Codex first run | Account default model needs a newer CLI. Relaunched on gpt-5.6-sol, high effort | 3 min lost | |
| Research | 4.0 min, 12 sources, picked niche "Build Failure Forensics" | 4 min | $0 |
| Proposal | 5 concepts, itemised estimate $0.15 with $0.30 envelope, picked "Why Perfect Parts Never Fit" | 5 min | $0 |
| Script | 7 sections, 169 words, hook in line 1, Ep2 tease in the last line | 4 min | $0 |
| Scene plan | 9 shots, one repeating red clearance-gap motif | 4 min | $0 |
| Assets | Google TTS 403 (API not enabled on the key project), fell back to Piper offline voice. 1 Gemini image $0.039, 1 Lyria track $0.080, Whisper for word timings | 18.4 min | $0.119 |
| Edit, compose, QA | Hand-written Remotion composition, Chromium sandbox block worked around, self-review passed | 6.5 min | $0 |
| Publish | Export bundle: MP4, SRT, thumbnail, description, chapters, tags | 1.5 min | $0 |
| Total | 12 gates, all self-approved by instruction. 561k Codex tokens | 45 min 22 s from prompt to MP4 | $0.119 |

Output: 75 s, 1920x1080, 30 fps, H.264/AAC, burned word-level captions, title card, three acts, closing tease. Frames in `../02_graphics/openmontage-render-frames.jpg`.

Gotchas seen on screen (add to the guide):
- `claude` CLI must be logged in (`claude login`) or headless runs die in 2 s.
- Codex CLI 0.147 needs `-m gpt-5.6-sol`; the account default model errors.
- Codex warned "exceeded skills context budget, 60 skills dropped" on start. It still worked.
- Cloud Text-to-Speech must be enabled on the Google project or google_tts 403s. Enable it in the console, no gcloud needed.
- The agent invented a playbook name and the checkpoint validator rejected it. It recovered.
- The agent guessed `tools.publish` instead of `tools.publishers`. It recovered.
- Backlot tried to open Chrome and Firefox via osascript from inside the sandbox and failed. The board itself works at 127.0.0.1:4750.
- Remotion's bundled Chromium was denied a port by the Codex sandbox. It switched to an installed browser.
