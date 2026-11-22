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
