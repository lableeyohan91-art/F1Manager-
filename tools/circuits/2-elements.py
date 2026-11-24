# Découpe un tour réel (positions + télémétrie OpenF1) en éléments : lignes droites et virages, avec rayon, angle, vitesse minimale.
import json, math, sys, datetime
OFF=json.load(open('../wiki/officiel.json'))
OFFICIEL={k:(round(float(v['longueur_km'])*1000),int(v['virages'])) for k,v in OFF.items()}
ts=lambda s: datetime.datetime.fromisoformat(s.replace('Z','+00:00')).timestamp()
def traiter(nom, pas=5.0):
    d=json.load(open(f'tours/{nom}.json')); L,nv=OFFICIEL[nom]
    loc=sorted(d['location'],key=lambda x:x['date']); car=sorted(d['car'],key=lambda x:x['date'])
    P=[(p['x']/10,p['y']/10,p['z']/10,ts(p['date'])) for p in loc]
    # rééchantillonnage tous les `pas` mètres le long de la trajectoire, mise à l'échelle sur la longueur officielle
    s=[0.0]
    for a,b in zip(P,P[1:]): s.append(s[-1]+math.dist(a[:2],b[:2]))
    k=L/s[-1]; s=[x*k for x in s]
    n=int(L//pas); pts=[]; j=0
    for i in range(n):
        si=i*pas
        while j+1<len(s)-1 and s[j+1]<si: j+=1
        f=(si-s[j])/max(1e-9,s[j+1]-s[j]); a,b=P[j],P[j+1]
        pts.append(tuple(a[q]+(b[q]-a[q])*f for q in range(4)))
    # lissage léger (les positions sont échantillonnées environ toutes les 0,27 s)
    def lisse(v,w):
        m=len(v); return [sum(v[(i+o)%m] for o in range(-w,w+1))/(2*w+1) for i in range(m)]
    X=lisse([p[0] for p in pts],3); Y=lisse([p[1] for p in pts],3); Z=lisse([p[2] for p in pts],6)
    cap=[math.atan2(Y[(i+1)%n]-Y[i],X[(i+1)%n]-X[i]) for i in range(n)]
    dcap=[(cap[(i+1)%n]-cap[i]+math.pi)%(2*math.pi)-math.pi for i in range(n)]
    dcap=lisse(dcap,4)
    kappa=[x/pas for x in dcap]  # courbure (1/m)
    # vitesse au point (télémétrie, par le temps)
    Tc=[ts(c['date']) for c in car]; Vc=[c['speed'] for c in car]
    def vit(t):
        lo=0
        while lo+1<len(Tc) and Tc[lo+1]<t: lo+=1
        return Vc[lo]
    V=[vit(p[3]) for p in pts]
    # virages : zones où |courbure| > 1/600 m, regroupées ; angle total >= 12°
    seuil=1/600; el=[]; i=0
    debut=None
    for i in range(n+1):
        dans= i<n and abs(kappa[i])>seuil and not (debut is not None and kappa[i]*kappa[debut]<0)
        if dans and debut is None: debut=i
        if not dans and debut is not None:
            fin_chgt = i<n and abs(kappa[i])>seuil
            seg=range(debut,i); ang=math.degrees(sum(dcap[q] for q in seg))
            if abs(ang)>=12:
                kmax=max(abs(kappa[q]) for q in seg)
                el.append(dict(debutM=round(debut*pas),longueurM=round((i-debut)*pas),angleDeg=round(ang),rayonMinM=round(1/kmax),
                               vMinKmh=min(V[q] for q in seg),sens='gauche' if ang>0 else 'droite'))
            debut=i if fin_chgt else None
    # éléments fusionnés : virages séparés par moins de 40 m → enchaînement
    vitesse_classe=lambda v:'lent' if v<130 else 'moyen' if v<200 else 'rapide'
    for e in el: e['classe']=vitesse_classe(e['vMinKmh'])
    deniv=round(max(Z)-min(Z),1)
    droites=[]; prev=0
    for e in el:
        if e['debutM']-prev>0: droites.append(e['debutM']-prev)
        prev=e['debutM']+e['longueurM']
    droites.append(L-prev+(el[0]['debutM'] if el else 0))
    car_=sorted(d['car'],key=lambda x:x['date']); Tq=[ts(c['date']) for c in car_]; dts=[Tq[i+1]-Tq[i] for i in range(len(Tq)-1)]+[0]; tot=sum(dts)
    plein=round(100*sum(x for x,c in zip(dts,car_) if c['throttle']>=98)/tot); frein=round(100*sum(x for x,c in zip(dts,car_) if c['brake']>0)/tot)
    return dict(nom=nom,annee=d['annee'],session=d['session'],duree=d['duree'],vmax=max(c['speed'] for c in car_),vmin=min(c['speed'] for c in car_),plein_pct=plein,frein_pct=frein,voie_stands_s=d['voie_stands_mediane'],longueurM=L,virages_officiels=nv,virages_detectes=len(el),denivele_m=deniv,plus_longue_droite_m=max(droites),
                lents=sum(e['classe']=='lent' for e in el),moyens=sum(e['classe']=='moyen' for e in el),rapides=sum(e['classe']=='rapide' for e in el),elements=el)
out={}
for nom in sys.argv[1:]:
    r=traiter(nom); out[nom]=r
    print(f"{nom:16s} {r['annee']} {r['session'][:4]} tour {r['duree']:.1f}s vmax {r['vmax']} vmin {r['vmin']} plein {r['plein_pct']}% frein {r['frein_pct']}% stands {r['voie_stands_s']}s |" , end=' ')
    print(f"{nom:0s}virages {r['virages_detectes']} (off. {r['virages_officiels']}) lents/moyens/rapides {r['lents']}/{r['moyens']}/{r['rapides']} | plus longue droite {r['plus_longue_droite_m']} m | dénivelé {r['denivele_m']} m")
json.dump(out,open('elements.json','w'),indent=1)
