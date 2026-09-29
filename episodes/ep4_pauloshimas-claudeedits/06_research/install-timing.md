# Install timing, Paulo's 6-tool stack (29 Sep 2026, M3 Max, 36 GB)

Henry asked for the install time. Caveat first: this Mac already had most of it, so the numbers below split into "measured here" and "what a fresh machine does".

## Already installed before this episode
| Tool | Version | Since |
|---|---|---|
| Claude Code | desktop Code tab | before the series |
| Node.js | 24.15.0 | before the series |
| FFmpeg | 9.0.2 | before the series |
| Python 3 | 3.9.6 system, 3.12.13 brew | before the series |
| whisper-cpp | 1.9.4 | Ep3 (28 Sep) |
| HyperFrames plugin | 0.7.31 | 4 Jul 2026 |
| Headless Chrome for HyperFrames | 153.0.8010.36 | cached |

## Measured today
| Step (his guide) | Time | Note |
|---|---|---|
| 05 `npx hyperframes doctor` | about 20 s | CLI 0.8.91 fetched by npx, all required checks pass |
| Whisper model, first use (small.en download + 48 s transcript) | 44 s | "The model downloads the first time you use it" is true |
| `hyperframes init` with a video (includes transcription) | 8 s | |
| First render, 6 s of 1080x1920 | 35 s | |
| security scan of the plugin (skillspector + manual sweep) | about 25 min | Henry's rule, not Paulo's; mostly the scanner's run time |
| 04 plugin update 0.7.31 to 0.8.91 | [pending Henry's OK] | `claude plugin marketplace update hyperframes` + `claude plugin update hyperframes@hyperframes` |

## Fresh machine
A timed `brew fetch --force --deps node ffmpeg python@3.13 whisper-cpp` ran in 67 s, but Homebrew served the bottles from its local cache (only 2.4 MB came down), so it is not a fresh-install number. `brew deps` lists 39 packages for those four. For the real number: run Paulo's "let Claude install the rest" prompt on a Mac without Homebrew and time it, or use his estimate ("fifteen minutes, one time", page 02) with a [not verified] tag.

Running total so far for this Mac: [fill after the plugin update].
