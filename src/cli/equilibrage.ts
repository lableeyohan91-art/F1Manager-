/**
 * Rapport d'équilibrage : N graines × S saisons, indicateurs comparés aux objectifs statistiques (D-040).
 *
 * Exemples :
 *   npm run equilibrage -- --graines 100 --saisons 10 --sortie docs/rapports/equilibrage.md
 *   npm run equilibrage -- --alea 0.2                      (réglage d'expérience : aléa de course)
 *   npm run equilibrage -- --json sortie.json              (moyennes au format JSON, pour servir de référence)
 *   npm run equilibrage -- --reference docs/rapports/reference/p3.json   (ajoute une colonne « écart à la référence »)
 *   npm run equilibrage -- --balayage-alea 0.15,0.22,0.3,0.4 --sortie rapport.md   (compare plusieurs niveaux d'aléa)
 *   npm run equilibrage -- --param course.ecartPiloteParPoint=0.2,course.aleaSigma=0.25   (réglages d'expérience quelconques)
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { performance } from 'node:perf_hooks';
import {
  creerScenarioGrille2026, indicateursSaison, indicateursSerie, saisonDe,
  type IndicateursSaison, type IndicateursSerie, type MesurePositions, type Personne, type Saison,
} from '../engine';
import { lireDonneesGrille2026 } from '../platform/node/donnees';
import { lireArguments } from './arguments';

const args = lireArguments(process.argv.slice(2));
const nGraines = Number(args['graines'] ?? 100);
const nSaisons = Number(args['saisons'] ?? 10);
const sc = creerScenarioGrille2026(lireDonneesGrille2026());

interface Campagne {
  parametres: Record<string, number>;
  saisons: IndicateursSaison[];
  series: Omit<IndicateursSerie, 'saisons'>[];
  chroniqueExemple: string[];
  duree: number;
}

/** Simule toutes les graines ; les indicateurs de chaque saison sont pris juste après sa fin (explications encore présentes). */
function campagne(parametres: Record<string, number>): Campagne {
  const t0 = performance.now();
  const saisons: IndicateursSaison[] = [];
  const series: Campagne['series'] = [];
  let chroniqueExemple: string[] = [];
  for (let g = 1; g <= nGraines; g++) {
    const m = sc.creerMonde(g);
    m.parametres = { ...parametres };
    const moteur = sc.creerMoteur();
    for (let i = 0; i < nSaisons; i++) {
      const annee = m.date.annee;
      while (m.date.annee === annee) moteur.avancerUneSemaine(m);
      const s = saisonDe(m, annee);
      if (s?.termine) saisons.push(indicateursSaison(m, s));
    }
    const { saisons: _, ...serie } = indicateursSerie(m);
    series.push(serie);
    if (g === 1) {
      const nom = (id: string) => { const p = m.tables['personnes']![id] as unknown as Personne; return `${p.prenom} ${p.nom}`; };
      chroniqueExemple = (Object.values(m.tables['saisons']!) as unknown as Saison[])
        .sort((a, b) => a.annee - b.annee)
        .flatMap((s) => [`**${s.annee}** — champion : ${nom(s.pilotes[0]!.pilote)}`, ...s.chronique.map((l) => `- ${l}`), '']);
    }
  }
  return { parametres, saisons, series, chroniqueExemple, duree: (performance.now() - t0) / 1000 };
}

const quantile = (v: number[], q: number) => { const t = [...v].sort((a, b) => a - b); return t[Math.min(t.length - 1, Math.floor(q * t.length))] ?? 0; };
const moy = (v: number[]) => v.reduce((a, b) => a + b, 0) / (v.length || 1);
const f = (x: number, d = 1) => x.toLocaleString('fr-FR', { maximumFractionDigits: d, minimumFractionDigits: d });
const pct = (x: number) => `${f(100 * x, 0)} %`;

interface Ligne { cle: string; nom: string; valeurs: number[]; cible?: [number, number]; format: (x: number) => string }

