import { describe, expect, it } from 'vitest';
import {
  besoinsPour, contratEmploi, copierMonde, creerScenarioGrille2026, deserialiser, evaluerOffre, financesDe, lassitudePilote, offresMarche, serialiser, table,
  TABLES, teamPrincipal, titulairesPour, valeurTitulaire, VERSION_FORMAT, type Contrat, type Ecurie, type Finances, type Monde, type Personne,
} from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const personnes = (m: Monde) => Object.values(table(m, TABLES.personnes)) as unknown as Personne[];
const contrats = (m: Monde) => Object.values(table(m, TABLES.contrats)) as unknown as Contrat[];
const ecurie = (m: Monde, id: string) => table(m, TABLES.ecuries)[id] as unknown as Ecurie;

/** Écurie dirigée par le joueur, avec un baquet libre pour la saison suivante et une trésorerie confortable. */
function preparerJoueur(m: Monde, id: string): string {
  ecurie(m, id).pilotee = true;
  const c = contrats(m).find((x) => x.organisation === id && x.poste === 'pilote_titulaire' && x.statut === 'actif')!;
  c.fin = m.date.annee;
  c.nonProlonge = true;
  (financesDe(m, id) as Finances).tresorerieMEUR = 500;
  return teamPrincipal(m, id)!.id;
}

