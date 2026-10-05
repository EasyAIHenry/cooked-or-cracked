#!/bin/zsh
# prints the bottom (mm) of each block on the page; usable height ends at 284 (297 - 13 bottom padding)
cd "$(dirname "$0")"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
sed 's#</body>#<script>document.fonts.ready.then(()=>{const pg=document.querySelector(".page");const r=pg.getBoundingClientRect();const mm=r.width/210;document.title="M:"+[...pg.children].map(c=>c.className+"="+Math.round((c.getBoundingClientRect().bottom-r.top)/mm)).join(",")+" H="+Math.round(r.height/mm)+" SH="+Math.round(pg.scrollHeight/mm);});</script></body>#' guide.html > _m.html
"$CH" --headless=new --disable-gpu --virtual-time-budget=8000 --window-size=1200,1800 --dump-dom "file://$PWD/_m.html" 2>/dev/null | grep -o '<title>[^<]*' 
rm _m.html
