/**
 * Phase 13b (D-194, D-195 ; fiche docs/systemes/phase-13b-positions-depassements.md) — le week-end sur la piste : qualifications Q1, Q2, Q3,
 * départ, puis course tour par tour avec de vraies positions (écarts, trafic, air perturbé, aspiration, dépassements, arrêts qui font
 * ressortir à sa vraie place, abandons au tour où ils arrivent). Fonctions pures : l'état d'une course est un objet sérialisable, avancé
 * tour par tour (`avancerTour`), ce qui permettra de l'arrêter et de la reprendre (13e). Unités : secondes et % du tour de référence.
 */
import { ARRETS, CARBURANT, COMPOSES, CONSIGNES, PISTE, PNEUS_COURSE, QUALIFS, RESSOURCES } from '../../balance/course';
import { CONDITIONS_COURSE, VOITURE_REFERENCE } from '../../balance/profil';
import type { Flux } from '../../core/hasard';
import type { ConsignesCourse } from '../../model/types';
import { arretEquipe, type Compose, type EquipeArret, type Strategie } from './course-tours';

/* ===================================================================== Qualifications */

export interface Qualifiable { id: string; rythme: number; regularite: number }
/**
 * Q1, Q2, Q3 (porteur : « vrai format ») : `rythme` = avance du pilote et de sa voiture en conditions de qualification (% du tour,
 * positif = plus rapide). Chaque séance : `tentatives` tours lancés, aléa de tour, erreur possible (régularité), piste qui s'améliore.
 * Renvoie l'ordre de la grille (premier = pole) et le meilleur temps de chacun (% du tour de référence, plus petit = meilleur).
 */
export function qualifier(pilotes: Qualifiable[], sigma: number, tirage: (cle: string) => Flux): { grille: string[]; temps: Record<string, number> } {
  const n = pilotes.length;
  const q3 = Math.min(QUALIFS.q3, n);
  const elim = Math.max(0, Math.floor((n - q3) / 2));
  const seances = [n, n - elim, q3];
  let restants = [...pilotes];
  const elimines: { id: string; t: number }[][] = [];
  const meilleur: Record<string, number> = {};
  for (let s = 0; s < 3; s++) {
    const tours = restants.map((p) => {
      const f = tirage(`${p.id}|q${s + 1}`);
      let best = Infinity;
      for (let k = 0; k < QUALIFS.tentatives; k++) {
        const erreur = f.chance(Math.max(0, QUALIFS.erreurBase + (20 - p.regularite) * QUALIFS.erreurParPoint)) ? QUALIFS.perteErreur : 0;
        best = Math.min(best, -p.rythme + f.normale(0, sigma) + erreur - QUALIFS.evolutionPiste * s);
      }
      meilleur[p.id] = best;
      return { id: p.id, t: best };
    }).sort((a, b) => a.t - b.t || (a.id < b.id ? -1 : 1));
    const garde = s < 2 ? seances[s + 1]! : tours.length;
    elimines.unshift(tours.slice(garde));
    restants = tours.slice(0, garde).map((x) => pilotes.find((p) => p.id === x.id)!);
    if (s === 2) elimines.unshift(tours);
  }
  // elimines[0] = Q3 complet (ordre), puis Q2 éliminés, puis Q1 éliminés.
  const grille = elimines.flat().map((x) => x.id);
  return { grille: [...new Set(grille)], temps: meilleur };
}

/* ===================================================================== Course */

export interface Partant {
  id: string;
  /** Rythme de base (% du tour, positif = plus lent) : voiture de course, pilote, forme, aléa de course, pression. */
  base: number;
  strategie: Strategie;
  fReel: number;
  consignes: ConsignesCourse;
  equipe?: EquipeArret;
  depart: number; depassement: number; defense: number;
  /** Tour où la voiture abandonne (null : aucun abandon), et cause. */
  abandonTour: number | null;
}

export interface EtatVoiture {
  id: string; temps: number; tour: number; relais: number; tourRelais: number; reserve: number; enCourse: boolean;
  depassements: number; positionsGagnees: number; erreursArret: number;
}
export interface EtatCourse { tour: number; tours: number; tempsS: number; ordre: string[]; voitures: Record<string, EtatVoiture> }

/** Perte de masse : % du tour pour un écart de masse (kg) à la masse moyenne de course, selon la sensibilité du circuit (s par % de masse). */
function effetMasse(deltaKg: number, d1MasseS: number, tempsS: number): number {
  return ((d1MasseS * (deltaKg / (VOITURE_REFERENCE.masseKg / 100))) / tempsS) * 100;
}

