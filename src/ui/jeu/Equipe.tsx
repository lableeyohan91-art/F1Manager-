/** Phase 10 — écrans Équipe, fiche d'une personne, Marché. Toutes les actions passent par les commandes du moteur. */
import { useState } from 'preact/hooks';
import {
  contratEmploi, enFenetre, niveauMetier, POSTES_MARCHE, potentielEstime, table, TABLE_NEGOCIATIONS, TABLES, valeurMarche,
  type NegociationEnCours, type OffreMarche, type Personne,
} from '../../engine';
import { LIBELLES_POSTES } from '../diagnostic/outils';
import { commander, ecurieJoueur, meur, nom, nomEcurie, personne, verifier, type Partie } from './partie';
import type { Navigation } from './Jeu';

const LIB_COMPETENCES: Record<string, string> = {
  freinage: 'Freinage', viragesLents: 'Virages lents', viragesRapides: 'Virages rapides', motricite: 'Motricité', depassement: 'Dépassement', defense: 'Défense',
  departs: 'Départs', pluie: 'Pluie', gestionPneus: 'Gestion des pneus', retourTechnique: 'Retour technique', condition: 'Condition physique', regularite: 'Régularité',
  intelligenceCourse: 'Intelligence de course', leadership: 'Leadership', communication: 'Communication', adaptabilite: 'Adaptabilité', gestionHumaine: 'Gestion humaine',
  negociation: 'Négociation', politique: 'Politique', relationConseil: 'Relation avec le conseil', visionTechnique: 'Vision technique', gestionProjet: 'Gestion de projet',
  organisationStands: 'Organisation des stands', strategie: 'Stratégie', reglement: 'Règlement', gestionPilotes: 'Gestion des pilotes', gestionBudgetaire: 'Gestion budgétaire',
  maitrisePlafond: 'Maîtrise du plafond', aerodynamique: 'Aérodynamique', rigueur: 'Rigueur', innovation: 'Innovation', correlation: 'Corrélation', conception: 'Conception', specialite: 'Spécialité',
};
const poste = (x: string) => (x === 'chef_stands' ? 'Chef des stands' : LIBELLES_POSTES[x] ?? x.replace(/_/g, ' '));
const age = (p: Partie, x: Personne) => p.monde.date.annee - x.anneeNaissance;

function Jauge({ libelle, v, max = 20 }: { libelle: string; v: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (v / max) * 100));
  const couleur = max === 20 ? (v >= 16 ? 'var(--purple)' : v >= 13 ? 'var(--green)' : v >= 9 ? 'var(--text)' : 'var(--yellow)') : pct >= 60 ? 'var(--green)' : pct >= 35 ? 'var(--yellow)' : '#ff8a80';
  return (
    <div class="jauge">
      <span>{libelle}</span>
      <span class="piste"><span style={{ width: `${pct}%`, background: couleur }} /></span>
      <span class="num">{Math.round(v)}</span>
    </div>
  );
}

/** Retour d'une action : motif de refus, ou ce qui s'est passé (dernier fait concernant la personne). */
function useRetour(): [string | null, (r: { ok: boolean; motif?: string }, succes?: string) => void] {
  const [msg, setMsg] = useState<string | null>(null);
  return [msg, (r, succes) => setMsg(r.ok ? succes ?? 'C’est fait.' : `Impossible : ${(r as { motif: string }).motif}`)];
}

/* ------------------------------------------------------------------ Équipe */

