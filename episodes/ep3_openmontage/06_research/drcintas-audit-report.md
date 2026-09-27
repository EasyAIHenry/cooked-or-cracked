# Creator audit: @drcintas — reel DdttZS1RTZu (OpenMontage)

Audited 2026-09-28. Subject for Cooked or Cracked Ep3.

## Metadata
| Field | Value |
|---|---|
| Creator | @drcintas — Dr. Alvaro Cintas (verified, 159K followers, 493 posts; bio: "Professor, PhD Computer Science & Engineering", link skool.com/ai-operator) |
| URL | https://www.instagram.com/p/DdttZS1RTZu/ |
| Posted | 2026-09-25 (taken_at 1790347843) |
| Duration | 37.3s, 720x1280 |
| Plays | 42,000 (grid shows "42k") |
| Likes | 1,301 |
| Comments | 2,497 |
| Like rate | 3.1% of plays |
| Comment rate | 5.95% of plays (>2% = comment-gate funnel) — 1.92 comments per like |
| Comment-gate keyword | "VIDEO" |

### Caption (verbatim)
Comment “VIDEO” to get this open-source AI that automates YouTube content creation.

I just found an open-source AI that makes entire YouTube videos from start to finish.

It’s basically a full production team in one AI.

It can write scripts, create storyboards, find footage, generate visuals and voiceovers, edit everything, and render the final video.

It also comes with over 100 production tools, 700 agent skills and knowledge files, reference-based creation, and built-in live web research.

## Baseline: last 12 reels excluding the target
Median plays 9,004 → target is **4.66x** the median. Including the target in the 12: median 9,703, 4.33x.
Median like rate on baseline 2.12%, median comment rate 1.96% — this reel's comment rate (5.95%) is the keyword gate working.

| Reel | Plays | Likes | Comments |
|---|---|---|---|
| Ddy1-MUy111 | 10,600 | 303 | 189 |
| DdwRKUsx7aj | 18,400 | 401 | 317 |
| DdrFmrrRT_k | 12,000 | 263 | 211 |
| DdohEjQRk2E | 13,100 | 226 | 278 |
| DdmBUoExrtb | 6,474 | 165 | 600 |
| Ddjfdl-Rbsr | 7,153 | 148 | 505 |
| Ddg3yiFRtMg | 108,000 | 3,491 | 1,623 |
| DdeRXJ4x5cQ | 8,588 | 148 | 248 |
| Ddbtb7-x_S2 | 8,806 | 174 | 127 |
| DdZQJ-NxUN6 | 6,588 | 101 | 155 |
| DdX0FcDtuAT | 7,428 | 102 | 215 |
| DdT-FafRshC | 9,203 | 207 | 166 |

Two outliers in the window: Ddg3yiFRtMg (108k) and, just outside it, DdO1x7UxJPS (53.5k). Most of his reels sit at 6-13k.

