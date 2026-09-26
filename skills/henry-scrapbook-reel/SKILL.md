---
name: henry-scrapbook-reel
description: Henry's signature reaction-reel edit ("Cooked or Cracked" style) in ChatCut Desktop. Torn-paper scrapbook graphics, reviewer-reaction opener, bottom key-word stamps with icon badges, comparison table that builds at the top, checkbox scoreboard, confetti celebration, word-highlight captions, three-pass export workaround. Use when Henry says "scrapbook reel style", "edit this like Cooked or Cracked", "/henry-scrapbook-reel", or hands over a new talking-head take in the Content Creation project.
allowed-tools: Bash, Read, Write, mcp__chatcut_desktop__*, mcp__Apify__call-actor, mcp__Apify__get-dataset-items
---

# Henry scrapbook reel

Follow Cindy Zhu's sequential passes: cut speech first, everything else second, one job per pass, preview a frame before committing, keep everything editable. Confirm each pass with Henry before the next.

## Style constants (do not drift)
- Paper #FFFEFA with ruled lines, ink #171411, accent #DF825F, fourth colour #F2C14E (confetti only).
- Fonts: Fraunces 900 for numbers and words, Kalam 700 for handwritten labels, Inter 800 for captions and the pill.
- Motion: pop-in with overshoot (scale 0.3→1.1→1 over ~13 frames) and 1–3° tilt, orange underline draws in over ~18 frames, then HOLD STILL. No fades, no pulsing, no spinning.
- Torn edge clipPath and ruled background are in `references/mg-code.md`. Reuse that code; only change text/props.
- Sound: Synthetic Bubble Pop on every graphic entrance, Mouse Click on every price card. Files in `references/`.

## Layout rules
- Reviewer stays full frame at scale 1, never cropped.
- Opening 0–4 s: reviewed reel in a 400-wide portrait window low-left (below the chin), white rounded frame + shadow, "Cooked or Cracked?" pill top-centre, Henry muted, reel audio only.
- Comparison table builds at the TOP (y 10–580) as prices are spoken; values pop on the spoken number; winner column orange with drawn underline.
- Key-word stamps (label + big word + icon badge) at the BOTTOM (y 1510) while the table is up; move to the TOP (y 120) once the table leaves. One stamp per key phrase, start to end, no gaps, never the same phrase twice.
- Checkbox scoreboard (COOKED / CRACKED) on the left wall beside the head (x 30, y 640) for the whole video; tick at the verdict.
- Celebration: when the winner is declared, table clears, full-frame paper confetti, trophy stamp at top.
- Captions: word-level, Inter 800, white with dark stroke, highlight word in accent, placed just above the bottom stamps.
- Rule: no empty wall at any time. If a zone is empty, put the current stamp there.

## Passes
1. Speech cut: full sentences only, drop tangents, target 60–130 s. Fix transcript brand names with `manage_transcript` BEFORE cutting (Higgsfield, Kie, Claude, Seedance, Nano Banana, Kling). Show the cut list, wait for "apply".
2. Reaction opener (window + pill + muted reaction footage inserted with ripple).
3. Style is fixed (above). 4. Stamps with icons on every key phrase. 5. Table at top. 6. Sound cues. 7. Captions. 8. Export.

## Export (ChatCut without Pro renders graphics and captions on green)
Three passes, all 1080p 30fps: base (graphic tracks hidden, captions off), graphics (tracks on, captions off), captions (tracks hidden, captions on). Composite with ffmpeg: see `references/export.md`. Verify voice with volumedetect and check a contact sheet before delivering. Package into `DRIVE_<episode>/05_cuts/`.

## Gotchas
- Items re-added by `apply_script` bare rows can inherit -60 dB; set decibelAdjustment 0 on all speech clips and verify by exporting audio.
- `apply_script` after a transcript fix that blanked words will micro-cut those words; trim with `edit_item` sourceIn/durationFrames + `edit_track tighten` instead.
- Moving an MG item onto an occupied span silently relocates it to another track; pass trackId explicitly.

