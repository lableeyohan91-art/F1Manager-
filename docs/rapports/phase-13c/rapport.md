# Phases 13b+ et 13c — essais libres et aléas de course : rapport (28/11/2026)

> Rapport court (D-120 : mesures INDICATIVES). Méthode D-095 : on mesure et on documente, sans recalibrer. Campagne `npm run equilibrage`
> 20 graines × 30 saisons, **mêmes graines** que la référence 13b (`docs/rapports/phase-13b/campagne-13b.md`, conservée). Différences :
> essais libres, neutralisations, petites erreurs, part propre à la qualification, pluie variable, chaleur, fatigue, sang-froid.

## 1. Les courses (5 graines, première saison, 100 courses)

- Voiture de sécurité dans **45 %** des courses, VSC **42 %** (un peu trop), drapeau rouge **3 %**.
- La pole gagne **52 %** des courses (13b : 75 %) ; Verstapen 34 victoires sur 100 (13b : 33).
- ≈ 5 petites erreurs par course ; 62 % de courses à 1 arrêt, 30 % à 2 arrêts, 2 % à 3 arrêts.

| Circuit | Dépassements par course | Corrélation grille → arrivée | Pole = vainqueur | Voiture de sécurité ou drapeau rouge |
| --- | --- | --- | --- | --- |
| monaco | 8.4 | 0.91 | 3/5 | 3/5 |
| singapour | 10.4 | 0.75 | 3/5 | 2/5 |
| albert | 16.0 | 0.93 | 1/5 | 4/5 |
| spa | 18.0 | 0.92 | 2/5 | 0/5 |
| hungaroring | 19.8 | 0.83 | 4/5 | 2/5 |
| monza | 21.4 | 0.86 | 2/5 | 2/5 |
| lasvegas | 22.2 | 0.83 | 4/5 | 4/5 |
| montreal | 22.4 | 0.84 | 2/5 | 3/5 |
| interlagos | 22.6 | 0.80 | 3/5 | 3/5 |
| shanghai | 23.4 | 0.81 | 3/5 | 0/5 |
| silverstone | 23.4 | 0.88 | 2/5 | 1/5 |
| bakou | 23.4 | 0.92 | 4/5 | 3/5 |
| spielberg | 23.8 | 0.76 | 1/5 | 3/5 |
| suzuka | 27.0 | 0.90 | 2/5 | 4/5 |
| sakhir | 27.0 | 0.87 | 4/5 | 3/5 |
| madrid | 28.0 | 0.92 | 2/5 | 1/5 |
| lusail | 30.4 | 0.87 | 2/5 | 2/5 |
| jeddah | 32.4 | 0.88 | 3/5 | 1/5 |
| mexico | 44.0 | 0.82 | 3/5 | 2/5 |
| miami | 51.2 | 0.74 | 2/5 | 3/5 |

**Défavorable** : les dépassements ont beaucoup augmenté (Miami 51, Mexico 44, Monaco 8 par course) : relances groupées après la voiture
de sécurité et courses mixtes (voitures en pneus inadaptés). Probablement trop ; à reprendre dans la campagne d'après la phase 13.

## 2. Les saisons : tous les indicateurs (20 graines × 30 saisons)

**Évolutions défavorables, à lire en premier** :
- vainqueurs différents par saison 8,4 → **7,8** ; écuries victorieuses 6,3 → **5,8** ;
- titre encore ouvert avant la dernière manche 34 → **29 %** ; lutte jusqu'à la fin entre écuries différentes 31 → **25 %** ;
- dernière écurie qui marque 88 → 82 % ; domination constructeurs 24 → 26 %.
Cause probable (non vérifiée) : il y a **moins de courses entièrement sous la pluie** (2,3 → 1,5 par saison ; la pluie arrive maintenant
souvent en cours de course), or ce sont les courses les plus ouvertes du modèle (aléa amplifié). La 13c donne donc plus d'histoires
dans une course, mais pas plus de surprises sur une saison. **Objectif non atteint** pour l'ouverture des championnats.

**Favorables** : champions pilotes différents 12,5 → 13,0 ; plus longue série de titres 4,6 → 4,3 ; séries de 5 titres ou plus 50 → 45 %.

Titres constructeurs des saisons 1 à 5 (sur 100) : McLaren 47 (13b : 46), Mercedes 35 (32), Ferrari 11 (12), Red Bull 6 (9).

