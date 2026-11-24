# Vérification croisée : SC, VSC et drapeaux rouges des courses 2023–2026 d'après les messages officiels de la direction de course (OpenF1).
import json, time, urllib.request, urllib.error, csv, collections
B='https://api.openf1.org/v1/'
def get(q):
    for e in range(5):
        try: return json.load(urllib.request.urlopen(B+q,timeout=90))
        except urllib.error.HTTPError as x:
            if x.code==404: return []
            time.sleep(5*(e+1))
        except Exception: time.sleep(5*(e+1))
    return []
cfg=json.load(open('config.json')); maint='2026-11-24'
meet=[m for y in (2023,2024,2025,2026) for m in json.load(open(f'meetings{y}.json'))]
court2cid={v[0]:k for k,v in cfg.items()}
res={}
for m in sorted(meet,key=lambda m:m['date_start']):
    cid=court2cid.get(m['circuit_short_name'])
    if not cid or 'Testing' in m.get('meeting_name','') or m['date_start'][:10]>=maint: continue
    ses=[s for s in get(f"sessions?meeting_key={m['meeting_key']}") if s['session_name']=='Race']
    if not ses: continue
    msgs=get(f"race_control?session_key={ses[0]['session_key']}")
    if not msgs: continue
    txt=[(x.get('message') or '').upper() for x in msgs]
    sc=sum(1 for t in txt if 'SAFETY CAR DEPLOYED' in t and 'VIRTUAL' not in t)
    vsc=sum(1 for t in txt if 'VIRTUAL SAFETY CAR DEPLOYED' in t or t.startswith('VSC DEPLOYED'))
    dr=sum(1 for x in msgs if x.get('flag')=='RED' or (x.get('message') or '').upper().startswith('RED FLAG'))
    res[f"{m['year']} {cid}"]=dict(sc=sc,vsc=vsc,dr=dr,nom=m.get('meeting_name'))
    print(m['year'],cid,sc,vsc,dr,flush=True); time.sleep(0.5)
json.dump(res,open('rc.json','w'),indent=1)
