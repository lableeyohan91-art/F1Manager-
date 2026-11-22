# Campagne d'équilibrage D-074 — poids du pilote × aléa

**Date :** 22/11/2026 · **Conditions :** 21 réglages (20 combinaisons + réglage B), graines 1 à 100 × 10 saisons, toutes les mécaniques de la phase 4 actives, mêmes graines pour tous ; puis revalidation de 4 réglages sur les graines 101 à 200.
**Tableaux complets** (tous les indicateurs, moyennes, médianes, percentiles) : [graines 1–100](archives/campagne-p4/tableaux-graines-1-100.md) · [graines 101–200](archives/campagne-p4/tableaux-graines-101-200.md) · mesures brutes archivées (`archives/campagne-p4/*.tar.gz`). Reproductible : `npm run campagne`.

> Méthode D-076 : tous les indicateurs sont présentés, favorables ou non. Rien n'est appliqué : le réglage B reste en place jusqu'à votre décision.

## 1. Ce que la campagne apprend (avant de choisir)

1. **Le poids du pilote et l'aléa tirent en sens contraire sur deux de vos objectifs.** Plus le pilote compte, plus les écarts se creusent en bas de classement : la dernière écurie marque moins souvent, et les dominations augmentent. Plus l'aléa est fort, plus les petites équipes marquent, mais moins les compétences départagent les coéquipiers. **Aucun réglage n'atteint à la fois « compétences ≥ 40 % entre coéquipiers » et « dernière écurie qui marque ≥ 40 % ».**
2. **Ce que ces deux réglages ne changent PAS** :
   - champions constructeurs différents sur 10 ans : 2,3 à 2,5 quel que soit le réglage ;
   - dynasties : 57 à 67 % ;
   - stabilité de la hiérarchie : 0,91 à 0,92 ;
   - répartition des points (Gini 0,60 à 0,64, la 1re écurie prend 30 à 33 % des points).

   **La hiérarchie des écuries ne dépend pas du modèle de course.** Elle vient du développement des voitures, des budgets figés et de l'absence de marché et de règlement. C'est la confirmation chiffrée que les dynasties se traiteront dans les phases 5 à 8, pas par l'aléa.
3. **Le réglage B (0,20 / 0,22) est l'un des moins bons compromis** : 6 objectifs sur 10. Dominations à 17 %, dernière écurie qui marque à 11 %, titres ouverts à la dernière manche à 28 %.
4. **La forme ne compte pour rien** (0 % de l'écart entre coéquipiers dans tous les réglages). La confiance en soi bouge trop peu pour peser face à l'aléa. C'est un défaut à corriger, indépendamment de ce choix.
5. **Revalidation** sur 100 nouvelles graines : écarts de 0 à 3 points sur tous les indicateurs. Les conclusions ne sont pas un artefact des graines 1 à 100.

## 2. Les trois meilleurs compromis

Repérés sur 10 objectifs (voir § 4 des tableaux) ; chacun représente une philosophie différente. Chiffres des graines 1–100 (revalidation 101–200 entre parenthèses quand elle diffère sensiblement).

| Indicateur | **C1 — 0,175 / 0,35** « variété » | **C2 — 0,150 / 0,30** « équilibre » | **C3 — 0,200 / 0,30** « compétences » | B actuel 0,200 / 0,22 |
| --- | --- | --- | --- | --- |
| Vainqueurs différents / saison | 6,2 | 5,9 | 5,7 | 5,0 |
| Écuries victorieuses / saison | 3,9 | 3,7 | 3,7 | 3,4 |
| Champions pilotes / 10 ans | 3,9 (3,7) | 4,0 (3,7) | 3,7 (3,6) | 3,6 |
| Champions constructeurs / 10 ans | 2,4 | 2,4 | 2,5 | 2,4 |
| Victoires inattendues / saison | 2,8 | 2,1 | 2,6 | 1,9 |
| Écuries sans podium sur 10 ans | 2,8 | 3,3 | 3,9 | 5,2 |
| Écuries sans victoire sur 10 ans | 5,4 | 5,7 | 6,1 | 6,5 |
| Écart P1–P2 (moyenne ; médiane) | 50 ; 38 | 49 ; 38 | 57 ; 42 | 65 ; 48 |
| Dominations ≥ 120 pts | 8 % (10 %) | 8 % (10 %) | 12 % (14 %) | 17 % |
| Titre ouvert à la dernière manche | 35 % | 36 % | 31 % | 28 % |
| Lutte entre écuries différentes | 20 % | 18 % | 18 % | 15 % |
| Champion et dauphin coéquipiers | 42 % | 48 % | 39 % | 41 % |
| Écart entre coéquipiers (% tour) | 0,52 | 0,44 | 0,49 | 0,43 |
| Part des compétences / de l'aléa | 31 % / 70 % | 31 % / 70 % | 43 % / 57 % | 58 % / 42 % |
| Gain de places des meilleurs pilotes | 0,85 | 0,88 | 1,08 | 1,27 |
| **Dernière écurie marque** | **41 %** | 32 % | 28 % | 11 % |
| Objectifs atteints (/10) | 9 (8) | 8 (7) | 7 (7) | 6 (6) |

### C1 — 0,175 / 0,35 : « variété »
- **Avantages** : le plus d'objectifs atteints. Seul réglage où la dernière écurie marque dans plus de 40 % des saisons. Le plus de vainqueurs et d'écuries différentes, le moins d'écuries sans podium, le plus de luttes entre écuries.
- **Inconvénients** : c'est l'aléa **le plus fort** testé, à l'opposé de votre philosophie (« l'aléa ne doit pas être le moyen principal »). 70 % de l'écart entre coéquipiers vient du hasard. Coéquipiers éloignés de 0,52 % par course, ce qui semble beaucoup. Victoires inattendues à 2,8 par saison, en haut de la fourchette.

