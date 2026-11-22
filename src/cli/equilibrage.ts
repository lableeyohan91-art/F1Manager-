/**
 * Rapport d'équilibrage : N graines × S saisons, indicateurs comparés aux objectifs statistiques (D-040).
 * Exemple : npm run equilibrage -- --graines 100 --saisons 10 --sortie docs/rapports/equilibrage.md
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { performance } from 'node:perf_hooks';
import { creerScenarioGrille2026, indicateursSerie, type IndicateursSaison, type Personne, type Saison } from '../engine';
import { lireDonneesGrille2026 } from '../platform/node/donnees';
import { lireArguments } from './arguments';

const args = lireArguments(process.argv.slice(2));
const nGraines = Number(args['graines'] ?? 100);
const nSaisons = Number(args['saisons'] ?? 10);
const sortie = args['sortie'];

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const series: ReturnType<typeof indicateursSerie>[] = [];
let chroniqueExemple: string[] = [];
const t0 = performance.now();
for (let g = 1; g <= nGraines; g++) {
  const m = sc.creerMonde(g);
  sc.creerMoteur().avancer(m, nSaisons * 52);
  series.push(indicateursSerie(m));
  if (g === 1) {
    const nom = (id: string) => { const p = m.tables['personnes']![id] as unknown as Personne; return `${p.prenom} ${p.nom}`; };
    chroniqueExemple = (Object.values(m.tables['saisons']!) as unknown as Saison[])
      .sort((a, b) => a.annee - b.annee)
      .flatMap((s) => [`**${s.annee}** — champion : ${nom(s.pilotes[0]!.pilote)}`, ...s.chronique.map((l) => `- ${l}`), '']);
  }
}
const duree = (performance.now() - t0) / 1000;

const saisons = series.flatMap((s) => s.saisons);
const quantile = (v: number[], q: number) => { const t = [...v].sort((a, b) => a - b); return t[Math.min(t.length - 1, Math.floor(q * t.length))] ?? 0; };
const moy = (v: number[]) => v.reduce((a, b) => a + b, 0) / (v.length || 1);
const f = (x: number, d = 1) => x.toLocaleString('fr-FR', { maximumFractionDigits: d, minimumFractionDigits: d });
const pct = (x: number) => `${f(100 * x, 0)} %`;

type Ligne = { nom: string; valeurs: number[]; cible?: [number, number]; format?: (x: number) => string };
const parSaison = (k: keyof IndicateursSaison) => saisons.map((s) => Number(s[k]));
const lignesSaison: Ligne[] = [
  { nom: 'Vainqueurs de Grand Prix différents par saison', valeurs: parSaison('vainqueursDifferents'), cible: [3, 8], format: (x) => f(x, 1) },
  { nom: 'Écuries victorieuses par saison', valeurs: parSaison('ecuriesVictorieuses'), cible: [2, 5], format: (x) => f(x, 1) },
  { nom: "Part des victoires de l'écurie dominante", valeurs: parSaison('partVictoiresDominante'), cible: [0.35, 0.8], format: pct },
  { nom: 'Taux d’abandon par départ', valeurs: parSaison('tauxAbandon'), cible: [0.05, 0.15], format: pct },
  { nom: 'Écart de performance 1re–dernière voiture (% temps au tour)', valeurs: parSaison('ecartPerfPct'), cible: [1.5, 4], format: (x) => f(x, 2) },
  { nom: 'Écart de points entre les deux premiers', valeurs: parSaison('ecartP1P2'), format: (x) => f(x, 0) },
  { nom: 'Changements de leader du championnat', valeurs: parSaison('changementsLeader'), format: (x) => f(x, 1) },
  { nom: 'Doublés par saison (toutes écuries)', valeurs: parSaison('doublesTotal'), format: (x) => f(x, 1) },
  { nom: 'Écart moyen entre coéquipiers à l’arrivée (% temps au tour)', valeurs: parSaison('ecartCoequipiersPct'), format: (x) => f(x, 2) },
  { nom: 'Corrélation voiture ↔ points constructeurs (Spearman)', valeurs: parSaison('correlationVoiturePoints'), format: (x) => f(x, 2) },
  { nom: 'Plus forte progression d’une voiture dans la saison (points d’indice)', valeurs: parSaison('progressionMax'), format: (x) => f(x, 2) },
  { nom: 'Victoires inattendues par saison', valeurs: parSaison('resultatsInattendus'), format: (x) => f(x, 1) },
  { nom: 'Courses sous la pluie par saison', valeurs: parSaison('courseSousLaPluie'), format: (x) => f(x, 1) },
];
const lignesSerie: Ligne[] = [
  { nom: `Champions pilotes différents sur ${nSaisons} saisons`, valeurs: series.map((s) => s.championsPilotesDifferents), cible: [3, 7], format: (x) => f(x, 1) },
  { nom: `Champions constructeurs différents sur ${nSaisons} saisons`, valeurs: series.map((s) => s.championsConstructeursDifferents), format: (x) => f(x, 1) },
  { nom: 'Plus longue série de titres constructeurs consécutifs', valeurs: series.map((s) => s.maxTitresConsecutifsEcurie), format: (x) => f(x, 1) },
  { nom: `Écuries sans aucune victoire sur ${nSaisons} saisons`, valeurs: series.map((s) => s.ecuriesSansVictoire), format: (x) => f(x, 1) },
  { nom: 'Remontées (+3 places ou plus d’une saison à l’autre)', valeurs: series.map((s) => s.remontees), format: (x) => f(x, 1) },
];

const tableau = (lignes: Ligne[]) => [
  '| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |',
  '| --- | --- | --- | --- | --- |',
  ...lignes.map((l) => {
    const fm = l.format ?? ((x: number) => f(x));
    const dans = l.cible ? l.valeurs.filter((v) => v >= l.cible![0] && v <= l.cible![1]).length / l.valeurs.length : NaN;
    return `| ${l.nom} | ${fm(moy(l.valeurs))} | ${fm(quantile(l.valeurs, 0.1))} – ${fm(quantile(l.valeurs, 0.9))} | ${l.cible ? `${fm(l.cible[0])} – ${fm(l.cible[1])}` : '—'} | ${l.cible ? pct(dans) : '—'} |`;
  }),
];

const proportions = [
  `- Saisons où la dernière écurie marque au moins 1 point : **${pct(moy(saisons.map((s) => (s.derniereEcurieMarque ? 1 : 0))))}** (objectif 40 % – 90 %).`,
  `- Séries de ${nSaisons} saisons avec 5 titres constructeurs consécutifs ou plus : **${pct(moy(series.map((s) => (s.maxTitresConsecutifsEcurie >= 5 ? 1 : 0))))}** (objectif : possible, mais moins de 25 %).`,
  `- Titres décidés à la dernière manche : **${pct(moy(saisons.map((s) => (s.titreDerniereManche ? 1 : 0))))}** des saisons.`,
  `- Saisons très serrées (≤ 10 points d’écart) : **${pct(moy(saisons.map((s) => (s.ecartP1P2 <= 10 ? 1 : 0))))}** ; dominations (≥ 120 points) : **${pct(moy(saisons.map((s) => (s.ecartP1P2 >= 120 ? 1 : 0))))}**.`,
];

const md = [
  `# Rapport d’équilibrage — ${nGraines} graines × ${nSaisons} saisons`,
  '',
  `Scénario grille-2026, graines 1 à ${nGraines}, ${saisons.length} saisons simulées en ${f(duree, 1)} s. Généré par \`npm run equilibrage\`.`,
  '',
  '> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.',
  '',
  '## Par saison',
  '',
  ...tableau(lignesSaison),
  '',
  `## Par série de ${nSaisons} saisons`,
  '',
  ...tableau(lignesSerie),
  '',
  '## Proportions',
  '',
  ...proportions,
  '',
  '## Chronique d’exemple (graine 1)',
  '',
  ...chroniqueExemple,
].join('\n');

if (sortie) {
  mkdirSync(dirname(sortie), { recursive: true });
  writeFileSync(sortie, md + '\n');
  console.log(`Rapport écrit : ${sortie} (${f(duree, 1)} s)`);
} else console.log(md);
