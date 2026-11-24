/** Phase 11 — textes des conférences de presse (affichés au joueur ; aussi lus par les décisions en attente). */
import type { QuestionConference, ReponseConference } from '../../model/types';

export const LIBELLES_QUESTIONS: Record<QuestionConference, string> = {
  pilote_menace: 'Votre pilote traverse une période difficile. Sa place est-elle menacée ?',
  objectif_titre: 'Votre écurie est aux avant-postes. Visez-vous le titre cette saison ?',
  scandale: 'Comment réagissez-vous aux révélations de la presse sur votre écurie ?',
  rival: 'Votre rival direct au championnat vous inquiète-t-il ?',
  federation: 'Que pensez-vous des dernières décisions de la fédération ?',
};
export const LIBELLES_REPONSES: Record<ReponseConference, string> = {
  soutenir: 'Le soutenir publiquement', mettre_pression: 'Lui mettre la pression', viser_titre: 'Annoncer viser le titre', prudence: 'Rester prudent',
  assumer: 'Assumer et s’excuser', nier: 'Démentir', attaquer_rival: 'Piquer le rival', respecter: 'Saluer le rival', critiquer_federation: 'Critiquer la fédération',
  soutenir_federation: 'Soutenir la fédération', esquiver: 'Esquiver la question',
};

