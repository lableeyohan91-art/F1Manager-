# Phase 11b — Réponse à l'audit APEX Lab (24/11/2026)

> Réponse aux 9 demandes de l'audit « APEX Lab et priorités pour la phase 11b ». Toujours **non branché sur les courses** (proposition D-162).
> Tout est reproductible depuis le dépôt : commandes au §10, données brutes dans `donnees/audit/`.
> Les mesures restent **indicatives** (D-120). Les chiffres « avant » et « après » sont calculés dans les mêmes conditions : mêmes tracés, même outil.

## 0. En bref

| Demande | Statut | Résultat chiffré |
| --- | --- | --- |
| 1. Vérifier les anomalies | Fait | 4 anomalies confirmées, 1 nouvelle trouvée (ailerons bloqués au maximum) |
| 2. GitHub Actions | **Corrigé** | Test D-157 : délai justifié de 60 s, assertions inchangées. Chaîne verte, site publié (exécution n° 143). |
| 3. Normalisation (Suzuka) | Étudiée | Sur le calendrier complet, Suzuka devient « faible traînée + appui » (avant : « faible traînée + puissance ») |
| 4. Motricité contre déploiement électrique | **Corrigé** | Gain de motricité positif sur les 26 tracés (Monza : −0,025 s → +0,064 s) |
| 5. Courbes rapides | **Cause commune trouvée et corrigée** | Virages rapides −21 → −7 km/h ; validation 4,8 % → 3,4 % d'écart de temps |
| 6. Banc de spécialisation | Fait | Aucune voiture optimale partout ; 21 paires sur 21 s'inversent ; 6 philosophies gagnent au moins un circuit |
| 7. Interfaces des caractéristiques futures | Fait | Registre : 7 caractéristiques modélisées, 2 futures marquées « non testées » |
| 8. Export pour APEX Lab | Fait | `export/apex-lab/` : 5 circuits test, extensible aux 26 |
| 9. Rapport | Ce document | Problèmes ouverts au §9 |

## 1. Vérification des anomalies signalées

| Anomalie | Vérifiée ? | Cause réelle |
| --- | --- | --- |
| Échec de GitHub Actions (test D-157) | Oui | Le test simule 3 saisons et demie, soit environ 4 s en local et plus de 5 s sur les serveurs de GitHub. **Coût normal du test, pas un problème de performance du jeu.** |
| Suzuka mal classée par la normalisation | Oui | Moyenne calculée sur 5 circuits, dont 3 à très fort appui (§3) |
| Gain de motricité négatif (Monza, Suzuka) | Oui | **Erreur de comptabilité**, pas de la physique (§4) |
| Biais des courbes rapides | Oui, sur les 26 tracés | Courbure lissée sur une distance fixe (§5) |
| **Nouvelle** : ailerons au maximum presque partout | Oui | L'appui de base de la voiture de référence est trop faible (§9, à arbitrer) |

## 2. GitHub Actions

- Délai spécifique de 60 s sur le test D-157, comme les autres tests de plusieurs saisons (académies, audit n° 4, archivage : 60 à 120 s).
- Les assertions sont inchangées.
- Résultat de l'exécution n° 143 :
  - vérification des types, pureté du moteur, 301 tests, simulation de 50 saisons, équilibrage, construction : tout est vert ;
  - le job « publier » a réussi à 20 h 45 : le site est en ligne.

## 3. Normalisation

Quatre lectures comparées sur les 24 circuits du calendrier (gains pour +2 % de chaque paramètre, outil `tools/circuits/etude-normalisation.mts`) :

| Lecture | Ce qu'elle mesure | Paramètre n° 1, nombre de circuits |
| --- | --- | --- |
| Brute (secondes) | **L'importance** : ce qui pèse le plus dans le temps au tour | adhérence mécanique 12, appui 9, puissance 3 |
| Relative (% du tour) | La même chose, longueur neutralisée | identique à la lecture brute |
| Normalisée sur les 5 circuits test | **La rentabilité relative** : où une amélioration vaut plus qu'ailleurs | traînée 9, appui 6, puissance 5, motricité 3, adhérence 1 |
| Normalisée sur le calendrier | Même chose, sur une base complète | traînée 9, motricité 7, appui 4, adhérence 2, puissance 2 |

**Ce que cela montre**

