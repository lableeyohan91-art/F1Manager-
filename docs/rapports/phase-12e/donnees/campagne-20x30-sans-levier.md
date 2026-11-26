# Rapport d’équilibrage — 20 graines × 30 saisons

Scénario grille-2026, graines 1 à 20, 600 saisons simulées en 2 357,4 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 7,7 | 5,0 – 11,0 | 3,0 – 8,0 | 63 % |
| Écuries victorieuses par saison | 5,5 | 3,0 – 8,0 | 2,0 – 5,0 | 48 % |
| Part des victoires de l'écurie dominante | 45 % | 27 % – 67 % | 35 % – 80 % | 69 % |
| Taux d’abandon par départ | 6 % | 4 % – 9 % | 5 % – 15 % | 58 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,06 | 0,52 – 1,66 | 1,50 – 4,00 | 17 % |
| Écart de points entre les deux premiers | 57 | 8 – 120 | — | — |
| Changements de leader du championnat | 3,3 | 0,0 – 7,0 | — | — |
| Doublés par saison (toutes écuries) | 2,6 | 0,0 – 6,0 | — | — |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,77 | 0,53 – 0,95 | — | — |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,00 | 0,24 – 2,03 | — | — |
| Victoires inattendues par saison | 1,2 | 0,0 – 3,0 | — | — |
| Courses sous la pluie par saison | 2,3 | 1,0 – 4,0 | — | — |

## Par série de 30 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Champions pilotes différents sur 30 saisons | 12,5 | 9,0 – 16,0 | 3,0 – 7,0 | 0 % |
| Champions constructeurs différents sur 30 saisons | 6,7 | 5,0 – 9,0 | — | — |
| Plus longue série de titres constructeurs consécutifs | 5,5 | 3,0 – 11,0 | — | — |
| Écuries sans aucune victoire sur 30 saisons | 0,3 | 0,0 – 1,0 | — | — |
| Remontées (+3 places ou plus d’une saison à l’autre) | 29,8 | 24,0 – 38,0 | — | — |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 3,4 | 3,0 – 3,9 | — | — |
| Transitions de saison sans aucun changement d’étage (D-081) | 9 % | 3 % – 17 % | — | — |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 60 % | — | 40 % – 90 % | — |
| Séries de 30 saisons avec 5 titres constructeurs consécutifs ou plus | 50 % | — | 0 % – 25 % | — |
| Titre encore ouvert avant la dernière manche (définition exacte) | 33 % | — | — | — |
| Retournement à la dernière manche (le leader perd le titre) | 6 % | — | — | — |
| Champion et vice-champion coéquipiers | 22 % | — | — | — |
| Lutte jusqu’à la dernière manche entre coéquipiers | 6 % | — | — | — |
| Lutte jusqu’à la dernière manche entre écuries différentes | 27 % | — | — | — |
| Saisons très serrées (≤ 10 points d’écart) | 13 % | — | — | — |
| Dominations (≥ 120 points d’écart) | 10 % | — | — | — |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,43 | 0,38 – 0,50 | — | — |
| Coéquipiers : écart moyen dû aux compétences | 0,22 | 0,15 – 0,31 | — | — |
| Coéquipiers : écart moyen dû à la forme | 0,02 | 0,01 – 0,02 | — | — |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,33 – 0,40 | — | — |
| Coéquipiers : part de l’écart quadratique due aux compétences | 27 % | 14 % – 41 % | — | — |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 73 % | 58 % – 87 % | — | — |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,87 | 0,79 – 0,94 | — | — |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,94 | 0,90 – 0,98 | — | — |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,97 | 0,95 – 0,99 | — | — |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,47 | 0,91 – 2,09 | — | — |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 37 % | 18 % – 55 % | — | — |
| Pilotes : changements de position par concurrent sur la saison | 8,2 | 5,9 – 10,3 | — | — |
| Pilotes : écart moyen entre voisins (points) — haut | 34,2 | 18,4 – 50,8 | — | — |
| Pilotes : écart moyen entre voisins (points) — milieu | 14,4 | 8,1 – 21,6 | — | — |
| Pilotes : écart moyen entre voisins (points) — bas | 5,3 | 2,1 – 8,2 | — | — |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 98 % | 95 % – 100 % | — | — |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 78 % | 71 % – 86 % | — | — |
| Pilotes : frontières raisonnablement disputées — haut | 46 % | 20 % – 80 % | — | — |
| Pilotes : frontières raisonnablement disputées — milieu | 77 % | 57 % – 100 % | — | — |
| Pilotes : frontières raisonnablement disputées — bas | 97 % | 89 % – 100 % | — | — |
| Pilotes : positions déjà acquises à 3 manches de la fin | 1 % | 0 % – 5 % | — | — |
| Pilotes : positions déjà acquises — haut | 5 % | 0 % – 20 % | — | — |
| Pilotes : positions déjà acquises — milieu | 0 % | — | — | — |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 39 % | 23 % – 55 % | — | — |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 1 % | 0 % – 5 % | — | — |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,90 | 0,79 – 0,97 | — | — |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,95 | 0,90 – 0,99 | — | — |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,95 – 1,00 | — | — |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,59 | 0,18 – 0,91 | — | — |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 11 % | 0 % – 27 % | — | — |
| Constructeurs : changements de position par concurrent sur la saison | 5,0 | 2,7 – 7,2 | — | — |
| Constructeurs : écart moyen entre voisins (points) — haut | 80,7 | 38,0 – 134,8 | — | — |
| Constructeurs : écart moyen entre voisins (points) — milieu | 35,5 | 20,0 – 53,3 | — | — |
| Constructeurs : écart moyen entre voisins (points) — bas | 19,5 | 3,0 – 41,0 | — | — |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 93 % | 80 % – 100 % | — | — |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 57 % | 50 % – 70 % | — | — |
| Constructeurs : frontières raisonnablement disputées — haut | 36 % | 0 % – 75 % | — | — |
| Constructeurs : frontières raisonnablement disputées — milieu | 64 % | 50 % – 75 % | — | — |
| Constructeurs : frontières raisonnablement disputées — bas | 83 % | 50 % – 100 % | — | — |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 3 % | 0 % – 9 % | — | — |
| Constructeurs : positions déjà acquises — haut | 9 % | 0 % – 25 % | — | — |
| Constructeurs : positions déjà acquises — milieu | 0 % | — | — | — |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 50 % | 27 % – 73 % | — | — |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 4 % | 0 % – 9 % | — | — |

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

