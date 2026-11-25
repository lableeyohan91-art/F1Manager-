# Phase 12 — Fatigue, stress, alertes, événements techniques et découvertes

> **Statut : VALIDÉE par le porteur le 25/11/2026 (D-170), sauf la question 10 à confirmer.** Pas encore codée. Réponses aux questions : `docs/decisions.md`, D-170 ; D-081 nuancée par D-169.
> Fiche principale : `phase-12-conception-detaillee.md` (capacité, pièces, soufflerie, fabrication, renouvellement des hiérarchies).
> Toutes les valeurs sont **initiales** et seront mesurées en laboratoire (D-076, D-120). Les taux de 5–10 % et de 15–25 % sont des **cibles de game design** du porteur, à vérifier, pas des valeurs figées.

## 0. Principes

1. **Tout vient d'un état simulé.**
   - Une erreur due à la fatigue n'existe que si la fatigue est réelle.
   - Une alerte n'existe que si un risque réel existe (ou si le responsable croit, à tort, qu'il existe).
2. **Deux mécaniques séparées**, jamais mélangées :
   - les **incidents d'exécution** : difficultés normales et erreurs dues à la fatigue, toutes les semaines, pour tous les projets ;
   - les **événements narratifs** : rares, un au plus par projet, tirés une seule fois au lancement.
3. **La vérité est fixée à la création** et le joueur la découvre par des estimations, avec l'incertitude de son personnel. Choisir une option change les moyens engagés, la qualité de l'information et ce qu'on capture de la vérité, **jamais la vérité elle-même**.
4. **Mêmes règles pour les 11 écuries.** L'IA, ou le directeur technique en délégation, décide avec les estimations de son propre personnel.

---

## 1. Fatigue

### 1.1 Qui se fatigue [PROPOSÉ, Q3]

- Les écuries ont des **pôles** de 30 à 150 personnes (aéro, conception, simulation, production), non individualisés, et **trois responsables individualisés** (directeur technique, responsable aéro, responsable conception).
- Individualiser des centaines d'ingénieurs alourdirait le téléphone sans décision de plus.
- Je propose donc :

| Porteur | Jauge | Charge qui la fait monter |
| --- | --- | --- |
| **Pôle** (aéro, conception, simulation, production) | **Fatigue** 0–100 (la seule jauge visible) | Somme de ses affectations × rythme |
| **Responsable** (DT, aéro, conception) | Fatigue 0–100 (sur sa fiche) | Projets supervisés × rythme, rapporté à sa compétence de gestion de projet |
| **Responsable** | **Stress** 0–100 (**existe déjà**, `humain/etat.ts`) | Pression : délais, enjeux, incidents, projets risqués, contexte de l'écurie (§2) |

- **Interface mobile** :
  - une barre par pôle, qui montre l'affectation (en %) et la fatigue (vert, orange, rouge) ;
  - une icône de stress sur un responsable seulement quand il est élevé.
- C'est la variante « une jauge principale et un état secondaire » que tu évoquais. Deux jauges par pôle seraient illisibles sur téléphone.

### 1.2 Dynamique (même modèle que l'équipe des stands, D-129)

**Charge d'un pôle** `c` = somme des parts affectées × multiplicateur du rythme.
- Multiplicateur : allégé 0,7, normal 1,0, intensif 1,35. L'intensif fatigue plus qu'il n'accélère (× 1,3).
- Exemple : un pôle affecté à 60 % en normal et à 40 % en intensif a une charge de 0,6 + 0,54 = 1,14.

**Fatigue d'équilibre** `F*` :
- si c ≤ 1 : F* = 15 × c (le normal à pleine charge se stabilise à 15) ;
- si c > 1 : F* = 15 + 110 × (c − 1) (intensif à pleine charge : 53 ; surcharge à 1,6 : 81).

**Évolution chaque semaine** : la fatigue se rapproche de F* :
- de 15 % de l'écart quand elle monte ;
- de 12 % quand elle descend ;
- de 20 % en dessous d'une charge de 0,7 (allégé).

Ce que ça donne :

| Situation | 4 semaines | 8 semaines | 12 semaines |
| --- | --- | --- | --- |
| Intensif à pleine charge, depuis 15 | 33 | 43 | 48 |
| Retour au normal, depuis 48 | 34 | 27 | 22 |
| Allégé, depuis 48 | 32 | 23 | 16 |

