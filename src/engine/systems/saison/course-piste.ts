/**
 * Phase 13b (D-194, D-195 ; fiche docs/systemes/phase-13b-positions-depassements.md) — le week-end sur la piste : qualifications Q1, Q2, Q3,
 * départ, puis course tour par tour avec de vraies positions (écarts, trafic, air perturbé, aspiration, dépassements, arrêts qui font
 * ressortir à sa vraie place, abandons au tour où ils arrivent). Fonctions pures : l'état d'une course est un objet sérialisable, avancé
 * tour par tour (`avancerTour`), ce qui permettra de l'arrêter et de la reprendre (13e). Unités : secondes et % du tour de référence.
 */
import { ARRETS, CARBURANT, COMPOSES, CONSIGNES, HUMAIN_COURSE, METEO, NEUTRALISATIONS, PISTE, PNEUS_COURSE, QUALIFS, RESSOURCES } from '../../balance/course';
import { CONDITIONS_COURSE, VOITURE_REFERENCE } from '../../balance/profil';
import type { Flux } from '../../core/hasard';
import type { CauseAbandon, ConsignesCourse, Neutralisation } from '../../model/types';
import { arretEquipe, type Compose, type EquipeArret, type Strategie } from './course-tours';

/* ===================================================================== Qualifications */

/** `facteurErreur` : multiplicateur de la probabilité d'erreur (simulation de qualification aux essais libres, 13b+). */
export interface Qualifiable { id: string; rythme: number; regularite: number; facteurErreur?: number }
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
        const erreur = f.chance(Math.max(0, QUALIFS.erreurBase + (20 - p.regularite) * QUALIFS.erreurParPoint) * (p.facteurErreur ?? 1)) ? QUALIFS.perteErreur : 0;
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
  abandonCause?: CauseAbandon;
  /** 13c-1 : probabilité d'une petite erreur à chaque tour (régularité, consigne, pluie, circuit). */
  pErreur?: number;
  /** 13c-2 : écart de rythme du pilote sous la pluie par rapport au sec (% du tour, positif = plus lent ; compétence pluie, hors
   * ralentissement commun) ; intelligence de course (délai avant de changer de pneus). */
  ecartMeteo?: number; intelligence?: number;
  /** 13c-3 : compétence condition (fatigue) et trait sang-froid (erreurs sous pression en fin de course). */
  condition?: number; sangFroid?: number;
}

export interface EtatVoiture {
  id: string; temps: number; tour: number; relais: number; tourRelais: number; reserve: number; enCourse: boolean;
  depassements: number; positionsGagnees: number; erreursArret: number;
  /** 13c-1 : longueurs des relais (copie de la stratégie, recalculée après un arrêt sous neutralisation) ; petites erreurs commises. */
  plan: number[]; erreurs: number;
  /** 13c-2 : composés des relais (copie de la stratégie, changée quand la météo change) ; tour où la voiture rentrera changer de pneus. */
  composes: Compose[]; changementPrevu?: number;
}
export interface EtatCourse {
  tour: number; tours: number; tempsS: number; ordre: string[]; voitures: Record<string, EtatVoiture>;
  /** 13c-1 : neutralisation en cours, neutralisations de la course, tour d'une voiture de sécurité pour débris (null : aucune). */
  neutralisation?: { type: Neutralisation['type']; toursRestants: number };
  neutralisations: Neutralisation[];
  debrisTour: number | null;
  /** 13c-2 : piste mouillée au départ ; tours où elle change. */
  departPluie?: boolean; changementsMeteo?: number[];
  /** 13c-3 : exigence physique du circuit (1–5). */
  exigencePhysique?: number;
}

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
    voitures[id] = { id, temps: Math.max(0, depart), tour: 0, relais: 0, tourRelais: 0, reserve: RESSOURCES.reserveBatterie, enCourse: true, depassements: 0, positionsGagnees: 0, erreursArret: 0, plan: [...p.strategie.relais], erreurs: 0, composes: [...p.strategie.composes] };
  });
  const ordre = [...grille].sort((a, b) => voitures[a]!.temps - voitures[b]!.temps || grille.indexOf(a) - grille.indexOf(b));
  const fd = tirage('debris');
  const debrisTour = fd.chance(NEUTRALISATIONS.scDebris) ? 1 + Math.floor(fd.suivant() * Math.max(1, tours - 2)) : null;
  return { tour: 0, tours, tempsS, ordre, voitures, neutralisations: [], debrisTour };
}