- **Importance et rentabilité sont deux questions différentes.**
  - En valeur brute, ce sont presque toujours l'adhérence et l'appui qui pèsent le plus. Une fiche fondée là-dessus dirait la même chose partout : elle n'aiderait pas à choisir.
  - La lecture normalisée répond à la question utile pour le jeu : « sur ce circuit, quelle amélioration rapporte **plus que d'habitude** ? »
  - La normalisation est donc la bonne lecture pour les points essentiels. Le gain brut doit rester affiché à côté pour ne pas tromper.
- **La base de la normalisation compte.** Entre la base de 5 circuits et le calendrier complet, les points essentiels changent sur 10 circuits sur 24. **La normalisation n'est valable que sur le calendrier complet.**
- **Suzuka**

  | Paramètre | Gain brut | / moyenne 5 circuits | / moyenne calendrier |
  | --- | --- | --- | --- |
  | Appui | 0,468 s | 1,42 | 1,32 |
  | Traînée | 0,225 s | 1,71 | 1,42 |
  | Puissance | 0,275 s | 1,47 | 1,22 |
  | Adhérence mécanique | 0,352 s | 0,94 | 0,99 |

  - Sur le calendrier, Suzuka devient « faible traînée + appui ». C'est cohérent avec sa réputation de circuit qui demande une aérodynamique **efficace** (appui sans traînée).
  - Avec la base de 5 circuits, l'appui en était exclu.
- **Effets négligeables (moins de 0,05 s pour +2 %)**
  - Freinage : négligeable sur 14 circuits sur 24 ; motricité : sur 9.
  - La règle « négligeable ⇒ jamais essentiel » empêche qu'un effet minuscule devienne « essentiel » parce qu'il est un peu au-dessus de sa propre moyenne.
- **Recommandation**
  - Points essentiels = lecture normalisée sur le calendrier complet, avec la règle du négligeable.
  - Gain brut affiché à côté.
  - La rentabilité réelle (gain par euro ou par heure de soufflerie) ne pourra être calculée qu'en phase 12, quand le coût de chaque amélioration existera.

## 4. Motricité et déploiement électrique

**Cause**
- L'énergie électrique n'était comptée qu'aux endroits où la voiture est limitée par sa **puissance**.
- Là où elle est limitée par sa **motricité** (sortie de virage), l'électrique était utilisé gratuitement.
- Améliorer la motricité transformait donc des points « gratuits » en points « payants ». Le budget d'énergie s'épuisait plus tôt et la voiture perdait du temps en bout de ligne droite.

**Correction**
- Partout où la voiture accélère, on compte l'électrique réellement utilisé, c'est-à-dire la part de l'effort qui dépasse le moteur thermique.
- La recherche de la vitesse de coupure est plus fine : 16 étapes au lieu de 10. Le reste du gain négatif (−0,004 s à Suzuka) venait de l'imprécision de cette recherche.
- **Erreur de ma part, corrigée** : le commit `2cdbaca` annonçait 16 étapes, mais en annulant un premier essai de recalage, j'avais aussi remis 10. Le commit suivant (`ca56c3c`) rétablit les 16 étapes. Les chiffres de ce rapport sont tous mesurés avec 16 étapes.

**Le déploiement s'adapte bien à la voiture.** La vitesse de coupure est recalculée pour chaque voiture et chaque circuit, en fonction de son propre budget d'énergie :
- une voiture plus motrice dépense plus d'énergie en sortie de virage et coupe un peu plus tôt en ligne droite ;
- c'est un vrai compromis du règlement 2026, visible dans le banc (§6) ;
- le freinage le montre aussi : freiner plus tard prolonge l'accélération, ce qui coûte de l'énergie (−0,03 à −0,12 s en ligne droite).

**Résultat** : le gain de motricité est strictement positif sur les 26 tracés (test ajouté) :

| Circuit | Gain de motricité (+2 %) avant | après |
| --- | --- | --- |
| Monza | −0,025 s | +0,064 s |
| Suzuka | +0,043 s | +0,041 s |
| Monaco | +0,177 s | +0,178 s |

Le recalage qui a suivi est décrit au §5.

## 5. Courbes rapides : la cause commune

**Mesure sur les 26 tracés.** Vitesse au point le plus lent de chaque virage, modèle contre réel :

