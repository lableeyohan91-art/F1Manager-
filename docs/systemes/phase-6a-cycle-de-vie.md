# Phase 6a — Cycle de vie des personnages

> Statut : **PROPOSITION — À VALIDER** (22/11/2026). Feu vert de principe du porteur ; aucune ligne de code avant validation de cette fiche.
> Cadre déjà validé : D-051 (potentiel global unique, progression différenciée par compétence, courbes d'âge par métier), D-062, D-063, D-071 (découpage 6a/6b, karting et F4 abstraits), D-072 (cibles démographiques), D-095 (méthode : mesurer, pas recalibrer trop tôt), D-099 (pas d'attribut commercial en 6a).
> Concerne **tous les personnages** : pilotes, ingénieurs, responsables techniques et dirigeants.

## 1. Objectif

Faire vivre les personnages dans le temps. Ils progressent, plafonnent puis déclinent, chacun **à son rythme**, prennent leur retraite, se reconvertissent, et sont remplacés par de nouvelles générations. Le tout doit être **imprévisible mais cohérent** :
- pas deux carrières identiques ;
- pas d'apogée commun à tous ;
- pas de courbe unique.

L'environnement doit compter : une bonne écurie fait progresser, un baquet de titulaire forme plus qu'un rôle de réserviste.

Ce que la 6a **ne fait pas** :
- championnats juniors, académies et financement des jeunes (6b) ;
- débauchage et agents (7) ;
- valeur commerciale (7 et 11) ;
- blessures (moteur de course, 13).

## 2. Ce qui existe aujourd'hui (et sera remplacé)

| Existant | Limite | Remplacé par |
| --- | --- | --- |
| Compétences **figées** (aucune progression ni déclin) | Hammilton à 42 ans garde éternellement son niveau | §4 Progression et déclin |
| `potentiel` (une note) lu **directement** par l'IA de recrutement et la valeur de marché | **L'IA connaît le vrai potentiel caché : c'est une triche** (contraire à D-081 et au principe « l'IA ne sait que ce que le joueur saurait ») | §6 Potentiel estimé |
| Réservoir provisoire (D-066) : personnes générées à la demande, niveau 14,2 pour les pilotes | Pilotes sortis de nulle part, sans passé ni progression | §9 Générations |
| Retraite des libres « de longue date » | Règle administrative, pas une décision | §7 Retraites |
| Courbes d'âge par métier (`COURBES_AGE`) : utilisées seulement à la génération | — | Conservées comme **moyennes** autour desquelles chaque personne a son propre profil |

## 3. Le profil de carrière (caché, individuel)

Chaque personne reçoit, une fois pour toutes, un **profil de carrière** tiré à sa création. On ne le voit pas directement : on le devine en observant la personne.

### 3.1 Âges propres

Ils sont tirés autour de la courbe moyenne de son métier :
- **fin de la progression rapide** ;
- **début de l'apogée** (plateau) ;
- **début du déclin** ;
- **vitesse du déclin**.

Ordres de grandeur, pour les pilotes :
- apogée entre 24 et 31 ans ;
- déclin à partir de 30 à 38 ans.

Les ingénieurs et les dirigeants ont des âges beaucoup plus tardifs, propres à chaque métier.

### 3.2 Archétypes

Les archétypes donnent des formes de courbe différentes. On les tire avec des poids, puis on y ajoute une variation individuelle :

| Archétype (provisoire) | Forme | Exemple de récit |
| --- | --- | --- |
| Précoce | Progresse vite, apogée tôt, déclin précoce | Le prodige de 20 ans qui ne fait plus de différence à 30 |
| Tardif | Progresse lentement mais longtemps, apogée tardif | Le pilote moyen qui éclate à 28 ans |
| Régulier | Courbe classique | La majorité |
| Longévité | Plateau très long, déclin lent | Le vétéran encore rapide à 40 ans |
| Météore | Progression fulgurante, apogée court, chute rapide | Une saison exceptionnelle, puis plus rien |
| Irrégulier | Progresse par paliers, avec des déclics et des stagnations | Le pilote imprévisible d'une saison à l'autre |

