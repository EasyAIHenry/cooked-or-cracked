# SOP 02: audit the reel
- Run the `creator-audit` skill on the reel URL. It pulls metadata and the video with Apify, has Gemini watch it, and computes the baseline against the creator's last 12 posts.
- Save the report in `06_research/`, the reel and metadata in `03_reference/`.
- Extract: the exact claim (creator's words), every tool and number, the CTA keyword, the multiple over their median, gated vs ungated comment rates.
- The audit scores the creator as a creator. The episode scores the claim. Keep them separate.
