#!/bin/zsh
# Ep6 voice v2 (3 Oct 2026): Henry said the voice sounded "airy". The v1 light chain (+3.5 dB at 3.2 kHz, +3 dB shelf from 5 kHz)
# lifted 5-12 kHz by ~7 dB over Adobe's 64 kbps MP3 output (8-10 dB brighter than the raw mic), exaggerating MP3 sizzle.
# v2 matches the raw mic's own tone instead: no air shelf, a little warmth, a gentle clarity lift, de-ess, 12 kHz roll-off.
set -e
A="/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep6_NateHerk-ScrollCraft/04_raw-footage/take/adobe-enhance"
IN="$A/DJI_20261002180600_0017_D-adobe.wav"; OUT="$A/take17_adobe_voice_v2.wav"
NAT="highpass=f=80,equalizer=f=170:t=q:w=1:g=1,equalizer=f=3000:t=q:w=1.2:g=1,deesser=i=0.5:m=0.6:f=0.5:s=o,highshelf=f=6000:g=-2,lowpass=f=12000:p=2"   # no wideband compressor: it lifted breaths and sibilance (+4 dB at 5-12 kHz)
M=$(ffmpeg -v info -nostats -ss 41 -t 512 -i "$IN" -af "${NAT},loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
IFS=: read ii tp lra th off <<< $(echo "$M" | python3 -c "import json,sys;d=json.load(sys.stdin);print(':'.join([d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset']]))")
ffmpeg -v error -y -i "$IN" -af "${NAT},loudnorm=I=-16:TP=-1.5:LRA=9:measured_I=${ii}:measured_TP=${tp}:measured_LRA=${lra}:measured_thresh=${th}:offset=${off}:linear=true,aresample=48000" -ac 1 -c:a pcm_s16le "$OUT"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
