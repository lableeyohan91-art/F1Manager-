# Phase 11 — Médias et archives

> Statut : **VALIDÉE** par le porteur le 24/11/2026 (D-149) : « oui » aux 6 questions, recommandations retenues.
> Rédigée par Claude Code le 24/11/2026. S'appuie sur ce qui existe déjà :
> - les faits, les fuites, les rumeurs et les révélations de presse (phase 8c) ;
> - la popularité et la valeur commerciale (phase 7c, D-096 à D-099) ;
> - la chronique et le palmarès (phases 3 et 9) ;
> - l'interface du joueur (phase 10).

## 1. Objectif

Donner au monde une **voix publique** :
- des médias qui racontent ce qui se passe ;
- une **image publique** des personnes et des écuries, qui pèse sur l'argent ;
- des **archives** pour se souvenir : records, palmarès, chronologie.

Le joueur lit les nouvelles, découvre des rumeurs (vraies ou fausses) et répond à la presse. Ses mots ont des conséquences.

**Principe non négociable** : un média ne raconte jamais un fait qui n'existe pas dans le moteur. Une rumeur est toujours présentée comme une rumeur. Elle vient du système de la phase 8c, qui sait si elle est vraie, exagérée ou fausse.

## 2. Les médias

- **Quatre médias fictifs**, chacun avec une ligne éditoriale (`data/commun/medias.csv`, modifiable). Le nombre et les types sont à valider (question 1).

  | Média | Ce qu'il publie | Style |
  | --- | --- | --- |
  | Quotidien sportif de référence | Résultats, transferts, faits publics | Factuel, prudent avec les rumeurs |
  | Tabloïd | Rumeurs, conflits, critiques publiques, scandales | Exagère, publie des rumeurs peu sûres |
  | Revue technique | Règlement, recherche, voitures, personnel technique | Précis, publie les avant-projets dont il a vent |
  | Presse nationale (une par grand pays) | Les compatriotes : pilotes, dirigeants, écuries | Chauvine, sensible à la popularité nationale |

- **Articles** : chaque semaine, chaque média choisit les faits qui l'intéressent et en tire un titre et un court texte. Ce sont des **gabarits de phrases**, jamais du texte libre inventé. Le choix se fait selon :
  - l'importance du fait ;
  - la popularité des personnes ;
  - la ligne éditoriale du média.
- **Volumes bornés** : 3 articles par média et par semaine au plus. Seuls les articles importants sont gardés au-delà d'une saison, et l'archive est plafonnée par saison.
- **Crédibilité** :
  - chaque média a une fiabilité ;
  - une rumeur publiée par le tabloïd est moins crue, par les personnages et par le marché, que la même rumeur dans le quotidien de référence ;
  - le moteur sait ce qui est vrai ; le joueur ne le sait pas.

## 3. Image publique (nouvel attribut)

- **Image** d'une personne et d'une écurie : de −100 à +100, distincte de la popularité. On peut être très connu et mal vu.
- **Ce qui la fait monter** :
  - victoires et titres ;
  - fair-play ;
  - soutien public à un pilote ;
  - promesses tenues et rendues publiques ;
  - jeunes talents lancés.
- **Ce qui la fait baisser** :
  - critiques publiques ;
  - promesses rompues révélées ;
  - scandales (§4) ;
  - licenciements brutaux ;
  - débauchages agressifs (réputation de prédateur, phase 7a).
