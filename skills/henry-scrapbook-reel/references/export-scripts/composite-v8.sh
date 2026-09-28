#!/bin/zsh
# v8: ChatCut now exports MGs with real transparency, so the picture is ONE export (v8-full).
# We only add: captions band during dead-air windows (from the captions export) + voice levelling.
set -e
D=/Users/henrychua/Movies/ChatCut
FULL="$D/cooked-or-cracked-ep1-v8-full.mp4"
CAPS="$D/cooked-or-cracked-ep1-v8-captions.mp4"
OUT="${1:-$D/cooked-or-cracked-ep1-v8-FINAL.mp4}"
CAPWIN="between(t,6.0,7.83)+between(t,19.97,22.13)+between(t,39.03,40.63)+between(t,51.53,53.3)+between(t,65.8,67.93)+between(t,74.67,76.6)+between(t,91.03,133)"
ACH="highpass=f=70,acompressor=threshold=-24dB:ratio=2.5:attack=8:release=160:makeup=2"
M=$(ffmpeg -v info -i "$FULL" -af "$ACH,loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
mI=$(echo "$M" | grep input_i | sed -E 's/[^-0-9.]//g'); mTP=$(echo "$M" | grep input_tp | sed -E 's/[^-0-9.]//g')
mLRA=$(echo "$M" | grep input_lra | sed -E 's/[^-0-9.]//g'); mTH=$(echo "$M" | grep input_thresh | sed -E 's/[^-0-9.]//g'); mOFF=$(echo "$M" | grep target_offset | sed -E 's/[^-0-9.]//g')
AUD="[0:a]$ACH,loudnorm=I=-14:TP=-1.5:LRA=7:measured_I=${mI}:measured_TP=${mTP}:measured_LRA=${mLRA}:measured_thresh=${mTH}:offset=${mOFF}:linear=true,alimiter=limit=0.75:attack=3:release=80:level=false[a]"
# caption band: bottom strip of the captions export, only inside the windows
ffmpeg -y -i "$FULL" -i "$CAPS" -filter_complex "[1:v]crop=1080:300:0:1440[band];[0:v][band]overlay=0:1440:enable='$CAPWIN'[v];$AUD" -map "[v]" -map "[a]" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k "$OUT"
echo "wrote $OUT"
