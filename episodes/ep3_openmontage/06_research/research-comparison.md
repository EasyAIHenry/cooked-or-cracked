# OpenMontage research stage vs the ground-truth brief

Compiled 28 Sep 2026. Read-only comparison.

- A = OpenMontage (Codex run) research stage: `openmontage-run/research_brief.json` and the concept ranking in `openmontage-run/proposal_packet.json`.
- B = the yt-dlp and web brief: `faceless-channel-research.md`, with the 10-item checklist at the end.
- Method: every URL in A was tried today. Seven were fetched directly (WebFetch, curl with a browser user agent, yt-dlp, YouTube oEmbed, pdftotext on the downloaded PDF). Reddit blocks unauthenticated fetches, so the four Reddit threads are marked unverified rather than false. The pipeline log (`pipeline-run-codex.log`) was read for what the research stage actually did.

What the log shows about the research stage itself: it ran for 4.0 minutes. The text of six search queries is logged (the rest are blank lines). The queries were about 3D printing tolerances, additive manufacturing surveys, "design for manufacturing" on YouTube, The Engineering Mindset's subscriber count, and "130 billion". The line "Research director executed 18 web searches" that appears in the log is from OpenMontage's built-in example about "How DNS Works", not from this run. The only mentions of Kurzgesagt in the log are inside OpenMontage's own prompt templates. No search touched a general faceless-education channel, YouTube policy, or the AI-slop story.

---

## 1. Every channel, number and URL in A

### 1a. Channels named in A

| Channel | Where in A | Numbers A gives | Checked against |
|---|---|---|---|
| The Engineering Mindset | landscape, data_points, visual_references | 4.47M subs, 3.72M views in 28 days, ~30K subs gained in 30 days, Sep 2026 | vidIQ page: HTTP 403 then 429, not readable. Unverified. Order of magnitude is right for this channel; B did not pull it |
| Branch Education | landscape, data_points, visual_references | 2.7M+ subs, 117.4M+ views, "50+ deep dives" | branch.education fetched: shows "2.7M+ Subscribers", "117.4M+ Views", "65+ In-depth videos". Subs and views match; video count is off (A says 50+, site says 65+) |
| Animagraffs | landscape, data_points, visual_references | 1.9M subs, 180.7M views, 48 videos, ~3.8M avg views per video, uploads every ~84 days, 10K subs in 30 days | alaxia.site: HTTP 403 both ways. Unverified. The arithmetic is internally consistent (180.7M / 48 = 3.76M) |
| Stuff Made Here, Tested, NYC CNC, This Old Tony (via machinist.com directory) | landscape | "400K to 6.8M subscribers" | machinist.com fetched: lists Adam Savage's Tested 6.8M and NYC CNC 443K among others. Range holds |
| MLC CAD Systems (the tolerances video) | landscape, data_points | 849 views, 16 likes after about one year | yt-dlp today: 872 views, 18 likes, uploaded 27 Aug 2025, 14:26 long. Matches within a few days of drift. "About one year" is right |
| Kurzgesagt, Fern, Wendover, Real Engineering, Infographics Show, ColdFusion, Economics Explained, RealLifeLore, Bright Side, Zack D. Films | not in A | none | A did not examine any of B's 15 channels |

### 1b. Non-channel numbers in A

| Claim in A | Source URL | Real page? | Number checks out? |
|---|---|---|---|
| AM market $16.0B in 2025, up 10.2% YoY, $57B by 2034; Scott Dunham quote on H2 2025 turnaround | additivemanufacturingresearch.com (article dated 30 Mar 2026) | Yes, fetched | Yes. Page shows $16.0B, 10.2% (vs 8.3% in 2024), $57B by 2034, and the Dunham quote in slightly different words ("start of a significant turnaround for AM") |
| Engineering-hardware market $131.2B in 2025, $296.1B in 2034, 9.46% CAGR, 120+ startups surveyed | ciicies.in CII/KPMG PDF | Yes, 1.4MB PDF downloaded and text-extracted | Yes. All four figures appear verbatim in the report |
| 53% cite access to digital tools for design; 55% cite access to affordable digital design | same PDF | Yes | Yes. Exhibit 7.2 shows "Access to digital tools for design 53%"; Exhibit 7.3 shows "Access to affordable digital design 55%". A's "dated 2025-11-24" is not on the PDF; the report only says 2025 |
| Five recurring hardware mistakes thread | reddit.com/r/hwstartups/comments/1sfmygm (A dates it 8 Apr 2026) | Unverified, Reddit blocks fetch | Cannot check. Post ID is in the plausible 2026 range. A's `key_quotes` arrays for all three Reddit items are empty, which suggests the thread bodies were not read either |
| r/Entrepreneur resources thread | reddit.com/r/Entrepreneur/comments/1ru3hhb | Unverified | Cannot check |
| r/MechanicalEngineering younger-engineers tolerance thread | reddit.com/r/MechanicalEngineering/comments/1sdx56y | Unverified | Cannot check |
| r/3Dprinting "when your tolerances are just right" | reddit.com/r/3Dprinting/comments/1anluvt | Unverified | Cannot check. ID range suggests early 2024, so it is not a 2026 signal |
| MatterHackers "Ten 3D Printing YouTube Channels" | matterhackers.com | Yes, fetched | Listed in `sources` but not used for any number. The page is an old listicle (largest channel shown at 744K subs), not a 2026 landscape |

