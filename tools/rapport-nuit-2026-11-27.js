// Rapport de nuit du 26-27/11/2026 — génération du document Word.
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType, HeadingLevel,
  LevelFormat, BorderStyle, PageOrientation, Footer, PageNumber,
} = require('docx');

const S = path.dirname(__filename);
const LARGEUR = 9906; // A4, marges de 1000
const GRIS = 'E8ECF2', ROUGE = 'FCE4E4', VERT = 'E3F4E6', JAUNE = 'FFF4D6';

const p = (texte, opts = {}) => new Paragraph({ spacing: { after: 120 }, ...opts, children: Array.isArray(texte) ? texte : [new TextRun(texte)] });
const gras = (t) => new TextRun({ text: t, bold: true });
const n = (t) => new TextRun(t);
const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const puce = (contenu) => new Paragraph({ numbering: { reference: 'puces', level: 0 }, spacing: { after: 60 }, children: Array.isArray(contenu) ? contenu : [n(contenu)] });

function tableau(entetes, lignes, largeurs, couleurs = {}) {
  const total = largeurs.reduce((a, b) => a + b, 0);
  const w = largeurs.map((x) => Math.round((x / total) * LARGEUR));
  w[w.length - 1] += LARGEUR - w.reduce((a, b) => a + b, 0);
  const bord = { style: BorderStyle.SINGLE, size: 4, color: 'B8C2CC' };
  const cellule = (texte, i, entete, fond) => new TableCell({
    width: { size: w[i], type: WidthType.DXA },
    shading: { fill: entete ? GRIS : fond ?? 'FFFFFF', type: ShadingType.CLEAR, color: 'auto' },
    margins: { top: 60, bottom: 60, left: 90, right: 90 },
    borders: { top: bord, bottom: bord, left: bord, right: bord },
    children: [new Paragraph({ children: [new TextRun({ text: String(texte), bold: entete, size: 18 })] })],
  });
  return new Table({
    width: { size: LARGEUR, type: WidthType.DXA }, columnWidths: w,
    rows: [
      new TableRow({ tableHeader: true, children: entetes.map((t, i) => cellule(t, i, true)) }),
      ...lignes.map((l, k) => new TableRow({ children: l.map((t, i) => cellule(t, i, false, couleurs[k])) })),
    ],
  });
}
const espace = () => p('');

// ---------- Données optionnelles (mesures finies après coup)
const lire = (f) => (fs.existsSync(f) && fs.statSync(f).size > 0 ? fs.readFileSync(f, 'utf8') : null);
function trajectoire(f) {
  const t = lire(f); if (!t) return null;
  return t.split('\n').filter((l) => /^\| 20\d\d/.test(l)).map((l) => l.split('|').map((x) => x.trim()).filter(Boolean));
}
const traj = {};
for (const e of ['eq_cadillac', 'eq_haas', 'eq_williams']) for (const s of ['ia', 'voiture']) traj[`${e}-${s}`] = trajectoire(path.join(S, `traj-${e}-${s}.md`));
function campagne(f) {
  const t = lire(f); if (!t) return null; const d = {};
  for (const l of t.split('\n')) { const c = l.split('|').map((x) => x.trim()); if (c.length > 4 && c[1] && /^-?[\d,]+/.test(c[2] ?? '')) d[c[1]] ??= c[2]; }
  return d;
}
const campRef = campagne(path.join(S, '../var/camp-ref.md'));
const campErr = campagne(path.join(S, '../var/camp-err.md'));
const campErrU = campagne(path.join(S, '../var/camp-errU.md'));

const enfants = [];
const add = (...x) => enfants.push(...x);

// ===================================================================== Page de titre et résumé
add(new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun('APEX Manager — rapport de nuit')] }));
add(p([n('Nuit du 26 au 27 novembre 2026. Banc des voitures, évolution sur 10, 20 et 30 saisons, partie tout IA et avec un joueur, audit technique, audit des circuits, audit financier, et surtout : des solutions.')]));
add(p([gras('Rien n’a été modifié dans le jeu cette nuit. '), n('Toutes les variantes ont été testées en laboratoire (réglages désactivés par défaut, fichiers de notes à part). Mesures indicatives (D-120) ; tous les fichiers de données sont dans le dépôt.')]));

