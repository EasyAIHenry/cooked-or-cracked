#!/bin/zsh
# Ep5 footage look: HLG gamut step + skin smoothing (Ep4 shader rebuild, 0.65) + light warm grade. Voice chain + loudnorm -16 per segment.
# Footage only, never graphics. Segments = used source ranges with 0.5 s pad; place_v3 subtracts the segment start from sourceIn.
set -e
OUT='/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep5_MrPynk-VoxAnimation/04_raw-footage/graded_v2'
D=~/Downloads
SS='st(9,clip((ld(8)-A)/(B-A),0,1));ld(9)*ld(9)*(3-2*ld(9))'
sm(){ echo "$SS" | sed -e "s/A/$1/g" -e "s/B/$2/g"; }
LY="st(8,(val-16)/219);255*($(sm 0.15 0.25))"
LU="st(8,(val-128)/224+0.5);st(7,$(sm 0.34 0.37));st(8,(val-128)/224+0.5);255*ld(7)*(1-($(sm 0.49 0.52)))"
LV="st(8,(val-128)/224+0.5);st(7,$(sm 0.52 0.56));st(8,(val-128)/224+0.5);255*ld(7)*(1-($(sm 0.66 0.70)))"
PRE="colorspace=iall=bt2020:itrc=bt2020-10:all=bt709:format=yuv444p"
GRADE="eq=contrast=1.02:saturation=1.07"
G="[0:v]scale=1296:2304:flags=lanczos,${PRE},split=3[src][sm][mk];[sm]bilateral=sigmaS=4:sigmaR=0.10:planes=7,lutyuv=y='val+(235-val)*0.03'[smo];[mk]extractplanes=y+u+v[my][mu][mv];[my]lut=c0='$LY'[ly];[mu]lut=c0='$LU'[lu];[mv]lut=c0='$LV'[lv];[ly][lu]blend=all_mode=multiply[m1];[m1][lv]blend=all_mode=multiply,lut=c0='val*0.6',split=3[ma][mb][mc];[ma][mb][mc]mergeplanes=0x001020:yuv444p[m3];[src][smo][m3]maskedmerge,${GRADE},format=yuv420p[o]"
VOICE="highpass=f=80,deesser=i=0.15:m=0.5:f=0.5,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=140,equalizer=f=3200:t=q:w=1:g=1.5,equalizer=f=220:t=q:w=1.2:g=-1"
one(){ # take start dur
  n=$1; ss=$2; dd=$3; f=$(ls $D/Video_*_DJI_20260930*_${n}_D_* | head -1); o="$OUT/take${n}_g.mp4"
  # pass 1: measure loudness of the voice chain on this segment
  M=$(ffmpeg -v info -nostats -ss $ss -t $dd -i "$f" -vn -af "$VOICE,loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
  II=$(echo "$M" | python3 -c "import json,sys;d=json.load(sys.stdin);print(':'.join([d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset']]))")
  IFS=: read ii tp lra th off <<< "$II"
  ffmpeg -v error -y -ss $ss -t $dd -i "$f" -filter_complex "$G" -map "[o]" -map 0:a:0 \
    -af "$VOICE,loudnorm=I=-16:TP=-1.5:LRA=9:measured_I=${ii}:measured_TP=${tp}:measured_LRA=${lra}:measured_thresh=${th}:offset=${off}:linear=true" \
    -c:v libx264 -preset fast -crf 15 -r 50 -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
    -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$o"
  echo "take$n done in=$ii LUFS -> $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$o") s"
}
T0=$(date +%s)
# take start(=used_min-0.5) dur(=range+1.0)
( one 0005 15.8 75.1 ) &
( one 0015 6.9 55.6 ) &
( one 0001 14.2 20.5; one 0012 0.0 17.8; one 0006 0.0 11.1; one 0004 31.4 10.0 ) &
( one 0008 6.3 16.4; one 0011 27.5 12.8; one 0016 2.2 5.7 ) &
wait
echo "ALL GRADED in $(( $(date +%s)-T0 )) s"
