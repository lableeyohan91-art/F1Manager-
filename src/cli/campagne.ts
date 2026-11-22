/**
 * Campagne d'équilibrage multi-réglages (D-074).
 *
 * 1. Simuler un réglage (un processus par réglage, pour paralléliser) :
 *      npm run campagne -- --simuler --pilote 0.15 --alea 0.25 --graines 100 --debut 1 --sortie sorties/campagne/p0.15-a0.25.json
 * 2. Agréger les résultats en rapport :
 *      npm run campagne -- --agreger sorties/campagne --sortie docs/rapports/campagne.md
 *
 * Toutes les mécaniques actives (phase 4). Mêmes graines pour chaque réglage (tirages locaux, D-057).
 */

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { performance } from 'node:perf_hooks';
import { creerScenarioGrille2026, indicateursSaison, indicateursSerie, saisonDe, type IndicateursSaison } from '../engine';
import { lireDonneesGrille2026 } from '../platform/node/donnees';
import { lireArguments } from './arguments';

const args = lireArguments(process.argv.slice(2));

/** Mesures brutes d'un réglage : une valeur par saison ou par série (10 saisons d'une graine). */
interface Mesures {
  pilote: number;
  alea: number;
  graines: [number, number];
  duree: number;
  saison: Record<string, number[]>;
  serie: Record<string, number[]>;
}

function simuler(pilote: number, alea: number, nGraines: number, debut: number, nSaisons: number): Mesures {
  const sc = creerScenarioGrille2026(lireDonneesGrille2026());
  const saison: Record<string, number[]> = {};
  const serie: Record<string, number[]> = {};
  const pousser = (d: Record<string, number[]>, k: string, v: number) => (d[k] ??= []).push(v);
  const t0 = performance.now();
  for (let g = debut; g < debut + nGraines; g++) {
    const m = sc.creerMonde(g);
    m.parametres = { 'course.ecartPiloteParPoint': pilote, 'course.aleaSigma': alea };
    const moteur = sc.creerMoteur();
    const ind: IndicateursSaison[] = [];
    for (let i = 0; i < nSaisons; i++) {
      const annee = m.date.annee;
      while (m.date.annee === annee) moteur.avancerUneSemaine(m);
      const s = saisonDe(m, annee);
      if (s?.termine) ind.push(indicateursSaison(m, s));
    }
    for (const x of ind) {
      pousser(saison, 'vainqueurs', x.vainqueursDifferents);
      pousser(saison, 'ecuriesVictorieuses', x.ecuriesVictorieuses);
      pousser(saison, 'partDominante', x.partVictoiresDominante);
      pousser(saison, 'ecartP1P2', x.ecartP1P2);
      pousser(saison, 'domination', x.ecartP1P2 >= 120 ? 1 : 0);
      pousser(saison, 'serree', x.ecartP1P2 <= 10 ? 1 : 0);
      pousser(saison, 'ouvert', x.titreDerniereManche ? 1 : 0);
      pousser(saison, 'lutteInter', x.lutteInterEcuries ? 1 : 0);
      pousser(saison, 'duoCoequipiers', x.duoCoequipiers ? 1 : 0);
      pousser(saison, 'inattendus', x.resultatsInattendus);
      pousser(saison, 'derniereMarque', x.derniereEcurieMarque ? 1 : 0);
      pousser(saison, 'leaders', x.changementsLeader);
      pousser(saison, 'partPremiere', x.partPointsPremiere);
      pousser(saison, 'partTop3', x.partPointsTop3);
      pousser(saison, 'gini', x.giniPoints);
      pousser(saison, 'surperformance', x.surperformanceMeilleursPilotes);
      pousser(saison, 'ecartPerf', x.ecartPerfPct);
      if (x.stabiliteHierarchie !== null) pousser(saison, 'stabilite', x.stabiliteHierarchie);
      if (x.coequipiers) {
        pousser(saison, 'coeqEcart', x.coequipiers.moyAbsTotal);
        pousser(saison, 'coeqComp', x.coequipiers.partCompetences);
        pousser(saison, 'coeqForme', x.coequipiers.partForme);
        pousser(saison, 'coeqAlea', x.coequipiers.partAlea);
      }
    }
    const s = indicateursSerie(m);
    const toutes = new Set(Object.keys(m.tables['ecuries'] ?? {}));
    const avecPodium = new Set(ind.flatMap((x) => x.ecuriesAvecPodium));
    const avecVictoire = new Set(ind.flatMap((x) => x.ecuriesAvecVictoire));
    pousser(serie, 'championsP', s.championsPilotesDifferents);
    pousser(serie, 'championsC', s.championsConstructeursDifferents);
    pousser(serie, 'dynastie', s.maxTitresConsecutifsEcurie >= 5 ? 1 : 0);
    pousser(serie, 'sansPodium', [...toutes].filter((e) => !avecPodium.has(e)).length);
    pousser(serie, 'sansVictoire', [...toutes].filter((e) => !avecVictoire.has(e)).length);
    pousser(serie, 'remontees', s.remontees);
  }
  return { pilote, alea, graines: [debut, debut + nGraines - 1], duree: (performance.now() - t0) / 1000, saison, serie };
}

