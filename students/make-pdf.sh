#!/bin/zsh
# Builds editor-guide.pdf from editor-guide.html with headless Chrome (keeps the links), then tiles the pages for a check.
cd "$(dirname "$0")"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
f=editor-guide
"$CH" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=10000 --print-to-pdf="$PWD/$f.pdf" "file://$PWD/$f.html" >/dev/null 2>&1 && echo "wrote $f.pdf"
rm -rf tiles && mkdir tiles && pdftoppm -r 40 -png $f.pdf tiles/p && echo "pages: $(ls tiles | wc -l)"
