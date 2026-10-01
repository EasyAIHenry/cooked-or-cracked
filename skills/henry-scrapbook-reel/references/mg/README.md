# Motion-graphic assets (the style, as code)

Every template graphic of the Cooked or Cracked look, exported verbatim from the ChatCut projects on 28 September 2026. These are ChatCut motion-graphic assets (Remotion runtime): each file is the JSX body you pass to `create_motion_graphic_from_code`, with the canvas size, duration and property list in the header comment. Reuse the code, change only the props. Never restyle.

Style constants used by all of them: paper `#FFFEFA` with ruled lines, ink `#171411`, accent `#DF825F`, gold `#F2C14E` (confetti only). Fraunces 900 for numbers and words, Kalam 700 for handwritten labels, Inter 800 for the pill. Pop-in with overshoot (0.3 → 1.1 → 1 over ~13 frames), 1 to 3° tilt, orange underline draws over 18 frames, then hold still.

| File | Asset | Canvas | Used for |
|---|---|---|---|
| `pill-caption.jsx` | Pill caption — Cooked or Cracked? | 700x150 | Opener, top centre |
| `window-frame.jsx` | Window frame — white border + shadow (portrait; landscape twin is 640x360) | 640x1107 | Reviewed-reel window and every screen window |
| `jingle-title-compact.jsx` | Jingle title — compact top | 1000x400 | The sting, word by word |
| `paper-stamp-v4.jsx` | Paper stamp — v4 with icon badge | 1000x400 | Every key-word stamp, verdict stamp, comment stamp |
| `scoreboard.jsx` | Scoreboard — Cooked / Cracked checkboxes | 260x230 | Left wall, whole video, tick at the verdict |
| `confetti-burst.jsx` | Confetti burst — paper | 1080x1920 | CRACKED or a declared winner |
| `price-tags.jsx` | Price tags (Ep2) | 1000x380 | Two prices on the spoken words |
| `repo-chips-into-head.jsx` | Repo chips → into head → stamp (Ep2) | 1080x700 | Tool names flying into the head, then the stamp |
| `work-split-bar.jsx` | Work split bar 60/20/20 (Ep2) | 1000x360 | Who does the work |
| `film-strip.jsx` | Film strip → frames → 3D scroll (Ep2) | 560x330 | Explaining the scroll-scrubbed clip |
| `effect-counter.jsx` | Effect counter n/12 (Ep4 v8) | 440x128 | Counting the effects or steps as they are spoken |
| `save-card-lines.jsx` | Save card, numbered lines + receipt + share footer (Ep4 v8) | 940x430 | The held save frame before the verdict |

Shaders (ChatCut pixel-effects) are in `../shaders/`: `talking-head-grade-skin.ts` (COLOUR 1; current rule is skin smoothing only, no grade) and `super-backing-shade.ts` (COLOUR 2; not used since 27 Sep 2026).

Not yet exported: the Ep1 compare table header and rows, the pricing-tier card and the Higgsfield logo tag. They live in the ChatCut project "Cooked or Cracked — Ep1 v4 (Cindy passes)", whose assets are not on this Mac. Open that project in ChatCut Desktop and run `inspect_asset includeCode` on each to add them here. The static table used in the Ep1 video is in `episodes/ep1_nateherk/02_graphics/higgsfield-app-api-vs-kie.html`.

MG contract: no `useVideoConfig` on Desktop exports, no imports, root `<div style={rootStyle}>`, precompute values, props from `item.props` with no fallbacks.