/** Départ : la grille, des écarts de place, puis le premier freinage (compétence « départs » et aléa). */
export function initialiserCourse(grille: string[], partants: Partant[], tours: number, tempsS: number, tirage: (cle: string) => Flux): EtatCourse {
  const voitures: Record<string, EtatVoiture> = {};
  const parId = new Map(partants.map((p) => [p.id, p]));
  grille.forEach((id, i) => {
    const p = parId.get(id)!;
    const f = tirage(`${id}|depart`);
    const depart = i * PISTE.ecartGrilleS - PISTE.departParPoint * (p.depart - PISTE.departReference) + f.normale(0, PISTE.departSigmaS);
    voitures[id] = { id, temps: Math.max(0, depart), tour: 0, relais: 0, tourRelais: 0, reserve: RESSOURCES.reserveBatterie, enCourse: true, depassements: 0, positionsGagnees: 0, erreursArret: 0 };
  });
  const ordre = [...grille].sort((a, b) => voitures[a]!.temps - voitures[b]!.temps || grille.indexOf(a) - grille.indexOf(b));
  return { tour: 0, tours, tempsS, ordre, voitures };
}

/**
 * Données du circuit lues sur la piste : facilité de dépassement (multiplicateur de la probabilité), perte dans l'air perturbé (s par tour)
 * et perte d'un passage par la voie des stands hors immobilisation (s, fiche du circuit).
 */
export interface CircuitPiste { facilite: number; airPerturbe: number; perteVoieS: number }

/** Temps (s) du prochain tour d'une voiture, hors effets de position ; et si elle s'arrête aux stands à la fin de ce tour. */
function tempsDuTour(e: EtatCourse, v: EtatVoiture, p: Partant, d1MasseS: number, perteVoieS: number, chance: (x: number) => boolean): { s: number; arret: boolean } {
  const t = e.tour + 1;
  const compose = p.strategie.composes[v.relais] as Compose;
  const k = COMPOSES[compose];
  const n = v.tourRelais + 1; // tour du relais (1 = pneus neufs)
  const vie = k.vie / Math.sqrt(Math.max(PNEUS_COURSE.facteurVieMin, p.fReel));
  let pneus = k.ecart + k.usure * p.fReel * (n - 1) + ((k.chauffe as readonly number[])[n - 1] ?? 0);
  if (n > vie) pneus += PNEUS_COURSE.falaise * (n - vie);
  // Carburant : masse réelle de ce tour (charge de départ, consommation), écart à la masse moyenne de course déjà dans les sensibilités.
  const charge = CARBURANT.charge[p.consignes.charge ?? 'neutre'];
  const depart = CARBURANT.masseNeutreKg * (1 + charge);
  const masse = Math.max(0, depart * (1 - (t - 0.5) / e.tours));
  let carburant = effetMasse(masse - CONDITIONS_COURSE.carburantMoyenKg, d1MasseS, e.tempsS);
  const conso = e.tours * CONSIGNES.carburant[p.consignes.carburant].conso;
  const manque = Math.max(0, conso - e.tours * (1 + RESSOURCES.margeCarburant + charge));
  carburant += (manque * RESSOURCES.economieParTourManquant) / e.tours;
  const rythme = CONSIGNES.conduite[p.consignes.conduite].rythme + CONSIGNES.pneus[p.consignes.pneus].rythme + CONSIGNES.carburant[p.consignes.carburant].rythme;
  let s = e.tempsS * (1 + (p.base + pneus + carburant + rythme) / 100);
  const arret = v.relais < p.strategie.relais.length - 1 && n >= p.strategie.relais[v.relais]!;
  if (arret) {
    const { immobilisationS, pErreur } = arretEquipe(p.equipe);
    s += perteVoieS + immobilisationS;
    if (chance(pErreur)) { s += ARRETS.perteErreurS; v.erreursArret++; }
  }
  return { s, arret };
}

/**
 * Un tour pour toutes les voitures : temps propres, puis résolution dans l'ordre de la piste (de la tête à la queue) : une voiture qui
 * rattrape celle de devant tente de la dépasser (au plus une fois par tour) ; ratée, elle reste derrière, à l'écart minimal ; une voiture
 * qui s'arrête aux stands se fait doubler sans combat. Air perturbé et aspiration selon l'écart du tour précédent.
 */
