/**
 * D-179 — piège de la pauvreté, leviers A (investisseur d'opportunité) et C (objectifs du propriétaire) ; format 33.
 */
import { describe, expect, it } from 'vitest';
import {
  creerScenarioGrille2026, deserialiser, ecuriesActives, financesDe, proprietaireActif, serialiser, table, TABLES, verifierInvestisseur, VERSION_FORMAT,
  type Ecurie, type Finances, type Saison,
} from '../src/engine';
import { INVESTISSEUR, OBJECTIF_PROPRIETAIRE } from '../src/engine/balance/finances';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());

describe('D-179, levier C — objectifs du propriétaire', () => {
  it('après une saison : chaque écurie a un objectif (gagner une place, le champion garde la première) ; une progression atteinte → apport majoré', () => {
    const m = sc.creerMonde(2), moteur = sc.creerMoteur();
    moteur.avancer(m, 53);
    const s = table(m, TABLES.saisons)['ssn_2027'] as unknown as Saison;
    for (const e of ecuriesActives(m)) {
      const fi = financesDe(m, e.id) as Finances;
      const rang = s.constructeurs.findIndex((c) => c.ecurie === e.id) + 1;
      expect(fi.objectifProprietaire).toEqual({ annee: 2028, place: Math.max(1, rang - OBJECTIF_PROPRIETAIRE.progressionPlaces), depart: rang });
    }
    moteur.avancer(m, 52);
    const s2 = table(m, TABLES.saisons)['ssn_2028'] as unknown as Saison;
    for (const e of ecuriesActives(m)) {
      const fi = financesDe(m, e.id) as Finances;
      const rang2028 = s2.constructeurs.findIndex((c) => c.ecurie === e.id) + 1;
      const rang2027 = s.constructeurs.findIndex((c) => c.ecurie === e.id) + 1;
      // Bonus : une progression atteinte, par une écurie partie de la 5e place ou au-delà (les grandes sont au plafond).
      const atteint = rang2028 <= Math.max(1, rang2027 - 1) && rang2027 >= OBJECTIF_PROPRIETAIRE.placeMinBonus;
      expect(fi.bonusApport?.annee === 2029).toBe(atteint);
      if (atteint) expect(fi.bonusApport!.facteur).toBeCloseTo(1 + OBJECTIF_PROPRIETAIRE.bonusApport, 5);
    }
  }, 120_000);
});

describe('D-179, levier A — investisseur d’opportunité', () => {
  it('une écurie qui stagne en bas, hors crise, finit par être rachetée par un repreneur plus riche et ambitieux ; pas deux fois de suite', () => {
    const m = sc.creerMonde(3);
    const e = table(m, TABLES.ecuries)['eq_haas'] as unknown as Ecurie;
    const fi = financesDe(m, e.id) as Finances;
    const ancien = proprietaireActif(m, e.id)!;
    const apportAncien = ancien.apportBaseMEUR;
    // Saisons fabriquées : Haas dernière pendant des années (seul le classement compte ici).
    const ids = ecuriesActives(m).map((x) => x.id).filter((id) => id !== e.id);
    const saison = (annee: number) => ({ id: `ssn_${annee}`, annee, constructeurs: [...ids, e.id].map((ecurie) => ({ ecurie, points: 0 })) });
    let rachat: number | undefined;
    for (let annee = 2031; annee < 2061 && rachat === undefined; annee++) {
      m.date = { annee, semaine: 1 };
      for (let k = 1; k <= INVESTISSEUR.fenetreSaisons; k++) table(m, TABLES.saisons)[`ssn_${annee - k}`] = saison(annee - k) as never;
      verifierInvestisseur(m, e, fi);
      if (proprietaireActif(m, e.id)!.id !== ancien.id) rachat = annee;
    }
    expect(rachat).toBeDefined();
    const nouveau = proprietaireActif(m, e.id)!;
    expect(nouveau.apportBaseMEUR).toBeGreaterThanOrEqual(INVESTISSEUR.hausseApportMin * apportAncien - 0.1);
    expect(nouveau.ambition).toBeGreaterThanOrEqual(INVESTISSEUR.ambitionMin);
    expect(Object.values(m.evenements).some((ev) => ev.type === 'proprietaire.rachat' && ev.contexte?.['motif'] === 'investisseur')).toBe(true);
    // Délai : pas de nouveau rachat juste après.
    m.date = { annee: rachat! + 1, semaine: 1 };
    for (let k = 1; k <= INVESTISSEUR.fenetreSaisons; k++) table(m, TABLES.saisons)[`ssn_${rachat! + 1 - k}`] = saison(rachat! + 1 - k) as never;
    verifierInvestisseur(m, e, fi);
    expect(proprietaireActif(m, e.id)!.id).toBe(nouveau.id);
  });

  it('une écurie qui ne stagne pas en bas n’attire pas d’investisseur', () => {
    const m = sc.creerMonde(3);
    const e = table(m, TABLES.ecuries)['eq_mercedes'] as unknown as Ecurie;
    const ancien = proprietaireActif(m, e.id)!;
    const ids = ecuriesActives(m).map((x) => x.id).filter((id) => id !== e.id);
    for (let annee = 2031; annee < 2051; annee++) {
      m.date = { annee, semaine: 1 };
      for (let k = 1; k <= INVESTISSEUR.fenetreSaisons; k++) table(m, TABLES.saisons)[`ssn_${annee - k}`] = { id: `ssn_${annee - k}`, annee: annee - k, constructeurs: [e.id, ...ids].map((ecurie) => ({ ecurie, points: 0 })) } as never;
      verifierInvestisseur(m, e, financesDe(m, e.id) as Finances);
    }
    expect(proprietaireActif(m, e.id)!.id).toBe(ancien.id);
  });
});

describe('Format 33', () => {
  it('migration v32 → v33 : la partie se recharge et avance', () => {
    const m = sc.creerMonde(4);
    const texte = serialiser(m).replaceAll(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":32');
    const migre = deserialiser(texte);
    expect(migre.versionFormat).toBe(VERSION_FORMAT);
    sc.creerMoteur().avancer(migre, 4);
  }, 120_000);
});
