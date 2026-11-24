/**
 * Audit de la phase 9 — diagnostic du passé construit au départ, puis de ses effets sur N saisons (mesure indicative, D-120).
 * Lancer sur deux copies du dépôt (avant / après) avec les mêmes graines.
 * Usage : npx tsx tools/diagnostic-histoire.mts <racine du dépôt> <graines> <saisons> [fichier JSON]
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const racine = resolve(process.argv[2] ?? '.');
const N = Number(process.argv[3] ?? 20), S = Number(process.argv[4] ?? 10);
const sortie = process.argv[5];
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const moy = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const res: Record<string, number[]> = {};
const noter = (k: string, v: number) => (res[k] ??= []).push(v);
const mois = (d: { annee: number; semaine: number }, ref: { annee: number; semaine: number }) => ((ref.annee - d.annee) * 52 + ref.semaine - d.semaine) / 52 * 12;

for (let g = 1; g <= N; g++) {
  const t0 = performance.now();
  const m = sc.creerMonde(g);
  noter('création du monde (ms)', performance.now() - t0);
  const evs = Object.values(m.evenements) as any[];
  const relations = Object.values(m.tables['relations'] ?? {}) as any[];
  const souvenirs = Object.values(m.tables['souvenirs'] ?? {}) as any[];
  noter('départ : relations', relations.length);
  noter('départ : relations familiarité ≥ 0,3', relations.filter((r) => r.familiarite >= 0.3).length);
  noter('départ : souvenirs', souvenirs.length);
  noter('départ : âge moyen des souvenirs (mois)', moy(souvenirs.map((s) => mois(s.creeLe, m.date))));
  noter('départ : intensité moyenne des souvenirs', moy(souvenirs.map((s) => s.intensite)));
  const juniors = new Set(evs.filter((e) => e.type === 'junior.titre').map((e) => e.id));
  noter('départ : souvenirs de rivalité junior', souvenirs.filter((s) => juniors.has(s.evenement)).length);
  noter('départ : titres juniors datés avant 2027', evs.filter((e) => e.type === 'junior.titre' && e.date.annee < 2027).length);
  noter('départ : titres juniors datés 2027 ou après', evs.filter((e) => e.type === 'junior.titre' && e.date.annee >= 2027).length);
  noter('départ : événements', evs.length);
  noter('départ : événements avant 2027', evs.filter((e) => e.date.annee < 2027).length);
  // Familiarité et éloignement : liens forts entre personnes qui ne travaillent plus ensemble depuis 5 ans ou plus.
  const car = Object.values(m.tables['carrieres'] ?? {}) as any[];
  const dernierEnsemble = (a: string, b: string) => {
    let res = -1;
    for (const x of car) if (x.personne === a) for (const y of car) if (y.personne === b && y.ecurieLignee === x.ecurieLignee) {
      const fin = Math.min(x.a, y.a), debut = Math.max(x.de, y.de);
      if (debut <= fin) res = Math.max(res, fin);
    }
    return res;
  };
  const pers = m.tables['personnes'] as Record<string, any>;
  let separes = 0, separesForts = 0;
  for (const r of relations) {
    if (r.familiarite < 0.3) continue;
    const a = pers[r.de], b = pers[r.vers];
    if (!a || !b || (a.ecurie && a.ecurie === b.ecurie)) continue;
    const fin = dernierEnsemble(r.de, r.vers);
    if (fin < 0 || m.date.annee - fin < 6) continue;
    separes++;
    const rel = eng.relation(m, r.de, r.vers);
    if (rel.affinite >= 0.3 || rel.respect >= 0.35) separesForts++;
  }
  noter('départ : relations familières entre personnes séparées depuis ≥ 5 ans', separes);
  noter('départ : dont lien fort (affinité ≥ 0,3 ou respect ≥ 0,35)', separesForts);
  const texte = eng.serialiser(m);
  noter('départ : sauvegarde (Mo)', texte.length / 1e6);
  const t1 = performance.now();
  eng.deserialiser(texte);
  noter('départ : chargement (ms)', performance.now() - t1);
  noter('départ : empreinte stable (rechargée = 1)', eng.empreinte(eng.deserialiser(texte)) === eng.empreinte(m) ? 1 : 0);

  // Saisons simulées.
  const mo = sc.creerMoteur();
  const vus = new Set<string>();
  const compte = new Map<string, number>();
  const groupesFin: number[] = [], anciens: number[] = [];
  const t2 = performance.now();
  for (let s = 0; s < S; s++) {
    for (let k = 0; k < 52; k++) {
      mo.avancerUneSemaine(m);
      for (const e of Object.values(m.evenements) as any[]) {
        if (vus.has(e.id)) continue;
        vus.add(e.id);
        compte.set(e.type, (compte.get(e.type) ?? 0) + 1);
      }
      if (m.date.semaine === 31) {
        const gr = Object.values(m.tables['groupes'] ?? {}) as any[];
        groupesFin.push(gr.length / 11);
        anciens.push(gr.filter((x) => x.type === 'anciens_collaborateurs').length / 11);
      }
    }
  }
  noter('saisons : ms par saison', (performance.now() - t2) / S);
  const par = (t: string) => (compte.get(t) ?? 0) / S;
  noter('saisons : groupes par écurie', moy(groupesFin));
  noter('saisons : groupes « anciens collaborateurs » par écurie', moy(anciens));
  noter('saisons : suivre son leader / saison', par('groupe.suit_leader'));
  noter('saisons : signaux « nouveau défi » / saison', par('personnel.besoin_defi'));
  noter('saisons : demandes de départ / saison', par('contrat.demande_depart'));
  noter('saisons : démissions / saison', par('contrat.demission'));
  noter('saisons : signatures du marché / saison', par('marche.signature'));
  noter('saisons : team principals renvoyés / saison', par('conseil.licenciement_tp'));
  noter('saisons : incohérences en fin de partie', eng.verifierCoherence(m, { ages: false }).length);
  noter('saisons : sauvegarde finale (Mo)', eng.serialiser(m).length / 1e6);
  console.error(`graine ${g} terminée`);
}
const moyennes = Object.fromEntries(Object.entries(res).map(([k, v]) => [k, Math.round(moy(v) * 100) / 100]));
console.log(JSON.stringify(moyennes, null, 1));
if (sortie) writeFileSync(sortie, JSON.stringify(moyennes, null, 1));