export function EcranEquipe({ partie, nav }: { partie: Partie; nav: Navigation }) {
  const m = partie.monde;
  const e = ecurieJoueur(m)!;
  const gens = (Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).filter((x) => x.statut === 'actif' && x.ecurie === e.id);
  const ordre = Object.keys(LIBELLES_POSTES);
  gens.sort((a, b) => ordre.indexOf(a.poste) - ordre.indexOf(b.poste) || (a.nom < b.nom ? -1 : 1));
  return (
    <div class="carte">
      <h3>Effectif de {e.nom}</h3>
      <ul class="liste-personnes">
        {gens.map((x) => {
          const c = contratEmploi(m, x.id);
          const alerte = c && (c.demandeAugmentation !== undefined || (c.demandeDepart && !c.demandeDepart.refusee) || c.fin === m.date.annee);
          return (
            <li key={x.id} onClick={() => nav.ouvrirPersonne(x.id)}>
              <div>
                <strong>{nom(x)}</strong>{x.joueur && <span class="badge">vous</span>}
                <div class="muted petit">{poste(x.poste)} · {age(partie, x)} ans{c ? ` · contrat jusqu’en ${c.fin}` : ''}</div>
              </div>
              <div class="droite">
                {!x.joueur && <span class="num">{Math.round(niveauMetier(x))}</span>}
                {alerte && <span class="point-alerte" title="Une décision vous attend" />}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ Fiche */

export function FichePersonne({ partie, id, nav, retour }: { partie: Partie; id: string; nav: Navigation; retour: () => void }) {
  const m = partie.monde;
  const x = personne(m, id);
  const e = ecurieJoueur(m)!;
  const [msg, noter] = useRetour();
  if (!x) return <div class="carte"><p>Personne introuvable.</p><button class="btn" onClick={retour}>← Retour</button></div>;
  const chezMoi = x.statut === 'actif' && x.ecurie === e.id;
  const c = contratEmploi(m, x.id);
  const est = potentielEstime(m, e.id, x);
  const agir = (type: string, prm: Record<string, unknown>, succes?: string | (() => string)) => {
    const r = commander(partie, type, { personne: x.id, ...prm });
    noter(r, typeof succes === 'function' ? succes() : succes);
    nav.rafraichir();
  };
  return (
    <>
      <button class="btn" onClick={retour}>← Retour</button>
      {msg && <div class="carte retour" role="status">{msg}</div>}
      <div class="carte">
        <h2 style={{ margin: '0 0 4px' }}>{nom(x)}</h2>
        <p class="muted">{poste(x.poste)} · {age(partie, x)} ans · {x.nationalite}{x.statut === 'actif' ? ` · ${nomEcurie(m, x.ecurie)}` : x.statut === 'libre' ? ' · libre' : ' · retraité'}</p>
        {c && <p>Contrat : {c.salaireMEUR} M€ par an, jusqu’en {c.fin}{c.clauses.statutN1 ? ' · pilote n°1' : ''}{c.nonProlonge ? ' · ne sera pas prolongé' : ''}</p>}
        {!x.joueur && <p>Niveau actuel <strong>{Math.round(niveauMetier(x))}</strong>/20 · potentiel estimé par votre écurie : <strong>{Math.round(est.centre)}</strong> ± {Math.round(est.demiLargeur)}</p>}
        {!chezMoi && <p class="muted petit">Valeur sur le marché : {meur(valeurMarche(m, x))} par an.</p>}
      </div>
      {chezMoi && !x.joueur && (
        <div class="grille">
          <div class="carte">
            <h3>État</h3>
            <Jauge libelle="Moral" v={x.etat.moral} max={100} />
            <Jauge libelle="Motivation" v={x.etat.motivation} max={100} />
            <Jauge libelle="Confiance" v={x.etat.confiance} max={100} />
            <Jauge libelle="Stress" v={100 - x.etat.stress} max={100} />
            <p class="muted petit">Stress affiché à l’envers : une barre pleine = détendu.</p>
          </div>
          <div class="carte">
            <h3>Compétences</h3>
            {Object.entries(x.competences).map(([k, v]) => <Jauge key={k} libelle={LIB_COMPETENCES[k] ?? k} v={v} />)}
          </div>
        </div>
      )}
      {chezMoi && !x.joueur && c && <ActionsEmploye partie={partie} x={x} agir={agir} />}
      {!chezMoi && x.statut !== 'retraite' && !x.joueur && <FormulaireOffre partie={partie} x={x} />}
    </>
  );
}

function ActionsEmploye({ partie, x, agir }: { partie: Partie; x: Personne; agir: (type: string, prm: Record<string, unknown>, succes?: string | (() => string)) => void }) {
  const m = partie.monde;
  const c = contratEmploi(m, x.id)!;
  const nego = (table(m, TABLE_NEGOCIATIONS) as unknown as Record<string, NegociationEnCours>)[c.id];
  const [salaire, setSalaire] = useState(String(Math.round(valeurMarche(m, x) * 10) / 10));
  const [duree, setDuree] = useState('2');
  const [publique, setPublique] = useState(false);
  const [confirmer, setConfirmer] = useState(false);
  const prolonger = (s: number, d: number, tour: number) => agir('contrat.proposer_prolongation', { salaire: s, duree: d, tour }, () => {
    const ev = Object.values(m.evenements).reverse().find((v) => v.type.startsWith('negociation.') && v.acteurs.some((a) => a.id === x.id));
    if (ev?.type === 'negociation.accord') return `${nom(x)} accepte la prolongation.`;
    if (ev?.type === 'negociation.contre_offre') return `${nom(x)} fait une contre-proposition : ${String(ev.contexte['salaireDemande'])} M€ par an.`;
    if (ev?.type === 'negociation.refus') return `${nom(x)} refuse la prolongation.`;
    if (ev?.type === 'negociation.impossible') return `Impossible : ${String(ev.contexte['motif'])}`;
    return 'Proposition faite.';
  });
  return (
    <>
      {c.demandeAugmentation !== undefined && (
        <div class="carte attention">
          <h3>Demande d’augmentation : {c.demandeAugmentation} M€ par an</h3>
          <div class="actions">
            <button class="btn principal" onClick={() => agir('contrat.repondre_augmentation', { accepter: true }, 'Augmentation accordée.')}>Accorder</button>
            <button class="btn" onClick={() => agir('contrat.repondre_augmentation', { accepter: false, justification: true }, 'Refusée, en expliquant pourquoi.')}>Refuser en expliquant</button>
            <button class="btn" onClick={() => agir('contrat.repondre_augmentation', { accepter: false }, 'Refusée.')}>Refuser</button>
          </div>
        </div>
      )}
      {c.demandeDepart && !c.demandeDepart.refusee && (
        <div class="carte attention">
          <h3>Demande de départ à l’amiable (indemnité {c.demandeDepart.indemnite} M€)</h3>
          <div class="actions">
            <button class="btn" onClick={() => agir('contrat.repondre_depart', { accepter: true }, 'Départ accepté.')}>Accepter</button>
            <button class="btn" onClick={() => agir('contrat.repondre_depart', { accepter: false }, 'Départ refusé.')}>Refuser</button>
          </div>
          <p class="muted petit">Un refus peut mener à une démission si l’envie de partir est forte.</p>
        </div>
      )}
      <div class="carte">
        <h3>Contrat</h3>
        {nego && (
          <p>Contre-proposition : <strong>{nego.salaireDemande} M€</strong> par an sur {nego.dureeAnnees} an(s).{' '}
            <button class="btn principal" onClick={() => prolonger(nego.salaireDemande, nego.dureeAnnees, 1)}>Accepter sa demande</button></p>
        )}
        <div class="ligne-champs">
          <label class="champ">Salaire (M€/an) <input class="num" inputMode="decimal" value={salaire} onInput={(v) => setSalaire((v.target as HTMLInputElement).value)} /></label>
          <label class="champ">Durée (ans) <select value={duree} onChange={(v) => setDuree((v.target as HTMLSelectElement).value)}>{[1, 2, 3, 4, 5].map((d) => <option key={d}>{d}</option>)}</select></label>
        </div>
        <div class="actions">
          <button class="btn principal" onClick={() => prolonger(Number(salaire.replace(',', '.')), Number(duree), nego ? 1 : 0)}>Proposer une prolongation</button>
          {!c.nonProlonge && <button class="btn" onClick={() => agir('contrat.ne_pas_prolonger', {}, 'Le contrat ne sera pas prolongé.')}>Ne pas prolonger</button>}
          {!confirmer ? <button class="btn danger" onClick={() => setConfirmer(true)}>Licencier…</button>
            : <button class="btn danger" onClick={() => { setConfirmer(false); agir('contrat.licencier', {}, 'Licenciement prononcé (indemnité versée).'); }}>Confirmer le licenciement</button>}
        </div>
      </div>
      <div class="carte">
        <h3>Relation</h3>
        <label class="case"><input type="checkbox" checked={publique} onChange={() => setPublique(!publique)} /> En public (devant la presse)</label>
        <div class="actions">
          <button class="btn" onClick={() => agir('personnel.soutenir', { publique }, 'Soutien exprimé.')}>Soutenir</button>
          <button class="btn" onClick={() => agir('personnel.feliciter', { publique }, 'Félicitations transmises.')}>Féliciter</button>
          <button class="btn" onClick={() => agir('personnel.critiquer', { publique }, 'Critique formulée.')}>Critiquer</button>
          <button class="btn" onClick={() => agir('personnel.discussion_privee', {}, 'Discussion en tête-à-tête.')}>Discussion privée</button>
          {x.poste === 'pilote_titulaire' && <button class="btn" onClick={() => agir('pilote.statut_n1', { accorder: !c.clauses.statutN1 }, c.clauses.statutN1 ? 'Statut de n°1 retiré.' : 'Statut de n°1 accordé.')}>{c.clauses.statutN1 ? 'Retirer le statut de n°1' : 'Accorder le statut de n°1'}</button>}
        </div>
        <p class="muted petit">Chacun s’en souviendra, à sa façon : sa personnalité, que vous ne voyez pas, décide de sa réaction.</p>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ Offre */

function FormulaireOffre({ partie, x }: { partie: Partie; x: Personne }) {
  const m = partie.monde;
  const e = ecurieJoueur(m)!;
  const postesPossibles = x.poste.startsWith('pilote') ? ['pilote_titulaire'] : POSTES_MARCHE.filter((q) => q === x.poste);
  const [msg, noter] = useRetour();
  const [salaire, setSalaire] = useState(String(Math.round(valeurMarche(m, x) * 10) / 10));
  const [duree, setDuree] = useState('2');
  const [n1, setN1] = useState(false);
  const occupants = (Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).filter((q) => q.statut === 'actif' && q.ecurie === e.id && q.poste === postesPossibles[0]);
  const [remplace, setRemplace] = useState('');
  if (!postesPossibles.length) return <div class="carte"><p class="muted">Ce poste n’est pas ouvert au marché.</p></div>;
  const prm = () => ({
    ecurie: e.id, personne: x.id, poste: postesPossibles[0], salaire: Number(salaire.replace(',', '.')), duree: Number(duree), debut: m.date.annee + 1,
    ...(postesPossibles[0] === 'pilote_titulaire' ? { statutN1: n1 } : {}), ...(remplace ? { remplace } : {}),
  });
  const v = verifier(partie, 'marche.offre', prm());
  return (
    <div class="carte">
      <h3>Faire une offre pour {m.date.annee + 1}</h3>
      {!enFenetre(m) && <p class="muted">Le marché est fermé : il ouvre en semaine 26 et ferme en semaine 48.</p>}
      <div class="ligne-champs">
        <label class="champ">Salaire (M€/an) <input class="num" inputMode="decimal" value={salaire} onInput={(z) => setSalaire((z.target as HTMLInputElement).value)} /></label>
        <label class="champ">Durée (ans) <select value={duree} onChange={(z) => setDuree((z.target as HTMLSelectElement).value)}>{[1, 2, 3, 4, 5].map((d) => <option key={d}>{d}</option>)}</select></label>
      </div>
      {postesPossibles[0] === 'pilote_titulaire' && <label class="case"><input type="checkbox" checked={n1} onChange={() => setN1(!n1)} /> Promettre le statut de pilote n°1</label>}
      {postesPossibles[0] !== 'pilote_titulaire' && occupants.length > 0 && (
        <label class="champ">Remplacer <select value={remplace} onChange={(z) => setRemplace((z.target as HTMLSelectElement).value)}>
          <option value="">— (place libre)</option>{occupants.map((o) => <option key={o.id} value={o.id}>{nom(o)}</option>)}
        </select></label>
      )}
      <div class="actions">
        <button class="btn principal" disabled={!v.ok} onClick={() => { noter(commander(partie, 'marche.offre', prm()), 'Offre envoyée : la réponse viendra dans les semaines qui suivent.'); }}>Envoyer l’offre</button>
      </div>
      {!v.ok && <p class="muted petit">{(v as { motif: string }).motif}</p>}
      {msg && <p class="retour">{msg}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ Marché */

const LIB_STATUT: Record<OffreMarche['statut'], string> = { en_attente: 'en attente', contre_offre: 'contre-proposition', acceptee: 'acceptée', refusee: 'refusée', retiree: 'retirée', expiree: 'expirée' };

export function EcranMarche({ partie, nav }: { partie: Partie; nav: Navigation }) {
  const m = partie.monde;
  const e = ecurieJoueur(m)!;
  const [filtre, setFiltre] = useState<string>('pilote_titulaire');
  const mesOffres = (Object.values(table(m, TABLES.offres)) as unknown as OffreMarche[]).filter((o) => o.ecurie === e.id);
  const pilotes = filtre === 'pilote_titulaire';
  const candidats = (Object.values(table(m, TABLES.personnes)) as unknown as Personne[])
    .filter((x) => !x.joueur && x.statut !== 'retraite' && x.ecurie !== e.id && (pilotes ? x.poste.startsWith('pilote') && (x.statut === 'actif' || (x.carriere?.saisonsF1 ?? 0) > 0 || x.poste !== 'pilote_junior' || m.date.annee - x.anneeNaissance >= 18) : x.poste === filtre))
    .map((x) => ({ x, n: niveauMetier(x) }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 40);
  return (
    <>
      <div class="carte">
        <p class="muted petit">{enFenetre(m) ? 'Le marché est ouvert jusqu’à la semaine 48. Les contrats signés prennent effet la saison suivante.' : 'Le marché est fermé (ouverture en semaine 26). Vous pouvez déjà repérer des cibles.'}</p>
        <div class="onglets">
          {POSTES_MARCHE.map((q) => <button key={q} class={`btn ${filtre === q ? 'actif' : ''}`} onClick={() => setFiltre(q)}>{poste(q)}</button>)}
        </div>
      </div>
      {mesOffres.length > 0 && (
        <div class="carte">
          <h3>Mes offres</h3>
          <p class="muted petit">Y compris celles faites par votre équipe dans les domaines que vous lui déléguez.</p>
          <ul class="liste-personnes">
            {mesOffres.map((o) => (
              <li key={o.id} onClick={() => nav.ouvrirPersonne(o.personne)}>
                <div><strong>{nom(personne(m, o.personne))}</strong><div class="muted petit">{poste(o.poste)} · {o.salaireMEUR} M€ × {o.dureeAnnees} an(s)</div></div>
                <span class={`etat-offre ${o.statut}`}>{LIB_STATUT[o.statut]}{o.salaireDemande ? ` (${o.salaireDemande} M€)` : ''}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div class="carte">
        <h3>Cibles possibles</h3>
        <ul class="liste-personnes">
          {candidats.map(({ x, n }) => {
            const c = contratEmploi(m, x.id);
            const est = potentielEstime(m, e.id, x);
            return (
              <li key={x.id} onClick={() => nav.ouvrirPersonne(x.id)}>
                <div>
                  <strong>{nom(x)}</strong>
                  <div class="muted petit">{poste(x.poste)} · {m.date.annee - x.anneeNaissance} ans · {x.statut === 'actif' ? `${nomEcurie(m, x.ecurie)}${c ? ` jusqu’en ${c.fin}` : ''}` : 'libre'}</div>
                </div>
                <div class="droite"><span class="num">{Math.round(n)}</span><span class="muted petit">pot. {Math.round(est.centre)}±{Math.round(est.demiLargeur)}</span></div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
