/**
 * Phase 11 — médias et archives (docs/systemes/phase-11-medias-archives.md, D-149).
 *
 * - Médias fictifs (données) : chaque semaine, chacun choisit au plus quelques faits publics selon sa ligne éditoriale et en tire
 *   un article. Aucun article sans fait source ; une rumeur est toujours présentée comme une rumeur (le moteur sait si elle est vraie).
 * - Image publique (personnes et écuries) : elle bouge avec les faits, revient lentement vers la neutralité, et pèse sur la valeur
 *   commerciale, les sponsors, le conseil et les candidats (lectures dans les systèmes concernés).
 * - Scandales : un fait privé grave révélé (phase 8c), strictement professionnel et issu de la simulation.
 * - Conférences de presse : une question, quelques réponses ; mêmes commandes pour le joueur et l'IA.
 * - Archives : records (systems/medias/archives.ts).
 */

import {
  ARTICLES, CONFERENCES, EXPOSITION, IMAGE, IMAGE_PAR_FAIT, LASSITUDE_PUBLIC, IMAGE_PAR_REPONSE, LIGNES_EDITORIALES, RUMEURS_MEDIAS, SCANDALE, SCANDALES, TYPES_IGNORES,
} from '../../balance/medias';
import { FENETRE } from '../../balance/marche';
import { ajouterSemaines, rangSemaine, type DateJeu } from '../../core/calendrier';
import type { DefinitionCommande } from '../../core/commandes';
import { ajouterEvenement, type Evenement } from '../../core/evenements';
import { nouvelIdentifiant } from '../../core/identifiants';
import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import { tirageLocal, type Moteur, type Systeme } from '../../core/moteur';
import {
  TABLES, type Article, type Conference, type ContratSponsoring, type Ecurie, type GrandPrix, type Media, type Palmares, type Personne, type QuestionConference,
  type ReponseConference, type Saison, type Sponsor,
} from '../../model/types';
import { teamPrincipal } from '../humain/decision';
import { critiquer, performanceInsuffisante, soutenir } from '../humain/interactions';
import { iaDecide } from '../joueur/acces';
import { popularite } from '../marche/commercial';
import { lireEvenement } from '../memoire';
import { federation } from '../politique/acces';
import { ecuriesActives } from '../saison/performance';
import { faitsSuivis, type FaitSuivi } from '../information';
import { changerImage } from './acces';
import { mettreAJourRecords } from './archives';

export * from './acces';
export * from './archives';
export * from './libelles';

const rang = (d: DateJeu) => rangSemaine(d);
const nomDe = (p: Personne) => `${p.prenom} ${p.nom}`;
const ETAT = 'etat';

export const medias = (m: Monde) => idsTries(table(m, TABLES.medias)).map((id) => table(m, TABLES.medias)[id] as unknown as Media);
/** Texte complet d'un article (le titre quand le texte n'ajoutait rien). */
export const texteArticle = (a: Article) => a.texte || a.titre;
export const articles = (m: Monde) => Object.values(table(m, TABLES.articles)) as unknown as Article[];
export const conferences = (m: Monde, idEcurie?: string) =>
  (Object.values(table(m, TABLES.conferences)) as unknown as Conference[]).filter((c) => !idEcurie || c.ecurie === idEcurie);

const personneDe = (m: Monde, id: string) => table(m, TABLES.personnes)[id] as unknown as Personne | undefined;
const ecurieDe = (m: Monde, id: string) => table(m, TABLES.ecuries)[id] as unknown as Ecurie | undefined;

function ignore(type: string): boolean {
  return TYPES_IGNORES.some((p) => type.startsWith(p));
}

/** Personne principale d'un fait (auteur, pilote, champion…) et écurie concernée. */
function sujetsDe(m: Monde, e: Evenement): { personne?: Personne; ecurie?: Ecurie } {
  let personne: Personne | undefined;
  let ec: Ecurie | undefined;
  for (const role of ['auteur', 'pilote', 'champion', 'personne', 'cible']) {
    const a = e.acteurs.find((x) => x.role === role && personneDe(m, x.id));
    if (a) { personne = personneDe(m, a.id); break; }
  }
  for (const a of e.acteurs) { const x = ecurieDe(m, a.id); if (x) { ec = x; break; } }
  if (!ec && personne?.ecurie) ec = ecurieDe(m, personne.ecurie);
  return { personne, ecurie: ec };
}

