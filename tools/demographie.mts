/**
 * Laboratoire phase 6a (§12) : démographie et dérive du niveau sur de longues carrières.
 * Usage : npm run demographie -- <graines> <saisons>
 */
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const N = Number(process.argv[2] ?? 10), S = Number(process.argv[3] ?? 30);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));

const moy = (v: number[]) => (v.length ? v.reduce((a, b) => a + b, 0) / v.length : NaN);
const q = (v: number[], x: number) => (v.length ? [...v].sort((a, b) => a - b)[Math.floor(x * (v.length - 1))]! : NaN);
const compteurs: Record<string, number> = {};
const debutants: number[] = [];
const niveauGrille: number[][] = [];
const ageGrille: number[][] = [];
const ageRetraite: number[] = [];
const carriereF1: number[] = [];
const ageRetraitePersonnel: number[] = [];
const population: number[][] = [];
const championsPepites = { pepites: 0, championnes: 0, nesCohortes: 0 };
const ageTitre: number[] = [];
// Phase 6b : parcours vers la F1.
const ageDebut: number[] = [];
let baquetsJuniors = 0, baquetsSubventionnes = 0, prixPayes: number[] = [];
let debutantsAffilies = 0, promessesTenues = 0, promessesRompues = 0, mecenes = 0; const ecartsReputationAcademies: number[] = [];
let debutantsTop5Apex2 = 0, debutantsTotal = 0, championsApex2 = 0, championsApex2Promus = 0, talentsBloques = 0, talents = 0, payantsMoyensF1 = 0, payantsMoyens = 0;

