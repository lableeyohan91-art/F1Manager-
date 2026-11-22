# Rapport — Phase 5b : sponsors, dette, crises, rachats, infrastructures

Date : 22/11/2026. Conception : `docs/systemes/phase-5-economie.md` §4, §5, §7, §8 (VALIDÉE, D-078). Méthode : D-076.

## 1. Ce qui a été livré

| Élément | Contenu | Où |
| --- | --- | --- |
| Données | 14 secteurs d'activité (fourchettes de budgets marketing), 60 racines de noms d'entreprises **inventées** | `data/commun/secteurs.csv`, `entreprises.csv` |
| Sponsors | Vivier borné (75 au départ, 95 au plus, arrivées et départs) ; marché annuel ; attrait selon l'image recherchée (prestige, popularité, résultats, nationalité) ; 1 titre + 3 principaux + 6 secondaires par écurie ; exclusivité de secteur ; objectif de classement, prime, clause de sortie ; rancune de 3 ans ; renouvellements selon satisfaction et fidélité ; conjoncture mondiale | `systems/economie/sponsors.ts` |
| Revenus | La moitié des anciens revenus commerciaux reste en droits commerciaux ; l'autre moitié vient désormais du marché des sponsors | `systems/economie/index.ts` |
| Dette et crises | Emprunt sous la réserve minimale, dans une limite liée au goût du risque du propriétaire ; intérêts selon l'endettement ; remboursement ; états sain / tension / crise / administration ; motivation du personnel en baisse en crise ; sauvetage par le propriétaire ; rachat après 3 périodes de crise ; vente par lassitude | `systems/economie/crises.ts` |
| Chocs (ajout) | Retrait du propriétaire en cours d'année ; emprunt offensif d'un dirigeant joueur (D-093) | `index.ts` |
| Infrastructures | Projets d'agrandissement ou de rénovation (coût et durée annoncés, retards et surcoûts tirés au lancement) ; enveloppe réglementaire de 25 M€ par an hors plafond ; chantiers à l'arrêt en crise ; vieillissement des installations (efficacité −1,2 % par an, plancher 70 %) lu par le développement | `systems/economie/infrastructures.ts` |
| Sauvegarde | Format 6, migration 5 → 6 testée | `core/sauvegarde.ts` |
| Diagnostic | Onglet Finances : conjoncture, dette, état de crise, sponsors sous contrat, chantiers | `src/ui/diagnostic/Finances.tsx` |
| Tests | 4 nouveaux (66 au total) : sponsors (emplacements, exclusivité, noms uniques), chaîne de crise jusqu'au sauvetage ou rachat, chantiers dans l'enveloppe, migration 5 → 6 | `tests/economie.test.ts` |

Le joueur ne décide pas encore lui-même de ses sponsors, de ses emprunts ni de ses chantiers : l'IA le fait pour toutes les écuries, avec les mêmes règles. Les commandes du joueur viendront avec l'interface de jeu.

## 2. Choix à valider

Le détail est dans `docs/decisions.md`.

- **D-092** : valeurs du marché des sponsors (provisoires).
- **D-093** : trois mécanismes **absents de la fiche** :
  - le retrait du propriétaire en cours d'année ;
  - l'emprunt offensif ;
  - l'effet du vieillissement des installations sur le développement.
- **D-094** : **remise en cause partielle de la valeur de D-085**. Le seuil des dividendes passe de 0,6 à 0,25 année de dépenses, et la capacité d'emprunt de 0,5 à 0,25 année de recettes. Raison : les trésoreries étaient si épaisses qu'elles absorbaient tous les chocs.

## 3. Correction d'un biais de mesure

L'outil `npm run statistiques-finances` comptait les événements encore présents en fin de simulation. Or le moteur élague les événements anciens (D-058), si bien que les fréquences étaient **largement sous-estimées** sur 20 saisons : 0,46 chantier par saison au lieu de 5,9 réellement. L'outil compte désormais au fil de la simulation. Les fréquences d'événements du rapport P5a §3.3 sont donc à prendre avec prudence. Les autres chiffres de ce tableau (trésoreries, dépenses, dépassements) venaient des bilans annuels et ne sont pas touchés.

## 4. Santé financière — 30 graines × 20 saisons (6 600 années-écurie)

