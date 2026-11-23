/**
 * Phase 9 — histoire ancrée : la couche humaine du passé (D-046, D-142, D-143 ; docs/systemes/phase-9-histoire-ancree.md).
 *
 * Les faits passés viennent des données et ne changent jamais (carrières, arrivées des dirigeants, palmarès, histoires réelles).
 * Pour chaque saison de 2010 à 2026, on construit ce qu'elle a laissé dans les têtes, sans rejouer la saison :
 * - familiarité entre ceux qui ont travaillé dans la même écurie (et envers l'écurie) ;
 * - histoires réelles connues (histoires.csv), puis souvenirs plausibles tirés selon les situations et les personnalités fictives ;
 * - oubli des mois écoulés (les vieux souvenirs s'effacent en laissant un résidu) ;
 * - Chronique : titres et ères.
 * La grille, les contrats et les voitures de 2027 ne sont jamais touchés.
 */

import { ERES, HISTOIRES_REELLES, PASSE, SITUATIONS_PASSE } from '../balance/histoire';
import { ETIQUETTES, FAMILIARITE_MENSUELLE, SEUIL_EFFACEMENT_SOUVENIR } from '../balance/memoire';
import { ajouterEvenement } from '../core/evenements';
import { table, type Monde } from '../core/monde';
import { tirageLocal } from '../core/moteur';
import { TABLES, type Carriere, type Ecurie, type Palmares, type Personne } from '../model/types';
import { effacer, lireEvenement, oublierUnMois, relationBrute } from '../systems/memoire';
import type { HistoireDonnees } from './chargement';

const nomDe = (monde: Monde, id: string) => {
  const p = table(monde, TABLES.personnes)[id] as unknown as Personne | undefined;
  if (p) return `${p.prenom} ${p.nom}`;
  return (table(monde, TABLES.ecuries)[id] as unknown as Ecurie | undefined)?.nom ?? id;
};

/** Présents dans chaque écurie (lignée) pour une saison passée, d'après les carrières. */
function presents(carrieres: Carriere[], annee: number): Map<string, string[]> {
  const res = new Map<string, string[]>();
  for (const c of carrieres) {
    if (c.de > annee || c.a < annee) continue;
    const l = res.get(c.ecurieLignee) ?? res.set(c.ecurieLignee, []).get(c.ecurieLignee)!;
    if (!l.includes(c.personne)) l.push(c.personne);
  }
  for (const l of res.values()) l.sort();
  return res;
}

function souvenirPasse(monde: Monde, porteur: string, cible: string, etiquette: string, facteur: number, texte: string, causes: string[] = []): void {
  const evt = ajouterEvenement(monde, {
    type: `histoire.${etiquette}`, acteurs: [{ id: porteur, role: 'auteur' }, { id: cible, role: 'cible' }], importance: 2, visibilite: 'prive', causes,
    contexte: { passe: true }, texte,
  });
  lireEvenement(monde, porteur, cible, etiquette, evt.id, { facteur });
}

