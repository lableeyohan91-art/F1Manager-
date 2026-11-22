# Rapport — Phase 6b-1 : filières juniors (catégories, courses, marché des baquets)

Date : 22/11/2026. Conception : `docs/systemes/phase-6b-filieres-juniors.md` (VALIDÉE, D-112), première moitié. Méthode : D-076 pour le rapport, D-095 pour l'équilibrage.

## 1. Ce qui a été livré

| Élément | Contenu |
| --- | --- |
| Écuries juniors | 10 en Apex 3 (3 pilotes chacune), 11 en Apex 2 (2 pilotes chacune) ; table **séparée** des écuries de F1 ; noms fictifs (`data/commun/ecuries-juniors.csv`) ; qualité, réputation, prix du baquet, partenaire F1 éventuel (généré) |
| Courses | 10 manches en Apex 3 et 12 en Apex 2, sur des circuits du calendrier principal, les mêmes semaines, même météo. Même modèle que la F1 (niveau du pilote sur le circuit, affinité, nouveauté), voitures identiques, effet de la qualité de l'écurie, aléa plus fort |
| Expérience | Une course junior compte pour moitié dans le facteur d'expérience, et pleinement pour la **connaissance du circuit** |
| Progression | Un jeune qui a un baquet a un temps de jeu de 0,9 (contre 0,6 sans) et l'encadrement de son écurie junior |
| Réputation | Classements abstraits du karting et de l'Apex 4, résultats Apex 3 et Apex 2. Lue par le marché des baquets, l'estimation du potentiel (les saisons juniors comptent comme du temps d'observation) et le recrutement F1 |
| Marché des baquets | Annuel (semaine 3) : talent visible, potentiel estimé, réputation et argent apporté, plus de poids à l'argent pour les écuries modestes, remise pour les talents, préférence de continuité. **Une écurie ne roule jamais à vide** : faute de payeur, elle prend le meilleur candidat au prix qu'il peut payer |
| Mémoire | Résumé de chaque saison junior dans la carrière ; détail course par course conservé une saison ; **rivalités** entre prétendants au titre (souvenir « rivalité » réciproque) ; titre junior = événement public |
| Monde de départ | 3 saisons juniors simulées (2024 à 2026), sans effet sur la grille de F1 de 2027 |
| Divers | Format de sauvegarde 9 (migration testée), onglet « Juniors » du diagnostic, 4 tests (89 au total) |

**Corrections en cours de route** :
- première année du passé sans pilote admissible en Apex 2 → l'Apex 2 est aussi ouverte aux 19 ans et plus, et aux jeunes de grande réputation ;
- grilles incomplètes (budget familial seul) → règle « pas de voiture vide » et remise plus précoce pour les talents ;
- sauvegarde à 10 saisons au-delà de la limite du test (3,23 Mo pour 3 Mo) → le détail junior n'est conservé qu'une saison, et la limite du test passe à 3,5 Mo. Le poste le plus lourd reste le détail des Grands Prix de F1 (≈ 1 Mo), antérieur à la 6b, à optimiser avant la version mobile.

## 2. Parcours vers la F1 — 10 graines × 30 saisons

| Indicateur | Valeur | Lecture |
| --- | --- | --- |
| **Âge des champions** (D-111) | **30,5 ans** (30 % à 37 % des titres entre 23 et 37 ans) | ⚠ Légère baisse (31,3 avant), **toujours trop tardif** |
| **Âge des débutants en F1** | **24,9 ans** (de 21 à 29 ans) | ⚠ **Trop tardif** (en réalité, plutôt 20–22 ans) |
| Débutants par saison | 2,17 | ✔ au bas de la fourchette 2–4 (D-072) |
| Débutants passés par le top 5 de l'Apex 2 | 61 % | ✔ la filière est la voie principale |
| Champions Apex 2 promus en F1 | 60 % | ✔ fortes chances, sans garantie |
| Talents (potentiel ≥ 17) jamais arrivés en F1 | 13 % | ✔ cela existe sans dominer |
| Pilotes payants moyens (budget ≥ 3 M€, potentiel ≤ 14) arrivés en F1 | 1 % | ⚠ quasi inexistant |
| Durée de carrière en F1 | 8,2 saisons | ✔ |
| Niveau moyen des titulaires 2027 → 2056 | 16,07 → 16,08 (max 16,71) | ✔ stable |
| Population | 336 → 308 | ✔ stable |

**Pourquoi les débutants sont si âgés** (diagnostic) :
- **Peu de places s'ouvrent** : environ 2 par saison.
- **Le recrutement F1 provisoire (D-066) privilégie le niveau actuel.** Le potentiel estimé pèse peu, alors qu'un jeune de 20 ans est encore loin de son plafond. Les écuries attendent donc que les jeunes aient progressé, vers 24–25 ans. Une partie des talents abandonne entre-temps (D-101).
- Les **leviers prévus** sont déjà dans la feuille de route :
  - **6b-2** : les académies placent leurs affiliés dans l'écurie partenaire et font des promesses de promotion ;
  - **phase 7** : vrai marché du travail, qui permettra d'investir dans un jeune et d'acheter un pilote sous contrat.

  Conformément à D-095, je ne recalibre pas maintenant.

**Pourquoi les pilotes payants n'arrivent presque jamais en F1** : en F1, l'argent apporté par un pilote n'existe pas encore. La valeur commerciale et les sponsors personnels sont prévus en phase 7 (D-097 à D-099). C'est attendu.

## 3. Équilibrage sportif — conditions identiques (référence : 6a complémentaire, `p6a-complement-reference-v2`)

### 3.1 Tous les indicateurs suivis — 100 graines × 10 saisons

Les indicateurs de compétitivité à toutes les positions (D-113) bougent tous dans le bruit statistique (≤ 1 point de pourcentage ou ≤ 0,01 de corrélation). Ils figurent en totalité dans `docs/rapports/reference/p6b1-reference.md`.

| Indicateur | Référence | **6b-1** | Sens |
| --- | --- | --- | --- |
| Vainqueurs de GP différents / saison | 5,94 | 5,91 | ≈ |
| Écuries victorieuses / saison | 3,94 | 3,91 | ≈ |
| Part des victoires de l'écurie dominante | 60,8 % | 60,9 % | ≈ |
| Taux d'abandon | 6,7 % | 6,7 % | ≈ |
| Écart 1re–dernière voiture (%) | 1,52 | 1,52 | ≈ |
| Écart de points P1–P2 | 71,7 | 72,0 | ≈ |
| Changements de leader | 2,82 | 2,82 | ≈ |
| Doublés / saison | 6,07 | 6,11 | ≈ |
| Corrélation voiture ↔ points | 0,906 | 0,908 | ≈ |
| Plus forte progression d'une voiture | 1,02 | 1,02 | ≈ |
| Victoires inattendues / saison | 2,02 | 2,01 | ≈ |
| Courses sous la pluie | 2,73 | 2,73 | identique |
| Champions pilotes / 10 saisons | 3,03 | 3,02 | ≈ |
| Champions constructeurs / 10 saisons | 2,10 | 2,19 | favorable (léger) |
| Plus longue série de titres | 6,51 | 6,44 | favorable (léger) |
| Écuries sans victoire / 10 saisons | 3,44 | 3,60 | défavorable (léger) |
| Remontées (+3 places) | 4,49 | 4,53 | ≈ |
| Écuries changeant d'étage / saison | 2,24 | 2,29 | favorable (léger) |
| Transitions sans changement d'étage | 20,6 % | 18,7 % | favorable (cible < 20 % : **de nouveau atteinte**) |
| La dernière écurie marque ≥ 1 point | 56,6 % | 59,9 % | favorable (≈ 70 % jugé satisfaisant, D-113) |
| Dynasties | 71 % | 69 % | favorable (léger) |
| Titre ouvert avant la dernière manche | 23,9 % | 24,1 % | ≈ |
| Retournement à la dernière manche | 5,4 % | 5,7 % | ≈ |
| Champion et dauphin coéquipiers | 46,4 % | 46,9 % | ≈ |
| Luttes finales entre coéquipiers / entre écuries | 11,7 % / 12,2 % | 11,6 % / 12,5 % | ≈ |
| Saisons très serrées | 10,7 % | 10,7 % | ≈ |
| Dominations | 18,9 % | 18,8 % | ≈ |
| Coéquipiers : part compétences / forme / aléa | 26 / 0 / 74 % | 25 / 0 / 75 % | ≈ |

### 3.2 Sur 20 saisons — 50 graines

| Indicateur | Référence | **6b-1** | Sens |
| --- | --- | --- | --- |
| Écuries victorieuses / saison | 5,21 | 5,24 | ≈ |
| Vainqueurs de GP différents / saison | 7,34 | 7,48 | favorable (léger) |
| Champions pilotes / 20 saisons | 5,34 | 5,70 | favorable |
| Champions constructeurs / 20 saisons | 3,90 | 4,18 | favorable (cible 5–8 : non atteinte) |
| Plus longue série de titres | 8,14 | 8,16 | ≈ |
| Écuries sans victoire | 0,34 | 0,38 | ≈ |
| Remontées | 15,8 | 16,6 | favorable |
| Écuries changeant d'étage / saison | 3,03 | 3,07 | ≈ |
| Transitions sans changement d'étage | 13,1 % | 11,4 % | favorable |
| La dernière écurie marque | 71 % | 75 % | favorable |
| Dynasties | 84 % | 84 % | ≈ |
| Dominations | 24,3 % | 22,2 % | favorable |
| Titre ouvert avant la dernière manche | 21,3 % | 23,0 % | favorable (léger) |
| Écart de points P1–P2 | 80,4 | 77,5 | favorable (léger) |
| Saisons très serrées | 10,4 % | 10,4 % | ≈ |
| Retournement à la dernière manche | 4,4 % | 5,8 % | favorable (léger) |
| Corrélation voiture ↔ points | 0,81 | 0,82 | ≈ |
| Champion et dauphin coéquipiers | 30,6 % | 32,2 % | ≈ |
| Lutte finale entre écuries différentes | 14,2 % | 15,5 % | favorable (léger) |

### 3.3 Hiérarchie dans le temps et dominations (30 graines)

| Indicateur | Référence | **6b-1** |
| --- | --- | --- |
| Persistance du classement N ↔ N+3 | 0,687 | 0,690 |
| Dernier tiers 2027 → top 3 un jour | 51 % | 52 % |
| Top 3 2027 → dernier tiers un jour | 41 % | 46 % |
| Dominations : champion dans la meilleure voiture | 71 % | 76 % |

## 4. Lecture franche

- **La filière fonctionne** : 61 % des débutants viennent du top 5 de l'Apex 2, 60 % des champions Apex 2 sont promus, des talents restent bloqués (13 %) et le niveau de la grille est stable.
- **Effet sur le sport : léger mais plutôt favorable sur 20 saisons** (plus de champions, plus de remontées, un peu moins de dominations). Sur 10 saisons, l'effet est neutre.
- **Deux objectifs ne sont pas atteints** :
  - **âge des champions** (30,5 ans, toujours trop tardif, D-111) ;
  - **âge des débutants** (24,9 ans).

  La cause identifiée est le recrutement F1 provisoire, qui privilégie le niveau actuel. Les remèdes prévus sont la 6b-2 (académies, placement, promesses) puis la phase 7 (marché).

  **Si tu préfères ne pas attendre**, un levier simple et non artificiel serait de donner plus de poids au potentiel estimé dans le recrutement F1 provisoire. C'est une décision pour toi.
- **Les pilotes payants n'existent pas encore en F1** : c'est attendu, la valeur commerciale arrive en phase 7.

## 5. Suite

**6b-2** : académies, contrats d'affiliation, financement (mécènes, académies), repérage, placement et promotion. Puis nouvelle mesure de l'âge des débutants et des champions.
