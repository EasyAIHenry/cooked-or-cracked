# Ep8 recording brief: one hour with the clone skills, Loom as the target

Beats, receipts and screens only. You talk in your own words; the pointers are in `script-ep8.md`.
No names, no handles. Say "this reel", "the repo", "these free skills".

## Locked by Henry (6 Oct 2026)
- App: Loom (build), Canva (5 minute sizing beat first).
- Install: go ahead. Done off camera 6 Oct 23:46 SGT, recorded (`04_raw-footage/install-recording/`). I move the 11 folders out before you roll so the install on camera is real.
- Keyword: CLONE (Henry, 7 Oct 2026).

## The question the video answers
"Can free Claude skills clone an app I pay for, in one hour?"
Four checks the viewer can follow, with the timer on screen:
1. Does the install work the way the reel says?
2. How big does it say Canva is?
3. Is my Loom recorder working inside the hour, and at what minute?
4. Does the entrepreneur step do the research, or do I?

## Pre-flight (15 min, before you say "rolling")
- **Claude CLI is logged out on this Mac** (`claude auth status` showed loggedIn false on 6 Oct). Run `claude` once in a terminal and log in, or do the whole hour in the Claude desktop app. Your call; tell me which so the screen capture matches.
- One display for the whole test, the LG (display 1), as in Ep7. On it: one terminal or the Claude app, Chrome with loom.com/pricing, canva.com and the repo README. Nothing else. Do Not Disturb on. No Telegram on that display (Ep7 seg06 lesson).
- Window recording, not display recording: CleanShot area capture of the terminal window plus the browser, your click. Display recording caught your other sessions twice in Ep7.
- Empty test folder: `mkdir ~/coc-ep8-loom && cd ~/coc-ep8-loom && git init`. The skills write into `replica/` inside it.
- Node 24 and npm 11 are installed. Playwright CLI is not (not needed for the slice).
- Timer: a visible clock on screen from the first command. I will also stamp from the recording's timestamps.
- Have ready: the repo URL (clean, no tracking parameter), loom.com/pricing open, your Loom plan page if you want the "I pay for this" receipt.
- You type "rolling" here, I note the time. "cut" ends a segment. Segments of 15 min max.

## The hour (timer on)
| clock | do | say the number when it is on screen |
|---|---|---|
| 00:00 | His install route first: paste the repo URL into Claude and type "install skill". Wait 20 s. | what happened |
| 00:02 | The clone route: `git clone` then `cp -r replica-skill/replica-* ~/.claude/skills/`. `ls ~/.claude/skills \| grep replica`. | 11 |
| 00:04 | Before that step on camera, the scan: `skillspector scan --no-llm replica-skill`. Read the score. Open `replica-launch/listing.py` line 33. | 60, HIGH, then the word list |
| 00:06 | `/replica-recon` on Canva, scope "the editor". Stop at the size (step 9). | S / M / L / XL |
| 00:11 | `/replica-recon` on loom.com, scope "record the screen, get a link, someone watches". | screens, flows |
| 00:18 | `/replica-architect`. Local only: Next.js, SQLite or a JSON store, files on disk. | stack in one line |
| 00:22 | `/replica-build`, vertical slice only. Open localhost. Click Record. Record 10 s of the screen. Open the share link. | the clock when it plays |
| 00:45 | `/replica-entrepreneur`, Apple RSS route: curl the Loom app's reviews JSON to `replica/reviews.csv`, run `reviews.py`. | review count, top theme |
| 00:52 | `python3 ~/.claude/skills/replica-diff/parity.py replica/features.csv` | parity score |
| 00:55 | `/cost` in Claude. Screenshot the scorecard. | tokens or dollars |
| 01:00 | Stop. Verdict to camera later, after you have seen the numbers. | |

## What the rehearsal says to expect (off camera, 6 Oct, `06_research/rehearsal-loom-report.md`)
- Tool time for the whole chain was 6.5 minutes: Canva size 0.9, Loom recon 1.8, architect 0.7, build 2.9 (npm install was cached; cold machine add 1 to 2 min), reviews 0.2, parity under 1 s. Your hour is mostly you reading, clicking and talking. Expect the recorder working around minute 15 to 25, not 45. Keep the timer honest either way; a shorter number is a better receipt.
- Canva came back **XL**: "a canvas engine plus a licensed library". Rescoped to one social graphic it would be M.
- Loom recon: 6 screens, 3 flows, 22 feature rows, size M for the core loop, S for the slice.
- Stack it picked: Next.js 16, TypeScript, a JSON file store, webm files on disk. No auth, no payments.
- Build compiled first time. The recording itself needs a real click in a real browser, so you are the first person to press Record. If the picker does not appear, that is the moment to say so on camera.
- Reviews: Apple's feed gives 50 per page (`page=1` to `10` for up to 500). Top theme in the rehearsal: "Bugs and crashes", 6 reviews. The tool marks every theme "thin" with one source. Say that.
- Parity printed: `Parity: 56.2 / 100 ... must-haves 5 of 7 done ... Not shippable yet`.
- Gotchas to avoid live: recon guessed two help URLs from memory and got 404s (tell it to search `site:support.atlassian.com/loom`); create-next-app loads Google Fonts at build time (needs network, fine on the day); the skills want a yes at recon step 1, so answer it.

## Also film
- Silent reaction: you on your phone, scrolling the reel, 5 s. Hook.
- Straight-to-lens hold for the sting, 3 s, with a thumbs up or a nod.
- A 10 s take of you using your clone: click Record, talk, stop, open the link. Full frame, this is the result shot under the sting.
- The verdict and the real-life beat after the hour, when the numbers are in.

## Receipts I capture from your screen
Scan report, the regex line, the README lines (perfect clone, booking tool is weeks, never what it owns), the SKILL.md "copy rows into the sheet" line, the brand skill's lawyer line, Loom pricing, the recon size card, the timer at the result, feedback.md top theme, the parity score, `/cost`.
