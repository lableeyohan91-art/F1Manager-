/**
 * Audit des phases 10–11 — départs répétés : réembauches dans l'écurie qu'on vient de quitter, demandes de départ répétées
 * dans une même saison, indemnités versées plusieurs fois. Lancer sur deux copies du dépôt (avant / après), mêmes graines.
 * Usage : npx tsx tools/diagnostic-departs.mts <racine> <graines> <saisons>
 */
import { resolve } from 'node:path';
const racine = resolve(process.argv[2] ?? '.');
const N = Number(process.argv[3] ?? 6), S = Number(process.argv[4] ?? 10);
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
let reembauches = 0, demandesRepetees = 0, departsAcceptes = 0, indemnitesMultiples = 0, demandes = 0;
for (let g = 1; g <= N; g++) {
  const m = sc.creerMonde(g === 6 ? 42 : g);
  const mo = sc.creerMoteur();
  const vus = new Set<string>();
  const departs = new Map<string, number>(); // personne|écurie → année du départ (hors échéance)
  const demandesSaison = new Map<string, number>();
  const accepteSaison = new Map<string, number>();
  for (let k = 0; k < 52 * S; k++) {
    mo.avancerUneSemaine(m);
    for (const e of Object.values(m.evenements) as any[]) {
      if (vus.has(e.id)) continue;
      vus.add(e.id);
      const pers = e.acteurs.find((a: any) => a.role === 'personne' || a.role === 'cible')?.id;
      const org = e.acteurs.find((a: any) => a.role === 'organisation')?.id;
      if (e.type === 'contrat.fin' && e.contexte?.motif && e.contexte.motif !== 'echeance') departs.set(`${pers}|${org}`, e.date.annee);
      if (e.type === 'recrutement' && departs.has(`${pers}|${org}`) && e.date.annee - departs.get(`${pers}|${org}`)! <= 1) reembauches++;
      if (e.type === 'contrat.demande_depart') {
        demandes++;
        const cle = `${e.acteurs.find((a: any) => a.role === 'auteur')?.id}|${e.date.annee}`;
        demandesSaison.set(cle, (demandesSaison.get(cle) ?? 0) + 1);
        if (demandesSaison.get(cle) === 2) demandesRepetees++;
      }
      if (e.type === 'contrat.depart_accepte') {
        departsAcceptes++;
        const cle = `${pers}|${e.date.annee}`;
        accepteSaison.set(cle, (accepteSaison.get(cle) ?? 0) + 1);
        if (accepteSaison.get(cle) === 2) indemnitesMultiples++;
      }
    }
  }
}
console.log(JSON.stringify({ graines: N, saisons: S, demandes, departsAcceptes, reembauchesApresDepart: reembauches, personnesDemandantPlusieursFoisLaMemeSaison: demandesRepetees, personnesIndemniseesPlusieursFoisLaMemeSaison: indemnitesMultiples }, null, 1));
