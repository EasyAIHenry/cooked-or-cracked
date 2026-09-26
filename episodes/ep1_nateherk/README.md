# Cooked or Cracked — Ep 1: Nate Herk (24 Sep 2026)

01_scripts/        Final script = script-ep1-api.md. shot-list.html = clickable links for screen recording.
02_graphics/       higgsfield-app-api-vs-kie.png = the 3-column table used in the video (1080x1920). Others are earlier versions. .html = editable source.
03_reference/      Nate's original reel + Apify metadata (56.8k plays, 2.6k comments).
04_raw-footage/    Full 6m15s DJI take + full transcript.
05_cuts/           rough-cut-v1.mp4 (69s, fillers + pauses removed, 19 cuts). Premiere XML of the same cut. transcript-EDL.md = which lines were kept.
06_research/       Gemini audit of Nate's reel + baseline stats.

ChatCut Desktop project: "Cooked or Cracked — Ep1 Nate Herk" (holds the same timeline).
Still to do: drop the table PNG over the numbers section, add Nate's clip inserts at hook and CTA, captions.

## v2 (animated) — 24 Sep, later
05_cuts/cooked-or-cracked-ep1-v3-animated-FINAL.mp4 (73s) = the deliverable (v3: table above head, half-page Nate opener, fringe fixed). The two _raw-export files are ChatCut's exports (graphics came out on a green matte, so FINAL was composited with ffmpeg colorkey). Structure:
- 0-4s   Nate's reel full-screen + "COOKED or CRACKED / Nate Herk: the Generate skill" paper super
- 4-11s  Henry hook + "last week / NEW API" stamp
- 11s    Table header pops (Higgsfield website | Higgsfield API | Kie + Claude)
- 16-58s Rows build as spoken: 1 image / 1 video clip / My month. Winner column in orange, values pop on the spoken number, click SFX
- 59-64s "verdict / CRACKED" stamp
- 68-73s "comment / KIE" stamp
Style = same scrapbook system as the AI Editing Guide reel: Fraunces + Kalam on torn paper, ink #171411, accent #DF825F, bubble-pop cues.
MG assets in the ChatCut project: Series super, Paper stamp (label+word), Compare table header, Compare table row (all editable via properties).

## v4 (25 Sep) — rebuilt from ground zero, Cindy Zhu sequential passes
05_cuts/cooked-or-cracked-ep1-v4-FINAL.mp4 (135s). ChatCut project "Cooked or Cracked — Ep1 v4 (Cindy passes)".
Pass 1 speech cut (9 full-sentence runs) · Pass 2 reaction opening (Nate window + pill) · Pass 3/4 24 bottom stamps + Higgsfield logo · Pass 5 table builds top of frame · Pass 6 paper pops + clicks · Pass 7 word-highlight captions · Pass 8 export (green-matte workaround composited with ffmpeg).

## v5 (25 Sep) — polish pass
05_cuts/cooked-or-cracked-ep1-v5-FINAL.mp4 (131s) = current deliverable.
Added: pricing-tier card (Starter $15/200cr, Plus $49/1,000cr vs Kie from $5/1,000cr, never expire) popping on the spoken prices · COOKED/CRACKED scoreboard on the left wall all video, ticks at the verdict · table clears + paper confetti + trophy at "Kie beats both" · verdict and all later stamps moved to the top zone (no empty wall) · icon badge on every stamp · "shocking" label removed.
Style saved as a reusable skill: ~/.claude/skills/henry-scrapbook-reel (invoke with /henry-scrapbook-reel or "edit this in my scrapbook reel style").

