# Rapport d’équilibrage — 100 graines × 10 saisons

Scénario grille-2026, graines 1 à 100, 1000 saisons simulées en 8,2 s. Réglages d’expérience : {"course.ecartPiloteParPoint":0.25,"course.aleaSigma":0.25}. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 5,4 | 4,0 – 7,0 | 3,0 – 8,0 | 99 % | 6,5 |
| Écuries victorieuses par saison | 3,6 | 3,0 – 4,0 | 2,0 – 5,0 | 100 % | 3,9 |
| Part des victoires de l'écurie dominante | 58 % | 38 % – 79 % | 35 % – 80 % | 87 % | 56 % |
| Taux d’abandon par départ | 8 % | 5 % – 10 % | 5 % – 15 % | 92 % | 8 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,73 | 1,17 – 2,24 | 1,50 – 4,00 | 70 % | 1,73 |
| Écart de points entre les deux premiers | 75 | 8 – 179 | — | — | 44 |
| Changements de leader du championnat | 3,0 | 0,0 – 7,0 | — | — | 3,8 |
| Doublés par saison (toutes écuries) | 5,0 | 1,0 – 9,0 | — | — | 6,4 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,91 | 0,85 – 0,97 | — | — | 0,94 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,97 | 0,64 – 1,32 | — | — | 0,97 |
| Victoires inattendues par saison | 2,9 | 0,0 – 7,0 | — | — | 1,8 |
| Courses sous la pluie par saison | 2,7 | 1,0 – 5,0 | — | — | 2,7 |

## Par série de 10 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 10 saisons | 3,5 | 2,0 – 5,0 | 3,0 – 7,0 | 79 % | 4,1 |
| Champions constructeurs différents sur 10 saisons | 2,9 | 2,0 – 4,0 | — | — | 2,7 |
| Plus longue série de titres constructeurs consécutifs | 5,1 | 3,0 – 8,0 | — | — | 5,4 |
| Écuries sans aucune victoire sur 10 saisons | 6,3 | 6,0 – 7,0 | — | — | 4,8 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 2,7 | 1,0 – 5,0 | — | — | 3,5 |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 21 % | — | 40 % – 90 % | — | 45 % |
| Séries de 10 saisons avec 5 titres constructeurs consécutifs ou plus | 53 % | — | 0 % – 25 % | — | 56 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 27 % | — | — | — | 36 % |
| Retournement à la dernière manche (le leader perd le titre) | 4 % | — | — | — | 8 % |
| Champion et vice-champion coéquipiers | 29 % | — | — | — | 59 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 10 % | — | — | — | 20 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 16 % | — | — | — | 16 % |
| Saisons très serrées (≤ 10 points d’écart) | 12 % | — | — | — | 17 % |
| Dominations (≥ 120 points d’écart) | 22 % | — | — | — | 4 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,42 | 0,39 – 0,46 | — | — | 0,39 |
| Coéquipiers : écart moyen dû aux compétences | 0,25 | 0,24 – 0,27 | — | — | 0,10 |
| Coéquipiers : écart moyen dû à la forme | 0,03 | 0,02 – 0,04 | — | — | 0,03 |
| Coéquipiers : écart moyen dû à l’aléa | 0,30 | 0,28 – 0,33 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 49 % | 43 % – 56 % | — | — | 10 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 1 % | 0 % – 1 % | — | — | 1 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 51 % | 44 % – 58 % | — | — | 90 % |

## Chronique d’exemple (graine 1)

**2027** — champion : George Russel
- George Russel (Mercédes) remporte le titre avec 419 points et 8 victoires, 32 points devant Kimi Antoneli (Mercédes).
- Mercédes décroche le titre des constructeurs (10e titre de son histoire).
- Mercédes signe 5 doublés.
- Victoire surprise de Lando Noris (McLarren) à Shangai, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Sakir.
- Victoire surprise de Max Verstapen (Red Bul) à Monacco.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Hermanos Rodrigues.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Cadilac termine la saison sans marquer le moindre point.

**2028** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 464 points et 13 victoires, 125 points devant George Russel (Mercédes).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Audy progresse de la 10e à la 6e place.
- Wiliams recule de la 5e à la 8e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 470 points et 13 victoires, 121 points devant Lando Noris (McLarren).
- Une domination sans partage.
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Wiliams progresse de la 8e à la 5e place.
- Haass termine la saison sans marquer le moindre point.

**2030** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 462 points et 12 victoires, 101 points devant Lewis Hammilton (Ferrary).
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Ferrary signe 5 doublés.
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca.
- Victoire surprise de Max Verstapen (Red Bul) à Zandvort, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Monzza.
- Victoire surprise de Max Verstapen (Red Bul) à Madrit.
- Victoire surprise de Max Verstapen (Red Bul) à Bakou.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Victoire surprise de Max Verstapen (Red Bul) à Yas Marinna.
- Ferrary progresse de la 4e à la 1re place.
- McLarren recule de la 1re à la 4e place.
- Wiliams recule de la 5e à la 9e place.
- Cadilac termine la saison sans marquer le moindre point.

**2031** — champion : Lewis Hammilton
- Lewis Hammilton (Ferrary) remporte le titre avec 438 points et 8 victoires, 51 points devant Max Verstapen (Red Bul).
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Jedda.
- Victoire surprise de Max Verstapen (Red Bul) à Monacco.
- Victoire surprise de Max Verstapen (Red Bul) à Zandvort.
- Wiliams progresse de la 9e à la 6e place.
- Alpyne recule de la 6e à la 9e place.
- Racing Buls recule de la 7e à la 11e place.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 533 points et 17 victoires, 198 points devant Lewis Hammilton (Ferrary).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Alpyne progresse de la 9e à la 6e place.

**2033** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 543 points et 18 victoires, 205 points devant Charles Leclerq (Ferrary).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).

**2034** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 465 points et 11 victoires, 98 points devant Charles Leclerq (Ferrary).
- La tête du championnat a changé 4 fois.
- Ferrary décroche le titre des constructeurs (19e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Silverston.
- Victoire surprise de Max Verstapen (Red Bul) à Spa-Francorchamp.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Wiliams progresse de la 8e à la 5e place.
- Haass termine la saison sans marquer le moindre point.

**2035** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 452 points et 14 victoires, 113 points devant Lewis Hammilton (Ferrary).
- Red Bul décroche le titre des constructeurs (9e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Monzza.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Racing Buls termine la saison sans marquer le moindre point.

**2036** — champion : Lando Noris
- Lando Noris (McLarren) remporte le titre avec 365 points et 5 victoires, 6 points devant Max Verstapen (Red Bul).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Lando Noris arrache le titre à Max Verstapen.
- La tête du championnat a changé 8 fois.
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Shangai.
- Victoire surprise de Max Verstapen (Red Bul) à Hermanos Rodrigues.
- McLarren progresse de la 4e à la 1re place.
- Red Bul recule de la 1re à la 4e place.
- Audy recule de la 6e à la 9e place.
- Haass termine la saison sans marquer le moindre point.
- Racing Buls termine la saison sans marquer le moindre point.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

