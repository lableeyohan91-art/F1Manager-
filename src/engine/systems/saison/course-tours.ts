/**
 * Phase 13a (D-192, fiche docs/systemes/phase-13a-ressources-au-tour.md) — la course tour par tour : pneus, carburant, batterie, consignes,
 * stratégie et arrêts. Fonctions pures (aucun état modifié) : la simulation du Grand Prix les appelle et garde la base de rythme
 * (voiture, pilote, forme, aléa) déjà existante. Unités : % du temps au tour de référence du circuit.
 */
import { VOITURE_REFERENCE } from '../../balance/profil';
import { ARRETS, CARBURANT, COMPOSES, CONSIGNES, COURSE_TOURS, PNEUS_COURSE, RESSOURCES } from '../../balance/course';
import type { Circuit, ConsignesCourse } from '../../model/types';
import type { DefinitionCommande } from '../../core/commandes';
import { ajouterEvenement } from '../../core/evenements';
import { table, type Monde } from '../../core/monde';
import { TABLES, type Ecurie, type NiveauConsigne, type Personne } from '../../model/types';

export type Compose = keyof typeof COMPOSES;
export const CONSIGNES_NEUTRES: ConsignesCourse = { conduite: 'neutre', batterie: 'neutre', carburant: 'neutre', pneus: 'neutre' };

export function tempsTourS(circuit: Circuit): number {
  return circuit.sensibilites?.tempsS ?? COURSE_TOURS.tempsTourDefautS;
}

export function toursCourse(circuit: Circuit): number {
  return Math.max(COURSE_TOURS.toursMin, Math.min(COURSE_TOURS.toursMax, Math.round(COURSE_TOURS.dureeCibleS / tempsTourS(circuit))));
}

/** Multiplicateur d'usure des pneus d'un pilote : circuit, gestion du pilote et de la voiture, consignes de conduite et de pneus. */
export function facteurUsure(circuit: Circuit, gestionPilote: number, gestionVoiture: number, c: ConsignesCourse, mois?: number): number {
  const g = Math.max(PNEUS_COURSE.facteurMin, 1 - PNEUS_COURSE.parPointPilote * (gestionPilote - PNEUS_COURSE.referencePilote))
    * Math.max(PNEUS_COURSE.facteurMin, 1 - PNEUS_COURSE.parPointVoiture * (gestionVoiture - PNEUS_COURSE.referenceVoiture));
  // 13a bis : contraste selon la dégradation du circuit et chaleur du mois du Grand Prix.
  const t = mois && circuit.temperatureMensuelle ? circuit.temperatureMensuelle[mois - 1]! : PNEUS_COURSE.chaleur.seuilC;
  const chaleur = 1 + PNEUS_COURSE.chaleur.parDegre * Math.max(0, t - PNEUS_COURSE.chaleur.seuilC);
  return Math.pow(circuit.exigences.degradationPneus / PNEUS_COURSE.degradationReference, PNEUS_COURSE.exposantDegradation) * chaleur * g
    * CONSIGNES.conduite[c.conduite].usure * CONSIGNES.pneus[c.pneus].usure;
}

/** Perte cumulée (% du tour · tour) d'un relais de `l` tours sur un composé, avec le facteur d'usure `f`. */
export function coutRelais(compose: Compose, l: number, f: number): number {
  const k = COMPOSES[compose];
  const usure = k.usure * f * (l * (l - 1)) / 2; // tour 1 : pneus neufs
  // 13a bis : la falaise arrive plus tard quand l'usure est faible (vie ÷ √facteur, borné).
  const au = Math.max(0, l - k.vie / Math.sqrt(Math.max(PNEUS_COURSE.facteurVieMin, f)));
  // 13a bis : mise en température d'un train neuf (les premiers tours du relais).
  const chauffe = (k.chauffe as readonly number[]).slice(0, l).reduce((a, b) => a + b, 0);
  return k.ecart * l + usure + PNEUS_COURSE.falaise * (au * (au + 1)) / 2 + chauffe;
}

export interface Strategie { composes: Compose[]; relais: number[]; cout: number }

