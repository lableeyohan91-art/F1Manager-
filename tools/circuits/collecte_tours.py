"""Phase 11b — collecte reproductible de tours réels (OpenF1, données publiques de chronométrage).

Pour un circuit : les N meilleurs tours de N pilotes différents (course, ou qualifications si la course n'a pas de positions),
positions GPS et télémétrie. Les données brutes restent dans le dossier de cache (jamais dans le dépôt : décision 6 de D-159).
Usage : python3 collecte_tours.py <dossier_cache> <id_circuit> <meeting_key> [Race|Qualifying] [N]
"""
import json, os, sys, time, datetime, urllib.request, urllib.error

B = 'https://api.openf1.org/v1/'

def get(q):
    for essai in range(6):
        try:
            with urllib.request.urlopen(B + q, timeout=90) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            time.sleep(5 * (essai + 1))
        except Exception:
            time.sleep(5 * (essai + 1))
    return None

def iso(x):
    return x.isoformat().replace('+00:00', '')

def collecter(cache, cid, meeting, session_nom='Race', n=5):
    os.makedirs(cache, exist_ok=True)
    chemin = os.path.join(cache, f'{cid}.json')
    if os.path.exists(chemin):
        return json.load(open(chemin))
    ses = [s for s in (get(f'sessions?meeting_key={meeting}') or []) if s['session_name'] == session_nom]
    sk = ses[0]['session_key']
    tours = [l for l in (get(f'laps?session_key={sk}') or []) if l.get('lap_duration') and not l.get('is_pit_out_lap')]
    tours.sort(key=lambda l: l['lap_duration'])
    retenus, pilotes = [], set()
    for l in tours:
        if l['driver_number'] in pilotes:
            continue
        t0 = datetime.datetime.fromisoformat(l['date_start'].replace('Z', '+00:00'))
        t1 = t0 + datetime.timedelta(seconds=l['lap_duration'])
        q = f"session_key={sk}&driver_number={l['driver_number']}&date>={iso(t0)}&date<={iso(t1)}"
        loc, car = get('location?' + q), get('car_data?' + q)
        if loc and car and len(loc) > 100:
            retenus.append(dict(pilote=l['driver_number'], tour=l['lap_number'], duree=l['lap_duration'], location=loc, car=car))
            pilotes.add(l['driver_number'])
        if len(retenus) >= n:
            break
        time.sleep(0.5)
    course = [s for s in (get(f'sessions?meeting_key={meeting}') or []) if s['session_name'] == 'Race']
    arrets = get(f"pit?session_key={course[0]['session_key']}") or [] if course else []
    d = dict(circuit=cid, meeting=meeting, session=session_nom, tours=retenus, arrets=arrets)
    json.dump(d, open(chemin, 'w'))
    return d

if __name__ == '__main__':
    cache, cid, mk = sys.argv[1], sys.argv[2], int(sys.argv[3])
    ses = sys.argv[4] if len(sys.argv) > 4 else 'Race'
    n = int(sys.argv[5]) if len(sys.argv) > 5 else 5
    d = collecter(cache, cid, mk, ses, n)
    print(cid, ses, [(t['pilote'], t['duree']) for t in d['tours']])
