---
name: creator-audit
description: Audit whether a short-form creator "knows what they're doing". Input an Instagram reel / TikTok / Shorts URL; outputs transcript, beat-by-beat breakdown, hook/structure/CTA scoring, a baseline vs the creator's recent posts, and a verdict. Use when Henry asks to analyze, vet, rate, or expose a creator or reel, or for the "Cooked or Cracked" series.
allowed-tools: Bash, Read, Write, WebFetch, mcp__Apify__call-actor, mcp__Apify__get-dataset-items
---

# Creator Audit

Gemini watches the actual video (audio + frames). Nothing is inferred from captions alone.

## Pipeline

1. **Metadata + video URL (Apify, Henry's account)**
   - Actor `apify/instagram-scraper`, `directUrls:[reel url]`, `resultsType:"posts"`, `resultsLimit:1`.
   - Also pull baseline: same actor with the creator's profile URL, `resultsLimit:12`, `onlyPostsNewerThan` ~6 weeks back.
   - Take `videoUrl`, `videoPlayCount`, `likesCount`, `commentsCount`, `caption`, `videoDuration`.
   - yt-dlp fails on Instagram without login; do not use browser cookies.
2. **Download + analyze**
   ```bash
   # GEMINI_API_KEY must already be exported in the shell (or in a .env next to the script). Never read it from another tool's config.
   python3 ~/.claude/skills/creator-audit/scripts/audit_reel.py --video-url "<videoUrl>" --meta meta.json --out report.md
   ```
   The script auto-selects the newest Gemini model that supports video (`--list-models` to see), so it does not go stale when models are retired.
3. **Baseline math** (do in Python, not by eye): median plays of last 12 posts, multiple = target/median, like rate, comment rate. Comment rate >2% of plays = comment-gate funnel.
4. **Verdict format** (concise, Henry style): Score /10, COOKED or CRACKED, 3 moves that work, 3 leaks, 1 thing to steal.

## Deps
- venv or global: `pip install google-genai requests` (yt-dlp optional, for YouTube/TikTok).
- ffmpeg optional (frame grid). If `ffprobe` dies with a missing `libx265` dylib, run `brew reinstall ffmpeg`.
