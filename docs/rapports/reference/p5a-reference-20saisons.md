# Rapport d’équilibrage — 50 graines × 20 saisons

Scénario grille-2026, graines 1 à 50, 1000 saisons simulées en 127,2 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 6,8 | 5,0 – 9,0 | 3,0 – 8,0 | 83 % |
| Écuries victorieuses par saison | 4,7 | 3,0 – 7,0 | 2,0 – 5,0 | 74 % |
| Part des victoires de l'écurie dominante | 52 % | 33 % – 75 % | 35 % – 80 % | 84 % |
| Taux d’abandon par départ | 7 % | 5 % – 9 % | 5 % – 15 % | 84 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,16 | 0,60 – 2,02 | 1,50 – 4,00 | 25 % |
| Écart de points entre les deux premiers | 67 | 10 – 152 | — | — |
| Changements de leader du championnat | 3,2 | 0,0 – 7,0 | — | — |
| Doublés par saison (toutes écuries) | 4,5 | 1,0 – 9,0 | — | — |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,77 | 0,51 – 0,95 | — | — |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,79 | 0,44 – 1,28 | — | — |
| Victoires inattendues par saison | 2,1 | 0,0 – 5,0 | — | — |
| Courses sous la pluie par saison | 2,8 | 1,0 – 5,0 | — | — |

## Par série de 20 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Champions pilotes différents sur 20 saisons | 6,2 | 4,0 – 8,0 | 3,0 – 7,0 | 80 % |
| Champions constructeurs différents sur 20 saisons | 4,0 | 3,0 – 6,0 | — | — |
| Plus longue série de titres constructeurs consécutifs | 7,4 | 4,0 – 12,0 | — | — |
| Écuries sans aucune victoire sur 20 saisons | 0,9 | 0,0 – 2,0 | — | — |
| Remontées (+3 places ou plus d’une saison à l’autre) | 12,2 | 8,0 – 18,0 | — | — |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,6 | 2,1 – 3,3 | — | — |
| Transitions de saison sans aucun changement d’étage (D-081) | 15 % | 5 % – 26 % | — | — |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 59 % | — | 40 % – 90 % | — |
| Séries de 20 saisons avec 5 titres constructeurs consécutifs ou plus | 88 % | — | 0 % – 25 % | — |
| Titre encore ouvert avant la dernière manche (définition exacte) | 28 % | — | — | — |
| Retournement à la dernière manche (le leader perd le titre) | 5 % | — | — | — |
| Champion et vice-champion coéquipiers | 34 % | — | — | — |
| Lutte jusqu’à la dernière manche entre coéquipiers | 11 % | — | — | — |
| Lutte jusqu’à la dernière manche entre écuries différentes | 17 % | — | — | — |
| Saisons très serrées (≤ 10 points d’écart) | 11 % | — | — | — |
| Dominations (≥ 120 points d’écart) | 17 % | — | — | — |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,45 | 0,40 – 0,52 | — | — |
| Coéquipiers : écart moyen dû aux compétences | 0,25 | 0,17 – 0,35 | — | — |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,33 – 0,40 | — | — |
| Coéquipiers : part de l’écart quadratique due aux compétences | 33 % | 20 % – 49 % | — | — |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 67 % | 51 % – 82 % | — | — |

## Chronique d’exemple (graine 1)