| Indicateur | Valeur | Objectif (fiche §11) | Verdict |
| --- | --- | --- | --- |
| Années sous le plafond (< 97 %) | 11,8 % | La plupart des grandes au plafond | ✔ |
| Dépassements du plafond | 0,6 % (aucun majeur) | Rares et sanctionnés | ✔ |
| Trésorerie de fin d'année négative | 0 % | — | — |
| Trésorerie finale (10 % / médiane / 90 %) | 49 / 154 / 470 M€ (max 745) | — | plus réaliste qu'en 5a (médiane 227, max 779) |
| Dette finale moyenne | 2,4 M€ (max 64) | — | faible |
| Emprunts | 0,29 par saison | — | |
| Retraits du propriétaire | 0,31 par saison | — | |
| Passages en tension | 0,01 par saison | — | |
| **Crises financières** | **0 en 600 saisons** | « quelques crises par décennie » | ✘ **non atteint** |
| Rachats | 0,01 par saison (lassitude) | — | très rares |
| Signatures / renouvellements de sponsors | 20 / 20 par saison | — | marché vivant |
| Départs de sponsors fâchés | 0,65 par saison | — | |
| Chantiers lancés / livrés / en retard | 5,9 / 5,5 / 1,2 par saison | — | retards ≈ 22 % (risque tiré : 25 %) |
| Sponsoring selon le rang (1er → 11e) | 160 · 138 · 136 · 106 · 95 · 85 · 79 · 65 · 75 · 60 · 52 M€ | — | écart ≈ 3 contre 1 |

