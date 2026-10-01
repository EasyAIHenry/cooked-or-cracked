#!/bin/zsh
cd "$(dirname "$0")"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
f=vox-explainer-in-30-minutes
"$CH" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=6000 --print-to-pdf="$PWD/$f.pdf" "file://$PWD/$f.html" >/dev/null 2>&1 && echo "wrote $f.pdf"
mkdir -p tiles; rm -f tiles/g-*.png; pdftoppm -r 60 -png $f.pdf tiles/g; ls tiles/g-*.png | wc -l
