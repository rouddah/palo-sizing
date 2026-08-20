# -*- coding: utf-8 -*-
"""Pages outils : bandeau compact a la place du hero decoratif, en-tetes de
   colonne en pastille, et copie au clic sur la carte entiere (elle passe au
   vert avec « Copie ! », comme sur la reference)."""
import io

# ─────────────────────────────────────────────────── CSS commune
CSS = r'''
/* ── Bandeau d'outil (pages optiques / accessoires) ────────── */
.tool-bar {
  position: sticky;
  top: var(--header-h);
  z-index: 25;
  background: color-mix(in srgb, var(--surface) 90%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}
.tool-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 24px;
  border-bottom: 1px solid var(--border);
}
.tool-head .tk {
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: var(--accent);
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  background: var(--accent-dim);
  border-radius: 5px;
  padding: 3px 9px;
  white-space: nowrap;
}
.tool-head h1 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-bright);
  letter-spacing: -0.3px;
  white-space: nowrap;
}
.tool-head .sub {
  font-size: 12px;
  color: var(--text-muted);
  border-left: 1px solid var(--border);
  padding-left: 14px;
  min-width: 0;
}
.tool-head .acts { margin-left: auto; display: flex; align-items: center; gap: 12px; }
.btn-tool {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font);
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  background: var(--surface2);
  border: 1px solid var(--border2);
  border-radius: 7px;
  padding: 7px 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color .16s, color .16s, transform .16s var(--ease-ui);
}
.btn-tool:hover { color: var(--text-bright); border-color: var(--accent); transform: translateY(-1px); }
.btn-tool svg { width: 13px; height: 13px; opacity: .8; }
.tool-src { font-family: var(--mono); font-size: 10.5px; color: var(--text-muted); white-space: nowrap; }
.tool-src b { color: var(--accent); font-weight: 700; }

/* ── Copie : la carte entiere bascule au vert ──────────────── */
.copy-card { cursor: copy; }
.copy-card .copy-flag {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  gap: 5px;
  border-radius: inherit;
  background: color-mix(in srgb, var(--green) 82%, #04150a);
  color: #05210f;
  font-family: var(--font);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.1px;
  opacity: 0;
  pointer-events: none;
  transform: scale(.97);
  transition: opacity .16s var(--ease-ui), transform .16s var(--ease-ui);
}
.copy-card.copied { border-color: var(--green) !important; }
.copy-card.copied .copy-flag { opacity: 1; transform: scale(1); }

/* ── Legende de la matrice ─────────────────────────────────── */
.mx-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px 20px;
  padding: 9px 24px;
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
}
.mx-legend span { display: inline-flex; align-items: center; gap: 7px; }
.mx-legend i { width: 8px; height: 8px; border-radius: 2px; display: inline-block; }
'''

p = 'styles.css'
s = io.open(p, encoding='utf8').read()
if '.tool-bar' not in s:
    io.open(p, 'w', encoding='utf8').write(s.rstrip() + '\n' + CSS)
    print('styles.css : bandeau d\'outil + copie carte')

COPY_SVG = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
            'stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/>'
            '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>')

COPY_ALL_JS = """  document.getElementById('copy-all').addEventListener('click', function () {
    var list = %s.filter(keep).map(function (x) { return x.sku; });
    if (!list.length) return;
    var txt = list.join('\\n');
    var ta = document.createElement('textarea');
    ta.value = txt;
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt);
    document.body.removeChild(ta);
    var lab = this.querySelector('span');
    lab.textContent = list.length + ' SKU copiés';
    setTimeout(function () { lab.textContent = 'Copier les SKU affichés'; }, 1800);
  });
"""

# ══════════════════════════════════════════════ optiques.html
p = 'optiques.html'
s = io.open(p, encoding='utf8').read()

s = s[:s.index('  <div class="page-wrap"')] + '''  <div class="tool-bar">
    <div class="tool-head">
      <span class="tk">Transceivers</span>
      <h1>Optiques PA-Series</h1>
      <span class="sub">Une colonne par d&eacute;bit, une ligne par support &mdash; cliquez une r&eacute;f&eacute;rence pour la copier.</span>
      <span class="acts">
        <button class="btn-tool" id="copy-all">''' + COPY_SVG + '''<span>Copier les SKU affich&eacute;s</span></button>
        <span class="tool-src"><b id="hm-count">0</b> modules &middot; price list AUG&nbsp;2026 &middot; sans prix</span>
      </span>
    </div>
''' + s[s.index('    <div class="flt-row">'):]

