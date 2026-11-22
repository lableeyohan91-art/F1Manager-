# Phase 6b — Filières juniors, académies, financement, repérage

> Statut : **VALIDÉE** (D-112, 22/11/2026) — **réalisée** : 6b-1 (rapport `docs/rapports/2026-11-22-p6b1-filieres-juniors.md`) et 6b-2 (rapport `docs/rapports/2026-11-22-p6b2-academies.md`). Réponses du porteur : tailles, académies, financement et prix acceptés ; liens réels conservés ; livraison 6b-1 puis 6b-2.
> Cadre déjà validé :
> - D-062, D-063, D-071 : écosystème de formation ; grilles juniors fictives et générées ; karting et Apex 4 abstraits ; Apex 3 et Apex 2 réellement simulés ; académies réputées par leurs résultats ; écuries partenaires sans contrôle direct ;
> - D-036 : noms de travail Apex 2, 3 et 4 ;
> - D-097, D-099 : financement des carrières juniors en 6b, valeur commerciale en phase 7 ;
> - D-100 : repérage à concevoir ;
> - D-101 : le vivier reste un vivier ;
> - D-106 : expérience des juniors ;
> - D-111 : nouvelle mesure de l'âge des champions après la 6b.

## 1. Objectif

Faire exister réellement la route vers la F1. Des jeunes courent, se révèlent ou stagnent. Ils sont repérés, financés, placés, promus ou abandonnent. Tout ce qu'ils vivent chez les juniors les suit en F1 : expérience, connaissance des circuits, réputation, rivalités.

Effet attendu sur la mesure de D-111 : des débutants mieux préparés et mieux identifiés, donc des champions plus jeunes. À mesurer, pas à forcer.

## 2. La pyramide

| Niveau | Âges typiques | Simulation | Taille (proposition) |
| --- | --- | --- | --- |
| Karting | 14–15 ans | **Abstraite** : classement annuel de niveau (niveau + aléa), qui donne une réputation | Toute la cohorte |
| **Apex 4** | 15–17 ans | **Abstraite** : classement annuel par catégorie d'âge | Les meilleurs et les mieux financés du karting |
| **Apex 3** | 16–20 ans | **Simulée** : vraies courses, classements, palmarès | 10 écuries × 3 pilotes = **30 pilotes**, **10 manches** |
| **Apex 2** | 18–23 ans | **Simulée** | 11 écuries × 2 pilotes = **22 pilotes**, **12 manches** |
| Championnat principal | dès 18 ans (D-100) | Simulé (existant) | 11 × 2 |

- Les manches juniors se courent **sur des circuits du calendrier principal**, mêmes week-ends, avec leurs exigences (D-107). Les juniors **apprennent donc les circuits** : leur handicap de découverte en F1 se réduit, ce qui répond en partie à D-111.
- **Voitures identiques** dans chaque catégorie, comme dans la réalité. La différence vient du pilote et, un peu, de l'**écurie** (qualité de son équipe, §3).
- Même modèle de course que la F1, avec des paramètres propres : un aléa plus fort chez des pilotes inexpérimentés, le barème de points, les erreurs sous pression en fin de championnat.

## 3. Écuries juniors

Ce sont des organisations à part entière, mais **dans une table séparée** des écuries de F1 : les systèmes de la F1 (économie, conseil, sponsors) ne les traitent pas.

| Attribut | Lu par |
| --- | --- |
| Catégorie (Apex 3 ou Apex 2) | Calendrier, grille |
| **Qualité de l'équipe** (1–20) | Course (petit effet, comme un « indice voiture » resserré) et progression des pilotes (encadrement, 6a) |
| **Réputation de formatrice** (évolue avec les résultats et les promotions de ses anciens pilotes) | Attrait pour les jeunes et les académies |
| **Prix d'un baquet** (M€ par an) | Marché des baquets (§6) |
| Écurie de F1 **partenaire** (facultatif) | Placement préférentiel des affiliés de l'académie partenaire (§5) |

