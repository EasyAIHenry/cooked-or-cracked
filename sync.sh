#!/usr/bin/env bash
# Copies the canonical skills, the lead-scout tool and every episode's text files into this repo, then commits and pushes.
# Never copies video, raw footage, cuts, audio over 1 MB, .env files or JSON with run data.
set -euo pipefail
REPO="$(cd "$(dirname "$0")" && pwd)"
CC="$HOME/Content Creation"
SK="$HOME/.claude/skills"

sync_dir() { # src dst
  mkdir -p "$2"
  rsync -a --delete \
    --include '/assets/pipe.mp4' \
    --exclude '.DS_Store' --exclude '*.mp4' --exclude '*.MOV' --exclude '*.mov' --exclude '*.mp3' \
    --exclude '*.wav' --exclude '.env' --exclude '*.env' --exclude '04_raw-footage/' --exclude '05_cuts/' \
    --exclude 'reel.mp4' --exclude 'history.json' --exclude 'seen.json' --exclude 'profiles.json' --exclude 'runs/' \
    --exclude '*.pdf' --exclude 'screens/' --exclude '09_ai-edit-reel/' \
    --exclude '/assets/gen/' --exclude '/assets/cones/*.png' \
    "$1/" "$2/"
}

for s in cooked-or-cracked henry-scrapbook-reel creator-audit henry-guide-pdf; do
  [ -d "$SK/$s" ] && sync_dir "$SK/$s" "$REPO/skills/$s"
done
# small sound cues are useful to keep (under 1 MB)
mkdir -p "$REPO/skills/henry-scrapbook-reel/references"
for f in "$SK"/henry-scrapbook-reel/references/*.mp3 "$SK"/henry-scrapbook-reel/references/*.wav; do
  [ -f "$f" ] && [ "$(stat -f%z "$f")" -lt 1048576 ] && cp "$f" "$REPO/skills/henry-scrapbook-reel/references/"
done

sync_dir "$CC/lead-scout" "$REPO/tools/lead-scout"
[ -d "$CC/pompette-site" ] && sync_dir "$CC/pompette-site" "$REPO/sites/pompette"
[ -d "$CC/pompette-menu" ] && sync_dir "$CC/pompette-menu" "$REPO/sites/pompette-menu"

for ep in "$CC"/DRIVE_Cooked-or-Cracked_Ep*; do
  [ -d "$ep" ] || continue
  name="$(basename "$ep" | sed 's/^DRIVE_Cooked-or-Cracked_//' | tr '[:upper:]' '[:lower:]')"
  sync_dir "$ep" "$REPO/episodes/$name"
done

cd "$REPO"
if grep -rEn --exclude-dir=.git -e 'sk-[A-Za-z0-9]{20,}' -e 'AIza[0-9A-Za-z_-]{30,}' -e 'gho_[A-Za-z0-9]{20,}' -e 'apify_api_[A-Za-z0-9]{20,}' . ; then
  echo "Possible secret found. Not committing." >&2; exit 1
fi
git add -A
if git diff --cached --quiet; then echo "Nothing changed."; exit 0; fi
git commit -q -m "sync $(date '+%Y-%m-%d %H:%M')

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -q
echo "Pushed."
