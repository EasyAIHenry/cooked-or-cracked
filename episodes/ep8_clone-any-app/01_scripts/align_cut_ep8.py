#!/usr/bin/env python3
"""Word times on the CUT timeline for Ep8: Whisper (medium) on each cut piece with token timestamps, mapped by piece offset.
Writes 01_scripts/words-cut-ep8-v2.json: [[cut_s, cut_e, word, seg_label]]. 0.3 s breath after each line (matches build_cut)."""
import json, subprocess, os, tempfile
EP='/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep8_Clone-Any-App'; T=f'{EP}/04_raw-footage/transcripts'
cut=json.load(open(f'{EP}/01_scripts/cut-ep8-v2.json'))['segments']
out=[]; t=0.0
for k,s in enumerate(cut):
    for q,(x,y) in enumerate(s['pieces']):
        tmp=tempfile.mkdtemp(); wav=f'{tmp}/p.wav'
        subprocess.run(['ffmpeg','-v','error','-y','-ss',str(x),'-t',str(round(y-x,3)),'-i',f"{T}/{s['take']}-16k.wav",wav],check=True)
        subprocess.run(['whisper-cli','-m',os.path.expanduser('~/.cache/hyperframes/whisper/models/ggml-medium.en.bin'),'-f',wav,'-oj','-ojf','-of',f'{tmp}/p','-l','en','-t','8'],check=True,capture_output=True)
        d=json.load(open(f'{tmp}/p.json'))
        for seg in d['transcription']:
            cur=None
            for tk in seg.get('tokens',[]):
                tx=tk['text']
                if tx.startswith('[_') or 'BLANK' in tx: continue
                a=t+tk['offsets']['from']/1000; b=t+tk['offsets']['to']/1000
                if tx.startswith(' ') or cur is None:
                    if cur and cur[2].strip(): out.append(cur)
                    cur=[round(a,3),round(b,3),tx.strip(),s['label'][:3]]
                else: cur[1]=round(b,3); cur[2]+=tx
            if cur and cur[2].strip(): out.append(cur)
        t+=y-x
    t+=0.3
json.dump(out,open(f'{EP}/01_scripts/words-cut-ep8-v2.json','w'))
print(len(out),'words; cut length',round(t,2),'s')
for w in out[:12]: print(w)
