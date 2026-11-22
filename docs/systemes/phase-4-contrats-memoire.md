# Phase 4 — Contrats, mémoire v1 et interactions humaines

> Statut : **PROPOSÉ** (22/11/2026). À valider par le porteur, avec relecture de ChatGPT, **avant toute ligne de code** (règle CLAUDE.md).
> S'appuie sur : [memoire.md](memoire.md) (principes validés, D-018), [personnalite.md](personnalite.md) (D-020, D-025, D-026, D-052, D-054).

## 1. Objectif

Faire naître les **premières histoires humaines** :
- des contrats qu'on négocie, qu'on prolonge ou qu'on refuse ;
- des promesses tenues ou rompues ;
- des personnages qui s'en souviennent, et dont les relations évoluent ;
- des décisions expliquées (« Pourquoi ? ») ;
- un **bac à sable** où le porteur joue le rôle d'un team principal et observe les réactions.

**Résultat visible attendu :** dans le bac à sable, refuser une augmentation à un directeur technique crée un souvenir. La confiance baisse, et la négociation suivante devient plus difficile. Une promesse rompue se paie des saisons plus tard, y compris dans une autre écurie.

## 2. Périmètre

| Dans la phase 4 | Plus tard |
| --- | --- |
| Négociation de **prolongation** entre une écurie et ses propres employés (9 postes individualisés) | Recrutement chez les autres écuries, débauchage, précontrats (phase 7) |
| Départ en fin de contrat si l'accord échoue ; **remplacement provisoire** par la meilleure personne libre du réservoir, avec une règle simple (voir §8) | Vrai marché du travail, IA de recrutement (phase 7) |
| Promesses (5 types, §6) | Promesses liées aux installations et au budget (phase 5) |
| Souvenirs, relations, résidu, réputation publique v1 | Diffusion de l'information, réputation perçue, groupes sociaux (phase 8) |
| Interactions du team principal : soutenir, critiquer publiquement, licencier, accorder le statut de n°1 | Médias, conférences de presse (phase 11) |
| 11 traits (D-054) | Agents de pilotes (D-011), introduits avec le marché (phase 7) |

## 3. Nouveaux traits (D-054)

`risque` (propension au risque) et `remiseEnQuestion` s'ajoutent aux 9 traits. Le format de sauvegarde passe à 4. La migration tire ces deux traits pour les personnes existantes, avec leur flux local (`generation:<id>`), donc de façon déterministe.

| Trait | Lu en phase 4 par |
| --- | --- |
| risque | Offres de l'écurie (salaire proposé, promesses osées) ; contre-offres du salarié |
| remiseEnQuestion | Réaction à une critique publique ; souvenirs envers soi-même après un échec (saison ratée) |

**Audit des attributs.** `discretion` n'est lue par aucune formule avant la phase 8 (diffusion de l'information). Je propose de l'inscrire comme **exception temporaire** dans la fiche, plutôt que de la retirer puis de la remettre.

## 4. Mémoire v1 : tables et règles

| Table | Champs | Bornes |
| --- | --- | --- |
| `souvenirs` | porteur, événement, cible, étiquette, ressenti (−1…+1), intensité (0…1), créé le, renforcé le | 40 par personne (le plus faible est effacé, avec son résidu) |
| `relations` | de, vers, confiance, respect, affinité, familiarité (−1…+1) ; base durable de chaque axe | « Creuses » : seulement entre personnes qui ont travaillé ensemble ou qui ont un souvenir l'une de l'autre |
| `promesses` | auteur, bénéficiaire, type, paramètres, échéance, visibilité, statut | — |

**Règles** (formules exactes dans `balance/memoire.ts`, à calibrer) :
- **Grille de lecture** : `intensité = base(type) × amplification(traits, valeurs) × (1 + familiarité)`. Si elle est sous le seuil (0,15), aucun souvenir n'est créé.
- **Oubli mensuel** : `intensité × (1 − v)`. La vitesse dépend de la **rancune** pour les souvenirs négatifs envers les autres, de la **loyauté** pour les souvenirs positifs, et de la **remise en question** pour les souvenirs envers soi-même.
- **Renforcement** : même étiquette et même cible → l'intensité du souvenir existant augmente, au lieu de créer un doublon.
- **Résidu** : quand un souvenir est effacé, 10 à 30 % de son effet passent dans la base durable de la relation. Cette base revient lentement vers zéro : les erreurs restent réparables.
- **Relation** = base durable + somme des souvenirs actifs envers la cible, par axe (chaque étiquette a sa répartition sur les 4 axes).
- **Protection** : les événements cités par un souvenir ne sont pas compactés (branchement prévu en phase 1).

