# Phase 6 — Cycle de vie et filières de formation des pilotes

> Statut : **ORIENTATIONS** (22/11/2026). Demande du porteur, intégrée à la feuille de route. **Pas d'implémentation maintenant.** La conception détaillée sera rédigée et validée avant le début de la phase 6.
> Ce document fixe surtout les **dépendances** avec les phases 4, 5 et 7, pour que les contrats de la phase 4 soient conçus dès le départ de façon compatible.

## 1. Ce que demande le porteur

Un véritable écosystème de formation, où les catégories inférieures **existent réellement** dans la simulation :
- deux championnats juniors (équivalents F2 et F3), avec leurs écuries, pilotes, calendriers, résultats, classements et palmarès ;
- un réservoir de jeunes issus de la F4 et du karting ;
- des académies propres aux écuries, des contrats d'affiliation, le financement des carrières juniors ;
- le placement des affiliés dans les catégories inférieures ou dans des écuries partenaires ;
- le recrutement et le débauchage des jeunes talents par toutes les écuries ;
- des rapports de recrutement à potentiel incertain ;
- une progression et un déclin individualisés, les retraites et les reconversions ;
- de nouvelles générations procédurales chaque saison ;
- la gestion des places disponibles et du renouvellement des grilles.

Tout ce qui se passe chez les juniors (résultats, expériences, relations) **est conservé toute la carrière**.

## 2. Mon avis franc

1. **C'est trop gros pour une seule phase.** Je propose de couper en deux :
   - **6a — Cycle de vie** : progression et déclin, retraites, reconversions, nouvelles générations, réservoir karting/F4, potentiel incertain ;
   - **6b — Filières juniors** : championnats juniors, écuries juniors, académies, affiliations, financement, placement, renouvellement des grilles.

   6b a besoin de 6a : il faut des jeunes qui progressent pour que les championnats juniors aient un sens.
2. **Le recrutement et le débauchage des jeunes talents relèvent du marché du travail (phase 7).** C'est le même moteur que pour les adultes : offres, utilité, agents, clauses. Les coder en phase 6 reviendrait à écrire deux marchés. Je propose qu'en phase 6b les académies recrutent **dans le réservoir libre**. Le débauchage d'un jeune sous contrat chez un rival arrivera avec la phase 7.
3. **Les noms « F2 », « F3 » et « F4 » sont des marques déposées**, comme « F1 ». Il faut des noms fictifs pour les catégories. Je propose que ChatGPT en suggère, comme pour le championnat principal (D-036).
4. **Grilles juniors de départ** : on peut s'inspirer des vraies grilles 2026 de F2 et F3 (noms altérés, comme D-042), ou les générer. Je recommande de **les générer** :
   - ces pilotes sont jeunes et peu connus du public, donc le risque d'image est plus fort, et l'intérêt de les reconnaître plus faible ;
   - leurs données publiques (niveau, potentiel) sont très incertaines ;
   - l'histoire ancrée (D-046) n'en a pas besoin.

   C'est une décision pour toi (voir §8).

## 3. Contenu proposé

### 6a — Cycle de vie

| Élément | Principe |
| --- | --- |
| Progression et déclin | Chaque compétence évolue chaque mois selon l'âge et la courbe du métier (D-051), l'écart au potentiel, le professionnalisme, l'expérience accumulée (courses disputées, niveau de la catégorie), la qualité de l'encadrement (installations, ingénieurs) et la motivation. Le déclin commence à un âge propre au métier, avec des écarts individuels |
| Potentiel incertain | Le potentiel exact reste caché. Chaque observateur (écurie, joueur) en a une **estimation en fourchette**, qui dépend des rapports de recrutement et du temps d'observation (D-013) |
| Rapports de recrutement | Un département recrutement plus ou moins compétent produit des rapports : fourchette, points forts, indices de personnalité, erreurs possibles |
| Retraites | Décision humaine (utilité) : âge, déclin, palmarès, offres restantes, aspirations, valeurs. Pas un âge fixe |
| Reconversions | Un pilote retraité peut devenir consultant, ambassadeur, team principal, directeur sportif, coach d'académie, ou agent. Ses compétences transversales et ses relations le permettent ou non. **Ses souvenirs et relations le suivent** |
| Nouvelles générations | Chaque saison, une cohorte de jeunes (≈ 12–15 ans) entre dans le réservoir. Nationalités pondérées, potentiel très dispersé, quelques pépites rares. Pas de quota artificiel |
| Réservoir karting / F4 | **Abstrait** : pas de courses simulées une par une, mais un classement de niveau annuel par catégorie d'âge, qui produit une réputation et attire les académies. Proposition : karting de 8 à 15 ans, F4 de 15 à 17 ans |