### 3.3 Points forts et points faibles

Ce sont des écarts fixes par compétence autour du potentiel global (D-051). Un pilote peut avoir un potentiel de 17, mais 19 en vitesse et 14 en gestion des pneus. Le **profil de compétences** d'une personne reste ainsi reconnaissable toute sa carrière.

### 3.4 Personnes issues des données

Les personnes inspirées du réel reçoivent un profil **compatible avec leur âge et leur niveau actuel**. Par exemple, un pilote de 44 ans encore au sommet reçoit nécessairement un profil « longévité » : jamais un déclin brutal absurde dès 2027.

Une colonne facultative `profilCarriere` dans `personnes.csv` permet de l'imposer : la base reste éditable.

## 4. Progression et déclin des compétences

### 4.1 Rythme et principe

Mise à jour **toutes les 4 semaines** (le rythme de la comptabilité), pour les personnes actives et libres. Les retraités ne sont pas recalculés.

Pour chaque compétence, à chaque période :

> variation = **phase de carrière** × **marge restante** × **nature de la compétence** × **environnement** × **travail personnel** + petite variation aléatoire (flux « progression », tirage local par personne et période)

### 4.2 Les facteurs

1. **Phase de carrière** (selon le profil individuel) :
   - forte progression avant l'apogée ;
   - quasi nulle pendant l'apogée ;
   - négative pendant le déclin, à la vitesse propre au profil.
2. **Marge restante** jusqu'au plafond de la compétence (potentiel + écart propre). Plus on s'approche du plafond, plus la progression ralentit. Le potentiel est un **plafond**, **pas une promesse** : sans un bon environnement, on peut ne jamais l'atteindre avant le déclin.
3. **Nature de la compétence**. Les compétences ne vieillissent pas toutes de la même façon :

   | Nature | Pilotes | Ingénieurs et dirigeants | Comportement |
   | --- | --- | --- | --- |
   | Physique et réflexes | vitesse, départs, condition | — | Apogée tôt, déclin en premier |
   | Technique | dépassement, défense, pluie | innovation, aérodynamique, conception | Courbe standard |
   | Expérience | régularité, gestion des pneus, retour technique | stratégie, règlement, gestion de projet, négociation, politique | Progressent par la pratique, apogée tard, déclin lent |
   | Transversales | leadership, communication, adaptabilité, gestion humaine | idem | Progressent avec l'âge et les responsabilités |

   Conséquence naturelle : un vétéran perd en vitesse pure mais garde régularité et gestion des pneus. Son style change avec l'âge.
4. **Environnement** :
   - **Temps de jeu** : un titulaire progresse plus qu'un réserviste, et une saison complète forme plus que trois courses.
   - **Qualité de l'encadrement** :
     - pour un pilote : simulateur de l'écurie, compétence « gestion des pilotes » du directeur sportif, qualité des ingénieurs ;
     - pour un ingénieur : centre de recherche, vision technique du directeur technique, niveau des collègues.
   - **Mentor** : un coéquipier ou un supérieur expérimenté, avec qui la relation est bonne, accélère la progression. Les relations de la phase 4 servent ici.
   - **Motivation** (état émotionnel de la phase 4) : une personne démotivée progresse moins, et peut même régresser.
5. **Travail personnel** : les traits professionnalisme et remise en question accélèrent la progression et freinent le déclin. Un pilote très professionnel décline plus tard.
6. **Événements rares** :
   - **déclic** : progression soudaine pendant quelques mois ;
   - **stagnation** : progression gelée.

   Leur probabilité est plus forte pour le profil « irrégulier ». Chacun produit un événement avec ses causes.

### 4.3 Garde-fou : l'avantage cumulatif des grandes écuries

Le risque est réel : la meilleure écurie a le meilleur simulateur, ses jeunes progressent plus vite, elle reste la meilleure. Contrepoids **naturels** prévus :
- le **temps de jeu** pèse plus que l'encadrement : un jeune titulaire dans une petite écurie progresse plus qu'un réserviste dans une grande ;
- l'effet de l'encadrement a des rendements décroissants ;
- les jeunes coûtent moins cher et sont plus faciles à recruter pour les petites écuries.

