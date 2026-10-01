#!/usr/bin/env python3
"""Open N frames at frame F on a timeline model: items starting at/after F shift by N; items spanning F grow by N;
items listed in --extend (ending exactly at F) grow by N. Usage: insert_frames.py <timeline.json> <out.json> F N id[,id...]"""
import json,sys
d=json.load(open(sys.argv[1])); OUT=sys.argv[2]; F=int(sys.argv[3]); N=int(sys.argv[4]); EXT=set(sys.argv[5].split(','))
upd=[]
for k in ['videoItems','audioItems','motionGraphicItems','imageItems']:
    for it in d[k]:
        s=it['startFrame']; e=s+it['durationFrames']; u=None
        if s>=F: u=dict(id=it['id'],trackId=it['trackId'],startFrame=s+N,durationFrames=it['durationFrames'])
        elif e>F or any(it['id'].startswith(x) for x in EXT): u=dict(id=it['id'],trackId=it['trackId'],durationFrames=it['durationFrames']+N)
        if u is None: continue
        if it['type']=='motion-graphic':
            po=dict(it.get('propertyOverrides') or {})
            if 'tickAt' in po and po['tickAt']<9000 and s<F: po['tickAt']+=N
            if po: u['propertyOverrides']=po
            if it.get('attributeOverrides'): u['attributeOverrides']=it['attributeOverrides']
        upd.append(u)
json.dump(dict(updates=upd),open(OUT,'w'))
print(len(upd),'updates')
