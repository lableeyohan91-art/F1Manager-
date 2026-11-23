/**
 * Phase 8d — diagnostic indicatif (D-120) : équipes des stands, démissions et ruptures, groupes sociaux, politique.
 * Usage : npx tsx tools/diagnostic-8d.mts <graines> <saisons>
 */
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const N = Number(process.argv[2] ?? 20), S = Number(process.argv[3] ?? 15);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const moy = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const compte = new Map<string, number>();
const ajouter = (k: string, n = 1) => compte.set(k, (compte.get(k) ?? 0) + n);
const rapidite: number[] = [], precision: number[] = [], cohesion: number[] = [], fatigue: number[] = [], renouvellement: number[] = [], ecartRapidite: number[] = [];
const groupesParType = new Map<string, number>(); const tailles: number[] = []; const nbGroupes: number[] = [];
const plafondsFin: number[] = []; const presidents = new Set<string>(); const alliances: number[] = [];
const t0 = performance.now();
for (let g = 1; g <= N; g++) {
  const m = sc.creerMonde(g);
  const mo = sc.creerMoteur();
  const vus = new Set<string>();
  for (let s = 0; s < S; s++) {
    for (let k = 0; k < 52; k++) {
      mo.avancer(m, 1);
      for (const e of Object.values(m.evenements) as any[]) {
        if (vus.has(e.id)) continue;
        if (!/^(contrat\.(demande_depart|depart_accepte|depart_refuse|demission|rupture_negociee|rupture_refusee)|groupe\.|federation\.|politique\.|stands\.)/.test(e.type)) continue;
        vus.add(e.id);
        ajouter(e.type);
        if (e.type === 'federation.vote') ajouter(`vote ${e.contexte.sujet} ${e.contexte.adopte ? 'adopté' : 'rejeté'}`);
      }
    }
    for (const eq of Object.values(m.tables['equipesStands'] ?? {}) as any[]) {
      const h = eq.historique.at(-1);
      if (!h) continue;
      rapidite.push(h.rapidite); precision.push(h.precision); cohesion.push(h.cohesion); fatigue.push(h.fatigueMoyenne); renouvellement.push(h.renouvellement);
    }
    const eqs = Object.values(m.tables['equipesStands'] ?? {}) as any[];
    if (eqs.length) ecartRapidite.push(Math.max(...eqs.map((e) => e.rapidite)) - Math.min(...eqs.map((e) => e.rapidite)));
    const gs = eng.groupes(m);
    nbGroupes.push(gs.length);
    for (const gr of gs) { groupesParType.set(gr.type, (groupesParType.get(gr.type) ?? 0) + 1); tailles.push(gr.membres.length + 1); }
    alliances.push(Object.keys(m.tables['alliances'] ?? {}).length);
  }
  plafondsFin.push(eng.plafond(m));
  const f = eng.federation(m);
  if (f?.president) presidents.add(`${g}:${f.president}`);
}
const n = N * S;
const par = (k: string) => ((compte.get(k) ?? 0) / n).toFixed(2);
console.log(`# Diagnostic phase 8d — ${N} graines × ${S} saisons (${((performance.now() - t0) / 1000).toFixed(0)} s)\n`);
console.log('| Indicateur | Valeur |\n| --- | --- |');
console.log(`| Stands : rapidité / précision / cohésion moyennes (fin de saison) | ${moy(rapidite).toFixed(1)} / ${moy(precision).toFixed(1)} / ${moy(cohesion).toFixed(1)} |`);
console.log(`| Stands : écart de rapidité entre la meilleure et la moins bonne équipe | ${moy(ecartRapidite).toFixed(1)} |`);
console.log(`| Stands : fatigue moyenne sur la saison | ${moy(fatigue).toFixed(1)} |`);
console.log(`| Stands : part de l'équipe renouvelée par saison | ${(100 * moy(renouvellement)).toFixed(0)} % |`);
console.log(`| Stands : vagues de recrutement / changements de chef, par saison (toutes écuries) | ${par('stands.recrutement')} / ${par('stands.changement_chef')} |`);
console.log(`| Demandes de départ / acceptées / refusées, par saison | ${par('contrat.demande_depart')} / ${par('contrat.depart_accepte')} / ${par('contrat.depart_refuse')} |`);
console.log(`| Démissions, par saison | ${par('contrat.demission')} |`);
console.log(`| Ruptures négociées proposées par l'employeur : acceptées / refusées, par saison | ${par('contrat.rupture_negociee')} / ${par('contrat.rupture_refusee')} |`);
console.log(`| Groupes sociaux en fin de saison (moyenne) / taille moyenne | ${moy(nbGroupes).toFixed(1)} / ${moy(tailles).toFixed(1)} |`);
console.log(`| Groupes par type (cumul des fins de saison) | ${[...groupesParType].sort((a, b) => b[1] - a[1]).map(([t, k]) => `${t} ${k}`).join(', ')} |`);
console.log(`| Membres qui suivent leur leader (candidatures), par saison | ${par('groupe.suit_leader')} |`);
console.log(`| Élections / intérims, par saison | ${par('federation.election')} / ${par('federation.interim')} |`);
console.log(`| Lobbying (actions), par saison | ${par('politique.lobbying')} |`);
console.log(`| Votes plafond adoptés / rejetés ; restrictions adoptés / rejetés (par saison) | ${par('vote plafondMEUR adopté')} / ${par('vote plafondMEUR rejeté')} ; ${par('vote ecartAero adopté')} / ${par('vote ecartAero rejeté')} |`);
const tri = [...plafondsFin].sort((a, b) => a - b);
console.log(`| Plafond budgétaire en fin de série (départ 215 M€) : min / médiane / max | ${tri[0]?.toFixed(0)} / ${tri[Math.floor(tri.length / 2)]?.toFixed(0)} / ${tri.at(-1)?.toFixed(0)} M€ |`);
console.log(`| Alliances (moyenne par saison) | ${moy(alliances).toFixed(1)} |`);
