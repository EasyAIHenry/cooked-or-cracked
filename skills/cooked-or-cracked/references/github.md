# GitHub: EasyAIHenry/cooked-or-cracked

Local working copy: `~/Content Creation/cooked-or-cracked-github/`. It holds the SOP, copies of the four skills, the lead-scout tool and the text files of every episode (no video, no audio over 1 MB, no keys).

After any change to a skill, an episode's scripts, or the learning log, run:
```
bash "~/Content Creation/cooked-or-cracked-github/sync.sh"
```
It copies the canonical files from `~/.claude/skills/*` and `Content Creation/DRIVE_Cooked-or-Cracked_Ep*/` into the repo, commits with a dated message and pushes. Never commit `04_raw-footage`, `05_cuts`, `.mp4`, `.MOV`, `.wav` over 1 MB, `.env` or anything with a key.
