# Phase 13b — positions sur la piste : rapport (28/11/2026)

> Rapport court (D-120 : mesures INDICATIVES jusqu'aux phases 12 et 13). Méthode D-095 : on mesure et on documente, sans recalibrer.
> Campagne `npm run equilibrage` 20 graines × 30 saisons, **mêmes graines** que la référence 13a bis (McLaren 17), conservée dans
> `mesure-13a-bis-mclaren.md`. Seule différence : la course sur la piste (paramètre `course.piste` = 1).

## 1. Ce qui a été fait

- Qualifications Q1, Q2, Q3 ; départ ; course tour par tour avec de vraies positions (air perturbé, aspiration, trafic, dépassements,
  arrêts qui font ressortir à sa place, abandons au tour).
- Fiches des circuits lues par la course : difficulté de dépassement et perte réelle de la voie des stands.
- Forme du week-end aussi en qualification ; voitures collées derrière qui tentent leur chance.
- Fiche du Grand Prix : place de départ et dépassements de chaque pilote. Temps de simulation d'une saison : environ 3,5 s (inchangé).

## 2. Ce que l'on voit dans les courses (5 graines, première saison)

| Circuit | Dépassements par course | Corrélation grille → arrivée | Pole = vainqueur |
| --- | --- | --- | --- |
| monaco | 1.4 | 0.94 | 5/5 |
| singapour | 5.0 | 0.80 | 3/5 |
| hungaroring | 10.6 | 0.87 | 2/5 |
| interlagos | 11.2 | 0.86 | 4/5 |
| albert | 11.4 | 0.91 | 5/5 |
| spa | 11.6 | 0.95 | 4/5 |
| lasvegas | 11.6 | 0.87 | 4/5 |
| monza | 11.8 | 0.92 | 4/5 |
| shanghai | 12.0 | 0.87 | 3/5 |
| montreal | 12.2 | 0.90 | 4/5 |
| suzuka | 12.8 | 0.95 | 5/5 |
| jeddah | 14.6 | 0.94 | 4/5 |
| bakou | 16.4 | 0.93 | 4/5 |
| spielberg | 17.2 | 0.77 | 3/5 |
| silverstone | 17.6 | 0.86 | 1/5 |
| lusail | 19.8 | 0.87 | 5/5 |
| mexico | 20.0 | 0.90 | 3/5 |
| sakhir | 20.8 | 0.92 | 4/5 |
| madrid | 21.0 | 0.91 | 3/5 |
| miami | 26.8 | 0.87 | 5/5 |

Sur 100 courses : Verstapen 36 poles et 33 victoires ; 57 % de courses à 1 arrêt, 28 % à 2 arrêts, 14 % sans arrêt (pluie).

**Points favorables** : Monaco ≈ 1 dépassement par course (au lieu de 23), Singapour 5, circuits rapides et larges 17 à 27 ; aucune boucle
d'échanges de position.

**Points défavorables (objectifs non atteints)** :
- La pole gagne trop souvent : **75 %** des courses (en F1 réelle, plutôt 40 à 50 %).
- La corrélation grille → arrivée est forte partout (0,77 à 0,95) : **Monaco (0,94) et Monza (0,92) se ressemblent trop**. Le critère de la
  fiche (« la qualification compte beaucoup plus à Monaco qu'à Monza ») n'est que faiblement atteint. Cause probable : la qualification
  classe déjà les voitures presque dans l'ordre de leur rythme de course, il reste donc peu de raisons de dépasser. Pistes pour la campagne
  d'après la phase 13 : stratégies plus variées (13c-13d : undercut, réaction à l'adversaire), incidents et voiture de sécurité (13c),
  écart de rythme qualification/course selon les voitures (pneus, carburant).

## 3. Compétences en situation (banc des 22 pilotes, voiture identique)

### Compétences en situation : Hammilton avec +5 points (mêmes tirages)

| Compétence | Place moyenne à l'arrivée (base) | Avec +5 | Gain (places) |
| --- | --- | --- | --- |
| depassement | 7.22 | 7.07 | 0.15 |
| defense | 7.22 | 7.10 | 0.12 |
| departs | 7.22 | 6.67 | 0.55 |
| freinage | 7.22 | 5.78 | 1.44 |

### En situation : Hammilton part DERNIER (mêmes tirages)

| Compétence | Place moyenne à l'arrivée (base) | Avec +5 | Gain (places) |
| --- | --- | --- | --- |
| depassement | 15.30 | 14.37 | 0.93 |
| defense | 15.30 | 15.23 | 0.07 |
| departs | 15.30 | 14.98 | 0.32 |
| freinage | 15.30 | 14.35 | 0.95 |

Lecture : le dépassement compte autant que le freinage **quand le pilote part loin** ; en moyenne, il compte peu. La défense compte peu
dans ce test. Ces deux compétences valent nettement moins qu'avant pour le classement final (elles comptaient dans le rythme moyen) : à
reprendre dans la campagne d'équilibrage d'après la phase 13.

## 4. Titres constructeurs des saisons 1 à 5 (sur 100)

| Écurie | 13a bis | 13b |
| --- | --- | --- |
| McLaren | 47 | 46 |
| Mercedes | 33 | 32 |
| Ferrari | 8 | 12 |
| Red Bull | 11 | 9 |

## 5. Tous les indicateurs suivis (20 graines × 30 saisons, mêmes graines)

Évolutions défavorables à noter : doublés et championnats constructeurs serrés en baisse, dominations pilotes (≥ 120 points) 12 → 14 %,
plus longue série de titres 4,3 → 4,6, séries de 5 titres ou plus 45 → 50 %. Favorables : vainqueurs différents 8,0 → 8,4, écuries
victorieuses 6,0 → 6,3, dernière écurie qui marque 83 → 88 %, titre ouvert avant la dernière manche 32 → 34 %. Écarts faibles dans
l'ensemble : la 13b change les courses plus que la hiérarchie.

| Indicateur | 13a bis (référence) | 13b |
| --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 8,0 | 8,4 |
| Écuries victorieuses par saison | 6,0 | 6,3 |
| Part des victoires de l'écurie dominante | 40 % | 39 % |
| Taux d’abandon par départ | 7 % | 7 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 0,75 | 0,74 |
| Écart de points entre les deux premiers | 54 | 58 |
| Changements de leader du championnat | 3,5 | 3,4 |
| Doublés par saison (toutes écuries) | 2,1 | 1,9 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,54 | 0,56 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,02 | 1,00 |
| Victoires inattendues par saison | 1,2 | 1,1 |
| Courses sous la pluie par saison | 2,3 | 2,3 |
| Champions pilotes différents sur 30 saisons | 13,0 | 12,5 |
| Champions constructeurs différents sur 30 saisons | 8,8 | 8,7 |
| Plus longue série de titres constructeurs consécutifs | 4,3 | 4,6 |
| Écuries sans aucune victoire sur 30 saisons | 0,0 | 0,0 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 43,5 | 44,9 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 4,1 | 4,2 |
| Transitions de saison sans aucun changement d’étage (D-081) | 6 % | 4 % |
| Saisons où la dernière écurie marque au moins 1 point | 83 % | 88 % |
| Séries de 30 saisons avec 5 titres constructeurs consécutifs ou plus | 45 % | 50 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 32 % | 34 % |
| Retournement à la dernière manche (le leader perd le titre) | 8 % | 8 % |
| Champion et vice-champion coéquipiers | 11 % | 13 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 4 % | 3 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 28 % | 31 % |
| Saisons très serrées entre écuries différentes (≤ 10 points entre le champion et le meilleur pilote d’une autre écurie) | 11 % | 13 % |
| Dominations (≥ 120 points d’avance sur le meilleur pilote d’une autre écurie) | 12 % | 14 % |
| Écart moyen entre le champion et le meilleur pilote d’une autre écurie (points) | 60 | 63 |
| Championnat constructeurs serré (≤ 25 points entre les deux premiers) | 20 % | 17 % |
| Domination constructeurs (≥ 150 points entre les deux premiers) | 22 % | 24 % |
| Saisons très serrées, coéquipiers compris (≤ 10 points entre les deux premiers pilotes ; ancienne mesure) | 12 % | 14 % |
| Dominations, coéquipiers compris (≥ 120 points entre les deux premiers pilotes ; ancienne mesure) | 8 % | 11 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,43 | 0,44 |
| Coéquipiers : écart moyen dû aux compétences | 0,21 | 0,23 |
| Coéquipiers : écart moyen dû à la forme | 0,02 | 0,02 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 26 % | 28 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 74 % | 72 % |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,86 | 0,84 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,94 | 0,93 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,97 | 0,97 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,57 | 1,70 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 41 % | 44 % |
| Pilotes : changements de position par concurrent sur la saison | 8,7 | 9,3 |
| Pilotes : écart moyen entre voisins (points) — haut | 32,3 | 31,9 |
| Pilotes : écart moyen entre voisins (points) — milieu | 13,9 | 12,2 |
| Pilotes : écart moyen entre voisins (points) — bas | 5,5 | 6,1 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 98 % | 98 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 80 % | 81 % |
| Pilotes : frontières raisonnablement disputées — haut | 49 % | 50 % |
| Pilotes : frontières raisonnablement disputées — milieu | 79 % | 83 % |
| Pilotes : frontières raisonnablement disputées — bas | 97 % | 96 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 1 % | 1 % |
| Pilotes : positions déjà acquises — haut | 4 % | 5 % |
| Pilotes : positions déjà acquises — milieu | 0 % | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 36 % | 34 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 1 % | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,88 | 0,85 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,94 | 0,93 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,97 | 0,97 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,68 | 0,74 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 15 % | 16 % |
| Constructeurs : changements de position par concurrent sur la saison | 5,7 | 6,1 |
| Constructeurs : écart moyen entre voisins (points) — haut | 72,0 | 66,8 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 31,8 | 30,5 |
| Constructeurs : écart moyen entre voisins (points) — bas | 21,2 | 23,9 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 95 % | 95 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 60 % | 62 % |
| Constructeurs : frontières raisonnablement disputées — haut | 41 % | 44 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 69 % | 71 % |
| Constructeurs : frontières raisonnablement disputées — bas | 82 % | 78 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 2 % | 3 % |
| Constructeurs : positions déjà acquises — haut | 6 % | 7 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 48 % | 48 % |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 3 % | 3 % |