Noms fictifs générés à partir d'un fichier de données (racines + suffixes), comme les sponsors. Les grilles de départ sont générées (D-071).

## 4. Expérience, réputation et mémoire des juniors

- **Expérience** (D-106) : chaque course junior compte. Elle compte moins qu'un Grand Prix de F1 pour le facteur d'expérience (proposition : une course junior = un demi-Grand Prix), mais elle **compte pleinement pour la connaissance du circuit**.
- **Progression** (6a) :
  - un junior titulaire d'un baquet Apex 3 ou Apex 2 a un temps de jeu proche de celui d'un titulaire (proposition : 0,9) ;
  - un jeune sans baquet reste à 0,4–0,6 ;
  - l'encadrement dépend de la qualité de son écurie junior.
- **Réputation sportive** du jeune : le classement karting et Apex 4, puis les résultats Apex 3 et Apex 2 (titres, victoires, régularité). Elle est lue par :
  - les recruteurs (académies, écuries juniors, F1) ;
  - l'estimation du potentiel (les saisons juniors comptent comme du temps d'observation : les fourchettes se resserrent).
- **Mémoire** :
  - résumé de chaque saison junior conservé dans la carrière du pilote (catégorie, écurie, rang, victoires, titre) ;
  - détail course par course effacé après 2 saisons ;
  - **rivalités** : à la fin d'une saison serrée, les deux prétendants au titre gardent un souvenir « rivalité » l'un de l'autre, qui peut ressurgir en F1.

## 5. Académies

- **Chaque écurie de F1 a une académie.** Sa taille (2 à 8 places, proposition) et son budget dépendent des moyens de l'écurie et de sa politique de recrutement (« filière jeunes » → plus grande).
- **Coût** : ligne budgétaire « académie », hors plafond (prévue par la fiche de la phase 5, §9). Elle est décidée par l'IA du budget, ou par le joueur.
- L'académie **recrute** des affiliés en karting, Apex 4 et Apex 3, d'après :
  - son **estimation** du potentiel (département recrutement, §7) ;
  - leur réputation ;
  - leur âge ;
  - leur coût.
- **Contrat d'affiliation** (type déjà réservé en phase 4) :
  - durée ;
  - financement annuel ;
  - **option prioritaire** pour une promotion ;
  - clause de rachat (exercée en phase 7) ;
  - **promesse** éventuelle (« baquet en F1 avant telle saison ») : tenue ou rompue, elle entre dans la mémoire de la phase 4.
- **Placement** :
  - l'académie place ses affiliés dans une écurie junior (partenaire de préférence) ;
  - en F1, elle peut les proposer à l'**écurie partenaire** : un bonus de préférence dans son recrutement, sans contrôle direct (D-071).
- Une **académie réputée** l'est parce que ses anciens réussissent réellement : la réputation est calculée à partir des carrières de ses anciens affiliés.

## 6. Financement et marché des baquets juniors

Chaque jeune a un **budget personnel annuel**, la somme de :
- la **famille** : une richesse tirée à la création (beaucoup de modestes, peu de très riches) ;
- un **mécène** : rare ; il s'intéresse à un jeune talentueux sans moyens, d'après sa réputation ;
- une **académie** : le financement de son contrat d'affiliation.

Les sponsors nationaux et la valeur commerciale viendront en phase 7 (D-099). **Aucun double comptage** : chaque euro a une seule source et une seule destination, tracées par les contrats de type `financement`.

**Marché annuel des baquets** (intersaison), avec les mêmes règles pour toutes les écuries juniors :
- chaque écurie classe les candidats en pesant le **talent estimé** et la réputation contre l'**argent apporté**. Le dosage dépend de sa situation financière : une écurie juniors pauvre prend plus volontiers un pilote payant ;
- chaque jeune accepte le meilleur baquet qu'il **peut payer**.

