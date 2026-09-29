#!/bin/zsh
# Henry's look for Ep4 footage: shader-equivalent skin smoothing (0.55) + grade A. Footage only, never graphics.
set -e
cd ~/coc-ep4-test/videos/part2/final/assets
G=$(cat ~/coc-ep4-test/videos/part2/grade/graph_N5.txt); GS=$(cat ~/coc-ep4-test/videos/part2/grade/graph_N5_still.txt)
mkdir -p ungraded
for f in base.mp4 clone.mp4 cutout.webm clone_cut.webm plate.png thumb_me.png thumb_bg.png; do [ -f ungraded/$f ] || cp $f ungraded/$f; done
opaque(){ # in out
  ffmpeg -v error -y -i "ungraded/$1" -filter_complex "$(echo $G | sed -e 's/\[IN\]/[0:v]/' -e 's/\[OUT\]/[o]/')" -map "[o]" -c:v libx264 -preset medium -crf 14 -g 30 -keyint_min 30 -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 -an "$2"; }
alpha(){ # in out
  ffmpeg -v error -y -c:v libvpx-vp9 -i "ungraded/$1" -filter_complex "[0:v]format=yuva444p,split[c][a];[a]alphaextract[al];$(echo $G | sed -e 's/\[IN\]/[c]/' -e 's/\[OUT\]/[g]/');[g][al]alphamerge,format=yuva420p[o]" -map "[o]" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 20 -row-mt 1 -deadline good -cpu-used 4 -auto-alt-ref 0 -g 30 -colorspace bt709 "$2"; }
still(){ ffmpeg -v error -y -i "ungraded/$1" -filter_complex "$(echo $GS | sed -e 's/\[IN\]/[0:v]/' -e 's/\[OUT\]/[o]/')" -map "[o]" "$1"; }
T0=$(date +%s)
opaque base.mp4 base.mp4 & alpha cutout.webm cutout.webm & opaque clone.mp4 clone.mp4 & alpha clone_cut.webm clone_cut.webm &
still plate.png; still thumb_me.png; still thumb_bg.png
wait
echo "grade all $(( $(date +%s)-T0 )) s"
for f in base.mp4 cutout.webm clone.mp4 clone_cut.webm; do echo "$f $(ffprobe -v error -show_entries format=duration -of csv=p=0 $f)"; done
