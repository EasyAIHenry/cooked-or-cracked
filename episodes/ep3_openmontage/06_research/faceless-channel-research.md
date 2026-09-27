# Faceless educational YouTube channels: research brief for Ep3

Compiled 28 Sep 2026. Purpose: (a) write the prompt we hand the AI video tool, (b) check later whether the tool's own research stage finds the same facts.

How to read the numbers:
- "yt-dlp pull, 28 Sep 2026" means the figure was read directly from the channel's YouTube page on 28 Sep 2026 (subscriber count, the 8 most recent long-form uploads, their view counts, upload dates and durations). Averages and cadence are computed from those 8 uploads. Raw rows, captions and thumbnails are in `06_research/raw-ytdlp-2026-09-28/` if anyone wants to re-check.
- Third-party analytics sites (OutlierKit, HypeAuditor, CreatorDB, vidIQ, Social Blade) are cited with the date they show. Social Blade and vidIQ pages blocked direct fetch, so their figures come through search snippets and are marked lower confidence.
- "Confidence" is noted where a number is an estimate or where the sample is skewed (for example when the latest upload is only a day old).

---

## 1. The most successful faceless educational channels right now

Ordering is by average views per recent upload, which is the figure that matters for a new channel. Subscriber count is included but is a lagging measure (see Bright Side).

