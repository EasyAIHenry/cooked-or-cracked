# Ep6 pointers. Read these while the test plays on screen and film yourself.

Not a script. Say each point your own way. Bold = the number or name to say when it is on screen. Brackets = fill after the test. Target **55 to 60 s**, about 130 spoken words.

Subject: Ben Kimball (@benkimball.ai), "Claude can now WATCH videos with this skill". Repo: `bradautomates/claude-video`, skill `/watch`.

## What made Ep2 go viral, applied here
| Ep2 (44.6K views, 6.9% saves) | Ep6 |
|---|---|
| Finished result on screen from 0:00 (Nate's window cut through designs every 0.5 s) | Mini box from frame 0: Claude's timestamped breakdown of Ben's reel scrolling. Same frame = cover. |
| Countable, free promise ("five free tools") | "**One command**, free Gemini key" |
| Sting by 0:03.5, no intent line pushing it late | First line at 0:00 carries the claim and the test in one breath. Sting at 0:03. |
| New stamp every 2 s | 14 stamps listed below |
| "Can't believe it" reaction at the reveal | Reaction when /watch reads Ben's own on-screen link |
| Money line near the end ($1,000 site) | Cost of the run + what you'd charge / save |
| Real-life beat before the price | Creators pulling competitors' hooks |
| Keyword gives a kit, not only a guide | WATCH = install steps + 5-prompt pack |

## The test (decides the verdict, run before filming)
- In Claude Code: install with `/plugin marketplace add bradautomates/claude-video` then `/plugin install watch@claude-video`. Time it.
- Prompt, same for both runs: `/watch https://www.instagram.com/reel/Dd7wHK0s6L3/ List every step he shows, every link on screen, and the hook in the first 3 seconds, with timestamps.`
- Run 1 Gemini engine (free AI Studio key). Run 2 `--engine local` (no key).
- Pass: it reads the Instagram link, gets the steps right with timestamps, and reads the on-screen link. Fail: Instagram blocks the download, or it only repeats the transcript.
- Gotcha to watch for (untested): yt-dlp often fails on Instagram without login. If it does, say "my setup" and show the fix (`--cookies-from-browser`).

## 0:00 to 0:03, hook (face, Ben's reel muted in the window on the "GIVE CLAUDE EYES" panel, mini box top-left)
- This guy says one repo lets Claude **watch any video**. So I made it watch his.
- (Sting lands at 0:03 over the mini box. Stamp: ONE COMMAND)

## 0:04 to 0:14, install (screen: Claude Code, sped up)
- Two commands in Claude Code. Took **[x] minutes**.
- It asked **[n] questions**. Detail level, and how to transcribe.
- It does not work in normal Claude chat. Code tab only.

## 0:15 to 0:28, the result (screen: the /watch output beside his reel)
- Pasted his Instagram link. **[It watched it / Instagram blocked it]**.
- It found **[6] steps** with timestamps.
- (Reaction beat) It read the link on his screen. That repo **doesn't exist**. The real one is a different account.
- Comment **WATCH** and I'll send the real one.

## 0:28 to 0:32, verdict (face)
- **[score]/10. [COOKED / CRACKED].**
- One line why: **[the receipt, e.g. "it saw what the transcript missed"]**.

## 0:32 to 0:42, who it's for (face, real-use cards under the chin)
- If you make content: give it **10 competitor reels**, get every hook back in a list.
- If you edit: give it your cut, it tells you where it drags.
- Lectures and long YouTube videos: ask for the **one minute** that matters.

## 0:42 to 0:48, money line (face)
- Gemini key is **free**. My run cost **[$0.00x]**.
- I was paying **[Apify + Gemini]** for this before.

## 0:48 to 0:58, save frame and CTA
- Screenshot this. (scorecard held 2 s)
- Comment **WATCH**. I send the real repo, the install steps, and my 5 prompts.

## Stamps (one every 2 s, never repeat a phrase)
ONE COMMAND · WATCH ANY VIDEO · HIS OWN REEL · [X] MIN INSTALL · CODE TAB ONLY · [N] QUESTIONS · INSTAGRAM LINK · [6] STEPS FOUND · FAKE REPO LINK · [SCORE]/10 · 10 COMPETITOR REELS · FIND THE DRAG · FREE KEY · COMMENT WATCH

## New supers for this episode (build before the edit)
1. Watch-eye mini box: the /watch output scrolling, framed like the Ep2 cone box, 0:00 to the sting. Also the cover.
2. Timestamp ticker: "0:08 GIVE CLAUDE EYES" lines typing in, synced to the reel frames they point at.
3. Link strike: Ben's on-screen URL with a red line through it, real repo URL stamping under it.
4. Engine split card: GEMINI (free key, fastest) vs LOCAL (no key, private), one tick each from the test.
5. Hook list: 10 reel thumbnails collapsing into a numbered hook list (real-use beat).

## Scorecard (save frame, fill after the test)
| Claim | Result | Receipt |
|---|---|---|
| One repo, Claude watches video | [works/meh/cooked] | [what the screen showed] |
| Paste link, it installs itself | [ ] | [x min, n questions] |
| Works on Instagram links | [ ] | [watched / blocked] |
| Sees what transcripts miss | [ ] | [read the on-screen link] |
| Free | [ ] | [$ for the run] |

## Don't say
- That it installs "three skills". It ships one: watch.
- That it works in Claude chat or Cowork. The README says it does not.
- Dates in the audio. Keep them in the caption.
- "Fake" about Ben himself. Say the link on screen doesn't match the real repo.