/* ------------------------------------------------------------------ Image */

/** D-150 : titres consécutifs les plus récents d'un pilote (titre pilotes) ou d'une écurie (titre constructeurs). */
export function titresConsecutifs(m: Monde, id: string): number {
  const pal = (Object.values(table(m, TABLES.palmares)) as unknown as Palmares[]).sort((a, b) => b.saison - a.saison);
  let n = 0;
  for (const x of pal) { if (x.championPilote === id || x.championConstructeurs === id) n++; else break; }
  return n;
}

/** D-150 : un gain d'image sportif s'émousse chez ceux qui gagnent tout (lassitude du public). */
const facteurLassitude = (m: Monde, id: string) => Math.max(0, 1 - titresConsecutifs(m, id) / LASSITUDE_PUBLIC.titresSaturation);

function appliquerImageFait(m: Monde, e: Evenement): void {
  const v = IMAGE_PAR_FAIT[e.type];
  if (!v) return;
  if ((e.type.startsWith('personnel.')) && e.contexte['publique'] !== true) return; // seuls les gestes publics se voient
  const { personne, ecurie } = sujetsDe(m, e);
  const sportif = e.type.startsWith('gp.') || e.type.startsWith('titre.');
  if (personne) changerImage(personne, v[0] > 0 && sportif ? v[0] * facteurLassitude(m, personne.id) : v[0]);
  if (ecurie) changerImage(ecurie, v[1] > 0 && sportif ? v[1] * facteurLassitude(m, ecurie.id) : v[1]);
}

/** D-150 : fin de saison, l'image de ceux qui enchaînent les titres s'érode (le public se lasse). */
export function lassitudePublic(m: Monde): Evenement[] {
  const faits: Evenement[] = [];
  const titulaires = (Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).filter((p) => p.statut === 'actif' && p.poste === 'pilote_titulaire').sort((a, b) => (a.id < b.id ? -1 : 1));
  for (const x of [...ecuriesActives(m), ...titulaires] as (Ecurie | Personne)[]) {
    const n = titresConsecutifs(m, x.id);
    if (n < LASSITUDE_PUBLIC.seuilErosion) continue;
    changerImage(x, -LASSITUDE_PUBLIC.erosionParTitre * (n - LASSITUDE_PUBLIC.seuilErosion + 1));
    const nomX = 'prenom' in x ? nomDe(x) : x.nom;
    faits.push(ajouterEvenement(m, {
      type: 'media.lassitude_public', acteurs: [{ id: x.id, role: 'prenom' in x ? 'pilote' : 'ecurie' }], importance: 2, visibilite: 'public', contexte: { titresConsecutifs: n },
      texte: `Après ${n} titres d'affilée, le public commence à se lasser de la domination de ${nomX}.`,
    }));
  }
  return faits;
}

function retourNeutralite(m: Monde): void {
  for (const id of idsTries(table(m, TABLES.personnes))) {
    const p = personneDe(m, id)!;
    if (p.image) p.image = Math.round(p.image * (1 - IMAGE.retourMensuel) * 10) / 10 || undefined;
    if (p.exposition) p.exposition = Math.round(p.exposition * (1 - EXPOSITION.retourMensuel) * 10) / 10 || undefined;
  }
  for (const e of ecuriesActives(m)) if (e.image) e.image = Math.round(e.image * (1 - IMAGE.retourMensuel) * 10) / 10 || undefined;
}

/* ------------------------------------------------------------------ Scandales */

