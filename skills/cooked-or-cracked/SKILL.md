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
Voice cleanup runs through the `adobe-podcast-enhance` skill (steps below). Load `henry-scrapbook-reel` and build to its current format (`references/format-ep3-v7.md`, approved 29 Sep 2026). After the speech cut, run `scripts/join_audit.py` and fix every flagged join (transcript word times drift), then do one unprimed verbatim listen of the render; see the Ep2 pass 1 entry in the learning log. Sentence breaks about 0.3 s. Build the new MG assets first from the supers list. Deliver `05_cuts/UPLOAD-THIS-ep<N>-v<x>.mp4`.

**Voice cleanup with Adobe Podcast Enhance (every episode, after the cut is locked):**
1. Make the whole take's voice a mono MP3 under 10 MB so it can go through the browser upload: `ffmpeg -i <take>.MP4 -vn -ac 1 -ar 48000 -c:a libmp3lame -b:a 160k 04_raw-footage/adobe-enhance/<take>-voice.mp3` (a 7 min take is about 8.5 MB). Use the full take, not the cut, so every timestamp stays the same.
2. Claude in Chrome: open podcast.adobe.com/en/enhance (Henry is signed in), `find` the "Choose files" file input, `file_upload` the MP3. Wait for "Enhancing speech" to finish (about 2 min for 7 min). Defaults: Enhance v2, speech 50, music 10, background 10.
3. Ask Henry before clicking Download (the rules require it), then move the MP3 from ~/Downloads into `04_raw-footage/adobe-enhance/` and convert to WAV. Free tier returns 64 kbps mono MP3; the timing matches the take to the millisecond (check by cross-correlation at 3 or 4 points).
4. In ChatCut: push the WAV, create an audio track "VOICE — Adobe Enhanced", add one audio item per V1 speech item with the same startFrame, sourceIn and durationFrames, and mute the V1 speech items (they go to -60 dB).
5. Composite with the light chain in Ep3 `05_cuts/composite-ep3-v8.sh`: the grade, then highpass 80, -2 dB at 250 Hz, +3.5 dB at 3.2 kHz, +3 dB shelf at 5 kHz, 2:1 compression, limiter, two-pass loudnorm -14 LUFS with true peak -2 dB. Result clips about -6 dB inside their windows. Adobe's raw output reads a little muffled; the presence lift is what fixed it (Gemini blind test, twice).

**Deliver to Henry's phone (every final cut):**
- Send a phone copy in chat with SendUserFile: Remote Control only takes files under 30 MB, so two-pass encode at about 2.3 Mbps video + 192k audio (a 90 s reel is about 28 MB). Retry once if the upload errors. Henry saves it from the chat (Share, Save Video) and posts from his phone. This quality is fine for Reels.
- Never put Cooked or Cracked files in the synced Google Drive on this Mac (`GoogleDrive-henry@tristeps.co`): that is Henry's work account. The series lives on his personal Gmail Drive, reached only through Claude in Chrome.

### 7. Captions and guide (20 min)
- `01_scripts/ig-captions-ep<N>.md`: three captions, first line under 90 characters, keyword gate, hashtags, posting hour, pinned comment with the test date.
- Lead magnet with `henry-guide-pdf` into `08_guide/`: a 3 page guide plus a 2 page worksheet at most (Ep3 is the model: steps with receipts, a picture storyboard, the prompt pack). Run two fresh-reader review rounds, then upload to the Drive folder Henry names via Claude in Chrome (see `henry-guide-pdf` for the file-input method). Switch the folder to Viewer before he shares it.

### 8. Retro (after 48 h of insights)
Henry sends screenshots of Reel insights. Write `06_research/ep<N>-insights-retro.md`: the numbers table, what they mean, what changes next episode, numbers to beat. Then append a dated entry to `references/learning-log.md` and update this SKILL.md if a rule changed. Update the GitHub repo with `sync.sh` (see `references/github.md`).

## Verdict format
Score /10. COOKED or CRACKED. Per tool or claim: works, meh, cooked. One line of receipt each (time, money, or what the screen showed). One thing to steal from the creator.

## Related skills
`creator-audit` (step 2), `henry-scrapbook-reel` (step 6), `henry-guide-pdf` (step 7), lead scout in `Content Creation/lead-scout/` (step 1).
