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

## How a reel becomes a lead
- Posted in the last 7 days, not pinned, creator has ≥4 reels in history.
- Plays ≥ 2.5x that creator's 30-day median (beats their own normal, not just big-account noise).
- Score = outlier multiple (capped 10) × √plays, decays with age.
- Comment rate >2% of plays is flagged `comment-gate` (a "comment X for the link" funnel inflating engagement).

## Cost
Apify `apify/instagram-scraper` ≈ $0.0027/result on the free tier → roughly $0.60–1.00/day (~$20–30/month).
Cut it: fewer hashtags, lower `resultsLimit`, or trim `creators`.
