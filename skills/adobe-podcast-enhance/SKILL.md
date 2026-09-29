---
name: adobe-podcast-enhance
description: Clean up a spoken-voice recording with Adobe Podcast Enhance (podcast.adobe.com/en/enhance) through Claude in Chrome, then put the cleaned voice back on the video in sync. Prep the voice as a small mono MP3, upload it, wait for Enhance, download with Henry's OK, check it lines up to the millisecond, and swap it in (ChatCut track for cut edits, ffmpeg remux for uncut takes) with a light presence EQ. Use when Henry says "adobe podcast", "enhance my voice", "clean up the sound", "my voice sounds muffled", "run it through adobe", or "/adobe-podcast-enhance".
allowed-tools: Bash, Read, Write, mcp__claude-in-chrome__*, mcp__chatcut_desktop__*
---

# Adobe Podcast Enhance

Removes room noise, echo and the boxy sound of a mic clipped inside a shirt. Proven on Cooked or Cracked Ep3 (29 Sep 2026): background noise between lines went from -52 dB to -77 dB, and in two blind Gemini tests the Adobe voice with the presence lift below beat both the raw voice and ChatCut's own voice isolation.

## 1. Prep (1 minute)
```
~/.claude/skills/adobe-podcast-enhance/scripts/prep.sh <take.MP4>
```
It writes `adobe-enhance/<take>-voice.mp3` next to the take: mono, 48 kHz, bitrate picked to land near 9 MB, because the browser upload takes 10 MB per call. Always send the whole take, never the cut, so every timestamp in the result matches the original. A 7 minute take is about 8.5 MB at 160 kbps. For takes over about 20 minutes, split at a silence into parts and run each part separately.

## 2. Upload and enhance (about 2 minutes per 7 minutes of audio)
Claude in Chrome, Henry's own browser, where he is signed in to Adobe:
1. `navigate` to https://podcast.adobe.com/en/enhance.
2. `find` "file input (input type=file) for Enhance uploads". The "Choose files" button is itself the file input, so no workaround is needed.
3. `file_upload` the MP3 to that ref.
4. Wait until the row stops saying "Enhancing speech..." and shows the duration. Poll with screenshots every 30 seconds.
5. Click the file's row to select it. Leave the defaults (Enhance v2, speech 50, music 10, background 10) unless Henry names a strength. For a mic inside a shirt, 60 to 70 speech is worth offering, but only if he asks.

## 3. Download (ask first)
Downloading needs Henry's yes in chat every time. Tell him the file name, the source (podcast.adobe.com) and the size first. On a yes, click Download. The free tier returns a 64 kbps mono MP3 named `<name>-esv2-50p-bg-10p-music-10p.mp3` in ~/Downloads. Premium can give WAV, so say so if he wants a better master. Move the file next to the prep MP3 and close the tab.

## 4. Check it lines up
```
python3 ~/.claude/skills/adobe-podcast-enhance/scripts/align_check.py <take.MP4> <enhanced.mp3> --wav <enhanced.wav>
```
It must print ALIGNED, with offsets of 0 plus or minus 1 ms. It also prints the speech level and the noise floor before and after; give Henry those two numbers. If it is not aligned, stop and report it.

## 5. Put it back
**Cut edit in ChatCut:** push the WAV and create an audio track named "VOICE — Adobe Enhanced". Add one audio item per speech item on V1, with the same startFrame, sourceIn and durationFrames. Mute the V1 speech items (muted:true, which becomes -60 dB). Muted opener and hold shots stay as they are. Export, then run the edit's composite with the light chain below in place of any heavy voice EQ or denoise. The worked example is Ep3 `05_cuts/composite-ep3-v8.sh`.

**Uncut take or any single video:**
```
~/.claude/skills/adobe-podcast-enhance/scripts/swap_audio.sh <take.MP4> <enhanced.mp3> <out.mp4>
```
This copies the picture, replaces the audio, applies the light chain and loudness, and prints the levels.

**The light chain** (Adobe's raw output reads a little dark and muffled; this fixes it):
`highpass 80 Hz, -2 dB at 250 Hz, +3.5 dB at 3.2 kHz, +3 dB high shelf at 5 kHz, 2:1 compression, limiter, two-pass loudnorm -14 LUFS, true peak -2 dB`.
Do not add denoise or voice isolation on top; Adobe already did that, and stacking them makes the voice sound robotic.

## 6. Verify before handing over
- Cut edits: cross-correlate every speech item of the export against the enhanced WAV. A uniform offset of a few ms is encoder delay; any single item off by more is a real problem.
- Levels: voice and any inserted clips within 2 dB of each other, peaks under -1 dB after AAC.
- Optional blind check: send two or three loudness-matched 12 second versions to Gemini inline (`types.Part.from_bytes`, not a file upload; file uploads sometimes come back as "no audio attached") and ask for clarity, muffle, naturalness and artefacts scores.

## Rules
- Always ask before the Download click. The upload itself is part of the request, so no extra ask is needed for it.
- Never put Henry's series files in the synced Google Drive on this Mac (`GoogleDrive-henry@tristeps.co`). That is his work account.
- Keep the prep MP3, the Adobe MP3 and the WAV together in `04_raw-footage/adobe-enhance/` (or `adobe-enhance/` next to the source). Adobe deletes its copy after 10 days.
