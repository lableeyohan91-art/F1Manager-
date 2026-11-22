/**
 * Cycle de vie des personnages — phase 6a (docs/systemes/phase-6a-cycle-de-vie.md, D-100, D-101).
 *
 * - Toutes les 4 semaines : progression, plateau ou déclin de chaque compétence, selon le profil de carrière caché,
 *   la nature de la compétence, le temps de jeu, l'encadrement, un mentor, la motivation et le travail personnel.
 * - Une fois par an : déclics et stagnations (révision rare du potentiel), expérience, bilan, retraites, abandons
 *   des jeunes qui n'ont pas percé (D-101), retours, reconversions.
 * - En intersaison : nouvelle cohorte de jeunes pilotes et de jeunes ingénieurs.
 */

import {
  ABANDON_AGE_QUASI_CERTAIN, ABANDON_JEUNES, ABANDON_PROBABILITE_MAX, ALEA_PROGRESSION, ARCHETYPES, DECLIC, DECLIN, ENCADREMENT,
  MENTOR, MOTIVATION_PROGRESSION, NATURE_COMPETENCE, NATURES, PROGRESSION_PLATEAU, RECONVERSION, RETOUR, RETRAITE, STAGNATION, TAUX_PROGRESSION,
  TEMPS_DE_JEU, TRAVAIL,
} from '../../balance/carriere';
import { COMPETENCES_TRANSVERSALES } from '../../balance/personnages';
import { ajouterEvenement } from '../../core/evenements';
import { tirageLocal, type Moteur, type Systeme } from '../../core/moteur';
import { idsTries, table, type Monde } from '../../core/monde';
import { genererCohorte } from '../../generation/construction';
import { TABLES, type Contrat, type Installation, type Palmares, type Personne, type Poste } from '../../model/types';
import { relation } from '../memoire';
import { liberer } from '../humain/contrats';
import { niveauEffectif } from '../economie/infrastructures';
import { changerMetier, competencesMetier, niveauCarriere, plafondCompetence } from './profil';
import { facteurExperience } from './performance';

export * from './profil';
export * from './estimation';
export * from './performance';

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));
const r2 = (x: number) => Math.round(x * 100) / 100;
/** Semaine des décisions de fin de carrière : juste après la fin de saison, avant les fins de contrat (semaine 50). */
const SEMAINE_BILAN_CARRIERE = 49;
/** Semaine de la nouvelle cohorte (intersaison). */
const SEMAINE_COHORTE = 2;

const personnes = (m: Monde) => idsTries(table(m, TABLES.personnes)).map((id) => table(m, TABLES.personnes)[id] as unknown as Personne);
const ageExact = (m: Monde, p: Personne) => m.date.annee - p.anneeNaissance + m.date.semaine / 52;
const estPilote = (p: Personne) => p.poste.startsWith('pilote');

/* ---------------------------------------------------------------- Environnement */

function tempsDeJeu(p: Personne): number {
  if (estPilote(p)) {
    if (p.statut === 'actif') return TEMPS_DE_JEU[p.poste === 'pilote_titulaire' ? 'pilote_titulaire' : 'pilote_reserve']!;
    return p.poste === 'pilote_junior' ? TEMPS_DE_JEU['junior']! : TEMPS_DE_JEU['pilote_libre']!;
  }
  return p.statut === 'actif' ? TEMPS_DE_JEU['personnel_actif']! : TEMPS_DE_JEU['personnel_libre']!;
}

/** Qualité de l'encadrement (0 à 1) : installations et chef direct, selon le métier. Libres : encadrement moyen-faible. */
function qualiteEncadrement(p: Personne, equipe: Personne[], installations: Map<string, number>): number {
  if (p.statut !== 'actif' || !p.ecurie) return 0.35;
  const inst = (type: string) => installations.get(`${p.ecurie}:${type}`) ?? 0.5;
  const chef = (poste: string, comp: string) => (equipe.find((x) => x.poste === poste)?.competences[comp] ?? 10) / 20;
  return estPilote(p)
    ? (inst('simulateur') + chef('directeur_sportif', 'gestionPilotes')) / 2
    : (inst('centre_recherche') + chef('directeur_technique', 'visionTechnique')) / 2;
}

/** Mentor : un aîné plus fort, de la même famille de métiers, dans la même écurie, avec qui la relation est bonne. */
function aUnMentor(monde: Monde, p: Personne, equipe: Personne[]): boolean {
  const niveau = niveauCarriere(p);
  return equipe.some((m) => m.id !== p.id && estPilote(m) === estPilote(p) && m.anneeNaissance < p.anneeNaissance
    && niveauCarriere(m) >= niveau + MENTOR.ecartNiveau && relation(monde, p.id, m.id).affinite >= MENTOR.seuilAffinite);
}

