# A Vox-style explainer in 30 minutes (Ep5 guide)

The one file for the Drive folder and the ManyChat AMELIA link: `vox-explainer-in-30-minutes.pdf`, 3 pages.
1. Cover: what is inside, the three stamps (30 minutes, 6 clips, US$14), what you need.
2. How it works, set up once in six numbered steps (two accounts, the skill from @mr.pynk's reel via Notion, open the folder in the Code tab, "let's make a video", the Higgsfield connector with a balance check, the spending rule), steps 1 to 3: the ask (reply diorama in the settings table), the one image that locks the look (archive / lagoon / radio), six clips at 720p and what they cost.
3. Steps 4 and 5: the narrator (edge-tts, say samples, line one quoted), Claude cuts it (say done, final.mp4 is 720x1280); the six scenes; "if this happens" (preset, 429, short lines, quiet output to -16 LUFS, text in clips, 1080p about US$10 more); who it is for; the 30-second version at about US$8; the house numbers caveat; signature.

Source: `vox-explainer-in-30-minutes.html` + `style.css`, `v2.css`, `guide.css` (Ep3), `ep5.css`, `img/`. Rebuild with `./make-pdf.sh` (headless Chrome, keeps the links). `tiles/` holds the pages at 60 dpi for the overflow check. Each section must stay one A4 page; `_measure.html` plus headless Chrome `--dump-dom` prints each page's height and footer position when the tiles show a spill. Review rounds: round 1 (beginner, fact-checker, editor) and round 2 (beginner teach-back, verifier) on 1 October 2026; reports in the session transcript.

Pictures: `img/stills/f*.jpg` are frames of the finished Amelia video (`projects/amelia-earhart/final.mp4`); `img/stills/style-*.jpg` are the three style-key renders from `02_graphics/icons/`; icons are Solar (Iconify) copied from the Ep3 and Ep4 guides.

Numbers: `06_research/mrpynk-audit-report.md` (424 credits = 420 + two style images, 22:50 to 23:30 on the night, 70/120 credits per clip), script 116 words, `projects/amelia-earhart/pack.md` (script, styles, Seedance settings). Dollar figures at the Plus plan on higgsfield.ai/pricing (1 Oct 2026): US$39 a month paid yearly, US$1 = 26 credits, so about 1,000 credits; 420 credits = US$16, 720 = US$28, 210 = US$8; monthly US$49 gives about US$21. Henry's account is on the older Ultimate plan (1,200 credits for US$39), where the test cost US$13.65; that figure stays in the receipts only. Check the Ep3 guide, which quotes Ultimate at 1,200 credits.

Upload: Henry's personal Gmail Drive, AI Lessons Online > 1 October 2026 > A Vox-style explainer in 30 minutes, "anyone with the link can view", then paste the PDF link into `01_scripts/ig-captions-ep5.md` (ManyChat table, LINK). Never the work Drive synced on this Mac.
