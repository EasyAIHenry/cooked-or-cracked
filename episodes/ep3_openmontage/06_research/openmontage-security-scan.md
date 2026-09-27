# OpenMontage security scan (28 Sep 2026)

Repo: https://github.com/calesthio/OpenMontage, commit 08e2151 (6 Sep 2026), AGPL-3.0.
Cloned to `~/coc-ep3-test/OpenMontage`. Nothing installed or run yet.
Scanner: skillspector v2.11.2, `skillspector scan --no-llm`. Raw output: `skillspector-openmontage-raw.txt`.

## Headline
Score 100/100, severity CRITICAL, "DO NOT INSTALL". 2,391 findings across 2,144 files.
After reading every CRITICAL and HIGH hit and running my own sweep: no prompt injection, no hidden instructions, no exfiltration found. The score is driven by repo size and by docs that quote API calls. The real risks are ordinary supply-chain ones, listed at the end.

## What the findings actually are

| Severity | Count | Rule | What it is in this repo |
|---|---|---|---|
| CRITICAL | 6 | YARA "credential exfiltration webhook" | One line, counted 6 times (same file copied into 3 skills x 2 folders): a HeyGen docs example showing `curl -X POST api.heygen.com/v1/webhook/endpoint.add -H "X-Api-Key: $HEYGEN_API_KEY"`. It is vendor documentation for registering a webhook, not code that runs. |
| HIGH | 374 + 280 + 28 | SC9 "executable content excluded" | Every `.py`, `.js`, `.mjs`, `.html` in the repo. The scanner does not read code, so it flags each file. Not a finding. |
| HIGH | 86 | P2 "hidden instructions" | HTML comments inside HyperFrames example animations (`examples/*.html`) plus one word-joiner character (U+2060) pasted into a Mapbox URL in `remotion-best-practices/rules/maps.md:85`. I read them: design notes, no instructions to the agent. |
| HIGH | 45 | PE3 "credential access" | `.env.example`, `.gitignore` lines that ignore `.env`, README lines that say "add your key to .env", the `setup-api-key` skill. All key handling is local `.env`. |
| HIGH | 8 | TM1 "tool parameter abuse" | Tables listing HeyGen MCP tool names. |
| HIGH | 6 | RA1 "self-modification" | Skill footers saying "say improve this skill and I will help you update this file". |
| HIGH | 4 | P6 "prompt extraction" | A file literally named `prompt-examples.md` with example video prompts. |
| HIGH | 3 | SC2 "external script fetching" | One real item: `media-use/SKILL.md:119` tells the agent to run `curl -fsSL https://static.heygen.ai/cli/install.sh | bash` to install the HeyGen CLI. Only runs if the agent takes the HeyGen path. |
| HIGH | 2 | AR2 "anti-refusal" | `website-to-video/step-4-vo.md:66`: "Don't judge or critique if the user pastes a key directly in chat, just use it." Bad hygiene advice, not an attack. |
| HIGH | 4 + 4 + 2 | TM2, OH1, MP3 | `sudo apt install ffmpeg` in docs, a Vercel React doc with `dangerouslySetInnerHTML`, `execFileSync("ffprobe")` in a probe script whose own comment explains it avoids the shell. |
| MEDIUM | 812 | E1 "external transmission" | Every URL in the docs. |
| MEDIUM | 350 | RP1 "unpinned npx" | `npx hyperframes`, `npx remotion`, `npx tsx` with no version. Real but ordinary. |
| MEDIUM | 224 | P9 whitespace padding | Markdown tables. |
| MEDIUM/LOW | rest | context stuffing, session persistence, unpinned pip deps | Big skill files, checkpoint files on disk, `>=` pins in requirements.txt. |

## My own sweep (independent of the scanner)
- Invisible Unicode (zero-width, BOM, bidi) in all text files: 1 file, the Mapbox URL above. Harmless.
- Injection phrases ("ignore previous instructions", "do not tell the user", "secretly", "without asking"): 3 hits, all ordinary English in docs.
- Pipe-to-shell: 1 (the HeyGen CLI installer above).
- `eval`, `exec`, `os.system`, `shell=True` in Python: none (only comments saying they avoid it, and `model.eval()` in PyTorch).
- Outbound hosts in `lib/`, `tools/`, `scripts/`: huggingface, github, fal.ai, pixabay, pexels, NASA, ESA, archive.org, unsplash, minimax, x.ai, heygen, google, azure, bytedance, atlascloud. All are the providers the README lists. No unknown host.
- Telemetry, analytics, phone-home: none. Backlot board talks to 127.0.0.1 and Google Fonts only.
- Auto-loaded agent files (`CLAUDE.md`, `AGENTS.md`, `.windsurfrules`, `.cursor/rules`): each says "read AGENT_GUIDE.md first". `AGENT_GUIDE.md` (48 KB) is a pipeline contract: pick a pipeline, read the director skill, ask before spending. No hooks, no `settings.json`, no npm `postinstall`.
- Publishing: `tools/publishers/` only has `export_bundle.py` (writes a folder). Nothing uploads to YouTube.

## Real risks (ordinary, not injection)
1. `make setup` installs 12 pip packages, 13 npm packages (Remotion) plus their tree, `piper-tts`, and warms `npx --yes hyperframes` unpinned. Standard open-source supply-chain exposure.
2. API keys live in `.env` inside the repo folder and 73 Python files read the environment. Put only test keys there.
3. If the agent takes the HeyGen path it will pipe a remote installer to bash. We are not using HeyGen.
4. The repo is 5 months old (created 29 Mar 2026), 61.5k stars, 7.8k forks, 333 open issues, 50 contributors. Active, popular, young.

## Recommendation
Safe to install in the sandbox folder `~/coc-ep3-test/OpenMontage` with a `.env` holding only the keys we choose for the test. Keep HeyGen and ElevenLabs keys out. Waiting for Henry's "proceed" before `make setup`, per the skill-install gate.