/** Niveau effectif (0 à 1) des installations, indexé par « écurie:type » (calculé une fois par période). */
export function indexInstallations(monde: Monde): Map<string, number> {
  const res = new Map<string, number>();
  for (const i of Object.values(table(monde, TABLES.installations)) as unknown as Installation[]) res.set(`${i.ecurie}:${i.type}`, niveauEffectif(i) / 10);
  return res;
}

/* ---------------------------------------------------------------- Progression (toutes les 4 semaines) */

export function faireProgresser(monde: Monde, p: Personne, equipe: Personne[], installations = indexInstallations(monde)): void {
  const k = p.carriere;
  if (!k) return;
  const age = ageExact(monde, p);
  const env = tempsDeJeu(p) * (ENCADREMENT.min + ENCADREMENT.amplitude * Math.sqrt(qualiteEncadrement(p, equipe, installations)))
    * (aUnMentor(monde, p, equipe) ? 1 + MENTOR.bonus : 1)
    * (MOTIVATION_PROGRESSION.min + MOTIVATION_PROGRESSION.amplitude * (p.etat.motivation / 100));
  const travail = TRAVAIL.min + TRAVAIL.amplitude * (((p.traits['professionnalisme'] ?? 10) + (p.traits['remiseEnQuestion'] ?? 10)) / 40);
  const frein = TRAVAIL.freinDeclin - TRAVAIL.amplitudeDeclin * ((p.traits['professionnalisme'] ?? 10) / 20);
  const special = k.phaseSpeciale ? (k.phaseSpeciale.type === 'declic' ? DECLIC.multiplicateur : STAGNATION.multiplicateur) : 1;
  const f = tirageLocal(monde, 'progression', p.id, monde.date.annee, monde.date.semaine);
  const experience = facteurExperience(p);
  for (const c of [...competencesMetier(p.poste), ...COMPETENCES_TRANSVERSALES]) {
    const v = p.competences[c];
    if (v === undefined) continue;
    const nomNature = NATURE_COMPETENCE[c] ?? 'technique';
    const nature = NATURES[nomNature]!;
    const ageC = age - nature.decalage;
    // D-106 : pour les compétences d'expérience, l'expérience réelle (et non l'âge seul) règle la progression et freine le déclin.
    const exp = nomNature === 'experience' ? experience : 1;
    let delta: number;
    if (ageC < k.finApogee) {
      const taux = TAUX_PROGRESSION * k.vitesseProgression * env * travail * special * exp * (ageC < k.debutApogee ? 1 : PROGRESSION_PLATEAU);
      delta = taux * Math.max(0, plafondCompetence(p, c) - v);
    } else {
      delta = (-DECLIN.pointsParPeriode * k.vitesseDeclin * nature.declin * (1 + DECLIN.acceleration * (ageC - k.finApogee)) * frein) / exp;
    }
    p.competences[c] = r2(borner(v + delta + f.normale(0, ALEA_PROGRESSION), 1, 20));
  }
  k.niveauMax = Math.max(k.niveauMax, Math.round(niveauCarriere(p) * 10) / 10);
  if (k.phaseSpeciale && --k.phaseSpeciale.periodes <= 0) delete k.phaseSpeciale;
}

/** Une fois par an : déclic ou stagnation (avant la fin du plateau), avec révision rare du potentiel (D-100). */
function tirerPhaseSpeciale(monde: Monde, p: Personne): void {
  const k = p.carriere;
  if (!k || k.phaseSpeciale || ageExact(monde, p) >= k.finApogee) return;
  const f = tirageLocal(monde, 'carriere.declic', p.id, monde.date.annee);
  const mult = ARCHETYPES[k.archetype]?.declic ?? 1;
  const type: 'declic' | 'stagnation' | null = f.chance(DECLIC.probabiliteAnnuelle * mult) ? 'declic' : f.chance(STAGNATION.probabiliteAnnuelle * mult) ? 'stagnation' : null;
  if (!type) return;
  const regle = type === 'declic' ? DECLIC : STAGNATION;
  k.phaseSpeciale = { type, periodes: regle.periodes };
  const revision = f.chance(regle.revisionPotentiel) ? (type === 'declic' ? 1 : -1) : 0;
  const avant = p.potentiel;
  if (revision) p.potentiel = borner(p.potentiel + revision, Math.ceil(niveauCarriere(p)), 20);
  if (p.statut === 'actif' || revision) {
    ajouterEvenement(monde, {
      type: `personne.${type}`, acteurs: [{ id: p.id, role: 'personne' }], importance: 1, visibilite: 'prive',
      contexte: { potentielAvant: avant, potentielApres: p.potentiel },
    });
  }
}

