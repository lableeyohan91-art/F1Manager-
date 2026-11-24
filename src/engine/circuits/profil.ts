/**
 * Phase 11b — profil de vitesse sur un tracé réel (docs/systemes/phase-11b-circuits.md §3.3, D-159).
 *
 * Simulation quasi statique classique, en deux passes :
 * 1. vitesse maximale en chaque point, limitée par l'adhérence latérale (mécanique + appui) dans la courbure locale ;
 * 2. passe avant : accélération limitée par la puissance (moins la traînée) ou par la motricité ;
 * 3. passe arrière : freinage limité par l'adhérence au freinage (plus la traînée).
 * Chaque point garde la cause qui limite la vitesse : c'est ce qui permet d'expliquer un résultat (et d'éviter de confondre
 * « puissance » et « motricité »). Module pur : aucune dépendance au monde ni au hasard.
 */

import { AIR, CLASSES_VIRAGES, DETECTION_VIRAGE, G, NIVEAUX_AILERONS, PERTURBATION_SENSIBILITE, PROFIL, PUISSANCE_ALTITUDE_EXPOSANT, VOITURE_REFERENCE } from '../balance/profil';

export interface PointTrace { x: number; y: number; z: number; v?: number }
export interface Trace { circuit: string; longueurM: number; pasM: number; points: PointTrace[] }
export type VoiturePhysique = typeof VOITURE_REFERENCE;
export interface Conditions { altitudeM: number; temperatureC?: number }

/** Ce qui limite la vitesse en un point. */
export type Limite = 'virage' | 'freinage' | 'motricite' | 'puissance' | 'butee';
export interface Profil {
  tempsS: number;
  vitesses: number[]; // m/s
  /** Part de la puissance électrique effectivement disponible (budget d'énergie par tour). */
  partElectrique: number;
  limites: Limite[];
  courbures: number[]; // 1/m (absolue)
}

const kmh = (v: number) => v * 3.6;

/** Densité de l'air selon l'altitude et la température (gaz parfait, atmosphère exponentielle). */
export function densiteAir(c: Conditions): number {
  const t = c.temperatureC ?? AIR.temperatureReferenceC;
  return AIR.densiteMer * Math.exp(-c.altitudeM / AIR.hauteurEchelleM) * (273.15 + AIR.temperatureReferenceC) / (273.15 + t);
}

/** Courbure absolue en chaque point (variation de cap sur une fenêtre, puis lissage). */
export function courbures(tr: Trace): number[] {
  const p = tr.points, n = p.length, h = PROFIL.demiFenetreCourbure, pas = tr.pasM;
  const brut: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = p[(i - h + n) % n]!, b = p[i]!, c = p[(i + h) % n]!;
    const c1 = Math.atan2(b.y - a.y, b.x - a.x), c2 = Math.atan2(c.y - b.y, c.x - b.x);
    let d = c2 - c1;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    brut.push(d / (h * pas));
  }
  const w = PROFIL.lissageCourbure;
  return brut.map((_, i) => {
    let s = 0;
    for (let o = -w; o <= w; o++) s += brut[(i + o + n) % n]!;
    return s / (2 * w + 1);
  });
}

/** Courbure signée (pour le sens des virages). */
function courburesSignees(tr: Trace): number[] {
  return courbures(tr);
}

/** Puissance disponible à une vitesse donnée (thermique, plus électrique qui décroît avec la vitesse, règlement 2026). */
export function partDeploiement(v: VoiturePhysique, vitesseMs: number): number {
  const kv = kmh(vitesseMs), d = v.deploiement;
  return kv <= d.pleinJusquaKmh ? 1 : kv >= d.nulAKmh ? 0 : 1 - (kv - d.pleinJusquaKmh) / (d.nulAKmh - d.pleinJusquaKmh);
}
export function puissance(v: VoiturePhysique, vitesseMs: number, rhoRel: number, partElectrique = 1): number {
  return v.puissanceThermiqueW * Math.pow(rhoRel, PUISSANCE_ALTITUDE_EXPOSANT) + v.puissanceElectriqueW * partDeploiement(v, vitesseMs) * partElectrique;
}

