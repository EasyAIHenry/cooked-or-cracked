#!/bin/zsh
# Renders the one-page GHOST guide to PDF (headless Chrome keeps the links) and a PNG preview.
cd "$(dirname "$0")"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="Automate-your-LinkedIn-with-Claude"
"$CH" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf="$PWD/$OUT.pdf" "file://$PWD/guide.html" >/dev/null 2>&1 && echo "wrote $OUT.pdf"
pdfinfo "$OUT.pdf" | grep Pages
pdftoppm -r 80 -png "$OUT.pdf" preview && echo "wrote preview-*.png"
