#!/usr/bin/env bash
# Build the COTE folder tree for one batch.
# Usage:  bash make-folders.sh 2026-10_batch1
# Root defaults to ~/Tristeps/COTE. Override with COTE_ROOT=/other/path bash make-folders.sh <batch>
# Safe to run more than once: it creates what is missing and never overwrites a file.

set -euo pipefail

BATCH="${1:-}"
COTE_ROOT="${COTE_ROOT:-$HOME/Tristeps/COTE}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -z "$BATCH" ]; then
  echo "Usage: bash make-folders.sh <batch id>   e.g. bash make-folders.sh 2026-10_batch1"
  exit 1
fi

case "$BATCH" in
  *" "* | */*)
    echo "Batch id must have no spaces or slashes: '$BATCH'"
    exit 1
    ;;
esac

if [[ "$BATCH" =~ ^[0-9]{4}-[0-9]{2}_batch[0-9]+$ ]]; then
  :
else
  echo "Note: '$BATCH' does not follow YYYY-MM_batchN. Continuing anyway."
fi

BRAND="$COTE_ROOT/00_brand"
BATCH_DIR="$COTE_ROOT/01_batches/$BATCH"

# Client-level brand folder, once.
mkdir -p "$BRAND/logo" "$BRAND/fonts" "$BRAND/lut" "$BRAND/reference"

# Batch folders.
for d in \
  01_brief-and-cutlists \
  02_graphics \
  03_reference \
  04_selects \
  05_cuts \
  06_feedback \
  07_audio; do
  mkdir -p "$BATCH_DIR/$d"
done

# Copy a file only if the source exists and the target does not.
copy_if_missing() {
  local src="$1" dst="$2"
  if [ -f "$src" ] && [ -e "$dst" ]; then
    echo "kept     $dst (already exists)"
  elif [ -f "$src" ]; then
    cp "$src" "$dst"
    echo "created  $dst"
  fi
}

copy_if_missing "$HERE/BRAND.md" "$BRAND/BRAND.md"

# Brief: take the template from this folder, else from 00_brand.
if [ -f "$HERE/BRIEF-template.md" ]; then
  copy_if_missing "$HERE/BRIEF-template.md" "$BATCH_DIR/01_brief-and-cutlists/BRIEF.md"
elif [ -f "$BRAND/BRIEF-template.md" ]; then
  copy_if_missing "$BRAND/BRIEF-template.md" "$BATCH_DIR/01_brief-and-cutlists/BRIEF.md"
else
  echo "No BRIEF-template.md found next to this script or in 00_brand; BRIEF.md not created."
fi

# Feedback log with a header row.
LOG="$BATCH_DIR/06_feedback/log.md"
if [ -e "$LOG" ]; then
  echo "kept     $LOG (already exists)"
else
  {
    echo "# $BATCH feedback log"
    echo
    echo "Newest last. Date | file | Frame.io folder | what changed | music option"
    echo
  } > "$LOG"
  echo "created  $LOG"
fi

echo
echo "Tree under $COTE_ROOT:"
cd "$COTE_ROOT"
find 00_brand -maxdepth 1 | sort | sed -e 's|[^/]*/|  |g'
echo "01_batches"
find "01_batches/$BATCH" -maxdepth 2 | sort | sed -e 's|[^/]*/|  |g'
echo
echo "Next: put this batch's chosen clips in $BATCH_DIR/04_selects/, then run: bash bake-lut.sh $BATCH"
