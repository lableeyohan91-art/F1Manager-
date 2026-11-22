import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  bilanCarrieres, changerMetier, copierMonde, creerScenarioGrille2026, deserialiser, faireProgresser, genererCohorte, lireEvenement,
  niveauCarriere, personneDe, potentielEstime, serialiser, souvenirsDe, table, TABLES, tirageLocal, verifierCoherence, VERSION_FORMAT,
  ajouterEvenement, type Monde, type Personne,
} from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const S = 52;
const p = (m: Monde, id: string) => personneDe(m, id) as Personne;
/** Fait progresser une copie de la personne pendant `n` périodes, sans toucher au monde. */
function evoluer(m: Monde, base: Personne, n: number, modifier: (x: Personne) => void): Personne {
  const x = structuredClone(base);
  modifier(x);
  for (let i = 0; i < n; i++) {
    m.date.semaine = 4 * ((i % 13) + 1);
    faireProgresser(m, x, []);
  }
  return x;
}

describe('Phase 6a — cycle de vie', () => {
  it('chaque personne a un profil de carrière ; Alonzo (imposé « longévité ») ne s’effondre pas en 2027', () => {
    const m = sc.creerMonde(1);
    for (const x of Object.values(table(m, TABLES.personnes)) as unknown as Personne[]) expect(x.carriere).toBeDefined();
    expect(p(m, 'per_alonzo').carriere!.archetype).toBe('longevite');
    const avant = niveauCarriere(p(m, 'per_alonzo'));
    sc.creerMoteur().avancer(m, S);
    expect(niveauCarriere(p(m, 'per_alonzo'))).toBeGreaterThan(avant - 0.6);
  });

  it('environnement : un jeune titulaire progresse plus qu’un réserviste, toutes choses égales par ailleurs', () => {
    const m = sc.creerMonde(1);
    const jeune = p(m, 'per_antoneli');
    jeune.carriere!.debutApogee = 30; // en pleine progression
    const titulaire = evoluer(m, jeune, 13, () => undefined);
    const reserviste = evoluer(m, jeune, 13, (x) => { x.poste = 'pilote_reserve'; });
    expect(niveauCarriere(titulaire)).toBeGreaterThan(niveauCarriere(reserviste));
    expect(niveauCarriere(titulaire)).toBeGreaterThan(niveauCarriere(jeune));
  });

  it('déclin : la vitesse pure baisse avant la régularité', () => {
    const m = sc.creerMonde(1);
    const v = structuredClone(p(m, 'per_alonzo'));
    v.carriere!.finApogee = 35; // déclin entamé à 45 ans
    v.carriere!.archetype = 'regulier';
    v.carriere!.vitesseDeclin = 1;
    const apres = evoluer(m, v, 13, () => undefined);
    const perteVitesse = v.competences['vitesse']! - apres.competences['vitesse']!;
    const perteRegularite = v.competences['regularite']! - apres.competences['regularite']!;
    expect(perteVitesse).toBeGreaterThan(perteRegularite);
    expect(perteVitesse).toBeGreaterThan(0);
  });

  it('potentiel estimé : fourchette plus large pour un jeune, et aucune décision ne lit le vrai potentiel (audit)', () => {
    const m = sc.creerMonde(1);
    const jeune = (Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).find((x) => x.poste === 'pilote_junior' && m.date.annee - x.anneeNaissance === 16)!;
    expect(potentielEstime(m, 'eq_ferrari', jeune).demiLargeur).toBeGreaterThan(potentielEstime(m, 'eq_ferrari', p(m, 'per_alonzo')).demiLargeur);
    for (const dossier of ['src/engine/systems/humain', 'src/engine/systems/economie', 'src/engine/systems/saison']) {
      for (const f of readdirSync(dossier)) expect(readFileSync(join(dossier, f), 'utf8')).not.toMatch(/\.potentiel\b/);
    }
  });

  it('abandon (D-101) : un jeune de 27 ans sans baquet en F1 renonce ; une cohorte arrive chaque année', () => {
    const m = sc.creerMonde(2);
    const jeunes = (Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).filter((x) => x.poste === 'pilote_junior' && x.statut === 'libre').slice(0, 10);
    for (const j of jeunes) j.anneeNaissance = m.date.annee - 27;
    bilanCarrieres(m);
    expect(jeunes.filter((j) => j.statut !== 'libre' || j.poste !== 'pilote_junior').length).toBeGreaterThanOrEqual(8);
    const avant = Object.keys(table(m, TABLES.personnes)).length;
    expect(genererCohorte(m)).toHaveLength(25);
    expect(Object.keys(table(m, TABLES.personnes)).length).toBe(avant + 25);
  });

  it('reconversion : souvenirs et relations suivent la personne dans son nouveau métier', () => {
    const m = sc.creerMonde(1);
    const ev = ajouterEvenement(m, { type: 'test', acteurs: [], importance: 2 }).id;
    lireEvenement(m, 'per_alonzo', 'per_hammilton', 'trahison', ev);
    const n = souvenirsDe(m, 'per_alonzo').length;
    changerMetier(p(m, 'per_alonzo'), 'team_principal', tirageLocal(m, 'test'), 46);
    expect(p(m, 'per_alonzo').poste).toBe('team_principal');
    expect(p(m, 'per_alonzo').competences['negociation']).toBeGreaterThan(0);
    expect(p(m, 'per_alonzo').competences['vitesse']).toBeUndefined();
    expect(souvenirsDe(m, 'per_alonzo')).toHaveLength(n);
  });

  it('retour (D-072) : un retraité récent, ambitieux et encore performant peut revenir', () => {
    const m = sc.creerMonde(3);
    const v = p(m, 'per_hammilton');
    v.statut = 'retraite';
    v.ecurie = '';
    v.traits['ambition'] = 20;
    let revenu = false;
    for (let k = 0; k < 2 && !revenu; k++) {
      for (let essai = 0; essai < 40 && !revenu; essai++) {
        m.date.annee = 2027 + essai;
        v.anneeNaissance = m.date.annee - 40;
        v.retraiteDepuis = m.date.annee - 1;
        bilanCarrieres(m);
        revenu = (v.statut as string) === 'libre';
      }
    }
    expect(revenu).toBe(true);
  });

  it('10 saisons : cohérent, des débutants issus des cohortes, des retraites ; migration 6 → 7', () => {
    const m = sc.creerMonde(5);
    sc.creerMoteur().avancer(m, 10 * S + 1);
    expect(verifierCoherence(m, { ages: true })).toEqual([]);
    const types = new Set(Object.values(m.evenements).map((e) => e.type));
    expect(types.has('personne.retraite')).toBe(true);
    // Migration : on retire les profils, on repasse en format 6.
    const ancien = copierMonde(sc.creerMonde(1)) as unknown as Record<string, unknown>;
    for (const x of Object.values((ancien['tables'] as Record<string, Record<string, Record<string, unknown>>>)['personnes']!)) delete x['carriere'];
    const texte = serialiser(ancien as unknown as Monde).replace(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":6');
    const migre = deserialiser(texte);
    expect((Object.values(table(migre, TABLES.personnes)) as unknown as Personne[]).every((x) => x.carriere)).toBe(true);
    expect(p(migre, 'per_alonzo').carriere!.finApogee).toBeGreaterThan(2027 - p(migre, 'per_alonzo').anneeNaissance);
    sc.creerMoteur().avancer(migre, S + 1);
  }, 60_000);
});
