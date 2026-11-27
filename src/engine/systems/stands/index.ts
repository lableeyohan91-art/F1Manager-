/**
 * Phase 8d — équipe des stands (D-129 ; fiche phase 8 §9 bis ; D-132 questions 13 à 16).
 *
 * Une équipe par écurie, gérée collectivement, adossée au département « stands » existant (effectif, niveau et coût sous plafond).
 * Une seule personne individualisée : le chef d'équipe (poste `chef_stands`), sous l'autorité du directeur sportif.
 * - rapidité et précision : niveau actuel et plafond (fixé par la qualité des mécaniciens ; ni l'entraînement ni la cohésion ne le dépassent) ;
 * - cohésion : construite par l'entraînement « coordination », les Grands Prix, la stabilité, sous un plafond fixé par l'encadrement ;
 * - fatigue : entraînement et calendrier ; expérience collective ; part de mécaniciens expérimentés ;
 * - plan d'entraînement (orientation, intensité) modifiable à tout moment ; recrutement par vagues ; départs naturels chaque hiver.
 * Phase 13a : rapidité, précision et fatigue font la durée et les erreurs des arrêts (saison/course-tours.ts).
 */

import { causesConnues, dernierFait } from '../humain/causes';
import {
  CREATION_STANDS, COHESION_STANDS, ENCADREMENT_STANDS, ENTRAINEMENT_STANDS, EXPERIENCE_STANDS, FATIGUE_STANDS, HISTORIQUE_STANDS, IA_STANDS,
  ORIENTATIONS_STANDS, RECRUTEMENT_STANDS, RENOUVELLEMENT_STANDS, type IntensiteStands, type OrientationStands,
} from '../../balance/stands';
import type { DefinitionCommande } from '../../core/commandes';
import { ajouterEvenement } from '../../core/evenements';
import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import { tirageLocal, type Moteur, type Systeme } from '../../core/moteur';
import { TABLES, type Departement, type Ecurie, type GrandPrix, type Installation, type Personne, type Saison } from '../../model/types';
import { financesDe, niveauEffectif } from '../economie';
import { relation } from '../memoire';
import { ecuriesActives } from '../saison/performance';

export interface EquipeStands {
  id: string;
  ecurie: string;
  rapidite: number;
  rapiditeMax: number;
  precision: number;
  precisionMax: number;
  cohesion: number;
  fatigue: number;
  experience: number;
  partExperimentes: number;
  plan: { orientation: OrientationStands; intensite: IntensiteStands };
  /** Chef d'équipe connu au dernier passage (pour détecter son départ). */
  chef?: string;
  /** Encadrement (chef, directeur sportif, relation entre eux), recalculé toutes les `periodeSemaines` (performance). */
  encadrement?: number;
  /** Le joueur confie la gestion de son équipe des stands à son directeur sportif (règles de l'IA). */
  delegation?: boolean;
  historique: { annee: number; rapidite: number; precision: number; cohesion: number; fatigueMoyenne: number; renouvellement: number; charge: number }[];
  /** Cumuls de la saison en cours (moyenne de fatigue, charge d'entraînement, renouvellement). */
  saison: { semaines: number; fatigue: number; charge: number; renouvellement: number };
}

const r2 = (x: number) => Math.round(x * 100) / 100;
const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));
const idEquipe = (idEcurie: string) => `stands_${idEcurie}`;

export const equipeStands = (monde: Monde, idEcurie: string) => table(monde, TABLES.equipesStands)[idEquipe(idEcurie)] as unknown as EquipeStands | undefined;

function departement(monde: Monde, idEcurie: string): Departement | undefined {
  return (Object.values(table(monde, TABLES.departements)) as unknown as Departement[]).find((d) => d.ecurie === idEcurie && d.type === 'stands');
}

/** Index des postes clés par écurie, valable seulement pendant le passage hebdomadaire du système (performance). */
const indexPostes = new WeakMap<Monde, Map<string, Personne>>();
function personneAuPoste(monde: Monde, idEcurie: string, poste: string): Personne | undefined {
  const carte = indexPostes.get(monde);
  if (carte) return carte.get(`${idEcurie}|${poste}`);
  return (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).find((p) => p.statut === 'actif' && p.ecurie === idEcurie && p.poste === poste);
}
function indexerPostes(monde: Monde): void {
  const carte = new Map<string, Personne>();
  for (const p of Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]) {
    if (p.statut !== 'actif' || !p.ecurie) continue;
    const k = `${p.ecurie}|${p.poste}`;
    if (!carte.has(k)) carte.set(k, p);
  }
  indexPostes.set(monde, carte);
}

