# De-myth sheet: Nate Herk, "5 free tools that turn Claude into an AI designer"

Reel: https://www.instagram.com/reel/DdT_OwyFeoj/ (posted 15 Sep 2026, 38 s)
Numbers on 26 Sep: 337,791 plays, 7,031 likes, 9,400 comments. 7.1x his 12-post median (47,514). Comment gate "FRONTEND".
Full Gemini audit: `nateherk-frontend-audit-report.md` (score 9.5/10, CRACKED as a creator).

## His claim, in his words
"You can now turn Claude into an insane AI designer with 5 free tools." All five are free. Comment FRONTEND for the list.

## The 5 tools (verified 26 Sep 2026 from each repo)

| # | He says | It actually is | Install (Claude Code) | Free? |
|---|---|---|---|---|
| 1 | Taste. Design rules so Claude stops making generic AI sites. | `Leonxlnx/taste-skill`, 90k stars, MIT. A SKILL.md with rules plus three 1-10 dials (variance, motion, density). Default is now v2 "experimental". | `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"` | Yes. Sponsored README, no paywall. |
| 2 | Impeccable. Improves your front end, own design system, live editor in the browser. | `pbakaus/impeccable` (Paul Bakaus). 1 skill, 24 commands (`/impeccable init`, `audit`, `critique`, `polish`, `live`...), 61 detector rules. Live mode needs its browser extension or hook. | `npx impeccable install` (from the project folder) then `/impeccable init` inside Claude Code | Yes. MIT. |
| 3 | Playwright CLI. Claude spins up browsers, tests the site, takes screenshots. | `microsoft/playwright-cli`. A CLI for coding agents, not the MCP. Node 18+. Headless by default, `--headed` to watch. | `npm install -g @playwright/cli@latest` then `playwright-cli install --skills -g` | Yes. Apache/MIT. |
| 4 | Awesome Design. Design systems inspired by real websites: typography, spacing, buttons, layouts. | `VoltAgent/awesome-design-md`, 118k stars. 73 `DESIGN.md` files (Claude, Linear, Stripe, Apple, Nike...) extracted from public CSS. No install, you copy one file into the project root. | `curl -o DESIGN.md https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/linear.app/DESIGN.md` (check the folder name on GitHub first) | Yes. MIT. Some brand folders point at getdesign.md. |
| 5 | "Image23.js". Give it a photo of a bike, Claude rebuilds it as an interactive 3D model in code. | `img2threejs/img2threejs` (he misreads the name). A staged pipeline that writes a Three.js model from primitives. Python 3.10+. Quality gates mean many passes. Heavy on tokens and time. | `git clone https://github.com/img2threejs/img2threejs.git ~/.claude/skills/img2threejs` then `/img2threejs Rebuild this object...` with an image attached | Tool is free. Tokens are not. |

Note on the wording "completely free": the five repos are free. Running them costs Claude usage. Tool 5 is the expensive one. This is the honest gap in the claim and the cleanest thing to check on screen.

## What "works" means (decide before you test)

| Tool | Pass | Fail |
|---|---|---|
| Taste | Same prompt gives a visibly different page: no Inter, no centred 3-card grid, no purple gradient. | Page looks like the plain Claude one. |
| Impeccable | `init` writes PRODUCT.md, `audit` returns real findings on your page, `polish` changes something you can see. | Commands error, or the "live editor" does not open. |
| Playwright CLI | Claude opens the page, screenshots it, and catches one broken thing you planted (dead link or missing image). | Cannot install browsers, or screenshots are blank. |
| Awesome Design | With a DESIGN.md in the root the page takes that brand's colours and type without you asking. | Claude ignores the file. |
| img2threejs | An orbiting model that you recognise as the photo, within 20 minutes. | Times out, errors on Python, or the model is a blob. Note tokens spent. |

## One-hour test plan (start the timer)

0:00 to 0:10, install. Run the five install lines above in a fresh folder `~/coc-ep2-test`. Check each: `ls ~/.claude/skills | grep -E "taste|impeccable|img2threejs|playwright"` and `playwright-cli --help`.

0:10 to 0:25, the control test. Three fresh subfolders, one prompt, same model:
```
Build a one-page landing site for a Singapore coffee cart called Kopi Lah. Hero, three menu items with prices, opening hours, one button to order on WhatsApp. Single index.html, no framework.
```
- A: plain Claude Code (no skills loaded, use `--no-skills` or a folder where they are off).
- B: same prompt, Taste on.
- C: same prompt, then `/impeccable init` and `/impeccable polish index.html`.
Open A, B, C side by side. Screenshot each with `playwright-cli open file:///.../index.html && playwright-cli screenshot --filename=a.png`.

0:25 to 0:35, Playwright as the tester. Break one link in C on purpose. Ask Claude: "Use playwright-cli to open index.html, click every link and button, screenshot each state, and tell me what is broken." Does it find the planted break.

0:35 to 0:45, DESIGN.md. Drop the Linear (or Claude) DESIGN.md into folder A and re-run the prompt. Does the page pick up the brand without being told.

0:45 to 1:00, img2threejs. One photo of one object (your DJI mic, a sneaker, a mug). Run `/img2threejs Rebuild this object as a Three.js model, keep the proportions, angles and colours.` Note the clock and `/cost` when it finishes or when you stop it at 15 minutes.

Fill the scorecard in `01_scripts/script-ep2.md` before you record.

## Likely gotchas (from the repos, not tested yet)
- Taste v2 is marked experimental. If the output looks worse, pin `design-taste-frontend-v1` and say so on camera.
- Impeccable live mode needs the hook or browser extension; on Claude Code the installer adds a project hook, reload Claude after install.
- Playwright CLI headless sessions die after an hour idle; if a command hangs run `playwright-cli close-all`.
- awesome-design-md folder names are the domain (`linear.app`, `claude`, `stripe`). Verify the raw URL in the browser before curling.
- img2threejs is Python 3.10+. This Mac's default `python3` is 3.9 (Xcode). Use `brew install python@3.12` or `uv` if it complains.
