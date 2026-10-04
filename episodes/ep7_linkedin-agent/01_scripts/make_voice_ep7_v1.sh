#!/bin/zsh
# Ep7 voice v1 (pre-Adobe): raw lav (take stream 1) with the Ep6 v2 natural chain, two-pass loudnorm -16 LUFS on the speech span.
# Adobe Podcast Enhance replaces this once Henry locks the cut (series step 6).
set -e
cd "/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep7_LinkedIn-Agent/04_raw-footage/voice"
IN=take26-stream1.wav; OUT=take26-voice-v1.wav
NAT="highpass=f=80,equalizer=f=170:t=q:w=1:g=1,equalizer=f=3000:t=q:w=1.2:g=1,deesser=i=0.5:m=0.6:f=0.5:s=o,highshelf=f=6000:g=-2,lowpass=f=12000:p=2"
M=$(ffmpeg -nostdin -v info -nostats -ss 11 -t 370 -i $IN -af "${NAT},loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
IFS=: read ii tp lra th off <<< $(echo "$M" | python3 -c "import json,sys;d=json.load(sys.stdin);print(':'.join([d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset']]))")
echo "measured ${ii} LUFS"
ffmpeg -nostdin -v error -y -i $IN -af "${NAT},loudnorm=I=-16:TP=-1.5:LRA=9:measured_I=${ii}:measured_TP=${tp}:measured_LRA=${lra}:measured_thresh=${th}:offset=${off}:linear=true,aresample=48000" -ac 1 -c:a pcm_s16le $OUT
ffprobe -v error -show_entries format=duration -of csv=p=0 $OUT
