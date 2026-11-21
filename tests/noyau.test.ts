import { describe, expect, it } from 'vitest';
import {
  ajouterEvenement,
  chaineDeCauses,
  copierMonde,
  deserialiser,
  empreinte,
  flux,
  profondeurCauses,
  scenarioVideDemo,
  serialiser,
  soumettreCommande,
  SEMAINES_PAR_AN_EXPORT as S,
} from '../src/cli/_moteur';

const nouveau = (graine = 42) => ({ monde: scenarioVideDemo.creerMonde(graine), moteur: scenarioVideDemo.creerMoteur() });

describe('Critère 1 — performance', () => {
  it('50 saisons en moins de 5 secondes', () => {
    const { monde, moteur } = nouveau();
    const t0 = performance.now();
    moteur.avancer(monde, 50 * S);
    expect(performance.now() - t0).toBeLessThan(5000);
    expect(monde.date).toEqual({ annee: 2077, semaine: 1 });
  });
});

describe('Critère 2 — déterminisme', () => {
  it('même graine + mêmes commandes ⇒ même état', () => {
    const a = nouveau(), b = nouveau();
    for (const x of [a, b]) {
      x.moteur.avancer(x.monde, 30);
      soumettreCommande(x.monde, { type: 'organisation.renommer', auteur: 'outil', source: 'exterieur', parametres: { organisation: 'org_demo', nom: 'Nouveau nom' } });
      x.moteur.avancer(x.monde, 10 * S);
    }
    expect(empreinte(a.monde)).toBe(empreinte(b.monde));
  });

  it('graines différentes ⇒ états différents', () => {
    const a = nouveau(1), b = nouveau(2);
    a.moteur.avancer(a.monde, 3 * S);
    b.moteur.avancer(b.monde, 3 * S);
    expect(empreinte(a.monde)).not.toBe(empreinte(b.monde));
  });
});

describe('Critère 3 — indépendance des flux', () => {
  it('un tirage de plus dans un flux ne change pas les autres', () => {
    const a = nouveau(), b = nouveau();
    flux(b.monde, 'autre-systeme').suivant(); // tirage supplémentaire dans un autre flux
    a.moteur.avancer(a.monde, 5 * S);
    b.moteur.avancer(b.monde, 5 * S);
    expect(a.monde.flux['demo.hasard']).toEqual(b.monde.flux['demo.hasard']);
    expect(a.monde.tables['demo']).toEqual(b.monde.tables['demo']);
  });
});

describe('Critère 4 — sauvegarde et reprise transparentes', () => {
  it('10 saisons d’un trait = 5 saisons + sauvegarde + rechargement + 5 saisons', () => {
    const a = nouveau();
    a.moteur.avancer(a.monde, 10 * S);

    const b = nouveau();
    b.moteur.avancer(b.monde, 5 * S);
    const recharge = deserialiser(serialiser(b.monde));
    b.moteur.avancer(recharge, 5 * S);

    expect(empreinte(recharge)).toBe(empreinte(a.monde));
  });

  it('rejouer depuis la graine et le journal donne le même monde', () => {
    const { monde, moteur } = nouveau(9);
    moteur.avancer(monde, 20);
    soumettreCommande(monde, { type: 'organisation.renommer', auteur: 'outil', source: 'exterieur', parametres: { organisation: 'org_demo', nom: 'Écurie renommée' } });
    moteur.avancer(monde, 2 * S);
    const rejoue = scenarioVideDemo.creerMoteur().rejouer(scenarioVideDemo.creerMonde(9), monde.journalCommandes, monde.date);
    expect(empreinte(rejoue)).toBe(empreinte(monde));
  });
});

describe('Critère 7 — chaînes de causes', () => {
  it('une chaîne de 3 événements se remonte', () => {
    const { monde } = nouveau();
    const a = ajouterEvenement(monde, { type: 'test.a', acteurs: [], importance: 2 });
    const b = ajouterEvenement(monde, { type: 'test.b', acteurs: [], importance: 2, causes: [a.id] });
    const c = ajouterEvenement(monde, { type: 'test.c', acteurs: [], importance: 2, causes: [b.id] });
    expect(chaineDeCauses(monde, c.id).map((e) => e.type)).toEqual(['test.b', 'test.a']);
    expect(profondeurCauses(monde, c.id)).toBe(3);
  });

  it('une cause inconnue est refusée', () => {
    const { monde } = nouveau();
    expect(() => ajouterEvenement(monde, { type: 'x', acteurs: [], importance: 1, causes: ['evt_999999'] })).toThrow();
  });
});

describe('Critère 8 — conservation bornée', () => {
  it('après 50 saisons, le journal reste borné et la Chronique garde les faits majeurs', () => {
    const { monde, moteur } = nouveau();
    moteur.avancer(monde, 50 * S);
    const n = Object.keys(monde.evenements).length;
    // ~52 événements mineurs par saison : on ne garde que les 1 à 2 dernières saisons + les notables récents + les majeurs.
    expect(n).toBeLessThan(400);
    expect(monde.chronique.length).toBe(50);
    // La chaîne des fins de saison est intacte (événements majeurs conservés).
    const derniere = monde.chronique.at(-1)!;
    expect(profondeurCauses(monde, derniere.id)).toBe(50);
  });

  it('un événement cité comme cause par un événement conservé n’est pas supprimé', () => {
    const { monde, moteur } = nouveau();
    const mineur = ajouterEvenement(monde, { type: 'test.mineur', acteurs: [], importance: 1 });
    ajouterEvenement(monde, { type: 'test.majeur', acteurs: [], importance: 5, causes: [mineur.id] });
    moteur.avancer(monde, 5 * S);
    expect(monde.evenements[mineur.id]).toBeDefined();
  });
});

describe('Commandes', () => {
  it('une commande invalide est refusée avec un motif lisible', () => {
    const { monde, moteur } = nouveau();
    soumettreCommande(monde, { type: 'organisation.renommer', auteur: 'outil', source: 'exterieur', parametres: { organisation: 'org_inconnue', nom: 'X' } });
    const refus = moteur.avancerUneSemaine(monde);
    expect(refus).toEqual(["Cette organisation n'existe pas."]);
  });

  it('le joueur et l’IA passent par la même validation', () => {
    const { monde, moteur } = nouveau();
    const c = { type: 'organisation.renommer', auteur: 'outil', parametres: { organisation: 'org_demo', nom: 'A' } };
    expect(moteur.commandes.verifier(monde, { ...c, source: 'exterieur' })).toEqual(moteur.commandes.verifier(monde, { ...c, source: 'ia' }));
  });
});

describe('Copie', () => {
  it('copierMonde produit un monde indépendant', () => {
    const { monde, moteur } = nouveau();
    const copie = copierMonde(monde);
    moteur.avancer(copie, 10);
    expect(monde.date).toEqual({ annee: 2027, semaine: 1 });
  });
});