L'effet sera **mesuré** (§12), et rien ne sera recalibré trop tôt (D-095).

## 5. Ingénieurs et dirigeants

Mêmes mécanismes, avec leurs propres courbes. Les métiers techniques ont un apogée plus tardif ; les dirigeants, plus tardif encore.

**Passerelles entre métiers** : un ingénieur qui a progressé peut être candidat à un poste de responsable, et un responsable à celui de directeur technique. Le recrutement existant (D-066) examinera aussi les candidats d'un métier voisin, selon un tableau de compatibilité :
- ingénieur → responsable aéro ou conception → directeur technique ;
- directeur sportif → team principal ;
- etc.

Une promotion interne produit un événement et un souvenir positif (« reconnaissance »).

## 6. Potentiel réel et potentiel estimé

- Le **potentiel réel** est caché. Personne ne le lit, sauf la formule de progression.
- Chaque **écurie** (et donc le joueur) dispose d'une **estimation en fourchette** pour les personnes qu'elle observe : ses propres salariés, les pilotes du championnat, les candidats qu'elle étudie. La fourchette :
  - est **large** pour un jeune, **étroite** pour un vétéran observé longtemps ;
  - se resserre avec le temps d'observation (courses disputées, saisons) et avec le niveau du **département recrutement** ;
  - peut être **biaisée** : chaque département a une tendance propre (optimiste ou pessimiste) et commet des erreurs. On peut donc surestimer un jeune et se tromper.
- L'IA de recrutement et la valeur de marché utilisent **l'estimation de l'écurie**, plus jamais le vrai potentiel. Cela corrige la triche actuelle (§2).
- Volume borné : une estimation par couple (écurie, personne) observée, avec un maximum par écurie. Les estimations sur des retraités sont effacées.
- Les rapports de recrutement complets (texte, points forts, indices de personnalité) viendront avec la 6b, où les jeunes à évaluer seront nombreux. La 6a pose le modèle d'estimation.

## 7. Retraites

