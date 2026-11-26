# Économie — capacités achetables (A) et tableau de bord prévisionnel (B) (fiche de conception, 26/11/2026)

> Demande du porteur : « Audit et amélioration de l'économie — inspiration F1 Manager 2024 », puis « on fait A et B et on fait un point
> après ». Base : `docs/etudes/2026-11-26-audit-economie.md`. Statut : **conception soumise au porteur, aucun code** (D-180, À DISCUTER).
> Version sauvegardée avant ce chantier : branche `sauvegarde-2026-11-26-avant-economie`.

## 0. Le problème en une phrase

Les écuries du milieu ont 25 à 40 M€ par an de place sous le plafond et l'argent pour la remplir, mais ne peuvent pas le dépenser : leurs
places de projets dépendent d'un nombre d'ingénieurs **figé depuis la création du monde**. Cet argent part en dividendes. Le joueur, lui,
ne voit pas venir ce qui va se passer : aucune prévision.

---

## A. Des capacités qui s'achètent

### A1. Recruter ou réduire les ingénieurs des pôles aéro et conception

**Ce qui change** : l'effectif des pôles aéro et conception devient modifiable, par une **commande commune au joueur et à l'IA**
(`departement.effectif`), validée par les mêmes règles.

| Règle | Proposition | Raison |
| --- | --- | --- |
| Bornes de l'effectif d'un pôle | 40 à 160 personnes | Aujourd'hui 69 (Haas, conception) à 150 (Mercédès, aéro) |
| Taille d'une campagne | 5 à 40 personnes, une campagne à la fois par pôle | Le marché du travail n'est pas infini |
| Délai d'arrivée | **8 semaines** (préavis) ; elles comptent dans l'effectif à leur arrivée | On ne double pas une équipe en un mois |
| Coût | Salaire annuel existant (0,05 + 0,003 × niveau M€ par personne, **sous le plafond**) + frais de recrutement de 0,03 M€ par personne, **sous le plafond** | Tout ce qui fait la voiture est plafonné |
| Niveau des recrues | Niveau actuel du pôle, + 1 si l'écurie est attirante (prestige, résultats), − 1 sinon ; option **« profils confirmés »** : frais × 3, salaire + 25 %, niveau + 2 | L'argent peut aussi acheter de la qualité, cher |
| Intégration | La **cohésion** du pôle baisse selon la part de nouveaux, puis remonte de 0,5 point par mois vers sa valeur habituelle | Donne enfin un rôle à la cohésion, aujourd'hui lue par aucune formule (audit §2.4) |
| Effet de la cohésion | Productivité du pôle × (1 + 0,02 × (cohésion − 12)), bornée entre 0,85 et 1,10 | Neutre au départ (cohésion moyenne de 12 sur 20) |
| Licenciement | Effet après 4 semaines ; indemnité d'une demi-année de salaire (sous le plafond) ; la cohésion baisse aussi | Réduire coûte, et pèse sur l'ambiance |

**Ce que l'effectif permet** (inchangé) : places de projets = effectif ÷ 45, de 1 à 3. Haas passe de 1 à 2 places en aéro avec
15 ingénieurs de plus (≈ 1,2 M€ par an de salaires). Mais une place de plus ne sert que si l'on a **l'argent des projets** pour la remplir
(ordre de grandeur : une place pleine toute l'année, c'est 15 à 25 M€ de pièces, à mesurer).

**Option à trancher** : la fatigue des pôles serait rapportée à l'effectif réel (effectif ÷ 45, sans arrondi) et non plus au nombre de places.
Ainsi, 150 ingénieurs restent plus utiles que 135 (moins de fatigue, plus de projets intensifs). Sans cette option, tout ingénieur au-delà
de 135 serait payé pour rien.

### A2. Choisir ses installations

- Nouvelle commande commune `infrastructure.lancer` (installation, amélioration ou rénovation), avec **les règles actuelles de l'IA** :
  enveloppe réglementaire de 25 M€ par an hors plafond, un chantier à la fois, retards et surcoûts tirés au lancement.
- Le joueur choisit ; s'il ne fait rien, la direction technique choisit comme aujourd'hui (délégable, comme la recherche et les stands).
- L'IA garde sa règle actuelle (meilleur gain par euro).
- **Je déconseille** d'autoriser deux chantiers à la fois : l'argent hors plafond irait aux installations des riches (aujourd'hui, l'enveloppe
  n'est même pas entièrement utilisée : 11 à 17 M€ par an).

### A3. Ce que fait l'IA (mêmes commandes)

Deux fois par saison (budget de janvier, mi-saison) :
1. elle estime combien de places elle peut **remplir** avec son budget de projets (budget de développement moins la part de la recherche) ;
2. elle recrute si elle en a moins (dans les limites de taille et de délai), en tenant compte de la place sous le plafond (les nouveaux salaires
   réduisent le développement) ;
3. elle réduit l'effectif si elle est en crise, ou si deux saisons de suite elle ne remplit pas ses places ;
4. la personnalité du team principal module : un ambitieux recrute en avance, un prudent attend d'avoir l'argent.

Elle peut se tromper (estimations, imprévus) : c'est voulu (porteur : « l'IA doit faire des erreurs »).

### A4. Ce que le joueur vit

- Un vrai arbitrage **sous le plafond** : un ingénieur de plus, c'est de l'argent en moins pour les pièces. Les grandes écuries, déjà au
  plafond, doivent choisir entre personnel et développement ; les écuries du milieu peuvent enfin transformer leur argent en vitesse.
- Une décision **lente** : on recrute en janvier pour récolter à l'été ; licencier soulage les comptes mais casse l'ambiance.
- Les installations deviennent un choix du joueur.

