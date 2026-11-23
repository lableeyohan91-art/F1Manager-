# Rapport d’équilibrage — 50 graines × 20 saisons

Scénario grille-2026, graines 1 à 50, 1000 saisons simulées en 1 670,5 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 7,2 | 4,0 – 10,0 | 3,0 – 8,0 | 72 % | 7,2 |
| Écuries victorieuses par saison | 5,1 | 3,0 – 7,0 | 2,0 – 5,0 | 59 % | 5,1 |
| Part des victoires de l'écurie dominante | 52 % | 29 % – 79 % | 35 % – 80 % | 74 % | 52 % |
| Taux d’abandon par départ | 6 % | 3 % – 9 % | 5 % – 15 % | 61 % | 6 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,18 | 0,61 – 2,11 | 1,50 – 4,00 | 27 % | 1,17 |
| Écart de points entre les deux premiers | 72 | 10 – 157 | — | — | 69 |
| Changements de leader du championnat | 3,0 | 0,0 – 7,0 | — | — | 3,1 |
| Doublés par saison (toutes écuries) | 4,2 | 1,0 – 9,0 | — | — | 4,3 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,81 | 0,60 – 0,95 | — | — | 0,82 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,86 | 0,49 – 1,28 | — | — | 0,86 |
| Victoires inattendues par saison | 2,2 | 0,0 – 5,0 | — | — | 2,0 |
| Courses sous la pluie par saison | 2,8 | 1,0 – 5,0 | — | — | 2,8 |

## Par série de 20 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 20 saisons | 7,4 | 6,0 – 10,0 | 3,0 – 7,0 | 50 % | 7,4 |
| Champions constructeurs différents sur 20 saisons | 4,3 | 3,0 – 6,0 | — | — | 4,6 |
| Plus longue série de titres constructeurs consécutifs | 5,9 | 3,0 – 8,0 | — | — | 6,2 |
| Écuries sans aucune victoire sur 20 saisons | 0,5 | 0,0 – 2,0 | — | — | 0,3 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 19,5 | 12,0 – 26,0 | — | — | 18,9 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 3,4 | 2,7 – 3,9 | — | — | 3,3 |
| Transitions de saison sans aucun changement d’étage (D-081) | 8 % | 0 % – 21 % | — | — | 10 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 74 % | — | 40 % – 90 % | — | 74 % |
| Séries de 20 saisons avec 5 titres constructeurs consécutifs ou plus | 72 % | — | 0 % – 25 % | — | 68 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 23 % | — | — | — | 26 % |
| Retournement à la dernière manche (le leader perd le titre) | 5 % | — | — | — | 5 % |
| Champion et vice-champion coéquipiers | 32 % | — | — | — | 34 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 7 % | — | — | — | 8 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 16 % | — | — | — | 17 % |
| Saisons très serrées (≤ 10 points d’écart) | 11 % | — | — | — | 12 % |
| Dominations (≥ 120 points d’écart) | 19 % | — | — | — | 18 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,44 | 0,39 – 0,50 | — | — | 0,44 |
| Coéquipiers : écart moyen dû aux compétences | 0,24 | 0,17 – 0,32 | — | — | 0,24 |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — | 0,01 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,34 – 0,39 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 30 % | 18 % – 44 % | — | — | 29 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 70 % | 55 % – 84 % | — | — | 70 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,89 | 0,82 – 0,95 | — | — | 0,90 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,95 | 0,92 – 0,98 | — | — | 0,95 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 0,99 | — | — | 0,98 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,34 | 0,82 – 1,91 | — | — | 1,32 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 34 % | 18 % – 50 % | — | — | 34 % |
| Pilotes : changements de position par concurrent sur la saison | 8,5 | 6,0 – 10,8 | — | — | 8,4 |
| Pilotes : écart moyen entre voisins (points) — haut | 46,2 | 26,4 – 65,0 | — | — | 45,5 |
| Pilotes : écart moyen entre voisins (points) — milieu | 18,3 | 10,0 – 28,0 | — | — | 18,6 |
| Pilotes : écart moyen entre voisins (points) — bas | 5,2 | 1,8 – 8,2 | — | — | 5,2 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 96 % | 90 % – 100 % | — | — | 96 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 74 % | 67 % – 81 % | — | — | 74 % |
| Pilotes : frontières raisonnablement disputées — haut | 36 % | 20 % – 60 % | — | — | 37 % |
| Pilotes : frontières raisonnablement disputées — milieu | 70 % | 57 % – 86 % | — | — | 70 % |
| Pilotes : frontières raisonnablement disputées — bas | 97 % | 89 % – 100 % | — | — | 97 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 2 % | 0 % – 5 % | — | — | 2 % |
| Pilotes : positions déjà acquises — haut | 8 % | 0 % – 20 % | — | — | 8 % |
| Pilotes : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 39 % | 18 % – 59 % | — | — | 39 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 0 % – 5 % | — | — | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,91 | 0,83 – 0,97 | — | — | 0,91 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,95 | 0,91 – 0,99 | — | — | 0,96 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,95 – 1,00 | — | — | 0,98 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,56 | 0,18 – 0,91 | — | — | 0,52 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 11 % | 0 % – 27 % | — | — | 10 % |
| Constructeurs : changements de position par concurrent sur la saison | 5,2 | 2,9 – 7,4 | — | — | 5,0 |
| Constructeurs : écart moyen entre voisins (points) — haut | 118,7 | 58,3 – 180,5 | — | — | 118,8 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 36,0 | 18,0 – 57,0 | — | — | 36,9 |
| Constructeurs : écart moyen entre voisins (points) — bas | 18,3 | 3,0 – 39,0 | — | — | 18,0 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 87 % | 80 % – 100 % | — | — | 87 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 53 % | 40 % – 70 % | — | — | 53 % |
| Constructeurs : frontières raisonnablement disputées — haut | 26 % | 0 % – 50 % | — | — | 26 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 64 % | 25 % – 100 % | — | — | 64 % |
| Constructeurs : frontières raisonnablement disputées — bas | 84 % | 50 % – 100 % | — | — | 86 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 7 % | 0 % – 18 % | — | — | 6 % |
| Constructeurs : positions déjà acquises — haut | 18 % | 0 % – 50 % | — | — | 18 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 48 % | 27 % – 73 % | — | — | 48 % |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 8 % | 0 % – 18 % | — | — | 8 % |