| Virages | Nombre | Avant | Après | Accélération latérale réelle |
| --- | --- | --- | --- | --- |
| Lents (< 130 km/h) | 96 | +0,6 km/h | +1,6 km/h | 1,8 g |
| Moyens (130–200) | 56 | −14,5 | −8,5 | 3,0 g |
| Rapides (200–260) | 27 | −20,9 | −7,2 | 3,7 g |
| Très rapides (> 260) | 39 | −15,3 | −4,7 | 2,1 g |

**Deux causes testées**

| Hypothèse | Virages lents | Rapides | Validation (21 circuits) | Verdict |
| --- | --- | --- | --- | --- |
| (b) Appui trop faible : appui × 1,2 | +5,0 km/h | +4,8 | 3,5 % | Rejetée : corrige les rapides mais dégrade les lents, et l'écart de vitesse global (18,9 km/h) |
| (a) Pics de courbure : lissage sur 0,2 s | +1,6 | −4,5 | 3,2 % | **Retenue** |
| (a) lissage sur 0,3 s | +3,0 | +3,0 | 2,9 % | Trop fort pour les lents |

**Explication physique**
- À 250 km/h, une voiture parcourt 15 m en 0,2 s.
- Un pic de courbure aussi court ne l'oblige pas à ralentir, qu'il vienne du bruit de mesure ou d'une petite correction de trajectoire.
- La courbure était lissée sur une **distance** fixe, alors qu'il faut la lisser sur une **durée** de trajet.

**Correction**
- La courbure est lissée sur **0,25 s** de trajet.
- La durée est convertie en distance avec la **vitesse calculée de chaque voiture**, jamais la vitesse réelle (test ajouté : remplacer les vitesses réelles de la trace ne change rien).
- Le coût de calcul reste sous la limite de 200 ms par choix d'ailerons.

**Recalage : un piège évité**
- Un recalage complet sur les 5 circuits test **annulait le progrès** : virages rapides de nouveau à −20 km/h, validation à 4,6 %.
- Explication : ces 5 circuits n'ont presque pas de courbes rapides (Suzuka seulement). Le calage échangeait donc le gain contre un meilleur ajustement de Monza et de Monaco. C'est du **surapprentissage**.
- Règle retenue : les paramètres de la **voiture** sont jugés sur les 21 circuits de validation. Seule l'**adhérence des 5 pistes**, qui est une propriété du circuit sans effet sur les autres, est recalée sur ces 5 circuits.

**Paramètres de la voiture de référence (référence précédente conservée)**

| Paramètre | Précédent | Nouveau |
| --- | --- | --- |
| Traînée (CDA) | 0,84 | 0,7338 |
| Adhérence mécanique | 1,25 | 1,264 |
| Adhérence aéro | 2,02 | 2,043 |
| Motricité | 0,95 | 0,9607 |
| Freinage | 1,51 | 1,647 |
| Baisse d'appui en mode ligne droite | 0,46 | 0,6953 (**borne : 0,70**) |
| Appui (CLA), puissance, énergie, baisse de traînée en ligne droite | inchangés | inchangés |

**Adhérence des pistes**

| Circuit | Précédente | Nouvelle |
| --- | --- | --- |
| Monaco | 0,935 | 0,903 |
| Singapour | 0,935 | 0,925 |
| Mexico | 0,996 | 0,967 |
| Monza | 1,058 | 0,907 |
| Suzuka | 1,077 | 1,056 |

Ces adhérences ne sont plus ramenées à une moyenne de 1. Monza passe en bas du classement : c'est à recouper avec un classement public des revêtements.

Critère de calage :
- écart de vitesse ;
- **plus l'écart de temps au tour**, avec un poids de 1 km/h pour 1 % d'écart ;
- plus la contrainte publique « moins d'appui à Monza qu'à Monaco », qui impose seulement l'ordre, aucun niveau précis.

**Les 5 circuits test**

| Circuit | Tour réel | Avant l'audit | Après | Écart moyen de vitesse | Vitesse max modèle / réel |
| --- | --- | --- | --- | --- | --- |
| Mexico | 76,6 s | 77,9 s (+1,7 %) | 76,7 s (+0,1 %) | 10,0 → 9,4 km/h | 352 / 350 |
| Monaco | 72,3 s | 72,9 s (+0,9 %) | 72,4 s (+0,2 %) | 13,1 → 14,4 km/h | 307 / 286 |
| Monza | 81,9 s | 80,5 s (−1,7 %) | 82,1 s (+0,3 %) | 13,5 → 13,8 km/h | 339 / 339 |
| Singapour | 91,5 s | 92,6 s (+1,2 %) | 91,5 s (0,0 %) | 11,0 → 11,1 km/h | 302 / 307 |
| Suzuka | 89,1 s | 91,8 s (+3,0 %) | 89,0 s (−0,1 %) | 19,1 → 17,5 km/h | 317 / 323 |

