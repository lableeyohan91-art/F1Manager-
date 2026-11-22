# Phase 7 — Marché du travail, IA des écuries, agents, valeur commerciale

> Statut : **PROPOSITION — À VALIDER** (22/11/2026). Aucune ligne de code avant validation.
> Cadre déjà validé :
> - D-063 : recrutement et débauchage des jeunes rattachés au marché ;
> - D-066 : remplacement provisoire, qui sera remplacé ici ;
> - D-077 : conséquences humaines ;
> - D-082 : valeur des décisions ;
> - D-096 à D-099 : valeur commerciale, sponsors personnels, pilotes payants, régulation par le marché ;
> - D-111 : âge des débutants et des champions ;
> - D-112, D-115 : académies, option prioritaire, repérage ;
> - D-095 : méthode.
>
> Déséquilibres documentés que cette phase doit pouvoir résoudre (sans les forcer) :
> - débutants trop âgés (24 ans) et champions trop âgés (30 ans) ;
> - dominations par la meilleure voiture (débauchage des ingénieurs) ;
> - absence de pilotes payants ;
> - concentration du sponsoring ;
> - aucune crise financière (inflation salariale, indemnités).

## 1. Objectif

Remplacer le recrutement provisoire par un **vrai marché**, où les écuries ont trois moyens d'agir :
- **anticiper** : contrats qui arrivent à échéance, vieillissement, cibles repérées ;
- **parier** sur un jeune ;
- **débaucher** un pilote ou un ingénieur sous contrat.

Les personnes, de leur côté, **choisissent** : offres concurrentes, agents, ambitions, valeurs, relations. Le joueur et l'IA ont **les mêmes commandes, les mêmes informations et les mêmes règles**.

## 2. Ce qui existe et sera remplacé

| Existant (provisoire) | Limite | Remplacé par |
| --- | --- | --- |
| Recrutement seulement quand un poste est vacant (D-066) | Personne ne prépare l'avenir ; les écuries attendent qu'un jeune ait atteint son niveau (débutants à 24 ans) | Marché avec **planification** (§4) |
| Prolongations décidées à la semaine 30, en une fois | Pas de concurrence | **Fenêtres** de négociation et offres concurrentes (§3) |
| Personne sous contrat intouchable | Pas de débauchage, donc pas de fuite d'expertise | **Débauchage** et clauses de rachat (§6) |
| Salaire = valeur de marché générique | Pas de surenchère ni d'inflation | **Négociation** avec un agent (§5) |
| Pas de valeur commerciale | Pas de pilotes payants (2 %), sponsoring concentré | **Valeur commerciale** et sponsors personnels (§8) |

## 3. Calendrier du marché

| Période | Ce qui se passe |
| --- | --- |
| **Fenêtre principale** (≈ semaines 26 à 50) | Offres pour la saison suivante, prolongations, débauchages, annonces. Les contrats signés prennent effet au 1er janvier |
| Intersaison (semaines 1 à 8) | Derniers ajustements, remplacements d'urgence, affiliations (6b) |
| En saison (hors fenêtre) | Seulement les remplacements d'urgence (blessure plus tard, licenciement) et les prolongations |
| **Personnel technique** | Un ingénieur débauché sert une **période de non-concurrence** (≈ 6 à 12 mois, selon son contrat) avant de rejoindre son nouvel employeur : il continue de travailler, moins impliqué, ou reste à l'écart |

## 4. IA des écuries : planifier, pas seulement remplacer

