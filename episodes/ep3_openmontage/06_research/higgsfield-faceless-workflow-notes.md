# Higgsfield `faceless-video` workflow (v2.4) — distilled method

Source: `get_workflow_instructions` result, workflow `faceless-video`, version 2.4, `mode: workflow`, `source: bundled_resource`, `scripts_dir: /home/user/.higgsfield/workflows/faceless-video`. The JSON's `instructions_markdown` is the bundle's SKILL.md (120,095 characters, 1,696 lines). Only that file was read; the `references/*.md` and `scripts/*` it points at were not loaded (`get_workflow_bundle_file` would fetch them). Quotes below are verbatim from the SKILL.md.

Read this against Henry's brief (60–75 s, 9:16 Short, nine shots, one narrator via `seed_audio` preset "Elodie", Kling 3.0, burned captions, under ~90 credits). The workflow does several things differently from that brief; the deltas are flagged in each section.

---

## 1. Consistent visual style across scenes

**Mechanism in one line:** one style key image built on reference images, one 80–100 word style formula pasted byte-identically into every prompt, an asset roster (characters, locations, props) generated from that key, and every clip generated image-to-video from those asset images (never from the style key or from text alone).

**Image model and video model are locked.** Golden Rule 1:

```
1. **Models are LOCKED. Never substitute.** Assets/style key → `seedream_v5_pro`
   (image), always with `resolution:"1k"`.
   Clips → `minimax_h3` at `resolution:"2K"` (video). Fixed-window narration → `text2speech_v2` with
   `variant:"elevenlabs"`; `seed_audio` stays only for Kids song and the stills
   continuous read.
```

So the workflow does NOT use Kling 3.0. Its video model is `minimax_h3` at `resolution:"2K"`, `duration:10`, and the method is entirely built around 10 s blocks. The consistency method (style key, formula, asset refs) transfers to Kling I2V; the block/cut mechanics do not.

**Phase 1 — style key.** Built on donor reference images first, prose second:

```
**RULE 0 — THE STYLE KEY IS ALWAYS BUILT ON REFERENCE IMAGES, NEVER ON PROSE ALONE.**
Before generating any style key, collect the donor images for the chosen style and pass
them ALL as `image_references` in the ONE `seedream_v5_pro` call that also carries the
formula. A text-only key is allowed **only** when every source below came back empty,
and then you say so out loud. Collect, in this order (dedupe, ≤7 refs total):
```

Donor sources, in order: the preset card's own style image (via `resolve_explainer_preset` → `media_id`), the style file's pinned canonical refs, or the user's own uploads (≤3, and if present they are authoritative and used alone). For custom/uploaded looks:

```
generate ONE **pretty, readable style
  SAMPLE** with `seedream_v5_pro` (`aspect_ratio` = chosen aspect,
  `resolution:"1k"`): a small representative
  vignette — one simple recognizable subject rendered so the line weight, shading and
  colours read at a glance — NOT formless blobs. **Never draw a palette strip, colour
  chips, swatch bar, labels or a reference-sheet layout:** the style key is attached to
  every later asset and block, so anything drawn into it can propagate into the video.
```

The locked formula:

```
Write the
  80–100-word locked formula from the donors' visible line/surface work, shading,
  palette, background treatment and motion implication only; paste it byte-identical in
  every later prompt.
```

**Phase 2 — asset roster** (the actual consistency mechanism):

```
Tool: image (`seedream_v5_pro`, always `resolution:"1k"`). Pass the **look anchor** (preset style-reference
media_id OR custom `style_key_job_id`) as `medias` (role `image`). Embed the ONE style
formula BYTE-IDENTICAL in every asset prompt (this is the entire consistency mechanism).
```

Roster rules:

