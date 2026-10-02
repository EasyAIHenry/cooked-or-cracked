# scroll-craft security scan (2 Oct 2026)

Repo: github.com/nateherkai/scroll-craft, commit 75d81f7 (30 Sep 2026), plugin nateherk-design v0.3.1.
Installed on this Mac: v0.2.0 since 23 Aug 2026 (skill name `scrollcraft`; v0.3 renamed it `scroll-craft`).

`skillspector scan --no-llm`: 100/100, CRITICAL, "DO NOT INSTALL". 13 HIGH, 3 MEDIUM. Static patterns only.

| Flag | Where | What it actually is |
|---|---|---|
| Credential access x5, env x1 | scripts/kie.mjs, scripts/doctor.mjs | Reads KIE_AI_API_KEY from the shell or a project .env and sends it only to api.kie.ai as a Bearer token. doctor.mjs only checks the key exists. |
| External transmission x2 | scripts/kie.mjs | kie.ai job endpoints, plus kie's upload host kieai.redpandaai.co for reference images. No other hosts in the scripts (rest is localhost). |
| Network | engine/scrollcraft.js:660 | The page fetches its own video clips as blobs for smooth scrubbing. Runs in the visitor's browser. |
| Hidden instructions x4 | references/template.html, device-diag.html | HTML comments explaining the template. No agent instructions. |
| Anti-refusal x2 | approved-collection.md:88, assets.md:111 | (1) a note on keying magenta plates. (2) "do not refuse a justified reroll on a cap": the skill may reroll paid generations inside its own budget cap. Keep Henry's ask-before-spend rule. |
| Autonomous decision | worldflight.md:283 | Scroll-speed tuning advice. |

Processes it runs: ffmpeg (contact sheet), Chrome (screenshots), `node kie.mjs probe` (credit check). No downloads, no shell strings.

Verdict: no real threat found. The only live risk is spend through kie.ai, which needs a key we have not set.