function lignes(c: Campagne): { saison: Ligne[]; serie: Ligne[]; proportions: Ligne[]; positions: Ligne[] } {
  const ps = (k: keyof IndicateursSaison) => c.saisons.map((s) => Number(s[k]));
  const co = (k: keyof NonNullable<IndicateursSaison['coequipiers']>) => c.saisons.filter((s) => s.coequipiers).map((s) => s.coequipiers![k]);
  const oui = (k: keyof IndicateursSaison) => c.saisons.map((s) => (s[k] ? 1 : 0));
  // D-113 : compétitivité à toutes les positions.
  const pos = (qui: 'pilotes' | 'constructeurs', lire: (m: MesurePositions) => number) => c.saisons.filter((s) => s.positions).map((s) => lire(s.positions![qui]));
  const lignesPositions: Ligne[] = [];
  for (const [qui, lib, p] of [['pilotes', 'Pilotes', 'P'], ['constructeurs', 'Constructeurs', 'C']] as const) {
    const L = (cle: string, nom: string, lire: (m: MesurePositions) => number, format: (x: number) => string) => lignesPositions.push({ cle: `pos${p}_${cle}`, nom: `${lib} : ${nom}`, valeurs: pos(qui, lire), format });
    L('mob25', 'mobilité — corrélation classement à 25 % ↔ final', (m) => m.mobilite25, (x) => f(x, 2));
    L('mob50', 'mobilité — corrélation classement à 50 % ↔ final', (m) => m.mobilite50, (x) => f(x, 2));
    L('mob75', 'mobilité — corrélation classement à 75 % ↔ final', (m) => m.mobilite75, (x) => f(x, 2));
    L('depl', 'déplacement moyen entre la mi-saison et la fin (places)', (m) => m.deplacementSecondeMoitie, (x) => f(x, 2));
    L('gain2', 'part gagnant ou perdant ≥ 2 places en seconde moitié', (m) => m.partGainPerte2, pct);
    L('chgt', 'changements de position par concurrent sur la saison', (m) => m.changementsParConcurrent, (x) => f(x, 1));
    L('ecH', 'écart moyen entre voisins (points) — haut', (m) => m.ecartVoisins.haut, (x) => f(x, 1));
    L('ecM', 'écart moyen entre voisins (points) — milieu', (m) => m.ecartVoisins.milieu, (x) => f(x, 1));
    L('ecB', 'écart moyen entre voisins (points) — bas', (m) => m.ecartVoisins.bas, (x) => f(x, 1));
    L('dispM', 'frontières mathématiquement disputées à 3 manches de la fin', (m) => m.disputeesMath.tout, pct);
    L('dispR', 'frontières raisonnablement disputées à 3 manches — toutes', (m) => m.disputeesRaisonnables.tout, pct);
    L('dispRH', 'frontières raisonnablement disputées — haut', (m) => m.disputeesRaisonnables.haut, pct);
    L('dispRM', 'frontières raisonnablement disputées — milieu', (m) => m.disputeesRaisonnables.milieu, pct);
    L('dispRB', 'frontières raisonnablement disputées — bas', (m) => m.disputeesRaisonnables.bas, pct);
    L('acq', 'positions déjà acquises à 3 manches de la fin', (m) => m.acquisesPrematurement.tout, pct);
    L('acqH', 'positions déjà acquises — haut', (m) => m.acquisesPrematurement.haut, pct);
    L('acqM', 'positions déjà acquises — milieu', (m) => m.acquisesPrematurement.milieu, pct);
    L('acqB', 'positions déjà acquises — bas', (m) => m.acquisesPrematurement.bas, pct);
    L('stDisp', 'positions stables mais disputées (voisin à moins d’une victoire)', (m) => m.stablesDisputees, pct);
    L('isol', 'positions isolées (voisins à plus de 3 victoires)', (m) => m.isolees, pct);
  }
  return {
    positions: lignesPositions,
    saison: [
      { cle: 'vainqueurs', nom: 'Vainqueurs de Grand Prix différents par saison', valeurs: ps('vainqueursDifferents'), cible: [3, 8], format: (x) => f(x, 1) },
      { cle: 'ecuriesVictorieuses', nom: 'Écuries victorieuses par saison', valeurs: ps('ecuriesVictorieuses'), cible: [2, 5], format: (x) => f(x, 1) },
      { cle: 'partDominante', nom: "Part des victoires de l'écurie dominante", valeurs: ps('partVictoiresDominante'), cible: [0.35, 0.8], format: pct },
      { cle: 'abandons', nom: 'Taux d’abandon par départ', valeurs: ps('tauxAbandon'), cible: [0.05, 0.15], format: pct },
      { cle: 'ecartPerf', nom: 'Écart de performance 1re–dernière voiture (% temps au tour)', valeurs: ps('ecartPerfPct'), cible: [1.5, 4], format: (x) => f(x, 2) },
      { cle: 'ecartP1P2', nom: 'Écart de points entre les deux premiers', valeurs: ps('ecartP1P2'), format: (x) => f(x, 0) },
      { cle: 'leaders', nom: 'Changements de leader du championnat', valeurs: ps('changementsLeader'), format: (x) => f(x, 1) },
      { cle: 'doubles', nom: 'Doublés par saison (toutes écuries)', valeurs: ps('doublesTotal'), format: (x) => f(x, 1) },
      { cle: 'correlation', nom: 'Corrélation voiture ↔ points constructeurs (Spearman)', valeurs: ps('correlationVoiturePoints'), format: (x) => f(x, 2) },
      { cle: 'progression', nom: 'Plus forte progression d’une voiture dans la saison (points d’indice)', valeurs: ps('progressionMax'), format: (x) => f(x, 2) },
      { cle: 'inattendus', nom: 'Victoires inattendues par saison', valeurs: ps('resultatsInattendus'), format: (x) => f(x, 1) },
      { cle: 'pluie', nom: 'Courses sous la pluie par saison', valeurs: ps('courseSousLaPluie'), format: (x) => f(x, 1) },
    ],
    serie: [
      { cle: 'champions', nom: `Champions pilotes différents sur ${nSaisons} saisons`, valeurs: c.series.map((s) => s.championsPilotesDifferents), cible: [3, 7], format: (x) => f(x, 1) },
      { cle: 'championsC', nom: `Champions constructeurs différents sur ${nSaisons} saisons`, valeurs: c.series.map((s) => s.championsConstructeursDifferents), format: (x) => f(x, 1) },
      { cle: 'serieTitres', nom: 'Plus longue série de titres constructeurs consécutifs', valeurs: c.series.map((s) => s.maxTitresConsecutifsEcurie), format: (x) => f(x, 1) },
      { cle: 'sansVictoire', nom: `Écuries sans aucune victoire sur ${nSaisons} saisons`, valeurs: c.series.map((s) => s.ecuriesSansVictoire), format: (x) => f(x, 1) },
      { cle: 'remontees', nom: 'Remontées (+3 places ou plus d’une saison à l’autre)', valeurs: c.series.map((s) => s.remontees), format: (x) => f(x, 1) },
      { cle: 'changementsEtage', nom: 'Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081)', valeurs: c.series.map((s) => s.changementsEtageParSaison), format: (x) => f(x, 1) },
      { cle: 'sansChangementEtage', nom: 'Transitions de saison sans aucun changement d’étage (D-081)', valeurs: c.series.map((s) => s.transitionsSansChangementEtage), format: (x) => pct(x) },
    ],
    proportions: [
      { cle: 'derniereMarque', nom: 'Saisons où la dernière écurie marque au moins 1 point', valeurs: oui('derniereEcurieMarque'), cible: [0.4, 0.9], format: pct },
      { cle: 'dynasties', nom: `Séries de ${nSaisons} saisons avec 5 titres constructeurs consécutifs ou plus`, valeurs: c.series.map((s) => (s.maxTitresConsecutifsEcurie >= 5 ? 1 : 0)), cible: [0, 0.25], format: pct },
      { cle: 'derniereManche', nom: 'Titre encore ouvert avant la dernière manche (définition exacte)', valeurs: oui('titreDerniereManche'), format: pct },
      { cle: 'retournement', nom: 'Retournement à la dernière manche (le leader perd le titre)', valeurs: oui('retournementDerniereManche'), format: pct },
      { cle: 'duo', nom: 'Champion et vice-champion coéquipiers', valeurs: oui('duoCoequipiers'), format: pct },
      { cle: 'lutteCoequipiers', nom: 'Lutte jusqu’à la dernière manche entre coéquipiers', valeurs: oui('lutteCoequipiers'), format: pct },
      { cle: 'lutteInter', nom: 'Lutte jusqu’à la dernière manche entre écuries différentes', valeurs: oui('lutteInterEcuries'), format: pct },
      { cle: 'serrees', nom: 'Saisons très serrées (≤ 10 points d’écart)', valeurs: c.saisons.map((s) => (s.ecartP1P2 <= 10 ? 1 : 0)), format: pct },
      { cle: 'dominations', nom: 'Dominations (≥ 120 points d’écart)', valeurs: c.saisons.map((s) => (s.ecartP1P2 >= 120 ? 1 : 0)), format: pct },
      // Coéquipiers (décomposition).
      { cle: 'coeqTotal', nom: 'Coéquipiers : écart moyen à l’arrivée (% temps au tour)', valeurs: co('moyAbsTotal'), format: (x) => f(x, 2) },
      { cle: 'coeqComp', nom: 'Coéquipiers : écart moyen dû aux compétences', valeurs: co('moyAbsCompetences'), format: (x) => f(x, 2) },
      { cle: 'coeqForme', nom: 'Coéquipiers : écart moyen dû à la forme', valeurs: co('moyAbsForme'), format: (x) => f(x, 2) },
      { cle: 'coeqAlea', nom: 'Coéquipiers : écart moyen dû à l’aléa', valeurs: co('moyAbsAlea'), format: (x) => f(x, 2) },
      { cle: 'coeqPartComp', nom: 'Coéquipiers : part de l’écart quadratique due aux compétences', valeurs: co('partCompetences'), format: pct },
      { cle: 'coeqPartForme', nom: 'Coéquipiers : part de l’écart quadratique due à la forme', valeurs: co('partForme'), format: pct },
      { cle: 'coeqPartAlea', nom: 'Coéquipiers : part de l’écart quadratique due à l’aléa', valeurs: co('partAlea'), format: pct },
    ],
  };
}

