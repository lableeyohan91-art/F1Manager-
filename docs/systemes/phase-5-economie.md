# Phase 5 — Économie

> Statut : **VALIDÉ** (D-078, 22/11/2026). Livraison en deux temps : 5a puis 5b. Réponses aux questions du §12 dans D-078.
> **5b réalisée** le 22/11/2026 (rapport `docs/rapports/2026-11-22-p5b-economie.md`, décisions D-092 à D-094 à valider).
> **5a réalisée** le 22/11/2026 (rapport `docs/rapports/2026-11-22-p5a-economie.md`). Écarts validés (D-084 à D-088) : D-084 (effort technique au lieu du seul budget de développement), D-085 (dividendes), D-086 (marge de sécurité), D-087 (coûts), D-088 (étages).
> Inspirations : la gestion financière de F1 Manager (budget, plafond, installations, sponsors) et la profondeur de Football Manager (propriétaires, conseil, finances qui pèsent sur chaque décision).
> Dépendances : phase 3 (primes), phase 4 (contrats, salaires, indemnités, IA des dirigeants). Anticipe les phases 6a et 6b (académies, financement des jeunes), 7 (marché), 8 (règlement), 12 (pièces).

## 1. Objectif

Chaque écurie gère **réellement** son argent, avec les mêmes règles que le joueur : trésorerie, budget, plafond, sponsors, propriétaire, investissements, dettes. L'argent a des conséquences :
- sur la voiture (budget de développement) ;
- sur le personnel (masse salariale, capacité à recruter et à garder) ;
- sur les infrastructures ;
- sur la survie de l'écurie (crises, rachats).

**Résultat attendu.** Une écurie riche ne gagne pas automatiquement : le plafond, les restrictions selon les résultats et les rendements décroissants la freinent. Une petite écurie bien dirigée, même par l'IA, peut progresser jusqu'au titre en plusieurs saisons. Cela doit rester rare et difficile, mais possible.

## 2. Le modèle comptable

Comptabilité **mensuelle** : un pas de calcul toutes les 4 semaines, et un bilan annuel à l'intersaison.

### Recettes

| Recette | Principe | Données de départ |
| --- | --- | --- |
| Droits sportifs et primes | Enveloppe répartie selon le classement constructeurs (existe déjà, phase 3), versée en douze mensualités la saison suivante | `balance/reglement.ts` |
| Revenus commerciaux | Billetterie partagée, produits dérivés, hospitalité : f(popularité, prestige, résultats récents, marché du pays) | `finances.csv` (base par écurie) |
| Sponsors | Contrats avec montant fixe, primes d'objectifs, clauses (§4) | Générés (noms fictifs) |
| Apport du propriétaire | Selon le type de propriétaire et sa personnalité (§5) | `finances.csv` |
| Ventes ponctuelles | Prestations techniques (vente de pièces ou de motorisation à des clients), cessions d'actifs en cas de crise | Règles |

### Dépenses

| Dépense | Plafonnée ? | Principe |
| --- | --- | --- |
| Salaires du personnel (départements) | Oui | Effectif × niveau moyen × coût unitaire |
| Salaires des pilotes et des 3 cadres les mieux payés | **Non** (comme le règlement réel) | Contrats de la phase 4 |
| Développement : recherche, conception, fabrication | Oui | Budget de développement alloué (§6), qui remplace le facteur budget provisoire de la phase 3 |
| Opérations : logistique, déplacements, pièces de rechange, réparations | Oui | f(nombre de Grands Prix, distance, accidents) |
| Entretien des installations | Oui | f(niveau, âge, taille) : les grandes structures coûtent cher à entretenir |
| Investissements d'infrastructure | Non, dans la limite d'une enveloppe d'investissement réglementaire | Projets pluriannuels (§7) |
| Marketing, hospitalité | Non | Améliore les revenus commerciaux et l'attrait pour les sponsors |
| Indemnités de rupture | Non | Licenciements, rachats de contrat (phase 4) |
| Intérêts de la dette | Non | §8 |
| Académie, financement des jeunes | Hors plafond (réservé, phase 6b) | Lignes budgétaires prévues dès maintenant |
| Amendes | Non | Dépassement du plafond, infractions |