describe('Phase 7a — marché des transferts des pilotes', () => {
  it('sur 4 saisons : toujours deux titulaires par écurie, jamais deux contrats actifs, des signatures et des offres concurrentes', () => {
    const m = sc.creerMonde(4);
    const moteur = sc.creerMoteur();
    let signatures = 0;
    for (let s = 0; s < 4; s++) {
      moteur.avancer(m, 52);
      for (const e of Object.values(table(m, TABLES.ecuries)) as unknown as Ecurie[]) {
        if (e.statut !== 'active') continue;
        expect(personnes(m).filter((p) => p.statut === 'actif' && p.ecurie === e.id && p.poste === 'pilote_titulaire')).toHaveLength(2);
      }
      const actifs = contrats(m).filter((c) => c.type === 'emploi' && c.statut === 'actif').map((c) => c.personne);
      expect(new Set(actifs).size).toBe(actifs.length);
      expect(offresMarche(m)).toHaveLength(0); // volume borné : effacées en fin de saison
    }
    signatures = Object.values(m.evenements).filter((e) => e.type === 'marche.signature').length;
    expect(signatures).toBeGreaterThan(10);
  }, 60_000);

  it('règles communes : fenêtre, team principal, baquet disponible', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    const tp = preparerJoueur(m, 'eq_williams');
    const cible = personnes(m).find((p) => p.poste === 'pilote_junior' && p.statut === 'libre' && 2028 - p.anneeNaissance >= 18 && !p.junior)!;
    const offre = (auteur: string, ecurieId = 'eq_williams') => moteur.commandes.executer(m, { type: 'marche.offre', auteur, source: 'exterieur', parametres: { ecurie: ecurieId, personne: cible.id, salaire: 2, duree: 2, debut: 2028 } });
    expect(offre(tp).ok).toBe(false); // semaine 1 : marché fermé
    moteur.avancer(m, 25); // semaine 26
    expect(offre('per_alonzo').ok).toBe(false); // pas le team principal
    const tpFerrari = teamPrincipal(m, 'eq_ferrari')!.id;
    if (besoinsPour(m, 'eq_ferrari', 2028) === 0) expect(offre(tpFerrari, 'eq_ferrari').ok).toBe(false); // aucun baquet libre
    expect(offre(tp).ok).toBe(true);
    expect(offre(tp).ok).toBe(false); // déjà en attente
  });

  it('débauchage : l’indemnité est versée à l’ancienne écurie, qui perd son pilote à la fin de la saison', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    const tp = preparerJoueur(m, 'eq_williams');
    moteur.avancer(m, 25);
    const fW = financesDe(m, 'eq_williams') as Finances;
    const cibles = contrats(m).filter((c) => c.type === 'emploi' && c.statut === 'actif' && c.poste === 'pilote_titulaire' && c.organisation !== 'eq_williams' && c.fin >= 2028)
      .map((c) => ({ c, p: table(m, TABLES.personnes)[c.personne] as unknown as Personne }))
      .sort((a, b) => (a.p.id < b.p.id ? -1 : 1));
    let signe: { c: Contrat; p: Personne } | undefined;
    for (const x of cibles) {
      const vendeur = financesDe(m, x.c.organisation) as Finances;
      const avant = { tresorerieW: fW.tresorerieMEUR, recus: vendeur.comptes.transfertsRecus ?? 0 };
      const r = moteur.commandes.executer(m, { type: 'marche.offre', auteur: tp, source: 'exterieur', parametres: { ecurie: 'eq_williams', personne: x.p.id, salaire: Math.round(valeurTitulaire(m, x.p) * 2.5), duree: 3, debut: 2028 } });
      if (!r.ok) continue;
      const o = offresMarche(m).find((y) => y.personne === x.p.id && y.ecurie === 'eq_williams')!;
      expect(o.indemniteMEUR).toBeGreaterThan(0);
      for (let i = 0; i < 6 && o.statut === 'en_attente'; i++) moteur.avancer(m, 1);
      if (o.statut !== 'acceptee') continue;
      expect(fW.tresorerieMEUR).toBeCloseTo(avant.tresorerieW - o.indemniteMEUR, 5);
      expect(vendeur.comptes.transfertsRecus ?? 0).toBeCloseTo(avant.recus + o.indemniteMEUR, 5);
      expect(ecurie(m, 'eq_williams').reputationPredateur).toBeGreaterThan(0);
      signe = x;
      break;
    }
    expect(signe).toBeDefined();
    const { c, p } = signe!;
    expect(contratEmploi(m, p.id)?.organisation).toBe(c.organisation); // encore chez son employeur jusqu'à la fin de la saison
    moteur.avancer(m, 52 - m.date.semaine + 2); // après la semaine 50
    expect(p.ecurie).toBe('eq_williams');
    expect(c.statut).toBe('rompu');
    expect(c.motifFin).toBe('rachat');
    expect(titulairesPour(m, c.organisation, 2028)).toHaveLength(2); // l'ancienne écurie a retrouvé un titulaire
  }, 60_000);

  it('pré-accord : un contrat signé pour dans deux saisons ne prend effet qu’en semaine 50 de l’année qui précède', () => {
    const m = sc.creerMonde(2);
    const moteur = sc.creerMoteur();
    const tp = preparerJoueur(m, 'eq_williams');
    // Les deux baquets de 2029 libres aussi.
    for (const c of contrats(m)) if (c.organisation === 'eq_williams' && c.poste === 'pilote_titulaire' && c.statut === 'actif') c.fin = Math.min(c.fin, 2028);
    moteur.avancer(m, 39); // semaine 40
    const jeunes = personnes(m).filter((p) => p.poste === 'pilote_junior' && p.statut === 'libre' && 2029 - p.anneeNaissance >= 18 && 2029 - p.anneeNaissance <= 20).sort((a, b) => (a.id < b.id ? -1 : 1));
    let signe: Personne | undefined;
    for (const p of jeunes) {
      const r = moteur.commandes.executer(m, { type: 'marche.offre', auteur: tp, source: 'exterieur', parametres: { ecurie: 'eq_williams', personne: p.id, salaire: 4, duree: 2, debut: 2029 } });
      if (!r.ok) continue;
      const o = offresMarche(m).find((y) => y.personne === p.id && y.ecurie === 'eq_williams')!;
      for (let i = 0; i < 6 && o.statut === 'en_attente'; i++) moteur.avancer(m, 1);
      if (contrats(m).some((c) => c.personne === p.id && c.statut === 'signe')) { signe = p; break; }
    }
    expect(signe).toBeDefined();
    moteur.avancer(m, 52 - m.date.semaine + 2); // fin 2027 : toujours pas en F1
    expect(signe!.ecurie).not.toBe('eq_williams');
    moteur.avancer(m, 52); // fin 2028 : le contrat commence
    expect(signe!.ecurie).toBe('eq_williams');
    expect(signe!.poste).toBe('pilote_titulaire');
  }, 60_000);

  it('lassitude d’un pilote installé depuis longtemps : envie d’un nouveau défi, calculée et bornée', () => {
    const m = sc.creerMonde(1);
    const p = personnes(m).filter((x) => x.poste === 'pilote_titulaire' && x.statut === 'actif').map((x) => ({ x, l: lassitudePilote(m, x).niveau })).sort((a, b) => b.l - a.l)[0]!;
    expect(p.l).toBeGreaterThan(0);
    expect(p.l).toBeLessThanOrEqual(0.2);
    const autre = (Object.values(table(m, TABLES.ecuries)) as unknown as Ecurie[]).find((e) => e.id !== p.x.ecurie && e.statut === 'active')!;
    const ev = evaluerOffre(m, p.x, { organisation: autre.id, decideur: teamPrincipal(m, autre.id)!.id, poste: 'pilote_titulaire', salaireMEUR: 10, dureeAnnees: 2, promesses: [], prolongation: false });
    expect(ev.raisons.some((r) => r.libelle === 'envie d’un nouveau défi' && r.contribution > 0)).toBe(true);
  });

  it('réputation de prédatrice : un coût (malus d’utilité), jamais une interdiction, qui s’efface', () => {
    const m = sc.creerMonde(1);
    const e = ecurie(m, 'eq_haas');
    e.reputationPredateur = 3;
    const p = personnes(m).find((x) => x.poste === 'pilote_titulaire' && x.ecurie !== 'eq_haas')!;
    const ev = evaluerOffre(m, p, { organisation: 'eq_haas', decideur: teamPrincipal(m, 'eq_haas')!.id, poste: 'pilote_titulaire', salaireMEUR: 10, dureeAnnees: 2, promesses: [], prolongation: false });
    expect(ev.raisons.some((r) => r.libelle === 'écurie réputée prédatrice' && r.contribution < 0 && r.contribution >= -0.15)).toBe(true);
    sc.creerMoteur().avancer(m, 52);
    expect(e.reputationPredateur ?? 0).toBeLessThan(3);
  }, 30_000);

  it('une sauvegarde au format 11 est migrée (table des offres créée)', () => {
    const ancien = copierMonde(sc.creerMonde(1)) as unknown as Record<string, unknown>;
    delete (ancien['tables'] as Record<string, unknown>)['offres'];
    const migre = deserialiser(serialiser(ancien as unknown as Monde).replace(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":11'));
    expect(migre.versionFormat).toBe(VERSION_FORMAT);
    expect(migre.tables['offres']).toEqual({});
  });
});
