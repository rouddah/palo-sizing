/* ============================================================
   Sizing Guide PANW, coque commune  v8
   ------------------------------------------------------------
   - Barre d'outils persistante : Comparer, Dimensionner, Optiques,
     Accessoires, Recherche. Le comparateur est toujours le premier
     geste, jamais dans un sous-menu.
   - Second niveau : les piliers du portefeuille.
   - Palette de commande (Ctrl+K, Cmd+K ou /) : retrouve un modele,
     un outil ou une page, et ouvre la comparaison.
   - Raccourcis : C ouvre le comparateur, D l'etabli.
   - Mobile : dock d'outils en bas d'ecran, menu complet en feuille.
   La selection de comparaison est partagee entre toutes les pages
   (localStorage 'pan-cmp-sel', la meme cle que le comparateur).
   ============================================================ */
(function () {
  'use strict';
  var page = location.pathname.split('/').pop() || 'index.html';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SVG = function (d, s) {
    return '<svg class="ic" width="' + (s || 16) + '" height="' + (s || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  };
  var IC = {
    cmp: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    size: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
    optic: '<path d="M3 12h6M15 12h6"/><rect x="9" y="8" width="6" height="8" rx="1"/>',
    box: '<path d="M21 16V8l-9-5-9 5v8l9 5 9-5z"/><path d="M3.3 7L12 12l8.7-5M12 22V12"/>',
    find: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    moon: '<path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>',
    sun: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>'
  };

  /* Outils : premier niveau. key = raccourci clavier affiche. */
  var TOOLS = [
    { href: 'pa-series.html',     label: 'Comparer',     ic: 'cmp',   key: 'C', main: true },
    { href: 'qualification.html', label: 'Dimensionner', ic: 'size',  key: 'D' },
    { href: 'optiques.html',      label: 'Optiques',     ic: 'optic' },
    { href: 'accessoires.html',   label: 'Accessoires',  ic: 'box' },
    { href: 'search.html',        label: 'Recherche',    ic: 'find' }
  ];
  /* Portefeuille : second niveau. */
  var PILLARS = [
    { href: 'panorama.html',  label: 'NGFW', sub: 'Panorama' },
    { href: 'prisma.html',    label: 'SASE', sub: 'Prisma Access' },
    { href: 'browser.html',   label: 'Prisma Browser' },
    { href: 'cortex.html',    label: 'Cortex' },
    { href: 'idira.html',     label: 'Idira' }
  ];
  var MORE = [
    { href: 'wizard.html',    label: 'Mode guidé' },
    { href: 'resources.html', label: 'Ressources' }
  ];

  function cur(href) { return page === href ? ' aria-current="page"' : ''; }
  function isMac() { return /Mac|iPhone|iPad/.test(navigator.platform || ''); }

  var toolLinks = TOOLS.map(function (t) {
    return '<a class="tb-link' + (t.main ? ' is-main' : '') + '" href="' + t.href + '"' + cur(t.href) + '>'
      + SVG(IC[t.ic], 16) + '<span>' + t.label + '</span>'
      + (t.key ? '<kbd aria-hidden="true">' + t.key + '</kbd>' : '') + '</a>';
  }).join('');

  var pillarLinks = PILLARS.map(function (p) {
    return '<a class="pf-link" href="' + p.href + '"' + cur(p.href) + '>' + p.label
      + (p.sub ? '<span class="pf-sub">' + p.sub + '</span>' : '') + '</a>';
  }).join('');
  var moreLinks = MORE.map(function (p) {
    return '<a class="pf-link" href="' + p.href + '"' + cur(p.href) + '>' + p.label + '</a>';
  }).join('');

  var dock = TOOLS.slice(0, 4).map(function (t) {
    return '<a class="dock-link' + (t.main ? ' is-main' : '') + '" href="' + t.href + '"' + cur(t.href) + '>'
      + SVG(IC[t.ic], 20) + '<span>' + t.label + '</span></a>';
  }).join('');

  var headerHTML =
    '<header class="site-header">'
  + '<div class="hd-row">'
  +   '<a class="header-logo" href="index.html" aria-label="Accueil du Sizing Guide">'
  +     '<img class="logo-dark" src="img/logo-panw-dark.svg" alt="Palo Alto Networks" width="150" height="42" />'
  +     '<img class="logo-light" src="img/logo-panw-light.svg" alt="Palo Alto Networks" width="150" height="42" />'
  +   '</a>'
  +   '<span class="header-title">Sizing Guide</span>'
  +   '<nav class="toolbar-nav" aria-label="Outils">' + toolLinks + '<span class="nav-ink" aria-hidden="true"></span></nav>'
  +   '<button type="button" class="cmdk-trigger" id="cmdk-open" aria-haspopup="dialog" aria-label="Rechercher un modèle, un outil ou une page">'
  +     SVG(IC.find, 15) + '<span class="cmdk-ph">Modèle, outil, page</span><kbd>' + (isMac() ? '⌘' : 'Ctrl') + ' K</kbd>'
  +   '</button>'
  +   '<button type="button" class="icon-btn" id="theme-toggle" aria-label="Basculer thème sombre ou clair">'
  +     '<span id="icon-moon">' + SVG(IC.moon, 15) + '</span><span id="icon-sun" style="display:none">' + SVG(IC.sun, 15) + '</span>'
  +   '</button>'
  + '</div>'
  + '<div class="hd-sub">'
  +   '<nav class="pf-nav" aria-label="Portefeuille"><span class="pf-label">Portefeuille</span>' + pillarLinks + '</nav>'
  +   '<nav class="pf-nav pf-more" aria-label="Autres pages">' + moreLinks + '</nav>'
  + '</div>'
  + '</header>'
  + '<nav class="dock" aria-label="Outils (mobile)">' + dock
  +   '<button type="button" class="dock-link" id="dock-more" aria-haspopup="dialog">' + SVG(IC.menu, 20) + '<span>Plus</span></button>'
  + '</nav>';

  var root = document.getElementById('header-root');
  if (root) root.outerHTML = headerHTML;
  document.documentElement.classList.add('has-shell');

  /* ── Selection partagee ─────────────────────────────────── */
  var Sel = {
    get: function () { try { return JSON.parse(localStorage.getItem('pan-cmp-sel') || '[]') || []; } catch (e) { return []; } },
    set: function (a) { try { localStorage.setItem('pan-cmp-sel', JSON.stringify(a.slice(0, 4))); } catch (e) {} }
  };
  window.CmpSel = Sel;

  /* ── Theme ──────────────────────────────────────────────── */
  window.toggleTheme = function () {
    var now = 'dark';
    try { now = localStorage.getItem('pan-theme') || 'dark'; } catch (e) {}
    var next = now === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('pan-theme', next); } catch (e) {}
    applyTheme(next);
  };
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    var moon = document.getElementById('icon-moon'), sun = document.getElementById('icon-sun');
    if (moon) moon.style.display = t === 'dark' ? '' : 'none';
    if (sun) sun.style.display = t === 'light' ? '' : 'none';
  }
  var saved = 'dark';
  try { saved = localStorage.getItem('pan-theme') || 'dark'; } catch (e) {}
  applyTheme(saved);
  var tt = document.getElementById('theme-toggle');
  if (tt) tt.addEventListener('click', window.toggleTheme);

  /* ── Repere actif de la barre d'outils ──────────────────────
     Un trait orange sous l'outil courant. Au survol il suit le
     pointeur, puis revient sur la page courante. */
  (function () {
    var nav = document.querySelector('.toolbar-nav');
    if (!nav) return;
    var ink = nav.querySelector('.nav-ink');
    var home = nav.querySelector('[aria-current="page"]');
    function place(el, instant) {
      if (!el) { ink.style.opacity = '0'; return; }
      var x = el.offsetLeft, w = el.offsetWidth;
      ink.style.opacity = '1';
      if (window.gsap && !reduce && !instant) gsap.to(ink, { x: x, scaleX: w, duration: .45, ease: 'power3.out', overwrite: true });
      else if (window.gsap) gsap.set(ink, { x: x, scaleX: w });
      else ink.style.transform = 'translateX(' + x + 'px) scaleX(' + w + ')';
    }
    place(home, true);
    nav.addEventListener('pointerover', function (e) { var a = e.target.closest('.tb-link'); if (a) place(a); });
    nav.addEventListener('pointerleave', function () { place(home); });
    window.addEventListener('resize', function () { place(home, true); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { place(home, true); });
  })();

  /* ── Donnees modeles a la demande ──────────────────────────
     La palette doit trouver un modele depuis n'importe quelle page.
     Les pages qui n'ont pas charge data/pa-models.js le recoivent a
     la premiere ouverture. */
  function withModels(cb) {
    if (typeof MODELS !== 'undefined') return cb(MODELS);
    var s = document.querySelector('script[data-lazy-models]');
    if (!s) {
      s = document.createElement('script');
      s.setAttribute('src', 'data/pa-models.js');
      s.setAttribute('data-lazy-models', '');
      document.body.appendChild(s);
    }
    s.addEventListener('load', function () { cb(typeof MODELS !== 'undefined' ? MODELS : []); });
    s.addEventListener('error', function () { cb([]); });
  }

  /* ── Palette de commande ────────────────────────────────── */
  var PAGES = [
    ['pa-series.html', 'Comparateur PA-Series', 'comparer gamme explorer debit sessions', 'Outil'],
    ['pa-series.html?view=table', 'Tableau complet des PA-Series', 'tableau toutes les specs colonnes', 'Outil'],
    ['qualification.html', 'Dimensionner un firewall', 'etabli qualification sizing besoin utilisateurs', 'Outil'],
    ['optiques.html', 'Optiques et transceivers', 'sfp qsfp fibre transceiver optique', 'Outil'],
    ['accessoires.html', 'Alimentations et accessoires', 'alimentation rack disque ventilation', 'Outil'],
    ['search.html', 'Recherche par critère', 'recherche critere interface utilisateurs', 'Outil'],
    ['wizard.html', 'Mode guidé', 'wizard questions guide', 'Page'],
    ['panorama.html', 'Panorama', 'ngfw gestion centralisee', 'Portefeuille'],
    ['prisma.html', 'Prisma Access et SASE', 'sase prisma sd-wan', 'Portefeuille'],
    ['browser.html', 'Prisma Browser', 'navigateur browser', 'Portefeuille'],
    ['cortex.html', 'Cortex', 'xdr xsiam xsoar secops', 'Portefeuille'],
    ['idira.html', 'Idira', 'identite identity', 'Portefeuille'],
    ['resources.html', 'Ressources officielles', 'liens datasheets documentation', 'Page'],
    ['index.html', 'Accueil', 'accueil home', 'Page']
  ];

  var pal = null, palList = null, palInput = null, palItems = [], palIdx = 0, palReturn = null;

  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function gbps(v) { return v == null ? 'non publié' : String(v).replace('.', ',') + ' Gbps'; }
  function fmtK(n) {
    if (n == null) return 'non publié';
    if (n >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1).replace('.', ',') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1).replace('.', ',') + 'K';
    return String(n);
  }

  function buildPalette() {
    pal = document.createElement('div');
    pal.className = 'cmdk';
    pal.hidden = true;
    pal.innerHTML =
      '<div class="cmdk-scrim" data-close></div>'
    + '<div class="cmdk-box" role="dialog" aria-modal="true" aria-label="Palette de commande">'
    +   '<div class="cmdk-field">' + SVG(IC.find, 18)
    +     '<input id="cmdk-input" type="text" role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-autocomplete="list" autocomplete="off" spellcheck="false" aria-label="Chercher un modèle, un débit, un outil ou une page" placeholder="PA-3420, 10 Gbps, optiques, campus...">'
    +     '<button type="button" class="cmdk-x" data-close aria-label="Fermer la palette">Échap</button>'
    +   '</div>'
    +   '<div class="cmdk-sel" id="cmdk-sel" hidden></div>'
    +   '<ul class="cmdk-list" id="cmdk-list" role="listbox" aria-label="Résultats"></ul>'
    +   '<div class="cmdk-foot"><span><kbd>Entrée</kbd> ouvrir</span><span><kbd>Maj</kbd> + <kbd>Entrée</kbd> ajouter à la comparaison</span><span><kbd>Échap</kbd> fermer</span></div>'
    + '</div>';
    document.body.appendChild(pal);
    palList = pal.querySelector('#cmdk-list');
    palInput = pal.querySelector('#cmdk-input');
    pal.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) { closePalette(); return; }
      var add = e.target.closest('[data-add]');
      if (add) { e.preventDefault(); e.stopPropagation(); toggleModel(add.getAttribute('data-add')); palInput.focus(); return; }
      var chip = e.target.closest('[data-rm]');
      if (chip) { toggleModel(chip.getAttribute('data-rm')); palInput.focus(); return; }
      var li = e.target.closest('.cmdk-item');
      if (li) { palIdx = +li.getAttribute('data-i'); run(palItems[palIdx], e.shiftKey); }
    });
    palList.addEventListener('pointermove', function (e) {
      var li = e.target.closest('.cmdk-item');
      if (li && +li.getAttribute('data-i') !== palIdx) { palIdx = +li.getAttribute('data-i'); paintActive(true); }
    });
    palInput.addEventListener('input', function () { palIdx = 0; search(); });
    palInput.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); palIdx = Math.min(palItems.length - 1, palIdx + 1); paintActive(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); palIdx = Math.max(0, palIdx - 1); paintActive(); }
      else if (e.key === 'Enter') { e.preventDefault(); run(palItems[palIdx], e.shiftKey); }
    });
    pal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closePalette(); return; }
      // le focus reste dans la boite
      if (e.key === 'Tab') {
        var f = [].slice.call(pal.querySelectorAll('.cmdk-box button:not([tabindex="-1"]), .cmdk-box input, .cmdk-box a'));
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  function toggleModel(id) {
    var s = Sel.get(), i = s.indexOf(id);
    if (i !== -1) s.splice(i, 1);
    else { if (s.length >= 4) s.shift(); s.push(id); }
    Sel.set(s);
    paintSel();
    search(true);
    document.dispatchEvent(new CustomEvent('cmpsel', { detail: s }));
  }

  function paintSel() {
    var box = pal.querySelector('#cmdk-sel'), s = Sel.get();
    if (!s.length) { box.innerHTML = ''; box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = '<span class="cmdk-sel-k">Sélection</span>'
      + s.map(function (id) {
          return '<button type="button" class="cmdk-chip" data-rm="' + esc(id) + '" aria-label="Retirer ' + esc(id.replace(/^x:/, '')) + ' de la sélection">'
            + esc(id.replace(/^x:/, '')) + SVG(IC.close, 12) + '</button>';
        }).join('')
      + (s.length >= 2 ? '<a class="cmdk-go" href="pa-series.html?cmp=' + s.map(encodeURIComponent).join(',') + '">Comparer les ' + s.length + SVG(IC.arrow, 14) + '</a>' : '<span class="cmdk-hint">encore un modèle pour comparer</span>');
  }

  function search(keepIdx) {
    var q = norm(palInput.value.trim());
    var s = Sel.get();
    withModels(function (MS) {
      var items = [];
      var toks = q.split(/\s+/).filter(Boolean);
      /* Seuil chiffre : « 10 gbps », « 10g », « 500k » */
      var mG = q.match(/(\d+(?:[.,]\d+)?)(?:\s*(?:gb|gbps|gbit)|\s+g)\b/);
      var mS = q.match(/(\d+(?:[.,]\d+)?)\s*(k|m)\b/);
      var thr = null;
      if (mG) thr = { key: 'tp', v: parseFloat(mG[1].replace(',', '.')) };
      else if (mS) thr = { key: 'sess', v: parseFloat(mS[1].replace(',', '.')) * (mS[2] === 'm' ? 1e6 : 1e3) };
      if (thr) {
        MS.filter(function (m) { return !m.eos && m[thr.key] != null && m[thr.key] >= thr.v; })
          .sort(function (a, b) { return a[thr.key] - b[thr.key]; })
          .slice(0, 6)
          .forEach(function (m) { items.push({ t: 'model', m: m }); });
      } else if (toks.length) {
        var hits = MS.filter(function (m) {
          var hay = norm(m.id + ' ' + m.id.replace('PA-', '') + ' ' + m.s + ' ' + (m.target || '') + ' ' + m.f + (m.poe ? ' poe' : '') + (m.eos ? ' eos end of sale' : ''));
          return toks.every(function (t) { return hay.indexOf(t) !== -1; });
        });
        // les correspondances par le debut du numero passent devant
        var rank = function (m) { return norm(m.id).indexOf(q) === 0 || norm(m.id.replace('PA-', '')).indexOf(q) === 0 ? 0 : 1; };
        hits.sort(function (a, b) { return rank(a) - rank(b); });
        hits.slice(0, 8).forEach(function (m) { items.push({ t: 'model', m: m }); });
      }
      if (s.length >= 2) items.unshift({ t: 'go', label: 'Comparer la sélection', sub: s.map(function (k) { return k.replace(/^x:/, ''); }).join(', '), href: 'pa-series.html?cmp=' + s.map(encodeURIComponent).join(',') });
      PAGES.forEach(function (p) {
        if (!toks.length || toks.every(function (t) { return norm(p[1] + ' ' + p[2]).indexOf(t) !== -1; })) {
          items.push({ t: 'page', href: p[0], label: p[1], sub: p[3] });
        }
      });
      if (!toks.length || 'basculer theme sombre clair'.indexOf(q) !== -1) items.push({ t: 'act', label: 'Basculer le thème', sub: 'Action', fn: function () { window.toggleTheme(); closePalette(); } });
      if (s.length && (!toks.length || 'vider la selection'.indexOf(q) !== -1)) items.push({ t: 'act', label: 'Vider la sélection', sub: 'Action', fn: function () { Sel.set([]); paintSel(); search(); document.dispatchEvent(new CustomEvent('cmpsel', { detail: [] })); } });
      palItems = items;
      if (!keepIdx) palIdx = 0;
      palIdx = Math.min(palIdx, Math.max(0, items.length - 1));
      render(s, thr);
    });
  }

  function render(s, thr) {
    var lastGroup = '';
    var html = palItems.map(function (it, i) {
      var g = it.t === 'model' ? (thr ? 'Modèles à partir de ' + (thr.key === 'tp' ? gbps(thr.v) + ' en Threat Prevention' : fmtK(thr.v) + ' sessions') : 'Modèles')
        : it.t === 'go' ? 'Comparaison' : it.t === 'act' ? 'Actions' : 'Pages et outils';
      var head = g !== lastGroup ? '<li class="cmdk-group" role="presentation">' + g + '</li>' : '';
      lastGroup = g;
      var id = 'cmdk-o' + i;
      if (it.t === 'model') {
        var m = it.m, on = s.indexOf(m.id) !== -1;
        return head + '<li class="cmdk-item is-model' + (on ? ' is-on' : '') + '" role="option" id="' + id + '" data-i="' + i + '" aria-selected="false">'
          + '<span class="cmdk-name">' + esc(m.id) + (m.eos ? ' <span class="cmdk-eos">EoS</span>' : '') + '</span>'
          + '<span class="cmdk-meta">' + esc(m.s) + ' · ' + esc(m.target || '') + '</span>'
          + '<span class="cmdk-num"><b>' + gbps(m.tp) + '</b> TP · ' + fmtK(m.sess) + ' sessions</span>'
          + '<button type="button" class="cmdk-add" tabindex="-1" data-add="' + esc(m.id) + '" aria-label="' + (on ? 'Retirer ' : 'Ajouter ') + esc(m.id) + (on ? ' de' : ' à') + ' la comparaison">' + SVG(on ? IC.check : IC.plus, 14) + '</button>'
          + '</li>';
      }
      return head + '<li class="cmdk-item" role="option" id="' + id + '" data-i="' + i + '" aria-selected="false">'
        + '<span class="cmdk-name">' + esc(it.label) + '</span><span class="cmdk-meta">' + esc(it.sub || '') + '</span></li>';
    }).join('');
    if (!palItems.length) html = '<li class="cmdk-empty" role="presentation">Rien ne correspond. Essayez un numéro (3420), un débit (10 Gbps) ou un usage (campus).</li>';
    palList.innerHTML = html;
    paintActive();
  }

  function paintActive(noScroll) {
    var els = palList.querySelectorAll('.cmdk-item');
    for (var i = 0; i < els.length; i++) {
      var on = +els[i].getAttribute('data-i') === palIdx;
      els[i].classList.toggle('is-active', on);
      els[i].setAttribute('aria-selected', on ? 'true' : 'false');
      if (on) { palInput.setAttribute('aria-activedescendant', els[i].id); if (!noScroll) els[i].scrollIntoView({ block: 'nearest' }); }
    }
  }

  function run(it, add) {
    if (!it) return;
    if (it.t === 'model') {
      if (add) { toggleModel(it.m.id); return; }
      var s = Sel.get();
      if (s.indexOf(it.m.id) === -1) { if (s.length >= 4) s.shift(); s.push(it.m.id); Sel.set(s); }
      go(s.length >= 2 ? 'pa-series.html?cmp=' + s.map(encodeURIComponent).join(',') : 'pa-series.html?focus=' + encodeURIComponent(it.m.id));
      return;
    }
    if (it.t === 'act') { it.fn(); return; }
    go(it.href);
  }
  function go(href) {
    // meme page : le comparateur ecoute le changement plutot que de recharger
    if (page === 'pa-series.html' && /^pa-series\.html/.test(href) && window.CmpPage) { closePalette(); window.CmpPage.route(href); return; }
    location.href = href;
  }

  function openPalette(prefill) {
    if (!pal) buildPalette();
    palReturn = document.activeElement;
    pal.hidden = false;
    document.documentElement.classList.add('cmdk-on');
    palInput.value = prefill || '';
    paintSel();
    search();
    palInput.focus();
    if (window.gsap && !reduce) {
      gsap.fromTo(pal.querySelector('.cmdk-box'), { y: -14, scale: .985, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .35, ease: 'power3.out' });
      gsap.fromTo(pal.querySelector('.cmdk-scrim'), { opacity: 0 }, { opacity: 1, duration: .25 });
    }
  }
  function closePalette() {
    if (!pal || pal.hidden) return;
    var done = function () {
      pal.hidden = true;
      document.documentElement.classList.remove('cmdk-on');
      if (palReturn && palReturn.focus && document.contains(palReturn)) palReturn.focus();
    };
    if (window.gsap && !reduce) {
      gsap.to(pal.querySelector('.cmdk-box'), { y: -8, opacity: 0, duration: .16, ease: 'power2.in', onComplete: done });
      gsap.to(pal.querySelector('.cmdk-scrim'), { opacity: 0, duration: .16 });
    } else done();
  }
  window.Palette = { open: openPalette, close: closePalette };

  var trig = document.getElementById('cmdk-open');
  if (trig) trig.addEventListener('click', function () { openPalette(); });

  /* ── Menu mobile (feuille) ──────────────────────────────── */
  var sheet = null;
  function openSheet() {
    if (!sheet) {
      sheet = document.createElement('div');
      sheet.className = 'sheet';
      sheet.hidden = true;
      sheet.innerHTML = '<div class="cmdk-scrim" data-close></div>'
        + '<div class="sheet-box" role="dialog" aria-modal="true" aria-label="Menu">'
        + '<button type="button" class="sheet-search" data-search>' + SVG(IC.find, 16) + 'Chercher un modèle ou une page</button>'
        + '<p class="sheet-k">Outils</p>' + TOOLS.map(function (t) { return '<a class="sheet-link" href="' + t.href + '"' + cur(t.href) + '>' + SVG(IC[t.ic], 18) + t.label + '</a>'; }).join('')
        + '<p class="sheet-k">Portefeuille</p>' + PILLARS.concat(MORE).map(function (p) { return '<a class="sheet-link" href="' + p.href + '"' + cur(p.href) + '>' + p.label + (p.sub ? ' <span class="pf-sub">' + p.sub + '</span>' : '') + '</a>'; }).join('')
        + '<button type="button" class="sheet-close" data-close>Fermer</button>'
        + '</div>';
      document.body.appendChild(sheet);
      sheet.addEventListener('click', function (e) {
        if (e.target.closest('[data-search]')) { closeSheet(true); openPalette(); }
        else if (e.target.closest('[data-close]')) closeSheet();
      });
      sheet.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
    }
    sheet.hidden = false;
    document.documentElement.classList.add('cmdk-on');
    sheet.querySelector('.sheet-search').focus();
    if (window.gsap && !reduce) gsap.fromTo(sheet.querySelector('.sheet-box'), { yPercent: 100 }, { yPercent: 0, duration: .4, ease: 'power3.out' });
  }
  function closeSheet(silent) {
    if (!sheet) return;
    sheet.hidden = true;
    document.documentElement.classList.remove('cmdk-on');
    var m = document.getElementById('dock-more');
    if (m && !silent) m.focus();
  }
  var more = document.getElementById('dock-more');
  if (more) more.addEventListener('click', openSheet);

  /* ── Raccourcis globaux ─────────────────────────────────── */
  function typing(t) {
    return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
  }
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (pal && !pal.hidden) closePalette(); else openPalette();
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey || typing(e.target)) return;
    if (document.documentElement.classList.contains('cmdk-on')) return;
    if (e.key === '/') { e.preventDefault(); openPalette(); }
    else if ((e.key === 'c' || e.key === 'C') && page !== 'pa-series.html') { location.href = 'pa-series.html'; }
    else if ((e.key === 'd' || e.key === 'D') && page !== 'qualification.html') { location.href = 'qualification.html'; }
  });
})();
