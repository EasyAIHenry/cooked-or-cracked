#!/bin/zsh
# Pass 5: ORIGINAL picture (video stream copied, HLG untouched) + voice chain + loudnorm -16 per take. Full takes, so sourceIn is unchanged.
set -e
OUT='/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep5_MrPynk-VoxAnimation/04_raw-footage/voice_v3'; mkdir -p "$OUT"; D=~/Downloads
VOICE="highpass=f=80,deesser=i=0.15:m=0.5:f=0.5,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=140,equalizer=f=3200:t=q:w=1:g=1.5,equalizer=f=220:t=q:w=1.2:g=-1"
one(){ n=$1; ss=$2; dd=$3; f=$(ls $D/Video_*_DJI_20260930*_${n}_D_* | head -1); o="$OUT/take${n}_v.mp4"
  M=$(ffmpeg -v info -nostats -ss $ss -t $dd -i "$f" -vn -af "$VOICE,loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
  IFS=: read ii tp lra th off <<< $(echo "$M" | python3 -c "import json,sys;d=json.load(sys.stdin);print(':'.join([d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset']]))")
  ffmpeg -v error -y -i "$f" -map 0:v:0 -map 0:a:0 -c:v copy -af "$VOICE,loudnorm=I=-16:TP=-1.5:LRA=9:measured_I=${ii}:measured_TP=${tp}:measured_LRA=${lra}:measured_thresh=${th}:offset=${off}:linear=true" -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$o"
  echo "take$n done (measured on ${ss}+${dd}s: $ii LUFS)"; }
# loudness measured on the used speech range, applied to the whole take
one 0001 14.2 20.5 & one 0004 31.4 10 & one 0005 15.8 75 & one 0006 0 11 &
wait
one 0008 6.3 16.4 & one 0011 27.5 12.8 & one 0012 0 17.8 & one 0015 6.9 55.6 & one 0016 2.2 5.7 &
wait
echo ALL_VOICED