## v6 additions (25 Sep 2026)
- **Jingle opener:** after the reaction window, insert a 60 f silent hold shot of Henry (muted video item, source from a silent stretch) and play the "Cooked or Cracked" sting (`references/cooked-or-cracked-sting-v1.wav`, 2.3 s) on an audio track named `JINGLE — Cooked or Cracked sting`. Overlay the "Jingle title" MG (COOKED / OR / CRACKED? word pops at frames 4/18/30) at left 40, top 1080 (over chest/table, never the face).
- **Colour layers:** two block pixel-effects on labelled tracks between V2 and the supers: `COLOUR 1 — grade` (custom shader: exposure/contrast/saturation/warmth/lift/vignette) and `COLOUR 2 — super backing shade` (top/bottom gradient bands). They render in the base pass, so no keying needed.
- **Voice:** in the ffmpeg composite run `highpass=f=70, acompressor(threshold -24 dB, 2.5:1, makeup 2)`, then two-pass `loudnorm I=-14 TP=-1.5 LRA=7 linear=true` on the graphics-pass audio.
- **Dead-air captions:** overlay the captions pass only inside stamp gaps ≥1.5 s and from the frame the stamps move to the top zone onward (`overlay ... enable='between(t,a,b)+...'`).
- **Gotchas:** `edit_item ripple:true` shifts only the edited track — shift the other tracks with `startDeltaFrames` per item. In zsh scripts write `${var}` before a `:` (loudnorm `offset=$x:linear` breaks). If ChatCut flips to a new blank project, `target_project` the episode id and pass `timelineId` to `local_export`. If the take's transcript disappears (captions 0 cards), `trigger_transcript` and re-run the FIX batch (word indices were stable across re-transcription).
- **v7 learnings:** stamp word auto-fits (`fitSize = min(wordSize, 840/(len*0.74))`) and the badge sits at left 16 / top 8 inside the 1000x400 box (never overlaps or clips). Sting v2 = music bed -13 dB under a TTS tag (ElevenLabs "Alex", "Cooked... or cracked?"); keep `references/cooked-or-cracked-sting-v2.wav`. Captions: ChatCut preset `off-the-wall` (Paper Stack) + Fraunces 900 uppercase, ink `#171411`, highlight `#DF825F`; the captions pass renders ~28% dark on the green matte, so brighten with `lutrgb ×1.38` after keying (no geq recolor). Avoid time-bound words ("last week") in speech and labels. Updating `durationFrames` on an MG item can wipe its `propertyOverrides`; re-check with inspect_item.
- **Jingle rule (confirmed 25 Sep):** the sting must be SUNG with autotune/vocoder, vocal upfront, near-silent backing, ~2.5 s, abrupt start (like the "Should I open it or keep it sealed" short). Spoken TTS tags and busy music beds were both rejected. Use `references/cooked-or-cracked-sting-v3.wav`. When generating a new one, prompt: "solo male, heavily autotuned/vocoded, bouncy staccato hook, faint pop synth only, phrase repeated with silence between", then have Gemini rate intelligibility and pick the window.
- **Table header:** the header MG has d1/d2/d3 pop frames; align them to the words where Henry names each column and drop a bubble-pop cue on each.
- **v8 export rule:** test one full export first. If MGs come out transparent (they did on 25 Sep evening), skip the four-pass keying: single export + a captions export, then `v8-passes/composite-v8.sh` overlays the caption band (y 1440–1740) only in the dead-air windows and levels the voice. Reels safe layout that Henry approved: table/tier/logo from y 120, bottom stamps at y 1140–1500 width 900 left 90, verdict stamps at y 150, compact two-row title at y 140. Grade: exposure 0.22, saturation 1.15, vignette 0.10, bands 0.12/0.15. Call `target_project` at the start of every response.
