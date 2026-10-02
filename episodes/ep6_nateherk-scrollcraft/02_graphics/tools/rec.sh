#!/bin/zsh
# Screen recorder for Ep6 steps. Usage: rec.sh start <name> [screen 0|1] ; rec.sh stop ; rec.sh status
# Screen 0 = main 4K (Claude app), screen 1 = Chrome screen. Never screen 2 (WhatsApp).
OUT="/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep6_NateHerk-ScrollCraft/04_raw-footage/screen"
PIDF="$OUT/.rec.pid"
case "$1" in
  start)
    [[ -f "$PIDF" ]] && kill -0 $(cat "$PIDF") 2>/dev/null && { echo "already recording: $(cat "$OUT/.rec.name")"; exit 1; }
    scr=${3:-1}; [[ "$scr" == 2 ]] && { echo "screen 2 is private, refused"; exit 1; }
    dev=$((scr + 4))
    f="$OUT/$(date +%H%M%S)-${2:-step}-s${scr}.mp4"
    nohup ffmpeg -hide_banner -loglevel error -f avfoundation -capture_cursor 1 -capture_mouse_clicks 1 -framerate 30 -i "${dev}:none" \
      -vf "scale=2560:-2" -c:v h264_videotoolbox -b:v 12M -pix_fmt yuv420p -movflags +faststart "$f" >/dev/null 2>"$OUT/.rec.err" &
    echo $! > "$PIDF"; echo "$f" > "$OUT/.rec.name"; echo "recording -> $f";;
  stop)
    [[ -f "$PIDF" ]] || { echo "not recording"; exit 0; }
    kill -INT $(cat "$PIDF") 2>/dev/null; sleep 2; rm -f "$PIDF"
    f=$(cat "$OUT/.rec.name"); echo "saved $f ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f" 2>/dev/null) s)";;
  status) [[ -f "$PIDF" ]] && kill -0 $(cat "$PIDF") 2>/dev/null && echo "recording: $(cat "$OUT/.rec.name")" || echo "idle";;
esac
