# Start here

This repo is the operating manual for **Cooked or Cracked**, Henry Chua's creator-review reel series: a creator claims an AI tool does X, Henry tests it with the timer on screen, and gives a verdict.

It is public so you can follow the process. The style and the rules are Henry's; only he changes this repo. Read it, clone it, install from it, cut with it. Do not open pull requests, and do not present the style as your own.

## What you get when you clone it
- **The process.** `sop/`: eight steps from picking a subject to the retro, with who does what and the time budget.
- **The rules.** `skills/cooked-or-cracked/`: the series skill an agent runs, the writing rules, the learning log (what each episode's numbers taught, newest first), the supers library, the episode templates and `scripts/join_audit.py`.
- **The style, as code.** `skills/henry-scrapbook-reel/`: the edit template for ChatCut Desktop with every layout number and gotcha, and `references/format-ep3-v7.md`, the approved reel format; `references/mg/` holds the template graphics as ChatCut motion-graphic JSX (paper stamp, scoreboard, sting title, confetti, pill, window frame, the Ep2 supers); `references/shaders/` the skin-smoothing shader; `references/export-scripts/` the composite script; plus the sting and the two sound cues.
- **The other three skills.** `skills/creator-audit/` (Apify + Gemini audit of a reel), `skills/henry-guide-pdf/` (the lead-magnet PDF format, with CSS and examples) and `skills/adobe-podcast-enhance/` (the voice cleanup every episode gets).
- **Five episodes on paper.** `episodes/`: scripts, pointers, cut lists, shot maps, de-myth sheets, audit reports, delivery reviews, captions, MG code, the lead-magnet HTML and the Ep1 insights retro.
- **The Ep2 build.** `sites/`: the Pompette site and QR menu Henry built on camera.
- **The editor's guide.** `students/`: 24 pages on what the series is, how the edit is built and the three cuts an editor has to learn.
- **The scout.** `tools/lead-scout/`: the daily Instagram outlier finder.

## What you do not get
- **Footage.** Camera takes, screen recordings, the reviewed reels, every cut and export. Media never enters this repo. Henry shares a Drive folder per episode with the people cutting for him.
- **Henry's ChatCut projects.** You cannot open his timelines. You rebuild the graphics from the code in `references/mg/` in your own project. Four Ep1 assets (compare table header and rows, pricing-tier card, Higgsfield logo tag) are not exported yet; the static table is in `episodes/ep1_nateherk/02_graphics/`.
- **Rebuild scripts that run as-is.** `episodes/*/01_scripts/rebuild_v*.py` carry Henry's asset and track IDs. Read them as worked examples of how a cut is placed, not as tools.
- **The lead-magnet PDFs** (gitignored; the HTML is here) and the scout's history files.
- **Accounts and keys.** ChatCut Desktop (Pro decides the export path), Higgsfield, a Gemini key for the audit and the unprimed listen, Apify for the scout. All yours.
- **Henry.** The subject choice, the one-hour test on camera, the verdict, the approval of every pass, and the calls the log does not cover yet.

## Three ways to use it
1. **Study it.** Read `sop/00-overview.md`, then the learning log, then `students/editor-guide.html` (or build the PDF with `students/make-pdf.sh`). You will know why every rule exists.
2. **Replicate it with your own footage.** Install the skills into your agent (`cp -r skills/* ~/.claude/skills/` for Claude Code; Codex reads the same `SKILL.md` files; scan first with `skillspector scan --no-llm skills/`). Connect ChatCut Desktop to the agent. Pick a claim, test it for an hour with the timer on screen, film a take, then run `sop/06-edit.md` pass by pass. Start small: rebuild one paper stamp and the scoreboard from `references/mg/` before you attempt a whole episode.
3. **Cut for Henry.** Everything in mode 2, plus his Drive folder, his day-one settings (which ChatCut login, where previews go, a Gemini key) and his "apply" between passes. The editor's guide is written for this.

## Where you need Henry, and where you explore
Ask Henry for: the episode's beat sheet decisions (length, where the verdict lands, captions on or off), the four places the repo disagrees with itself (listed on the last page of the editor's guide), anything not in a `SKILL.md` or the learning log, and the four Ep1 assets above.

Explore on your own: the code in `references/mg/` (change the props, keep the look), the join audit on your own takes, the pause rules on your own speech, the de-myth sheet on a claim of your choice. When something you learn should become a rule, send Henry the frame, the timestamp and the reason. He decides, edits the skill, syncs, and you pull.

## Keep it in sync
Henry edits on his Mac and runs `sync.sh`. Pull before every episode and copy the skills again; a rule is real when it is in the learning log or a `SKILL.md`.
