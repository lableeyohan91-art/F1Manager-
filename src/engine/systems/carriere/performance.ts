/**
 * Performance effective d'un pilote en course (phase 6a complémentaire, D-105 à D-108) :
 * expérience réelle, handicaps de nouveauté, affinités avec les circuits, erreurs sous pression.
 * Ces effets modifient la performance d'un Grand Prix, jamais les compétences permanentes (sauf l'apprentissage de la pluie,
 * qui fait progresser une compétence comme le fait la 6a).
 * Module « feuille » : n'importe que l'équilibrage, le noyau et le modèle (appelé par le système de la saison).
 */

import {
  ADAPTABILITE_REFERENCE, AFFINITE, AFFINITE_EVENEMENTS, AFFINITE_NATURELLE, APPRENTISSAGE_PLUIE, EXPERIENCE_HISTORIQUE, FACTEUR_EXPERIENCE,
  MODULATION_TRAIT, NOUVEAU_CIRCUIT, NOUVELLE_ECURIE, PRESSION,
} from '../../balance/carriere';
import { ajouterEvenement } from '../../core/evenements';
import { POIDS_COURSE_JUNIOR } from '../../balance/juniors';
import { tirageLocal } from '../../core/moteur';
import { table, type Monde } from '../../core/monde';
import { TABLES, type Carriere, type Circuit, type ExperiencePilote, type Palmares, type Personne, type Saison } from '../../model/types';

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

export function experienceVide(ecurie = ''): ExperiencePilote {
  return { gp: 0, pluie: 0, luttesTitre: 0, circuits: {}, ecurie, gpEcurie: 0 };
}

function experienceDe(p: Personne): ExperiencePilote | undefined {
  if (!p.carriere) return undefined;
  return (p.carriere.experience ??= experienceVide(p.ecurie));
}

/** Facteur d'expérience des compétences d'« expérience » (D-106) : remplace l'âge comme moteur de leur progression. */
export function facteurExperience(p: Personne): number {
  const k = p.carriere;
  if (!k) return 1;
  const x = p.poste.startsWith('pilote') ? 1 - Math.exp(-((k.experience?.gp ?? 0) + POIDS_COURSE_JUNIOR * (k.experience?.gpJuniors ?? 0)) / FACTEUR_EXPERIENCE.echelleGP) : 1 - Math.exp(-k.saisonsActives / FACTEUR_EXPERIENCE.echelleSaisons);
  return FACTEUR_EXPERIENCE.min + FACTEUR_EXPERIENCE.amplitude * x;
}

/* ---------------------------------------------------------------- Affinités (D-108) */

/** Affinité naturelle (innée), déterministe : Grand Prix à domicile souvent apprécié ; ailleurs, un cran rare. */
export function affiniteNaturelle(monde: Monde, p: Personne, circuit: Circuit): number {
  const f = tirageLocal(monde, 'affinite.naturelle', p.id, circuit.id);
  if (circuit.pays === p.nationalite) return f.chance(AFFINITE_NATURELLE.domicileDeux) ? 2 : f.chance(AFFINITE_NATURELLE.domicileUn) ? 1 : 0;
  return f.chance(AFFINITE_NATURELLE.ailleurs) ? (f.chance(0.5) ? 1 : -1) : 0;
}

/** Affinité totale (−2 à +2) = naturelle + acquise (seule la part acquise est stockée, et seulement si elle n'est pas nulle). */
export function affinite(monde: Monde, p: Personne, circuit: Circuit): number {
  return borner(affiniteNaturelle(monde, p, circuit) + (p.carriere?.affinites?.[circuit.id] ?? 0), AFFINITE.min, AFFINITE.max);
}

