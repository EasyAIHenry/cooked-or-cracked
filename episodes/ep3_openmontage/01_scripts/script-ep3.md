# Cooked or Cracked, Ep 3: Dr Alvaro Cintas (@drcintas), "an open-source AI that makes entire YouTube videos from start to finish"

Target 60 to 75 s. Filled from the 28 Sep 2026 groundwork run. Henry re-runs on camera with Claude Code (run `claude login` first).

## Scorecard
| # | Claim | What he says | What happened | Time | Tick |
|---|---|---|---|---|---|
| 1 | Start to finish | "makes entire YouTube videos from start to finish" | One prompt to a 75 s 1080p MP4 plus SRT, thumbnail, description, tags. Nothing uploads to YouTube. 12 gates, each waits for a yes unless told to self-approve | 45 min | works |
| 2 | Live web research | "built-in live web research" | It is the agent's own web search. 12 sources, none fabricated, 7 of 7 checkable URLs real. But about 6 searches in 4 min, 0 of 10 ground-truth facts found, and "growing and under-served" was inferred from 3D-printing market size, not YouTube data. Score 4/10 in research-comparison.md | 4 min | meh |
| 3 | Scripts and voiceover | "write scripts ... generate voiceovers" | Script: 169 words, hook in line 1, three acts, Ep2 tease. Voice: Google TTS failed 403, Piper offline voice used. Gemini rates the voice 6/10, "most viewers will notice it is synthesised". Captions in sync, no factual errors in the fits content | 4 min + 18 min | meh |
| 4 | Storyboards and visuals | "create storyboards, find footage, generate visuals" | 9-shot scene plan, 1 AI image, the rest hand-written Remotion motion graphics in one palette. No stock footage used. Gemini rates visuals 6/10: explains the words, one style, "occasionally resembles a slideshow template". Hook 7/10 | in the 18 min | works |
| 5 | Edit and render | "edit everything, and render the final video" | Remotion render, word-level captions, music ducked, self-review passed | 6.5 min | works |
| 6 | Just AI, no editor | "no editor, no production team or scriptwriter, just AI" | True for this run: zero human edits. But two agent errors self-fixed, two setup faults were mine (CLI login, TTS API) | | works |
| 7 | Cost | Not stated | $0.119 in providers. 561k Codex tokens. Repo free, agent not | | receipt |

Overall: 5 works, 2 meh, 0 cooked. Gemini overall 6/10, biggest fix: replace the Piper voice with a human or a paid voice. Cost: $0.12. Verdict: [COOKED / CRACKED] [score]/10, Henry decides after watching with sound.

## Beat sheet (draft, fill after Henry's on-camera run)
| Time | Say | Screen | Super / animation |
|---|---|---|---|
| 0:00 to 0:03 | "He says one open-source AI makes a whole YouTube video. I gave it one prompt and a timer." | Henry + drcintas reel window low-left, muted | pill, tally 0/7 |
| 0:03 to 0:05 | (sting overlaps) | frame of the render | jingle title |
| 0:05 to 0:12 | "Install is one command. Forty seconds." | terminal, make setup at 11x | terminal strip, time stamp 0:40 |
| 0:12 to 0:20 | "It searched the web itself. Twelve sources. It picked a niche: why 3D printed parts jam." | research JSON scrolling, board | tool card Research, tick |
| 0:20 to 0:28 | "Script, storyboard, nine shots. Then it asked me twelve times. Yes, yes, yes." | Backlot board filling | gate counter 12 |
| 0:28 to 0:36 | "Google voice failed. My setup. It switched to a free voice on its own." | 403 line, Piper wav | stamp "my setup" |
| 0:36 to 0:44 | "Forty-five minutes. Twelve cents. This is the video." | the render plays full frame with its own audio | time stamp 45:22, price 12c |
| 0:44 to 0:50 | verdict + score | Henry face | scoreboard tick, verdict stamp, confetti if CRACKED |
| 0:50 to 0:58 | "Who is this for: anyone starting a faceless channel who can run a terminal. Not for a phone." | export bundle folder | real-life beat stamp |
| 0:58 to 1:05 | save frame: scorecard held 2 s. "Screenshot this. Comment MONTAGE for the install guide." | scorecard | save frame, comment stamp |

## New supers for this episode
| Super | Where | Props | Notes |
|---|---|---|---|
| Gate counter | top right | n (0 to 12) | a stamp per "yes", clicks up each time |
| Cost ticker | beside the gate counter | dollars | $0.00 sits still until assets, then jumps to $0.12 |
| Pipeline strip | bottom zone | 8 stage names, active index | research → proposal → script → scene plan → assets → edit → compose → publish, each lights on its checkpoint |
| 403 stamp | top | "my setup" | red, used once |
| Render window | full frame | the MP4 | white border card, the tool's own captions visible |
