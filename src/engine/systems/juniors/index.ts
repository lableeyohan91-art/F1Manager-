/**
 * Filières juniors — phase 6b-1 (docs/systemes/phase-6b-filieres-juniors.md, D-112).
 *
 * - Écuries juniors (table séparée des écuries de F1) en Apex 3 et Apex 2, voitures identiques, qualité d'équipe.
 * - Marché annuel des baquets : talent estimé et réputation contre argent apporté ; remise pour les grands talents.
 * - Courses sur des circuits du calendrier principal, les mêmes semaines : expérience, connaissance des circuits.
 * - Fin de saison : classements, résumés de carrière, réputations (pilotes et écuries), rivalités, classements
 *   abstraits du karting et de l'Apex 4 (D-071).
 * - Passé simulé de 3 saisons au départ, sans effet sur la grille de F1 de 2027.
 * Les jeunes restent « libres » au sens de la F1 : le recrutement F1 peut les engager.
 */

import {
  BAREME_JUNIOR, BUDGET_FAMILLE, CATEGORIES_JUNIORS, CLASSEMENTS_ABSTRAITS, COURSE_JUNIOR, DETAIL_JUNIORS_SAISONS, ECURIES_JUNIORS,
  EVOLUTION_ECURIE_JUNIOR, MARCHE_BAQUETS, PASSE_JUNIOR_ANNEES, PLUIE_PASSE_JUNIOR, QUALITE_ECURIE_JUNIOR, REPUTATION, RESUMES_JUNIORS_MAX, RIVALITE_JUNIOR_POINTS, type CategorieJunior,
} from '../../balance/juniors';
import { DIFFICULTE_CIRCUIT, ECART_PILOTE_PAR_POINT } from '../../balance/course';
import { ajouterEvenement } from '../../core/evenements';
import { nouvelIdentifiant } from '../../core/identifiants';
import { flux, tirageLocal, type Moteur, type Systeme } from '../../core/moteur';
import { idsTries, parametre, table, type Entite, type Monde } from '../../core/monde';
import { TABLE_REFERENTIEL, type Referentiel } from '../../generation/construction';
import {
  TABLES, type Circuit, type EcurieJunior, type GrandPrix, type MancheJunior, type Personne, type ResultatJunior, type Saison, type SaisonJunior,
} from '../../model/types';
import { lireEvenement } from '../memoire';
import { apresGrandPrix, modificateurNiveau } from '../carriere/performance';
import { niveauCarriere } from '../carriere/profil';
import { potentielEstime } from '../carriere/estimation';
import { ecuriesActives, niveauPilote } from '../saison/performance';
import { affiliationDe, commandeMissionReperage, finDeSaisonAcademies, financementExterieur, intersaisonAcademies, mettreAJourConnaissances, miSaisonAcademies } from './academies';
import { ACADEMIE, PLACEMENT_PARTENAIRE } from '../../balance/juniors';

export * from './academies';

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));
const CATEGORIES = Object.keys(CATEGORIES_JUNIORS) as CategorieJunior[];
/** Semaine de clôture des saisons juniors (avec la fin de saison principale). */
const SEMAINE_CLOTURE = 49;

export const ecuriesJuniors = (m: Monde) => idsTries(table(m, TABLES.ecuriesJuniors)).map((id) => table(m, TABLES.ecuriesJuniors)[id] as unknown as EcurieJunior);
export const saisonJunior = (m: Monde, cat: CategorieJunior, annee: number) => table(m, TABLES.saisonsJuniors)[`sj_${cat}_${annee}`] as unknown as SaisonJunior | undefined;
const personnes = (m: Monde) => idsTries(table(m, TABLES.personnes)).map((id) => table(m, TABLES.personnes)[id] as unknown as Personne);

/* ---------------------------------------------------------------- Écuries juniors */

