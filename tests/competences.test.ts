import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  AUTEUR_DEVELOPPEUR, affinite, copierMonde, deserialiser, serialiser, VERSION_FORMAT, creerScenarioGrille2026, erreurPression, mettreAJourEtat, modificateurNiveau, niveauPilote,
  personneDe, table, TABLES, type Circuit, type Monde, type Personne, type Saison,
} from '../src/engine';
import { COMPETENCES_PILOTE } from '../src/engine/balance/personnages';
import { AFFINITE } from '../src/engine/balance/carriere';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const p = (m: Monde, id: string) => personneDe(m, id) as Personne;
const circuit = (m: Monde, id: string) => table(m, TABLES.circuits)[id] as unknown as Circuit;
const fichiers = (d: string): string[] => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? fichiers(join(d, f)) : [join(d, f)]));

describe('Phase 6a complémentaire — compétences, circuits, mental, expérience', () => {
  it('deux pilotes de même niveau général brillent sur des circuits opposés', () => {
    const m = sc.creerMonde(1);
    const base = p(m, 'per_gasli');
    const freineur = structuredClone(base);
    const rapide = structuredClone(base);
    Object.assign(freineur.competences, { freinage: 19, motricite: 18, viragesRapides: 13, viragesLents: 14 });
    Object.assign(rapide.competences, { freinage: 14, motricite: 13, viragesRapides: 19, viragesLents: 18 });
    expect(Math.abs(niveauPilote(freineur, false) - niveauPilote(rapide, false))).toBeLessThan(0.05);
    const monza = circuit(m, 'cir_monza').exigences, suzuka = circuit(m, 'cir_suzuka').exigences;
    expect(niveauPilote(freineur, false, monza)).toBeGreaterThan(niveauPilote(rapide, false, monza));
    expect(niveauPilote(rapide, false, suzuka)).toBeGreaterThan(niveauPilote(freineur, false, suzuka));
  });

  it('chaque compétence de pilote a une influence mesurable sur le niveau', () => {
    const m = sc.creerMonde(1);
    const base = p(m, 'per_okon');
    for (const c of COMPETENCES_PILOTE) {
      const x = structuredClone(base);
      x.competences[c] = (x.competences[c] ?? 10) + 2;
      expect(niveauPilote(x, true), c).toBeGreaterThan(niveauPilote(base, true));
    }
  });

  it('prodige contre vétéran : le jeune découvre les circuits, le vétéran les connaît', () => {
    const m = sc.creerMonde(1);
    const suzuka = circuit(m, 'cir_suzuka');
    const jeune = (Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).find((x) => x.poste === 'pilote_junior' && m.date.annee - x.anneeNaissance === 19)!;
    expect(modificateurNiveau(m, jeune, suzuka).nouveaute).toBeLessThan(modificateurNiveau(m, p(m, 'per_alonzo'), suzuka).nouveaute);
    expect(p(m, 'per_alonzo').carriere!.experience!.gp).toBeGreaterThan(300);
  });

  it('finale de championnat : un pilote fragile craque plus souvent qu’un pilote solide et expérimenté', () => {
    const m = sc.creerMonde(1);
    const fragile = structuredClone(p(m, 'per_noris'));
    const solide = structuredClone(p(m, 'per_noris'));
    fragile.traits['sangFroid'] = 3; fragile.carriere!.experience!.luttesTitre = 0;
    solide.traits['sangFroid'] = 18; solide.carriere!.experience!.luttesTitre = 4;
    const saison = { calendrier: Array.from({ length: 24 }, (_, i) => `gp${i}`), bareme: [25], pilotes: [{ pilote: fragile.id, points: 300 }, { pilote: 'autre', points: 310 }] } as unknown as Saison;
    let erreursFragile = 0, erreursSolide = 0;
    for (let i = 0; i < 400; i++) {
      if (erreurPression(m, fragile, saison, 23, `essai${i}`) > 0) erreursFragile++;
      if (erreurPression(m, solide, saison, 23, `essai${i}`) > 0) erreursSolide++;
    }
    expect(erreursFragile).toBeGreaterThan(2 * erreursSolide);
    // Hors course décisive : jamais d'erreur sous pression.
    expect(erreurPression(m, fragile, saison, 5, 'debut')).toBe(0);
  });

  it('en confiance ou en méforme : la forme change le résultat (même pilote, même course)', () => {
    const a = sc.creerMonde(3);
    const moteur = sc.creerMoteur();
    moteur.avancer(a, 10);
    const b = copierMonde(a);
    p(a, 'per_noris').etat.confiance = 95;
    p(b, 'per_noris').etat.confiance = 25;
    moteur.avancer(a, 3);
    moteur.avancer(b, 3);
    const gp = (m: Monde) => (Object.values(table(m, TABLES.grandsPrix)) as unknown as { termine: boolean; resultats: { pilote: string; explication?: { forme: number } }[] }[]).find((g) => g.termine)!;
    const forme = (m: Monde) => gp(m).resultats.find((r) => r.pilote === 'per_noris')!.explication!.forme;
    expect(forme(a)).toBeGreaterThan(forme(b));
  });

  it('résilience : un pilote résilient se remet plus vite d’un coup dur', () => {
    const m = sc.creerMonde(1);
    const resilient = structuredClone(p(m, 'per_gasli'));
    const fragile = structuredClone(p(m, 'per_gasli'));
    resilient.traits['resilience'] = 19; fragile.traits['resilience'] = 2;
    resilient.etat.moral = fragile.etat.moral = 30;
    mettreAJourEtat(m, resilient, []);
    mettreAJourEtat(m, fragile, []);
    expect(resilient.etat.moral).toBeGreaterThan(fragile.etat.moral);
  });

  it('affinités : bornées à ±2 et à ±0,3 point de niveau', () => {
    const m = sc.creerMonde(2);
    sc.creerMoteur().avancer(m, 2 * 52);
    for (const x of Object.values(table(m, TABLES.personnes)) as unknown as Personne[]) {
      if (x.poste !== 'pilote_titulaire') continue;
      for (const c of Object.values(table(m, TABLES.circuits)) as unknown as Circuit[]) {
        const a = affinite(m, x, c);
        expect(Math.abs(a)).toBeLessThanOrEqual(2);
        expect(Math.abs(modificateurNiveau(m, x, c).affinite)).toBeLessThanOrEqual(2 * AFFINITE.parCran + 1e-9);
      }
    }
  });

  it('mode développeur : la commande modifie une note, refuse une valeur hors bornes, et reste réservée aux outils', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    const cmd = (valeur: number, auteur = AUTEUR_DEVELOPPEUR) => moteur.commandes.executer(m, { type: 'dev.modifier_personne', auteur, source: 'exterieur', parametres: { personne: 'per_strol', champ: 'competence', cle: 'freinage', valeur } });
    expect(cmd(19).ok).toBe(true);
    expect(p(m, 'per_strol').competences['freinage']).toBe(19);
    expect(cmd(25).ok).toBe(false);
    expect(cmd(15, 'per_strol').ok).toBe(false);
    expect(Object.values(m.evenements).some((e) => e.type === 'dev.modification')).toBe(true);
  });

  it('audit : plus aucune lecture de « vitesse » ; chaque nouvel attribut est lu par une formule', () => {
    const code = fichiers('src/engine').filter((f) => f.endsWith('.ts')).map((f) => [f, readFileSync(f, 'utf8')] as const);
    for (const [f, t] of code) if (!f.includes('sauvegarde')) expect(t, f).not.toMatch(/competences\[['"]vitesse['"]\]/);
    const lu = (motif: RegExp) => code.some(([f, t]) => !f.includes('/balance/') && !f.includes('sauvegarde') && motif.test(t));
    expect(lu(/traits\['resilience'\]/)).toBe(true);
    expect(lu(/luttesTitre/)).toBe(true);
    expect(lu(/affinites/)).toBe(true);
    expect(lu(/exigences\.difficulte/)).toBe(true);
    expect(lu(/exigences\.risqueAccident/)).toBe(true);
  });

  it('une sauvegarde au format 7 est migrée : vitesse répartie, intelligence de course, résilience, exigences des circuits', () => {
    const ancien = copierMonde(sc.creerMonde(1)) as unknown as Record<string, unknown>;
    const tables = ancien['tables'] as Record<string, Record<string, Record<string, unknown>>>;
    for (const c of Object.values(tables['circuits']!)) delete c['exigences'];
    for (const x of Object.values(tables['personnes']!)) {
      const comp = x['competences'] as Record<string, number>;
      delete (x['traits'] as Record<string, number>)['resilience'];
      if (!String(x['poste']).startsWith('pilote')) continue;
      comp['vitesse'] = comp['freinage'] ?? 12;
      for (const c of ['freinage', 'viragesLents', 'viragesRapides', 'motricite', 'intelligenceCourse']) delete comp[c];
      const k = x['carriere'] as Record<string, unknown> | undefined;
      if (k) delete k['experience'];
    }
    const migre = deserialiser(serialiser(ancien as unknown as Monde).replace(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":7'));
    const v = p(migre, 'per_verstapen');
    expect(v.competences['vitesse']).toBeUndefined();
    expect(v.competences['freinage']).toBeGreaterThan(15);
    expect(v.competences['intelligenceCourse']).toBeGreaterThan(0);
    expect(v.traits['resilience']).toBeGreaterThan(0);
    expect(circuit(migre, 'cir_monaco').exigences.lents).toBeGreaterThan(0);
    sc.creerMoteur().avancer(migre, 53);
  }, 60_000);
});


describe('Laboratoire — compétitivité à toutes les positions (D-113)', () => {
  it('les indicateurs de positions sont calculés pour les pilotes et les constructeurs, dans des bornes cohérentes', async () => {
    const { indicateursPositions } = await import('../src/engine');
    const m = sc.creerMonde(4);
    sc.creerMoteur().avancer(m, 50);
    const s = table(m, TABLES.saisons)['ssn_2027'] as unknown as Saison;
    const ip = indicateursPositions(m, s)!;
    for (const x of [ip.pilotes, ip.constructeurs]) {
      expect(x.mobilite75).toBeGreaterThanOrEqual(x.mobilite25 - 0.3); // le classement se fige au fil de la saison
      expect(x.mobilite75).toBeLessThanOrEqual(1);
      for (const v of [x.partGainPerte2, x.disputeesMath.tout, x.disputeesRaisonnables.tout, x.acquisesPrematurement.tout, x.stablesDisputees, x.isolees]) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
      expect(x.disputeesRaisonnables.tout).toBeLessThanOrEqual(x.disputeesMath.tout);
    }
  });
});
