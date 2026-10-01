"""Ep5-style word-highlight caption cards for Ep3, built from the Adobe voice items on a timeline model."""
import json,re
W=json.load(open('/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep3_OpenMontage/04_raw-footage/henry-take-ep3.words.json'))
VOX='064a53d4-f83d-4fa2-a39c-c09e2555e03a'
FIX={'Hicksville':'Higgsfield','Hicksville.':'Higgsfield.'}
def build(audio_items,CAP,track,top=1490):
    lines=[]
    for a in sorted([a for a in audio_items if a['trackId']==VOX],key=lambda a:a['startFrame']):
        s0=a['sourceIn']/1e6; s1=s0+a['durationFrames']/30
        ws=[(a['startFrame']+max(0,round((w['s']-s0)*30)),w['w']) for w in W if s0-0.10<=w['s']<s1-0.12]
        ws=[(f,t) for f,t in ws if not (t=='took' and abs(s0-103.64)<0.01)]   # only the k release of "took" survives the cut
        if abs(s0-320.317)<0.01: ws=[(a['startFrame']+4,'I')]+ws             # whisper puts "I" before the in-point; energy says 320.44
        if not ws: continue
        if lines and lines[-1]['f']+lines[-1]['n']==a['startFrame'] and not re.search(r'[.?!]$',lines[-1]['words'][-1][1]):
            lines[-1]['words']+=ws; lines[-1]['n']+=a['durationFrames']
        else: lines.append(dict(f=a['startFrame'],n=a['durationFrames'],words=ws))
    cards=[]
    for ln in lines:
        ws=[(f,FIX.get(t,t)) for f,t in ln['words']]
        groups=[]; cur=[]
        for f,t in ws:
            cur.append((f,t))
            if len(cur)>=4 or (re.search(r'[.,?!]$',t) and len(cur)>=2): groups.append(cur); cur=[]
        if cur:
            if groups and len(cur)==1: groups[-1].extend(cur)
            else: groups.append(cur)
        for gi,g in enumerate(groups):
            st=g[0][0]; en=groups[gi+1][0][0] if gi+1<len(groups) else ln['f']+ln['n']+3
            en=max(en,st+8); en=min(en,st+90)
            text=' '.join(re.sub(r'[,.]$','',t) for _,t in g)
            size=58 if len(text)<=22 else 50 if len(text)<=30 else 44
            cards.append(dict(type='motion-graphic',assetId=CAP,trackId=track,startFrame=st,durationFrames=en-st,left=40,top=top,width=1000,height=220,keepAspectRatio=False,
                propertyOverrides=dict(serif="Fraunces",paper="#FFFEFA",ink="#171411",accent="#DF825F",text=text,times=','.join(str(f-st) for f,_ in g),size=size)))
    cards.sort(key=lambda c:c['startFrame'])
    for i in range(1,len(cards)):
        p=cards[i-1]
        if p['startFrame']+p['durationFrames']>cards[i]['startFrame']: p['durationFrames']=cards[i]['startFrame']-p['startFrame']
    return cards