### Plafond budgétaire

- Il s'applique aux **dépenses plafonnées** de la saison (D-055). Le montant est un paramètre du règlement, modifiable par vote en phase 8.
- **Dépassement mineur** (< 5 %) : amende, réduction du temps de soufflerie l'année suivante, atteinte à la réputation.
- **Dépassement majeur** : sanctions sportives (points retirés), forte atteinte à la réputation, possible enquête qui coûte cher.
- L'IA, comme le joueur, peut **choisir** de prendre le risque de dépasser. C'est un vrai dilemme, pas une interdiction technique.

## 3. Mécanismes contre le « cercle vertueux infini » du vainqueur

Le cercle à éviter : une écurie gagne, gagne plus d'argent, attire les meilleurs, développe mieux, et regagne. Les mécanismes prévus, tous issus de la réalité ou de règles crédibles :

| Mécanisme | Effet | Qui en bénéficie |
| --- | --- | --- |
| **Plafond budgétaire** | Au-delà du plafond, l'argent ne sert plus au développement : il sert aux salaires des stars, aux infrastructures (enveloppe limitée) et aux réserves | Les écuries moyennes qui atteignent le plafond |
| **Restrictions aérodynamiques selon le classement** | Le temps de soufflerie et de simulation est inversement proportionnel au classement de la saison précédente (échelle réglementaire, paramètre) | Les écuries mal classées |
| **Rendements décroissants** | Déjà en place (phase 3) : plus une voiture est proche du plafond technique, plus elle progresse lentement | Ceux qui rattrapent leur retard |
| **Coût des grandes structures** | Entretien et personnel des grosses installations ; inertie (une grande organisation change plus lentement) | Les structures agiles |
| **Risque des investissements** | Dépassements de coûts, retards, installations qui n'apportent pas le gain espéré | — |
| **Erreurs de recrutement** | Potentiel incertain (phase 6a), remplaçants qui déçoivent | — |
| **Changements de réglementation** (phase 8) | Remettent les compteurs partiellement à zéro ; le développement de la saison suivante entre en concurrence avec celui de la saison en cours | Ceux qui anticipent |
| **Perte de personnel et d'expertise** (phase 7) | Les meilleurs ingénieurs des équipes dominantes sont convoités | Les rivaux |

> Point à trancher : le règlement réel accorde des **primes historiques** à certaines écuries. Les intégrer en donnée (réalisme) **renforce** le cercle vertueux. Je propose de ne pas les inclure par défaut, et de les prévoir en paramètre désactivé (question §12).

## 4. Sponsors

- **Entreprises fictives générées** (secteur, pays, taille, image recherchée, budget marketing). Aucune vraie marque.
- **Contrat de sponsoring** : montant fixe annuel ; primes (podiums, classement, victoires) ; **objectifs** (classement minimal, visibilité, pilote d'une nationalité donnée) ; **clauses** (sortie en cas d'objectif manqué, exclusivité de secteur, image : un scandale peut faire fuir) ; durée.
- **Attrait** d'une écurie pour un sponsor : popularité, résultats, prestige, pilotes populaires, nationalité, niveau du département marketing.
- **Négociation** : même moteur d'utilité que la phase 4, côté sponsor. Les sponsors ont une **mémoire** simple (une rupture brutale ou un objectif raté laissent une trace).
- Satisfaction suivie chaque mois. Les renouvellements et les départs produisent des événements (et des actualités en phase 11).

## 5. Propriétaires et conseil

- **Types de propriétaire** : constructeur automobile, milliardaire passionné, fonds d'investissement, famille fondatrice, consortium. Chacun a ses propres objectifs (image, profit, titre), sa patience et sa capacité d'investissement.
- Le propriétaire est **une personne ou une organisation avec une personnalité** (ambition, patience, risque). Il a une mémoire et des relations avec le team principal, avec les mêmes règles que la phase 4.
- **Le conseil** fixe des objectifs à court, moyen et long terme, et évalue le team principal (remplace la règle provisoire `decisionConseil` de la phase 4). Il peut licencier, prolonger, augmenter ou couper le budget.
- **Changement de propriétaire** : vente en cas de crise, d'opportunité ou de lassitude. Le nouveau propriétaire a d'autres ambitions, d'autres moyens et d'autres relations. Le conseil peut alors changer de team principal.

