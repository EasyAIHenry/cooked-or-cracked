# Ep8 de-myth sheet: "Clone any app with Claude, never pay for a subscription again" (6 Oct 2026)

Internal file. Names stay here for tracking only; scripts, captions, guide and Henry's repo never name the creator or the repo author (Henry, 4 Oct 2026, "for good"). Here they are the same person: @opusjake is Jake Schincariol, who wrote the repo (README credit, opusjake.ai). He also wrote the Ep7 LinkedIn repo.

## Subject
- Reel: instagram.com/p/DeB6QU6N4Ec (@opusjake), posted 3 Oct 2026 11:06 UTC, 32.4 s.
- Stats at 3 days (6 Oct 15:32 UTC): 608,746 plays, 15,552 likes, 9,529 comments. Like rate 2.55%, comment rate 1.57% (comment-gate funnel, his usual).
- 26.2x his median of the other 11 posts since June (23,263). 30.0x his Sept to Oct median (20,290). Top post of his last 12. `opusjake-baseline.csv`.
- Gate keyword: CLONE. Caption adds "so you never waste money on an overpriced subscription again" and "rebuild any type of web app or mobile app perfectly".
- Repo it promotes: github.com/Jakeschincariol/replica-skill, one commit (77c9436, "The Replica skill: 11 Claude skills, v1.0"), created 3 Oct 2026 12:07 UTC, 61 minutes after the reel went live. 639 stars, 57 forks on 6 Oct. MIT.
- The link Henry received carried a `?mcp_token=` tracking parameter. Stripped before cloning. Not part of the repo.
- Reel audit: `reel-audit-report.md` (Gemini 3.1 Pro, 9.5/10 as a creator; weakness 1: "perfect clone of any app every time" is an overpromise).

## His script (verbatim, from the audit)
00:00 You can now clone any app with Claude.
00:01 So you never have to pay for a subscription again.
00:03 It's called the replica skill and it's completely free.
00:05 And it's not one skill either, it's 11 of them.
00:06 And every one of them does a different job.
00:08 One reverse-engineers the app you want to clone,
00:10 another rebuilds it,
00:11 then one tests it for bugs,
00:13 so you get a perfect clone of any app every time.
00:15 But the craziest part is the entrepreneur skill.
00:16 It goes and performs research on the app you cloned,
00:19 then it reads user feedback to find missing features,
00:21 unsolved problems, and things that people hate.
00:23 Then solves all of those problems in your app,
00:24 so you have an actual app you can go and sell.
00:27 To set it up, just paste this link inside of Claude and say install skill.
00:29 If you want the full setup, just follow me and comment CLONE, and I'll shoot...

Top-window visuals: a copier labelled Claude scanning a Canva logo; a receipt with Photoshop, Canva, Spotify crossed out; "Calendly vs Clone" side by side; Reddit review counts; a Stripe payment notification.

## Security gate (Henry's rule: HIGH means no install until he says proceed)
- skillspector 2.11.2 `--no-llm`: **60/100, HIGH, "DO NOT INSTALL"**. Full report: `skillspector-scan.txt`.
- What the 7 findings actually are:
  - 2x HIGH "MCP tool poisoning metadata" at `replica-launch/listing.py:33` and its test. That line is a regex the store-listing linter uses to flag marketing words in app titles ("free", "best", "#1", "sale"). The scanner saw the word list, not an exploit.
  - MEDIUM "session persistence" at README:12: the sentence "give it a name and a brand of its own". Pattern match on wording.
  - 3x MEDIUM "unpinned npx playwright": the test and deploy skills tell you to run `npx playwright test`. Standard Playwright usage, no version pin.
- Own sweep (same method as Ep3 and Ep7): no network imports, no subprocess, no eval or exec, no shell pipes, no hooks, no postinstall. Only standard-library imports (json, os, re, csv, zlib, struct, unicodedata). The one "invisible character" hit is U+200D, the emoji joiner, which `listing.length()` uses to count emoji as one character. Outbound links in the text: GitHub, Apple, Google Play, G2, Capterra, Reddit, the author's site.
- The repo's own 57 unit tests pass on this Mac's Python 3.9.6 (`python3 -m unittest discover -s tests`).
- My read: the HIGH is a false positive on a lint word list. Henry cleared it 6 Oct 23:45 SGT. Installed 23:46 SGT with the README's clone route (`cp -r replica-skill/replica-* ~/.claude/skills/`), 11 folders, under 1 s. Timed terminal recording and log in `04_raw-footage/install-recording/` (`script -r` format, replay with `script -p install-typescript.rec`). Move the 11 folders out before the on-camera install so it is real.
- Claude CLI on this Mac is logged out (`claude auth status`, 6 Oct). Pre-flight item for the hour.
- On camera, this is the same beat as Ep7: scan first, read what the finding is, then decide. A HIGH that turns out to be a word list is a better lesson than a clean 9/100.

