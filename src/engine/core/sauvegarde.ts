/**
 * Sauvegarde versionnée (D-006, docs/architecture.md §7).
 *
 * Le moteur produit et lit du TEXTE (JSON). La compression et le stockage
 * (IndexedDB sur téléphone, fichier en ligne de commande) sont faits par la plateforme,
 * hors du moteur (src/platform/).
 *
 * Toute évolution du format incrémente VERSION_FORMAT et ajoute une migration ici,
 * avec un test sur une sauvegarde de l'ancienne version.
 */

import { etatInitialFlux, Flux } from './hasard';
import { VERSION_FORMAT, type Monde } from './monde';
import { tirerCarriere } from '../systems/carriere/profil';
import { EXIGENCES_PAR_TYPE } from '../balance/circuits';
import { EXPERIENCE_HISTORIQUE } from '../balance/carriere';
import { COMPETENCES_RYTHME } from '../balance/personnages';
import type { Personne } from '../model/types';

export const SIGNATURE = 'f1manager-sauvegarde';

export interface EnTeteSauvegarde {
  signature: typeof SIGNATURE;
  versionFormat: number;
  versionJeu: string;
  graine: number;
  date: { annee: number; semaine: number };
}

interface FichierSauvegarde {
  entete: EnTeteSauvegarde;
  monde: unknown;
}

/** Une migration transforme le contenu « monde » de la version n vers la version n+1. */
type Migration = (monde: Record<string, unknown>) => Record<string, unknown>;

/**
 * MIGRATIONS[n] convertit la version n en version n+1.
 * v1 → v2 : la Chronique devient une table à part entière (avant : absente).
 * (Migration de démonstration de la phase 1, pour tester le mécanisme.)
 */