export function profilVitesse(tr: Trace, v: VoiturePhysique, c: Conditions, k?: number[]): Profil {
  const kap = (k ?? courbures(tr)).map(Math.abs);
  // Budget d'énergie électrique par tour : si le déploiement demandé dépasse le budget, la puissance électrique est réduite au prorata.
  let part = 1, p = passeUnique(tr, v, c, kap, part);
  for (let it = 0; it < PROFIL.iterationsEnergie; it++) {
    const besoin = energieElectrique(tr, v, p, part);
    if (besoin <= v.energieElectriqueTourJ * 1.001) break;
    part *= v.energieElectriqueTourJ / besoin;
    p = passeUnique(tr, v, c, kap, part);
  }
  return p;
}

/** Énergie électrique déployée sur le tour (points limités par la puissance). */
function energieElectrique(tr: Trace, v: VoiturePhysique, p: Profil, part: number): number {
  let e = 0;
  p.vitesses.forEach((x, i) => { if (p.limites[i] === 'puissance') e += v.puissanceElectriqueW * partDeploiement(v, x) * part * (tr.pasM / Math.max(x, 1)); });
  return e;
}

function passeUnique(tr: Trace, v: VoiturePhysique, c: Conditions, kap: number[], partElectrique: number): Profil {
  const n = kap.length, pas = tr.pasM, m = v.masseKg;
  const rho = densiteAir(c), rhoRel = rho / AIR.densiteMer;
  const appui = (vv: number) => 0.5 * rho * v.cla * vv * vv;
  const trainee = (vv: number) => 0.5 * rho * v.cda * vv * vv;
  // 1. Vitesse maximale en virage : m v² κ = muMeca m g + muAero × appui(v)  →  v² = muMeca m g / (m κ − muAero ½ ρ CLA)
  const vmax: number[] = [];
  for (const kk of kap) {
    const den = m * kk - v.muAero * 0.5 * rho * v.cla;
    vmax.push(den > 0 ? Math.min(v.vitesseMaxMs, Math.sqrt((v.muMeca * m * G) / den)) : v.vitesseMaxMs);
  }
  const vit = vmax.slice();
  const lim: Limite[] = vmax.map((x) => (x >= v.vitesseMaxMs ? 'butee' : 'virage'));
  for (let passe = 0; passe < PROFIL.passes; passe++) {
    // 2. Passe avant (accélération).
    for (let i = 1; i < 2 * n; i++) {
      const a = (i - 1) % n, b = i % n, vv = Math.max(vit[a]!, 1);
      const fPuissance = puissance(v, vv, rhoRel, partElectrique) / vv;
      const fMotricite = v.muMotricite * (m * G + appui(vv));
      const f = Math.min(fPuissance, fMotricite) - trainee(vv);
      const suiv = Math.sqrt(Math.max(0, vv * vv + (2 * pas * f) / m));
      if (suiv < vit[b]!) { vit[b] = suiv; lim[b] = fPuissance < fMotricite ? 'puissance' : 'motricite'; }
    }
    // 3. Passe arrière (freinage).
    for (let i = 2 * n; i > 0; i--) {
      const a = i % n, b = (i - 1) % n, vv = vit[a]!;
      const f = v.muFreinage * (m * G + appui(vv)) + trainee(vv);
      const prec = Math.sqrt(vv * vv + (2 * pas * f) / m);
      if (prec < vit[b]!) { vit[b] = prec; lim[b] = 'freinage'; }
    }
  }
  let t = 0;
  for (const x of vit) t += pas / Math.max(x, 1);
  return { tempsS: t, vitesses: vit, limites: lim, courbures: kap, partElectrique };
}

/** Voiture avec un niveau d'ailerons a (réglage du week-end). */
export function avecAilerons(v: VoiturePhysique, a: number): VoiturePhysique {
  return { ...v, cla: v.cla * (1 + a), cda: v.cda * (1 + NIVEAUX_AILERONS.trainee * a) };
}

/** Niveau d'appui naturel : le réglage d'ailerons qui donne le meilleur tour à cette voiture sur ce circuit. */
export function appuiNaturel(tr: Trace, v: VoiturePhysique, c: Conditions, k?: number[]): { niveau: number; profil: Profil } {
  const kk = k ?? courbures(tr);
  let best: { niveau: number; profil: Profil } | undefined;
  for (let a = NIVEAUX_AILERONS.min; a <= NIVEAUX_AILERONS.max + 1e-9; a += NIVEAUX_AILERONS.pas) {
    const p = profilVitesse(tr, avecAilerons(v, a), c, kk);
    if (!best || p.tempsS < best.profil.tempsS) best = { niveau: Math.round(a * 100) / 100, profil: p };
  }
  return best!;
}