/** Crée les écuries juniors si elles n'existent pas (construction du monde, ou sauvegarde migrée). */
export function initialiserEcuriesJuniors(monde: Monde): void {
  if (Object.keys(table(monde, TABLES.ecuriesJuniors)).length) return;
  const ref = table(monde, TABLE_REFERENTIEL)['referentiel'] as unknown as Referentiel | undefined;
  const noms = [...(ref?.ecuriesJuniors ?? [])];
  const f = flux(monde, 'juniors');
  const f1 = ecuriesActives(monde).map((e) => e.id);
  let k = 0;
  for (const cat of CATEGORIES) {
    const c = CATEGORIES_JUNIORS[cat];
    for (let i = 0; i < c.ecuries; i++) {
      const n = noms[k] ?? { nom: `Écurie junior ${k + 1}`, nationalite: 'GBR' };
      k++;
      const qualite = Math.round(borner(f.normale(ECURIES_JUNIORS.qualite.moyenne, ECURIES_JUNIORS.qualite.ecartType), QUALITE_ECURIE_JUNIOR.min, QUALITE_ECURIE_JUNIOR.max));
      const e: EcurieJunior = {
        id: nouvelIdentifiant(monde, 'ejr'), nom: n.nom, nationalite: n.nationalite, categorie: cat, qualite,
        reputation: Math.round(borner(QUALITE_ECURIE_JUNIOR.reputationBase + QUALITE_ECURIE_JUNIOR.reputationParPointQualite * (qualite - ECURIES_JUNIORS.qualite.moyenne), 0, 100)),
        prixBaquetMEUR: Math.round(c.prixBaquetMEUR * borner(1 + ECURIES_JUNIORS.variationPrix * ((qualite - ECURIES_JUNIORS.qualite.moyenne) / ECURIES_JUNIORS.qualite.ecartType), 0.4, 1.8) * 100) / 100,
        ...(f1.length && f.chance(ECURIES_JUNIORS.partPartenaires) ? { partenaire: f.choisir(f1) } : {}),
      };
      table(monde, TABLES.ecuriesJuniors)[e.id] = e as unknown as Entite;
    }
  }
}

/* ---------------------------------------------------------------- Marché des baquets */

/** Budget familial annuel (M€), tiré une fois par personne (log-normale). */
export function budgetFamille(monde: Monde, p: Personne): number {
  if (p.budgetFamilleMEUR === undefined) {
    const f = tirageLocal(monde, 'juniors.famille', p.id);
    p.budgetFamilleMEUR = Math.round(borner(BUDGET_FAMILLE.mediane * Math.exp(BUDGET_FAMILLE.sigma * f.normale(0, 1)), 0, BUDGET_FAMILLE.max) * 100) / 100;
  }
  return p.budgetFamilleMEUR;
}

function talent(monde: Monde, p: Personne): { niveau: number; potentiel: number } {
  return { niveau: niveauCarriere(p), potentiel: potentielEstime(monde, null, p).centre };
}

function eligible(p: Personne, cat: CategorieJunior, annee: number): boolean {
  if (p.statut !== 'libre' || !p.poste.startsWith('pilote') || (p.carriere?.saisonsF1 ?? 0) > 0) return false;
  const age = annee - p.anneeNaissance;
  const c = CATEGORIES_JUNIORS[cat];
  if (age < c.ageMin || age > c.ageMax) return false;
  // L'Apex 2 se gagne : il faut être passé par l'Apex 3, ou avoir une réputation déjà forte.
  if (cat === 'apex2') {
    return (p.carriere?.juniors ?? []).some((r) => r.categorie === 'apex3') || (p.reputationJeune ?? 0) >= MARCHE_BAQUETS.reputationApex2SansApex3 || age >= MARCHE_BAQUETS.ageApex2SansApex3;
  }
  return true;
}

/**
 * Marché annuel : les écuries les plus attirantes choisissent d'abord ; chacune prend le meilleur candidat qui peut payer
 * le prix qu'elle lui demande (remise pour les grands talents). Apex 2 d'abord, puis Apex 3. Mêmes règles pour toutes les écuries.
 */
