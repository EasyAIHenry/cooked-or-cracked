# Ep7 de-myth sheet: "Claude can run your entire LinkedIn, free" (4 Oct 2026)

Internal file. Names stay here for tracking only; scripts, captions, guide and Henry's repo never name or tag the reel creator or the repo author (Henry, 4 Oct 2026).

## Subject
- Reel: instagram.com/p/DeChOhIPszm (@nick_saraev), posted 3 Oct 2026, 35.7 s.
- Stats at 16 h: 74,273 plays, 1,391 likes, 2,778 comments. Comment rate 3.7% (comment-gate funnel). 0.61x his 11-post median (121,203), still climbing.
- Gate keyword: AGENT. CTA sends the repo link by DM.
- Repo it promotes (README on screen at 0:03): github.com/Jakeschincariol/linkedin-agent-skill, commit add2c23, 7 Sep 2026, MIT, 11 skills.
- The reel creator and the repo author are two different people.

## Security gate
- skillspector 2.11.2 `--no-llm`: 9/100, LOW, SAFE. Two MEDIUM "session persistence" flags = the skills write notes to `~/.claude/linkedin/` (plan.md, log.md). Benign.
- Own sweep: no network calls, no shell calls, no invisible characters, no injection phrases. Python only reads and writes local text files. Outbound links: the author's site and LinkedIn's user agreement.
- Installed 4 Oct 2026 16:55 SGT: `cp -R skills/li-* ~/.claude/skills/`. All 11 load as skills.

## Claim check (reel vs repo, verified 4 Oct 2026)
| # | Reel says | Repo actually | Status |
|---|---|---|---|
| 1 | "Claude can now run your entire LinkedIn" | README: "These skills do not post to LinkedIn, and they should not." Writes text, you paste it. | Not true |
| 2 | "completely free" | Skills are free (MIT). Claude Code needs a paid Claude plan. | Half |
| 3 | "12 LinkedIn skills" | 11 (README says "Eleven") | Wrong number |
| 4 | Writes posts, handles comments, optimises profile | li-post, li-comment, li-reply, li-profile exist and do this | True |
| 5 | "starts by interviewing you about your career" | li-post reads a voice.md template or asks for 3 past posts. li-plan asks 4 questions. No interview flow. | Stretched |
| 6 | Plans the week: topics, hooks, best time | li-plan does this. Times are a fixed default (Tue to Thu, 7:30 to 9:30 am), not from your data | True, generic |
| 7 | "20 proven formulas" | 21 hook formulas in hooks.json. No source for "proven". | Wrong number |
| 8 | "checks your post against LinkedIn's latest algorithm rules" | Fixed rules typed into li-post (no links in body, 3 hashtags, 900 to 1,300 chars). Nothing is fetched or updated. | Not true |
| 9 | "removes anything that sounds AI-written, preventing you from getting flagged" | The humanizer is real (tested below). The repo's own README says it cannot promise detector verdicts and tells Claude never to say "undetectable". | Overclaim |
| 10 | Mockups: /linkedin-post-writer, /linkedin-comments, "won't get flagged" | Real commands are /li-post, /li-comment. No such screen exists. | Mockups, not the product |

## Repo numbers (counted, not read)
- hooks.json: 21 formulas. slop.json: 81 words + 32 phrases = 113 terms, 17 invisible classes, 11 typographic swaps, 11 structural tells. rubric.json: 12 items, 100 points. All match the README.

## Humanizer bench (06_research/humanizer-test/)
- Sloppy test draft: 21 artefacts removed. Panel 25.5 FLAGGED to 58.1 REVIEW.
- Catches: zero-width characters, em dashes, curly quotes, "delve", "leverage", "It's not just X, it's Y" (exact wording).
- Misses: "delved", "delving", "leveraged" (no word endings), "isn't just X, it's Y", "The result? Everything changed." on one line, triads with multi-word items, "What do you think?".
- Swaps are blind to meaning: "unlock growth" became "get growth".
- Leaves the rocket emoji and the hashtag wall for you to fix (by design, flagged).

