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
import { rangSemaine } from './calendrier';
import { tirerCarriere } from '../systems/carriere/profil';
import { EXIGENCES_PAR_TYPE } from '../balance/circuits';
import { EXPERIENCE_HISTORIQUE } from '../balance/carriere';
import { COMPETENCES_RYTHME } from '../balance/personnages';
import type { Personne, VoitureDonnees } from '../model/types';
import { FRONTIERE, PIECES, type TypePiece } from '../balance/monoplaces';
import { piecesDepart } from '../systems/monoplaces/pieces';

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
  // v10 → v11 (audit 6b) : connaissance progressive issue du repérage (vide au départ).
  10: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, unknown>>;
    tables['connaissances'] ??= {};
    return { ...m, versionFormat: 11 };
  },
  // v11 → v12 (phase 7a) : offres du marché des transferts (vides au départ) ; contrats « signés » et réputation de prédateur optionnels.
  11: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, unknown>>;
    tables['offres'] ??= {};
    return { ...m, versionFormat: 12 };
  },
  // v12 → v13 (audit n°4) : relevé des niveaux contemporains par saison et indemnité versée par contrat, tous deux optionnels.
  // Les saisons anciennes n'ont pas de relevé : leurs indicateurs historiques dépendant du niveau restent indéfinis (jamais recalculés).
  12: (m) => ({ ...m, versionFormat: 13 }),
  // v13 → v14 (audit n°5) : la mémoire résiduelle se forme pendant l'oubli ; l'intensité maximale des souvenirs n'est plus lue.
  13: (m) => {
    const t = ((m['tables'] ?? {}) as Record<string, Record<string, Record<string, unknown>>>)['souvenirs'] ?? {};
    for (const s of Object.values(t)) delete s['intensitePic'];
    return { ...m, versionFormat: 14 };
  },
  // v14 → v15 (D-121) : table des personnes archivées (vide ; l'archivage se fait à la première intersaison).
  14: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, unknown>>;
    tables['archives'] ??= {};
    return { ...m, versionFormat: 15 };
  },
  // v15 → v16 (phase 7b) : candidatures spontanées (vides) ; non-concurrence et remplacements optionnels.
  15: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, unknown>>;
    tables['candidatures'] ??= {};
    return { ...m, versionFormat: 16 };
  },
  // v16 → v17 (phase 7c) : agents (créés à la première intersaison) ; popularité, agent, commission, sponsor personnel optionnels.
  16: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, unknown>>;
    tables['agents'] ??= {};
    return { ...m, versionFormat: 17 };
  },
  // v17 → v18 (audit de la phase 7) : les entreprises créées pour un pilote sont rattachées à lui (hors vivier général).
  17: (m) => {
    const t = ((m['tables'] ?? {}) as Record<string, Record<string, Record<string, unknown>>>)['sponsors'] ?? {};
    for (const [id, s] of Object.entries(t)) {
      const r = /^spo_(fam|nat)_(.+)$/.exec(id);
      if (r) s['lie'] = `per_${r[2]}`;
    }
    return { ...m, versionFormat: 18 };
  },
  // v18 → v19 (D-131) : engagements conditionnels des juniors (champ optionnel, créé au début de saison suivante).
  18: (m) => ({ ...m, versionFormat: 19 }),
  // v19 → v20 (phase 8a+8b, D-128, D-132) : règlements, évolutions mineures, savoir, programmes, historique et découvertes.
  // Les tables sont créées vides ; le règlement de départ est créé à la semaine suivante par le système technique.
  19: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, unknown>>;
    for (const t of ['reglements', 'evolutionsMineures', 'savoirs', 'programmes', 'historiqueRecherche', 'decouvertes']) tables[t] ??= {};
    return { ...m, versionFormat: 20 };
  },
  // v20 → v21 (phase 8c) : faits suivis (qui sait quoi) et état de la diffusion. Les faits antérieurs à la migration ne sont pas
  // suivis rétroactivement : la diffusion commence avec les faits nouveaux.
  20: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, unknown>>;
    tables['faitsSuivis'] ??= {};
    tables['information'] ??= {};
    const dernier = ((m['compteurs'] ?? {}) as Record<string, number>)['evt'] ?? 0;
    tables['information']['etat'] ??= { id: 'etat', dernier };
    return { ...m, versionFormat: 21 };
  },
  // v21 → v22 (phase 8d, D-129) : équipes des stands (créées par leur système à la semaine suivante, à partir du département
  // « stands ») ; le poste de chef d'équipe est pourvu par le recrutement habituel des postes vacants.
  21: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, unknown>>;
    tables['equipesStands'] ??= {};
    return { ...m, versionFormat: 22 };
  },
  // v22 → v23 (phase 8d-3) : groupes sociaux (détectés à la prochaine semaine de détection).
  22: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, unknown>>;
    tables['groupes'] ??= {};
    return { ...m, versionFormat: 23 };
  },
  // v23 → v24 (phase 8d-4) : fédération (président nommé à la semaine suivante, règles de départ) et alliances.
  23: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, unknown>>;
    tables['federation'] ??= {};
    tables['alliances'] ??= {};
    return { ...m, versionFormat: 24 };
  },
  // v24 → v25 (phase 10) : joueur (champ facultatif `joueur`, délégations des écuries) ; rien à transformer.
  24: (m) => ({ ...m, versionFormat: 25 }),
  // v25 → v26 (phase 11) : médias, articles, conférences, records. Une ancienne partie n'a pas de médias (ils viennent des données) :
  // le système des médias y reste inactif ; l'image publique et l'exposition démarrent à 0.
  25: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, unknown>>;
    for (const t of ['medias', 'articles', 'conferences', 'records', 'etatMedias']) tables[t] ??= {};
    return { ...m, versionFormat: 26 };
  },
  // v26 → v27 (D-152) : date du dernier contact de chaque relation familière ; une ancienne partie la fixe à la date de la sauvegarde
  // (la proximité commencera à s'estomper à partir de là).
  26: (m) => {
    const date = m['date'] as { annee: number; semaine: number };
    const rang = rangSemaine(date);
    const rel = ((m['tables'] as Record<string, Record<string, Record<string, unknown>>>)['relations'] ?? {});
    for (const r of Object.values(rel)) if ((r['familiarite'] as number) > 0 && r['contact'] === undefined && String(r['vers']).startsWith('per')) r['contact'] = rang;
    return { ...m, versionFormat: 27 };
  },
  // v27 → v28 (phase 11c, D-155) : les contrats de sponsoring en cours deviennent des contrats « prudents » à une seule clause,
  // celle d'avant la refonte (même objectif de classement, même prime) ; nouvelles tables vides (offres, objectifs de course, opérations).
  27: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, Record<string, unknown>>>;
    for (const c of Object.values(tables['contratsSponsoring'] ?? {})) {
      if (c['clauses']) continue;
      c['variante'] = 'prudente';
      c['clauses'] = [{ type: 'rang', seuil: c['objectifRang'] ?? 11, primeMEUR: c['primeObjectifMEUR'] ?? 0, probabilite: 0.75 }];
      c['primesVerseesMEUR'] = 0;
      delete c['objectifRang'];
      delete c['primeObjectifMEUR'];
    }
    for (const t of ['offresSponsors', 'objectifsGP', 'operationsSponsors']) tables[t] ??= {};
    return { ...m, versionFormat: 28 };
  },
  // v28 → v29 (phase 11b) : vivier de circuits et climat mensuel. Une partie antérieure n'a pas de vivier (il vient des données) :
  // elle garde son calendrier (les N premiers circuits, 24 au départ) et ses classes de pluie. Aucune donnée n'est modifiée.
  28: (m) => ({ ...m, versionFormat: 29 }),
  // v29 → v30 (D-166, D-167, D-168) : argent réellement payé (lu à partir de la prochaine écriture comptable ; avant, le budget
  // prévu, comme jusqu'ici), annonces de retraite (aucune en cours dans une partie antérieure : les pilotes de la saison en cours
  // peuvent encore arrêter en fin de saison, au taux de surprise), demandes bloquantes (calculées, rien à stocker).
  29: (m) => {
    for (const f of Object.values((m.tables as Record<string, Record<string, unknown>>)['finances'] ?? {})) {
      const b = (f as { budget?: { choixTP?: { le?: unknown } } }).budget;
      if (b?.choixTP) delete b.choixTP.le; // D-166 : plus de délai entre deux modifications du budget
    }
    return { ...m, versionFormat: 30 };
  },
  // v30 → v31 (phase 12a, D-170) : la voiture devient six pièces (conversion des notes actuelles de la voiture, comme à la création),
  // avec le savoir de départ cohérent (gardé s'il est déjà plus grand) ; plus de notes de vitesse abstraites. Les circuits d'une partie
  // antérieure n'ont pas de sensibilités propres : ils utilisent les sensibilités moyennes des 30 circuits (balance/monoplaces.ts).
  30: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, Record<string, unknown>>>;
    tables['pieces'] ??= {};
    tables['projetsConception'] ??= {};
    tables['savoirs'] ??= {};
    for (const v of Object.values(tables['voitures'] ?? {})) {
      const d = v as unknown as VoitureDonnees;
      if (d.viragesLents === undefined) continue;
      const parDomaine = new Map<string, number[]>();
      for (const p of piecesDepart(d)) {
        const id = `pce_${d.ecurie.replace(/^eq_/, '')}_${p.type}_${p.version}`;
        tables['pieces'][id] = { id, ...p };
        const part = Math.min(FRONTIERE.partMaxDepart, Math.max(0, (p.efficacite + FRONTIERE.margeDepart - FRONTIERE.min) / FRONTIERE.etendue));
        for (const dom of PIECES[p.type as TypePiece].domaines) parDomaine.set(dom, [...(parDomaine.get(dom) ?? []), -FRONTIERE.echelleSavoir * Math.log(1 - part)]);
      }
      for (const [dom, l] of parDomaine) {
        const id = `${d.ecurie}|${dom}`;
        const s = (tables['savoirs'][id] ??= { id, ecurie: d.ecurie, domaine: dom, fondamental: 0, parReglement: {}, pourSaisonSuivante: 0 }) as { fondamental: number };
        s.fondamental = Math.max(s.fondamental, Math.round((l.reduce((a, b) => a + b, 0) / l.length) * 100) / 100);
      }
      for (const k of ['viragesLents', 'viragesRapides', 'vitessePointe', 'efficaciteAero']) delete (v as Record<string, unknown>)[k];
    }
    return { ...m, versionFormat: 31 };
  },
  // v31 → v32 (phase 12b) : soufflerie et CFD, rythmes, fatigue des pôles, dilemmes techniques. Champs facultatifs (fatigue 0, rythme
  // normal, aucune heure accumulée) ; seule la table des dilemmes est créée.
  31: (m) => {
    const tables = (m['tables'] ??= {}) as Record<string, Record<string, unknown>>;
    tables['dilemmesTechniques'] ??= {};
    return { ...m, versionFormat: 32 };
  },
  // v32 → v33 (D-179, piège de la pauvreté) : objectif du propriétaire et bonus d'apport (champs facultatifs des finances : le premier
  // objectif est fixé au bilan suivant). Rien à transformer.
  32: (m) => ({ ...m, versionFormat: 33 }),
  // D-181 : cohésion habituelle des départements = cohésion au moment de la migration (l'effet part de zéro).
  33: (m) => {
    const deps = (m as { tables: Record<string, Record<string, { cohesion?: number; cohesionHabituelle?: number }>> }).tables['departements'] ?? {};
    for (const d of Object.values(deps)) d.cohesionHabituelle ??= d.cohesion;
    return { ...m, versionFormat: 34 };
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

const estObjet = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
const entier = (x: unknown): x is number => typeof x === 'number' && Number.isInteger(x);

/** Date de jeu valide : année entière plausible, semaine de 1 à 52. */
function dateValide(d: unknown): boolean {
  return estObjet(d) && entier(d['annee']) && (d['annee'] as number) >= 1900 && (d['annee'] as number) <= 9999 && entier(d['semaine']) && (d['semaine'] as number) >= 1 && (d['semaine'] as number) <= 52;
}

/**
 * Audit n°4 : validation d'un monde avant chargement (après migrations). Structure, valeurs numériques, dates,
 * identifiants et références essentielles. Renvoie la liste des problèmes (vide si tout va bien), en français.
 */
export function problemesMonde(m: unknown): string[] {
  const pb: string[] = [];
  if (!estObjet(m)) return ['le contenu du monde est absent ou n’est pas un objet'];
  if (!entier(m['versionFormat'])) pb.push('version de format absente ou invalide');
  if (!entier(m['graine'])) pb.push('graine absente ou invalide');
  if (!dateValide(m['date'])) pb.push(`date de jeu invalide (${JSON.stringify(m['date'])})`);
  for (const champ of ['tables', 'evenements', 'flux', 'compteurs']) if (!estObjet(m[champ])) pb.push(`partie « ${champ} » absente ou invalide`);
  if (!Array.isArray(m['chronique'])) pb.push('chronique absente ou invalide');
  // Audit (1.8) : sans agenda ni file de commandes, la partie plantait à la première semaine.
  for (const champ of ['agenda', 'fileCommandes', 'journalCommandes']) if (!Array.isArray(m[champ])) pb.push(`partie « ${champ} » absente ou invalide`);
  if (m['parametres'] !== undefined && !estObjet(m['parametres'])) pb.push('réglages d’expérience invalides');
  if (pb.length) return pb;
  const tables = m['tables'] as Record<string, unknown>;
  for (const [nom, t] of Object.entries(tables)) {
    if (!estObjet(t)) { pb.push(`table « ${nom} » invalide`); continue; }
    for (const [id, ent] of Object.entries(t)) {
      if (!estObjet(ent)) { pb.push(`table « ${nom} » : entrée « ${id} » invalide`); continue; }
      if ('id' in ent && ent['id'] !== id) pb.push(`table « ${nom} » : l’entrée « ${id} » porte l’identifiant « ${String(ent['id'])} »`);
      if (pb.length > 20) return pb;
    }
  }
  // Références essentielles : chaque contrat pointe vers une personne existante ; chaque personne active vers une organisation existante.
  const personnes = (tables['personnes'] ?? {}) as Record<string, Record<string, unknown>>;
  const organisations = new Set([...Object.keys((tables['ecuries'] ?? {}) as object), ...Object.keys((tables['ecuriesJuniors'] ?? {}) as object)]);
  for (const c of Object.values((tables['contrats'] ?? {}) as Record<string, Record<string, unknown>>)) {
    if (!personnes[String(c['personne'])]) pb.push(`contrat « ${String(c['id'])} » : personne inconnue « ${String(c['personne'])} »`);
    for (const k of ['debut', 'fin', 'salaireMEUR']) if (typeof c[k] !== 'number' || !Number.isFinite(c[k] as number)) pb.push(`contrat « ${String(c['id'])} » : « ${k} » n’est pas un nombre`);
    if (pb.length > 20) return pb;
  }
  for (const p of Object.values(personnes)) {
    if (p['statut'] === 'actif' && p['ecurie'] && organisations.size > 0 && !organisations.has(String(p['ecurie']))) pb.push(`personne « ${String(p['id'])} » : organisation inconnue « ${String(p['ecurie'])} »`);
    if (pb.length > 20) return pb;
  }
  return pb;
}

export function deserialiser(texte: string): Monde {
  const f = analyser(texte);
  let version = f.entete.versionFormat;
  if (!entier(version) || version < 1) throw new ErreurSauvegarde('Sauvegarde illisible : la version du format est absente ou invalide.');
  if (!estObjet(f.monde)) throw new ErreurSauvegarde('Sauvegarde illisible : le contenu du monde est absent ou invalide.');
  // Audit (1.8) : un contenu plus ancien que l'en-tête ne recevrait pas ses migrations : refusé avec un message clair.
  const vContenu = (f.monde as Record<string, unknown>)['versionFormat'];
  if (entier(vContenu) && vContenu < version) throw new ErreurSauvegarde(`Sauvegarde incohérente : l’en-tête annonce le format ${version}, le contenu le format ${vContenu}.`);
  if (version > VERSION_FORMAT) {
    throw new ErreurSauvegarde(
      `Cette sauvegarde vient d'une version plus récente du jeu (format ${version}, ce jeu lit jusqu'au format ${VERSION_FORMAT}).`,
    );
  }
  let monde = f.monde as Record<string, unknown>;
  while (version < VERSION_FORMAT) {
    const migration = MIGRATIONS[version];
    if (!migration) throw new ErreurSauvegarde(`Aucune migration depuis le format ${version}.`);
    // Audit (1.8) : une migration qui échoue sur un contenu endommagé donne un message clair, jamais une erreur brute.
    try { monde = migration(monde); } catch (e) {
      throw new ErreurSauvegarde(`Sauvegarde endommagée : la mise à jour du format ${version} vers ${version + 1} a échoué (${e instanceof Error ? e.message : String(e)}).`);
    }
    version++;
  }
  monde['versionFormat'] = VERSION_FORMAT;
  const pb = problemesMonde(monde);
  if (pb.length) throw new ErreurSauvegarde(`Sauvegarde endommagée ou incohérente :\n- ${pb.slice(0, 10).join('\n- ')}${pb.length > 10 ? `\n- … et ${pb.length - 10} autre(s) problème(s)` : ''}`);
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
  if (!fichier || typeof fichier !== 'object' || Array.isArray(fichier) || fichier.entete?.signature !== SIGNATURE || !fichier.monde) {
    throw new ErreurSauvegarde("Le fichier n'est pas une sauvegarde de ce jeu.");
  }
  return fichier as FichierSauvegarde;
}