Chaque écurie (joueur compris, s'il délègue) tient un **plan de personnel** :
1. **Besoins** :
   - contrats qui finissent dans 1 ou 2 ans ;
   - personnes sur le déclin (profil 6a, tel qu'observé) ;
   - poste le plus faible comparé aux rivaux ;
   - promesses d'académie (6b).
2. **Cibles** : les personnes qu'elle estime le mieux, d'après **son** estimation, ses repérages et la réputation. Les cibles peuvent être libres, sous contrat ailleurs ou dans son académie.
3. **Enveloppe salariale** : elle découle du budget (phase 5), avec la part sous plafond et la part hors plafond (pilotes et 3 cadres).
4. **Identité** : politique de recrutement (« filière jeunes », « pilotes confirmés », « vedettes »), goût du risque du team principal, objectifs du conseil.
5. **Décision** : pour chaque besoin, comparer prolonger, promouvoir un jeune, recruter un libre, débaucher (avec le coût du rachat) ou attendre. Le calcul inclut **les conséquences complètes** (D-098) :
   - salaire ;
   - points et primes attendus ;
   - sponsors apportés ou perdus (gain **supplémentaire** réel) ;
   - âge et potentiel estimé ;
   - relations ;
   - risque de conflit entre coéquipiers.

**Levier contre les débutants trop âgés** : une écurie peut désormais **recruter un jeune un an à l'avance** (contrat qui commence plus tard) et l'évaluer sur son potentiel estimé à l'horizon de son contrat, plus seulement sur son niveau actuel. Elle parie, et elle peut se tromper.

## 5. Négociation, offres concurrentes et agents

- **Plusieurs écuries peuvent viser la même personne.** Chacune fait une offre ; la personne compare par utilité (phase 4), avec ses valeurs (Argent, Victoire, Défi, Fidélité, Racines…), ses aspirations, ses relations, le projet sportif, le statut proposé (n°1), la durée et les clauses.
- **Contre-offres** : jusqu'à trois tours, comme les prolongations de la phase 4.
- **Agents** : des personnes à part entière, avec leurs traits et des compétences (négociation, réseau). Chacun a une liste de clients bornée et prend une commission (un pourcentage du salaire). L'agent :
  - fait jouer les offres concurrentes ;
  - défend les intérêts financiers de son client, y compris la valeur commerciale qu'il apporte ;
  - peut pousser un client à partir ou à rester selon son propre intérêt (ses traits).

  Les relations entre agents et écuries comptent (phase 4). Un pilote sans agent négocie seul, moins bien.
- **Clauses** (structure prévue depuis la phase 4) :
  - statut de n°1 ;
  - primes de performance ;
  - **clause de rachat** (montant de sortie) ;
  - **clause de départ** si l'écurie recule au classement ;
  - année d'option ;
  - indemnité de rupture ;
  - période de non-concurrence (personnel).
- **Inflation salariale** : elle naît de la concurrence entre les offres, jamais d'un coefficient annuel imposé. Les pilotes et les 3 cadres les mieux payés sont **hors plafond** (règle de la phase 5) : les écuries riches peuvent payer plus cher les vedettes. Le reste du personnel est sous le plafond, donc débaucher un ingénieur coûte de la marge de développement.

## 6. Débauchage et clauses de rachat

- **Pilotes** : on peut approcher un pilote sous contrat. Pour l'obtenir avant la fin de son contrat, il faut payer sa **clause de rachat**, si elle existe, ou négocier une indemnité avec son écurie. Sinon, on peut le signer pour l'après-contrat (pré-accord). L'écurie actuelle peut **contre-attaquer** en prolongeant ou en augmentant.
- **Ingénieurs et dirigeants** : même principe, plus la **période de non-concurrence**. C'est le **levier principal contre les dominations par la voiture** : une écurie dominante voit ses meilleurs ingénieurs courtisés. L'effet d'un départ passe par les mécanismes existants : compétences des responsables dans la capacité de développement (phase 3), motivation (phase 4), puis connaissances en phase 12.
- **Affiliés d'une académie** (6b) : un rival peut racheter un jeune en payant la clause de rachat de son affiliation, ce qui lève l'option prioritaire.
- **Garde-fous** :
  - le nombre d'approches simultanées est limité par le département recrutement ;
  - un débauchage abîme les relations entre écuries et avec la personne (mémoire, phase 4) ;
  - une écurie qui débauche systématiquement acquiert une **réputation** de prédatrice, qui rend méfiants ses propres employés et les autres écuries. C'est le laboratoire qui vérifiera que la stratégie du débauchage systématique ne devient pas optimale.

## 7. Conséquences humaines (D-077)

Elles émergent des personnalités et des circonstances, avec des souvenirs et des événements :
- **recherche active** d'un autre employeur quand la motivation chute ou que les ambitions ne sont pas satisfaites ;
- **demandes de départ** ;
- **démission** et **rupture négociée** (indemnités) ;
- **départs en groupe** : un directeur technique influent peut entraîner une partie de ses ingénieurs, selon les relations et la loyauté ;
- **pertes d'expertise** ;
- **tensions entre coéquipiers** (statut de n°1, favoritisme ressenti) ;
- **agents qui font jouer une offre** pour obtenir une augmentation.

## 8. Valeur commerciale, sponsors personnels, pilotes payants (D-096 à D-099)

- **Popularité** de chaque personnage (nouvel attribut, 0 à 100), **nationale** et **internationale**. Elle évolue avec les résultats, les titres, l'ancienneté, le charisme (traits sociabilité et besoin de reconnaissance, compétence communication) et, en phase 11, les médias et les scandales.
- **Valeur commerciale** (calculée, pas stockée) : popularité × taille du marché de sa nationalité × **rareté** de sa nationalité sur la grille × image. La nationalité seule ne garantit rien : deux compatriotes peuvent valoir très différemment.
- **Sponsors personnels** : des sponsors du vivier (phase 5) liés à un **pilote**, attirés par sa valeur commerciale. On en distingue trois sortes :
  - **ceux qui ne paient que le pilote**, ce qui augmente ses revenus et réduit d'autant ses exigences salariales ;
  - **ceux qui accompagnent le pilote dans son écurie** : contrat conditionné à sa présence, qui **remplace** un emplacement de sponsor existant au lieu de s'y ajouter ;
  - **les entreprises nationales**.

  En cas de transfert, le sponsor suit le pilote, reste dans l'écurie, renégocie, réduit son engagement ou part, selon son identité et son contrat. **Jamais de double comptage**.
- **Pilotes payants** : un pilote moyen avec beaucoup de valeur commerciale peut apporter plus qu'il ne coûte. La régulation vient du marché : il est en concurrence avec les autres, son agent négocie, il y a peu de places, et un mauvais pilote coûte des points et des primes. **Aucune règle** n'oppose le talent et l'argent ; un contrat très avantageux reste possible et **n'est jamais modifié en cours de route**.
- **Diversification des motivations des sponsors** (D-096) : nationalité des pilotes, marchés, jeune espoir, popularité, en plus des résultats. Remède attendu à la concentration du sponsoring (160 M€ pour le premier contre 52 M€ pour le dernier).

## 9. Commandes (communes au joueur et à l'IA) et délégation

| Commande | Effet |
| --- | --- |
| Faire une offre (libre ou sous contrat), contre-offre, retirer une offre | Négociation |
| Activer une clause de rachat, négocier une indemnité | Débauchage |
| Prolonger, ne pas prolonger, libérer (avec indemnité) | Gestion des contrats |
| Pré-accord pour une saison future | Planification |
| Contacter un agent | Sonder la disponibilité, sans engagement |
| Missions de repérage (6b) | Information |

**Délégation** (D-109 §9) : le joueur peut confier le recrutement au personnel. La qualité dépend du team principal et du département recrutement, sans pénalité liée au mode de jeu.

## 10. Attributs nouveaux et ce qui les lit

| Attribut | Lu par |
| --- | --- |
| Popularité (nationale, internationale) | Valeur commerciale, sponsors personnels, attrait d'une écurie pour les sponsors |
| Agent (personne), clients, commission | Négociation, choix entre offres |
| Clauses de rachat, de départ, d'option, de non-concurrence | Débauchage, fins de contrat |
| Plan de personnel de l'IA (besoins, cibles) | Décisions de l'IA (non stocké si possible : recalculé) |
| Réputation de prédateur d'une écurie | Méfiance des personnes et des écuries |
| Sponsors personnels (contrats liés à un pilote) | Revenus du pilote ou de l'écurie, réactions aux transferts |

## 11. Laboratoire (D-095)

À mesurer :
- **âge des débutants et des champions** (D-111) ;
- nombre de transferts par saison ;
- mobilité du personnel technique ;
- **effet du débauchage sur les dominations** ;
- inflation salariale sur 30 saisons ;
- part des pilotes payants ;
- concentration du sponsoring ;
- crises financières (indemnités, salaires) ;
- **la valeur des décisions** (D-082) : une bonne gestion du marché doit payer.

À vérifier :
- **aucune stratégie dominante** : « pilotes rentables » (D-098), débauchage systématique, jeunes uniquement, vedettes uniquement ;
- **même information** pour l'IA et pour le joueur (audit du code, comme pour le potentiel).

## 12. Découpage proposé

| Sous-phase | Contenu |
| --- | --- |
| **7a** | Fenêtres, plan de personnel de l'IA, offres concurrentes, contre-offres, recrutement anticipé et pré-accords, clauses, débauchage des **pilotes**, rachat des affiliés, fin du recrutement provisoire D-066 |
| **7b** | **Personnel technique** : débauchage des ingénieurs et des dirigeants, non-concurrence, départs en groupe, conséquences humaines (D-077) |
| **7c** | **Agents**, popularité, valeur commerciale, sponsors personnels, pilotes payants, diversification des motivations des sponsors |

## 13. Avis franc de Claude Code

1. **C'est la phase la plus lourde pour l'IA** : planifier, cibler et négocier pour 11 écuries, chaque semaine de fenêtre. Il faudra soigner les performances (décisions regroupées par semaine, listes de cibles bornées) et la lisibilité : chaque décision importante garde ses raisons.
2. **Risque principal : la concentration.** Les écuries riches peuvent surpayer les vedettes, puisque les salaires des pilotes sont hors plafond. Les contrepoids sont naturels :
   - peu de places ;
   - valeurs des personnes (Défi, Fidélité) ;
   - conflits de statut entre deux vedettes ;
   - plafond pour les ingénieurs ;
   - réputation de prédateur.

   Il faudra le mesurer, pas le corriger d'avance.
3. **Le débauchage des ingénieurs (7b) est probablement le levier le plus fort contre les dominations.** Je propose de ne pas le retarder : 7a puis 7b, puis 7c.
4. **Les agents doivent rester légers** : une compétence de négociation, deux traits, une commission. Pas un second jeu dans le jeu.
5. Comme toujours, des **déséquilibres vont apparaître**, par exemple de l'inflation ou des crises. Ils seront mesurés et documentés, puis traités lors de la grande campagne d'après la phase 8.

## 14. Questions pour toi

1. **Découpage** 7a (marché et pilotes), puis 7b (personnel technique et conséquences humaines), puis 7c (agents et valeur commerciale) : d'accord ?
2. **Période de non-concurrence** des ingénieurs : entre 6 et 12 mois selon le contrat, comme dans la réalité. D'accord ?
3. **Recrutement anticipé** : autoriser des contrats qui commencent un an plus tard (pré-accords). D'accord ?
4. **Agents** : tous les pilotes en ont un, le personnel n'en a pas. Ou les dirigeants et ingénieurs de haut niveau aussi ?
5. **Réputation de prédateur** d'une écurie qui débauche beaucoup : d'accord pour ce garde-fou naturel ?
6. **Commission des agents** : un pourcentage fixe (par exemple 10 %), ou négocié ?