```
- **Characters** — `aspect_ratio` 2:3: full body, plain flat backdrop, distinctive readable design.
- **Locations — MULTIPLE, not one** (`aspect_ratio` = chosen aspect): a real DRESSED
  environment with one named anchor object, NO people. Generate **enough distinct
  locations that no single one carries more than ~2 CONSECUTIVE blocks** (a location may
  return later in the video; a 2-min / 12-block video wants ~4–6 locations). For each location also generate 1–2 **coverage angles**
  (reverse / lateral / detail crop) so blocks in the same place aren't the identical plate.
- **Props** — `aspect_ratio` 1:1: single isolated object, no hands/scene.
```

**Phase 4 — clips reference the assets, never the key alone.** Golden Rule 3:

```
3. **Compose from the approved assets.** Every clip references the Phase-2 asset images
   (`medias`, role `image_references`), in the order **location → characters → props**. NEVER
   generate a clip/still from the style key alone. Frames are full staged scenes, never
   an object on a blank/white background.
```

Per-clip parameters:

```
`duration:10`, `resolution:"2K"`, `aspect_ratio`: chosen aspect, `medias` = location →
characters → props (role `image_references`). **HARD LIMIT: at most 7 image_references
per call** — retain this packing even though H3 supports more. Send
ONLY the assets that appear in THIS block; if a block still exceeds 7, trim in reverse
priority (extra props first, then the spare coverage view) — NEVER drop the block's
location or an on-screen character.
```

Aspect must be explicit on every video call (Golden Rule 4): "**Pass `aspect_ratio` EXPLICITLY on every video call** (the chosen aspect; default `16:9`). It does NOT inherit from the style key."

Style fidelity is a QC gate (Golden Rule 19):

```
19. **Style fidelity — clips MUST match the asset sheets 1:1.** Same character design,
    same palette, **same background treatment** (if assets are white/clean-bg webcomic,
    the video stays white/clean-bg webcomic). ONE consistent style across the whole video
    — no per-shot restyle, no object drift, no style scatter.
```

And block 1 gets a specific look check (GATE 4): "Block 1 is generated with the least context and drifts most often … A character whose design, palette or line weight does not match its sheet is a NAMED style violation: regenerate that block with the sheet re-attached before any voice work starts."

References are immutable across retries (Retry Ladder 6): "Every retry keeps the exact same ordered `medias` as the failed call. Reword prompt text or framing only. Never turn a reference-bound style key, asset, frame, or clip into text-to-image/text-to-video to get around moderation."

Through-line prop (Phase 3): "pick the **through-line** (one physical object that appears in every block, escalates monotonically, resolves in the payoff — and gets its own Phase-2 prop asset so it never morphs)".

**Stills mode (the closer match to an I2V-per-shot Short):** one held image per spoken beat, with ~2 of every 3 frames being a literal edit of the previous rendered frame:

```
**~2 of every 3 frames must be `variation` — and a `variation`
is a literal EDIT of the previous rendered frame (that frame's job_id as the ONLY
image reference, NO asset sheets/location/props on the call), not a fresh render from
assets. Sending assets on a variation rebuilds the scene and produces a different
picture — the #1 picture-story bug.
```

**Transfer to Henry's Short:** style key (1 image) → asset roster (1–2 characters at 2:3, 3–4 locations at 9:16 plus a coverage angle each, 1 through-line prop at 1:1) → each of the nine scene stills generated with the formula byte-identical and the roster attached as references → Kling I2V from each scene still. Kling is a substitution the workflow forbids for itself, so its 2K/10 s/native-audio expectations do not apply.

---

## 2. Fitting narration to clip lengths

**Motion mode: per-scene takes, one line per fixed 10 s block, never one continuous VO.** Golden Rule 15:

```
15. **Duration is FIXED = N×10s (the target). NEVER shorten the video to fit short audio**
    (the "2:00 → 1:35" bug). Each block stays 10s. **One voice line per block,
    7.8–9.5s of detected speech**,
    centered in its block by the assembler. If detected speech exceeds 9.5s → rewrite
    it shorter and regenerate. If the whole thing feels short, ADD narration — never
    trim the video.
```

Block count: "Compute **N = duration_seconds / 10, rounded half-UP (45s → 5), minimum 3**."

**Words per second / per line:**