/** Création à partir du département « stands » (niveau sur 20). */
export function creerEquipe(monde: Monde, e: Ecurie): EquipeStands {
  const dep = departement(monde, e.id);
  const f = tirageLocal(monde, 'stands.creation', e.id);
  const niveau = dep?.niveauMoyen ?? 10;
  const plafond = () => r2(borner(CREATION_STANDS.parPointNiveau * niveau + f.normale(0, CREATION_STANDS.ecartPlafond), CREATION_STANDS.plafondMin, CREATION_STANDS.plafondMax));
  const rapiditeMax = plafond(), precisionMax = plafond();
  const actuel = () => CREATION_STANDS.actuelMin + (CREATION_STANDS.actuelMax - CREATION_STANDS.actuelMin) * f.suivant();
  const eq: EquipeStands = {
    id: idEquipe(e.id), ecurie: e.id, rapiditeMax, precisionMax, rapidite: r2(rapiditeMax * actuel()), precision: r2(precisionMax * actuel()),
    cohesion: r2(borner(f.normale(CREATION_STANDS.cohesion, CREATION_STANDS.ecartCohesion), 0, 100)), fatigue: CREATION_STANDS.fatigue,
    experience: CREATION_STANDS.experience, partExperimentes: CREATION_STANDS.partExperimentes, plan: { orientation: 'coordination', intensite: 'normale' },
    chef: personneAuPoste(monde, e.id, 'chef_stands')?.id, historique: [], saison: { semaines: 0, fatigue: 0, charge: 0, renouvellement: 0 },
    // Phase 10 : une équipe créée après la prise de fonction du joueur reprend le choix de délégation déjà fait.
    ...(e.pilotee && e.delegations?.stands !== undefined ? { delegation: e.delegations.stands } : {}),
  };
  table(monde, TABLES.equipesStands)[eq.id] = eq as unknown as Entite;
  return eq;
}

/** Encadrement (≈ 0 à 1) : chef d'équipe et directeur sportif, motivation du chef, relation entre eux. */
export function encadrement(monde: Monde, idEcurie: string): number {
  const chef = personneAuPoste(monde, idEcurie, 'chef_stands');
  const ds = personneAuPoste(monde, idEcurie, 'directeur_sportif');
  const note = (p: Personne | undefined, comps: string[]) => (p ? comps.reduce((a, c) => a + (p.competences[c] ?? ENCADREMENT_STANDS.noteAbsent), 0) / comps.length : ENCADREMENT_STANDS.noteAbsent);
  const base = (ENCADREMENT_STANDS.poidsChef * note(chef, ['organisationStands', 'leadership', 'gestionHumaine']) + ENCADREMENT_STANDS.poidsDirecteurSportif * note(ds, ['organisationStands'])) / 20;
  const lien = chef && ds ? relation(monde, chef.id, ds.id).affinite : 0;
  return Math.max(0, base * (1 + ENCADREMENT_STANDS.effetRelation * lien));
}

/** Plafond de cohésion fixé par l'encadrement. */
export const plafondCohesion = (enc: number) => Math.min(100, COHESION_STANDS.plafondBase + COHESION_STANDS.plafondEncadrement * enc);

function facteurInstallations(monde: Monde, idEcurie: string): number {
  const inst = (Object.values(table(monde, TABLES.installations)) as unknown as Installation[]).filter((i) => i.ecurie === idEcurie && (i.type === 'centre_formation' || i.type === 'installations_personnel'));
  const niveau = inst.length ? inst.reduce((a, i) => a + niveauEffectif(i), 0) / inst.length : 5;
  return ENCADREMENT_STANDS.installationsBase + ENCADREMENT_STANDS.installationsParNiveau * niveau;
}

/** Semaines de Grand Prix d'une saison. */
function semainesGP(monde: Monde, annee: number): Set<number> {
  const s = table(monde, TABLES.saisons)[`ssn_${annee}`] as unknown as Saison | undefined;
  const res = new Set<number>();
  for (const id of s?.calendrier ?? []) {
    const gp = table(monde, TABLES.grandsPrix)[id] as unknown as GrandPrix | undefined;
    if (gp) res.add(gp.semaine);
  }
  return res;
}

