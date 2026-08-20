/* ============================================================
   Sizing Guide - jeu de pictogrammes en ligne
   ------------------------------------------------------------
   Remplace les emoji et les caracteres decoratifs employes
   par des SVG traces. Un emoji change de dessin selon l'OS, ne prend
   pas la couleur du texte et n'a pas de nom accessible : sur un outil
   technique, ce sont trois defauts de trop.

   Grille 24x24, trait 1.75, extremites arrondies. Le meme trace que
   les pictogrammes du menu (header.js).

   Usage HTML   : <span data-ic="check"></span>
                  <span data-ic="alert" data-ic-size="14"></span>
   Usage JS     : ic('check')  ->  chaine SVG
   Accessibilite: aria-hidden par defaut (l'icone double toujours un
                  libelle). Pour une icone porteuse de sens seule,
                  passer data-ic-label="..." : elle devient role="img".

   NOTE : quand le jeu vectoriel officiel Palo Alto (General
   Iconography) sera exporte en SVG, il suffira de remplacer les
   traces de PATHS ci-dessous, l'API ne bouge pas.
   ============================================================ */
(function (global) {
  'use strict';

  var PATHS = {
    /* ── etats ── */
    check:      '<path d="M4 12.5l5 5L20 6.5"/>',
    close:      '<path d="M6 6l12 12M18 6L6 18"/>',
    alert:      '<path d="M12 3.8L1.8 20.2h20.4L12 3.8z"/><path d="M12 10v4.2"/><circle cx="12" cy="17.4" r=".9" fill="currentColor" stroke="none"/>',
    info:       '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r=".9" fill="currentColor" stroke="none"/>',
    dash:       '<path d="M6 12h12"/>',

    /* ── navigation ── */
    chevron:    '<path d="M9 5l7 7-7 7"/>',
    arrow:      '<path d="M4 12h15M13 6l6 6-6 6"/>',
    external:   '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',
    download:   '<path d="M12 3v12"/><path d="M7 11l5 5 5-5"/><path d="M4 20h16"/>',
    copy:       '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1"/>',
    print:      '<path d="M7 9V3h10v6"/><path d="M7 18H4v-6a2 2 0 012-2h12a2 2 0 012 2v6h-3"/><rect x="7" y="15" width="10" height="6"/>',
    link:       '<path d="M10 14a4.5 4.5 0 006.4 0l2.6-2.6a4.5 4.5 0 00-6.4-6.4L11.4 6"/><path d="M14 10a4.5 4.5 0 00-6.4 0L5 12.6a4.5 4.5 0 006.4 6.4L12.6 18"/>',

    /* ── metriques de dimensionnement ── */
    throughput: '<path d="M3 17a9 9 0 0118 0"/><path d="M12 17l4.5-5"/><circle cx="12" cy="17" r="1.4" fill="currentColor" stroke="none"/>',
    sessions:   '<path d="M3 7h18M3 12h18M3 17h18"/><circle cx="7.5" cy="7" r="1.6" fill="currentColor" stroke="none"/><circle cx="14" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="10" cy="17" r="1.6" fill="currentColor" stroke="none"/>',
    cps:        '<path d="M13 2.5L4.5 13.5H11l-1 8 8.5-11H12l1-8z"/>',
    users:      '<circle cx="9" cy="8" r="3.4"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><path d="M16 5.2a3.4 3.4 0 010 5.6"/><path d="M17.5 14.4A6.5 6.5 0 0121.5 20"/>',
    site:       '<path d="M4 21V6.5L12 3l8 3.5V21"/><path d="M2.5 21h19"/><path d="M9.5 21v-5h5v5"/>',
    datacenter: '<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7h.01M7 17h.01"/>',
    decrypt:    '<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 018 0"/><path d="M12 14.5v2.5"/>',
    tunnel:     '<path d="M3 12h4"/><path d="M17 12h4"/><rect x="7" y="8" width="10" height="8" rx="4"/>',
    threat:     '<path d="M12 2.8l7.5 3v6.1c0 4.4-3.1 8.2-7.5 9.3-4.4-1.1-7.5-4.9-7.5-9.3V5.8l7.5-3z"/><path d="M9.2 12.2l1.9 1.9 3.7-3.7"/>',
    cloud:      '<path d="M7 18.5a4.2 4.2 0 01-.4-8.4 5.6 5.6 0 0110.8-1.3A3.9 3.9 0 0117 18.5H7z"/>',
    device:     '<rect x="3" y="6" width="12" height="9" rx="1.5"/><path d="M2 19h14"/><rect x="17" y="10" width="5" height="9" rx="1.5"/>',
    ha:         '<path d="M3.5 8.5h11l-2.5-3"/><path d="M20.5 15.5h-11l2.5 3"/>',
    growth:     '<path d="M3.5 17.5L9.5 11l4 4 7-8"/><path d="M20.5 7h-4.5M20.5 7v4.5"/>',
    remote:     '<rect x="3" y="4.5" width="18" height="12" rx="1.5"/><path d="M8 20.5h8"/><path d="M12 16.5v4"/>',
    rack:       '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M4 9h16M4 15h16"/><path d="M7 6h.01M7 12h.01M7 18h.01"/>',
    port:       '<rect x="3" y="8" width="18" height="8" rx="1.5"/><path d="M8 8V5.5M12 8V5.5M16 8V5.5"/>',
    table:      '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/>',
    target:     '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',
    filter:     '<path d="M3 5h18l-7 8v6l-4 2v-8L3 5z"/>'
  };

  function svg(name, size) {
    var d = PATHS[name];
    if (!d) return '';
    var s = size || 16;
    return '<svg class="ic" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" '
         + 'stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">'
         + d + '</svg>';
  }

  /* Hydrate <span data-ic="..."> une fois le DOM pret, et tout ce qui
     est injecte apres coup via icons.hydrate(racine). */
  function hydrate(root) {
    var nodes = (root || document).querySelectorAll('[data-ic]:not([data-ic-done])');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var name = el.getAttribute('data-ic');
      if (!PATHS[name]) { console.warn('[icons] pictogramme inconnu :', name); continue; }
      el.innerHTML = svg(name, parseInt(el.getAttribute('data-ic-size'), 10) || 16);
      var label = el.getAttribute('data-ic-label');
      if (label) { el.setAttribute('role', 'img'); el.setAttribute('aria-label', label); }
      else { el.setAttribute('aria-hidden', 'true'); }
      el.setAttribute('data-ic-done', '');
    }
  }

  global.ic = svg;
  global.icons = { svg: svg, hydrate: hydrate, names: Object.keys(PATHS) };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { hydrate(); });
  } else {
    hydrate();
  }
})(window);
