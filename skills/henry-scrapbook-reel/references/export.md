# Three-pass export composite
B=base.mp4 G=graphics-green.mp4 C=captions-green.mp4
LUM="(0.3*r(X,Y)+0.59*g(X,Y)+0.11*b(X,Y))*1.7"
CAP="[2:v]colorkey=0x005800:0.14:0.10,format=rgba,geq=r='if(gt(r(X,Y)-g(X,Y),60),223,clip($LUM,0,255))':g='if(gt(r(X,Y)-g(X,Y),60),130,clip($LUM,0,255))':b='if(gt(r(X,Y)-g(X,Y),60),95,clip($LUM,0,255))':a='alpha(X,Y)'[cap]"
ffmpeg -i "$B" -i "$G" -i "$C" -filter_complex "[1:v]colorkey=0x005800:0.12:0.05,format=rgba,split[c1][a1];[a1]alphaextract,erosion,erosion[m1];[c1][m1]alphamerge[fg];$CAP;[0:v][fg]overlay[x];[x][cap]overlay[v]" -map "[v]" -map 1:a -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k FINAL.mp4
Green is RGB ~(0,88,0). Use colorkey (RGB), not chromakey. Erosion x2 removes the fringe on paper cards. Captions layer is recolored (white / accent) because ChatCut tints the text on export.

# Full-frame graphics (confetti) need their OWN pass
Any full-frame MG (1080x1920 box) exports as a full green matte that hides every other graphic in the same pass, regardless of track order. Export it alone (all other graphic tracks hidden), then key and overlay it as a 4th layer:
[3:v]colorkey=0x005800:0.10:0.04,format=rgba[conf] ... [x][conf]overlay ... before the captions overlay.
IMPORTANT: a pass that contains footage outside its graphic's time span must be overlaid with enable='between(t,START,END)' or it will cover the layers beneath it. Full-frame passes (confetti) always need this.
