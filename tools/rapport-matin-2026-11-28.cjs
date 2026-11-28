// Rapport du matin du 28/11/2026 (nuit en carte blanche) — génération du document Word.
const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, HeadingLevel, LevelFormat, BorderStyle, Footer, AlignmentType, PageNumber } = require('docx');

const R = path.join(__dirname, '..', 'docs', 'rapports');
const SORTIE = path.join(R, 'nuit-2026-11-28', 'rapport-matin.docx');
const LARGEUR = 9906, GRIS = 'E8ECF2', ROUGE = 'FCE4E4', VERT = 'E3F4E6';
const n = (t) => new TextRun(t), gras = (t) => new TextRun({ text: t, bold: true });
const p = (c, o = {}) => new Paragraph({ spacing: { after: 120 }, ...o, children: Array.isArray(c) ? c : [n(c)] });
const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const puce = (c) => new Paragraph({ numbering: { reference: 'puces', level: 0 }, spacing: { after: 60 }, children: Array.isArray(c) ? c : [n(c)] });
function tableau(entetes, lignes, largeurs, couleurs = {}) {
  const tot = largeurs.reduce((a, b) => a + b, 0);
  const w = largeurs.map((x) => Math.round((x / tot) * LARGEUR)); w[w.length - 1] += LARGEUR - w.reduce((a, b) => a + b, 0);
  const b = { style: BorderStyle.SINGLE, size: 4, color: 'B8C2CC' };
  const cel = (t, i, e, f) => new TableCell({ width: { size: w[i], type: WidthType.DXA }, shading: { fill: e ? GRIS : f ?? 'FFFFFF', type: ShadingType.CLEAR, color: 'auto' }, margins: { top: 50, bottom: 50, left: 80, right: 80 }, borders: { top: b, bottom: b, left: b, right: b }, children: [new Paragraph({ children: [new TextRun({ text: String(t), bold: e, size: 17 })] })] });
  return new Table({ width: { size: LARGEUR, type: WidthType.DXA }, columnWidths: w, rows: [new TableRow({ tableHeader: true, children: entetes.map((t, i) => cel(t, i, true)) }), ...lignes.map((l, k) => new TableRow({ children: l.map((t, i) => cel(t, i, false, couleurs[k])) }))] });
}
// Tableau complet (comparaison.md à N colonnes) lu tel quel : tous les indicateurs (D-076).
function complet(fichier) {
  const l = fs.readFileSync(fichier, 'utf8').split('\n').filter((x) => x.startsWith('| ') && !x.startsWith('| ---'));
  const c = l.map((x) => x.split('|').slice(1, -1).map((y) => y.trim()));
  return tableau(c[0], c.slice(1), [8, ...c[0].slice(1).map(() => 2)]);
}
const ligne = (fichier, debut) => (fs.readFileSync(fichier, 'utf8').split('\n').find((x) => x.startsWith(`| ${debut}`)) ?? '').split('|').slice(2, -1).map((y) => y.trim());

const c = [];
const add = (...x) => c.push(...x);
add(new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun('Rapport du matin — nuit du 27 au 28 novembre')] }));
add(p('APEX Manager. Nuit en carte blanche (« allez go coder tout ça, on fait le point demain, tu as carte blanche, on ajuste après »). Tout est codé, testé, poussé sur main et en ligne. Mesures indicatives (D-120), 20 parties de 30 saisons, mêmes graines que la référence de chaque étape.'));

add(h1('1. En bref'));
add(puce([gras('Activé : '), n('anti-domination aux réformes (options 1, 2 et 3), économie v2 (entretien des installations hors plafond, plafond 185 M€, recettes des grandes resserrées), phase 13a (course tour par tour avec pneus, carburant, batterie, consignes et arrêts), marché des pilotes ouvert toute l’année.')]));
add(puce([gras('Ce qui marche : '), n('l’argent des grandes sert enfin (installations) et ne dort plus en banque ; aucune écurie ne manque d’argent pour ses pilotes ; les courses ont des stratégies et des arrêts ; aucune consigne ne domine ; l’équipe des stands compte.')]));
add(puce([gras('Ce qui ne va pas encore : '), n('les dominations remontent avec la 13a (12 → 17 %), la dernière écurie marque moins souvent (83 → 73 %) ; le plafond de 185 M€ n’est plus atteint par personne ; les dynasties restent au-dessus de l’objectif ; elles tiennent surtout aux pilotes.')]));

add(h1('2. Anti-domination aux réformes (D-190)'));
add(tableau(['Indicateur', 'Sans', 'Options 1+2', 'Options 1+2+3'], [
  ['Dynasties (5 titres de suite ou plus)', '60 %', '50 %', '35 %'], ['Plus longue série (moyenne)', '5,0', '4,6', '4,2'], ['Champions différents (30 saisons)', '8,5', '8,4', '9,2'],
  ['Dernière écurie qui marque', '83 %', '81 %', '77 %'], ['Dominant : garde le titre l’année de la réforme', '59 %', '—', '65 %'], ['Dominant : rang de sa voiture en début de saison de réforme', '5,8', '—', '8,7'],
], [6, 2, 2, 2]));
add(p([gras('Lecture : '), n('le malus touche bien la voiture (9e en début de saison), mais le dominant garde quand même son titre : les dynasties tiennent surtout aux pilotes. Prochain levier : le marché des pilotes.')]));

