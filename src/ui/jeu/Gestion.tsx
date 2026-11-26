/** Phase 10 — écrans Technique, Finances, Championnat, Direction et Réglages. */
import { useState } from 'preact/hooks';
import {
  budgetMaxJoueur, candidatsPresidence, previsionFinances, coutChantier, coutImmediat, coutParPersonne, departementDe, DEPARTEMENTS_REGLABLES, niveauRecrues, type Installation, copierMonde, ecuriesActives, profilTechnique, DOMAINES_DELEGATION, equipeStands, estDelegue, federation, financesDe, plafond, programmes,
  propositions, reglementEnVigueur, serialiser, table, TABLES, type DomaineJoueur, type Monde, type Saison,
} from '../../engine';
import { DOMAINES, LISTE_DOMAINES, ORIENTATIONS, PROGRAMMES } from '../../engine/balance/technique';
import { ORIENTATIONS_STANDS } from '../../engine/balance/stands';
import { COUT_INFRASTRUCTURE, DEVELOPPEMENT_MINIMUM, INVESTISSEMENT_ANNUEL_MAX, OBJECTIF_PROPRIETAIRE } from '../../engine/balance/finances';
import { INSTALLATIONS_COUT, RECRUTEMENT_DEPARTEMENT } from '../../engine/balance/capacites';
import { enregistrer, exporter, importer } from '../../platform/navigateur/stockage';
import { commander, ecurieJoueur, mesurerAppareil, grandsPrix, meur, nom, nomCircuit, nomEcurie, personne, saisonCourante, type Partie } from './partie';
import type { Navigation } from './Jeu';
import { NOM_SAUVEGARDE } from './Jeu';
import { Sponsors } from './Sponsors';
import { CarteVoiture } from './Voiture';

const pct = (x: number) => `${Math.round(x * 100)} %`;

function useRetour(): [string | null, (r: { ok: boolean; motif?: string }, succes?: string) => void] {
  const [msg, setMsg] = useState<string | null>(null);
  return [msg, (r, succes) => setMsg(r.ok ? succes ?? 'C’est fait.' : `Impossible : ${(r as { motif: string }).motif}`)];
}

const LIB_DELEGATION: Record<DomaineJoueur, [string, string]> = {
  pilotes: ['Pilotes', 'Prolongations, marché des pilotes, réponses à leurs demandes'],
  personnel: ['Personnel', 'Recrutements, prolongations, demandes d’augmentation et de départ'],
  recherche: ['Recherche et conception', 'Programmes de recherche, projets de pièces, architecture (directeur technique)'],
  stands: ['Équipe des stands', 'Entraînement et recrutement (directeur sportif)'],
  academie: ['Académie', 'Places et missions de repérage'],
  politique: ['Politique', 'Votes du règlement et de la fédération, lobbying'],
  communication: ['Communication', 'Réponses aux questions de la presse (service de communication)'],
  commercial: ['Commercial', 'Contrats de sponsoring, objectifs de course, opérations publicitaires (directeur commercial)'],
};

function Delegation({ partie, domaine, nav }: { partie: Partie; domaine: DomaineJoueur; nav: Navigation }) {
  const e = ecurieJoueur(partie.monde)!;
  const actif = estDelegue(partie.monde, e, domaine);
  return (
    <label class="interrupteur">
      <input type="checkbox" checked={actif} disabled={domaine === 'academie' && actif} onChange={() => { commander(partie, 'joueur.deleguer', { ecurie: e.id, domaine, actif: !actif }); nav.rafraichir(); }} />
      <span><strong>{LIB_DELEGATION[domaine][0]}</strong> : {actif ? 'délégué à votre équipe' : 'vous décidez'}<br /><span class="muted petit">{LIB_DELEGATION[domaine][1]}</span></span>
    </label>
  );
}

/* ------------------------------------------------------------------ Technique */