| Channel | Subs (28 Sep 2026) | Avg views, last 8 long-form uploads | Cadence | Length | Format | Most-viewed of the last 8 | Confidence |
|---|---|---|---|---|---|---|---|
| Kurzgesagt | 25.6M | 7.59M (median 6.42M) | 1 every ~22 days | 12 to 15 min | 2D vector animation, single narrator | "This Woman Cured Her Cancer with an Insane Method", 20.6M views, 15 Sep 2026 | High. yt-dlp pull. Note one upload (superpredators, late Jul) was pulled after a false AI-slop flag, see section 4 |
| LEMMiNO | 5.92M | 7.20M (median 8.43M) over the last 8 uploads, which span 2021 to 2025 | About 1 long documentary per year (latest 31 Oct 2025) | 34 min to 2 h 28 min for documentaries | Slow-zoom archive imagery, hand-drawn maps, single narrator | "The Enduring Mystery of Jack the Ripper", 16.0M (2021); latest "Shouting at Stars", 4.67M, 31 Oct 2025 | High for the numbers, but the cadence makes it a poor model to copy |
| Fern | 5.53M | 5.18M (median 5.50M) | Exactly weekly (every 7 days, 5 Aug to 23 Sep 2026) | 20 to 50 min | 3D-animated case files, archive footage, interview audio, single narrator | "The Death of Educational Content on YouTube", 10.5M views, 2 Sep 2026 | High. yt-dlp pull. OutlierKit (Sep 2026) gives 4.6M avg over all 140 videos and ~1.2 uploads/week: https://outlierkit.com/channel/fern-tv |
| Zack D. Films | 28.6M | 1.62M per Short, all 8 posted within the previous 48 h | 4 to 5 Shorts a day | 15 to 53 s | 3D-animated "how it works" Shorts, narrator | "Beating Earth At Rock Paper Scissors", 4.38M, 26 Sep 2026 | High for the pull. Different game (Shorts). Views were still climbing when read |
| RealLifeLore | 7.94M | 1.59M (median 1.28M) | 1 every ~10 days | 21 to 48 min | Maps and data graphics, stock/archive b-roll, single narrator | "Why The Taliban Are Begging The US To Come Back", 3.31M, 11 Sep 2026 | High. yt-dlp pull |
| Wendover Productions | 4.92M | 1.07M (median 918k) | 1 every ~14 days | 14 to 23 min | Stock/archive b-roll, maps, motion graphics, single narrator | "How the Channel Tunnel Works", 2.06M, 4 Sep 2026 | High. yt-dlp pull. Social Blade (via search, Sep 2026) shows 4.91M subs, 837.6M total views, 288 videos: https://socialblade.com/youtube/handle/wendoverproductions |
| Half as Interesting (Wendover's sister) | 2.94M | 835k (median 743k) | 1 every ~8 days | 7 to 9 min | Stock b-roll, jokes, single narrator | "Why Almost Every Airline Has Sued This One Website", 2.03M, 5 Aug 2026 | High. yt-dlp pull |
| Economics Explained | 2.88M | 760k (median 677k); 850k if the 1-day-old upload is excluded | Weekly | 13 to 23 min | Stock b-roll, simple motion graphics, single narrator | "Finally a Country Is Taxing Its Billionaires", 1.32M, 9 Sep 2026 | High. yt-dlp pull |
| ColdFusion | 5.24M | 741k (median 767k) | 1 every ~13 days | 12 to 22 min | Archive footage and news clips, light motion graphics, single narrator (Dagogo Altraide, voice only) | "Meta's Legal Troubles Are Worse than You Think", 1.27M, 31 Aug 2026 | High. yt-dlp pull |
| Real Engineering | 5.12M | 680k (median 674k) | 1 every ~22 days | 11 to 24 min | 3D and 2D engineering animation, archive, single narrator | "The Insane Engineering of the V-22 Osprey", 1.08M, 25 Apr 2026 | High. yt-dlp pull. CreatorDB shows 5.1M subs, 4.3% engagement: https://creatordb.app/creatorstats/real-engineering/ |
| The Infographics Show | 15.5M | 585k (median 523k); the sample covers 8 days only because the channel posts daily | Daily (OutlierKit: 9.1 uploads a week, 18 Aug 2026) | 13 to 46 min | 2D animation, narrator | "The Collapse of AI Software Engineering", 1.31M in 5 days, 23 Sep 2026 | Medium. Very recent uploads understate the settled average; OutlierKit gives 1.1M all-time average: https://outlierkit.com/channel/theinfographicsshow |
| Sideprojects | 1.34M | 310k (median 165k) | 1 every ~2 days | 21 to 51 min | Stock b-roll and stills, narrator (Simon Whistler, voice only on this channel) | "'Next Generation' Weapons That Failed Completely", 986k, 10 Sep 2026 | High. yt-dlp pull |
| PolyMatter | 1.93M | 217k (median 196k) | 1 every ~21 days, and nothing since 24 Jul 2026 | 16 to 19 min | 2D motion graphics, maps, single narrator | "China is Not a Socialist Utopia.", 374k, 17 Apr 2026 | High. yt-dlp pull |
| Aperture | 2.68M | 151k (median 141k) | Weekly | 23 to 47 min | Stock footage, slow cuts, philosophical narration | "You are God pretending to be Human | Alan Watts", 343k, 6 Sep 2026 | High. yt-dlp pull (channel ID UCO5QSoES5yn2Dw7YixDYT5Q) |
| Bright Side | 44.5M | 34k (median 35k), but every one of the 8 was posted within 3 days | Several a day | 9 to 56 min | Stock footage, narrator | "Magnitude 9.0 Could Hit the US Coast", 90k, 25 Sep 2026 | Medium on the exact figure, high on the direction: vidIQ (via search) shows negative subscriber growth and a 100k subscriber loss between 26 Mar and 10 Jul 2026: https://vidiq.com/youtube-stats/channel/@brightsideofficial/ |
| Kento Bento | 1.7M | n/a | Inactive since 2021 (health hiatus) | n/a | Animated documentary | n/a | Skip. Wikitubia: https://youtube.fandom.com/wiki/Kento_Bento |

Takeaways for the prompt:
- The two channels that earn the most views per upload while still posting regularly are Kurzgesagt (animation, ~monthly, 12 to 15 min) and Fern (3D case files, weekly, 20 to 50 min). Both use a single narrator and never show a face.
- Weekly cadence with 15 to 25 min runtime is the working middle (Fern, Economics Explained, Half as Interesting, RealLifeLore).
- Subscriber count is not a proxy for reach: Bright Side has 44.5M subs and gets tens of thousands of views per upload; Fern has 5.5M and gets millions.

Sources for this section: yt-dlp pulls from youtube.com on 28 Sep 2026 (channel handles @kurzgesagt, @fern-tv, @Wendoverproductions, @RealEngineering, @EconomicsExplained, @PolyMatter, @ColdFusion, @LEMMiNO, @TheInfographicsShow, @Sideprojects, @BRIGHTSIDEOFFICIAL, @RealLifeLore, @halfasinteresting, @zackdfilms/shorts, channel UCO5QSoES5yn2Dw7YixDYT5Q); faceless.my channel comparison (2026, no exact date): https://faceless.my/youtube/top-faceless-youtube-channels/ ; Fern 5M milestone 10 Jun 2026 per Wikitubia: https://youtube.fandom.com/wiki/Fern

---

## 2. Which educational sub-niches are growing fastest for faceless channels in 2026

Honest caveat first: there is no neutral, dated dataset that ranks educational sub-niches by growth. Most "fastest growing niche" pages are written by AI-video-tool vendors selling into the niche. The table separates what each source actually measured from what it asserted.

| Sub-niche | What the evidence says | Source, date | Confidence |
|---|---|---|---|
| AI itself (explainers about the AI industry, not tool tutorials) | Highest-viewed recent uploads across several established channels are AI-economy stories: Infographics "The Collapse of AI Software Engineering" 1.31M in 5 days (23 Sep 2026) and "The 7 Trillion AI Gamble Is Failing" 1.5M in 7 days (OutlierKit, 18 Aug 2026); ColdFusion "How to lose $35 Billion Dollars Betting on AI" 1.23M (16 Sep 2026); Economics Explained "AI Might Be Turning Us Into Peasants" 539k and "AI Data Centers" 522k (Aug 2026). OutlierKit calls AI and technology education "exploding demand", CPM USD 8 to 20, and names the tutorial-style leaders as still small: AI Search 703k, AI Revolution 557k, TheAIGRID 396k subs | yt-dlp pull 28 Sep 2026; OutlierKit faceless guide, 13 Sep 2026: https://outlierkit.com/resources/faceless-youtube-channels/ | High on the view data, medium on CPM |
| Geopolitics and "why X country" explainers | RealLifeLore averages 1.59M per upload every 10 days; Wendover's "How Taiwan is Preparing to Get Invaded" 1.57M (8 Aug 2026); Fern's weekly case files average 5.18M. Kapwing's Nov 2025 study did not find AI-slop channels competing here, which suggests the format still needs human research | yt-dlp pull 28 Sep 2026; Kapwing AI Slop Report, 28 Nov 2025: https://www.kapwing.com/blog/ai-slop-report-the-global-rise-of-low-quality-ai-videos/ | High |
| Money and economics | Highest CPM band on YouTube per OutlierKit (USD 15 to 45); Economics Explained 2.9M subs and How Money Works 1.7M named as the faceless leaders. Watch the July 2026 policy: AI "personas" giving finance advice are explicitly non-monetisable (section 4) | OutlierKit, 13 Sep 2026 (above); Tubefilter, 13 Jul 2026: https://www.tubefilter.com/2026/07/13/youtube-inauthentic-content-monetization-policy-update/ | Medium |
| Story-driven history and true crime | Virvid (a tool vendor) claims 65 to 82% average retention and 3 to 6 months to 1,000 subs for these formats versus 35 to 48% for generic top-10 lists, but gives no methodology for its "500 viral videos". Fern's real numbers (FBI/KKK 14.9M, Room 1046 5.5M, El Mencho 6.2M) support the direction | Virvid, 5 Feb 2026: https://virvid.ai/blog/best-ai-niches-faceless-channels-2026 ; yt-dlp pull 28 Sep 2026 | Low on Virvid's percentages, high on Fern's numbers |
| Psychology and philosophy | Aperture (2.68M subs) averages only 151k per weekly upload; the vendor pages that push "narrative psychology" and "Stoicism" do not show a channel above 1M with strong per-video views. Space and science: OutlierKit CPM USD 5 to 12, Astrum 2.8M subs | yt-dlp pull 28 Sep 2026; OutlierKit 13 Sep 2026 | Medium. Crowded, low CPM, weak per-video reach |
| Engineering and "how it's made" | Real Engineering averages 680k every ~22 days at 5.12M subs, Wendover 1.07M every ~14 days. Zack D. Films shows the Shorts version of "how it works" at 1.6M per Short within 48 h | yt-dlp pull 28 Sep 2026 | High |
| Platform-wide context | YouTube's own 2026 letter: "more than 1M channels used our AI creation tools daily in December" (2025). Mid-length 8 to 20 min structured videos are "rewarding those who choose to stay" per vidIQ's 2026 niche guide (fetched via search snippet; page blocked direct fetch) | YouTube blog, 21 Jan 2026: https://blog.youtube/inside-youtube/the-future-of-youtube-2026/ ; vidIQ: https://vidiq.com/blog/post/best-youtube-niches/ | High for the YouTube quote, medium for vidIQ |

Not found: a dated r/NewTubers or r/youtubers thread with usable numbers. Reddit blocked fetching and web search returned only Gumroad guides. Say so in the episode rather than citing one. YouTube's Culture and Trends report index lists a "Human Creativity and AI" report but the page carries no statistics: https://www.youtube.com/trends/report/

---

## 3. What the top explainer videos of the last 12 months have in common

Sample: the four highest-viewed uploads I could verify from section 1 channels in the 12 months to 28 Sep 2026, with the first 15 to 18 seconds read from YouTube's auto-captions and the thumbnail viewed directly. All figures yt-dlp pull, 28 Sep 2026.

| Video | Views | Runtime | First 15 s (from captions) | Title pattern | Thumbnail |
|---|---|---|---|---|---|
| Kurzgesagt, "This Woman Cured Her Cancer with an Insane Method", 15 Sep 2026 | 20.6M | 15:14 | Starts mid-action, no greeting: "A sharp needle breaks skin and pierces the firm, dark tumor. Millions of viruses invade deep into the deadly cancer, kick-starting an experiment that had never been attempted before. Bypassing some of the most sacred safety nets in medicine. This is the story of Dr. Beata..." | Person + outcome + "insane method". Named human subject, result stated up front | Three words, "100% VIRUS", large white caps, one syringe, one glowing tumour, one arrow. No face |
| Fern, "How an FBI Agent Infiltrated the KKK", 12 Nov 2025 | 14.9M | 41:04 | Cold open on the source's own voice: "If there's any snitches in the group, we kill the snitches..." then a date and place card: "April 21, 2017. A group of men stand in a remote field in the middle of Alabama." | "How a [specific person] [did the impossible thing]" | Real face of the agent left, hooded figures right, red arrow, "FBI" in yellow. The one face in the set is the subject, not the creator |
| Fern, "The Death of Educational Content on YouTube", 2 Sep 2026 | 10.5M | 28:11 | Opens on an unrelated analogy (a KFC "Chicken Town, home of the imitators" ad) then turns it on the channel itself: "lately, we've been feeling a lot..." Sets up a grievance the viewer shares | "The Death of [thing the viewer likes]" | Three words, "KILLED BY SLOP", cracked logos of Veritasium, Fern and Kurzgesagt. White background, black text |
| Kurzgesagt, "Why Humanity Will Never Leave The Solar System", 4 Aug 2026 | 9.95M | 14:08 | After a 4 s shop plug: "You will never leave the solar system. Nobody alive today will, and maybe no human ever. Locked in by an invisible barrier, impossible to overcome..." A flat, absolute claim in the second person | "Why [absolute claim]" | Two words plus an asterisk, "IT'S IMPOSSIBLE*", one ship, one glowing hex barrier |

What they share:
1. Hook: the first sentence is the most extreme true claim in the video, stated as fact, in the present tense, with no "hi guys" and no "in this video". Three of four open on a concrete image or a quoted voice rather than a summary.
2. A named human or a "you" appears in the first 10 seconds ("This is the story of Dr. Beata", "you will never leave", the agent's own voice). Even abstract science is hung on a person.
3. Titles: 6 to 9 words, one specific noun, one superlative or absolute ("Insane", "Never", "Death", "Infiltrated"). None use numbers-in-title clickbait like "10 things".
4. Thumbnails: two or three words in heavy caps, one object, high contrast, and at most one arrow. Fern and Kurzgesagt both leave 60% of the frame as a single image with no clutter.
5. Runtime: 14 to 41 min. Nothing under 12 min in the top set. The Shorts channel (Zack D.) is the exception and is a separate game.

Secondary, lower-confidence sources on hooks (vendor blogs, 2026, no data behind them): "videos where the thumbnail promise matches the hook content within 3 seconds see 40 to 60% higher completion" (https://miraflow.ai/blog/youtube-video-hooks-2026-save-first-30-seconds) and "most videos lose 30 to 40% of viewers in the first 30 seconds" (https://youtubersystems.ai/blog/youtube-hooks-2026/). Treat both as folk wisdom, not data.

---

## 4. AI-generated faceless channels in 2026: policy and evidence

| Date | What happened | Numbers | Source |
|---|---|---|---|
| 15 Jul 2025 | YouTube renamed its "repetitious content" monetisation policy to "inauthentic content", clarifying it covers "mass-produced or repetitive content", videos that "look like made with a template with little to no variation", or are "easily replicable at scale". AI is not named in the policy itself | n/a | AIR Media-Tech timeline (2026): https://air.io/en/monetization/youtube-monetization-policy-changes-2026-a-complete-dated-timeline ; OutlierKit: https://outlierkit.com/resources/youtube-ai-slop-crackdown-2026/ |
| 28 Nov 2025 | Kapwing's AI Slop Report: of the top 100 trending channels per country, 278 channels were all-AI | 63B views, 221M subs, est. USD 117M a year. 104 of the first 500 Shorts served to a new account (21%) were AI slop; 33% "brainrot". Named: Cuentos Facinantes 5.95M subs, Imperio de Jesus 5.87M subs, Bandar Apna Dost 2.07B views, Three Minutes Wisdom 2.02B views (est. USD 4.04M a year) | https://www.kapwing.com/blog/ai-slop-report-the-global-rise-of-low-quality-ai-videos/ |
| 21 Jan 2026 | Neal Mohan's annual letter names "AI slop" management as a 2026 priority. Same letter: "more than 1M channels used our AI creation tools daily in December" | 1M+ channels a day | https://blog.youtube/inside-youtube/the-future-of-youtube-2026/ ; CNBC 21 Jan 2026: https://www.cnbc.com/2026/01/21/youtube-chief-says-managing-ai-slop-is-a-priority-for-2026-.html |
| Jan to Feb 2026 | First enforcement wave: 11 channels terminated, content wiped from 6 more. Three Minute Wisdom (1.7M subs, 2B views) had its content wiped; Cuentos Facinantes (5.95M) and Imperio de Jesus (5.87M) terminated | 16 channels, 35M subs, 4.7B lifetime views, est. USD 10M a year removed | OutlierKit (above); TechTimes 15 Jul 2026: https://www.techtimes.com/articles/320629/20260715/youtube-wiped-35m-subscribers-over-ai-slop-now-its-judging-your-taste.htm |
| 13 to 16 Jul 2026 | YouTube clarified three non-monetisable categories: (1) "generic or repetitive content" that "looks like it's made with a template"; (2) "unsatisfying or off-putting content" that "relies heavily on emotionally manipulative formulas"; (3) AI personas presenting as experts on "health, legal issues, finances, or politics". YouTube stated AI-made content with "original, authentic insights or perspective" stays monetisable. Review is at channel level, not video level | n/a | Tubefilter 13 Jul 2026: https://www.tubefilter.com/2026/07/13/youtube-inauthentic-content-monetization-policy-update/ |
| Late Jul to 7 Aug 2026 | YouTube's automated AI-slop detector wrongly flagged Kurzgesagt. Its superpredator upload became "its worst-performing upload since 2013" and was taken down for re-upload. Kurzgesagt: "YouTube's automatic AI detection tools wrongly think that our very much human-made videos are AI Slop." Google Research paper cited: system terminated 50,000 clusters containing 130,000 synthetic spam channels in six months, overturn rate under 1% | 130,000 channels; <1% overturn | Dexerto 7 Aug 2026: https://www.dexerto.com/youtube/youtubes-ai-slop-detector-incorrectly-targets-kurzgesagt-as-other-creators-fear-same-fate-3395930/ ; Real Engineering's response video "The Kurzgesagt Situation is Insane", 651k views, 1 Aug 2026 (yt-dlp pull) |
| 2 Sep 2026 | Fern's "The Death of Educational Content on YouTube": the channel went undercover into the AI-slop operations copying its work. Description: "Countless AI slop channels are relentlessly copying our work" | 10.5M views and 266k likes in 26 days, the channel's biggest of its last 8 | https://www.youtube.com/watch?v=-Gnrp_caPvo (yt-dlp pull 28 Sep 2026) |
| 10 Aug 2026 (effective 1 Feb 2027) | Partner Program thresholds announced to double: 8,000 watch hours or 20M Shorts views | 8,000 h / 20M | AIR Media-Tech timeline (above). Single source, medium confidence |

Evidence that AI-made channels got views: yes, at scale. Kapwing's 278 channels held 63B views, and single channels reached 2B views and an estimated USD 4M a year before enforcement (Kapwing, 28 Nov 2025). Evidence they got demonetised or deleted: the January 2026 wave (16 channels, 4.7B views) and the March and December 2025 terminations of the AI trailer channels Screen Culture and KH Studio (2M+ combined subs, 1B+ views; OutlierKit timeline). Evidence of collateral damage to human channels: the Kurzgesagt false flag (Aug 2026).

Not found: a peer-reviewed or YouTube-published count of how many AI-assisted educational channels were monetised in 2026. The "38% of all new creator monetisation ventures are faceless, up from 12% in 2022" line circulating on vendor blogs (Miraflow, Apr 2026: https://www.miraflow.ai/blog/faceless-youtube-channel-explosion-ai-million-subscriber-creators-2026) traces to another vendor (AutoFaceless) with no method. Do not use it.

---

## 5. One recommended channel concept

Concept: **"Follow the Money: AI"**. A faceless weekly explainer that treats each AI industry story as a case file with a paper trail (who paid, who got paid, what broke), told in the Fern structure (cold open on a quote or a document, a date card, then the chain of events) with Kurzgesagt-style flat 2D motion graphics rather than stock footage. 15 to 20 minutes, one narrator, one topic per week.

First-video title: **"Who Is Actually Paying for AI? (The $7 Trillion Bill)"**
Thumbnail: three words, "NOBODY CAN PAY", one data-centre silhouette, one receipt.

Reasoning (5 lines):
1. The AI-industry story is the hottest topic across the established faceless channels right now, but none of them own it; it is a side topic for economics, tech and animation channels.
2. The channels that do own "AI" as a niche are tutorial channels under 1M subs with screen-recording formats, so the documentary angle is open.
3. The case-file structure is what the top four videos of the year have in common (section 3), and it is the format the AI-slop copycats cannot fake because it needs sourced reporting.
4. Money-and-economics is the highest CPM band on YouTube, and an explainer (not advice) about corporate AI spend avoids YouTube's July 2026 "AI persona giving financial advice" trap as long as the narrator is not presented as an expert persona.
5. It fits Ep3: the tool is being asked to make a video about the economics of the very industry it belongs to, which gives the episode its own hook.

Three data points that back it:
- Infographics Show, "The Collapse of AI Software Engineering": 1.31M views in 5 days (23 Sep 2026), the best of its last 8 daily uploads; "The 7 Trillion AI Gamble Is Failing": 1.5M in 7 days (OutlierKit, 18 Aug 2026). yt-dlp pull 28 Sep 2026; https://outlierkit.com/channel/theinfographicsshow
- ColdFusion, "How to lose $35 Billion Dollars Betting on AI": 1.23M views (16 Sep 2026), 66% above the channel's 741k average. yt-dlp pull 28 Sep 2026.
- The largest dedicated AI-niche faceless channels are AI Search 703k, AI Revolution 557k and TheAIGRID 396k subs, CPM USD 8 to 20 (OutlierKit, 13 Sep 2026: https://outlierkit.com/resources/faceless-youtube-channels/). Nobody in the niche is above 1M, while the adjacent economics leader (Economics Explained) sits at 2.88M with 760k average views.

Risk to state in the episode: the January 2026 enforcement and the Kurzgesagt false flag mean an AI-made channel must show visible human editorial work (sourced script, original graphics, a consistent voice) and disclose AI-generated visuals, or it can lose monetisation at channel level without a per-video warning.

---

## Facts the AI tool's research stage should be able to find (checklist for the comparison)

| # | Fact | Value we found |
|---|---|---|
| 1 | Kurzgesagt subscriber count | 25.6M (28 Sep 2026) |
| 2 | Fern subscriber count and cadence | 5.53M, weekly |
| 3 | Fern's biggest video of 2026 | "The Death of Educational Content on YouTube", 10.5M |
| 4 | Date YouTube renamed "repetitious" to "inauthentic content" | 15 Jul 2025 |
| 5 | Size of the January 2026 enforcement wave | 16 channels, 35M subs, 4.7B views |
| 6 | Kapwing AI slop study headline | 278 channels, 63B views, 21% of new-account Shorts |
| 7 | The July 2026 third category | AI personas on health, legal, finance, politics |
| 8 | The Kurzgesagt false flag | Late Jul to Aug 2026, worst upload since 2013 |
| 9 | Typical top-explainer runtime | 14 to 41 min |
| 10 | Bright Side's reach vs subs | 44.5M subs, ~34k views per upload |
