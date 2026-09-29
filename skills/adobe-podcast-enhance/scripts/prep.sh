#!/bin/zsh
# Prep a take's voice for Adobe Podcast Enhance.
# usage: prep.sh <video-or-audio> [out_dir]
# Writes <name>-voice.mp3: mono, 48 kHz, bitrate chosen so the file stays near 9 MB
# (the Claude in Chrome file_upload limit is 10 MB per call). Uses the WHOLE file so every
# timestamp in the enhanced result matches the original.
set -e
IN="$1"; OUT_DIR="${2:-$(dirname "$IN")/adobe-enhance}"
[ -f "$IN" ] || { echo "no such file: $IN"; exit 1; }
mkdir -p "$OUT_DIR"
NAME="$(basename "${IN%.*}")"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
# 8.8 MB budget (MP3 overhead lands it near 9.2 MB) -> kbps, capped 64..192
KBPS=$(python3 -c "d=float('$DUR'); k=int(8.8*8*1000/d); print(max(64,min(192,k)))")
if [ "$KBPS" -le 64 ]; then echo "warning: ${DUR}s is long; at 64 kbps the upload may exceed 10 MB. Split the file (see SKILL.md)."; fi
OUT="$OUT_DIR/${NAME}-voice.mp3"
ffmpeg -nostdin -loglevel error -y -i "$IN" -vn -ac 1 -ar 48000 -c:a libmp3lame -b:a ${KBPS}k "$OUT"
SIZE=$(stat -f%z "$OUT")
echo "wrote $OUT"
echo "duration ${DUR}s, ${KBPS} kbps, $((SIZE/1024)) KB"
