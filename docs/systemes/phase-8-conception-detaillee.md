# Phase 8 — Conception détaillée : règlements, mémoire v2, groupes sociaux, politique

> Statut : **PROPOSITION — À VALIDER** (23/11/2026). **Aucun code avant validation** (règle du projet).
> Cadre déjà validé :
> - D-090 et `phase-8-cycles-reglementaires.md` : grands changements de règlement, orientations ;
> - `memoire.md` §3 et §4 : diffusion de l'information, réputation perçue, groupes sociaux (principes) ;
> - D-012 : sujets de vote envisagés ;
> - D-081 et D-082 : récompenser les choix, pas le hasard ;
> - D-095 et D-120 : la grande campagne d'équilibrage suit la phase 8.
>
> Déséquilibres que cette phase doit pouvoir résoudre (sans les forcer) :
> - dynasties (57 % des séries de 10 saisons après la 7a) ;
> - convergence des voitures vers le plafond ;
> - dominations par la meilleure voiture ;
> - hiérarchie figée.

## 1. Découpage proposé

| Sous-phase | Contenu | Pourquoi dans cet ordre |
| --- | --- | --- |
| **8a** | Cycles réglementaires : fédération, propositions, votes, annonce, anticipation, entrée en vigueur, convergence, coups de génie, motoristes | Le levier le plus fort contre les dynasties et la convergence ; il ne dépend pas du reste |
| **8b** | Mémoire v2 : connaissances (qui sait quoi), fuites et rumeurs, réputation perçue | Prépare la politique : on ne vote, on ne s'allie et on ne se méfie que d'après ce que l'on sait |
| **8c** | Groupes sociaux (émergents) et politique : alliances d'écuries, lobbying, votes sur d'autres sujets | S'appuie sur 8a (les votes) et 8b (l'information) |

Ensuite viendra la **grande campagne d'équilibrage d'après la phase 8**, en partie plafonnée par D-120 tant que le moteur de course reste abstrait.

## 2. Phase 8a — Cycles réglementaires

### 2.1 Modèle

- **Règlement** (nouvelle table) : identifiant, années de début et de fin, **accent** (aéro, moteur, mécanique et pneus, ou équilibré), multiplicateurs de poids par caractéristique, part de savoir conservée, statut (en vigueur, annoncé, proposé).
- **Fédération** : une organisation (type « instance » déjà réservé, D-063), avec un président (un personnage) dont les traits pèsent sur les propositions. Le président changera par élection en 8c.
- **Calendrier** :
  - le règlement en vigueur fixe sa durée prévue, de 4 à 6 ans ;
  - **3 ans avant sa fin**, la fédération propose 2 ou 3 options ;
  - les écuries votent à la mi-saison ;
  - le règlement adopté est **annoncé 2 ans avant** son entrée en vigueur (D-090) ;
  - une option « prolonger le règlement actuel de 1 ou 2 ans » existe : la fréquence est donc bien votée.

### 2.2 Options proposées et effets

| Accent | Caractéristiques renforcées (poids) | Affaiblies | Qui en profite a priori |
| --- | --- | --- | --- |
| Aéro | virages rapides, efficacité aéro (+40 %) | vitesse de pointe (−20 %) | soufflerie, CFD, responsable aéro forts |
| Moteur | vitesse de pointe, fiabilité moteur (+40 %) ; poids du motoriste dans l'indice (+50 %) | efficacité aéro (−20 %) | motoristes forts et leurs écuries clientes |
| Mécanique et pneus | virages lents, gestion des pneus (+40 %) | efficacité aéro (−20 %) | conception, simulateur, pilotes gestionnaires |
| Équilibré | aucun changement de poids, seulement la convergence | — | les écuries en retard (remise en jeu partielle) |

Les ordres de grandeur sont **provisoires** ; ils seront rangés dans `balance/reglement.ts` et réglés en laboratoire.

### 2.3 Vote

- **Une voix par écurie** ; la fédération tranche les égalités selon l'accent préféré de son président.
- **L'IA vote par intérêt calculé** :
  - estimation de sa position relative sous chaque option : forces dans les caractéristiques renforcées, installations, responsables, motoriste ;
  - le leader actuel préfère souvent le statu quo ou la prolongation ;
  - les écuries distancées préfèrent la remise en jeu.