**Les 21 circuits de validation** (jamais utilisés pour caler) :

| Indicateur | Avant l'audit | Après la correction d'énergie | Après le lissage |
| --- | --- | --- | --- |
| Écart absolu moyen de temps | 4,82 % | 4,27 % | **3,39 %** |
| Biais moyen (+ = modèle trop lent) | +4,27 % | +3,31 % | **+1,12 %** |
| Pire circuit | 16,0 % (Lusail) | 15,1 % | 12,4 % (Lusail) |
| Circuits à plus de 5 % | 9 | 10 | **4** |
| Écart moyen de vitesse | 19,1 km/h | 18,7 km/h | 17,7 km/h |
| Gains négatifs | 0 | 0 | 0 |

Détail par circuit dans `donnees/audit/validation-*.json`.
- **Nettement améliorés** : Jeddah (7,2 → 1,8 %), Silverstone (6,7 → 1,6 %), Spa (7,4 → 2,6 %).
- **Dégradés** : Montréal (−4,9 → −7,9 %), Barcelone (+1,3 → −3,1 %), Sepang (−0,1 → −3,6 %). Le modèle est désormais un peu trop **rapide** sur les circuits à chicanes et à virages lents.

## 6. Banc de spécialisation

**Méthode** (`tools/banc-specialisation.mts`, sans hasard)
- Chaque voiture est la référence améliorée sur **une** caractéristique.
- Chaque amélioration est dosée pour faire gagner **exactement 0,5 s en moyenne** sur les 24 circuits du calendrier.
- Toutes les voitures ont donc la même performance globale : aucune ne peut être « meilleure partout » par simple surdosage.

**Dosage nécessaire pour un gain moyen de 0,5 s**

| Appui | Faible traînée | Adhérence mécanique | Motricité | Moteur et énergie | Freinage | Polyvalente |
| --- | --- | --- | --- | --- | --- | --- |
| +2,8 % | +6,8 % | +2,9 % | +16,0 % | +3,4 % | **+29,2 %** | +0,8 % partout |

**Caractéristiques non testées**
- Refroidissement et gestion des pneus sont des caractéristiques **futures** (phases 12 et 13) : aucun effet défini, absentes du banc.
- Un test vérifie qu'elles ne changent rien à la voiture.

