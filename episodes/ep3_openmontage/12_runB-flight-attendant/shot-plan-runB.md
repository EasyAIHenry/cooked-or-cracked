# Run B: "The most misunderstood job on earth: the flight attendant" (Higgsfield, Henry's workflow)

Same topic and same style lock as Run A (OpenMontage one-shot) so the comparison is fair. Paper cut-out collage. Voice: Nadine. 9:16, target 70 s. No stop-motion jitter this time: every non-Kling shot gets a smooth slow push only, and every Kling prompt asks for smooth camera and gentle stepped character motion.

Facts checked on 28 Sep 2026 (Wikipedia, Flight attendant): primary duty is safety, comfort is secondary. Heinrich Kubis, first flight attendant, 1912, DELAG Zeppelin; on the Hindenburg and survived by jumping out a window. Ellen Church, a registered nurse, first female flight attendant, United Airlines, 1930. US rule: one attendant per 50 passenger seats. "Trolley dolly" slang exists. The 90-second evacuation certification rule and doors-closed pay are widely reported and hold for most US carriers; say "many airlines", not "all".

## Budget
| Item | Credits |
|---|---|
| 9 stills, GPT Image 2.5 | 2.25 |
| 9 Nadine takes | about 5 |
| 9 Kling 3.0 std clips, 5 s | 67.5 |
| Total | about 75 |
Balance on 28 Sep at 17:30: 27.75. Henry needs to top up at least 50 credits before Run B generates video. Fallback if he does not: 5 Kling clips plus 4 smooth-push stills, about 45 credits, still short by 17.

## Script and shots
| # | VO (Nadine) | Still | Kling motion |
|---|---|---|---|
| 1 | You think this job is pouring coffee at thirty-five thousand feet. The coffee is the least important thing on the plane. | Paper aircraft cabin, a flight attendant with a trolley, a paper coffee cup held up, passengers' round faces | Trolley rolls one step, the attendant lowers the cup and turns to the exit door |
| 2 | Misunderstood Jobs. Tonight: the flight attendant. | Paper boarding pass and a small paper wings badge on a slate blue backdrop | Title card overlay, smooth push |
| 3 | The first one, in 1912, worked on a zeppelin. He later survived the Hindenburg by jumping out of a window. | A grey paper zeppelin in the sky, a tiny paper man in a white jacket leaping from a gondola window, paper flames | The man leaps and lands on a paper cloud, the airship drifts |
| 4 | In 1930, airlines hired nurses to do the job. The rule then is the rule now: safety first, service second. | A 1930 paper nurse in a cap beside a boxy paper airliner, a paper first aid kit | The nurse steps up to the plane door, the kit swings |
| 5 | That smile at the door is a check. Are you unwell, drunk, or fit to open an exit if asked? | Attendant at the cabin door greeting a queue of passengers, one passenger holding a paper bottle, one huge | The attendant's eyes flick left and right, one passenger sways |
| 6 | Training runs for weeks: fires, water landings, first aid, and emptying a full plane in ninety seconds with half the doors blocked. | A paper training hall: an evacuation slide, a paper fire, a stopwatch showing ninety, trainees sliding down | Trainee slides down, stopwatch hand sweeps, fire flickers |
| 7 | The law says one attendant for every fifty seats. Not for the drinks. For the exits. | Top-down paper cabin plan, fifty tiny seats, one attendant figure, exit doors highlighted in the warm accent | Seats fill in row by row, the exits glow |
| 8 | And on many airlines the pay clock only starts when the cabin door closes. Boarding is free. | The cabin door closing with a paper clock above it, hands at twelve, an attendant pulling the lever | Door swings shut, the clock hand starts moving |
| 9 | So the coffee is a bonus. Next episode: the job everyone thinks is boring, and never is. | A paper coffee cup with a small gold bonus tag, a boarding pass teaser for episode two | Smooth push, the tag flutters |

Order of work: takes, then stills, contact sheet check, then clips, then `build_ep.py` from the cold-case folder adapted (no jitter scene generator, smooth push only), captions cream and oxblood, music bed via Lyria ($0.08).

## Build v1 (28 Sep 2026, 18:25)
Henry switched Higgsfield to a second account: 110.04 credits (Ultimate plan) before Run B, 47.14 after. Spend 62.9 credits: 9 stills 2.25, 9 Nadine takes (2 rate-limit retries) about 4, 9 Kling 3.0 std clips (8 at 5 s, shot 6 at 6 s) about 56 on this plan's rate. Lyria bed 80 s via the Gemini key, $0.08.
Nadine takes: 59.3 s of speech, no pause trimming needed. All nine stills accepted first pass. All nine clips clean on the first pass: the steward drops onto the cloud, the slide and the fire go out, the exits pulse, the door closes on the lever. Higgsfield pushed an "EXIT THE DREAM" preset on shot 7; declined and resubmitted.
`build_runB.py`: no jitter anywhere. Kling clips slowed up to 2.0x to fit the take, then the last frame holds under a 4 percent zoompan push. `runB-flight-attendant-v1.mp4`: 66.5 s.
Run A (OpenMontage one-shot, same topic and style lock) is running in the terminal in parallel from its saved checkpoints; the Codex process was lost with a session restart after research and proposal.
