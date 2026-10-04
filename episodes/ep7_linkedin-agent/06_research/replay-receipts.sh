#!/bin/zsh
# Replays the Ep7 groundwork receipts on screen for the recording.
EP="/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep7_LinkedIn-Agent"
H=~/.claude/skills/li-human
step() { print; print -P "%B%F{yellow}== $1 ==%f%b"; sleep 2; }

step "1. Security scan of the LinkedIn agent repo"
skillspector scan --no-llm "$EP/03_reference/repo" 2>&1 | sed -n '10,15p'
sleep 3

step "2. Installed skills"
ls -d ~/.claude/skills/li-*
sleep 3

step "3. Count what the repo promises"
python3 - <<'EOF'
import json, os
r = os.path.expanduser("~/.claude/skills")
h = json.load(open(f"{r}/li-post/hooks.json"))["hooks"]
s = json.load(open(f"{r}/li-human/slop.json"))
b = json.load(open(f"{r}/li-profile/rubric.json"))["items"]
print(f"skills installed : {len([d for d in os.listdir(r) if d.startswith('li-')])}   (reel says 12)")
print(f"hook formulas    : {len(h)}   (reel says 20)")
print(f"slop terms       : {len(s['words']) + len(s['phrases'])}")
print(f"profile rubric   : {len(b)} items, {sum(i.get('points', 0) for i in b)} points")
EOF
sleep 4

step "4. Humanizer on a deliberately sloppy draft"
cat "$EP/06_research/humanizer-test/slop-draft.txt"
sleep 3
python3 $H/humanize.py "$EP/06_research/humanizer-test/slop-draft.txt" -o /tmp/ep7-clean.txt --report | sed -n '1,6p'
python3 $H/detect.py "$EP/06_research/humanizer-test/slop-draft.txt" /tmp/ep7-clean.txt | tail -2
sleep 4

step "5. What the humanizer misses"
cat "$EP/06_research/humanizer-test/tell-tests.txt"
sleep 4

step "6. My 105 LinkedIn posts from 2026 through the same detector"
python3 - <<'EOF'
import json
from collections import Counter
res = json.load(open("/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep7_LinkedIn-Agent/06_research/linkedin-baseline/detect-results-2026.json"))
c = Counter(x["verdict"] for x in res)
print(f"posts scored : {len(res)}")
print(f"FLAGGED      : {c['FLAGGED']}")
print(f"REVIEW       : {c['REVIEW']}")
print(f"PASS         : {c['PASS']}")
print(f"em dashes    : {sum(x['emdash'] for x in res)}")
print("weakest check:", Counter(x["weak"] for x in res if x["weak"]).most_common(1)[0])
EOF
print; print -P "%B%F{green}== done ==%f%b"
