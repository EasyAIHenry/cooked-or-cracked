# Ben Kimball (@benkimball.ai), "Claude can now WATCH videos with this skill" (audit 1 Oct 2026)

Reel: https://www.instagram.com/reel/Dd7wHK0s6L3/ · posted 1 Oct 2026 01:41 UTC · 49.5 s · file in `03_reference/`

| Metric | Value (11 h after posting) |
|---|---|
| Plays | 4,005 |
| Likes | 82 (2.0%) |
| Comments | 144 (3.6%, gate REPO) |
| Median plays, his 8 other posts since 29 Sep | 2,184 |
| Multiple over median | 1.8x |

He posts 3 to 4 reels a day around 01:00 UTC. Two old pinned reels did 1.5M and 703K; recent ones sit at 1.5K to 4K, with one at 55K (Google tools). Early numbers: the subject is the topic, not his reach.

Gemini video-watch not run (GEMINI_API_KEY not set in this shell). Transcript: faster-whisper small.en (`benkimball-transcript.txt`). Frames: 1 fps sheet (`benkimball-reel-sheet.jpg`).

## The claim, in his words
- "As of right now, Claude cannot watch videos. It'll read the transcript and it misses like half the details."
- "With this new GitHub repo, you can basically give your Claude eyes."
- "Grab this link, paste it into your Claude Code and say, hey, download it and apply these skills."
- "All you gotta do is do backslash watch and then paste the link to whatever social media you want. YouTube, Instagram, TikTok."
- "It can analyze the structure of the video, find the best hooks, and understand everything that's happening on screen as if it were a viewer."
- CTA: comment REPO, said twice (0:13 and 0:46).

## Format (what to steal)
- Talking head holding a rock, black-panel motion graphics every 3 to 5 s: "CLAUDE CAN'T WATCH", "GIVE CLAUDE EYES", "DOWNLOAD THE SKILLS 4/10", "ANSWER A FEW QUESTIONS", "USE /WATCH", "SHORT OR LONG FORM". Word-by-word captions.
- Step counter ("4/10") on the panels: gives a countable shape even though only 6 steps are shown.
- One problem line, one fix line, then steps. Gate twice.

## What does not match the repo (checked 1 Oct 2026)
- On-screen repo link reads `github.com/creator-tech/claude-skills`. It returns 404 (checked 1 Oct 2026 20:45 SGT; the `creator-tech` account exists). The real repo is `bradautomates/claude-video`.
- The panel shows three skills installing (Content Strategy, Script Writing, Hook Generator). The repo ships one skill: watch.
- "Paste the link into Claude" works only in Claude Code. README: not Claude Chat, not Cowork.
- Instagram links go through yt-dlp. Our own creator-audit notes say yt-dlp fails on Instagram without login; the README makes cookies opt-in. Untested.
- Two engines: Gemini (free AI Studio key, default `gemini-3.7-flash`, uploads the file to Google and deletes it) or local (ffmpeg frames + captions/Whisper, no key). Needs Python 3.10+, ffmpeg, current yt-dlp.

## Score (format only, before Henry's test)
7/10 on craft: clear problem, clean panels, gate twice. Leaks: placeholder link on screen, "10 steps" counter with 6 shown, no proof that it watched anything (no output on screen).
