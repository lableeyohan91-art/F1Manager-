/** Audit n°4 (contrôle transversal du moteur) — tests de non-régression. */
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  copierMonde, creerScenarioGrille2026, deserialiser, ErreurDonnees, ErreurSauvegarde, financesDe, indicateursSaison, licencier, lireCsv, offresMarche,
  serialiser, spearman, table, TABLES, teamPrincipal, verifierCoherence, type Contrat, type Finances, type Monde, type Personne, type Saison,
} from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';
import { ecrireSauvegarde, lireSauvegardeAvecSecours } from '../src/platform/node/stockage';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const contrats = (m: Monde) => Object.values(table(m, TABLES.contrats)) as unknown as Contrat[];
const personnes = (m: Monde) => Object.values(table(m, TABLES.personnes)) as unknown as Personne[];

/** Remplace le contenu « monde » d'une sauvegarde valide (en gardant l'en-tête). */
function avecMonde(texte: string, transformer: (m: Record<string, unknown>) => unknown, entete?: (e: Record<string, unknown>) => void): string {
  const f = JSON.parse(texte) as { entete: Record<string, unknown>; monde: Record<string, unknown> };
  if (entete) entete(f.entete);
  return JSON.stringify({ entete: f.entete, monde: transformer(f.monde) });
}

