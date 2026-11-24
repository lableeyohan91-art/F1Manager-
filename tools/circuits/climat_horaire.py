"""Phase 11b — climat à l'heure réelle de la course, pour le mois du Grand Prix, sur 20 ans (archives ERA5 via Open-Meteo, CC BY 4.0).
Petites requêtes (un mois par an) pour respecter le quota gratuit. Écrit le champ climat.horaire de chaque trace.
Usage : python3 climat_horaire.py <trace> ...
"""
import json, statistics, sys, time, urllib.request, calendar
COORD = {'cir_monza': (45.6156, 9.28111, 'Europe/Rome'), 'cir_monaco': (43.7347, 7.42056, 'Europe/Monaco'), 'cir_suzuka': (34.8431, 136.541, 'Asia/Tokyo'),
         'cir_singapour': (1.2914, 103.864, 'Asia/Singapore'), 'cir_mexico': (19.4042, -99.0907, 'America/Mexico_City')}
for trace in sys.argv[1:]:
    d = json.load(open(trace)); c = d['circuit']; lat, lon, tz = COORD[c]
    mois, heure = d['climat']['moisGP2026'], d['climat']['heureCourse']
    temps, pluie, forte, hum, vent = [], [], [], [], []
    for an in range(2005, 2025):
        fin = calendar.monthrange(an, mois)[1]
        u = (f'https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&start_date={an}-{mois:02d}-01&end_date={an}-{mois:02d}-{fin}'
             f'&hourly=temperature_2m,precipitation,relative_humidity_2m,wind_speed_10m&timezone={tz}')
        for e in range(6):
            try:
                h = json.load(urllib.request.urlopen(u, timeout=60))['hourly']; break
            except Exception as x:
                print('attente', x, flush=True); time.sleep(20 * (e + 1))
        for i, t in enumerate(h['time']):
            if int(t[11:13]) != heure or h['temperature_2m'][i] is None:
                continue
            temps.append(h['temperature_2m'][i]); hum.append(h['relative_humidity_2m'][i]); vent.append(h['wind_speed_10m'][i])
            p = sum(v or 0 for v in h['precipitation'][i:i + 2]); pluie.append(p >= 0.5); forte.append(p >= 5)
        time.sleep(1)
    d['climat']['horaire'] = dict(source='Open-Meteo, réanalyse ERA5 (CC BY 4.0)', annees='2005–2024', jours=len(temps), statut='R (réanalyse météo, maille d’environ 25 km)',
                                  airMoyC=round(statistics.mean(temps), 1), airEcartC=round(statistics.pstdev(temps), 1), airP10C=round(sorted(temps)[len(temps) // 10], 1),
                                  airP90C=round(sorted(temps)[9 * len(temps) // 10], 1), pluieCourse=round(sum(pluie) / len(pluie), 3), fortePluieCourse=round(sum(forte) / len(forte), 3),
                                  humidite=round(statistics.mean(hum)), ventKmh=round(statistics.mean(vent), 1))
    json.dump(d, open(trace, 'w'), ensure_ascii=False, separators=(',', ':'))
    print(c, d['climat']['horaire'], flush=True)
