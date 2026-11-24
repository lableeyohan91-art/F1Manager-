/** Phase 11 — médias et archives (docs/systemes/phase-11-medias-archives.md, D-149). */
import { describe, expect, it } from 'vitest';
import {
  articles, calculerRecords, chargerDonnees, contratEmploi, creerScenarioGrille2026, decisionsEnAttente, deserialiser, executerCommandeJoueur, medias,
  nomArchive, serialiser, texteArticle, titresConsecutifs, lassitudePublic, table, TABLES, teamPrincipal, valeurCommerciale, verifierCoherence, ajouterEvenement,
  type Article, type Conference, type ContratSponsoring, type Ecurie, type Monde, type Personne,
} from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const fichiers = lireDonneesGrille2026();
const sc = creerScenarioGrille2026(fichiers);
const ecurie = (m: Monde, id: string) => table(m, TABLES.ecuries)[id] as unknown as Ecurie;
const personnes = (m: Monde) => Object.values(table(m, TABLES.personnes)) as unknown as Personne[];
const auPoste = (m: Monde, e: string, poste: string) => personnes(m).find((p) => p.statut === 'actif' && p.ecurie === e && p.poste === poste)!;

function conference(m: Monde, idEcurie: string, question: Conference['question'], options: Conference['options'], echeance = { annee: m.date.annee, semaine: m.date.semaine + 2 }): Conference {
  const c: Conference = { id: `cnf_test_${idEcurie}`, ecurie: idEcurie, question, date: { ...m.date }, echeance, options };
  table(m, TABLES.conferences)[c.id] = c as never;
  return c;
}

describe('Phase 11 — données et sauvegarde', () => {
  it('les 9 médias fictifs sont chargés ; un média national sans nationalité est refusé', () => {
    expect(medias(sc.creerMonde(1))).toHaveLength(9);
    const casse = { ...fichiers, 'medias.csv': fichiers['medias.csv']!.replace('national;GBR', 'national;') };
    expect(() => chargerDonnees(casse)).toThrow(/n'a pas de nationalité/);
  });

  it('une sauvegarde au format 25 est migrée ; sans médias, le système reste inactif sans erreur', () => {
    const m = sc.creerMonde(2);
    const texte = serialiser(m).replace(/"versionFormat":\d+/g, '"versionFormat":25').replace(/"medias":\{[^]*?\}\},"articles"/, '"medias":{},"articles"');
    const migre = deserialiser(texte);
    expect(migre.versionFormat).toBe(26);
    for (const k of Object.keys(migre.tables['medias'] ?? {})) delete migre.tables['medias']![k];
    sc.creerMoteur().avancer(migre, 3);
    expect(articles(migre)).toHaveLength(0);
  });
});

describe('Phase 11 — articles', () => {
  it('une saison : aucun article sans fait source ; un fait publié est public et a une phrase ; une rumeur est présentée comme telle', () => {
    const m = sc.creerMonde(3);
    const moteur = sc.creerMoteur();
    const vus = new Set<string>();
    for (let k = 0; k < 52; k++) {
      moteur.avancer(m, 1);
      for (const a of articles(m)) {
        if (vus.has(a.id)) continue;
        vus.add(a.id);
        const source = m.evenements[a.source];
        expect(source, a.titre).toBeDefined();
        if (a.genre === 'rumeur') {
          expect(source!.type).toBe('media.rumeur');
          expect(texteArticle(a)).toMatch(/Rien n'est confirmé|n'ont confirmé/);
          expect(typeof a.vraie).toBe('boolean');
        } else {
          expect(source!.visibilite).toBe('public');
          expect(texteArticle(a)).toBe(source!.texte);
        }
      }
    }
    expect(vus.size).toBeGreaterThan(50);
    const genres = new Set([...articles(m)].map((a: Article) => a.genre));
    expect(genres.has('fait') && genres.has('rumeur') && genres.has('declaration')).toBe(true);
    expect(verifierCoherence(m, { ages: false })).toEqual([]);
  }, 120_000);
});

