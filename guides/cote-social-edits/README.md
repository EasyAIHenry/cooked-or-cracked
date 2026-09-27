# COTE social edits in ChatCut: onboarding guide

**Prepared for:** Dennis Teh, Head of Production & AI Systems
**Date:** 28 September 2026
**Method:** Written from Henry's own ChatCut Desktop and Claude Code workflow, the ChatCut documentation at chatcut.io/docs, and the internal COTE handover. Anything marked "verify" has not been tested on the COTE account yet.

## TL;DR: the call

- Edit the monthly COTE social videos in ChatCut Desktop on your Mac, driven by Claude Code Desktop on the same Mac. Use Codex Desktop only if you have a ChatGPT seat and no Claude seat.
- The claude.ai and chatgpt.com websites cannot drive ChatCut. The agent has to be the desktop app on the machine that has the footage.
- The brand lives in three places: `BRAND.md` (rules in writing), a ChatCut Design Style called "COTE Singapore" (colours, font, logo, references), and a ChatCut Skill you save after the first video.
- Bake the conversion LUT onto the selects before import with `bake-lut.sh`, then do no grading inside ChatCut.
- Work in passes, one job per prompt. The agent shows a written cut list or preview frames and waits for "apply" before it touches the timeline.
- Finish video one end to end before you start the rest of the batch.

## Files in this folder

| File | What it is | Where it goes |
|---|---|---|
| `README.md` | This guide | Read it here |
| `BRAND.md` | COTE rules the agent follows | Copy to `~/Tristeps/COTE/00_brand/` |
| `BRIEF-template.md` | Per-batch brief | `make-folders.sh` copies it into each batch |
| `prompts.md` | Copy-paste prompts for every pass | Keep open while you edit |
| `make-folders.sh` | Builds the folder tree for a batch | Run from this folder |
| `bake-lut.sh` | Applies the COTE LUT to the selects | Run from this folder |
| `skill/cote-social-edit/` | Claude Code skill with the passes and rules | Copy to `~/.claude/skills/` (section 11) |

## 1. What you are building

Six terms, used the same way throughout:

- **Agent:** the AI desktop app (Claude Code or Codex) that reads your prompt and operates ChatCut for you.
- **Timeline:** the edit itself, the tracks of clips, text and audio inside a ChatCut project.
- **Bin:** a folder inside ChatCut's My Assets panel.
- **Design Style:** a saved ChatCut preset of colours, fonts, logos, reference images and a written style guide. It steers any graphics the AI generates.
- **Skill:** saved workflow instructions the agent reads before it starts. ChatCut stores Skills in your ChatCut account; Claude Code stores them as folders in `~/.claude/skills/`. You will use one of each.
- **Pass:** one round of work with one job, such as "assemble the cut" or "add the end card".

The workflow in five lines:

1. The brief says what each video must show.
2. The agent samples every clip in the batch and writes a clip log.
3. For each video it proposes a cut list that ties every clip to a line of the brief. You approve it.
4. It builds the video in passes: assembly, brand layer, music, QC, export.
5. You upload V1 to Frame.io and feed the client's notes back as a prompt.

## 2. Day one: install

Install ChatCut Desktop first, then one agent.

### 2.1 ChatCut Desktop

1. Download ChatCut Desktop from chatcut.io (macOS, Apple Silicon or Intel) and sign in with the account Henry sets up for you (verify which account).
2. Desktop is the surface ChatCut recommends for most editing. Local footage stays on your Mac: the app remembers where each file lives and reads it from there, so do not move or rename anything in `04_selects/graded/` after import.
3. Local export is free and does not use the cloud export quota. Formats: H.264 MP4 or VP8 WebM, 480p to 4K. Audio, graphics and some bundle operations can still render in the cloud when started from Desktop.

### 2.2 Pick one agent

ChatCut connects to an agent in two ways. The Agent Plugin is a hosted connection that opens a ChatCut project in the agent's Browser pane. Agent Selection in ChatCut Desktop is a local connection between the two apps on the same computer. Use the local connection: it is Henry's setup, and footage and exports stay on your Mac.

**Route A, Claude Code Desktop (recommended).** Henry's skills are Claude Code skills and his repo installs straight into it.