### 1c. Spot-check tally

| URL | Result |
|---|---|
| additivemanufacturingresearch.com article | Real, numbers match |
| CII/KPMG PDF | Real, all six numbers match |
| youtube.com/watch?v=k6h4scHF1KI | Real, numbers match within drift |
| branch.education | Real, subs and views match, video count off |
| machinist.com/resources/youtube | Real, range holds |
| vidiq.com Engineering Mindset | Blocked (403/429), unverified |
| alaxia.site Animagraffs | Blocked (403), unverified |
| 4 Reddit threads | Blocked, unverified |
| matterhackers.com | Real, unused |

Twelve sources in A. Seven fetched directly: all seven exist, and every number I could read matched (one minor miss on Branch's video count). Two analytics pages blocked. Four Reddit threads blocked. No fabricated URL found.

---

## 2. Score against B's 10-item checklist

| # | Fact B expects | A's result | Verdict |
|---|---|---|---|
| 1 | Kurzgesagt subscriber count (25.6M) | Kurzgesagt not mentioned in the brief. Only appears in OpenMontage's prompt templates | Missed |
| 2 | Fern subscriber count and cadence (5.53M, weekly) | Fern not mentioned | Missed |
| 3 | Fern's biggest 2026 video (10.5M, "Death of Educational Content") | Not mentioned | Missed |
| 4 | Date YouTube renamed "repetitious" to "inauthentic content" (15 Jul 2025) | No policy research at all | Missed |
| 5 | January 2026 enforcement wave (16 channels, 35M subs, 4.7B views) | Not mentioned | Missed |
| 6 | Kapwing AI slop headline (278 channels, 63B views, 21% of Shorts) | Not mentioned | Missed |
| 7 | July 2026 third non-monetisable category (AI personas on health, legal, finance, politics) | Not mentioned | Missed |
| 8 | Kurzgesagt false flag (late Jul to Aug 2026) | Not mentioned | Missed |
| 9 | Typical top-explainer runtime (14 to 41 min) | A never measured runtime of any successful channel. It notes Engineering Mindset's "strongest demand is long-form" and Animagraffs' cadence, but the 60 to 90 s target was set by the prompt, not by research | Missed |
| 10 | Bright Side reach vs subs (44.5M subs, ~34k views per upload) | Not mentioned. A cites no per-upload view data for any channel; its engagement figures are subscriber totals and 28-day aggregates | Missed |

0 of 10 met, 0 partly. This is not because A's facts are wrong. It is because A never did the first half of the prompt ("research faceless educational YouTube channels") as a survey. It chose a lane in the first query and gathered evidence for that lane.

---

## 3. The niche choice

A chose "Build Failure Forensics" (60 to 90 s faceless clips on why a part jams, cracks, wobbles or gets expensive) for men 18 to 34 in India, the US and SEA who build things. B recommended "Follow the Money: AI" (15 to 20 min weekly case files).

### Is A's niche defensible from A's own evidence?

Partly. The audience-fit half is defensible; the "growing and under-served YouTube niche" half is not measured.

| Claim in A | Backed or inferred | Evidence |
|---|---|---|
| Faceless engineering animation has a large audience | Backed (with caveats) | Branch 2.7M+/117.4M+ confirmed on its own site. Engineering Mindset and Animagraffs figures unverified but plausible. B's own data adds Real Engineering 5.12M and 680k per upload, which supports the same point |
| The hardware and additive sector is growing | Backed | AM Research $16.0B, +10.2%; CII/KPMG $131.2B to $296.1B, 9.46% CAGR. Both confirmed verbatim |
| Indian hardware founders lack affordable design resources | Backed | 53% and 55% confirmed in the KPMG exhibits. Sample is 120+ startups, not hobbyist makers, and it is about tool access, not video content |
| Makers keep asking the same tolerance and prototype-to-production questions | Inference | Four Reddit threads, none readable today, `key_quotes` empty. The r/3Dprinting thread ID dates to early 2024 |
| Direct DFM education on YouTube is "weakly packaged" | Inference from one data point | One 872-view video from a CAD reseller's channel. A single low-view video proves the video did badly, not that the topic is under-served. No search for the actual competitors in this lane (CNC Kitchen, Slant 3D, Maker's Muse, Teaching Tech, Made with Layers all do exactly this, faceless or near-faceless, and none appear in A) |
| No major faceless channel owns a fast symptom-to-cause-to-rule format | Asserted | No evidence offered. A did not search Shorts. B's data shows Zack D. Films pulling 1.6M per "how it works" Short within 48 h, which is the closest existing format and is not mentioned |
| The niche is "growing" on YouTube | Not measured | Every growth number in A is an industry market size (dollars of printers and parts sold), not view or subscriber growth in the content niche. The prompt asked for a growing YouTube niche; A answered with a growing industry |
| The niche is "under-served" on YouTube | Asserted | A's `underserved_gaps` list is written as conclusions, with no search results, view counts or channel counts behind it. The machinist.com directory shows the opposite for the broader maker lane: dozens of channels from 20K to 6.8M |
| Men 18 to 34, India, US, SEA | Carried over from the prompt | No demographic data for any channel. The KPMG report supplies the India angle; nothing supplies SEA |

