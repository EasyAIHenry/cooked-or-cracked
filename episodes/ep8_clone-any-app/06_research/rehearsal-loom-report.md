# Rehearsal report: Replica skill pack on Loom (off camera)

Date: 2026-10-06. Clock: UTC, from `date -u` at the start and end of every stage.
Work folder: `/private/tmp/claude-501/-Users-henrychua-Content-Creation/3d2a471f-d567-4bb3-8793-f6c5e6124d19/scratchpad/rehearsal-loom` (git, 6 commits). Nothing written outside it except this file.
Rules kept: public help centre, pricing page and App Store listing only. No account, no JavaScript bundles, no network calls read, no scraping, no Loom name, logo, colours or copy in the clone.

## Timings

| stage | what | start | end | minutes |
| --- | --- | --- | --- | --- |
| 1 | replica-recon on Canva, editor only, steps 1, 2, 9 | 15:47:25 | 15:48:20 | 0.9 |
| 2 | replica-recon on Loom, core loop | 15:48:20 | 15:50:06 | 1.8 |
| 3 | replica-architect, local stack | 15:50:06 | 15:50:48 | 0.7 |
| 4 | replica-build, vertical slice, build and curl checks | 15:50:48 | 15:53:43 | 2.9 |
| 5 | replica-entrepreneur, App Store RSS route | 15:53:43 | 15:53:56 | 0.2 |
| 6 | replica-diff parity | 15:53:56 | 15:53:56 | under 1 s |
| | total | 15:47:25 | 15:53:56 | 6.5 |

The 50 minute budget was not reached. Timings include the web searches and page fetches, which ran in parallel inside each stage. Reading the 11 SKILL.md files happened before the first stage clock started (about 1 minute). npm install took 6 s because the packages were already in the local npm cache; on a cold machine expect 1 to 2 minutes more in stage 4.

## Stage 1: Canva size

XL for "the editor". Reasons: the editor is a canvas engine (selection, snapping, layers, undo, text layout with web fonts, crop, multi-page, collaboration, server-side export), and each help centre category is a multi-week build on its own.
The thing users come for, the template and element library, is licensed content and sits in the skip list, so an editor clone without it is a different product; rescoped to one single-page social graphic with text and uploaded images it would be M.

Sources used (5 URLs): `canva.com/help/editing-designing/`, `canva.com/help/article/editing-and-designing/`, `canva.com/help/edit-designs-with-ask-canva/`, `canva.com/pricing/`, `canva.com/help/ai-powered-assistant/`. File: `replica/canva-size.md`.

## Stage 2: Loom recon counts

Screens 6 (S01 record launcher, S02 browser capture picker, S03 recording overlay, S04 video page owner, S05 video page viewer, S06 library). Flows 3 (record and share, 4 clicks on the happy path; watch; see who watched). Entities 6. Features 22 rows: must 7, should 7, could 5, skip 3. Size: M for the core loop with real uploads and processing, S for the vertical slice.
Sources: 11 URLs, all on `support.atlassian.com/loom`, `loom.com/pricing` and `apps.apple.com/app/id1474480829`. Two help URLs I guessed from memory returned 404; the right ones came from a `site:` search.

## Stage 3: stack

Next.js 16.3.8 App Router + TypeScript, plain CSS with a tokens file, a JSON file store (`data/videos.json`, atomic write via temp file and rename) behind a small data layer with the same function signatures a SQLite or Postgres layer would have, webm files on local disk in `./uploads`, no auth, no payments, no jobs. JSON over better-sqlite3 to avoid a native build in a 20 minute window. Target SQL schema (2 tables) written inline in `replica/architecture.md`.

## Stage 4: build

`npm run build` compiled first time: 6 routes (/, /_not-found, /api/videos, /api/videos/[id], /api/videos/[id]/file, /v/[id]).
Dev server on port 3777, checked with curl, then stopped:

| check | result |
| --- | --- |
| GET / | 200 |
| GET /v/nope | 404 (custom not-found page) |
| POST /api/videos (4 KB fake webm, title, durationMs) | 201, `{"id":"5qXy-M-z78","url":"/v/5qXy-M-z78"}` |
| GET /v/5qXy-M-z78, twice | 200, 200, view count 2 |
| GET /api/videos/[id]/file | 200, 4096 bytes |
| GET file with `Range: bytes=0-99` | 206, 100 bytes |
| PATCH /api/videos/[id] title | 200, page h1 updated |

The recording itself (getDisplayMedia + MediaRecorder, webm, 1 s chunks, mic optional, quiet state on cancel, upload via multipart streamed to disk, redirect to /v/[id]) is written and type-checks but was not exercised: screen capture needs a real click in a real browser.

## Stage 5: reviews, exact commands

```
curl -s "https://itunes.apple.com/us/rss/customerreviews/id=1474480829/sortBy=mostRecent/json" -o replica/appstore-reviews.json
python3 - <<'EOF'   # inline converter, 20 lines: feed.entry[] -> source,url,date,rating,text (title + ". " + body)
...
EOF
python3 ~/.claude/skills/replica-entrepreneur/reviews.py replica/reviews.csv --out replica/feedback.md
```

