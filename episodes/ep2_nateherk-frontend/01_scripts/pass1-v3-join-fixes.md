# Pass 1 v3: join fixes (audio audit, 26 Sep 2026)

The transcript's word times were off by up to 0.3 s in places, so several cuts landed inside words. Each join was checked on the waveform (loudness and voicing every 10 ms), then short padded clips and the full rendered cut were checked by an unprimed Gemini listen.

| Line | Problem in the raw script cut | Fix |
|---|---|---|
| "Well, let's test it out." | Kept pause ended on a small voiced sound | End moved to 14.34 s |
| "I've actually found a shop ... Pompette." | "so" before "I've"; "shop" was labelled "uh", so it got cut | Start 122.868 s (after "so"); one continuous clip to 129.50 s |
| "Not bad." | Start test picked up "-ty" of "pretty" | Start back at 98.51 s, 1-frame audio fade in |
| "It did the wireframing nicely." | Stutter "It," before it | Cut, plus a muted 6-frame breath |
| "...this website for me." | Ended inside the next "So" | End 134.688 s, fade out, muted 7-frame breath |
| "I actually wanted it," | Start was 70 ms late; end included "uh" | 134.928 s to 136.061 s, muted 8-frame breath |
| "...swirls perfectly." | Ended on the "S" of the next "So" | End 140.952 s, fade out, muted 8-frame breath |
| "What Higgsfield does is..." | Started inside "So" | Start 144.30 s, 1-frame fade in |
| take 1 "...seven different flavors." | Ended on the start of "I know" | End 338.20 s |
| "...$1,000 for the website" | Final "t" clipped | End 242.945 s |
| "And afterwards..." | No breath after "$1,000 for the website" | Start pulled into the pause, 247.52 s |
| "that's another 20%..." | Started inside "So" | Start 289.695 s, 1-frame fade in |
| "I just wish..." | Onset of "I" clipped | Start 197.075 s |

Scripts: `~/.claude/skills/cooked-or-cracked/scripts/join_audit.py` (the audit), plus the Gemini listen prompt in the learning log.