- **Retour lent vers la neutralité** : on oublie, mais lentement.
- **Qui la lit** (règle : un attribut que personne ne lit n'existe pas) :
  - la **valeur commerciale** (déjà prévue dans sa formule, D-096) ;
  - l'**attrait pour les sponsors** (un sponsor « image » fuit une écurie mal vue) ;
  - le **conseil d'administration** (patience) ;
  - le **choix d'un candidat** entre deux offres (une écurie mal vue attire moins).
- **La popularité** (phase 7c) gagne un facteur d'**exposition médiatique** : être souvent dans les journaux rend plus connu, en bien ou en mal.

## 4. Scandales

- Un **fait privé grave révélé** par la presse (phase 8c) devient un scandale. Exemples :
  - promesse rompue ;
  - débauchage déloyal ;
  - tensions financières cachées ;
  - critique privée d'un dirigeant envers son pilote.
- **Effets** :
  - l'image baisse ;
  - certains sponsors activent leur **clause d'image** (départ ou réduction) ;
  - le conseil s'impatiente ;
  - les personnes concernées s'en souviennent.
- **Limite stricte** : uniquement des scandales **professionnels**, nés de la simulation. Jamais de vie privée, jamais rien qui vienne des données, même pour les personnages inspirés de personnes réelles (règle de CLAUDE.md, D-143). Recommandation : **aucun scandale inventé hors simulation**.

## 5. Conférences de presse (le joueur… et l'IA)

- Avant certains Grands Prix, et après un fait marquant qui concerne l'écurie, un journaliste pose **une question**. Exemples : « Votre pilote est-il menacé ? », « Visez-vous le titre ? », « Que pensez-vous de la décision de la fédération ? ».
- **Trois ou quatre réponses possibles**, qui sont des **commandes** (`media.declaration`) : soutenir, mettre la pression, esquiver, attaquer un rival.
- **Effets** :
  - relations avec les personnes visées (souvenir public) ;
  - image ;
  - **attentes** (viser le titre fait monter l'exigence du conseil et la pression sur les pilotes) ;
  - parfois, la réponse d'un autre team principal.
- **Même commande pour l'IA** : les team principals de l'IA répondent selon leur personnalité, et leurs déclarations deviennent des articles.
- Si le joueur ne répond pas, c'est le directeur de la communication qui le fait, de façon neutre (délégation `communication`, nouveau domaine).

## 6. Archives

- **Records**, calculés à partir des données et de la simulation (pas d'état nouveau, sauf un petit cache) :
  - le plus de victoires, de titres, de podiums ;
  - le plus jeune vainqueur et le plus jeune champion ;
  - les séries de victoires et les dominations ;
  - pour les écuries : titres, victoires, saisons sans point.
- **Records battus** : un fait de chronique et un article.
- **Palmarès** : par saison, par personne et par écurie, depuis 2010. Les données 2010–2026 viennent de `palmares.csv` ; les saisons simulées s'y ajoutent.
- **Chronologie** : la chronique de chaque saison, les ères, les grands transferts, les réformes et les présidents de la fédération.
- **Fiche historique** d'une personne ou d'une écurie : carrière, titres, records, moments marquants.

## 7. Interface (suite de la phase 10)

- **Actualités** : à la place de l'écran « Messages », un fil d'articles par média, filtrable (mon écurie, paddock, rumeurs). Le joueur voit le média et sa fiabilité, jamais si une rumeur est vraie.
- **Conférence de presse** : une décision en attente, avec les réponses possibles et ce qu'elles risquent.
- **Archives** : records, palmarès, chronologie, fiches historiques.
- **Image** : affichée sur les fiches (personnes, écuries) et sur le tableau de bord de son écurie.

## 8. Tests et mesures prévus

- **Aucun article sans fait source** (test sur 10 saisons). Une rumeur fausse n'est jamais présentée comme vraie.
- **Volumes bornés** : nombre d'articles et taille de sauvegarde après 50 saisons (critère de 5 Mo maintenu).
- **Image** :
  - test contrefactuel : critiquer publiquement contre en privé ;
  - effet mesuré sur les sponsors et la valeur commerciale.
- **Conférences** : mêmes règles pour le joueur et l'IA.
  - Dilemme contrefactuel : « viser le titre » ou « rester prudent ».
- **Records** : exactitude contre `palmares.csv` (2010–2026).
- **Mesure indicative** (D-120) : concentration du sponsoring et rotation des sponsors, avant et après l'image.

## 9. Questions pour le porteur

1. **Médias** : quatre médias fictifs (quotidien de référence, tabloïd, revue technique, presse nationale) ? Ou un autre nombre ?
2. **Conférences de presse** : en phase 11, avec 3 ou 4 réponses au choix et une délégation possible au directeur de la communication ? Recommandation : **oui**.
3. **Scandales** : seulement professionnels et issus de la simulation, jamais la vie privée ni des faits réels ? Recommandation : **oui, strictement**.
4. **Image publique** : un attribut distinct de la popularité (on peut être célèbre et mal vu) ? Recommandation : **oui**.
5. **Records et palmarès** depuis 2010, avec les données réelles déjà saisies ? Recommandation : **oui**.
6. **Ordre** : la phase 11 d'abord, puis la 11b (circuits en détail, qui demande ton travail de collecte des données) ? Recommandation : **oui**. On peut aussi commencer la collecte des circuits en parallèle.