- **Le joueur vote** par une commande, avec la même information que l'IA.
- En 8c, les alliances et le lobbying modifieront les votes ; en 8a, chacun vote seul.

### 2.4 Anticipation (le vrai dilemme)

- **Nouvelle ligne de budget « voiture suivante »**, ouverte dès l'annonce : une part de l'effort technique va à la future voiture, au détriment de la saison en cours. Migration de sauvegarde prévue.
- **L'IA décide par utilité** : un prétendant au titre investit moins, une écurie distancée investit plus. Le goût du risque du team principal et les attentes du conseil comptent.
- **Le joueur décide** par une commande.
- La part investie est mémorisée, car elle détermine l'avantage de départ.

### 2.5 Entrée en vigueur

- **Convergence** : chaque caractéristique se rapproche d'une base commune, et l'écurie conserve une part de son savoir (de 30 à 50 %, à régler en laboratoire).
- **Avantage de départ** : un bonus aux caractéristiques mises en avant, selon :
  - l'investissement anticipé ;
  - les compétences des responsables du domaine ;
  - les installations.
- **Motoristes** : dans un cycle moteur, leur niveau évolue selon leurs investissements ; cela peut provoquer des changements de fournisseur.

### 2.6 Coups de génie

- **Rares et mérités** :
  - la probabilité grandit avec un directeur technique visionnaire, un fort investissement anticipé et un bon département conception ;
  - plafonnée, par exemple à 1 ou 2 par cycle dans toute la grille.
- **L'effet** est un bonus temporaire sur une caractéristique, qui s'érode quand les autres copient (en 1 à 2 saisons).
- **Événement public** : les autres écuries peuvent réclamer, puis la fédération tranche : astuce légale ou interdite pour la saison suivante.

### 2.7 Laboratoire

À mesurer :
- dynasties qui survivent à un changement de règlement ;
- titres qui changent de mains dans les 2 saisons suivantes ;
- valeur de l'anticipation (D-082) ;
- convergence des voitures ;
- fréquence et effet des coups de génie ;
- fréquence des prolongations votées.

## 3. Phase 8b — Mémoire v2 : qui sait quoi

- **Connaissance d'un fait** : pour chaque événement privé, la liste bornée de ceux qui le connaissent. Les événements publics sont connus de tous.
- **Fuites** (déjà prévues, `memoire.md` §3) :
  - chaque semaine, un fait privé peut se propager le long des relations ;
  - la probabilité dépend de la discrétion de ceux qui le connaissent (le trait `discretion` sera enfin lu), de la familiarité et de l'intérêt du fait (importance) ;
  - un fait connu de nombreuses personnes peut devenir public.
- **Rumeurs** : une fuite peut être déformée (par exemple, une offre exagérée). La rumeur reste marquée comme telle ; ceux qui la connaissent peuvent la croire ou non selon leur confiance envers la source.
- **Réputation perçue** : chacun juge un acteur sur ce qu'il sait de lui (faits publics, faits privés qui lui sont parvenus, expérience directe), et non plus sur les seuls faits publics.
- **Règle d'or** : un personnage ne réagit qu'aux faits qu'il connaît. Les réactions déjà en place (souvenirs, relations) sont filtrées par la connaissance.
- **Volumes bornés** :
  - nombre de connaisseurs par fait ;
  - nombre de faits privés suivis ;
  - les faits anciens s'effacent comme les événements détaillés.

## 4. Phase 8c — Groupes sociaux et politique

### 4.1 Groupes sociaux (émergents, `memoire.md` §4)