add(h1('1. L’essentiel en une page'));
add(tableau(['Constat', 'Gravité', 'Solution proposée'], [
  ['Au départ, la même voiture (Mercédès) est la plus rapide sur les 30 circuits ; seules 3 paires de voitures sur 55 s’inversent sur au moins un circuit.', 'Majeure', 'Rendre la spécialisation payante (compromis plus marqués) et adopter des notes à identités (S1, S2).'],
  ['Deux caractéristiques sont presque inutiles : la motricité (0,04 % pour +3 points) et la vitesse de pointe hors Monza et Las Vegas ; les virages rapides et les pneus dominent.', 'Majeure', 'Recalibrer le poids des caractéristiques sur les 30 circuits (S3).'],
  ['Une voiture équilibrée bat des spécialistes : être bon partout vaut mieux qu’être excellent quelque part.', 'Majeure', 'Concepts de pièces plus marqués et circuits plus typés (S1, S3).'],
  ['Une pièce rapporte ≈ 0,03 s ; il faut 4 à 8 pièces pour gagner une place ; un mur de 0,53 s sépare le top 4 du reste.', 'Majeure (ressenti du joueur)', 'Erreurs de l’IA uniformes (S4) + retours visuels (S5) ; le mur se résorbe avec le temps.'],
  ['Les grandes écuries s’effondrent à long terme (Mercédès 7,9e en moyenne sur la 3e décennie, 42 % du temps dans les 3 dernières).', 'Majeure', 'Corriger l’IA des installations et l’entretien progressif (S6).'],
  ['L’argent compte peu (corrélation argent ↔ classement 0,14) ; la recherche dépend de la part du budget, pas du montant.', 'Moyenne', 'Recherche payée au montant, corrigée par le personnel (S7).'],
  ['L’IA ne se trompe presque jamais : un joueur ne peut pas faire mieux qu’elle (≈ ½ place gagnée sur 10 saisons).', 'Majeure (plaisir de jeu)', 'Erreurs de développement de l’IA, version douce (S4).'],
  ['La hiérarchie se mélange bien sur 30 saisons (3 à 4 champions par décennie, Cadillac 4,8e en 3e décennie).', 'Point fort', 'À garder.'],
], [52, 14, 34], { 7: VERT }));
add(espace());

// ===================================================================== 2. Banc
add(h1('2. Les 11 voitures sur les 30 circuits (banc sans hasard)'));
add(p('Temps au tour physique sur le tracé réel de chaque circuit, avant toute course. Trois jeux de notes comparés : les notes en place, tes notes du 25/11 (jamais appliquées), et des notes « à spécialités » testées cette nuit.'));
add(tableau(['Notes testées', 'Voitures qui gagnent au moins un circuit', 'Répartition des 30 circuits', 'Paires qui s’inversent (sur 55)'], [
  ['Notes en place (data/grille-2026)', '1', 'Mercédès 30', '3'],
  ['Tes notes du 25/11 (McLaren pneus 17)', '2', 'Mercédès 16, McLaren 14', '11'],
  ['Tes notes, concepts accentués', '3', 'McLaren 15, Mercédès 14, Ferrari 1', '17'],
  ['Spécialités 1 (Ferrari vitesse, Red Bull virages lents)', '3', 'McLaren 18, Mercédès 10, Ferrari 2', '13'],
  ['Spécialités 1, concepts accentués', '3', 'McLaren 21, Mercédès 7, Ferrari 2', '17'],
  ['Spécialités 2 (Red Bull virages rapides 20, Mercédès équilibrée)', '3', 'Mercédès 16, McLaren 13, Ferrari 1', '13'],
], [34, 18, 30, 18], { 0: ROUGE }));
add(espace());
add(p([gras('Lecture. '), n('Avec les notes en place, Mercédès est 1re partout et l’ordre ne change presque jamais. Tes notes du 25/11 font déjà beaucoup mieux (deux écuries se partagent les circuits). Mais Ferrari ne gagne que Monza ou Las Vegas, et Red Bull ne gagne jamais rien, quelle que soit sa spécialité. Une Mercédès équilibrée (17-18 partout) bat les spécialistes : la spécialisation ne rapporte pas assez.')]));