- **Pas de piège sans issue.** La fatigue revient **toujours** vers l'équilibre de la charge choisie. Une équipe épuisée remise au normal redevient fraîche en 2 à 3 mois, plus vite en allégé.
- **Le repos complet** (pôle affecté à 30 % seulement) est possible. Il coûte des semaines de travail.

### 1.3 Effets de la fatigue (sur des canaux déjà existants, sans double comptage)

| Effet | Formule initiale | F = 15 (normal) | F = 43 | F = 53 (intensif durable) | F = 81 (surcharge) |
| --- | --- | --- | --- | --- | --- |
| Productivité | × (1 − max(0, F − 40) / 100) | 1,00 | 0,97 | 0,87 | 0,59 |
| Incident par semaine et par projet | 0,004 + 0,00004 × max(0, F − 30)² | 0,4 % | 1,1 % | 2,5 % | 10,8 % |
| … sur un projet de 5 semaines | | ≈ 2 % | ≈ 5 % | ≈ 12 % | ≈ 43 % |
| Erreur d'estimation | × (1 + F / 100) | × 1,15 | × 1,43 | × 1,53 | × 1,81 |
| Efficacité des heures de soufflerie | × (1 − F / 200) | 0,93 | 0,79 | 0,74 | 0,60 |
| Détection d'un défaut | × (1 − F / 200) | idem | | | |

**Conséquences pour le jeu.**
- **Intensif ponctuel, 4 semaines** : la fatigue atteint 33, donc productivité intacte, risque faible. **Le projet avance 30 % plus vite.** C'est le bon choix pour finir avant un Grand Prix.
- **Intensif permanent** : à l'équilibre, la productivité tombe à 0,87, donc 1,3 × 0,87 = **1,13 seulement**. Les incidents sont 6 fois plus fréquents, les estimations moins fiables, les heures moins efficaces. **C'est une mauvaise stratégie à long terme, par des conséquences naturelles, sans pénalité ajoutée.**
- **Normal** : soutenable indéfiniment. Il garde des difficultés normales (environ 2 % des projets).

### 1.4 Incidents d'exécution

À chaque incident, on tire :

1. **S'il est détecté.** Probabilité = 1 − (1 − d_équipe) × (1 − d_soufflerie) :
   - d_équipe = (0,45 + 0,4 × rigueur du responsable / 20) × (1 − F / 200) ;
   - d_soufflerie = 1 − exp(−heures effectives / 15).
2. **Ses conséquences.**
   - **Détecté** : retard de 1 à 2 semaines (essais supplémentaires). Avec un peu de chance (rigueur), sans perte de qualité.
   - **Non détecté** : **défaut caché**, découvert seulement en piste. Selon un tirage :
     - performance réelle inférieure à l'annonce : de −20 à −60 % du gain prévu ;
     - ou durabilité inférieure : × 0,6 (usure, casse, 12c) ;
     - ou, si F > 70 et après deux incidents sur le même projet, **projet inutilisable**. L'argent et les jours sont perdus ; l'expertise reste.

---

## 2. Stress

- Le stress des personnes **existe déjà** et se met à jour selon une pression, le sang-froid et une inertie. Il influe aujourd'hui sur l'état et les décisions humaines.
- **Proposition** : la phase 12 ajoute **des sources de pression** pour les responsables techniques, sans créer de nouvelle jauge :
  - un projet en retard sur un Grand Prix visé ;
  - un incident ou un défaut révélé en piste ;
  - un projet risqué : innovation, matériau expérimental ;
  - une alerte ignorée ;
  - la situation de l'écurie (conseil mécontent, lutte pour le titre).
- **Partage des rôles, sans double comptage** :
  - la **fatigue** dégrade **l'exécution** (productivité, incidents, détection) ;
  - le **stress** dégrade **le jugement** (fiabilité des alertes et des conseils, goût du risque) et nourrit les conséquences humaines déjà existantes : moral, envie de partir, relations.
- Un responsable très stressé peut aussi « couvrir » un problème. Il alerte moins, et le joueur doit savoir lire l'humain derrière le rapport.

