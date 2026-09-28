# Cold Case Cut-outs, Ep 1: "The Princes in the Tower" (28 Sep 2026)

Style: 5, paper cut-out collage (Henry's pick). Tone: friendly, comic, all-ages (no gore, the word "murder" is not spoken, the mystery carries it). Voice: Nadine (approved). 9:16, target 65 s. Facts checked against the Wikipedia article on 28 Sep 2026.

## Budget (Higgsfield balance 72 credits before this episode)
| Item | Credits |
|---|---|
| 9 stills, GPT Image 2.5 | 2.25 |
| 9 Nadine takes | about 7 |
| 5 Kling 3.0 std clips, 5 s each (shots 1, 4, 6, 7, 8) | 37.5 |
| 4 shots as local paper stop-motion (stills with a 2-frame jitter, slow push, slide-in of the subject) | 0 |
| Total | about 47, leaves about 25 for two re-rolls |

## Style lock (front of every image prompt)
Paper cut-out collage animation style: every character and prop cut from textured coloured paper with visible fibres and slightly rough edges, layered with soft drop shadows for depth, stop-motion feel, muted storybook palette of parchment cream, slate blue, oxblood red and moss green with one warm gold accent, friendly round-faced characters with small dot eyes and simple smiles, no text, no letters. Vertical 9:16 with the subject in the upper two thirds and quiet space at the bottom.

## Shots
| # | VO (Nadine) | Still | Motion | Source |
|---|---|---|---|---|
| 1 | In 1483, two boy kings walked into the Tower of London. Nobody ever saw them walk out. | Two small paper princes in gold crowns, hand in hand, walking toward the huge paper gate of the Tower of London, a grey paper raven on the wall watching | The gate's portcullis lowers, the raven turns its head | Kling |
| 2 | Cold Case Cut-outs. Tonight: the Princes in the Tower. | A paper magnifying glass over a parchment file card with two tiny crowns, a red paper string and a pin, moody slate-blue backdrop | Title card overlay, stop-motion jitter, slow push | Local |
| 3 | Edward is twelve. He is already king. His brother Richard is nine. Their uncle, also Richard, is in charge until the coronation. | Family line-up: tall paper Edward with a crown too big, small Richard with a wooden toy horse, and a looming uncle in black paper with a very small smile | Jitter, uncle slides in from the right | Local |
| 4 | The uncle moves the boys into the Tower for safekeeping. Then Parliament declares them illegitimate. The uncle is crowned instead. Awkward. | The uncle on a paper throne receiving a crown while the two boys peek from a tiny tower window in the background, courtiers with raised eyebrows | Crown lowers onto the uncle, boys blink and duck | Kling |
| 5 | By late summer the boys stop appearing at the windows. No bodies. No funeral. No explanation. | The Tower at dusk, autumn paper leaves, one window lit, then the same window dark, a paper question mark of smoke from a chimney | Jitter, leaves drift, window light fades (local overlay) | Local |
| 6 | Suspect one: Uncle Richard, now Richard the Third. Suspect two: his ally, the Duke of Buckingham. Suspect three: Henry Tudor, who took the throne next. | Police line-up of three paper suspects holding number cards 1, 2, 3 against a height chart: the uncle in black, a plump duke in purple, a thin Tudor in red with a very large hat | Each suspect steps forward in turn and shrugs | Kling |
| 7 | Two hundred years later, workmen find a box under a staircase. Two small skeletons. They are buried in Westminster Abbey and never tested. | Two paper workmen in 1670s hats lifting a small wooden box from under a stone staircase, lantern light, one scratching his head | Lid lifts, lantern swings, workman scratches head | Kling |
| 8 | Then two boys turn up in Europe claiming to be the princes. One is crowned in Dublin. One is hanged. Both might be lying. | Two paper pretenders on a map of Europe, one wearing a crown that is clearly cardboard, one holding a "me" sign with an arrow, sceptical paper crowd | The two pretenders point at themselves, the crowd tilts heads | Kling |
| 9 | Five hundred years, three suspects, zero proof. Next time: a ghost ship, a full dinner table, and nobody on board. | The parchment file card stamped with a paper "unsolved" seal (no letters, just a red wax blob), and in the corner a tiny paper ghost ship teaser | Stamp comes down (local), push in | Local |

Closing tease is the Mary Celeste for Ep 2.

## Build v1 (28 Sep 2026, about 09:15)
`cold-case-cutouts-ep1-v1.mp4`: 83.6 s. Nadine takes came in at 76 s of speech (155 words), so the piece runs longer than the 65 s target. Kling clips are 5 s each; `build_ep.py` slows each up to 1.8x and then holds the last frame with a 2 px paper jitter to fill the take. Local scenes (2, 3, 5, 9) from `mg/paper_motion.py`: 10 fps stepped push, jitter, tiny rotation, slide-in. Music: Lyria through the Gemini key via OpenMontage's google_music tool, 85 s, $0.08. Captions cream with an oxblood active word.
Credits: 73.40 before the style samples, 28.65 after the build. Spend 44.75 (5 style samples 1.25, 9 stills 2.25, voice about 4, 5 Kling std clips 37.5).
Kling on paper cut-outs: all five clips came back clean on the first pass (princes walk in and the portcullis drops, crown lowers and the boys duck, three suspects step forward in turn, workman lifts the box, pretenders and the crowd tilt). Flat layered shapes do not warp the way photoreal metal did.

## Gemini on v1 and the v2 fix (28 Sep 2026)
Gemini: 6/10 overall, voice 6, hook 6, captions in sync, music fits, fade clean, publish as Ep 1: yes. Fact-check: 13 of 14 claims true; "two boy kings" false (only Edward was king). Family flag: "one is hanged" at 1:11. Motion notes: small hand and cloth melts at 0:02, 0:26, 0:45, 0:56, 1:07; shots 2, 5, 9 read as stills with a push (they are the local paper scenes).
v2: line 1 is now "a boy king and his little brother", line 8 ends "one ends up locked in the Tower himself" (Warbeck was held in the Tower before his execution in 1499). Two Nadine takes, about 1 credit. `cold-case-cutouts-ep1-v2.mp4`, 84.9 s. Full review: `gemini-review-ep1-v1.md`.
Next if Henry wants under 65 s: drop shot 8 (the pretenders, 10.5 s) and the "Awkward." beat; both are jokes, not facts.
