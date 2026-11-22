# Rapport d’équilibrage — 100 graines × 10 saisons

Scénario grille-2026, graines 1 à 100, 1000 saisons simulées en 89,9 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 6,0 | 4,0 – 8,0 | 3,0 – 8,0 | 96 % |
| Écuries victorieuses par saison | 3,9 | 3,0 – 5,0 | 2,0 – 5,0 | 95 % |
| Part des victoires de l'écurie dominante | 57 % | 38 % – 79 % | 35 % – 80 % | 86 % |
| Taux d’abandon par départ | 8 % | 5 % – 10 % | 5 % – 15 % | 93 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,55 | 0,95 – 2,24 | 1,50 – 4,00 | 51 % |
| Écart de points entre les deux premiers | 53 | 8 – 118 | — | — |
| Changements de leader du championnat | 3,4 | 0,0 – 7,0 | — | — |
| Doublés par saison (toutes écuries) | 6,1 | 2,0 – 11,0 | — | — |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,89 | 0,79 – 0,97 | — | — |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,00 | 0,64 – 1,40 | — | — |
| Victoires inattendues par saison | 2,3 | 0,0 – 5,0 | — | — |
| Courses sous la pluie par saison | 2,7 | 1,0 – 5,0 | — | — |

## Par série de 10 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Champions pilotes différents sur 10 saisons | 3,9 | 3,0 – 5,0 | 3,0 – 7,0 | 93 % |
| Champions constructeurs différents sur 10 saisons | 2,4 | 1,0 – 3,0 | — | — |
| Plus longue série de titres constructeurs consécutifs | 5,9 | 3,0 – 10,0 | — | — |
| Écuries sans aucune victoire sur 10 saisons | 4,9 | 3,0 – 6,0 | — | — |
| Remontées (+3 places ou plus d’une saison à l’autre) | 3,7 | 1,0 – 7,0 | — | — |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 1,9 | 1,3 – 2,9 | — | — |
| Transitions de saison sans aucun changement d’étage (D-081) | 23 % | 0 % – 44 % | — | — |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 44 % | — | 40 % – 90 % | — |
| Séries de 10 saisons avec 5 titres constructeurs consécutifs ou plus | 66 % | — | 0 % – 25 % | — |
| Titre encore ouvert avant la dernière manche (définition exacte) | 34 % | — | — | — |
| Retournement à la dernière manche (le leader perd le titre) | 7 % | — | — | — |
| Champion et vice-champion coéquipiers | 48 % | — | — | — |
| Lutte jusqu’à la dernière manche entre coéquipiers | 17 % | — | — | — |
| Lutte jusqu’à la dernière manche entre écuries différentes | 17 % | — | — | — |
| Saisons très serrées (≤ 10 points d’écart) | 14 % | — | — | — |
| Dominations (≥ 120 points d’écart) | 10 % | — | — | — |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,44 | 0,39 – 0,50 | — | — |
| Coéquipiers : écart moyen dû aux compétences | 0,24 | 0,16 – 0,32 | — | — |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,33 – 0,40 | — | — |
| Coéquipiers : part de l’écart quadratique due aux compétences | 31 % | 19 % – 46 % | — | — |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 69 % | 54 % – 83 % | — | — |

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