Conséquences réalistes, qui émergent sans règle imposée :
- un grand talent sans argent ni académie peut **stagner** hors des baquets ;
- un pilote moyen mais riche peut courir longtemps.

Le D-101 s'applique ensuite : sans baquet de F1 entre 23 et 27 ans, on abandonne.

## 7. Repérage (scouting)

Une **mission de repérage** est une commande ouverte au joueur et à l'IA, avec les mêmes règles :
- elle cible une personne (pilote ou membre du personnel) ou une catégorie ;
- elle a un coût et dure quelques semaines ;
- elle **resserre** la fourchette de l'estimation (6a §6) de l'écurie pour ces personnes, pendant une durée limitée ;
- le nombre de missions simultanées dépend de la taille et du niveau du département recrutement ;
- **le biais propre du département reste** : on peut repérer avec soin et se tromper quand même ;
- les rapports donnent la fourchette, les points forts et faibles estimés, et des indices de personnalité (jamais les valeurs exactes).

L'IA envoie ses missions sur ses candidats prioritaires (académie, recrutement F1).

## 8. Passage en F1

Le recrutement F1 existant (D-066, en attendant le marché complet de la phase 7) examine les jeunes de 18 ans et plus, avec leur estimation, leur réputation junior et les options et promesses de leur académie. Un **titre Apex 2 augmente nettement les chances, sans rien garantir.**

## 9. Monde de départ (2027)

- Les jeunes de 16 à 22 ans existants reçoivent un **passé junior simulé court** (2 à 4 saisons : catégories, classements, expérience des circuits) avant la première saison. Ce passé ne modifie pas la grille de F1 de 2027 (règle de la phase 2).
- Les écuries juniors et les académies sont générées et peuplées selon les mêmes règles que le marché.

## 10. Attributs nouveaux et ce qui les lit

| Attribut | Lu par |
| --- | --- |
| Écurie junior (qualité, réputation, prix du baquet, partenaire) | Course junior, progression, marché des baquets, placement |
| Budget personnel du jeune (famille, mécène, académie) | Marché des baquets |
| Réputation sportive du jeune | Recrutement (académies, juniors, F1), estimation |
| Expérience junior (courses, circuits) | Facteur d'expérience, handicap de découverte (D-106) |
| Académie (places, budget, réputation) | Recrutement d'affiliés, placement, budget de l'écurie |
| Contrats d'affiliation et de financement | Financement, option prioritaire, promesses |
| Missions de repérage en cours | Estimation du potentiel |

## 11. Volumes et performances

