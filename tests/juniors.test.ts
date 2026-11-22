import { describe, expect, it } from 'vitest';
import {
  copierMonde, creerScenarioGrille2026, deserialiser, ecuriesJuniors, saisonJunior, serialiser, table, TABLES, verifierCoherence, VERSION_FORMAT,
  type Monde, type Personne,
} from '../src/engine';
import { CATEGORIES_JUNIORS } from '../src/engine/balance/juniors';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const personnes = (m: Monde) => Object.values(table(m, TABLES.personnes)) as unknown as Personne[];

describe('Phase 6b-1 — filières juniors', () => {
  it('monde de départ : 21 écuries juniors, 3 saisons de passé simulé, grille de F1 inchangée', () => {
    const m = sc.creerMonde(1);
    expect(ecuriesJuniors(m).filter((e) => e.categorie === 'apex3')).toHaveLength(10);
    expect(ecuriesJuniors(m).filter((e) => e.categorie === 'apex2')).toHaveLength(11);
    for (const annee of [2024, 2025, 2026]) {
      expect(saisonJunior(m, 'apex2', annee)?.champion).toBeTruthy();
      expect(saisonJunior(m, 'apex3', annee)?.champion).toBeTruthy();
    }
    expect(personnes(m).filter((p) => (p.carriere?.juniors?.length ?? 0) > 0).length).toBeGreaterThan(40);
    // Le passé junior ne touche pas la F1 : les titulaires restent ceux des données.
    const titulaires = personnes(m).filter((p) => p.poste === 'pilote_titulaire' && p.statut === 'actif');
    expect(titulaires).toHaveLength(22);
    expect(titulaires.every((p) => p.origine === 'donnees')).toBe(true);
  });

  it('une saison : grilles complètes et sans doublon, manches courues, expérience des circuits acquise', () => {
    const m = sc.creerMonde(2);
    sc.creerMoteur().avancer(m, 50);
    for (const cat of ['apex3', 'apex2'] as const) {
      const sj = saisonJunior(m, cat, 2027)!;
      expect(sj.manches.filter((x) => x.termine)).toHaveLength(CATEGORIES_JUNIORS[cat].manches);
      expect(sj.termine).toBe(true);
      const places = CATEGORIES_JUNIORS[cat].ecuries * CATEGORIES_JUNIORS[cat].pilotesParEcurie;
      expect(sj.classement.length).toBeLessThanOrEqual(places);
      expect(sj.classement.length).toBeGreaterThan(places * 0.8);
      for (const e of ecuriesJuniors(m).filter((x) => x.categorie === cat)) {
        expect(personnes(m).filter((p) => p.junior?.ecurie === e.id && p.junior.annee === 2027).length).toBeLessThanOrEqual(CATEGORIES_JUNIORS[cat].pilotesParEcurie);
      }
    }
    const juniors = personnes(m).filter((p) => p.junior?.annee === 2027);
    expect(juniors.every((p) => p.statut !== 'actif')).toBe(true); // un pilote de F1 n'occupe pas de baquet junior
    expect(juniors.some((p) => Object.keys(p.carriere?.experience?.circuits ?? {}).length >= 8)).toBe(true);
    expect(verifierCoherence(m, { ages: true })).toEqual([]);
  });

  it('marché des baquets : l’argent compte, mais les grands talents trouvent une place même sans moyens', () => {
    const m = sc.creerMonde(3);
    sc.creerMoteur().avancer(m, 4);
    const eligibles = personnes(m).filter((p) => p.statut === 'libre' && p.poste.startsWith('pilote') && 2027 - p.anneeNaissance >= 16 && 2027 - p.anneeNaissance <= 21);
    const places = eligibles.filter((p) => p.junior?.annee === 2027);
    const budget = (l: Personne[]) => l.reduce((a, p) => a + (p.budgetFamilleMEUR ?? 0), 0) / Math.max(1, l.length);
    expect(budget(places)).toBeGreaterThan(budget(eligibles)); // les places vont plus souvent aux familles aisées
    expect(places.some((p) => (p.budgetFamilleMEUR ?? 0) < 0.3)).toBe(true); // mais des talents modestes courent aussi
  });

  it('une sauvegarde au format 8 est migrée : les écuries juniors sont créées au premier marché', () => {
    const ancien = copierMonde(sc.creerMonde(1)) as unknown as Record<string, unknown>;
    const tables = ancien['tables'] as Record<string, unknown>;
    delete tables['ecuriesJuniors'];
    delete tables['saisonsJuniors'];
    const migre = deserialiser(serialiser(ancien as unknown as Monde).replace(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":8'));
    expect(ecuriesJuniors(migre)).toHaveLength(0);
    sc.creerMoteur().avancer(migre, 5);
    expect(ecuriesJuniors(migre)).toHaveLength(21);
    expect(saisonJunior(migre, 'apex2', 2027)).toBeDefined();
  });
});