function scandale(m: Monde, revelee: Evenement): Evenement | undefined {
  const fait = m.evenements[String(revelee.contexte['fait'] ?? '')];
  const gravite = SCANDALES[String(revelee.contexte['type'] ?? '')];
  if (!gravite || !fait) return undefined;
  if (fait.type === 'personnel.critique' && fait.contexte['publique'] === true) return undefined; // déjà publique : pas un scandale
  const { personne, ecurie } = sujetsDe(m, fait);
  if (!ecurie) return undefined;
  if (personne) changerImage(personne, -SCANDALE.imageMax * gravite);
  changerImage(ecurie, -SCANDALE.imageMax * gravite);
  // Sponsors soucieux de leur image : la satisfaction baisse (la clause de sortie fera le reste en fin de saison).
  for (const c of Object.values(table(m, TABLES.contratsSponsoring)) as unknown as ContratSponsoring[]) {
    if (c.ecurie !== ecurie.id || c.statut !== 'actif') continue;
    const s = table(m, TABLES.sponsors)[c.sponsor] as unknown as Sponsor | undefined;
    if (s && SCANDALE.imagesSponsorsSensibles.includes(s.image)) c.satisfaction = Math.max(0, c.satisfaction - SCANDALE.satisfactionMax * gravite);
  }
  return ajouterEvenement(m, {
    type: 'media.scandale', acteurs: [...(personne ? [{ id: personne.id, role: 'auteur' }] : []), { id: ecurie.id, role: 'ecurie' }],
    importance: gravite >= 0.6 ? 4 : 3, visibilite: 'public', causes: [revelee.id], contexte: { gravite, fait: fait.id },
    texte: `Scandale chez ${ecurie.nom}${personne ? ` : ${nomDe(personne)} mis en cause` : ''}. ${fait.texte ?? ''}`.trim(),
  });
}

/* ------------------------------------------------------------------ Articles */

function exposer(m: Monde, sujets: string[], importance: number): void {
  for (const id of sujets) {
    const p = personneDe(m, id);
    if (p) p.exposition = Math.min(100, Math.round(((p.exposition ?? 0) + EXPOSITION.parArticle * importance) * 10) / 10);
  }
}

function publier(m: Monde, a: Omit<Article, 'id' | 'date'>): Article {
  // Volume : le texte n'est gardé que s'il dit plus que le titre (texteArticle le reconstitue).
  const art: Article = { id: nouvelIdentifiant(m, 'art'), date: { ...m.date }, ...a, ...(a.texte === a.titre ? { texte: '' } : {}) };
  table(m, TABLES.articles)[art.id] = art as unknown as Entite;
  exposer(m, art.sujets, art.importance);
  return art;
}

function bonusLigne(media: Media, type: string): number {
  const ligne = LIGNES_EDITORIALES[media.type] ?? {};
  for (const [prefixe, bonus] of Object.entries(ligne)) if (type.startsWith(prefixe)) return bonus;
  return 0;
}

/** Titre : la phrase du fait si elle est courte ; sinon sa première phrase, ou un début coupé (le texte complet reste dans l'article). */
function titreDe(e: Evenement): string {
  const texte = e.texte ?? '';
  if (texte.length <= ARTICLES.longueurTitre) return texte;
  const premiere = texte.split(/(?<=[.!?])\s(?=[A-ZÀ-Ý])/)[0] ?? texte;
  return premiere.length <= ARTICLES.longueurTitre ? premiere : `${premiere.slice(0, ARTICLES.longueurTitre - 1)}…`;
}

function genreDe(type: string): Article['genre'] {
  if (type === 'media.scandale') return 'scandale';
  if (type === 'media.declaration') return 'declaration';
  if (type === 'record.battu') return 'record';
  return 'fait';
}

function choisirArticles(m: Monde, faits: Evenement[]): void {
  for (const media of medias(m)) {
    const candidats: { e: Evenement; score: number; sujets: string[] }[] = [];
    for (const e of faits) {
      if (e.visibilite !== 'public' || !e.texte || e.type === 'media.rumeur') continue;
      const sujets = e.acteurs.map((a) => a.id).filter((id) => personneDe(m, id) || ecurieDe(m, id));
      if (media.type === 'national') {
        const compatriote = sujets.some((id) => (personneDe(m, id)?.nationalite ?? ecurieDe(m, id)?.nationalite) === media.nationalite);
        if (!compatriote) continue;
      }
      const pop = Math.max(0, ...sujets.map((id) => { const p = personneDe(m, id); return p && p.poste.startsWith('pilote') ? popularite(p).internationale : 0; }));
      const bonus = bonusLigne(media, e.type);
      if (!bonus && media.type !== 'reference' && e.importance < ARTICLES.importanceHorsLigne) continue;
      const score = e.importance + bonus + pop / ARTICLES.diviseurPopularite;
      if (score >= ARTICLES.seuil) candidats.push({ e, score, sujets });
    }
    candidats.sort((a, b) => b.score - a.score || (a.e.id < b.e.id ? -1 : 1));
    for (const c of candidats.slice(0, ARTICLES.parSemaine)) {
      publier(m, { media: media.id, genre: genreDe(c.e.type), titre: titreDe(c.e), texte: c.e.texte ?? '', source: c.e.id, sujets: c.sujets, importance: c.e.importance });
    }
  }
}

