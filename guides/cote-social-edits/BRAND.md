# COTE Singapore: brand rules for social edits

Copy this file to `~/Tristeps/COTE/00_brand/BRAND.md`. The agent reads it at the start of every pass. When the client changes a rule, edit it here and note the date in the change log at the bottom.

COTE Singapore is a premium Korean steakhouse. Hanwoo beef is the hero product. File prefix: `CSG`.

## Identity

- Use the new logo only: COTE SINGAPORE, red on black. Logo files live in `00_brand/logo/`.
- The logo goes on the end card. Other placements only if the brief asks.
- Do not recolour, stretch or outline the logo.

## Typography

- Subtitles and on-screen text: SangBleu Sans.
- One subtitle size for the whole video. Same position on every line.
- If SangBleu Sans is not available in ChatCut, use only the fallback agreed with the client in writing (see "To confirm").
- Spell brand and menu names exactly: COTE (all capitals), Hanwoo.
- Keep on-screen text short. Only the words the brief lists.

## Colour

- The FX3 S-Log3 footage is converted with the LUT `FX3 PL ARRI Neutral _65x`, baked onto the selects before import (`bake-lut.sh`). Do not grade, filter or apply a LUT inside ChatCut.
- The look: natural, enhanced contrast and richness, appetising.
- Not over-saturated. Not too warm or orange.
- If the LUT file is unavailable, the fallback is ChatCut's built-in "Sony S-Log3 s709" LUT, only after Henry has agreed, because the client approved the ARRI Neutral look.

## Footage priorities

1. Food close-ups and cooking detail come first: Hanwoo on the grill, searing, slicing, plating, texture.
2. Content pillars, in order of share: mastery of craft (the majority of videos), human stories, the space and the experience.
3. Premium footage only. The client has rejected unflattering process shots before. Examples to rate low (verify with Henry): messy raw prep, smoke hiding the food, soft focus, blown highlights, cluttered backgrounds.
4. Open on a food close-up unless the brief says otherwise.
5. Prefer shots with clean hands, clean grills and deliberate movement.

## Motion

- Premium and cinematic.
- Straight cuts or short, subtle dissolves. No flashy transitions.
- No effects unless the brief asks for them.
- The fire text effect and the box animation from earlier videos were built in After Effects (project `COTE_socials_effect` in each project's After Effects folder). Use them only when the brief asks, rendered from After Effects. Do not rebuild them in ChatCut.
- Let food shots breathe. Cut on action or on the beat, never mid-gesture.

## Music

- Pop or hip hop. Trending audio is permitted.
- Always prepare a few options (three by default) for the client to review before finalising.
- Music sits under natural sound (sizzle, knife, grill) where the natural sound adds appetite appeal.
- Level music so it never masks speech in human-story videos.

## Do not

- Use the old logo.
- Mix fonts or subtitle sizes.
- Add colour grading, filters or LUTs in ChatCut.
- Push saturation or warmth.
- Use flashy transitions, glitches, zoom punches, shakes or speed ramps unless the brief asks.
- Use process shots that make the food or kitchen look messy.
- Add graphics, stickers, emojis or text the brief does not list.
- Place anything important in the platform safe zones (below).
- Finalise music without client review.

## Deliverable specs

| Item | Spec |
|---|---|
| Frame | 1080x1920 (9:16) |
| Frame rate | 30 fps |
| Format | MP4, H.264 |
| Length | As the brief states per video |
| Safe zones | Nothing important in the top ~220 px or bottom ~450 px; keep off the right-hand action rail |
| Working name | `CSG_YYYY_MM_REEL_Title_v01.mp4`, then `_v02`, `_v03` |
| Approved master | `CSG_YYYY_MM_REEL_Title_FINAL.mp4` |
| Naming rule | No spaces; Title describes the content, such as `HanwooGrill` |
| Review | Frame.io folders V1, V2, V3, Final_Approved |
| Approved filing | Drive `02_Shared to Client/03_Final_Approved_Assets/[##]_[Month][Year]/01_Reels/` and `01_Internal/08_Backup_Final_Masters/[Month]/` |

## To confirm with the client

- [ ] Subtitle font fallback if SangBleu Sans cannot be used in ChatCut, agreed in writing
- [ ] The LUT `.cube` file for FX3 PL ARRI Neutral _65x, and its exact file name
- [ ] Logo files: formats supplied (PNG with transparency, SVG), and the brand red and black as hex values
- [ ] Music licensing route for delivered files, and whether trending audio is added in-app at posting instead
- [ ] End card duration and whether it carries any text besides the logo

## Change log

Newest first. One line per change: date, what changed, who asked.

- 28 Sep 2026: File created from the internal COTE handover.
