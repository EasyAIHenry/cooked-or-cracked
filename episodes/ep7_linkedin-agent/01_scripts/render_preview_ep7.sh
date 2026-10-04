#!/bin/zsh
# Render the pass-1 speech-cut previews (full + short) from cut-ep7-v1.json.
# Picture stays HLG (bt2020 / arib-std-b67) and is tagged, so QuickTime and phones show true colour.
set -e
EP="/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep7_LinkedIn-Agent"
TAKE="$EP/04_raw-footage/take/DJI_20261004182152_0026_D.MP4"
OUT="$EP/05_cuts/pass1"; TMP="$OUT/segs"; mkdir -p "$TMP"
python3 - "$EP" <<'EOF' > "$TMP/list.txt"
import json,sys
d=json.load(open(sys.argv[1]+'/01_scripts/cut-ep7-v1.json'))
for i,s in enumerate(d['segments']): print(f"{i:02d} {s['in']} {s['dur']} {s['version']}")
EOF
while read i s dur ver; do
  ffmpeg -nostdin -v error -y -ss "$s" -t "$dur" -i "$TAKE" -map 0:0 -map 0:1 \
    -vf "fps=30,scale=1080:1920:flags=lanczos" -c:v hevc_videotoolbox -profile:v main10 -pix_fmt p010le -b:v 12M \
    -color_primaries bt2020 -color_trc arib-std-b67 -colorspace bt2020nc -tag:v hvc1 \
    -af "afade=t=in:d=0.012,afade=t=out:st=$(python3 -c "print(max(0,$dur-0.02))"):d=0.02" -c:a aac -b:a 192k -ar 48000 \
    "$TMP/seg$i.mp4"
done < "$TMP/list.txt"
for v in full short; do
  : > "$TMP/concat-$v.txt"
  while read i s dur ver; do
    if [[ $v == full || $ver == both ]]; then echo "file 'seg$i.mp4'" >> "$TMP/concat-$v.txt"; fi
  done < "$TMP/list.txt"
  ffmpeg -v error -y -f concat -safe 0 -i "$TMP/concat-$v.txt" -c:v copy -af "loudnorm=I=-16:TP=-1.5:LRA=9" -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT/ep7-pass1-speech-$v.mp4"
  ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/ep7-pass1-speech-$v.mp4"
done
ls -la "$OUT"
