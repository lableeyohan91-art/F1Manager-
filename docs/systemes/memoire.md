# Mémoire, relations et conséquences — architecture

> Statut : principes **VALIDÉS** (D-018, mémoire résiduelle comprise). Valeurs numériques et formules **PROPOSÉES**, à calibrer en phase 4.
> Calendrier : le journal des événements et ses causes arrivent en **phase 1**. La mémoire v1 (souvenirs, résidu, promesses, confiance, reconnaissance) en **phase 4**. La mémoire v2 (diffusion de l'information, réputation complète, groupes sociaux) en **phase 8**.

## 1. Les cinq couches

```
 FAITS          SOUVENIRS             RELATIONS            DÉCISIONS
 (objectifs) ─► (subjectifs, par ─► (A → B, 4 axes) ──► (utilité + raisons)
   │             personne)            ▲                      │
   │                 │  oubli ──► résidu┘                     │
   │                                                          │
   ├──► PROMESSES (vérifiées à l'échéance) ──► nouveaux faits ◄┘
   └──► RÉPUTATION (faits publics agrégés)
```

### Couche 1 — Faits (événements)

Voir l'entité `Event` dans [entites.md](entites.md). Un fait est **objectif et immuable**. Il porte sa visibilité et ses causes.

**Conservation :**

| Importance | Conservation détaillée | Ensuite |
| --- | --- | --- |
| 1–2 (mineur) | 1 saison | Supprimé, sauf s'il est encore cité comme cause ou comme souvenir |
| 3 (notable) | 3 saisons | Résumé (type, date, acteurs), puis supprimé |
| 4–5 (majeur) | Pour toujours | Versé dans la **Chronique** |

### Couche 2 — Souvenirs

| Champ | Description |
| --- | --- |
| porteur | Personne qui se souvient |
| événement | Fait d'origine (ou son résumé s'il a été compacté) |
| cible | Personne ou organisation visée par le souvenir (peut différer des acteurs : « l'écurie m'a lâché ») |
| étiquette | promesse_tenue, promesse_rompue, soutien, reconnaissance, humiliation, injustice, trahison, opportunité_offerte, conflit_technique, consigne_imposée, responsabilité_assumée… (liste fermée, extensible) |
| ressenti | −1 (très négatif) à +1 (très positif) |
| intensité | 0 à 1 |
| créé le, renforcé le | Dates |

**Création — la grille de lecture.** Pour chaque personne qui **a connaissance** d'un fait :

```
ressenti, intensité = grille(type du fait, rôle de la personne,
                             personnalité, valeurs,
                             relation existante avec la cible,
                             contexte)
```

Exemples de règles (à formaliser en phase 4) :
- Promotion refusée : intensité × (besoin de reconnaissance / 10) × (ambition / 10).
- Licenciement d'un collègue proche jugé injuste : souvenir « injustice » chez ceux qui ont une forte affinité avec lui, intensifié par la valeur Équité.
- Soutien public après une erreur : souvenir positif fort chez la personne soutenue, plus fort si sa confiance en soi était basse.

Si l'intensité calculée est inférieure à un seuil, **aucun souvenir n'est créé**. Tout ne marque pas.

**Oubli.** Chaque mois : `intensité ← intensité × (1 − vitesse)`. La vitesse dépend de la rancune pour les souvenirs négatifs, et de la loyauté pour les souvenirs positifs. Un rancunier garde une humiliation des années. Un loyal garde longtemps la mémoire d'un soutien.

**Renforcement.** Un nouveau fait de même étiquette et de même cible renforce le souvenir existant, au lieu d'en créer un second. Deux promesses rompues par la même personne : la méfiance s'installe.

### Couche 3 — Relations

Lien **orienté** A → B. B peut ne pas avoir de relation avec A, ou une relation différente.

| Axe | Sens | Effets principaux |
| --- | --- | --- |
| Confiance | Croit-il ce que B dit et promet ? | Négociations, acceptation des promesses |
| Respect | Estime-t-il les compétences de B ? | Influence de B sur A, acceptation de ses décisions |
| Affinité | L'apprécie-t-il humainement ? | Envie de travailler ensemble, groupes sociaux, suivre B s'il part |
| Familiarité | Le connaît-il bien ? | Précision de ce que A sait de B ; amplifie les autres axes |

**Calcul :** `valeur d'un axe = base durable + Σ (contribution des souvenirs actifs de A envers B)`, bornée entre −1 et +1.

**Relations creuses :** on ne stocke une relation que si A et B ont travaillé ensemble, ou si A a un souvenir concernant B. Les autres sont considérées comme neutres et inconnues.

### Mémoire résiduelle

Quand l'intensité d'un souvenir passe sous le seuil d'effacement :

1. Une fraction de son effet (proposition : 10 à 30 %, selon la rancune ou la loyauté) est **versée dans la base durable** de la relation avec la cible.
2. Le souvenir est supprimé.