/* ---------------------------------------------------------------- Fin de carrière (semaine 49) */

function contratActif(monde: Monde, p: Personne): Contrat | undefined {
  return (Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]).find((c) => c.personne === p.id && c.statut === 'actif' && c.type === 'emploi');
}

function titres(monde: Monde, p: Personne): number {
  return (Object.values(table(monde, TABLES.palmares)) as unknown as Palmares[]).filter((x) => x.championPilote === p.id).length;
}

/** Probabilité de prendre sa retraite cette année (décision de la personne, §7). */
export function probabiliteRetraite(monde: Monde, p: Personne): number {
  const k = p.carriere;
  if (!k) return 0;
  const age = monde.date.annee - p.anneeNaissance;
  if (age >= RETRAITE.ageMaximal) return 1;
  // L'âge minimal ne vaut que pour les personnes en poste : un sans-emploi finit par quitter le milieu, à tout âge.
  if (p.statut === 'actif' && age < (estPilote(p) ? RETRAITE.ageMinimalPilote : RETRAITE.ageMinimalPersonnel)) return 0;
  const declinRessenti = k.niveauMax > 0 ? Math.max(0, (k.niveauMax - niveauCarriere(p)) / k.niveauMax) : 0;
  // Les jeunes qui n'ont jamais eu de baquet relèvent de l'abandon (D-101), pas de l'usure du chômage.
  const jeuneVivier = estPilote(p) && (k.saisonsF1 ?? 0) === 0;
  if (jeuneVivier && p.statut === 'libre' && age < RETRAITE.ageMinimalPilote) return 0;
  const libre = p.statut === 'libre' && p.libreDepuis !== undefined ? monde.date.annee - p.libreDepuis : 0;
  const reveTitre = p.aspirations.some((a) => a.type === 'etre_champion') && titres(monde, p) === 0 && p.poste === 'pilote_titulaire' ? RETRAITE.envieTitre : 0;
  let pr = RETRAITE.base + RETRAITE.parAnneeApresPlateau * Math.max(0, age - k.finApogee) + RETRAITE.declinRessenti * declinRessenti
    + RETRAITE.parSaisonLibre * libre - RETRAITE.ambition * ((p.traits['ambition'] ?? 10) - 10) - reveTitre;
  const c = contratActif(monde, p);
  if (c && c.fin > monde.date.annee) pr *= RETRAITE.facteurSousContrat; // on termine en général son contrat
  return borner(pr, 0, 1);
}

function prendreRetraite(monde: Monde, p: Personne, motif: string): void {
  const c = contratActif(monde, p);
  if (c) liberer(monde, p, c, 'demission');
  p.statut = 'retraite';
  p.ecurie = '';
  p.retraiteDepuis = monde.date.annee;
  const t = titres(monde, p);
  ajouterEvenement(monde, {
    type: 'personne.retraite', acteurs: [{ id: p.id, role: 'personne' }], importance: t > 0 ? 4 : estPilote(p) && (p.carriere?.saisonsF1 ?? 0) > 0 ? 3 : 2,
    visibilite: 'public', contexte: { motif, poste: p.poste, age: monde.date.annee - p.anneeNaissance, titres: t, saisonsF1: p.carriere?.saisonsF1 ?? 0 },
    texte: `${p.prenom} ${p.nom} met fin à sa carrière${t > 0 ? ` (${t} titre${t > 1 ? 's' : ''} de champion)` : ''}.`,
  });
}

/** Reconversion à la retraite (§8) : d'après les transversales, les aspirations et un peu de chance. */
function tenterReconversion(monde: Monde, p: Personne, f: ReturnType<typeof tirageLocal>): void {
  const age = monde.date.annee - p.anneeNaissance;
  if (age > (estPilote(p) ? RECONVERSION.ageMaxPilote : RECONVERSION.ageMaxPersonnel)) return;
  const leadership = p.competences['leadership'] ?? 10;
  const aspire = p.aspirations.some((a) => a.type === 'diriger_ecurie' || a.type === 'transmettre');
  let poste: Poste | undefined;
  if (estPilote(p)) {
    if ((p.carriere?.saisonsF1 ?? 0) === 0) poste = 'ingenieur'; // un jeune qui abandonne peut devenir ingénieur
    else if (leadership >= RECONVERSION.leadershipMin) poste = leadership >= 16 && f.chance(0.3) ? 'team_principal' : 'directeur_sportif';
  } else if ((p.poste === 'directeur_technique' || p.poste === 'directeur_sportif') && leadership >= RECONVERSION.leadershipMin) {
    poste = 'team_principal';
  }
  if (!poste || !f.chance(RECONVERSION.probabilite + (aspire ? RECONVERSION.bonusAspiration : 0))) return;
  const ancien = p.poste;
  changerMetier(p, poste, f, age);
  p.statut = 'libre';
  p.libreDepuis = monde.date.annee;
  delete p.retraiteDepuis;
  ajouterEvenement(monde, {
    type: 'personne.reconversion', acteurs: [{ id: p.id, role: 'personne' }], importance: 2, visibilite: 'public',
    contexte: { ancien, nouveau: poste }, texte: `${p.prenom} ${p.nom} se reconvertit (${poste.replace(/_/g, ' ')}).`,
  });
}

