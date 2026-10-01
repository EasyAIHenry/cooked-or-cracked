# Mr. Pynk (@mr.pynk), "This Claude skill creates entire Vox style animations" — audit (1 Oct 2026)

Reel: https://www.instagram.com/p/Dct7Hc1OO5V/ · posted 31 Aug 2026 20:18 UTC · 50 s · 1080x1920

| Metric | Value |
|---|---|
| Plays | 57,160 |
| Likes | 1,780 (3.1 %) |
| Comments | 5,065 (8.9 %, gate PYNK) |
| Median plays, last 10 video posts | 16,855 |
| Multiple over median | 3.4x |

Gemini video-watch not run (GEMINI_API_KEY not set in this shell). Transcript from whisper medium.en, frames from a 1 fps contact sheet.

## The claim, in his words
"This Claude skill can create entire Vox style animations... which means you can now create viral motion graphics in minutes, what would have taken days of professional editing. Install the skill, then inside Claude describe the exact animation you want. The skill uses its internal motion design rules to generate a full video generation prompt. Take that into your favourite video model, Higgsfield, Seedance 2.5, and as a result get a premium Vox style animation."

Tools named: Claude (Claude Code skill), Higgsfield, Seedance 2.5. Numbers: "minutes" vs "days". CTA: comment PYNK. Skill delivered via Notion page, community upsell to Skool (PYNK Society).

## What the skill actually is (verified 30 Sep 2026)
- 44 KB folder: SKILL.md (282 lines), two style reference files (Mixed Media, Paper Diorama), one 66-line ffmpeg assembly script. No network calls in the skill itself.
- It writes prompts and a script; the user runs the image and video generations in their own generator and drops clips back. Voice is edge-tts (free, Microsoft endpoint). Final cut is the shell script: 10 s per scene, voice delayed 0.25 s, ambience at 0.22.
- skillspector: 78/100 HIGH, three flags, all static false positives (UI rule, dot-folder script, rm -rf of its own scratch dir).

## Henry's test (30 Sep 2026, receipts)
| Item | Result |
|---|---|
| Topic | Amelia Earhart, Taraia Object, expedition sails 7 Oct 2026 |
| Look | Paper Diorama, "lagoon" style key, Nano Banana Pro on Higgsfield, 2 credits |
| Clips | 6 x 10 s, Seedance 2.5 omni-reference 720p 9:16 with audio, 70 credits each = 420 |
| Voice | edge-tts Ryan (en-GB), free |
| Time | 40 min from first prompt to final.mp4 with the camera rolling between steps (skill run 22:50, final 23:30 local); Henry says "within 30 minutes" on tape |
| Cost | 424 Higgsfield credits (Henry: "less than $15") |
| Gotchas | Higgsfield intercepts stylized prompts with a preset; 429 rate limit at 5 concurrent Seedance jobs; two voice lines under 7.5 s needed extra words; assembly output at -21 LUFS needed a loudness pass |
| Verdict (Henry, on tape) | "this is cracked and I love it" |

## What works in his reel (steal)
1. Claim in 5 s with the collage animating behind it (5.2 to 11.9 s).
2. Shows the result at 33 to 36 s (Pisa tower) before the CTA.
3. Every product reel uses the same gate word, so the funnel compounds (8.9 % comment rate).

## Leaks
1. Never shows the time or the credits it took.
2. The "internal motion design rules" are two markdown files of prompt vocabulary.
3. The skill does not touch the video model; the user does every generation by hand unless an agent runs them.