function faireEvoluerAffinite(monde: Monde, p: Personne, circuit: Circuit, sens: 1 | -1, probabilite: number, cause: string, cle: string): void {
  const k = p.carriere;
  if (!k) return;
  // La personnalité module la réaction : le besoin de reconnaissance amplifie le positif, la rancune le négatif.
  const trait = sens > 0 ? (p.traits['besoinReconnaissance'] ?? 10) : (p.traits['rancune'] ?? 10);
  if (!tirageLocal(monde, 'affinite.evolution', p.id, circuit.id, cle).chance(probabilite * (MODULATION_TRAIT.min + MODULATION_TRAIT.amplitude * (trait / 20)))) return;
  const avant = affinite(monde, p, circuit);
  if ((sens > 0 && avant >= AFFINITE.max) || (sens < 0 && avant <= AFFINITE.min)) return;
  const acquis = (k.affinites?.[circuit.id] ?? 0) + sens;
  k.affinites ??= {};
  if (acquis === 0) delete k.affinites[circuit.id];
  else k.affinites[circuit.id] = acquis;
  ajouterEvenement(monde, {
    type: 'pilote.affinite', acteurs: [{ id: p.id, role: 'pilote' }], importance: 1, visibilite: 'prive',
    contexte: { circuit: circuit.id, avant, apres: affinite(monde, p, circuit), cause },
  });
}

/* ---------------------------------------------------------------- Performance effective */

/** Modificateur de niveau effectif (points) : affinité, circuit découvert, nouvelle écurie. Réduit par l'adaptabilité. */
export function modificateurNiveau(monde: Monde, p: Personne, circuit: Circuit): { affinite: number; nouveaute: number } {
  const ex = experienceDe(p);
  const adapt = ADAPTABILITE_REFERENCE - (p.competences['adaptabilite'] ?? 10) / 20;
  const visites = ex?.circuits[circuit.id] ?? 0;
  const gpEcurie = ex && ex.ecurie === p.ecurie ? ex.gpEcurie : 0;
  const nouveaute = -(NOUVEAU_CIRCUIT.handicap * Math.exp(-visites / NOUVEAU_CIRCUIT.echelle) + NOUVELLE_ECURIE.handicap * Math.exp(-gpEcurie / NOUVELLE_ECURIE.echelle)) * adapt;
  return { affinite: AFFINITE.parCran * affinite(monde, p, circuit), nouveaute };
}

/** Le pilote peut-il encore être champion, `restantes` manches avant la fin (cette course comprise) ? */
export function encoreEnCourse(saison: Saison, idPilote: string, restantes: number): boolean {
  const max = saison.bareme[0] ?? 25;
  const tri = [...saison.pilotes].sort((a, b) => b.points - a.points);
  const leader = tri[0]?.points ?? 0;
  const moi = saison.pilotes.find((l) => l.pilote === idPilote)?.points ?? 0;
  return leader > 0 && moi + restantes * max >= leader;
}

/**
 * Erreur sous pression (D-105) : dans une course décisive, un pilote fragile (sang-froid bas, peu d'expérience des luttes
 * pour le titre) peut commettre une erreur coûteuse. Renvoie la perte en % du temps au tour (0 si pas d'erreur).
 */
export function erreurPression(monde: Monde, p: Personne, saison: Saison, manche: number, idGp: string): number {
  const restantes = saison.calendrier.length - manche + 1;
  if (restantes > PRESSION.manchesDecisives || !encoreEnCourse(saison, p.id, restantes)) return 0;
  const luttes = p.carriere?.experience?.luttesTitre ?? 0;
  const pr = PRESSION.base * (1.5 - (p.traits['sangFroid'] ?? 10) / 20) * (1 - PRESSION.experience * (1 - Math.exp(-luttes / PRESSION.echelleLuttes)));
  return tirageLocal(monde, 'pression', idGp, p.id).chance(Math.max(0, pr)) ? PRESSION.pertePct : 0;
}

/* ---------------------------------------------------------------- Après le Grand Prix */

/**
 * Après un Grand Prix : compteurs d'expérience, apprentissage de la pluie, évolution des affinités.
 * `positions` : position d'arrivée (null si abandon) et cause d'abandon de chaque partant.
 */