## 6. Budget annuel et IA économique

Chaque intersaison, **le team principal propose et le conseil arbitre** le budget de l'année. Pour toutes les écuries, IA comprises :

1. Recettes prévues : primes connues, sponsors sous contrat, commercial estimé, apport du propriétaire.
2. Engagements : salaires sous contrat, dette, projets d'infrastructure en cours.
3. **Allocation** des marges entre :
   - le développement de la voiture de l'année ;
   - le développement de la voiture suivante (**sacrifier une saison**, utile avant un changement de règlement) ;
   - les infrastructures ;
   - le recrutement (enveloppe salariale) ;
   - le marketing ;
   - les réserves ;
   - (plus tard) l'académie.

L'IA choisit cette allocation par **utilité**, selon :
- l'**identité** de l'écurie (culture, philosophie technique, politique de recrutement) ;
- la **situation** : classement, écart avec la tête, marge sous le plafond, trésorerie, changement de règlement à venir ;
- la **personnalité des dirigeants** : risque, ambition, patience du propriétaire ;
- les **objectifs du conseil**.

En cours de saison, chaque mois : suivi des écarts, coupes si la trésorerie baisse, rallonge en cas de bonne surprise, **renoncement** à un recrutement trop cher, réaction aux imprévus (accident coûteux, sponsor qui part).

**Pas de triche** : l'IA ne connaît que ce que le joueur connaîtrait (ses propres comptes, les classements, la réputation des autres). Elle peut se tromper.

**Lien avec le développement.** La capacité de développement de la phase 3 (compétences, installations, budget) prend désormais le **budget de développement réellement dépensé**, plafonné, avec les restrictions aérodynamiques selon le classement.

## 7. Infrastructures

Projets d'amélioration (soufflerie, simulateur, usine, centre de recherche…) :
- **coût** et **durée** (6 à 24 mois) ;
- **risques** : retard, dépassement de coût ;
- **entretien** croissant avec le niveau ;
- **vieillissement** : sans entretien, une installation perd en efficacité.

Financement par la trésorerie, l'apport du propriétaire ou l'emprunt. Le niveau, l'âge et l'état agissent sur l'efficacité des départements (déjà prévu dans les entités).

## 8. Dette, crises et rachats

- **Emprunt** possible, avec un taux qui dépend de la santé financière et du soutien du propriétaire. Remboursements mensuels.
- **Signaux de difficulté** :
  - trésorerie sous un seuil → coupes budgétaires et gel des recrutements ;
  - plusieurs mois négatifs → ventes d'actifs, départs de personnel, recherche d'acheteur ;
  - cessation de paiements → **administration**, puis rachat, ou disparition rare (une nouvelle écurie peut alors entrer, phase ultérieure).
- **Conséquences humaines** (phase 4) : salaires en retard ou coupés → souvenirs et relations dégradés, départs.

## 9. Anticiper les phases 6a, 6b et 7 (sans les implémenter)

- Lignes budgétaires **académie** et **financement des jeunes** créées (montant 0 en phase 5).
- Contrats de type `financement` (réservés, phase 4) : un sponsor personnel ou une famille peut financer un pilote ; un pilote payant apporte de l'argent à l'écurie. Mécanisme prévu, activé en 6b.
- Coût des **indemnités et rachats de contrat** : prêt pour le marché de la phase 7.
- Budgets des **écuries juniors** : même modèle, à plus petite échelle (6b).

## 10. Données nouvelles

`data/grille-2026/finances.csv` (estimations de game design, marquées comme telles) : trésorerie de départ, dette, type et apport du propriétaire, base de revenus commerciaux, popularité commerciale par marché, niveau du département marketing. `data/commun/secteurs.csv` : secteurs d'activité pour générer les sponsors fictifs.

## 10 bis. Orientation compétitivité (D-081) appliquée à l'économie

