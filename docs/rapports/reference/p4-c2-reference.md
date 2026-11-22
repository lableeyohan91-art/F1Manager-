# Rapport d’équilibrage — 100 graines × 10 saisons

Scénario grille-2026, graines 1 à 100, 1000 saisons simulées en 66,4 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 5,9 | 4,0 – 7,0 | 3,0 – 8,0 | 99 % | 6,5 |
| Écuries victorieuses par saison | 3,7 | 3,0 – 5,0 | 2,0 – 5,0 | 98 % | 3,9 |
| Part des victoires de l'écurie dominante | 57 % | 38 % – 79 % | 35 % – 80 % | 87 % | 56 % |
| Taux d’abandon par départ | 8 % | 5 % – 10 % | 5 % – 15 % | 94 % | 8 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,73 | 1,17 – 2,24 | 1,50 – 4,00 | 70 % | 1,73 |
| Écart de points entre les deux premiers | 49 | 7 – 110 | — | — | 44 |
| Changements de leader du championnat | 3,6 | 0,0 – 8,0 | — | — | 3,8 |
| Doublés par saison (toutes écuries) | 6,0 | 2,0 – 10,0 | — | — | 6,4 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,92 | 0,85 – 0,97 | — | — | 0,94 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,97 | 0,64 – 1,33 | — | — | 0,97 |
| Victoires inattendues par saison | 2,1 | 0,0 – 5,0 | — | — | 1,8 |
| Courses sous la pluie par saison | 2,7 | 1,0 – 5,0 | — | — | 2,7 |

## Par série de 10 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 10 saisons | 4,0 | 3,0 – 5,0 | 3,0 – 7,0 | 91 % | 4,1 |
| Champions constructeurs différents sur 10 saisons | 2,4 | 1,0 – 3,0 | — | — | 2,7 |
| Plus longue série de titres constructeurs consécutifs | 5,9 | 3,0 – 10,0 | — | — | 5,4 |
| Écuries sans aucune victoire sur 10 saisons | 5,7 | 5,0 – 7,0 | — | — | 4,8 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 3,1 | 1,0 – 6,0 | — | — | 3,5 |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 32 % | — | 40 % – 90 % | — | 45 % |
| Séries de 10 saisons avec 5 titres constructeurs consécutifs ou plus | 64 % | — | 0 % – 25 % | — | 56 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 36 % | — | — | — | 36 % |
| Retournement à la dernière manche (le leader perd le titre) | 7 % | — | — | — | 8 % |
| Champion et vice-champion coéquipiers | 48 % | — | — | — | 59 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 18 % | — | — | — | 20 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 18 % | — | — | — | 16 % |
| Saisons très serrées (≤ 10 points d’écart) | 15 % | — | — | — | 17 % |
| Dominations (≥ 120 points d’écart) | 8 % | — | — | — | 4 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,44 | 0,39 – 0,50 | — | — | 0,39 |
| Coéquipiers : écart moyen dû aux compétences | 0,23 | 0,15 – 0,31 | — | — | 0,10 |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — | 0,03 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,33 – 0,40 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 31 % | 19 % – 45 % | — | — | 10 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 1 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 70 % | 55 % – 84 % | — | — | 90 % |

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
- Kimi Antoneli (Mercédes) remporte le titre avec 348 points et 3 victoires, 18 points devant George Russel (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 6 fois.
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Audy progresse de la 10e à la 6e place.
- Wiliams recule de la 5e à la 10e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 368 points et 6 victoires, 29 points devant George Russel (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Wiliams progresse de la 10e à la 6e place.
- Audy recule de la 6e à la 9e place.
- Haass termine la saison sans marquer le moindre point.

**2030** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 384 points et 6 victoires, 32 points devant Lewis Hammilton (Ferrary).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 5 fois.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca.
- Victoire surprise de George Russel (Mercédes) à Miamy.
- Victoire surprise de Max Verstapen (Red Bul) à Zandvort, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Monzza.
- Victoire surprise de Isack Hadjard (Red Bul) à Marinna Bay, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Yas Marinna.
- Ferrary progresse de la 4e à la 1re place.
- Wiliams recule de la 6e à la 9e place.

**2031** — champion : Lewis Hammilton
- Lewis Hammilton (Ferrary) remporte le titre avec 444 points et 8 victoires, 49 points devant Charles Leclerq (Ferrary).
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Ferrary signe 9 doublés.
- Victoire surprise de Max Verstapen (Red Bul) à Jedda.
- Victoire surprise de Kimi Antoneli (Mercédes) à Gilles-Villeneuves.
- Victoire surprise de George Russel (Mercédes) à Yas Marinna.
- Wiliams progresse de la 9e à la 6e place.
- Alpyne recule de la 6e à la 9e place.
- Racing Buls recule de la 7e à la 10e place.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 469 points et 11 victoires, 118 points devant Charles Leclerq (Ferrary).
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Alpyne progresse de la 9e à la 5e place.
- Wiliams recule de la 6e à la 9e place.

**2033** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 479 points et 14 victoires, 119 points devant Charles Leclerq (Ferrary).
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Aston Martyn recule de la 7e à la 10e place.

**2034** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 406 points et 7 victoires, 28 points devant Charles Leclerq (Ferrary).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 7 fois.
- Ferrary décroche le titre des constructeurs (19e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca, sous la pluie.
- Victoire surprise de Kimi Antoneli (Mercédes) à Spielbergh.
- Victoire surprise de Max Verstapen (Red Bul) à Spa-Francorchamp.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.

**2035** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 403 points et 10 victoires, 42 points devant George Russel (Mercédes).
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Monzza.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Mercédes progresse de la 4e à la 1re place.
- Ferrary recule de la 1re à la 4e place.
- Haass recule de la 7e à la 11e place.

**2036** — champion : Lando Noris
- Lando Noris (McLarren) remporte le titre avec 375 points et 5 victoires, 13 points devant Kimi Antoneli (Mercédes).
- Retournement lors de la dernière manche : Lando Noris arrache le titre à Kimi Antoneli.
- La tête du championnat a changé 8 fois.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Shangai.
- Victoire surprise de Max Verstapen (Red Bul) à Hermanos Rodrigues.
- Audy recule de la 5e à la 9e place.
- Haass termine la saison sans marquer le moindre point.
- Racing Buls termine la saison sans marquer le moindre point.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

