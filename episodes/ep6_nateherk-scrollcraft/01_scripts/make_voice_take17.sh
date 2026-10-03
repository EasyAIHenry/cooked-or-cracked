#!/bin/zsh
# Rebuild 04_raw-footage/voice/take17_v.mp4 (ChatCut asset 06ee92e665, "take17_v (voice processed)").
# Picture is stream-copied from the original take; audio = Ep5 voice chain + two-pass loudnorm -16 LUFS measured on 41-553 s.
# Needs 04_raw-footage/take/DJI_20261002180600_0017_D.MP4 (copy of the DJI card file, MD5-verified).
set -e
cd "/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep6_NateHerk-ScrollCraft/04_raw-footage"
mkdir -p voice
f=take/DJI_20261002180600_0017_D.MP4
VOICE="highpass=f=80,deesser=i=0.15:m=0.5:f=0.5,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=140,equalizer=f=3200:t=q:w=1:g=1.5,equalizer=f=220:t=q:w=1.2:g=-1"
M=$(ffmpeg -v info -nostats -ss 41 -t 512 -i "$f" -vn -map 0:a:0 -af "$VOICE,loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
IFS=: read ii tp lra th off <<< $(echo "$M" | python3 -c "import json,sys;d=json.load(sys.stdin);print(':'.join([d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset']]))")
echo "measured ${ii} LUFS"
ffmpeg -v error -y -i "$f" -map 0:v:0 -map 0:a:0 -c:v copy -af "$VOICE,loudnorm=I=-16:TP=-1.5:LRA=9:measured_I=${ii}:measured_TP=${tp}:measured_LRA=${lra}:measured_thresh=${th}:offset=${off}:linear=true" -c:a aac -b:a 256k -ar 48000 -movflags +faststart voice/take17_v.mp4
ls -la voice
