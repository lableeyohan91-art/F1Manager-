# Entités principales du monde

> Statut : **PROPOSÉ**. Liste et champs à valider avant la phase 2. Les champs marqués *(plus tard)* sont réservés : prévus dans le modèle, pas encore utilisés.
> Règle : chaque champ indique quels systèmes le **lisent**. Un champ que rien ne lit n'existe pas.

## Principes

1. **Identifiant unique et permanent** pour chaque entité, préfixé par son type : `per_` (personne), `org_` (organisation), `ctr_` (contrat), `evt_` (événement), `mem_` (souvenir), `prm_` (promesse), `fac_` (installation), `dep_` (département), `gp_` (Grand Prix), `cir_` (circuit), `ssn_` (saison).
2. **Une personne n'est pas un poste.** Le lien entre une personne et une organisation, c'est le **contrat**. La carrière d'une personne, c'est la liste de ses contrats.
3. **Liens par identifiant** uniquement (voir [architecture.md](../architecture.md) §3).
4. **Rien n'est supprimé** quand une personne prend sa retraite ou qu'une écurie disparaît : l'entité passe au statut « inactive » et reste dans l'histoire.

## 1. Monde (`World`)

| Champ | Description | Lu par |
| --- | --- | --- |
| date | Semaine courante (année, semaine) | tous |
| graine | Graine principale du hasard | noyau |
| phaseSaison | intersaison / présaison / saison / fin de saison | calendrier, tous |
| saisonCourante | Identifiant de la saison | tous |
| versionFormat | Version du format de sauvegarde | sauvegarde |

## 2. Organisation (`Org`) — tronc commun

| Champ | Description | Lu par |
| --- | --- | --- |
| type | écurie, motoriste, fournisseur, instance dirigeante, propriétaire (société), média, agence | tous |
| nom, nomCourt, nationalité | Identité | interface, médias |
| annéeCréation | | historique, prestige |
| statut | active / inactive (disparue, rachetée) | tous |
| finances | Trésorerie, dettes | finances, IA |

## 3. Écurie (`Team`) — complément

| Champ | Description | Lu par |
| --- | --- | --- |
| couleurs, logo | Identité visuelle (logo généré ou fourni) | interface |
| propriétaire | Identifiant du propriétaire (personne ou société) | conseil, IA |
| prestige | Image à long terme (1–20), lente | recrutement, sponsors |
| popularité | Base de supporters (1–20) | revenus commerciaux, médias |
| pressionMédiatique | Intensité de l'attention (1–20) | état émotionnel du personnel |
| culture | Profil : familiale ↔ corporative, stable ↔ impitoyable, conservatrice ↔ audacieuse | IA, grille de lecture, recrutement |
| philosophieTechnique | Priorités : appui ↔ vitesse de pointe, évolution ↔ révolution, fiabilité ↔ performance | IA, développement *(plus tard)* |
| politiqueRecrutement | Expérience ↔ jeunesse, recrutement interne ↔ externe, budget salarial | IA, marché |
| toléranceConseil | Patience du conseil face aux mauvais résultats (1–20) | conseil |
| objectifs | Liste d'objectifs datés (court, moyen, long terme), avec un niveau d'exigence | conseil, IA, état émotionnel |
| fournisseurs | Contrats motoriste et fournisseurs | performance, politique |
| palmarès | Calculé à partir de la Chronique | prestige, médias, interface |

## 4. Personne (`Person`)

Voir [personnalite.md](personnalite.md) pour les couches 1 à 5.

| Champ | Description | Lu par |
| --- | --- | --- |
| prénom, nom, nationalité, dateNaissance | Identité | interface, marché (préférences nationales) |
| statut | active / retraitée / décédée *(plus tard)* | tous |
| personnalité | Couche 1 : traits (cachés) | grille de lecture, décisions |
| valeurs | Couche 2 : poids et convictions (cachés) | décisions |
| compétences | Couche 3 : notes par métier + potentiel | travail, résultats, marché |
| aspirations | Couche 4 : objectifs personnels | décisions, état émotionnel |
| état | Couche 5 : moral, stress, motivation, confiance en soi (calculés) | travail, décisions |
| réputationPublique | Par facette (voir [memoire.md](memoire.md)) | marché, médias |
| salaireSouhaité | Calculé à partir des compétences, de la réputation et des valeurs | marché |
| historique | Calculé à partir des contrats et de la Chronique | interface, médias |