export function construirePasse(monde: Monde, histoires: HistoireDonnees[]): void {
  const dateDepart = { ...monde.date };
  const carrieres = (Object.values(table(monde, TABLES.carrieres)) as unknown as Carriere[]).slice().sort((a, b) => (a.id < b.id ? -1 : 1));
  const palmares = (Object.values(table(monde, TABLES.palmares)) as unknown as Palmares[]).slice().sort((a, b) => a.saison - b.saison);
  const personnes = table(monde, TABLES.personnes);
  const existe = (id: string) => !!personnes[id];
  const fin = dateDepart.annee - 1;
  const debut = Math.max(PASSE.debut, Math.min(...carrieres.map((c) => c.de), ...palmares.map((p) => p.saison), fin));
  const age = (id: string, annee: number) => annee - ((personnes[id] as unknown as Personne | undefined)?.anneeNaissance ?? annee);

  const reelles: { h: HistoireDonnees; evt: string }[] = [];
  for (let annee = debut; annee <= fin; annee++) {
    monde.date = { annee, semaine: PASSE.semaine };
    const parEcurie = presents(carrieres, annee);
    const titre = palmares.find((p) => p.saison === annee);

    // Familiarité : une saison passée ensemble (au même rythme qu'en jeu), et envers l'écurie.
    for (const [ecurie, membres] of parEcurie) {
      for (const a of membres) {
        if (!existe(a)) continue;
        const re = relationBrute(monde, a, ecurie, true)!;
        re.familiarite = Math.min(1, re.familiarite + 12 * FAMILIARITE_MENSUELLE);
        for (const b of membres) {
          if (a === b || !existe(b)) continue;
          const r = relationBrute(monde, a, b, true)!;
          r.familiarite = Math.min(1, r.familiarite + 12 * FAMILIARITE_MENSUELLE);
        }
      }
    }

    // Chronique : les titres de la saison.
    if (titre) {
      ajouterEvenement(monde, {
        type: 'histoire.titre', acteurs: [{ id: titre.championPilote, role: 'champion' }, { id: titre.ecurieChampionPilote, role: 'ecurie' }, { id: titre.championConstructeurs, role: 'constructeurs' }],
        importance: 4, visibilite: 'public', contexte: { saison: annee, passe: true },
        texte: `${annee} : ${nomDe(monde, titre.championPilote)} champion du monde avec ${nomDe(monde, titre.ecurieChampionPilote)} ; titre des constructeurs pour ${nomDe(monde, titre.championConstructeurs)}.`,
      });
    }

    // Histoires réelles connues de la saison : faits publics (leurs souvenirs sont créés à la fin, voir plus bas).
    for (const h of histoires.filter((x) => x.saison === annee)) {
      if (!existe(h.porteur)) continue;
      reelles.push({ h, evt: ajouterEvenement(monde, {
        type: 'histoire.reelle', acteurs: [{ id: h.porteur, role: 'auteur' }, { id: h.cible, role: 'cible' }], importance: 3, visibilite: 'public',
        contexte: { histoire: h.id, etiquette: h.etiquette, passe: true }, texte: `${annee} : ${h.texte}.`,
      }).id });
    }

    // Souvenirs plausibles inventés autour des faits (personnalités fictives).
    for (const [ecurie, membres] of parEcurie) {
      const pilotes = membres.filter((id) => carrieres.some((c) => c.personne === id && c.ecurieLignee === ecurie && c.de <= annee && c.a >= annee && c.poste.startsWith('pilote')) && existe(id));
      // Rivalité : le coéquipier du champion.
      if (titre && titre.ecurieChampionPilote === ecurie && pilotes.includes(titre.championPilote)) {
        for (const autre of pilotes.filter((id) => id !== titre.championPilote)) {
          const p = personnes[autre] as unknown as Personne;
          const proba = SITUATIONS_PASSE.rivalite.base + (SITUATIONS_PASSE.rivalite.parAmbition * ((p.traits['ambition'] ?? 10) - 10)) / 10;
          if (tirageLocal(monde, 'histoire.rivalite', autre, annee).chance(proba)) {
            souvenirPasse(monde, autre, titre.championPilote, 'rivalite', SITUATIONS_PASSE.rivalite.facteur, `${annee} : ${nomDe(monde, autre)} vit mal la domination de son coéquipier champion.`);
          }
        }
      }
      // Mentorat : un aîné soutient un jeune coéquipier.
      for (const jeune of pilotes.filter((id) => age(id, annee) <= SITUATIONS_PASSE.mentorat.ageJeune)) {
        for (const aine of pilotes.filter((id) => age(id, annee) >= SITUATIONS_PASSE.mentorat.ageAine)) {
          const p = personnes[aine] as unknown as Personne;
          if (tirageLocal(monde, 'histoire.mentorat', aine, jeune, annee).chance((SITUATIONS_PASSE.mentorat.base * (p.traits['sociabilite'] ?? 10)) / 10)) {
            souvenirPasse(monde, jeune, aine, 'soutien', SITUATIONS_PASSE.mentorat.facteur, `${annee} : ${nomDe(monde, aine)} prend ${nomDe(monde, jeune)} sous son aile.`);
          }
        }
      }
      // Réussite commune : l'écurie championne des constructeurs.
      if (titre && titre.championConstructeurs === ecurie) {
        for (const id of membres.filter(existe)) souvenirPasse(monde, id, ecurie, 'reussite_commune', SITUATIONS_PASSE.reussite.facteur, `${annee} : titre des constructeurs vécu avec ${nomDe(monde, ecurie)}.`);
      }
    }
    // Départs : un pilote quitte une écurie à la fin de la saison (et n'y revient pas la saison suivante).
    for (const c of carrieres) {
      if (c.a !== annee || annee >= fin || !c.poste.startsWith('pilote') || !existe(c.personne)) continue;
      if (carrieres.some((x) => x.personne === c.personne && x.ecurieLignee === c.ecurieLignee && x.de === annee + 1)) continue;
      const titres = palmares.filter((x) => x.championPilote === c.personne && x.ecurieChampionPilote === c.ecurieLignee && x.saison >= c.de && x.saison <= c.a).length;
      if (titres > 0 || c.a - c.de + 1 >= SITUATIONS_PASSE.depart.anneesGratitude) {
        souvenirPasse(monde, c.personne, c.ecurieLignee, 'gratitude', SITUATIONS_PASSE.depart.facteurGratitude, `${annee} : ${nomDe(monde, c.personne)} quitte ${nomDe(monde, c.ecurieLignee)} en bons termes.`);
      } else if (tirageLocal(monde, 'histoire.depart', c.personne, c.ecurieLignee, annee).chance(SITUATIONS_PASSE.depart.probaRancoeur)) {
        souvenirPasse(monde, c.personne, c.ecurieLignee, 'manque_reconnaissance', SITUATIONS_PASSE.depart.facteurRancoeur, `${annee} : ${nomDe(monde, c.personne)} quitte ${nomDe(monde, c.ecurieLignee)} avec amertume.`);
      }
    }

    // Les mois passent : les souvenirs s'atténuent, les plus anciens s'effacent en laissant un résidu.
    for (let m = 0; m < PASSE.moisParSaison; m++) oublierUnMois(monde);
  }

  // Histoires réelles : elles marquent durablement (atténuation ralentie pendant le passé, puis oubli normal en jeu).
  for (const { h, evt } of reelles) {
    monde.date = { annee: h.saison, semaine: PASSE.semaine };
    const mois = (fin - h.saison + 1) * PASSE.moisParSaison;
    for (const [porteur, cible] of h.reciproque && existe(h.cible) ? [[h.porteur, h.cible], [h.cible, h.porteur]] : [[h.porteur, h.cible]]) {
      const s = lireEvenement(monde, porteur!, cible!, h.etiquette, evt, { facteur: h.intensite });
      if (!s) continue;
      s.intensite *= Math.pow(1 - (ETIQUETTES[h.etiquette]?.oubli ?? 0) * HISTOIRES_REELLES.persistance, mois);
      if (s.intensite < SEUIL_EFFACEMENT_SOUVENIR) effacer(monde, s);
    }
  }

  // Ères : séries de titres constructeurs consécutifs.
  let i = 0;
  while (i < palmares.length) {
    let j = i;
    while (j + 1 < palmares.length && palmares[j + 1]!.championConstructeurs === palmares[i]!.championConstructeurs && palmares[j + 1]!.saison === palmares[j]!.saison + 1) j++;
    if (j - i + 1 >= ERES.serieMin) {
      const p = palmares[i]!;
      monde.date = { annee: palmares[j]!.saison, semaine: PASSE.semaine + 1 };
      ajouterEvenement(monde, {
        type: 'histoire.ere', acteurs: [{ id: p.championConstructeurs, role: 'ecurie' }], importance: 4, visibilite: 'public',
        contexte: { debut: p.saison, fin: palmares[j]!.saison, titres: j - i + 1, passe: true },
        texte: `L'ère ${nomDe(monde, p.championConstructeurs)} : ${j - i + 1} titres des constructeurs consécutifs (${p.saison}–${palmares[j]!.saison}).`,
      });
    }
    i = j + 1;
  }
  monde.date = dateDepart;
  // Chronique dans l'ordre chronologique (les ères sont ajoutées après les titres).
  monde.chronique.sort((a, b) => a.date.annee - b.date.annee || a.date.semaine - b.date.semaine || (a.id < b.id ? -1 : 1));
}
