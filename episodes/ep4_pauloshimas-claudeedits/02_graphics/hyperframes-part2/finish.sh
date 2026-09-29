#!/bin/zsh
# v2 finish: Henry's usual grade (Ep3 v8) on the whole frame + loudness like Ep3 (-14 LUFS, TP -2, LRA 7) + phone copy
set -e
cd ~/coc-ep4-test/videos/part2/final
IN=${1:-render_raw.mp4}; OUT=${2:-part2-paulo-method-v2.mp4}
VF="eq=contrast=1.08:saturation=1.10:gamma=1.05:brightness=0.01,curves=all='0/0 0.5/0.53 0.82/0.82 1/0.965',colorbalance=rm=0.015:bm=-0.015"
II=$(ffmpeg -hide_banner -nostats -i "$IN" -vn -af ebur128=framelog=quiet -f null - 2>&1 | awk '/I:/{v=$2} END{print v}')
G=$(python3 -c "print(round(-14.0-float('$II'),2))")
echo "measured ${II} LUFS, gain ${G} dB"
ffmpeg -v error -y -i "$IN" -filter_complex "[0:a]volume=${G}dB,alimiter=limit=0.79:attack=5:release=60:level=false:latency=true,aresample=48000[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -movflags +faststart "$OUT"
ffmpeg -v error -y -i "$OUT" -c:v libx264 -b:v 2600k -pass 1 -preset slow -an -f mp4 /dev/null
ffmpeg -v error -y -i "$OUT" -c:v libx264 -b:v 2600k -pass 2 -preset slow -c:a aac -b:a 192k -movflags +faststart "${OUT%.mp4}-phone.mp4"
rm -f ffmpeg2pass-0.log ffmpeg2pass-0.log.mbtree
ls -la "$OUT" "${OUT%.mp4}-phone.mp4"
ffmpeg -hide_banner -nostats -i "$OUT" -af ebur128=framelog=quiet -f null - 2>&1 | grep -E "^\s+(I:|Peak:)" | tr -s ' '
