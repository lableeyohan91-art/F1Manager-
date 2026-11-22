# Rapport — Phase 6b-2 : académies, affiliations, mécènes, repérage

Date : 22/11/2026. Conception : `docs/systemes/phase-6b-filieres-juniors.md` (VALIDÉE, D-112), seconde moitié ; audit indépendant de ChatGPT et suites données (D-115). Méthode : D-076 pour le rapport, D-095 pour l'équilibrage.

## 1. Ce qui a été livré

| Élément | Contenu |
| --- | --- |
| Académies | Une par écurie de F1, de 2 à 8 places selon le budget et la politique de recrutement. Réputation calculée à partir des carrières réelles des anciens affiliés (liste bornée) |
| Affiliations | Contrats de type `affiliation` : financement du baquet junior, **option prioritaire** (un affilié n'est engageable que par son écurie ou l'écurie partenaire, lien réel Racing Buls ↔ Red Bul), promesse éventuelle, renouvellement ou départ en fin de saison |
| Promesses de titularisation | Faites seulement si un baquet doit se libérer : l'écurie **renonce alors à prolonger le titulaire sortant**, et le baquet revient d'abord au jeune promis. Tenue ou rompue, la promesse entre dans la mémoire (phase 4) |
| Placement et promotion | Préférence des écuries juniors partenaires pour les affiliés ; préférence en F1 pour ses propres affiliés et ceux de l'écurie partenaire, plus forte si une promesse arrive à échéance |
| Mécènes | Pour des jeunes talentueux et sans moyens : 0,5 à 2 M€ par an pendant 3 ans |
| Financement des jeunes | Famille + mécène + académie ; prix réellement payé et indicateur « subventionné » conservés (audit) |
| Repérage | Commande `recrutement.mission`, commune au joueur et à l'IA. **Connaissance progressive** pendant la mission puis **oubli progressif** (audit). Refus si l'écurie est en crise ou n'a pas la trésorerie (audit). Capacité bornée par le département recrutement. L'IA repère les jeunes en début d'année et les meilleurs de l'Apex 2 à mi-saison |
| Comptes | Ligne « académie » hors plafond (financements et missions), intégrée au budget de l'IA |
| Sauvegarde | Formats 10 et 11, migrations testées |
| Tests | 9 nouveaux (98 au total), dont 4 de non-régression liés à l'audit et aux promesses |

## 2. Anomalies corrigées en cours de route

| Constat | Correction |
| --- | --- |
| Promesses de titularisation : **7 tenues pour 56 rompues** | 1) Ne promettre qu'un baquet qui doit se libérer, une seule promesse à la fois. 2) Non-prolongation du titulaire sortant et priorité du jeune promis sur le baquet libéré. Résultat : **50 tenues pour 2 rompues** |
| Repérage instantané puis oubli total ; aucune vérification financière ; prix réel non conservé (audit de ChatGPT) | Voir D-115 et `phase-6b-filieres-juniors.md` §16 |
| Affiliations échues restées « actives » une semaine (contrôle de cohérence) | Revue en fin de saison, comme les contrats d'emploi |
| Contrats d'affiliation terminés accumulés sans limite | Liste bornée d'anciens affiliés par académie ; contrats effacés après 2 ans |
| Mon outil de démographie lisait les baquets juniors une saison trop tard | Corrigé |

## 3. Parcours vers la F1 — 10 graines × 30 saisons (comparaison avec la 6b-1)