1. Install Claude Code Desktop and sign in with your Claude seat.
2. In Terminal, run `claude --version`. You need 2.1.210 or newer.
3. Open your ChatCut project in ChatCut Desktop. If ChatCut asks which agent to work with, choose Claude Code under Agent Selection (verify where this setting sits in the current Desktop build). Open Claude Code, start a New session and type: "Use ChatCut to tell me the name of the open project."
4. If the agent cannot find ChatCut, install the plugin. Quickest: in ChatCut, open the avatar menu, copy the Claude Code prompt and paste it into a new session. It reads: `/goal Read chatcut.io/claude to install and use the ChatCut plugin`.
5. Manual install, in Terminal:
   ```
   claude plugin marketplace add https://github.com/ChatCut-Inc/agent-plugin.git#main
   claude plugin install chatcut@chatcut-inc
   sh "${CLAUDE_PLUGIN_ROOT}/skills/chatcut-plugin-basics-claude/login-chatcut.sh"
   ```
   The first command clones a large repo and takes a few minutes. The login script writes the sign-in link to `/tmp/chatcut-login.log`; open that link in your browser. Check with `claude plugin list` and `claude mcp get plugin:chatcut:chatcut`.
6. Start a New session after installing. Plugin tools load only when a session starts. Begin every request with "Use ChatCut to ...".

**Route B, Codex Desktop.** Use this if you only have ChatGPT. It works on a ChatGPT subscription with no API key.

1. Install the Codex Desktop app and sign in. Check that `git --version` works in Terminal.
2. Quickest: in ChatCut's avatar menu, copy the Codex prompt and paste it into Codex: `/goal Read chatcut.io/chatgpt to install the ChatCut plugin and set up a new task for me.`
3. Manual install uses the Codex CLI bundled inside the Codex Desktop app, not one installed from npm. Replace `<BUNDLED_CODEX>` with its path (the avatar-menu prompt finds it for you):
   ```
   "<BUNDLED_CODEX>" plugin marketplace add https://github.com/ChatCut-Inc/agent-plugin.git --ref main
   "<BUNDLED_CODEX>" plugin marketplace list
   "<BUNDLED_CODEX>" plugin add chatcut@<MARKETPLACE>
   "<BUNDLED_CODEX>" mcp login chatcut
   ```
   `<MARKETPLACE>` is the name the list command prints. The login command opens a sign-in page in your browser.

**Connected means:** ChatCut Desktop shows an agent icon in its top bar, and the agent answers "Use ChatCut to tell me the name of the open project" with the right name. Never paste an install prompt into a chat website, a remote browser workspace or the ChatCut web editor.

## 3. Build the folder once

```
~/Tristeps/COTE/
  00_brand/                    BRAND.md, logo/, fonts/, lut/, reference/
  01_batches/
    2026-10_batch1/
      01_brief-and-cutlists/   BRIEF.md, clip-log.md, cutlist-01-v1.md
      02_graphics/             After Effects renders, stills
      03_reference/            references for this batch only
      04_selects/              clips chosen for this batch
        graded/                LUT-baked copies (bake-lut.sh), the ones you import
      05_cuts/                 CSG_2026_10_REEL_HanwooGrill_v01.mp4
      06_feedback/             log.md, client notes per round
      07_audio/                music options
```

1. Run `bash make-folders.sh 2026-10_batch1` from this folder. It creates the tree, creates `00_brand/` if missing, copies `BRAND.md` and `BRIEF-template.md` in if they are not there yet, and prints the result. Running it twice changes nothing.
2. `00_brand/` exists once per client: `BRAND.md`, the logo files, the font files, the LUT `.cube`, and 3 to 5 approved past videos in `reference/`.
3. `04_selects/` holds only the clips chosen for this batch. Full camera cards stay on Drive.
4. Cut lists are named `cutlist-<video>-v<round>.md`, so `cutlist-01-v1.md` is video 1, first proposal.
5. Names have no spaces and describe content: `client_subject_variant`, such as `cote_hanwoo_searclose_02.mp4`.

Path skills you will use every day:

- Drag a file or folder into the agent's chat box to paste its full path.
- In Finder, hold Option and right-click a file for "Copy ... as Pathname".
- In Finder, View → Show Path Bar shows where you are.

## 4. Teach the AI the brand

The brand reaches the agent through three layers.

**Layer 1, `BRAND.md`.** Plain rules the agent reads at the start of every pass: logo, subtitle font, colour, footage priorities, motion, music, the do-not list and delivery specs. Copy it to `00_brand/` and edit it there when the client changes a rule.

