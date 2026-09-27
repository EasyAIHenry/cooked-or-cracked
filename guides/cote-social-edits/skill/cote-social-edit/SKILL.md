---
name: cote-social-edit
description: Tristeps' monthly COTE Singapore social-video edit in ChatCut Desktop. Brief-led footage selection (clip log, cut list tied to brief lines), COTE brand layer (new red-on-black logo end card, SangBleu Sans subtitles, baked ARRI Neutral LUT, no grading in ChatCut), three music options, QC, local export, Frame.io filing. Use when Dennis or Henry says "edit COTE batch", "COTE reel", "COTE social edit", "cut the COTE videos", or "/cote-social-edit".
---

# COTE social edit

Edit a batch of COTE Singapore vertical social videos in ChatCut Desktop from a written brief. One pass per request, one job per pass. Show the cut list or preview frames and wait for "apply" before changing any timeline.

## When to use

- A new monthly COTE batch needs editing from selects on the local Mac.
- A COTE video is back from Frame.io with client comments.
- Someone asks for a clip log or cut list for COTE footage.

Not for: Henry's own reels (use `henry-scrapbook-reel`), other clients, or grading work.

## Inputs to look for

Before pass 1, confirm each exists and say which are missing:

1. `~/Tristeps/COTE/00_brand/BRAND.md`: logo, type, colour, footage, motion, music, do-not list, specs. It overrides anything in this skill.
2. `~/Tristeps/COTE/01_batches/<batch>/01_brief-and-cutlists/BRIEF.md`: one block per video.
3. `~/Tristeps/COTE/01_batches/<batch>/04_selects/graded/`: LUT-baked selects, imported into ChatCut as the Bin "graded".
4. ChatCut Bins "07_audio" (music options) and "logo".
5. Design Style "COTE Singapore" applied to the project, and the ChatCut Skill "COTE social edit" attached from video two onwards.
6. `00_brand/reference/`: 3 to 5 approved past videos.

If the brief is missing or a video block has empty must-show or length fields, stop and ask. Do not guess a brief.

## Workflow

Start every request by confirming the active ChatCut project is `CSG_<batch>`.

0. **Setup:** project 1080x1920 at 30 fps. List Bins and file counts, flag files still processing, confirm the Design Style. Read BRAND.md and BRIEF.md and list the videos.
1. **Clip log:** sample every clip in "graded" at least every 2 s and at each shot change; read transcripts. Write `clip-log.md`: file, in, out, what is in frame, food close-up yes/no, pillar, brand fit 1 to 5, notes. Unflattering process shots score 1 or 2. Touch no timeline.
2. **Cut list (per video):** sample the brief's reference video for average shot length and opening shot. Propose position, file, in, out, duration, brief line served, transition. Write `cutlist-<NN>-v<round>.md`. Show a contact sheet of in points. Wait for "apply".
3. **Assembly:** new timeline `CSG_<YYYY>_<MM>_REEL_<Title>`, exactly the approved list. Cuts or short dissolves only. Natural sound at 0 dB. No music, text, colour, effects or speed changes. Report 8 preview frames and the total duration.
4. **Brand layer:** logo end card from Bin "logo"; only the on-screen text the brief lists, in SangBleu Sans at one size; subtitles only for speech. Stay inside the safe zones. Show three preview frames first and wait for "apply".
5. **Music:** propose three tracks from "07_audio" with reasons; after "apply", place them on MUSIC A, B, C and export a 15 s sample of each to `05_cuts/music-samples/`. Leave the picture edit untouched.
6. **QC:** run every item in Checks and answer pass or fail with a reason. Show 8 evenly spaced preview frames. Remind the operator to listen once at full volume.
7. **Export:** local, 1080x1920, 30 fps, H.264 MP4, to `05_cuts/CSG_<YYYY>_<MM>_REEL_<Title>_v01.mp4`. Probe the exported file for duration, resolution, frame rate and non-silent audio.
8. **File:** the operator uploads to Frame.io. Append a line to `06_feedback/log.md`.

**Feedback round:** turn pasted Frame.io comments into a numbered change list (timecode, change, method, what stays). Flag comments that conflict with BRAND.md. Apply only after "apply". Export the next `_v0N` and log it.

**Stop request:** when told "stop", make no further changes, undo nothing, show the current timeline as a cut list and every change since the last "apply", then wait.

## Rules

1. Cut first, everything else second.
2. One job per request. Never add music, graphics or colour in the same pass as a cut.
3. State where each change goes and what must not change.
4. Show the cut list or a preview frame before applying anything. Wait for the word "apply".
5. Keep everything as editable timeline items. No flattening, no baked-in text.
6. Fix brand names in the transcript before any cut that relies on speech.
7. Do no colour work in ChatCut. The LUT is baked into the selects.
8. Use only the new logo. Use only SangBleu Sans or the fallback recorded in BRAND.md.
9. Add no effect, graphic, sticker or text the brief does not list. Never rebuild the After Effects fire text or box animation; ask for a render.
10. Never cut through a word. Transcript word timings drift, so place cuts in pauses.
11. After any AI edit, check affected clips for -60 dB volume and restore 0 dB.
12. After moving or resizing a motion graphic, re-check its text properties.
13. Judge the exported file, not the preview.
14. If you are unsure whether a shot fits the brief, list it as a question. Do not include it silently.

## Checks

- [ ] New logo (COTE SINGAPORE, red on black) on the end card, correct colour
- [ ] Subtitle font and size consistent; no spelling errors; COTE and Hanwoo exact
- [ ] Colour matches the baked LUT look; not warm or orange; not over-saturated
- [ ] Food close-ups carry the video
- [ ] Transitions subtle
- [ ] No effect the brief did not ask for
- [ ] Audio levelled; no silent clips; music option noted
- [ ] Length within the brief
- [ ] Safe zones: nothing important in the top ~220 px or bottom ~450 px of 1920, nothing under the right-hand action rail
- [ ] File name `CSG_YYYY_MM_REEL_Title_v0N`, no spaces; `FINAL` only for the approved master

## Learning log

Newest first. After every video or feedback round add one dated line: what went wrong or what the client changed, and the rule it created. Move settled rules into Rules or BRAND.md.

- (no entries yet)