**2027** — champion : George Russel
- George Russel (Mercédes) remporte le titre avec 420 points et 8 victoires, 15 points devant Kimi Antoneli (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (10e titre de son histoire).
- Mercédes signe 8 doublés.
- Victoire surprise de Lando Noris (McLarren) à Shangai, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Sakir.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Hermanos Rodrigues.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Cadilac termine la saison sans marquer le moindre point.

**2028** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 345 points et 3 victoires, 12 points devant Max Verstapen (Red Bul).
- Retournement lors de la dernière manche : Kimi Antoneli arrache le titre à George Russel.
- La tête du championnat a changé 7 fois.
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Audy progresse de la 10e à la 6e place.
- Wiliams recule de la 5e à la 10e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 383 points et 7 victoires, 51 points devant George Russel (Mercédes).
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Wiliams progresse de la 10e à la 6e place.
- Aston Martyn recule de la 5e à la 8e place.
- Audy recule de la 6e à la 9e place.
- Haass termine la saison sans marquer le moindre point.

**2030** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 380 points et 5 victoires, 28 points devant Lewis Hammilton (Ferrary).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 5 fois.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca.
- Victoire surprise de George Russel (Mercédes) à Miamy.
- Victoire surprise de Isack Hadjard (Red Bul) à Marinna Bay, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Yas Marinna.
- Ferrary progresse de la 4e à la 1re place.

**2031** — champion : Charles Leclerq
- Charles Leclerq (Ferrary) remporte le titre avec 417 points et 10 victoires, 96 points devant Max Verstapen (Red Bul).
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Lando Noris (McLarren) à Suzuca.
- Victoire surprise de Max Verstapen (Red Bul) à Jedda.
- Victoire surprise de Kimi Antoneli (Mercédes) à Gilles-Villeneuves.
- Victoire surprise de Max Verstapen (Red Bul) à Monacco.
- Victoire surprise de Oscar Piastry (McLarren) à Madrit, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Marinna Bay, sous la pluie.
- Victoire surprise de George Russel (Mercédes) à Yas Marinna.
- Alpyne recule de la 5e à la 9e place.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 459 points et 10 victoires, 100 points devant Charles Leclerq (Ferrary).
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Racing Buls recule de la 7e à la 10e place.

**2033** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 479 points et 14 victoires, 127 points devant Charles Leclerq (Ferrary).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Wiliams recule de la 7e à la 11e place.

**2034** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 402 points et 7 victoires, 18 points devant Charles Leclerq (Ferrary).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 7 fois.
- Red Bul décroche le titre des constructeurs (9e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca, sous la pluie.
- Victoire surprise de Kimi Antoneli (Mercédes) à Spielbergh.
- Victoire surprise de Max Verstapen (Red Bul) à Spa-Francorchamp.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.
- Victoire surprise de Oscar Piastry (McLarren) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Haass recule de la 5e à la 10e place.

**2035** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 408 points et 11 victoires, 84 points devant George Russel (Mercédes).
- La tête du championnat a changé 4 fois.
- Red Bul décroche le titre des constructeurs (10e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Monzza.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.

**2036** — champion : Lando Noris
- Lando Noris (McLarren) remporte le titre avec 345 points et 5 victoires, 18 points devant George Russel (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 9 fois.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Shangai.
- Victoire surprise de Max Verstapen (Red Bul) à Hermanos Rodrigues.
- Red Bul recule de la 1re à la 4e place.
- Audy recule de la 7e à la 10e place.
- Haass termine la saison sans marquer le moindre point.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

**2037** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 333 points et 7 victoires, 4 points devant George Russel (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Kimi Antoneli arrache le titre à George Russel.
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.

**2038** — champion : George Russel
- George Russel (Mercédes) remporte le titre avec 316 points et 4 victoires, 10 points devant Kimi Antoneli (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : George Russel arrache le titre à Kimi Antoneli.
- La tête du championnat a changé 15 fois.
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Wiliams recule de la 7e à la 10e place.

**2039** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 350 points et 7 victoires, 12 points devant George Russel (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (16e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.

**2040** — champion : Lando Noris
- Lando Noris (McLarren) remporte le titre avec 381 points et 8 victoires, 35 points devant George Russel (Mercédes).
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Wiliams progresse de la 9e à la 5e place.
- Haass termine la saison sans marquer le moindre point.

**2041** — champion : George Russel
- George Russel (Mercédes) remporte le titre avec 374 points et 7 victoires, 63 points devant Max Verstapen (Red Bul).
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (17e titre de son histoire).

**2042** — champion : Lando Noris
- Lando Noris (McLarren) remporte le titre avec 339 points et 8 victoires, 26 points devant Oscar Piastry (McLarren).
- La tête du championnat a changé 8 fois.
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Racing Buls termine la saison sans marquer le moindre point.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2043** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 439 points et 10 victoires, 129 points devant Lando Noris (McLarren).
- Une domination sans partage.
- McLarren décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Oliver Bearmann (Ferrary) à Gilles-Villeneuves, sous la pluie.
- Victoire surprise de George Russel (Mercédes) à Hungarorring.

**2044** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 436 points et 13 victoires, 70 points devant George Russel (Mercédes).
- Mercédes décroche le titre des constructeurs (18e titre de son histoire).
- Alpyne progresse de la 8e à la 5e place.
- Haass progresse de la 11e à la 8e place.
- Audy recule de la 7e à la 10e place.

**2045** — champion : Aoi Inoue
- Aoi Inoue (McLarren) remporte le titre avec 267 points et 3 victoires, 7 points devant Stefano Marchetti (Red Bul).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Aoi Inoue arrache le titre à Stefano Marchetti.
- La tête du championnat a changé 6 fois.
- McLarren décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Cadilac) à Miamy.
- Victoire surprise de Kimi Antoneli (Cadilac) à Austen.
- Alpyne progresse de la 5e à la 2e place.
- Wiliams progresse de la 7e à la 4e place.
- Cadilac progresse de la 9e à la 5e place.
- Mercédes recule de la 1re à la 6e place.
- Ferrary recule de la 4e à la 7e place.
- Racing Buls progresse de la 11e à la 8e place.
- Aston Martyn recule de la 6e à la 9e place.

**2046** — champion : Stefano Marchetti
- Stefano Marchetti (Red Bul) remporte le titre avec 335 points et 7 victoires, 127 points devant Aoi Inoue (McLarren).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (11e titre de son histoire).
- Ferrary progresse de la 7e à la 4e place.
- Wiliams recule de la 4e à la 7e place.

