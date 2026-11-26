"""Évolution de la hiérarchie sur 10, 20 et 30 saisons (sortie de tools/diagnostic-hierarchies.mts).
Usage : python3 tools/analyse-evolution.py fichier.json"""
import json, sys, statistics as st
G = json.load(open(sys.argv[1]))
moy = lambda v: sum(v)/len(v) if v else float('nan')
ids = sorted(e['id'] for e in G[0]['saisons'][0]['ecuries'])
print(f"{len(G)} graines × {len(G[0]['saisons'])} saisons\n")
print("## Place moyenne au championnat par décennie (et part des saisons dans le top 4 / les 3 dernières)\n")
print("| Écurie | Saisons 1–10 | 11–20 | 21–30 | Top 4 (1–10 / 11–20 / 21–30) | 3 dernières (1–10 / 11–20 / 21–30) |\n| --- | --- | --- | --- | --- | --- |")
tranches = [(1, 10), (11, 20), (21, 30)]
for i in ids:
    pl = [[e['place'] for g in G for s in g['saisons'][a:b+1] for e in s['ecuries'] if e['id'] == i and e['place'] > 0] for a, b in tranches]
    print(f"| {i[3:]} | " + " | ".join(f"{moy(p):.1f}" for p in pl) + " | " + " / ".join(f"{100*moy([x <= 4 for x in p]):.0f} %" for p in pl) + " | " + " / ".join(f"{100*moy([x >= 9 for x in p]):.0f} %" for p in pl) + " |")
print("\n## Mobilité par décennie\n")
print("| Indicateur | 1–10 | 11–20 | 21–30 |\n| --- | --- | --- | --- |")
lig = {k: [] for k in ['mob', 'gros', 'champ', 'ecart', 'top4change', 'plafond']}
for a, b in tranches:
    mob, gros, champs, ecart, top4c, plaf = [], [], [], [], [], []
    for g in G:
        ss = g['saisons'][a:b+1]
        ch = set()
        for k in range(1, len(ss)):
            p0 = {e['id']: e['place'] for e in ss[k-1]['ecuries']}; p1 = {e['id']: e['place'] for e in ss[k]['ecuries']}
            if all(p0.values()) and all(p1.values()):
                d = [abs(p1[x]-p0[x]) for x in p0]; mob.append(moy(d)); gros.append(sum(x >= 3 for x in d))
                top4c.append(len({x for x in p0 if p0[x] <= 4} ^ {x for x in p1 if p1[x] <= 4}) / 2)
        for s in ss:
            w = [e['id'] for e in s['ecuries'] if e['place'] == 1]; ch.update(w)
            ind = [e['indice'] for e in s['ecuries']]; ecart.append((max(ind) - min(ind)) * 0.28)
            plaf.append(moy([(e['frontiere'] - 5) / 14 for e in s['ecuries']]))
        champs.append(len(ch))
    for k, v in zip(lig, [mob, gros, champs, ecart, top4c, plaf]): lig[k].append(moy(v))
lab = {'mob': 'Places changées par écurie et par saison (moyenne)', 'gros': 'Écuries gagnant ou perdant 3 places ou plus, par saison', 'champ': 'Champions constructeurs différents sur la décennie',
       'ecart': 'Écart 1re–11e voiture (% du temps au tour)', 'top4change': 'Écuries entrant dans le top 4 par saison', 'plafond': 'Part du plafond technique atteinte (frontière moyenne)'}
for k, v in lig.items():
    print(f"| {lab[k]} | " + " | ".join(f"{x:.2f}" if k in ('mob', 'ecart', 'top4change') else (f"{100*x:.0f} %" if k == 'plafond' else f"{x:.1f}") for x in v) + " |")
