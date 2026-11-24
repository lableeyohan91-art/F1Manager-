"""Phase 11b — historique des neutralisations, édition par édition (Safety Car, VSC, drapeau rouge), dans chaque trace.

Sources :
- jeu communautaire CC0 (TracingInsights / Kaggle « Formula 1 Race Events ») : races.csv, safety_cars.csv, virtual_safety_cars.csv,
  red_flags.csv, à télécharger depuis https://raw.githubusercontent.com/TracingInsights/RaceData/main/data/<fichier> ;
- messages officiels de la direction de course 2023–2026 (OpenF1), comptés par 4-verification-neutralisations.py (fichier rc.json) ;
- corrections ponctuelles, chacune avec sa source (CORRECTIONS ci-dessous).
Règles : Safety Car seulement depuis 1993 (sinon « non applicable ») ; les 10 dernières éditions réellement courues jusqu'au 24/11/2026 (une saison sans Grand Prix n'est pas une édition sans
incident) ; VSC seulement depuis 2015 (sinon « non applicable ») ; Grands Prix seulement (pas les courses sprint) ; une donnée
absente reste absente (jamais zéro).
Usage : python3 historique_editions.py <dossier des CSV> <rc.json> <id_circuit> <circuitRef> <fichier trace>
"""
import csv, json, sys, collections

CORRECTIONS = {
    ('cir_singapour', 2016): dict(sc_ajout=[dict(deploye=1, retire=None, cause='Accident au départ (Hülkenberg)')],
                                  source='Wikipédia, « 2016 Singapore Grand Prix » : « The safety car was deployed while Hülkenberg\'s car was cleared » ; absente du jeu communautaire'),
}


def lire(chemin):
    d = collections.defaultdict(list)
    for x in csv.DictReader(open(chemin)):
        d[x['Race']].append(x)
    return d


def construire(dossier, rc, cid, ref, trace):
    races = list(csv.DictReader(open(f'{dossier}/races.csv')))
    circ = {c['circuitRef']: c['circuitId'] for c in csv.DictReader(open(f'{dossier}/circuits.csv'))}
    sc, vsc, dr = lire(f'{dossier}/safety_cars.csv'), lire(f'{dossier}/virtual_safety_cars.csv'), lire(f'{dossier}/red_flags.csv')
    eds = sorted([r for r in races if r['circuitId'] == circ[ref] and r['date'] <= '2026-11-24'], key=lambda r: r['date'])[-10:]
    editions = []
    for r in eds:
        an, nom = int(r['year']), f"{r['year']} {r['name']}"
        e = dict(annee=an, date=r['date'], nom=r['name'],
                 safetyCars=None if an < 1993 else [dict(deploye=int(float(x['Deployed'])), retire=int(float(x['Retreated'])) if x['Retreated'] not in ('', 'NA') else None, cause=x['Cause']) for x in sc.get(nom, [])],
                 vsc=None if an < 2015 else [dict(deploye=int(float(x['Deployed'])), retire=int(float(x['Retreated'])) if x['Retreated'] not in ('', 'NA') else None) for x in vsc.get(nom, [])],
                 drapeauxRouges=[dict(tour=int(float(x['Lap'])), reprise=x['Resumed'] == 'Y', incident=x['Incident'][:120]) for x in dr.get(nom, [])],
                 sources=['jeu communautaire CC0'], verification='non recoupée (avant 2023)')
        c = CORRECTIONS.get((cid, an))
        if c:
            e['safetyCars'] = (e['safetyCars'] or []) + c.get('sc_ajout', [])
            e['sources'].append(c['source'])
            e['verification'] = 'corrigée (seconde source)'
        o = rc.get(f'{an} {cid}')
        if o:
            ok = (len(e['safetyCars'] or []), len(e['vsc'] or []), len(e['drapeauxRouges'])) == (o['sc'], o['vsc'], o['dr'])
            e['sources'].append('messages officiels de la direction de course (OpenF1)')
            e['verification'] = 'identique aux messages officiels' if ok else f"écart avec les messages officiels (SC {o['sc']}, VSC {o['vsc']}, DR {o['dr']}) : à trancher"
        editions.append(e)
    n = len(editions); nv = sum(1 for e in editions if e['vsc'] is not None); ns = sum(1 for e in editions if e['safetyCars'] is not None)
    resume = dict(editions=n, de=editions[0]['annee'], a=editions[-1]['annee'],
                  safetyCar=dict(editionsConcernees=ns, interventions=sum(len(e['safetyCars']) for e in editions if e['safetyCars'] is not None), grandsPrix=sum(1 for e in editions if e['safetyCars'])),
                  vsc=dict(editionsConcernees=nv, interventions=sum(len(e['vsc']) for e in editions if e['vsc'] is not None), grandsPrix=sum(1 for e in editions if e['vsc'])),
                  drapeauRouge=dict(interventions=sum(len(e['drapeauxRouges']) for e in editions), grandsPrix=sum(1 for e in editions if e['drapeauxRouges'])))
    d = json.load(open(trace))
    d['historique'] = dict(regles='10 dernières éditions réellement courues jusqu’au 24/11/2026 ; Grands Prix seulement ; Safety Car depuis 1993, VSC depuis 2015 ; donnée absente ≠ zéro',
                           resume=resume, editions=editions)
    json.dump(d, open(trace, 'w'), ensure_ascii=False, separators=(',', ':'))
    return resume


if __name__ == '__main__':
    dossier, rcf, cid, ref, trace = sys.argv[1:6]
    print(cid, construire(dossier, json.load(open(rcf)), cid, ref, trace))
