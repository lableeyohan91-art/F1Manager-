# Phase 12e, levier B — l'offre du pilote soutenu (fiche de conception, 26/11/2026)

> Suite de D-179 (leviers A et C). Demande du porteur (25/11/2026) : « un pilote pas forcément très bon mais gros sponsor : un grand groupe
> vient te dire qu'il te donne un gros chèque s'il roule chez toi, et devient sponsor principal pour 5 ans, mais tu dois le garder X années et
> en faire ton pilote n°1 ». Objectif : une porte de sortie financière **réelle** pour les écuries qui n'attirent pas de sponsors, avec un vrai
> coût sportif. Statut : **conception soumise au porteur**, aucun code.

## 1. Ce qui existe déjà et sera réutilisé

- Sponsors **liés à un pilote** (phase 7c) : entreprise familiale ou nationale qui ne finance que lui, et disparaît avec lui.
- Contrats de sponsoring (rang titre / principal / secondaire, durée, montant, clause de sortie) et offres faites au joueur (phase 11c).
- Clauses de contrat de pilote : statut de n°1, indemnité de rupture.
- Fenêtre du marché des pilotes (semaines 26 à 48) et besoins en baquets de chaque écurie pour la saison suivante.
- Décisions bloquantes du joueur, avec « ne pas répondre » (D-168).

## 2. Quand l'offre arrive (mêmes règles pour toutes les écuries)

À l'ouverture du marché (semaine 26), une écurie reçoit au plus une offre par saison, avec une chance (≈ 50 %) si **toutes** ces
conditions sont réunies :
1. elle a un **baquet libre** pour la saison suivante (les pilotes payants remplissent un siège vacant ; on ne licencie personne) ;
2. elle est **en difficulté** : pas de sponsor titre ni principal pour la saison suivante, **ou** trésorerie sous trois mois de dépenses ;
3. elle est dans la **seconde moitié** du classement constructeurs en cours.

## 3. Le contenu de l'offre

| Élément | Proposition |
| --- | --- |
| Le pilote | Un pilote sans baquet du vivier (Formule 2, réservistes), de niveau **moyen** (de l'ordre de 2 à 4 points sous le titulaire typique de l'écurie), avec une forte valeur commerciale dans son pays ; s'il n'en existe pas, un jeune du vivier junior. Jamais un pilote fort : ce n'est pas un cadeau. |
| Le groupe qui le soutient | Une grande entreprise fictive de son pays (sponsor lié, phase 7c), nom généré, jamais une vraie marque. |
| Le chèque d'entrée | 10 à 25 M€ selon la taille du groupe, versé à la signature (hors plafond, comme une recette). |
| Le sponsoring | Sponsor **principal** pendant **5 ans** (titre si le rang est libre), 20 à 35 M€ par an, sans clause de classement : il paie pour la visibilité du pilote. |
| Les obligations | Le pilote est **titulaire garanti 3 saisons** (clause nouvelle) et **pilote n°1** (clause existante). |
| La rupture | Si l'écurie se sépare du pilote avant 3 saisons : le sponsor part aussitôt, et l'écurie rembourse le chèque au prorata des saisons non faites. |

## 4. La décision

- **Joueur** : décision **bloquante** (D-168), avec la fiche du pilote (niveau estimé par le personnel, jamais la vérité), le chèque, le
  sponsoring et les obligations. Options : **accepter**, **refuser**, ne pas répondre (= refuser). L'avis du directeur commercial et du
  directeur sportif est affiché (ils peuvent ne pas être d'accord).
- **IA** : même offre, décision immédiate. Elle accepte si l'argent compte plus que l'écart de niveau : trésorerie basse, pas de sponsor
  principal, écart de niveau faible ; la personnalité du team principal pèse (un rentier accepte plus volontiers qu'un compétiteur).
- **Conséquences** : le coéquipier, s'il avait la promesse d'être n°1, la voit rompue (mémoire, relation, D-095) ; la presse en parle
  (« X choisit l'argent ») ; les ingénieurs n'aiment pas toujours (motivation, légère).

## 5. Ce que le joueur doit vivre

Un vrai dilemme : 100 à 200 M€ sur 5 ans (de quoi doubler le développement d'une écurie comme Haas) contre un pilote moyen imposé
3 saisons, et une promesse faite à un coéquipier peut-être brisée. Parfois c'est la bonne décision (survivre, construire), parfois non
(un baquet perdu pour un jeune talent de l'académie).

## 6. Données, format, tests, mesure

- Coefficients nommés dans `balance/` (chance, montants, durées, seuils) ; clause `titulaireGarantiJusqua` dans les clauses des contrats ;
  format de sauvegarde 34 (migration et test).
- Tests : conditions d'éligibilité ; contenu de l'offre ; décision bloquante et commande identique pour l'IA ; rupture (sponsor qui part,
  remboursement) ; jamais d'offre à une écurie sans baquet libre.
- Mesure (20 graines × 30 saisons, tous les indicateurs) : nombre d'offres et d'acceptations par écurie, rotation du bas de grille, et
  aucune dégradation de la lutte pour le titre. Critères inchangés : aucune écurie plus de 50 % des saisons dans les 3 dernières, aucune
  série de plus de 8 saisons en bas.

## 7. Questions au porteur

1. Les montants (chèque 10–25 M€, sponsor 20–35 M€ par an pendant 5 ans) et les obligations (titulaire garanti 3 saisons, pilote n°1) te
   conviennent ?
2. Le pilote doit-il venir du vivier existant (Formule 2, réservistes), comme je le propose, plutôt que d'être créé pour l'occasion ?
3. Faut-il une option « négocier » (par exemple : n°1 sans titularisation garantie, contre un chèque plus petit) ? Je propose de commencer
   sans, et de l'ajouter si le dilemme paraît trop binaire en jeu.
