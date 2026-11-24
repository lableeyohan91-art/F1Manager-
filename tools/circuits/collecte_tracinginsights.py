"""Phase 11b — collecte des tours réels d'un circuit qui n'a plus couru depuis 2023 (absent d'OpenF1), depuis les archives publiques
de télémétrie de TracingInsights (dépôts GitHub TracingInsights/<année>, issues du chronométrage officiel).

Écrit le même fichier de cache que collecte_tours.py (OpenF1), pour que construire_trace.py serve à l'identique.
Les données brutes restent dans le cache, jamais dans le dépôt (D-159, décision 6).
Usage : python3 collecte_tracinginsights.py <cache> <id_circuit> <année> "<nom du Grand Prix>" [N]
Exemple : python3 collecte_tracinginsights.py /tmp/cache cir_portimao 2021 "Portuguese Grand Prix" 5
"""
import json, os, sys, urllib.parse, urllib.request, datetime, time

BASE = 'https://raw.githubusercontent.com/TracingInsights/{annee}/main/{chemin}'


def lire(annee, chemin):
    url = BASE.format(annee=annee, chemin=urllib.parse.quote(chemin))
    for essai in range(4):
        try:
            with urllib.request.urlopen(url, timeout=60) as r:
                return json.load(r)
        except Exception as e:  # réseau : nouvel essai après une pause croissante
            if essai == 3:
                raise
            time.sleep(2 * (essai + 1))


def iso(t0, s):
    return (t0 + datetime.timedelta(seconds=s)).isoformat().replace('+00:00', 'Z')


def collecter(cache, cid, annee, gp, n=5, session='Qualifying'):
    os.makedirs(cache, exist_ok=True)
    lt = lire(annee, f'{gp}/{session}/session_laptimes.json')
    tours = []
    for i, t in enumerate(lt['time']):
        if not isinstance(t, (int, float)):
            continue
        if lt.get('del') and lt['del'][i] in (True, 'True'):
            continue  # tour annulé (limites de piste)
        tours.append((t, lt['drv'][i], int(lt['lap'][i])))
    tours.sort()
    retenus, vus = [], set()
    for t, drv, lap in tours:
        if drv in vus:
            continue
        vus.add(drv)
        retenus.append((t, drv, lap))
        if len(retenus) == n:
            break
    t0 = datetime.datetime(annee, 1, 1, tzinfo=datetime.timezone.utc)
    sortie = []
    for duree, drv, lap in retenus:
        tel = lire(annee, f'{gp}/{session}/{drv}/{lap}_tel.json')['tel']
        loc = [dict(date=iso(t0, tel['time'][k]), x=tel['x'][k], y=tel['y'][k], z=tel['z'][k]) for k in range(len(tel['time']))]
        car = [dict(date=iso(t0, tel['time'][k]), speed=tel['speed'][k], throttle=tel['throttle'][k], brake=1 if tel['brake'][k] else 0) for k in range(len(tel['time']))]
        sortie.append(dict(pilote=drv, tour=lap, duree=duree, location=loc, car=car))
        print(cid, drv, lap, duree, len(loc), 'points')
    d = dict(meeting=f'TracingInsights {annee} {gp}', session=session, tours=sortie, arrets=[])
    json.dump(d, open(os.path.join(cache, f'{cid}.json'), 'w'))
    return d


if __name__ == '__main__':
    collecter(sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4], int(sys.argv[5]) if len(sys.argv) > 5 else 5)