/* ------------------------------------------------------------------ Rumeurs */

function rumeurs(m: Monde): void {
  const sem = m.date;
  for (const media of medias(m)) {
    const f = tirageLocal(m, 'medias.rumeur', media.id, sem.annee, sem.semaine);
    // 1. Un fait privé qui circule déjà, déformé, dans le paddock (phase 8c).
    if (f.chance(media.appetitRumeurs * RUMEURS_MEDIAS.faitSuivi)) {
      const suivis = idsTries(faitsSuivis(m)).map((id) => faitsSuivis(m)[id] as unknown as FaitSuivi).filter((x) => x.rumeur.length > 0 && m.evenements[x.id]?.visibilite !== 'public' && m.evenements[x.id]?.texte);
      if (suivis.length) {
        const fs = suivis[f.entier(0, suivis.length - 1)]!;
        const e = m.evenements[fs.id]!;
        if (f.chance(fs.interet)) {
          const ev = ajouterEvenement(m, { type: 'media.rumeur', acteurs: e.acteurs.filter((a) => personneDe(m, a.id) || ecurieDe(m, a.id)), importance: 1, visibilite: 'public', causes: [e.id], contexte: { media: media.id, vraie: true } });
          publier(m, { media: media.id, genre: 'rumeur', titre: `Rumeur : ${titreDe(e).replace(/\.$/, '')} ?`, texte: `Selon des bruits de paddock rapportés par ${media.nom}, ${e.texte!.charAt(0).toLowerCase()}${e.texte!.slice(1)} Rien n'est confirmé.`, source: ev.id, sujets: ev.acteurs.map((a) => a.id), importance: 2, vraie: true });
        }
      }
    }
    // 2. Rumeur de transfert pendant le marché : vraie si une offre existe vraiment, fausse sinon.
    if (sem.semaine >= FENETRE.debut && sem.semaine <= FENETRE.fin && f.chance(media.appetitRumeurs * RUMEURS_MEDIAS.transfert)) {
      const offres = (Object.values(table(m, TABLES.offres)) as unknown as { id: string; ecurie: string; personne: string; statut: string }[]).filter((o) => o.statut === 'en_attente' || o.statut === 'contre_offre').sort((a, b) => (a.id < b.id ? -1 : 1));
      const pilotes = (Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).filter((p) => p.statut === 'actif' && p.poste === 'pilote_titulaire' && !p.joueur).sort((a, b) => (a.id < b.id ? -1 : 1));
      const ecuries = ecuriesActives(m);
      let cible: Personne | undefined, ec: Ecurie | undefined, vraie = false;
      if (offres.length && f.chance(RUMEURS_MEDIAS.partVraieCible)) {
        const o = offres[f.entier(0, offres.length - 1)]!;
        cible = personneDe(m, o.personne); ec = ecurieDe(m, o.ecurie); vraie = true;
      } else if (pilotes.length) {
        cible = pilotes[f.entier(0, pilotes.length - 1)];
        const autres = ecuries.filter((e) => e.id !== cible?.ecurie);
        ec = autres[f.entier(0, autres.length - 1)];
        vraie = offres.some((o) => o.personne === cible?.id && o.ecurie === ec?.id);
      }
      if (cible && ec && cible.ecurie !== ec.id) {
        const ev = ajouterEvenement(m, { type: 'media.rumeur', acteurs: [{ id: cible.id, role: 'personne' }, { id: ec.id, role: 'ecurie' }], importance: 1, visibilite: 'public', contexte: { media: media.id, vraie, genre: 'transfert' } });
        publier(m, { media: media.id, genre: 'rumeur', titre: `${nomDe(cible)} dans le viseur de ${ec.nom} ?`, texte: `${media.nom} affirme que ${ec.nom} s'intéresse à ${nomDe(cible)}. Ni l'écurie ni le pilote n'ont confirmé.`, source: ev.id, sujets: [cible.id, ec.id], importance: 2, vraie });
      }
    }
  }
}

/* ------------------------------------------------------------------ Conférences de presse */

