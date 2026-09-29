#!/bin/zsh
# Put the enhanced voice back on a video that has NOT been cut (same length as the original take),
# with the light presence chain and loudness normalisation. For cut edits in ChatCut, use the
# track method in SKILL.md instead.
# usage: swap_audio.sh <original video> <enhanced mp3/wav> <out.mp4> [--no-eq]
set -e
V="$1"; A="$2"; OUT="$3"
CH="highpass=f=80,equalizer=f=250:t=q:w=1.2:g=-2,equalizer=f=3200:t=q:w=1.0:g=3.5,highshelf=f=5000:g=3,acompressor=threshold=-20dB:ratio=2:attack=10:release=150:makeup=1.5,alimiter=limit=0.95"
[ "$4" = "--no-eq" ] && CH="acompressor=threshold=-20dB:ratio=2:attack=10:release=150:makeup=1.5,alimiter=limit=0.95"
M=$(ffmpeg -nostdin -i "$A" -af "${CH},loudnorm=I=-14:TP=-2.0:LRA=7:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
set -- $(echo "$M" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")
ffmpeg -nostdin -loglevel error -y -i "$V" -i "$A" -filter_complex "[1:a]${CH},loudnorm=I=-14:TP=-2.0:LRA=7:measured_I=${1}:measured_TP=${2}:measured_LRA=${3}:measured_thresh=${4}:offset=${5}:linear=true,aresample=48000[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
echo "wrote $OUT"
ffmpeg -nostdin -i "$OUT" -af volumedetect -vn -f null - 2>&1 | grep -E "mean_volume|max_volume"
