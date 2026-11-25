# D-166, D-167, D-168 : budget payé, retraites annoncées, demandes bloquantes (25/11/2026)

> Suite aux réponses du porteur sur les choix de l'audit des phases 1 à 11 (D-165).
> Mesures **indicatives** (D-120). Référence conservée : `docs/rapports/audit-phases-1-11/donnees/campagne-audit-apres.md`, mêmes 20 graines × 10 saisons.

## 1. Ce qui change

| Décision | Avant | Après |
| --- | --- | --- |
| **D-166 Budget** | La voiture progressait selon le budget **prévu** ; une seule modification par trimestre pour bloquer le contournement | Elle progresse selon l'argent **réellement payé** à la dernière écriture comptable (toutes les 4 semaines). Budget modifiable **à tout moment** |
| **D-167 Retraites** | Décidées en semaine 49, après le marché ; contrat protecteur jusqu'à 41 ans | **Annoncées en semaine 24**, avant le marché. Plus aucune protection. Rare retraite surprise en fin de saison. Envie d'arrêter accrue après 30 ans |
| **D-168 Demandes** | Visibles mais non bloquantes ; refus par silence au bout de 8 semaines | Augmentation, départ, contre-proposition (domaine non délégué) **bloquent le temps**, marquées « ❗ ». Choix : accepter, refuser ou **ne pas répondre** |

## 2. Retraites des pilotes (`tools/retraites-pilotes.mts`, `tools/demographie.mts`, 10 graines × 15 saisons)

Pilotes titulaires qui arrêtent d'eux-mêmes :

| Indicateur | Avant | Après | Cible du porteur |
| --- | --- | --- | --- |
| Âge moyen | 37,4 ans | **34,5 ans** | 34–35 ✔ |
| Avant 33 ans | 3 % avant 32 ans (tranche à 33 non mesurée) | **22 %** | ≈ 25 % (presque) |
| 41 ans et plus, tous | 27 % | **7 %** | ≤ 2 % ✘ |
| 41 ans et plus, hors pilotes déjà âgés au départ | — | **1 %** | ≤ 2 % ✔ |

- **Les 7 % de 41 ans et plus** viennent presque tous du pilote de la grille 2026 qui a déjà 41 ans au départ : il arrête à 42 ans en 2027, dans 6 graines sur 10. Ce n'est pas un défaut du modèle : ce pilote existe ainsi dans la réalité.
- Sur les pilotes nés dans le jeu ou âgés de 32 ans ou moins au départ : âge moyen 34,0 ans, 24 % avant 33 ans, 1 % à 41 ans et plus.

Démographie, tous indicateurs suivis :

| Indicateur | Avant | Après |
| --- | --- | --- |
| Débutants en F1 par saison (cible 2–4) | 2,61 | 2,86 |
| Carrière en F1 à la retraite (saisons, cible 6–10) | 9,6 | 9,8 |
| Âge de retraite, tous pilotes passés par la F1 | 33,3 | 32,8 |
| Titulaires de 36 ans ou plus | 8 % | **3 %** |
| Titulaires de 40 ans ou plus | 2 % | **0 %** |
| Titulaire le plus âgé | 45 ans | 41 ans |
| Âge moyen des titulaires en 2041 | 29,9 | 28,0 |
| Niveau moyen des titulaires en 2041 | 16,23 | 16,11 |
| Retraites par saison (toutes personnes) | 37,96 | 38,11 |
| Talents jamais arrivés en F1 | 13 % | 11 % |

**Défavorable**
- Le niveau moyen de la grille baisse légèrement (−0,1) : des pilotes encore bons arrêtent plus tôt.
- Les pilotes passés par la F1 mais **sans baquet** (réservistes, libres) prennent encore leur retraite tard, parfois après 40 ans. Ce sont des fins de carrière en coulisses, sans effet sur la grille. Non recalibré.

## 3. Courses (campagne 20 graines × 10 saisons, même référence)

| Indicateur | Référence | Après |
| --- | --- | --- |
| Vainqueurs différents par saison | 5,7 | 5,8 |
| Écuries victorieuses par saison | 4,0 | 4,0 |
| Part des victoires de l'écurie dominante | 59 % | 58 % |
| Victoires inattendues par saison | 2,0 | 2,2 |
| Écart de points entre les deux premiers | 61 | 59 |
| Changements de leader | 2,7 | 2,8 |
| Doublés par saison | 4,9 | 4,5 |
| Corrélation voiture ↔ points | 0,89 | 0,87 |
| Champions pilotes différents sur 10 saisons | 4,2 | 4,5 |
| Champions constructeurs différents sur 10 saisons | 2,8 | **2,5** |
| Plus longue série de titres constructeurs | 5,3 | 5,2 |
| Séries avec 5 titres consécutifs ou plus (objectif 0–25 %) | 55 % | **55 %, toujours non atteint** |
| Écuries sans victoire sur 10 saisons | 3,5 | 3,0 |
| Remontées (+3 places) | 5,5 | 6,6 |
| Dernière écurie avec au moins 1 point | 59 % | 56 % |
| Titre ouvert avant la dernière manche | 32 % | 32 % |
| Pluie par saison | 2,2 | 2,2 |

Tous les autres indicateurs : `donnees/campagne-apres.md`.

**Lecture**
- Effet global faible, dans le bruit de mesure.
- Un peu plus de champions pilotes différents : le renouvellement des pilotes compte.
- **Défavorable** : un peu moins de champions constructeurs différents (2,8 → 2,5).
- Les dynasties restent hors objectif : chantier de la phase 12, comme convenu.

## 4. Vérifications

- 523 tests, tous verts, dont :
  - 5 nouveaux dans `tests/demandes-bloquantes.test.ts`, migration du format 30 comprise ;
  - les tests de l'audit adaptés au budget payé et aux retraites annoncées.
- Pureté du moteur vérifiée.
- Parcours complet dans le navigateur réussi (34 étapes).
- **Non vérifié à l'écran** : le blocage lui-même et le « ❗ ». Le parcours automatique ne provoque pas de demande. Le comportement est vérifié par les tests (le temps n'avance pas tant qu'une demande attend).
