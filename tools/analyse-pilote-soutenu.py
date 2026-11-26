"""Levier B (prototype) — synthèse de tools/mesure-pilote-soutenu.mts. Usage : python3 tools/analyse-pilote-soutenu.py <dossier>"""
import json, glob, sys
S=sys.argv[1]; P=sys.argv[2] if len(sys.argv)>2 else 'ps-'; R=[]
for f in sorted(glob.glob(f'{S}/{P}[0-9]*.json')): R+=json.load(open(f))
moy=lambda v: sum(v)/len(v) if v else float('nan')
acc=[a for r in R for a in r['avec']['accepte']]; ref=sum(r['avec']['refus'] for r in R)
print(f"{len(R)} graines × 30 saisons : {len(acc)} offres acceptées, {ref} refusées ({(len(acc)+ref)/len(R):.1f} offres par partie)")
print("Par écurie :", {e: sum(1 for a in acc if a['ecurie']==e) for e in sorted({a['ecurie'] for a in acc})})
print(f"Chèque moyen {moy([a['cheque'] for a in acc]):.1f} M€ ; sponsor moyen {moy([a['sponsor'] for a in acc]):.1f} M€/an ; écart de niveau moyen du pilote {moy([a['ecart'] for a in acc]):.1f} point")
print("\n| Saison après l'offre | Place sans l'offre | Place avec l'offre | Gain moyen (places) | Écuries qui gagnent / perdent | Développement payé sans → avec (M€) |")
print("| --- | --- | --- | --- | --- | --- |")
for k in range(1,6):
    sa,av,g,p,ds,da=[],[],0,0,[],[]
    for r in R:
        for a in r['avec']['accepte']:
            y=str(a['annee']+k); e=a['ecurie']
            if y in r['sans']['places'].get(e,{}) and y in r['avec']['places'].get(e,{}):
                x,z=r['sans']['places'][e][y], r['avec']['places'][e][y]; sa.append(x); av.append(z); g+=z<x; p+=z>x
                if y in r['sans']['dev'].get(e,{}) and y in r['avec']['dev'].get(e,{}): ds.append(r['sans']['dev'][e][y]); da.append(r['avec']['dev'][e][y])
    print(f"| +{k} | {moy(sa):.2f} | {moy(av):.2f} | {moy(sa)-moy(av):+.2f} | {g} / {p} | {moy(ds):.0f} → {moy(da):.0f} |")