/**
 * Meilleure stratégie pour un facteur d'usure (estimé) : séquence de composés (au moins deux composés secs différents sur le sec) et
 * longueurs de relais, en minimisant la perte des pneus + les arrêts (`perteArret`, % du tour). Recherche exhaustive bornée.
 */
export function meilleureStrategie(tours: number, f: number, perteArret: number, pluie: boolean): Strategie {
  if (pluie) return { composes: ['pluie'], relais: [tours], cout: coutRelais('pluie', tours, f) };
  const secs: Compose[] = ['tendre', 'moyen', 'dur'];
  let best: Strategie | undefined;
  const essayer = (composes: Compose[], relais: number[]) => {
    if (new Set(composes).size < 2) return;
    const cout = relais.reduce((a, l, i) => a + coutRelais(composes[i]!, l, f), 0) + perteArret * (relais.length - 1);
    if (!best || cout < best.cout - 1e-9) best = { composes: [...composes], relais: [...relais], cout };
  };
  const min = 5, pas = 3;
  for (const a of secs) for (const b of secs) {
    for (let l1 = min; l1 <= tours - min; l1++) essayer([a, b], [l1, tours - l1]);
    if (ARRETS.arretsMax < 2) continue;
    for (const c of secs) for (let l1 = min; l1 <= tours - 2 * min; l1 += pas) for (let l2 = min; l1 + l2 <= tours - min; l2 += pas) essayer([a, b, c], [l1, l2, tours - l1 - l2]);
  }
  return best!;
}

export interface EquipeArret { rapidite: number; precision: number; fatigue: number }

/** Immobilisation (s) d'un arrêt, et probabilité d'erreur, selon l'équipe des stands (phase 8d). */
export function arretEquipe(eq: EquipeArret | undefined): { immobilisationS: number; pErreur: number } {
  const r = eq?.rapidite ?? ARRETS.defaut, p = eq?.precision ?? ARRETS.defaut, fat = eq?.fatigue ?? 0;
  return { immobilisationS: ARRETS.immobilisationMinS + (100 - r) * ARRETS.parPointRapidite + fat * ARRETS.parPointFatigue, pErreur: Math.max(0, (100 - p) * ARRETS.erreurParPoint) };
}

export interface ResultatTours {
  /** Moyenne par tour (en % du tour) de chaque composante. */
  pneus: number; carburant: number; batterie: number; consignes: number; arrets: number;
  total: number; tours: number; composes: Compose[]; erreursArret: number;
  /** 13a bis : panne sèche (le carburant manque au-delà de ce que l'économie peut rattraper). */
  panneSeche: boolean;
}

/**
 * Course d'un pilote, tour par tour : suit la stratégie de son écurie (`strategie`), ses consignes, sa vraie usure (`fReel`), son carburant
 * et sa batterie ; `chances` fournit les tirages (erreurs aux arrêts), dans l'ordre des arrêts.
 */
export function courirTours(tours: number, strategie: Strategie, fReel: number, c: ConsignesCourse, tempsS: number, eq: EquipeArret | undefined, chance: (p: number) => boolean, d1MasseS = 0): ResultatTours {
  let pneus = 0, carburant = 0, batterie = 0, consignes = 0, arrets = 0, erreurs = 0;
  const rythme = CONSIGNES.conduite[c.conduite].rythme + CONSIGNES.pneus[c.pneus].rythme + CONSIGNES.carburant[c.carburant].rythme;
  // Pneus : relais de la stratégie avec la vraie usure.
  strategie.relais.forEach((l, i) => { pneus += coutRelais(strategie.composes[i]!, l, fReel); });
  // Arrêts.
  const { immobilisationS, pErreur } = arretEquipe(eq);
  for (let k = 1; k < strategie.relais.length; k++) {
    let s = ARRETS.perteVoieS + immobilisationS;
    if (chance(pErreur)) { s += ARRETS.perteErreurS; erreurs++; }
    arrets += (s / tempsS) * 100;
  }
  // Carburant : consommation selon la consigne, charge prévue au rythme neutre + marge ; le manque se paie par une économie forcée.
  // 13a bis : charge de départ (plus légère = plus rapide sur toute la course, selon la sensibilité du circuit à la masse, s par % de masse).
  const charge = CARBURANT.charge[c.charge ?? 'neutre'];
  const conso = tours * CONSIGNES.carburant[c.carburant].conso;
  const manque = Math.max(0, conso - tours * (1 + RESSOURCES.margeCarburant + charge));
  const deltaKg = charge * CARBURANT.masseNeutreKg;
  carburant = manque * RESSOURCES.economieParTourManquant + tours * ((d1MasseS * (deltaKg / (VOITURE_REFERENCE.masseKg / 100))) / tempsS) * 100;
  const panneSeche = manque / tours > CARBURANT.panneSeuil;
  // Batterie : réserve dépensée (ou rechargée) tour par tour ; à vide, recharge forcée.
  let reserve = RESSOURCES.reserveBatterie;
  const b = CONSIGNES.batterie[c.batterie];
  for (let t = 0; t < tours; t++) {
    if (b.energie > 0 && reserve < b.energie) { batterie += RESSOURCES.rechargeForcee; reserve += 1; continue; }
    batterie += b.rythme;
    reserve = Math.min(RESSOURCES.reserveBatterie, reserve - b.energie);
  }
  consignes = rythme * tours;
  const total = pneus + carburant + batterie + consignes + arrets;
  return { pneus: pneus / tours, carburant: carburant / tours, batterie: batterie / tours, consignes: consignes / tours, arrets: arrets / tours, total: total / tours, tours, composes: strategie.composes, erreursArret: erreurs, panneSeche };
}

