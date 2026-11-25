# Rapport d’équilibrage — 10 graines × 30 saisons

Scénario grille-2026, graines 1 à 10, 300 saisons simulées en 1 498,3 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 7,3 | 5,0 – 10,0 | 3,0 – 8,0 | 69 % | 7,4 |
| Écuries victorieuses par saison | 5,3 | 3,0 – 7,0 | 2,0 – 5,0 | 55 % | 5,3 |
| Part des victoires de l'écurie dominante | 49 % | 30 % – 71 % | 35 % – 80 % | 75 % | 47 % |
| Taux d’abandon par départ | 6 % | 4 % – 9 % | 5 % – 15 % | 58 % | 6 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,15 | 0,50 – 1,76 | 1,50 – 4,00 | 22 % | 0,98 |
| Écart de points entre les deux premiers | 62 | 9 – 128 | — | — | 58 |
| Changements de leader du championnat | 3,0 | 0,0 – 7,0 | — | — | 3,4 |
| Doublés par saison (toutes écuries) | 3,1 | 1,0 – 7,0 | — | — | 2,9 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,78 | 0,55 – 0,95 | — | — | 0,77 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,05 | 0,40 – 2,02 | — | — | 0,76 |
| Victoires inattendues par saison | 1,5 | 0,0 – 4,0 | — | — | 1,6 |
| Courses sous la pluie par saison | 2,2 | 1,0 – 4,0 | — | — | 2,2 |

## Par série de 30 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 30 saisons | 11,7 | 9,0 – 15,0 | 3,0 – 7,0 | 0 % | 12,8 |
| Champions constructeurs différents sur 30 saisons | 6,6 | 5,0 – 8,0 | — | — | 6,3 |
| Plus longue série de titres constructeurs consécutifs | 6,5 | 4,0 – 9,0 | — | — | 6,2 |
| Écuries sans aucune victoire sur 30 saisons | 0,4 | — | — | — | 0,1 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 27,1 | 20,0 – 41,0 | — | — | 38,9 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 3,1 | 2,8 – 3,8 | — | — | 3,8 |
| Transitions de saison sans aucun changement d’étage (D-081) | 10 % | 7 % – 28 % | — | — | 5 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 57 % | — | 40 % – 90 % | — | 80 % |
| Séries de 30 saisons avec 5 titres constructeurs consécutifs ou plus | 80 % | — | 0 % – 25 % | — | 70 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 27 % | — | — | — | 30 % |
| Retournement à la dernière manche (le leader perd le titre) | 5 % | — | — | — | 5 % |
| Champion et vice-champion coéquipiers | 27 % | — | — | — | 27 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 7 % | — | — | — | 8 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 20 % | — | — | — | 22 % |
| Saisons très serrées (≤ 10 points d’écart) | 11 % | — | — | — | 13 % |
| Dominations (≥ 120 points d’écart) | 13 % | — | — | — | 11 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,44 | 0,39 – 0,49 | — | — | 0,43 |
| Coéquipiers : écart moyen dû aux compétences | 0,23 | 0,16 – 0,31 | — | — | 0,22 |
| Coéquipiers : écart moyen dû à la forme | 0,02 | 0,01 – 0,02 | — | — | 0,02 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,33 – 0,39 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 28 % | 15 % – 40 % | — | — | 26 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 72 % | 56 % – 87 % | — | — | 73 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,88 | 0,79 – 0,95 | — | — | 0,86 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,95 | 0,90 – 0,98 | — | — | 0,94 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,95 – 0,99 | — | — | 0,97 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,40 | 0,82 – 2,09 | — | — | 1,52 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 37 % | 18 % – 59 % | — | — | 40 % |
| Pilotes : changements de position par concurrent sur la saison | 8,0 | 5,7 – 10,4 | — | — | 8,5 |
| Pilotes : écart moyen entre voisins (points) — haut | 36,5 | 20,6 – 53,2 | — | — | 35,3 |
| Pilotes : écart moyen entre voisins (points) — milieu | 14,7 | 8,4 – 21,9 | — | — | 13,9 |
| Pilotes : écart moyen entre voisins (points) — bas | 5,1 | 2,0 – 7,7 | — | — | 5,2 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 98 % | 95 % – 100 % | — | — | 98 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 78 % | 71 % – 86 % | — | — | 80 % |
| Pilotes : frontières raisonnablement disputées — haut | 43 % | 20 % – 60 % | — | — | 46 % |
| Pilotes : frontières raisonnablement disputées — milieu | 78 % | 57 % – 100 % | — | — | 80 % |
| Pilotes : frontières raisonnablement disputées — bas | 97 % | 89 % – 100 % | — | — | 98 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 1 % | 0 % – 5 % | — | — | 1 % |
| Pilotes : positions déjà acquises — haut | 5 % | 0 % – 20 % | — | — | 5 % |
| Pilotes : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 39 % | 23 % – 59 % | — | — | 36 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 0 % – 5 % | — | — | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,90 | 0,80 – 0,97 | — | — | 0,89 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,95 | 0,90 – 0,99 | — | — | 0,95 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,95 – 1,00 | — | — | 0,97 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,59 | 0,18 – 1,09 | — | — | 0,63 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 12 % | 0 % – 27 % | — | — | 13 % |
| Constructeurs : changements de position par concurrent sur la saison | 4,8 | 2,6 – 7,1 | — | — | 5,4 |
| Constructeurs : écart moyen entre voisins (points) — haut | 87,6 | 43,5 – 139,5 | — | — | 86,3 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 36,1 | 19,5 – 56,5 | — | — | 30,7 |
| Constructeurs : écart moyen entre voisins (points) — bas | 16,3 | 3,0 – 34,5 | — | — | 19,5 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 92 % | 80 % – 100 % | — | — | 92 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 57 % | 40 % – 70 % | — | — | 59 % |
| Constructeurs : frontières raisonnablement disputées — haut | 34 % | 0 % – 50 % | — | — | 35 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 65 % | 50 % – 100 % | — | — | 70 % |
| Constructeurs : frontières raisonnablement disputées — bas | 87 % | 50 % – 100 % | — | — | 85 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 4 % | 0 % – 9 % | — | — | 4 % |
| Constructeurs : positions déjà acquises — haut | 11 % | 0 % – 25 % | — | — | 11 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 49 % | 27 % – 73 % | — | — | 49 % |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 5 % | 0 % – 9 % | — | — | 5 % |