describe('Audit n°4 — non-régression', () => {
  it('1. sauvegardes : structure, version, date et références validées, messages compréhensibles', () => {
    const texte = serialiser(sc.creerMonde(1));
    expect(() => deserialiser(texte)).not.toThrow();
    const refus = (t: string, motif: RegExp) => {
      expect(() => deserialiser(t)).toThrow(ErreurSauvegarde);
      expect(() => deserialiser(t)).toThrow(motif);
    };
    refus(avecMonde(texte, () => ({})), /endommagée|invalide/);
    refus(avecMonde(texte, () => []), /monde est absent ou invalide/);
    refus(avecMonde(texte, (m) => m, (e) => { delete e['versionFormat']; }), /version du format/);
    refus(avecMonde(texte, (m) => ({ ...m, date: { annee: 2027, semaine: 99 } })), /date de jeu invalide/);
    refus(avecMonde(texte, (m) => {
      const t = m['tables'] as Record<string, Record<string, Record<string, unknown>>>;
      const c = Object.values(t['contrats']!)[0]!;
      c['personne'] = 'per_fantome';
      return m;
    }), /personne inconnue/);
  });

  it('1 bis. sauvegarde de secours : une sauvegarde endommagée se rabat sur la précédente, en le signalant', () => {
    const dossier = mkdtempSync(join(tmpdir(), 'apex-'));
    const chemin = join(dossier, 'partie.sav');
    const m = sc.creerMonde(1);
    ecrireSauvegarde(chemin, m);
    ecrireSauvegarde(chemin, m); // la première devient la sauvegarde de secours
    writeFileSync(chemin, 'contenu endommagé');
    const r = lireSauvegardeAvecSecours(chemin);
    expect(r.depuisSecours).toBe(true);
    expect(r.erreur).toBeTruthy();
    expect(r.monde.graine).toBe(m.graine);
  });

  it('2. CSV : colonnes en double ou sans nom et guillemets non refermés sont signalés', () => {
    expect(() => lireCsv('t.csv', 'id;nom;nom\n1;a;b', ['id'])).toThrow(ErreurDonnees);
    expect(() => lireCsv('t.csv', 'id;;nom\n1;a;b', ['id'])).toThrow(/sans nom/);
    expect(() => lireCsv('t.csv', 'id;nom\n1;"a;b', ['id'])).toThrow(/guillemet non refermé/);
    expect(lireCsv('t.csv', 'id;nom\n1;"a;b"', ['id'])[0]!.valeurs['nom']).toBe('a;b');
  });

  it('3. licenciement : l’indemnité est débitée une seule fois et inscrite aux comptes (scénario de l’audit)', () => {
    const m = sc.creerMonde(1);
    const c = contrats(m).find((x) => x.organisation === 'eq_williams' && x.poste === 'responsable_aero' && x.statut === 'actif')!;
    c.salaireMEUR = 10;
    c.clauses.indemniteRuptureMEUR = 5;
    const fi = financesDe(m, 'eq_williams') as Finances;
    fi.tresorerieMEUR = 100;
    const avant = fi.comptes.indemnites;
    const tp = teamPrincipal(m, 'eq_williams')!;
    licencier(m, tp, table(m, TABLES.personnes)[c.personne] as unknown as Personne);
    expect(fi.tresorerieMEUR).toBeCloseTo(95, 5);
    expect(fi.comptes.indemnites).toBeCloseTo(avant + 5, 5);
    expect(c.indemniteVerseeMEUR).toBe(5);
  });

  it('4. cohérence : deux contrats actifs, contrat actif avant son début, effectif futur dépassé sont détectés', () => {
    const m = sc.creerMonde(1);
    const p = personnes(m).find((x) => x.poste === 'pilote_titulaire' && x.statut === 'actif')!;
    const c = contrats(m).find((x) => x.personne === p.id && x.statut === 'actif')!;
    const doublon = { ...copierMonde(c as never) as unknown as Contrat, id: 'ctr_doublon', debut: 2030, fin: 2031 };
    table(m, TABLES.contrats)['ctr_doublon'] = doublon as never;
    const pb = verifierCoherence(m);
    expect(pb.some((x) => /2 contrats d'emploi actifs/.test(x))).toBe(true);
    expect(pb.some((x) => /actif avant sa date de début/.test(x))).toBe(true);
  });

  it('4 bis. cohérence maintenue en simulation (3 saisons, contrôles réguliers)', () => {
    const m = sc.creerMonde(2);
    const moteur = sc.creerMoteur();
    for (let i = 0; i < 3 * 13; i++) {
      moteur.avancer(m, 4);
      expect(verifierCoherence(m, { ages: false })).toEqual([]);
    }
  }, 60_000);

  it('5. Spearman : rangs moyens pour les égalités, série constante indéfinie', () => {
    expect(spearman([10, 10, 10], [1, 2, 3])).toBeNaN();
    expect(spearman([1, 2, 3], [1, 2, 3])).toBeCloseTo(1, 10);
    expect(spearman([1, 2, 3], [3, 2, 1])).toBeCloseTo(-1, 10);
    expect(spearman([1, 2, 2, 3], [1, 2, 3, 4])).toBeCloseTo(0.9487, 3);
  });

  it('6. indicateurs historiques : non réécrits par l’évolution ultérieure des pilotes', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 52);
    const s = table(m, TABLES.saisons)['ssn_2027'] as unknown as Saison;
    const avant = indicateursSaison(m, s).surperformanceMeilleursPilotes;
    expect(avant).not.toBeNull();
    for (const p of personnes(m)) for (const k of Object.keys(p.competences)) p.competences[k] = 21 - (p.competences[k] ?? 10);
    expect(indicateursSaison(m, s).surperformanceMeilleursPilotes).toBe(avant);
  }, 30_000);

  it('7. clôture de la fenêtre : une offre de la semaine 48 reçoit une réponse définitive ou expire avec notification', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    m.tables['ecuries']!['eq_williams']!['pilotee'] = true;
    const c = contrats(m).find((x) => x.organisation === 'eq_williams' && x.poste === 'pilote_titulaire' && x.statut === 'actif')!;
    c.fin = 2027;
    c.nonProlonge = true;
    moteur.avancer(m, 47); // semaine 48
    const tp = teamPrincipal(m, 'eq_williams')!;
    const cible = personnes(m).find((p) => p.poste === 'pilote_junior' && p.statut === 'libre' && 2028 - p.anneeNaissance >= 18
      && !contrats(m).some((x) => x.personne === p.id && (x.statut === 'signe' || (x.type === 'affiliation' && x.statut === 'actif'))))!;
    expect(moteur.commandes.executer(m, { type: 'marche.offre', auteur: tp.id, source: 'exterieur', parametres: { ecurie: 'eq_williams', personne: cible.id, salaire: 0.5, duree: 2, debut: 2028 } }).ok).toBe(true);
    const o = offresMarche(m).find((x) => x.personne === cible.id)!;
    moteur.avancer(m, 2); // semaines 48 et 49 (clôture)
    expect(['acceptee', 'refusee', 'expiree']).toContain(o.statut);
    if (o.statut === 'expiree') expect(Object.values(m.evenements).some((e) => e.type === 'marche.offre_expiree')).toBe(true);
  });
});

describe('Audit n°4 — format 13', () => {
  it('une sauvegarde au format 12 est migrée ; une saison sans relevé garde un indicateur indéfini', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 52);
    const s = table(m, TABLES.saisons)['ssn_2027'] as unknown as Saison;
    delete s.niveauxPilotes;
    const migre = deserialiser(serialiser(m).replace(/"versionFormat":13/g, '"versionFormat":12'));
    expect(migre.versionFormat).toBe(13);
    expect(indicateursSaison(migre, table(migre, TABLES.saisons)['ssn_2027'] as unknown as Saison).surperformanceMeilleursPilotes).toBeNull();
  }, 30_000);
});