add(h1('3. Économie v2 (D-191)'));
add(complet(path.join(R, 'economie-v2', 'controle-185.md')));
add(p([gras('Finances (moyennes par an) : '), n('recettes des grandes 378–449 M€ ; dividendes 72–125 M€ ; trésorerie 165–279 M€ ; entretien payé avec l’argent de l’écurie 36–45 M€ (grandes) et 15–25 M€ (autres) ; aucune trésorerie négative. ')]));
add(p([gras('Constat nouveau : '), n('sans l’entretien, les dépenses sous le plafond ne sont plus que de 141 à 166 M€ pour 185. Le plafond n’est plus le frein : c’est la capacité (ingénieurs, projets en parallèle) qui limite la voiture. À trancher : plafond plus bas (160–165), ou capacité plus chère.')]));

add(h1('4. Phase 13a : la course tour par tour (D-192)'));
add(p('Chaque Grand Prix se court tour par tour (40 à 80 tours) : trois composés secs et un composé pluie, usure et falaise, carburant, batterie, quatre consignes par pilote (fiche du pilote), stratégie choisie par l’ingénieur sur une estimation, arrêts selon l’équipe des stands. Le tableau de bord affiche la stratégie et les arrêts de vos pilotes. Pas encore de dépassements localisés (13b).'));
add(complet(path.join(R, 'phase-13a', 'comparaison.md')));
add(h2('Bancs des consignes (une écurie change de consigne, les autres neutres ; 8 saisons)'));
const banc = (f) => fs.readFileSync(f, 'utf8').split('\n').filter((x) => x.startsWith('| ') && !x.startsWith('| ---')).map((x) => x.split('|').slice(1, -1).map((y) => y.trim()));
const ba = banc(path.join(R, 'phase-13a', 'banc3-alpine.md')), bm = banc(path.join(R, 'phase-13a', 'banc3-mclaren.md'));
add(tableau(['Consigne', 'Alpine : points', 'Alpine : place moy.', 'McLaren : points', 'McLaren : place moy.', 'Abandons (McLaren)'], ba.slice(1).map((l, i) => [l[0], l[1], l[2], bm[i + 1][1], bm[i + 1][2], bm[i + 1][3]]), [4, 2, 2, 2, 2, 2]));
add(p('Deux réglages corrigés cette nuit (pneus conservateurs puis conduite agressive dominaient). Aujourd’hui aucune consigne ne domine ; les extrêmes (tout agressif, tout conservateur) sont nettement moins bons. Le neutre reste légèrement meilleur en moyenne : les consignes deviendront utiles selon la situation avec 13b et 13c.'));

add(h1('5. Marché des pilotes ouvert toute l’année (D-193)'));
add(p('Offres possibles toute l’année pour la saison suivante ; réponses tous les 2 semaines ; l’IA reste surtout active de fin juin à fin novembre ; une offre sans accord expire au bout de 8 semaines. Pas encore fait : remplacement d’un titulaire en cours de saison.'));
const fm = path.join(R, 'nuit-2026-11-28', 'mercato-comparaison.md');
if (fs.existsSync(fm)) add(complet(fm));
add(p([gras('Lecture : '), n('aucun changement mesurable sur la grille (l\u2019IA garde son pic d\u2019activité de l\u2019été et de l\u2019automne) : le changement sert surtout au joueur, qui peut négocier quand il veut. C\u2019est attendu ; le levier sur les dynasties viendra de la fiche « marché des pilotes ».')]));

add(h1('6. Les défavorables, sans détour'));
add(puce('Dominations entre écuries 12 → 17 % et dernière écurie qui marque 83 → 73 % avec la 13a : les pneus et les arrêts creusent un peu le haut de grille.'));
add(puce('Dynasties : 35 % → 55 % avec l’économie v2, puis 45 % avec la 13a ; objectif 0–25 % non atteint. Cet indicateur bouge beaucoup d’une mesure à l’autre (une série sur 20 = 5 %).'));
add(puce('Le plafond de 185 M€ n’est plus atteint par personne : il ne freine plus les grandes.'));
add(puce('Haas reste en bas (place moyenne 7,6) : son problème est le manque de recettes.'));
add(puce('Un test de temps de calcul échoue quand la machine est chargée par les campagnes (sans lien avec le code) ; il passe à vide.'));

add(h1('7. À décider ensemble'));
add(puce('Plafond : on le baisse (160–165) pour qu’il redevienne le frein des grandes ?'));
add(puce('Fiche « marché des pilotes » : casser le cercle « je gagne, j’attire les meilleurs pilotes » (pilotes qui veulent du changement, stars hors de prix, concurrence) ?'));
add(puce('Suite de la phase 13 : 13b (positions sur la piste, dépassements, vue 2D schématique) ?'));
add(puce('Relire les choix faits en carte blanche (D-192, D-193) et la conception 13a.'));

const doc = new Document({
  creator: 'APEX Manager', title: 'Rapport du matin 28/11',
  styles: { default: { document: { run: { font: 'Calibri', size: 21 } } }, paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 30, bold: true, color: '1F3A5F' }, paragraph: { spacing: { before: 300, after: 140 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 25, bold: true, color: '2E5C8A' }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } }] },
  numbering: { config: [{ reference: 'puces', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] }] },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: ['Page ', PageNumber.CURRENT] })] })] }) }, children: c }],
});
fs.mkdirSync(path.dirname(SORTIE), { recursive: true });
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(SORTIE, b); console.log('écrit'); });