export function marcheBaquets(monde: Monde, annee: number): void {
  initialiserEcuriesJuniors(monde);
  const tous = personnes(monde);
  const precedent = new Map(tous.filter((p) => p.junior).map((p) => [p.id, p.junior!.ecurie]));
  for (const p of tous) delete p.junior;
  for (const cat of [...CATEGORIES].sort((a, b) => CATEGORIES_JUNIORS[b].rangCategorie - CATEGORIES_JUNIORS[a].rangCategorie)) {
    const equipes = ecuriesJuniors(monde).filter((e) => e.categorie === cat).sort((a, b) => b.qualite + b.reputation / 10 - (a.qualite + a.reputation / 10) || (a.id < b.id ? -1 : 1));
    const candidats = tous.filter((p) => !p.junior && eligible(p, cat, annee));
    // Phase 6b-2 : budget = famille + mécène + financement de l'académie.
    const infos = new Map(candidats.map((p) => [p.id, { ...talent(monde, p), budget: budgetFamille(monde, p) + financementExterieur(monde, p, annee), academie: affiliationDe(monde, p.id)?.organisation }]));
    for (let tour = 0; tour < CATEGORIES_JUNIORS[cat].pilotesParEcurie; tour++) {
      for (const e of equipes) {
        let meilleur: { p: Personne; score: number; prix: number } | undefined;
        let repli: { p: Personne; score: number; prix: number } | undefined;
        for (const p of candidats) {
          if (p.junior) continue;
          const i = infos.get(p.id)!;
          const t = 0.5 * i.niveau + 0.5 * i.potentiel;
          const prix = e.prixBaquetMEUR * borner(1 - MARCHE_BAQUETS.remiseParPoint * (t - MARCHE_BAQUETS.remiseSeuil), 0, 1);
          const abordable = i.budget >= prix;
          const argent = (Math.min(i.budget, e.prixBaquetMEUR) / e.prixBaquetMEUR) * MARCHE_BAQUETS.poidsArgent * (MARCHE_BAQUETS.poidsArgentQualiteRef / e.qualite);
          const score = MARCHE_BAQUETS.poidsNiveau * i.niveau + MARCHE_BAQUETS.poidsPotentiel * i.potentiel + MARCHE_BAQUETS.poidsReputation * (p.reputationJeune ?? 0)
            + argent + (precedent.get(p.id) === e.id ? MARCHE_BAQUETS.continuite : 0) + (i.academie && e.partenaire === i.academie ? PLACEMENT_PARTENAIRE : 0) + tirageLocal(monde, 'juniors.marche', e.id, p.id, annee).normale(0, MARCHE_BAQUETS.alea);
          if (abordable && (!meilleur || score > meilleur.score)) meilleur = { p, score, prix };
          if (!repli || score > repli.score) repli = { p, score, prix: Math.min(prix, i.budget) };
        }
        // Une écurie ne roule pas à vide : faute de candidat capable de payer son prix, elle prend le meilleur au prix qu'il peut payer.
        const choix = meilleur ?? repli;
        // Audit 6b : le prix réellement payé est conservé ; « subventionné » = baquet obtenu sans pouvoir payer le prix demandé.
        if (choix) choix.p.junior = { categorie: cat, ecurie: e.id, annee, prixMEUR: Math.round(choix.prix * 100) / 100, subventionne: !meilleur };
      }
    }
  }
}

/* ---------------------------------------------------------------- Saisons et courses */

/** Calendrier junior : manches réparties sur le calendrier principal (mêmes circuits, mêmes semaines). */
export function creerSaisonsJuniors(monde: Monde, annee: number): void {
  const s = table(monde, TABLES.saisons)[`ssn_${annee}`] as unknown as Saison | undefined;
  if (!s) return;
  const gps = s.calendrier.map((id) => table(monde, TABLES.grandsPrix)[id] as unknown as GrandPrix);
  for (const cat of CATEGORIES) {
    if (saisonJunior(monde, cat, annee)) continue;
    const n = Math.min(CATEGORIES_JUNIORS[cat].manches, gps.length);
    const manches: MancheJunior[] = [];
    for (let k = 0; k < n; k++) {
      const gp = gps[n === 1 ? 0 : Math.round((k * (gps.length - 1)) / (n - 1))]!;
      manches.push({ manche: k + 1, circuit: gp.circuit, semaine: gp.semaine, pluie: false, termine: false, resultats: [] });
    }
    const sj: SaisonJunior = { id: `sj_${cat}_${annee}`, categorie: cat, annee, manches, classement: [], classementEcuries: [], termine: false };
    table(monde, TABLES.saisonsJuniors)[sj.id] = sj as unknown as Entite;
  }
}