- **Détection** chaque saison : des ensembles de personnes reliées par une forte affinité et un respect mutuel (au-dessus d'un seuil), à partir de passés communs (mêmes écuries, mentorat, académie). Aucun groupe n'est créé à la main.
- **Leader** : le membre le plus respecté par les autres.
- **Effets** :
  - quand le leader part, chaque membre est davantage tenté de le suivre : cela enrichit les départs en groupe de la 7b avec de vraies personnes. Limite actuelle : les ingénieurs ne sont pas individualisés, et le départ en groupe ne fait que déplacer du niveau de département (`phase-7-marche-du-travail.md` §16) ;
  - **démissions et ruptures négociées** (D-077), via une clause de départ et une indemnité négociée, même commande pour le joueur et l'IA ;
  - un groupe opposé à la direction abaisse la cohésion et la motivation de son département ;
  - un groupe soudé autour d'un pilote pèse dans le choix du n°1.

### 4.2 Politique

- **Alliances d'écuries** :
  - liens naturels : écuries clientes d'un même motoriste, écurie sœur (lien réel conservé, D-112), relations entre team principals ;
  - elles votent souvent ensemble, sans obligation.
- **Lobbying** : un team principal bien vu de la fédération, qui a de bonnes relations et du prestige, pèse sur le choix des options proposées (et non sur le décompte des voix).
- **Autres sujets de vote** (D-012) :
  - niveau du plafond budgétaire ;
  - restrictions aéro selon le classement ;
  - nombre de Grands Prix.

  Ils sont proposés par la fédération selon la conjoncture (par exemple une crise économique) et votés de la même façon.
- **Élection du président de la fédération** tous les 4 ans : les écuries votent, et les candidats ont des préférences d'accent réglementaire.

## 5. Attributs nouveaux et qui les lit

| Attribut | Lu par |
| --- | --- |
| Règlement (accent, poids, savoir conservé) | Performance des voitures, convergence, votes |
| Part « voiture suivante » du budget | Avantage de départ au nouveau règlement |
| Coup de génie (caractéristique, bonus, érosion) | Performance des voitures, réclamations |
| Connaisseurs d'un fait, rumeurs | Réactions des personnages, réputation perçue, fuites |
| `discretion` (trait existant) | Fuites |
| Groupe (membres, leader) | Départs en groupe, cohésion, motivation, statut de n°1 |
| Alliances (liens entre écuries) | Votes |
| Président de la fédération (préférences) | Propositions, égalités |

## 6. Avis franc

1. **La phase 8a est prioritaire et autonome.** Elle s'attaque directement aux dynasties et à la convergence. Je propose de la livrer seule, et de la mesurer, avant 8b et 8c.
2. **La phase 8b est coûteuse en calcul et en volume.** Savoir qui connaît quoi peut exploser. Il faudra des bornes strictes et des mesures de performance dès le départ (outil `npm run performance`).
3. **La phase 8c dépend fortement du réglage des relations.** Si les groupes n'émergent pas, la règle est de régler les relations, et non de créer des groupes à la main.
4. **Effet attendu sur l'équilibrage :**
   - fort pour la 8a ;
   - faible et indirect pour la 8b et la 8c, qui enrichissent surtout la vie du paddock.
5. **Le plafonnement des voitures** reste en partie un sujet de la phase 12. La 8a le corrige par la convergence à chaque cycle, mais ne remplace pas les compromis de conception.

## 7. Questions pour toi

1. **Découpage** : 8a (règlements), puis 8b (information), puis 8c (groupes et politique). D'accord ?
2. **Options de règlement** : les quatre accents (aéro, moteur, mécanique et pneus, équilibré) et l'option « prolonger d'un ou deux ans ». Faut-il en ajouter, par exemple un accent « sécurité » ou « coûts » ?
3. **Vote** : une voix par écurie, avec la fédération qui tranche les égalités, ou une pondération (par exemple selon l'ancienneté ou le palmarès, comme certains droits historiques) ?
4. **Coups de génie** : 1 à 2 par cycle au plus dans toute la grille, avec une réclamation possible des autres écuries. D'accord ?
5. **Anticipation** : le joueur choisit lui-même la part de son budget consacrée à la voiture suivante. Faut-il aussi permettre de la confier au directeur technique (délégation) ?
6. **Autres sujets de vote** (plafond budgétaire, restrictions aéro, nombre de Grands Prix) : dès la 8c, ou plus tard ?
7. **Président de la fédération** élu tous les 4 ans, avec des préférences qui pèsent sur les propositions : d'accord ?
8. **Ingénieurs clés individualisés** (3 à 5 par département, environ 130 personnes de plus) pour de vrais départs en cascade en 8c, ou garder l'approximation par département ?
