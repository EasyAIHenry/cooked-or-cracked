#!/usr/bin/env python3
"""Move every absolute time in final/build.py and words_final.json from the old rough-cut
timeline (edl_mapped_v1b.json) to the new one (edl_mapped.json). Each segment is a pure shift."""
import json, re, shutil

OLD = json.load(open("edl_mapped_v1b.json"))
NEW = {s["id"]: s for s in json.load(open("edl_mapped.json"))}

def remap(t):
    if t <= 0:
        return t
    for s in OLD:
        if s["outStart"] - 1e-6 <= t < s["outEnd"] + 1e-6:
            n = NEW[s["id"]]
            return round(t + (n["outStart"] - s["outStart"]) + (s["in"] - n["in"]), 2)
    last = OLD[-1]; n = NEW[last["id"]]
    return round(t + (n["outStart"] - last["outStart"]) + (last["in"] - n["in"]), 2)

# ---- words ----
w = json.load(open("words_final.json"))
for x in w:
    x["start"], x["end"] = remap(x["start"]), remap(x["end"])
json.dump(w, open("words_final.json", "w"), indent=0)

# ---- build.py ----
p = "final/build.py"
shutil.copy(p, "final/build_v1b.py")
s = open(p).read()
head, rest = s.split('HTML = r"""', 1)
tmpl, tail = rest.split('"""', 1)

# python side: SFX times, is_key windows, duration
def sfx_sub(m): return f'({remap(float(m.group(1))):.2f}, "{m.group(2)}"'
head = re.sub(r'\((\d+\.\d+), "(\w+)"', sfx_sub, head)
head = re.sub(r'if 34\.5 < w\["start"\] < 36\.1', lambda m: f'if {remap(34.5)} < w["start"] < {remap(36.1)}', head)
head = re.sub(r'10\.0 < w\["start"\] < 10\.2', lambda m: f'{remap(10.0)} < w["start"] < {remap(10.2)}', head)
head = re.sub(r'7\.5 < w\["start"\] < 7\.8', lambda m: f'{remap(7.5)} < w["start"] < {remap(7.8)}', head)
head = re.sub(r'33\.1 < w\["start"\] < 33\.3', lambda m: f'{remap(33.1)} < w["start"] < {remap(33.3)}', head)
head = re.sub(r'w\["start"\] in \(14\.70, 38\.08\)', lambda m: f'abs(w["start"]-{remap(14.70)})<0.05 or abs(w["start"]-{remap(38.08)})<0.05', head)
newdur = round(NEW[OLD[-1]["id"]]["outEnd"] - 0.06, 2)
head = re.sub(r"DUR = [\d.]+", f"DUR = {newdur}", head)

# template: timed media windows (start + duration), media offsets of the cutout clips
def media_sub(m):
    a, d = float(m.group(1)), float(m.group(2))
    na = remap(a); nd = round(remap(a + d) - na, 2)
    return f'data-start="{na:.2f}" data-duration="{nd:.2f}"'
tmpl = re.sub(r'data-start="(\d+\.\d+)" data-duration="(\d+\.\d+)"', media_sub, tmpl)
tmpl = re.sub(r'data-media-start="(\d+\.\d+)"', lambda m: f'data-media-start="{remap(float(m.group(1))):.2f}"' if float(m.group(1)) > 0 else m.group(0), tmpl)

# template: GSAP positions
tmpl = re.sub(r'\},(\d+\.\d+)\);', lambda m: f'}},{remap(float(m.group(1))):.2f});', tmpl)
tmpl = re.sub(r'",(\d+\.\d+)\);', lambda m: f'",{remap(float(m.group(1))):.2f});', tmpl)
tmpl = re.sub(r'",(\d+\.\d+)\]', lambda m: f'",{remap(float(m.group(1))):.2f}]', tmpl)
tmpl = re.sub(r'(\d+\.\d+)\+i\*', lambda m: f'{remap(float(m.group(1))):.2f}+i*', tmpl)
# three.js: palm keyframes and throw times (all inside the first segment)
tmpl = re.sub(r'\[(\d+\.\d+),(\d+),(\d+)\]', lambda m: f'[{remap(float(m.group(1))):.2f},{m.group(2)},{m.group(3)}]', tmpl)
tmpl = re.sub(r'T0=(\d+\.\d+), TT=(\d+\.\d+), TI=(\d+\.\d+)',
              lambda m: f'T0={remap(float(m.group(1))):.2f}, TT={remap(float(m.group(2))):.2f}, TI={remap(float(m.group(3))):.2f}', tmpl)

open(p, "w").write(head + 'HTML = r"""' + tmpl + '"""' + tail)
print("retimed. new DUR", newdur)
for t in [0.12, 1.62, 4.05, 6.85, 12.45, 14.70, 16.22, 20.71, 26.30, 27.60, 32.45, 34.66, 36.12, 38.10, 44.35, 47.0]:
    print(f"  {t:6.2f} -> {remap(t):6.2f}")