## Claim check (reel vs repo, verified 6 Oct 2026 from the SKILL.md files)
| # | Reel says | Repo actually | Status |
|---|---|---|---|
| 1 | "Clone any app with Claude" | README fine print: "Clone any app means the features and the flow. Not the content, the network or the licences." Spotify is its own counter-example: "You cannot clone its catalogue." Recon step 8 lists what cannot be cloned: licensed content, the network, partner deals, hardware, regulated licences. | Half. The reel shows Spotify crossed out; the README says you cannot clone it. |
| 2 | "never pay for a subscription again" | Architect defaults to Vercel, Supabase or Neon, Stripe, Resend. Free tiers at zero users, paid as it grows. Running the skills costs Claude usage. | Half |
| 3 | "completely free" | Skills are MIT, no API key, stdlib Python. Claude Code needs a paid plan. Same gap as Ep7. | Half |
| 4 | "11 of them, every one does a different job" | 11 SKILL.md files, 11 jobs: recon, architect, design, build, backend, test, diff, entrepreneur, brand, launch, deploy. | True |
| 5 | "One reverse-engineers the app" | replica-recon reads help centres, pricing pages, changelogs, store listings, public videos and your own account. Rules: "Reading, not scraping. No crawlers, no bulk downloads." "No source code, no private APIs." | True, but it is reading docs, not decompiling anything |
| 6 | "you get a perfect clone of any app every time" | README: "No guarantee of a perfect clone. A booking tool is weeks. A spreadsheet engine is not." Recon step 9 sizes S (weekend) to XL (rescope). Diff skill: "A clone at 62% is at 62%." | Not true, by the repo's own words |
| 7 | "the entrepreneur skill goes and performs research... reads user feedback" | replica-entrepreneur: "Reading, not scraping. Read review pages the way a person does, in the browser, and copy rows into the sheet." Target 100+ reviews, hand-copied into `reviews.csv`. The only automated sources it allows: Apple's customer-reviews RSS JSON, the HN Algolia API, Reddit's official API. `reviews.py` then sorts the CSV into themes. | Stretched. The "craziest part" is you copying reviews into a spreadsheet, then a script that groups them |
| 8 | "then solves all of those problems in your app" | Entrepreneur writes `fixes.md`: top 5 to 8 problems by evidence, sized S, M, L, added to features.csv as rows. Build and backend skills then build them. Nothing is solved by the entrepreneur skill itself. | Stretched |
| 9 | "an actual app you can go and sell" | Brand, launch and deploy exist. The brand skill lists trademark checks to run by hand and says "talk to a lawyer before launch if there is money on the line". Deploy will not ship until the rebrand sweep is clean. | True in structure, with a lawyer line the reel skips |
| 10 | "paste this link inside of Claude and say install skill" | README gives three routes: paste the URL into Claude and say "install skill"; `/plugin marketplace add`; or `git clone` and `cp` into `~/.claude/skills/`. | To test on camera. Does claude.ai do anything with a pasted GitHub URL plus "install skill"? |
| 11 | Visuals: Canva, Photoshop, Spotify crossed out; a Stripe payment | None of these appear in the repo. The repo's worked example is a scheduling link app (Calendly-style). | Mockups |

