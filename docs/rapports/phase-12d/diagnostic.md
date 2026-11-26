# Phase 12d — diagnostic des hiérarchies (26/11/2026)

> Demande du porteur : pourquoi le bas de grille ne tourne pas, pourquoi on plafonne vers la 5e place, et le savoir est-il au maximum
> après 30 saisons ? **Aucun réglage modifié** : observation seule. 10 graines × 30 saisons, code du commit 07d5160.
> Outils : `tools/diagnostic-hierarchies.mts` (collecte), `tools/analyse-diagnostic-hierarchies.py` (synthèse). Données : `donnees/`.

## 1. Le savoir sature et les réformes ne le remettent presque pas à zéro (intuition du porteur confirmée)

| Saison | Savoir fondamental (moyenne) | Frontière (moyenne) | Part du plafond atteinte | Écart de frontière 1re–11e |
| --- | --- | --- | --- | --- |
| 2027 | 7,5 | 12,6 | 54 % | 4,5 |
| 2033 | 16,0 | 16,1 | 79 % | 3,5 |
| 2040 | 24,8 | 17,7 | 91 % | 2,4 |
| 2045 | 30,0 | 18,1 | 93 % | 2,1 |
| 2051 | 36,0 | 18,2 | 94 % | 1,8 |

- Le savoir de fond grandit sans fin (7,5 → 40 en 30 ans). Même compté à 30 % sous un nouveau règlement, il suffit vite à atteindre le plafond.
- L'année d'une grande réforme, la frontière moyenne ne baisse que de **0,5 point** (+0,3 une année normale) : une nouvelle ère ne
  ressemble pas du tout au début du jeu. Après 2040, toutes les écuries sont à plus de 90 % du plafond, à 2 points les unes des autres.

## 2. Ce qui fait la place au championnat (saisons 5 à 30)

| Étage (place) | Indice voiture | Pilotes | Productivité | Développement payé | Frontière | Pièces montées moins bonnes |
| --- | --- | --- | --- | --- | --- | --- |
| 1–4 | 23,68 | 16,59 | 0,84 | 64,4 M€ | 17,78 | 7 % |
| 5–8 | 23,12 | 16,11 | 0,81 | 64,7 M€ | 17,52 | 6 % |
| 9–11 | 22,09 | 15,73 | 0,77 | 55,6 M€ | 16,86 | 6 % |

Corrélation de rang avec la place : voiture 0,71 ; frontière 0,42 ; pilotes 0,41 ; productivité 0,40 ; **argent dépensé 0,14**.
- Le haut n'est pas plus riche que le milieu (64 M€ dans les deux cas) ; son avance tient à la voiture, aux pilotes et au personnel.
- Les grandes se trompent autant que les autres sur leurs pièces (≈ 6–7 % de pièces montées moins bonnes que la précédente).

## 3. Le bas de grille : une écurie y reste presque toujours

| Indicateur (par partie de 30 saisons) | Mesure |
| --- | --- |
| Écuries différentes passées par les 3 dernières places | 9,2 sur 11 |
| Écuries différentes dernières au moins une fois | 5,7 |
| Plus longue série d'une même écurie dans les 3 dernières places | **21,5 saisons** (jusqu'à 29) |
| Écurie la plus souvent dans les 3 dernières | **84 % des saisons** |

| Écurie | Saisons dans les 3 dernières | Saisons dans les 4 premières |
| --- | --- | --- |
| Haass | **75 %** | 6 % |
| Cadillac | 49 % | 16 % |
| Audy | 39 % | 21 % |
| Aston | 32 % | 16 % |
| Racing Bulls | 26 % | 24 % |
| Alpine | 24 % | 40 % |
| Williams | 18 % | 41 % |
| Red Bul | 14 % | 42 % |
| Ferrary | 9 % | 58 % |
| Mercédès | 8 % | 70 % |
| McLaren | 7 % | 68 % |

Le haut tourne et le milieu bouge (Alpine et Williams passent 40 % de leurs saisons dans les 4 premières). Mais **une écurie reste
coincée en bas** : Haas, 75 % des saisons dans les 3 dernières, jusqu'à 29 saisons de suite. C'est le piège de la pauvreté.

## 4. Pistes (à discuter, rien n'est décidé)

1. **Une vraie nouvelle ère à chaque grande réforme** : le savoir de fond s'use à chaque réforme (une partie seulement survit), ou il est
   plafonné ; la frontière d'une nouvelle ère repart nettement plus bas, et la préparation du règlement redevient décisive.
2. **Piège de la pauvreté** : leviers déjà listés (dividendes, pilotes payants, sponsors d'opportunité, objectifs du propriétaire, moteurs).
3. **Recherche et soufflerie de l'IA** : avec une vraie remise à zéro des ères, préparer l'avenir rapporterait enfin ; l'IA aurait raison
   d'y consacrer des heures.
