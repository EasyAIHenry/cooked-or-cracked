# Let Claude edit your videos (Ep4 guide)

The one file for the Drive folder and the ManyChat EDIT link:
- `let-claude-edit-your-videos.pdf`, 10 pages:
  1. Cover.
  2. How it works, two ways to ask for an effect, and who it is for.
  3. Set up once: the Code tab steps, Mac Homebrew, Windows prompts, and the doctor check read line by line.
  4-5. The blueprint: 12 lines, each with the line to say, what you get, what it needs, and a real frame.
  6. Film one take: HDR off on iPhone, Samsung and Pixel; the empty room; moving the file to the computer.
  7. Hand the take to Claude: ears and eyes, cut, plan, build, and the Studio screenshot.
  8. Check and fix: six problems, each with a paste-ready fix.
  9. Finish and post: Claude's last check, loudness, getting the file to the phone, receipts, the dated caveat and the signature.
  10. Prompt pack: 8 prompts, one copyable box each.

Source: `let-claude-edit-your-videos.html` plus `style.css`, `v2.css`, `guide.css`, `ep4.css` and `img/`. Rebuild with `./make-pdf.sh` (headless Chrome, keeps the links). `tiles/sheet.png` shows every page at 40 dpi for an overflow check. Each section must stay one A4 page. `v1-` and `v2-` HTML files are the earlier drafts.

Where the pictures come from:
- `img/stills/b01-b12.jpg`: frames of the HyperFrames render (`~/coc-ep4-test/videos/part2/final/render_v4_raw.mp4`) as each line is said.
- `img/stills/shot.jpg`, `plate.jpg`: the graded take and the painted empty room.
- `img/ba/`: the same frame before (HyperFrames' HDR conversion) and after the gamut fix.
- `img/screens/studio.jpg`: HyperFrames Studio (`npx hyperframes preview`) at 0:10, captured with Puppeteer at 2x.
- `img/screens/selfcheck.jpg`: the render, 2 frames a second, tiled.

Numbers come from `05_cuts/part2-hyperframes-notes.md` (clock, fix rounds, renders), `06_research/install-timing.md` (doctor) and `05_cuts/ep4-chatcut-assembly-notes.md` (colour, sound).

## Review rounds (29 Sep 2026)
- **Round 1.** A Mac beginner (5/10), a Windows beginner (5/10), a working editor and a fact-checker read it cold. The fixes:
  - Moved the blueprint before filming.
  - Set-up now uses the exact Code tab steps.
  - HyperFrames skills now install with `npx hyperframes skills update`, not `npx skills add --all`, which installs into the current folder only.
  - The app restart now follows the docs, and the doctor output is shown honestly.
  - Added how to move the file to the computer and back, a "type it afterwards" route for asking for effects, and honest wording on Gemini, LUFS and safe zones.
  - Page 9 now covers finishing and posting instead of the ChatCut template.
- **Round 2.** A fresh Mac beginner (6/10), a Windows beginner (6/10) and a verifier (every round-1 fix confirmed, facts checked live). The fixes:
  - Homebrew became a numbered Mac step, with the Next steps lines.
  - Manual mode for set-up and Auto for the edit.
  - The app now quits fully, including from the Windows tray.
  - OneDrive, the Samsung Allow prompt and the Android HDR menu paths are covered.
  - Plan now comes after the cut, and it saves beat-sheet.md.
  - Blueprint dependencies are marked, and prompt 5 has a filled-in example.
  - The prompt pack is single-column so copy-paste stays clean (checked with pdftotext).
- **Round 3.** A fresh Mac beginner and a Windows + Samsung beginner, as a final teach-back.

## Status (29 Sep 2026)
Henry uploaded the PDF himself to his personal Gmail Drive: AI Lessons Online > 29 September 2026 > Let Claude Edit Your Video. Checked 29 Sep: the folder and the file are both "anyone with the link can view", and the file link opens without signing in.
- File (use this in ManyChat): https://drive.google.com/file/d/1iJy3tgVFWDq5nH8lTBVJ3GmEP-mYrA-d/view?usp=sharing
- Folder: https://drive.google.com/drive/folders/1Xvmhj_7xgLtGBzhYToBLKYONevw9e3ho
To update the guide later, use Manage versions in Drive (keeps the same link) instead of uploading a new file.