describe('Phase 11 — image publique', () => {
  it('contrefactuel : critiquer son pilote en public abîme l’image de l’auteur, pas en privé', () => {
    const base = sc.creerMonde(4);
    sc.creerMoteur().avancer(base, 2);
    const essai = (publique: boolean) => {
      const m = deserialiser(serialiser(base));
      const tp = teamPrincipal(m, 'eq_alpine')!;
      const pilote = auPoste(m, 'eq_alpine', 'pilote_titulaire');
      expect(executerCommandeJoueur(sc.creerMoteur(), m, { type: 'personnel.critiquer', auteur: tp.id, parametres: { personne: pilote.id, publique } }).ok).toBe(true);
      sc.creerMoteur().avancer(m, 1);
      return teamPrincipal(m, 'eq_alpine')!.image ?? 0;
    };
    expect(essai(true)).toBeLessThan(essai(false));
  });

  it('l’image pèse sur la valeur commerciale d’un pilote', () => {
    const m = sc.creerMonde(4);
    const p = auPoste(m, 'eq_ferrari', 'pilote_titulaire');
    const neutre = valeurCommerciale(m, p);
    p.image = 50;
    expect(valeurCommerciale(m, p)).toBeGreaterThan(neutre);
    p.image = -50;
    expect(valeurCommerciale(m, p)).toBeLessThan(neutre);
  });

  it('un scandale (promesse rompue révélée) : fait public causé, image en baisse, sponsors sensibles déçus', () => {
    const m = sc.creerMonde(5);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 2);
    const tp = teamPrincipal(m, 'eq_williams')!;
    const fait = ajouterEvenement(m, { type: 'promesse.rompue', acteurs: [{ id: tp.id, role: 'auteur' }, { id: 'eq_williams', role: 'organisation' }], importance: 3, visibilite: 'prive', texte: `${tp.prenom} ${tp.nom} n'a pas tenu sa promesse.` });
    const contrats = (Object.values(table(m, TABLES.contratsSponsoring)) as unknown as ContratSponsoring[]).filter((c) => c.ecurie === 'eq_williams' && c.statut === 'actif');
    const avant = contrats.map((c) => c.satisfaction);
    ajouterEvenement(m, { type: 'information.revelee', acteurs: [{ id: tp.id, role: 'auteur' }], importance: 3, visibilite: 'public', causes: [fait.id], contexte: { fait: fait.id, type: 'promesse.rompue', motif: 'presse' }, texte: 'La presse révèle une promesse rompue.' });
    moteur.avancer(m, 1);
    const sc1 = Object.values(m.evenements).find((x) => x.type === 'media.scandale')!;
    expect(sc1).toBeDefined();
    expect(sc1.visibilite).toBe('public');
    expect((ecurie(m, 'eq_williams').image ?? 0)).toBeLessThan(0);
    expect((teamPrincipal(m, 'eq_williams')!.image ?? 0)).toBeLessThan(0);
    expect(contrats.some((c, i) => c.satisfaction < avant[i]!)).toBe(true);
  });
});

