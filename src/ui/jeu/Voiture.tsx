/**
 * Phase 12a — écran Technique : la voiture et ses pièces (D-170).
 * Forces et faiblesses circuit par circuit (profil de vitesse), pièces montées, projets de conception, choix d'architecture.
 * Ce qui est montré est ce que le personnel de l'écurie sait : l'estimation d'un projet vient du responsable (jamais la vérité).
 */
import { useState } from 'preact/hooks';
import {
  allocationPeriode, architectureRecommandee, circuitsAVenir, coutTotal, dilemmes, fatiguePole, ecuriesActives, efficaciteAttendue, enveloppeRestante, estDelegue, indiceSurCircuit, meilleurProjet, paysage, paysagePercu,
  piecesInstallees, projets, reglementAnnonce, type Circuit, type Ecurie, type Monde,
} from '../../engine';
import { PIECES, SOUFFLERIE, TYPES_PIECES, type TypePiece } from '../../engine/balance/monoplaces';
import { commander, ecurieJoueur, meur, type Partie } from './partie';
import type { Navigation } from './Jeu';

const LIB_OPTION: Record<string, string> = {
  ralentir: 'Ralentir le rythme', verifier: 'Financer une vérification', maintenir: 'Maintenir le calendrier',
  refuser: 'Refuser', explorer: 'Explorer (2 semaines, 0,45 M€)', explorer_soufflerie: 'Explorer avec la soufflerie (2 semaines, 0,45 M€)',
  prudence: 'Jouer la prudence', poursuivre: 'Poursuivre', tenter: 'Tenter', essais: 'Essais de résistance (0,4 M€, 1 semaine)', conserver: 'Garder la solution éprouvée',
  reorienter: 'Réorienter (1 semaine)',
};
const LIB_RYTHME: Record<string, string> = { allege: 'allégé', normal: 'normal', intensif: 'intensif' };
const couleurFatigue = (f: number) => (f < 30 ? 'var(--green)' : f < 55 ? 'var(--yellow)' : 'var(--accent)');

const libConcept = (t: TypePiece, c: number) => (c > 0.15 ? PIECES[t].conceptPlus : c < -0.15 ? PIECES[t].conceptMoins : 'équilibré');

/** Rang de chaque voiture sur un circuit (1 = la plus rapide). */
function rangSur(m: Monde, e: Ecurie, c: Circuit): number {
  const indices = ecuriesActives(m).map((x) => ({ id: x.id, v: indiceSurCircuit(m, x, c) })).sort((a, b) => b.v - a.v);
  return indices.findIndex((x) => x.id === e.id) + 1;
}

