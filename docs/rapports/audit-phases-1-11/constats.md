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
| 1.1 | Les clauses des contrats issus des données sont partagées entre les mondes : une rupture négociée dans une partie modifie la partie suivante | C | corrigé |
| 1.2 | `rejouer` oublie les commandes passées à la date cible et celles encore en file | C | corrigé |
| 1.3 | `secteurs`, `entreprises` et `ecuries-juniors` sont validés après le `throw` : leurs erreurs sont ignorées | C | corrigé |
| 1.4 | `climat-circuits.csv` : erreurs du lecteur ignorées ; un mois manquant donne 0 en silence | C | corrigé |
| 1.5 | Caractéristiques des voitures jusqu'à 24 : la probabilité d'abandon mécanique devient négative au-delà de 23,6 de fiabilité | C | corrigé (plancher de panne) ; caractéristiques au-delà de 20 documentées pour la phase 12 |
| 1.6 | Égalité au classement constructeurs départagée par l'identifiant (13 cas sur 54 saisons, 11 M€ d'écart de prime) | C | corrigé |
| 1.7 | Égalité au classement pilotes départagée par l'identifiant après les podiums | C | corrigé |
| 1.8 | La validation de sauvegarde laisse passer un agenda ou une file absents ; migration sur date absente non encadrée ; seul l'en-tête porte la version | C | corrigé |
| 1.9 | Attributs non lus : `Departement.cohesion`, `Departement.responsable`, `Ecurie.culture`, années de lignée | L | documenté : attributs à brancher ou retirer en phase 12 (règle CLAUDE.md) |
| 1.10 | Écurie du champion = écurie du début de saison (jamais déclenché) | L | corrigé |
| 1.11 | `palmares.csv` : saison en double acceptée | C | corrigé |
| 1.12 | Grands Prix conservés sans limite (≈ 80 ko par saison) | mesuré | documenté : compactage des résultats anciens à concevoir |
| 1.13 | Rendez-vous retirés même si le système ne tourne pas dans la phase en cours | L | documenté (aucun cas aujourd’hui) |
| 1.14 | Vivier partiellement rempli : circuits exclus sans message | L | corrigé |
| 1.15 | Grands Prix répartis uniformément de la semaine 11 à 48 : le mois climatique s'écarte de la vraie date | L | corrigé |
| 1.16 | Événement « premiers points » jamais produit ; commentaires périmés ; `?? 5` magique | L | documenté (mineur) |

## Phases 4 et 9 (humains, mémoire, histoire)

| # | Constat | Certitude | État |
| --- | --- | --- | --- |
| 4.1 | Contre-offre d'un team principal au conseil ignorée : il part sans décision (5 cas sur 103) | C | corrigé |
| 4.2 | Promesses vides acceptées et tenues d'office : prolongation, salaire minimum, titularisation d'un titulaire, statut de n° 1 pour un non-pilote, type inconnu | C | corrigé |
| 4.3 | Répéter les gestes de réconciliation efface une rancune en une semaine | C | corrigé, et défaut plus ancien trouvé : la saturation se trouvait elle-même (tous les gestes réduits) |
| 4.4 | Le joueur sonde sans conséquence le salaire minimum (tour 0, propositions illimitées) | C | corrigé |
| 4.5 | Ignorer une demande d'augmentation ou de départ vaut mieux que la refuser | L | corrigé |
| 4.6 | Histoires réelles affaiblies quand un souvenir inventé existe déjà | C | corrigé |
| 4.7 | Confiance envers l'écurie comptée 1,5 fois quand le conseil décide | C | corrigé |
| 4.8 | Arbitrage du conseil relancé en changeant le salaire de 0,1 M€ | L | corrigé |
| 4.9 | Augmentation accordée sans arbitrage du conseil | L | corrigé |
| 4.10 | Promesse « ne pas recruter » contrôlée seulement à l'échéance ; cible non validée | L | corrigé |
| 4.11 | Promesse de titularisation « rompue » si le jeune part de lui-même | L | corrigé |
| 4.12 | Souvenir « perte » envers l'écurie même pour une retraite | L | corrigé |
| 4.13 | Le plafond de souvenirs n'efface jamais le nouveau souvenir | L | corrigé |
| 4.14 | 13 « mois » par an en jeu contre 12 dans le passé reconstruit | L | corrigé |
| 4.15 | Motivation modifiée par le climat des groupes sans événement | L | corrigé |
| 4.16 | `histoires.csv` : porteur = cible accepté, doublons fusionnés ; dernier contact écrasé | L | corrigé (validation) ; dernier contact : documenté (cas rare) |