/* ------------------------------------------------------------------ Sensibilités */

/** Paramètres physiques dont on mesure l'influence, et le sens d'une « amélioration ». */
export const PARAMETRES = {
  adherenceMecanique: { cle: 'muMeca', sens: 1 },
  appui: { cle: 'cla', sens: 1 },
  trainee: { cle: 'cda', sens: -1 },
  puissance: { cle: 'puissanceThermiqueW', sens: 1 },
  motricite: { cle: 'muMotricite', sens: 1 },
  freinage: { cle: 'muFreinage', sens: 1 },
} as const;
export type ParametrePhysique = keyof typeof PARAMETRES;

/** Gain de temps au tour (s) pour une amélioration de 2 % de chaque paramètre physique, toutes choses égales par ailleurs. */
export function sensibilites(tr: Trace, v: VoiturePhysique, c: Conditions): Record<ParametrePhysique, number> {
  const k = courbures(tr);
  const t0 = profilVitesse(tr, v, c, k).tempsS;
  const res = {} as Record<ParametrePhysique, number>;
  for (const [nom, p] of Object.entries(PARAMETRES) as [ParametrePhysique, (typeof PARAMETRES)[ParametrePhysique]][]) {
    const w = { ...v, deploiement: { ...v.deploiement } } as Record<string, unknown>;
    w[p.cle] = (v[p.cle] as number) * (1 + p.sens * PERTURBATION_SENSIBILITE);
    // La puissance s'améliore sur les deux sources (thermique et électrique).
    if (nom === 'puissance') w['puissanceElectriqueW'] = v.puissanceElectriqueW * (1 + PERTURBATION_SENSIBILITE);
    res[nom] = t0 - profilVitesse(tr, w as unknown as VoiturePhysique, c, k).tempsS;
  }
  return res;
}

/** Part du temps du tour selon ce qui limite la vitesse (virage, freinage, motricité, puissance). */
export function partsDuTour(tr: Trace, p: Profil): Record<Limite, number> {
  const res: Record<Limite, number> = { virage: 0, freinage: 0, motricite: 0, puissance: 0, butee: 0 };
  p.vitesses.forEach((x, i) => { res[p.limites[i]!] += tr.pasM / Math.max(x, 1) / p.tempsS; });
  return res;
}

/* ------------------------------------------------------------------ Virages détectés */

export interface VirageDetecte { debutM: number; finM: number; angleDeg: number; sens: 'gauche' | 'droite'; rayonMinM: number; vMinKmh: number; classe: 'lent' | 'moyen' | 'rapide' }

/** Zones de courbure marquée, coupées à chaque changement de sens, d'angle total suffisant. Vitesse minimale : vitesses fournies (réelles ou calculées). */
export function viragesDetectes(tr: Trace, vitessesKmh: number[]): VirageDetecte[] {
  const k = courburesSignees(tr), n = k.length, pas = tr.pasM, res: VirageDetecte[] = [];
  let debut = -1;
  const fermer = (fin: number) => {
    let ang = 0, kmax = 0, vmin = Infinity;
    for (let q = debut; q < fin; q++) { ang += k[q]! * pas; kmax = Math.max(kmax, Math.abs(k[q]!)); vmin = Math.min(vmin, vitessesKmh[q]!); }
    const deg = (ang * 180) / Math.PI;
    if (Math.abs(deg) >= DETECTION_VIRAGE.angleMinDeg) {
      res.push({ debutM: debut * pas, finM: fin * pas, angleDeg: Math.round(deg), sens: deg > 0 ? 'gauche' : 'droite', rayonMinM: Math.round(1 / kmax), vMinKmh: Math.round(vmin),
        classe: vmin < CLASSES_VIRAGES.lentMaxKmh ? 'lent' : vmin < CLASSES_VIRAGES.moyenMaxKmh ? 'moyen' : 'rapide' });
    }
  };
  for (let i = 0; i <= n; i++) {
    const dans = i < n && Math.abs(k[i]!) > DETECTION_VIRAGE.courbureMin;
    const changeSens = dans && debut >= 0 && k[i]! * k[debut]! < 0;
    if (debut >= 0 && (!dans || changeSens)) { fermer(i); debut = changeSens ? i : -1; }
    else if (dans && debut < 0) debut = i;
  }
  return res;
}