export function CarteVoiture({ partie, nav }: { partie: Partie; nav: Navigation }) {
  const m = partie.monde;
  const e = ecurieJoueur(m)!;
  const [msg, setMsg] = useState<string | null>(null);
  const [type, setType] = useState<TypePiece>('aileron_arriere');
  const [concept, setConcept] = useState('0');
  const delegue = estDelegue(m, e, 'recherche');
  const circuits = circuitsAVenir(m);
  const rangs = circuits.map((c) => ({ c, r: rangSur(m, e, c) }));
  const tries = [...rangs].sort((a, b) => a.r - b.r);
  const pieces = piecesInstallees(m, e.id);
  const enCours = projets(m, e.id);
  const futur = reglementAnnonce(m);
  const familles = futur ? paysage(m, futur).familles : [];
  const percu = futur && familles.length ? paysagePercu(m, e.id, futur) : {};
  const choisie = futur ? e.architectures?.[futur.id] : undefined;
  const conseil = futur ? architectureRecommandee(m, e.id, futur) : undefined;
  const estime = meilleurProjet(m, e, type, circuits);
  const agir = (t: string, prm: Record<string, unknown>, ok: string) => {
    const r = commander(partie, t, prm);
    setMsg(r.ok ? ok : `Impossible : ${(r as { motif: string }).motif}`);
    nav.rafraichir();
  };
  const enAttente = dilemmes(m, e.id);
  const souff = allocationPeriode(m, e.id);
  const partRech = e.souffleriePartRecherche ?? SOUFFLERIE.partRechercheDefaut;
  return (
    <>
      {msg && <div class="carte retour" role="status">{msg}</div>}
      {enAttente.map((d) => (
        <div key={d.id} class="carte attention">
          <h3>❗ {d.famille === 'alerte' ? 'Alerte de votre responsable' : 'Décision technique'}</h3>
          <p>« {d.texte} »</p>
          <div class="actions">{d.options.map((o) => <button key={o} class={`btn ${o === d.recommandation ? 'principal' : ''}`} onClick={() => agir('conception.dilemme', { dilemme: d.id, option: o }, 'Décision prise.')}>{LIB_OPTION[o] ?? o}</button>)}</div>
          <p class="muted petit">Le bouton en rouge est la recommandation de votre responsable : ses conseils sont plus fiables quand il est compétent et reposé, jamais certains.</p>
        </div>
      ))}
      <div class="carte">
        <h3>Équipes techniques</h3>
        {(['aero', 'conception'] as const).map((pole) => {
          const f = fatiguePole(m, e.id, pole);
          return <p key={pole}>{pole === 'aero' ? 'Pôle aérodynamique' : 'Pôle conception'} : fatigue <strong style={{ color: couleurFatigue(f) }}>{Math.round(f)}</strong>/100
            <span class="muted petit"> · {f < 30 ? 'équipe fraîche' : f < 55 ? 'équipe fatiguée : erreurs plus probables' : 'équipe épuisée : ralentissez'}</span></p>;
        })}
        <p>Soufflerie : <strong>{Math.round(souff.heures)} h</strong> et {Math.round(souff.cfd)} simulations CFD par période ({Math.round(souff.bareme * 100)} % du barème, selon votre classement).</p>
        {!delegue ? (
          <label class="champ">Part de la soufflerie pour la recherche et la préparation de l’avenir
            <select value={String(partRech)} onChange={(v) => agir('conception.soufflerie', { ecurie: e.id, partRecherche: Number((v.target as HTMLSelectElement).value) }, 'Répartition modifiée.')}>
              {[0, 0.15, 0.3, 0.45, 0.6, 0.8, 1].map((x) => <option key={x} value={String(x)}>{Math.round(x * 100)} %</option>)}
            </select></label>
        ) : <p class="muted petit">Part de la recherche : {Math.round(partRech * 100)} % (décidée par votre directeur technique).</p>}
      </div>
      <div class="carte">
        <h3>Votre voiture, circuit par circuit</h3>
        <p class="muted petit">Rang de votre voiture parmi les {ecuriesActives(m).length} sur les circuits à venir (temps au tour calculé sur le tracé réel).</p>
        {tries.length > 0 && (
          <p>Points forts : {tries.slice(0, 3).map((x) => `${x.c.nom} (${x.r}e)`).join(', ')}<br />
            Points faibles : {tries.slice(-3).reverse().map((x) => `${x.c.nom} (${x.r}e)`).join(', ')}</p>
        )}
      </div>
      <div class="carte">
        <h3>Pièces montées</h3>
        <ul class="liste-faits">
          {TYPES_PIECES.map((t) => {
            const p = pieces.find((x) => x.type === t);
            return <li key={t}><strong>{PIECES[t].libelle}</strong> : version {p?.version ?? '—'}, {p ? libConcept(t, p.concept) : '—'}</li>;
          })}
        </ul>
      </div>
      {futur && familles.length > 0 && (
        <div class="carte">
          <h3>Architecture du prochain règlement ({futur.debut})</h3>
          <p class="muted petit">Personne ne sait quelle architecture sera la meilleure. L’avis de votre directeur technique dépend de la recherche menée sur ce règlement et de sa vision : plus vous préparez, plus il voit juste.</p>
          <ul class="liste-faits">
            {familles.map((f) => <li key={f}><strong>{f}</strong> : {percu[f]! < 0.05 ? 'très prometteuse' : percu[f]! < 0.15 ? 'intéressante' : 'risquée'}{f === conseil ? ' (recommandée)' : ''}{f === choisie ? ' — votre choix' : ''}</li>)}
          </ul>
          {!delegue && (
            <div class="actions">{familles.map((f) => <button key={f} class={`btn ${f === choisie ? 'principal' : ''}`} onClick={() => agir('conception.architecture', { ecurie: e.id, reglement: futur.id, famille: f }, `Architecture retenue : ${f}.`)}>{f}</button>)}</div>
          )}
          {delegue && <p class="muted petit">Recherche déléguée : votre directeur technique choisira {conseil ? `« ${conseil} »` : 'lui-même'}.</p>}
        </div>
      )}
      <div class="carte">
        <h3>Projets de conception</h3>
        <p class="muted petit">Budget encore disponible cette année pour les pièces : {meur(Math.max(0, enveloppeRestante(m, e.id)))}.</p>
        {enCours.length === 0 && <p class="muted">Aucun projet en cours.</p>}
        <ul class="liste-faits">
          {enCours.map((p) => {
            const t = p.type as TypePiece;
            const etat = p.fabricationJoursRestants !== undefined ? `fabrication, ${Math.max(0, Math.ceil(p.fabricationJoursRestants))} j` : `conception ${Math.round(100 * (1 - p.joursRestants / p.joursTotal))} %`;
            return <li key={p.id}><strong>{PIECES[t].libelle}</strong> ({libConcept(t, p.concept)}) : {etat}{p.fabricationJoursRestants === undefined ? `, rythme ${LIB_RYTHME[p.rythme ?? 'normal']}` : ''}
              {!delegue && p.fabricationJoursRestants === undefined && <> <select value={p.rythme ?? 'normal'} onChange={(v) => agir('conception.rythme', { projet: p.id, rythme: (v.target as HTMLSelectElement).value }, 'Rythme modifié.')}>{Object.entries(LIB_RYTHME).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></>}
              {!delegue && p.fabricationJoursRestants === undefined && <> <button class="btn" onClick={() => agir('conception.annuler', { projet: p.id }, 'Projet abandonné (coût de conception non remboursé).')}>Abandonner</button></>}</li>;
          })}
        </ul>
        {delegue ? <p class="muted petit">Recherche et conception déléguées : votre directeur technique lance les projets (réglage dans « Programmes de recherche »).</p> : (
          <>
            <div class="ligne-champs">
              <label class="champ">Pièce <select value={type} onChange={(v) => setType((v.target as HTMLSelectElement).value as TypePiece)}>{TYPES_PIECES.map((t) => <option key={t} value={t}>{PIECES[t].libelle}</option>)}</select></label>
              <label class="champ">Concept <select value={concept} onChange={(v) => setConcept((v.target as HTMLSelectElement).value)}>
                {[-1, -0.5, -0.25, 0, 0.25, 0.5, 1].map((c) => <option key={c} value={String(c)}>{c < 0 ? `${PIECES[type].conceptMoins} (${c})` : c > 0 ? `${PIECES[type].conceptPlus} (+${c})` : 'équilibré'}</option>)}
              </select></label>
            </div>
            <p class="muted petit">
              {PIECES[type].conceptionJours} jours de conception, {PIECES[type].fabricationJours} jours de fabrication, {meur(coutTotal(type))} en tout.
              Avis du responsable : {estime.gain > 0.005 ? `un gain probable sur les circuits à venir avec un concept ${libConcept(type, estime.concept)}` : 'peu à gagner sur cette pièce pour l’instant'} ;
              efficacité visée {efficaciteAttendue(m, e, type, Number(concept)) >= (pieces.find((x) => x.type === type)?.efficacite ?? 0) ? 'en progrès' : 'en recul (concept trop différent de l’actuel)'}.
            </p>
            <div class="actions"><button class="btn principal" onClick={() => agir('conception.lancer', { ecurie: e.id, type, concept: Number(concept) }, 'Projet lancé.')}>Lancer le projet</button></div>
          </>
        )}
      </div>
    </>
  );
}