La personne ne se rappelle plus le détail (« pourquoi je me méfie de lui ? »), mais garde une méfiance ou une gratitude diffuse. La base durable est elle-même ramenée **très lentement** vers zéro : les erreurs restent réparables, mais seulement avec le temps et de nouveaux faits positifs.

**Limite de volume :** 40 souvenirs actifs maximum par personne. Au-delà, le plus faible est effacé (avec son résidu). Estimation : 1 000 personnes × 40 souvenirs × ~50 octets ≈ 2 Mo non compressés.

### Couche 4 — Promesses

| Champ | Description |
| --- | --- |
| auteur, bénéficiaire | Qui promet, à qui |
| contenu | **Condition vérifiable** par le moteur : « statut de pilote n°1 », « salaire ≥ X à partir de telle date », « titularisation la saison prochaine », « nouvelle soufflerie avant telle date », « ne pas recruter tel pilote »… |
| échéance | Date de vérification |
| visibilité | Privée par défaut. Publique si annoncée |
| statut | en cours, tenue, rompue, caduque (le bénéficiaire est parti) |

À l'échéance, ou dès qu'elle devient impossible à tenir, le moteur produit un fait `promesse.tenue` ou `promesse.rompue`. La grille de lecture crée les souvenirs. Une promesse publique rompue touche aussi la réputation (« parole non tenue »).

Les IA font aussi des promesses, et les rompent parfois. Les règles sont les mêmes pour tous.

### Couche 5 — Réputation

Score par acteur et par facette : *formateur de jeunes*, *fidèle à son personnel*, *impitoyable*, *négociateur difficile*, *bâtisseur*, *redresseur*, *parole tenue*, *gère les grandes personnalités*.

- v1 (phase 4) : réputation **publique** unique, calculée à partir des faits publics attribués à l'acteur, les plus récents pesant plus lourd.
- v2 (phase 8) : réputation **perçue** : chacun la module selon ce qu'il sait (faits privés qu'on lui a racontés, expérience directe).

## 2. Qui sait quoi

| Visibilité | Qui est informé immédiatement |
| --- | --- |
| Public | Tout le monde |
| Privé | Les participants, puis leurs proches (affinité forte), à la semaine suivante |
| Confidentiel | Les participants seulement |

v2 : chaque semaine, une information privée peut **fuiter** : probabilité selon la discrétion de ceux qui la connaissent, propagation dans le réseau de relations, et parfois publication par les médias (elle devient publique). Un personnage ne réagit qu'aux faits figurant dans ses connaissances.

## 3. Influence des souvenirs sur les décisions

Les décisions (accepter une offre, prolonger, démissionner, s'investir, suivre un collègue) sont des calculs d'utilité (voir [personnalite.md](personnalite.md)). Les termes relationnels sont :

- la relation avec les personnes concernées (direction, collègues, nouvel employeur) ;
- les souvenirs saillants qui portent sur l'option (« cette écurie m'a déjà licencié ») ;
- la réputation perçue de l'autre partie.

Chaque calcul garde ses **3 contributions principales**. Elles alimentent le « Pourquoi ? » : *« Il refuse votre offre. Il n'a pas oublié que vous l'aviez écarté en 2031, et il préfère le projet de l'écurie X. »*

## 4. Groupes sociaux (phase 8, principe)

- **Détection** une fois par saison : on cherche les ensembles de personnes reliées par une affinité ou un respect forts, et par une expérience commune (même écurie, même projet, même mentor).
- **Type déduit** de ce qui les relie : anciens collaborateurs, protégés d'un mentor (respect fort vers une même personne), partisans d'une philosophie (valeurs proches), clan autour d'un pilote, opposants à la direction (confiance basse envers la direction, partagée).
- **Leader** : la personne du groupe qui reçoit le plus de respect.
- **Effets** : quand le leader part, l'utilité de le suivre augmente pour chaque membre, selon son affinité avec le leader et sa loyauté envers l'écurie. Un groupe d'opposants abaisse la cohésion et le moral de son département.
- **Aucun groupe n'est créé à la main** : s'ils n'émergent pas, c'est que les relations sont mal réglées.

## 5. Garde-fous

- **Pas de jauge unique** : jamais de « +5 moral » direct. Tout passe par un fait, puis un souvenir ciblé.
- **Pas de scénario** : la chaîne « augmentation refusée → départ du directeur technique et de son équipe » doit émerger de systèmes génériques. Elle sert de **test de référence** (voir la fiche phase 4, à venir).
- **Réparable** : un conflit peut être compensé par des faits positifs ultérieurs. La rancune rend seulement la réparation plus lente.
- **Pas tout spectaculaire** : la plupart des faits ne créent aucun souvenir, ou un souvenir faible qui s'efface sans conséquence.