# la barre de filtres est desormais dans le bandeau : on ferme au bon endroit
s = s.replace('''      <button class="flt-reset" onclick="resetAll()">Tout r&eacute;afficher</button>
    </div>
  </div>
''', '''      <button class="flt-reset" onclick="resetAll()">Tout r&eacute;afficher</button>
    </div>
    <div class="mx-legend">
      <span><i style="background:var(--net-sec)"></i>Multimode &mdash; MMF, courte distance</span>
      <span><i style="background:var(--green)"></i>Monomode &mdash; SMF, longue distance</span>
      <span><i style="background:var(--yellow)"></i>Cuivre &mdash; RJ-45</span>
      <span><i style="background:var(--purple)"></i>DAC / AOC &mdash; c&acirc;bles attach&eacute;s</span>
      <span style="margin-left:auto">BiDi&nbsp;: une seule fibre &middot; TAA&nbsp;: Trade Agreements Act &middot; RGD&nbsp;: durci I-Temp</span>
    </div>
  </div>
''', 1)

# en-tete de colonne en pastille
s = s.replace("""      head += '<th><span class="sp">' + s.replace('G', ' GE').replace('100M', '100 MB')
        + '</span><span class="ff">' + FORMOF[s] + '</span></th>';""",
"""      head += '<th><span class="pill"><span class="sp">'
        + s.replace('G', ' GE').replace('100M', '100 MB')
        + '</span><span class="ff">' + FORMOF[s] + '</span></span></th>';""")

# carte : copie au clic, bascule verte
s = s.replace("""    return '<div class="opt" style="--oc:' + color + '" title="' + esc(o.desc) + '">'
      + '<div class="sku">' + o.sku.replace(/^PAN-/, '') + '</div>'""",
"""    return '<div class="opt copy-card" style="--oc:' + color + '" data-copy="' + o.sku + '"'
      + ' data-copy-label="' + o.sku + '" title="' + esc(o.desc) + ' — cliquer pour copier">'
      + '<div class="copy-flag">&#10003; Copié !</div>'
      + '<div class="sku">' + o.sku.replace(/^PAN-/, '') + '</div>'""")

s = s.replace("""  document.getElementById('hm-count').textContent = OPTICS.length + ' modules référencés';""",
              (COPY_ALL_JS % 'OPTICS') + "  document.getElementById('hm-count').textContent = OPTICS.length;")
io.open(p, 'w', encoding='utf8').write(s)
print('optiques.html : bandeau, pastilles, copie carte')

# ══════════════════════════════════════════════ accessoires.html
p = 'accessoires.html'
s = io.open(p, encoding='utf8').read()

s = s[:s.index('  <div class="page-wrap"')] + '''  <div class="tool-bar">
    <div class="tool-head">
      <span class="tk">Accessoires</span>
      <h1>Alimentations, rack &amp; pi&egrave;ces</h1>
      <span class="sub">Ce qu'on oublie dans une commande &mdash; cliquez une r&eacute;f&eacute;rence pour la copier.</span>
      <span class="acts">
        <button class="btn-tool" id="copy-all">''' + COPY_SVG + '''<span>Copier les SKU affich&eacute;s</span></button>
        <span class="tool-src"><b id="hm-count">0</b> r&eacute;f&eacute;rences &middot; price list AUG&nbsp;2026 &middot; sans prix</span>
      </span>
    </div>
''' + s[s.index('    <div class="flt-row">'):]

s = s.replace('''      <button class="flt-reset" onclick="resetAll()">Tout r&eacute;afficher</button>
    </div>
  </div>
''', '''      <button class="flt-reset" onclick="resetAll()">Tout r&eacute;afficher</button>
    </div>
  </div>
''', 1)

s = s.replace("""    return '<article class="part">'""",
              """    return '<article class="part copy-card" data-copy="' + a.sku + '" title="Cliquer pour copier">'
      + '<div class="copy-flag">&#10003; Copié !</div>'""")
s = s.replace("""  document.getElementById('hm-count').textContent = ACCESSORIES.length + ' références';""",
              (COPY_ALL_JS % 'ACCESSORIES') + "  document.getElementById('hm-count').textContent = ACCESSORIES.length;")
io.open(p, 'w', encoding='utf8').write(s)
print('accessoires.html : bandeau + copie carte')