/* ------------------------------------------------------------------ Agrégation */

const tri = (v: number[]) => [...v].sort((a, b) => a - b);
const q = (v: number[], p: number) => { const t = tri(v); return t.length ? t[Math.min(t.length - 1, Math.floor(p * t.length))]! : NaN; };
const moy = (v: number[]) => v.reduce((a, b) => a + b, 0) / (v.length || 1);
const f = (x: number, d = 1) => (Number.isFinite(x) ? x.toLocaleString('fr-FR', { maximumFractionDigits: d, minimumFractionDigits: d }) : '—');
const pc = (x: number) => (Number.isFinite(x) ? `${Math.round(100 * x)} %` : '—');

/** Objectifs statistiques utilisés pour repérer les compromis (jamais des contraintes, D-040). */
const OBJECTIFS: { cle: string; zone: 'saison' | 'serie'; min: number; max: number; libelle: string }[] = [
  { cle: 'vainqueurs', zone: 'saison', min: 4, max: 8, libelle: 'vainqueurs différents 4–8' },
  { cle: 'ecuriesVictorieuses', zone: 'saison', min: 3, max: 5, libelle: 'écuries victorieuses 3–5' },
  { cle: 'championsP', zone: 'serie', min: 3, max: 7, libelle: 'champions pilotes 3–7' },
  { cle: 'derniereMarque', zone: 'saison', min: 0.4, max: 0.9, libelle: 'dernière écurie marque 40–90 %' },
  { cle: 'domination', zone: 'saison', min: 0, max: 0.1, libelle: 'dominations ≤ 10 %' },
  { cle: 'ouvert', zone: 'saison', min: 0.3, max: 0.6, libelle: 'titre ouvert à la dernière manche 30–60 %' },
  { cle: 'lutteInter', zone: 'saison', min: 0.15, max: 1, libelle: 'luttes entre écuries ≥ 15 %' },
  { cle: 'coeqComp', zone: 'saison', min: 0.3, max: 0.7, libelle: 'part des compétences entre coéquipiers 30–70 %' },
  { cle: 'inattendus', zone: 'saison', min: 1, max: 3, libelle: 'victoires inattendues 1–3' },
  { cle: 'dynastie', zone: 'serie', min: 0, max: 0.4, libelle: 'dynasties ≤ 40 % (avant les phases 5–8)' },
];

