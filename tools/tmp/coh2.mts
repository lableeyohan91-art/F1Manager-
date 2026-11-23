import { resolve } from 'node:path';
const r = resolve('.'); const eng = await import(`${r}/src/engine/index.ts`); const { lireDonneesGrille2026 } = await import(`${r}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(r));
const [g, eq, poste] = [Number(process.argv[2]), process.argv[3], process.argv[4]];
const m = sc.creerMonde(g); const mo = sc.creerMoteur(); const vus = new Map<string, any>();
for (let k = 0; k < 52 * 12; k++) { mo.avancer(m, 1); for (const e of Object.values(m.evenements) as any[]) if (!vus.has(e.id)) vus.set(e.id, e);
  if (m.date.semaine === 50) continue; const pb = eng.verifierCoherence(m, { ages: false }); if (pb.length) { console.log("PROBLÈME", m.date, pb); break; } }
const ps = m.tables['personnes'] as any;
for (const c of Object.values(m.tables['contrats']) as any[]) if (c.organisation === eq && c.poste === poste && (c.statut === 'actif' || c.statut === 'signe' || c.fin >= m.date.annee)) console.log(c.id, c.personne, ps[c.personne]?.prenom, ps[c.personne]?.nom, c.statut, c.debut, c.fin, c.remplace ?? '', c.motifFin ?? '');
const ids = new Set((Object.values(m.tables['contrats']) as any[]).filter((c) => c.organisation === eq && c.poste === poste && c.fin >= m.date.annee - 1).map((c) => c.personne));
for (const e of [...vus.values()].filter((e) => e.acteurs.some((a: any) => ids.has(a.id)) && e.date.annee >= m.date.annee - 1).slice(-25)) console.log(e.date.annee, e.date.semaine, e.type, e.texte ?? JSON.stringify(e.contexte).slice(0, 100));