// ===================================================================== 3. Circuits
add(h1('3. Audit des circuits : quelle caractéristique compte ?'));
add(p('Une voiture du milieu (Haas) reçoit +3 points dans une seule caractéristique ; gain de temps au tour sur chaque circuit (en %, 1 % ≈ 0,85 s).'));
add(tableau(['Caractéristique', 'Gain moyen', 'Minimum', 'Maximum', 'Circuits où elle est la plus utile', 'Verdict'], [
  ['Virages rapides', '0,163 %', '−0,265 % (Las Vegas)', '0,419 % (Suzuka)', '18', 'Trop forte'],
  ['Gestion des pneus', '0,164 %', '0,095 %', '0,238 % (Sakhir)', '9', 'Trop forte et trop uniforme'],
  ['Efficacité aéro', '0,112 %', '0,082 %', '0,150 %', '0', 'Utile partout, décisive nulle part'],
  ['Virages lents', '0,107 %', '0,031 %', '0,207 % (Mexico)', '1', 'Trop faible'],
  ['Vitesse de pointe', '0,050 %', '−0,190 % (Sepang)', '0,281 % (Las Vegas)', '2', 'Utile sur 2 à 3 circuits seulement'],
  ['Motricité', '0,038 %', '0,014 %', '0,064 %', '0', 'Presque inutile'],
], [18, 12, 18, 18, 16, 18], { 0: JAUNE, 1: JAUNE, 3: ROUGE, 5: ROUGE }));
add(espace());
add(p([gras('Lecture. '), n('Deux caractéristiques dominent (virages rapides, pneus). La motricité est presque inutile et les virages lents comptent peu, même à Monaco ou Singapour. C’est la cause physique pour laquelle une écurie « virages lents / motricité » (Red Bull dans nos essais) ne gagne jamais.')]));

// ===================================================================== 4. Technique
add(h1('4. Audit technique : les pièces et la spécialisation'));
add(h2('4.1 Ce que vaut une pièce'));
add(tableau(['Mesure', 'Valeur'], [
  ['Gain moyen d’une pièce montée', '≈ 0,03 s par tour (0,030 %)'],
  ['10 % meilleures pièces', '≈ 0,06 s'],
  ['Pièces montées par écurie et par an', '7,6 en moyenne (Cadillac 12, Mercédès 3)'],
  ['Durée d’un projet (décision → pièce sur la voiture)', '7 semaines (6 à 10)'],
  ['Écart entre deux voitures voisines au milieu de grille', '0,06 à 0,19 s'],
  ['Mur entre le 4e et le 5e', '0,53 s (≈ 18 pièces)'],
  ['Progression de toute la grille par saison', '≈ 0,25 s (et un gros saut d’hiver)'],
], [55, 45]));
add(espace());
add(h2('4.2 Pousser une seule caractéristique au maximum (20)'));
add(tableau(['Voiture', 'Rang moyen au départ', 'Meilleure spécialité', 'Rang moyen', 'Circuits dans le top 5', 'Top 3'], [
  ['Haas (8e)', '8,0', 'Virages rapides ou pneus', '5,2', '24 à 25 sur 30', '0'],
  ['Haas (8e)', '8,0', 'Virages lents', '5,7', '9 (Mexico, Monaco, Singapour…)', '0'],
  ['Haas (8e)', '8,0', 'Vitesse de pointe ou motricité', '7,0', '0', '0'],
  ['Cadillac (11e)', '10,9', 'Virages rapides', '7,2', '0', '0'],
  ['Williams (5e)', '5,0', 'Pneus', '4,8', '30', '1 (meilleur rang 2)'],
], [16, 14, 24, 12, 22, 12]));
add(espace());
add(p([gras('Réponse à ta question. '), n('Oui, on peut devenir vraiment bon dans une caractéristique et aller chercher des top 5, mais seulement si elle compte (virages rapides, pneus) et seulement depuis le milieu de grille. Les virages lents donnent des top 5 sur 9 circuits lents ; la motricité et la vitesse de pointe ne servent presque à rien. Personne n’atteint le top 3 par la seule spécialisation : le mur du top 4 tient.')]));

