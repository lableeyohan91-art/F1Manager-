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

import { AERO_ACTIVE, AIR, POINTS_ESSENTIELS, CLASSES_VIRAGES, DETECTION_VIRAGE, G, NIVEAUX_AILERONS, PERTURBATION_SENSIBILITE, PROFIL, PUISSANCE_ALTITUDE_EXPOSANT, VOITURE_REFERENCE } from '../balance/profil';

export interface PointTrace { x: number; y: number; z: number; v?: number }
export interface Trace {
  circuit: string; longueurM: number; pasM: number; points: PointTrace[];
  /** Adhérence du revêtement (1 = moyenne du calendrier) : multiplie toutes les adhérences pneu-piste (D-159 §2.1). */
  adherencePiste?: { valeur: number; statut: string };
}
export type VoiturePhysique = typeof VOITURE_REFERENCE;
export interface Conditions { altitudeM: number; temperatureC?: number }

/** Ce qui limite la vitesse en un point. */
export type Limite = 'virage' | 'freinage' | 'motricite' | 'puissance' | 'butee';
export interface Profil {
  tempsS: number;
  vitesses: number[]; // m/s
  /** Vitesse au-dessus de laquelle l'énergie électrique n'est plus déployée (budget par tour) ; null si le budget suffit partout. */
  coupureKmh: number | null;
  /** Énergie électrique déployée sur le tour (J) : part de l'effort d'accélération au-delà du moteur thermique. */
  energieElectriqueJ: number;
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
  const kap0 = (k ?? courbures(tr)).map(Math.abs);
  // Courbure effective : lissée sur une durée de trajet (PROFIL.lissageTemporelS), pas sur une distance fixe. À haute vitesse,
  // la voiture traverse un pic de courbure court (bruit de mesure, petite correction de trajectoire) sans devoir ralentir.
  // La durée est convertie en distance avec la vitesse CALCULÉE de cette voiture (premier profil), jamais la vitesse réelle.
  if (PROFIL.lissageTemporelS <= 0) return profilDeploye(tr, v, c, kap0);
  // Premier profil approché (un seul passage, sans budget d'énergie) : il ne sert qu'à convertir la durée en distance.
  const premier = passeUnique(tr, v, c, kap0, Infinity);
  return profilDeploye(tr, v, c, lisseSurDuree(kap0, premier.vitesses, tr.pasM, PROFIL.lissageTemporelS));
}

/** Moyenne glissante de la courbure sur ± (vitesse × durée) mètres autour de chaque point. */
function lisseSurDuree(kap: number[], vitesses: number[], pas: number, dureeS: number): number[] {
  const n = kap.length, cumul = new Float64Array(3 * n + 1);
  for (let i = 0; i < 3 * n; i++) cumul[i + 1] = cumul[i]! + kap[i % n]!; // tracé déroulé trois fois : fenêtres qui bouclent sans cas particulier
  return kap.map((_, i) => {
    const h = Math.min(n - 1, Math.max(0, Math.round((vitesses[i]! * dureeS) / pas)));
    return (cumul[n + i + h + 1]! - cumul[n + i - h]!) / (2 * h + 1);
  });
}

function profilDeploye(tr: Trace, v: VoiturePhysique, c: Conditions, kap: number[]): Profil {
  // Budget d'énergie électrique par tour. Une écurie dépense son énergie là où elle rapporte le plus de temps : aux vitesses basses
  // et moyennes (le gain par joule y est le plus grand), et coupe en bout de ligne droite (« clipping » observé en 2026).
  // On cherche donc la vitesse de coupure au-dessus de laquelle on ne déploie plus, telle que l'énergie dépensée égale le budget.
  let p = passeUnique(tr, v, c, kap, Infinity);
  if (p.energieElectriqueJ <= v.energieElectriqueTourJ) return p;
  let bas = 0, haut = v.vitesseMaxMs;
  for (let it = 0; it < PROFIL.iterationsEnergie; it++) {
    const milieu = (bas + haut) / 2;
    const q = passeUnique(tr, v, c, kap, milieu);
    if (q.energieElectriqueJ > v.energieElectriqueTourJ) haut = milieu; else { bas = milieu; p = q; }
  }
  if (bas === 0) p = passeUnique(tr, v, c, kap, 0);
  return p;
}