Les souvenirs et les relations sont des tables à part (§9 et §10), car leur volume est variable.

## 5. Contrat (`Contract`)

| Champ | Description | Lu par |
| --- | --- | --- |
| personne, organisation, poste | Qui, où, quoi | tous |
| début, fin | Dates | marché, calendrier |
| salaire | M€ par an | finances, état émotionnel |
| clauses | Prime de résultat, indemnité de rupture, statut de pilote n°1, clause de sortie | marché, promesses |
| statut | précontrat / actif / terminé / rompu | marché, historique |
| motifFin | échéance, licenciement, démission, rachat, retraite | mémoire, historique |
| agent | Agent ayant négocié (pilotes) | relations, mémoire |

## 6. Département (`Department`)

Employés non individualisés, regroupés.

| Champ | Description | Lu par |
| --- | --- | --- |
| écurie, type | Aéro, conception, production, simulation, fiabilité, stands, stratégie, recrutement, marketing, logistique | travail |
| effectif | Nombre de personnes | finances, travail |
| niveauMoyen | 1–20 | travail |
| cohésion | 1–20 : dépend de la stabilité et du responsable | travail |
| chargeTravail | Projets en cours ÷ capacité | travail, état émotionnel du responsable |
| responsable | Personne individualisée qui dirige (si elle existe) | travail, groupes sociaux |

## 7. Installation (`Facility`)

| Champ | Description | Lu par |
| --- | --- | --- |
| écurie, type | Soufflerie, centre CFD, simulateur, bureau d'études, usine, centre de recherche, centre de formation, installations du personnel | travail |
| niveau | 1–10 | travail, prestige |
| âge, état | Vieillissement et entretien | travail, finances |
| capacité | Nombre de projets simultanés | travail |
| travauxEnCours | Amélioration en cours (coût, date de fin) | finances, calendrier |

## 8. Événement (`Event`)

| Champ | Description | Lu par |
| --- | --- | --- |
| date, type | Ex. : `contrat.signé`, `promesse.rompue`, `gp.résultat` | tous |
| acteurs | Liste de (identifiant, rôle dans l'événement) | mémoire, médias |
| contexte | Données propres au type (montant, position…) | grille de lecture, médias |
| visibilité | public / privé / confidentiel | diffusion de l'information |
| importance | 1–5 | conservation, médias, Chronique |
| causes | Identifiants des événements ou commandes à l'origine | « Pourquoi ? », diagnostic |
| connuPar | Personnes informées en dehors des participants (si privé ou confidentiel) | mémoire |

## 9. Souvenir (`Memory`) · 10. Relation (`Relationship`) · 11. Promesse (`Promise`)

Détaillés dans [memoire.md](memoire.md).

## 12. Saison, Grand Prix, circuit, résultat

| Entité | Champs principaux | Lu par |
| --- | --- | --- |
| Saison | Année, règlement, calendrier, classements finaux | tous |
| Circuit | Nom fictif, pays, type (rapide, sinueux, mixte, urbain, altitude), exigences (appui, vitesse, freinage, pneus) | résultats |
| Grand Prix | Saison, circuit, date, résultats | résultats, finances |
| Résultat | Grand Prix, pilote, écurie, position, points, abandon et sa cause, explication | classements, mémoire, médias |

## 13. Règlement (`Rules`)

| Champ | Description | Lu par |
| --- | --- | --- |
| barèmePoints | Points par position | classements |
| plafondBudgétaire | M€ | finances, IA |
| répartitionPrimes | Prime par position au classement constructeurs | finances |
| règlesTechniques | *(plus tard)* : contraintes sur les pièces | développement |
| propositions | Changements soumis au vote | politique |

## 14. Réservées pour plus tard

Voiture et pièces, projets de développement, concepts aérodynamiques, expertise accumulée, sponsors détaillés, articles de médias, groupes sociaux (calculés), carrière du joueur. Leurs tables seront ajoutées par migration de sauvegarde, sans casser l'existant.