### A5. Effets attendus (hypothèses, à mesurer)

| Écurie | Aujourd'hui | Attendu avec A |
| --- | --- | --- |
| Grandes (au plafond) | 200 M€ plafonnés, 190 à 270 M€ de dividendes | Peu de changement : le plafond les bloque déjà. Leurs dividendes relèvent des leviers C et D |
| Milieu (Williams, Alpine, Cadillac, Audi) | 25 à 40 M€ par an non dépensés | Dépensés dans la voiture ; dividendes en baisse ; plus de lutte avec les grandes |
| Haas | 1 place par pôle, peu d'argent | Une deuxième place accessible, mais l'argent reste le frein (leviers D-179) |

**Risques, dits franchement** :
- si toutes les écuries finissent à 3 places, la hiérarchie se resserre (le plafond fait le reste) : bon pour les dynasties, à surveiller
  pour l'identité des écuries (qui garderont leurs différences de niveau, d'installations, de pilotes et de savoir) ;
- l'IA pourrait recruter et licencier en boucle (garde-fou : pas de licenciement moins d'un an après un recrutement, sauf crise).

### A6. Données, format, tests, mesure

- Coefficients nommés dans `src/engine/balance/` (bornes, délais, coûts, cohésion).
- Format de sauvegarde 34 : campagnes en cours, cohésion de référence des pôles (migration et test).
- Tests : bornes et délais ; mêmes refus pour le joueur et l'IA ; coût sous le plafond ; places de projets après l'arrivée ; cohésion ;
  installations lancées par le joueur ; aucune boucle recrutement-licenciement.
- Mesure (20 graines × 30 saisons, mêmes graines que la référence D-179, **tous les indicateurs**) : argent non dépensé sous le plafond,
  corrélation argent ↔ performance (0,14 aujourd'hui), dividendes, effectifs par écurie, dynasties, titre ouvert, dominations, rotation du
  bas de grille, dépassements du plafond.

**Critères proposés** : argent non dépensable sous le plafond inférieur à 10 M€ par an pour les écuries qui ont la trésorerie ;
corrélation argent ↔ performance nettement plus haute ; aucun dépassement de plafond par l'IA ; aucune dégradation des indicateurs D-081.

---

## B. Un tableau de bord prévisionnel

### B1. Principe

Une fonction **pure** du moteur, `previsionFinances(monde, ecurie)` : elle ne modifie rien, rejoue les règles comptables déjà existantes
jusqu'à la fin de l'année (et pour la saison suivante), **sans les imprévus** (retrait du propriétaire, crise, primes de sponsors non
acquises), qui sont signalés comme tels. Pas de nouvel attribut, pas de changement de format. La même fonction pourra servir à l'IA.

### B2. Ce que le joueur voit (carte « Prévisions », en tête de l'écran Finances)

| Bloc | Contenu |
| --- | --- |
| **Trésorerie** | Maintenant ; dans 4 semaines ; fin de saison **avant** et **après** dividendes ; début de la saison suivante |
| **Recettes restantes** | Garanties : primes (fixées par le classement de l'an dernier), droits commerciaux, sponsors signés, apport prévu. Conditionnelles : primes d'objectifs des sponsors, bonus d'objectif du propriétaire |
| **Dépenses engagées** | Salaires sous contrat, départements, Grands Prix restants, entretien, chantier en cours, académie, intérêts |
| **Plafond** | Déjà dépensé, engagé d'ici décembre, **marge restante** ; alerte si la prévision dépasse le plafond |
| **Développement** | Budget prévu et budget **réellement dépensable** avec les places de projets actuelles : « 32 M€ de votre budget ne pourront pas être dépensés faute d'ingénieurs » (lien direct avec A) |
| **Dividendes** | « Au bilan, votre propriétaire (fonds) prélèvera environ X M€ : 80 % de ce qui dépasse Y M€ » |
| **Saison suivante** | Contrats qui se terminent (sponsors, pilotes, cadres), plafond voté, primes selon la place actuelle (« une place de mieux : + Z M€ ») |

Format : trois colonnes en paysage (D-177), chiffres arrondis, alertes en tête.

### B3. Tests

- Sans imprévu, la trésorerie de fin d'année prévue en semaine 1 est juste à quelques M€ près (écart mesuré sur 20 graines et documenté).
- La prévision ne modifie pas le monde (état identique avant et après l'appel).
- L'alerte de plafond apparaît quand une dépense engagée ferait dépasser.

---

## C. Ordre proposé et charge

1. **B d'abord** : sans effet sur l'équilibrage, utile tout de suite, et il rendra visible au joueur le problème que A corrige.
2. **A ensuite**, avec la campagne de mesure complète (avant / après, mêmes graines).

## D. Questions au porteur

1. **A1** : effectifs aéro et conception modifiables, délai de 8 semaines, coûts sous le plafond, licenciement avec indemnité : d'accord ?
2. **Profils confirmés** (plus chers, meilleur niveau) : oui, ou seulement des recrues au niveau du pôle ?
3. **Cohésion** : d'accord pour lui donner ce rôle (l'intégration des recrues) ?
4. **Fatigue rapportée à l'effectif réel** (option de A1) : oui ou non ?
5. **A2** : le joueur choisit ses installations, toujours un seul chantier à la fois : d'accord ?
6. Les autres départements (production, simulation, fiabilité, stratégie, logistique) : je propose de les laisser en **frais de structure**
   pour l'instant (coût seulement), et d'en faire plus tard des leviers (production → vitesse de fabrication, fiabilité → fiabilité de la
   voiture). D'accord ?
7. **B** : le contenu te convient (notamment l'affichage des dividendes à venir) ?
8. **Ordre** : B puis A ?