| Indicateur | 6b-1 | **6b-2** | Lecture |
| --- | --- | --- | --- |
| **Âge des champions** (D-111) | 30,5 | **30,1** | ⚠ en légère baisse, encore trop tardif |
| **Âge des débutants en F1** | 24,9 | **24,0** (de 20 à 28 ans) | ⚠ en baisse, encore trop tardif |
| Débutants par saison | 2,17 | 2,94 | ✔ (2 à 4) |
| Durée de carrière en F1 | 8,2 saisons | 6,4 saisons | ✔ au bas de la fourchette 6–10 |
| Débutants passés par une académie | — | **90 %** | ✔ la voie principale |
| Débutants passés par le top 5 de l'Apex 2 | 61 % | 46 % | Les académies placent aussi des affiliés moins brillants en résultats |
| Champions Apex 2 promus | 60 % | 59 % | ✔ |
| Talents (potentiel ≥ 17) jamais arrivés en F1 | 13 % | 13 % | ✔ (cause non identifiée : voir l'erratum ci-dessous) |
| Pilotes payants moyens arrivés en F1 | 1 % | 2 % | Attendu (valeur commerciale en phase 7) |
| **Promesses tenues / rompues** | — | **50 / 2** | ✔ (après correction) |
| Mécènes | — | 0,57 par saison | ✔ rares |
| Écart de réputation entre académies | — | 83 points | ✔ des académies se distinguent réellement |
| **Baquets subventionnés** | — | **0 %**, prix moyen réellement payé 1,06 M€ | La règle « pas de voiture vide » ne sert presque jamais, car il y a assez de payeurs. Erratum (D-118) : les 13 % de talents qui ne percent pas ne sont pas tous des échecs financiers ; voir le rapport 7a pour la répartition des causes |
| Niveau moyen des titulaires 2027 → 2056 | 16,07 → 16,08 | 15,91 → 15,90 | ✔ stable |

## 4. Équilibrage sportif — conditions identiques (référence 6b-1)

### 4.1 100 graines × 10 saisons

Les indicateurs de compétitivité à toutes les positions (D-113) restent tous dans le bruit statistique : détail complet dans `docs/rapports/reference/p6b2-reference.md`.

| Indicateur | 6b-1 | **6b-2** | Sens |
| --- | --- | --- | --- |
| Vainqueurs de GP différents / saison | 5,91 | 5,83 | défavorable (léger) |
| Écuries victorieuses / saison | 3,91 | 3,89 | ≈ |
| Part des victoires de l'écurie dominante | 60,9 % | 60,8 % | ≈ |
| Taux d'abandon | 6,7 % | 6,8 % | ≈ |
| Écart 1re–dernière voiture (%) | 1,52 | 1,52 | ≈ |
| Écart de points P1–P2 | 72,0 | 74,8 | défavorable (léger) |
| Changements de leader | 2,82 | 2,73 | défavorable (léger) |
| Doublés / saison | 6,11 | 5,91 | ≈ |
| Corrélation voiture ↔ points | 0,908 | 0,900 | ≈ |
| Plus forte progression d'une voiture | 1,02 | 1,02 | ≈ |
| Victoires inattendues / saison | 2,01 | 2,00 | ≈ |
| Courses sous la pluie | 2,73 | 2,73 | identique |
| Champions pilotes / 10 saisons | 3,02 | 3,03 | ≈ |
| Champions constructeurs / 10 saisons | 2,19 | 2,26 | favorable (léger) |
| Plus longue série de titres | 6,44 | 6,42 | ≈ |
| Écuries sans victoire | 3,60 | 3,57 | ≈ |
| Remontées | 4,53 | 4,67 | favorable (léger) |
| Écuries changeant d'étage / saison | 2,29 | 2,21 | défavorable (léger) |
| Transitions sans changement d'étage | 18,7 % | 20,6 % | défavorable (léger ; cible < 20 % : à la limite) |
| La dernière écurie marque | 59,9 % | 56,3 % | défavorable (≈ 70 % jugé satisfaisant) |
| Dynasties | 69 % | 73 % | **défavorable** |
| Titre ouvert avant la dernière manche | 24,1 % | 23,6 % | ≈ |
| Retournement à la dernière manche | 5,7 % | 5,0 % | défavorable (léger) |
| Champion et dauphin coéquipiers | 46,9 % | 41,9 % | favorable |
| Luttes finales entre coéquipiers / entre écuries | 11,6 % / 12,5 % | 10,9 % / 12,7 % | ≈ |
| Saisons très serrées | 10,7 % | 8,9 % | défavorable |
| Dominations | 18,8 % | 20,2 % | défavorable (léger) |
| Coéquipiers : part compétences / forme / aléa | 25 / 0 / 75 % | **31** / 0 / 69 % | Le pilote compte davantage (jeunes promus plus inégaux) |

### 4.2 50 graines × 20 saisons

| Indicateur | 6b-1 | **6b-2** | Sens |
| --- | --- | --- | --- |
| Écuries victorieuses / saison | 5,24 | 5,16 | ≈ |
| Vainqueurs de GP différents | 7,48 | 7,34 | ≈ |
| Champions pilotes / 20 saisons | 5,70 | 5,64 | ≈ |
| Champions constructeurs / 20 saisons | 4,18 | 4,10 | ≈ |
| Plus longue série de titres | 8,16 | **7,44** | favorable |
| Écuries sans victoire | 0,38 | 0,40 | ≈ |
| Remontées | 16,6 | 16,4 | ≈ |
| Écuries changeant d'étage / saison | 3,07 | 2,98 | ≈ |
| Transitions sans changement d'étage | 11,4 % | 12,6 % | ≈ |
| La dernière écurie marque | 75 % | 73 % | ≈ |
| Dynasties | 84 % | 84 % | ≈ |
| Dominations | 22,2 % | 25,1 % | **défavorable** |
| Titre ouvert avant la dernière manche | 23,0 % | 23,0 % | ≈ |
| Écart de points P1–P2 | 77,5 | 80,5 | défavorable (léger) |
| Saisons très serrées | 10,4 % | 10,5 % | ≈ |
| Retournement à la dernière manche | 5,8 % | 5,6 % | ≈ |
| Corrélation voiture ↔ points | 0,82 | 0,81 | ≈ |
| Champion et dauphin coéquipiers | 32,2 % | 28,1 % | favorable |
| Lutte finale entre écuries différentes | 15,5 % | 16,4 % | favorable (léger) |

### 4.3 Hiérarchie dans le temps et dominations (30 graines)

| Indicateur | 6b-1 | **6b-2** |
| --- | --- | --- |
| Persistance du classement N ↔ N+3 | 0,690 | 0,697 |
| Dernier tiers 2027 → top 3 un jour / top 5 un jour | 52 % / 74 % | 51 % / **81 %** |
| Top 3 2027 → dernier tiers un jour | 46 % | 36 % |
| Dominations : champion dans la meilleure voiture | 76 % | 77 % |

## 5. Lecture franche

- **La filière complète fonctionne** :
  - 90 % des débutants passent par une académie ;
  - les académies se distinguent par leurs résultats réels ;
  - les promesses sont tenues ;
  - les mécènes restent rares ;
  - 13 % des talents (potentiel ≥ 17) n'arrivent jamais en F1. *Erratum (audit ChatGPT n°2, D-118) : ce rapport attribuait ces échecs au manque d'argent, mais l'indicateur ne mesurait pas la cause. L'outil distingue désormais les causes probables : financière, sportive, contractuelle, manque d'opportunités.*
- **Âges : progrès réels, objectif non atteint.** Champions à 30,1 ans, débutants à 24,0 ans. La cause principale est toujours le recrutement F1 provisoire, qui juge surtout le niveau actuel ; les académies n'y suffisent pas. Le vrai levier est la **phase 7**, avec un marché du travail où une écurie peut parier sur un jeune.
- **Effet sportif : globalement neutre, quelques signaux défavorables** :
  - dynasties sur 10 saisons (69 % → 73 %) ;
  - dominations sur 20 saisons (22 % → 25 %) ;
  - la dernière écurie marque un peu moins souvent.

  En compensation, les longues séries de titres raccourcissent sur 20 saisons (8,2 → 7,4) et le pilote pèse davantage dans les écarts entre coéquipiers. Documenté, non recalibré (D-095).
- **Baquets subventionnés à 0 %** : comportement volontaire, mais presque jamais déclenché, car il y a assez de jeunes capables de payer. La règle reste utile comme filet de sécurité (les grilles restent pleines) et elle est mesurée.

## 6. Suite

**Phase 6 terminée** (6a, 6a complémentaire, 6b-1, 6b-2). Prochaine étape de la feuille de route : **phase 7** (marché du travail, IA des écuries, agents, valeur commerciale, sponsors personnels, débauchage, clauses de rachat). C'est aussi le levier principal attendu contre les débutants trop âgés et les dominations par la voiture (débauchage des ingénieurs). Fiche de conception à proposer avant tout code.
