#!/usr/bin/env python3
"""Ep3 v11 short (Henry, 1 Oct 2026: 'reduce to 1:11 or 1:00 by removing redundant scenes'). Applies frame deletions to a v11
timeline model: speech items trimmed at the head move their sourceIn, B-roll/backgrounds keep theirs, SFX collapse to the cut,
MGs shift (scoreboard tickAt recomputed), caption cards are rebuilt. Usage: cut_short.py <timeline.json> <out.json> <cap_asset> <cap_track>"""
import json,sys
import captions_lib
d=json.load(open(sys.argv[1])); OUT=sys.argv[2]; CAP=sys.argv[3]; CAPT=sys.argv[4]
# v11 frames: install+let's see (205-340), script+voice timings (534-708), "And what it came back to me is" (1337-1411),
# "So what you're seeing now is actually done from Claude as well as Higgsfield." (1740-1880), "you don't need too many process. Simplify it," (2456-2551)
DEL=[(205,340),(534,708),(1337,1411),(1740,1880),(2456,2551)]
def mp(t): return t-sum(max(0,min(t,b)-a) for a,b in DEL)
def head_cut(s):
    for a,b in DEL:
        if a<=s<b: return b-s
    return 0
SPEECH=('6046c9fc','5ea85c4e')
upd=[]; dels=[]; sfx=[]
for k in ['videoItems','audioItems','motionGraphicItems','imageItems']:
    for it in d[k]:
        s=it['startFrame']; e=s+it['durationFrames']; ns,ne=mp(s),mp(e); a=it['assetId']
        if a==CAP: dels.append(dict(id=it['id'])); continue
        if it['type']=='audio' and not a.startswith(SPEECH):
            if ne<=ns and head_cut(s)==0: pass
            sfx.append((it,mp(s))); continue
        if ne<=ns: dels.append(dict(id=it['id'])); continue
        u=dict(id=it['id'],trackId=it['trackId'],startFrame=ns,durationFrames=ne-ns)
        if a.startswith(SPEECH):
            hc=head_cut(s)
            if hc: u['sourceIn']=it['sourceIn']+int(round(hc/30*1e6))
        if it['type']=='motion-graphic':
            po=dict(it.get('propertyOverrides') or {})
            if 'tickAt' in po and po['tickAt']<9000: po['tickAt']=mp(s+po['tickAt'])-ns
            if po: u['propertyOverrides']=po
            if it.get('attributeOverrides'): u['attributeOverrides']=it['attributeOverrides']
        if (ns,ne-ns)!=(s,e-s) or 'sourceIn' in u: upd.append(u)
# SFX: collapse into the cut, drop ones that now overlap an earlier SFX on the same track
used={}
for it,ns in sorted(sfx,key=lambda x:(x[1],x[0]['startFrame'])):
    t=it['trackId']; n=it['durationFrames']
    if any(ns<e2 and ns+n>s2 for s2,e2 in used.get(t,[])) or any(a<=it['startFrame']<b for a,b in DEL) and it['assetId'].startswith('3705ddfc'):
        dels.append(dict(id=it['id'])); continue
    used.setdefault(t,[]).append((ns,ns+n))
    if ns!=it['startFrame']: upd.append(dict(id=it['id'],trackId=t,startFrame=ns,durationFrames=n))
# rebuild captions on the shortened voice track
model=[]
gone={x['id'] for x in dels}
for a in d['audioItems']:
    if a['id'] in gone: continue
    m=dict(a); u=next((x for x in upd if x['id']==a['id']),None)
    if u: m.update({k:v for k,v in u.items() if k in('startFrame','durationFrames','sourceIn')})
    model.append(m)
cards=captions_lib.build(model,CAP,CAPT)
json.dump(dict(updates=upd,deletes=dels,adds=cards),open(OUT,'w'))
print(len(upd),'updates',len(dels),'deletes',len(cards),'captions; length',mp(max(i['startFrame']+i['durationFrames'] for i in d['videoItems'])),'f')
print('runA',mp(862)/30,(mp(862)+123)/30,' runB',mp(1632)/30,(mp(1632)+108)/30)
