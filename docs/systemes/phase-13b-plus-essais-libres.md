# Phase 13b+ — essais libres (conception technique, 28/11/2026)

> Cadre : D-195 (programmes validés par le porteur : « oui ») ; fiche `phase-13b-positions-depassements.md` §2.2 ; porteur le 28/11 :
> « fais ce qui est prévu » ; carte blanche de la phase 13 (D-192). Valeurs PROVISOIRES (D-120). Statut : à relire.

## 1. Principe

Chaque Grand Prix commence par **trois séances** d'essais libres (EL1, EL2, EL3). Pour chaque pilote titulaire, l'écurie choisit un
**programme par séance**. Le temps de piste est donc limité : trois séances, six programmes, il faut choisir.

- Le joueur fixe ses programmes par une commande (`essais.programmes`), valables jusqu'à nouvel ordre (comme les consignes de course).
- Une écurie qui n'a rien fixé (toutes les écuries de l'IA) suit le **plan par défaut**, calculé avec les mêmes règles et la même
  information que le joueur : pilote qui découvre le circuit → apprentissage ; pièce neuve montée depuis moins de 4 semaines → essai de la
  pièce en EL1 ; sinon deux séances de réglages (elles rapportent le plus, à rendement décroissant) et une simulation de qualification.
  Remarque : la règle « pièce neuve depuis moins de 4 semaines » est remplacée par « panne au dernier Grand Prix » (information publique,
  la date de montage des pièces n'est pas conservée).

## 2. Les six programmes et ce qu'ils changent (chaque effet est lu par une formule existante)

| Programme | Effet par séance | Formule qui le lit |
| --- | --- | --- |
| Réglages | erreur de réglage du week-end × 0,65 | rythme du pilote en qualification et en course |
| Longs relais | erreur d'estimation de l'usure × 0,7 | choix de la stratégie (13a) |
| Simulation de qualification | probabilité d'erreur en qualification × 0,7, et +0,02 % de rythme en qualification | qualifications (13b) |
| Apprentissage du circuit | handicap « circuit découvert » × 0,6 | niveau du pilote sur le circuit (D-106) |
| Essai d'une pièce | 25 % de chances de trouver une pièce montée fragile (défaut caché, 12b) ; trouvée, elle est renforcée | fiabilité de la voiture |
| Jeune pilote (EL1 seulement) | le pilote de réserve ou junior de l'écurie prend la voiture : il apprend le circuit (+0,5 visite), le titulaire perd la séance | niveau du jeune quand il courra sur ce circuit |

**Erreur de réglage du week-end** : chaque pilote tire au début du week-end une erreur |N(0 ; 0,2 %)| du tour, multipliée par
0,65 par séance de réglages et par (1 − 0,02 × (retour technique − 12)), bornée. Sans aucune séance de réglages : ≈ 0,16 % perdus en
moyenne ; avec trois : ≈ 0,04 %. C'est la situation de la compétence **retour technique** (D-194 (3)) ; son poids dans la moyenne
du rythme est gardé jusqu'en 13c-13d comme décidé.

## 3. Commande commune

`essais.programmes` : écurie, pilote titulaire, `el1`, `el2`, `el3` (un des six programmes ; « jeune pilote » seulement en EL1 et
seulement si l'écurie a un pilote de réserve ou junior). Auteur : team principal ou directeur sportif. Événement `essais.programmes`.
L'IA n'a pas besoin de la commande : sans choix enregistré, le plan par défaut s'applique (mêmes règles).

## 4. Événements

`essais.piece` (pièce fragile trouvée et renforcée, causes : séance, pilote) ; `essais.jeune` (séance confiée au jeune pilote).

## 5. Sauvegarde

Format 37 : programmes d'essais facultatifs par écurie (absents = plan par défaut). Migration sans transformation et test.

## 6. Mesures

- Effet d'un week-end sans réglages contre trois séances de réglages (places, banc).
- Plan par défaut contre plan « tout réglages » contre « tout simulation de qualification ».
- Campagne courte (indicative) : pas de changement de hiérarchie attendu (mêmes règles pour tous).