for (let g = 1; g <= N; g++) {
  const m = sc.creerMonde(g);
  const mo = sc.creerMoteur();
  const vus = new Set<string>();
  const dejaTitulaires = new Set<string>(Object.values(m.tables['personnes']).filter((p: any) => p.poste === 'pilote_titulaire' && p.statut === 'actif').map((p: any) => p.id));
  for (let s = 0; s < S; s++) {
    mo.avancer(m, 52);
    for (const [id, e] of Object.entries(m.evenements) as [string, any][]) {
      if (vus.has(id)) continue;
      vus.add(id);
      if (/^(personne\.|generation\.|recrutement\.genere|pilote\.titularisation)/.test(e.type)) compteurs[e.type] = (compteurs[e.type] ?? 0) + 1;
      if (e.type === 'personne.retraite') {
        const p = m.tables['personnes'][e.acteurs[0].id] as any;
        if (!p) continue;
        const poste = String(e.contexte?.poste ?? p.poste);
        if (poste.startsWith('pilote') && (e.contexte?.saisonsF1 ?? 0) > 0) { ageRetraite.push(e.contexte.age); carriereF1.push(e.contexte.saisonsF1); }
        else if (!poste.startsWith('pilote')) ageRetraitePersonnel.push(e.contexte.age);
        if (/abandon/.test(e.contexte?.motif ?? '')) compteurs['abandon'] = (compteurs['abandon'] ?? 0) + 1;
      }
      if (e.type === 'junior.mecene') mecenes++;
    }
    const tit = Object.values(m.tables['personnes']).filter((p: any) => p.poste === 'pilote_titulaire' && p.statut === 'actif') as any[];
    let nouveaux = 0;
    for (const p of tit) if (!dejaTitulaires.has(p.id)) {
      nouveaux++; dejaTitulaires.add(p.id);
      ageDebut.push(m.date.annee - p.anneeNaissance);
      debutantsTotal++;
      if ((p.carriere?.juniors ?? []).some((r: any) => r.categorie === 'apex2' && r.rang <= 5)) debutantsTop5Apex2++;
      if ((Object.values(m.tables['academies'] ?? {}) as any[]).some((a) => (a.anciens ?? []).includes(p.id)) || (Object.values(m.tables['contrats']) as any[]).some((c) => c.type === 'affiliation' && c.personne === p.id)) debutantsAffilies++;
    }
    debutants.push(nouveaux);
    (niveauGrille[s] ??= []).push(moy(tit.map((p) => eng.niveauPilote(p, false))));
    (ageGrille[s] ??= []).push(moy(tit.map((p) => m.date.annee - p.anneeNaissance)));
    for (const p of Object.values(m.tables['personnes']) as any[]) if (p.junior?.annee === m.date.annee) { baquetsJuniors++; if (p.junior.subventionne) baquetsSubventionnes++; if (typeof p.junior.prixMEUR === 'number') prixPayes.push(p.junior.prixMEUR); }
    (population[s] ??= []).push(Object.values(m.tables['personnes']).filter((p: any) => p.statut !== 'retraite').length);
    if (s === S - 1 && g === 1) {
      const rep: Record<string, number> = {};
      for (const p of Object.values(m.tables['personnes']) as any[]) if (p.statut !== 'retraite') rep[`${p.poste}/${p.statut}`] = (rep[`${p.poste}/${p.statut}`] ?? 0) + 1;
      console.log('Répartition (graine 1, fin) : ' + Object.entries(rep).sort().map(([k, v]) => `${k} ${v}`).join(' · '));
    }
  }
  for (const pr of Object.values(m.tables['promesses'] ?? {}) as any[]) { if (pr.type === 'titularisation' && pr.statut === 'tenue') promessesTenues++; if (pr.type === 'titularisation' && pr.statut === 'rompue') promessesRompues++; }
  const reps = (Object.values(m.tables['academies'] ?? {}) as any[]).map((a) => a.reputation);
  if (reps.length) ecartsReputationAcademies.push(Math.max(...reps) - Math.min(...reps));
  // Phase 6b : champions Apex 2 promus en F1 ; talents bloqués ; pilotes payants moyens qui atteignent la F1.
  for (const p of Object.values(m.tables['personnes']) as any[]) {
    if (!p.poste.startsWith('pilote') || p.origine !== 'generee') continue;
    const auF1 = (p.carriere?.saisonsF1 ?? 0) > 0 || (p.poste === 'pilote_titulaire' && p.statut === 'actif');
    if ((p.carriere?.juniors ?? []).some((r: any) => r.categorie === 'apex2' && r.titre)) { championsApex2++; if (auF1) championsApex2Promus++; }
    const fini = p.statut === 'retraite' || auF1;
    if (!fini) continue;
    if (p.potentiel >= 17) { talents++; if (!auF1) talentsBloques++; }
    if ((p.budgetFamilleMEUR ?? 0) >= 3 && p.potentiel <= 14) { payantsMoyens++; if (auF1) payantsMoyensF1++; }
  }
  // Pépites (potentiel ≥ 18) nées dans les cohortes générées, et titres.
  const pal = Object.values(m.tables['palmares']) as any[];
  for (const p of Object.values(m.tables['personnes']) as any[]) {
    if (p.origine !== 'generee' || !p.poste.startsWith('pilote') || p.potentiel < 18) continue;
    championsPepites.pepites++;
    if (p.anneeNaissance >= 2027 - 14) championsPepites.nesCohortes++; // nés dans les cohortes annuelles (hors population de départ)
    if (pal.some((x) => x.championPilote === p.id)) championsPepites.championnes++;
  }
  for (const x of pal) {
    const p = m.tables['personnes'][x.championPilote] as any;
    if (p && x.saison >= 2027) ageTitre.push(x.saison - p.anneeNaissance);
  }
}
const parSaison = (k: string) => ((compteurs[k] ?? 0) / N / S).toFixed(2);
console.log(`${N} graines × ${S} saisons`);
console.log(`Débutants en F1 par saison : ${moy(debutants).toFixed(2)} (cible D-072 : 2 à 4)`);
console.log(`Carrière en F1 à la retraite (saisons) : moyenne ${moy(carriereF1).toFixed(1)}, 10 % ${q(carriereF1, 0.1)}, 90 % ${q(carriereF1, 0.9)}, max ${q(carriereF1, 1)} (cible : 6 à 10)`);
console.log(`Âge de retraite des pilotes de F1 : moyenne ${moy(ageRetraite).toFixed(1)}, 10 % ${q(ageRetraite, 0.1)}, 90 % ${q(ageRetraite, 0.9)}`);
console.log(`Âge de retraite du personnel : moyenne ${moy(ageRetraitePersonnel).toFixed(1)}, 10 % ${q(ageRetraitePersonnel, 0.1)}, 90 % ${q(ageRetraitePersonnel, 0.9)}`);
console.log(`Âge des champions (titres simulés) : moyenne ${moy(ageTitre).toFixed(1)}, 10 % ${q(ageTitre, 0.1)}, 90 % ${q(ageTitre, 0.9)}`);
const points = [0, ...Array.from({ length: Math.floor(S / 5) }, (_, i) => 5 * (i + 1) - 1)].filter((s) => s < S);
console.log('Niveau moyen des titulaires (dérive) : ' + points.map((s) => `${2027 + s} ${moy(niveauGrille[s]!).toFixed(2)}`).join(' · '));
console.log('Âge moyen des titulaires : ' + points.map((s) => `${2027 + s} ${moy(ageGrille[s]!).toFixed(1)}`).join(' · '));
console.log('Population (hors retraités) : ' + points.map((s) => `${2027 + s} ${moy(population[s]!).toFixed(0)}`).join(' · '));
for (const k of ['abandon', 'personne.retraite', 'personne.retour', 'personne.reconversion', 'personne.declic', 'personne.stagnation', 'recrutement.genere', 'pilote.titularisation']) console.log(`${k} : ${parSaison(k)} par saison`);
console.log(`Âge des débutants en F1 : moyenne ${moy(ageDebut).toFixed(1)}, 10 % ${q(ageDebut, 0.1)}, 90 % ${q(ageDebut, 0.9)}`);
console.log(`Débutants passés par le top 5 de l'Apex 2 : ${(100 * debutantsTop5Apex2 / Math.max(1, debutantsTotal)).toFixed(0)} %`);
console.log(`Champions Apex 2 promus en F1 : ${championsApex2Promus}/${championsApex2} (${(100 * championsApex2Promus / Math.max(1, championsApex2)).toFixed(0)} %)`);
console.log(`Talents (potentiel ≥ 17, carrière finie) jamais arrivés en F1 : ${talentsBloques}/${talents} (${(100 * talentsBloques / Math.max(1, talents)).toFixed(0)} %)`);
console.log(`Pilotes payants moyens (budget ≥ 3 M€, potentiel ≤ 14) arrivés en F1 : ${payantsMoyensF1}/${payantsMoyens} (${(100 * payantsMoyensF1 / Math.max(1, payantsMoyens)).toFixed(0)} %)`);
console.log(`Baquets juniors subventionnés (obtenus sans pouvoir payer le prix demandé) : ${(100 * baquetsSubventionnes / Math.max(1, baquetsJuniors)).toFixed(0)} % ; prix moyen réellement payé : ${moy(prixPayes).toFixed(2)} M€`);
console.log(`Débutants passés par une académie : ${(100 * debutantsAffilies / Math.max(1, debutantsTotal)).toFixed(0)} %`);
console.log(`Promesses de titularisation tenues / rompues (fin de partie) : ${promessesTenues} / ${promessesRompues}`);
console.log(`Mécènes trouvés : ${(mecenes / N / S).toFixed(2)} par saison ; écart de réputation entre la meilleure et la moins bonne académie : ${moy(ecartsReputationAcademies).toFixed(0)} points`);
console.log(`Pépites générées (potentiel ≥ 18) : ${(championsPepites.pepites / N).toFixed(1)} par partie (dont ${((10 * championsPepites.nesCohortes) / N / S).toFixed(2)} par décennie issues des cohortes annuelles ; cible D-102 : ≈ 2), championnes : ${championsPepites.championnes}`);