### 6b — Filières juniors

| Élément | Principe |
| --- | --- |
| Championnats juniors | 2 catégories (équivalents F3 et F2) : leurs propres écuries (organisations), voitures **identiques** dans chaque catégorie (proche de la réalité : le pilote et l'équipe font la différence), calendrier (≈ 10–14 manches), courses abstraites avec le même modèle que la F1 (paramètres propres), points, classements, palmarès |
| Écuries juniors | Organisations à part entière : budget, qualité de l'équipe technique, liens avec des écuries de F1 (écuries partenaires), réputation de formatrice |
| Académies | Département d'une écurie de F1 : nombre de places, budget, encadrement. Elles recrutent dans le réservoir et parmi les juniors, financent, placent et forment. Le joueur peut les gérer |
| Contrat d'affiliation | Un pilote est lié à une académie **en parallèle** de son contrat de course dans une écurie junior : financement, option prioritaire pour une promotion, clause de rachat, durée |
| Financement | Un junior paie ou est payé selon son budget personnel (famille, sponsors personnels, académie). Ce budget conditionne l'accès aux bonnes écuries juniors : du talent sans argent peut stagner (dilemme réaliste) |
| Placement | L'académie place ses affiliés dans une écurie junior (partenaire ou non), ou dans une écurie de F1 partenaire (ex. : Racing Buls pour Red Bul) |
| Renouvellement des grilles | Chaque fin de saison : places libérées par les retraites, les départs et les licenciements → promotions des juniors, recrutements, montées et descentes entre catégories. **Toutes les places sont pourvues par des décisions** (utilité), jamais par tirage |
| Passage en F1 | Il s'appuie sur la réputation construite en junior (résultats, titres, régularité), le potentiel estimé, les promesses d'académie, le budget personnel et les relations |

### Mémoire conservée toute la carrière

- Les **résultats juniors** sont gardés en résumé par saison (classement final, victoires, titres) dans la carrière de chaque pilote. Le détail course par course est effacé après 2 saisons, comme en F1 : la taille reste bornée.
- Les **relations nées chez les juniors** (anciens coéquipiers, rivalités de F3, mentor d'académie) sont des relations ordinaires, qui suivent les personnes. Une rivalité de F3 peut ressurgir en F1 dix ans plus tard.
- Les **événements juniors marquants** (titre, rivalité, promesse d'académie tenue ou rompue) passent par la même mémoire (souvenirs, résidu, Chronique pour les titres).

## 4. Dépendances

| Phase | Ce que la phase 6 exige d'elle |
| --- | --- |
| **4 — Contrats et mémoire** | Un **modèle de contrat générique**, à prévoir dès la phase 4 (§5) |
| **5 — Économie** | Budgets des académies et des écuries juniors, budget personnel des pilotes, coût des places, primes juniors |
| **3 — Saison abstraite** | Rendre le moteur de saison **multi-championnats** : un champ `championnat` sur les saisons, les Grands Prix et les résultats ; des paramètres par catégorie |
| **7 — Marché du travail** | Recrutement et débauchage des jeunes sous contrat chez un rival, agents des jeunes, clauses de rachat exercées |
| **8 — Mémoire v2** | Diffusion de la réputation d'un jeune (rumeurs, presse spécialisée), groupes sociaux « anciens de l'académie » |
| **9 — Histoire ancrée** | Juniors générés (§2.4) : l'histoire ancrée ne concerne que la F1. Les juniors de 2027 reçoivent un passé simulé court (2 à 4 saisons juniors), sans contrainte |

Ordre proposé : **4 → 5 → 6a → 6b → 7**. La phase 7 (marché) arrive juste après, pour brancher le débauchage des jeunes sur le même marché que les adultes.

## 5. À prévoir dès la phase 4 (pour ne pas tout refaire)

La phase 4 n'implémente pas les juniors, mais ses structures doivent les accueillir sans migration douloureuse :

1. **Contrats typés** : `type` = `emploi` (actuel) · `affiliation` · `financement` · `placement`. Une personne peut avoir **plusieurs contrats actifs simultanés**, de types différents (un contrat de course et une affiliation).
2. **Parties génériques** : un contrat lie une personne à **une organisation quelconque** (écurie de F1, écurie junior, académie, sponsor personnel), pas seulement à une écurie de F1.
3. **Clauses structurées** : objet `clauses` typé (option prioritaire, rachat, financement annuel, obligation de placement, statut de n°1, prime), au lieu d'un simple texte.
4. **Promesses ouvertes aux juniors** : le type « promotion en F1 à une saison donnée » s'ajoute facilement aux 5 types prévus.
5. **Organisations typées** : prévoir les types `ecurie_junior`, `academie` et `championnat` dans le tronc commun des organisations.
6. **Carrière** : la table `carrieres` (aujourd'hui alimentée par les données) devient alimentée par la simulation, avec la catégorie et un résumé de résultats.
7. **Souvenirs et relations** : déjà indépendants des organisations. Aucun changement à prévoir.

Ces 7 points seront intégrés à la conception détaillée de la phase 4 (`phase-4-contrats-memoire.md`, §12).

## 6. Volumes et performances (estimation)

- Championnats juniors : ≈ 22 + 30 pilotes, ≈ 12 manches chacun, soit environ 2 fois le calcul d'une saison de F1. Supportable (une saison de F1 ≈ 7 ms).
- Réservoir : ≈ 15 entrées par an. Les personnes retraitées s'accumulent (≈ 4 000–6 000 personnes en 50 saisons, comme prévu dans l'architecture). La mémoire reste bornée par personne.
- Sauvegarde : résumés de saison juniors uniquement après 2 saisons. Objectif inchangé : < 5 Mo compressés après 50 saisons.

## 7. Critères de validation (première version, à préciser)

- Sur 50 saisons, la pyramide des âges et le nombre de pilotes en F1 issus des filières restent plausibles. Objectif statistique à définir : ~2 à 4 débutants par an en F1, carrière moyenne de 6 à 10 ans.
- Un titre junior augmente nettement les chances de promotion, sans la garantir.
- Des talents sans budget stagnent parfois, et des pilotes payants moyens accèdent parfois à la F1 (mesuré, pas imposé).
- Des académies se distinguent par leur réputation de formatrice, du fait de leurs résultats réels.
- Les rivalités juniors réapparaissent en F1 dans une partie des carrières (mesure par chaînes de causes).
- Aucun pilote n'apparaît en F1 sans passé : chacun a une carrière junior, simulée ou issue des données.

## 8. Questions pour le porteur (et ChatGPT)

1. **Découpage 6a / 6b** et **recrutement des jeunes en phase 7** : d'accord ?
2. **Noms fictifs** des catégories (équivalents F2, F3, F4) : proposés par ChatGPT ?
3. **Grilles juniors de départ** : générées (recommandé) ou inspirées des vraies grilles 2026 avec noms altérés ?
4. **Karting et F4 abstraits** (classement de niveau annuel, pas de courses) : d'accord ?
5. **Ordre des phases** : économie (5) avant les filières (6b), car académies et financements ont besoin d'argent ?