describe('Phase 11 — conférences de presse', () => {
  it('le joueur répond par la même commande que l’IA : « viser le titre » relève l’objectif du conseil', () => {
    const m = sc.creerMonde(6);
    const moteur = sc.creerMoteur();
    executerCommandeJoueur(moteur, m, { type: 'joueur.prendre_ecurie', auteur: 'joueur', parametres: { ecurie: 'eq_mclaren', prenom: 'Camille', nom: 'Presse' } });
    const moi = teamPrincipal(m, 'eq_mclaren')!;
    executerCommandeJoueur(moteur, m, { type: 'joueur.deleguer', auteur: moi.id, parametres: { ecurie: 'eq_mclaren', domaine: 'communication', actif: false } });
    const c = conference(m, 'eq_mclaren', 'objectif_titre', ['viser_titre', 'prudence', 'esquiver']);
    expect(decisionsEnAttente(m).some((d) => d.type === 'conference' && d.conference === c.id)).toBe(true);
    expect(executerCommandeJoueur(moteur, m, { type: 'media.declaration', auteur: moi.id, parametres: { conference: c.id, reponse: 'nier' } }).ok).toBe(false);
    expect(executerCommandeJoueur(moteur, m, { type: 'media.declaration', auteur: moi.id, parametres: { conference: c.id, reponse: 'viser_titre' } })).toEqual({ ok: true });
    expect(ecurie(m, 'eq_mclaren').objectifAnnonce).toEqual({ annee: 2027, niveau: 'titre' });
    expect(Object.values(m.evenements).some((x) => x.type === 'media.declaration' && x.acteurs.some((a) => a.id === moi.id))).toBe(true);
    expect(decisionsEnAttente(m).some((d) => d.type === 'conference')).toBe(false);
  });

  it('sans réponse du joueur à l’échéance, le service de communication esquive ; une écurie de l’IA répond dans la semaine', () => {
    const m = sc.creerMonde(6);
    const moteur = sc.creerMoteur();
    executerCommandeJoueur(moteur, m, { type: 'joueur.prendre_ecurie', auteur: 'joueur', parametres: { ecurie: 'eq_mclaren', prenom: 'Camille', nom: 'Presse' } });
    executerCommandeJoueur(moteur, m, { type: 'joueur.deleguer', auteur: teamPrincipal(m, 'eq_mclaren')!.id, parametres: { ecurie: 'eq_mclaren', domaine: 'communication', actif: false } });
    conference(m, 'eq_mclaren', 'rival', ['attaquer_rival', 'respecter', 'esquiver'], { annee: 2027, semaine: 2 });
    conference(m, 'eq_ferrari', 'rival', ['attaquer_rival', 'respecter', 'esquiver']);
    moteur.avancer(m, 2);
    const decl = Object.values(m.evenements).filter((x) => x.type === 'media.declaration');
    expect(decl.find((x) => x.acteurs.some((a) => a.id === 'eq_mclaren'))?.contexte['reponse']).toBe('esquiver');
    expect(decl.some((x) => x.acteurs.some((a) => a.id === 'eq_ferrari'))).toBe(true);
  });

  it('soutenir publiquement un pilote menacé laisse un souvenir au pilote (mêmes effets qu’une interaction publique)', () => {
    const m = sc.creerMonde(7);
    const moteur = sc.creerMoteur();
    const tp = teamPrincipal(m, 'eq_haas')!;
    const pilote = auPoste(m, 'eq_haas', 'pilote_titulaire');
    const c: Conference = { id: 'cnf_x', ecurie: 'eq_haas', question: 'pilote_menace', sujet: pilote.id, date: { ...m.date }, echeance: { annee: 2027, semaine: 5 }, options: ['soutenir', 'mettre_pression', 'esquiver'] };
    table(m, TABLES.conferences)[c.id] = c as never;
    expect(moteur.commandes.executer(m, { type: 'media.declaration', auteur: tp.id, source: 'ia', parametres: { conference: c.id, reponse: 'soutenir' } })).toEqual({ ok: true });
    expect(Object.values(m.evenements).some((x) => x.type === 'personnel.soutien' && x.contexte['publique'] === true && x.acteurs.some((a) => a.id === pilote.id))).toBe(true);
    void contratEmploi;
  });
});

describe('D-150 — lassitude du public', () => {
  it('une écurie à 3 titres constructeurs d’affilée : ses victoires n’améliorent plus son image, qui s’érode en fin de saison', () => {
    const m = sc.creerMonde(9);
    const pal = Object.values(table(m, TABLES.palmares)) as unknown as { saison: number; championConstructeurs: string }[];
    for (const x of pal) if (x.saison >= 2024) x.championConstructeurs = 'eq_ferrari';
    expect(titresConsecutifs(m, 'eq_ferrari')).toBe(3);
    const fe = ecurie(m, 'eq_ferrari');
    fe.image = 10;
    const faits = lassitudePublic(m);
    expect(faits.some((f) => f.acteurs.some((a) => a.id === 'eq_ferrari'))).toBe(true);
    expect(fe.image).toBeLessThan(10);
    // Une victoire ne rapporte plus rien en image (saturation à 3 titres).
    const avant = fe.image!;
    const pilote = auPoste(m, 'eq_ferrari', 'pilote_titulaire');
    ajouterEvenement(m, { type: 'gp.victoire', acteurs: [{ id: pilote.id, role: 'pilote' }, { id: 'eq_ferrari', role: 'ecurie' }], importance: 3, visibilite: 'public', texte: 'Victoire.' });
    sc.creerMoteur().avancer(m, 1);
    expect(fe.image!).toBeLessThanOrEqual(avant);
  });
});

describe('Phase 11 — archives', () => {
  it('records des titres depuis 2010 tirés des données (palmarès 2010–2026)', () => {
    const m = sc.creerMonde(1);
    const r = calculerRecords(m);
    const titres = r.find((x) => x.id === 'rec_titres_pilote')!;
    expect(nomArchive(m, titres.detenteur)).toBe('Lewis Hammilton');
    expect(titres.valeur).toBe(6);
    expect(r.find((x) => x.id === 'rec_victoires')).toBeUndefined(); // aucune saison simulée encore
  });

  it('volumes bornés : après 3 saisons, seuls les articles importants des saisons anciennes restent', () => {
    const m = sc.creerMonde(8);
    sc.creerMoteur().avancer(m, 52 * 3 + 1); // la purge a lieu en semaine 1
    const anciens = articles(m).filter((a) => a.date.annee < m.date.annee - 1);
    expect(anciens.every((a) => a.importance >= 4)).toBe(true);
  }, 120_000);
});