/** Une semaine : fatigue (entraînement et calendrier), progrès vers les plafonds, cohésion, expérience, départ du chef. */
export function semaineStands(monde: Monde, eq: EquipeStands, gps: Set<number>): void {
  const semaine = monde.date.semaine;
  const gp = gps.has(semaine), gpPrecedent = gps.has(semaine - 1);
  if (eq.encadrement === undefined || semaine % IA_STANDS.periodeSemaines === 1) eq.encadrement = r2(encadrement(monde, eq.ecurie));
  const enc = eq.encadrement;
  const plafondCoh = plafondCohesion(enc);
  const { orientation, intensite } = eq.plan;
  const recuperer = orientation === 'recuperation';
  // Départ du chef d'équipe : une part de la cohésion s'en va avec lui.
  const chef = personneAuPoste(monde, eq.ecurie, 'chef_stands')?.id;
  if (eq.chef && chef !== eq.chef) {
    const perte = eq.cohesion * COHESION_STANDS.changementChef;
    eq.cohesion = r2(eq.cohesion - perte);
    ajouterEvenement(monde, {
      type: 'stands.changement_chef', acteurs: [{ id: eq.ecurie, role: 'ecurie' }, { id: eq.chef, role: 'ancien' }, ...(chef ? [{ id: chef, role: 'nouveau' }] : [])],
      importance: 2, visibilite: 'prive', causes: causesConnues(monde, dernierFait(monde, (x) => x.type === 'contrat.fin' && x.acteurs.some((a) => a.id === eq.chef))), contexte: { pertePoints: r2(perte), cohesion: eq.cohesion },
      texte: `L'équipe des stands perd son chef : la cohésion en souffre (−${r2(perte)} points).`,
    });
  }
  eq.chef = chef;
  // Entraînement.
  const charge = recuperer ? 0 : ENTRAINEMENT_STANDS.charge[intensite];
  const efficacite = (ENCADREMENT_STANDS.efficaciteBase + enc) * facteurInstallations(monde, eq.ecurie) * Math.max(0, 1 - eq.fatigue / ENTRAINEMENT_STANDS.effetFatigue);
  if (orientation === 'rapidite') eq.rapidite = r2(eq.rapidite + ENTRAINEMENT_STANDS.taux[intensite] * efficacite * Math.max(0, eq.rapiditeMax - eq.rapidite));
  if (orientation === 'precision') {
    const rigueur = (personneAuPoste(monde, eq.ecurie, 'chef_stands')?.competences['rigueur'] ?? ENCADREMENT_STANDS.noteAbsent) / 20;
    const k = ENTRAINEMENT_STANDS.rigueurBase + ENTRAINEMENT_STANDS.rigueurPente * rigueur;
    eq.precision = r2(eq.precision + ENTRAINEMENT_STANDS.taux[intensite] * efficacite * k * Math.max(0, eq.precisionMax - eq.precision));
  }
  const versPlafond = (gain: number, plafond: number) => gain * Math.max(0, 1 - eq.cohesion / plafond);
  let cohesion = eq.cohesion;
  if (orientation === 'coordination') cohesion += versPlafond(ENTRAINEMENT_STANDS.cohesion[intensite] * efficacite, plafondCoh);
  if (gp) {
    cohesion += versPlafond(COHESION_STANDS.parGrandPrix, plafondCoh);
    eq.experience = r2(eq.experience + EXPERIENCE_STANDS.parGrandPrix * (1 - eq.experience / 100));
  }
  // Stabilité : une équipe qui ne change pas se soude un peu, mais plafonne bas sans entraînement ni course.
  cohesion += versPlafond(COHESION_STANDS.stabilite, plafondCoh * COHESION_STANDS.partStabilite);
  eq.cohesion = r2(borner(cohesion, 0, 100));
  // Fatigue : entraînement et calendrier, récupération.
  const ajout = charge + (gp ? FATIGUE_STANDS.parGrandPrix : 0) + (gp && gpPrecedent ? FATIGUE_STANDS.enchainement : 0);
  const retrait = FATIGUE_STANDS.recuperationBase + (recuperer ? ENTRAINEMENT_STANDS.recuperation[intensite] : 0) + (gp ? 0 : FATIGUE_STANDS.recuperationSansCourse);
  eq.fatigue = r2(borner(eq.fatigue + ajout - retrait, 0, 100));
  eq.saison.semaines++;
  eq.saison.fatigue += eq.fatigue;
  eq.saison.charge += charge;
}