/**
 * Données du circuit lues sur la piste : facilité de dépassement (multiplicateur de la probabilité), perte dans l'air perturbé (s par tour)
 * perte d'un passage par la voie des stands hors immobilisation (s, fiche du circuit) ; risque d'accident (neutralisations, erreurs).
 */
export interface CircuitPiste { facilite: number; airPerturbe: number; perteVoieS: number; /** 13c-1 : risque d'accident (1–5). */ risque?: number; /** 13c-2 : météo. */ departPluie?: boolean; changementsMeteo?: number[]; /** 13c-3 */ exigencePhysique?: number }

/** Temps (s) du prochain tour d'une voiture, hors effets de position ; et si elle s'arrête aux stands à la fin de ce tour. */
function tempsDuTour(e: EtatCourse, v: EtatVoiture, p: Partant, d1MasseS: number, perteVoieS: number, chance: (x: number) => boolean, facteurStand = 1): { s: number; arret: boolean; perteArretS: number } {
  const t = e.tour + 1;
  const compose = v.composes[v.relais] as Compose;
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
  // 13c-2 : piste mouillée ou sèche à ce tour, par rapport au départ ; pneus inadaptés.
  const mouille = meteoAuTour(e, t);
  let meteo = mouille ? METEO.lentPluiePct : 0;
  if (mouille !== !!e.departPluie) meteo += (mouille ? 1 : -1) * (p.ecartMeteo ?? 0);
  if (mouille && compose !== 'pluie') meteo += METEO.slickMouillePct;
  if (!mouille && compose === 'pluie' && e.changementsMeteo?.length) meteo += METEO.pluieSecPct;
  let s = e.tempsS * (1 + (p.base + pneus + carburant + rythme + meteo + fatigue(e, p, t)) / 100);
  const arret = v.relais < v.plan.length - 1 && n >= v.plan[v.relais]!;
  let perteArretS = 0;
  if (arret) {
    const { immobilisationS, pErreur } = arretEquipe(p.equipe);
    perteArretS = perteVoieS * facteurStand + immobilisationS;
    if (chance(pErreur)) { perteArretS += ARRETS.perteErreurS; v.erreursArret++; }
    s += perteArretS;
  }
  return { s, arret, perteArretS };
}

/**
 * Un tour pour toutes les voitures : temps propres, puis résolution dans l'ordre de la piste (de la tête à la queue) : une voiture qui
 * rattrape celle de devant tente de la dépasser (au plus une fois par tour) ; ratée, elle reste derrière, à l'écart minimal ; une voiture
 * qui s'arrête aux stands se fait doubler sans combat. Air perturbé et aspiration selon l'écart du tour précédent.
 */