export function bilanCarrieres(monde: Monde): void {
  const annee = monde.date.annee;
  for (const p of personnes(monde)) {
    const k = p.carriere;
    if (!k) continue;
    // Retours (D-072) : un retraité récent, ambitieux et encore performant peut revenir.
    if (p.statut === 'retraite') {
      if (estPilote(p) && p.retraiteDepuis !== undefined && annee - p.retraiteDepuis <= RETOUR.anneesMax && (p.traits['ambition'] ?? 10) >= RETOUR.ambitionMin
        && niveauCarriere(p) >= RETOUR.niveauMin && tirageLocal(monde, 'carriere.retour', p.id, annee).chance(RETOUR.probabilite)) {
        p.statut = 'libre';
        p.libreDepuis = annee;
        delete p.retraiteDepuis;
        ajouterEvenement(monde, { type: 'personne.retour', acteurs: [{ id: p.id, role: 'personne' }], importance: 3, visibilite: 'public', texte: `${p.prenom} ${p.nom} annonce son retour.` });
      }
      continue;
    }
    tirerPhaseSpeciale(monde, p);
    if (p.statut === 'actif') {
      k.saisonsActives++;
      if (p.poste === 'pilote_titulaire') k.saisonsF1++;
    }
    const age = annee - p.anneeNaissance;
    const f = tirageLocal(monde, 'carriere.fin', p.id, annee);
    // Abandon des jeunes qui n'ont pas percé (D-101) : jamais titulaire en F1, sans baquet.
    if (estPilote(p) && p.statut === 'libre' && k.saisonsF1 === 0 && age >= 23) {
      const pr = age >= ABANDON_AGE_QUASI_CERTAIN ? ABANDON_PROBABILITE_MAX : (ABANDON_JEUNES[age] ?? 0);
      if (f.chance(pr)) {
        prendreRetraite(monde, p, 'abandon : pas de baquet en F1');
        tenterReconversion(monde, p, f);
        continue;
      }
    }
    if (f.chance(probabiliteRetraite(monde, p))) {
      prendreRetraite(monde, p, p.statut === 'libre' ? 'sans contrat' : 'choix personnel');
      tenterReconversion(monde, p, f);
    }
  }
}

/* ---------------------------------------------------------------- Systèmes */

export const systemeProgression: Systeme = {
  nom: 'carriere.progression',
  executer({ monde, date }) {
    if (date.semaine % 4 !== 0) return;
    const tous = personnes(monde).filter((p) => p.statut !== 'retraite');
    const parEcurie = new Map<string, Personne[]>();
    for (const p of tous) if (p.statut === 'actif' && p.ecurie) parEcurie.set(p.ecurie, [...(parEcurie.get(p.ecurie) ?? []), p]);
    const installations = indexInstallations(monde);
    for (const p of tous) faireProgresser(monde, p, p.statut === 'actif' ? (parEcurie.get(p.ecurie) ?? []) : [], installations);
  },
};

export const systemeBilanCarrieres: Systeme = {
  nom: 'carriere.bilan',
  executer({ monde, date }) {
    if (date.semaine === SEMAINE_BILAN_CARRIERE) bilanCarrieres(monde);
  },
};

export const systemeCohorte: Systeme = {
  nom: 'carriere.cohorte',
  executer({ monde, date }) {
    if (date.semaine !== SEMAINE_COHORTE) return;
    const ids = genererCohorte(monde);
    ajouterEvenement(monde, { type: 'generation.cohorte', acteurs: [], importance: 1, contexte: { annee: date.annee, nouveaux: ids.length } });
  },
};

/** À installer après les systèmes humains (contrats) : la retraite libère les postes avant les fins de contrat. */
export function installerCarriere(moteur: Moteur): Moteur {
  return moteur.ajouterSysteme(systemeProgression).ajouterSysteme(systemeBilanCarrieres).ajouterSysteme(systemeCohorte);
}
