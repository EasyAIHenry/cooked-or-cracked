# Ep7 script v3: my 30-day challenge, then vs now, verdict and risks

Point form, in your words (bold = what you said in your voice notes). No names, no handles: "this reel", "these free skills".
I cut the screen footage under each point as you say it. Pause about 1 s between points so the cuts land. Hands off the mouse.
Target 80 to 95 s. Keyword GHOST.

## Talk these (in order)

1. **Hook.** People told me I have a **ghostwriter**. **It's just AI.**
2. **The challenge.** In May I ran a **30-day LinkedIn challenge**. 36 posts in 30 days. Claude wrote them, **Buffer** posted them. The research and the manual work were still on me.
3. **What I paid.** **A Max plan for Claude.** **A one-year Buffer plan, on two platforms, LinkedIn and Instagram.**
4. **How it went.** 36 posts, 9,600 impressions. Each post got a median of 134. The rest of my year, 217. Engagement stayed at 1.3%. More posts did not mean more reach per post.
5. **The claim.** Then this reel: free Claude skills run your whole LinkedIn, inside your Claude plan, and you won't get flagged. That came out after my challenge. So I tested it.
6. **Install, safely.** Free. 11 skills, not 12. **Before you install any repo, check it** with SkillSpector, NVIDIA's free scanner. This one scored 9 out of 100. Low risk.
7. **Does it run my LinkedIn.** It writes. It does not post. Its own page says so. So I dropped a poster, a photo and a video. Claude checked my old project files, wrote the post, and Buffer published it. **About 10 minutes.**
8. **Won't get flagged.** Their own checker flagged 45 of my 105 real posts. The same posts people thought a ghostwriter wrote.
9. **Then vs now.** The skills are free. My bill didn't change: same Claude Max, same Buffer. What changed is time. The research I did by hand in May, Claude now does from my own files. Skip Buffer, and you copy and paste.
10. **Keyword, midpoint.** Comment GHOST and I'll send you my version.
11. **Verdict.** [COOKED or CRACKED] [score out of 10]. **If you just started and don't really know what to do, use Buffer. Use Claude once you're experienced in posting.**
12. **The risk.** **A third-party platform like Buffer is usually safer.** It's an approved LinkedIn partner, and LinkedIn bans bots that post, comment or like.
13. **Through Claude, you won't know what you're giving access to.** My Buffer connection alone holds 9 permissions. [optional: when the browser agent opened my live post, it saved an edit I didn't ask for]
14. **Be careful of the repos you install.** **Always check** with SkillSpector first. And read every post before it goes out. It wrote "tonight" for a class that was tomorrow.
15. **CTA.** Comment GHOST and I'll send you my version. Screenshot the scorecard.

Also film: a silent reaction scrolling the reel on your phone (hook), and a straight-to-lens thumbs-up hold for the sting.

## What I show under each point (edit map)

| # | Screen | Source |
|---|---|---|
| 1 | You full frame. Small window: the reel's "Algorithm check, all clear, won't get flagged" screen, muted. Sting at 0:03 | `02_graphics/hook/reel-wont-get-flagged-24.8-32.2.mp4`, egg title MG |
| 2 | Buffer Sent list scrolling through May; stamp "36 posts / 30 days" | to capture: Buffer Sent, May; stamp MG |
| 3 | Claude pricing card, Max; Buffer pricing card; Buffer channels LinkedIn + Instagram | `receipts/13-claude-pricing-pro-25usd.jpg`, `receipts/12-buffer-pricing-free-5usd.jpg`, Buffer sidebar |
| 4 | Bar chart: median 134 vs 217, ER 1.3% vs 1.3% | to render from `06_research/linkedin-baseline/posts.csv` |
| 5 | The reel's "won't get flagged" mockup | hook clip |
| 6 | Repo README, "11" circled; SkillSpector 9/100 LOW SAFE | `receipts/01-repo-readme-top.jpg`, `ep7-groundwork-seg02-receipts.mov` first 25 s |
| 7 | README fine print "do not post"; your CleanShot of the prompt; Buffer composer, Now, Publish Now; Sent 154; live on LinkedIn; times 17:34 and 5:44 PM | `receipts/02`, `04_raw-footage/henry-cleanshot/henry-prompt-ai-driving-license-1734.mp4`, `ep7-seg07-publish-live.mov` 0:00 to 1:50, `receipts/10`, `receipts/11` |
| 8 | Counter 45 / 105 over your posts; the "delve" to "look" broken line | render from `detect-results-2026.json`, `01_scripts/test-inputs/rehearsal-round1-humanizer-broke-it.txt` |
| 9 | Then vs now split card: same two bills, hours vs 10 minutes | new MG |
| 11 | Scorecard builds, stamp | scorecard MG |
| 12 | LinkedIn User Agreement 8.2 item 13 highlighted; Buffer x LinkedIn | `receipts/14-linkedin-user-agreement-8-2-item13-bots.jpg` |
| 13 | Buffer API page, "Claude, 9 permissions" circled; optional "Changes saved" | `receipts/16-buffer-api-claude-integration-9-permissions.webp`, `receipts/15` |
| 14 | SkillSpector report; "Tonight" crossed out, "Tomorrow night" written in | `06_research/skillspector-scan.txt` render, `linkedin-posts/.../post.txt` vs live |
| 15 | Save frame: scorecard held 2 s, GHOST stamp | scorecard MG |

## Scorecard (for the save frame)
| | May challenge (before) | Now: free skills + Claude + Buffer |
|---|---|---|
| Who posts | Buffer | Buffer. The skills alone don't post |
| Research and writing | me, by hand | Claude, from my files, about 10 min a post |
| Monthly bill | Claude Max + Buffer (2 channels) | the same. Skills are free |
| Flagged by the checker | 45 of 105 posts this year | no promise of "won't get flagged" |
| Best for | beginners: Buffer | experienced posters: Claude |
| Watch out | | what you give access to, unscanned repos, facts |

## Receipts (dated 4 Oct 2026)
- Challenge window 4 May to 2 Jun 2026: 36 posts on 22 days (34 via Buffer), 9,600 impressions, 128 reactions, 11 comments, median 134 impressions, median ER 1.31%. Rest of 2026: 69 posts, median 217, ER 1.32%. Source: Buffer, `06_research/linkedin-baseline/posts.csv`.
- Claude pricing (Singapore, incl. 9% GST): Pro US$25 a month billed yearly (US$30 monthly), Claude Code included; Max from US$149.99 a month. claude.com/pricing.
- Buffer pricing: Free (3 channels, 10 scheduled posts per channel, API included); Essentials US$5 a month per channel billed yearly. buffer.com/pricing.
- LinkedIn User Agreement 8.2, item 13: no "bots or other unauthorized automated methods to ... create, comment on, like, share, or re-share posts".
- SkillSpector is NVIDIA's open-source scanner (installed from github.com/NVIDIA/skillspector). This repo: 9/100, LOW, SAFE.
- Buffer API page: the Claude integration holds 9 permissions; the personal key 6.
