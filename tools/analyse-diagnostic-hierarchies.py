import json, glob, statistics as st, sys
S=sys.argv[1]  # dossier des fichiers diag-<graine>.json produits par tools/diagnostic-hierarchies.mts
graines=[]
for f in sorted(glob.glob(f'{S}/diag-[0-9]*.json')): graines+=json.load(open(f))
print(f"{len(graines)} graines")
moy=lambda v: sum(v)/len(v) if v else float('nan')
MIN,ET=5,14
# A. Savoir et frontière au fil du temps
print("\n## A. Savoir et frontière (moyenne des écuries et des graines)")
print("| Saison | Réformes (graines) | Savoir fondamental | Savoir du règlement | Frontière | Part du plafond | Efficacité | Écart frontière (1re–11e) |")
print("| --- | --- | --- | --- | --- | --- | --- | --- |")
n=len(graines[0]['saisons'])
for i in range(0,n):
    sa=[g['saisons'][i] for g in graines]
    E=[e for s in sa for e in s['ecuries']]
    ecart=moy([max(e['frontiere'] for e in s['ecuries'])-min(e['frontiere'] for e in s['ecuries']) for s in sa])
    if i%3==0 or i==n-1 or sum(s['reforme'] for s in sa)>=3:
        print(f"| {sa[0]['annee']} | {sum(s['reforme'] for s in sa)} | {moy([e['fondamental'] for e in E]):.1f} | {moy([e['propre'] for e in E]):.1f} | {moy([e['frontiere'] for e in E]):.2f} | {100*moy([(e['frontiere']-MIN)/ET for e in E]):.0f} % | {moy([e['efficacite'] for e in E]):.2f} | {ecart:.2f} |")
# Effet d'une réforme sur la frontière : variation l'année de la réforme vs année normale
dR,dN=[],[]
for g in graines:
    for i in range(1,n):
        a,b=g['saisons'][i-1],g['saisons'][i]
        d=moy([e['frontiere'] for e in b['ecuries']])-moy([e['frontiere'] for e in a['ecuries']])
        (dR if b['reforme'] else dN).append(d)
print(f"\nVariation de la frontière moyenne : année de grande réforme {moy(dR):+.2f} ({len(dR)} cas) ; année normale {moy(dN):+.2f}")
# B. Écart par étage (place au championnat de la saison écoulée)
print("\n## B. Écart par étage (saisons 5 à 30 ; étage selon la place au championnat)")
et={'1–4':range(1,5),'5–8':range(5,9),'9–11':range(9,12)}
print("| Étage | Indice voiture | Niveau des pilotes | Productivité | Développement payé (M€) | Frontière | Pièces en recul / montées |")
print("| --- | --- | --- | --- | --- | --- | --- |")
for k,r in et.items():
    E=[e for g in graines for s in g['saisons'][4:] for e in s['ecuries'] if e['place'] in r]
    print(f"| {k} | {moy([e['indice'] for e in E]):.2f} | {moy([e['pilotes'] for e in E]):.2f} | {moy([e['productivite'] for e in E]):.2f} | {moy([e['developpement'] for e in E]):.1f} | {moy([e['frontiere'] for e in E]):.2f} | {sum(e['piecesEnRecul'] for e in E)}/{sum(e['piecesMontees'] for e in E)} ({100*sum(e['piecesEnRecul'] for e in E)/max(1,sum(e['piecesMontees'] for e in E)):.0f} %) |")
# Corrélation de rang avec la place
def rang(v): o=sorted(range(len(v)),key=lambda i:-v[i]); r=[0]*len(v); [r.__setitem__(i,j+1) for j,i in enumerate(o)]; return r
def spear(a,b):
    n=len(a); return 1-6*sum((x-y)**2 for x,y in zip(a,b))/(n*(n*n-1))
for cle in ['indice','pilotes','productivite','developpement','frontiere']:
    v=[spear(rang([e[cle] for e in s['ecuries']]),[e['place'] for e in s['ecuries']]) for g in graines for s in g['saisons'][4:]]
    print(f"Corrélation de rang avec la place au championnat — {cle} : {moy(v):.2f}")
# C. Rotation du bas de grille
print("\n## C. Rotation du bas de grille (places 9 à 11), 30 saisons")
dist,dernier,plus_longue,part_max=[],[],[],[]
for g in graines:
    ids=[e['id'] for e in g['saisons'][0]['ecuries']]
    bas={i:[1 if next(e for e in s['ecuries'] if e['id']==i)['place']>=9 else 0 for s in g['saisons'][1:]] for i in ids}
    dist.append(sum(1 for i in ids if any(bas[i])))
    dernier.append(len({next(e['id'] for e in s['ecuries'] if e['place']==11) for s in g['saisons'][1:]}))
    def serie(v):
        b=c=0
        for x in v: c=c+1 if x else 0; b=max(b,c)
        return b
    plus_longue.append(max(serie(v) for v in bas.values()))
    part_max.append(max(sum(v)/len(v) for v in bas.values()))
print(f"Écuries différentes passées par les 3 dernières places : {moy(dist):.1f} sur 11")
print(f"Écuries différentes dernières au moins une fois : {moy(dernier):.1f}")
print(f"Plus longue série d'une même écurie dans les 3 dernières places : {moy(plus_longue):.1f} saisons (max {max(plus_longue)})")
print(f"Écurie la plus souvent dans les 3 dernières : {100*moy(part_max):.0f} % des saisons")
# Par écurie (toutes graines) : part des saisons dans le bas
print("\n| Écurie | Part des saisons dans les 3 dernières | Part des saisons dans les 4 premières |")
print("| --- | --- | --- |")
ids=[e['id'] for e in graines[0]['saisons'][0]['ecuries']]
for i in sorted(ids):
    P=[next(e for e in s['ecuries'] if e['id']==i)['place'] for g in graines for s in g['saisons'][1:]]
    print(f"| {i.replace('eq_','')} | {100*sum(p>=9 for p in P)/len(P):.0f} % | {100*sum(1<=p<=4 for p in P)/len(P):.0f} % |")