### Étiquettes et événements de la phase 4

| Événement | Étiquettes possibles (selon la personne) | Amplifié par |
| --- | --- | --- |
| Augmentation refusée | manque_reconnaissance | besoin de reconnaissance, ambition, valeur Argent |
| Prolongation accordée à de bonnes conditions | reconnaissance | besoin de reconnaissance, loyauté |
| Négociation conflictuelle (plusieurs refus) | conflit | tempérament, rancune |
| Promesse tenue / rompue | promesse_tenue / promesse_rompue | valeur Équité, rancune |
| Licenciement d'un collègue proche | injustice (chez les proches) | affinité avec la personne licenciée, valeur Équité |
| Licenciement subi | humiliation | besoin de reconnaissance, tempérament |
| Soutien public après une mauvaise passe | soutien | confiance en soi basse, loyauté |
| Critique publique | humiliation, ou remise en question (envers soi-même) | remise en question (oriente vers soi ou vers l'autre), tempérament |
| Statut de n°1 accordé / retiré | reconnaissance / trahison ; jalousie chez le coéquipier | ambition, besoin de reconnaissance |
| Battu par son coéquipier sur la saison | rivalité (envers le coéquipier), ou remise en question | ambition, remise en question |
| Titre remporté ensemble | réussite_commune (entre tous les membres de l'écurie) | sociabilité |

## 5. Décider : l'utilité et les raisons

Chaque décision humaine est un calcul d'utilité, qui garde ses 3 contributions principales pour le « Pourquoi ? ».

**Le salarié face à une offre de prolongation :**

```
utilité = Σ poids_valeur × satisfaction_valeur(offre)    (couche 2)
        + confiance envers le team principal × poids
        + Σ souvenirs saillants envers l'écurie et le team principal
        + aspirations servies ou contrariées
        + bruit (selon le tempérament)
satisfactions : Argent = salaire / valeur de marché ; Victoire = force de l'écurie ; Fidélité = années dans l'écurie
                et souvenirs positifs envers elle ; Stabilité = durée ; Défi = ambition de l'écurie ;
                Équité = absence de souvenirs d'injustice ; Racines = écurie formatrice ou du même pays
```

Comparaison avec l'**alternative** : la valeur de marché, ajustée par les débouchés réels (personnes libres, prestige) → **accepte**, **contre-propose** (si le risque et l'ambition le poussent) ou **refuse**.

**Conviction forte et ligne rouge (D-052).** Une valeur ≥ 17 pèse **double** dans le calcul. Elle ne devient **ligne rouge** (refus absolu) que si elle est ≥ 19 **et** que la personne se remet peu en question. Proposition : environ 4 % des personnes ont au moins une ligne rouge.

**L'écurie (IA) face à une fin de contrat** (mêmes commandes que le joueur) : le team principal compare la performance de la personne aux attentes, son âge, sa valeur de marché et le budget. Il décide de prolonger ou non, à quel salaire, pour quelle durée, avec ou sans promesse. Ses traits pèsent : `risque` (promesses osées, salaires élevés), `loyauté` (fidélité à ses hommes), `rancune` (souvenirs de conflits). C'est déjà une IA de dirigeant, mais limitée à son propre personnel.

**Valeur de marché** = f(niveau métier, potentiel, âge et courbe du métier, réputation publique, résultats récents). Formule dans `balance/contrats.ts`.

## 6. Promesses (v1)

| Type | Vérification automatique |
| --- | --- |
| Salaire minimum à une date | Salaire du contrat ≥ X à la date |
| Statut de pilote n°1 pour la saison | Aucune consigne d'équipe contraire (phase 4 : le statut est un attribut du contrat ; pas de consigne en course avant la phase 13) |
| Titularisation (réserve → titulaire) | Poste « pilote titulaire » à la saison indiquée |
| Prolongation garantie | Contrat prolongé avant l'échéance |
| Ne pas recruter un concurrent direct | Aucun recrutement de la personne nommée |

Une promesse rompue produit un événement, puis des souvenirs. Si elle était publique, la réputation « parole tenue » du team principal baisse. Les IA font et rompent aussi des promesses, avec les mêmes règles.

## 7. Nouvelles commandes (joueur et IA)

`contrat.proposer_prolongation` · `contrat.contre_proposer` · `contrat.accepter` · `contrat.refuser` · `contrat.licencier` (avec indemnité) · `personnel.soutenir_publiquement` · `personnel.critiquer_publiquement` · `pilote.accorder_statut_n1` / `retirer_statut_n1` · `promesse.faire`.

Elles sont toutes validées par les mêmes règles, et toutes produisent des événements, avec leurs causes.

## 8. Calendrier et remplacement provisoire

- **Fenêtre de négociation** : de la semaine 30 jusqu'à la fin de l'intersaison suivante, pour les contrats qui se terminent à la fin de l'année. Elle remplace la **prolongation automatique provisoire** de la phase 3.
- **Échec de la négociation** → départ à la fin du contrat (la personne devient libre).
- **Remplacement provisoire** (avant la phase 7) : l'écurie recrute dans le réservoir la meilleure personne libre pour le poste, selon un score simple (niveau, salaire demandé, budget). Le recrutement passe par la même commande, et le candidat décide aussi par utilité. Ce remplacement sera remplacé par le vrai marché en phase 7.
- Conséquence : **la grille commence à bouger**. Les indicateurs de dynasties seront comparés à la référence de la phase 3 (D-060).

## 9. Bac à sable (interface de diagnostic)

1. Choisir une écurie : on incarne son team principal.
2. Choisir une personne de l'écurie, puis une action : proposer une prolongation (salaire, durée, promesse), refuser une augmentation, soutenir, critiquer, licencier, accorder le statut de n°1.
3. Voir aussitôt : la réponse, le **« Pourquoi ? »** (3 raisons), les **souvenirs créés**, et les **relations avant et après**.
4. Avancer le temps (1 mois, 1 saison) et voir les suites : promesse vérifiée, souvenir qui s'efface, résidu, négociation suivante.
5. **Comparer** : la même situation rejouée avec une autre décision (contrefactuel), sur 1 à 3 saisons.

## 10. Indicateurs et critères de validation

| # | Critère | Mesure |
| --- | --- | --- |
| 1 | Les choix comptent | Tests contrefactuels sur 3 dilemmes (accorder ou refuser une augmentation au DT ; tenir ou rompre une promesse de statut de n°1 ; soutenir ou critiquer un pilote en difficulté) : écart mesurable au-delà du bruit à 1 et 3 saisons, sur 100 graines |
| 2 | Pas de réponse toujours gagnante | Aucune option d'un dilemme ne l'emporte dans plus de 80 % des contextes (critère de réussite à définir avec ChatGPT : fidélité, performance de l'écurie, coût) |
| 3 | Cascades | La chaîne de référence (augmentation refusée → confiance en baisse → négociation ratée → départ → remplaçant moins bon → voiture qui progresse moins) apparaît d'elle-même dans au moins 10 % des cas du test |
| 4 | Mémoire bornée | Après 50 saisons : ≤ 40 souvenirs par personne, sauvegarde < 5 Mo compressés |
| 5 | Réparable | Un conflit suivi de faits positifs ramène la confiance au-dessus de zéro en moins de 3 saisons, pour une personne peu rancunière |
| 6 | Explicable | Toute réponse à une offre a 3 raisons lisibles |
| 7 | Audit | Les 11 traits et les 7 valeurs sont lus par au moins une formule (exception temporaire : `discretion`) |
| 8 | Bac à sable | Le porteur rejoue lui-même la chaîne de référence sur son téléphone |
| 9 | Référence | Rapport d'équilibrage comparé à la référence de la phase 3 (dynasties, champions différents, rotation du personnel) |

## 11. Questions à trancher avant de coder

1. **Remplacement provisoire** dès la phase 4 (la grille bouge), ou départs « gelés » jusqu'à la phase 7 ? Je recommande le remplacement provisoire, pour tester tôt les conséquences.
2. **Lignes rouges** : ~4 % des personnes, selon la règle « valeur ≥ 19 et peu de remise en question ». OK ?
3. **`discretion`** en exception temporaire à l'audit jusqu'à la phase 8 ?
4. **Critère de réussite des dilemmes** (pour le critère 2) : performance sportive à 3 saisons ? Fidélité du personnel ? Un mélange ? (question pour ChatGPT)
5. **D-059** (poids du pilote, aléa) : à trancher avant la phase 4, pour que la phase 4 parte de réglages stables.
