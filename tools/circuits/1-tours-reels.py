# Outils de collecte des données de circuits (phase 11b). Prototype : à lancer depuis un dossier de travail ; voir docs/rapports/phase-11b/releve-circuits-v1.md.
# Pour chaque circuit : dernière course disputée (OpenF1), meilleur tour (course, sinon qualifications), positions + télémétrie, arrêts aux stands.
import json, sys, time, urllib.request, urllib.error, datetime, statistics, os
B='https://api.openf1.org/v1/'
def get(q):
    for e in range(5):
        try: return json.load(urllib.request.urlopen(B+q,timeout=90))
        except urllib.error.HTTPError as x:
            if x.code==404: return None
            time.sleep(5*(e+1))
        except Exception: time.sleep(5*(e+1))
    return None
cfg=json.load(open('config.json')); maint='2026-11-24'
meet=[m for y in (2023,2024,2025,2026) for m in json.load(open(f'meetings{y}.json'))]
f=lambda x:x.isoformat().replace('+00:00','')
for cid,(court,_) in cfg.items():
    if os.path.exists(f'tours/{cid}.json'): continue
    cand=sorted([m for m in meet if m['circuit_short_name']==court and m['date_start'][:10]<maint and 'Testing' not in m.get('meeting_name','') and not (court=='Sakhir' and m['year']==2026)],key=lambda m:m['date_start'],reverse=True)
    ok=False
    for m in cand[:3]:
        ses=get(f"sessions?meeting_key={m['meeting_key']}") or []
        for nomses in ('Race','Qualifying'):
            s=[x for x in ses if x['session_name']==nomses]
            if not s or s[0]['date_start'][:10]>=maint: continue
            sk=s[0]['session_key']; laps=[l for l in (get(f'laps?session_key={sk}') or []) if l.get('lap_duration') and not l.get('is_pit_out_lap')]
            for best in sorted(laps,key=lambda l:l['lap_duration'])[:3]:
                t0=datetime.datetime.fromisoformat(best['date_start'].replace('Z','+00:00')); t1=t0+datetime.timedelta(seconds=best['lap_duration'])
                loc=get(f"location?session_key={sk}&driver_number={best['driver_number']}&date>={f(t0)}&date<={f(t1)}")
                car=get(f"car_data?session_key={sk}&driver_number={best['driver_number']}&date>={f(t0)}&date<={f(t1)}")
                if loc and car and len(loc)>100:
                    pit=get(f"pit?session_key={s[0]['session_key'] if nomses=='Race' else [x for x in ses if x['session_name']=='Race'][0]['session_key']}") or []
                    ln=[x['lane_duration'] for x in pit if x.get('lane_duration') and 12<x['lane_duration']<45 and (x.get('stop_duration') or 0)<6]
                    json.dump(dict(circuit=cid,annee=m['year'],session=nomses,duree=best['lap_duration'],location=loc,car=car,
                                   voie_stands_mediane=round(statistics.median(ln),1) if ln else None,arrets=len(ln)),open(f'tours/{cid}.json','w'))
                    print(cid,m['year'],nomses,best['lap_duration'],len(loc),'stands',round(statistics.median(ln),1) if ln else None,flush=True); ok=True; break
                time.sleep(1)
            if ok: break
        if ok: break
    if not ok: print(cid,'ÉCHEC',flush=True)
    time.sleep(1)