```
It also enforces LINE HYGIENE:
the word band is **20–23 words** per 10s line (**Kids 17–21**, matching the `narrator`
skill), conversational filler ("you know", "I mean", "basically", "kinda", "um") is
rejected outright, and a content word repeated within six words is rejected as stacked
padding.
```

```
The validator's bands are calibrated to ElevenLabs. `speech_metrics.sh --text` also
requires `rate=ok` with a 2.9 wps ceiling; an out-of-window or rushed line is rewritten,
never stretched or rescued with a global word-band override.
```

So the working rate is roughly 20–23 words in 7.8–9.5 s of detected speech (about 2.3–2.6 wps), with 2.9 wps as the "rushed" ceiling. For a pasted script: "Split it into blocks at sentence boundaries at ~20–23 words per block, tell the user the length that produces (`N = ceil(words / 22)` blocks → `N × 10s`)".

**How speech duration is measured:** each take is transcribed and measured by the bundled helper, which calls the narrator workflow's metric script:

```
sandbox_exec({
  command:"python3 ${HF_WORKFLOWS}/faceless-video/scripts/measure_narration_takes.py --script script_manifest.json --voice-dir work/voices --duration-seconds {requested_seconds}"
})
```

```
**MEASURE ONLY WITH `measure_narration_takes.py`, AND NEVER RE-CUT THE TAKE.** It calls
`${HF_WORKFLOWS}/narrator/scripts/speech_metrics.sh` with the exact manifest text.
… The metric script already
trims the provider's head and tail padding, so its `speech=` is what the assembler will
centre.
```

Window bands (GATE 5): "target 7.8–9.5s, soft 7.2–7.8s only after one retry, hard reject outside 7.2–9.5s; scale these bounds for a short final block … lands in its window with `rate=ok`, and has no internal pause ≥0.8s."

