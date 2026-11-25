# Les pièces servent-elles ? Une petite écurie peut-elle progresser ? (26/11/2026)

> Demande du porteur : « les pièces et caractéristiques DOIVENT servir à quelque chose » ; « comment progresse Cadillac si c'était un
> joueur face aux IA, et comment la rendre fun à jouer ». Mesures indicatives (D-120). Données : `donnees/`. Outils : `poids-voiture`,
> `trajectoire-ecurie` (stratégies de joueur), `npm run equilibrage`.

## 1. La voiture compte-t-elle en course ? Oui, beaucoup

3 graines × 2 saisons (120 Grands Prix), écart-type entre les partants d'un même Grand Prix (% du temps au tour) :

| Voiture | Pilote | Aléa de course | Forme |
| --- | --- | --- | --- |
| **0,65** | 0,23 | 0,31 | 0,02 |

La voiture la plus rapide du circuit gagne 69 % des courses ; corrélation rang de la voiture ↔ arrivée 0,81.

## 2. Une nouvelle pièce compte-t-elle ? Trop peu — défaut confirmé

Gain moyen d'une pièce montée : **0,11 point = 0,03 % du temps au tour (≈ 0,03 s)**, soit dix fois moins que l'aléa d'une seule course.
Une écurie monte une dizaine de pièces par an (≈ +1,1 point par saison au total). Le joueur améliore sa voiture **sans le sentir**.

Cause : au départ, chaque écurie est collée à sa frontière (marge de 1 point : son savoir ne lui permet pas mieux que sa voiture), et un
projet ne comble que 12 % de l'écart. **Baisser les notes de départ ne changerait rien** : le savoir de départ est calculé à partir des
pièces, la marge reste de 1 point.

| Variante (3 graines × 2 saisons) | Gain moyen d'une pièce | 90e centile | Progression de la grille / saison |
| --- | --- | --- | --- |
| Actuelle | 0,11 point (0,03 %) | 0,21 | +1,11 |
| A : marge de départ 3,5 (« première année de règlement ») | 0,16 (0,04 %) | 0,31 | +1,55 |
| B : progression par projet 0,30 (au lieu de 0,12) | 0,16 (0,04 %) | 0,29 | +1,51 |
| A + B | **0,24 (0,07 %)** | **0,49 (0,14 %)** | +2,09 |

### Mais A + B dégrade l'équilibre (30 saisons, 10 graines)

| Indicateur | 12c (mesure du rapport) | Référence corrigée (bugs D-176) | A + B |
| --- | --- | --- | --- |
| Champions constructeurs différents | 6,8 | 6,5 | 6,4 |
| Séries avec 5 titres consécutifs ou plus | 60 % | 60 % | **90 %** ✗ |
| Plus longue série de titres | 5,3 | 6,5 | 5,9 |
| Dominations (≥ 120 points) | 9 % | 10 % | **13 %** ✗ |
| Titre ouvert avant la dernière manche | 34 % | 29 % | 26 % ✗ |
| Dernière écurie qui marque | 68 % | 71 % | 63 % |
| Remontées | 28,5 | 29,0 | 27,8 |
| Écuries changeant d'étage par saison | 3,2 | 3,4 | 3,3 |
| Vainqueurs différents par saison | 7,6 | 7,8 | 7,5 |
| Écart 1re–dernière voiture | 1,02 % | 0,99 % | 1,05 % |
| Corrélation voiture ↔ points | 0,76 | 0,76 | 0,77 |
| Victoires inattendues par saison | 1,3 | 1,4 | 1,2 |
| Champions pilotes différents | 12,6 | 12,6 | 11,5 |

Des pièces plus grosses profitent d'abord aux écuries qui ont le plus d'argent : **non adopté**. Cadillac (IA) n'en profite pas (6,6e en
2036 contre 7,0) et Haas reste bloquée (9,8e en 2036).

## 3. Cadillac jouée par un joueur face aux IA

Stratégie de joueur imposée (laboratoire) : soufflerie entièrement sur la voiture ; le reste suit les règles de l'IA. 8 graines × 10 saisons.

| Saison | Points : IA | Points : joueur | Place : IA → joueur | Meilleur résultat (médiane) : IA → joueur |
| --- | --- | --- | --- | --- |
| 2028 | 5 | 11 | 9,6 → 8,6 | 9e → 8e |
| 2029 | 10 | 23 | 9,9 → 8,6 | 10e → 6e |
| 2030 | 30 | 62 | 8,8 → 7,3 | 5e → 4e |
| 2031 | 40 | 80 | 8,1 → 7,1 | 4e → 3e |
| 2034 | 84 | 120 | 8,1 → 7,0 | 5e → 3e |
| 2036 | 128 | 160 | 7,0 → 6,8 | 2e → 3e |

Un seul levier de joueur suffit à doubler les points des premières saisons : la trajectoire « points en saison 2–3, réguliers en saison 4,
podiums ensuite » est réaliste. Le joueur **plafonne ensuite vers la 7e place** : le top 5 et les victoires restent rares en 10 saisons.
Préparer le règlement suivant (60 % de recherche dès l'annonce) n'apporte rien de plus sur cette période.

## 4. Ce que je recommande (décision du porteur)

1. **Rendre les pièces sensibles sans enrichir les riches** : appliquer A + B **avec** une porte de sortie au piège de la pauvreté (sinon les
   dynasties augmentent) ; ou appliquer A seule (marge de départ : première année de règlement), plus douce, et la mesurer.
2. **Piège de la pauvreté** (Haas) : dividendes suspendus quand l'écurie décline, pilotes payants et sponsors d'opportunité pour les écuries
   en difficulté, contrats moteur moins chers pour les clients, objectifs gradués du propriétaire.
3. **Montrer au joueur ce que rapporte une pièce** : gain estimé en secondes sur les prochains circuits, avant et après le montage ; et
   l'effet de ses concepts circuit par circuit (aujourd'hui, un concept d'aileron vaut jusqu'à ±1 à 2 points selon le circuit, bien plus
   qu'une pièce : c'est le vrai choix technique, et il doit se voir).
4. Ensuite seulement, chercher le top 5 et la victoire : recrutement, architecture aux réformes, moteur.
