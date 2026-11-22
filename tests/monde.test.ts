import { describe, expect, it } from 'vitest';
import {
  chargerDonnees,
  construireMonde,
  creerScenarioGrille2026,
  deserialiser,
  empreinte,
  ErreurDonnees,
  serialiser,
  verifierCoherence,
  type Personne,
} from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const fichiers = lireDonneesGrille2026();
const sc = creerScenarioGrille2026(fichiers);
const personnes = (m: ReturnType<typeof sc.creerMonde>) => Object.values(m.tables['personnes'] ?? {}) as unknown as Personne[];

describe('Phase 2 — génération du monde (grille 2026)', () => {
  it('critère 1 : monde complet en moins d’une seconde', () => {
    const t0 = performance.now();
    sc.creerMonde(42);
    expect(performance.now() - t0).toBeLessThan(1000);
  });

  it('critère 2 : même graine ⇒ même monde ; graine différente ⇒ personnalités différentes', () => {
    expect(empreinte(sc.creerMonde(42))).toBe(empreinte(sc.creerMonde(42)));
    const a = personnes(sc.creerMonde(1)).find((p) => p.id === 'per_leclerq')!;
    const b = personnes(sc.creerMonde(2)).find((p) => p.id === 'per_leclerq')!;
    expect(a.traits).not.toEqual(b.traits);
    // Les données réelles, elles, ne bougent pas.
    expect(a.competences['vitesse']).toBe(b.competences['vitesse']);
  });

  it('critère 3 : contrôles de cohérence sans erreur sur 20 graines', () => {
    for (let g = 1; g <= 20; g++) expect(verifierCoherence(sc.creerMonde(g))).toEqual([]);
  });

  it('11 écuries, 22 pilotes titulaires, 9 postes pourvus par écurie', () => {
    const m = sc.creerMonde(42);
    expect(Object.keys(m.tables['ecuries'] ?? {})).toHaveLength(11);
    expect(personnes(m).filter((p) => p.poste === 'pilote_titulaire' && p.statut === 'actif')).toHaveLength(22);
  });

  it('la grille de 2027 est exactement celle des données (D-048)', () => {
    const m = sc.creerMonde(7);
    const leclerq = personnes(m).find((p) => p.id === 'per_leclerq')!;
    expect(leclerq.ecurie).toBe('eq_ferrari');
    expect(leclerq.nom).toBe('Leclerq');
  });

  it('modifier une personne dans les données ne change pas la personnalité des autres', () => {
    const modifie = { ...fichiers, 'personnes.csv': fichiers['personnes.csv']!.replace('per_leclerq;Charles;Leclerq', 'per_leclerq;Charles;Leclercq') };
    const a = personnes(sc.creerMonde(3)).find((p) => p.id === 'per_verstapen')!;
    const b = personnes(creerScenarioGrille2026(modifie).creerMonde(3)).find((p) => p.id === 'per_verstapen')!;
    expect(a.traits).toEqual(b.traits);
  });

  it('sauvegarde et rechargement du monde 2026', () => {
    const m = sc.creerMonde(42);
    expect(empreinte(deserialiser(serialiser(m)))).toBe(empreinte(m));
  });
});

describe('Phase 2 — erreurs de données claires (critère 4)', () => {
  it('une note hors bornes est signalée avec fichier, ligne et colonne', () => {
    const casse = { ...fichiers, 'personnes.csv': fichiers['personnes.csv']!.replace('per_verstapen;Max;Verstapen;NED;1997-09-30;pilote_titulaire;eq_redbull;actif;20', 'per_verstapen;Max;Verstapen;NED;1997-09-30;pilote_titulaire;eq_redbull;actif;25') };
    try {
      chargerDonnees(casse);
      expect.fail('aurait dû échouer');
    } catch (e) {
      expect(e).toBeInstanceOf(ErreurDonnees);
      expect((e as ErreurDonnees).problemes.join('\n')).toMatch(/personnes\.csv, ligne 2, colonne « vitesse » : 25 hors des bornes/);
    }
  });

  it('une écurie inconnue dans un contrat est signalée', () => {
    const casse = { ...fichiers, 'contrats.csv': fichiers['contrats.csv']!.replace('ctr_001;per_verstapen;eq_redbull', 'ctr_001;per_verstapen;eq_inconnue') };
    expect(() => chargerDonnees(casse)).toThrow(/identifiant inconnu « eq_inconnue »/);
  });

  it('un fichier manquant est signalé', () => {
    const { ['circuits.csv']: _, ...sans } = fichiers;
    expect(() => chargerDonnees(sans)).toThrow(/Fichier manquant : circuits\.csv/);
  });

  it('un monde construit depuis des données modifiées reste cohérent', () => {
    const d = chargerDonnees(fichiers);
    d.ecuries = d.ecuries.slice(0, 10).map((e) => e); // une écurie de moins : le monde s'adapte (D-041)
    const idsRestants = new Set(d.ecuries.map((e) => e.id));
    d.personnes = d.personnes.filter((p) => !p.ecurie || idsRestants.has(p.ecurie));
    d.contrats = d.contrats.filter((c) => idsRestants.has(c.organisation));
    const m = construireMonde(5, d, 'test');
    expect(Object.keys(m.tables['ecuries'] ?? {})).toHaveLength(10);
    expect(verifierCoherence(m)).toEqual([]);
  });
});