/** Une manche junior : même modèle que la F1 (niveau sur le circuit, affinité, nouveauté), voitures identiques, qualité d'équipe. */
export function simulerMancheJunior(monde: Monde, sj: SaisonJunior, m: MancheJunior, pluie: boolean): void {
  const circuit = table(monde, TABLES.circuits)[m.circuit] as unknown as Circuit;
  const equipes = new Map(ecuriesJuniors(monde).map((e) => [e.id, e]));
  const partants = personnes(monde).filter((p) => p.junior?.categorie === sj.categorie && p.junior.annee === sj.annee && p.statut === 'libre');
  const ecart = parametre(monde, 'course.ecartPiloteParPoint', ECART_PILOTE_PAR_POINT) * (DIFFICULTE_CIRCUIT.min + DIFFICULTE_CIRCUIT.parPoint * circuit.exigences.difficulte);
  const sigma = COURSE_JUNIOR.aleaSigma * (pluie ? COURSE_JUNIOR.multiplicateurPluie : 1);
  const calcul = partants.map((p) => {
    const f = tirageLocal(monde, 'juniors.course', sj.id, m.manche, p.id);
    const mod = modificateurNiveau(monde, p, circuit);
    const equipe = equipes.get(p.junior!.ecurie)?.qualite ?? 10;
    const temps = -((niveauPilote(p, pluie, circuit.exigences) + mod.affinite + mod.nouveaute) * ecart + equipe * COURSE_JUNIOR.ecartEquipeParPoint) + f.normale(0, sigma);
    const incident = f.chance((COURSE_JUNIOR.incidentBase + (20 - (p.competences['regularite'] ?? 10)) * COURSE_JUNIOR.incidentParPoint) * (pluie ? COURSE_JUNIOR.incidentPluie : 1));
    return { p, temps, incident };
  });
  const arrives = calcul.filter((c) => !c.incident).sort((a, b) => a.temps - b.temps || (a.p.id < b.p.id ? -1 : 1));
  const resultats: ResultatJunior[] = [
    ...arrives.map((c, i) => ({ pilote: c.p.id, ecurie: c.p.junior!.ecurie, position: i + 1, points: BAREME_JUNIOR[i] ?? 0 })),
    ...calcul.filter((c) => c.incident).map((c) => ({ pilote: c.p.id, ecurie: c.p.junior!.ecurie, position: null, points: 0 })),
  ];
  m.resultats = resultats;
  m.pluie = pluie;
  m.termine = true;
  for (const r of resultats) {
    let l = sj.classement.find((x) => x.pilote === r.pilote);
    if (!l) { l = { pilote: r.pilote, ecurie: r.ecurie, points: 0, victoires: 0, podiums: 0 }; sj.classement.push(l); }
    l.points += r.points;
    if (r.position === 1) l.victoires++;
    if (r.position !== null && r.position <= 3) l.podiums++;
    let le = sj.classementEcuries.find((x) => x.ecurie === r.ecurie);
    if (!le) { le = { ecurie: r.ecurie, points: 0 }; sj.classementEcuries.push(le); }
    le.points += r.points;
  }
  sj.classement.sort((a, b) => b.points - a.points || b.victoires - a.victoires || (a.pilote < b.pilote ? -1 : 1));
  sj.classementEcuries.sort((a, b) => b.points - a.points || (a.ecurie < b.ecurie ? -1 : 1));
  // Expérience junior et connaissance du circuit (D-106), affinités (D-108).
  apresGrandPrix(monde, circuit, `${sj.id}-${m.manche}`, pluie, calcul.map((c) => ({ p: c.p, position: resultats.find((r) => r.pilote === c.p.id)?.position ?? null, incident: c.incident })), true);
}

