#!/usr/bin/env bash
# Bake the COTE conversion LUT (FX3 S-Log3 to FX3 PL ARRI Neutral _65x) onto a batch's selects.
# Usage:  bash bake-lut.sh 2026-10_batch1
# Reads   ~/Tristeps/COTE/01_batches/<batch>/04_selects/*.MP4 *.mp4 *.MOV *.mov
# Writes  ~/Tristeps/COTE/01_batches/<batch>/04_selects/graded/<name>.mp4
# Overrides: COTE_ROOT=/other/root   LUT=/path/to/file.cube
# Safe to re-run: files already in graded/ are skipped. Import graded/ into ChatCut, never the originals.

set -euo pipefail

BATCH="${1:-}"
COTE_ROOT="${COTE_ROOT:-$HOME/Tristeps/COTE}"
LUT="${LUT:-$COTE_ROOT/00_brand/lut/FX3_PL_ARRI_Neutral_65x.cube}"

if [ -z "$BATCH" ]; then
  echo "Usage: bash bake-lut.sh <batch id>   e.g. bash bake-lut.sh 2026-10_batch1"
  exit 1
fi

if command -v ffmpeg >/dev/null 2>&1; then
  :
else
  echo "ffmpeg is not installed. Install it with:  brew install ffmpeg"
  echo "No Homebrew yet? Install it first from https://brew.sh, then run the line above."
  exit 1
fi

if [ -f "$LUT" ]; then
  :
else
  echo "LUT not found: $LUT"
  echo "Put the .cube in ~/Tristeps/COTE/00_brand/lut/ or run with LUT=/path/to/file.cube"
  echo "Fallback only with Henry's agreement: ChatCut's built-in Sony S-Log3 s709 LUT."
  exit 1
fi

SEL="$COTE_ROOT/01_batches/$BATCH/04_selects"
OUT="$SEL/graded"

if [ -d "$SEL" ]; then
  :
else
  echo "No selects folder: $SEL"
  echo "Run: bash make-folders.sh $BATCH"
  exit 1
fi

mkdir -p "$OUT"
shopt -s nullglob
files=("$SEL"/*.MP4 "$SEL"/*.mp4 "$SEL"/*.MOV "$SEL"/*.mov)

if [ "${#files[@]}" -eq 0 ]; then
  echo "No .MP4, .mp4, .MOV or .mov files in $SEL"
  exit 0
fi

done_n=0; skip_n=0; fail_n=0

for f in "${files[@]}"; do
  base="$(basename "$f")"
  stem="${base%.*}"
  dst="$OUT/$stem.mp4"
  tmp="$OUT/.$stem.part.mp4"

  if [ -s "$dst" ]; then
    echo "skip     $base (already graded)"
    skip_n=$((skip_n + 1))
    continue
  fi

  echo "grading  $base"
  # Main command. -pix_fmt yuv420p turns 10-bit 4:2:2 camera files into 8-bit 4:2:0 that every player and editor reads.
  if ffmpeg -hide_banner -loglevel error -y -i "$f" \
      -vf "lut3d=file='$LUT'" \
      -c:v libx264 -crf 16 -preset medium -pix_fmt yuv420p \
      -c:a copy "$tmp"; then
    mv "$tmp" "$dst"
    done_n=$((done_n + 1))
  # Camera PCM audio cannot always be copied into MP4. Retry with high-bitrate AAC.
  elif ffmpeg -hide_banner -loglevel error -y -i "$f" \
      -vf "lut3d=file='$LUT'" \
      -c:v libx264 -crf 16 -preset medium -pix_fmt yuv420p \
      -c:a aac -b:a 320k "$tmp"; then
    echo "         (audio re-encoded to AAC)"
    mv "$tmp" "$dst"
    done_n=$((done_n + 1))
  else
    echo "FAILED   $base"
    rm -f "$tmp"
    fail_n=$((fail_n + 1))
  fi
done

echo
echo "Graded: $done_n   Skipped: $skip_n   Failed: $fail_n"
echo "Output: $OUT"
echo "Next: compare one graded clip with an approved past video, then import $OUT into ChatCut."
