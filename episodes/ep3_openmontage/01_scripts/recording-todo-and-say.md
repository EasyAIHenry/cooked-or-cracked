# Ep3 recording brief: OpenMontage, one prompt to a YouTube video

## Pre-flight (5 min)
- Learned on the 28 Sep groundwork run (see `06_research/test-timeline.txt`):
  - Run `claude login` first. The CLI was logged out and the headless run died in 2 s.
  - Enable Cloud Text-to-Speech on the Google project (console link in the de-myth sheet) or the voice falls back to Piper. Decide which you want on camera; Piper is the free path the README promises.
  - Groundwork took 45 min from prompt to MP4 with 12 gates self-approved. Answering gates by hand adds your reading time. Budget 60 min on the clock.
  - The sandbox folder `~/coc-ep3-test/OpenMontage` already has `.env` and a finished project. For a clean take, `rm -rf projects/faceless-builder-ep1` or clone fresh.
- Terminal font 18 pt, dark theme, window on the right half. Claude Code in `~/coc-ep3-test/OpenMontage`.
- Timer app top left, started at 0:00 when `make setup` is typed.
- Screen recording: `screencapture -v "~/Content Creation/DRIVE_Cooked-or-Cracked_Ep3_OpenMontage/04_raw-footage/ep3-screen-$(date +%H%M).mov"` in a second terminal, Ctrl-C to stop. Or QuickTime, whole screen.
- Backlot board ready in a browser tab: `python -m backlot open` after setup.
- `.env` filled before recording. Never show a key on screen.
- The prompt copied to the clipboard (from `06_research/de-myth-sheet.md`).

## Segments

### 1. Install (0:00 to 0:10)
Do: `make setup`, then `make preflight`.
Say: "One command. Timer on." Then, when preflight prints: "[N] tools found, [M] need keys."

### 2. The prompt (0:10 to 0:12)
Do: `claude` in the repo folder, paste the prompt, enter.
Say: "Same prompt he used, plus my criteria. Research first, then build episode one."

### 3. Research stage (0:12 to 0:20)
Do: let it search. Keep the terminal visible. Open one URL it cites.
Say: "[N] searches. Real channels or made up." Say the first channel name it finds when it is on screen.

### 4. Proposal gate (0:20 to 0:25)
Do: read the three concepts and the cost line. Pick one. Open Backlot.
Say: "It stops here and asks. First ask." Read the cost number when it is on screen.

### 5. Script and scene plan (0:25 to 0:35)
Do: approve or send back once. Show the script file.
Say: "Hook line is [read it]." Then: "Second ask. Third ask." Count them out loud.

### 6. Assets (0:35 to 0:45)
Do: watch the contact sheet in Backlot. Note provider and price per asset.
Say: "[Provider], [price] per clip." Only when the number is on screen.

### 7. Render and play (0:45 to 0:55)
Do: `ffprobe final.mp4`, play it full screen, `/cost` in Claude Code.
Say: "[Length], [resolution], captions [yes/no]. [Dollars] in providers, [dollars] in tokens, [minutes] on the clock."

### 8. Verdict take (after the test, face to camera, separate recording)
Say: score, cooked or cracked, one receipt per claim, one thing to steal from him, keyword.
