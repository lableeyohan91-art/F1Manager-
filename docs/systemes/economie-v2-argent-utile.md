# Économie, version 2 : un argent qui sert à quelque chose (fiche de conception, 27/11/2026)

> Demande du porteur (27/11) : « si demain je prends Mercedes, les sponsors me serviront à quoi ? » ; « si en 10 ans tu as 1 milliard, on a
> un problème, et ça démotive à gérer son argent » ; « si on baisse tout, les petites écuries ne pourront presque plus payer leurs pilotes » ;
> « équilibre le tout, l'entretien des installations surtout : c'est à ça que doit servir l'argent des grosses écuries quand elles en ont trop ».
> Sources : audit `docs/rapports/audit-economie-2026-11-27/` ; F1 Manager 2024 (guides et forums de joueurs, pas de source officielle).
> Statut : **conception soumise au porteur**, aucun code.

## 1. Le problème, chiffré (10 parties × 30 saisons, version actuelle)

| | Grandes écuries | Milieu | Haas |
| --- | --- | --- | --- |
| Recettes par an | 470 – 570 M€ | 310 – 440 M€ | 271 M€ |
| Dépenses sous le plafond (215) | 199 – 201 (au plafond) | 179 – 196 | 161 |
| dont entretien des installations | 36 – 39 | 15 – 24 | 19 |
| dont développement de la voiture | 54 – 58 | 66 – 84 | 62 |
| Argent sans usage sportif (dividendes + trésorerie qui grossit) | 150 – 250 par an | 50 – 200 | 34 |

Deux défauts : (1) au-delà du plafond, l'argent d'une grande écurie ne sert à rien de visible ; (2) l'entretien de ses grandes installations
est pris **sur le plafond**, donc sur la voiture : une grande écurie est punie d'avoir de belles installations, et son argent dort.

## 2. Principe proposé : le plafond pour la voiture, l'argent pour les installations

Comme dans F1 Manager (et dans l'esprit de la vraie F1, où les investissements sont limités à part) :

- **le plafond** couvre ce qui fait la voiture et l'écurie au quotidien : personnel, départements, opérations, développement ;
- **les installations** (construction **et** entretien) se paient avec l'argent de l'écurie, **hors plafond**. C'est là que va le surplus
  des grandes écuries : garder une soufflerie, un simulateur, une usine de niveau 9 ou 10 coûte cher, chaque année.

Conséquences voulues :
- une grande écurie riche **utilise** son argent : ses installations restent au sommet ; si elle s'appauvrit, elle doit réduire ;
- une petite écurie ne paie plus l'entretien sur son plafond… mais avec son argent, qui est rare : elle choisit ce qu'elle entretient ;
- le joueur à la tête de Mercedes a une vraie raison de chercher des sponsors : **financer ses installations** (et ses pilotes).

### 2.1 Garder l'égalité sous le plafond

Sortir l'entretien du plafond donnerait 36 à 39 M€ de place en plus aux grandes écuries pour la voiture, contre 15 à 24 M€ au milieu :
l'écart se creuserait. Pour l'éviter, **le plafond baisse d'autant** : environ 215 − 25 = **190 M€** (valeur à mesurer). Chaque écurie garde
la même place pour la voiture qu'aujourd'hui en moyenne, sans payer ses installations dessus.

### 2.2 Entretien hors plafond

- Même barème qu'aujourd'hui (niveau² et âge), payé sur la trésorerie à chaque période.
- Si l'écurie ne peut plus payer (trésorerie sous sa réserve), l'état de ses installations se dégrade (règle de l'entretien négligé, déjà
  existante) et le directeur technique propose une réduction (commande commune D-186).
- La limite de 25 M€ par an pour les **chantiers** reste (même règle pour tous) ; à mesurer : 25 ou 40.

## 3. Resserrer les recettes (sans étrangler les petites)

Objectif chiffré (à valider) : **petites écuries 240–270 M€**, de quoi payer le plafond, les pilotes et un entretien modeste ; **grandes
320–400 M€**, au lieu de 470–570. Le surplus des grandes reste réel (80 à 150 M€ par an) mais trouve son usage : installations, pilotes
stars, propriétaire.

Comment (données de `finances.csv` et coefficients, mêmes règles pour tous) :
- apport des propriétaires : les plus gros apports réduits (constructeurs riches), les plus petits inchangés ;
- base commerciale et sponsors : écart entre grandes et petites réduit (popularité moins décisive) ;
- primes : barème actuel (14 à 5 parts) conservé.

## 4. Les dividendes deviennent un choix

Le propriétaire a un **objectif de rentabilité** (selon son type : un fonds en veut beaucoup, un constructeur peu). Chaque fin d'année :
- l'IA et le joueur choisissent la part de l'excédent versée au propriétaire (commande commune) ;
- un propriétaire servi est satisfait (apport stable, patience) ; un propriétaire frustré réduit son apport, puis peut vendre.
- La règle A (D-188) devient un cas particulier : une écurie dans le bas du classement qui manque d'argent peut garder tout son excédent
  sans fâcher un propriétaire patient.

## 5. Des sponsors qui ont un prix

Certaines offres demandent une contrepartie : journées de promotion (fatigue des pilotes), pilote mis en avant, objectifs plus durs, image
(un sponsor controversé). Même pour une écurie riche, accepter devient une décision. (Détail dans une fiche à part, après mesure de §2–§3.)

## 6. Mesures prévues (20 graines × 30 saisons, tous les indicateurs, D-076)

Variantes mesurées séparément puis ensemble : (a) entretien hors plafond + plafond 190 ; (b) recettes resserrées ; (c) a + b.
Critères : trésorerie des grandes **stable** (pas d'accumulation au-delà de 1 an de dépenses) ; aucune écurie incapable de payer ses
pilotes ; écart de développement entre grandes et petites **inchangé ou réduit** ; installations des grandes au sommet tant qu'elles ont
l'argent ; tous les indicateurs de lutte (dynasties, titres ouverts, remontées) au moins aussi bons qu'aujourd'hui. Format de sauvegarde :
35 si un champ est ajouté (objectif de rentabilité), avec migration et test.

## 7. Questions au porteur

1. Le principe « plafond pour la voiture, argent pour les installations » (construction et entretien hors plafond), avec un plafond baissé
   d'autant (~190), te convient ?
2. Les fourchettes de recettes visées (petites 240–270 M€, grandes 320–400 M€) ?
3. Les dividendes deviennent-ils un choix du joueur (§4), ou les laisse-t-on automatiques ?
4. Les sponsors à contreparties (§5) : maintenant, ou après la mesure de §2–§3 ?