- 52 pilotes juniors simulés et 22 manches juniors par an : environ 2 fois une saison de F1 en calcul (≈ 0,1 s par saison sur l'ordinateur de développement).
- Résumés de saison conservés ; détail effacé après 2 saisons ; missions de repérage bornées.
- Sauvegarde : format 9, avec migration.

## 12. Laboratoire : ce que l'on mesurera (D-095)

- Âge des champions (D-111), âge des débutants en F1, débutants par saison (2 à 4).
- Part des débutants en F1 passés par le top 5 de l'Apex 2 ; taux de promotion des champions Apex 2 (élevé, mais pas 100 %).
- Talents (potentiel élevé) qui stagnent faute d'argent ; pilotes payants qui atteignent la F1. **Les deux doivent exister, sans dominer.**
- Émergence d'académies réputées (écarts réels de réussite).
- Rivalités juniors qui ressurgissent en F1.
- Effet sur la hiérarchie : persistance des classements, champions constructeurs, dernière écurie qui marque, en comparaison avec la référence de la 6a complémentaire.

## 13. Ce qui attend les phases suivantes

| Phase | Ce qu'elle ajoute |
| --- | --- |
| 7 | Débauchage d'un affilié chez un rival, clauses de rachat exercées, agents des jeunes, valeur commerciale et sponsors nationaux, sponsors qui suivent un pilote |
| 8 | Calendriers juniors évolutifs (rotation), réputation qui circule (rumeurs) |
| 11 | Presse spécialisée, révélations |
| 13 | Courses juniors détaillées si on le souhaite (le modèle abstrait suffit au départ) |

## 14. Avis franc de Claude Code

1. **La séparation des tables est essentielle.** Mettre les écuries juniors dans la table des écuries de F1 contaminerait l'économie, le conseil et les sponsors. Je propose une table à part, et des jeunes qui restent « libres » au sens de la F1 (donc recrutables) tout en ayant un baquet junior.
2. **Le risque principal est le marché des baquets** : s'il est mal dosé, soit tous les talents percent, ce qui donnerait un monde trop juste, soit l'argent décide de tout. Il faudra le mesurer (§12) sans le forcer.
3. **Le repérage** donne enfin un usage réel au département recrutement, et au joueur un vrai levier pour « découvrir » un talent avant les autres. Il doit coûter assez pour ne pas devenir automatique.
4. Cette phase est **plus grosse que la 6a**. Je propose de la livrer en deux temps :
   - **6b-1** : catégories, écuries juniors, courses, expérience, réputation, marché des baquets, passé de départ ;
   - **6b-2** : académies, affiliations, financement complet, repérage, placement et promotion.

## 15. Questions pour toi

1. **Tailles** : Apex 3 = 30 pilotes et 10 manches, Apex 2 = 22 pilotes et 12 manches. D'accord ?
2. **Académies** : une par écurie de F1, de 2 à 8 places selon les moyens et la politique de recrutement. D'accord ?
3. **Écuries partenaires** : quelques écuries juniors liées à une écurie de F1, et l'écurie « sœur » en F1 (Racing Buls pour Red Bul). On garde ces liens pour les écuries des données, et on en génère d'autres au hasard ?
4. **Financement** : famille, mécène et académie en 6b ; sponsors nationaux en phase 7. D'accord ?
5. **Prix des baquets** (ordre de grandeur) : environ 1 M€ par an en Apex 3 et 2,5 M€ en Apex 2. D'accord, ou préfères-tu que ChatGPT vérifie ces ordres de grandeur ?
6. **Livraison en deux temps** (6b-1 puis 6b-2) : d'accord ?

## 16. Audit indépendant de ChatGPT (commit f3120105) — suites données (D-115)

| Constat de l'audit | Suite |
| --- | --- |
| Le repérage améliorait l'estimation dès le lancement, puis perdait tout à l'expiration | **Corrigé (anomalie structurelle)** : la **connaissance** (0 à 1) s'acquiert pendant la mission (30 % de ce qui reste à apprendre par période de 4 semaines), puis s'oublie progressivement (demi-vie ≈ 1 an). Elle est stockée par écurie et par personne ; le volume est borné (seuil d'effacement, 80 fiches par écurie) |
| Les missions ne vérifiaient pas les moyens financiers | **Corrigé** : refus si l'écurie est en crise, sous administration, ou si sa trésorerie ne couvre pas le coût. Le coût reste faible (0,05 M€) et la capacité est bornée par le département recrutement. Les abus (multiplier les missions) sont limités par cette capacité, pas par le prix. À surveiller en laboratoire |
| Baquets accordés à des jeunes incapables de payer, prix réel non conservé | **Comportement volontaire, documenté** : une écurie ne roule pas à vide et prend le meilleur candidat au prix qu'il peut payer. **Le prix réellement payé et l'indicateur « subventionné » sont désormais conservés** dans l'affectation. Leur fréquence est mesurée par `npm run demographie` et un test vérifie que les baquets subventionnés restent minoritaires et que l'argent reste un obstacle |

Tests de non-régression : `tests/audit-6b.test.ts`. Format de sauvegarde 11 (table des connaissances).