/** Hiver : départs naturels (motivation du chef, fatigue), remplacés au même niveau ; bilan de la saison ; historique borné. */
export function finDeSaisonStands(monde: Monde, eq: EquipeStands, annee: number): void {
  const chef = personneAuPoste(monde, eq.ecurie, 'chef_stands');
  const motivation = chef?.etat.motivation ?? RENOUVELLEMENT_STANDS.seuilMotivation;
  const part = RENOUVELLEMENT_STANDS.base + RENOUVELLEMENT_STANDS.climat * Math.max(0, (RENOUVELLEMENT_STANDS.seuilMotivation - motivation) / RENOUVELLEMENT_STANDS.seuilMotivation)
    + (eq.fatigue > RENOUVELLEMENT_STANDS.seuilFatigue ? RENOUVELLEMENT_STANDS.fatigue : 0);
  remplacer(eq, part, eq.rapiditeMax, eq.precisionMax);
  eq.partExperimentes = r2(eq.partExperimentes + RENOUVELLEMENT_STANDS.progressionExperimentes * (1 - eq.partExperimentes));
  eq.saison.renouvellement += part;
  const s = eq.saison;
  eq.historique.push({ annee, rapidite: eq.rapidite, precision: eq.precision, cohesion: eq.cohesion, fatigueMoyenne: r2(s.semaines ? s.fatigue / s.semaines : eq.fatigue), renouvellement: r2(s.renouvellement), charge: r2(s.charge) });
  eq.historique = eq.historique.slice(-HISTORIQUE_STANDS.saisons);
  eq.saison = { semaines: 0, fatigue: 0, charge: 0, renouvellement: 0 };
}

/** Remplace une part `part` des mécaniciens par des mécaniciens dont les plafonds sont donnés (les nouveaux arrivent sous leur plafond). */
function remplacer(eq: EquipeStands, part: number, rapMax: number, precMax: number): void {
  const p = borner(part, 0, 1);
  eq.cohesion = r2(eq.cohesion * Math.max(0, 1 - p * (1 + RENOUVELLEMENT_STANDS.poidsExperimentes * eq.partExperimentes)));
  eq.rapiditeMax = r2(eq.rapiditeMax * (1 - p) + rapMax * p);
  eq.precisionMax = r2(eq.precisionMax * (1 - p) + precMax * p);
  eq.rapidite = r2(Math.min(eq.rapiditeMax, eq.rapidite * (1 - p) + RENOUVELLEMENT_STANDS.niveauArrivee * rapMax * p));
  eq.precision = r2(Math.min(eq.precisionMax, eq.precision * (1 - p) + RENOUVELLEMENT_STANDS.niveauArrivee * precMax * p));
  eq.partExperimentes = r2(eq.partExperimentes * (1 - p));
  eq.experience = r2(eq.experience * (1 - p));
}

/* ------------------------------------------------------------------ Commandes (joueur et IA) */

function auteurAutorise(monde: Monde, auteur: string, idEcurie: string): boolean {
  const p = table(monde, TABLES.personnes)[auteur] as unknown as Personne | undefined;
  return !!p && p.statut === 'actif' && p.ecurie === idEcurie && (p.poste === 'team_principal' || p.poste === 'directeur_sportif');
}

function equipeCommande(monde: Monde, prm: Record<string, unknown>): EquipeStands | undefined {
  const e = table(monde, TABLES.ecuries)[String(prm['ecurie'] ?? '')] as unknown as Ecurie | undefined;
  if (!e || e.statut !== 'active') return undefined;
  return equipeStands(monde, e.id) ?? creerEquipe(monde, e);
}

export const commandePlanStands: DefinitionCommande = {
  type: 'stands.plan',
  valider(monde, c) {
    const id = String(c.parametres['ecurie'] ?? '');
    if (!table(monde, TABLES.ecuries)[id]) return 'Écurie inconnue.';
    if (!auteurAutorise(monde, c.auteur, id)) return 'Seuls le team principal et le directeur sportif de l’écurie décident de l’entraînement des stands.';
    if (!(ORIENTATIONS_STANDS as readonly string[]).includes(String(c.parametres['orientation']))) return 'Orientation : rapidité, précision, coordination ou récupération.';
    if (!(String(c.parametres['intensite']) in ENTRAINEMENT_STANDS.taux)) return 'Intensité : légère, normale ou intensive.';
    return null;
  },
  appliquer({ monde }, c) {
    const eq = equipeCommande(monde, c.parametres)!;
    eq.plan = { orientation: c.parametres['orientation'] as OrientationStands, intensite: c.parametres['intensite'] as IntensiteStands };
  },
};

