# Caption cards from cut-ep5-v3.json + whisper word JSON (verified timings). One MG item per phrase of <=4 words.
import json,re,glob
FPS=30; CAP='dfaed928cf'; TRK='a225fac51d'
cut=json.load(open('cut-ep5-v3.json'))
W={}
for f in glob.glob('/Users/henrychua/Content Creation/_ep5-scratch/audio/take*.json'):
    t=f.split('/')[-1][:-5]
    W[t]=[(s['offsets']['from']/1000,s['offsets']['to']/1000,s['text'].strip()) for s in json.load(open(f))['transcription'] if s['text'].strip()]
FIX={'Seed Dance':'Seedance','seed dance':'Seedance','DB':'D.B.','Higsfield':'Higgsfield','Hicksfield':'Higgsfield','Higgs Field':'Higgsfield','chat cut':'ChatCut','Chat Cut':'ChatCut','Vox':'Vox','Amelia':'Amelia','Earhart':'Earhart','Erhart':'Earhart','Airheart':'Earhart'}
f=0; lines=[]
for it in cut['items']:
    if 'spacer' in it: f+=it['spacer']; continue
    t=it['take']; a=it['in']; b=a+it['frames']/FPS
    words=[(max(0,round((s-a)*FPS)),txt) for s,e,txt in W[t] if a-0.05<=s<b-0.02]
    lines.append(dict(f=f,n=it['frames'],label=it.get('label'),words=words)); f+=it['frames']
END=f
adds=[]; cards=[]
for ln in lines:
    ws=ln['words']
    if not ws: continue
    # phrases: break at punctuation or every 4 words
    groups=[]; cur=[]
    for i,(rf,txt) in enumerate(ws):
        cur.append((rf,txt))
        if len(cur)>=4 or re.search(r'[.,?!]$',txt) and len(cur)>=2: groups.append(cur); cur=[]
    if cur:
        if groups and len(cur)==1: groups[-1].extend(cur)
        else: groups.append(cur)
    for gi,g in enumerate(groups):
        start=g[0][0]; end=groups[gi+1][0][0] if gi+1<len(groups) else ln['n']
        if end-start<6: end=start+6
        end=min(end,ln['n']+4)
        text=' '.join(re.sub(r'[,.]$','',w) for _,w in g)
        for k,v in FIX.items(): text=text.replace(k,v)
        times=','.join(str(rf-start) for rf,_ in g)
        size=58 if len(text)<=22 else 50 if len(text)<=30 else 44
        cards.append(dict(f=ln['f']+start,n=end-start,text=text,times=times,label=ln['label']))
        adds.append(dict(type="motion-graphic",assetId=CAP,trackId=TRK,startFrame=ln['f']+start,durationFrames=end-start,left=40,top=1490,width=1000,height=220,keepAspectRatio=False,
            propertyOverrides=dict(serif="Fraunces",paper="#FFFEFA",ink="#171411",accent="#DF825F",text=text,times=times,size=size)))
# overlap guard on the single track
adds.sort(key=lambda a:a['startFrame'])
for i in range(1,len(adds)):
    p=adds[i-1]; 
    if p['startFrame']+p['durationFrames']>adds[i]['startFrame']: p['durationFrames']=adds[i]['startFrame']-p['startFrame']
json.dump(adds,open('captions-v4-adds.json','w')); json.dump(cards,open('captions-v4-cards.json','w'),indent=0)
print('END',END,'cards',len(adds))
for c in cards: print(c['f'],c['n'],c['label'],'|',c['text'],'|',c['times'])
