/** Phase 11 — médias et archives (docs/systemes/phase-11-medias-archives.md, D-149). */
import type { DateJeu } from '../core/calendrier';

export const TYPES_MEDIAS = ['reference', 'tabloid', 'technique', 'national'] as const;
export type TypeMedia = (typeof TYPES_MEDIAS)[number];

/** Média fictif (données `data/commun/medias.csv`). */
export interface Media {
  id: string;
  nom: string;
  type: TypeMedia;
  /** Presse nationale : elle suit les compatriotes. */
  nationalite?: string;
  /** 0 à 1 : crédit accordé à ce qu'il publie (une rumeur du tabloïd est moins crue). Lu par le joueur (affiché) et par l'effet des rumeurs. */
  fiabilite: number;
  /** 0 à 1 : goût pour les rumeurs (probabilité de publier une rumeur peu sûre). */
  appetitRumeurs: number;
}

export type GenreArticle = 'fait' | 'rumeur' | 'scandale' | 'declaration' | 'record';

/** Article publié (volume borné). `vraie` (rumeurs) : connu du moteur seulement, jamais affiché au joueur. */
export interface Article {
  id: string;
  media: string;
  date: DateJeu;
  genre: GenreArticle;
  titre: string;
  /** Vide quand il serait identique au titre (volume) : lire avec `texteArticle`. */
  texte: string;
  /** Fait du moteur à l'origine de l'article (aucun article sans fait). */
  source: string;
  /** Personnes et écuries dont il parle. */
  sujets: string[];
  importance: number;
  vraie?: boolean;
}

export type QuestionConference = 'pilote_menace' | 'objectif_titre' | 'scandale' | 'rival' | 'federation';
export type ReponseConference = 'soutenir' | 'mettre_pression' | 'viser_titre' | 'prudence' | 'assumer' | 'nier' | 'attaquer_rival' | 'respecter' | 'critiquer_federation' | 'soutenir_federation' | 'esquiver';

/** Question posée à un team principal (conférence de presse). */
export interface Conference {
  id: string;
  ecurie: string;
  question: QuestionConference;
  /** Personne ou écurie visée par la question (pilote menacé, rival…). */
  sujet?: string;
  /** Fait qui a provoqué la question (cause de la déclaration). */
  cause?: string;
  date: DateJeu;
  echeance: DateJeu;
  options: ReponseConference[];
}

/** Record (archives) : détenteur et valeur. */
export interface RecordSportif {
  id: string;
  libelle: string;
  detenteur: string;
  valeur: number;
  depuis: number;
}
