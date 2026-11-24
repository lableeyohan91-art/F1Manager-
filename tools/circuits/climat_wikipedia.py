"""Phase 11b — normales climatiques mensuelles d'un circuit, depuis le tableau climatique (« Weather box ») de la page Wikipédia de
la ville la plus proche disposant de normales officielles. Mêmes formules que pour les 5 circuits pilotes :
  airCourseC  = maximum moyen du mois (course de nuit : moyenne du mois + 1 °C) ............ E
  joursPluie  = jours de pluie du tableau (V) ; sinon millimètres ÷ 10 mm par jour de pluie ... E
  pluieCourse = jours de pluie ÷ jours du mois × PART_PLUIE_COURSE ......................... E (part H)
Respect du service : une requête toutes les PAUSE_S secondes, nouvel essai après un refus « trop de requêtes ».
Usage : python3 climat_wikipedia.py <fichier de configuration JSON> <dossier des traces> [id ...]
Configuration : { "cir_x": { "pages": ["Ville", "Autre ville"], "moisGP": 6, "heureCourse": 15, "nuit": false } }
"""
import json, re, sys, time, urllib.parse, urllib.request, os, glob

PAUSE_S = 4
PART_PLUIE_COURSE = 0.43  # vérifiée contre les courses réellement humides (pluie_reelle.py : 29/258 réel contre 23,3 attendu avec 0,35)
JOURS = [31, 28.25, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
MOIS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
UA = {'User-Agent': 'APEX-Manager-circuits/1.0 (outil de données de jeu)'}


def wikitexte(page, profondeur=0):
    """Texte source de la page (lecture directe « action=raw », qui suit les redirections à la main)."""
    url = 'https://en.wikipedia.org/w/index.php?' + urllib.parse.urlencode({'title': page, 'action': 'raw'})
    for essai in range(6):
        time.sleep(PAUSE_S)
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                texte = r.read().decode('utf-8')
            m = re.match(r'\s*#REDIRECT\s*\[\[([^\]|#]+)', texte, re.I)
            if m and profondeur < 3:
                return wikitexte(m.group(1).strip(), profondeur + 1)
            return texte
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(30 * (essai + 1))
                continue
            return None
        except Exception:
            time.sleep(5)
    return None


def bloc_meteo(texte):
    """Texte du modèle « Weather box » (ou nom du modèle externe qui le contient)."""
    i = texte.find('{{Weather box')
    if i < 0:
        i = texte.find('{{weather box')
    if i >= 0:
        prof, j = 0, i
        while j < len(texte):
            if texte.startswith('{{', j):
                prof += 1; j += 2; continue
            if texte.startswith('}}', j):
                prof -= 1; j += 2
                if prof == 0:
                    return texte[i:j], None
                continue
            j += 1
    m = re.search(r'\{\{([^{}|]*[Ww]eatherbox[^{}|]*)\}\}', texte)
    if m:
        return None, 'Template:' + m.group(1).strip()
    m = re.search(r'\{\{[Mm]ain\|(Climate of [^}|]+)', texte)
    if m:
        return None, m.group(1).strip()
    return None, None


def nombre(v):
    v = re.sub(r'<ref[^>]*/>|<ref.*?</ref>|\{\{[^{}]*\}\}', '', v, flags=re.S).replace('−', '-').replace(',', '')
    m = re.search(r'-?\d+(\.\d+)?', v)
    return float(m.group()) if m else None


def analyser(bloc):
    p = {}
    for ligne in re.split(r'\n\s*\|', bloc):
        if '=' in ligne:
            k, v = ligne.split('=', 1)
            p[k.strip()] = v.strip()
    res = {}
    for i, m in enumerate(MOIS):
        def val(*cles):
            for c in cles:
                if c in p and nombre(p[c]) is not None:
                    return nombre(p[c]), c
            return None, None
        hi, c = val(f'{m} high C', f'{m} high F')
        if c and c.endswith('F'): hi = round((hi - 32) / 1.8, 1)
        lo, c = val(f'{m} low C', f'{m} low F')
        if c and c.endswith('F'): lo = round((lo - 32) / 1.8, 1)
        moy, c = val(f'{m} mean C', f'{m} mean F')
        if c and c.endswith('F'): moy = round((moy - 32) / 1.8, 1)
        mm, c = val(f'{m} precipitation mm', f'{m} rain mm', f'{m} precipitation inch', f'{m} rain inch')
        if c and c.endswith('inch'): mm = round(mm * 25.4, 1)
        jours, _ = val(f'{m} precipitation days', f'{m} rain days')
        hum, _ = val(f'{m} humidity', f'{m} afternoon humidity')
        res[i + 1] = dict(max=hi, min=lo, moy=moy, mm=mm, jours=jours, humidite=hum)
    loc = p.get('location', '')
    src = re.sub(r'<ref.*', '', p.get('source 1', p.get('source', '')), flags=re.S)[:200]
    return res, re.sub(r'\[\[|\]\]|<[^>]+>', '', loc), re.sub(r'\[\[|\]\]', '', src)


def climat(cfg):
    for page in cfg['pages']:
        texte = wikitexte(page)
        for _ in range(3):
            if not texte:
                break
            bloc, suite = bloc_meteo(texte)
            if bloc:
                normales, station, src = analyser(bloc)
                if all(normales[m]['max'] is not None for m in normales):
                    return page, normales, station, src
                break
            if not suite:
                break
            texte = wikitexte(suite)
    return None


def construire(cid, cfg):
    r = climat(cfg)
    if not r:
        return None
    page, n, station, src = r
    mois = {}
    for m in range(1, 13):
        x = n[m]
        if x['jours'] is not None:
            jours, st = x['jours'], 'V'
        elif x['mm'] is not None:
            jours, st = round(x['mm'] / 10, 1), 'E (millimètres ÷ 10 mm par jour de pluie)'
        else:
            jours, st = None, 'absent'
        moy = x['moy'] if x['moy'] is not None else (round((x['max'] + x['min']) / 2, 1) if x['min'] is not None else x['max'])
        course = round(moy + 1, 1) if cfg.get('nuit') else x['max']
        mois[str(m)] = dict(airMaxC=x['max'], airMinC=x['min'], airCourseC=course, joursPluie=jours, pluieMm=x['mm'], humidite=x['humidite'],
                            pluieCourse=round(jours / JOURS[m - 1] * PART_PLUIE_COURSE, 3) if jours is not None else None, statutJoursPluie=st)
    return dict(source=f'Wikipédia (tableau climatique : {page}), {src}'.strip(', '), station=station or page,
                statuts=dict(normales='V (normales des services météo nationaux, par mois)',
                             airCourseC='E (maximum moyen du mois ; course de nuit : moyenne + 1 °C)',
                             pluieCourse=f'E (jours de pluie ÷ jours du mois × {PART_PLUIE_COURSE}, part H des jours pluvieux où il pleut pendant la course)'),
                moisGP2026=cfg['moisGP'], heureCourse=cfg['heureCourse'], mois=mois)


if __name__ == '__main__':
    conf = json.load(open(sys.argv[1]))
    dossier = sys.argv[2]
    ids = sys.argv[3:] or list(conf)
    for cid in ids:
        fichiers = [f for f in glob.glob(f'{dossier}/**/{cid}.json', recursive=True)]
        if not fichiers:
            print(cid, 'trace absente'); continue
        c = construire(cid, conf[cid])
        if not c:
            print(cid, 'AUCUN tableau climatique trouvé', conf[cid]['pages']); continue
        d = json.load(open(fichiers[0]))
        d['climat'] = c
        json.dump(d, open(fichiers[0], 'w'), ensure_ascii=False, separators=(',', ':'))
        g = c['mois'][str(conf[cid]['moisGP'])]
        print(cid, c['station'][:50], '| mois GP', conf[cid]['moisGP'], g['airCourseC'], '°C', g['joursPluie'], 'j pluie')
        sys.stdout.flush()
