# Données initiales et histoire ancrée

> Statut : **VALIDÉ** le 22/11/2026 (D-041 à D-048). Points du §6 tranchés : fichier réel non publié, postes non pilotes réels altérés, circuits réels altérés, histoire ancrée depuis 2010.
> Remplace la partie « génération aléatoire des écuries » de [phase-2-monde.md](phase-2-monde.md), et modifie la simulation historique (D-021, D-033).

## 1. Principe

La partie démarre en **2027** avec une grille **inspirée de la grille réelle de 2026** : 11 écuries et leurs 22 pilotes. Les noms sont légèrement modifiés, et les données de départ sont proches de la réalité. Ensuite, **le monde évolue librement**. Les nouvelles générations sont générées procéduralement.

| Inspiré de la réalité (données modifiables) | Fictif (simulation) |
| --- | --- |
| Écuries : nom altéré, nationalité, identité, philosophie, moyens financiers, hiérarchie sportive, motoriste | Personnalités, valeurs, aspirations |
| Pilotes : nom altéré, nationalité, âge, niveau, potentiel | Relations privées, souvenirs, groupes sociaux |
| Palmarès et historique sportif (titres, victoires, carrières passées) | Tout ce qui se passe à partir de 2027 |
| Motoristes et liens écurie–motoriste | Nouvelles générations (pilotes, ingénieurs) |

## 2. Règle d'altération des noms

1. Changer **une seule lettre** (ajout, suppression ou remplacement), en gardant la prononciation si possible : Ferrari → Ferrary, Leclerc → Leclerq, McLaren → McLarren.
2. Si c'est impossible sans changer la prononciation, changer une lettre quand même, de la façon la plus discrète possible.
3. Pas de logo réel, pas de couleur de sponsor reproduite à l'identique, pas de nom de sponsor dans le nom des écuries (on garde le nom court : « Aston Martyn », pas le nom complet avec le sponsor).
4. La table des noms est **un fichier de données**, modifiable par le porteur. Le code ne contient aucun nom.

### Mise en garde (avis de Claude Code, à lire avant D-043)

- **Changer une lettre ne protège pas juridiquement.** Le but est que tout le monde reconnaisse Ferrari et Leclerc. Les marques des écuries et le droit à l'image des pilotes restent concernés.
- **Le risque le plus sérieux vient des personnalités et des relations fictives** attribuées à des personnes réelles reconnaissables (« Leclerq est rancunier, en conflit avec son ingénieur »). Publiées, elles pourraient être vues comme portant atteinte à leur image.
- **Pour un usage privé**, le risque est très faible. **Publié** (dépôt public, site GitHub Pages ouvert à tous), il devient réel.
- C'est la méthode utilisée par certains jeux de sport non licenciés. Elle n'est tolérée qu'en pratique, sans être sûre en droit.

**Décision finale du porteur (D-043 révisée) : les données sont dans le dépôt public.** Ancienne recommandation de Claude Code, conservée pour mémoire (comme les « fichiers d'options » des jeux de football) : le jeu ne contient qu'un jeu de données **fictif** par défaut. Le jeu de données « grille 2026 » est un **fichier séparé**, qui n'est pas publié, importé par le porteur dans son propre jeu. Voir D-043.

## 3. La base de données initiale — entièrement modifiable

Fichiers CSV (ouvrables dans Excel), un par table, avec identifiants stables :

| Fichier | Contenu |
| --- | --- |
| `ecuries.csv` | Identifiant, nom, nom court, nationalité, année de création, couleurs, profil (culture, philosophie, politique de recrutement), budget, prestige, popularité, tolérance du conseil, motoriste |
| `motoristes.csv` | Identifiant, nom, nationalité, niveau de départ |
| `personnes.csv` | Identifiant, prénom, nom, nationalité, date de naissance, poste, écurie, compétences et potentiel (1–20) |
| `contrats.csv` | Contrats en cours au 1er janvier 2027 (personne, écurie, poste, échéance, salaire) |
| `carrieres.csv` | Historique : personne, écurie, poste, de (année), à (année) |
| `palmares.csv` | Par saison passée : champion pilotes, champion constructeurs, victoires par pilote et par écurie |
| `installations.csv` | Niveau de départ des installations par écurie |
| `circuits.csv` | Circuits réels altérés (D-045) |

Première version saisie : [`data/grille-2026/`](../../data/grille-2026/).

- Les personnalités, valeurs et aspirations ne figurent **pas** dans ces fichiers par défaut : elles sont tirées à partir de la graine. Une colonne facultative permet de les imposer pour un personnage précis.
- Tout fichier est vérifié au chargement, avec des messages clairs (fichier, ligne, colonne).
- Le nombre d'écuries n'est figé nulle part : c'est le nombre de lignes de `ecuries.csv` (D-041).

## 4. Histoire ancrée (remplace la simulation historique libre)

### Le problème

Une simulation historique **libre** de 20 ans fait évoluer la grille : transferts, retraites, faillites. Elle ne peut pas, en même temps, aboutir exactement à la grille 2026 voulue. Les deux exigences sont incompatibles.

### La proposition : les faits viennent des données, la couche humaine est simulée

1. **Les faits sportifs passés sont lus dans les données, pas simulés** : palmarès, carrières, qui a été coéquipier de qui et quand. Ils sont inscrits au journal des événements et dans la Chronique.
2. **La couche humaine est simulée par-dessus ce passé fixe.** Pour chaque saison passée, le moteur rejoue les situations connues (coéquipiers, luttes pour le titre, arrivées et départs) et génère des événements humains plausibles. Exemples : rivalité entre coéquipiers proches au classement, consigne d'équipe, soutien après une mauvaise saison, conflit avec un ingénieur. Ces événements passent par la grille de lecture, et produisent souvenirs, relations, résidus et groupes sociaux.
3. **Pendant l'histoire ancrée, personne ne peut signer, partir ou être licencié** : le marché du travail est désactivé, et les contrats sont ceux des données. La grille de 2027 est donc **garantie**.
4. Les événements humains générés sont **privés ou confidentiels** par défaut. Ils ne contredisent jamais un fait public des données.

Résultat : au départ de la carrière, Leclerq et Hamiltan partagent déjà une ou deux saisons d'histoire commune, avec des souvenirs et une relation, sans que la grille ait bougé.

La **simulation historique libre** (D-021) reste disponible pour les mondes entièrement fictifs.

## 5. Le reste du monde

- **Team principals, directeurs (dont le directeur sportif), responsables techniques** : réels altérés quand ils sont publiquement connus, fictifs sinon (D-044).
- **Juniors, ingénieurs secondaires, agents** : fictifs, générés.
- **Nouvelles générations** : générées procéduralement, avec les mêmes règles que tout le monde.
- **Jeu de données fictif par défaut** : généré à partir d'une graine (ancienne phase 2), et utilisé pour les tests et la version publique.

## 6. Points à trancher

| ID | Question |
| --- | --- |
| D-043 | Publication : jeu de données « grille 2026 » séparé et non publié (recommandé), ou intégré au jeu public ? |
| D-044 | Postes non pilotes (team principal, directeurs, ingénieurs) : réels altérés ou fictifs ? |
| D-045 | Circuits : réels altérés ou fictifs ? |
| D-046 | Profondeur de l'histoire ancrée : depuis quand reprend-on palmarès et carrières ? |
