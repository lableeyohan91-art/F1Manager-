# Grille resserrée et pièces plus efficaces : mesure (27/11/2026)

> Demande du porteur : « 8 pièces pour gagner une place, c'est vraiment moche » ; « l'important, c'est à quel point c'est serré ».
> Mesures indicatives (D-120), **rien n'est appliqué au jeu** : notes testées dans des dossiers d'essai (`donnees/voitures-variante-*.csv`).
> 10 graines × 30 saisons, mêmes graines que la référence ; pièces 2 fois plus efficaces (`conception.progression` = 2) dans les deux
> variantes.

## Les notes testées

- Variante C : écart de départ 2,2 → 1,5 % ; mur entre le top 4 et le 5e 0,53 → 0,26 s.
- Variante D : 1,36 % ; même mur ; Audi devant Aston au départ.

## Équilibre (extrait ; tous les indicateurs dans `donnees/`)

| Indicateur (objectif) | Référence | C | D |
| --- | --- | --- | --- |
| Séries de 5 titres consécutifs ou plus (0–25 %) | 60 % | 70 % ✗ | **90 %** ✗ |
| Dominations (≥ 120 points) | 14 % | 12 % | 13 % |
| Titre ouvert avant la dernière manche | 31 % | 36 % | 31 % |
| Champions constructeurs différents | 7,8 | 7,3 | 7,9 |
| Écart 1re–dernière voiture en course | 1,02 % | 0,91 % | 0,98 % |
| Remontées | 31,2 | 32,8 | 31,3 |
| Haas dans les 3 dernières | 53 % | 63 % ✗ | 58 % ✗ |
| Corrélation argent ↔ classement | 0,14 | 0,11 | 0,17 |

## Places gagnées par Cadillac avec l'IA qui développe normalement (notes C, rang de la voiture sur le circuit de chaque Grand Prix)

| | Fin de la 1re saison | Fin de la 2e saison |
| --- | --- | --- |
| Pièces normales | 10,6 | 10,6 / 9,8 / 10,6 |
| Pièces × 2 | 10,0 / 10,8 / 10,4 | 8,4 / 8,4 / 10,6 |

## Lecture, dite franchement

1. **Resserrer la grille ne règle pas le problème et dégrade l'équilibre.** En course, l'écart se resserre peu : la grille se resserre
   déjà d'elle-même au fil des saisons. Les dynasties augmentent (D : 90 %), et Haas reste plus souvent dans le bas.
2. **Les pièces × 2 aident un peu** (environ une place de plus en deux saisons pour Cadillac), mais restent loin de l'objectif de 1 à
   2 places par saison.
3. **La vraie raison** : toutes les écuries développent avec la même règle, aussi bien les unes que les autres. Développer ne fait que
   suivre les autres. On ne gagne de places que si l'on développe **mieux** qu'elles, et aujourd'hui l'IA ne se trompe presque jamais
   (aléa de choix de 0,01).

**Proposition** : ne pas adopter la grille resserrée. Donner au joueur un avantage à **bien décider**, en faisant faire à l'IA de vraies
erreurs de développement selon la compétence de son directeur technique : mauvais concept pour les circuits à venir, mauvaise pièce,
mauvais rythme. Le porteur l'avait demandé (« l'IA DOIT faire des erreurs de développement »). À mesurer.