C'est une **décision de la personne**, par utilité comme en phase 4, prise en fin de saison. Pas d'âge fixe. Facteurs :
- le déclin **ressenti** (niveau actuel comparé au meilleur niveau de sa carrière) ;
- l'âge comparé à son profil ;
- les offres reçues, ou l'absence de contrat depuis plusieurs saisons (remplace la règle provisoire) ;
- les aspirations remplies ou non (par exemple « être champion » : on s'accroche plus longtemps si le rêve est encore possible) ;
- les valeurs (Victoire, Argent, Stabilité, Racines) et la motivation.

**Retours** possibles (D-072). Un retraité récent, ambitieux, encore en forme, peut revenir si une offre l'intéresse vraiment. Il reste dans le réservoir des candidats pendant quelques saisons.

**Jamais de retraite imposée pour libérer une place** (D-072).

## 8. Reconversions

À la retraite, ou en cours de carrière pour le personnel, une personne peut **changer de métier** :
- pilote → directeur sportif, team principal, ingénieur de piste (poste « ingénieur ») ;
- directeur technique → team principal ;
- etc.

**Conditions** :
- les compétences transversales (leadership, communication…) ;
- les relations (le réseau compte) ;
- les aspirations (« diriger une écurie », « transmettre »).

**Niveau de départ** : les compétences du nouveau métier sont calculées à partir des transversales et de l'expérience, puis progressent avec le profil de carrière, prolongé pour le nouveau métier. **Ses souvenirs et ses relations le suivent** : un ancien pilote devenu team principal se souvient de qui l'a trahi.

Les métiers **pas encore simulés** (consultant, ambassadeur, coach d'académie, agent) ne sont pas créés en 6a. La personne part simplement à la retraite. Ces métiers seront ajoutés avec leurs phases : 6b (académies), 7 (agents), 11 (médias), sans mécanisme provisoire à supprimer.

## 9. Renouvellement des générations

- Chaque saison, une **cohorte** de nouvelles personnes est générée. C'est une génération permanente, pas un mécanisme provisoire.
- **Pilotes** : ≈ 15 jeunes de **14 ans** (D-071 : karting et F4 abstraits) :
  - nationalités pondérées par le référentiel ;
  - potentiel très dispersé, avec une queue de rares pépites ;
  - **pas de quota**.

  Ils progressent dès 14 ans avec leur profil. Chaque année, un **classement de niveau abstrait** par tranche d'âge (karting, puis F4) leur donne une réputation, utilisée plus tard par les académies (6b).
- **Ingénieurs et dirigeants** : entrées à l'âge d'un jeune diplômé (≈ 24–30 ans), en nombre suffisant pour maintenir la population. Ils démarrent comme « ingénieurs » et montent par les passerelles (§5).
- **Accès à la F1 en 6a** (en attendant les filières de la 6b) : à partir de 18 ans, les jeunes de la cohorte sont candidats dans le réservoir existant, avec leur niveau réellement atteint. Le niveau imposé de 14,2 (provisoire) disparaît. En 6b, les championnats juniors s'intercaleront simplement entre la cohorte et la F1 : seule la porte d'entrée change, la cohorte reste.
- **Monde de départ** : les jeunes de 14 à 21 ans qui manquent en 2027 sont générés dès la construction du monde, avec un passé de progression simulé, pour que la pyramide des âges soit plausible dès la première saison.

## 10. Données, attributs et sauvegarde

### 10.1 Attributs

Chaque attribut est lu par au moins une formule :

| Attribut | Lu par |
| --- | --- |
| `profilCarriere` (archétype, âges propres, vitesse de déclin) | Progression (§4), retraite (§7) |
| `ecartsCompetences` (plafond propre par compétence) | Progression |
| `experience` (courses disputées, saisons, par catégorie) | Progression (temps de jeu), estimation (§6), retraite |
| `niveauMax` (meilleur niveau de carrière) | Retraite (déclin ressenti) |
| Table `estimations` (écurie, personne, fourchette, biais, date) | IA de recrutement, valeur de marché, interface |
| `biaisRecrutement` d'un département | Estimation |
| `reputationJeune` (classement abstrait karting / F4) | Candidature à 18 ans en 6a ; académies en 6b |

### 10.2 Sauvegarde

Format 7, avec migration testée. Profils tirés de façon déterministe pour les personnes existantes, compatibles avec leur âge et leur niveau (§3).

### 10.3 Volumes

- ≈ 15 pilotes + ≈ 10 personnels par an, soit environ 1 250 personnes en plus sur 50 saisons. C'est compatible avec l'objectif de l'architecture (4 000 à 6 000 personnes).
- Seuls les actifs et les libres sont recalculés.
- Les estimations sont bornées.
- Les souvenirs restent bornés par personne (règles de la phase 4).

## 11. Événements (avec leurs causes)

- `personne.progression_marquante`, `personne.declic`, `personne.stagnation`, `personne.declin` (franchissement de seuils) ;
- `personne.retraite` (motifs) et `personne.retour` ;
- `personne.reconversion` et `personne.promotion` ;
- `generation.cohorte` (résumé annuel, sans un événement par jeune).

Les grandes carrières qui se terminent entrent dans la Chronique : retraite d'un champion, retour inattendu.

## 12. Laboratoire : ce que l'on mesurera

Méthode D-095 : on mesure et on documente, sans recalibrer prématurément.

| Indicateur | Cible, quand elle existe |
| --- | --- |
| Distribution des âges d'apogée et de retraite, par métier | Étalée, sans pic unique |
| Part des personnes qui atteignent leur potentiel, selon l'environnement | — (effet de l'environnement mesuré) |
| Débutants en F1 par saison ; durée moyenne des carrières ; carrières très courtes et très longues | D-072 : 2 à 4 débutants ; 6 à 10 saisons |
| **Dérive du niveau moyen** de la grille sur 50 saisons | Stable (± 0,5 point). C'est le **risque principal** |
| Pyramide des âges sur 50 saisons | Stable |
| Pépites (potentiel ≥ 18) par décennie, et part d'entre elles qui deviennent champions | — |
| Avantage cumulatif : progression des jeunes dans le top 3 comparée aux autres écuries, titulaires et réservistes | Mesuré (§4.3) |
| Écart entre potentiel estimé et réel, selon le département recrutement | — |
| Effet sur les dynasties et la mobilité (tableau complet comparé à la référence P5b) | Mesuré, objectifs D-081 inchangés |
| Temps de calcul par saison | < 2 fois l'actuel |

## 13. Tests prévus

- **Déterminisme** : même graine, même monde.
- **Migration** 6 → 7.
- **Profil** : un vétéran issu des données ne s'effondre pas en 2027.
- **Environnement** :
  - un jeune titulaire progresse plus qu'un réserviste de même potentiel (test contrefactuel) ;
  - un jeune bien encadré progresse plus qu'un jeune mal encadré.
- **Déclin** : les compétences « physique » baissent avant les compétences « expérience ».
- **Estimation** : l'IA de recrutement n'accède jamais au vrai potentiel (audit du code).
- **Retraite et retour** : un retraité peut revenir.
- **Reconversion** : souvenirs et relations conservés.
- **Cohorte** : la population reste stable sur 50 saisons.

## 14. Mon avis franc

1. **Le risque principal est la dérive du niveau sur des décennies** : niveaux qui gonflent ou s'effondrent selon que les générations sont meilleures ou moins bonnes que celles qu'elles remplacent. Je propose de ne **pas** normaliser artificiellement les niveaux, et de régler la distribution des potentiels des cohortes pour que la population soit stable en moyenne, puis de le **mesurer** sur 50 saisons.
2. **Corriger la triche du potentiel** (§6) changera le comportement de l'IA de recrutement de la phase 4 : elle se trompera parfois. C'est voulu, mais les résultats des dilemmes de la phase 4 bougeront un peu.
3. **Les pilotes inspirés du réel vont vieillir**. Alonzo et Hammilton prendront leur retraite dans les premières saisons, ce qui est réaliste. La grille de 2030 sera en partie composée de pilotes générés : c'est le cœur du jeu sur 30 saisons.
4. **Ne pas tout mettre en 6a** : blessures, valeur commerciale, rapports de recrutement complets et métiers non simulés restent dans leurs phases. Aucun mécanisme provisoire n'est à supprimer plus tard. Le seul « provisoire » de la 6a est la porte d'entrée en F1 à 18 ans, et elle disparaît naturellement en 6b.
5. Cette phase devrait, à terme, **affaiblir les dynasties** (déclin des stars, débauchage à venir), mais seule la mesure le dira.

## 15. Questions pour le porteur (et ChatGPT)

1. **Archétypes de carrière** : la liste de 6 (précoce, tardif, régulier, longévité, météore, irrégulier) convient-elle ? Faut-il en ajouter ?
2. **Potentiel réel** : **fixe** à vie, sa réalisation dépendant de l'environnement (recommandé), ou révisable par de rares déclics (+1 ou −1) ?
3. **Blessures** : avec le moteur de course de la phase 13 (recommandé, pour éviter un mécanisme provisoire), ou dès la 6a sous forme abstraite ?
4. **Visibilité pour le joueur** : il voit les compétences actuelles exactes de ses propres salariés et le potentiel en fourchette (recommandé). Pour les autres écuries, voit-il aussi les compétences en fourchette ?
5. **Personnes issues des données** : imposer certains profils dans `personnes.csv` (par exemple « longévité » pour Alonzo), ou laisser le tirage compatible avec l'âge décider ?
6. **Porte d'entrée en F1 à 18 ans** en 6a, en attendant les filières juniors de la 6b : d'accord ?
7. **Taille des cohortes** : ≈ 15 pilotes et ≈ 10 personnels par an, à ajuster par la mesure de la pyramide. D'accord sur le principe ?
