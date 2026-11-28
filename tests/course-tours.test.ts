/**
 * Phase 13a (D-192) — course tour par tour : pneus, carburant, batterie, consignes, stratégie, arrêts ; commande commune ; format 36.
 */
import { describe, expect, it } from 'vitest';
import {
  arretEquipe, CONSIGNES_NEUTRES, courirTours, coutRelais, creerScenarioGrille2026, deserialiser, facteurUsure, meilleureStrategie, serialiser, table,
  TABLES, teamPrincipal, toursCourse, VERSION_FORMAT, type Circuit, type Ecurie, type GrandPrix, type Personne,
} from '../src/engine';
import { ARRETS, CARBURANT, COMPOSES, CONSIGNES, RESSOURCES } from '../src/engine/balance/course';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const circuit = (deg = 3) => ({ exigences: { degradationPneus: deg }, sensibilites: { tempsS: 90 } }) as unknown as Circuit;

describe('Phase 13a — pneus et stratégie', () => {
  it('un relais plus long coûte plus que proportionnellement ; la falaise punit un relais trop long', () => {
    expect(coutRelais('tendre', 20, 1) / 20).toBeGreaterThan(coutRelais('tendre', 10, 1) / 10);
    const v = COMPOSES.tendre.vie;
    expect(coutRelais('tendre', v + 5, 1) - coutRelais('tendre', v, 1)).toBeGreaterThan(5 * (COMPOSES.tendre.usure * (v + 2)));
  });
  it('usure : circuit dégradant, pilote et voiture bons gestionnaires, consignes', () => {
    const c = CONSIGNES_NEUTRES;
    expect(facteurUsure(circuit(5), 12, 16, c)).toBeGreaterThan(facteurUsure(circuit(2), 12, 16, c));
    expect(facteurUsure(circuit(), 18, 16, c)).toBeLessThan(facteurUsure(circuit(), 8, 16, c));
    expect(facteurUsure(circuit(), 12, 16, { ...c, conduite: 'agressive' })).toBeGreaterThan(facteurUsure(circuit(), 12, 16, c));
    expect(facteurUsure(circuit(), 12, 16, { ...c, pneus: 'conservatrice' })).toBeLessThan(facteurUsure(circuit(), 12, 16, c));
  });
  it('sur le sec, au moins deux composés ; sous la pluie, aucun arrêt ; plus d’usure → plus d’arrêts (ou relais plus courts)', () => {
    const s = meilleureStrategie(60, 1, 25, false);
    expect(new Set(s.composes).size).toBeGreaterThanOrEqual(2);
    expect(s.relais.reduce((a, b) => a + b, 0)).toBe(60);
    expect(meilleureStrategie(60, 1, 25, true).relais).toEqual([60]);
    expect(meilleureStrategie(60, 2.5, 25, false).relais.length).toBeGreaterThanOrEqual(s.relais.length);
  });
  it('nombre de tours borné', () => {
    expect(toursCourse(circuit())).toBeGreaterThanOrEqual(40);
    expect(toursCourse(circuit())).toBeLessThanOrEqual(80);
  });
});

describe('Phase 13a — ressources et arrêts', () => {
  const s = meilleureStrategie(55, 1, 25, false);
  const sans = () => false;
  it('carburant agressif toute la course : économie forcée qui coûte plus que le gain ; neutre : aucun manque', () => {
    const n = courirTours(55, s, 1, CONSIGNES_NEUTRES, 90, undefined, sans);
    expect(n.carburant).toBe(0);
    const a = courirTours(55, s, 1, { ...CONSIGNES_NEUTRES, carburant: 'agressive' }, 90, undefined, sans);
    expect(a.carburant).toBeGreaterThan(0);
    expect(a.carburant + a.consignes).toBeGreaterThan(0); // le gain de rythme ne compense pas l'économie forcée
  });
  it('batterie agressive : rapide tant que la réserve tient, puis recharge forcée ; au total, pas de gain massif', () => {
    const a = courirTours(55, s, 1, { ...CONSIGNES_NEUTRES, batterie: 'agressive' }, 90, undefined, sans);
    expect(Math.abs(a.batterie)).toBeLessThan(RESSOURCES.rechargeForcee);
  });
  it('équipe des stands : rapide et précise = arrêts plus courts et sans erreur', () => {
    expect(arretEquipe({ rapidite: 95, precision: 95, fatigue: 0 }).immobilisationS).toBeLessThan(arretEquipe({ rapidite: 40, precision: 40, fatigue: 50 }).immobilisationS);
    expect(arretEquipe({ rapidite: 95, precision: 100, fatigue: 0 }).pErreur).toBe(0);
    const err = courirTours(55, s, 1, CONSIGNES_NEUTRES, 90, { rapidite: 50, precision: 0, fatigue: 0 }, () => true);
    const ok = courirTours(55, s, 1, CONSIGNES_NEUTRES, 90, { rapidite: 50, precision: 0, fatigue: 0 }, sans);
    expect(err.arrets - ok.arrets).toBeCloseTo((ARRETS.perteErreurS / 90) * 100 * (s.relais.length - 1) / 55, 5);
  });
});

