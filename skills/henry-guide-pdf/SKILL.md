---
name: henry-guide-pdf
description: Henry's designed PDF guide / lead-magnet format (Cooked or Cracked companion look). Use when Henry asks for a guide, a how-to, a comparison table or any downloadable document for his audience. Trigger phrases - "make a guide", "lead magnet", "comparison PDF", "/henry-guide-pdf".
---

# Henry's guide format (confirmed 25 Sep 2026)

**Look:** warm paper `#FFFEFA`, ink `#171411`, coral `#DF825F`, gold `#F2C14E` on the dark cover. Fraunces 900 headlines with one italic word, Kalam hand labels ("before you start"), Inter body. Torn-paper cards, numbered coral badges, hard drop shadows, big Fraunces numbers for prices. Dark cover page with a torn "receipt" card. Signature at the end: `Henry Chua` + coral full stop.

**Voice (non-negotiable, updated 27 Sep 2026):** inclusive and reader-first. Talk to the reader ("you", "we"), write the steps as things the reader does, and keep "I" out of the copy except the byline and signature. No "prompts I typed", "what it cost me" or "I ran all five". Receipts, not hype. Cut numbers that mean nothing to a reader, like raw credit counts; give costs in money. Frame the guide around what the tools do for the reader, with the build as one example case study ("swap in any business"). Use icons (Solar via Iconify, saved locally in img/icons) on step headers, tiles and the prompt pack. Prompt pack: step name and icon on the left, prompt on the right, no clutter. UK English. No em dashes. No "it's not X, it's Y". No exclamation marks. Every claim links to its source page. Always include a "who this is for, and who it is not for" section and a dated caveat in the exact house wording (see example-guide.html, last page).

**Build:** copy `template/style.css`, write the HTML as A4 `<section class="page">` blocks (one topic per page, never let a page overflow; screenshots are capped at 92mm and cropped from the top), annotate screenshots with `.mark` circles and `.label` coral tags, then run `make-pdf.sh` (headless Chrome print-to-pdf keeps hyperlinks). Check with `pdftoppm -r 40 -png` and tile the pages before sending.

**Screenshots:** headless Chrome `--screenshot --window-size=1280,900` works for public pages. Login-gated pages show the sign-in modal; ask Henry to capture logged-in views himself and blur keys and balances. Never log into his accounts.

**Package:** put PDFs + HTML + `style.css` + `make-pdf.sh` + `screens/` + a `README-upload.md` in a numbered folder inside the episode's Drive folder. He uploads the PDFs view-only to Google Drive himself.
- Cover rule: never leave the cover half empty. Below the title put a 'what is inside' torn contents card (left) and three torn number stamps (right), receipt bottom right. Kicker pill is just 'Cooked or Cracked' (or the series name), never 'Episode N companion'. Leave 26-34px between card rows and any table.
