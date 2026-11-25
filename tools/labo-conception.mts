/**
 * Phase 12b — laboratoire du département technique (fiche §14, demande du porteur) : la même écurie, sur les mêmes graines, avec des
 * stratégies différentes ; et l'effet isolé du barème de soufflerie (réel contre plat).
 * Stratégies (rythme des projets et part de soufflerie pour la recherche, imposés chaque semaine à l'écurie étudiée) :
 *   ia (politique de l'IA), normal (toujours normal), intensif (toujours intensif), ponctuel (intensif sur les 14 derniers jours de chaque
 *   projet), voiture (soufflerie 0 % recherche), avenir (100 %), plat (barème de soufflerie à 100 % pour toutes les écuries).
 * Mesures : place moyenne au championnat constructeurs, gain d'indice sur la période (points équivalents), fatigue moyenne et maximale des
 * pôles, incidents, échecs, défauts cachés, dilemmes, dépenses techniques.
 * Usage : npx tsx tools/labo-conception.mts [graines=8] [saisons=4] [écurie=eq_williams]
 */
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const N = Number(process.argv[2] ?? 8), S = Number(process.argv[3] ?? 4), ID = process.argv[4] ?? 'eq_williams';

type Strategie = 'ia' | 'normal' | 'intensif' | 'ponctuel' | 'voiture' | 'avenir' | 'plat';
const STRATEGIES: Strategie[] = (process.argv[5]?.split(',') as Strategie[] | undefined) ?? ['ia', 'normal', 'intensif', 'ponctuel', 'voiture', 'avenir', 'plat'];

function jouer(graine: number, st: Strategie) {
  const m = sc.creerMonde(graine), mo = sc.creerMoteur();
  if (st === 'plat') m.parametres = { ...(m.parametres ?? {}), 'reglement.restrictionAeroPremier': 1, 'reglement.restrictionAeroDernier': 1 };
  const e = m.tables['ecuries'][ID];
  const debut = eng.indiceMoyen(m, e);
  const fatigues: number[] = []; let incidents = 0, echecs = 0, dilemmes = 0;
  const vus = new Set<string>(Object.keys(m.evenements));
  const places: number[] = [];
  let depense = 0;
  for (let w = 0; w < 52 * S; w++) {
    if (st !== 'ia' && st !== 'plat') {
      for (const p of eng.projets(m, ID)) if (p.fabricationJoursRestants === undefined && (st === 'normal' || st === 'intensif' || st === 'ponctuel')) p.rythme = st === 'intensif' || (st === 'ponctuel' && p.joursRestants <= 14) ? 'intensif' : 'normal';
      if (st === 'voiture') e.souffleriePartRecherche = 0;
      if (st === 'avenir') e.souffleriePartRecherche = 1;
    }
    mo.avancer(m, 1);
    for (const id of Object.keys(m.evenements)) {
      if (vus.has(id)) continue;
      vus.add(id);
      const ev = m.evenements[id];
      if (!ev.acteurs.some((a: { id: string }) => a.id === ID)) continue;
      if (ev.type === 'conception.incident') incidents++;
      if (ev.type === 'conception.echec') echecs++;
      if (ev.type === 'conception.dilemme') dilemmes++;
    }
    for (const pole of ['aero', 'conception']) fatigues.push(eng.fatiguePole(m, ID, pole));
    if (m.date.semaine === 1) {
      const sa = eng.saisonDe(m, m.date.annee - 1);
      if (sa) places.push(sa.constructeurs.findIndex((c: { ecurie: string }) => c.ecurie === ID) + 1);
      const fi = (Object.values(m.tables['finances']) as { ecurie: string; historique: { developpement: number }[] }[]).find((f) => f.ecurie === ID)!;
      depense += fi.historique.at(-1)?.developpement ?? 0;
    }
  }
  const defauts = (Object.values(m.tables['pieces']) as { ecurie: string; fragile?: boolean }[]).filter((p) => p.ecurie === ID && p.fragile).length;
  return { place: places.reduce((a, b) => a + b, 0) / Math.max(1, places.length), gain: eng.indiceMoyen(m, e) - debut, fatMoy: fatigues.reduce((a, b) => a + b, 0) / fatigues.length, fatMax: Math.max(...fatigues), incidents, echecs, dilemmes, defauts, depense };
}

const moy = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
console.log(`${N} graines × ${S} saisons, écurie ${ID}\n`);
console.log('| Stratégie | Place moyenne | Gain d’indice | Fatigue moy. | Fatigue max | Incidents | Échecs | Pièces fragiles | Dilemmes | Développement payé (M€/an) |');
console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const st of STRATEGIES) {
  const r = Array.from({ length: N }, (_, i) => jouer(i + 1, st));
  const f = (k: keyof (typeof r)[number], d = 2) => moy(r.map((x) => x[k] as number)).toFixed(d);
  console.log(`| ${st} | ${f('place')} | ${f('gain')} | ${f('fatMoy', 1)} | ${f('fatMax', 0)} | ${f('incidents', 1)} | ${f('echecs', 2)} | ${f('defauts', 2)} | ${f('dilemmes', 1)} | ${(Number(f('depense', 1)) / S).toFixed(1)} |`);
}