| Indicateur | 13b (référence) | 13b+ et 13c |
| --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 8,4 | 7,8 |
| Écuries victorieuses par saison | 6,3 | 5,8 |
| Part des victoires de l'écurie dominante | 39 % | 42 % |
| Taux d’abandon par départ | 7 % | 7 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 0,74 | 0,77 |
| Écart de points entre les deux premiers | 58 | 59 |
| Changements de leader du championnat | 3,4 | 3,3 |
| Doublés par saison (toutes écuries) | 1,9 | 2,1 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,56 | 0,55 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,00 | 1,01 |
| Victoires inattendues par saison | 1,1 | 1,1 |
| Courses sous la pluie par saison | 2,3 | 1,5 |
| Champions pilotes différents sur 30 saisons | 12,5 | 13,0 |
| Champions constructeurs différents sur 30 saisons | 8,7 | 8,4 |
| Plus longue série de titres constructeurs consécutifs | 4,6 | 4,3 |
| Écuries sans aucune victoire sur 30 saisons | 0,0 | 0,0 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 44,9 | 41,5 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 4,2 | 4,1 |
| Transitions de saison sans aucun changement d’étage (D-081) | 4 % | 5 % |
| Saisons où la dernière écurie marque au moins 1 point | 88 % | 82 % |
| Séries de 30 saisons avec 5 titres constructeurs consécutifs ou plus | 50 % | 45 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 34 % | 29 % |
| Retournement à la dernière manche (le leader perd le titre) | 8 % | 6 % |
| Champion et vice-champion coéquipiers | 13 % | 14 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 3 % | 4 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 31 % | 25 % |
| Saisons très serrées entre écuries différentes (≤ 10 points entre le champion et le meilleur pilote d’une autre écurie) | 13 % | 11 % |
| Dominations (≥ 120 points d’avance sur le meilleur pilote d’une autre écurie) | 14 % | 15 % |
| Écart moyen entre le champion et le meilleur pilote d’une autre écurie (points) | 63 | 65 |
| Championnat constructeurs serré (≤ 25 points entre les deux premiers) | 17 % | 17 % |
| Domination constructeurs (≥ 150 points entre les deux premiers) | 24 % | 26 % |
| Saisons très serrées, coéquipiers compris (≤ 10 points entre les deux premiers pilotes ; ancienne mesure) | 14 % | 13 % |
| Dominations, coéquipiers compris (≥ 120 points entre les deux premiers pilotes ; ancienne mesure) | 11 % | 12 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,44 | 0,43 |
| Coéquipiers : écart moyen dû aux compétences | 0,23 | 0,22 |
| Coéquipiers : écart moyen dû à la forme | 0,02 | 0,02 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 28 % | 28 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 72 % | 72 % |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,84 | 0,86 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,93 | 0,94 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,97 | 0,97 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,70 | 1,54 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 44 % | 40 % |
| Pilotes : changements de position par concurrent sur la saison | 9,3 | 8,7 |
| Pilotes : écart moyen entre voisins (points) — haut | 31,9 | 33,2 |
| Pilotes : écart moyen entre voisins (points) — milieu | 12,2 | 13,8 |
| Pilotes : écart moyen entre voisins (points) — bas | 6,1 | 5,6 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 98 % | 98 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 81 % | 80 % |
| Pilotes : frontières raisonnablement disputées — haut | 50 % | 49 % |
| Pilotes : frontières raisonnablement disputées — milieu | 83 % | 80 % |
| Pilotes : frontières raisonnablement disputées — bas | 96 % | 97 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 1 % | 1 % |
| Pilotes : positions déjà acquises — haut | 5 % | 5 % |
| Pilotes : positions déjà acquises — milieu | 0 % | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 34 % | 37 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 1 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,85 | 0,88 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,93 | 0,94 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,97 | 0,97 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,74 | 0,66 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 16 % | 14 % |
| Constructeurs : changements de position par concurrent sur la saison | 6,1 | 5,6 |
| Constructeurs : écart moyen entre voisins (points) — haut | 66,8 | 71,8 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 30,5 | 32,6 |
| Constructeurs : écart moyen entre voisins (points) — bas | 23,9 | 21,5 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 95 % | 95 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 62 % | 60 % |
| Constructeurs : frontières raisonnablement disputées — haut | 44 % | 41 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 71 % | 68 % |
| Constructeurs : frontières raisonnablement disputées — bas | 78 % | 82 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 3 % | 3 % |
| Constructeurs : positions déjà acquises — haut | 7 % | 7 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 48 % | 50 % |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 3 % | 3 % |

## 3. Essais libres (mesure courte, `docs/rapports/phase-13b-plus/rapport.md`)

Écarts d'environ 0,3 place par course entre plans ; aucun plan ne domine. Effet difficile à sentir pour le joueur.

## 4. Pistes (sans recalibrage maintenant)

- 13d (décisions de stratégie en course : undercut, réaction à l'adversaire, anticiper la pluie) devrait rendre les courses plus ouvertes
  par les choix, pas par le hasard.
- Campagne d'équilibrage d'après la phase 13 : dépassements trop nombreux après les relances, part de la pluie, VSC un peu fréquente,
  valeur des compétences en situation, avance de McLaren au départ.