export function apresGrandPrix(monde: Monde, circuit: Circuit, idGp: string, pluie: boolean, partants: { p: Personne; position: number | null; incident: boolean }[], junior = false): void {
  for (const { p, position, incident } of partants) {
    const ex = experienceDe(p);
    if (!ex) continue;
    // Phase 6b : une course junior compte à part (facteur d'expérience réduit) mais apprend pleinement le circuit.
    if (junior) ex.gpJuniors = (ex.gpJuniors ?? 0) + 1;
    else {
      ex.gp++;
      if (ex.ecurie !== p.ecurie) { ex.ecurie = p.ecurie; ex.gpEcurie = 0; }
      ex.gpEcurie++;
    }
    ex.circuits[circuit.id] = (ex.circuits[circuit.id] ?? 0) + 1;
    if (pluie) {
      const v = p.competences['pluie'];
      if (v !== undefined) {
        const plafond = borner(p.potentiel + (p.carriere?.ecarts['pluie'] ?? 0), 1, 20);
        p.competences['pluie'] = Math.round(borner(v + APPRENTISSAGE_PLUIE.part * Math.max(0, plafond - v) * Math.exp(-ex.pluie / APPRENTISSAGE_PLUIE.echelle), 1, 20) * 100) / 100;
      }
      ex.pluie++;
    }
    if (position === 1) faireEvoluerAffinite(monde, p, circuit, 1, AFFINITE_EVENEMENTS.victoire, 'victoire', idGp);
    else if (position !== null && position <= 3) faireEvoluerAffinite(monde, p, circuit, 1, AFFINITE_EVENEMENTS.podium, 'podium', idGp);
    if (incident) faireEvoluerAffinite(monde, p, circuit, -1, AFFINITE_EVENEMENTS.incident, 'accident', idGp);
  }
}

/** Avant la dernière manche : ceux qui peuvent encore être champions vivent une lutte pour le titre (expérience). */
export function noterLuttesTitre(saison: Saison, personnes: (id: string) => Personne | undefined): void {
  for (const l of saison.pilotes) {
    if (!encoreEnCourse(saison, l.pilote, 1)) continue;
    const p = personnes(l.pilote);
    const ex = p ? experienceDe(p) : undefined;
    if (ex) ex.luttesTitre++;
  }
}

/** Le champion gagne souvent une affection particulière pour le circuit où il a été sacré. */
export function titreSurCircuit(monde: Monde, champion: Personne, circuit: Circuit, annee: number): void {
  faireEvoluerAffinite(monde, champion, circuit, 1, AFFINITE_EVENEMENTS.titre, 'titre', `titre-${annee}`);
}

/**
 * Expérience initiale des pilotes issus des données (provisoire avant l'histoire ancrée, phase 9) :
 * saisons de titulaire depuis 2010 (carrieres.csv) → Grands Prix, courses sous la pluie, visites des circuits actuels ;
 * titres → luttes pour le titre ; saisons consécutives dans l'écurie actuelle.
 */
/** Durée d'un passage en saisons, au mois près (transferts en cours de saison). */
const dureeSaisons = (c: Carriere) => c.a - c.de + 1 - ((c.moisDe ?? 1) - 1) / 12 - (12 - (c.moisA ?? 12)) / 12;

export function initialiserExperienceDonnees(monde: Monde): void {
  const carrieres = Object.values(table(monde, TABLES.carrieres)) as unknown as Carriere[];
  const circuits = Object.keys(table(monde, TABLES.circuits));
  const palmares = Object.values(table(monde, TABLES.palmares)) as unknown as Palmares[];
  for (const p of Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]) {
    if (!p.poste.startsWith('pilote') || !p.carriere) continue;
    const lignes = carrieres.filter((c) => c.personne === p.id && c.poste === 'pilote_titulaire');
    // Audit de la phase 9 : une saison partagée entre deux écuries (transfert en cours de saison) ne compte qu'une fois.
    const saisons = lignes.reduce((a, c) => a + dureeSaisons(c), 0);
    const ex = experienceVide(p.ecurie);
    ex.gp = saisons * EXPERIENCE_HISTORIQUE.gpParSaison;
    ex.pluie = saisons * EXPERIENCE_HISTORIQUE.pluieParSaison;
    ex.luttesTitre = palmares.filter((x) => x.championPilote === p.id).length;
    if (saisons > 0) for (const c of circuits) ex.circuits[c] = saisons;
    const recentes = lignes.filter((c) => c.ecurieLignee === p.ecurie).reduce((a, c) => a + dureeSaisons(c), 0);
    ex.gpEcurie = recentes * EXPERIENCE_HISTORIQUE.gpParSaison;
    p.carriere.experience = ex;
  }
}