---

## 3. Alertes des responsables

**Déclenchement.** Le responsable perçoit le **risque réel** d'un projet : la probabilité qu'un défaut caché existe, ou que la date ne soit pas tenue. Sa perception est déformée :
- risque perçu = risque réel × exp(bruit) ;
- écart type du bruit = 0,8 − 0,5 × (corrélation + rigueur) / 40 + fatigue du responsable / 200 + stress / 300.

Il alerte si le risque perçu dépasse 15 %.

**Garde-fous** : une alerte au plus par projet toutes les 6 semaines, une par pôle toutes les 4 semaines.

**Message** : un texte à variantes, selon la pièce, la cause dominante et la personnalité du responsable. Exemple :
> « Chef, l'équipe est surmenée. Les derniers essais montrent des résultats incohérents et je commence à craindre un problème sur notre nouveau fond plat. »

**Options**, chacune avec son coût connu :

| Option | Effet réel |
| --- | --- |
| Ralentir (normal ou allégé) | La fatigue redescend ; le projet prend du retard |
| Financer une vérification (heures de soufflerie ou 0,2 M€ et 1 semaine) | Nouvelle chance de détecter un éventuel défaut (formule §1.4) |
| Confier la supervision au directeur technique | La charge du responsable baisse, celle du DT monte (sa propre fatigue et son stress) |
| Maintenir le calendrier | Rien ne change ; le stress du responsable monte un peu (alerte ignorée) |

- **Un bon responsable** alerte surtout quand il le faut.
- **Un responsable médiocre ou épuisé** crie au loup ou se tait. C'est simulé, pas décoratif.
- L'IA reçoit les **mêmes alertes de son propre personnel** et y répond avec la même fonction.

---

## 4. Événements narratifs de conception

### 4.1 Fréquence (cible du porteur : 5 à 10 % des projets)

Au **lancement** du projet, un tirage unique fixe s'il y aura un événement, et à quel moment (entre 30 et 70 % de l'avancement).
- Probabilité = 0,07 × m_innovation × m_nouveauté, bornée entre 4 % et 12 %.
- m_innovation = 0,7 + 0,6 × innovation du responsable / 20 (1,0 à 10 sur 20, 1,3 à 20 sur 20).
- m_nouveauté = 0,8 + 0,4 × écart entre le concept visé et le concept actuel (de 0 à 1).
- Moyenne attendue : **environ 7 %**, soit **1 à 2 événements par saison** pour une écurie active (environ 24 projets).
- **Un seul événement narratif par projet.** Les alertes de fatigue (§3) sont **à part**, d'où ma proposition Q4 : la famille D de ta liste devient l'alerte conditionnelle, pas un tirage.

### 4.2 Les familles (le poids dépend du contexte)

| Famille | Poids de départ | Contexte qui l'augmente | Possible pour |
| --- | --- | --- | --- |
| **A. Piste prometteuse** | 30 | savoir du domaine, innovation | toutes les pièces |
| **B. Résultats contradictoires CFD / soufflerie** | 25 | CFD très utilisée, corrélation faible | pièces aéro surtout |
| **C. Matériau expérimental** | 20 | rigueur faible (on ose), objectif « masse » | châssis, suspensions, pontons, fond plat |
| **E. Réorientation du concept** | 25 | concept éloigné de la voiture actuelle | toutes |
| *D. Erreur due à la fatigue* | — | *alerte conditionnelle (§3)* | — |

**Anti-répétition** : une même famille au plus une fois toutes les 10 semaines par écurie. Au moins 6 variantes de texte par famille, adaptées à la pièce. Aucune des 10 dernières variantes vues par l'écurie n'est réutilisée.

### 4.3 Déroulé de chaque famille (vérité cachée, options, conséquences)

**A — Une piste prometteuse.**
> « Chef, nos ingénieurs ont identifié une modification du fond plat qui pourrait améliorer notre appui dans les virages rapides. Il nous faudrait deux semaines et un budget supplémentaire. On tente ? »

