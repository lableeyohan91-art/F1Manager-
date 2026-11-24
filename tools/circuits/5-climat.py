# Climat mois par mois à l'heure de la course, sur 20 ans (archives ERA5 via Open-Meteo, CC BY 4.0). Une requête par circuit.
import json, urllib.request, time, statistics, sys
C={'monza':(45.6156,9.28111,15,'Europe/Rome'),'monaco':(43.7347,7.42056,15,'Europe/Monaco'),'suzuka':(34.8431,136.541,14,'Asia/Tokyo'),
   'singapour':(1.2914,103.864,20,'Asia/Singapore'),'mexico':(19.4042,-99.0907,14,'America/Mexico_City')}
res={}
for nom in sys.argv[1:]:
    lat,lon,h,tz=C[nom]
    u=(f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&start_date=2005-01-01&end_date=2024-12-31"
       f"&hourly=temperature_2m,precipitation,relative_humidity_2m,wind_speed_10m&timezone={tz}")
    for essai in range(8):
        try: d=json.load(urllib.request.urlopen(u,timeout=180)); break
        except Exception as e: print('attente',e,flush=True); time.sleep(30*(essai+1))
    H=d['hourly']; par={m:dict(t=[],p=[],hu=[],v=[]) for m in range(1,13)}
    for i,t in enumerate(H['time']):
        if int(t[11:13])!=h or H['temperature_2m'][i] is None: continue
        m=int(t[5:7]); x=par[m]
        x['t'].append(H['temperature_2m'][i]); x['hu'].append(H['relative_humidity_2m'][i]); x['v'].append(H['wind_speed_10m'][i])
        x['p'].append(sum(v or 0 for v in H['precipitation'][i:i+2]))
    res[nom]={'heure_locale':h,'annees':'2005-2024','mois':{m:dict(air_moy=round(statistics.mean(x['t']),1),air_ecart=round(statistics.pstdev(x['t']),1),
        pluie_2h=round(sum(p>=0.5 for p in x['p'])/len(x['p']),3),forte_pluie_2h=round(sum(p>=5 for p in x['p'])/len(x['p']),3),
        humidite=round(statistics.mean(x['hu'])),vent_kmh=round(statistics.mean(x['v']),1)) for m,x in par.items()}}
    print(nom,'ok',flush=True); time.sleep(15)
json.dump(res,open('meteo/climat-5.json','w'),indent=1)