type Reference = Record<string, number>;
function moyennes(c: Campagne): Reference {
  const l = lignes(c);
  return Object.fromEntries([...l.saison, ...l.serie, ...l.proportions, ...l.positions].map((x) => [x.cle, moy(x.valeurs)]));
}

function tableau(ls: Ligne[], ref?: Reference): string[] {
  return [
    `| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |${ref ? ' Référence P3 |' : ''}`,
    `| --- | --- | --- | --- | --- |${ref ? ' --- |' : ''}`,
    ...ls.map((l) => {
      const dans = l.cible ? l.valeurs.filter((v) => v >= l.cible![0] && v <= l.cible![1]).length / l.valeurs.length : NaN;
      const binaire = l.valeurs.every((v) => v === 0 || v === 1);
      const cible = l.cible ? `${l.format(l.cible[0])} – ${l.format(l.cible[1])}` : '—';
      const dist = binaire ? '—' : `${l.format(quantile(l.valeurs, 0.1))} – ${l.format(quantile(l.valeurs, 0.9))}`;
      const r = ref?.[l.cle];
      return `| ${l.nom} | ${l.format(moy(l.valeurs))} | ${dist} | ${cible} | ${l.cible && !binaire ? pct(dans) : '—'} |${ref ? ` ${r === undefined ? '—' : l.format(r)} |` : ''}`;
    }),
  ];
}