// ===================================================================== 5. Évolution IA
add(h1('5. Évolution sur 10, 20 et 30 saisons (tout IA)'));
add(p('10 parties de 30 saisons, notes en place, levier A actif (code actuel).'));
const evo = lire(path.join(S, 'evolution-ia.md'));
if (evo) {
  const L = evo.split('\n').filter((l) => /^\| [a-z]+ \|/.test(l)).map((l) => l.split('|').map((x) => x.trim()).filter(Boolean));
  add(tableau(['Écurie', 'Place moy. 1–10', '11–20', '21–30', 'Top 4 (1–10 / 11–20 / 21–30)', '3 dernières (idem)'], L, [14, 12, 10, 10, 27, 27]));
  add(espace());
  const M = evo.split('\n').filter((l) => /^\| [A-ZÉ]/.test(l) && !l.startsWith('| Écurie') && !l.startsWith('| Indicateur')).map((l) => l.split('|').map((x) => x.trim()).filter(Boolean));
  add(tableau(['Mobilité', '1–10', '11–20', '21–30'], M, [55, 15, 15, 15]));
}
add(espace());
add(p([gras('Lecture. '), n('La hiérarchie de départ se mélange bien : 3,3 puis 3,8 puis 4,4 champions différents par décennie, la grille se resserre (1,1 % → 0,8 %), Cadillac finit 4,8e en moyenne sur la 3e décennie. Défaut : les grandes écuries s’effondrent (Mercédès 3,6 → 5,9 → 7,9 ; McLaren 2,8 → 7,4 en fin de période), à cause des coûts sous le plafond (voir §7). Le plafond technique est atteint à 83-84 % dès la 2e décennie : on progresse beaucoup moins ensuite.')]));

// ===================================================================== 6. Joueur
add(h1('6. Et avec un vrai joueur à la tête d’une écurie ?'));
add(h2('6.1 Cadillac sur 10 saisons (8 parties) : IA contre stratégie de joueur'));
const tc = traj['eq_cadillac-ia'], tv = traj['eq_cadillac-voiture'];
if (tc && tv) add(tableau(['Saison', 'Place (IA)', 'Place (joueur : soufflerie sur la voiture)', 'Points (IA → joueur)'], tc.map((l, i) => [l[0], l[1].split(';')[0], tv[i][1].split(';')[0], `${l[2]} → ${tv[i][2]}`]), [14, 22, 40, 24]));
add(espace());
for (const e of ['eq_haas', 'eq_williams']) {
  const a = traj[`${e}-ia`], b = traj[`${e}-voiture`];
  if (a && b) { add(h2(`${e === 'eq_haas' ? '6.2 Haas' : '6.3 Williams'} sur 10 saisons`)); add(tableau(['Saison', 'Place (IA)', 'Place (joueur)', 'Points (IA → joueur)'], a.map((l, i) => [l[0], l[1].split(';')[0], b[i][1].split(';')[0], `${l[2]} → ${b[i][2]}`]), [14, 22, 40, 24])); add(espace()); }
}
add(h2('6.4 Le joueur qui décide bien face à une IA qui se trompe (prototype)'));
add(tableau(['Cadillac sur 2 saisons (rang de la voiture, 3 parties)', 'Partie 1', 'Partie 2', 'Partie 3'], [
  ['IA actuelle (presque sans erreur)', '11e → 9,6e', '11e → 8,8e', '11e → 10,8e'],
  ['Erreurs fortes liées à la compétence : Cadillac gérée par l’IA', '11e → 10,6e', '11e → 11e', '11e → 11e'],
  ['Erreurs fortes liées à la compétence : Cadillac gérée sans erreur', '11e → 7,4e', '11e → 8,4e', '11e → 10,6e'],
  ['Erreurs uniformes : Cadillac gérée par l’IA', '11e → 9,8e', '11e → 10,4e', '11e → 11e'],
  ['Erreurs uniformes : Cadillac gérée sans erreur', '11e → 6,2e', '11e → 8,2e', '11e → 10,6e'],
], [46, 18, 18, 18], { 2: VERT, 4: VERT }));
add(espace());
const ligneCamp = (k) => [k, campRef?.[k] ?? '—', campErr?.[k] ?? '—', campErrU?.[k] ?? 'en cours'];
const kCamp = ['Séries de 30 saisons avec 5 titres constructeurs consécutifs ou plus', 'Champions constructeurs différents sur 30 saisons', 'Dominations (≥ 120 points d’écart)', 'Titre encore ouvert avant la dernière manche (définition exacte)', 'Saisons où la dernière écurie marque au moins 1 point', 'Remontées (+3 places ou plus d’une saison à l’autre)'];
add(p('Équilibre entre IA (10 parties de 30 saisons) :'));
add(tableau(['Indicateur', 'Référence', 'Erreurs liées à la compétence', 'Erreurs uniformes'], kCamp.map(ligneCamp), [46, 18, 18, 18]));
add(espace());
add(p([gras('Lecture. '), n('Aujourd’hui un joueur ne gagne qu’environ une demi-place sur 10 saisons par rapport à l’IA (même règle de développement, IA presque parfaite). Avec une IA qui se trompe, un joueur qui décide bien gagne 1 à 2 places par saison : c’est l’objectif. Mais l’équilibre entre IA n’est pas encore bon : les erreurs liées à la compétence creusent la hiérarchie (les petites écuries ont les équipes les moins bonnes) ; les erreurs uniformes donnent plus de remontées (31 → 35), un titre plus ouvert (31 → 35 %) et moins d’écrasements (14 → 10 %), mais plus de dynasties (60 → 80 %) et Haas plus souvent en bas (53 → 61 %). Piste suivante : des erreurs deux fois plus douces, et un peu plus fréquentes chez l’écurie qui domine (complaisance du succès).')]));