/** La voiture sur ce revêtement : toutes les adhérences pneu-piste multipliées par l'adhérence de la piste. */
export function surPiste(v: VoiturePhysique, tr: Trace): VoiturePhysique {
  const f = tr.adherencePiste?.valeur ?? 1;
  return f === 1 ? v : { ...v, muMeca: v.muMeca * f, muAero: v.muAero * f, muMotricite: v.muMotricite * f, muFreinage: v.muFreinage * f };
}

function passeUnique(tr: Trace, v0: VoiturePhysique, c: Conditions, kap: number[], coupure: number): Profil {
  const v = surPiste(v0, tr);
  const n = kap.length, pas = tr.pasM, m = v.masseKg;
  const rho = densiteAir(c), rhoRel = rho / AIR.densiteMer;
  // Aérodynamique active : configuration « ligne droite » sur les portions presque droites.
  const ligne = kap.map((kk) => kk < 1 / AERO_ACTIVE.rayonMinLigneM);
  const appui = (vv: number, i: number) => 0.5 * rho * v.cla * (ligne[i] ? 1 - v.reductionAppuiLigne : 1) * vv * vv;
  const trainee = (vv: number, i: number) => 0.5 * rho * v.cda * (ligne[i] ? 1 - v.reductionTraineeLigne : 1) * vv * vv;
  // 1. Vitesse maximale en virage : m v² κ = muMeca m g + muAero × appui(v)  →  v² = muMeca m g / (m κ − muAero ½ ρ CLA)
  const vmax: number[] = [];
  for (const kk of kap) {
    const den = m * kk - v.muAero * 0.5 * rho * v.cla;
    vmax.push(den > 0 ? Math.min(v.vitesseMaxMs, Math.sqrt((v.muMeca * m * G) / den)) : v.vitesseMaxMs);
  }
  const vit = vmax.slice();
  const lim: Limite[] = vmax.map((x) => (x >= v.vitesseMaxMs ? 'butee' : 'virage'));
  // Puissance électrique réellement utilisée au point (W) : seulement là où la voiture accélère, et seulement la part de l'effort
  // qui dépasse le thermique. Limitée par la motricité, la voiture utilise moins d'électrique, mais pas zéro (correctif 24/11/2026 :
  // auparavant ces points étaient gratuits, ce qui rendait un gain de motricité négatif).
  const elec = new Array<number>(n).fill(0);
  const pThermique = v.puissanceThermiqueW * Math.pow(rhoRel, PUISSANCE_ALTITUDE_EXPOSANT);
  for (let passe = 0; passe < PROFIL.passes; passe++) {
    // 2. Passe avant (accélération).
    for (let i = 1; i < 2 * n; i++) {
      const a = (i - 1) % n, b = i % n, vv = Math.max(vit[a]!, 1);
      const fPuissance = puissance(v, vv, rhoRel, vv < coupure ? 1 : 0) / vv;
      const fMotricite = v.muMotricite * (m * G + appui(vv, a));
      const f = Math.min(fPuissance, fMotricite) - trainee(vv, a);
      const suiv = Math.sqrt(Math.max(0, vv * vv + (2 * pas * f) / m));
      if (suiv < vit[b]!) {
        vit[b] = suiv; lim[b] = fPuissance < fMotricite ? 'puissance' : 'motricite';
        elec[b] = Math.max(0, Math.min(fPuissance, fMotricite) * vv - pThermique);
      }
    }
    // 3. Passe arrière (freinage).
    for (let i = 2 * n; i > 0; i--) {
      const a = i % n, b = (i - 1) % n, vv = vit[a]!;
      const f = v.muFreinage * (m * G + appui(vv, a)) + trainee(vv, a);
      const prec = Math.sqrt(vv * vv + (2 * pas * f) / m);
      if (prec < vit[b]!) { vit[b] = prec; lim[b] = 'freinage'; elec[b] = 0; }
    }
  }
  let t = 0, e = 0;
  vit.forEach((x, i) => { t += pas / Math.max(x, 1); if (lim[i] === 'puissance' || lim[i] === 'motricite') e += elec[i]! * pas / Math.max(x, 1); });
  return { tempsS: t, vitesses: vit, limites: lim, courbures: kap, coupureKmh: Number.isFinite(coupure) ? Math.round(coupure * 3.6) : null, energieElectriqueJ: e };
}