/** Coût d'une vague de recrutement (M€). */
export const coutRecrutement = (nombre: number, niveau: number) => nombre * RECRUTEMENT_STANDS.coutParMecanicien * (niveau / 10);

export const commandeRecrutementStands: DefinitionCommande = {
  type: 'stands.recrutement',
  valider(monde, c) {
    const id = String(c.parametres['ecurie'] ?? '');
    if (!table(monde, TABLES.ecuries)[id]) return 'Écurie inconnue.';
    if (!auteurAutorise(monde, c.auteur, id)) return 'Seuls le team principal et le directeur sportif de l’écurie recrutent les mécaniciens.';
    const dep = departement(monde, id);
    if (!dep) return 'Cette écurie n’a pas de département des stands.';
    const nombre = c.parametres['nombre'], niveau = c.parametres['niveau'];
    if (!(typeof nombre === 'number' && Number.isInteger(nombre) && nombre >= 1 && nombre <= Math.floor(dep.effectif * RECRUTEMENT_STANDS.partMax))) return `Nombre de mécaniciens : de 1 à ${Math.floor(dep.effectif * RECRUTEMENT_STANDS.partMax)}.`;
    if (!(typeof niveau === 'number' && Number.isFinite(niveau) && niveau >= 1 && niveau <= 20)) return 'Niveau visé : de 1 à 20.';
    const fi = financesDe(monde, id);
    if (fi && fi.tresorerieMEUR < coutRecrutement(nombre, niveau)) return 'Trésorerie insuffisante pour ce recrutement.';
    return null;
  },
  appliquer({ monde }, c) {
    const eq = equipeCommande(monde, c.parametres)!;
    const dep = departement(monde, eq.ecurie)!;
    const nombre = Number(c.parametres['nombre']), niveau = Number(c.parametres['niveau']);
    const part = nombre / dep.effectif;
    const plafond = borner(CREATION_STANDS.parPointNiveau * niveau, 0, 100);
    remplacer(eq, part, plafond, plafond);
    eq.saison.renouvellement += part;
    // Le niveau du département suit : le coût annuel (finances existantes, sous plafond) monte ou baisse avec lui.
    dep.niveauMoyen = Math.round(borner(dep.niveauMoyen * (1 - part) + niveau * part, 1, 20) * 10) / 10 as Departement['niveauMoyen'];
    const cout = coutRecrutement(nombre, niveau);
    const fi = financesDe(monde, eq.ecurie);
    if (fi) {
      fi.tresorerieMEUR -= cout;
      fi.comptes.operations += cout;
    }
    ajouterEvenement(monde, {
      type: 'stands.recrutement', acteurs: [{ id: c.auteur, role: 'auteur' }, { id: eq.ecurie, role: 'ecurie' }], importance: 1, visibilite: 'prive',
      contexte: { nombre, niveau, cout: r2(cout), cohesion: eq.cohesion, rapiditeMax: eq.rapiditeMax, precisionMax: eq.precisionMax },
    });
  },
};

export const commandeDelegationStands: DefinitionCommande = {
  type: 'stands.deleguer',
  valider(monde, c) {
    const id = String(c.parametres['ecurie'] ?? '');
    const tp = personneAuPoste(monde, id, 'team_principal');
    if (!tp || tp.id !== c.auteur) return 'Seul le team principal peut confier l’équipe des stands à son directeur sportif.';
    return typeof c.parametres['actif'] === 'boolean' ? null : 'Préciser actif : vrai ou faux.';
  },
  appliquer({ monde }, c) {
    equipeCommande(monde, c.parametres)!.delegation = c.parametres['actif'] === true;
  },
};

/* ------------------------------------------------------------------ IA (mêmes commandes) */

type Commander = (c: { type: string; auteur: string; parametres: Record<string, unknown> }) => unknown;

