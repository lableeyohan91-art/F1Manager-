/**
 * Phase 11b — profil de vitesse sur les 5 circuits détaillés (data/circuits/*.json, traces dérivées de tours réels de 2026).
 * Reproductible depuis le dépôt : aucune donnée téléchargée pendant les tests.
 * Ces tests vérifient la physique (sens des effets) et fixent l'état mesuré du calage, sans forcer de résultat attendu.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { appuiNaturel, avecAilerons, courbures, pointsEssentiels, profilVitesse, sensibilites, viragesDetectes, type Trace } from '../src/engine/circuits/profil';
import { VOITURE_REFERENCE } from '../src/engine/balance/profil';

type TraceReelle = Trace & { viragesOfficiels: number; tempsTourS: { mediane: number }; points: { x: number; y: number; z: number; v: number }[] };
const ALTITUDE: Record<string, number> = { cir_monza: 160, cir_monaco: 10, cir_suzuka: 45, cir_singapour: 10, cir_mexico: 2240 };
const CIRCUITS = Object.keys(ALTITUDE);
const lire = (c: string) => JSON.parse(readFileSync(`data/circuits/${c}.json`, 'utf8')) as TraceReelle;
const cond = (c: string) => ({ altitudeM: ALTITUDE[c]! });

describe('Phase 11b — traces des 5 circuits', () => {
  it.each(CIRCUITS)('%s : la trace a la longueur officielle (±1,5 %) et des vitesses réelles plausibles', (c) => {
    const t = lire(c);
    let l = 0;
    t.points.forEach((p, i) => { const q = t.points[(i + 1) % t.points.length]!; l += Math.hypot(q.x - p.x, q.y - p.y); });
    expect(Math.abs(l - t.longueurM) / t.longueurM).toBeLessThan(0.015);
    for (const p of t.points) { expect(p.v).toBeGreaterThan(40); expect(p.v).toBeLessThan(370); }
  });

  it.each(CIRCUITS)('%s : virages détectés à ±4 du nombre officiel', (c) => {
    const t = lire(c);
    expect(Math.abs(viragesDetectes(t, t.points.map((p) => p.v as number)).length - t.viragesOfficiels)).toBeLessThanOrEqual(4);
  });
});

describe('Phase 11b — profil de vitesse : physique', () => {
  it('déterministe : deux calculs identiques', () => {
    const t = lire('cir_monza');
    expect(profilVitesse(t, VOITURE_REFERENCE, cond('cir_monza')).tempsS).toBe(profilVitesse(t, VOITURE_REFERENCE, cond('cir_monza')).tempsS);
  });

  it.each(CIRCUITS)('%s : chaque amélioration d’un paramètre physique ne ralentit pas la voiture (au bruit numérique près)', (c) => {
    const s = sensibilites(lire(c), VOITURE_REFERENCE, cond(c));
    for (const [k, v] of Object.entries(s)) expect(v, k).toBeGreaterThan(-0.02);
  });

  it('plus de traînée → vitesse de pointe plus basse ; plus d’appui → virages plus rapides (Monza)', () => {
    const t = lire('cir_monza'), k = courbures(t);
    const base = profilVitesse(t, VOITURE_REFERENCE, cond('cir_monza'), k);
    const trainee = profilVitesse(t, { ...VOITURE_REFERENCE, cda: VOITURE_REFERENCE.cda * 1.2 }, cond('cir_monza'), k);
    const appui = profilVitesse(t, { ...VOITURE_REFERENCE, cla: VOITURE_REFERENCE.cla * 1.2 }, cond('cir_monza'), k);
    expect(Math.max(...trainee.vitesses)).toBeLessThan(Math.max(...base.vitesses));
    const enVirage = (p: typeof base) => p.vitesses.filter((_, i) => base.limites[i] === 'virage').reduce((a, b) => a + b, 0);
    expect(enVirage(appui)).toBeGreaterThan(enVirage(base));
  });

  it('plus d’adhérence mécanique → vitesse minimale plus haute (Monaco)', () => {
    const t = lire('cir_monaco'), k = courbures(t);
    const a = Math.min(...profilVitesse(t, VOITURE_REFERENCE, cond('cir_monaco'), k).vitesses);
    const b = Math.min(...profilVitesse(t, { ...VOITURE_REFERENCE, muMeca: VOITURE_REFERENCE.muMeca * 1.1 }, cond('cir_monaco'), k).vitesses);
    expect(b).toBeGreaterThan(a);
  });

  it('altitude : air moins dense → moins de traînée et moins d’appui (même voiture, même tracé)', () => {
    const t = lire('cir_mexico'), k = courbures(t);
    const basse = profilVitesse(t, VOITURE_REFERENCE, { altitudeM: 0 }, k), haute = profilVitesse(t, VOITURE_REFERENCE, { altitudeM: 2240 }, k);
    const enVirage = (p: typeof basse) => p.vitesses.filter((_, i) => basse.limites[i] === 'virage').reduce((a, b) => a + b, 0);
    expect(enVirage(haute)).toBeLessThan(enVirage(basse));
  });

  it('réglage d’ailerons : Monza reçoit moins d’appui que Monaco (calculé, pas imposé)', () => {
    expect(appuiNaturel(lire('cir_monza'), VOITURE_REFERENCE, cond('cir_monza')).niveau).toBeLessThan(appuiNaturel(lire('cir_monaco'), VOITURE_REFERENCE, cond('cir_monaco')).niveau);
  });
});

describe('Phase 11b — état du calage (24/11/2026, à améliorer : voir le rapport)', () => {
  it.each(CIRCUITS)('%s : temps au tour du modèle à ±6 % du tour réel de qualification ; vitesse à ±20 km/h en moyenne', (c) => {
    const t = lire(c);
    const { profil: p } = appuiNaturel(t, VOITURE_REFERENCE, cond(c));
    expect(Math.abs(p.tempsS - t.tempsTourS.mediane) / t.tempsTourS.mediane).toBeLessThan(0.06);
    const ecart = p.vitesses.reduce((a, v, i) => a + Math.abs(v * 3.6 - t.points[i]!.v), 0) / p.vitesses.length;
    expect(ecart).toBeLessThan(20);
  });

  it('le calcul d’un tour reste léger (moins de 200 ms pour le choix des ailerons, soit 17 profils)', () => {
    const t = lire('cir_suzuka');
    const t0 = performance.now();
    appuiNaturel(t, avecAilerons(VOITURE_REFERENCE, 0), cond('cir_suzuka'));
    expect(performance.now() - t0).toBeLessThan(200);
  });
});

describe('Phase 11b — points essentiels (normalisation validée le 24/11/2026)', () => {
  it('un paramètre au gain négligeable ne peut pas être essentiel, même si sa part normalisée est la plus forte', () => {
    const gains = { adherence: 0.4, appui: 0.3, motricite: 0.04 };
    const moyennes = { adherence: 0.4, appui: 0.3, motricite: 0.01 }; // la motricité pèse 4 fois sa moyenne, mais 0,04 s seulement
    const r = pointsEssentiels(gains, moyennes);
    expect(r.parts.motricite).toBeGreaterThan(r.parts.adherence);
    expect(r.essentiels).not.toContain('motricite');
  });

  it('les points essentiels sont calculés par le même profil que le temps au tour (cohérence fiche et moteur)', () => {
    const c = 'cir_monza', t = lire(c);
    const { niveau } = appuiNaturel(t, VOITURE_REFERENCE, cond(c));
    const g = sensibilites(t, avecAilerons(VOITURE_REFERENCE, niveau), cond(c));
    const r = pointsEssentiels({ trainee: g.trainee, puissance: g.puissance, appui: g.appui, adherenceMecanique: g.adherenceMecanique }, { trainee: 0.12, puissance: 0.19, appui: 0.32, adherenceMecanique: 0.36 });
    // À Monza, ce qui pèse le plus (normalisé) est la traînée ou la puissance ; mesuré, pas imposé.
    expect(r.essentiels).toEqual(expect.arrayContaining(['trainee']));
  });
});