const MIGRATIONS: Record<number, Migration> = {
  1: (m) => ({ ...m, chronique: Array.isArray(m['chronique']) ? m['chronique'] : [], versionFormat: 2 }),
  // v2 → v3 : ajout des réglages d'expérience (vides).
  2: (m) => ({ ...m, parametres: m['parametres'] ?? {}, versionFormat: 3 }),
  // v3 → v4 (phase 4) : contrats génériques (organisation, type, clauses structurées), écuries typées,
  // deux nouveaux traits (D-054) tirés de façon déterministe avec le flux de génération de chaque personne.
  3: (m) => {
    const tables = (m['tables'] ?? {}) as Record<string, Record<string, Record<string, unknown>>>;
    for (const c of Object.values(tables['contrats'] ?? {})) {
      if (c['organisation'] === undefined) c['organisation'] = c['ecurie'];
      delete c['ecurie'];
      c['type'] ??= 'emploi';
      if (typeof c['clauses'] === 'string') {
        const texte = c['clauses'] as string;
        const clauses: Record<string, unknown> = {};
        if (/n°\s*1/i.test(texte)) clauses['statutN1'] = true;
        const reste = texte.split('/').map((x) => x.trim()).filter((x) => x && !/n°\s*1/i.test(x));
        if (reste.length) clauses['note'] = reste.join(' / ');
        c['clauses'] = clauses;
      }
    }
    for (const e of Object.values(tables['ecuries'] ?? {})) e['typeOrganisation'] ??= 'ecurie';
    const graine = Number(m['graine'] ?? 0);
    for (const p of Object.values(tables['personnes'] ?? {})) {
      const traits = (p['traits'] ?? {}) as Record<string, number>;
      const f = new Flux(etatInitialFlux(graine, `generation-v4:${String(p['id'])}`));
      for (const t of ['risque', 'remiseEnQuestion']) {
        if (traits[t] === undefined) traits[t] = Math.round(Math.min(20, Math.max(1, f.normale(10.5, 3.5))));
      }
      p['traits'] = traits;
    }
    return { ...m, versionFormat: 4 };
  },
  // v4 → v5 (phase 5a) : apparence persistante (D-080) ; finances et propriétaires créés à partir du budget
  // indicatif des écuries quand ils manquent (sauvegardes antérieures à l'économie).
  4: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, Record<string, unknown>>>;
    const graine = Number(m['graine'] ?? 0);
    for (const p of Object.values(tables['personnes'] ?? {})) {
      if (!p['apparence']) p['apparence'] = { graine: Math.floor(new Flux(etatInitialFlux(graine, `apparence:${String(p['id'])}`)).suivant() * 1e9) };
    }
    tables['finances'] ??= {};
    tables['proprietaires'] ??= {};
    const annee = Number((m['date'] as { annee?: number } | undefined)?.annee ?? 2027);
    for (const e of Object.values(tables['ecuries'] ?? {})) {
      const suffixe = String(e['id']).replace(/^eq_/, '');
      const budget = Number(e['budgetMEUR'] ?? 300);
      tables['proprietaires'][`pro_${suffixe}`] ??= { id: `pro_${suffixe}`, ecurie: e['id'], type: 'consortium', apportBaseMEUR: Math.round(0.3 * budget), patience: 10, ambition: 10, risque: 10 };
      tables['finances'][`fin_${suffixe}`] ??= {
        id: `fin_${suffixe}`, ecurie: e['id'], tresorerieMEUR: Math.round(0.3 * budget), revenusCommerciauxBaseMEUR: Math.round(0.45 * budget),
        budget: { annee: 0, developpementMEUR: 0, plafondVise: 0, strategie: 'a_definir' },
        comptes: { annee, primes: 0, commercial: 0, apport: 0, personnelPlafonne: 0, departements: 0, operations: 0, entretien: 0, developpement: 0, salairesHorsPlafond: 0, marketing: 0, indemnites: 0, amendes: 0, dividendes: 0 },
        historique: [], sanctionAero: 0, verification: 'créé par migration (estimation)',
      };
    }
    return { ...m, versionFormat: 5 };
  },
  // v5 → v6 (phase 5b) : dette, état de crise, projets, nouvelles lignes de comptes. Les sponsors sont créés par le
  // système économie au premier bilan (noms génériques si le référentiel ne contient pas les noms d'entreprises).
  5: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, Record<string, unknown>>>;
    const lignes = { sponsors: 0, interets: 0, investissements: 0, apportsExceptionnels: 0 };
    for (const fi of Object.values(tables['finances'] ?? {})) {
      fi['detteMEUR'] ??= 0;
      fi['etatCrise'] ??= 'sain';
      fi['periodesEnCrise'] ??= 0;
      fi['projets'] ??= [];
      fi['comptes'] = { ...lignes, ...(fi['comptes'] as object) };
      fi['historique'] = ((fi['historique'] ?? []) as object[]).map((h) => ({ ...lignes, ...h }));
    }
    return { ...m, versionFormat: 6 };
  },
  // v6 → v7 (phase 6a) : profil de carrière caché pour chaque personne, tiré avec le même flux qu'à la construction,
  // compatible avec son âge et son niveau (une personne des données encore active ne s'effondre pas).
  6: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, Record<string, unknown>>>;
    const graine = Number(m['graine'] ?? 0);
    const annee = Number((m['date'] as { annee?: number } | undefined)?.annee ?? 2027);
    for (const brut of Object.values(tables['personnes'] ?? {})) {
      const p = brut as unknown as Personne;
      if (p.carriere) continue;
      p.carriere = tirerCarriere(p, new Flux(etatInitialFlux(graine, `generation:carriere:${p.id}`)), annee - p.anneeNaissance, p.origine === 'donnees');
    }
    return { ...m, versionFormat: 7 };
  },
  // v7 → v8 (phase 6a complémentaire) : « vitesse » répartie entre les quatre compétences de rythme (style tiré de façon
  // déterministe), intelligence de course, trait résilience, expérience réelle estimée, exigences des circuits selon leur type.
  7: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, Record<string, unknown>>>;
    const graine = Number(m['graine'] ?? 0);
    const idsCircuits = Object.keys(tables['circuits'] ?? {});
    for (const c of Object.values(tables['circuits'] ?? {})) {
      c['exigences'] ??= { ...(EXIGENCES_PAR_TYPE[String(c['type'])] ?? EXIGENCES_PAR_TYPE['mixte']!) };
    }
    const r1 = (x: number) => Math.round(Math.min(20, Math.max(1, x)) * 10) / 10;
    for (const brut of Object.values(tables['personnes'] ?? {})) {
      const p = brut as unknown as Personne;
      const f = new Flux(etatInitialFlux(graine, `generation:style:${p.id}`));
      p.traits['resilience'] ??= Math.round(Math.min(20, Math.max(1, f.normale(10.5, 3.5))));
      if (!p.poste.startsWith('pilote')) continue;
      const v = p.competences['vitesse'];
      if (v !== undefined) {
        const style = f.normale(0, 0.5);
        for (const c of COMPETENCES_RYTHME) p.competences[c] ??= r1(v + style + f.normale(0, 0.6));
        delete p.competences['vitesse'];
      }
      p.competences['intelligenceCourse'] ??= r1(((p.competences['regularite'] ?? 10) + (p.competences['retourTechnique'] ?? 10)) / 2 + f.normale(0, 1));
      if (p.carriere) {
        const ev = p.carriere.ecarts['vitesse'] ?? 0;
        for (const c of COMPETENCES_RYTHME) p.carriere.ecarts[c] ??= Math.round((ev + f.normale(0, 0.5)) * 100) / 100;
        p.carriere.ecarts['intelligenceCourse'] ??= Math.round(f.normale(0, 1.5) * 100) / 100;
        delete p.carriere.ecarts['vitesse'];
        if (!p.carriere.experience) {
          const saisons = p.carriere.saisonsF1;
          p.carriere.experience = {
            gp: saisons * EXPERIENCE_HISTORIQUE.gpParSaison, pluie: saisons * EXPERIENCE_HISTORIQUE.pluieParSaison, luttesTitre: 0,
            circuits: saisons > 0 ? Object.fromEntries(idsCircuits.map((c) => [c, saisons])) : {}, ecurie: p.ecurie, gpEcurie: saisons > 0 ? EXPERIENCE_HISTORIQUE.gpParSaison : 0,
          };
        }
      }
    }
    return { ...m, versionFormat: 8 };
  },
  // v8 → v9 (phase 6b) : tables juniors (les écuries juniors sont créées au premier marché des baquets).
  8: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, unknown>>;
    tables['ecuriesJuniors'] ??= {};
    tables['saisonsJuniors'] ??= {};
    return { ...m, versionFormat: 9 };
  },
  // v9 → v10 (phase 6b-2) : académies (créées à la première intersaison) et missions de repérage.
  9: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, unknown>>;
    tables['academies'] ??= {};
    tables['missionsReperage'] ??= {};
    return { ...m, versionFormat: 10 };
  },
};

