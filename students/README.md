# students/ — the editor's guide to Cooked or Cracked

`editor-guide.html` is the source of the 24-page A4 guide Henry hands to editors who cut the series. It explains what the series is, where every file in this repo lives, how the edit is built (Claude Code driving ChatCut Desktop, Higgsfield for the visuals inside a test), the three cuts every editor has to learn (the hook reaction, the test, the opinion), the eight passes, the export recipe, the writing rules and Henry's standing notes.

Build the PDF: `./make-pdf.sh` (headless Chrome, keeps the links, tiles the pages into `tiles/` for a check). The PDF itself is not committed; Henry shares it from Drive.

## The one rule, for students
This repo is Henry's. It holds his style, and every number in it is a decision he made from the episode insights.

- You may clone it, pull it, read it, copy the four skills into your own `~/.claude/skills/` (scan them first with `skillspector scan --no-llm`), and run the scripts.
- You may not push, open pull requests, edit any file, change a colour, font, timing or sound in a skill, present the style as your own, add keys or footage, or post an episode.
- To suggest a change: send Henry the frame, the timestamp and the reason. He decides, edits the skill, runs `sync.sh`, and you pull. A rule is real when it is in the learning log or a `SKILL.md`.

## Read in this order
1. `sop/00-overview.md` and the other seven SOP files (10 minutes).
2. `skills/cooked-or-cracked/references/learning-log.md`, newest entry first, before every episode.
3. `skills/henry-scrapbook-reel/SKILL.md`, including the gotchas at the bottom, before pass 1.
4. The episode folder: script, pointers, de-myth sheet, audit report, delivery reviews.
5. This guide, for the why behind each of those.

Frames in `img/frames/` are from the Ep1 v8 cut (25 Sep 2026) and the Ep2 FINAL2 cut (27 Sep 2026). Icons are Solar (via Iconify), copied from the Ep2 guide.