describe('Phase 13a — dans le jeu', () => {
  it('les Grands Prix sont courus tour par tour (stratégie, arrêts dans l’explication) ; consignes par la commande commune', () => {
    const m = sc.creerMonde(2), mo = sc.creerMoteur();
    mo.avancer(m, 3);
    const e = table(m, TABLES.ecuries)['eq_alpine'] as unknown as Ecurie;
    const tp = teamPrincipal(m, e.id)!;
    const pilote = (Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).find((p) => p.ecurie === e.id && p.poste === 'pilote_titulaire' && p.statut === 'actif')!;
    const cmd = (prm: Record<string, unknown>) => mo.commandes.executer(m, { type: 'course.consignes', auteur: tp.id, source: 'exterieur', parametres: { ecurie: e.id, pilote: pilote.id, ...prm } });
    expect(cmd({ conduite: 'folle' }).ok).toBe(false);
    expect(cmd({ conduite: 'agressive', pneus: 'conservatrice' }).ok).toBe(true);
    expect(e.consignesCourse?.[pilote.id]).toEqual({ ...CONSIGNES_NEUTRES, conduite: 'agressive', pneus: 'conservatrice' });
    mo.avancer(m, 12);
    const gp = (Object.values(table(m, TABLES.grandsPrix)) as unknown as GrandPrix[]).find((g) => g.termine)!;
    const r = gp.resultats.find((x) => x.pilote === pilote.id)!;
    expect(r.explication?.strategie?.length).toBeGreaterThanOrEqual(1);
    expect(r.explication?.tours).toBeGreaterThanOrEqual(40);
    expect(r.explication?.consignes).toBeCloseTo(0.01, 5); // conduite agressive + pneus conservateurs : −0,17 + 0,18
  }, 120_000);

  it('format 36 : une sauvegarde v35 se charge et la partie avance', () => {
    const m = sc.creerMonde(3);
    const texte = serialiser(m).replaceAll(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":35');
    const migre = deserialiser(texte);
    expect(migre.versionFormat).toBe(VERSION_FORMAT);
    sc.creerMoteur().avancer(migre, 2);
  }, 120_000);
});

describe('13a bis — pneus, carburant, sensibilités de course', () => {
  it('mise en température : un relais coûte aussi ses tours de chauffe ; un circuit chaud use plus', () => {
    const k = COMPOSES.dur;
    expect(coutRelais('dur', 10, 0) - k.ecart * 10).toBeCloseTo((k.chauffe as readonly number[]).reduce((a, b) => a + b, 0), 6);
    const chaud = { exigences: { degradationPneus: 3 }, temperatureMensuelle: Array(12).fill(35), sensibilites: { tempsS: 90 } } as unknown as Circuit;
    const doux = { exigences: { degradationPneus: 3 }, temperatureMensuelle: Array(12).fill(18), sensibilites: { tempsS: 90 } } as unknown as Circuit;
    expect(facteurUsure(chaud, 12, 16, CONSIGNES_NEUTRES, 6)).toBeGreaterThan(facteurUsure(doux, 12, 16, CONSIGNES_NEUTRES, 6));
  });
  it('circuit très dégradant : deux arrêts ou plus ; peu dégradant : un seul', () => {
    expect(meilleureStrategie(57, facteurUsure(circuit(5), 12, 16, CONSIGNES_NEUTRES), 26, false).relais.length).toBeGreaterThanOrEqual(3);
    expect(meilleureStrategie(57, facteurUsure(circuit(1), 12, 16, CONSIGNES_NEUTRES), 26, false).relais.length).toBe(2);
  });
  it('charge réduite : plus rapide grâce à la masse, mais l’économie forcée coûte ; réduite + carburant agressif : panne sèche', () => {
    const s = meilleureStrategie(55, 1, 25, false);
    const n = courirTours(55, s, 1, CONSIGNES_NEUTRES, 90, undefined, () => false, 0.25);
    const r = courirTours(55, s, 1, { ...CONSIGNES_NEUTRES, charge: 'reduite', carburant: 'conservatrice' }, 90, undefined, () => false, 0.25);
    expect(n.panneSeche).toBe(false);
    expect(r.panneSeche).toBe(false);
    expect(r.carburant).toBeLessThan(n.carburant); // plus léger, et la consigne conservatrice couvre presque le manque
    const p = courirTours(55, s, 1, { ...CONSIGNES_NEUTRES, charge: 'reduite', carburant: 'agressive' }, 90, undefined, () => false, 0.25);
    expect(p.panneSeche).toBe(CARBURANT.charge.reduite * -1 + (CONSIGNES.carburant.agressive.conso - 1) - RESSOURCES.margeCarburant > CARBURANT.panneSeuil);
  });
  it('les Grands Prix lisent les sensibilités de course ; celles de qualification sont gardées', () => {
    const m = sc.creerMonde(1);
    const c = Object.values(table(m, TABLES.circuits))[0] as unknown as Circuit;
    expect(c.sensibilitesQualif).toBeDefined();
    expect(c.sensibilites!.tempsS).toBeGreaterThan(c.sensibilitesQualif!.tempsS); // la voiture de course est plus lente
  });
});
