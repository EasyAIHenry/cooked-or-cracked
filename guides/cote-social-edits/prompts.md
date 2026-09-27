# COTE prompts, pass by pass

Copy a prompt, replace the placeholders, send it. One prompt per pass. Save a Version in ChatCut before each pass. From video two onwards, attach the COTE Skill (book icon) before sending.

Placeholders:

- `<batch>`: batch id, such as `2026-10_batch1`
- `<NN>`: video number from the brief, such as `01`
- `<Title>`: working title from the brief, no spaces, such as `HanwooGrill`
- `<YYYY>` and `<MM>`: year and month of the batch
- `<round>`: cut list round, starting at `1`

Paths used below:

- Batch root: `~/Tristeps/COTE/01_batches/<batch>/`
- Brand file: `~/Tristeps/COTE/00_brand/BRAND.md`

---

## Pass 0: setup

Do these by hand first:

1. In ChatCut Desktop, create a project named `CSG_<batch>`.
2. My Assets → Upload → Folder...: import `04_selects/graded/`, `07_audio/` and `~/Tristeps/COTE/00_brand/logo/`. Each becomes a Bin with the folder's name. Do not import the raw S-Log3 files.
3. Wait until every file has finished uploading, transcoding and transcribing.
4. Apply the Design Style "COTE Singapore". From video two, attach the COTE Skill.

Then send:

```
Use ChatCut. Pass 0, setup check for batch <batch>. Do not add, move or delete anything.
1. Set the project to 1080x1920 at 30 fps if it is not already.
2. List every Bin with the number of files in it and flag any file that has not finished processing.
3. Confirm which Design Style is applied to this project.
4. Read ~/Tristeps/COTE/00_brand/BRAND.md and ~/Tristeps/COTE/01_batches/<batch>/01_brief-and-cutlists/BRIEF.md and reply with the number of videos in the brief and one line per video: number, working title, pillar, length.
```

## Pass 1: clip log

```
Use ChatCut. Pass 1, clip log for batch <batch>. Do not touch any timeline.
Read ~/Tristeps/COTE/00_brand/BRAND.md and ~/Tristeps/COTE/01_batches/<batch>/01_brief-and-cutlists/BRIEF.md.
For every clip in the Bin "graded", sample frames at least every 2 seconds and at every shot change, and read any speech in its transcript.
Write ~/Tristeps/COTE/01_batches/<batch>/01_brief-and-cutlists/clip-log.md as one table, one row per usable moment, with these columns: file, in (s), out (s), what is in frame, food close-up (yes/no), pillar, brand fit 1 to 5, notes (focus, exposure, smoke, mess, hands, faces).
Rate against BRAND.md: food close-ups and cooking detail score high; unflattering process shots score 1 or 2.
When done, show me the 10 highest-rated rows, every row rated 1 or 2 with the reason, and a contact sheet of the 10 highest-rated moments.
```

## Pass 2: cut list for one video

```
Use ChatCut. Pass 2, cut list for video <NN> of batch <batch>. Do not touch any timeline.
Use video <NN> in ~/Tristeps/COTE/01_batches/<batch>/01_brief-and-cutlists/BRIEF.md and the rows in clip-log.md in the same folder.
First sample the reference video named in the brief and tell me its average shot length and what its first shot shows.
Then propose an ordered cut list: position, file, in (s), out (s), duration, the brief line this clip serves, transition (cut or short dissolve).
Rules: open on a food close-up unless the brief says otherwise; include every must-show shot; use nothing from the avoid list; use rows rated 4 or 5 unless you say why; total length within the brief.
Write it to ~/Tristeps/COTE/01_batches/<batch>/01_brief-and-cutlists/cutlist-<NN>-v<round>.md and show me a contact sheet of each clip's in point.
Wait for me to reply "apply" before you change anything.
```

## Pass 3: assembly

```
Use ChatCut. Pass 3, assembly for video <NN> of batch <batch>.
Build a new timeline named CSG_<YYYY>_<MM>_REEL_<Title> from ~/Tristeps/COTE/01_batches/<batch>/01_brief-and-cutlists/cutlist-<NN>-v<round>.md, exactly as approved: same clips, same in and out points, same order.
Straight cuts, or a short dissolve only where the list says. Keep each clip's natural sound at 0 dB.
Do not add music, text, graphics, colour, effects or speed changes. Do not touch any other timeline.
When done, show me 8 evenly spaced preview frames, the total duration, and any clip whose in or out point differs from the list.
```