const OPTIONS: Record<QuestionConference, ReponseConference[]> = {
  pilote_menace: ['soutenir', 'mettre_pression', 'esquiver'],
  objectif_titre: ['viser_titre', 'prudence', 'esquiver'],
  scandale: ['assumer', 'nier', 'esquiver'],
  rival: ['attaquer_rival', 'respecter', 'esquiver'],
  federation: ['critiquer_federation', 'soutenir_federation', 'esquiver'],
};
/** Style de chaque réponse (choix de l'IA selon la personnalité du team principal). */
const STYLE: Record<ReponseConference, 'agressif' | 'chaleureux' | 'prudent' | 'neutre'> = {
  soutenir: 'chaleureux', mettre_pression: 'agressif', viser_titre: 'agressif', prudence: 'prudent', assumer: 'prudent', nier: 'agressif',
  attaquer_rival: 'agressif', respecter: 'chaleureux', critiquer_federation: 'agressif', soutenir_federation: 'chaleureux', esquiver: 'neutre',
};

export function poserQuestion(m: Monde, e: Ecurie, question: QuestionConference, sujet?: string, cause?: string): void {
  if (conferences(m, e.id).length) return; // une question à la fois
  const c: Conference = {
    id: nouvelIdentifiant(m, 'cnf'), ecurie: e.id, question, ...(sujet ? { sujet } : {}), ...(cause ? { cause } : {}),
    date: { ...m.date }, echeance: ajouterSemaines(m.date, CONFERENCES.delaiSemaines), options: OPTIONS[question],
  };
  table(m, TABLES.conferences)[c.id] = c as unknown as Entite;
}

function questionsDeLaSemaine(m: Monde, faits: Evenement[]): void {
  const gp = (Object.values(table(m, TABLES.grandsPrix)) as unknown as GrandPrix[]).some((g) => g.saison === m.date.annee && g.semaine === m.date.semaine);
  const s = table(m, TABLES.saisons)[`ssn_${m.date.annee}`] as unknown as Saison | undefined;
  for (const e of ecuriesActives(m)) {
    const f = tirageLocal(m, 'medias.conference', e.id, m.date.annee, m.date.semaine);
    const sc = faits.find((x) => x.type === 'media.scandale' && x.acteurs.some((a) => a.id === e.id));
    if (sc && f.chance(CONFERENCES.probaApresFait)) { poserQuestion(m, e, 'scandale', undefined, sc.id); continue; }
    const fed = faits.find((x) => x.type === 'reglement.annonce' || x.type === 'federation.vote');
    if (fed && f.chance(CONFERENCES.probaApresFait / 4)) { poserQuestion(m, e, 'federation', undefined, fed.id); continue; }
    if (!gp || !f.chance(CONFERENCES.probaGP)) continue;
    const pilotes = (Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).filter((p) => p.statut === 'actif' && p.ecurie === e.id && p.poste === 'pilote_titulaire').sort((a, b) => (a.id < b.id ? -1 : 1));
    const menace = pilotes.find((p) => performanceInsuffisante(m, p));
    const rangC = s ? s.constructeurs.findIndex((x) => x.ecurie === e.id) + 1 : 0;
    if (menace) poserQuestion(m, e, 'pilote_menace', menace.id);
    else if (rangC >= 1 && rangC <= 3 && e.objectifAnnonce?.annee !== m.date.annee) poserQuestion(m, e, 'objectif_titre');
    else if (s && rangC > 1 && rangC <= CONFERENCES.rangRivalMax) poserQuestion(m, e, 'rival', s.constructeurs[rangC - 2]!.ecurie);
  }
}

/** Choix de l'IA (et du service de communication délégué) selon la personnalité du team principal. */
export function reponseIA(m: Monde, c: Conference, tp: Personne): ReponseConference {
  const t = (k: string) => (tp.traits[k] ?? 10);
  const styles = {
    agressif: (t('temperament') - 10) / 10 + (t('ambition') - 10) / 20,
    chaleureux: (t('loyaute') - 10) / 10 + (t('sociabilite') - 10) / 20,
    prudent: (t('professionnalisme') - 10) / 10,
    neutre: 0,
  };
  const f = tirageLocal(m, 'medias.reponse', c.id);
  return c.options.map((o) => ({ o, u: styles[STYLE[o]] + f.normale(0, 0.3) })).sort((a, b) => b.u - a.u)[0]!.o;
}