- **Vérité** tirée à la création : rien d'exploitable (50 %), avancée mineure (46 %), avancée majeure (4 % × contexte, au plus 8 %, §6.2).
- **Estimation** annoncée : le responsable donne un gain probable et une fourchette, plus juste avec une bonne corrélation.
- **Options** :
  1. refuser : aucun coût. L'idée est notée, un programme de recherche du domaine pourra la reprendre plus tard ;
  2. explorer : + 14 jours de projet, + 0,3 à 0,6 M€ ;
  3. explorer avec des heures de soufflerie en plus : mieux capturer la valeur s'il y en a, et savoir plus vite s'il n'y en a pas.
- **Effet des heures** : part de la valeur capturée = 0,6 + 0,4 × (1 − exp(−heures / 20)).

**B — Des résultats contradictoires.**
- **Vérité** : quel outil a raison. Probabilité que la CFD ait raison = 0,4 + 0,4 × corrélation / 20.
- **Options** :
  1. vérifier : 6 à 10 heures et 1 semaine. On découvre la vérité avec une probabilité de 0,6 + 0,3 × corrélation / 20, puis on corrige ;
  2. modifier le concept, par prudence : gain réduit de 30 %, plus de risque ;
  3. poursuivre : si la CFD avait tort, la pièce ne donne que 0 à 50 % de l'annonce, découvert en piste.
- **Conséquences possibles** : meilleure compréhension (+ savoir si vérifié), retard, erreur non détectée, correction qui sauve le projet.

**C — Un matériau expérimental.**
- **Vérité** : solide ou fragile. Probabilité d'être fragile = 0,45 − 0,2 × rigueur / 20.
- **Options** :
  1. tenter : gain de masse ; si fragile, durabilité × 0,5 et risque de casse (12c) ;
  2. financer des essais de résistance : 0,4 M€ et 1 semaine, la vérité est révélée et on décide en connaissance de cause ;
  3. conserver la solution éprouvée.

**E — Une opportunité de modifier le concept.**
> « Ce nouvel aileron permettrait finalement de réduire davantage la traînée, au prix d'un peu d'appui. »

- **Vérité** : la valeur réelle des deux orientations sur la frontière.
- **Estimation** : le responsable montre le gain estimé par type de circuit (rapides, lents, lignes droites) pour chacune.
- **Options** : maintenir, ou réorienter (+ 7 jours).
- **Ce qui rend le choix intéressant** : il dépend du calendrier restant. Un aileron faible traînée vaut plus si Monzza, Spaa et Las Vegaz arrivent.

---

## 5. Événements de recherche (phase 12d)

### 5.1 Fréquence (cible du porteur : 15 à 25 %)

- Les programmes de la phase 8 sont **continus** : pas de « projet » auquel rattacher un pourcentage.
- Je propose de compter par **trimestre actif** d'un programme : 5 % × m_innovation × m_profondeur, borné entre 3 et 8 %.
  - m_profondeur = 0,7 + 0,6 × min(1, savoir fondamental du domaine / 50).
  - Par programme et par an : 1 − 0,95⁴ ≈ **19 %**.
- Les **projets de recherche appliquée** (12d, nés d'un événement C ou d'un pari de concept) ont leur propre taux, environ 25 % par projet.
- Pour le joueur : environ **0,4 événement de recherche par saison** avec 2 programmes actifs.

### 5.2 Les familles

| Famille | Poids | Condition | Dilemme |
| --- | --- | --- | --- |
| **A. Découverte inattendue** (domaine voisin) | 25 | — | Réorienter une partie du programme vers le voisin ? |
| **B. Hypothèse probablement erronée** | 25 | — | Persévérer, vérifier ou abandonner cette direction |
| **C. Révolution potentielle** | 12 | savoir fondamental ≥ 30 et innovation d'un responsable ≥ 14 | Lancer un projet de recherche appliquée coûteux et incertain ? |
| **D. Opportunité réglementaire** | 20 | un règlement proposé ou annoncé | Mettre plus de moyens sur une piste encore incertaine du futur règlement ? Elle donne un **indice** sur son paysage (fiche principale §10.2) |
| **E. Transversale ou désaccord** | 18 | — | E1 : une recherche sur le refroidissement sert aussi l'aéro, faut-il la partager ? E2 : le DT et un responsable défendent deux orientations incompatibles, et il faut trancher |

