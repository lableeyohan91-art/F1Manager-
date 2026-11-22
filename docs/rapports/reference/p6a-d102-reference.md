# Rapport d’équilibrage — 100 graines × 10 saisons

Scénario grille-2026, graines 1 à 100, 1000 saisons simulées en 216,9 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 6,1 | 4,0 – 8,0 | 3,0 – 8,0 | 89 % |
| Écuries victorieuses par saison | 4,1 | 3,0 – 6,0 | 2,0 – 5,0 | 84 % |
| Part des victoires de l'écurie dominante | 60 % | 38 % – 83 % | 35 % – 80 % | 80 % |
| Taux d’abandon par départ | 7 % | 5 % – 10 % | 5 % – 15 % | 83 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,52 | 0,91 – 2,24 | 1,50 – 4,00 | 48 % |
| Écart de points entre les deux premiers | 75 | 10 – 161 | — | — |
| Changements de leader du championnat | 2,8 | 0,0 – 7,0 | — | — |
| Doublés par saison (toutes écuries) | 6,1 | 2,0 – 12,0 | — | — |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,90 | 0,78 – 0,97 | — | — |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,02 | 0,67 – 1,40 | — | — |
| Victoires inattendues par saison | 2,0 | 0,0 – 5,0 | — | — |
| Courses sous la pluie par saison | 2,7 | 1,0 – 5,0 | — | — |

## Par série de 10 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Champions pilotes différents sur 10 saisons | 3,1 | 2,0 – 5,0 | 3,0 – 7,0 | 70 % |
| Champions constructeurs différents sur 10 saisons | 2,4 | 1,0 – 4,0 | — | — |
| Plus longue série de titres constructeurs consécutifs | 6,2 | 3,0 – 10,0 | — | — |
| Écuries sans aucune victoire sur 10 saisons | 2,9 | 1,0 – 5,0 | — | — |
| Remontées (+3 places ou plus d’une saison à l’autre) | 5,2 | 3,0 – 8,0 | — | — |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,4 | 1,6 – 3,1 | — | — |
| Transitions de saison sans aucun changement d’étage (D-081) | 18 % | 0 % – 33 % | — | — |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 64 % | — | 40 % – 90 % | — |
| Séries de 10 saisons avec 5 titres constructeurs consécutifs ou plus | 67 % | — | 0 % – 25 % | — |
| Titre encore ouvert avant la dernière manche (définition exacte) | 25 % | — | — | — |
| Retournement à la dernière manche (le leader perd le titre) | 6 % | — | — | — |
| Champion et vice-champion coéquipiers | 44 % | — | — | — |
| Lutte jusqu’à la dernière manche entre coéquipiers | 12 % | — | — | — |
| Lutte jusqu’à la dernière manche entre écuries différentes | 12 % | — | — | — |
| Saisons très serrées (≤ 10 points d’écart) | 10 % | — | — | — |
| Dominations (≥ 120 points d’écart) | 23 % | — | — | — |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,43 | 0,38 – 0,48 | — | — |
| Coéquipiers : écart moyen dû aux compétences | 0,22 | 0,15 – 0,30 | — | — |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — |
| Coéquipiers : écart moyen dû à l’aléa | 0,37 | 0,34 – 0,40 | — | — |
| Coéquipiers : part de l’écart quadratique due aux compétences | 25 % | 15 % – 39 % | — | — |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 75 % | 60 % – 88 % | — | — |

## Chronique d’exemple (graine 1)

