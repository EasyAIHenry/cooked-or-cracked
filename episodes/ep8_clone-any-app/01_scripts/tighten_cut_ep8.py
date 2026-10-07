#!/usr/bin/env python3
"""Pass 2b tighten (7 Oct 2026): fixes the four cut points the join audit flagged on pass 2a and trims the dead air at line
edges to the series rule (0.08 s before the first sound, 0.10 s after the last; 0.35 s after the final word). The 9-frame
breath between lines stays, so a sentence break lands at about 0.45 s instead of 0.6 to 1.25 s.
Reads cut-ep8-v2.json (pass 2a copy kept as cut-ep8-v2-pass2a.json), writes cut-ep8-v2.json in place. build_cut_ep8.py would
undo this if re-run; re-run this after it. Then: align_cut_ep8.py, place_ep8.py."""
import json, wave, numpy as np
EP='/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep8_Clone-Any-App'; T=f'{EP}/04_raw-footage/transcripts'
SR=16000; W=160
def load(p):
    w=wave.open(p); return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
A={'part1':load(f'{T}/part1-16k.wav'),'part2':load(f'{T}/part2-16k.wav')}
# energy scans, 7 Oct: L04 "So" onset 99.18; L08 "but" valley 306.10 (305.92-306.06 is the tail of "anything"), "Buffer" ends 307.86;
# L11 "First" onset 398.30; L12 "Not" onset 376.05 (Whisper full-take had it drifted into the previous sentence).
MANUAL={'L04':{'in':99.10},'L08':{'in':306.11,'out':307.93},'L11':{'out':388.97},'L9a':{'out':405.72},'L09':{'in':405.99,'out':409.90},'L6b':{'in':116.33,'out':121.76}}   # v5 pins   # v4: "data" ends 405.21   # v3: L4a and L11 tails by energy (speech ends 137.30 / 397.9)
HEAD, TAIL, FINAL_TAIL = 0.08, 0.10, 0.35
def loud(a, x, y):
    seg=a[int(x*SR):int(y*SR)]
    rms=np.array([20*np.log10(np.sqrt(np.mean(seg[i:i+W]**2))+1e-9) for i in range(0,len(seg)-W,W)])
    thr=max(np.percentile(rms,5)+6,-45); idx=np.where(rms>thr)[0]
    if not len(idx): return None, None
    return x+idx[0]*W/SR, x+(idx[-1]+1)*W/SR          # first and last loud 10 ms window, seconds in the take
cut=json.load(open(f'{EP}/01_scripts/cut-ep8-v2.json'))
MERGE={'L4a'}   # the pause squeeze cut inside words here; keep the line whole
for k,s in enumerate(cut['segments']):
    lab=s['label'][:3]
    if lab=='H00': continue
    if lab in MERGE: s['pieces']=[[s['pieces'][0][0], s['pieces'][-1][1]]]
    m=MANUAL.get(lab,{})
    if 'in' in m: s['pieces'][0][0]=m['in']
    if 'out' in m: s['pieces'][-1][1]=m['out']
    a=A[s['take']]
    x,y=s['pieces'][0]; on,_=loud(a,x,y)
    if on is not None and on-x>HEAD: s['pieces'][0][0]=round(on-HEAD,3)
    x,y=s['pieces'][-1]; _,off=loud(a,x,y)
    tail = FINAL_TAIL if k==len(cut['segments'])-1 else TAIL
    if off is not None and y-off>tail: s['pieces'][-1][1]=round(off+tail,3)
    old=s['dur']; s['in']=s['pieces'][0][0]; s['out']=s['pieces'][-1][1]; s['dur']=round(sum(b-a_ for a_,b in s['pieces']),3)
    print(f"{lab} {s['in']:8.3f}-{s['out']:8.3f} dur {old:6.2f} -> {s['dur']:6.2f}  pieces {s['pieces']}")
json.dump(cut,open(f'{EP}/01_scripts/cut-ep8-v2.json','w'),indent=1)
print('total speech', round(sum(s['dur'] for s in cut['segments']),2))
