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
// Phase 7a : marché des transferts.
let signatures = 0, debauchages = 0, preAccords = 0, concurrentes = 0, contreAttaques = 0, indemnitesMEUR = 0, signaturesMoins23 = 0; const salaireTop5: number[][] = [];
// Audit 6b n°2 : causes probables des talents qui n'arrivent jamais en F1.
const causesBlocage: Record<string, number> = { financier: 0, sportif: 0, contractuel: 0, opportunites: 0, indetermine: 0 };
const { CATEGORIES_JUNIORS } = await import(`${racine}/src/engine/balance/juniors.ts`);
// D-131 : pilotes payants.
let signaturesApport = 0, signaturesPilotes = 0, engagementsJuniors = 0, engagementsTenus = 0, remplacementsSponsors = 0; const niveauxApport: number[] = [], niveauxAutres: number[] = [], apportsNets: number[] = [];
let debutantsTop5Apex2 = 0, debutantsTotal = 0, championsApex2 = 0, championsApex2Promus = 0, talentsBloques = 0, talents = 0, payantsMoyensF1 = 0, payantsMoyens = 0;

for (let g = 1; g <= N; g++) {
  const m = sc.creerMonde(g);
  const mo = sc.creerMoteur();
  // Audit de la phase 7 (priorité 4) : les retraités sont archivés au bout de 5 ans (D-121). On garde ici une copie de chaque pilote
  // et de chaque promesse telle que vue en dernier, pour mesurer aussi les carrières terminées et archivées.
  const vus7 = new Map<string, any>();
  const promesses7 = new Map<string, any>();
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
      if (e.type === 'marche.signature') {
        signatures++; if (e.contexte?.debauchage) debauchages++; if (e.contexte?.debut >= e.date.annee + 2) preAccords++;
        if ((e.contexte?.offresConcurrentes ?? 1) > 1) concurrentes++; indemnitesMEUR += e.contexte?.indemnite ?? 0;
        const pp = m.tables['personnes'][e.acteurs[0].id] as any; if (pp && e.contexte.debut - pp.anneeNaissance < 23) signaturesMoins23++;
      }
      if (e.type === 'marche.contre_attaque') contreAttaques++;
      if (e.type === 'marche.signature' && e.contexte?.apportNet !== undefined) {
        signaturesPilotes++;
        const pp = m.tables['personnes'][e.acteurs[0].id] as any;
        const niv = pp ? eng.niveauPilote(pp, false) : NaN;
        if (e.contexte.apportNet > 0) { signaturesApport++; apportsNets.push(e.contexte.apportNet); niveauxApport.push(niv); } else niveauxAutres.push(niv);
      }
      if (e.type === 'sponsor.engagement_junior') engagementsJuniors++;
      if (e.type === 'sponsor.personnel' && e.contexte?.origine === 'engagement_junior') engagementsTenus++;
      if (e.type === 'sponsor.remplace') remplacementsSponsors++;
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
    for (const p of Object.values(m.tables['personnes']) as any[]) if (p.junior && p.junior.annee >= m.date.annee - 1) { baquetsJuniors++; if (p.junior.subventionne) baquetsSubventionnes++; if (typeof p.junior.prixMEUR === 'number') prixPayes.push(p.junior.prixMEUR); }
    const sal = (Object.values(m.tables['contrats']) as any[]).filter((c) => c.statut === 'actif' && c.type === 'emploi' && c.poste === 'pilote_titulaire').map((c) => c.salaireMEUR).sort((a, b) => b - a);
    (salaireTop5[s] ??= []).push(moy(sal.slice(0, 5)));
    for (const p of Object.values(m.tables['personnes']) as any[]) if (p.poste.startsWith('pilote') || p.statut === 'retraite') vus7.set(p.id, structuredClone(p));
    for (const pr of Object.values(m.tables['promesses'] ?? {}) as any[]) if (pr.type === 'titularisation') promesses7.set(pr.id, { ...pr });
    (population[s] ??= []).push(Object.values(m.tables['personnes']).filter((p: any) => p.statut !== 'retraite').length);
    if (s === S - 1 && g === 1) {
      const rep: Record<string, number> = {};
      for (const p of Object.values(m.tables['personnes']) as any[]) if (p.statut !== 'retraite') rep[`${p.poste}/${p.statut}`] = (rep[`${p.poste}/${p.statut}`] ?? 0) + 1;
      console.log('Répartition (graine 1, fin) : ' + Object.entries(rep).sort().map(([k, v]) => `${k} ${v}`).join(' · '));
    }
  }
  for (const pr of Object.values(m.tables['promesses'] ?? {}) as any[]) if (pr.type === 'titularisation') promesses7.set(pr.id, { ...pr });
  for (const pr of promesses7.values()) { if (pr.statut === 'tenue') promessesTenues++; if (pr.statut === 'rompue') promessesRompues++; }
  for (const p of Object.values(m.tables['personnes']) as any[]) vus7.set(p.id, p);
  const tousPilotes = [...vus7.values()];
  const reps = (Object.values(m.tables['academies'] ?? {}) as any[]).map((a) => a.reputation);
  if (reps.length) ecartsReputationAcademies.push(Math.max(...reps) - Math.min(...reps));
  // Phase 6b : champions Apex 2 promus en F1 ; talents bloqués ; pilotes payants moyens qui atteignent la F1 (archivés compris).
  for (const p of tousPilotes) {
    if (!p.poste.startsWith('pilote') || p.origine !== 'generee') continue;
    const auF1 = (p.carriere?.saisonsF1 ?? 0) > 0 || (p.poste === 'pilote_titulaire' && p.statut === 'actif');
    if ((p.carriere?.juniors ?? []).some((r: any) => r.categorie === 'apex2' && r.titre)) { championsApex2++; if (auF1) championsApex2Promus++; }
    const fini = p.statut === 'retraite' || auF1;
    if (!fini) continue;
    if (p.potentiel >= 17) {
      talents++;
      if (!auF1) {
        talentsBloques++;
        // Classement par cause probable, dans cet ordre (une seule cause par talent) :
        // - financier : jamais de baquet junior, sans académie ni mécène, budget familial sous le prix d'un baquet d'Apex 3 ;
        // - sportif : des saisons juniors, mais ni top 5 ni titre en Apex 2 (résultats insuffisants pour les recruteurs) ;
        // - contractuel : bons résultats, mais encore affilié à une académie (option prioritaire : seules deux écuries peuvent l'engager) ;
        // - opportunités : bons résultats, libre de tout lien, et pourtant aucun baquet de F1 ;
        // - indéterminé : le reste (par exemple : baquets juniors obtenus mais carrière interrompue avant l'Apex 2).
        const saisons = p.carriere?.juniors ?? [];
        const bons = saisons.some((r: any) => r.categorie === 'apex2' && (r.rang <= 5 || r.titre));
        const affilie = (Object.values(m.tables['academies'] ?? {}) as any[]).some((a) => (a.anciens ?? []).includes(p.id)) || (Object.values(m.tables['contrats']) as any[]).some((c) => c.type === 'affiliation' && c.personne === p.id);
        const affilieFin = (Object.values(m.tables['contrats']) as any[]).some((c) => c.type === 'affiliation' && c.personne === p.id && (c.statut === 'actif' || c.fin >= (p.retraiteDepuis ?? m.date.annee) - 1));
        let cause = 'indetermine';
        if (saisons.length === 0 && !affilie && !p.mecene && (p.budgetFamilleMEUR ?? 0) < CATEGORIES_JUNIORS.apex3.prixBaquetMEUR) cause = 'financier';
        else if (saisons.length > 0 && saisons.some((r: any) => r.categorie === 'apex2') && !bons) cause = 'sportif';
        else if (bons && affilieFin) cause = 'contractuel';
        else if (bons) cause = 'opportunites';
        causesBlocage[cause]++;
      }
    }
    if ((p.budgetFamilleMEUR ?? 0) >= 3 && p.potentiel <= 14) { payantsMoyens++; if (auF1) payantsMoyensF1++; }
  }
  // Pépites (potentiel ≥ 18) nées dans les cohortes générées, et titres.
  const pal = Object.values(m.tables['palmares']) as any[];
  for (const p of tousPilotes) {
    if (p.origine !== 'generee' || !p.poste.startsWith('pilote') || p.potentiel < 18) continue;
    championsPepites.pepites++;
    if (p.anneeNaissance >= 2027 - 14) championsPepites.nesCohortes++; // nés dans les cohortes annuelles (hors population de départ)
    if (pal.some((x) => x.championPilote === p.id)) championsPepites.championnes++;
  }
  for (const x of pal) {
    const p = (m.tables['personnes'][x.championPilote] ?? m.tables['archives']?.[x.championPilote] ?? vus7.get(x.championPilote)) as any;
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
console.log(`  dont causes probables (audit 6b n°2) : ${Object.entries(causesBlocage).map(([k, v]) => `${({ financier: 'financière', sportif: 'sportive', contractuel: 'contractuelle (affilié)', opportunites: 'manque d’opportunités', indetermine: 'indéterminée' } as Record<string, string>)[k]} ${v}`).join(' · ')}`);
console.log(`Pilotes payants moyens (budget ≥ 3 M€, potentiel ≤ 14) arrivés en F1 : ${payantsMoyensF1}/${payantsMoyens} (${(100 * payantsMoyensF1 / Math.max(1, payantsMoyens)).toFixed(0)} %)`);
console.log(`Baquets juniors subventionnés (obtenus sans pouvoir payer le prix demandé) : ${(100 * baquetsSubventionnes / Math.max(1, baquetsJuniors)).toFixed(0)} % ; prix moyen réellement payé : ${moy(prixPayes).toFixed(2)} M€`);
console.log(`Débutants passés par une académie : ${(100 * debutantsAffilies / Math.max(1, debutantsTotal)).toFixed(0)} %`);
console.log(`Promesses de titularisation tenues / rompues (fin de partie) : ${promessesTenues} / ${promessesRompues}`);
console.log(`Mécènes trouvés : ${(mecenes / N / S).toFixed(2)} par saison ; écart de réputation entre la meilleure et la moins bonne académie : ${moy(ecartsReputationAcademies).toFixed(0)} points`);
console.log(`Marché (7a) : ${(signatures / N / S).toFixed(2)} signatures par saison, dont ${(100 * concurrentes / Math.max(1, signatures)).toFixed(0)} % face à des offres concurrentes ; pré-accords à deux saisons ${(preAccords / N / S).toFixed(2)} ; débauchages ${(debauchages / N / S).toFixed(2)} par saison (indemnités ${(indemnitesMEUR / N / S).toFixed(1)} M€/saison) ; contre-attaques ${(contreAttaques / N / S).toFixed(2)} ; signatures à moins de 23 ans au début du contrat ${(100 * signaturesMoins23 / Math.max(1, signatures)).toFixed(0)} %`);
console.log('Salaire moyen des 5 pilotes les mieux payés (M€, inflation) : ' + points.map((s) => `${2027 + s} ${moy(salaireTop5[s]!).toFixed(1)}`).join(' · '));
console.log(`Pilotes payants (D-131) : ${(100 * signaturesApport / Math.max(1, signaturesPilotes)).toFixed(0)} % des signatures de pilotes avec un apport commercial net (moyenne ${moy(apportsNets).toFixed(1)} M€) ; niveau des recrues avec apport ${moy(niveauxApport.filter(Number.isFinite)).toFixed(2)} contre ${moy(niveauxAutres.filter(Number.isFinite)).toFixed(2)} ; engagements juniors ${(engagementsJuniors / N / S).toFixed(2)} par saison, tenus à l'arrivée en F1 ${(engagementsTenus / N / S).toFixed(2)} ; sponsors remplacés ${(remplacementsSponsors / N / S).toFixed(2)} par saison`);
console.log(`Pépites générées (potentiel ≥ 18) : ${(championsPepites.pepites / N).toFixed(1)} par partie (dont ${((10 * championsPepites.nesCohortes) / N / S).toFixed(2)} par décennie issues des cohortes annuelles ; cible D-102 : ≈ 2), championnes : ${championsPepites.championnes}`);