**Layer 2, the ChatCut Design Style.**

1. In the AI composer, click the palette icon labelled Design Style, then Create Design Style (or Browse all styles, then create).
2. Name it "COTE Singapore". Add the brand red and black (sample the hex values from the logo files, verify with the client), SangBleu Sans, the COTE SINGAPORE logo (red on black), 3 to 5 stills from approved past videos, and paste the Typography, Motion and Do-not sections of `BRAND.md` into the style guide field.
3. Apply it from the compact menu or the style card. It saves to the current project and guides AI-generated motion graphics from then on. It does not restyle graphics already on the timeline, so apply it before pass 4.
4. The style carries the look; your prompt carries the job for this video. Set the style to None to switch it off.

**Layer 3, the saved COTE Skill.** After video one is approved internally:

1. Open the Skills menu and choose "Save this editing process as a Skill", then send the request it generates.
2. Answer the agent's questions about missing steps, constraints and preferences. Review the draft and confirm. Name it "COTE social edit".
3. From video two onwards, attach it with the book icon in the composer, then write the prompt for that video. Skills work across Web, Desktop and the Agent Plugin. Rename or delete from the three-dot menu.

The Claude Code skill in `skill/cote-social-edit/` does the same job on the agent side: it holds the passes, rules and QC list and keeps a learning log.

**Font.** SangBleu Sans is licensed. Install it on your Mac from the client's font files (double-click, Install in Font Book), then test it in one caption in ChatCut. The ChatCut docs do not cover licensed custom fonts. If ChatCut cannot see it, agree a fallback font with the client in writing before any subtitles go out (verify).

**Captions.** Pick a preset (Plain is the closest start), set SangBleu Sans and one size, then "Save current style..." as "COTE subtitles". Use the Content panel's search-and-replace to fix brand names across all captions (COTE, Hanwoo).

**LUT.** All COTE footage is Sony FX3 S-Log3, converted with the FX3 PL ARRI Neutral _65x LUT. ChatCut's docs do not cover importing a custom `.cube`, so bake it onto the selects before import:

1. Put the `.cube` in `00_brand/lut/` (confirm the exact file name; the script expects `FX3_PL_ARRI_Neutral_65x.cube`, or set `LUT=/path/to/file.cube`).
2. Install ffmpeg once: `brew install ffmpeg`.
3. Run `bash bake-lut.sh 2026-10_batch1`. It writes graded copies to `04_selects/graded/`, skips files already done, and adds `-pix_fmt yuv420p` so the files play everywhere. The core command is `ffmpeg -i IN.MP4 -vf "lut3d=FX3_PL_ARRI_Neutral_65x.cube" -c:v libx264 -crf 16 -preset medium -c:a copy OUT.mp4`.
4. Import only `graded/`. Do not grade in ChatCut.
5. If the `.cube` is unavailable, ChatCut Desktop has a built-in "Sony S-Log3 s709" LUT. Tell Henry before you use it, because the client approved the ARRI Neutral look.

