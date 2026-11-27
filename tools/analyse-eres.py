"""Resserrement au cours d'une ère (sortie de tools/diagnostic-hierarchies.mts).
Pour chaque ère (entre deux grandes réformes) : écart d'indice entre la meilleure et la pire voiture, et entre la 1re et la 4e, la
première et la dernière saison de l'ère ; part du plafond atteinte. Usage : python3 tools/analyse-eres.py fichier.json"""
import json, sys, statistics as st
G = json.load(open(sys.argv[1]))
PCT = 0.28  # 1 point d'indice ≈ 0,28 % du temps au tour
lignes = {}
for g in G:
    ss = g['saisons']
    debuts = [0] + [i for i, s in enumerate(ss) if s['reforme']]
    for k, d in enumerate(debuts):
        f = (debuts[k + 1] - 1) if k + 1 < len(debuts) else len(ss) - 1
        if f - d < 2: continue
        n = min(f - d + 1, 8)
        for j in range(n):
            ind = sorted((e['indice'] for e in ss[d + j]['ecuries']), reverse=True)
            fr = st.mean((e['frontiere'] - 5) / 14 for e in ss[d + j]['ecuries'])
            lignes.setdefault(j, []).append((ind[0] - ind[-1], ind[0] - ind[3], ind[3] - ind[-1], fr))
print('| Saison de l’ère | Ères mesurées | Écart 1re–11e (% du tour) | Écart 1re–4e | Écart 4e–11e | Part du plafond |')
print('| --- | --- | --- | --- | --- | --- |')
for j in sorted(lignes):
    v = lignes[j]
    print(f"| {j + 1} | {len(v)} | {st.mean(x[0] for x in v) * PCT:.2f} % | {st.mean(x[1] for x in v) * PCT:.2f} % | {st.mean(x[2] for x in v) * PCT:.2f} % | {100 * st.mean(x[3] for x in v):.0f} % |")