## Phase 5 et 11c (économie, sponsoring)

| # | Constat | Certitude | État |
| --- | --- | --- | --- |
| 5.1 | Plafond contourné par le joueur : le développement lit le budget prévu aux semaines 14, 18…, la comptabilité débite aux semaines 16, 20… | C | corrigé |
| 5.2 | Plafond voté appliqué à l'année déjà écoulée (9 écuries sur 11 sanctionnées) | C | corrigé |
| 5.3 | Retrait de l'ancien propriétaire maintenu après un rachat | C | corrigé |
| 5.4 | Montants versés en semaine 1 après la clôture : absents des comptes | C | corrigé |
| 5.5 | Exclusivité de secteur non respectée pour l'écurie du joueur | C | corrigé |
| 5.6 | Offre tranchée à l'échéance (semaine 4) : une période de fixe perdue | C | corrigé |
| 5.7 | Sponsor personnel de pilote prenant la place des offres en attente du joueur | C | corrigé |
| 5.8 | Probabilités du sponsoring calibrées pour 24 Grands Prix | L | corrigé |
| 5.9 | Aucune faillite possible (sauvetage illimité) | constat | documenté : à trancher par le porteur |
| 5.10 | Seuils de rang non respectés (renouvellements, sponsors de pilote) | C | corrigé (sponsors de pilote) ; renouvellements : documenté |
| 5.11 | Clause prudente au dernier rang : probabilité 1 | C | corrigé |
| 5.12 | Événements sans causes : crise, remboursement de dette, opération expirée | L | corrigé (crise, remboursement) ; opération expirée : documenté |
| 5.13 | Nombres magiques dans l'économie | L | documenté |
| 5.14 | `budget.plafondVise` jamais lu | L | documenté |
| 5.15 | Primes de classement réparties sur deux années comptables | L | documenté |

## Phases 6 et 7 (carrières, juniors, marché)

