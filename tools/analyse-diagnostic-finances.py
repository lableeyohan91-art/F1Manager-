"""Chantier 2 — synthèse du diagnostic financier (tools/diagnostic-finances.mts). Usage : python3 tools/analyse-diagnostic-finances.py <dossier> [préfixe=fin-]"""
import json, glob, sys
S=sys.argv[1]; P=sys.argv[2] if len(sys.argv)>2 else 'fin-'
G=[]
for f in sorted(glob.glob(f'{S}/{P}[0-9]*.json')): G+=json.load(open(f))
moy=lambda v: sum(v)/len(v) if v else float('nan')
print(f"{len(G)} graines")
ids=sorted(e['id'] for e in G[0]['ecuries'])
REC=['primes','commercial','sponsors','apport','apportsExceptionnels','transfertsRecus']
DEP=['personnelPlafonne','departements','operations','entretien','developpement','salairesHorsPlafond','marketing','dividendes','investissements','interets','academie','indemnites','amendes']
def tab(titre, ann):
    print(f"\n## {titre}")
    print("| Écurie | Place moy. | " + " | ".join(REC) + " | " + " | ".join(DEP) + " | Trésorerie fin |")
    print("| --- |" + " --- |"*(len(REC)+len(DEP)+2))
    for i in ids:
        H=[h for g in G for e in g['ecuries'] if e['id']==i for h in e['historique'] if ann(h['annee'])]
        pl=[p for g in G for e in g['ecuries'] if e['id']==i for k,p in enumerate(e['places']) if ann(2027+k) and p>0]
        print(f"| {i.replace('eq_','')} | {moy(pl):.1f} | " + " | ".join(f"{moy([h.get(k,0) or 0 for h in H]):.0f}" for k in REC) + " | " + " | ".join(f"{moy([h.get(k,0) or 0 for h in H]):.0f}" for k in DEP) + f" | {moy([h['tresorerieFin'] for h in H]):.0f} |")
tab("Saisons 2027–2036 (M€ par an, moyenne)", lambda a: a<=2036)
tab("Saisons 2047–2056 (M€ par an, moyenne)", lambda a: a>=2047)
print("\n## Propriétaires au départ (graine 1) et changements de propriétaire (rachats) sur 30 saisons")
for i in ids:
    d=[e['proprietaireDepart'] for g in G for e in g['ecuries'] if e['id']==i][0]
    ch=sum(1 for g in G for e in g['ecuries'] if e['id']==i and e['proprietaireFin'] and e['proprietaireFin'].get('depuis'))
    print(f"| {i.replace('eq_','')} | {d['type']} | apport de base {d['apportBase']} | patience {d['patience']} | ambition {d['ambition']} | rachats : {ch}/{len(G)} graines |")
