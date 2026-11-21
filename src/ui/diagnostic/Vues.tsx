import { useMemo, useState } from 'preact/hooks';
import { SEUIL_CONVICTION, TRAITS, VALEURS, ASPIRATIONS } from '../../engine/balance/personnages';
import type { Carriere, Circuit, Departement, Installation, Monde, Palmares, Personne } from '../../engine';
import {
  age, Barre, Carte, contrats, ecuries, LIBELLES_POSTES, Lien, liste, nomComplet, Note, ORDRE_POSTES, personnes,
} from './outils';

export type Selection = { type: 'ecurie' | 'personne'; id: string } | null;
type Ouvrir = (s: Selection) => void;

const LIBELLE_INSTALLATION: Record<string, string> = {
  soufflerie: 'Soufflerie', cfd: 'Centre CFD', simulateur: 'Simulateur', bureau_etudes: "Bureau d'études",
  usine: 'Usine', centre_recherche: 'Centre de recherche', centre_formation: 'Centre de formation', installations_personnel: 'Installations du personnel',
};

/* ---------------- Écuries ---------------- */

export function ListeEcuries({ monde, ouvrir }: { monde: Monde; ouvrir: Ouvrir }) {
  const eqs = ecuries(monde).sort((a, b) => b.niveauVoiture - a.niveauVoiture || a.nom.localeCompare(b.nom));
  const mot = (id: string) => (monde.tables['motoristes']?.[id] as { nom: string } | undefined)?.nom ?? id;
  return (
    <div class="defile">
      <table>
        <thead><tr><th>Écurie</th><th>Nat.</th><th>Motoriste</th><th>Voiture</th><th>Budget (M€)</th><th>Prestige</th><th>Titres C / P</th></tr></thead>
        <tbody>
          {eqs.map((e) => (
            <tr class="cliquable" key={e.id} onClick={() => ouvrir({ type: 'ecurie', id: e.id })}>
              <td><b>{e.nom}</b></td><td>{e.nationalite}</td><td>{mot(e.motoriste)}</td>
              <td><Note v={e.niveauVoiture} /></td><td class="num">{e.budgetMEUR}</td><td><Note v={e.prestige} /></td>
              <td class="num">{e.titresConstructeurs} / {e.titresPilotes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FicheEcurie({ monde, id, ouvrir }: { monde: Monde; id: string; ouvrir: Ouvrir }) {
  const e = ecuries(monde).find((x) => x.id === id);
  if (!e) return <p class="erreur">Écurie introuvable.</p>;
  const equipe = personnes(monde)
    .filter((p) => p.ecurie === id && p.statut === 'actif')
    .sort((a, b) => ORDRE_POSTES.indexOf(a.poste) - ORDRE_POSTES.indexOf(b.poste));
  const ctr = new Map(contrats(monde).filter((c) => c.statut === 'actif').map((c) => [c.personne, c]));
  const deps = liste<Departement>(monde, 'departements').filter((d) => d.ecurie === id);
  const inst = liste<Installation>(monde, 'installations').filter((i) => i.ecurie === id);
  const masse = equipe.reduce((s, p) => s + (ctr.get(p.id)?.salaireMEUR ?? 0), 0);
  const mot = (monde.tables['motoristes']?.[e.motoriste] as { nom: string } | undefined)?.nom ?? e.motoriste;
  return (
    <>
      <Carte titre={e.nom}>
        <div class="grille">
          <div><span class="muted">Nationalité</span><br />{e.nationalite}</div>
          <div><span class="muted">Lignée depuis</span><br />{e.anneeCreationLignee} (nom actuel : {e.anneeNomActuel})</div>
          <div><span class="muted">Motoriste</span><br />{mot}</div>
          <div><span class="muted">Budget</span><br /><span class="num">{e.budgetMEUR} M€</span></div>
          <div><span class="muted">Masse salariale (postes clés)</span><br /><span class="num">{masse.toFixed(1)} M€</span></div>
          <div><span class="muted">Titres constructeurs / pilotes</span><br /><span class="num">{e.titresConstructeurs} / {e.titresPilotes}</span></div>
        </div>
        <Barre libelle="Niveau voiture" v={e.niveauVoiture} />
        <Barre libelle="Prestige" v={e.prestige} />
        <Barre libelle="Popularité" v={e.popularite} />
        <Barre libelle="Pression médiatique" v={e.pressionMediatique} />
        <Barre libelle="Tolérance du conseil" v={e.toleranceConseil} />
        <p><span class="muted">Culture :</span> {e.culture}<br /><span class="muted">Philosophie technique :</span> {e.philosophieTechnique}<br /><span class="muted">Recrutement :</span> {e.politiqueRecrutement}</p>
        <p class="muted" style={{ fontSize: '.85rem' }}>Vérification des données : {e.verification || '—'}</p>
      </Carte>
      <Carte titre="Personnel individualisé">
        <div class="defile">
          <table>
            <thead><tr><th>Poste</th><th>Nom</th><th>Âge</th><th>Contrat</th><th>Origine</th></tr></thead>
            <tbody>
              {equipe.map((p) => {
                const c = ctr.get(p.id);
                return (
                  <tr class="cliquable" key={p.id} onClick={() => ouvrir({ type: 'personne', id: p.id })}>
                    <td>{LIBELLES_POSTES[p.poste]}</td><td><b>{nomComplet(p)}</b> <span class="muted">{p.nationalite}</span></td>
                    <td class="num">{age(monde, p)}</td>
                    <td class="num">{c ? `${c.fin} · ${c.salaireMEUR} M€` : '—'}</td>
                    <td class="muted">{p.origine === 'donnees' ? 'données' : 'générée'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Carte>
      <Carte titre="Installations (niveau 1–10)">
        {inst.map((i) => <Barre key={i.id} libelle={LIBELLE_INSTALLATION[i.type] ?? i.type} v={i.niveau} max={10} />)}
      </Carte>
      <Carte titre="Départements">
        <div class="defile">
          <table>
            <thead><tr><th>Département</th><th>Effectif</th><th>Niveau</th><th>Cohésion</th><th>Responsable</th></tr></thead>
            <tbody>
              {deps.map((d) => {
                const resp = personnes(monde).find((p) => p.id === d.responsable);
                return (
                  <tr key={d.id}>
                    <td>{d.type}</td><td class="num">{d.effectif}</td><td><Note v={d.niveauMoyen} /></td><td><Note v={d.cohesion} /></td>
                    <td>{resp ? <Lien onClick={() => ouvrir({ type: 'personne', id: resp.id })}>{nomComplet(resp)}</Lien> : <span class="muted">—</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Carte>
    </>
  );
}

/* ---------------- Personnes ---------------- */

export function ListePersonnes({ monde, ouvrir }: { monde: Monde; ouvrir: Ouvrir }) {
  const [poste, setPoste] = useState('');
  const [ecurie, setEcurie] = useState('');
  const [statut, setStatut] = useState('actif');
  const [texte, setTexte] = useState('');
  const nomsEq = new Map(ecuries(monde).map((e) => [e.id, e.nom]));
  const resultat = useMemo(
    () =>
      personnes(monde)
        .filter((p) => (!poste || p.poste === poste) && (!ecurie || p.ecurie === ecurie) && (!statut || p.statut === statut))
        .filter((p) => !texte || nomComplet(p).toLowerCase().includes(texte.toLowerCase()))
        .sort((a, b) => ORDRE_POSTES.indexOf(a.poste) - ORDRE_POSTES.indexOf(b.poste) || a.nom.localeCompare(b.nom)),
    [monde, poste, ecurie, statut, texte],
  );
  return (
    <>
      <div class="onglets">
        <input placeholder="Rechercher un nom" value={texte} onInput={(e) => setTexte((e.target as HTMLInputElement).value)} />
        <select value={poste} onChange={(e) => setPoste((e.target as HTMLSelectElement).value)}>
          <option value="">Tous les postes</option>
          {ORDRE_POSTES.map((p) => <option value={p} key={p}>{LIBELLES_POSTES[p]}</option>)}
        </select>
        <select value={ecurie} onChange={(e) => setEcurie((e.target as HTMLSelectElement).value)}>
          <option value="">Toutes les écuries</option>
          {[...nomsEq].map(([id, nom]) => <option value={id} key={id}>{nom}</option>)}
        </select>
        <select value={statut} onChange={(e) => setStatut((e.target as HTMLSelectElement).value)}>
          <option value="">Tous statuts</option><option value="actif">Actifs</option><option value="libre">Libres</option><option value="retraite">Retraités</option>
        </select>
        <span class="muted" style={{ alignSelf: 'center' }}>{resultat.length} personne(s)</span>
      </div>
      <div class="defile">
        <table>
          <thead><tr><th>Nom</th><th>Poste</th><th>Écurie</th><th>Âge</th><th>Potentiel</th><th>Origine</th></tr></thead>
          <tbody>
            {resultat.slice(0, 300).map((p) => (
              <tr class="cliquable" key={p.id} onClick={() => ouvrir({ type: 'personne', id: p.id })}>
                <td><b>{nomComplet(p)}</b> <span class="muted">{p.nationalite}</span></td>
                <td>{LIBELLES_POSTES[p.poste]}</td><td>{nomsEq.get(p.ecurie) ?? <span class="muted">—</span>}</td>
                <td class="num">{age(monde, p)}</td><td><Note v={p.potentiel} /></td>
                <td class="muted">{p.origine === 'donnees' ? 'données' : 'générée'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function FichePersonne({ monde, id, ouvrir }: { monde: Monde; id: string; ouvrir: Ouvrir }) {
  const p = personnes(monde).find((x) => x.id === id) as Personne | undefined;
  if (!p) return <p class="erreur">Personne introuvable.</p>;
  const eq = ecuries(monde).find((e) => e.id === p.ecurie);
  const c = contrats(monde).find((x) => x.personne === p.id && x.statut === 'actif');
  const carriere = liste<Carriere>(monde, 'carrieres').filter((x) => x.personne === p.id).sort((a, b) => a.de - b.de);
  const titres = liste<Palmares>(monde, 'palmares').filter((x) => x.championPilote === p.id).map((x) => x.saison);
  const libAsp = (t: string) => ASPIRATIONS.find((a) => a.type === t)?.libelle ?? t;
  return (
    <>
      <Carte titre={nomComplet(p)}>
        <div class="grille">
          <div><span class="muted">Poste</span><br />{LIBELLES_POSTES[p.poste]}</div>
          <div><span class="muted">Écurie</span><br />{eq ? <Lien onClick={() => ouvrir({ type: 'ecurie', id: eq.id })}>{eq.nom}</Lien> : '—'}</div>
          <div><span class="muted">Nationalité · âge</span><br />{p.nationalite} · {age(monde, p)} ans ({p.dateNaissance})</div>
          <div><span class="muted">Contrat</span><br />{c ? `${c.debut} → ${c.fin} · ${c.salaireMEUR} M€/an${c.clauses ? ' · ' + c.clauses : ''}` : '—'}</div>
          <div><span class="muted">Origine</span><br />{p.origine === 'donnees' ? 'Données (inspirée du réel)' : 'Personnage généré'}</div>
          {titres.length > 0 && <div><span class="muted">Titres</span><br />{titres.join(', ')}</div>}
        </div>
        <p class="muted" style={{ fontSize: '.85rem' }}>Vérification : {p.verification || '—'}</p>
      </Carte>
      <div class="grille">
        <Carte titre="1. Personnalité (cachée)">
          {Object.entries(TRAITS).map(([k, lib]) => <Barre key={k} libelle={lib} v={p.traits[k] ?? 0} />)}
        </Carte>
        <Carte titre="2. Valeurs (cachées)">
          {Object.entries(VALEURS).map(([k, lib]) => <Barre key={k} libelle={lib + ((p.valeurs[k] ?? 0) >= SEUIL_CONVICTION ? ' ★' : '')} v={p.valeurs[k] ?? 0} accent={(p.valeurs[k] ?? 0) >= SEUIL_CONVICTION} />)}
          <p class="muted" style={{ fontSize: '.8rem' }}>★ = conviction (≥ {SEUIL_CONVICTION})</p>
        </Carte>
        <Carte titre={`3. Compétences · potentiel ${p.potentiel}`}>
          {Object.entries(p.competences).map(([k, v]) => <Barre key={k} libelle={k} v={v} />)}
        </Carte>
        <Carte titre="4 et 5. Aspirations et état">
          {p.aspirations.length === 0 ? <p class="muted">Aucune aspiration active.</p> : <ul>{p.aspirations.map((a) => <li key={a.type}>{libAsp(a.type)} <span class="muted">(horizon {a.horizon} an{a.horizon > 1 ? 's' : ''})</span></li>)}</ul>}
          <Barre libelle="Moral" v={p.etat.moral} max={100} />
          <Barre libelle="Stress" v={p.etat.stress} max={100} />
          <Barre libelle="Motivation" v={p.etat.motivation} max={100} />
          <Barre libelle="Confiance en soi" v={p.etat.confiance} max={100} />
        </Carte>
      </div>
      {carriere.length > 0 && (
        <Carte titre="Carrière (depuis 2010)">
          <table>
            <thead><tr><th>Années</th><th>Écurie (nom d'époque)</th><th>Poste</th><th>Note</th></tr></thead>
            <tbody>{carriere.map((x) => <tr key={x.id}><td class="num">{x.de === x.a ? x.de : `${x.de}–${x.a}`}</td><td>{x.nomHistorique}</td><td>{LIBELLES_POSTES[x.poste]}</td><td class="muted">{x.note}</td></tr>)}</tbody>
          </table>
        </Carte>
      )}
    </>
  );
}

/* ---------------- Contrats, palmarès, circuits ---------------- */

export function ListeContrats({ monde, ouvrir }: { monde: Monde; ouvrir: Ouvrir }) {
  const per = new Map(personnes(monde).map((p) => [p.id, p]));
  const nomsEq = new Map(ecuries(monde).map((e) => [e.id, e.nom]));
  const cs = contrats(monde).sort((a, b) => a.fin - b.fin || (nomsEq.get(a.ecurie) ?? '').localeCompare(nomsEq.get(b.ecurie) ?? ''));
  return (
    <div class="defile">
      <table>
        <thead><tr><th>Fin</th><th>Personne</th><th>Poste</th><th>Écurie</th><th>Salaire</th><th>Clauses</th></tr></thead>
        <tbody>
          {cs.map((c) => {
            const p = per.get(c.personne);
            return (
              <tr class="cliquable" key={c.id} onClick={() => ouvrir({ type: 'personne', id: c.personne })}>
                <td class="num">{c.fin}</td><td>{p ? nomComplet(p) : c.personne}</td><td>{LIBELLES_POSTES[c.poste]}</td>
                <td>{nomsEq.get(c.ecurie)}</td><td class="num">{c.salaireMEUR} M€</td><td class="muted">{c.clauses}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ListePalmares({ monde, ouvrir }: { monde: Monde; ouvrir: Ouvrir }) {
  const per = new Map(personnes(monde).map((p) => [p.id, p]));
  const nomsEq = new Map(ecuries(monde).map((e) => [e.id, e.nom]));
  const pal = liste<Palmares>(monde, 'palmares').sort((a, b) => b.saison - a.saison);
  return (
    <table>
      <thead><tr><th>Saison</th><th>Champion pilotes</th><th>Constructeurs</th></tr></thead>
      <tbody>
        {pal.map((x) => {
          const p = per.get(x.championPilote);
          return (
            <tr key={x.id}>
              <td class="num">{x.saison}</td>
              <td>{p ? <Lien onClick={() => ouvrir({ type: 'personne', id: p.id })}>{nomComplet(p)}</Lien> : x.championPilote} <span class="muted">({nomsEq.get(x.ecurieChampionPilote)})</span></td>
              <td>{nomsEq.get(x.championConstructeurs)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function ListeCircuits({ monde }: { monde: Monde }) {
  const cs = liste<Circuit>(monde, 'circuits');
  return (
    <div class="defile">
      <table>
        <thead><tr><th>Circuit</th><th>Lieu</th><th>Type</th><th>Altitude</th><th>Pluie</th></tr></thead>
        <tbody>{cs.map((c) => <tr key={c.id}><td><b>{c.nom}</b></td><td>{c.ville} ({c.pays})</td><td>{c.type}</td><td class="num">{c.altitudeM} m</td><td>{c.climatPluie}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
