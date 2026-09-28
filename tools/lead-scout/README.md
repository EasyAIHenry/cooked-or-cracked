# Lead Scout — daily Cooked or Cracked lead finder

Runs every morning (scheduled task `cooked-or-cracked-lead-scout`, 8:00 AM, Claude desktop app must be open).
Output: `runs/YYYY-MM-DD/report.md` → top creators, episode leads (fresh reels ≥2.5x the creator's own median), today's 3 picks, new faces.

## Files
- `watchlist.json` — `creators` (always scanned), `candidates` (scanned, promoted from discovery), `pending` (found, awaiting vetting), `dropped` (never scan), `hashtags` (discovery).
  Edit by hand anytime: move a handle between lists.
- `history.json` — rolling 30 days of reels, so daily scrapes stay small but medians stay honest.
- `profiles.json` — cached follower counts (refreshed Mondays).
- `seen.json` — reels already reported (marks NEW).
- `score.py` — the math. `python3 score.py --reels <ds> [--details <ds>] [--discovery <ds>]`

## Focus (Henry, 2026-09-28)
Automation only: agents, n8n/Make/Zapier, Claude Code, workflows, builds. No visual-gen (AI video/image/ad showcases), no news pages.
score.py tags each caption automation / visual / unclear (keyword lists `AUTO_KW`, `VISUAL_KW`), hides visual leads, and only lets automation captions into New faces. Every handle and reel in the report is a clickable link.

## How a reel becomes a lead
- Posted in the last 7 days (fresh pinned reels count), creator has ≥4 reels in history.
- Plays ≥ 2.5x that creator's 30-day median (beats their own normal, not just big-account noise).
- Score = outlier multiple (capped 10) × √plays, decays with age.
- Comment rate >2% of plays is flagged `comment-gate` (a "comment X for the link" funnel inflating engagement).

## Cost (use Apify sparingly)
- Daily reels: 4 per profile, last 4 days, cap $0.35. Hashtag discovery only Mon/Thu (12 per tag, cap $0.15). Details only for new profiles plus the first Monday of the month.
- Target: under $0.35/day (about $10/month). New candidates cost a one-off baseline scrape (8 reels), so there's a max of 3 promotions a day.