## Henry's baseline (Buffer, read only, pulled 4 Oct 2026)
- Buffer org "My Organization", LinkedIn channel "Henry Chua". 153 posts since 2021; 105 in 2026 (97 via Buffer, 8 native).
- 2026 medians: 196 impressions, 109 reach, 2 reactions, 0 comments, 1.32% engagement rate.
- Most posting days in any 30-day window: 22. Longest unbroken daily run: 12 days (15 to 26 Jun). [Henry to confirm which 30 days he means.]
- His posts through the repo's detector: 45 FLAGGED, 40 REVIEW, 20 PASS (median 53.3). 0 em dashes in 105 posts. Slop and fingerprint checks score 100: his workflow already does the cleanup. What drags the score: SPECIFICITY (fewest numbers and names) on 64 of 105.
- So the detector flags 43% of posts that readers took for a human ghostwriter.

## What "works" means (set before the test)
- Pass: installs and runs first try; a draft Henry would post with 2 edits or fewer; faster per post than his current flow; blind readers pick it as often as his own.
- Fail: voice is off, needs a rewrite, or slower than his flow.

## Test plan [to fill once Henry sends inputs]
- Same 4 raw ideas through both flows: A = his current AI + Buffer flow, B = /li-post with voice.md built from his 3 best posts.
- Timer on screen for both. Count edits before he would post.
- Blind poll: A vs B drafts, "which one did a person write?" on IG story and LinkedIn.
- Optional live round: alternate A and B posts for 2 weeks, same slot. n = 4 each is too small for a firm call; report it as a direction.
- [verdict]

## Rehearsal, 4 Oct 2026 17:10 to 17:17 (off camera, free skills side only)
- /li-post on a real idea (the 45 of 105 finding). Voice inferred from 3 posts into `01_scripts/test-inputs/rehearsal-voice.md`.
- Round 1: humanizer swapped words inside quotes. "It wasn't "delve" or "game-changer" either" became "It wasn't "look" or "big deal" either". It can't tell a word being mentioned from a word being used. Saved as `rehearsal-round1-humanizer-broke-it.txt`.
- Round 2 after a hand fix: 92.8 PASS, 987 characters, humanizer changed nothing.
- Pushed to Buffer as a draft through the claude.ai Buffer connector: post id 6ac219a57d53b827e0033d27, LinkedIn channel, unscheduled. Drafts count 9 to 10. Receipt still: `02_graphics/receipts/buffer-draft-created-1717.jpg`.
- So the free skills plus a Buffer connector can get a post into the queue. The skills alone cannot.
- Loader quirk: when /li-post runs with arguments, Claude Code's argument substitution eats the dollar amounts in the skill's own examples ("$12,000" showed up as "A through,000"). Cosmetic.

## Does the repo replace Buffer? (checked 4 Oct 2026, Henry's question after v4)
- **The repo cannot post.** README: "These skills write. You post." / "These skills do not post to LinkedIn, and they should not." `li-post/SKILL.md` line 73: "Never publish. This skill produces text. The user posts it." `li-comment/SKILL.md` lines 89-90: "Do not auto-post... Automated posting and scraping both violate LinkedIn's User Agreement".
- **Henry's test relied on Buffer.** The post was written by the henry-linkedin-drop flow, sent to Buffer as a draft through the claude.ai Buffer connector, images added in Buffer's composer, then "Publish now" in Buffer (receipts 06-11; Buffer Sent 153 → 154). He never opened Buffer himself, but Buffer did the posting.
- **A direct, LinkedIn-approved route does exist (not yet tested).** LinkedIn's self-serve "Share on LinkedIn" product: add it to your own LinkedIn developer app, grant the `w_member_social` scope once (OAuth), then `POST https://api.linkedin.com/v2/ugcPosts` posts text, links, images or video to your own profile. No partner review. Limits: 150 requests per member per day; the app must be tied to a LinkedIn Page; the access token lasts 60 days, then log in again (refresh tokens are partner-only). No built-in scheduling (posts immediately). Source: https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin
- So the README's line "There is no official API for posting to a personal profile without an approved partner app" is not accurate: the self-serve Share on LinkedIn product is that API.
- **Not allowed:** Claude driving linkedin.com in a browser to post (User Agreement 8.2, item 13).
- **Honest wording today:** "Claude writes it with the repo and posts it through my Buffer connection; I never open Buffer." To say "no Buffer", set up the direct API and test one real post first.