/** D-181, levier A : effectifs des départements réglables et chantiers d'installations (commandes communes au joueur et à l'IA). */
const LIB_DEP: Record<string, string> = { aero: 'Aérodynamique', conception: 'Conception', production: 'Production', fiabilite: 'Fiabilité' };
const ROLE_DEP: Record<string, string> = { aero: 'vitesse des projets aéro', conception: 'vitesse des projets châssis et suspensions', production: 'vitesse de fabrication des pièces', fiabilite: 'pannes en course, erreurs détectées' };
const LIB_INST: Record<string, string> = { soufflerie: 'Soufflerie', cfd: 'Centre de calcul (CFD)', simulateur: 'Simulateur', bureau_etudes: 'Bureau d’études' };
function CarteCapacites({ partie, nav }: { partie: Partie; nav: Navigation }) {
  const m = partie.monde;
  const e = ecurieJoueur(m)!;
  const [msg, noter] = useRetour();
  const [dep, setDep] = useState('aero');
  const [nombre, setNombre] = useState('10');
  const [profil, setProfil] = useState('standard');
  const personnelDelegue = estDelegue(m, e, 'personnel');
  const rechercheDeleguee = estDelegue(m, e, 'recherche');
  const fi = financesDe(m, e.id);
  const insts = (Object.values(table(m, TABLES.installations)) as unknown as Installation[]).filter((i) => i.ecurie === e.id && i.type in LIB_INST);
  const chantier = fi?.projets[0];
  const agir = (t: string, prm: Record<string, unknown>, ok: string) => { noter(commander(partie, t, prm), ok); nav.rafraichir(); };
  const d = departementDe(m, e.id, dep);
  const n = Math.trunc(Number(nombre));
  return (
    <div class="carte pleine">
      <h3>Effectifs et installations</h3>
      {msg && <p class="retour">{msg}</p>}
      <div class="defile"><table class="compact">
        <thead><tr><th>Département</th><th>Effectif</th><th>Niveau</th><th>Cohésion</th><th>Agit sur</th><th>En cours</th></tr></thead>
        <tbody>{DEPARTEMENTS_REGLABLES.map((t) => {
          const x = departementDe(m, e.id, t);
          if (!x) return null;
          return <tr key={t}><td>{LIB_DEP[t]}</td><td class="num">{x.effectif}</td><td class="num">{x.niveauMoyen}</td>
            <td class="num">{x.cohesion}{x.cohesionHabituelle !== undefined && x.cohesion < x.cohesionHabituelle ? ` (habituelle ${x.cohesionHabituelle})` : ''}</td>
            <td class="muted petit">{ROLE_DEP[t]}</td>
            <td class="petit">{x.mouvement ? `${x.mouvement.nombre > 0 ? '+' : ''}${x.mouvement.nombre} en semaine ${x.mouvement.effet.semaine}` : '—'}</td></tr>;
        })}</tbody>
      </table></div>
      <Delegation partie={partie} domaine="personnel" nav={nav} />
      {!personnelDelegue && d && (
        <>
          <div class="ligne-champs">
            <label class="champ">Département <select value={dep} onChange={(v) => setDep((v.target as HTMLSelectElement).value)}>{DEPARTEMENTS_REGLABLES.map((t) => <option key={t} value={t}>{LIB_DEP[t]}</option>)}</select></label>
            <label class="champ">Personnes (négatif pour réduire) <input class="num" inputMode="numeric" value={nombre} onInput={(v) => setNombre((v.target as HTMLInputElement).value)} /></label>
            <label class="champ">Profils <select value={profil} onChange={(v) => setProfil((v.target as HTMLSelectElement).value)}><option value="standard">standard</option><option value="confirmes">confirmés (frais × {RECRUTEMENT_DEPARTEMENT.fraisConfirmes}, meilleur niveau)</option></select></label>
          </div>
          {Number.isFinite(n) && n !== 0 && <p class="muted petit">{n > 0
            ? `Arrivée dans ${RECRUTEMENT_DEPARTEMENT.delaiArriveeSemaines} semaines, niveau ${niveauRecrues(m, d, profil === 'confirmes')} ; frais ${meur(coutImmediat(d, n, profil === 'confirmes'))} puis ${meur(n * coutParPersonne(d))} de salaires par an, sous le plafond. L’intégration fait baisser la cohésion quelques mois.`
            : `Départ dans ${RECRUTEMENT_DEPARTEMENT.preavisSemaines} semaines ; indemnités ${meur(coutImmediat(d, n, false))}, sous le plafond ; la cohésion baisse.`}</p>}
          <div class="actions"><button class="btn principal" onClick={() => agir('departement.effectif', { ecurie: e.id, departement: dep, nombre: n, profil }, n > 0 ? 'Recrutement lancé.' : 'Réduction décidée.')}>{n < 0 ? 'Réduire' : 'Recruter'}</button></div>
        </>
      )}
      <h3>Installations techniques</h3>
      <p class="muted petit">Enveloppe commune de {INVESTISSEMENT_ANNUEL_MAX} M€ par an hors plafond, un chantier à la fois. L’entretien (sous le plafond) croît avec le carré du niveau, et les niveaux au-delà de {INSTALLATIONS_COUT.seuilRendement} rapportent moins.</p>
      {chantier && <p>Chantier en cours : {meur(chantier.depenseMEUR)} payés sur {meur(chantier.coutPrevuMEUR)} annoncés.</p>}
      <ul class="liste-faits">{insts.map((i) => (
        <li key={i.id}><strong>{LIB_INST[i.type]}</strong> : niveau {i.niveau}, {i.ageAnnees} ans, état {Math.round(i.etat)} %
          {!rechercheDeleguee && !chantier && <>
            {i.niveau < 10 && <> <button class="btn" onClick={() => agir('infrastructure.lancer', { ecurie: e.id, installation: i.id, nature: 'amelioration' }, 'Chantier lancé.')}>Agrandir ({meur(coutChantier(i, 'amelioration'))})</button></>}
            {i.ageAnnees >= COUT_INFRASTRUCTURE.ageMinRenovation && <> <button class="btn" onClick={() => agir('infrastructure.lancer', { ecurie: e.id, installation: i.id, nature: 'renovation' }, 'Chantier lancé.')}>Rénover ({meur(coutChantier(i, 'renovation'))})</button></>}
          </>}</li>
      ))}</ul>
      {rechercheDeleguee && <p class="muted petit">Recherche déléguée : votre directeur technique choisit aussi les chantiers.</p>}
    </div>
  );
}

