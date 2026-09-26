#!/usr/bin/env python3
"""Check every external link in the guide HTML and the PDF: HTTP status via curl. Run: python3 check-links.py"""
import re, subprocess, sys, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
html=open("design-guide.html").read()
links=sorted(set(re.findall(r'href="(https?://[^"]+)"', html)))
bad=0
for u in links:
    code=subprocess.run(["curl","-sL","-o","/dev/null","-w","%{http_code}","-A","Mozilla/5.0","--max-time","25",u],capture_output=True,text=True).stdout.strip()
    ok=code.startswith("2") or code.startswith("3")
    print(("OK  " if ok else "BAD ")+code+"  "+u); bad+=0 if ok else 1
# links survive into the PDF?
if os.path.exists("design-guide.pdf"):
    n=subprocess.run(["python3","-c","import fitz;d=fitz.open('design-guide.pdf');print(sum(len(p.get_links()) for p in d))"],capture_output=True,text=True)
    print("PDF link annotations:", n.stdout.strip() or n.stderr.strip()[:80])
print(f"{len(links)} links, {bad} bad"); sys.exit(1 if bad else 0)
