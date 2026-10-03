#!/bin/zsh
# Adobe Podcast Enhance voice (v2, speech 50 / music 10 / bg 10) for the whole Ep6 take -> ChatCut voice WAV.
# Light chain from the adobe-podcast-enhance skill (presence lift, gentle 2:1), then two-pass loudnorm -16 LUFS on 41-553 s
# so it sits where take17_v sat (all SFX levels were set against -16). Final limiter + -14 LUFS happen in the master.
set -e
A="/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep6_NateHerk-ScrollCraft/04_raw-footage/take/adobe-enhance"
IN="$A/DJI_20261002180600_0017_D-adobe.wav"; OUT="$A/take17_adobe_voice.wav"
LIGHT="highpass=f=80,equalizer=f=250:t=q:w=1:g=-2,equalizer=f=3200:t=q:w=1:g=3.5,highshelf=f=5000:g=3,acompressor=threshold=-20dB:ratio=2:attack=10:release=150"
M=$(ffmpeg -v info -nostats -ss 41 -t 512 -i "$IN" -af "$LIGHT,loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
IFS=: read ii tp lra th off <<< $(echo "$M" | python3 -c "import json,sys;d=json.load(sys.stdin);print(':'.join([d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset']]))")
echo "measured ${ii} LUFS"
ffmpeg -v error -y -i "$IN" -af "$LIGHT,loudnorm=I=-16:TP=-1.5:LRA=9:measured_I=${ii}:measured_TP=${tp}:measured_LRA=${lra}:measured_thresh=${th}:offset=${off}:linear=true,aresample=48000" -ac 1 -c:a pcm_s16le "$OUT"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"; ls -la "$OUT"