function agreger(dossier: string): string {
  const res: Mesures[] = readdirSync(dossier).filter((n) => n.endsWith('.json')).map((n) => JSON.parse(readFileSync(join(dossier, n), 'utf8')) as Mesures)
    .sort((a, b) => a.pilote - b.pilote || a.alea - b.alea);
  const nom = (m: Mesures) => `${f(m.pilote, 3)} / ${f(m.alea, 2)}`;
  const val = (m: Mesures, cle: string) => moy(m.saison[cle] ?? m.serie[cle] ?? []);
  const dist = (m: Mesures, cle: string, fmt: (x: number) => string) => {
    const v = m.saison[cle] ?? m.serie[cle] ?? [];
    return `${fmt(moy(v))} <span class="muted">(méd. ${fmt(q(v, 0.5))} ; ${fmt(q(v, 0.1))}–${fmt(q(v, 0.9))})</span>`.replace(/<span class="muted">|<\/span>/g, '');
  };
  const atteints = (m: Mesures) => OBJECTIFS.filter((o) => { const v = val(m, o.cle); return v >= o.min && v <= o.max; });

  const md: string[] = [
    `# Campagne d'équilibrage — poids du pilote × aléa (${res.length} réglages)`,
    '',
    `Graines ${res[0]?.graines[0]} à ${res[0]?.graines[1]}, 10 saisons, toutes les mécaniques de la phase 4 actives. Même graines pour tous les réglages. Réglage noté « pilote / aléa » (pilote = % du temps au tour par point de niveau ; aléa = écart type par course, en %). Durée totale de calcul : ${f(res.reduce((a, m) => a + m.duree, 0) / 60, 1)} min (en parallèle).`,
    '',
    '> Les objectifs ci-dessous servent à repérer des compromis ; ce ne sont pas des contraintes (D-040). Aucun réglage n’est choisi pour un seul indicateur.',
    '',
    '## 1. Variété sportive (moyenne, médiane ; 10 %–90 %)',
    '',
    '| Réglage | Vainqueurs différents / saison | Écuries victorieuses / saison | Champions pilotes / 10 ans | Champions constructeurs / 10 ans | Victoires inattendues / saison | Écuries sans podium sur 10 ans | Sans victoire sur 10 ans |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...res.map((m) => `| ${nom(m)} | ${dist(m, 'vainqueurs', (x) => f(x))} | ${dist(m, 'ecuriesVictorieuses', (x) => f(x))} | ${dist(m, 'championsP', (x) => f(x))} | ${f(val(m, 'championsC'))} | ${dist(m, 'inattendus', (x) => f(x))} | ${f(val(m, 'sansPodium'))} | ${f(val(m, 'sansVictoire'))} |`),
    '',
    '## 2. Luttes pour le titre et dominations',
    '',
    '| Réglage | Écart P1–P2 (pts) | Dominations ≥ 120 pts | Saisons ≤ 10 pts | Titre ouvert à la dernière manche | Lutte entre écuries | Champion et dauphin coéquipiers | Changements de leader | Dynasties (5 titres) |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...res.map((m) => `| ${nom(m)} | ${dist(m, 'ecartP1P2', (x) => f(x, 0))} | ${pc(val(m, 'domination'))} | ${pc(val(m, 'serree'))} | ${pc(val(m, 'ouvert'))} | ${pc(val(m, 'lutteInter'))} | ${pc(val(m, 'duoCoequipiers'))} | ${f(val(m, 'leaders'))} | ${pc(val(m, 'dynastie'))} |`),
    '',
    '## 3. Pilotes, coéquipiers et répartition des points',
    '',
    '| Réglage | Écart coéquipiers (% tour) | Part compétences | Part forme | Part aléa | Gain de places des meilleurs pilotes | Dernière écurie marque | Part des points de la 1re écurie | Part du top 3 | Gini des points | Stabilité de la hiérarchie |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...res.map((m) => `| ${nom(m)} | ${f(val(m, 'coeqEcart'), 2)} | ${pc(val(m, 'coeqComp'))} | ${pc(val(m, 'coeqForme'))} | ${pc(val(m, 'coeqAlea'))} | ${f(val(m, 'surperformance'), 2)} | ${pc(val(m, 'derniereMarque'))} | ${pc(val(m, 'partPremiere'))} | ${pc(val(m, 'partTop3'))} | ${f(val(m, 'gini'), 2)} | ${f(val(m, 'stabilite'), 2)} |`),
    '',
    '## 4. Objectifs atteints (repérage des compromis)',
    '',
    `Objectifs : ${OBJECTIFS.map((o) => o.libelle).join(' · ')}.`,
    '',
    '| Réglage | Objectifs atteints | Manqués |',
    '| --- | --- | --- |',
    ...res.map((m) => ({ m, a: atteints(m) })).sort((x, y) => y.a.length - x.a.length)
      .map(({ m, a }) => `| ${nom(m)} | ${a.length} / ${OBJECTIFS.length} | ${OBJECTIFS.filter((o) => !a.includes(o)).map((o) => o.libelle).join(' · ') || '—'} |`),
  ];
  return md.join('\n') + '\n';
}

if (args['simuler']) {
  const m = simuler(Number(args['pilote']), Number(args['alea']), Number(args['graines'] ?? 100), Number(args['debut'] ?? 1), Number(args['saisons'] ?? 10));
  mkdirSync(dirname(args['sortie']!), { recursive: true });
  writeFileSync(args['sortie']!, JSON.stringify(m));
  console.log(`${args['sortie']} : ${m.duree.toFixed(0)} s`);
} else if (args['agreger']) {
  const texte = agreger(args['agreger']);
  if (args['sortie']) {
    mkdirSync(dirname(args['sortie']), { recursive: true });
    writeFileSync(args['sortie'], texte);
    console.log(`Rapport écrit : ${args['sortie']}`);
  } else console.log(texte);
}
