# Rapport — Audit n°4 : corrections et performances du moteur

> Date : 22/11/2026. Audit transversal de ChatGPT (version auditée d0f00861). Décision : D-121.
> Outil de mesure ajouté : `npm run performance -- <saisons> <graine>` (`tools/performance.mts`).

## 1. Corrections

| Point de l'audit | Correction | Test |
| --- | --- | --- |
| 1. Sauvegardes : monde vide, tableau, version absente, semaine 99 acceptés | `deserialiser` valide la structure, les valeurs numériques, la date (semaine 1 à 52), les identifiants des entrées et les références essentielles (contrats → personnes, personnes actives → organisations). Messages en français, 10 problèmes au plus. **Sauvegarde de secours** : la précédente est conservée à chaque enregistrement (fichier `.secours`, ou entrée `::secours` dans le navigateur). `lireSauvegardeAvecSecours` et `chargerAvecSecours` se rabattent dessus en le signalant | `tests/audit-4.test.ts` 1 et 1 bis |
| 2. CSV : colonnes dupliquées, guillemets non refermés | Colonne en double ou sans nom, guillemet non refermé : erreur explicite (fichier, ligne) | 2 |
| 3. Indemnité de licenciement annoncée mais pas débitée | **Paiement centralisé** dans la fin de contrat (`liberer`) pour tout licenciement : volontaire, du conseil, ou après un changement de propriétaire. Débit de la trésorerie, ligne « indemnités », montant inscrit sur le contrat : jamais deux fois. Montant : la clause, sinon la moitié du salaire annuel (`balance/contrats.ts`) | 3 |
| 4. Cohérence : deux contrats actifs, contrat actif avant son début | `verifierCoherence` détecte en plus : deux contrats actifs, un contrat actif avant son début, un contrat signé non entré en vigueur, une fin avant le début, un salaire invalide, un **effectif dépassé pour chaque saison jusqu'à 3 ans**, des finances non finies ou orphelines, des sponsors et installations aux références inconnues. **Défaut réel trouvé et corrigé** : des finances étaient créées pour une écurie retirée des données | 4, 4 bis (3 saisons, contrôle toutes les 4 semaines) |
| 5. Spearman : rangs distincts pour les égalités | Rangs moyens et corrélation de Pearson sur les rangs. **Série constante : indéfinie (NaN)**, écartée des agrégats. Les classements successifs du laboratoire départagent comme le championnat (points, victoires, podiums) | 5 |
| 6. Indicateur historique réécrit par l'évolution des pilotes | Niveau de chaque pilote **relevé à sa première course de la saison** et conservé dans la saison. Ancienne sauvegarde sans relevé : indicateur indéfini, jamais recalculé avec les compétences actuelles. Format de sauvegarde 13 | 6, migration 12 → 13 |
| 7. Offres de la semaine 48 sans réponse possible | **Séance de clôture en semaine 49** : réponses définitives (sans contre-offre), puis expiration notifiée (`marche.offre_expiree`) des offres restantes | 7 |

## 2. Performances — mesurer avant de modifier

### 2.1 Mesure initiale (50 saisons, graine 1)

| | Avant |
| --- | --- |
| Total | 97 s (1,94 s par saison, 37 ms par semaine, semaine la plus longue 624 ms) |
| Coût d'une saison : 2027 → 2076 | 0,94 s → 3,71 s |
| Premier système | **marché des transferts : 61 %** du temps |

Le profilage (échantillonnage du processeur sur trois saisons d'une partie avancée) a montré deux causes :
- le **tri des identifiants de toute une table à chaque recherche** (37 % du temps) : contrats, souvenirs, personnes ;
- des **recherches répétées dans tous les contrats**, historique compris, pour chaque candidat, chaque écurie et chaque tour du marché, et pour chaque place libre d'une académie.

### 2.2 Corrections ciblées

- Recherches sans tri là où l'ordre est indifférent : au plus un contrat d'emploi actif par personne, une affiliation active, un team principal. Ce sont des invariants désormais vérifiés par `verifierCoherence`. Pour les souvenirs, on filtre d'abord et on trie ensuite le petit résultat : même ordre qu'avant.
- Marché : un **index des contrats courants**, calculé une fois par tour, sert à noter les candidats. Toute offre reste validée sur l'état réel par la commande. Les places libres d'une écurie sont calculées une fois par écurie, non plus par candidat.
- Académies : le vivier des jeunes et l'ensemble des affiliés sont calculés une fois, et non plus pour chaque place libre.
- **Aucun résultat ne change** : les empreintes du monde sont identiques avant et après, sur 12 saisons et 2 graines.

### 2.3 Après

| | Avant | **Après** |
| --- | --- | --- |
| 50 saisons | 97 s | **57 s** (−41 %) |
| Par saison / par semaine | 1,94 s / 37 ms | **1,15 s / 22 ms** |
| Saison 2027 → 2076 | 0,94 → 3,71 s | 0,74 → 2,06 s |
| Part du marché | 61 % | 40 % |
| Écriture / lecture et validation d'une sauvegarde de 50 saisons | — | ≈ 80 ms / ≈ 70 ms |

### 2.4 Ce qui reste : la croissance des volumes

| Saison | Personnes | Contrats | Événements | Souvenirs | Relations | Sauvegarde (brut / compressée) |
| --- | --- | --- | --- | --- | --- | --- |
| 2027 | 342 | 187 | 696 | 156 | 1 300 | 1,5 / 0,18 Mo |
| 2051 | 1 139 | 572 | 1 027 | 319 | 6 686 | 6,8 / 0,75 Mo |
| 2076 | 2 015 | 887 | 1 129 | 324 | 11 585 | 11,7 / 1,26 Mo |

Les événements et les souvenirs sont bien bornés. En revanche, **les personnes à la retraite ne quittent jamais la table, et leurs relations non plus**. C'est la cause principale du coût qui grandit avec l'âge de la partie et de la taille de la sauvegarde. C'est contraire à la règle des volumes bornés. **Proposition (à valider, D-121)** : archiver les retraités anciens sous une forme légère, qui garde le nom, les dates, le palmarès et les références de la chronique, et effacer leurs relations et leurs données détaillées après quelques années. Ce n'est pas fait ici : ça touche à la mémoire et à l'histoire du monde, donc la décision revient au porteur.

### 2.5 Web Worker

Le moteur n'utilise ni le navigateur ni l'interface, et la sauvegarde est du texte. Il peut donc tourner dans un Web Worker sans modification. Il faudra un petit module de plateforme pour l'échange de messages (avancer de N semaines, renvoyer un résumé ou la sauvegarde), à réaliser avec l'interface (phase 10).

### 2.6 Tests et délais

Les simulations longues (10 et 30 saisons) dépassaient leur délai sur les machines d'intégration de GitHub, qui ont deux fois moins de cœurs. Leurs délais sont relevés : 10 saisons à 120 s pour une référence locale d'environ 7 à 13 s ; 30 saisons à 240 s pour une référence d'environ 27 s. Les durées de référence de ce rapport et `npm run performance` servent à détecter une vraie régression : un relèvement de délai ne doit jamais la masquer.

## 3. Suite

- Décision à prendre : archivage des retraités anciens (§2.4).
- Ensuite : **phase 7b** (personnel technique).