Where A's logic is sound: it correctly separates broad how-it-works animation (Branch, Animagraffs) from personality-led shop channels (Tested, NYC CNC) and spots the space between them. Its concept ranking (c1 to c5) is coherent and each concept cites a real source. The industry data is real and correctly quoted.

Where it falls short of the prompt: "growing and under-served" was asserted from industry sales data plus one low-view video, not from YouTube data. B's approach (average views per upload over the last 8 uploads, per channel, dated) is the measurement that would have answered the question, and A never ran it for any channel, including the three it named.

On the 60 to 90 s format: A's own landscape entry says Engineering Mindset's "strongest demand is long-form", and B's top-four analysis shows nothing under 12 min in the year's biggest explainers. A did not flag that its chosen length runs against the demand it found; the length came from the prompt and A did not test it.

Comparing the two recommendations on their evidence: B's "Follow the Money: AI" rests on dated per-video view counts (Infographics 1.31M in 5 days, ColdFusion 1.23M at 66% above average, largest dedicated AI channel under 1M subs), plus the policy risk that shapes whether the channel can be monetised. A's rests on market size and forum anecdotes. B's is the stronger case for "growing and under-served on YouTube". A's is the stronger case for "matches the stated audience of people who build things", which B's recommendation ignores.

---

## 4. What A found that B missed

| Item | Why it matters |
|---|---|
| The faceless engineering-animation cluster: Branch Education, The Engineering Mindset, Animagraffs | B's table has Real Engineering only. These three are large, faceless, educational and directly relevant to the "builders" audience. Branch's site-published numbers are primary-source |
| CII/KPMG Engineering Hardware Industry 2025 report | The only primary source in either document that speaks to India specifically, with a 120-startup survey. B has no India or SEA data at all |
| AM Research 2025 market data and the Dunham quote | A dated, primary industry-growth signal for the audience's activity |
| The "packaging gap" observation | Even on one data point, the idea that a topic can be common in forums yet badly packaged on YouTube is a usable content insight |
| Audience misconceptions with a myth/reality structure (nominal dimensions fit, tighter tolerance means better, prototype proves manufacturability) | These translate straight into hooks. B has no equivalent audience-question layer |
| Regional framing ("Jugaad or Engineering?") | B's recommendation is US-centric by default. A at least attempted the India/SEA brief |
| Formlabs tolerance and machining-cost articles (in `script.json`) | Sourced technical grounding for the actual script; B's brief does not go to script level |

What B found that A missed is the whole of B's sections 1 to 4: the top faceless channels with per-upload views, the AI-slop enforcement timeline, the Kurzgesagt false flag, the July 2026 monetisation categories, and the Feb 2027 threshold change. For a new faceless channel, the policy items are the ones that decide whether the channel can earn at all, and A's brief has no risk section.

---

## Scorecard

Score for the tool's research stage: **4/10**. Accurate and honestly sourced on the industry side, but it never surveyed the YouTube landscape the prompt asked about, measured no channel's reach, and asserted "growing and under-served" from market-size data and one video.

Receipt: 12 sources, 7 of 7 fetchable URLs real with numbers matching, 5 blocked and unverified, 0 of 10 checklist facts found, niche growth inferred from industry sales not YouTube data, 4.0 minutes and about 6 logged searches.