## Chronique d’exemple (graine 1)

**2027** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 342 points et 7 victoires, 12 points devant George Russel (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (10e titre de son histoire).
- Mercédes signe 7 doublés.
- Victoire surprise de Max Verstapen (Red Bul) à Sakir.
- Victoire surprise de Max Verstapen (Red Bul) à Monacco.
- Victoire surprise de Lewis Hammilton (Ferrary) à Madrit, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Las Vegaz.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Cadilac termine la saison sans marquer le moindre point.

**2028** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 402 points et 9 victoires, 88 points devant George Russel (Mercédes).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Mercédes signe 8 doublés.
- Victoire surprise de Max Verstapen (Red Bul) à Monacco.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.
- Victoire surprise de Max Verstapen (Red Bul) à Marinna Bay.
- Cadilac progresse de la 11e à la 8e place.
- Racing Buls recule de la 8e à la 11e place.
- Racing Buls termine la saison sans marquer le moindre point.

**2029** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 366 points et 9 victoires, 57 points devant George Russel (Mercédes).
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Mercédes signe 6 doublés.
- Victoire surprise de Max Verstapen (Wiliams) à Marinna Bay, sous la pluie.
- Haass termine la saison sans marquer le moindre point.
- Racing Buls termine la saison sans marquer le moindre point.

**2030** — champion : Lando Noris
- Lando Noris (Mercédes) remporte le titre avec 305 points et 5 victoires, 5 points devant Oscar Piastry (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Mercédes signe 6 doublés.
- Victoire surprise de Max Verstapen (Wiliams) à Hermanos Rodrigues.
- Haass termine la saison sans marquer le moindre point.
- Racing Buls termine la saison sans marquer le moindre point.

**2031** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 345 points et 6 victoires, 47 points devant Oscar Piastry (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 12 fois.
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Victoire surprise de Gabriel Bortoletto (Aston Martyn) à Kyalamy.
- Haass termine la saison sans marquer le moindre point.
- Racing Buls termine la saison sans marquer le moindre point.

**2032** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 347 points et 7 victoires, 46 points devant Kimi Antoneli (Red Bul).
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Hungarorring.
- Victoire surprise de Louis Lambert (Alpyne) à Lussail.
- Alpyne progresse de la 5e à la 2e place.
- Wiliams progresse de la 7e à la 4e place.
- Mercédes recule de la 2e à la 5e place.
- Haass termine la saison sans marquer le moindre point.

**2033** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 372 points et 10 victoires, 63 points devant Kimi Antoneli (Red Bul).
- McLarren décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Kyalamy, sous la pluie.
- Victoire surprise de Louis Lambert (Alpyne) à Suzuca.
- Victoire surprise de Daan Vos (Mercédes) à Silverston, sous la pluie.
- Racing Buls termine la saison sans marquer le moindre point.

**2034** — champion : Kimi Antoneli
- Kimi Antoneli (Red Bul) remporte le titre avec 281 points et 8 victoires, 39 points devant Oscar Piastry (Red Bul).
- La tête du championnat a changé 6 fois.
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Catalunia.
- Victoire surprise de Kimi Antoneli (Red Bul) à Silverston.
- Mercédes progresse de la 5e à la 2e place.
- Alpyne recule de la 2e à la 6e place.
- Haass termine la saison sans marquer le moindre point.

**2035** — champion : Samuel Carlisle
- Samuel Carlisle (McLarren) remporte le titre avec 299 points et 4 victoires, 56 points devant Taylor Prescott (Mercédes).
- McLarren décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Arvid Linblad (Alpyne) à Shangai.
- Victoire surprise de Anna Kessler (Ferrary) à Jedda.
- Victoire surprise de Oscar Piastry (Red Bul) à Imolla.
- Victoire surprise de Oscar Piastry (Red Bul) à Silverston.
- Red Bul recule de la 1re à la 4e place.
- Haass termine la saison sans marquer le moindre point.

**2036** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 385 points et 11 victoires, 70 points devant Samuel Carlisle (McLarren).
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Aston Martyn progresse de la 7e à la 4e place.
- Red Bul recule de la 4e à la 7e place.
- Haass termine la saison sans marquer le moindre point.

**2037** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 332 points et 6 victoires, 2 points devant Louis Lambert (McLarren).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Oscar Piastry arrache le titre à Louis Lambert.
- La tête du championnat a changé 9 fois.
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Samuel Carlisle (Wiliams) à Jedda.
- Victoire surprise de Kimi Antoneli (Aston Martyn) à Spielbergh, sous la pluie.
- Victoire surprise de Samuel Carlisle (Wiliams) à Marinna Bay.
- Haass termine la saison sans marquer le moindre point.

**2038** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 369 points et 9 victoires, 67 points devant Louis Lambert (McLarren).
- Mercédes décroche le titre des constructeurs (16e titre de son histoire).
- Victoire surprise de Taylor Prescott (Cadilac) à Bakou.
- Cadilac progresse de la 9e à la 4e place.
- Haass termine la saison sans marquer le moindre point.

**2039** — champion : Samuel Carlisle
- Samuel Carlisle (Mercédes) remporte le titre avec 335 points et 6 victoires, 46 points devant Kimi Antoneli (Mercédes).
- Mercédes décroche le titre des constructeurs (17e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.

**2040** — champion : Samuel Carlisle
- Samuel Carlisle (Mercédes) remporte le titre avec 341 points et 8 victoires, 81 points devant Adrián Aranda (Mercédes).
- Mercédes décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Alpyne) à Suzuca.
- Victoire surprise de Louis Lambert (Wiliams) à Sakir.
- Victoire surprise de Kimi Antoneli (Alpyne) à Imolla.
- Victoire surprise de Álvaro Ferrer (Red Bul) à Gilles-Villeneuves.
- Victoire surprise de Nathan Ouellet (Racing Buls) à Interlagoss, sous la pluie.
- Alpyne progresse de la 6e à la 3e place.
- Cadilac recule de la 5e à la 10e place.
- Haass termine la saison sans marquer le moindre point.
- Ferrary, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2041** — champion : Louis Lambert
- Louis Lambert (Mercédes) remporte le titre avec 416 points et 13 victoires, 114 points devant Samuel Carlisle (McLarren).
- Mercédes décroche le titre des constructeurs (19e titre de son histoire).
- Victoire surprise de Stefan Lehmann (Audy) à Imolla.
- Wiliams recule de la 5e à la 8e place.
- Haass termine la saison sans marquer le moindre point.

**2042** — champion : Louis Lambert
- Louis Lambert (Mercédes) remporte le titre avec 302 points et 5 victoires, 11 points devant Kimi Antoneli (McLarren).
- Le titre restait ouvert avant la dernière manche.
- McLarren décroche le titre des constructeurs (15e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.

**2043** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 347 points et 6 victoires, 55 points devant Anna Kessler (Mercédes).
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (20e titre de son histoire).
- Mercédes signe 5 doublés.
- Victoire surprise de Rafael Ribeiro (Audy) à Monacco.
- Ferrary progresse de la 9e à la 3e place.
- Alpyne recule de la 5e à la 10e place.
- Haass termine la saison sans marquer le moindre point.

**2044** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 307 points et 4 victoires, 20 points devant Clara Nielsen (Ferrary).
- Retournement lors de la dernière manche : Markus Albrecht arrache le titre à Clara Nielsen.
- Mercédes décroche le titre des constructeurs (21e titre de son histoire).
- Victoire surprise de Magdalena Wimmer (Red Bul) à Istambull.
- Red Bul progresse de la 6e à la 3e place.
- Haass termine la saison sans marquer le moindre point.

**2045** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 308 points et 5 victoires, 44 points devant Clara Nielsen (Ferrary).
- Mercédes décroche le titre des constructeurs (22e titre de son histoire).
- Victoire surprise de Anna Kessler (McLarren) à Madrit.
- Victoire surprise de Markus Albrecht (Mercédes) à Istambull, sous la pluie.
- Haass progresse de la 11e à la 8e place.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2046** — champion : Markus Albrecht
- Markus Albrecht (Ferrary) remporte le titre avec 377 points et 9 victoires, 124 points devant Nathan Ouellet (Mercédes).
- Une domination sans partage.
- La tête du championnat a changé 4 fois.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Adrián Aranda (Cadilac) à Silverston, sous la pluie.
- Victoire surprise de Giovanni Sartori (Racing Buls) à Zandvort.
- Alpyne termine la saison sans marquer le moindre point.

**2047** — champion : Markus Albrecht
- Markus Albrecht (Ferrary) remporte le titre avec 372 points et 9 victoires, 145 points devant Clara Nielsen (McLarren).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Magdalena Wimmer (Red Bul) à Sepanng, sous la pluie.
- Audy progresse de la 7e à la 3e place.
- Red Bul recule de la 3e à la 6e place.
- Mercédes recule de la 2e à la 10e place.
- Alpyne termine la saison sans marquer le moindre point.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2048** — champion : Markus Albrecht
- Markus Albrecht (Ferrary) remporte le titre avec 303 points et 8 victoires, 63 points devant Stefan Lehmann (Aston Martyn).
- Ferrary décroche le titre des constructeurs (19e titre de son histoire).
- Racing Buls recule de la 5e à la 8e place.
- Alpyne termine la saison sans marquer le moindre point.

**2049** — champion : Thijs Brouwer
- Thijs Brouwer (Ferrary) remporte le titre avec 253 points et 4 victoires, 20 points devant Ella Hargreaves (Ferrary).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 7 fois.
- Ferrary décroche le titre des constructeurs (20e titre de son histoire).
- Alpyne termine la saison sans marquer le moindre point.

**2050** — champion : Thijs Brouwer
- Thijs Brouwer (Ferrary) remporte le titre avec 304 points et 4 victoires, 65 points devant Baptiste Bertrand (Cadilac).
- Ferrary décroche le titre des constructeurs (21e titre de son histoire).
- Victoire surprise de Markus Albrecht (Mercédes) à Istambull, sous la pluie.
- Cadilac progresse de la 5e à la 2e place.
- McLarren recule de la 2e à la 5e place.
- Alpyne termine la saison sans marquer le moindre point.

**2051** — champion : James Yardley
- James Yardley (Aston Martyn) remporte le titre avec 231 points et 3 victoires, 37 points devant Baptiste Bertrand (Cadilac).
- La tête du championnat a changé 8 fois.
- Aston Martyn décroche le titre des constructeurs, le premier de son histoire.
- Alpyne termine la saison sans marquer le moindre point.

**2052** — champion : Markus Albrecht
- Markus Albrecht (Ferrary) remporte le titre avec 317 points et 8 victoires, 63 points devant Austin Baxter (Aston Martyn).
- Ferrary décroche le titre des constructeurs (22e titre de son histoire).
- Victoire surprise de George Radcliffe (Wiliams) à Catalunia.
- Haass termine la saison sans marquer le moindre point.
- Alpyne termine la saison sans marquer le moindre point.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

**2053** — champion : Markus Albrecht
- Markus Albrecht (Ferrary) remporte le titre avec 369 points et 9 victoires, 118 points devant Thijs Brouwer (Audy).
- Ferrary décroche le titre des constructeurs (23e titre de son histoire).
- Victoire surprise de Baptiste Bertrand (McLarren) à Marinna Bay.
- Alpyne termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2054** — champion : Ren Shimizu
- Ren Shimizu (Red Bul) remporte le titre avec 341 points et 10 victoires, 87 points devant Thijs Brouwer (Audy).
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Ferrary recule de la 1re à la 5e place.
- Alpyne termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2055** — champion : Thijs Brouwer
- Thijs Brouwer (Aston Martyn) remporte le titre avec 318 points et 4 victoires, 30 points devant Ren Shimizu (Red Bul).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 4 fois.
- Aston Martyn décroche le titre des constructeurs (2e titre de son histoire).
- Audy recule de la 2e à la 5e place.
- Racing Buls termine la saison sans marquer le moindre point.
- Alpyne termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.
- Mercédes, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2056** — champion : Thijs Brouwer
- Thijs Brouwer (Aston Martyn) remporte le titre avec 308 points et 7 victoires, 31 points devant Ren Shimizu (Red Bul).
- La tête du championnat a changé 4 fois.
- Aston Martyn décroche le titre des constructeurs (3e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.

