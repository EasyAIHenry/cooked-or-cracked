# 08_guide, the DESIGN keyword giveaway

1. `design-guide.pdf`, 14 pages A4. Upload view-only to Google Drive and wire the link to the DESIGN keyword. All 17 links checked on 26 Sep 2026 (`python3 check-links.py` re-checks them and counts the link annotations inside the PDF).
2. `web/index.html`, the same guide as a scroll page built on Nate's scrollcraft engine. Serve it, do not open it as a file (the engine loads the clip over http): `python3 -m http.server 5175 --directory web`, then http://localhost:5175. Host it on Vercel or Cloudflare Pages if you want a link instead of a PDF.

Edit wording in `design-guide.html`, then run `./make-pdf.sh`. Screenshots are in `screens/` (numbered in page order). Recapture a site section with `http://localhost:5173/?shot=<section>:<0..1>` and the menu with `http://localhost:5174/?table=4&demo=item|order|done`.