**Les 5 circuits test** (gain sur la référence, réglage d'ailerons identique)

| Circuit | 1re | 2e | Dernière | Où se fait la différence |
| --- | --- | --- | --- | --- |
| Monza | Faible traînée 0,66 s | Moteur 0,65 | Appui 0,31 | Faible traînée : 0,66 s gagnées en ligne droite, 0 en virage |
| Monaco | **Motricité 1,06 s** | Adhérence 0,64 | Moteur 0,13 | Motricité : 0,89 s en sortie de virage |
| Suzuka | Appui 0,64 s | Faible traînée 0,64 | Motricité 0,22 | Appui : vitesse emportée des virages dans les lignes droites (0,31 s) et virages moyens (0,10 s) |
| Singapour | Motricité 0,94 s | Freinage 0,80 | Faible traînée 0,32 | Freinage : +0,88 s au freinage, −0,08 s en ligne droite (énergie) |
| Mexico | Freinage 0,62 s | Motricité 0,57 | Faible traînée 0,22 | Air raréfié : la traînée et l'appui comptent moins |

- **Les compromis visibles.** La faible traînée perd au freinage, car elle freine moins par l'air. La motricité et le freinage coûtent de l'énergie en ligne droite.
- **Ce qui manque.** L'appui n'a **aucun compromis** dans le modèle : plus d'appui ne coûte pas de traînée, car la traînée ne dépend que du réglage d'ailerons. La caractéristique « appui » représente donc un gain d'**efficacité** aérodynamique, pas un choix d'appui. Limite à traiter en phase 12.
- **Les sensibilités de chaque voiture** sont dans le fichier : une voiture déjà forte sur un paramètre gagne moins à l'améliorer encore.

**Les 26 tracés : synthèse**

| Indicateur | Réglage identique | Réglage optimisé par voiture |
| --- | --- | --- |
| Victoires par voiture | faible traînée 7, appui 5, motricité 5, freinage 5, moteur 3, adhérence 1, polyvalente 0 | identique |
| Voiture optimale partout | **aucune** | aucune |
| Paires de voitures dont l'ordre s'inverse | **21 sur 21** | 21 sur 21 |

**Meilleur et pire circuit de chaque voiture** (avantage sur la moyenne des voitures)

| Voiture | Meilleur | Pire |
| --- | --- | --- |
| Appui | Sepang (+0,23 s) | Bakou (−0,17 s) |
| Faible traînée | Jeddah (+0,42 s) | Monaco (−0,34 s) |
| Adhérence mécanique | Lusail (+0,20 s) | Jeddah (−0,18 s) |
| Motricité | Monaco (+0,55 s) | Jeddah (−0,27 s) |
| Moteur | Jeddah (+0,24 s) | Monaco (−0,37 s) |
| Freinage | Shanghai (+0,28 s) | Silverstone (−0,24 s) |
| Polyvalente | Sepang (+0,13 s) | Bakou (−0,09 s) |

**Lecture**
- Les philosophies ont un sens. Les circuits rapides favorisent la faible traînée ou le moteur. Les circuits urbains lents favorisent la motricité. Les circuits sinueux et rapides favorisent l'appui (Suzuka, Barcelone, Hongrie, Lusail, Sepang).
- La polyvalente ne gagne nulle part mais ne perd jamais beaucoup.
- **Les défauts**
  - L'adhérence mécanique ne gagne qu'un circuit (Zandvoort) : la motricité lui prend Monaco et Singapour.
  - Le freinage et la motricité ont un **levier faible** : il faut +29 % et +16 %. Dans le jeu, un « point » de chaque caractéristique ne devra pas avoir le même effet physique : ce sera un réglage de la phase 12.
  - Le « réglage optimisé » n'apporte presque rien, puisque l'aileron est bloqué au maximum (§9.1).

## 7. Interfaces des caractéristiques futures

`src/engine/circuits/specialisation.ts` contient un registre des caractéristiques. Chacune déclare :
- **son statut** : « modélisée » (effet physique défini, testé) ou « future » (aucun effet, non testée) ;
- **ses leviers physiques** et leur poids ;
- **ses compromis**, représentés ou prévus ;
- **le seul canal par lequel la météo l'atteindra.**

Règle contre le **double comptage** : un effet physique n'a qu'un propriétaire.
- La température agit par les conditions du circuit (densité de l'air ; plus tard température de piste), jamais par un bonus séparé sur une caractéristique.
- Exemple : le refroidissement (phase 12) lira la température de l'air ; la chaleur ne pénalisera pas une deuxième fois la puissance par un autre chemin.

Le registre ne crée **aucune donnée de partie** et n'est lu par aucune règle de course : il sert au banc et à l'export. Les caractéristiques du jeu (D-160) s'y brancheront en phase 12, après conception validée.

## 8. Export pour APEX Lab

`npx tsx tools/export-apex-lab.mts [dossier] [circuits | tous]` écrit un fichier par circuit et un index (format d'export 1).

**Contenu**
- **Les voitures** : référence et dosages du banc, paramètres complets.
- **Le registre des caractéristiques.**
- **Par circuit** :
  - longueur, adhérence de piste, altitude ;
  - temps réel et temps du modèle, réglage d'ailerons calculé, coupure électrique, énergie utilisée ;
  - sensibilités et parts du tour ;
  - résultats du banc (temps, écarts, gains par portion) ;
  - **la trace point par point** : abscisse, position, courbure effective, vitesse réelle, vitesse du modèle, limite.
- Chaque valeur est marquée **réel** (relevé OpenF1 dérivé) ou **modèle** (moteur du jeu).

**Comment l'utiliser**
- Le laboratoire **lit** ces résultats au lieu de les recalculer : il n'y a qu'un moteur de référence, celui du jeu.
- L'export des 5 circuits test est versionné dans `export/apex-lab/` (250 ko). Les 26 tracés se génèrent avec l'option `tous`.

## 9. Problèmes ouverts

### 9.1 Ailerons au maximum presque partout (à arbitrer)

**Constat**
- Le réglage calculé est au maximum (+1,0) sur 25 des 26 tracés. Seule Monza est plus bas (0,85).
- Las Vegas était à 0,6 avant le recalage, puis est passée au maximum.

**Mesure** : temps au tour selon le niveau d'aileron

| Circuit | 0 | +0,5 | +1,0 | +1,5 | +2,0 |
| --- | --- | --- | --- | --- | --- |
| Monza | 85,9 s | 82,8 | 82,1 | 82,1 | 82,0 |
| Las Vegas | 95,5 | 92,3 | **91,5** | 92,2 | 93,1 |
| Spa | 116,8 | 111,7 | 107,5 | **107,1** | 107,7 |
| Monaco | 80,8 | 76,1 | 72,4 | 69,6 | 67,6 |

**Causes**
1. L'appui de base de la voiture de référence (CLA 2,59) touche presque la borne basse du calage (2,5). Le calage ne peut pas distinguer « plus d'appui de base » de « plus d'aileron », car les deux ont le même effet. La plage de réglage s'arrête donc avant le vrai optimum.
2. Avec l'aéro active, la traînée ajoutée par l'aileron est en grande partie effacée en ligne droite. Monza « voudrait » autant d'appui que Bakou, ce qui est faux dans la réalité.

**Conséquences**
- Le réglage d'ailerons ne différencie presque pas les circuits.
- Dans le banc, la lecture « réglage optimisé » est vide de sens.
- Sans effet sur les courses aujourd'hui, mais **bloquant pour les réglages de la phase 13** (D-161).

**Proposition (D-163, à discuter).** Refaire la modélisation aérodynamique en phase 12, dans cet ordre :
1. fixer l'appui de base au milieu de la plage de réglage ;
2. faire porter à l'aéro active une baisse de traînée **sur l'aileron seulement**, pas sur toute la voiture ;
3. donner un coût à l'appui (compromis appui contre traînée).

Juge : les 21 circuits de validation, avec un critère supplémentaire — l'ordre public des niveaux d'appui (Monza et Las Vegas bas, Monaco et Hongrie hauts).

### 9.2 Autres problèmes ouverts

1. **La baisse d'appui en ligne droite est à sa borne** (0,695 pour 0,70). C'est le signe que le calage compense un effet absent. Ce point est lié au 9.1.
2. **Circuits hors norme en validation**
   - Lusail +12,4 % : données 2025 ; tracé ou adhérence à vérifier.
   - Zandvoort +7,6 % : ses virages relevés ne sont pas modélisés.
   - Shanghai +6,4 %.
   - Montréal −7,9 % : chicanes, probablement passage sur les vibreurs.
3. **Monaco : vitesse de pointe de 307 km/h contre 286.** Le tunnel en courbe et la sortie de la Piscine ne freinent pas assez le modèle.
4. **Suzuka : écart de vitesse encore de 17,5 km/h.** Le temps au tour est juste, et l'adhérence de piste à 1,056 est redevenue plausible, mais la forme du profil reste imparfaite.
5. **Le freinage et la motricité ont un faible levier** (§6) : à traiter dans la conversion des points de caractéristiques en physique (phase 12).
6. **L'appui n'a aucun compromis dans le modèle** (§6) : à traiter en phase 12 (9.1).
7. **Adhérence des pistes** : à recouper avec un classement public des revêtements. Monza (0,907) paraît basse.
8. **Restent du relevé initial** :
   - climat horaire, bloqué par la limite d'Open-Meteo ;
   - 10 éditions anciennes de neutralisations à examiner.

## 10. Reproduire

```
npx vitest run tests/circuits-profil.test.ts              # 36 tests (8 nouveaux)
npx tsx tools/diagnostic-circuits.mts sortie.json [data/circuits/validation]
npx tsx tools/calage-profil.mts [paramètres | pistes]     # pistes : adhérences des pistes seules (réglage retenu)
npx tsx tools/circuits/etude-normalisation.mts sortie.json
npx tsx tools/banc-specialisation.mts sortie.json          # environ 12 s
npx tsx tools/export-apex-lab.mts export/apex-lab tous
```

**Données** (`donnees/audit/`)
- 5 circuits et validation : avant la correction d'énergie, après la correction, après le lissage ;
- normalisation sur 26 tracés ;
- banc de spécialisation.

**Suite complète** : 309 tests sur 309.