/* ===================================================================== Commande commune */


const NIVEAUX: readonly NiveauConsigne[] = ['agressive', 'neutre', 'conservatrice'];
const LEVIERS = ['conduite', 'batterie', 'carburant', 'pneus'] as const;

export function motifRefusConsignes(monde: Monde, auteur: string, prm: Record<string, unknown>): string | null {
  const e = table(monde, TABLES.ecuries)[String(prm['ecurie'] ?? '')] as unknown as Ecurie | undefined;
  if (!e || e.statut !== 'active') return 'Écurie inconnue.';
  const a = table(monde, TABLES.personnes)[auteur] as unknown as Personne | undefined;
  if (!a || a.statut !== 'actif' || a.ecurie !== e.id || !['team_principal', 'directeur_sportif'].includes(a.poste ?? '')) return 'Seuls le team principal et le directeur sportif donnent les consignes de course.';
  const p = table(monde, TABLES.personnes)[String(prm['pilote'] ?? '')] as unknown as Personne | undefined;
  if (!p || p.ecurie !== e.id || p.poste !== 'pilote_titulaire') return 'Pilote titulaire inconnu dans cette écurie.';
  for (const l of LEVIERS) if (prm[l] !== undefined && !NIVEAUX.includes(prm[l] as NiveauConsigne)) return `Consigne ${l} : agressive, neutre ou conservatrice.`;
  if (prm['charge'] !== undefined && !['reduite', 'neutre', 'reserve'].includes(String(prm['charge']))) return 'Charge de carburant : réduite, neutre ou réserve.';
  return null;
}

/** Phase 13a : consignes de course d'un pilote (joueur et IA, mêmes règles), valables jusqu'à nouvel ordre. */
export const commandeConsignes: DefinitionCommande = {
  type: 'course.consignes',
  valider: (monde, c) => motifRefusConsignes(monde, c.auteur, c.parametres),
  appliquer({ monde }, c) {
    const e = table(monde, TABLES.ecuries)[String(c.parametres['ecurie'])] as unknown as Ecurie;
    const pilote = String(c.parametres['pilote']);
    const avant = e.consignesCourse?.[pilote] ?? CONSIGNES_NEUTRES;
    const apres = { ...avant };
    for (const l of LEVIERS) if (c.parametres[l] !== undefined) apres[l] = c.parametres[l] as NiveauConsigne;
    if (c.parametres['charge'] !== undefined) apres.charge = c.parametres['charge'] as ConsignesCourse['charge'];
    (e.consignesCourse ??= {})[pilote] = apres;
    ajouterEvenement(monde, {
      type: 'course.consignes', acteurs: [{ id: e.id, role: 'ecurie' }, { id: pilote, role: 'pilote' }, { id: c.auteur, role: 'decideur' }], importance: 1, visibilite: 'prive',
      contexte: { ...apres },
    });
  },
};
