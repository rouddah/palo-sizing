/* Genere icons.js pour le site a partir du catalogue officiel.

   Deux familles cohabitent, volontairement :

   - « pan »    : pictogrammes officiels Palo Alto, traces pleins
                  (fill), employes pour les concepts metier dans les
                  titres de groupe et de section (13-16px).
   - « ui »     : geometrie minimale au trait, pour les affordances
                  d'interface (coche, croix, chevron, fleche...) a
                  12-15px, ou un dessin detaille deviendrait une tache.

   Les deux ne se croisent jamais dans la meme rangee : le metier vit
   dans les titres, l'interface dans les listes et les boutons.        */
'use strict';
const fs = require('fs');
const { optimize } = require('./optimize.js');
const cat = require('./catalogue.json');

/* nom sur le site -> slug du catalogue officiel */
const PAN = {
  /* Les neuf concepts metier reellement employes par le site. Chacun a
     ete choisi pour rester lisible a 20px : le jeu officiel est dessine
     pour la projection, ses traces les plus fins disparaissent en
     dessous. */
  throughput: 'bar-graph',                 /* Charge reseau        */
  threat:     'av-signatures',             /* Fonctions de securite */
  site:       'branch-office',             /* Topologie, Architecture */
  rack:       'switch',                    /* Parc en place        */
  table:      'dashboard',                 /* Comparateur          */
  target:     'decision-tree',             /* Dimensionnement      */
  info:       'assess',                    /* Hypotheses, a confirmer */
  ha:         'double-up',                 /* Equivalence boitier  */
  doc:        'security-document'          /* Dossier, transmettre */
};

/* affordances d'interface, tracees a la main : 24x24, trait 1.75 */
const UI = {
  check:    '<path d="M4 12.5l5 5L20 6.5"/>',
  close:    '<path d="M6 6l12 12M18 6L6 18"/>',
  alert:    '<path d="M12 3.8L1.8 20.2h20.4L12 3.8z"/><path d="M12 10v4.2"/><circle cx="12" cy="17.4" r=".9" fill="currentColor" stroke="none"/>',
  dash:     '<path d="M6 12h12"/>',
  chevron:  '<path d="M9 5l7 7-7 7"/>',
  arrow:    '<path d="M4 12h15M13 6l6 6-6 6"/>',
  external: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',
  download: '<path d="M12 3v12"/><path d="M7 11l5 5 5-5"/><path d="M4 20h16"/>',
  copy:     '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1"/>',
  link:     '<path d="M10 14a4.5 4.5 0 006.4 0l2.6-2.6a4.5 4.5 0 00-6.4-6.4L11.4 6"/><path d="M14 10a4.5 4.5 0 00-6.4 0L5 12.6a4.5 4.5 0 006.4 6.4L12.6 18"/>',
  print:    '<path d="M7 9V3h10v6"/><path d="M7 18H4v-6a2 2 0 012-2h12a2 2 0 012 2v6h-3"/><rect x="7" y="15" width="10" height="6"/>',
  filter:   '<path d="M3 5h18l-7 8v6l-4 2v-8L3 5z"/>'
};

/* ── Traces officiels ── */
const pan = {};
let panBytes = 0;
for (const [name, slug] of Object.entries(PAN)) {
  const ico = cat.find(c => c.slug === slug);
  if (!ico) { console.error('ABSENT : ' + slug); process.exit(1); }
  const d = ico.paths.map(p => optimize(p.d)).filter(Boolean).join('');
  pan[name] = { d, from: ico.label };
  panBytes += d.length;
}

/* ── Ecriture ── */
const head = `/* ============================================================
   Sizing Guide - jeu de pictogrammes
   ------------------------------------------------------------
   Deux familles, chacune a sa place :

   PAN : pictogrammes officiels Palo Alto Networks, extraits du jeu
         « General Iconography » (vecteur). Traces pleins, remplis en
         currentColor. Reserves aux concepts metier dans les titres de
         groupe et de section, ou leur niveau de detail se lit (13px+).

   UI  : geometrie minimale au trait, pour les affordances d'interface
         (coche, croix, chevron, fleche, telechargement...). A 12px un
         pictogramme detaille devient une tache : ces affordances-la
         doivent rester des formes simples.

   Les deux familles ne se croisent pas dans une meme rangee : le metier
   vit dans les titres, l'interface dans les listes et les boutons.

   Usage HTML   : <span data-ic="decrypt"></span>
                  <span data-ic="check" data-ic-size="14"></span>
   Usage JS     : ic('decrypt')  ->  chaine SVG
   Accessibilite: aria-hidden par defaut (l'icone double toujours un
                  libelle). Pour une icone porteuse de sens seule,
                  passer data-ic-label="..." : elle devient role="img".

   Regeneration : le convertisseur DrawingML -> SVG vit dans
   tools/icons/ (extract.js puis build-iconsjs.js). A relancer si le
   jeu officiel evolue ; ne pas editer les traces PAN a la main.
   ============================================================ */
(function (global) {
  'use strict';

  /* Pictogrammes officiels Palo Alto - traces pleins */
  var PAN = {`;

let body = '';
for (const [name, v] of Object.entries(pan)) {
  body += `\n    /* ${v.from} */\n    ${name}: '${v.d}',`;
}
body = body.replace(/,$/, '');

const mid = `
  };

  /* Affordances d'interface - trait 1.75, extremites arrondies */
  var UI = {`;

let uiBody = '';
for (const [name, d] of Object.entries(UI)) {
  uiBody += `\n    ${name}: '${d.replace(/'/g, "\\'")}',`;
}
uiBody = uiBody.replace(/,$/, '');

const tail = `
  };

  function svg(name, size) {
    var s = size || 16;
    var open = '<svg class="ic" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" ';
    if (PAN[name]) {
      return open + 'fill="currentColor">' + '<path d="' + PAN[name] + '"/>' + '</svg>';
    }
    if (UI[name]) {
      return open + 'fill="none" stroke="currentColor" stroke-width="1.75" '
           + 'stroke-linecap="round" stroke-linejoin="round">' + UI[name] + '</svg>';
    }
    return '';
  }

  /* Hydrate <span data-ic="..."> une fois le DOM pret, et tout ce qui
     est injecte apres coup via icons.hydrate(racine). */
  function hydrate(root) {
    var nodes = (root || document).querySelectorAll('[data-ic]:not([data-ic-done])');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var name = el.getAttribute('data-ic');
      var out = svg(name, parseInt(el.getAttribute('data-ic-size'), 10) || 16);
      if (!out) { console.warn('[icons] pictogramme inconnu :', name); continue; }
      el.innerHTML = out;
      var label = el.getAttribute('data-ic-label');
      if (label) { el.setAttribute('role', 'img'); el.setAttribute('aria-label', label); }
      else { el.setAttribute('aria-hidden', 'true'); }
      el.setAttribute('data-ic-done', '');
    }
  }

  global.ic = svg;
  global.icons = {
    svg: svg,
    hydrate: hydrate,
    names: Object.keys(PAN).concat(Object.keys(UI)),
    official: Object.keys(PAN)
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { hydrate(); });
  } else {
    hydrate();
  }
})(window);
`;

const out = head + body + mid + uiBody + tail;
fs.writeFileSync('icons.generated.js', out);
console.log('icons.generated.js : ' + Math.round(out.length / 1024) + ' Ko');
console.log('  officiels : ' + Object.keys(pan).length + ' (' + Math.round(panBytes / 1024) + ' Ko de traces)');
console.log('  interface : ' + Object.keys(UI).length);
