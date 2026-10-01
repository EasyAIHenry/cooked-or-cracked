import json,re
FPS=30; CAP='dfaed928cf'; TRK='8f9b21586a'
cut=json.load(open('cut-ep5-v4.json')); W=json.load(open('chatcut-words.json'))
f=0; lines=[]
for it in cut['items']:
    if 'spacer' in it: f+=it['spacer']; continue
    t=it['take']; a=it['in']; b=a+it['frames']/FPS
    ws=[(f+max(0,round((s-a)*FPS)),txt) for s,txt in W[t] if a-0.10<=s<b-0.12]
    base=str(it.get('label')).split('.')[0]
    if lines and lines[-1]['base']==base and lines[-1]['f']+lines[-1]['n']==f:
        lines[-1]['words']+=ws; lines[-1]['n']+=it['frames']
    else: lines.append(dict(f=f,n=it['frames'],label=it.get('label'),base=base,words=ws))
    f+=it['frames']
adds=[]; cards=[]
for ln in lines:
    ws=[(rf-ln['f'],txt) for rf,txt in ln['words']]
    if not ws: continue
    groups=[]; cur=[]
    for rf,txt in ws:
        cur.append((rf,txt))
        if len(cur)>=4 or (re.search(r'[.,?!]$',txt) and not txt.endswith('D.B.') and len(cur)>=2): groups.append(cur); cur=[]
    if cur:
        if groups and len(cur)==1: groups[-1].extend(cur)
        else: groups.append(cur)
    for gi,g in enumerate(groups):
        start=g[0][0]; end=groups[gi+1][0][0] if gi+1<len(groups) else ln['n']+3
        if end-start<8: end=start+8
        end=min(end,start+90)
        text=' '.join((w if w.endswith('D.B.') else re.sub(r'[,.]$','',w)) for _,w in g)
        times=','.join(str(rf-start) for rf,_ in g)
        size=58 if len(text)<=22 else 50 if len(text)<=30 else 44
        top=1430 if ln['f']<194 else 1490
        cards.append(dict(f=ln['f']+start,n=end-start,text=text,label=ln['label']))
        adds.append(dict(type="motion-graphic",assetId=CAP,trackId=TRK,startFrame=ln['f']+start,durationFrames=end-start,left=40,top=top,width=1000,height=220,keepAspectRatio=False,
            propertyOverrides=dict(serif="Fraunces",paper="#FFFEFA",ink="#171411",accent="#DF825F",text=text,times=times,size=size)))
adds.sort(key=lambda a:a['startFrame'])
for i in range(1,len(adds)):
    p=adds[i-1]
    if p['startFrame']+p['durationFrames']>adds[i]['startFrame']: p['durationFrames']=adds[i]['startFrame']-p['startFrame']
json.dump(adds,open('captions-v6-adds.json','w'))
print('cards',len(adds)); print(' | '.join(c['text'] for c in cards))