const ref: Reference | undefined = args['reference'] && existsSync(args['reference']) ? JSON.parse(readFileSync(args['reference'], 'utf8')) : undefined;
let md: string[];

if (args['balayage-alea']) {
  // Comparaison de plusieurs niveaux d'aléa de course.
  const niveaux = args['balayage-alea'].split(',').map(Number);
  const campagnes = niveaux.map((a) => campagne({ 'course.aleaSigma': a }));
  const cles = ['vainqueurs', 'partDominante', 'inattendus', 'correlation', 'champions', 'dynasties', 'derniereManche', 'retournement', 'duo', 'lutteCoequipiers', 'lutteInter', 'coeqTotal', 'coeqPartComp', 'coeqPartForme', 'coeqPartAlea'];
  const toutes = campagnes.map((c) => { const l = lignes(c); return new Map([...l.saison, ...l.serie, ...l.proportions].map((x) => [x.cle, x])); });
  md = [
    `# Balayage de l’aléa de course — ${nGraines} graines × ${nSaisons} saisons par niveau`,
    '',
    `Aléa de course = écart type du « temps » de chaque pilote à chaque Grand Prix, en % du temps au tour (référence actuelle : 0,30). Durée totale : ${f(campagnes.reduce((a, c) => a + c.duree, 0), 1)} s.`,
    '',
    `| Indicateur | ${niveaux.map((n) => `aléa ${f(n, 2)}`).join(' | ')} |`,
    `| --- | ${niveaux.map(() => '---').join(' | ')} |`,
    ...cles.map((k) => {
      const l0 = toutes[0]!.get(k)!;
      return `| ${l0.nom} | ${toutes.map((t) => { const l = t.get(k)!; return l.format(moy(l.valeurs)); }).join(' | ')} |`;
    }),
  ];
} else {
  const params: Record<string, number> = args['alea'] ? { 'course.aleaSigma': Number(args['alea']) } : {};
  for (const paire of (args['param'] ?? '').split(',').filter(Boolean)) {
    const [k, v] = paire.split('=');
    if (k && v !== undefined && Number.isFinite(Number(v))) params[k] = Number(v);
  }
  const c = campagne(params);
  const l = lignes(c);
  if (args['json']) {
    mkdirSync(dirname(args['json']), { recursive: true });
    writeFileSync(args['json'], JSON.stringify(moyennes(c), null, 2) + '\n');
  }
  md = [
    `# Rapport d’équilibrage — ${nGraines} graines × ${nSaisons} saisons`,
    '',
    `Scénario grille-2026, graines 1 à ${nGraines}, ${c.saisons.length} saisons simulées en ${f(c.duree, 1)} s.${Object.keys(params).length ? ` Réglages d’expérience : ${JSON.stringify(params)}.` : ''} Généré par \`npm run equilibrage\`.`,
    '',
    '> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.',
    '',
    '## Par saison', '', ...tableau(l.saison, ref), '',
    `## Par série de ${nSaisons} saisons`, '', ...tableau(l.serie, ref), '',
    '## Proportions, luttes pour le titre et coéquipiers', '', ...tableau(l.proportions, ref), '',
    '## Compétitivité à toutes les positions (D-113)', '', ...tableau(l.positions, ref), '',
    '## Chronique d’exemple (graine 1)', '', ...c.chroniqueExemple,
  ];
}

const texte = md.join('\n') + '\n';
if (args['sortie']) {
  mkdirSync(dirname(args['sortie']), { recursive: true });
  writeFileSync(args['sortie'], texte);
  console.log(`Rapport écrit : ${args['sortie']}`);
} else console.log(texte);
