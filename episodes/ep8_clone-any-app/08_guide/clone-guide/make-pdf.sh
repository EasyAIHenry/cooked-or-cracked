#!/bin/zsh
# Ep8 CLONE guide + worksheet to PDF (headless Chrome keeps the links) plus PNG tiles for QA.
cd "$(dirname "$0")"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CH" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=9000 --print-to-pdf="$PWD/Ten-Apps-Worth-Cloning-in-an-Hour.pdf" "file://$PWD/guide.html" >/dev/null 2>&1 && echo "wrote guide pdf"
"$CH" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=9000 --print-to-pdf="$PWD/Ten-Features-Worth-an-Hour-Worksheet.pdf" "file://$PWD/worksheet.html" >/dev/null 2>&1 && echo "wrote worksheet pdf"
for f in Ten-Apps-Worth-Cloning-in-an-Hour Ten-Features-Worth-an-Hour-Worksheet; do pdfinfo "$f.pdf" | grep Pages; done
rm -f qa-*.png; pdftoppm -r 45 -png Ten-Apps-Worth-Cloning-in-an-Hour.pdf qa-g; pdftoppm -r 45 -png Ten-Features-Worth-an-Hour-Worksheet.pdf qa-w
ffmpeg -v error -y $(for p in qa-g-*.png qa-w-*.png; do printf -- "-i %s " "$p"; done) -filter_complex "$(n=$(ls qa-g-*.png qa-w-*.png | wc -l | tr -d ' '); s=""; for i in $(seq 0 $((n-1))); do s="$s[$i]"; done; echo "${s}hstack=$n")" qa-tiles.jpg && echo "tiles ok"