function phraseDeclaration(m: Monde, tp: Personne, c: Conference, r: ReponseConference): string {
  const e = ecurieDe(m, c.ecurie)!;
  const sujet = c.sujet ? (personneDe(m, c.sujet) ? nomDe(personneDe(m, c.sujet)!) : ecurieDe(m, c.sujet)?.nom ?? '') : '';
  const qui = nomDe(tp);
  switch (r) {
    case 'soutenir': return `${qui} (${e.nom}) : « ${sujet} a toute notre confiance. »`;
    case 'mettre_pression': return `${qui} (${e.nom}) : « ${sujet} doit montrer bien plus. Personne n'est intouchable. »`;
    case 'viser_titre': return `${qui} (${e.nom}) : « Nous sommes là pour gagner le titre. »`;
    case 'prudence': return `${qui} (${e.nom}) : « Chaque course compte, nous verrons à la fin de la saison. »`;
    case 'assumer': return `${qui} (${e.nom}) : « Nous avons commis des erreurs, nous les assumons. »`;
    case 'nier': return `${qui} (${e.nom}) dément les révélations de la presse.`;
    case 'attaquer_rival': return `${qui} (${e.nom}) : « ${sujet} ? Ils n'ont pas notre rythme. »`;
    case 'respecter': return `${qui} (${e.nom}) salue le travail de ${sujet}.`;
    case 'critiquer_federation': return `${qui} (${e.nom}) critique ouvertement les décisions de la fédération.`;
    case 'soutenir_federation': return `${qui} (${e.nom}) soutient les décisions de la fédération.`;
    default: return `${qui} (${e.nom}) esquive les questions des journalistes.`;
  }
}

/** Commande commune au joueur et à l'IA : répondre à une question de la presse. */
export const commandeDeclaration: DefinitionCommande = {
  type: 'media.declaration',
  valider(m, cmd) {
    const c = table(m, TABLES.conferences)[String(cmd.parametres['conference'] ?? '')] as unknown as Conference | undefined;
    if (!c) return 'Aucune question en attente.';
    const tp = teamPrincipal(m, c.ecurie);
    if (!tp || tp.id !== cmd.auteur) return 'Seul le team principal de l’écurie répond à la presse.';
    if (!c.options.includes(cmd.parametres['reponse'] as ReponseConference)) return `Réponse possible : ${c.options.join(', ')}.`;
    return null;
  },
  appliquer({ monde: m }, cmd) {
    const c = table(m, TABLES.conferences)[String(cmd.parametres['conference'])] as unknown as Conference;
    const r = cmd.parametres['reponse'] as ReponseConference;
    const tp = personneDe(m, cmd.auteur)!;
    const e = ecurieDe(m, c.ecurie)!;
    delete table(m, TABLES.conferences)[c.id];
    const evt = ajouterEvenement(m, {
      type: 'media.declaration', acteurs: [{ id: tp.id, role: 'auteur' }, { id: e.id, role: 'ecurie' }, ...(c.sujet ? [{ id: c.sujet, role: 'cible' }] : [])],
      importance: 2, visibilite: 'public', causes: c.cause && m.evenements[c.cause] ? [c.cause] : [],
      contexte: { question: c.question, reponse: r }, texte: phraseDeclaration(m, tp, c, r),
    });
    const [ip, ie] = IMAGE_PAR_REPONSE[r] ?? [0, 0];
    changerImage(tp, ip);
    changerImage(e, ie);
    const sujet = c.sujet ? personneDe(m, c.sujet) : undefined;
    if (r === 'soutenir' && sujet) soutenir(m, tp, sujet, true);
    if (r === 'mettre_pression' && sujet) critiquer(m, tp, sujet, true);
    if (r === 'viser_titre') e.objectifAnnonce = { annee: m.date.annee, niveau: 'titre' };
    if (r === 'prudence') e.objectifAnnonce = { annee: m.date.annee, niveau: 'prudent' };
    const rivalTp = c.sujet && ecurieDe(m, c.sujet) ? teamPrincipal(m, c.sujet) : undefined;
    if (r === 'attaquer_rival' && rivalTp) lireEvenement(m, rivalTp.id, tp.id, 'rivalite', evt.id);
    if (r === 'respecter' && rivalTp) lireEvenement(m, rivalTp.id, tp.id, 'reconnaissance', evt.id, { facteur: 0.5 });
    const president = federation(m)?.president;
    if (r === 'critiquer_federation' && president) lireEvenement(m, president, tp.id, 'conflit', evt.id);
    if (r === 'soutenir_federation' && president) lireEvenement(m, president, tp.id, 'reconnaissance', evt.id, { facteur: 0.5 });
  },
};