export function serialiser(monde: Monde): string {
  const fichier: FichierSauvegarde = {
    entete: {
      signature: SIGNATURE,
      versionFormat: monde.versionFormat,
      versionJeu: monde.versionJeu,
      graine: monde.graine,
      date: { ...monde.date },
    },
    monde,
  };
  return JSON.stringify(fichier);
}

export class ErreurSauvegarde extends Error {}

export function lireEnTete(texte: string): EnTeteSauvegarde {
  const f = analyser(texte);
  return f.entete;
}

export function deserialiser(texte: string): Monde {
  const f = analyser(texte);
  let version = f.entete.versionFormat;
  if (version > VERSION_FORMAT) {
    throw new ErreurSauvegarde(
      `Cette sauvegarde vient d'une version plus récente du jeu (format ${version}, ce jeu lit jusqu'au format ${VERSION_FORMAT}).`,
    );
  }
  let monde = f.monde as Record<string, unknown>;
  while (version < VERSION_FORMAT) {
    const migration = MIGRATIONS[version];
    if (!migration) throw new ErreurSauvegarde(`Aucune migration depuis le format ${version}.`);
    monde = migration(monde);
    version++;
  }
  monde['versionFormat'] = VERSION_FORMAT;
  return monde as unknown as Monde;
}

function analyser(texte: string): FichierSauvegarde {
  let f: unknown;
  try {
    f = JSON.parse(texte);
  } catch {
    throw new ErreurSauvegarde("Le fichier n'est pas une sauvegarde lisible (JSON invalide).");
  }
  const fichier = f as Partial<FichierSauvegarde>;
  if (!fichier || typeof fichier !== 'object' || fichier.entete?.signature !== SIGNATURE || !fichier.monde) {
    throw new ErreurSauvegarde("Le fichier n'est pas une sauvegarde de ce jeu.");
  }
  return fichier as FichierSauvegarde;
}