### C2 — 0,150 / 0,30 : « équilibre »
- **Avantages** : réglage central, sans valeur extrême. Dominations à 8 %, 36 % de titres ouverts à la dernière manche, champions les plus variés. Aléa moyen.
- **Inconvénients** : les compétences ne pèsent que 31 %. La dernière écurie ne marque que dans 32 % des saisons. Le champion et son dauphin sont coéquipiers dans 48 % des saisons.

### C3 — 0,200 / 0,30 : « compétences » (c'est l'ancien réglage A)
- **Avantages** : les compétences pèsent 43 % entre coéquipiers, et les meilleurs pilotes gagnent plus d'une place sur leur voiture. Le moins de duos de coéquipiers en tête (39 %).
- **Inconvénients** : 12 à 14 % de dominations écrasantes. La dernière écurie ne marque que dans 28 % des saisons. 3,9 écuries sans podium en 10 ans. Moins de titres ouverts à la dernière manche (31 %).

## 3. Ma recommandation (et pourquoi elle reste provisoire)

**Je recommande C2 (0,150 / 0,30) comme réglage provisoire.**
- Il n'utilise pas l'aléa comme levier principal, contrairement à C1.
- Il évite les dominations de C3.
- Les objectifs qu'il manque (dernière écurie qui marque, poids des compétences) dépendent surtout de mécaniques qui **n'existent pas encore** : fiabilité et erreurs liées au sang-froid (D-075), stratégie et pneus (phase 13), qualifications, voitures de sécurité, météo plus fine, développement différencié (phase 12). Ces sources de variété « méritées » doivent permettre plus tard de baisser l'aléa tout en faisant marquer les petites équipes.

**Ce que je conteste dans les objectifs eux-mêmes** (pour en discuter avec ChatGPT) :
- « Dernière écurie qui marque 40 % à 90 % » : sur la F1 réelle récente, c'est très variable. Avec 22 voitures et 10 places payantes, la dernière écurie marque souvent zéro point. Un objectif de 25 à 60 % me semblerait plus juste.
- « Part des compétences de 30 % à 70 % » : la mesure dépend aussi des écarts de niveau entre coéquipiers dans les données (estimations). À réévaluer après la relecture des notes de pilotes (D-050).

## 4. Défauts révélés, indépendants du choix

| Défaut | Constat | Piste (à concevoir, pas appliquée) |
| --- | --- | --- |
| Forme sans effet | 0 % de l'écart entre coéquipiers | Élargir l'effet de la confiance en soi sur la performance, ou l'étendre aux erreurs (avec le sang-froid, D-075) |
| Hiérarchie figée | Stabilité 0,92 ; 2,4 champions constructeurs en 10 ans dans tous les réglages | Phases 5 (économie, plafond, restrictions selon le classement), 7 (transferts), 8 (règlement). Mesurer à nouveau après chacune |
| Dynasties | 57 à 67 % dans tous les réglages | Idem. Pas de correction artificielle (D-040) |

## 5. Décision demandée (D-074)

Choisir parmi C1, C2, C3 (ou un autre réglage des tableaux complets), en connaissant ses inconvénients. Le choix sera inscrit comme **provisoire** (réévaluation après les phases 5, 6a et 13), et la référence de comparaison actuelle (réglage B, phase 4) sera conservée.