- Les **cibles du laboratoire** (`laboratoire-equilibrage.md`) sont les critères principaux de la phase 5. On mesurera notamment : dominations, dynasties, champions constructeurs sur 20 saisons, mobilité entre tiers, trajectoires des petites écuries.
- **Accumulation des avantages** : les quatre accumulations à surveiller sont l'argent (trésorerie qui grossit), les hommes (meilleurs salariés attirés par les vainqueurs), la technique (avance qui se cumule) et l'image (sponsors et popularité). Chacune doit rencontrer une limite **systémique** et visible : le plafond, les restrictions selon le classement, l'entretien des grandes structures, les rendements décroissants, l'attractivité des projets ambitieux pour certains profils (valeur Défi). **Jamais** une pénalité cachée.
- **Garde-fou** : mesurer la **valeur des décisions** ; les mécanismes ne doivent pas niveler au point de rendre la bonne gestion inutile.

## 11. Indicateurs et critères de validation

| # | Critère | Mesure |
| --- | --- | --- |
| 1 | Toutes les écuries gèrent leurs finances | Aucune écurie avec un budget « attribué » : recettes et dépenses tracées, bilans annuels |
| 2 | Pas de faillite absurde, mais des crises possibles | Sur 100 graines × 20 saisons : quelques crises par décennie ; les faillites rares et expliquées par une chaîne de causes |
| 3 | Plafond crédible | La plupart des grandes écuries l'atteignent. Les dépassements sont rares et sanctionnés |
| 4 | **Cercle vertueux limité** | Corrélation entre le classement d'une saison et celui de 3 saisons plus tard, comparée à la référence de la phase 4 : doit **baisser** |
| 5 | **Petites écuries capables de progresser** | Sur 100 graines × 20 saisons : part des séries où une écurie du dernier tiers de 2027 atteint le top 3 ; nombre de titres d'écuries « modestes ». Objectif à fixer avec ChatGPT, par exemple « possible, mais dans moins de 15 % des séries » |
| 6 | IA économique différenciée | Les allocations de budget diffèrent selon l'identité et la situation (mesuré par écurie) ; des saisons sacrifiées apparaissent avant les changements de règlement (après la phase 8) |
| 7 | Dilemmes financiers | Score financier des tests contrefactuels enrichi (trésorerie, indemnités, engagements) ; nouveaux dilemmes : recruter une star chère, investir ou épargner, dépasser le plafond ou non |
| 8 | Pas de bonus caché | Audit : l'IA n'a accès à aucune donnée inaccessible au joueur |
| 9 | Référence | Rapport d'équilibrage comparé à la référence de la phase 4 (et au réglage retenu par D-074) |

## 12. Questions à trancher

1. **Primes historiques** (comme dans la réalité) : désactivées par défaut, disponibles en paramètre ?
2. **Salaires hors plafond** : pilotes et 3 cadres les mieux payés (règle réelle), ou un autre périmètre plus simple ?
3. **Restrictions aérodynamiques selon le classement** : échelle de 115 % du temps pour le dernier à 70 % pour le premier (ordre de grandeur réel), ou plus douce ?
4. **Le joueur** peut-il s'endetter librement ? Proposition : oui, dans la limite de ce que le conseil et la banque acceptent.
5. **Disparition d'écuries** et entrée de nouvelles écuries : dès la phase 5, ou plus tard ? Proposition : rachats dès la phase 5, disparitions et entrées en phase 8 (avec la politique).
6. **Pas mensuel** pour la comptabilité : suffisant ? (proposition : oui ; les rendez-vous ponctuels comme les primes ou les amendes restent à la semaine).

## 13. Mon avis franc

- **C'est la phase la plus risquée pour l'équilibre.** L'argent touche tout : voiture, personnel, survie. Je propose de la livrer en deux temps :
  - **5a** : trésorerie, budget, plafond, salaires, développement, primes, revenus commerciaux, propriétaire simple ;
  - **5b** : sponsors détaillés, dette, crises, rachats, infrastructures en projets.

  Chaque temps aura sa campagne d'équilibrage complète, comparée à la référence (D-076).
- **L'IA économique est le cœur du problème « une petite écurie peut devenir championne ».** Si l'IA gère mal, les petites écuries ne progresseront jamais ; si elle gère trop bien, tout se nivelle. Il faudra mesurer, pas supposer.
- **Les chiffres réels sont mal connus** (budgets, revenus commerciaux, apports) : tout sera marqué « estimation de game design ».
