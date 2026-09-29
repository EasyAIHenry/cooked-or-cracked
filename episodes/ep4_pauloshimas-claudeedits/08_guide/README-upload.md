# Let Claude edit your videos (Ep4 guide)

The file for the Drive folder and the ManyChat EDIT link:
- `let-claude-edit-your-videos.pdf`: 9 pages, one file. Cover; how it works and set up once; film one take; the blueprint (12 lines, what you say and what Claude builds, with real frames) on two pages; hand the take to Claude; check and fix; finish and post (receipts, who it is for, the dated caveat); the prompt pack in order.

Source: `let-claude-edit-your-videos.html` plus `style.css`, `v2.css`, `guide.css`, `ep4.css` and `img/`. Rebuild with `./make-pdf.sh` (headless Chrome, keeps the links). `tiles/sheet.png` shows every page at 40 dpi for an overflow check; each section must stay one A4 page.

Where the pictures come from:
- `img/stills/b01-b12.jpg`: frames of the HyperFrames render (`~/coc-ep4-test/videos/part2/final/render_v4_raw.mp4`) at the moment each line is said.
- `img/stills/shot.jpg`, `plate.jpg`: the graded take and the painted empty room.
- `img/ba/`: the same frame before (HyperFrames' HDR conversion) and after the gamut fix.
- `img/final/f1-f4.jpg`: frames of `05_cuts/UPLOAD-THIS-ep4-v5.mp4`.
- `img/screens/studio.jpg`: HyperFrames Studio (`npx hyperframes preview`) at 0:10 of the edit, captured with Puppeteer at 2x.

Numbers come from `05_cuts/part2-hyperframes-notes.md` (clock, fix rounds, renders), `06_research/install-timing.md` (doctor, first render) and `05_cuts/ep4-chatcut-assembly-notes.md` (colour fix, sound).

Do not upload to Drive until Henry clears the final draft. Then switch the folder to Viewer before sharing.