**Lecture franche** : les mécanismes de crise existent et fonctionnent (un test force la chaîne complète jusqu'au sauvetage ou au rachat), mais **ils ne se déclenchent pratiquement jamais en simulation libre**. L'IA est trop prudente : elle ajuste ses dépenses chaque année à ses recettes et emprunte avant de manquer d'argent. Les chocs ajoutés (retrait du propriétaire, conjoncture) sont absorbés par la dette. Pour obtenir des crises, il faudra des engagements que l'IA ne peut pas réduire vite : salaires sous contrat qui augmentent, effectifs des départements qu'on ne licencie pas du jour au lendemain, ou une IA qui se trompe dans ses prévisions. Je le propose pour la passe d'équilibrage d'après la phase 5, pas comme réglage en douce.

## 5. Équilibrage sportif — conditions identiques

Mêmes graines (1–100, 10 saisons) et mêmes mécaniques hors 5b, comparées à la référence **P5a** (`docs/rapports/reference/p5a-reference.*`) et, pour mémoire, à la référence C2 d'avant l'économie.

### 5.1 Tous les indicateurs suivis — 100 graines × 10 saisons

| Indicateur | C2 (avant économie) | P5a | **P5b** | P5b − P5a |
| --- | --- | --- | --- | --- |
| Vainqueurs de GP différents / saison | 5,88 | 5,99 | 5,97 | ≈ |
| Écuries victorieuses / saison | 3,72 | 3,86 | 3,85 | ≈ |
| Part des victoires de l'écurie dominante | 57 % | 57 % | 57 % | ≈ |
| Taux d'abandon | 7,8 % | 7,7 % | 7,8 % | ≈ |
| Écart 1re–dernière voiture (%) | 1,73 | 1,55 | 1,56 | ≈ |
| Écart de points P1–P2 | 49,3 | 52,7 | 52,7 | ≈ |
| Changements de leader | 3,63 | 3,44 | 3,42 | ≈ |
| Doublés / saison | 5,99 | 6,08 | 6,11 | ≈ |
| Corrélation voiture ↔ points | 0,92 | 0,89 | 0,90 | ≈ |
| Plus forte progression d'une voiture dans la saison | 0,97 | 1,00 | 1,00 | ≈ |
| Victoires inattendues / saison | 2,12 | 2,28 | 2,27 | ≈ |
| Courses sous la pluie | 2,73 | 2,73 | 2,73 | identique |
| Champions pilotes / 10 saisons | 3,96 | 3,87 | 3,94 | +0,07 favorable (léger) |
| Champions constructeurs / 10 saisons | 2,40 | 2,42 | 2,42 | 0 |
| Plus longue série de titres | 5,90 | 5,89 | 5,94 | +0,05 **défavorable (léger)** |
| Écuries sans victoire / 10 saisons | 5,72 | 4,86 | 4,84 | ≈ |
| Remontées (+3 places) | 3,08 | 3,65 | 3,53 | −0,12 **défavorable (léger)** |
| Écuries changeant d'étage / saison | 1,70 | 1,95 | 1,91 | −0,04 **défavorable (léger)** |
| Transitions sans changement d'étage | 29 % | 23 % | 23 % | ≈ (cible < 20 % : non atteinte) |
| La dernière écurie marque ≥ 1 point | 32 % | 44 % | 43 % | −1 pt (cible 60–90 % : non atteinte) |
| Dynasties (≥ 5 titres consécutifs) | 64 % | 66 % | 66 % | 0 (cible « très rares » : très loin) |
| Titre ouvert avant la dernière manche | 36 % | 34 % | 35 % | +1 pt favorable (léger) |
| Retournement à la dernière manche | 7,3 % | 6,6 % | 6,2 % | −0,4 pt défavorable (léger) |
| Champion et dauphin coéquipiers | 48 % | 48 % | 49 % | ≈ |
| Lutte finale entre coéquipiers | 17,5 % | 16,9 % | 17,1 % | ≈ |
| Lutte finale entre écuries différentes | 18,1 % | 16,7 % | 18,0 % | +1,3 pt favorable |
| Saisons très serrées | 14,9 % | 14,0 % | 14,1 % | ≈ |
| Dominations (≥ 120 pts) | 8,0 % | 9,6 % | 9,4 % | ≈ (cible < 5 % : non atteinte) |
| Coéquipiers : écart moyen | 0,442 | 0,445 | 0,447 | ≈ |
| Coéquipiers : part compétences / forme / aléa | 31 / 0 / 70 % | 31 / 0 / 69 % | 32 / 0 / 69 % | ≈ |

### 5.2 Sur 20 saisons — 50 graines

| Indicateur | C2 | P5a | **P5b** | Sens (P5b − P5a) |
| --- | --- | --- | --- | --- |
| Écuries victorieuses / saison | 4,46 | 4,67 | 4,75 | favorable (léger) |
| Champions pilotes / 20 saisons | 5,96 | 6,18 | 5,94 | **défavorable** |
| Champions constructeurs / 20 saisons | 3,74 | 4,00 | 3,96 | ≈ (cible 5–8 : non atteinte) |
| Plus longue série de titres | 7,72 | 7,36 | 7,28 | favorable (léger) |
| Écuries sans victoire / 20 saisons | 1,42 | 0,88 | 0,84 | ≈ |
| Remontées (+3 places) | 10,1 | 12,2 | 12,9 | favorable |
| Écuries changeant d'étage / saison | 2,35 | 2,58 | 2,63 | favorable (léger) |
| Transitions sans changement d'étage | 20 % | 15 % | 16 % | ≈ (cible < 20 % : atteinte) |
| La dernière écurie marque ≥ 1 point | 47 % | 59 % | 58 % | ≈ (cible 60–90 % : presque) |
| Dynasties (≥ 5 titres consécutifs) | 86 % | 88 % | 88 % | ≈ (cible « très rares » : très loin) |
| Dominations (≥ 120 pts) | 17,3 % | 17,1 % | 16,6 % | ≈ (cible < 5 % : très loin) |
| Titre ouvert avant la dernière manche | 27,8 % | 28,1 % | 29,7 % | favorable (léger ; cible 30–50 % : presque) |
| Écart de points P1–P2 | 67,0 | 67,5 | 66,5 | ≈ |
| Saisons très serrées | 12,2 % | 10,6 % | 12,3 % | favorable |
| Retournement à la dernière manche | 6,4 % | 5,0 % | 5,1 % | ≈ |
| Corrélation voiture ↔ points | 0,83 | 0,77 | 0,77 | ≈ |

Avec 50 graines, des écarts de cet ordre (± 0,2 champion, ± 2 points de pourcentage) restent dans le bruit statistique.

## 6. Lecture franche

- **La 5b est quasi neutre pour le sport.** Toutes les différences avec la 5a sont dans le bruit statistique. C'est cohérent : l'argent des sponsors arrive surtout au-dessus du plafond, et il ne peut alors servir qu'aux installations, dans une enveloppe de 25 M€ par an. L'effet des installations sur la voiture est lent et plafonné.
- **Ce n'est ni une mauvaise ni une bonne nouvelle en soi.** Le plafond fait son travail : l'argent ne rachète pas les titres. Mais la phase 5, dans son ensemble, n'a pas cassé les dynasties : 64 % → 66 % sur 10 saisons, 86 % → 88 % sur 20.
- **L'économie est vivante mais trop sage** : marché des sponsors actif, chantiers et retards, propriétaires qui se retirent… mais **aucune crise**. Objectif non atteint (§4).
- **Aucun bonus caché n'a été ajouté.** Les mécanismes nouveaux profitent à ceux qui gèrent bien : les sponsors vont aux écuries attirantes, les chantiers à celles qui ont de l'argent.

## 7. Bilan de la phase 5 et suite proposée

Phase 5 terminée (5a + 5b). Comme tu l'as demandé, on ajuste maintenant. Je propose, dans l'ordre :

1. **Équilibrage de la phase 5** (tes cibles D-081) :
   - des engagements rigides qui rendent les crises possibles ;
   - une IA qui peut se tromper dans ses prévisions ;
   - un test des restrictions aéro plus fortes.

   Le tout dans une campagne complète comparée à cette référence.
2. Les vrais leviers contre les dynasties, déjà au programme :
   - phase 7 : débauchage des ingénieurs ;
   - phase 8 : grands changements de règlement (D-090).

   Je recommande de **ne pas** forcer l'équilibre par l'économie avant ces deux phases.