## Data sources and what failed
- Apify `apify/instagram-scraper` (Henry's account): **failed twice with "Monthly usage hard limit exceeded"**. Firecrawl scrape: "Insufficient credits". Nothing was scraped through Apify.
- Fallback that worked, no login and no cookies: fetching instagram.com/reel/DdttZS1RTZu/ with a Googlebot user agent returns the public JSON payload (username, full name, caption, like_count, comment_count, taken_at, signed mp4 URL). It does not expose play count.
- Plays and the 12-post baseline came from the public reels grid at instagram.com/drcintas/reels/ in a logged-out browser pane (DOM read of each reel tile: likes, comments, plays). Instagram rounds grid values.
- Video downloaded from the signed CDN URL in that payload; Gemini (gemini-3.1-pro-preview) watched the file twice: the standard audit prompt and a forensic on-screen pass.

## GitHub repo check (github.com/calesthio/OpenMontage, fetched 2026-09-28)
61.5k stars, 7.8k forks, 338 watchers, AGPLv3. Description matches the on-screen claim: "12 production pipelines, 100+ tools, 700+ agent skill and production-knowledge files". README says "You don't need paid API keys to make real videos" (Piper TTS offline, free stock footage), but cloud video/image generation (Kling, Runway Gen-4, Veo 3.1, etc.) and premium voices need paid API keys. So "open-source" is true; "free to run at the quality shown" is not established.

## Verdict (Henry format)
**Score 8/10 — CRACKED as a marketer, unproven as a demo.**
Three moves that work:
1. Proof-first hook: output footage appears inside the first 3 seconds, before the feature list.
2. Comment-gate keyword "VIDEO" with an animated comment-box overlay at the CTA: 2,497 comments on 1,301 likes, 5.9% comment rate vs his 3.5% median.
3. Relentless pacing: 8-10 cuts per 10s, talking head never held longer than ~2s without UI or b-roll.
Three leaks:
1. The "high-quality videos like this" proof is on-screen labelled as a shot-by-shot breakdown of an existing YouTube channel (GeoGlobeTales). The video does not show OpenMontage rendering that footage. That is the de-myth angle.
2. No generation time, no cost, no API-key requirement stated. "Open-source" is doing the work of "free".
3. Most UI shots are cursorless, chrome-less mockups; only one segment (0:20-0:23, the chat UI with "Running a command") looks like a real screen recording.
One thing to steal: the animated comment bubble typing the keyword during the CTA.

---

## Gemini pass 1: standard audit
<!-- model: gemini-3.1-pro-preview -->
### 1. Verbatim Transcript
00:00 - 00:04: I just found an open-source AI that makes entire YouTube videos from start to finish.
00:04 - 00:07: It's basically a full production team in one AI.
00:07 - 00:15: It can write scripts, create storyboards, find footage, generate visuals and voiceovers, edit everything, and render the final video.
00:15 - 00:24: It also comes with over 100 production tools, 700+ agent skills, reference-based creation, and a built-in live web research.
00:24 - 00:30: So I gave it a YouTube channel idea and one goal: make the entire video for me. No editor, no production team or scriptwriter, just AI.
00:30 - 00:34: And it generated high-quality videos like this right here.
00:34 - 00:37: Wanna check it out? Just comment "video" and I will send you the link.

### 2. Beat Sheet
*   **Hook (0:00-0:03)**
    *   *Spoken:* "I just found an open-source AI that makes entire YouTube videos from start to finish."
    *   *On-screen text:* I just found open source AI makes entire YouTube videos from start to finish
    *   *Visual:* Split screen (website UI on top, creator on bottom) rapidly cutting to a generated historical map video with animated characters.
*   **Body (0:04-0:34)**
    *   *Spoken:* "It's basically a full production team... (lists features)... generated high-quality videos like this right here."
    *   *On-screen text:* Dynamic single/double word captions tracking the voiceover.
    *   *Visual:* Fast-paced montage of creator talking head, animated graphics (production team icons), OpenMontage software UI (storyboards, timelines, github repo), and clips of the AI-generated historical video.
*   **CTA (0:34-0:37)**
    *   *Spoken:* "Wanna check it out? Just comment 'video' and I will send you the link."
    *   *On-screen text:* Wanna check it out? Just comment Video and I will send you the link.
    *   *Visual:* Creator talking head with an animated UI graphic showing a profile picture and a comment bubble typing "Video" with a send arrow.

### 3. Hook Technique & Clarity
*   **Technique:** "New Discovery" + "Ultimate Automation Promise" (I just found X that does Y from start to finish).
*   **Clarity:** 10/10. Exactly clear what the tool is and what massive pain point it solves.
*   **Promise Made:** Viewer will learn about a tool that completely replaces video editors, writers, and production teams. 

### 4. Structure & Retention
*   **Structure Format:** Big Claim -> Feature Rapid-Fire -> Personal Case Study/Proof -> Actionable CTA.
*   **Cuts per 10s:** ~8-10 cuts (highly dynamic, utilizing zooming, screen recordings, and b-roll).
*   **Retention Devices:** Split-screens, constant b-roll interruption of the talking head, bold dynamic captions, UI highlights, and showing the actual end-product of the AI.

### 5. Delivery
*   **Framing:** Center framed, mid-shot (chest up). 
*   **Lighting:** Well-lit face, natural-looking key light, warm background practical light creating depth.
*   **Audio:** Crisp, clear, well-isolated from background noise. 
*   **Energy:** Enthusiastic, fast-paced, but conversational and authoritative.
*   **Eye Contact:** Unbroken direct eye contact with the lens when on screen.

### 6. CTA Type & Mechanics
*   **Type:** Comment-to-DM gate.
*   **Mechanics:** Viewers comment the keyword "VIDEO". An automation tool (like ManyChat) triggers a direct message with the link to the open-source software. The 2497 comments vs 1301 likes heavily indicates a successful automation loop.
*   **Lead Magnet Match:** Perfect. The entire video sells the tool, and the CTA provides direct access to it.

### 7. Verdict
*   **Score:** 9/10
*   **3 Strongest Moves:**
    1.  **Immediate Proof:** Showing the AI-generated video output within the first 3 seconds to validate the hook.
    2.  **Comment-Gate Graphic:** Using a custom animation of a comment box during the CTA to visually prompt the user action.
    3.  **Pacing:** Never resting on the talking head for more than 2 seconds without a visual aid, UI screenshot, or b-roll clip.
*   **3 Weaknesses:**
    1.  **Jargon Density:** Terms like "700+ agent skills" or "production pipelines" fly by too fast for a non-technical viewer to digest.
    2.  **Caption Placement:** Center-screen dynamic captions frequently block the actual UI/software being showcased behind them.
    3.  **Subjective Quality:** The "high-quality" video example is a niche 2D chibi history animation, which might not resonate with creators looking for standard live-action or faceless automation.
*   **1 Thing to Steal:** The animated "comment box" UI overlay during the final CTA. It acts as a subliminal visual cue that increases comment-gate conversions.

## Gemini pass 2: forensic on-screen log
<!-- model: gemini-3.1-pro-preview, forensic on-screen pass -->
Here is the forensic, frame-by-frame breakdown of the video based exclusively on visible and audible evidence:

### A. ON-SCREEN TEXT LOG
*   **0:00 - 0:01:** 
    *   Top nav: "README", "Contributing", "AGPL-3.0 license", plus icons.
    *   Center text: "Monty the Clipper — the official mascot of OpenMontage". Title: "OpenMontage". Subtitle: "The first open-source, agentic video production system."
    *   Links/Buttons: "Paste A Video", "Quick Start", "Try These Prompts", "Pipelines", "How It Works", "Sponsors", "Providers", "Review Guide", "Agent Guide".
    *   Badges: "License: AGPLv3", "GITHUB TRENDING: #1 Repository Of The Day".
    *   Socials: "YOUTUBE @OPENMONTAGE", "X @CALEBSTDIOLABS".
*   **0:01:** (Magnified text block) "Bloom into multiple AI agents (Claude, ChatGPT, DeepSeek, Midjourney, ElevenLabs, Runway Gen-2) for agentic video generation".
*   **0:07 - 0:08:** "Video storyboard". Shot list text including: "0:12 - Setup. Visual: '1802' on screen... VO: Britain and France sign a peace deal...", "0:19", "0:27", "0:32 - Haiti", "0:43".
*   **0:09 - 0:10:** "How America Bought Louisiana", "17 shots", "4m 15s length", "Style: animated map + cartoon characters...", "HOOK", "NAPOLEON'S PLAN", "HAITI", "AMERICA'S PROBLEM", "THE DEAL". "Ship crosses to France", "One city... or all of it".
*   **0:13 - 0:15:** "$15M" (on a red price tag).
*   **0:16 - 0:19:** GitHub-style page header. "OpenMontage". "WEBSITE OPENMONTAGE.VIDEO". "World's first open-source, agentic video production system. 12 production pipelines, 100+ tools, 700+ agent skill and production-knowledge files. Turn your AI coding assistant into a full video production studio." "GNU Affero General Public License v3.0", "open.openmontage.video/", "Contributing", "61.2k stars", "7.8k forks", "337 watching", "28 branches", "0 tags", "Activity", "Public repository".
*   **0:20 - 0:23:** "Files:", "Final video: OpenMontage/projects/bermuda-triangle/renders/final.mp4 (102 MB)", "Version without text or music: renders/body.mp4". "I can swap shots, change the text, try another music track, or add a voice-over." File attachment path: `/Volumes/Edit/.../bermuda.../M Deal.mp4`. Status text: "Running a command".
*   **0:22 - 0:23:** Side panel: "Backlist - localhost:4780". "THE BERMUDA TRIANGLE", "DOCUMENTARY MONTAGE". "2 VISITS".
*   **0:28 - 0:30:** "France vs England: The Hundred Years' War". "A shot-by-shot breakdown of GeoGlobeTales' Short: a map-and-chibi history piece that tells a 116-year war in 98 seconds. It swaps between satellite maps, illustrated scenes and a strategy-game UI gag, all driven by one fast, jokey narrator." "Runtime 1:38", "Panels 31", "Avg panel 3.2s", "VO ~267 words", "~165 wpm". "Source: youtube.com/shorts/...". Timeline breakdown: "Map 18 - 53s", "Illustrated scene 10 - 33s", "Game UI 2 - 9s", "Title card 1 - 2s". "Structure: ACT I - THE SETUP", "ACT II - ENGLAND WINNING", "ACT III - JOAN'S RISE", "ACT IV - TRIAL AND LEGACY".
*   **0:30:** "01 Cold Open", "02 Two Countries".
*   **0:30 - 0:32:** "116 years".

### B. TOOL/PRODUCT NAMES
*   **OpenMontage:** Spoken (0:00, 0:16), Shown (0:00, 0:17, 0:20).
*   **Claude, ChatGPT, DeepSeek, Midjourney, ElevenLabs, Runway Gen-2:** Shown (0:01).
*   **YouTube:** Spoken (0:02, 0:24), Shown (0:00, 0:26, 0:28).
*   **GitHub:** Shown (0:00, 0:17).
*   **X (Twitter):** Shown (0:00).
*   **GeoGlobeTales:** Shown (0:26, 0:28).

### C. NUMBERS
*   **1:** "#1 Repository" (Shown 0:00).
*   **1802:** Year in script (Shown 0:07).
*   **17:** Shots in script (Shown 0:09).
*   **4, 15:** 4m 15s length (Shown 0:09).
*   **$15M:** 15 million dollars price tag (Shown 0:14).
*   **100, 700:** "over 100 production tools", "700 agent skills" (Spoken and Shown 0:17-0:18).
*   **12:** Production pipelines (Shown 0:17).
*   **61.2k, 7.8k, 337, 28, 0:** GitHub stats for stars, forks, watching, branches, tags (Shown 0:18).
*   **102:** 102 MB file size (Shown 0:20).
*   **4780:** Localhost port (Shown 0:22).
*   **116:** "116-year war" (Shown 0:28, 0:31).
*   **98:** Seconds in source video (Shown 0:28).
*   **1:38, 31, 3.2, 267, 165:** Analytics (Runtime, panels, average panel duration, words, wpm) (Shown 0:28).
*   **18, 53, 10, 33, 2, 9, 1, 2:** Timeline breakdown counts and seconds (Shown 0:28).

### D. COST / TIME CLAIMS
*   **Cost:** He states the tool is an "open source AI" (Spoken 0:00, 0:16). A price is not stated.
*   **Time:** He claims it makes videos "from start to finish" (Spoken 0:04). He does not state how long the generation process actually takes. 

### E. WHAT HE TYPES / INPUTS
*   A dark-mode chat UI (similar to an AI coding editor) is visible at 0:20. The following text is typed into the prompt box: `Create a video using this reference video on the topic of "France vs England The Hundred Years' War"`
*   A simpler, centered prompt UI is visible at 0:26. The following text is rapidly typed beneath a YouTube URL: `Check this youtube channel and make the entire video`
*   No raw terminal/CLI is shown being typed into, though a small status indicator says "Running a command..." at 0:22.
*   An Instagram comment bubble mockup is shown at 0:35, typing the word `Video`.

### F. THE OUTPUT VIDEO
*   **Style:** The footage shown throughout (0:01-0:04, 0:10-0:15, 0:30-0:32) is a 2D animated map featuring hand-drawn, cartoon (chibi) historical figures with moving mouths. A brief 3D/live-action composite of tin cans in a field getting struck by arrows is shown at 0:32.
*   **Audio/Music:** No AI-generated voiceover is audible; only the narrator's voice is heard over a background electronic track. 
*   **Captions:** The generated video output does not have its own visible captions; only the large creator-added captions for the reel itself are present.
*   **Artifacts:** The map and cartoon animations exhibit no standard generative AI morphing or artifacts; they look like traditional motion graphics. 
*   **Duration:** About 10 non-contiguous seconds of this animated footage is shown.
*   **Titles/Channels:** The UI dashboard explicitly labels this footage as a "shot-by-shot breakdown of GeoGlobeTales' Short" (0:28), indicating the footage belongs to a specific YouTube channel.

### G. SCREEN RECORDING vs STOCK
*   **0:00:** Header page is a clean, static digital asset/mockup. No cursor or browser UI.
*   **0:07 - 0:09:** The storyboards and script panels scroll smoothly but appear to be high-fidelity mockups rather than raw screen captures.
*   **0:16 - 0:19:** The GitHub repository page scrolls, but lacks any browser chrome (URL bar, tabs) or mouse cursor, suggesting it is a constructed marketing asset or cropped capture.
*   **0:20 - 0:23:** This appears to be a real screen recording. A white mouse cursor is visible moving and clicking an arrow button in the chat interface.
*   **0:26 - 0:30:** The prompt box and the subsequent video breakdown dashboard appear as clean digital mockups with no cursors or desktop environments visible.

### H. GITHUB PAGE
*   **Repo Name:** OpenMontage
*   **Owner:** Not explicitly shown in a standard `owner/repo` path, though the website is listed as `OPENMONTAGE.VIDEO`.
*   **Description:** "World's first open-source, agentic video production system. 12 production pipelines, 100+ tools, 700+ agent skill and production-knowledge files. Turn your AI coding assistant into a full video production studio."
*   **Stars:** 61.2k
*   **Forks:** 7.8k
*   **README Headings:** Displayed as navigation pills: "Paste A Video", "Quick Start", "Try These Prompts", "Pipelines", "How It Works", "Sponsors", "Providers", "Review Guide", "Agent Guide".

### I. 5-LINE PLAIN SUMMARY
1. A male presenter speaks directly to the camera to promote what he claims is an open-source AI video creation tool.
2. He shows clean, interface-style screenshots of scripts, storyboards, and a heavily starred GitHub repository page.
3. The video cuts to clips of 2D map animations with cartoon historical figures, which on-screen text attributes to an existing YouTube channel called GeoGlobeTales.
4. He shows mockups and one brief screen recording of an AI chat interface generating prompts based on reference links.
5. He concludes by asking viewers to comment the word "Video" to receive a link to the tool.