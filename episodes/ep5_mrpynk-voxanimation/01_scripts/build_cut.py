#!/usr/bin/env python3
"""Build the Ep5 speech cut: energy-based onsets/offsets, pause squeeze, frame-exact items.
Input lines: (take, start_word_time, end_word_time, label). Uses 16 kHz mono wavs in AUD.
Output: cut-ep5-v1.json (join_audit format) + items with sourceIn µs for ChatCut.
"""
import json, sys, wave, numpy as np
AUD='/Users/henrychua/Content Creation/_ep5-scratch/audio'
FPS=30
def load(take):
    w=wave.open(f'{AUD}/{take}.wav'); sr=w.getframerate(); x=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768; return sr,x
def rms_db(x,sr,hop=0.01):
    n=int(sr*hop); m=len(x)//n; r=np.sqrt((x[:m*n].reshape(m,n)**2).mean(1)+1e-12); return 20*np.log10(r+1e-9)
CACHE={}
def env(take):
    if take not in CACHE:
        sr,x=load(take); e=rms_db(x,sr); floor=np.percentile(e,10); CACHE[take]=(e,floor)
    return CACHE[take]
def words(take):
    d=json.load(open(f'{AUD}/{take}.json'))
    return [(s['offsets']['from']/1000, s['offsets']['to']/1000, s['text'].strip()) for s in d['transcription'] if s['text'].strip() and s['text'].strip()!='[BLANK_AUDIO]']
def prev_word_end(take,t):
    ends=[b for a,b,_ in words(take) if a<t-0.05]
    return max(ends) if ends else 0.0
def next_word_start(take,t):
    starts=[a for a,b,_ in words(take) if a>t+0.05]
    return min(starts) if starts else 1e9
def sil_thr(take):
    e,fl=env(take); return max(fl+6,-42.0)
def onset(take,t,search=0.35,thr=12):
    """move back from word time t to the first 10 ms frame above floor+thr, then back 30 ms for the consonant. Never before the previous word's end."""
    e,fl=env(take); i=int(t*100); lo=max(0,i-int(search*100), int(prev_word_end(take,t)*100)-15)
    thr_abs=sil_thr(take)
    seg=e[lo:i+8]; idx=np.where(seg>thr_abs)[0]
    if len(idx)==0:
        # speech starts later than the word time: walk forward to the first frame above threshold
        hi=min(len(e)-1, int(next_word_start(take,t)*100))
        fw=np.where(e[i:hi]>thr_abs)[0]
        j=i+fw[0] if len(fw) else i
        return max(0,(j-3)/100)
    j=lo+idx[0]
    while j>lo and e[j-1]>fl+6: j-=1
    c=max(lo,j-3)
    if e[c]>thr_abs+6:  # still inside speech: take the quietest frame nearby
        a=max(lo,c-12); b=min(len(e)-1,c+5); c=a+int(np.argmin(e[a:b]))
    return max(0,c/100)
def offset(take,t,search=1.0,thr=6):
    """move forward from word end t to the last 10 ms frame above floor+thr within search, plus 60 ms tail."""
    e,fl=env(take); i=int(t*100); hi=min(len(e)-1,i+int(search*100), int(next_word_start(take,t)*100)-1)
    thr_abs=sil_thr(take)
    seg=e[i:hi]; idx=np.where(seg>thr_abs)[0]
    j=i+idx[-1] if len(idx) else i
    c=min(j+6,hi)
    if e[c]>thr_abs+6:
        a=max(i,c-12); b=min(len(e)-1,c+3); c=a+int(np.argmin(e[a:b]))
    return c/100
def gaps(take,a,b,minlen=0.30,thr=6):
    """silent stretches inside [a,b] longer than minlen (energy below floor+thr)."""
    e,fl=env(take); i0=int(a*100); i1=int(b*100); sil=e[i0:i1]<sil_thr(take)
    out=[]; k=0
    while k<len(sil):
        if sil[k]:
            s=k
            while k<len(sil) and sil[k]: k+=1
            if (k-s)/100>=minlen: out.append(((i0+s)/100,(i0+k)/100))
        else: k+=1
    return out
def build(lines, inner=0.16, keep=0.10):
    items=[]
    for line in lines:
        take,ws,we,label=line[:4]; ov=line[4] if len(line)>4 else {}
        a=ov.get('in', onset(take,ws)); b=ov.get('out', offset(take,we))
        pieces=[]; cur=a
        for gs,ge in ([] if ov.get('nosqueeze') else gaps(take,a,b)):
            if gs-keep<=cur: continue
            if ge+keep>=b: continue
            pieces.append((cur,gs+keep)); cur=ge-keep-inner+keep*0  # resume so that remaining silence = inner
            cur=ge-(inner-keep)  # leaves `inner` total silence: keep after speech + (inner-keep) before next
        pieces.append((cur,b))
        # drop trailing fragments that start after the last word (breaths, lip noise)
        pieces=[(p,q) for (p,q) in pieces if p<=we+0.15]
        if pieces: pieces[-1]=(pieces[-1][0], min(pieces[-1][1], b))
        for k,(p,q) in enumerate(pieces):
            fr=int(round((q-p)*FPS))
            if fr<3: continue
            items.append({"take":take,"in":round(p,3),"frames":fr,"label":f"{label}{'' if len(pieces)==1 else f'.{k+1}'}"})
    return items
if __name__=='__main__':
    pass