/** Voiture avec un niveau d'ailerons a (réglage du week-end). */
export function avecAilerons(v: VoiturePhysique, a: number): VoiturePhysique {
  return { ...v, cla: v.cla * (1 + a), cda: v.cda * (1 + NIVEAUX_AILERONS.trainee * a) };
}

/**
 * Niveau d'appui naturel : le réglage d'ailerons qui donne le meilleur tour à cette voiture sur ce circuit. Le temps au tour varie
 * de façon unimodale avec le niveau : recherche par section dorée (≈ 10 profils au lieu de 31), arrondie au pas des réglages.
 */
export function appuiNaturel(tr: Trace, v: VoiturePhysique, c: Conditions, k?: number[]): { niveau: number; profil: Profil } {
  const kk = k ?? courbures(tr), cache = new Map<number, Profil>();
  const arrondi = (a: number) => Math.round(Math.min(NIVEAUX_AILERONS.max, Math.max(NIVEAUX_AILERONS.min, a)) / NIVEAUX_AILERONS.pas) * NIVEAUX_AILERONS.pas;
  const essai = (a: number) => {
    const x = +arrondi(a).toFixed(2);
    if (!cache.has(x)) cache.set(x, profilVitesse(tr, avecAilerons(v, x), c, kk));
    return cache.get(x)!.tempsS;
  };
  const or = (Math.sqrt(5) - 1) / 2;
  let lo = NIVEAUX_AILERONS.min, hi = NIVEAUX_AILERONS.max;
  while (hi - lo > NIVEAUX_AILERONS.pas) {
    const x1 = hi - or * (hi - lo), x2 = lo + or * (hi - lo);
    if (essai(x1) <= essai(x2)) hi = x2; else lo = x1;
  }
  for (const a of [lo, (lo + hi) / 2, hi, NIVEAUX_AILERONS.min, NIVEAUX_AILERONS.max]) essai(a);
  let best: { niveau: number; profil: Profil } | undefined;
  for (const [x, p] of [...cache.entries()].sort((a, b) => a[0] - b[0])) if (!best || p.tempsS < best.profil.tempsS) best = { niveau: x, profil: p };
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

/* ------------------------------------------------------------------ Points essentiels (fiche circuit) */

export interface PointsEssentiels<K extends string> { essentiels: [K, K]; moinsImportant: K; parts: Record<K, number> }

/**
 * Les deux paramètres les plus déterminants d'un circuit et le moins influent, à partir des gains bruts du circuit et de leur moyenne
 * sur le calendrier. Un paramètre au gain négligeable ne peut pas être essentiel (POINTS_ESSENTIELS). Même calcul pour la fiche et le moteur.
 */
export function pointsEssentiels<K extends string>(gains: Record<K, number>, moyennes: Record<K, number>): PointsEssentiels<K> {
  const cles = Object.keys(gains) as K[];
  const max = Math.max(...cles.map((k) => gains[k]));
  const rel = {} as Record<K, number>;
  for (const k of cles) rel[k] = moyennes[k] > 0 ? Math.max(0, gains[k]) / moyennes[k] : 0;
  const total = cles.reduce((a, k) => a + rel[k], 0) || 1;
  const parts = {} as Record<K, number>;
  for (const k of cles) parts[k] = rel[k] / total;
  const significatif = (k: K) => gains[k] >= POINTS_ESSENTIELS.gainNegligeableS && gains[k] >= POINTS_ESSENTIELS.partNegligeable * max;
  const tri = [...cles].sort((a, b) => parts[b] - parts[a] || (a < b ? -1 : 1));
  const candidats = tri.filter(significatif);
  const ess = (candidats.length >= 2 ? candidats : tri).slice(0, 2) as [K, K];
  return { essentiels: ess, moinsImportant: tri[tri.length - 1]!, parts };
}
