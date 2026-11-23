import { creerScenarioGrille2026 } from '../../src/engine';
import { lireDonneesGrille2026 } from '../../src/platform/node/donnees';
const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const m = sc.creerMonde(1); const mo = sc.creerMoteur();
const vus = new Map<string, any>();
for (let k = 0; k < 52 * 8; k++) { mo.avancer(m, 1); for (const e of Object.values(m.evenements) as any[]) if (e.type.startsWith('contrat.') && !vus.has(e.id)) vus.set(e.id, e); }
const c = new Map<string, number>(); for (const e of vus.values()) c.set(e.type, (c.get(e.type) ?? 0) + 1); console.log(c);
for (const e of [...vus.values()].filter((e) => ['contrat.demission', 'contrat.rupture_negociee', 'contrat.depart_accepte'].includes(e.type)).slice(0, 8)) console.log(e.date.annee, e.date.semaine, e.type, e.texte ?? JSON.stringify(e.contexte));
const fins = [...vus.values()].filter((e) => e.type === 'contrat.fin'); const motifs = new Map<string, number>(); for (const e of fins) motifs.set(e.contexte.motif, (motifs.get(e.contexte.motif) ?? 0) + 1); console.log(motifs);