export function avancerTour(e: EtatCourse, partants: Map<string, Partant>, circuit: CircuitPiste, d1MasseS: number, tirage: (cle: string) => Flux): void {
  const t = e.tour + 1;
  const prevOrdre = e.ordre.filter((id) => e.voitures[id]!.enCourse);
  const ecartDevant = new Map<string, number>();
  prevOrdre.forEach((id, i) => { if (i > 0) ecartDevant.set(id, e.voitures[id]!.temps - e.voitures[prevOrdre[i - 1]!]!.temps); });
  const propre = new Map<string, { fin: number; arret: boolean; tourS: number }>();
  for (const id of prevOrdre) {
    const v = e.voitures[id]!, p = partants.get(id)!;
    const f = tirage(`${id}|t${t}`);
    const { s, arret } = tempsDuTour(e, v, p, d1MasseS, circuit.perteVoieS, (x) => f.chance(x));
    let tourS = s + e.tempsS * (f.normale(0, PISTE.aleaTourPct) / 100);
    // Air perturbé : derrière une voiture à moins de `seuilAirS`, perte proportionnelle à la dépendance du circuit à l'appui.
    if ((ecartDevant.get(id) ?? Infinity) < PISTE.seuilAirS) tourS += circuit.airPerturbe;
    propre.set(id, { fin: v.temps + tourS, arret, tourS });
  }
  const nouvel: string[] = [];
  for (const id of prevOrdre) {
    const v = e.voitures[id]!, p = partants.get(id)!;
    let fin = propre.get(id)!.fin;
    if (nouvel.length) {
      const devant = nouvel[nouvel.length - 1]!;
      const finDevant = e.voitures[devant]!.temps; // déjà mis à jour
      const devantAuxStands = propre.get(devant)!.arret;
      if (fin < finDevant + PISTE.ecartMinS) {
        const veutPasser = fin < finDevant;
        let passe = false;
        if (veutPasser && devantAuxStands) passe = true;
        else if (veutPasser && !propre.get(id)!.arret) {
          const pd = partants.get(devant)!;
          const avance = finDevant - fin; // secondes gagnées sur ce tour
          const aspiration = (ecartDevant.get(id) ?? Infinity) < PISTE.seuilAirS ? PISTE.bonusAspiration : 0;
          const batterie = p.consignes.batterie === 'agressive' && v.reserve >= 1 ? PISTE.bonusBatterie : 0;
          const defenseBatterie = pd.consignes.batterie === 'agressive' && e.voitures[devant]!.reserve >= 1 ? PISTE.bonusBatterie : 0;
          const agressif = p.consignes.conduite === 'agressive' ? PISTE.bonusAgressif : 0;
          // La facilité du circuit multiplie toute la probabilité (Monaco ≪ Monza, même pour un très bon dépasseur).
          const proba = Math.max(0, Math.min(PISTE.probaMax, circuit.facilite * (PISTE.probaBase + PISTE.probaParSeconde * avance
            + PISTE.parPointCompetence * (p.depassement - pd.defense) + aspiration + batterie - defenseBatterie + agressif)));
          const f = tirage(`${id}|d${t}`);
          passe = f.chance(proba);
          if (batterie) v.reserve -= 1;
          if (defenseBatterie) e.voitures[devant]!.reserve -= 1;
          if (passe) { v.depassements++; } else if (agressif && f.chance(PISTE.accrochage)) { fin += PISTE.perteAccrochageS; }
        }
        if (passe) {
          nouvel.splice(nouvel.length - 1, 0, id);
          // Ne pas traverser la voiture encore devant.
          const k = nouvel[nouvel.length - 3];
          if (k && fin < e.voitures[k]!.temps + PISTE.ecartMinS) fin = e.voitures[k]!.temps + PISTE.ecartMinS;
          // La voiture dépassée reste au moins à l'écart minimal derrière.
          if (e.voitures[devant]!.temps < fin + PISTE.ecartMinS) e.voitures[devant]!.temps = fin + PISTE.ecartMinS;
          v.temps = fin;
        } else {
          v.temps = Math.max(fin, finDevant + PISTE.ecartMinS);
          nouvel.push(id);
        }
      } else { v.temps = fin; nouvel.push(id); }
    } else { v.temps = fin; nouvel.push(id); }
    // Relais et batterie.
    if (propre.get(id)!.arret) { v.relais++; v.tourRelais = 0; } else v.tourRelais++;
    v.reserve = Math.min(RESSOURCES.reserveBatterie, v.reserve + PISTE.rechargeParTour);
    v.tour = t;
    if (p.abandonTour !== null && t >= p.abandonTour) v.enCourse = false;
  }
  e.tour = t;
  e.ordre = [...nouvel.filter((id) => e.voitures[id]!.enCourse), ...e.ordre.filter((id) => !e.voitures[id]!.enCourse)];
}

/** Course complète : départ puis tous les tours. Renvoie l'état final (ordre d'arrivée des voitures encore en course, puis abandons). */
export function courirSurPiste(grille: string[], partants: Partant[], tours: number, tempsS: number, circuit: CircuitPiste, d1MasseS: number, tirage: (cle: string) => Flux): EtatCourse {
  const e = initialiserCourse(grille, partants, tours, tempsS, tirage);
  const parId = new Map(partants.map((p) => [p.id, p]));
  while (e.tour < tours) avancerTour(e, parId, circuit, d1MasseS, tirage);
  for (const id of grille) { const pos = e.ordre.indexOf(id); if (pos >= 0) e.voitures[id]!.positionsGagnees = grille.indexOf(id) - pos; }
  return e;
}
