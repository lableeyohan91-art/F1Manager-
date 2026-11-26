# Rapport d’équilibrage — 10 graines × 30 saisons

Scénario grille-2026, graines 1 à 10, 300 saisons simulées en 1 257,6 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 7,7 | 5,0 – 11,0 | 3,0 – 8,0 | 62 % | 7,8 |
| Écuries victorieuses par saison | 5,5 | 3,0 – 8,0 | 2,0 – 5,0 | 48 % | 5,7 |
| Part des victoires de l'écurie dominante | 44 % | 25 % – 70 % | 35 % – 80 % | 66 % | 46 % |
| Taux d’abandon par départ | 6 % | 3 % – 9 % | 5 % – 15 % | 56 % | 6 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,06 | 0,50 – 1,66 | 1,50 – 4,00 | 16 % | 0,99 |
| Écart de points entre les deux premiers | 51 | 7 – 114 | — | — | 59 |
| Changements de leader du championnat | 3,5 | 0,0 – 7,0 | — | — | 3,3 |
| Doublés par saison (toutes écuries) | 2,6 | 0,0 – 6,0 | — | — | 2,7 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,77 | 0,55 – 0,95 | — | — | 0,76 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,97 | 0,18 – 2,02 | — | — | 0,91 |
| Victoires inattendues par saison | 1,2 | 0,0 – 3,0 | — | — | 1,4 |
| Courses sous la pluie par saison | 2,2 | 1,0 – 4,0 | — | — | 2,2 |

## Par série de 30 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 30 saisons | 12,4 | 9,0 – 16,0 | 3,0 – 7,0 | 0 % | 12,6 |
| Champions constructeurs différents sur 30 saisons | 6,3 | 5,0 – 9,0 | — | — | 6,5 |
| Plus longue série de titres constructeurs consécutifs | 5,1 | 3,0 – 12,0 | — | — | 6,5 |
| Écuries sans aucune victoire sur 30 saisons | 0,5 | 0,0 – 2,0 | — | — | 0,2 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 29,8 | 24,0 – 41,0 | — | — | 29,0 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 3,4 | 3,1 – 3,8 | — | — | 3,4 |
| Transitions de saison sans aucun changement d’étage (D-081) | 9 % | 3 % – 17 % | — | — | 11 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 61 % | — | 40 % – 90 % | — | 71 % |
| Séries de 30 saisons avec 5 titres constructeurs consécutifs ou plus | 30 % | — | 0 % – 25 % | — | 60 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 38 % | — | — | — | 29 % |
| Retournement à la dernière manche (le leader perd le titre) | 8 % | — | — | — | 7 % |
| Champion et vice-champion coéquipiers | 23 % | — | — | — | 25 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 7 % | — | — | — | 7 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 31 % | — | — | — | 22 % |
| Saisons très serrées (≤ 10 points d’écart) | 15 % | — | — | — | 13 % |
| Dominations (≥ 120 points d’écart) | 7 % | — | — | — | 10 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,44 | 0,39 – 0,50 | — | — | 0,43 |
| Coéquipiers : écart moyen dû aux compétences | 0,23 | 0,15 – 0,32 | — | — | 0,21 |
| Coéquipiers : écart moyen dû à la forme | 0,02 | 0,01 – 0,03 | — | — | 0,02 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,33 – 0,40 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 28 % | 14 % – 42 % | — | — | 26 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 72 % | 56 % – 87 % | — | — | 74 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,87 | 0,78 – 0,95 | — | — | 0,86 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,94 | 0,90 – 0,98 | — | — | 0,94 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,97 | 0,95 – 0,99 | — | — | 0,97 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,46 | 0,91 – 2,00 | — | — | 1,52 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 38 % | 18 % – 55 % | — | — | 39 % |
| Pilotes : changements de position par concurrent sur la saison | 8,2 | 5,9 – 10,2 | — | — | 8,5 |
| Pilotes : écart moyen entre voisins (points) — haut | 33,1 | 18,4 – 50,6 | — | — | 35,0 |
| Pilotes : écart moyen entre voisins (points) — milieu | 14,6 | 8,3 – 22,0 | — | — | 13,5 |
| Pilotes : écart moyen entre voisins (points) — bas | 5,3 | 2,1 – 8,2 | — | — | 5,5 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 98 % | 95 % – 100 % | — | — | 98 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 78 % | 71 % – 86 % | — | — | 79 % |
| Pilotes : frontières raisonnablement disputées — haut | 47 % | 20 % – 80 % | — | — | 46 % |
| Pilotes : frontières raisonnablement disputées — milieu | 77 % | 57 % – 100 % | — | — | 80 % |
| Pilotes : frontières raisonnablement disputées — bas | 97 % | 89 % – 100 % | — | — | 97 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 1 % | 0 % – 5 % | — | — | 1 % |
| Pilotes : positions déjà acquises — haut | 4 % | 0 % – 20 % | — | — | 6 % |
| Pilotes : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 38 % | 23 % – 55 % | — | — | 37 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 1 % | 0 % – 5 % | — | — | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,89 | 0,79 – 0,97 | — | — | 0,89 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,95 | 0,90 – 0,99 | — | — | 0,94 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,97 | 0,94 – 1,00 | — | — | 0,97 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,58 | 0,18 – 0,91 | — | — | 0,64 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 11 % | 0 % – 27 % | — | — | 13 % |
| Constructeurs : changements de position par concurrent sur la saison | 5,0 | 2,9 – 7,3 | — | — | 5,3 |
| Constructeurs : écart moyen entre voisins (points) — haut | 79,3 | 37,8 – 137,8 | — | — | 80,4 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 35,9 | 20,3 – 54,0 | — | — | 34,2 |
| Constructeurs : écart moyen entre voisins (points) — bas | 18,7 | 3,0 – 41,0 | — | — | 20,6 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 94 % | 80 % – 100 % | — | — | 93 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 57 % | 50 % – 70 % | — | — | 58 % |
| Constructeurs : frontières raisonnablement disputées — haut | 36 % | 0 % – 75 % | — | — | 37 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 64 % | 50 % – 75 % | — | — | 66 % |
| Constructeurs : frontières raisonnablement disputées — bas | 85 % | 50 % – 100 % | — | — | 82 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 3 % | 0 % – 9 % | — | — | 4 % |
| Constructeurs : positions déjà acquises — haut | 8 % | 0 % – 25 % | — | — | 10 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 50 % | 27 % – 73 % | — | — | 49 % |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 4 % | 0 % – 9 % | — | — | 5 % |

