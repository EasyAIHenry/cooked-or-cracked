#!/bin/zsh
cd "$(dirname "$0")"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
f=scroll-website-that-builds-itself
"$CH" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=6000 --print-to-pdf="$PWD/$f.pdf" "file://$PWD/$f.html" >/dev/null 2>&1 && echo "wrote $f.pdf"
pdfinfo $f.pdf | grep Pages
mkdir -p tiles; rm -f tiles/g-*.png; pdftoppm -r 110 -png $f.pdf tiles/g; ls tiles/g-*.png
