# Start here

This repo is the operating manual for **Cooked or Cracked**, Henry Chua's creator-review reel series: a creator claims an AI tool does X, Henry tests it with the timer on screen, and gives a verdict.

It is public so you can follow the process. The style and the rules are Henry's; only he changes this repo. Read, clone, install, cut with it. Do not open pull requests.

## Read in this order
1. `sop/00-overview.md` and the other seven SOP files. Ten minutes.
2. `skills/cooked-or-cracked/references/learning-log.md`, newest entry first. What each episode's numbers taught.
3. `skills/henry-scrapbook-reel/SKILL.md`, including the gotchas at the bottom. The edit template.
4. `students/` for the editor's guide: what the series is, how the edit is built (Claude Code or Codex driving ChatCut Desktop; Higgsfield for the visuals inside a test), the three cuts every editor has to learn, the passes and the export.

## The style, as code
`skills/henry-scrapbook-reel/references/mg/` holds every template graphic as ChatCut motion-graphic JSX (paper stamp, scoreboard, sting title, confetti, pill, window frame, and the Ep2 supers). `references/shaders/` holds the skin-smoothing shader. `references/export-scripts/` holds the composite script. `references/` also has the sting and the two sound cues.

## Use it with an agent
Copy the four folders in `skills/` into your agent's skills directory (`~/.claude/skills/` for Claude Code; Codex reads the same `SKILL.md` files). Scan them first: `skillspector scan --no-llm skills/`. Connect ChatCut Desktop to the agent, then follow `sop/06-edit.md`.

## What is not here
Footage, cuts and audio over 1 MB stay in per-episode Drive folders. Accounts (ChatCut, Higgsfield, Gemini, Apify) are your own.