App id found by web search: `https://apps.apple.com/app/id1474480829` (Loom: Screen Recorder, 4.8 from about 19K ratings).
Reviews through: 50 (the feed's page size), dated 2025-11-16 to 2026-09-29, all with star ratings, one source.
Top theme: "Bugs and crashes", 6 reviews, score 5.4, average 1.5 stars, marked thin by the tool (fewer than 3 sources). Next: billing and cancelling 3, slow and laggy 3, price and paywalls 3, login 3. Top request theme: platforms and mobile, 5 reviews. Every theme is thin because everything came from one source.

## Stage 6: parity, verbatim

```
Parity: 56.2 / 100

features 56.2  (19 counted, must-haves 5 of 7 done)

Not shippable yet: 2 must-have features are not done.
```

The two partial must-haves: "Pick capture mode" (the browser's own picker does it, no in-app control) and "Share link ready after stop" (the page URL is the link, not auto-copied to the clipboard).

## Where the skills were unclear, wrong or slow (the "better repo" list)

1. replica-recon step 1 says "ask three things, or propose answers and get a yes". With no one to answer, the skill needs a stated non-interactive mode: propose, write the assumption into recon.md, proceed.
2. replica-recon step 2 gives source types but no method. Guessing help centre URLs cost two 404s. Add one line: "find URLs with a `site:` search, never from memory", and name the search tool the pack expects.
3. replica-recon says screenshots go in `replica/screens/` but never says what to do when no browser tool is attached. Say "skip, and list the screens as unseen" so the build does not pretend.
4. recon-map.md asks for must/should/could/skip counts by hand. A one-line `awk` or a `--counts` flag on parity.py would remove a manual step and a place to be wrong.
5. replica-architect's default stack is Supabase, Stripe, Resend, Vercel. There is no local or offline variant, and the "swap for" column lists SQLite (Turso) but not a JSON file store. Add a "local rehearsal" column.
6. replica-architect wants `replica/schema.sql` as a separate file; the template also allows inline SQL. Pick one.
7. Neither architect nor build warns that create-next-app now ships Next.js 16 with Promise-based `params` and global `PageProps`, `RouteContext` and `LayoutProps` types, and an AGENTS.md saying the framework differs from training data. The build happened to work; a line in the skill pointing at `node_modules/next/dist/docs/` would save a rewrite when it does not.
8. create-next-app's default layout loads Google Fonts at build time. The skill should say to remove it (offline builds fail) or keep it (needs network). I removed it.
9. replica-build says "tokens only, no raw hex" and "primitives from replica-design", but the pack's own build order allows a vertical slice before design has run. State what to do then: write a minimal tokens.css and mark it temporary.
10. replica-build's definition of done needs screenshots at two viewports, a keyboard-only walk and a console check. All need a browser. Split the list into "automatable" and "a person does this", so an automated run reports honestly instead of skipping silently.
11. replica-build says "one commit per screen". A vertical slice spans several screens; say "one commit per slice, then per screen".
12. replica-build step 1 wants seed data. A recorder has no seed data without a video file. Suggest shipping a tiny sample webm for the empty library.
13. replica-entrepreneur names Apple's RSS feed but ships no converter. I wrote one inline. Ship `appstore_rss_to_csv.py`, and note that the feed returns 50 per page and accepts `page=1` to `page=10` for up to 500.
14. The RSS feed's per-entry link is the app's generic review page, the same URL for all 50 rows, not the individual review. The skill's rule "every quote is linked to the review" cannot be met through the feed, and reviews.py accepts any URL so it did not catch it. Say so in the skill, and have reviews.py flag a CSV where every URL is identical.
15. The automated route alone cannot reach the skill's "100+ reviews across three sources". Add the second automated source the skill already names (Hacker News Algolia API) as a one-command fetch, so a run gets at least two sources without hand reading.
16. themes.json is generic (billing, crashes, login). Nothing for video or recording (upload failed, 5 minute limit, quality, lag during capture). The skill says "edit it for the app's category" but gives no category presets. Ship a few.
17. parity.py has no value for "the browser provides this". "Pick capture mode" is scored partial although the platform does it. A `n/a` value, excluded like skip but reported, would be fairer.
18. Nothing slow in parity.py or reviews.py; both ran first time, under a second.

## What a person would need to do by hand

- Click "Start a take" and choose a screen, window or tab in the browser's picker; grant microphone permission. getDisplayMedia needs a real user gesture, so no script can test the recording.
- Confirm the scope in recon step 1 (the skill wants a yes).
- Take reference screenshots of the original from public pages or their own account into `replica/screens/`, and clone screenshots at 1440x900 and 390x844 into `replica/clone-screens/` for imgdiff.
- Read Loom's terms before using their own account to study it (the skill says to check).
- Collect Google Play, G2, Capterra, Trustpilot and Reddit reviews by reading in a browser and copying rows; the skill forbids scraping those.
- Read the 3 and 4 star reviews and the "low ratings that matched no theme" list in feedback.md by hand (the skill says this is often the best part).
- Keyboard-only walk, 390 px check, console error check.
- Ask a lawyer about any comparison page naming the original (the skill says so).

## Files

Scratch repo: `rehearsal-loom/replica/{canva-size.md, recon.md, features.csv, architecture.md, build-log.md, reviews.csv, appstore-reviews.json, feedback.md, parity.txt}`, `rehearsal-loom/app/` (the Next.js slice), `rehearsal-loom/TIMELINE.md`.

## Browser QA (6 Oct 2026, 16:37 UTC, Claude's browser pane, dev server on 3777)
- Home page renders: title, optional title field, microphone checkbox, "Start a take" button. No console errors.
- Clicking "Start a take" calls the screen picker. The pane blocks device capture, so the page showed its quiet state: "No screen was chosen. Nothing was recorded." That is the designed cancel path, working.
- Share page /v/5qXy-M-z78 renders: title, "4 views, recorded 4 min ago, 4 s", player, Copy link, Download, Record your own. No console errors.
- Not tested: an actual screen recording. Needs a real browser and a real click (Henry, on camera).
- Screenshots: `02_graphics/rehearsal/qa-home.jpg`, `qa-home-cancel-state.jpg`, `qa-share-page.jpg`.
