# Recherche payée au montant (R1) et pièces plus grosses (R2) : mesure des trois variantes (26/11/2026)

> Demande du porteur : « teste les trois » ; objectifs validés : une pièce 0,05 à 0,15 s par tour, une saison de développement 0,5 à 1 s,
> pas de dégradation des dynasties, des dominations ni du titre ouvert, l'argent qui compte nettement plus.
> Prototypes **désactivés par défaut** (paramètres d'expérience `recherche.montant` et `conception.paquets`) : le jeu n'a pas changé.
> Mesures indicatives (D-120). 10 graines × 30 saisons, mêmes graines pour les quatre ; tous les indicateurs : `donnees/`.

## Les variantes

- **R1, recherche payée au montant.** Le savoir gagné suit l'argent réellement donné au programme (budget de développement × part du
  programme), rapporté à 15 M€ par an, puissance 0,5. Avant, il suivait la seule part du budget.
- **R2, des pièces plus grosses.** Durée de conception et coûts × 4 ; part de l'écart à la frontière comblée × 4, bornée à 60 %. Le
  facteur 4 a été choisi par essai : × 2,5 donnait 0,04 s par pièce, × 6 ne rapportait guère plus.
- **R1 + R2.**

## Une pièce, une saison (3 graines × 2 saisons)

| | Référence | R1 | R2 (× 4) | R1 + R2 |
| --- | --- | --- | --- | --- |
| Pièces montées par écurie et par saison | 9,8 | 9,8 | 3,8 | 5,2 (× 2,5) |
| Gain moyen d'une pièce | 0,030 % (≈ 0,03 s) | 0,030 % | **0,073 % (≈ 0,06 s)** | 0,049 % (× 2,5) |
| 10 % meilleures pièces | 0,06 % | 0,06 % | **0,16 % (≈ 0,14 s)** | 0,10 % (× 2,5) |
| Progression de la grille par saison | ≈ 0,25 s | ≈ 0,25 s | ≈ 0,25 s | ≈ 0,25 s |

- L'objectif « une pièce » n'est atteint que par R2.
- **L'objectif « une saison » (0,5 à 1 s) n'est atteint par aucune variante** : la frontière du savoir monte d'environ 0,56 point par année
  normale dans les quatre cas.

## L'équilibre (10 graines × 30 saisons, extrait ; tableau complet : `donnees/comparaison-tous-indicateurs.md`)

| Indicateur (objectif) | Référence | **R1** | R2 (× 4) | R1 + R2 |
| --- | --- | --- | --- | --- |
| Séries de 5 titres consécutifs ou plus (0–25 %) | 60 % | **50 %** | 80 % ✗ | 100 % ✗ |
| Plus longue série de titres | 5,7 | **4,7** | 5,9 | 5,4 |
| Dominations (≥ 120 points) | 14 % | **7 %** | 11 % | 10 % |
| Titre ouvert avant la dernière manche | 31 % | 32 % | 31 % | 35 % |
| Retournement à la dernière manche | 7 % | 11 % | 7 % | 9 % |
| Champions constructeurs différents | 7,8 | 7,8 | 7,0 ✗ | 7,5 |
| Champions pilotes différents | 14,1 | 13,9 | 11,8 ✗ | 12,6 |
| Dernière écurie qui marque (40–90 %) | 68 % | 66 % | 68 % | 53 % ✗ |
| Écart 1re–dernière voiture | 1,02 % | 1,07 % | 1,01 % | 1,17 % |
| Remontées | 31,2 | 30,8 | 30,0 | 29,3 |
| Vainqueurs différents par saison | 7,6 | 7,8 | 7,6 | 7,4 |
| **Corrélation argent dépensé ↔ classement** | 0,14 | **0,25** | 0,15 | 0,25 |
| Corrélation frontière ↔ classement | 0,28 | 0,40 | 0,18 | 0,36 |
| Écurie la plus souvent dans les 3 dernières | 67 % | 73 % ✗ | 67 % | 70 % |
| Haas dans les 3 dernières | 53 % | **63 %** ✗ | 49 % | 59 % |
| Mercédès dans les 3 dernières / dans les 4 premiers | 26 % / 40 % | **47 % / 29 %** | 33 % / 30 % | 49 % / 23 % |

## Lecture, dite franchement

1. **R1 est la meilleure variante pour l'équilibre et pour l'argent** :
   - dynasties 60 → 50 %, dominations divisées par deux ;
   - l'argent compte nettement plus (corrélation 0,14 → 0,25).

   **Mais elle punit les écuries qui ont peu de budget de développement**, et pas seulement les pauvres :
   - Haas dans les 3 dernières : 53 → 63 % ;
   - Mercédès aussi, qui y tombe 47 % du temps. Ses salaires et son entretien remplissent le plafond, il lui reste peu pour la recherche
     (≈ 40 M€). C'est cohérent avec la règle, mais pas crédible pour une grande écurie.

   À corriger avant adoption : faire compter aussi le **personnel** dans les moyens de la recherche, pas seulement le budget de
   développement.
2. **R2 rend les pièces sensibles, mais dégrade nettement l'équilibre**, comme la tentative du 26/11 : dynasties 80 %, moins de champions
   différents. Les grosses pièces profitent d'abord à l'écurie qui mène. R1 + R2 est la pire : 100 % de dynasties, la dernière écurie
   marque moins souvent.
3. **Le vrai manque pour le joueur est la progression totale** (0,25 s par saison), que ni R1 ni R2 ne change. Grossir les pièces sans
   accélérer le savoir ne fait que concentrer le même gain en moins d'évolutions.

## Propositions (à décider)

- **Adopter R1, corrigé** : les moyens de la recherche = argent du programme + part du personnel technique (déjà payé sous le plafond),
  pour qu'une grande écurie au plafond ne s'effondre pas. Puis mesurer à nouveau.
- **Pour sentir les pièces sans créer de dynasties** : accélérer le savoir pour toute la grille (vers 0,5 à 1 s par saison), avec un
  R2 modéré (× 2), et non × 4. À mesurer.
