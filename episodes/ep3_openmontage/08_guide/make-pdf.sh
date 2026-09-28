#!/bin/zsh
cd "$(dirname "$0")"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for f in ai-video-production-guide worksheet; do
  "$CH" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=6000 --print-to-pdf="$PWD/$f.pdf" "file://$PWD/$f.html" >/dev/null 2>&1 && echo "wrote $f.pdf"
done
mkdir -p tiles; rm -f tiles/*.png 2>/dev/null; true
pdftoppm -r 40 -png ai-video-production-guide.pdf tiles/g; pdftoppm -r 40 -png worksheet.pdf tiles/w
python3 - <<'PY'
from PIL import Image; import glob
fs=sorted(glob.glob("tiles/g-*.png"))+sorted(glob.glob("tiles/w-*.png")); ims=[Image.open(f) for f in fs]; w,h=ims[0].size
sheet=Image.new("RGB",(w*len(ims),h),"white")
for i,im in enumerate(ims): sheet.paste(im,(i*w,0))
sheet.save("tiles/sheet.png"); print("pages:",len(fs))
PY
