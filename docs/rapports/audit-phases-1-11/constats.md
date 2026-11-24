# Audit des phases 1 à 11 (nuit du 24 au 25/11/2026) : constats

> Six relectures indépendantes, une par groupe de phases (lecture du code et scripts d'essai, sans modifier le dépôt).
> Chaque constat est **vérifié par Claude Code** avant correction. État :
> - **corrigé** ;
> - **documenté** (laissé en l'état, avec la raison) ;
> - **écarté** (faux constat, ou décision du porteur).
>
> Certitude des relecteurs : **C** = confirmé par exécution, **L** = probable par lecture.

## Phases 1 à 3 (noyau, données, saison)

| # | Constat | Certitude | État |
| --- | --- | --- | --- |
| 1.1 | Les clauses des contrats issus des données sont partagées entre les mondes : une rupture négociée dans une partie modifie la partie suivante | C | à traiter |
| 1.2 | `rejouer` oublie les commandes passées à la date cible et celles encore en file | C | à traiter |
| 1.3 | `secteurs`, `entreprises` et `ecuries-juniors` sont validés après le `throw` : leurs erreurs sont ignorées | C | à traiter |
| 1.4 | `climat-circuits.csv` : erreurs du lecteur ignorées ; un mois manquant donne 0 en silence | C | à traiter |
| 1.5 | Caractéristiques des voitures jusqu'à 24 : la probabilité d'abandon mécanique devient négative au-delà de 23,6 de fiabilité | C | à traiter |
| 1.6 | Égalité au classement constructeurs départagée par l'identifiant (13 cas sur 54 saisons, 11 M€ d'écart de prime) | C | à traiter |
| 1.7 | Égalité au classement pilotes départagée par l'identifiant après les podiums | C | à traiter |
| 1.8 | La validation de sauvegarde laisse passer un agenda ou une file absents ; migration sur date absente non encadrée ; seul l'en-tête porte la version | C | à traiter |
| 1.9 | Attributs non lus : `Departement.cohesion`, `Departement.responsable`, `Ecurie.culture`, années de lignée | L | à traiter |
| 1.10 | Écurie du champion = écurie du début de saison (jamais déclenché) | L | à traiter |
| 1.11 | `palmares.csv` : saison en double acceptée | C | à traiter |
| 1.12 | Grands Prix conservés sans limite (≈ 80 ko par saison) | mesuré | à traiter |
| 1.13 | Rendez-vous retirés même si le système ne tourne pas dans la phase en cours | L | à traiter |
| 1.14 | Vivier partiellement rempli : circuits exclus sans message | L | à traiter |
| 1.15 | Grands Prix répartis uniformément de la semaine 11 à 48 : le mois climatique s'écarte de la vraie date | L | à traiter |
| 1.16 | Événement « premiers points » jamais produit ; commentaires périmés ; `?? 5` magique | L | à traiter |

## Phases 4 et 9 (humains, mémoire, histoire)

| # | Constat | Certitude | État |
| --- | --- | --- | --- |
| 4.1 | Contre-offre d'un team principal au conseil ignorée : il part sans décision (5 cas sur 103) | C | à traiter |
| 4.2 | Promesses vides acceptées et tenues d'office : prolongation, salaire minimum, titularisation d'un titulaire, statut de n° 1 pour un non-pilote, type inconnu | C | à traiter |
| 4.3 | Répéter les gestes de réconciliation efface une rancune en une semaine | C | à traiter |
| 4.4 | Le joueur sonde sans conséquence le salaire minimum (tour 0, propositions illimitées) | C | à traiter |
| 4.5 | Ignorer une demande d'augmentation ou de départ vaut mieux que la refuser | L | à traiter |
| 4.6 | Histoires réelles affaiblies quand un souvenir inventé existe déjà | C | à traiter |
| 4.7 | Confiance envers l'écurie comptée 1,5 fois quand le conseil décide | C | à traiter |
| 4.8 | Arbitrage du conseil relancé en changeant le salaire de 0,1 M€ | L | à traiter |
| 4.9 | Augmentation accordée sans arbitrage du conseil | L | à traiter |
| 4.10 | Promesse « ne pas recruter » contrôlée seulement à l'échéance ; cible non validée | L | à traiter |
| 4.11 | Promesse de titularisation « rompue » si le jeune part de lui-même | L | à traiter |
| 4.12 | Souvenir « perte » envers l'écurie même pour une retraite | L | à traiter |
| 4.13 | Le plafond de souvenirs n'efface jamais le nouveau souvenir | L | à traiter |
| 4.14 | 13 « mois » par an en jeu contre 12 dans le passé reconstruit | L | à traiter |
| 4.15 | Motivation modifiée par le climat des groupes sans événement | L | à traiter |
| 4.16 | `histoires.csv` : porteur = cible accepté, doublons fusionnés ; dernier contact écrasé | L | à traiter |

## Phase 5 et 11c (économie, sponsoring)

| # | Constat | Certitude | État |
| --- | --- | --- | --- |
| 5.1 | Plafond contourné par le joueur : le développement lit le budget prévu aux semaines 14, 18…, la comptabilité débite aux semaines 16, 20… | C | à traiter |
| 5.2 | Plafond voté appliqué à l'année déjà écoulée (9 écuries sur 11 sanctionnées) | C | à traiter |
| 5.3 | Retrait de l'ancien propriétaire maintenu après un rachat | C | à traiter |
| 5.4 | Montants versés en semaine 1 après la clôture : absents des comptes | C | à traiter |
| 5.5 | Exclusivité de secteur non respectée pour l'écurie du joueur | C | à traiter |
| 5.6 | Offre tranchée à l'échéance (semaine 4) : une période de fixe perdue | C | à traiter |
| 5.7 | Sponsor personnel de pilote prenant la place des offres en attente du joueur | C | à traiter |
| 5.8 | Probabilités du sponsoring calibrées pour 24 Grands Prix | L | à traiter |
| 5.9 | Aucune faillite possible (sauvetage illimité) | constat | à traiter |
| 5.10 | Seuils de rang non respectés (renouvellements, sponsors de pilote) | C | à traiter |
| 5.11 | Clause prudente au dernier rang : probabilité 1 | C | à traiter |
| 5.12 | Événements sans causes : crise, remboursement de dette, opération expirée | L | à traiter |
| 5.13 | Nombres magiques dans l'économie | L | à traiter |
| 5.14 | `budget.plafondVise` jamais lu | L | à traiter |
| 5.15 | Primes de classement réparties sur deux années comptables | L | à traiter |

## Phases 6 et 7 (carrières, juniors, marché)

| # | Constat | Certitude | État |
| --- | --- | --- | --- |
| 6.1 | Prolongation acceptée alors que la personne a signé ailleurs (38 cas en 8 saisons) | C | à traiter |
| 6.2 | L'académie décide pour le joueur (non-prolongation de son titulaire, promesse en son nom) | C | à traiter |
| 6.3 | Affiliation maintenue jusqu'à un an après l'arrivée en F1 | C | à traiter |
| 6.4 | Retraites presque impossibles pour un pilote demandé : titulaire à 51 ans | C | à traiter |
| 6.5 | Mécènes accordés à des familles aisées (budget familial tiré plus tard) | C | à traiter |
| 6.6 | Expérience F1 jamais rattrapée pour les anciennes sauvegardes (formats 7 à 24) | L | à traiter |
| 6.7 | Une écurie avec un seul titulaire une semaine (retraite en semaine 49) | C | à traiter |
| 6.8 | Clause de rachat figée à la prolongation | L | à traiter |
| 6.9 | Nombres magiques (carrière, marché, juniors) | L | à traiter |
| 6.10 | Faits sans événement (fin d'affiliation, baquets juniors) | L | à traiter |
| 6.11 | `junior.prixMEUR` et `junior.subventionne` non lus par le moteur | L | à traiter |
| 6.12 | Retours réservés aux pilotes (fiche : tout retraité récent) | L | à traiter |

## Phase 8 (règlements, recherche, information, stands, démissions, groupes, politique)

*Relecture en cours.*

## Phases 10 et 11 (joueur, médias, interface)

| # | Constat | Certitude | État |
| --- | --- | --- | --- |
| 10.1 | Image publique gonflée sans limite par des soutiens publics répétés | C | à traiter |
| 10.2 | Budget de développement fixé en semaine 1 écrasé la semaine suivante | C | à traiter |
| 10.3 | Une victoire ne donne pas d'image au pilote (rôle « vainqueur » non lu) | C | à traiter |
| 10.4 | Communication déléguée non neutre (critique publique ou titre visé au hasard) | C | à traiter |
| 10.5 | « Continuer » laisse passer des décisions du même type | C | à traiter |
| 10.6 | Rumeurs toujours vraies hors pilotes titulaires ; fiabilité des médias non lue | C | à traiter |
| 10.7 | L'IA ne peut pas débaucher le personnel du joueur, l'inverse est possible | L | à traiter |
| 10.8 | Faux « record battu » en cas d'égalité | C | à traiter |
| 10.9 | Académie ou stands figés sans délégation (aucun écran de commande) | L | à traiter |
| 10.10 | Risques de perte de sauvegarde (quota, échecs silencieux, persistance, ancienne partie, échange) | L | à traiter |
| 10.11 | Écran de fin de partie : la cause du renvoi n'est pas affichée | C | à traiter |
| 10.12 | Image comptée deux fois pour soutenir ou mettre la pression en conférence | L | à traiter |
| 10.13 | Image d'un jeune lancé attribuée au team principal | L | à traiter |
| 10.14 | L'image ne revient jamais à zéro (arrondi) | C | à traiter |
| 10.15 | Articles survivant à leur fait source | C | à traiter |
| 10.16 | `rejouer` (même constat que 1.2) | C | à traiter |
| 10.17 | Textes de l'écran presse inexacts | L | à traiter |
| 10.18 | Changer une délégation ne produit aucun fait | L | à traiter |
| 10.19 | Le joueur ne décide pas de sa propre prolongation | C | à traiter |
| 10.20 | Journal des commandes non borné | L | à traiter |