function decisionsIA(monde: Monde, commander: Commander, gps: Set<number>): void {
  const semaine = monde.date.semaine;
  for (const e of ecuriesActives(monde)) {
    const eq = equipeStands(monde, e.id);
    if (!eq || (e.pilotee && !eq.delegation)) continue;
    const ds = personneAuPoste(monde, e.id, 'directeur_sportif');
    const auteur = ds?.id ?? personneAuPoste(monde, e.id, 'team_principal')?.id;
    if (!auteur) continue;
    // Plan : selon le calendrier à venir, la fatigue, la caractéristique la plus en retard et le goût du risque du directeur sportif.
    if (semaine % IA_STANDS.periodeSemaines === 1) {
      let aVenir = 0;
      for (let k = 1; k <= IA_STANDS.horizonSemaines; k++) if (gps.has(semaine + k)) aVenir++;
      let orientation: OrientationStands, intensite: IntensiteStands;
      if (eq.fatigue > IA_STANDS.fatigueRecuperation || (aVenir >= IA_STANDS.grandsPrixCharges && eq.fatigue > IA_STANDS.fatigueAvantEnchainement)) {
        orientation = 'recuperation';
        intensite = eq.fatigue > IA_STANDS.fatigueRecuperation ? 'intensive' : 'normale';
      } else {
        // Jugement propre au directeur sportif : deux équipes semblables ne s'entraînent pas forcément de la même façon.
        const j = (o: string) => 1 + IA_STANDS.jugement * (2 * tirageLocal(monde, 'stands.jugement', auteur, o, monde.date.annee, semaine).suivant() - 1);
        const retards: [OrientationStands, number][] = [
          ['rapidite', (eq.rapidite / Math.max(1, eq.rapiditeMax)) * j('rapidite')],
          ['precision', (eq.precision / Math.max(1, eq.precisionMax)) * j('precision')],
          ['coordination', (eq.cohesion / plafondCohesion(eq.encadrement ?? encadrement(monde, e.id))) * j('coordination')],
        ];
        retards.sort((a, b) => a[1] - b[1] || (a[0] < b[0] ? -1 : 1));
        orientation = retards[0]![0];
        intensite = (ds?.traits['risque'] ?? 10) > IA_STANDS.seuilRisque && aVenir <= 1 ? 'intensive' : aVenir >= 2 ? 'legere' : 'normale';
      }
      if (orientation !== eq.plan.orientation || intensite !== eq.plan.intensite) commander({ type: 'stands.plan', auteur, parametres: { ecurie: e.id, orientation, intensite } });
    }
    // Recrutement d'hiver : relever le niveau des mécaniciens si l'écurie le vise et en a les moyens.
    if (semaine === IA_STANDS.semaineRecrutement) {
      const dep = departement(monde, e.id);
      const fi = financesDe(monde, e.id);
      if (!dep || !fi) continue;
      const cible = Math.round(borner(IA_STANDS.cibleBase + IA_STANDS.ciblePrestige * (e.prestige - 10), 1, 20));
      if (cible - dep.niveauMoyen >= IA_STANDS.ecartMin && fi.tresorerieMEUR > IA_STANDS.tresorerieMin) {
        commander({ type: 'stands.recrutement', auteur, parametres: { ecurie: e.id, nombre: Math.max(1, Math.round(dep.effectif * IA_STANDS.partVague)), niveau: cible } });
      }
    }
  }
}

/* ------------------------------------------------------------------ Système */

export const systemeStands: Systeme = {
  nom: 'stands.equipe',
  executer({ monde, date, commanderIA }) {
    const gps = semainesGP(monde, date.annee);
    indexerPostes(monde);
    try {
      for (const e of ecuriesActives(monde)) {
        const eq = equipeStands(monde, e.id) ?? creerEquipe(monde, e);
        if (date.semaine === 1 && eq.saison.semaines > 0) finDeSaisonStands(monde, eq, date.annee - 1);
        semaineStands(monde, eq, gps);
      }
    } finally {
      indexPostes.delete(monde); // les commandes (qui peuvent changer le personnel) relisent la table
    }
    decisionsIA(monde, (c) => commanderIA(c), gps);
    // Équipes d'écuries disparues : supprimées (volume borné).
    const t = table(monde, TABLES.equipesStands);
    for (const id of idsTries(t)) {
      const eq = t[id] as unknown as EquipeStands;
      if ((table(monde, TABLES.ecuries)[eq.ecurie] as unknown as Ecurie | undefined)?.statut !== 'active') delete t[id];
    }
  },
};

export function installerStands(moteur: Moteur): Moteur {
  moteur.ajouterSysteme(systemeStands);
  moteur.commandes.enregistrer(commandePlanStands).enregistrer(commandeRecrutementStands).enregistrer(commandeDelegationStands);
  return moteur;
}