## Repo numbers (counted, not read)
- 11 SKILL.md files, 1,131 lines. 6 Python tools, 1,505 lines including tests. 57 tests. 0 dependencies.
- Tools: imgdiff.py (edge-map layout diff of two PNGs), parity.py (weighted feature score), reviews.py (groups a CSV of reviews into themes), contrast.py (WCAG ratios), sweep.py (finds the original's name and colours in your code), listing.py (store-listing limits).
- Every skill writes into a `replica/` folder in your project and reads the previous one's output. Order: recon, architect, design, build, backend, test, diff, entrepreneur, brand, launch, deploy.

## What is actually doable in 1 hour (my sizing, untested)
The pipeline is honest about size. Recon step 9 gives S (a weekend) to XL. One hour on camera gets: install, recon of one slice, architect, and the "vertical slice" the build skill asks for first (one core flow, ugly, working). It does not get: backend auth, payments, test suite, deploy. Say that on screen.

Candidate apps, filtered by Henry's taste (real subscription people pay for, visual result, measurable, not done before):

| App | Why people would care | 1 h slice | Entrepreneur source (allowed by the skill) | Size by the repo's scale | Shock factor on Reels |
|---|---|---|---|---|---|
| **Loom** (US$15 a month per creator) | Record your screen, get a share link. Builders in his audience pay for it or hit the free 5-minute cap. | Browser recorder (MediaRecorder) + upload + a share page that plays it. Doable with Next.js and local storage in under an hour. | Loom's iOS App Store reviews via Apple's RSS JSON (automatable with curl, within the skill's rules). Known complaints: free cap, price, upload speed. | S to M | High. "I just recorded this reel's screen on my own Loom." |
| **Calendly** (US$12 a month) | The repo's own worked example. Testing his example on his own skills is the cleanest check. | Event type, public booking page with a slot grid, booking saved, double-booking blocked by a DB constraint. Doable. Google Calendar sync is not. | App Store RSS. Complaints: per-seat price, time zones. | M ("weeks" per the README) | Medium. A booking grid looks fine on screen, but everyone has seen one. |
| **Linktree** (US$5 a month) | Everyone in his audience has one. | Profile, links, public page, click counts. Under 30 min. | App Store RSS. | S | Low. Too easy to be a test. |
| **Buffer** (Henry pays per channel, Ep7) | Henry's own subscription. Carries the Ep7 story. | Queue, composer, calendar view. Real posting needs a LinkedIn developer app and OAuth (Ep7 research, untested). | Buffer App Store and G2 reviews. | M to L | Medium, and the post step is the risky part on a timer. |
| **Canva** (the app in his hook) | It is the one his reel crosses out. | Recon only. Sizing it XL on camera is the honesty beat: 5 minutes, then move on. | not needed | XL | High as a 5-minute "size it" beat, not as a build. |

My pick: **Loom as the build, Canva as the 5-minute sizing beat first.** Loom is the one that looks like something on a phone screen, the slice is small enough for the hour, and the reviews can be pulled by the skill's own allowed route (Apple RSS) instead of hand-copying, so the "entrepreneur" beat gets a real number on screen. Fallback: Calendly, because it is his own example.

## What "works" means (set before the test)
- Pass: install works the way the reel says; recon sizes the app honestly; the vertical slice runs end to end on localhost within the hour; the entrepreneur step produces a ranked complaint list from real, linked reviews with a stated sample size; the parity score is a real number.
- Fail: install route in the reel does nothing; the build does not run; the entrepreneur step needs more hand-copying than the hour allows; or Claude copies the original's assets or copy (the sweep tool should catch this, run it).
- Receipts to collect: the clock at each stage, `/cost` at the end, parity score, number of reviews read, the skillspector score, the README lines above on screen.

## One-hour plan (fill after Henry picks the app)
0:00 to 0:05 install, his way first ("paste the link, say install skill"), then the clone route if that does nothing.
0:05 to 0:10 `/replica-recon` on Canva, scope "the editor". Read the size out loud. Stop.
0:10 to 0:20 `/replica-recon` on [app], scope the core loop only.
0:20 to 0:25 `/replica-architect`. Note the stack it picks and the table count.
0:25 to 0:48 `/replica-build`, vertical slice only. Open it in the browser. Use it once for real.
0:48 to 0:55 `/replica-entrepreneur` with reviews pulled from the Apple RSS feed (curl, 50 most recent). Read the top complaint and the count.
0:55 to 1:00 `/replica-diff` parity score, `/cost`, screenshot the scorecard.
[verdict]

## Rehearsal, 6 Oct 2026 15:47 to 15:54 UTC (off camera, Claude driving, scratch folder)
Full report: `rehearsal-loom-report.md`. Tool time 6.5 min for Canva size (XL), Loom recon (6 screens, 3 flows, 22 rows, M), architect (Next.js 16 + JSON store), build (compiled first time, all routes answered by curl), 50 App Store reviews via Apple's RSS (top theme "Bugs and crashes", 6, every theme thin), parity 56.2 / 100, 5 of 7 must-haves. Recording not exercised (needs a real click). 18 "better repo" items in the report, the big ones: no non-interactive mode in recon, no URL-finding method (two 404s), no local stack variant, no RSS-to-CSV converter shipped, the feed's one generic URL per 50 reviews breaks the skill's own "every quote linked" rule and reviews.py does not catch it, themes.json has nothing for video apps, parity.py has no "browser does this" value.
Honest read for the script: the chain is fast and the slice is real; "perfect clone every time" is still not what comes out, by its own score.

## Likely gotchas (from the files, not tested)
- The skills expect a project folder with `replica/` in it. Start in an empty folder, not Henry's Content Creation folder.
- Deploy skill paths assume the pack sits in `~/.claude/skills/` ("python3 ~/.claude/skills/replica-diff/parity.py"). If installed as a plugin the names become `/replica-skill:replica-recon`.
- Build skill says "one commit per screen". Needs `git init` in the test folder or it will ask.
- Entrepreneur needs 3 or more sources and 100+ reviews to call a theme solid; with one RSS feed it will mark every theme "thin". Say that on screen rather than pad it.
- Python 3.9 here; the tools say 3.8+. Tests pass. Fine.
- Recon's "no private APIs" rule means Claude must not read Loom's network calls. Watch for it reaching for devtools.

## For the "better" repo (after Henry's go, from reading the 11 files)
1. A one-hour mode: recon of one slice, architect, vertical slice, timer and `/cost` receipts written to `replica/receipts.md`. The current pack has no time or cost accounting.
2. A real fetch tool for the entrepreneur step inside the rules it already names: Apple RSS JSON, HN Algolia, Reddit's official API. Today it tells you to copy 100 reviews by hand.
3. Honest sizing first: run the size step before anything else and print S to XL with the reasons, so "clone any app" gets a number before an hour is spent.
4. Henry's gate: a `skillspector` step in the install docs, with the false-positive note.
5. Everything written from scratch, no copied code or text from the original, so no MIT notice is owed and no name appears (see no-names rule).