Content check on top of length: `verify_takes.py` transcribes each take with Whisper `tiny` and "refuses a mismatch" (a dev run got another video's audio back with perfect lengths).

**Fix-by-rewrite, never by stretching.** Golden Rules 16 and 18:

```
16. **Sync is by construction:** one line lives inside its own 10s block, so a line never
    bleeds into the next scene. **Never `atempo`/speed-change/pitch-shift** audio to fit —
    rewrite + regenerate instead.
```

```
**LENGTHS ARE BIMODAL, SO WORK THE WORDS, NOT THE KNOBS.** The same line comes back near 9.0s
or near 10.4s, and `speech_rate` is a weak, non-linear, noisy lever (the same value produced
8.5s and 11.5s) — leave it alone. What actually moves a take between the modes: ±1–2 words, and
unrolling comma lists into one flowing clause. A line stuck above the ceiling after two
attempts gets SHORTER WORDS, not a third identical roll.
```

Take editing is banned: "**NEVER EDIT A TAKE. REGENERATE OR REWRITE.** Trimming silence, inserting silence, `silenceremove` or cutting internal pauses — all banned. The one permitted transform is the exact final-click removal before measurement."

Attempt budget: "at most three attempts per failing line, retry only that line, and keep passing takes immutable. A third take requires changed text."

**Voice engine.** The workflow pins `text2speech_v2` / `variant:"elevenlabs"` for per-block takes and treats `seed_audio` as valid only for Kids song and the stills continuous read (Golden Rules 1 and 17). Voice pair is written to `voice.lock` and re-read before every call; resolving a voice by name mid-run is banned because it produced "a different timbre in every block". Delivery direction: "ONE `{DELIVERY}` phrase for the whole video (channel + topic — see `references/vo_and_captions.md`), plus optional per-block mood".

**Stills mode is the one-continuous-VO path:**

```
**Stills voice = ONE continuous narration, then Whisper (NOT per-beat takes).** Follow the
CONTINUOUS mode in the loaded `narrator` workflow (2048-char chunking + lossless join) for one
`work/voices/narration.wav` … The frame timeline then comes from
Whisper word timestamps per `references/picture-flow.md` Phase 5 / 5b: segments every
~0.7-1.2s and at every framing change, no frame segment >1.5s.
```

In stills mode "each spoken beat gets ONE image held for exactly its line's length, timing comes from the audio (not from 10s blocks)".

**Transfer to Henry's Short:** with nine shots over 60–75 s the average shot is ~7–8 s, close to the workflow's 10 s block. Either (a) per-shot takes, ~15–19 words each targeting 6–7.5 s of detected speech inside a 7–8 s clip, measured with ffmpeg silence detection / Whisper, rewriting words rather than stretching; or (b) the stills-mode approach: one continuous "Elodie" read, Whisper word timestamps, cut Kling clips to the words. The workflow's `seed_audio` usage is (b). Note the 20–23-word band is calibrated to ElevenLabs; re-measure for Elodie.

---

## 3. Exact prompt structure — scene image and image-to-video motion

The full templates live in `references/prompts.md` (`§1` style-only prefix, `§2` asset templates, `§3` block template), which was not part of this file. The SKILL.md gives the skeleton.

**Style key (Phase 1):** the verbatim "style-only prefix from `references/prompts.md §1`" + the 80–100 word formula; negative prompt must exclude "palette strip, colour chips, swatch bar, labels or a reference-sheet layout".

**Scene image / asset image (Phase 2):** style key attached as `medias` role `image`; formula embedded byte-identical; per kind: character "full body, plain flat backdrop, distinctive readable design"; location "a real DRESSED environment with one named anchor object, NO people"; prop "single isolated object, no hands/scene". Templates → `references/prompts.md §2`.

**Motion prompt (Phase 4), per block:**

```
The prompt contains the
FIVE timed hard-cut shots (`SHOT 1 0.0–2.0s … HARD CUT … SHOT 2 2.0–4.0s … HARD CUT
… SHOT 5 8.0–10.0s`; Kids: the 4-cut pattern). Ordinary and
`block_kind:"narration"` prompts add "characters only emote, do NOT talk" plus
diegetic-audio-only.
```

Regeneration form when cuts under-deliver: "regenerated ONCE with the cuts spelled out shot by shot ("SHOT 1 (0.0–2.0s): …" … "SHOT 5 (8.0–10.0s): …")".

Each shot must carry a framing size and angle, varied from its neighbours (Golden Rule 22):

```
22. **No samey footage.** Vary shot SIZE and ANGLE on EVERY cut (WIDE / MEDIUM / CU / OTS
    / low / high) — do NOT reopen every block on the same establishing WIDE. **OTS is
    legal ONLY when a named on-screen character's shoulder/head is deliberately visible
    in the foreground.** For an object-only, diagram, empty-location, or otherwise
    characterless shot, OTS is FORBIDDEN — use overhead/top-down, low/high angle, macro,
    lateral, or another coverage angle instead. Never use OTS as a synonym for an angled
    view; it makes the video model invent a person.
```

Motion from frame 1 (Golden Rule 21): "**No leading freeze.** Every block prompt demands motion from frame 1".

No lip-sync (Golden Rule 7): "**Characters never talk on screen** (no lip-sync). The voice is an external narrator added in post. Prompts say "characters only emote and gesture, they do NOT talk.""

Banned tokens (Golden Rule 10): "the tokens `child` / `kid` / `childlike` (use `naive` / `small` / `simple`); any real brand / studio / IP name (describe the look instead)."

Script manifest shape the validator expects (Phase 3):

```
`{topic,genre,animation_mode:"fully_animated",channel_type,style,through_line:{name,asset,progression,resolution},
arc:{hook,build:[...],turn,payoff},blocks:[{n,arc_role,vo_line,location,
through_line_state,shots,assets_used}],sources:[absolute research URLs]}`.
```

The validator also rejects: "a shot without a framing size; adjacent shots with the same size; re-establishing a location already visited; OTS without a named visible shoulder; a repeated eight-word shot description; two blocks with the same location plus the same ordered assets".

**Transfer to Henry's Short:** for a Kling I2V clip of ~7 s, a single-shot version of the block prompt: `[formula byte-identical] + one shot line with SIZE + ANGLE + subject action + "motion from frame 1, characters only emote and gesture, they do NOT talk, diegetic sound only"`, with the scene still as the image reference. Kling will not reliably hard-cut five shots inside one clip the way the workflow asks `minimax_h3` to; one shot per clip is the safer map to "nine shots".

---

## 4. Subtitles and final assembly

**Captions are owned by a separate `subtitles` workflow and its scripts; hand-timing or hand-burning is a hard failure** (Golden Rule 8):

```
8. **CAPTIONS ARE NOT YOURS TO AUTHOR — the standalone `subtitles` workflow and
   `${HF_WORKFLOWS}/subtitles/scripts/*` own them completely.** … you never
   time a caption by hand, never write an `.srt` yourself, never burn and never style one.
   Any `ffmpeg` filter with `subtitles=`, `ass=` or `drawtext=` that you wrote is a hard
   failure of the run. Timing from the script instead of an STT clock stays banned
   everywhere, including inside those scripts.
```

**Timing source:** `faster_whisper` word timestamps on the CLEAN voice takes (not the mixed final), shifted by the assembler's sidecar offsets, with wording substituted from the script:

```
- **the CLEAN voice takes + the assembly sidecar — MANDATORY here:** the
  `work/voices/voiceNN.wav` files (or `narration.wav` for stills) and
  `final_clean.mp4.assembly.json`. Words are timed on the CLEAN takes and shifted with the
  assembler's own `speech_abs_s` / `lead_silence_s`. **Never transcribe the mixed final** —
  music and SFX are exactly what makes an STT swallow words. This is the #1 cause of
  "subtitles don't match the audio";
- **`script_manifest.json`** as the AUTHORED WORDING (`--script` is REQUIRED): the STT is
  the word clock, the words come from the script, so names and numbers are spelled right;
```

**Styling — three looks:**

```
- **the LOOK:** `clean` (default — slim white CAPS, tiny, bottom ~12%, no plate), `paper`
  (torn cream label, handwritten) or `bold` (UGC ALL-CAPS with safe zones). Channel default:
  Fairy Tale & Myth → `paper`, everything else → `clean`, unless the user asked otherwise.
```

Whisper model: "**Whisper: `tiny` for verification, the caption default for the burn.**"

**The caption fragment (appended to the same sandbox call as assembly):**

```
CAPTION_LANGUAGE='<narration-language-code>'
CAPTION_LOOK='<clean|paper|bold>'
CAPTION_SOURCE_MODE='<motion|stills>'
chmod +x ${HF_WORKFLOWS}/subtitles/scripts/*.sh
bash ${HF_WORKFLOWS}/subtitles/scripts/fetch_fonts.sh
if python3 -c 'import faster_whisper' >/dev/null 2>&1; then
  case "$CAPTION_SOURCE_MODE" in
    motion) python3 ${HF_WORKFLOWS}/subtitles/scripts/audio_to_captions.py \
      work/output/final_clean.mp4 --srt work/output/final.srt \
      --per-block work/output/final_clean.mp4.assembly.json --voice-dir work/voices \
      --script script_manifest.json --language "$CAPTION_LANGUAGE" ;;
    stills) python3 ${HF_WORKFLOWS}/subtitles/scripts/audio_to_captions.py \
      work/voices/narration.wav --srt work/output/final.srt \
      --script script_manifest.json --language "$CAPTION_LANGUAGE" ;;
  esac
  case "$CAPTION_LOOK" in
    clean) bash ${HF_WORKFLOWS}/subtitles/scripts/burn_caps_clean.sh \
      --in work/output/final_clean.mp4 --srt work/output/final.srt --out work/output/final.mp4 ;;
    paper|bold) python3 ${HF_WORKFLOWS}/subtitles/scripts/subtitle_paper_burn.py \
      --in work/output/final_clean.mp4 --srt work/output/final.srt \
      --out work/output/final.mp4 --style "$CAPTION_LOOK" ;;
  esac
else
  rm -f work/output/final.srt work/output/final.mp4
  cp work/output/final_clean.mp4 work/output/final.mp4
  ffprobe -v error work/output/final.mp4 >/dev/null
  echo 'CAPTIONS_UNAVAILABLE=faster_whisper'
fi
```

Caption gate: "complete word coverage, `similarity` ≥ 0.90 against the authored script" before the burn, two burned frames checked after; GATE 7 also requires the `.srt` on disk and the audio stream duration matching video within 0.2 s.

**Assembly** is one script call, never hand-rolled ffmpeg (Golden Rule 23: "Hand-rolling ffmpeg for assembly/mix/subs is FORBIDDEN — no manual concat, no stream-copy shortcuts, no "quick fix" re-muxes."). Entry point:

```
bash ${HF_WORKFLOWS}/faceless-video/scripts/finish_video.sh --blocks 3 --clips-file clips.txt --voices-file voices.txt --script script_manifest.json --language '<narration-language-code>' --out work/output/final_clean.mp4
```

Flags: "`--blocks N` (required, asserted before any work) · `--clips-file` / `--voices-file` (one URL per line, in block order) · `--script` … · `--language` … · `--music URL|FILE` · `--stepped 12` for Cinematic Storybook · `--out`." Stills: "`--stills --timeline scene_manifest.bound.json --frames-dir work/frames --narration <url> --requested-seconds N`".

Under the hood, `assemble_final.sh` takes a manifest of `work/blocks/blockNN.mp4 work/voices/voiceNN.wav` pairs and:

```
The script does everything and guarantees the hard parts: fixed **N×10s** length, each
voice CENTERED in its 10s block, NO atempo, NO leading freeze, ONE output file, + optional
low music bed and `loudnorm -16 LUFS`. Diegetic SFX already live in the clips.
```

Mix rules: music bed default level "`--music-vol 0.05` for Kids, `0.09` for Fairy Tale & Myth" and "the assembler additionally DUCKS the bed under speech (sidechain keyed by the voice)"; "quiet clip audio is lifted toward the 18 dB-under-voice target, capped at +10 dB"; fps = source ("Assembly fps = source fps (probe `r_frame_rate`); never hardcode 30"). Stills assembler asserts "max-hold ≤1.5s/frame" and "a DENSITY FLOOR of `ceil(narration_sec/1.5)` frames (≈40 for a minute)".

Receipts (GATE 6):

```
RECEIPTS
  file      work/output/final_clean.mp4  (video 30.04s / audio 30.03s)
  poster    work/output/final_clean_poster.jpg
  sidecar   work/output/final_clean.mp4.assembly.json
  DONE — assembly gates green.
```

Cut-count probe (Golden Rule 2), the one ffmpeg command written out for QC:

```
ffprobe -v error -select_streams v:0 -show_entries frame=pkt_pts_time \
  -of csv=p=0 -f lavfi "movie=blockNN.mp4,select=gt(scene\,0.3)" | wc -l
```

Delivery: `media_upload` → `curl -f -X PUT --upload-file` (never `--data-binary`) → `media_confirm`; hand over the confirmed URL only. Upscale (Topaz `2160p`) is optional and post-delivery, never a gate.

**available_paths (the bundle's files):**

```
SKILL.md
references/channel-styles.md
references/history-longform.md
references/kids-song.md
references/kids-styles.md
references/kids-talking-characters.md
references/picture-flow.md
references/preset-catalog.md
references/prompts.md
references/scriptwriter.md
references/style-cinematic-storybook.md
references/style-editorial-collage.md
references/style-mannequin.md
references/style-paper-diorama.md
references/topic-sourcing.md
references/vo_and_captions.md
scripts/assemble_final.sh
scripts/assemble_slides.sh
scripts/audio_to_captions.py
scripts/bind_scene_frame_results.py
scripts/build_scene_timeline.py
scripts/finish_video.sh
scripts/materialize_scene_frames.py
scripts/measure_narration_takes.py
scripts/tests/test_faceless_scripts.py
scripts/validate_motion_script.py
scripts/validate_picture_story.py
scripts/validate_picture_story_audio.py
scripts/validate_result_manifests.py
scripts/validate_song_prompt.py
scripts/verify_takes.py
```

`available_directories`: `.`, `references`, `scripts`, `scripts/tests`. `how_to_load_more`: "Call get_workflow_bundle_file with { workflow: \"faceless-video\", path } when the SKILL.md asks for a resource file." Note the caption burners (`fetch_fonts.sh`, `burn_caps_clean.sh`, `subtitle_paper_burn.py`) and `speech_metrics.sh` live in the separate `subtitles` and `narrator` bundles, not in this list; the bundled `scripts/audio_to_captions.py` here is described as the old top-level one that must NOT be called ("calling the top-level `audio_to_captions.py`" is listed as a hard failure).

**Transfer to Henry's Short (local, outside the sandbox):** same principles work with local ffmpeg: time captions from Whisper on the clean VO, substitute authored wording, burn as small white caps in the bottom safe zone, `loudnorm` to −16 LUFS, duck any bed under the voice, keep fps = source, keep an uncaptioned clean master and the `.srt` next to the final.

---

## 5. Credit / cost guidance and hard rules

**No credit figures anywhere in the file.** Cost control is expressed as attempt caps and bans:

```
5. **Budget cap:** if ONE block is still failing after ~8 total attempts, STOP and surface
   it to the user (which beat, what was tried) instead of burning credits in a loop.
   Audio follows the loaded `narrator` workflow (about three attempts per failing line,
   retry-set law); never restart the count under a new label.
```

```
- **NEVER replace the picker with a text list** of voice names, and NEVER generate
  `seed_audio` audition samples — the gallery already carries real previews, so samples
  are wasted credits and invented descriptions are noise.
```

```
**A `completed` block is FINAL.** Never pause the run to "re-taste" a finished block:
regenerate ONLY on `failed`/`nsfw` (RETRY LADDER) or on a NAMED gate/QC violation (style
drift vs the assets, static head/tail WARN from the assembler, wrong aspect) — and only
AFTER the whole phase is collected.
```

Cut-count regeneration is capped at once per block, and on flat looks "treat a low count as a SUSPICION, not a verdict — look at the block before spending a regeneration". Block-1 drift check is placed before voice work because it is "Cheaper now than after the mix." Long-form has "its time/cost warning" in `references/history-longform.md` (not read).

Free-trial "unlim": `use_unlim: true` only when the user explicitly asks; "Never add it on your own initiative to save them credits"; only the three `generate_*` tools take it ("assembly, upscales, transcription/subtitles and similar are billed as usual"). Rejections `unlim_trial_expired` / `unlim_not_eligible`: "Stop and ask before continuing on credits".

**Hard rules the file says never to break** (the 23 GOLDEN RULES, condensed; quotes where wording matters):

- Models locked: `seedream_v5_pro` 1k for images, `minimax_h3` 2K for clips, `text2speech_v2`/`elevenlabs` for takes, `sonilo_music` for a bed. "No other model, ever."
- Every clip = one 10 s block of five ~2 s hard cuts; "**no shot longer than 2.5s**: a frame that hangs 3–5s reads as a slideshow."
- Compose clips from asset images, order location → characters → props, ≤7 refs; never from the style key alone; never on a blank background.
- `aspect_ratio` explicit on every video call.
- NSFW flags are ~50% false positives: retry ladder; "NEVER drop a block, NEVER deliver a gap."
- No on-screen talking / lip-sync.
- Captions only via the `subtitles` scripts; any self-written `subtitles=`/`ass=`/`drawtext=` is a hard failure; script-timed captions banned.
- fps = source fps, never hardcode 30.
- Banned prompt tokens: `child`/`kid`/`childlike`, any brand/studio/IP name.
- Never expose model or phase names to the user; never invent a product name.
- Wait every job to terminal; do not proceed on a non-`completed` job.
- Deliver exactly one file; never part1/part2.
- Batch, never parallel single calls; ≤12 per submission, ≤12 per wait.
- Duration fixed at N×10 s; never shorten video to fit audio; one line per block, 7.8–9.5 s.
- Never `atempo`/speed/pitch-shift audio; rewrite and regenerate.
- One voice, pair locked first in `voice.lock`, never resolved by name mid-run.
- Style fidelity 1:1 with asset sheets.
- No leading freeze; motion from frame 1.
- Vary shot size and angle on every cut; ≤2 consecutive blocks per location; OTS only with a named visible character.
- Voice, captions and assembly only through the bundled scripts; hand-rolled ffmpeg forbidden.

Sandbox rules that are also hard: one phase = one self-contained call; foreground commands capped at 120 s; commands capped at 16,000 characters; uploads use `--upload-file`, never `--data-binary`; never hand-write the assembly sidecar; the delivered link is the one `media_confirm` returned.

---

## 6. 9:16, Shorts, hooks and pacing

**9:16 is supported as an aspect but nothing in the file is Shorts-specific.** The only vertical mentions:

```
(c) frame aspect —
  **16:9 (default)** / 9:16 and NOTHING ELSE (the video model supports only these
  two — never offer 1:1 or other ratios)
```

Phase 4 model check: "Require 10-second generation, `resolution:"2K"`, the chosen 16:9/9:16 ratio, and image references in the returned schema."

Thumbnail stays landscape regardless: "- **Aspect:** `16:9` always, including when the video itself is vertical."

Locations are generated at the chosen aspect (so at 9:16 for a Short); characters stay 2:3 and props 1:1. Duration options offered are 1 / 2 / 3 min (Fairy Tale 2 / 3; song 1 / 2), so a 60–75 s Short maps to N = 6–8 blocks; 75 s "rounded half-UP" gives 8 blocks (80 s) with a short final block window.

**Hook:**

```
Build an arc
(hook → build → turn → payoff): cold-open hook stated flat and SHORT — block 1 opens
on a ≤8-word punchy line, then fills to normal density (History/Explainer — no
greetings, no throat-clearing; Kids keeps its warm host manner), ONE idea per block
(the shots are angles on it), build blocks **escalating** (if they can be
reordered without loss, rewrite), a turn that surprises rather than summarizes, a
payoff whose kicker reframes the hook. Humor = deadpan setup → absurd
punch, Barnum lines, confirmation-bias gags.
```

The validator enforces it: "for Explainer/History, a cold open longer than eight words before its first full stop" is rejected. Explainer tone: "casual 2nd-person, deadpan, hook + promise"; pacing "fast, rapid cuts". Kids: "questions sit at the END of a line so the block boundary is the answer beat and the next block opens with the payoff."

Pasted-script title options (the four hook shapes): "blunt claim, question, number, and surprise". Thumbnail hook: "a 3–6 word promise in the video's language and channel register".

**Pacing:**

- Five ~2 s cuts per 10 s block, none over 2.5 s; Kids four cuts at 2.5 s (WIDE → CU character → ECU detail → MEDIUM, order varied every block).
- "**Max ~20s (≈2 blocks) per location/distance**, then move (new location / coverage angle / variety insert). Rotate locations; never park the character back at the opening wide."
- Stills mode: frame segments "every ~0.7-1.2s and at every framing change, no frame segment >1.5s"; density floor ≈40 frames per minute.
- Narration density: 20–23 words per 10 s, no filler, "one modifier per thing, one new concrete per line".
- Line-level: "Fix those by REWRITING the line with one more fact, never by adding modifiers".

**Transfer to Henry's Short:** the file gives no Shorts retention rules beyond the ≤8-word cold open and 2 s cut cadence. For nine shots over 60–75 s, the workflow's own cadence would want roughly 30–35 cuts; a nine-shot montage at ~7 s per shot is the exact "hangs 3–5s reads as a slideshow" case it warns about, unless each Kling clip carries internal camera motion and subject action from frame 1. Keep the ≤8-word cold open, one idea per shot, no two consecutive shots in the same location or framing, and the payoff reframing the hook.