export function avancerTour(e: EtatCourse, partants: Map<string, Partant>, circuit: CircuitPiste, d1MasseS: number, tirage: (cle: string) => Flux): void {
  if (e.neutralisation) { tourNeutralise(e, partants, circuit, d1MasseS, tirage); return; }
  const t = e.tour + 1;
  const prevOrdre = e.ordre.filter((id) => e.voitures[id]!.enCourse);
  const ecartDevant = new Map<string, number>();
  prevOrdre.forEach((id, i) => { if (i > 0) ecartDevant.set(id, e.voitures[id]!.temps - e.voitures[prevOrdre[i - 1]!]!.temps); });
  const propre = new Map<string, { fin: number; arret: boolean; tourS: number }>();
  for (const id of prevOrdre) {
    const v = e.voitures[id]!, p = partants.get(id)!;
    reagirMeteo(e, v, p, t, tirage);
    const f = tirage(`${id}|t${t}`);
    const { s, arret } = tempsDuTour(e, v, p, d1MasseS, circuit.perteVoieS, (x) => f.chance(x));
    let tourS = s + e.tempsS * (f.normale(0, PISTE.aleaTourPct) / 100);
    // 13c-1 : petite erreur (sortie large, blocage de roue).
    // 13c-3 : la fatigue et la pression de fin de course (podium, voiture juste derrière) rendent les erreurs plus probables.
    let pErr = p.pErreur ?? 0;
    const H = HUMAIN_COURSE, fMax = H.fatigueParPoint * 3 * H.conditionMax;
    pErr *= 1 + H.erreurFatigue * (fatigue(e, p, t) / fMax);
    const rang = prevOrdre.indexOf(id), derriere = prevOrdre[rang + 1];
    if (t > e.tours * (1 - H.finPression) && rang < H.podium && derriere && e.voitures[derriere]!.temps - v.temps < H.ecartPressionS)
      pErr *= Math.max(H.pressionMin, 1 + H.pressionParPoint * (H.sangFroidReference - (p.sangFroid ?? H.sangFroidReference)));
    if (!arret && pErr && f.chance(pErr)) { tourS += NEUTRALISATIONS.erreurPerteMinS + f.suivant() * (NEUTRALISATIONS.erreurPerteMaxS - NEUTRALISATIONS.erreurPerteMinS); v.erreurs++; }
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
        // Collée derrière (à moins de l'écart minimal) : elle tente sa chance, même sans être plus rapide sur ce tour ; la réussite
        // dépend alors surtout du talent, de l'aspiration et de la batterie (avance négative ou nulle).
        const veutPasser = PISTE.tenterCollee ? true : fin < finDevant;
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
  declencherNeutralisation(e, partants, circuit, t, tirage);
}

/* ===================================================================== 13c-3 : fatigue */

/** Perte due à la fatigue physique au tour `t` (% du tour) : après la mi-course, selon l'exigence du circuit et la condition du pilote. */
export function fatigue(e: EtatCourse, p: Partant, t: number): number {
  const H = HUMAIN_COURSE;
  const ex = Math.max(0, (e.exigencePhysique ?? H.exigenceNeutre) - H.exigenceNeutre);
  const avance = Math.max(0, (t / e.tours - H.debutFatigue) / (1 - H.debutFatigue));
  const k = Math.min(H.conditionMax, Math.max(H.conditionMin, 1 - H.conditionParPoint * ((p.condition ?? H.conditionReference) - H.conditionReference)));
  return H.fatigueParPoint * ex * avance * k;
}

/* ===================================================================== 13c-2 : météo */

/** Piste mouillée au tour `t` ? (état du départ, inversé à chaque changement déjà survenu). */
export function meteoAuTour(e: EtatCourse, t: number): boolean {
  const n = (e.changementsMeteo ?? []).filter((x) => x <= t).length;
  return !!e.departPluie !== (n % 2 === 1);
}

/** Pneus inadaptés à la piste : la voiture rentrera après un délai (intelligence de course) ; le plan des relais est alors remplacé. */
function reagirMeteo(e: EtatCourse, v: EtatVoiture, p: Partant, t: number, tirage: (cle: string) => Flux): void {
  if (!e.changementsMeteo?.length) return;
  const mouille = meteoAuTour(e, t), pneuPluie = v.composes[v.relais] === 'pluie';
  if (mouille === pneuPluie) { delete v.changementPrevu; return; }
  if (v.changementPrevu === undefined) {
    const f = tirage(`${v.id}|m${t}`);
    v.changementPrevu = t + Math.max(0, Math.min(METEO.delaiMax, Math.round(METEO.delaiBase - METEO.delaiParPoint * ((p.intelligence ?? 10) - 10) + f.normale(0, METEO.delaiSigma))));
  }
  const reste = e.tours - t;
  if (t < v.changementPrevu || reste <= 0) return;
  const nouveau: Compose = mouille ? 'pluie' : reste <= COMPOSES.tendre.vie ? 'tendre' : reste <= COMPOSES.moyen.vie ? 'moyen' : 'dur';
  v.composes = [...v.composes.slice(0, v.relais + 1), nouveau];
  v.plan = [...v.plan.slice(0, v.relais), v.tourRelais + 1, reste];
  delete v.changementPrevu;
}

/* ===================================================================== 13c-1 : neutralisations */

/** Le relais en cours s'arrête après `fin` tours ; les tours restants sont répartis entre les relais suivants, dans les mêmes proportions. */
function replanifier(v: EtatVoiture, fin: number, toursRestants: number): void {
  v.plan[v.relais] = fin;
  const suite = v.plan.slice(v.relais + 1);
  const somme = suite.reduce((a, b) => a + b, 0);
  if (!suite.length || somme <= 0) return;
  let cumul = 0;
  suite.forEach((l, i) => {
    const x = i === suite.length - 1 ? Math.max(1, toursRestants - cumul) : Math.max(1, Math.round((l * toursRestants) / somme));
    v.plan[v.relais + 1 + i] = x; cumul += x;
  });
}

/** Neutralisation déclenchée par un abandon de ce tour (accident, panne) ou par des débris ; elle commence au tour suivant. */
function declencherNeutralisation(e: EtatCourse, partants: Map<string, Partant>, circuit: CircuitPiste, t: number, tirage: (cle: string) => Flux): void {
  if (e.neutralisation || t >= e.tours - 1) return;
  const N = NEUTRALISATIONS, risque = circuit.risque ?? N.risqueReference;
  const f = tirage(`neutralisation|t${t}`);
  const commencer = (type: Neutralisation['type'], cause: Neutralisation['cause'], pilote?: string) => {
    const [a, b] = N[type].tours;
    const tours = Math.min(e.tours - t - 1, a + Math.floor(f.suivant() * (b - a + 1)));
    if (tours < 1) return;
    e.neutralisation = { type, toursRestants: tours };
    e.neutralisations.push({ type, tour: t + 1, tours, cause, ...(pilote ? { pilote } : {}) });
  };
  const abandons = [...partants.values()].filter((p) => p.abandonTour === t).sort((a, b) => (a.id < b.id ? -1 : 1));
  for (const p of abandons) {
    if (p.abandonCause === 'incident') {
      if (f.chance(N.scAccidentBase + N.scAccidentParRisque * (risque - 1))) commencer(risque >= N.rougeRisqueMin && f.chance(N.rougeParmiSc) ? 'rouge' : 'sc', 'incident', p.id);
      else if (f.chance(N.vscAccident)) commencer('vsc', 'incident', p.id);
    } else if (p.abandonCause === 'mecanique') {
      const r = f.suivant();
      if (r < N.scPanne) commencer('sc', 'mecanique', p.id);
      else if (r < N.scPanne + N.vscPanne) commencer('vsc', 'mecanique', p.id);
    }
    if (e.neutralisation) return;
  }
  if (e.debrisTour === t) commencer('sc', 'debris');
}

/**
 * Un tour neutralisé : rythme imposé, aucun dépassement ; voiture de sécurité et drapeau rouge regroupent le peloton (VSC : écarts
 * conservés) ; les voitures qui ont fait assez de leur relais s'arrêtent (perte réduite ; drapeau rouge : changement de pneus gratuit).
 */
function tourNeutralise(e: EtatCourse, partants: Map<string, Partant>, circuit: CircuitPiste, d1MasseS: number, tirage: (cle: string) => Flux): void {
  const N = NEUTRALISATIONS, n = e.neutralisation!, t = e.tour + 1;
  const premier = e.neutralisations[e.neutralisations.length - 1]!.tour === t;
  const facteurStand = n.type === 'vsc' ? N.vsc.facteurStand : N.sc.facteurStand;
  const ordre = e.ordre.filter((id) => e.voitures[id]!.enCourse);
  const anciens = ordre.map((id) => e.voitures[id]!.temps);
  const arrets = new Map<string, number>();
  for (const id of ordre) {
    const v = e.voitures[id]!, p = partants.get(id)!;
    const restants = v.plan.length - 1 - v.relais;
    if (n.type === 'rouge') {
      // Drapeau rouge : pneus neufs pour tous au premier tour, sans perte (le relais suivant commence si un arrêt restait à faire).
      if (premier) { if (restants > 0) { replanifier(v, v.tourRelais, e.tours - e.tour); v.relais++; } v.tourRelais = 0; }
    } else if (restants > 0 && v.tourRelais + 1 >= N.partRelaisArret * v.plan[v.relais]!) replanifier(v, v.tourRelais + 1, e.tours - t);
    reagirMeteo(e, v, p, t, tirage);
    const f = tirage(`${id}|t${t}`);
    const { arret, perteArretS } = tempsDuTour(e, v, p, d1MasseS, circuit.perteVoieS, (x) => f.chance(x), facteurStand);
    arrets.set(id, arret ? perteArretS : 0);
    if (arret) { v.relais++; v.tourRelais = 0; } else v.tourRelais++;
    v.reserve = Math.min(RESSOURCES.reserveBatterie, v.reserve + PISTE.rechargeParTour);
    v.tour = t;
  }
  // Nouveaux temps : rythme imposé, regroupement (voiture de sécurité, drapeau rouge), puis perte des arrêts.
  const K = n.type === 'vsc' ? N.vsc : n.type === 'sc' ? N.sc : N.rouge;
  let precedent = 0;
  ordre.forEach((id, i) => {
    let tps: number;
    if (n.type === 'vsc' || i === 0) tps = anciens[i]! + e.tempsS * K.facteur;
    else {
      const ecart = anciens[i]! - anciens[i - 1]!;
      const k = n.type === 'rouge' ? 0 : N.sc.resserrement;
      tps = precedent + (ecart > N.sc.ecartS ? N.sc.ecartS + (ecart - N.sc.ecartS) * k : Math.max(PISTE.ecartMinS, ecart));
    }
    precedent = tps;
    e.voitures[id]!.temps = tps + arrets.get(id)!;
  });
  for (const id of ordre) { const p = partants.get(id)!; if (p.abandonTour !== null && t >= p.abandonTour) e.voitures[id]!.enCourse = false; }
  e.tour = t;
  const encore = ordre.filter((id) => e.voitures[id]!.enCourse).sort((a, b) => e.voitures[a]!.temps - e.voitures[b]!.temps);
  e.ordre = [...encore, ...e.ordre.filter((id) => !e.voitures[id]!.enCourse)];
  if (--n.toursRestants <= 0) delete e.neutralisation;
  declencherNeutralisation(e, partants, circuit, t, tirage);
}

/** Course complète : départ puis tous les tours. Renvoie l'état final (ordre d'arrivée des voitures encore en course, puis abandons). */
export function courirSurPiste(grille: string[], partants: Partant[], tours: number, tempsS: number, circuit: CircuitPiste, d1MasseS: number, tirage: (cle: string) => Flux): EtatCourse {
  const e = initialiserCourse(grille, partants, tours, tempsS, tirage);
  if (circuit.departPluie) e.departPluie = true;
  if (circuit.changementsMeteo?.length) e.changementsMeteo = [...circuit.changementsMeteo];
  if (circuit.exigencePhysique !== undefined) e.exigencePhysique = circuit.exigencePhysique;
  const parId = new Map(partants.map((p) => [p.id, p]));
  while (e.tour < tours) avancerTour(e, parId, circuit, d1MasseS, tirage);
  for (const id of grille) { const pos = e.ordre.indexOf(id); if (pos >= 0) e.voitures[id]!.positionsGagnees = grille.indexOf(id) - pos; }
  return e;
}