**After Effects effects.** Earlier COTE videos used a fire text effect and a box animation built in After Effects (project `COTE_socials_effect` in each project's After Effects folder). If a brief asks for one, render it from After Effects into `02_graphics/` and place it as a clip. Do not ask the agent to rebuild it. Check with Henry which render format keeps transparency in ChatCut (verify).

## 5. Let the AI see the footage

The agent does not watch video in real time. It reads the transcript for speech and samples frames from each clip, a contact sheet of stills at chosen times, then describes what is in them. Food and cooking footage usually has no dialogue, so the frames do the work. Two consequences:

1. Ask it to sample often: at least every 2 seconds and at every shot change. Short food moments fall between sparse samples.
2. Get everything in writing before any edit. Brief, then clip log, then cut list, then approval, then apply.

**The clip log** (pass 1) is a table in `clip-log.md` with one row per usable moment: file, in, out, what is in frame, food close-up yes or no, pillar, brand fit 1 to 5, notes. Read it against the footage for the first batch. Where the agent is wrong about a clip, correct the row before pass 2, because the cut list is built from the log.

**Pointing at a clip.** Selection Mode (the pointer button under the prompt, or Option-S) turns whatever you click next (a timeline item, an asset, a region of the viewer, a ruler position, a transcript passage) into a reference chip in the prompt. The chip says which thing; you still write what to do with it: "Replace this with a tighter sear close-up from the clip log, same duration."

**Reference videos.** Put 3 to 5 approved COTE videos in `00_brand/reference/`. In pass 2, ask the agent to sample them and state their average shot length and opening shot type, then match that in the cut list.

**Attachments.** A file attached with Upload (+) in the AI panel is context for that one message only. Anything the agent needs every time belongs in `BRAND.md`, the Design Style or the Skill.

## 6. The passes

Each pass is one prompt in `prompts.md`. Save a Version in ChatCut before every pass so you can go back. Keep the composer in Agent mode for timeline edits.

| Pass | `prompts.md` section | Check before you say "apply" or move on |
|---|---|---|
| 0 Setup | Pass 0 | Project is 1080x1920 at 30 fps; Bins `graded`, `07_audio`, `logo` exist and finished processing; COTE Singapore style applied; COTE Skill attached (from video two) |
| 1 Clip log | Pass 1 | Every clip has at least one row; ratings match what you see; unflattering process shots rated 1 or 2 |
| 2 Cut list | Pass 2 | Opens on a food close-up; each clip names its brief line; must-show shots present; length within brief; no clip from the avoid list |
| 3 Assembly | Pass 3 | Timeline matches the approved list; cuts are straight or subtle; no music, text, colour or speed changes crept in |
| 4 Brand layer | Pass 4 | New logo, correct colour, on the end card; subtitle font and size consistent; nothing in the safe zones |
| 5 Music | Pass 5 | Three options on separate tracks; picture unchanged; three 15 s samples exported |
| 6 QC | Pass 6 | Every checklist item passes; you listened once at full volume |
| 7 Export | Pass 7 | File name per convention; exported file checked for duration, resolution, frame rate and audio |
| 8 File | Pass 8 | Uploaded to Frame.io V1; `06_feedback/log.md` updated |

The rules behind every prompt:

1. Cut first, everything else second.
2. One job per prompt. Never add music, graphics or colour in the same prompt as a cut.
3. Say where things go and what must not change.
4. Ask for the cut list or a preview frame before anything is applied.
5. Keep everything editable. AI edits are ordinary timeline items you can drag, trim or Undo.
6. Fix brand names in the transcript before any cut that relies on speech.
7. Judge the exported file, not the preview.

## 7. Feedback rounds and filing

1. **Naming:** `CSG_YYYY_MM_REEL_Title_v01.mp4` (CSG is COTE Singapore). Title is a short description with no spaces, such as `HanwooGrill`. Each round adds one: `_v02`, `_v03`. The approved master becomes `CSG_2026_10_REEL_HanwooGrill_FINAL.mp4`.
2. **Frame.io:** upload to the V1, V2 or V3 folder that matches the round. Approved files move to `Final_Approved`.
3. **A feedback round:** copy the client's Frame.io comments with their timecodes into the feedback prompt in `prompts.md`. The agent returns a numbered change list. Approve or edit it, say "apply", QC the changed sections, export the next version.
4. **Drive filing for approved finals, both locations:**
   - `02_Shared to Client/03_Final_Approved_Assets/[##]_[Month][Year]/01_Reels/`
   - `01_Internal/08_Backup_Final_Masters/[Month]/`
   Match the format of the folders already on Drive (verify an existing example before creating a new month).
5. Log every upload and every round in `06_feedback/log.md`: date, file name, Frame.io folder, what changed.

## 8. QC checklist

Run it on the exported file before every upload.

- [ ] New logo (COTE SINGAPORE, red on black) used, correct colour
- [ ] Subtitles in SangBleu Sans (or the agreed fallback), one size throughout
- [ ] No spelling errors; brand names correct (COTE, Hanwoo)
- [ ] Colour matches the LUT look: natural, rich, appetising; not warm or orange; not over-saturated
- [ ] Food close-ups carry the video
- [ ] Transitions subtle
- [ ] No effect the brief did not ask for
- [ ] Audio levelled; no silent clips; music option noted in the log
- [ ] Length within the brief
- [ ] Safe zones: nothing important in the top ~220 px or bottom ~450 px of the 1920 frame, and nothing under the right-hand action rail
- [ ] File name per convention

## 9. Weekly rhythm

| Day | Work |
|---|---|
| Monday | Brief locked with the client |
| Tuesday | Clip log and cut lists |
| Wednesday | Assemblies |
| Thursday | Brand layer and music options |
| Friday | QC and Frame.io V1 |

In a new month, take video one through all nine passes before starting the others. What you correct on video one goes into the Skill, and the remaining videos inherit it.

## 10. When it goes wrong

| Symptom | What to do |
|---|---|
| The agent goes off brief | Send the "stop and show me" prompt. Do not pile corrections on top of a wrong edit. |
| A clip plays silent after an AI edit | Check its volume. Items can come in at -60 dB. Set it back to 0 dB. |
| Subtitle or graphic text changed after moving or resizing | Moving or resizing a motion graphic can reset its text properties. Re-check the text and font. |
| Graphics export transparent or missing | Export once more with only the graphics tracks visible and composite, or ask Henry. |
| Cuts land early or clip words in the export | Camera files can have gaps in their audio timestamps. Listen to the export. Ask Henry for the scan command in `skills/henry-scrapbook-reel/SKILL.md`. |
| A word is clipped at a cut | Transcript word timings drift. Never cut through a word; move the cut into the pause. |
| The agent says it cannot see ChatCut | Check the agent icon in ChatCut's top bar, then start a New session. |

## 11. How Henry's repo is organised

Install the COTE skill from this repo: `cp -r guides/cote-social-edits/skill/cote-social-edit ~/.claude/skills/`

The repo is https://github.com/EasyAIHenry/cooked-or-cracked. It is private.

1. Send Henry your GitHub username. He adds you in the repo's Settings → Collaborators → Add people, or from Terminal: `gh api -X PUT repos/EasyAIHenry/cooked-or-cracked/collaborators/<github-username> -f permission=push`.
2. Accept the email invite, then clone: `git clone https://github.com/EasyAIHenry/cooked-or-cracked.git`.
3. Henry scans every skill before installing it with `skillspector scan --no-llm <path>`. Do the same on your Mac.
4. To install all of Henry's skills: `cp -r cooked-or-cracked/skills/* ~/.claude/skills/`. For COTE you need only the one above.

What is in it (Henry's local copy is `~/Content Creation/cooked-or-cracked-github/`):

| Path | What |
|---|---|
| `sop/` | One file per step of Henry's reel series, in order, `00-overview` to `08-retro` |
| `skills/<name>/SKILL.md` | One skill per folder, with `references/` and `scripts/` |
| `tools/lead-scout/` | Daily Instagram scout |
| `episodes/<ep>/` | Text of each episode, in the numbered folders `01_scripts` to `08_guide` |
| `sites/` | Web pages for the series |
| `guides/` | Onboarding guides like this one |

How it fits together:

1. The repo holds text only: SOPs, skills, scripts, briefs, cut lists, logs. Drive holds media. The two are linked by identical folder names, so `01_brief-and-cutlists/` on your Mac matches the same folder on Drive.
2. Video, raw footage, cuts, audio over 1 MB, `.env` files and keys never enter the repo. Henry's `sync.sh` copies text files in from the working folders, refuses to commit if it finds a key, commits with a dated message and pushes.
3. Every `SKILL.md` follows one pattern: frontmatter with `name` and `description` (the description holds the phrases that trigger it), then When to use, Inputs, Workflow, Rules, Checks, and a Learning log.
4. After every job, add a dated line to the skill's learning log, newest first: what went wrong, what rule changed. `skills/henry-scrapbook-reel/SKILL.md` shows how this builds up over a few weeks.

## 12. First-week plan

| Day | Do | Done when |
|---|---|---|
| 1 | Install ChatCut Desktop and one agent (section 2). Get repo access and clone it. Install the COTE skill. Run `make-folders.sh` for a practice batch. | The agent names the open ChatCut project |
| 2 | Fill `00_brand/`: logo, font files, `.cube`, 3 to 5 reference videos. Install SangBleu Sans and test it in one caption. Create the COTE Singapore Design Style. Run `bake-lut.sh` on three clips and compare with an approved past video. | Font shows in ChatCut or the fallback question is with Henry; graded clips match the approved look |
| 3 | Practice video from past footage: write a brief, then passes 0 to 3. Send the cut list to Henry before you apply it. | Assembly matches the approved cut list |
| 4 | Passes 4 to 7 on the practice video. Save the ChatCut Skill. Add your first learning-log line to the Claude Code skill. | Export passes the QC checklist |
| 5 | Review the practice video with Henry. Send him the "to confirm with the client" list from `BRAND.md`. Draft the brief for the next batch from the template. | Henry signs off; next brief drafted for the client's Monday lock |
