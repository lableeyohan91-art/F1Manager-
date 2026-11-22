# Rapport d’équilibrage — 100 graines × 10 saisons

Scénario grille-2026, graines 1 à 100, 1000 saisons simulées en 8,2 s. Réglages d’expérience : {"course.ecartPiloteParPoint":0.2,"course.aleaSigma":0.22}. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 5,4 | 4,0 – 7,0 | 3,0 – 8,0 | 99 % | 6,5 |
| Écuries victorieuses par saison | 3,5 | 3,0 – 4,0 | 2,0 – 5,0 | 99 % | 3,9 |
| Part des victoires de l'écurie dominante | 60 % | 38 % – 83 % | 35 % – 80 % | 83 % | 56 % |
| Taux d’abandon par départ | 8 % | 5 % – 10 % | 5 % – 15 % | 92 % | 8 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,73 | 1,17 – 2,24 | 1,50 – 4,00 | 70 % | 1,73 |
| Écart de points entre les deux premiers | 66 | 7 – 162 | — | — | 44 |
| Changements de leader du championnat | 3,1 | 0,0 – 7,0 | — | — | 3,8 |
| Doublés par saison (toutes écuries) | 6,3 | 2,0 – 11,0 | — | — | 6,4 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,92 | 0,86 – 0,97 | — | — | 0,94 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,97 | 0,64 – 1,32 | — | — | 0,97 |
| Victoires inattendues par saison | 1,9 | 0,0 – 5,0 | — | — | 1,8 |
| Courses sous la pluie par saison | 2,7 | 1,0 – 5,0 | — | — | 2,7 |

## Par série de 10 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 10 saisons | 3,7 | 2,0 – 5,0 | 3,0 – 7,0 | 89 % | 4,1 |
| Champions constructeurs différents sur 10 saisons | 2,8 | 2,0 – 4,0 | — | — | 2,7 |
| Plus longue série de titres constructeurs consécutifs | 5,2 | 3,0 – 9,0 | — | — | 5,4 |
| Écuries sans aucune victoire sur 10 saisons | 6,3 | 5,0 – 7,0 | — | — | 4,8 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 2,5 | 1,0 – 5,0 | — | — | 3,5 |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 17 % | — | 40 % – 90 % | — | 45 % |
| Séries de 10 saisons avec 5 titres constructeurs consécutifs ou plus | 55 % | — | 0 % – 25 % | — | 56 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 28 % | — | — | — | 36 % |
| Retournement à la dernière manche (le leader perd le titre) | 8 % | — | — | — | 8 % |
| Champion et vice-champion coéquipiers | 42 % | — | — | — | 59 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 14 % | — | — | — | 20 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 15 % | — | — | — | 16 % |
| Saisons très serrées (≤ 10 points d’écart) | 14 % | — | — | — | 17 % |
| Dominations (≥ 120 points d’écart) | 17 % | — | — | — | 4 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,36 | 0,33 – 0,39 | — | — | 0,39 |
| Coéquipiers : écart moyen dû aux compétences | 0,20 | 0,19 – 0,21 | — | — | 0,10 |
| Coéquipiers : écart moyen dû à la forme | 0,03 | 0,02 – 0,04 | — | — | 0,03 |
| Coéquipiers : écart moyen dû à l’aléa | 0,27 | 0,25 – 0,29 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 44 % | 38 % – 51 % | — | — | 10 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 1 % | 0 % – 1 % | — | — | 1 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 56 % | 48 % – 63 % | — | — | 90 % |

## Chronique d’exemple (graine 1)

**2027** — champion : George Russel
- George Russel (Mercédes) remporte le titre avec 435 points et 9 victoires, 31 points devant Kimi Antoneli (Mercédes).
- Mercédes décroche le titre des constructeurs (10e titre de son histoire).
- Mercédes signe 8 doublés.
- Victoire surprise de Lando Noris (McLarren) à Shangai, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Sakir.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Hermanos Rodrigues.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Cadilac termine la saison sans marquer le moindre point.

**2028** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 444 points et 12 victoires, 99 points devant George Russel (Mercédes).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Audy progresse de la 10e à la 6e place.
- Wiliams recule de la 5e à la 9e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 435 points et 10 victoires, 74 points devant Lando Noris (McLarren).
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Cadilac termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2030** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 436 points et 9 victoires, 61 points devant Lewis Hammilton (Ferrary).
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Ferrary signe 6 doublés.
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca.
- Victoire surprise de George Russel (Mercédes) à Miamy.
- Victoire surprise de Max Verstapen (Red Bul) à Zandvort, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Monzza.
- Victoire surprise de Max Verstapen (Red Bul) à Bakou.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Victoire surprise de Max Verstapen (Red Bul) à Yas Marinna.
- Ferrary progresse de la 4e à la 1re place.
- McLarren recule de la 1re à la 4e place.
- Cadilac termine la saison sans marquer le moindre point.

**2031** — champion : Lewis Hammilton
- Lewis Hammilton (Ferrary) remporte le titre avec 459 points et 11 victoires, 55 points devant Charles Leclerq (Ferrary).
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Ferrary signe 5 doublés.
- Victoire surprise de Max Verstapen (Red Bul) à Jedda.
- Wiliams progresse de la 9e à la 6e place.
- Racing Buls recule de la 7e à la 10e place.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 513 points et 15 victoires, 165 points devant Lewis Hammilton (Ferrary).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Cadilac termine la saison sans marquer le moindre point.

**2033** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 537 points et 18 victoires, 193 points devant Lewis Hammilton (Ferrary).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).

**2034** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 441 points et 9 victoires, 49 points devant Charles Leclerq (Ferrary).
- La tête du championnat a changé 7 fois.
- Ferrary décroche le titre des constructeurs (19e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Haass termine la saison sans marquer le moindre point.

**2035** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 448 points et 14 victoires, 111 points devant Lewis Hammilton (Ferrary).
- Red Bul décroche le titre des constructeurs (9e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Monzza.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Racing Buls termine la saison sans marquer le moindre point.

**2036** — champion : Lando Noris
- Lando Noris (McLarren) remporte le titre avec 365 points et 5 victoires, 26 points devant George Russel (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 7 fois.
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Shangai.
- Victoire surprise de Max Verstapen (Red Bul) à Hermanos Rodrigues.
- McLarren progresse de la 4e à la 1re place.
- Red Bul recule de la 1re à la 4e place.
- Alpyne progresse de la 8e à la 5e place.
- Audy recule de la 6e à la 9e place.
- Haass termine la saison sans marquer le moindre point.
- Racing Buls termine la saison sans marquer le moindre point.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