export function EcranTechnique({ partie, nav }: { partie: Partie; nav: Navigation }) {
  const m = partie.monde;
  const e = ecurieJoueur(m)!;
  const [msg, noter] = useRetour();
  const actuel = reglementEnVigueur(m);
  const profil = profilTechnique(m, e.id); // lecture seule
  const nbEcuries = ecuriesActives(m).length;
  const progs = programmes(m, e.id);
  const eq = equipeStands(m, e.id);
  const deleguee = estDelegue(m, e, 'recherche');
  const [emplacement, setEmplacement] = useState(1);
  const [domaine, setDomaine] = useState<string>(LISTE_DOMAINES[0]!);
  const [horizon, setHorizon] = useState('actuelle');
  const [part, setPart] = useState('0.2');
  const futurs = (Object.values(table(m, TABLES.reglements)) as unknown as { id: string; statut: string; orientation: string; debut: number; connuPar?: string[] }[])
    .filter((r) => r.statut === 'propose' || r.statut === 'annonce' || (r.statut === 'brouillon' && (r.connuPar ?? []).includes(e.id)));
  return (
    <>
      {msg && <div class="carte retour" role="status">{msg}</div>}
      <CarteVoiture partie={partie} nav={nav} />
      <CarteCapacites partie={partie} nav={nav} />
      <div class="carte">
        <h3>Savoir technique</h3>
        <p class="muted petit">Règlement en vigueur : {actuel ? `${ORIENTATIONS[actuel.orientation as keyof typeof ORIENTATIONS]?.libelle ?? 'règlement de départ'}, jusqu’en ${actuel.fin}` : '—'}.</p>
        <p class="muted petit">Votre rang parmi les {nbEcuries} écuries, domaine par domaine (savoir utile au règlement en vigueur ou annoncé).</p>
        <ul class="liste-faits">
          {profil.map((d) => <li key={d.domaine} class="ligne-rang"><span>{d.libelle}</span><span class={`num rang ${d.rang <= 3 ? 'bon' : d.rang > nbEcuries - 3 ? 'faible' : ''}`}>{d.rang}<sup>{d.rang === 1 ? 'er' : 'e'}</sup></span></li>)}
        </ul>
      </div>
      <div class="carte">
        <h3>Programmes de recherche</h3>
        <Delegation partie={partie} domaine="recherche" nav={nav} />
        {progs.length === 0 && <p class="muted">Aucun programme.</p>}
        <ul class="liste-faits">
          {progs.map((p) => <li key={p.id}>Emplacement {p.emplacement} : <strong>{DOMAINES[p.domaine as keyof typeof DOMAINES]?.libelle ?? p.domaine}</strong>, horizon {p.horizon === 'actuelle' ? 'voiture actuelle' : p.horizon === 'suivante' ? 'saison suivante' : 'futur règlement'}, {pct(p.part)} des moyens{p.statut === 'suspendu' ? ' (suspendu)' : ''}{p.remiseEnRoute > 0 ? `, remise en route ${p.remiseEnRoute} sem.` : ''}</li>)}
        </ul>
        {!deleguee && (
          <>
            <div class="ligne-champs">
              <label class="champ">Emplacement <select value={emplacement} onChange={(v) => setEmplacement(Number((v.target as HTMLSelectElement).value))}>{Array.from({ length: PROGRAMMES.emplacements }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select></label>
              <label class="champ">Domaine <select value={domaine} onChange={(v) => setDomaine((v.target as HTMLSelectElement).value)}>{LISTE_DOMAINES.map((d) => <option key={d} value={d}>{DOMAINES[d].libelle}</option>)}</select></label>
              <label class="champ">Horizon <select value={horizon} onChange={(v) => setHorizon((v.target as HTMLSelectElement).value)}>
                <option value="actuelle">Voiture actuelle</option><option value="suivante">Saison suivante</option>
                {futurs.map((r) => <option key={r.id} value={r.id}>Règlement {ORIENTATIONS[r.orientation as keyof typeof ORIENTATIONS]?.libelle ?? r.orientation} ({r.statut === 'brouillon' ? 'rumeur' : r.statut})</option>)}
              </select></label>
              <label class="champ">Part des moyens <select value={part} onChange={(v) => setPart((v.target as HTMLSelectElement).value)}>{[0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35].map((x) => <option key={x} value={String(x)}>{pct(x)}</option>)}</select></label>
            </div>
            <div class="actions">
              <button class="btn principal" onClick={() => { noter(commander(partie, 'recherche.programme', { ecurie: e.id, emplacement, domaine, horizon, part: Number(part) }), 'Programme défini.'); nav.rafraichir(); }}>Définir le programme</button>
              <button class="btn" onClick={() => { noter(commander(partie, 'recherche.suspendre', { ecurie: e.id, emplacement }), 'Programme suspendu.'); nav.rafraichir(); }}>Suspendre</button>
            </div>
            <p class="muted petit">La recherche prend sur les moyens de développement de la voiture actuelle ({pct(PROGRAMMES.partTotaleMax)} au plus). Changer de domaine impose une remise en route.</p>
          </>
        )}
      </div>
      <div class="carte">
        <h3>Équipe des stands</h3>
        <Delegation partie={partie} domaine="stands" nav={nav} />
        {eq ? (
          <>
            <p>Rapidité <strong>{Math.round(eq.rapidite)}</strong>/{Math.round(eq.rapiditeMax)} · précision <strong>{Math.round(eq.precision)}</strong>/{Math.round(eq.precisionMax)} · cohésion {Math.round(eq.cohesion)} · fatigue {Math.round(eq.fatigue)}</p>
            <p class="muted petit">Plan : {eq.plan.orientation}, intensité {eq.plan.intensite}. Les arrêts aux stands compteront en course à partir de la phase 13.</p>
            {!estDelegue(m, e, 'stands') && (
              <div class="actions">
                {ORIENTATIONS_STANDS.map((o) => (['legere', 'normale', 'intensive'] as const).map((i) => (
                  <button key={o + i} class={`btn ${eq.plan.orientation === o && eq.plan.intensite === i ? 'actif' : ''}`} onClick={() => { noter(commander(partie, 'stands.plan', { ecurie: e.id, orientation: o, intensite: i }), 'Plan d’entraînement modifié.'); nav.rafraichir(); }}>{o} · {i}</button>
                )))}
              </div>
            )}
          </>
        ) : <p class="muted">L’équipe des stands sera constituée dans les prochaines semaines.</p>}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ Finances */

/** D-180, levier B : tableau de bord prévisionnel (fonction pure du moteur ; imprévus non compris). */
const NOMS_PROPRIETAIRES: Record<string, string> = { constructeur: 'le constructeur', milliardaire: 'le milliardaire', fonds: "le fonds d'investissement", famille: 'la famille propriétaire', consortium: 'le consortium' };
function Previsions({ m, ecurie }: { m: Monde; ecurie: string }) {
  const p = previsionFinances(m, ecurie);
  if (!p || p.periodesRestantes === 0) return <div class="carte"><h3>Prévisions</h3><p class="muted">Les prévisions s’affichent dès que le budget de l’année est établi (après la première semaine).</p></div>;
  const t = p.tresorerie, s = p.saisonSuivante;
  return (
    <div class={`carte pleine ${p.alertes.length ? 'attention' : ''}`}>
      <h3>Prévisions {p.annee}</h3>
      {p.alertes.length > 0 && <ul>{p.alertes.map((a) => <li key={a}>{a}</li>)}</ul>}
      <div class="defile"><table class="compact">
        <thead><tr><th>Trésorerie</th><th>Maintenant</th><th>Dans 4 semaines</th><th>Fin de saison</th><th>Après dividendes</th></tr></thead>
        <tbody><tr><td /><td class="num">{meur(t.maintenant)}</td><td class="num">{meur(t.dansQuatreSemaines)}</td><td class="num">{meur(t.finAvantDividendes)}</td><td class="num">{meur(t.finApresDividendes)}</td></tr></tbody>
      </table></div>
      <p><strong>Recettes restantes</strong> {meur(p.recettes.garanties)} garanties (primes {meur(p.recettes.primes)}, droits {meur(p.recettes.droits)}, sponsors {meur(p.recettes.sponsors)}, propriétaire {meur(p.recettes.apport)})
        {' '}+ {meur(p.recettes.primesSponsorsProbables)} de primes de sponsors probables<span class="muted"> (jusqu'à {meur(p.recettes.conditionnelles)} de plus si tout réussit)</span></p>
      <p><strong>Dépenses restantes</strong> {meur(p.depenses.total)} : sous le plafond {meur(p.depenses.plafonneesFixes)} de frais fixes et {meur(p.depenses.developpement)} de développement ; hors plafond {meur(p.depenses.horsPlafond)}{p.depenses.chantiers > 0 ? `, chantiers ${meur(p.depenses.chantiers)}` : ''}{p.depenses.interets > 0 ? `, intérêts ${meur(p.depenses.interets)}` : ''}</p>
      <p><strong>Plafond</strong> {meur(p.plafond.montant)} : déjà dépensé {meur(p.plafond.depense)}, à venir {meur(p.plafond.aVenir)}, <strong>marge {meur(p.plafond.marge)}</strong></p>
      <p><strong>Développement</strong> budget {meur(p.developpement.budget)}, dépense prévue sur l'année {meur(p.developpement.payePrevu)}
        {p.developpement.fiable && p.developpement.nonDepensable > 0 ? <span> · <strong>{meur(p.developpement.nonDepensable)} non dépensés</strong> au rythme actuel des projets</span> : null}</p>
      {p.dividendes.montant > 0 && <p><strong>Dividendes</strong> au bilan, {NOMS_PROPRIETAIRES[p.dividendes.typeProprietaire] ?? 'le propriétaire'} prélèvera environ {meur(p.dividendes.montant)} ({Math.round(100 * p.dividendes.part)} % de ce qui dépasse {meur(p.dividendes.seuil)})</p>}
      <p><strong>Saison suivante</strong> primes du championnat à la {s.placeActuelle}e place : {meur(s.primesALaPlace)}{s.gainUnePlace > 0 ? ` (une place de mieux : + ${meur(s.gainUnePlace)})` : ''}
        {s.sponsorsQuiFinissent > 0 ? ` · ${s.sponsorsQuiFinissent} contrat${s.sponsorsQuiFinissent > 1 ? 's' : ''} de sponsor se termine${s.sponsorsQuiFinissent > 1 ? 'nt' : ''} (${meur(s.sponsorsMontantPerdu)} par an)` : ''}
        {s.contratsQuiFinissent > 0 ? ` · ${s.contratsQuiFinissent} contrat${s.contratsQuiFinissent > 1 ? 's' : ''} de personnel à renouveler (${meur(s.salairesLiberes)} de salaires)` : ''}</p>
      <p class="muted petit">Au niveau actuel des recettes et des dépenses, selon les règles du jeu. Non compris : un retrait du propriétaire non annoncé, un emprunt, les imprévus de course et de chantier.</p>
    </div>
  );
}

export function EcranFinances({ partie, nav }: { partie: Partie; nav: Navigation }) {
  const m = partie.monde;
  const e = ecurieJoueur(m)!;
  const fi = financesDe(m, e.id);
  const [msg, noter] = useRetour();
  const [montant, setMontant] = useState(fi ? String(Math.round(fi.budget.developpementMEUR)) : '');
  if (!fi) return <div class="carte">Comptes indisponibles.</div>;
  const c = fi.comptes;
  const recettes = c.primes + c.commercial + c.apport + c.sponsors;
  const plafonnees = c.personnelPlafonne + c.departements + c.operations + c.entretien + c.developpement;
  return (
    <>
      {msg && <div class="carte retour" role="status">{msg}</div>}
      <div class="carte">
        <h3>Situation</h3>
        <p>Trésorerie <strong>{meur(fi.tresorerieMEUR)}</strong>{fi.detteMEUR > 0 ? ` · dette ${meur(fi.detteMEUR)}` : ''} · état : {fi.etatCrise === 'sain' ? 'sain' : fi.etatCrise}</p>
        <p>Plafond budgétaire {meur(plafond(m))} · dépenses plafonnées depuis janvier {meur(plafonnees)}</p>
        <p class="muted">Recettes depuis janvier {meur(recettes)} (primes {meur(c.primes)}, commercial {meur(c.commercial)}, sponsors {meur(c.sponsors)}, propriétaire {meur(c.apport)})</p>
        {/* D-179 : objectif du propriétaire de la saison, et bonus d'apport gagné l'an dernier. */}
        {fi.objectifProprietaire?.annee === m.date.annee && (
          <p>Objectif du propriétaire : <strong>{fi.objectifProprietaire.place === 1 ? 'le titre constructeurs' : `${fi.objectifProprietaire.place}e place ou mieux`}</strong>
            <span class="muted petit"> · atteint, il augmente son apport de {Math.round(100 * OBJECTIF_PROPRIETAIRE.bonusApport)} % la saison suivante</span></p>
        )}
        {fi.bonusApport?.annee === m.date.annee && <p class="retour">Objectif de l'an dernier atteint : apport du propriétaire majoré de {Math.round(100 * (fi.bonusApport.facteur - 1))} % cette saison.</p>}
      </div>
      <Previsions m={m} ecurie={e.id} />
      <Sponsors partie={partie} nav={nav} />
      <div class="carte">
        <h3>Budget de développement {m.date.annee}</h3>
        <p>Actuel : <strong>{meur(fi.budget.developpementMEUR)}</strong> ({fi.budget.strategie === 'choix_du_team_principal' ? 'fixé par vous' : 'proposé par la direction financière'})</p>
        <label class="champ">Nouveau montant (M€/an, {DEVELOPPEMENT_MINIMUM} à {budgetMaxJoueur(m)})
          <input class="num" inputMode="decimal" value={montant} onInput={(v) => setMontant((v.target as HTMLInputElement).value)} />
        </label>
        <div class="actions"><button class="btn principal" onClick={() => { noter(commander(partie, 'budget.developpement', { ecurie: e.id, montant: Number(montant.replace(',', '.')) }), 'Budget modifié pour le reste de l’année.'); nav.rafraichir(); }}>Appliquer</button></div>
        <p class="muted petit">Plus de développement = une voiture qui progresse plus vite, mais une trésorerie qui baisse. La voiture progresse selon l’argent réellement payé : un changement agit dès l’écriture comptable suivante (toutes les 4 semaines), et vous pouvez le modifier à tout moment. Si la trésorerie de fin d’année devient négative, la direction financière coupe le développement (même règle que pour l’IA). Dépasser le plafond expose aux sanctions. Le budget est reproposé chaque mois de janvier.</p>
      </div>
      <div class="carte">
        <h3>Années précédentes</h3>
        {fi.historique.length === 0 ? <p class="muted">Aucun bilan pour l’instant.</p> : (
          <div class="defile"><table class="compact"><thead><tr><th>Année</th><th>Trésorerie fin</th><th>Plafonnées</th><th>Dépassement</th></tr></thead>
            <tbody>{fi.historique.slice(-5).reverse().map((h) => <tr key={h.annee}><td>{h.annee}</td><td class="num">{meur(h.tresorerieFin)}</td><td class="num">{meur(h.plafonnees)}</td><td class="num">{h.depassement > 0 ? meur(h.depassement) : '—'}</td></tr>)}</tbody>
          </table></div>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ Championnat */

export function EcranChampionnat({ partie }: { partie: Partie }) {
  const m = partie.monde;
  const e = ecurieJoueur(m)!;
  const [vue, setVue] = useState<'pilotes' | 'constructeurs' | 'calendrier'>('constructeurs');
  const s: Saison | undefined = saisonCourante(m) ?? (table(m, TABLES.saisons)[`ssn_${m.date.annee - 1}`] as unknown as Saison | undefined);
  const gps = grandsPrix(m, s?.annee ?? m.date.annee);
  return (
    <>
      <div class="onglets">
        {(['constructeurs', 'pilotes', 'calendrier'] as const).map((v) => <button key={v} class={`btn ${vue === v ? 'actif' : ''}`} onClick={() => setVue(v)}>{v === 'calendrier' ? 'Calendrier' : v === 'pilotes' ? 'Pilotes' : 'Constructeurs'}</button>)}
      </div>
      <div class="carte">
        {!s ? <p class="muted">Pas encore de classement.</p> : vue === 'constructeurs' ? (
          <div class="defile"><table class="compact"><thead><tr><th>#</th><th>Écurie</th><th>Pts</th><th>V.</th></tr></thead>
            <tbody>{s.constructeurs.map((l, i) => <tr key={l.ecurie} class={l.ecurie === e.id ? 'moi' : ''}><td>{i + 1}</td><td>{nomEcurie(m, l.ecurie)}</td><td class="num">{l.points}</td><td class="num">{l.victoires}</td></tr>)}</tbody>
          </table></div>
        ) : vue === 'pilotes' ? (
          <div class="defile"><table class="compact"><thead><tr><th>#</th><th>Pilote</th><th>Pts</th><th>V.</th></tr></thead>
            <tbody>{s.pilotes.map((l, i) => <tr key={l.pilote} class={l.ecurie === e.id ? 'moi' : ''}><td>{i + 1}</td><td>{nom(personne(m, l.pilote))}<div class="muted petit">{nomEcurie(m, l.ecurie)}</div></td><td class="num">{l.points}</td><td class="num">{l.victoires}</td></tr>)}</tbody>
          </table></div>
        ) : (
          <ul class="liste-faits">
            {gps.map((g) => {
              const v = g.resultats.find((r) => r.position === 1);
              const miens = g.resultats.filter((r) => r.ecurie === e.id).map((r) => (r.position ? `P${r.position}` : 'abandon')).join(', ');
              return <li key={g.id}><strong>{g.manche}. {nomCircuit(m, g.circuit)}</strong> <span class="muted">sem. {g.semaine}{g.pluie ? ' · pluie' : ''}</span>{g.termine ? <div class="muted petit">Vainqueur {nom(personne(m, v?.pilote ?? ''))} · vos pilotes : {miens || '—'}</div> : null}</li>;
            })}
          </ul>
        )}
      </div>
      {s?.termine && s.chronique.length > 0 && <div class="carte"><h3>Chronique {s.annee}</h3><ul>{s.chronique.map((l) => <li key={l}>{l}</li>)}</ul></div>}
    </>
  );
}

/* ------------------------------------------------------------------ Direction */

export function EcranDirection({ partie, nav }: { partie: Partie; nav: Navigation }) {
  const m = partie.monde;
  const e = ecurieJoueur(m)!;
  const [msg, noter] = useRetour();
  const props = propositions(m);
  const f = federation(m);
  const politiqueMoi = !estDelegue(m, e, 'politique');
  const election = f && m.date.annee === f.finMandat ? candidatsPresidence(m) : [];
  const [orientation, setOrientation] = useState<string>('aero');
  const [montant, setMontant] = useState('1');
  return (
    <>
      {msg && <div class="carte retour" role="status">{msg}</div>}
      <div class="carte">
        <h3>Délégations</h3>
        <p class="muted petit">Un domaine délégué est décidé par votre équipe, avec exactement les règles des écuries de l’IA. Vous pouvez reprendre la main à tout moment.</p>
        {DOMAINES_DELEGATION.map((d) => <Delegation key={d} partie={partie} domaine={d} nav={nav} />)}
      </div>
      <div class="carte">
        <h3>Fédération</h3>
        <p>Président : {f?.nomPresident ?? '—'}{f ? `, mandat jusqu’en ${f.finMandat}` : ''}</p>
        {!politiqueMoi && <p class="muted petit">Politique déléguée : votre écurie vote selon ses intérêts.</p>}
        {politiqueMoi && props.length > 0 && (
          <>
            <h4>Vote sur le prochain règlement</h4>
            <div class="actions">
              <button class={`btn ${props[0]!.votes?.[e.id] === 'prolongation' ? 'actif' : ''}`} onClick={() => { noter(commander(partie, 'reglement.vote', { ecurie: e.id, option: 'prolongation' }), 'Vote enregistré.'); nav.rafraichir(); }}>Prolonger le règlement actuel</button>
              {props.map((r) => <button key={r.id} class={`btn ${props[0]!.votes?.[e.id] === r.id ? 'actif' : ''}`} onClick={() => { noter(commander(partie, 'reglement.vote', { ecurie: e.id, option: r.id }), 'Vote enregistré.'); nav.rafraichir(); }}>{ORIENTATIONS[r.orientation as keyof typeof ORIENTATIONS]?.libelle ?? r.orientation} ({r.debut})</button>)}
            </div>
          </>
        )}
        {politiqueMoi && election.length > 1 && (
          <>
            <h4>Élection à la présidence</h4>
            <div class="actions">{election.map((c) => <button key={c.id} class={`btn ${f?.election?.votes[e.id] === c.id ? 'actif' : ''}`} onClick={() => { noter(commander(partie, 'federation.vote', { ecurie: e.id, candidat: c.id }), 'Vote enregistré.'); nav.rafraichir(); }}>{nom(c)}</button>)}</div>
          </>
        )}
        {politiqueMoi && f?.vote && f.vote.annee === m.date.annee && (
          <>
            <h4>Vote : {f.vote.sujet === 'plafondMEUR' ? 'plafond budgétaire' : f.vote.sujet === 'grandsPrix' ? 'nombre de Grands Prix' : 'restrictions aérodynamiques'} → {f.vote.valeur}</h4>
            <div class="actions">
              <button class={`btn ${f.vote.votes[e.id] === true ? 'actif' : ''}`} onClick={() => { noter(commander(partie, 'federation.vote', { ecurie: e.id, pour: true }), 'Vote enregistré.'); nav.rafraichir(); }}>Pour</button>
              <button class={`btn ${f.vote.votes[e.id] === false ? 'actif' : ''}`} onClick={() => { noter(commander(partie, 'federation.vote', { ecurie: e.id, pour: false }), 'Vote enregistré.'); nav.rafraichir(); }}>Contre</button>
            </div>
          </>
        )}
        {politiqueMoi && (
          <>
            <h4>Lobbying</h4>
            <div class="ligne-champs">
              <label class="champ">Orientation <select value={orientation} onChange={(v) => setOrientation((v.target as HTMLSelectElement).value)}>{Object.entries(ORIENTATIONS).map(([k, o]) => <option key={k} value={k}>{o.libelle}</option>)}</select></label>
              <label class="champ">Montant (M€) <input class="num" inputMode="decimal" value={montant} onInput={(v) => setMontant((v.target as HTMLInputElement).value)} /></label>
            </div>
            <div class="actions"><button class="btn" onClick={() => { noter(commander(partie, 'politique.lobbying', { ecurie: e.id, orientation, montant: Number(montant.replace(',', '.')) }), 'Pression exercée auprès de la fédération.'); nav.rafraichir(); }}>Faire pression</button></div>
            <p class="muted petit">Le lobbying rend une orientation plus probable parmi les prochaines propositions ; il ne change jamais le décompte des voix.</p>
          </>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ Réglages et mesure */

export function EcranReglages({ partie, nav, quitter, remplacer }: { partie: Partie; nav: Navigation; quitter: () => void; remplacer: (m: Monde) => void }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [importe, setImporte] = useState<Monde | null>(null);
  /** Audit de la phase 10 : import d'une sauvegarde téléchargée (format vérifié et migré par le moteur), avec confirmation. */
  const lireFichier = async (f: File | undefined) => {
    setImporte(null);
    if (!f) return;
    try {
      const m = await importer(f);
      if (!m.joueur) { setMsg('Ce fichier ne contient pas de partie de joueur.'); return; }
      setImporte(m);
      setMsg(null);
    } catch (x) {
      setMsg(`Fichier refusé : ${x instanceof Error ? x.message : String(x)}`);
    }
  };
  const [mesure, setMesure] = useState<string | null>(null);
  const sauver = async () => {
    try { const o = await enregistrer(NOM_SAUVEGARDE, partie.monde); setMsg(`Partie sauvegardée (${Math.round(o / 1024)} Ko compressés).`); } catch (x) { setMsg(`Échec de la sauvegarde : ${String(x)}`); }
  };
  const telecharger = async () => {
    const blob = await exporter(partie.monde);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `partie-${partie.monde.date.annee}-s${partie.monde.date.semaine}.sav`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  /** Page de mesure (D-110) : temps de calcul sur une copie du monde, sans toucher à la partie. */
  const mesurer = async (semaines: number) => { setMesure('Mesure en cours…'); setMesure(await mesurerAppareil(partie, semaines)); };
  return (
    <>
      <div class="carte">
        <h3>Partie</h3>
        <p class="muted petit">Sauvegarde automatique à chaque fin de saison. Graine {partie.monde.graine}.</p>
        <div class="actions">
          <button class="btn principal" onClick={sauver}>Sauvegarder</button>
          <button class="btn" onClick={telecharger}>Télécharger la sauvegarde</button>
          <button class="btn" onClick={quitter}>Quitter vers l’accueil</button>
          <a class="btn" href="#diagnostic">Diagnostic</a>
        </div>
        {msg && <p class="retour">{msg}</p>}
      </div>
      <div class="carte">
        <h3>Importer une sauvegarde</h3>
        <p class="muted petit">Un fichier .sav téléchargé depuis ce jeu. Il est vérifié (et mis au format actuel) avant tout remplacement.</p>
        <input type="file" accept=".sav" aria-label="Fichier de sauvegarde" onChange={(e) => void lireFichier((e.target as HTMLInputElement).files?.[0])} />
        {importe && (
          <div class="carte attention">
            <p>Partie trouvée : <strong>{nomEcurie(importe, importe.joueur!.ecurie)}</strong>, {importe.date.annee}, semaine {importe.date.semaine}.</p>
            <p class="muted petit">La partie en cours sera remplacée à l’écran. Sa dernière sauvegarde reste en place tant que vous ne sauvegardez pas.</p>
            <div class="actions">
              <button class="btn principal" onClick={() => { remplacer(importe); setImporte(null); }}>Remplacer la partie en cours</button>
              <button class="btn" onClick={() => setImporte(null)}>Annuler</button>
            </div>
          </div>
        )}
      </div>
      <div class="carte">
        <h3>Mesure des performances</h3>
        <p class="muted petit">Simule des semaines sur une copie du monde (la partie n’avance pas) et mesure le temps de calcul de cet appareil.</p>
        <div class="actions">
          <button class="btn" onClick={() => mesurer(8)}>8 semaines</button>
          <button class="btn" onClick={() => mesurer(52)}>Une saison</button>
        </div>
        {mesure && <p class="num petit">{mesure}</p>}
      </div>
      <div class="carte">
        <h3>À propos</h3>
        <p class="muted petit">Phase 10 : premiers écrans du joueur. Pas encore de course en direct (phase 13), de conception de voiture (phase 12) ni de médias (phase 11). Écurie dirigée : {nomEcurie(partie.monde, partie.monde.joueur!.ecurie)}.</p>
        <button class="btn" onClick={() => nav.aller('tableau')}>Retour à l’accueil</button>
      </div>
    </>
  );
}