// ===================================================================== 7. Finances
add(h1('7. Finances : l’argent sert-il à quelque chose ?'));
add(tableau(['Mesure (moyenne par an)', 'Grandes (Mercédès, Ferrari, McLaren)', 'Milieu', 'Haas'], [
  ['Recettes', '530 à 620 M€', '320 à 410 M€', '250 M€'],
  ['Dépenses sous le plafond (plafond 215)', '≈ 205 M€ (au plafond)', '180 à 190 M€', '140 à 150 M€'],
  ['Développement payé', '40 à 55 M€', '75 à 90 M€', '50 à 60 M€'],
  ['Dividendes versés', '180 à 280 M€', '60 à 100 M€', '20 à 35 M€'],
  ['Corrélation argent dépensé ↔ classement', '0,14 (faible)', '', ''],
], [34, 26, 20, 20]));
add(espace());
add(h2('7.1 Pourquoi les grandes écuries s’effondrent à long terme'));
add(tableau(['Mercédès', '2027–2036', '2037–2046', '2047–2056'], [
  ['Place moyenne', '4,7', '5,2', '7,9'],
  ['Entretien des installations (sous le plafond)', '48 M€', '56 M€', '61 M€'],
  ['Personnel des départements', '84 M€', '84 M€', '84 M€'],
  ['Développement payé', '41 M€', '34 M€', '27 M€'],
  ['Dividendes', '229 M€', '199 M€', '202 M€'],
], [40, 20, 20, 20], { 3: ROUGE }));
add(espace());
add(p([gras('Cause. '), n('L’IA agrandit ses installations avec l’argent hors plafond (gratuit pour elle), mais leur entretien, désormais au carré du niveau, se paie sous le plafond : chaque niveau gagné retire de l’argent aux pièces. Le personnel est trop nombreux pour le plafond et l’IA ne le réduit jamais hors crise. Résultat : 27 M€ de développement pour une écurie qui encaisse 500 M€.')]));
add(h2('7.2 Leviers, limites et forces'));
add(tableau(['', 'Constat'], [
  ['Leviers réels', 'Recrutement et réduction des pôles (vitesse des projets), essais renforcés, installations, budget de développement, prévisions.'],
  ['Limites', 'Le plafond bloque les grandes écuries (normal) ; la recherche ne dépend pas du montant payé (défaut) ; l’apport du propriétaire va-et-vient avec les dividendes (136 M€ apportés, ≈ 240 M€ repris chez Mercédès) ; moteurs gratuits.'],
  ['Forces', 'Comptabilité saine, plafond respecté, mêmes règles pour tous, prévisions justes (6 M€ d’écart en octobre), piège de la pauvreté atténué (investisseur, objectifs).'],
], [20, 80]));

// ===================================================================== 8. Forces / défauts
add(h1('8. Points forts, défauts et limites'));
add(tableau(['Points forts', 'Défauts et limites'], [
  ['Physique réelle sur 30 tracés, temps au tour crédibles', 'Une seule voiture rapide partout au départ ; circuits peu différenciants'],
  ['Hiérarchie qui se mélange sur 30 saisons, nouvelles ères', 'Deux caractéristiques presque inutiles (motricité, vitesse de pointe hors 3 circuits)'],
  ['Économie saine, plafond, mêmes règles joueur et IA', 'Les grandes écuries s’effondrent à long terme (coûts sous le plafond)'],
  ['Titre ouvert 31 %, 7,6 vainqueurs différents par saison', 'Dynasties encore trop fréquentes (60 % de séries de 5 titres, objectif ≤ 25 %)'],
  ['Prévisions financières fiables', 'Pièces peu sensibles (0,03 s) et joueur qui ne peut pas faire mieux que l’IA'],
  ['Outils de mesure complets (banc, trajectoires, campagnes)', 'Haas reste souvent dans le bas (53 %) : le manque d’argent'],
], [50, 50]));