/** Fin de saison junior : résumés, réputations des pilotes et des écuries, rivalités, champion. */
export function cloturerSaisonJunior(monde: Monde, sj: SaisonJunior): void {
  if (sj.termine) return;
  sj.termine = true;
  const n = sj.classement.length;
  const valeur = REPUTATION.champion[sj.categorie];
  sj.classement.forEach((l, i) => {
    const p = table(monde, TABLES.personnes)[l.pilote] as unknown as Personne | undefined;
    if (!p) return;
    const resume = { annee: sj.annee, categorie: sj.categorie, ecurie: l.ecurie, rang: i + 1, points: l.points, victoires: l.victoires, titre: i === 0 };
    if (p.carriere) {
      p.carriere.juniors = [...(p.carriere.juniors ?? []), resume].slice(-RESUMES_JUNIORS_MAX);
    }
    const score = valeur * (n > 1 ? 1 - (REPUTATION.etendue * i) / (n - 1) : 1);
    p.reputationJeune = Math.round(REPUTATION.inertie * (p.reputationJeune ?? 0) + (1 - REPUTATION.inertie) * Math.max(score, p.reputationJeune ?? 0));
  });
  const champion = sj.classement[0];
  if (champion) {
    sj.champion = champion.pilote;
    const p = table(monde, TABLES.personnes)[champion.pilote] as unknown as Personne | undefined;
    const e = table(monde, TABLES.ecuriesJuniors)[champion.ecurie] as unknown as EcurieJunior | undefined;
    const ev = ajouterEvenement(monde, {
      type: 'junior.titre', acteurs: [{ id: champion.pilote, role: 'champion' }], importance: 3, visibilite: 'public',
      contexte: { categorie: sj.categorie, annee: sj.annee, points: champion.points, ecurie: champion.ecurie },
      texte: p ? `${p.prenom} ${p.nom} remporte le titre ${CATEGORIES_JUNIORS[sj.categorie].libelle} ${sj.annee}${e ? ` avec ${e.nom}` : ''}.` : undefined,
    });
    // Rivalité : une lutte serrée pour le titre laisse un souvenir réciproque, qui peut ressurgir en F1.
    const second = sj.classement[1];
    if (second && champion.points - second.points <= RIVALITE_JUNIOR_POINTS) {
      lireEvenement(monde, champion.pilote, second.pilote, 'rivalite', ev.id);
      lireEvenement(monde, second.pilote, champion.pilote, 'rivalite', ev.id);
    }
  }
  // Réputation et qualité des écuries juniors.
  const m = sj.classementEcuries.length;
  sj.classementEcuries.forEach((l, i) => {
    const e = table(monde, TABLES.ecuriesJuniors)[l.ecurie] as unknown as EcurieJunior | undefined;
    if (!e) return;
    const cible = 100 * (m > 1 ? 1 - i / (m - 1) : 1);
    e.reputation = Math.round(EVOLUTION_ECURIE_JUNIOR.inertie * e.reputation + (1 - EVOLUTION_ECURIE_JUNIOR.inertie) * cible);
    const qualiteVisee = QUALITE_ECURIE_JUNIOR.base + QUALITE_ECURIE_JUNIOR.parPointReputation * e.reputation;
    e.qualite = Math.round(borner(e.qualite + borner(qualiteVisee - e.qualite, -EVOLUTION_ECURIE_JUNIOR.pasQualite, EVOLUTION_ECURIE_JUNIOR.pasQualite), QUALITE_ECURIE_JUNIOR.min, QUALITE_ECURIE_JUNIOR.max) * 10) / 10;
  });
}

/** Classements abstraits du karting et de l'Apex 4 (D-071) : réputation des jeunes sans baquet, par tranche d'âge. */
export function classementsAbstraits(monde: Monde, annee: number): void {
  const groupes: Record<'karting' | 'apex4', Personne[]> = { karting: [], apex4: [] };
  for (const p of personnes(monde)) {
    if (p.statut !== 'libre' || !p.poste.startsWith('pilote') || p.junior?.annee === annee) continue;
    const age = annee - p.anneeNaissance;
    if (age <= CLASSEMENTS_ABSTRAITS.kartingAgeMax) groupes.karting.push(p);
    else if (age <= CLASSEMENTS_ABSTRAITS.apex4AgeMax) groupes.apex4.push(p);
  }
  for (const [nom, liste] of Object.entries(groupes) as ['karting' | 'apex4', Personne[]][]) {
    const notes = liste.map((p) => ({ p, v: niveauCarriere(p) + tirageLocal(monde, 'juniors.abstrait', nom, p.id, annee).normale(0, REPUTATION.aleaClassementAbstrait) }))
      .sort((a, b) => b.v - a.v || (a.p.id < b.p.id ? -1 : 1));
    notes.forEach(({ p }, i) => {
      const score = REPUTATION.champion[nom] * (notes.length > 1 ? 1 - i / (notes.length - 1) : 1);
      p.reputationJeune = Math.round(REPUTATION.inertie * (p.reputationJeune ?? 0) + (1 - REPUTATION.inertie) * score);
    });
  }
}

