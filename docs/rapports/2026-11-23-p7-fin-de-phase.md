# Rapport court — Fin de la phase 7 (7b, 7c) et archivage

> Date : 23/11/2026. Mesures **indicatives** (D-120). Code mesuré : commit 95f96b2, comparé à la référence 7a (mêmes graines).
> Références : `docs/rapports/reference/p7-reference.*` (100 graines × 10 saisons).

## 1. Livré

| Élément | Décision | Tests |
| --- | --- | --- |
| Archivage des retraités anciens | D-121 | `tests/archivage.test.ts` |
| 7b : marché du personnel, remplacement, non-concurrence, départs en groupe, lassitude, candidatures spontanées | D-123 | `tests/personnel.test.ts` |
| 7c : popularité, valeur commerciale, sponsors personnels, pilotes payants, motivations des sponsors, agents | D-124 | `tests/commercial.test.ts` |

141 tests au total, tous réussis. Format de sauvegarde 17. Performances : coût par saison stable (≈ 0,75 s, mesuré avant la 7c).

## 2. Indicateurs clés (indicatifs)

| Indicateur | 7a | **Fin de la phase 7** | Lecture |
| --- | --- | --- | --- |
| Âge des champions | 31,3 | **30,4** | favorable, objectif D-111 encore non atteint |
| Âge des débutants | 22,8 | 22,8 | stable |
| Champions pilotes / 10 saisons | 4,6 | 4,5 | ≈ |
| Champions constructeurs / 10 saisons | 2,6 | 2,8 | favorable |
| **Dynasties** (10 saisons) | 57 % | **63 %** | **défavorable** |
| Dominations | 18 % | 16 % | favorable |
| La dernière écurie marque | 61 % | 64 % | favorable |
| Remontées | 5,6 | 5,8 | ≈ |
| Signatures sur le marché (tous postes) | 6,5 | 19,4 | le personnel passe désormais par le marché |
| Débauchages | 0,15 / saison | 0,30 / saison (indemnités 5,4 M€) | plus fréquents, encore rares |
| Contre-attaques | 0,01 | 2,5 / saison | les employeurs défendent leur personnel |
| Sponsoring : 1er / 11e | 192 / 46 M€ | 181 / 53 M€ | concentration un peu moindre |
| Crises financières | 0 | 0 | ✘ toujours aucune |

## 3. Limites et signaux défavorables

- **Mesure faussée par l'archivage (à corriger dans l'outil)** : les retraités archivés disparaissent de la table des personnes. Les indicateurs « talents jamais arrivés en F1 » (0/179), « pilotes payants arrivés en F1 » (0/29) et « promesses tenues » (11/1) ne comptent donc plus les carrières terminées. **Ce ne sont pas de vrais résultats.** Correction proposée : l'outil compte ces carrières au moment de la retraite, avant l'archivage, ou la fiche d'archive conserve les quelques informations nécessaires. À faire avant la grande campagne.
- **Dynasties en hausse (57 % → 63 %)**, malgré le débauchage des ingénieurs. Les remplacements et débauchages de personnel restent rares, et le personnel débauché pèse peu sur la capacité de développement : seuls les responsables y entrent, et leur effet est borné. Le levier attendu viendra surtout de la **phase 8a (règlements)**.
- **Toujours aucune crise financière**, même avec les indemnités. Attendu avec la phase 12 (coûts de conception).
- **Pilotes payants** : le mécanisme existe (apport commercial dans le score de recrutement), mais son effet réel n'est pas mesurable tant que l'outil est faussé (voir ci-dessus).

## 4. Choix faits seul, à relire

- **Entreprises familiales ou nationales créées pour un pilote** quand le vivier de sponsors est saturé (D-124). Sans ce choix, les sponsors personnels n'apparaissaient presque jamais, car les emplacements et le vivier étaient pleins.
- **Remplacement d'un responsable** limité à un par saison et par écurie, avec une avance de 2 points et une probabilité selon le goût du risque du team principal.
- **Démissions et ruptures négociées** à l'initiative de la personne : non faites. Les départs passent par le marché (offres, candidatures, indemnités).

## 5. Suite

- Validation de la conception de la **phase 8** (`docs/systemes/phase-8-conception-detaillee.md`, 7 questions), puis 8a.
- Correction de l'outil de démographie (archivage).