## Chronique d’exemple (graine 1)

**2027** — champion : George Russel
- George Russel (Mercédes) remporte le titre avec 417 points et 8 victoires, 12 points devant Kimi Antoneli (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (10e titre de son histoire).
- Mercédes signe 7 doublés.
- Victoire surprise de Lando Noris (McLarren) à Shangai, sous la pluie.
- Victoire surprise de Lando Noris (McLarren) à Suzuca.
- Victoire surprise de Max Verstapen (Red Bul) à Sakir.
- Victoire surprise de Lewis Hammilton (Ferrary) à Zandvort, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Cadilac termine la saison sans marquer le moindre point.

**2028** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 427 points et 6 victoires, 71 points devant Max Verstapen (Red Bul).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Mercédes signe 5 doublés.
- Audy progresse de la 10e à la 7e place.
- Wiliams recule de la 5e à la 8e place.

**2029** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 408 points et 8 victoires, 31 points devant Kimi Antoneli (McLarren).
- La tête du championnat a changé 9 fois.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Wiliams progresse de la 8e à la 5e place.
- Cadilac termine la saison sans marquer le moindre point.

**2030** — champion : Lando Noris
- Lando Noris (Mercédes) remporte le titre avec 406 points et 7 victoires, 27 points devant Oscar Piastry (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Mercédes signe 7 doublés.
- Victoire surprise de Kimi Antoneli (McLarren) à Shangai, sous la pluie.
- Victoire surprise de Kimi Antoneli (McLarren) à Gilles-Villeneuves.
- Victoire surprise de Kimi Antoneli (McLarren) à Hermanos Rodrigues.
- Wiliams recule de la 5e à la 8e place.
- Audy termine la saison sans marquer le moindre point.

**2031** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 456 points et 11 victoires, 104 points devant Isack Hadjard (Ferrary).
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Victoire surprise de Oscar Piastry (Mercédes) à Madrit, sous la pluie.
- Victoire surprise de Oscar Piastry (Mercédes) à Bakou.
- Audy termine la saison sans marquer le moindre point.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Isack Hadjard
- Isack Hadjard (Ferrary) remporte le titre avec 350 points et 4 victoires, 35 points devant Kimi Antoneli (Mercédes).
- La tête du championnat a changé 7 fois.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Max Verstapen (Aston Martyn) à Spielbergh.
- Victoire surprise de Kimi Antoneli (Mercédes) à Hungarorring.
- Victoire surprise de Oscar Piastry (Wiliams) à Bakou.
- Victoire surprise de Max Verstapen (Aston Martyn) à Marinna Bay.
- Victoire surprise de Louis Lambert (Alpyne) à Austen.

**2033** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 466 points et 13 victoires, 155 points devant Isack Hadjard (Ferrary).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Ferrary signe 5 doublés.
- Victoire surprise de Louis Lambert (Alpyne) à Suzuca.
- Victoire surprise de Oliver Bearmann (Cadilac) à Silverston, sous la pluie.
- Victoire surprise de Samuel Carlisle (Racing Buls) à Las Vegaz.
- Aston Martyn recule de la 4e à la 10e place.

**2034** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 450 points et 12 victoires, 114 points devant Oscar Piastry (McLarren).
- La tête du championnat a changé 6 fois.
- Ferrary décroche le titre des constructeurs (19e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Mercédes) à Shangai.
- Victoire surprise de Anna Lehmann (Alpyne) à Suzuca, sous la pluie.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.
- Aston Martyn progresse de la 10e à la 6e place.
- Red Bul recule de la 5e à la 8e place.
- Haass recule de la 7e à la 11e place.
- Red Bul, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2035** — champion : Max Verstapen
- Max Verstapen (Mercédes) remporte le titre avec 392 points et 10 victoires, 24 points devant Kimi Antoneli (Ferrary).
- La tête du championnat a changé 13 fois.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Oscar Piastry (McLarren) à Monacco.

**2036** — champion : Max Verstapen
- Max Verstapen (Mercédes) remporte le titre avec 412 points et 9 victoires, 81 points devant Kimi Antoneli (Ferrary).
- La tête du championnat a changé 7 fois.
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Ferrary) à Suzuca.
- Victoire surprise de Oscar Piastry (Ferrary) à Spielbergh.

**2037** — champion : Kimi Antoneli
- Kimi Antoneli (Ferrary) remporte le titre avec 386 points et 10 victoires, 11 points devant Louis Lambert (Alpyne).
- Retournement lors de la dernière manche : Kimi Antoneli arrache le titre à Louis Lambert.
- Ferrary décroche le titre des constructeurs (20e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Ferrary) à Suzuca.
- Victoire surprise de Samuel Carlisle (Racing Buls) à Zandvort, sous la pluie.
- Victoire surprise de Samuel Carlisle (Racing Buls) à Madrit.
- Aston Martyn recule de la 6e à la 9e place.

**2038** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 430 points et 10 victoires, 60 points devant Louis Lambert (Alpyne).
- Mercédes décroche le titre des constructeurs (16e titre de son histoire).
- Aston Martyn progresse de la 9e à la 4e place.
- Haass termine la saison sans marquer le moindre point.

**2039** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 365 points et 9 victoires, 132 points devant Louis Lambert (Audy).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Fleur Postma (Ferrary) à Jedda.
- Victoire surprise de Oscar Piastry (Racing Buls) à Silverston.
- Victoire surprise de Oscar Piastry (Racing Buls) à Austen.
- Victoire surprise de Samuel Carlisle (Aston Martyn) à Lussail.
- McLarren progresse de la 6e à la 2e place.
- Audy progresse de la 10e à la 5e place.
- Alpyne recule de la 2e à la 6e place.
- Wiliams recule de la 5e à la 8e place.

**2040** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 420 points et 9 victoires, 55 points devant Max Verstapen (McLarren).
- La tête du championnat a changé 8 fois.
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- McLarren signe 6 doublés.
- Victoire surprise de Kimi Antoneli (Ferrary) à Shangai.
- Victoire surprise de Louis Lambert (Audy) à Suzuca.
- Victoire surprise de Kimi Antoneli (Ferrary) à Sakir.
- Victoire surprise de Taylor Prescott (Alpyne) à Jedda.
- Victoire surprise de Louis Lambert (Audy) à Silverston.
- Victoire surprise de Kimi Antoneli (Ferrary) à Madrit.
- Victoire surprise de Kimi Antoneli (Ferrary) à Marinna Bay.
- Victoire surprise de Taylor Prescott (Alpyne) à Austen, sous la pluie.
- Red Bul progresse de la 10e à la 5e place.
- Aston Martyn recule de la 4e à la 9e place.
- Racing Buls recule de la 7e à la 10e place.
- Red Bul, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2041** — champion : Louis Lambert
- Louis Lambert (McLarren) remporte le titre avec 452 points et 10 victoires, 63 points devant Oscar Piastry (McLarren).
- La tête du championnat a changé 4 fois.
- McLarren décroche le titre des constructeurs (13e titre de son histoire).
- McLarren signe 7 doublés.
- Victoire surprise de Kimi Antoneli (Ferrary) à Zandvort, sous la pluie.
- Haass progresse de la 11e à la 5e place.
- Audy recule de la 4e à la 10e place.
- Cadilac recule de la 8e à la 11e place.

**2042** — champion : Louis Lambert
- Louis Lambert (McLarren) remporte le titre avec 362 points et 9 victoires, 17 points devant Kimi Antoneli (McLarren).
- McLarren décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Samuel Carlisle (Ferrary) à Hungarorring, sous la pluie.
- Victoire surprise de Samuel Carlisle (Ferrary) à Zandvort, sous la pluie.
- Victoire surprise de Fleur Postma (Ferrary) à Las Vegaz.
- Aston Martyn progresse de la 8e à la 2e place.
- Wiliams progresse de la 7e à la 3e place.
- Mercédes recule de la 2e à la 7e place.
- Red Bul recule de la 3e à la 9e place.

**2043** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 311 points et 4 victoires, 50 points devant Louis Lambert (Alpyne).
- McLarren décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Oscar Piastry (Alpyne) à Sakir.
- Victoire surprise de Louis Lambert (Alpyne) à Zandvort.
- Victoire surprise de Markus Albrecht (Audy) à Monzza.
- Victoire surprise de Anna Kessler (Cadilac) à Bakou.
- Victoire surprise de Markus Albrecht (Audy) à Lussail.
- Alpyne progresse de la 5e à la 2e place.
- Red Bul progresse de la 9e à la 4e place.
- Audy progresse de la 8e à la 5e place.
- Aston Martyn recule de la 2e à la 7e place.
- Ferrary recule de la 6e à la 10e place.

**2044** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 264 points et 5 victoires, 5 points devant Louis Lambert (Alpyne).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 4 fois.
- McLarren décroche le titre des constructeurs (16e titre de son histoire).
- Victoire surprise de Markus Albrecht (Ferrary) à Albert Parc.
- Victoire surprise de Louis Lambert (Alpyne) à Shangai, sous la pluie.
- Victoire surprise de Markus Albrecht (Ferrary) à Gilles-Villeneuves.
- Victoire surprise de Louis Lambert (Alpyne) à Catalunia.
- Victoire surprise de Anna Kessler (Cadilac) à Las Vegaz.
- Victoire surprise de Louis Lambert (Alpyne) à Lussail.
- Mercédes progresse de la 8e à la 3e place.
- Ferrary progresse de la 10e à la 6e place.
- Wiliams recule de la 3e à la 7e place.
- Audy recule de la 5e à la 11e place.

**2045** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 354 points et 7 victoires, 1 point devant Louis Lambert (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Álvaro Ferrer (Racing Buls) à Zandvort, sous la pluie.
- Victoire surprise de Markus Albrecht (Ferrary) à Las Vegaz, sous la pluie.
- Victoire surprise de Markus Albrecht (Ferrary) à Yas Marinna.
- Cadilac progresse de la 8e à la 4e place.
- Haass recule de la 4e à la 7e place.
- Audy progresse de la 11e à la 8e place.
- Ferrary recule de la 6e à la 9e place.

**2046** — champion : Louis Lambert
- Louis Lambert (Mercédes) remporte le titre avec 337 points et 6 victoires, 9 points devant Anna Kessler (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Louis Lambert arrache le titre à Anna Kessler.
- Mercédes décroche le titre des constructeurs (19e titre de son histoire).
- Victoire surprise de Markus Albrecht (Ferrary) à Silverston.
- Ferrary progresse de la 9e à la 3e place.
- Audy progresse de la 8e à la 5e place.
- Alpyne recule de la 3e à la 7e place.
- Aston Martyn progresse de la 11e à la 8e place.
- Wiliams recule de la 6e à la 10e place.
- Haass recule de la 7e à la 11e place.