/* ---------------------------------------------------------------- Passé simulé au départ */

/**
 * Passé de départ (D-112 §9) : quelques saisons juniors simulées avant 2027, sur les circuits du calendrier,
 * sans faire progresser les compétences (le niveau de départ des jeunes tient déjà compte de leur passé)
 * et sans toucher à la F1.
 */
export function simulerPasseJunior(monde: Monde): void {
  initialiserEcuriesJuniors(monde);
  const circuits = idsTries(table(monde, TABLES.circuits));
  classementsAbstraits(monde, monde.date.annee - PASSE_JUNIOR_ANNEES - 1); // réputations de départ (karting, Apex 4)
  for (let annee = monde.date.annee - PASSE_JUNIOR_ANNEES; annee < monde.date.annee; annee++) {
    marcheBaquets(monde, annee);
    for (const cat of CATEGORIES) {
      const n = Math.min(CATEGORIES_JUNIORS[cat].manches, circuits.length);
      const manches: MancheJunior[] = Array.from({ length: n }, (_, k) => ({ manche: k + 1, circuit: circuits[Math.round((k * (circuits.length - 1)) / Math.max(1, n - 1))]!, semaine: 0, pluie: false, termine: false, resultats: [] }));
      const sj: SaisonJunior = { id: `sj_${cat}_${annee}`, categorie: cat, annee, manches, classement: [], classementEcuries: [], termine: false };
      table(monde, TABLES.saisonsJuniors)[sj.id] = sj as unknown as Entite;
      for (const m of manches) simulerMancheJunior(monde, sj, m, tirageLocal(monde, 'juniors.meteo', sj.id, m.manche).chance(PLUIE_PASSE_JUNIOR));
      cloturerSaisonJunior(monde, sj);
      for (const m of manches) m.resultats = []; // détail effacé (seul le résumé du passé est conservé)
    }
    classementsAbstraits(monde, annee);
  }
}

/* ---------------------------------------------------------------- Systèmes */

export const systemeJuniors: Systeme = {
  nom: 'juniors',
  executer({ monde, date, commanderIA }) {
    // Phase 6b-2 : académies, affiliations, mécènes et repérage de l'IA, avant le marché des baquets.
    if (date.semaine === ACADEMIE.semaine) intersaisonAcademies(monde, date.annee, (c) => commanderIA(c));
    if (date.semaine === ACADEMIE.semaineMiSaison) miSaisonAcademies(monde, date.annee, (c) => commanderIA(c));
    if (date.semaine === SEMAINE_CLOTURE) finDeSaisonAcademies(monde, date.annee);
    if (date.semaine % 4 === 0) mettreAJourConnaissances(monde);
    if (date.semaine === MARCHE_BAQUETS.semaine) {
      marcheBaquets(monde, date.annee);
      creerSaisonsJuniors(monde, date.annee);
      // Volume borné : le détail course par course des saisons anciennes est effacé.
      for (const sj of Object.values(table(monde, TABLES.saisonsJuniors)) as unknown as SaisonJunior[]) {
        if (sj.annee < date.annee - DETAIL_JUNIORS_SAISONS) for (const m of sj.manches) m.resultats = [];
      }
    }
    for (const cat of CATEGORIES) {
      const sj = saisonJunior(monde, cat, date.annee);
      if (!sj || sj.termine) continue;
      for (const m of sj.manches) {
        if (m.termine || m.semaine !== date.semaine) continue;
        const gpF1 = (Object.values(table(monde, TABLES.grandsPrix)) as unknown as GrandPrix[]).find((g) => g.saison === date.annee && g.semaine === date.semaine);
        simulerMancheJunior(monde, sj, m, gpF1?.pluie ?? false);
      }
      if (date.semaine === SEMAINE_CLOTURE) cloturerSaisonJunior(monde, sj);
    }
    if (date.semaine === SEMAINE_CLOTURE) classementsAbstraits(monde, date.annee);
  },
};

/** À installer après les systèmes de la saison (les Grands Prix de la semaine sont déjà courus) et de la carrière (cohorte). */
export function installerJuniors(moteur: Moteur): Moteur {
  moteur.commandes.enregistrer(commandeMissionReperage);
  return moteur.ajouterSysteme(systemeJuniors);
}