function repondreConferences(m: Monde, commander: (c: { type: string; auteur: string; parametres: Record<string, unknown> }) => unknown): void {
  for (const c of conferences(m).sort((a, b) => (a.id < b.id ? -1 : 1))) {
    const e = ecurieDe(m, c.ecurie);
    const tp = e ? teamPrincipal(m, e.id) : undefined;
    if (!e || !tp) { delete table(m, TABLES.conferences)[c.id]; continue; }
    if (iaDecide(e, 'communication')) commander({ type: 'media.declaration', auteur: tp.id, parametres: { conference: c.id, reponse: reponseIA(m, c, tp) } });
    // Le joueur n'a pas répondu à temps : le service de communication esquive pour lui.
    else if (rang(m.date) >= rang(c.echeance)) commander({ type: 'media.declaration', auteur: tp.id, parametres: { conference: c.id, reponse: 'esquiver' } });
  }
}

/* ------------------------------------------------------------------ Volumes */

function purgerArticles(m: Monde): void {
  const t = table(m, TABLES.articles);
  const parSaison = new Map<number, Article[]>();
  for (const a of articles(m)) {
    if (a.date.annee >= m.date.annee - ARTICLES.saisonsConservees) continue;
    if (a.importance < ARTICLES.importanceArchive) { delete t[a.id]; continue; }
    (parSaison.get(a.date.annee) ?? parSaison.set(a.date.annee, []).get(a.date.annee)!).push(a);
  }
  for (const liste of parSaison.values()) {
    liste.sort((a, b) => b.importance - a.importance || (a.id < b.id ? -1 : 1));
    for (const a of liste.slice(ARTICLES.archiveParSaison)) delete t[a.id];
  }
}

/* ------------------------------------------------------------------ Système */

export const systemeMedias: Systeme = {
  nom: 'medias.semaine',
  executer({ monde: m, date, commanderIA }) {
    if (!medias(m).length) return; // partie antérieure à la phase 11 : pas de médias (voir la migration 25 → 26)
    const etat = (table(m, TABLES.etatMedias)[ETAT] ??= { id: ETAT, dernier: 0 } as unknown as Entite) as unknown as { id: string; dernier: number };
    const lire = (de: number, a: number) => {
      const res: Evenement[] = [];
      for (let n = de; n <= a; n++) { const e = m.evenements[`evt_${String(n).padStart(6, '0')}`]; if (e && !ignore(e.type)) res.push(e); }
      return res;
    };
    // 1. Faits de la semaine : image, scandales, records de fin de saison.
    const nouveaux: Evenement[] = [];
    for (const e of lire(etat.dernier + 1, m.compteurs['evt'] ?? 0)) {
      nouveaux.push(e);
      appliquerImageFait(m, e);
      if (e.type === 'information.revelee') { const s = scandale(m, e); if (s) nouveaux.push(s); }
    }
    if (date.semaine === 50) {
      for (const ev of mettreAJourRecords(m)) { appliquerImageFait(m, ev); nouveaux.push(ev); }
      nouveaux.push(...lassitudePublic(m));
    }
    // 2. Conférences de presse : questions, réponses de l'IA (et du service de communication).
    const avantDeclarations = m.compteurs['evt'] ?? 0;
    questionsDeLaSemaine(m, nouveaux);
    repondreConferences(m, (c) => commanderIA(c));
    nouveaux.push(...lire(avantDeclarations + 1, m.compteurs['evt'] ?? 0).filter((e) => e.type === 'media.declaration'));
    // 3. Articles et rumeurs. Les faits créés ici ne sont pas relus la semaine suivante (pas de double compte).
    choisirArticles(m, nouveaux);
    rumeurs(m);
    etat.dernier = m.compteurs['evt'] ?? 0;
    if (date.semaine % 4 === 2) retourNeutralite(m);
    if (date.semaine === 1) purgerArticles(m);
  },
};

export function installerMedias(moteur: Moteur): Moteur {
  moteur.ajouterSysteme(systemeMedias);
  moteur.commandes.enregistrer(commandeDeclaration);
  return moteur;
}

