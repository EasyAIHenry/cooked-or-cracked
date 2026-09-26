---
name: cooked-or-cracked
description: Henry's creator-review reel series ("Cooked or Cracked", the content creator analysis series). One skill for the whole episode: pick a subject, audit the reel, de-myth the claim in 1 hour, write the script and the screen-recording brief, edit in the scrapbook template with new supers per episode, write captions and the lead magnet, post, then log the Instagram insights so the next episode gets better. Use when Henry says "new episode", "cooked or cracked", "review this creator", "de-myth this reel", "content creator analysis", or "/cooked-or-cracked".
allowed-tools: Bash, Read, Write, Edit, WebFetch, mcp__Apify__call-actor, mcp__Apify__get-dataset-items, mcp__chatcut_desktop__*
---

# Cooked or Cracked (series skill)

Henry takes a creator's claim about an AI tool, tests it himself with the timer on screen, and gives a verdict. The audience is men 18 to 34 in India, the US and Southeast Asia who build things, watching from the Reels tab. They are not followers yet. Write for them.

Read `references/writing-rules.md` before writing a single line. Read `references/learning-log.md` before planning, and add to it after every episode. That log is how this skill improves.

## Time budget per episode (Henry's target)
De-myth 1 h. Screen recording 30 min. Talking head 10 min. Edit 1 h. Guide 20 min. Do not plan work that breaks this without saying so.

## Pipeline

### 1. Subject (10 min)
- Read the newest `Content Creation/lead-scout/runs/<date>/report.md` or take the reel Henry sends.
- Good subject: a specific, testable claim about a tool ("5 free tools", "costs cents", "does X in 30 s"). Skip opinion reels and news.
- Create `Content Creation/DRIVE_Cooked-or-Cracked_Ep<N>_<Creator>-<Topic>/` with the numbered folders from `references/episode-template/README.md`.

### 2. Audit (10 min, automated)
- Run the `creator-audit` skill: Apify metadata + baseline (12 posts) + Gemini watching the video. Save `06_research/<creator>-audit-report.md` and the reel in `03_reference/`.
- Pull out: the exact claim in the creator's words, every tool or number named, the CTA keyword, the multiple over their median.

### 3. De-myth sheet (20 min of research, then Henry's 1 h of testing)
Write `06_research/de-myth-sheet.md` (template in `references/episode-template/de-myth-sheet.md`):
- Each claim as a table row: what he says, what it actually is (verified from the source repo or site, with the date), install or access line, cost.
- "What works means": pass and fail written down before the test.
- A timed plan that fits 1 hour, with the exact prompt Henry will type, the same prompt for every variant.
- Likely gotchas from the docs, flagged as untested.
Never write the verdict before the test. Leave [brackets].

### 4. Recording brief (10 min)
Write `01_scripts/recording-todo-and-say.md`: pre-flight checklist, then segments with "Do" (commands, exact prompt) and "Say" (one or two short lines). Henry narrates live while the screen shows the thing. Say the number when it is on screen.

### 5. Script (15 min)
Write `01_scripts/script-ep<N>.md`: a scorecard to fill after the test, then a beat sheet (time, say, screen, super). Rules:
- First spoken line at 0:00. The subject's reel plays muted in the low-left window under it. No silent hold before the first claim.
- The sting overlaps the first graphic at 0:03, it never gets its own 2 s.
- Verdict at 45 to 55% of runtime. The end is the CTA and the save frame.
- One save frame: the scorecard, held 2 s, "screenshot this".
- Comment gate with Henry's own keyword, said once at the midpoint and once at the end.
- 60 to 75 s total unless Henry says otherwise.
- A real-life beat after the demo and before the price: who can use this and how. Henry called the Ep2 cut rushed until it had one.
- New supers per episode: keep the template (pill, sting title, scoreboard, paper stamps, table, confetti, captions) and design 3 to 6 new supers that match what Henry will say. List them with props, as in `references/supers-library.md`, and add them to that library after the edit.

### 6. Edit (1 h target)
Load `henry-scrapbook-reel` and run its passes in order. After the speech cut, run `scripts/join_audit.py` and fix every flagged join (transcript word times drift), then do one unprimed verbatim listen of the render; see the Ep2 pass 1 entry in the learning log. Sentence breaks about 0.3 s. Build the new MG assets first from the supers list. Export by the v8 rule (single export + captions band). Deliver `05_cuts/UPLOAD-THIS-ep<N>-v<x>.mp4`.

### 7. Captions and guide (20 min)
- `01_scripts/ig-captions-ep<N>.md`: three captions, first line under 90 characters, keyword gate, hashtags, posting hour, pinned comment with the test date.
- Lead magnet with `henry-guide-pdf` into `08_guide/`: one page is enough (install order, the prompt, the scorecard). Henry uploads to Drive himself.

### 8. Retro (after 48 h of insights)
Henry sends screenshots of Reel insights. Write `06_research/ep<N>-insights-retro.md`: the numbers table, what they mean, what changes next episode, numbers to beat. Then append a dated entry to `references/learning-log.md` and update this SKILL.md if a rule changed. Update the GitHub repo with `sync.sh` (see `references/github.md`).

## Verdict format
Score /10. COOKED or CRACKED. Per tool or claim: works, meh, cooked. One line of receipt each (time, money, or what the screen showed). One thing to steal from the creator.

## Related skills
`creator-audit` (step 2), `henry-scrapbook-reel` (step 6), `henry-guide-pdf` (step 7), lead scout in `Content Creation/lead-scout/` (step 1).