## v6 (25 Sep 2026) — audio level, jingle, colour layers, dead-air subtitles
- **Deliverable:** `05_cuts/cooked-or-cracked-ep1-v6-FINAL.mp4` (133 s, 1080x1920, 30 fps).
- **Voice:** whole mix now runs highpass 70 Hz → gentle 2.5:1 compressor → two-pass loudnorm to -14 LUFS / -1.5 dBTP (was -20.8 LUFS with clipped peaks). Chain lives in `05_cuts/v6-passes/composite-v6.sh`; tweak `ACH` or the `I=` target there.
- **Jingle:** original 2.3 s sting "Cooked or Cracked?" (robot vocoder, riser → hit → tag → chime) generated in ChatCut, cut from `07_audio/jingle-take2.mp3` → `07_audio/cooked-or-cracked-sting-v1.wav`. Placed at 0:04 on its own audio track **"JINGLE — Cooked or Cracked sting"** with a 2 s silent hold shot of Henry (source 4.6–6.6 s) and a title card MG (COOKED / OR / CRACKED? popping word by word, over the chest, never the face). Everything after 0:04 shifted +60 frames. Reference: `03_reference/nateherk-jingle-ref-Dba-hJgCxeP.mp4` (Nate's "Is it fact or hype?" sting at 0:07).
- **Colour treatment (adjust in ChatCut, exports in the base pass):** two labelled video tracks sit under all supers:
  - **COLOUR 1 — grade**: exposure, contrast, saturation, warmth, lift shadows, vignette strength/softness.
  - **COLOUR 2 — super backing shade**: top/bottom band height, darkness, softness, tint colour. Turn a band off by setting its darkness to 0.
- **Subtitles:** captions (Inter 800, Kie/Higgsfield/Claude/Seedance/Kling spelled) are overlaid only where no super is on screen: 0:06–0:08, 0:21–0:23, 0:40–0:41, 0:52–0:54, 1:06–1:09, 1:15–1:17 and continuously from 1:31.7 to the end. Windows are the `CAPWIN` line in the composite script.
- **Passes:** `05_cuts/v6-passes/` holds base / graphics / confetti / captions exports + the composite script. Re-run: `./composite-v6.sh /path/out.mp4`.
- Gotchas hit this round: ChatCut `ripple` only shifts the edited track; ChatCut switched itself to a new blank project mid-session (re-target with `target_project`); the take's transcript vanished and had to be re-transcribed + re-spelled (49 FIX commands).
- Opener note: the ChatCut base export draws Nate's reaction window with green speckles in dark areas, so the composite script re-lays the clean reel (`03_reference/nateherk-reel-DdolgdJjHMc.mp4`) into the window rect for the first 4 s. Final audio is peak-limited to about -2 dBTP.

## v7 (25 Sep 2026) — jingle clarity, stamp fixes, "last week" cut, themed subtitles
- **Deliverable:** `05_cuts/cooked-or-cracked-ep1-v7-FINAL.mp4` (132.3 s).
- **Jingle v2:** music bed dropped 13 dB, spoken tag "Cooked... or cracked?" (ElevenLabs "Alex") on top; `07_audio/cooked-or-cracked-sting-v2.wav`. Old sting kept as v1.
- **Stamps:** icon badge moved fully inside the card corner (no overlap, no clipping); long words auto-shrink to fit (fixes "AE + PREMIERE", "NANO BANANA 2"). Applies to all 24 stamps via the shared asset.
- **Evergreen wording:** "last week" cut from the audio (0:09.8, 21 frames) and the stamp label changed from "last week" to "Higgsfield"; everything after shifted 21 frames earlier. Prices remain as of the edit date (24–25 Sep 2026).
- **Subtitles:** switched to ChatCut's "Paper Stack" preset in Fraunces 900 uppercase, ink on paper cards with orange active word. Same dead-air windows (updated for the cut) in `05_cuts/v7-passes/composite-v7.sh`; the caption pass renders ~28% dark on the green matte so the script brightens it back (`lutrgb ×1.38`).
- **v7 jingle (final):** sung vocoder-pop take ("CoC jingle D"), cut 0–2.6 s → `07_audio/cooked-or-cracked-sting-v3.wav`, used alone (no extra bed), styled after the "Should I open it or keep it sealed" short (`03_reference/jingle-ref-should-i-open-it-PwHBas0uJsg.mp4`). v2 spoken tag rejected (sounded like a voice-over).
- **"All three" moment:** the three table header tags now pop one at a time as Henry names them (0:15.6 Higgsfield website, 0:17.6 Higgsfield API, 0:19.2 Kie + Claude) with a bubble-pop each, and stay. The header MG got `d1/d2/d3` frame properties; the LET'S COMPARE stamp label is now "okay,".

## v8 (25 Sep 2026, evening) — safe zone, brighter grade, title on top. UPLOAD THIS ONE.
- **Deliverable:** `05_cuts/UPLOAD-THIS-cooked-or-cracked-ep1-v8.mp4` (132.3 s, 1080x1920, -14.7 LUFS).
- Every super now sits inside the Reels safe area (y 120–1560, clear of the right icon rail): table/tier card/logo start at y 120–250, bottom key-word stamps sit at y 1140–1500 over the chest, verdict stamps at y 150, scoreboard unchanged.
- Title card redesigned to two rows (COOKED · OR / CRACKED?) and placed at the top, y 140–540, never over the face.
- Grade brightened: exposure 0.22, saturation 1.15, vignette 0.10; backing bands eased to 0.12 / 0.15.
- ChatCut now exports motion graphics with real transparency on this account, so v8 is ONE app export (`v8-passes/cooked-or-cracked-ep1-v8-full.mp4`) + the caption band from a second export inside the dead-air windows + voice levelling. Script: `v8-passes/composite-v8.sh`. Edges checked at 2x: no fringes, no green.


## Purge (25 Sep 2026, 23:13)
All cuts before v8 (v1 rough cut, v3, v4, v5, v6, v7 finals, raw passes, v6/v7 pass folders) and the matching ChatCut exports were moved to `~/.Trash/cooked-or-cracked-purge-2313` on Henry's request. Only `05_cuts/UPLOAD-THIS-cooked-or-cracked-ep1-v8.mp4` and `05_cuts/v8-passes/` (the two app exports + composite script needed to rebuild it) remain. Nothing in this folder has been uploaded to Google Drive by Claude; the DRIVE_ prefix is just the folder name.