**2027** — champion : George Russel
- George Russel (Mercédes) remporte le titre avec 417 points et 8 victoires, 5 points devant Kimi Antoneli (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (10e titre de son histoire).
- Mercédes signe 8 doublés.
- Victoire surprise de Lando Noris (McLarren) à Shangai, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Sakir.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Cadilac termine la saison sans marquer le moindre point.

**2028** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 423 points et 8 victoires, 99 points devant Max Verstapen (Red Bul).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Mercédes signe 5 doublés.
- Audy progresse de la 10e à la 5e place.
- Wiliams recule de la 5e à la 10e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 361 points et 5 victoires, 1 point devant Kimi Antoneli (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Max Verstapen arrache le titre à Kimi Antoneli.
- La tête du championnat a changé 10 fois.
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Aston Martyn recule de la 6e à la 11e place.
- Aston Martyn termine la saison sans marquer le moindre point.

**2030** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 395 points et 7 victoires, 33 points devant Kimi Antoneli (Mercédes).
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca.
- Victoire surprise de Max Verstapen (Red Bul) à Bakou.
- Victoire surprise de Isack Hadjard (Red Bul) à Marinna Bay, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Kimi Antoneli (Mercédes) à Las Vegaz.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- McLarren recule de la 1re à la 4e place.
- Aston Martyn progresse de la 11e à la 7e place.
- Cadilac termine la saison sans marquer le moindre point.

**2031** — champion : Charles Leclerq
- Charles Leclerq (Ferrary) remporte le titre avec 337 points et 5 victoires, 3 points devant Kimi Antoneli (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Charles Leclerq arrache le titre à Kimi Antoneli.
- La tête du championnat a changé 10 fois.
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Lando Noris (McLarren) à Suzuca.
- Victoire surprise de Max Verstapen (Red Bul) à Jedda.
- Victoire surprise de Kimi Antoneli (Mercédes) à Gilles-Villeneuves.
- Victoire surprise de Max Verstapen (Red Bul) à Zandvort.
- Victoire surprise de Oscar Piastry (McLarren) à Madrit, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Marinna Bay, sous la pluie.
- Victoire surprise de Kimi Antoneli (Mercédes) à Austen.
- McLarren progresse de la 4e à la 1re place.
- Haass progresse de la 10e à la 7e place.
- Alpyne recule de la 6e à la 9e place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 435 points et 9 victoires, 129 points devant Isack Hadjard (Red Bul).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Victoire surprise de Julia Neumann (Aston Martyn) à Austen.
- Racing Buls recule de la 5e à la 8e place.

**2033** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 433 points et 12 victoires, 165 points devant Oscar Piastry (McLarren).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (9e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Mercédes) à Albert Parc, sous la pluie.
- Victoire surprise de Lando Noris (McLarren) à Spa-Francorchamp.
- Victoire surprise de Taylor Walsh (Haass) à Bakou.
- Aston Martyn recule de la 7e à la 10e place.

**2034** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 349 points et 9 victoires, 3 points devant Max Verstapen (Red Bul).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Kimi Antoneli arrache le titre à Max Verstapen.
- La tête du championnat a changé 10 fois.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Gabriel Bortoletto (Audy) à Suzuca, sous la pluie.
- Victoire surprise de Kimi Antoneli (Mercédes) à Spielbergh.
- Victoire surprise de Max Verstapen (Red Bul) à Silverston.
- Victoire surprise de Kimi Antoneli (Mercédes) à Spa-Francorchamp.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.
- Victoire surprise de Oscar Piastry (McLarren) à Austen.
- Victoire surprise de Romain Moreau (Alpyne) à Interlagoss.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Alpyne progresse de la 9e à la 6e place.
- Haass recule de la 6e à la 9e place.

**2035** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 374 points et 4 victoires, 59 points devant Max Verstapen (Red Bul).
- La tête du championnat a changé 6 fois.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Anna Kessler (Racing Buls) à Albert Parc.
- Victoire surprise de Taylor Walsh (Haass) à Hermanos Rodrigues.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Ferrary recule de la 5e à la 8e place.

**2036** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 482 points et 12 victoires, 141 points devant Oscar Piastry (McLarren).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Mercédes signe 6 doublés.
- Alpyne progresse de la 6e à la 3e place.
- Cadilac progresse de la 10e à la 5e place.
- Wiliams progresse de la 9e à la 6e place.
- Racing Buls recule de la 5e à la 8e place.
- Audy recule de la 3e à la 10e place.