- **B en détail** : la **direction** du programme a une efficacité cachée, 1 si elle est juste, 0,3 si elle est fausse.
  - Persévérer : si elle est fausse, le trimestre suivant rapporte 30 %.
  - Vérifier : 2 semaines à 50 % et des heures. On apprend la vérité avec une probabilité qui dépend de la corrélation.
  - Abandonner : remise en route de la phase 8 (6 semaines à 50 %). Si la direction était juste, l'occasion est perdue.
- **E2 en détail** : la personne dont l'orientation n'est pas retenue le **vit** comme un désaveu léger : souvenir et relation, mécanique existante de la phase 4. Le département technique est aussi une affaire humaine.

---

## 6. Trois niveaux de résultat et leur effet physique

### 6.1 Ce que chaque niveau change concrètement

| Niveau | Effet sur les connaissances | Effet sur les conceptions et la physique |
| --- | --- | --- |
| **Avancée mineure** | + 3 à 6 points de savoir réglementaire dans le domaine | La pièce en cours gagne jusqu'à + 10 % de son effet, ou la frontière du domaine s'élargit un peu pour les prochains projets |
| **Fausse piste** | + 1 à 2 points de savoir **fondamental** (« on a appris pourquoi ça ne marche pas ») ; l'idée est marquée **explorée** et ne reviendra pas | Temps et argent perdus |
| **Avancée majeure** | Grand saut de savoir réglementaire (environ 15 points, ordre des découvertes de la phase 8) **et** déplacement de la borne de la frontière du domaine pour cette écurie, ou nouvelle **option de concept** (exemple : un fond plat à double canal, plus d'appui en virage rapide mais plus sensible aux bosses) | Rien n'est gagné tant qu'une **pièce** n'a pas été conçue, fabriquée et installée. Le gain réel se lit ensuite dans le profil de vitesse, circuit par circuit, et peut être faible sur certains tracés |

**Bornes contre la voiture parfaite** :
- une découverte majeure n'agit que **dans un domaine** ;
- elle reste sous les bornes absolues du règlement ;
- elle disparaît en partie à la réforme suivante (obsolescence) ;
- elle se **diffuse** chez les concurrents à partir de sa première apparition en course (1 à 2 saisons, s'ils ont le savoir pour l'intégrer).

### 6.2 Probabilité d'une avancée majeure (rare, contextuelle, jamais répétable)

p = p_base × f_innovation × f_savoir × f_heures × f_originalité × f_répétition

| Facteur | Formule | Plage |
| --- | --- | --- |
| p_base | 4 % (piste de conception A), 20 % (projet de révolution C), 3 % (autres événements de recherche) | |
| f_innovation | (meilleure innovation des responsables / 14)², borné | 0,3 – 2 |
| f_savoir | savoir fondamental du domaine / 40, borné | 0,3 – 2 |
| f_heures | 1 + 0,3 × (1 − exp(−heures / 40)) | 1 – 1,3 |
| f_originalité | 1,3 si aucune écurie n'a fait de découverte majeure récente dans ce domaine, 0,7 sinon | |
| f_répétition | 1 / (1 + 2 × découvertes majeures de l'écurie dans ce domaine sous ce règlement) | décroissant |

- **Pas de facteur « budget » ni « statut ».**
  - L'argent aide seulement à financer les heures et les gens.
  - Une petite écurie avec un ingénieur à 18 en innovation a f_innovation = 1,65 ; une grande avec un ingénieur à 12 a 0,73.
- **Fréquence attendue** avec ces valeurs, si environ la moitié des opportunités sont acceptées :
  - environ 0,14 par saison par les pistes de conception, 0,06 par les révolutions, 0,03 par les autres événements de recherche ;
  - soit environ **0,23 par saison sur toute la grille** : une avancée majeure tous les 4 ans environ, une tous les 40 à 50 ans par écurie.
  - Ta formulation « véritablement exceptionnelle » est respectée.
  - Le laboratoire calera p_base sur une **cible d'une tous les 2 à 4 ans sur la grille**, à valider ensemble.

---

## 7. Décisions présentées au joueur

- **Message immersif** du responsable concerné, 2 ou 3 options. Pour chacune :
  - coût **certain** (argent, jours, heures) ;
  - conséquence **estimée** avec fourchette (« gain probable en virage rapide : 0,05 à 0,15 s, mais je ne peux pas garantir que ça compense la traînée ») ;
  - avis du responsable.
- **Non bloquant** (proposition Q10). Le dilemme a une échéance de 2 semaines. Sans réponse, la **recommandation du responsable** est appliquée.
  - Cohérent avec D-168 : seules les demandes du personnel bloquent.
  - Une option « marquer comme urgent » rend les avancées majeures et les alertes graves plus visibles (❗).
- **Délégation** : le directeur technique décide selon la politique fixée (prudente, équilibrée, audacieuse ; « protéger l'équipe » ou « tenir les délais »). Le joueur lit le résumé dans les actualités.
- **Volume attendu** pour un joueur qui ne délègue pas : 2 à 5 dilemmes techniques par saison. Garde-fou : au plus un dilemme présenté toutes les 3 semaines. Les suivants attendent, les projets continuent.

---

## 8. Exploitations possibles et parades

| Exploitation | Parade |
| --- | --- |
| Intensif permanent | Fatigue (§1.3) : rendement net de 1,13 seulement, incidents × 6 |
| Lancer et annuler des projets pour « pêcher » des événements | Le coût du projet est **payé au lancement** (comme F1M), sans remboursement à l'annulation. Le tirage est fait au lancement et l'événement arrive entre 30 et 70 % de l'avancement |
| Relancer une recherche pour obtenir un autre tirage | Les idées viennent d'une **suite fixe** par écurie et par domaine (tirage à graine sur un compteur stocké) : relancer donne la même idée suivante. Une idée explorée ne revient jamais. Réorienter coûte la remise en route de la phase 8 |
| Recharger une sauvegarde | Le moteur est déterministe. Mêmes décisions, mêmes résultats, et **la vérité est fixée à la création** de l'événement. Recharger pour essayer l'**autre** option reste possible : c'est une limite de tout jeu solo. Option à discuter : un mode « une seule sauvegarde » |
| Thésauriser les heures de soufflerie | Aucun report entre périodes, aucun transfert |
| Finir volontairement plus bas au classement pour obtenir plus d'heures | Le coût en primes est réel (11 M€ par place environ). Le laboratoire mesurera si c'est rentable : si oui, on durcit, en le signalant |
| Concentrer toutes les heures sur un seul projet | Les trois usages ont chacun un rendement décroissant : la 50e heure d'un projet vaut bien moins que la 5e d'un autre |
| Copier systématiquement les autres | Diffusion seulement après une apparition en course, et seulement avec le savoir pour intégrer |
| Multiplier les projets de révolution | Un seul projet de recherche appliquée à la fois, compétences rares requises, f_répétition |
| Surcharge de notifications | §7 : non bloquant, au plus un dilemme toutes les 3 semaines, délégation |

## 9. Risques de déséquilibre à surveiller en laboratoire

1. **Boule de neige des grandes écuries.** Plus de personnel permet plus de projets en parallèle et une meilleure détection des défauts. Contrepoids :
   - le plafond (les salaires y sont comptés) ;
   - le barème de soufflerie ;
   - les rendements décroissants du savoir ;
   - les paris de concept ;
   - D-140.
2. **Fatigue trop punitive** (personne ne joue l'intensif) **ou trop faible** (intensif permanent rentable) : les deux stratégies 1 et 2 du laboratoire le diront.
3. **Événements trop « positifs en moyenne »** : si accepter est toujours rentable, ce n'est plus un dilemme. Critère : la stratégie « tout accepter » ne doit pas battre « décider selon le contexte ».
4. **Découvertes majeures trop fréquentes** : elles mèneraient à des voitures parfaites. Mesure de la marge restante sous les bornes du règlement après 30 et 50 saisons.

## 10. Décisions à prendre (reprises dans la fiche principale §16)

Q3 (fatigue par pôle et par responsable, une seule jauge) · Q4 (famille D = alerte conditionnelle) · Q5 (fusion des découvertes de la phase 8) · Q10 (dilemmes non bloquants) · et les valeurs initiales de cette fiche, en particulier :
- la **cible d'avancées majeures** (une tous les 2 à 4 ans sur la grille ?) ;
- la **règle anti-pêche** (coût payé au lancement).
