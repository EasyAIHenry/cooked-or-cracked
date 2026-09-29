#!/bin/zsh
# Ep4 guide: one PDF (guide + blueprint + prompt pack). Headless Chrome keeps the links; tiles/ is the overflow check.
cd "$(dirname "$0")"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
f=let-claude-edit-your-videos
"$CH" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf="$PWD/$f.pdf" "file://$PWD/$f.html" >/dev/null 2>&1 && echo "wrote $f.pdf"
mkdir -p tiles; rm -f tiles/*.png 2>/dev/null; true
pdftoppm -r 40 -png $f.pdf tiles/g
python3 - <<'PY'
from PIL import Image; import glob
fs=sorted(glob.glob("tiles/g-*.png")); ims=[Image.open(f) for f in fs]; w,h=ims[0].size
cols=5; rows=(len(ims)+cols-1)//cols
sheet=Image.new("RGB",(w*cols,h*rows),"white")
for i,im in enumerate(ims): sheet.paste(im,((i%cols)*w,(i//cols)*h))
sheet.save("tiles/sheet.png"); print("pages:",len(fs))
PY
