# Audit de l'économie (26/11/2026)

> Demande du porteur : « Audit et amélioration de l'économie — inspiration F1 Manager 2024 ». Cet audit **ne modifie rien**.
> Sources : le code au commit 9e6a8b3 (sauvegardé dans la branche `sauvegarde-2026-11-26-avant-economie`) et un diagnostic financier frais
> (`tools/diagnostic-finances.mts`, 4 graines × 10 saisons, moyennes 2027–2036, M€ par an).
> Suite : fiche de conception `docs/systemes/economie-capacites-et-previsions.md` (leviers A et B).

## 1. Les trois contraintes : trésorerie, plafond, capacités

| Contrainte | Ce qui existe | Constat |
| --- | --- | --- |
| **Trésorerie** (l'argent en banque) | Recettes et dépenses écrites toutes les 4 semaines (13 périodes par an) ; réserve visée par l'IA ; dette, crise, administration, rachat | Correct et bien séparé du plafond |
| **Plafond budgétaire** (215 M€, votable) | Somme des dépenses plafonnées jugée au bilan annuel ; amende = 2 × le dépassement et soufflerie réduite (10 % si mineur, 25 % si majeur) | Correct ; dépassement de 0,34 M€ **déjà corrigé** (D-176) |
| **Capacités** (ce que l'écurie peut produire) | Places de projets par pôle = effectif du pôle ÷ 45, de 1 à 3 ; productivité = niveau du département × installations | **Figées à la création du monde** : aucun recrutement, aucun licenciement, aucune règle ne change l'effectif d'un département |

Le troisième point est le principal défaut de l'économie : **l'argent ne peut pas acheter de capacité**.

## 2. Tous les postes

### 2.1 Recettes

| Poste | Règle | Quand |
| --- | --- | --- |
| Primes du championnat | Enveloppe de 1 100 M€, parts 14/13/…/5/5 selon le classement constructeurs **de l'an dernier** | 1/13 à chaque période |
| Droits commerciaux | 50 % de la base commerciale × popularité × force sportive | 1/13 à chaque période |
| Sponsors | Contrats (titre, principaux, secondaires), objectifs, primes, opérations exceptionnelles | 1/13 à chaque période, primes à l'échéance |
| Apport du propriétaire | Apport de base × envie (ambition, résultats, pertes) × aléa × bonus d'objectif (D-179) ; retrait brutal possible en cours d'année | 1/13 à chaque période |
| Exceptionnels | Sauvetage, rachat, indemnités de transfert reçues | Au moment du fait |

Il n'existe **pas** de prime par course ni de versement initial séparé (F1 Manager 2024) : les primes sont étalées sur l'année. Ce n'est pas un
défaut ; c'est même plus lisible.

### 2.2 Dépenses plafonnées

| Poste | Règle | Lu par une formule ? |
| --- | --- | --- |
| Personnel plafonné | Salaires des cadres, sauf les 3 mieux payés | Oui (compétences) |
| Départements | Effectif × (0,05 + 0,003 × niveau) M€ | **En partie** : seuls l'effectif des pôles **aéro** et **conception** (places de projets), le niveau de ces pôles (productivité), le niveau des départements **stands**, **recrutement** et **marketing** servent. Production (250 personnes au départ), simulation, fiabilité, stratégie et logistique ne sont qu'un coût : environ **55 % de l'effectif** |
| Opérations | 1,2 M€ par Grand Prix | Coût seulement (normal) |
| Entretien des installations | 0,25 M€ par niveau, majoré avec l'âge | Oui (état des installations) |
| Développement | Part de recherche × budget + projets de pièces payés au lancement | Oui |

### 2.3 Dépenses hors plafond

Salaires des pilotes et des 3 cadres les mieux payés ; marketing (15 % des revenus commerciaux) ; installations (enveloppe de **25 M€ par an**) ;
académie ; intérêts ; indemnités ; amendes ; **dividendes**.

### 2.4 Attributs non lus (règle « un attribut qui n'est lu par aucune formule n'existe pas »)

- `cohesion` des départements : **lue par aucune formule** (seule la cohésion de l'équipe des stands, distincte, sert).
- Effectif des départements production, simulation, fiabilité, stratégie, logistique : lu seulement par le coût.

À régler dans la fiche A (la cohésion y reçoit un rôle) ou à documenter comme « frais de structure ».

## 3. Les chiffres (4 graines × 10 saisons, M€ par an)

| | McLaren | Ferrari | Mercédès | Williams | Alpine | Red Bull | Aston | Cadillac | Haas | Audi | Racing Bulls |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Place moyenne | 2,4 | 3,0 | 3,7 | 5,2 | 5,9 | 6,0 | 7,0 | 7,4 | 8,0 | 8,4 | 9,1 |
| **Recettes** | 527 | 621 | 567 | 333 | 324 | 477 | 409 | 340 | 248 | 378 | 268 |
| dont apport du propriétaire | 62 | 124 | 136 | 71 | 102 | 155 | 187 | 160 | 84 | 193 | 121 |
| **Dépenses plafonnées** (plafond 215) | 200 | 202 | 202 | 177 | 176 | 197 | 197 | 180 | **140** | 189 | 161 |
| dont départements | 77 | 80 | 84 | 44 | 43 | 76 | 65 | 48 | 36 | 57 | 41 |
| dont développement payé | 68 | 66 | 62 | 88 | 88 | 68 | 85 | 90 | 58 | 87 | 74 |
| Hors plafond (salaires, marketing, académie, installations…) | 128 | 136 | 120 | 86 | 71 | 113 | 88 | 70 | 68 | 79 | 65 |
| **Dividendes** | **192** | **272** | **242** | 68 | 72 | 142 | 92 | 86 | 33 | 100 | 32 |
| Trésorerie en fin d'année | 210 | 278 | 242 | 83 | 110 | 408 | 286 | 120 | 69 | 151 | 131 |

Budget de développement **prévu** et **payé** (graine 1, 2027–2030) : Williams 123 prévus / 79–98 payés ; Alpine 125 / 86–96 ;
Cadillac 120 / 87–92 ; Audi 113 / 83–107 ; Mercédès 71 / 63–65 ; Haas 43–74 / 26–48.

## 4. La cause des dividendes, chiffrée

Trois situations différentes :

1. **Les grandes écuries (McLaren, Ferrari, Mercédès) sont au plafond** : 200 M€ dépensés sur 215. Leurs 530 à 620 M€ de recettes ne peuvent pas
   aller dans la voiture : c'est **voulu par le plafond**, comme en vraie F1, où les grandes écuries font du bénéfice. Les dividendes de
   190 à 270 M€ ne sont donc **pas une anomalie de calcul**. Ce qui est discutable, c'est l'**absence d'usage** de cet argent hors plafond
   (installations limitées à 25 M€ par an et choisies par l'IA, pas de moteur payant) : c'est le sujet des leviers C (politique de dividendes)
   et D (contrats moteur), pas de A.
2. **Les écuries du milieu (Williams, Alpine, Cadillac, Audi) ont de l'argent et de la place sous le plafond, mais ne peuvent pas le
   dépenser** : elles prévoient 113 à 125 M€ de développement et n'en paient que 80 à 95, faute de places de projets (2 par pôle). Il leur
   reste 25 à 40 M€ sous le plafond, chaque année. Cet argent finit en dividendes (70 à 100 M€).
   **C'est l'anomalie : l'argent ne se transforme pas en performance** (corrélation de 0,14, mesurée en 12e).
3. **Haas est limitée par l'argent ET par ses capacités** : 75 M€ de place sous le plafond, mais 1 seule place de projets par pôle
   (75 ingénieurs aéro, 69 en conception : il en faut 90 pour une deuxième place), et peu de recettes. Elle verse quand même 33 M€ de
   dividendes : de l'argent qu'elle ne sait pas dépenser.

Pourquoi l'IA ne « répare » pas d'elle-même : rien dans les règles ne le lui permet.

## 5. Autres points de la demande

| Point | Constat |
| --- | --- |
| Moteurs | Aucun coût, aucun contrat, aucun changement de motoriste (D-114 : le client = l'usine). Levier D, avec le chantier des contrats moteur |
| Installations | Quatre installations techniques utiles ; enveloppe de 25 M€ par an hors plafond ; **le joueur ne peut pas lancer de chantier** (aucune commande) : l'IA choisit seule pour toutes les écuries, y compris celle du joueur |
| Valeur commerciale, sponsors personnels | Existent (phase 7c). Un sponsor lié à un pilote paie l'écurie ; **à vérifier** (levier G) qu'il n'est pas aussi compté dans la valeur commerciale du pilote |
| Engagements promotionnels | Les opérations exceptionnelles (D-157) existent ; pas d'engagements réguliers |
| Prévisions | L'écran Finances montre la trésorerie, les cumuls depuis janvier, le plafond et le budget, **aucune projection** : ni trésorerie de fin d'année, ni marge restante sous le plafond, ni dividendes à venir, ni budget non dépensable |
| Même économie pour les 11 écuries | Oui : mêmes comptes, mêmes règles, aucun budget caché pour l'IA |

## 6. Conclusion

- La comptabilité est saine (plafond, trésorerie, dettes, crises, mêmes règles pour tous).
- Le défaut principal est **structurel** : les capacités sont figées, donc l'argent disponible sous le plafond n'achète rien. Il touche surtout
  les écuries du milieu et Haas.
- Le joueur manque d'**informations prévisionnelles** et de **leviers** (effectifs, installations).
- Les dividendes des grandes écuries sont la conséquence normale du plafond ; leur ampleur se discutera avec les leviers C et D.
