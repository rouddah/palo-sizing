# -*- coding: utf-8 -*-
"""Extrait optiques et accessoires de la price list Palo Alto vers data/*.js.

Regle du projet : AUCUN PRIX ne sort de ce script. On ne garde que
SKU, description, plateforme et les attributs techniques deduits de la description.
"""
import io
import json
import re
import sys

import openpyxl

XLSX = r'C:\Users\rayna\Downloads\AUG 2026.xlsx'

wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
ws = wb['GLOBAL Price List']

rows = []
for r in ws.iter_rows(min_row=6, values_only=True):
    if not r or not r[4]:
        continue
    rows.append({
        'type': str(r[0] or '').strip(),
        'cat': str(r[1] or '').strip(),
        'model': str(r[3] or '').strip(),
        'sku': str(r[4]).strip(),
        'desc': re.sub(r'\s+', ' ', str(r[5] or '')).strip(),
        'eol': r[9],
    })
print('%d lignes lues' % len(rows))

# ─────────────────────────────────────────────── optiques
OPT_TYPES = {'Optical Transceiver', 'QSFPDD', 'QSFP28', 'SFPDD'}
opt_rows = [x for x in rows if x['type'] in OPT_TYPES]

# Le 100 Mb est teste en premier : la description officielle de PAN-SFP-100BASE-FX
# se contredit ("100BASE-FX 100Mbps" puis "1000BASE-LX compliant") et le motif
# 1000BASE l'emporterait sinon.
SPEED = [
    (r'100BASE-FX|100Mbps', '100M'),
    (r'\b400G', '400G'), (r'\b100G', '100G'), (r'\b50G', '50G'),
    (r'\b40G', '40G'), (r'\b25G', '25G'), (r'\b10G', '10G'),
    (r'\b1Gb|\b1000BASE|\b1G\b', '1G'),
]
FORM = [
    (r'QSFP-DD|QSFPDD', 'QSFP-DD'), (r'SFP-DD|SFPDD', 'SFP-DD'),
    (r'QSFP28', 'QSFP28'), (r'QSFP\+|QSFP', 'QSFP+'),
    (r'SFP28', 'SFP28'), (r'SFP\+', 'SFP+'), (r'\bSFP\b', 'SFP'),
]


# Quatre SKU dont la description ne porte pas le debit de facon exploitable.
# Debit lu sur la fiche produit du form factor, pas devine.
SPEED_OVERRIDE = {
    'PAN-CBL-QSFP-QSFP28-BO-2M': '100G',   # breakout QSFP28 -> 4 x 25G
    'PAN-QSFPDD-DAC-3M':         '400G',   # QSFP-DD
    'PAN-QSFPDD-4X100GBASE-LR':  '400G',   # 4 x 100G, utilisable en 1 x 400G
    # PAN-SFPDD-DAC-3M : ports SFP-DD du NPC PA-7500 en detection automatique,
    # la price list ne donne pas de debit -> laisse hors matrice, section cables.
}


def speed_of(d, sku):
    if sku in SPEED_OVERRIDE:
        return SPEED_OVERRIDE[sku]
    for pat, val in SPEED:
        if re.search(pat, d, re.I) or re.search(pat, sku, re.I):
            return val
    return '?'


def form_of(d, sku):
    for pat, val in FORM:
        if re.search(pat, sku, re.I) or re.search(pat, d, re.I):
            return val
    return '?'


def media_of(d, sku):
    """Famille de support : MMF, SMF, cuivre RJ45, ou cable attache."""
    if re.search(r'direct attach|DAC|twin-ax|active optical cable|AOC', d, re.I) \
       or re.search(r'-DAC-|-AOC-|-CU-', sku, re.I):
        return 'DAC / AOC'
    if re.search(r'breakout cable', d, re.I):
        return 'DAC / AOC'
    if re.search(r'copper transceiver|BASE-T|Cat5|Cat6a|RJ-45', d, re.I):
        return 'Cuivre'
    if re.search(r'\bSMF\b|single mode', d, re.I):
        return 'Monomode'
    if re.search(r'\bMMF\b|OM2|OM3|OM4|multimode|62\.5', d, re.I):
        return 'Multimode'
    return 'Autre'


def reach_of(d):
    m = re.search(r'(\d+(?:\.\d+)?)\s*(?:K|k)m', d)
    if m:
        return m.group(1) + ' km'
    m = re.search(r'(\d+)\s*m(?:eters)?\b', d)
    if m:
        return m.group(1) + ' m'
    return ''


def standard_of(d):
    m = re.search(r'((?:\d+|100)(?:GBASE|BASE)-[A-Z0-9]+)', d)
    return m.group(1) if m else ''


def connector_of(d):
    if re.search(r'duplex LC|LC duplex', d, re.I):
        return 'LC duplex'
    if re.search(r'MPO', d, re.I):
        return 'MPO'
    if re.search(r'RJ-45', d, re.I):
        return 'RJ-45'
    return ''


def fiber_of(d):
    f = re.findall(r'OM[1-5]', d, re.I)
    return '/'.join(sorted(set(x.upper() for x in f))) if f else ''