## Pass 4: brand layer

```
Use ChatCut. Pass 4, brand layer for timeline CSG_<YYYY>_<MM>_REEL_<Title>. Follow ~/Tristeps/COTE/00_brand/BRAND.md and video <NN> in the batch BRIEF.md.
1. End card: the COTE SINGAPORE logo, red on black, from the Bin "logo", for the duration the brief gives, on its own track.
2. On-screen text: only the exact words in the brief's "On-screen text" field, in SangBleu Sans (caption style "COTE subtitles"), one size throughout.
3. Subtitles only if the video has speech, same font and size.
Keep every text item out of the top 220 px and bottom 450 px of the frame and clear of the right-hand action rail.
Do not move, trim or replace any clip. Add no other graphics or effects.
Before applying, show me three preview frames: the first text item, one from the middle, and the end card. Wait for "apply".
```

## Pass 5: music options

```
Use ChatCut. Pass 5, music options for timeline CSG_<YYYY>_<MM>_REEL_<Title>. Do not change the picture edit or the natural sound.
From the Bin "07_audio", place three tracks that fit the brief's music mood, each on its own audio track named MUSIC A, MUSIC B and MUSIC C, starting at frame 0, sitting under the natural sound.
Tell me which three you chose and why before placing them. Wait for "apply".
After I reply "apply", export a 15 s sample for each option (only that music track audible) locally at 1080x1920 MP4 to ~/Tristeps/COTE/01_batches/<batch>/05_cuts/music-samples/ named CSG_<YYYY>_<MM>_REEL_<Title>_musicA_sample.mp4, musicB, musicC.
```

When the client picks one:

```
Use ChatCut. Keep MUSIC <letter> and delete the other two music tracks. Do not change the picture edit.
List any cut that would land on the beat if moved by 6 frames or fewer, with the frame change for each. Wait for "apply".
```

## Pass 6: QC

```
Use ChatCut. Pass 6, QC for timeline CSG_<YYYY>_<MM>_REEL_<Title>. Change nothing.
Check each item and answer pass or fail with a reason:
1. New logo, red on black, on the end card.
2. Text in SangBleu Sans (or the agreed fallback), one size throughout.
3. Every word spelled correctly; COTE and Hanwoo exact.
4. Colour matches the baked LUT look; nothing added in ChatCut; not warm or orange.
5. Food close-ups carry the video.
6. Transitions are cuts or short dissolves.
7. No effect the brief did not ask for.
8. No clip at -60 dB or muted by mistake; music level noted.
9. Length within the brief.
10. Nothing important in the top 220 px, bottom 450 px or under the right-hand action rail.
Show me 8 evenly spaced preview frames.
```

Then listen to the whole video once at full volume yourself.

## Pass 7: export

```
Use ChatCut. Pass 7, export timeline CSG_<YYYY>_<MM>_REEL_<Title>. Change nothing in the edit.
Export locally: 1080x1920, 30 fps, H.264 MP4, to ~/Tristeps/COTE/01_batches/<batch>/05_cuts/CSG_<YYYY>_<MM>_REEL_<Title>_v01.mp4.
Then check the exported file itself, not the preview, and report its duration, resolution, frame rate, and whether audio is present and not silent.
```

## Pass 8: file

Upload the export to the Frame.io V1 folder yourself. Then send:

```
Append one line to ~/Tristeps/COTE/01_batches/<batch>/06_feedback/log.md: today's date, CSG_<YYYY>_<MM>_REEL_<Title>_v01.mp4, Frame.io V1, "first cut", and the music option in use. Change nothing else.
```

---

## Feedback round

```
Use ChatCut. Feedback round <round> on timeline CSG_<YYYY>_<MM>_REEL_<Title>. The client's Frame.io comments, with timecodes:

<paste comments here>

Turn these into a numbered change list: timecode, what changes, how you will do it, and what stays untouched. Flag any comment that conflicts with BRAND.md or the brief.
Make no changes until I reply "apply".
After "apply", show me a preview frame at each changed timecode, then export locally to ~/Tristeps/COTE/01_batches/<batch>/05_cuts/CSG_<YYYY>_<MM>_REEL_<Title>_v0<next>.mp4 and log it in 06_feedback/log.md.
```

## Stop and show me

Use this the moment the agent goes off brief. Do not pile corrections on top.

```
Stop. Make no more changes and do not undo anything yet.
Show me the timeline as it stands now as a cut list (position, file, in, out, duration), list every change you made since my last "apply", and wait for my instruction.
```