| # | Constat | Certitude | État |
| --- | --- | --- | --- |
| 6.1 | Prolongation acceptée alors que la personne a signé ailleurs (38 cas en 8 saisons) | C | corrigé |
| 6.2 | L'académie décide pour le joueur (non-prolongation de son titulaire, promesse en son nom) | C | corrigé |
| 6.3 | Affiliation maintenue jusqu'à un an après l'arrivée en F1 | C | corrigé |
| 6.4 | Retraites presque impossibles pour un pilote demandé : titulaire à 51 ans | C | corrigé |
| 6.5 | Mécènes accordés à des familles aisées (budget familial tiré plus tard) | C | corrigé |
| 6.6 | Expérience F1 jamais rattrapée pour les anciennes sauvegardes (formats 7 à 24) | L | documenté (anciennes sauvegardes) |
| 6.7 | Une écurie avec un seul titulaire une semaine (retraite en semaine 49) | C | documenté (mineur) |
| 6.8 | Clause de rachat figée à la prolongation | L | corrigé |
| 6.9 | Nombres magiques (carrière, marché, juniors) | L | corrigé en partie (âge d’abandon) ; reste documenté |
| 6.10 | Faits sans événement (fin d'affiliation, baquets juniors) | L | corrigé (fin d’affiliation) ; baquets juniors : documenté |
| 6.11 | `junior.prixMEUR` et `junior.subventionne` non lus par le moteur | L | documenté |
| 6.12 | Retours réservés aux pilotes (fiche : tout retraité récent) | L | documenté |

## Phase 8 (règlements, recherche, information, stands, démissions, groupes, politique)

| # | Constat | Certitude | État |
| --- | --- | --- | --- |
| 8.1 | Baisse du plafond votée appliquée à l'année écoulée (même défaut que 5.2) | C | corrigé (voir 5.2) |
| 8.2 | Usure du succès : titres comptés sur des années non vécues dans l'écurie | C | corrigé |
| 8.3 | Poste vacant 19 semaines après un départ par commande | C | corrigé |
| 8.4 | Vote du joueur perdu sans message si son candidat sort de la liste | C | corrigé |
| 8.5 | Nouveau président en fonctions dès la semaine 40 | L | corrigé |
| 8.6 | Vote sur le nombre de Grands Prix annulé à la borne | C | corrigé |
| 8.7 | Climat des opposants porté dans l'écurie d'un membre parti, sans fait | L | corrigé |
| 8.8 | Personnes inactives comptées parmi les connaisseurs d'un fait révélé | C | corrigé |
| 8.9 | Poids d'une rumeur après sa révélation (lecteurs autres que la réputation) | L | documenté |
| 8.10 | Refus par silence sans conséquence (même défaut que 4.5) | L | corrigé (voir 4.5) |
| 8.11 | Chef des stands rattaché au directeur technique | L | corrigé |
| 8.12 | Découvertes supprimées par ordre alphabétique | L | corrigé |
| 8.13 | Règles votées actives dès les semaines 51–52 | L | documenté (effet minime) |

## Phases 10 et 11 (joueur, médias, interface)

| # | Constat | Certitude | État |
| --- | --- | --- | --- |
| 10.1 | Image publique gonflée sans limite par des soutiens publics répétés | C | corrigé |
| 10.2 | Budget de développement fixé en semaine 1 écrasé la semaine suivante | C | corrigé |
| 10.3 | Une victoire ne donne pas d'image au pilote (rôle « vainqueur » non lu) | C | corrigé |
| 10.4 | Communication déléguée non neutre (critique publique ou titre visé au hasard) | C | corrigé |
| 10.5 | « Continuer » laisse passer des décisions du même type | C | corrigé |
| 10.6 | Rumeurs toujours vraies hors pilotes titulaires ; fiabilité des médias non lue | C | écarté (D-158 : fiabilité laissée par le porteur) ; signalé |
| 10.7 | L'IA ne peut pas débaucher le personnel du joueur, l'inverse est possible | L | corrigé |
| 10.8 | Faux « record battu » en cas d'égalité | C | corrigé |
| 10.9 | Académie ou stands figés sans délégation (aucun écran de commande) | L | corrigé (académie) ; stands : documenté |
| 10.10 | Risques de perte de sauvegarde (quota, échecs silencieux, persistance, ancienne partie, échange) | L | corrigé en partie ; fermeture de l’onglet sans sauvegarde : documenté |
| 10.11 | Écran de fin de partie : la cause du renvoi n'est pas affichée | C | corrigé |
| 10.12 | Image comptée deux fois pour soutenir ou mettre la pression en conférence | L | corrigé |
| 10.13 | Image d'un jeune lancé attribuée au team principal | L | corrigé |
| 10.14 | L'image ne revient jamais à zéro (arrondi) | C | corrigé |
| 10.15 | Articles survivant à leur fait source | C | corrigé |
| 10.16 | `rejouer` (même constat que 1.2) | C | corrigé (voir 1.2) |
| 10.17 | Textes de l'écran presse inexacts | L | corrigé |
| 10.18 | Changer une délégation ne produit aucun fait | L | corrigé |
| 10.19 | Le joueur ne décide pas de sa propre prolongation | C | documenté : à concevoir |
| 10.20 | Journal des commandes non borné | L | documenté |