## Chronique d’exemple (graine 1)

**2027** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 341 points et 8 victoires, 0 point devant George Russel (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Kimi Antoneli arrache le titre à George Russel.
- Mercédes décroche le titre des constructeurs (10e titre de son histoire).
- Mercédes signe 5 doublés.
- Victoire surprise de Lando Noris (McLarren) à Suzuca.
- Victoire surprise de Max Verstapen (Red Bul) à Sakir.
- Victoire surprise de Lewis Hammilton (Ferrary) à Madrit, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Las Vegaz.
- Cadilac termine la saison sans marquer le moindre point.

**2028** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 396 points et 9 victoires, 82 points devant George Russel (Mercédes).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Mercédes signe 6 doublés.
- Victoire surprise de Oscar Piastry (McLarren) à Albert Parc.
- Victoire surprise de Max Verstapen (Red Bul) à Monacco.
- Victoire surprise de Max Verstapen (Red Bul) à Hungarorring.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.
- Audy progresse de la 10e à la 7e place.
- Racing Buls termine la saison sans marquer le moindre point.

**2029** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 358 points et 8 victoires, 61 points devant George Russel (Mercédes).
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Mercédes signe 5 doublés.
- Victoire surprise de Max Verstapen (Wiliams) à Marinna Bay, sous la pluie.
- Racing Buls termine la saison sans marquer le moindre point.

**2030** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 311 points et 6 victoires, 4 points devant Lando Noris (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Mercédes signe 7 doublés.
- Victoire surprise de Max Verstapen (Wiliams) à Hermanos Rodrigues.
- Racing Buls termine la saison sans marquer le moindre point.

**2031** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 380 points et 8 victoires, 63 points devant Kimi Antoneli (McLarren).
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Gabriel Bortoletto (Aston Martyn) à Kyalamy.
- Victoire surprise de Oscar Piastry (Mercédes) à Marinna Bay, sous la pluie.
- Ferrary progresse de la 4e à la 1re place.
- Racing Buls termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 332 points et 6 victoires, 21 points devant Kimi Antoneli (Red Bul).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 7 fois.
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Hungarorring.
- Victoire surprise de Louis Lambert (Alpyne) à Istambull.
- Victoire surprise de Louis Lambert (Alpyne) à Hermanos Rodrigues.
- Victoire surprise de Louis Lambert (Alpyne) à Lussail.
- Mercédes recule de la 3e à la 6e place.
- Haass termine la saison sans marquer le moindre point.

**2033** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 346 points et 6 victoires, 21 points devant Kimi Antoneli (Red Bul).
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Kyalamy, sous la pluie.
- Victoire surprise de Louis Lambert (Alpyne) à Suzuca.
- Victoire surprise de Gabriel Bortoletto (Aston Martyn) à Silverston, sous la pluie.
- Haass termine la saison sans marquer le moindre point.

**2034** — champion : Samuel Marlow
- Samuel Marlow (Ferrary) remporte le titre avec 295 points et 6 victoires, 38 points devant Anna Kessler (Ferrary).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 5 fois.
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Alpyne recule de la 4e à la 7e place.
- Haass termine la saison sans marquer le moindre point.

**2035** — champion : Oscar Piastry
- Oscar Piastry (Red Bul) remporte le titre avec 252 points et 3 victoires, 18 points devant Anna Kessler (Ferrary).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 6 fois.
- McLarren décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Arvid Linblad (Alpyne) à Shangai.
- Victoire surprise de Kimi Antoneli (Audy) à Monzza.
- Victoire surprise de Arvid Linblad (Alpyne) à Marinna Bay.
- Victoire surprise de Louis Lambert (Aston Martyn) à Interlagoss.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2036** — champion : Arvid Linblad
- Arvid Linblad (Alpyne) remporte le titre avec 233 points et 4 victoires, 11 points devant Fleur Postma (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 7 fois.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Arvid Linblad (Alpyne) à Shangai.
- Victoire surprise de Oscar Piastry (Cadilac) à Gilles-Villeneuves.
- Victoire surprise de Oscar Piastry (Cadilac) à Silverston.
- Victoire surprise de Oscar Piastry (Cadilac) à Zandvort.
- Mercédes progresse de la 4e à la 1re place.
- Aston Martyn progresse de la 6e à la 3e place.
- Red Bul recule de la 3e à la 7e place.
- Haass termine la saison sans marquer le moindre point.

**2037** — champion : Fleur Postma
- Fleur Postma (Mercédes) remporte le titre avec 254 points et 5 victoires, 40 points devant Samuel Carlisle (Wiliams).
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Louis Lambert (Alpyne) à Kyalamy.
- Victoire surprise de Oscar Piastry (Cadilac) à Portimau.
- Victoire surprise de Kimi Antoneli (Audy) à Spielbergh, sous la pluie.
- Victoire surprise de Louis Lambert (Alpyne) à Hungarorring, sous la pluie.
- Victoire surprise de Daan Vos (Aston Martyn) à Bakou.
- Victoire surprise de Kimi Antoneli (Audy) à Istambull, sous la pluie.
- Wiliams progresse de la 9e à la 3e place.
- Aston Martyn recule de la 3e à la 10e place.
- Haass termine la saison sans marquer le moindre point.

**2038** — champion : Fleur Postma
- Fleur Postma (Mercédes) remporte le titre avec 263 points et 3 victoires, 35 points devant Oscar Piastry (McLarren).
- La tête du championnat a changé 8 fois.
- Mercédes décroche le titre des constructeurs (16e titre de son histoire).
- Victoire surprise de Louis Lambert (Alpyne) à Miamy, sous la pluie.
- Victoire surprise de Louis Lambert (Alpyne) à Lussail.
- Red Bul progresse de la 6e à la 3e place.

**2039** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 330 points et 6 victoires, 41 points devant Louis Lambert (Wiliams).
- La tête du championnat a changé 7 fois.
- Mercédes décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Gabriel Bortoletto (Cadilac) à Interlagoss.
- Aston Martyn progresse de la 9e à la 6e place.
- Alpyne recule de la 6e à la 9e place.
- Haass termine la saison sans marquer le moindre point.

**2040** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 345 points et 6 victoires, 31 points devant Louis Lambert (Wiliams).
- Le titre restait ouvert avant la dernière manche.
- McLarren décroche le titre des constructeurs (14e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.

**2041** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 337 points et 8 victoires, 64 points devant Fleur Postma (Mercédes).
- McLarren décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Louis Lambert (Alpyne) à Jedda.
- Victoire surprise de Louis Lambert (Alpyne) à Monacco.
- Racing Buls progresse de la 6e à la 3e place.
- Alpyne progresse de la 10e à la 5e place.
- Wiliams recule de la 3e à la 6e place.
- Ferrary recule de la 4e à la 8e place.
- Aston Martyn recule de la 7e à la 10e place.
- Haass termine la saison sans marquer le moindre point.

**2042** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 401 points et 8 victoires, 115 points devant Simone Moretti (Mercédes).
- Mercédes décroche le titre des constructeurs (18e titre de son histoire).
- Mercédes signe 7 doublés.
- Victoire surprise de Samuel Carlisle (Red Bul) à Zandvort, sous la pluie.
- Victoire surprise de Samuel Carlisle (Red Bul) à Monzza, sous la pluie.
- Audy progresse de la 7e à la 2e place.
- Ferrary progresse de la 8e à la 5e place.
- Racing Buls recule de la 3e à la 7e place.
- Wiliams recule de la 6e à la 10e place.
- Haass termine la saison sans marquer le moindre point.

**2043** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 387 points et 9 victoires, 49 points devant Kimi Antoneli (Mercédes).
- Mercédes décroche le titre des constructeurs (19e titre de son histoire).
- Mercédes signe 6 doublés.
- Racing Buls progresse de la 7e à la 4e place.
- Cadilac progresse de la 9e à la 5e place.
- Wiliams progresse de la 10e à la 7e place.
- Ferrary recule de la 5e à la 8e place.
- Red Bul recule de la 6e à la 10e place.
- Haass termine la saison sans marquer le moindre point.

**2044** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 328 points et 4 victoires, 38 points devant Anna Kessler (Mercédes).
- Mercédes décroche le titre des constructeurs (20e titre de son histoire).
- Mercédes signe 5 doublés.
- Victoire surprise de Magdalena Reiter (Wiliams) à Spielbergh, sous la pluie.
- McLarren recule de la 3e à la 6e place.
- Haass termine la saison sans marquer le moindre point.

**2045** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 311 points et 6 victoires, 14 points devant Anna Kessler (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 8 fois.
- Mercédes décroche le titre des constructeurs (21e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.
- Ferrary, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2046** — champion : Markus Albrecht
- Markus Albrecht (Audy) remporte le titre avec 262 points et 3 victoires, 17 points devant Nathan Ouellet (Racing Buls).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 4 fois.
- Racing Buls décroche le titre des constructeurs, le premier de son histoire.
- Mercédes recule de la 1re à la 4e place.
- Haass termine la saison sans marquer le moindre point.

**2047** — champion : Markus Albrecht
- Markus Albrecht (Audy) remporte le titre avec 307 points et 6 victoires, 104 points devant Álvaro Ferrer (Cadilac).
- Racing Buls décroche le titre des constructeurs (2e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.
- Red Bul, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2048** — champion : Markus Albrecht
- Markus Albrecht (Audy) remporte le titre avec 225 points et 4 victoires, 3 points devant Niklas Bauer (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Markus Albrecht arrache le titre à Niklas Bauer.
- Racing Buls décroche le titre des constructeurs (3e titre de son histoire).
- Mercédes progresse de la 6e à la 2e place.
- Wiliams recule de la 7e à la 10e place.
- Haass termine la saison sans marquer le moindre point.

**2049** — champion : Markus Albrecht
- Markus Albrecht (Alpyne) remporte le titre avec 389 points et 10 victoires, 169 points devant Céline Schmid (McLarren).
- Une domination sans partage.
- La tête du championnat a changé 5 fois.
- Alpyne décroche le titre des constructeurs (4e titre de son histoire).
- Alpyne progresse de la 6e à la 1re place.
- Racing Buls recule de la 1re à la 4e place.
- Cadilac recule de la 5e à la 8e place.
- Haass termine la saison sans marquer le moindre point.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2050** — champion : Markus Albrecht
- Markus Albrecht (Alpyne) remporte le titre avec 273 points et 5 victoires, 59 points devant Ruben Bos (Aston Martyn).
- Alpyne décroche le titre des constructeurs (5e titre de son histoire).
- Aston Martyn progresse de la 6e à la 2e place.
- Ferrary progresse de la 7e à la 3e place.
- McLarren recule de la 2e à la 6e place.
- Haass termine la saison sans marquer le moindre point.

**2051** — champion : Markus Albrecht
- Markus Albrecht (Alpyne) remporte le titre avec 280 points et 5 victoires, 78 points devant Baptiste Bertrand (Racing Buls).
- La tête du championnat a changé 7 fois.
- Alpyne décroche le titre des constructeurs (6e titre de son histoire).
- Mercédes progresse de la 5e à la 2e place.
- Haass termine la saison sans marquer le moindre point.

**2052** — champion : Nicolas Delmas
- Nicolas Delmas (Red Bul) remporte le titre avec 268 points et 5 victoires, 71 points devant Thijs Brouwer (Mercédes).
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Victoire surprise de George Radcliffe (Alpyne) à Catalunia.
- Red Bul progresse de la 9e à la 1re place.
- Audy progresse de la 6e à la 2e place.
- Wiliams progresse de la 8e à la 5e place.
- Cadilac progresse de la 10e à la 6e place.
- Alpyne recule de la 1re à la 8e place.
- Ferrary recule de la 5e à la 9e place.
- Racing Buls recule de la 4e à la 10e place.

**2053** — champion : Oliver Whitlock
- Oliver Whitlock (Red Bul) remporte le titre avec 321 points et 6 victoires, 18 points devant Nicolas Delmas (Red Bul).
- Retournement lors de la dernière manche : Oliver Whitlock arrache le titre à Nicolas Delmas.
- La tête du championnat a changé 4 fois.
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Victoire surprise de Céline Schmid (McLarren) à Albert Parc.
- Victoire surprise de Dylan Whitaker (Cadilac) à Jedda.
- Victoire surprise de Thijs Brouwer (Mercédes) à Hermanos Rodrigues.
- Haass termine la saison sans marquer le moindre point.

**2054** — champion : Nicolas Delmas
- Nicolas Delmas (Red Bul) remporte le titre avec 346 points et 9 victoires, 122 points devant Austin Baxter (Audy).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (9e titre de son histoire).
- Victoire surprise de Céline Schmid (McLarren) à Monacco.
- Racing Buls recule de la 8e à la 11e place.
- Haass termine la saison sans marquer le moindre point.
- Racing Buls termine la saison sans marquer le moindre point.

**2055** — champion : Thijs Brouwer
- Thijs Brouwer (Aston Martyn) remporte le titre avec 412 points et 12 victoires, 174 points devant Céline Schmid (Cadilac).
- Une domination sans partage.
- Aston Martyn décroche le titre des constructeurs, le premier de son histoire.
- Aston Martyn progresse de la 7e à la 1re place.
- Cadilac progresse de la 6e à la 3e place.
- Racing Buls termine la saison sans marquer le moindre point.
- Ferrary termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2056** — champion : Nicolas Delmas
- Nicolas Delmas (Red Bul) remporte le titre avec 281 points et 4 victoires, 21 points devant Arthur Maes (McLarren).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 8 fois.
- Red Bul décroche le titre des constructeurs (10e titre de son histoire).
- Victoire surprise de Baptiste Bertrand (Aston Martyn) à Kyalamy, sous la pluie.
- McLarren progresse de la 7e à la 2e place.
- Ferrary progresse de la 10e à la 3e place.
- Aston Martyn recule de la 1re à la 5e place.
- Haass progresse de la 11e à la 7e place.
- Wiliams recule de la 5e à la 8e place.
- Cadilac recule de la 3e à la 9e place.
- Audy recule de la 4e à la 10e place.
- Racing Buls, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

