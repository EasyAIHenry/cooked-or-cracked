# Cooked or Cracked, Ep2: Nate Herk, "5 free tools make Claude a designer"

Target 60 to 75 s. Same template as Ep1 (paper stamps, table, scoreboard, sting, captions). New supers listed per beat. Fill the [brackets] from the test, do not guess.

## Scorecard (fill after the 1-hour test)

| # | Tool | Claim | What happened | Time | Tick |
|---|---|---|---|---|---|
| 1 | Taste | No more generic AI sites | [ ] | [ ] min | [ ] |
| 2 | Impeccable | Design system + live editor | [ ] | [ ] min | [ ] |
| 3 | Playwright CLI | Claude tests your site | [ ] | [ ] min | [ ] |
| 4 | Awesome Design | Real-site design systems | [ ] | [ ] min | [ ] |
| 5 | img2threejs | Photo to 3D in code | [ ] | [ ] min | [ ] |

Overall: [N]/5 work as claimed. Tokens spent: $[x]. Verdict: [COOKED / CRACKED] [score]/10.

## Beat sheet

| Time | Say (Henry) | Screen | Super / animation |
|---|---|---|---|
| 0:00 to 0:03 | "Five free tools that turn Claude into a designer. I installed all five. [N] of them are worth it." | Henry full frame, Nate's reel muted in the low-left window | Series pill "Cooked or Cracked?" top centre. NEW: **5-box tally** top-left, five empty checkboxes with the tool names in Kalam, pops at 0:01. |
| 0:03 to 0:05 | (sting plays, no hold, Henry keeps moving) | Nate window closes | Jingle title COOKED / OR / CRACKED? two-row at top, over the tally for 2 s then gone. Bubble pop. |
| 0:05 to 0:10 | "First thing. It is not called Image twenty-three. It is img2threejs. And it is the one that costs you." | Screen: the GitHub repo name, then `/cost` output | NEW: **Terminal strip** stamp: mono text `img2threejs` typed in with a cursor, Kalam label "the real name". Price stamp "$[x] in tokens" pops on the number. |
| 0:10 to 0:20 | "Same prompt, three times. Plain Claude. Taste. Impeccable. [One sentence on what changed.]" | Three pages side by side, then one at a time | NEW: **Before / after wipe**: screenshot A on the left, B on the right, an orange line wipes across over 18 frames, label "same prompt". Tool card #1 and #2 slam in with tick or cross as you say the verdict for each. Tally boxes 1 and 2 fill. |
| 0:20 to 0:27 | "I broke the order button on purpose. Playwright [found it / missed it] in [N] seconds." | The screenshot Playwright saved, the broken button circled | Tool card #3 with tick or cross. NEW: **Time stamp** "[N] s" small stamp beside the card. Tally box 3. |
| 0:27 to 0:33 | "One file in the folder, I said nothing. The page came out [looking like Linear / the same]." | DESIGN.md in Finder, then the page | Tool card #4. Tally box 4. Bottom key-word stamp "DESIGN.md" with a file icon. |
| 0:33 to 0:42 | "The 3D one. His demo was a bike. Mine was [object]. [N] minutes. [What it looked like.]" | The orbiting model or the error | Tool card #5. Time stamp "[N] min". Tally box 5. |
| 0:42 to 0:50 | "So. [N] out of five work as advertised. Verdict: [COOKED / CRACKED]. [Score] out of ten." | Henry full frame | Scoreboard tick on the left wall. Verdict stamp at top. Confetti only if CRACKED. Table clears. |
| 0:50 to 0:56 | "Screenshot this. The order I would install them in." | Henry, then hold | NEW: **Save frame**: clean scorecard card, five rows, ticks, install order numbers, held 2 full seconds with no other super. |
| 0:56 to 0:62 | "Free tools, not free tokens. Comment DESIGN and I will send the install lines, the test prompt and my scorecard." | Henry | Bottom stamp "comment DESIGN" with a chat icon. Keep the save frame small at the top. |

## Rules for this episode
- Say the tool name when the card is on screen, never before.
- One verdict word per tool: works, meh, cooked. No "honestly", no "insane", no "crazy".
- Time and money are the receipts. Say them as numbers.
- No "last week", no dates in speech. Dates go in the caption.
- If a tool fails because of your setup (Python version, hook not trusted), say "my setup" on camera and give it a meh, not a cross.

## New MG assets to build in ChatCut (same look as Ep1, torn paper, Fraunces + Kalam, #DF825F)
1. **Tally**: 5 rows, checkbox + tool name. Props: `filled` (0 to 5), `verdicts` ("tick|cross|meh" x5). Box fills with a stamp-in (scale 1.4 to 1, 8 frames) and a bubble pop.
2. **Tool card**: number badge, name, one-line claim, verdict sticker. Props: `n`, `name`, `claim`, `verdict`, `showVerdict` frame. Sticker slams in tilted 4 degrees with a mouse click.
3. **Before / after wipe**: two images, a wipe line. Props: `imgA`, `imgB`, `label`, `wipeStart` frame, 18-frame wipe.
4. **Terminal strip**: dark card, mono text typed one character per 2 frames, Kalam label. Props: `text`, `label`, `typeStart`.
5. **Time stamp**: small torn stamp with a clock icon and Fraunces number. Props: `value`, `unit`.
6. **Save frame**: the scorecard as one card, 5 rows, install order, no animation after it lands.
Keep: series pill, jingle title, scoreboard, paper stamp, confetti, captions preset from the henry-scrapbook-reel skill.