// ===================================================================== 9. Solutions
add(h1('9. Les solutions, par ordre de priorité'));
add(tableau(['N°', 'Solution', 'Ce que ça corrige', 'Risque', 'Effort'], [
  ['S1', 'Spécialisation payante : concepts de pièces plus marqués (conversion des notes ×1,6 à ×2,4, déjà testé : 17 à 21 inversions au lieu de 11) et compromis qui gagnent plus qu’ils ne perdent sur les circuits typés.', 'Une voiture ne gagne plus partout ; chaque écurie a ses circuits.', 'Recalage de la physique ; à mesurer sur l’équilibre.', 'Moyen'],
  ['S2', 'Adopter des notes à identités (tes notes du 25/11 ou les « spécialités »), avec une vraie force propre pour chacune des 4 grandes.', '3 à 4 écuries différentes rapides selon les circuits.', 'Choix d’identités à valider avec toi.', 'Faible'],
  ['S3', 'Recalibrer le poids des caractéristiques : motricité et virages lents plus décisifs (Monaco, Singapour, Hongrie, Mexico), pneus moins uniformes, vitesse de pointe sur 5 à 6 circuits.', 'Chaque caractéristique a ses circuits ; Red Bull ou une autre spécialiste peut gagner.', 'Recalage du profil de vitesse (fait déjà une fois en 12c).', 'Moyen'],
  ['S4', 'Erreurs de développement de l’IA (prototype prêt) : version plus douce, à mesurer avant activation ; option « complaisance » chez l’écurie dominante.', 'Le joueur qui décide bien gagne 1 à 2 places par saison.', 'Version uniforme mesurée : dynasties 60 → 80 % ; à adoucir.', 'Faible'],
  ['S5', 'Retours visuels : gain de chaque pièce en secondes et en places, suivi de saison, « sans vos pièces vous auriez fini 11e ».', 'Le joueur ressent ses évolutions.', 'Aucun.', 'Faible'],
  ['S6', 'IA des installations et du personnel : ne pas agrandir si l’entretien prend trop sous le plafond ; réduire le personnel quand le développement passe sous un seuil.', 'Fin de l’effondrement des grandes écuries.', 'Faible.', 'Faible'],
  ['S7', 'Recherche payée au montant (avec le personnel technique compté), puis apport du propriétaire selon le besoin.', 'L’argent sert vraiment ; fin du va-et-vient propriétaire ↔ dividendes.', 'R1 seul pénalisait les petits budgets : version corrigée à mesurer.', 'Moyen'],
], [6, 40, 22, 20, 12]));
add(espace());
add(p([gras('Ordre conseillé. '), n('S6 et S5 d’abord (corrections sans risque), puis S4 si la mesure d’équilibre est bonne, puis S1 + S2 + S3 ensemble (c’est un seul chantier : donner une identité aux voitures et des circuits qui la récompensent), enfin S7.')]));

const doc = new Document({
  creator: 'Claude Code', title: 'APEX Manager — rapport de nuit',
  styles: {
    default: { document: { run: { font: 'Calibri', size: 21 } } },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal', run: { font: 'Calibri', size: 40, bold: true, color: '1F3A5F' }, paragraph: { spacing: { before: 0, after: 200 } } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: 'Calibri', size: 30, bold: true, color: '1F3A5F' }, paragraph: { spacing: { before: 320, after: 140 }, keepNext: true, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: 'Calibri', size: 25, bold: true, color: '2E5C8A' }, paragraph: { spacing: { before: 220, after: 100 }, keepNext: true, outlineLevel: 1 } },
    ],
  },
  numbering: { config: [{ reference: 'puces', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: ['Page ', PageNumber.CURRENT, ' / ', PageNumber.TOTAL_PAGES], size: 16, color: '7A8794' })] })] }) },
    children: enfants,
  }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(process.argv[2] ?? path.join(S, 'rapport-nuit.docx'), b); console.log('ok'); });
