# Cooked or Cracked

New here? Read `START-HERE.md`.

Henry Chua's creator-review reel series. A creator claims an AI tool does X. Henry tests it with the timer on screen and gives a verdict: cooked or cracked.

This repo is the operating manual. It holds the SOP, the Claude Code skills that run each step, the daily lead-scout tool, and the text of every episode (scripts, research, captions, retros). Video and audio stay in the Drive folders.

## Layout

| Path | What |
|---|---|
| `sop/` | The standard operating procedure, one file per step, in order |
| `skills/cooked-or-cracked/` | The series skill. Pipeline, writing rules, learning log, supers library, episode templates |
| `skills/creator-audit/` | Apify + Gemini audit of a reel (transcript, beats, baseline, verdict) |
| `skills/henry-scrapbook-reel/` | The edit template for ChatCut Desktop (paper stamps, table, scoreboard, sting, captions, export). `references/mg/` has every template graphic as code, `references/shaders/` the skin shader, `references/export-scripts/` the composite script |
| `skills/henry-guide-pdf/` | The lead-magnet PDF format |
| `tools/lead-scout/` | Daily Instagram scout that scores outlier reels from a watchlist |
| `episodes/` | One folder per episode: scripts, research, captions, retro |
| `students/` | The editor's guide: what the series is, how the edit is built and replicated. Read-only for students; Henry alone changes this repo |
| `guides/` | Onboarding guides for handing a workflow to a teammate (first: COTE social edits in ChatCut) |

## Install the skills on a new machine
```
git clone https://github.com/EasyAIHenry/cooked-or-cracked.git
cp -r cooked-or-cracked/skills/* ~/.claude/skills/
```
`creator-audit` needs `GEMINI_API_KEY` in the shell and `pip install google-genai requests`. Scan any skill before installing it: `skillspector scan --no-llm <path>`.

## Keep it in sync
Edit the skills in `~/.claude/skills/` and the episodes in `Content Creation/DRIVE_Cooked-or-Cracked_Ep*/`, then run `./sync.sh`. It copies the text files in, refuses to commit if it sees a key, and pushes.

## Episodes
| Ep | Subject | Claim | Verdict | Cut |
|---|---|---|---|---|
| 1 | @nateherkai, the Generate skill | Claude makes video for cents via Higgsfield or Kie | CRACKED (Kie cheapest) | 2:12, posted 25 Sep 2026 |
| 2 | @nateherkai, 5 free design tools | Taste, Impeccable, Playwright CLI, Awesome Design, img2threejs turn Claude into a designer; Henry built a site for a shop with them | CRACKED for layout, 7/10 (visuals need Higgsfield) | 1:29, delivered 27 Sep 2026 |

The learning log in `skills/cooked-or-cracked/references/learning-log.md` records what each episode's numbers taught and what changed.