optics = []
for x in opt_rows:
    d, sku = x['desc'], x['sku']
    optics.append({
        'sku': sku,
        'speed': speed_of(d, sku),
        'form': form_of(d, sku),
        'media': media_of(d, sku),
        'std': standard_of(d),
        'reach': reach_of(d),
        'fiber': fiber_of(d),
        'conn': connector_of(d),
        'bidi': bool(re.search(r'bidirectional|BiDi', d, re.I)),
        'taa': bool(re.search(r'TAA', d, re.I)) or sku.startswith('PAN-T-'),
        'rugged': bool(re.search(r'rugged|I-Temp', d, re.I)) or sku.startswith('PAN-R-'),
        'desc': d,
    })
optics.sort(key=lambda o: (['100M', '1G', '10G', '25G', '40G', '50G', '100G', '400G', '?']
                           .index(o['speed']), o['media'], o['sku']))

# ─────────────────────────────────────────────── accessoires
ACC_TYPES = {
    'Power Cord': 'Cordon d\'alimentation',
    'Power Supply': 'Alimentation',
    'Power Adaptor': 'Bloc secteur',
    'Power Accessories': 'Accessoire alimentation',
    'Rack Mount': 'Kit de montage rack',
    'Wall Mount': 'Kit de montage mural',
    'Fan Tray': 'Tiroir de ventilation',
    'Fan': 'Ventilateur',
    'Air Filter': 'Filtre a air',
    'SSD': 'Disque SSD',
    'Accessory Kit': 'Kit d\'accessoires',
    'Cable Gland': 'Presse-etoupe',
}
# Les cinq rayons dans lesquels on range les accessoires. Le libelle precis
# de la price list reste affiche en sous-titre.
BUCKET = {
    'Power Cord': 'Alimentation', 'Power Supply': 'Alimentation',
    'Power Adaptor': 'Alimentation', 'Power Accessories': 'Alimentation',
    'Rack Mount': 'Rack & montage', 'Wall Mount': 'Rack & montage',
    'Fan Tray': 'Ventilation', 'Fan': 'Ventilation', 'Air Filter': 'Ventilation',
    'SSD': 'Stockage',
    'Accessory Kit': 'Divers', 'Cable Gland': 'Divers',
}

# Plateformes reconnues dans le SKU ou la description, normalisees en serie.
PLATFORMS = [
    (r'PA-2\d{2}\b', 'PA-200'), (r'PA-4[0-9]{2}\b|PA-410R', 'PA-400'),
    (r'PA-5[0-9]{2}\b(?!0)', 'PA-500'), (r'PA-8\d{2}\b', 'PA-800'),
    (r'PA-14\d{2}\b', 'PA-1400'), (r'PA-32\d{2}\b', 'PA-3200'),
    (r'PA-34\d{2}\b', 'PA-3400'), (r'PA-52\d{2}\b', 'PA-5200'),
    (r'PA-54\d{2}\b', 'PA-5400'), (r'PA-55\d{2}\b', 'PA-5500'),
    (r'PA-7050\b', 'PA-7050'), (r'PA-7080\b', 'PA-7080'),
    (r'PA-7500\b', 'PA-7500'), (r'PA-70\d{2}\b|PA-CHA', 'PA-7000'),
    (r'\bM-\d{3}\b|M-Series', 'M-Series'), (r'\bION[ -]?\d+', 'ION / SD-WAN'),
]


def iso_date(v):
    """La price list donne les dates en MM/DD/YYYY : on normalise en YYYY-MM-DD."""
    if not v:
        return ''
    s = str(v)[:10]
    m = re.match(r'^(\d{2})/(\d{2})/(\d{4})$', s)
    if m:
        return '%s-%s-%s' % (m.group(3), m.group(1), m.group(2))
    return s


def platforms_of(sku, desc):
    hay = sku + ' ' + desc
    found = []
    for pat, name in PLATFORMS:
        if re.search(pat, hay, re.I) and name not in found:
            found.append(name)
    return found


acc = []
for x in rows:
    if x['type'] not in ACC_TYPES or x['cat'].lower() != 'hardware':
        continue
    acc.append({
        'sku': x['sku'],
        'family': ACC_TYPES[x['type']],
        'bucket': BUCKET[x['type']],
        'platforms': platforms_of(x['sku'], x['desc']),
        'desc': x['desc'],
        'eol': iso_date(x['eol']),
    })
acc.sort(key=lambda a: (a['bucket'], a['family'], a['sku']))

# ─────────────────────────────────────────────── ecriture
hdr = ("/* Genere depuis la price list Palo Alto GLOBAL (AUG 2026) le 2026-08-20.\n"
       "   AUCUN PRIX n'est repris ici : uniquement SKU, description et attributs\n"
       "   techniques deduits de la description officielle.\n"
       "   Regenerer avec _extract_hw.py apres depot d'une nouvelle price list. */\n\n")

io.open('data/pa-optics.js', 'w', encoding='utf8').write(
    hdr + 'const OPTICS = ' + json.dumps(optics, ensure_ascii=False, indent=0) + ';\n')
io.open('data/pa-accessories.js', 'w', encoding='utf8').write(
    hdr + 'const ACCESSORIES = ' + json.dumps(acc, ensure_ascii=False, indent=0) + ';\n')

print('optiques    : %d' % len(optics))
print('accessoires : %d' % len(acc))
inc = [o for o in optics if o['speed'] == '?' or o['media'] == 'Autre']
if inc:
    print('\n%d optiques mal classees :' % len(inc))
    for o in inc:
        print('   %-28s %-6s %-12s %s' % (o['sku'], o['speed'], o['media'], o['desc'][:70]))
