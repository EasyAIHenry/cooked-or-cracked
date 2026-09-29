# HyperFrames plugin 0.8.91, security scan (29 Sep 2026)

Source: `github.com/heygen-com/hyperframes` at c5a6972 (29 Sep 2026 07:27 UTC), the `skills/` folder the Claude plugin installs (21 skills). Installed now: 0.7.31 from 4 Jul 2026 (commit af5f3e5). 429 files differ.

## skillspector (`--no-llm --recursive`)
| Skill | Score |
|---|---|
| embedded-captions, faceless-explainer, hyperframes-animation, hyperframes-cli, hyperframes-creative, media-use, music-to-video, pr-to-video | 100 CRITICAL |
| motion-graphics 96, hyperframes-core 87, hyperframes 84 | CRITICAL |
| hyperframes-audio 68, two more at 55 and 63 | HIGH |
| figma 38, general-video 32, hyperframes-keyframes 24, hyperframes-registry 44, hyperframes-studio 26 | MEDIUM |

1,447 findings. Not one is rated CRITICAL on its own; the CRITICAL scores are the roll-up of hundreds of MEDIUM hits.

## The HIGH findings, read by hand
| Rule | Count | What it actually is |
|---|---|---|
| Prompt Injection | 115 | HTML comments at the top of caption and frame templates ("TEMPLATE: cinematic-cream, DNA-only template..."). Authoring notes for the agent. |
| analysis-evasion | 53 | SKILL.md links to files the scanner didn't open (themes/README.md). Coverage note, not behaviour. |
| Privilege Escalation | 8 | Docs that say `export HEYGEN_API_KEY=...` or "AWS credentials configured", a Figma token preflight, and test files. Nothing reads a key file. |
| Anti-Refusal | 6 | Test names ("reports ... no warning") and tables in docs. |
| Tool Misuse | 3 | Shell comments about running two renders in parallel; `hyperframes cloud list` docs. |
| System Prompt Leakage | 1 | A CSS rule builder in make-composition.cjs. |

MEDIUM worth knowing: Data Exfiltration (7) are doc examples for OpenAI, Groq and ElevenLabs APIs, the HeyGen API base URL, and an S3 command for HeyGen's own LUT bucket. None run unless you give a key and ask for that feature.

## Independent sweep (same checks as Ep3)
- Invisible unicode: none.
- Injection phrases ("ignore previous instructions", "don't tell the user", exfiltrate): none.
- curl or wget piped to a shell: none. The HeyGen installer pipe found in the Ep3 scan is gone.
- `shell=True` / `eval(`: none (one `model.eval()`, which is PyTorch).
- Outbound hosts: jsdelivr, cdnjs, unpkg, Google Fonts, GitHub, gsap.com, HeyGen API, Gemini API, one PostHog anonymous telemetry call in media-use. Turn it off with `npx hyperframes telemetry disable` or `HYPERFRAMES_NO_TELEMETRY=1`.

## Verdict
Same shape as Ep3's OpenMontage scan: a large docs-heavy agent repo scores CRITICAL on patterns, the manual read finds nothing that acts on its own. Safe to update, on Henry's OK (CLAUDE.md rule: CRITICAL score means Henry decides).
