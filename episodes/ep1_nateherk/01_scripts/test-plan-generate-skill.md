# Test plan: Blotato /generate skill (the one Nate demoed)
Repo: https://github.com/Blotato-Inc/blotato-skills  → blotato/skills/generate
Clone sits in scratchpad, NOT installed. Skillspector: 92/100 CRITICAL (see notes). Waiting on Henry's go.

## Pre-reqs (Henry)
1. kie.ai account → API key (kie.ai/api-key). Top up $5 = 1,000 credits. Credits don't expire.
2. Say "proceed" after reading the scan notes.

## Install (Claude, after go)
cp -r <clone>/blotato/skills/generate ~/.claude/skills/generate
cp ~/.claude/skills/generate/.env.example ~/.claude/skills/generate/.env   # Henry pastes key himself
GENERATIONS_DIR="/Users/henrychua/Content Creation/generations"

## 3 test runs (screen recorded, ~$0.90 total)
Run 1 (still only, ~$0.05): "/generate a still: matte black skincare serum bottle on wet slate, morning light, no text. Don't animate."
Run 2 (text model routing, ~$0.05): "/generate a still with a poster that reads 'COOKED OR CRACKED', bold red stamp style." → should route to gpt-image-2.
Run 3 (budget gate + video, ~$0.75): "/generate animate run 1's still, 10s, spend cap $1." → must quote cost and wait for 'go' before spending.
Check after: generations/ folder has png + json sidecar with prompt, ledger.json totals match balance.sh.

## What to capture on screen
- The one-line prompt going in.
- The cost quote line ("This clip is 140 credits, about $0.70... Go?").
- The generations folder opening with the file + its prompt json.
