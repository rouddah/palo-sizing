/* Interface de l'assistant de remplacement (remplacement.html).
   Le calcul vit dans js/replace-engine.js ; ici : etapes, saisie,
   pre-remplissage depuis le boitier actuel, rendu des trois propositions,
   etat dans l'URL (lien partageable). */
(function () {
  'use strict';
  var E = window.ReplaceEngine;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var num = function (n, d) { return n == null ? 'non publié' : (+n).toLocaleString('fr-FR', { maximumFractionDigits: d == null ? 1 : d }); };
  var gb = function (n) { return n == null ? 'non publié' : num(n) + ' Gbps'; };
  var big = function (n) { return n == null ? 'non publié' : fmtN(Math.round(n)); };

  var COMP = typeof COMPETITORS !== 'undefined' ? COMPETITORS : { vendors: [], models: [] };
  var CHASSIS = typeof PA_CHASSIS !== 'undefined' ? PA_CHASSIS : {};
  var VEND = {}; COMP.vendors.forEach(function (v) { VEND[v.id] = v; });

  /* Boitiers de reference : tous les PA (fins de vente comprises, ce sont
     souvent eux qu'on remplace) et tous les concurrents. */
  var REFS = MODELS.map(function (m) {
    return { key: m.id, v: 'pan', vname: 'Palo Alto', name: m.id, sub: m.s + (m.eos ? ' · fin de vente' : ''), m: m };
  }).concat(COMP.models.map(function (c) {
    return { key: 'x:' + c.id, v: c.v, vname: VEND[c.v] ? VEND[c.v].name : c.v, name: c.s, sub: (VEND[c.v] ? VEND[c.v].name : c.v), m: c };
  }));
  var byKey = {}; REFS.forEach(function (r) { byKey[r.key] = r; });
  var norm = function (s) { return String(s).toLowerCase().replace(/fortigate|quantum|force|firepower|secure firewall/g, function (w) { return w; }).replace(/[\s\-_]/g, ''); };

  /* Commande CLI qui donne l'usage reel (sessions en cours) sur le boitier
     du client : a relever avant de valider le dimensionnement. */
  var SESS_CMD = { pan: 'show session info', fortinet: 'get system session status', checkpoint: 'fw tab -t connections -s', cisco: 'show conn count' };

  var STEPS = ['kind', 'old', 'perf', 'ports', 'cons'];
  var q = blank();
  var vendor = 'all', shown = false;

  function blank() {
    return { old: null, tp: '', sess: '', cps: '', vpn: '', grow: 0, ports: { cu1: '', cu25: '', cu10: '', sfp1: '', sfp10: '', sfp25: '', sfp100: '', sfp400: '' }, ha: 'none', form: 'any', vsys: 1, poe: 0, cell: false, psu: false };
  }

  /* ── Etapes ─────────────────────────────────────────────── */
  var stepEls = Array.prototype.slice.call(document.querySelectorAll('.rp-step'));
  var done = {};
  function open(name, focus) {
    stepEls.forEach(function (el) { el.classList.toggle('is-open', el.dataset.step === name); });
    var el = stepEls.find(function (s) { return s.dataset.step === name; });
    if (el && focus !== false) {
      var r = el.getBoundingClientRect();
      if (r.top < 70 || r.top > innerHeight * 0.6) window.scrollTo({ top: scrollY + r.top - 80, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      var f = el.querySelector('.rp-body input, .rp-body button');
      if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 60);
    }
  }
  function markDone(name) {
    done[name] = true;
    var el = stepEls.find(function (s) { return s.dataset.step === name; });
    el.classList.add('is-done');
    el.querySelector('.rp-sum').textContent = summary(name);
  }
  stepEls.forEach(function (el) {
    el.querySelector('.rp-head').addEventListener('click', function () {
      if (done[el.dataset.step] || el.classList.contains('is-open')) open(el.dataset.step);
    });
    el.querySelector('[data-next]').addEventListener('click', function () { next(el.dataset.step); });
  });

  function next(name) {
    read();
    if (name === 'kind' && $('rp-kind').querySelector('[aria-pressed="true"]').dataset.v !== 'hw') return;
    if (name === 'perf' && !(+q.tp > 0)) { $('rp-perf-err').textContent = 'Indiquez le débit avec inspection.'; $('f-tp').focus(); return; }
    $('rp-perf-err').textContent = '';
    markDone(name);
    var i = STEPS.indexOf(name);
    var following = STEPS.slice(i + 1).find(function (s) { return !done[s]; });
    if (following) open(following);
    else { stepEls.forEach(function (s) { s.classList.remove('is-open'); }); show(true); }
    if (shown) show(false);
  }

  function summary(name) {
    if (name === 'kind') return 'Boîtier physique';
    if (name === 'old') return q.old ? byKey[q.old].vname + ' · ' + byKey[q.old].name : 'Sans boîtier de référence';
    if (name === 'perf') {
      var s = [gb(+q.tp) + ' inspectés'];
      if (+q.sess) s.push(big(+q.sess) + ' sessions');
      if (+q.cps) s.push(big(+q.cps) + ' CPS');
      if (+q.vpn) s.push(gb(+q.vpn) + ' VPN');
      if (+q.grow) s.push('croissance +' + q.grow + ' %');
      return s.join(' · ');
    }
    if (name === 'ports') {
      var p = E.PORT_KEYS.filter(function (k) { return +q.ports[k] > 0; }).map(function (k) { return q.ports[k] + ' × ' + E.PORT_LABEL[k]; });
      return p.length ? p.join(' · ') : 'Aucune contrainte d’interface';
    }
    if (name === 'cons') {
      var c = [{ none: 'boîtier seul', ap: 'HA actif/passif', aa: 'HA actif/actif', cl: 'clustering' }[q.ha],
        { any: 'format indifférent', desk: 'bureau', rack: 'rack', rug: 'durci' }[q.form]];
      if (q.vsys > 1) c.push(q.vsys + ' vsys');
      if (q.poe > 0) c.push(q.poe + ' ports PoE');
      if (q.cell) c.push('5G');
      if (q.psu) c.push('alimentation redondante');
      return c.join(' · ');
    }
    return '';
  }

  /* ── Choix en tuiles ────────────────────────────────────── */
  function tiles(id, key) {
    var box = $(id);
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.rp-choice'); if (!b) return;
      if (b.getAttribute('aria-disabled') === 'true') { if (id === 'rp-kind') $('rp-sw-note').hidden = false; return; }
      if (id === 'rp-kind') $('rp-sw-note').hidden = true;
      box.querySelectorAll('.rp-choice').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      if (key) { q[key] = b.dataset.v; changed(); }
    });
  }
  function setTiles(id, v) { $(id).querySelectorAll('.rp-choice').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.v === v)); }); }
  tiles('rp-kind'); tiles('c-ha', 'ha'); tiles('c-form', 'form');

  /* ── Boitier actuel ─────────────────────────────────────── */
  var VLIST = [['all', 'Tous'], ['pan', 'Palo Alto']].concat(COMP.vendors.map(function (v) { return [v.id, v.name]; }));
  $('rp-vendors').innerHTML = VLIST.map(function (v) { return '<button type="button" class="rp-vendor" data-v="' + v[0] + '" aria-pressed="' + (v[0] === 'all') + '">' + esc(v[1]) + '</button>'; }).join('');
  $('rp-vendors').addEventListener('click', function (e) {
    var b = e.target.closest('.rp-vendor'); if (!b) return;
    vendor = b.dataset.v;
    $('rp-vendors').querySelectorAll('.rp-vendor').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    list();
  });
  $('rp-q').addEventListener('input', list);
  $('rp-q').addEventListener('keydown', function (e) {
    var opts = $('rp-list').querySelectorAll('.rp-opt');
    if (e.key === 'ArrowDown' && opts.length) { e.preventDefault(); opts[0].focus(); }
    if (e.key === 'Enter' && opts.length) { e.preventDefault(); pick(opts[0].dataset.k); }
  });
  $('rp-list').addEventListener('keydown', function (e) {
    var a = document.activeElement; if (!a || !a.classList.contains('rp-opt')) return;
    var li = a.parentElement;
    if (e.key === 'ArrowDown' && li.nextElementSibling) { e.preventDefault(); li.nextElementSibling.firstChild.focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); if (li.previousElementSibling) li.previousElementSibling.firstChild.focus(); else $('rp-q').focus(); }
  });
  $('rp-list').addEventListener('click', function (e) { var b = e.target.closest('.rp-opt'); if (b) pick(b.dataset.k); });
  $('rp-noold').addEventListener('click', function () { pick(null); next('old'); });

  function list() {
    var t = norm($('rp-q').value.trim());
    if (!t && vendor === 'all') { $('rp-list').innerHTML = ''; return; }
    var hits = REFS.filter(function (r) {
      if (vendor !== 'all' && r.v !== vendor) return false;
      return !t || norm(r.name + ' ' + r.vname + ' ' + r.m.id).indexOf(t) !== -1;
    }).slice(0, 60);
    $('rp-list').innerHTML = hits.length ? hits.map(function (r) {
      return '<li><button type="button" class="rp-opt" role="option" data-k="' + esc(r.key) + '" aria-selected="' + (q.old === r.key) + '"><span><b>' + esc(r.name) + '</b><small>' + esc(r.sub) + '</small></span>'
        + '<span class="rp-m">' + gb(r.m.tp) + ' inspectés</span></button></li>';
    }).join('') : '<li class="rp-empty" style="padding:12px 14px">Aucun boîtier ne correspond. Continuez sans référence et saisissez les besoins.</li>';
  }

  function pick(key) {
    q.old = key;
    var r = key && byKey[key];
    var box = $('rp-picked');
    if (!r) { box.hidden = true; prefill(null); return; }
    box.hidden = false;
    box.innerHTML = '<b>' + esc(r.name) + '</b><span>' + esc(r.vname) + ' · ' + gb(r.m.tp) + ' inspectés · '
      + (r.v === 'pan' ? big(r.m.sess) + ' sessions' : esc(r.m.ports || '')) + '</span>';
    $('rp-list').innerHTML = '';
    $('rp-q').value = '';
    prefill(r);
  }

  /* Pre-remplissage : ecrase les champs a chaque nouveau boitier, les
     marque (bordure accent) jusqu'a ce que l'utilisateur les modifie. */
  function setPre(id, v) { var el = $(id); el.value = v == null || v === 0 ? '' : v; el.classList.toggle('is-pre', !(v == null || v === 0)); }
  function prefill(r) {
    var m = r && r.m, pan = r && r.v === 'pan';
    var vm = r && !pan ? VEND[r.v] : null;
    setPre('f-tp', m ? m.tp : null);
    setPre('f-vpn', pan ? m.vpn : null);
    setPre('f-sess', pan ? m.sess : null);
    setPre('f-cps', pan ? m.cps : null);
    $('h-tp').textContent = !m ? 'Threat Prevention, App-ID actif' : pan ? m.id + ' : Threat Prevention appmix de la datasheet' : 'Repris de la mesure ' + r.vname + ' (voir ci-dessous)';
    $('h-sess').textContent = !m ? 'Facultatif' : pan ? 'Capacité du ' + m.id : r.name + ' annonce ' + big(m.sess) + ' : non repris, c’est un maximum mesuré autrement';
    $('h-cps').textContent = !m ? 'Facultatif' : pan ? 'Capacité du ' + m.id : r.name + ' annonce ' + big(m.cps) + ' : non repris';
    $('h-vpn').textContent = !m ? 'Facultatif' : pan ? 'Capacité du ' + m.id : r.name + ' annonce ' + gb(m.vpn) + ' : non repris (mesure ' + r.vname + ', souvent avec accélération matérielle)';
    $('rp-perf-note').innerHTML = vm
      ? '<b>Mesures non équivalentes.</b> ' + esc(r.vname) + ' publie le débit d’inspection ainsi : ' + esc(vm.metrics.tp) + '. Les PA-Series sont mesurés en Threat Prevention appmix. Si vous connaissez le débit réellement constaté chez le client, remplacez la valeur. Sessions en cours sur le boîtier : <code>' + esc(SESS_CMD[r.v] || '') + '</code>.'
      : pan ? 'Les valeurs sont les capacités datasheet du ' + esc(m.id) + ' : la proposition iso couvrira au moins autant. Si le client consomme moins, baissez-les.' : '';
    var need = m ? E.portsNeedFrom(m) : {};
    E.PORT_KEYS.forEach(function (k) { setPre('p-' + k, need[k] || null); });
    $('rp-ports-note').innerHTML = m
      ? 'Pré-rempli avec tous les ports de données du ' + esc(r.name) + (m.ports || m.io ? ' (' + esc(m.ports || m.io) + ')' : '') + '. <b>Retirez ceux qui ne sont pas câblés</b> : un port inutile peut faire monter la proposition d’un cran.'
      : '';
    var cell = !!(m && /5G/.test(m.id));
    $('c-cell').checked = cell;
    setPre('c-poe', m && m.poeP ? m.poeP : null);
    if (m && E.isRugged(m)) setTiles('c-form', 'rug');
    read();
    changed();
  }
  document.addEventListener('input', function (e) {
    if (e.target.classList && e.target.classList.contains('is-pre')) e.target.classList.remove('is-pre');
    if (e.target.closest && e.target.closest('.rp-body') && e.target.id !== 'rp-q') { read(); changed(); }
  });
  document.addEventListener('change', function (e) { if (e.target.closest && e.target.closest('.rp-body')) { read(); changed(); } });

  function read() {
    q.tp = $('f-tp').value; q.sess = $('f-sess').value; q.cps = $('f-cps').value; q.vpn = $('f-vpn').value;
    q.grow = +$('f-grow').value || 0;
    E.PORT_KEYS.forEach(function (k) { q.ports[k] = Math.max(0, parseInt($('p-' + k).value, 10) || 0); });
    q.vsys = Math.max(1, parseInt($('c-vsys').value, 10) || 1);
    q.poe = Math.max(0, parseInt($('c-poe').value, 10) || 0);
    q.cell = $('c-cell').checked; q.psu = $('c-psu').checked;
    var ha = $('c-ha').querySelector('[aria-pressed="true"]'); q.ha = ha ? ha.dataset.v : 'none';
    var fo = $('c-form').querySelector('[aria-pressed="true"]'); q.form = fo ? fo.dataset.v : 'any';
  }

  var raf = 0;
  function changed() {
    STEPS.forEach(function (s) { if (done[s]) stepEls.find(function (x) { return x.dataset.step === s; }).querySelector('.rp-sum').textContent = summary(s); });
    if (!shown) return;
    cancelAnimationFrame(raf); raf = requestAnimationFrame(function () { show(false); });
  }

  /* ── Propositions ───────────────────────────────────────── */
  var R = null;
  function show(scroll) {
    if (!(+q.tp > 0)) return;
    shown = true;
    R = E.propose(MODELS, q);
    var ref = q.old && byKey[q.old];
    $('rp-res').hidden = false;
    $('rp-res-sub').textContent = 'Besoin retenu : ' + gb(R.need.tp) + ' inspectés'
      + (R.need.sess ? ', ' + big(R.need.sess) + ' sessions' : '') + (R.need.cps ? ', ' + big(R.need.cps) + ' CPS' : '')
      + (R.need.vpn ? ', ' + gb(R.need.vpn) + ' VPN' : '') + (q.grow ? ' (croissance +' + q.grow + ' % comprise)' : '')
      + '. ' + R.pool.length + ' PA-Series respectent vos contraintes de HA, format et vsys ; les interfaces départagent.';
    var cols = [['lower', 'N-1', 'Au plus juste'], ['iso', 'Iso', 'Équivalent'], ['upper', 'N+1', 'Avec marge']];
    $('rp-cols').innerHTML = cols.map(function (c) { return col(c[0], c[1], c[2], R[c[0]], ref); }).join('');
    $('rp-warn').innerHTML = warn(ref);
    var keys = [ref ? ref.key : null, R.lower && R.lower.id, R.iso && R.iso.id, R.upper && R.upper.id].filter(Boolean).slice(0, 4);
    $('rp-cmp').href = 'pa-series.html?cmp=' + keys.map(encodeURIComponent).join(',') + (ref && ref.v !== 'pan' ? '&vendors=' + ref.v : '');
    $('rp-cmp').hidden = keys.length < 2;
    saveUrl();
    if (window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.from('#rp-cols .rp-col', { opacity: 0, y: 10, duration: .4, stagger: .06, ease: 'power2.out', clearProps: 'all' });
    }
    if (scroll) { var t = $('rp-res').getBoundingClientRect().top + scrollY - 80; window.scrollTo({ top: t, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }
  }

  function photo(m) {
    var c = CHASSIS[m.id.toLowerCase()];
    return c ? '<img src="' + esc(c.img) + '" alt="Face avant ' + esc(m.id) + '" width="' + c.w + '" height="' + c.h + '">' : '';
  }
  function haTxt(m) {
    var t = [];
    if (m.haAP) t.push('A/P');
    if (m.haAA === true) t.push('A/A');
    if (m.haCl) t.push('cluster');
    return t.length ? t.join(', ') : 'non publié';
  }

  function col(slot, role, roleName, m, ref) {
    var txt = {
      lower: R.iso ? 'Moins de capacité que le besoin saisi. Pour un usage réel nettement inférieur, ou un budget serré.' : 'Le plus gros PA-Series compatible avec vos contraintes. Il ne couvre pas toute la volumétrie.',
      iso: 'Couvre toute la volumétrie, avec le meilleur raccordement possible sans surdimensionner.',
      upper: 'Le cran au-dessus : marge pour la croissance, le déchiffrement et les nouveaux services.'
    }[slot];
    if (slot === 'lower' && m && R.iso && E.coverage(m, R.need).every(function (c) { return c.ratio == null || c.ratio >= 1; }))
      txt = 'Plus petit que l’iso : couvre aussi la volumétrie, avec moins d’interfaces. Si le câblage peut être revu.';
    var h = '<div class="rp-col' + (slot === 'iso' ? ' is-iso' : '') + (m && R.pick === slot ? ' is-pick' : '') + '"><div class="rp-role">' + role + ' · ' + roleName + (m && R.pick === slot ? '<span class="rp-badge">Conseillé</span>' : '') + '</div><div class="rp-role-txt">' + txt + '</div>';
    if (!m) {
      var why = slot === 'lower' ? (R.iso ? 'Aucun PA-Series plus petit ne tient vos interfaces et contraintes : l’iso est déjà l’entrée de gamme possible.' : 'Aucun PA-Series ne tient toutes vos contraintes.')
        : slot === 'iso' ? (R.pool.length ? 'Aucun PA-Series ne couvre toute la volumétrie demandée avec ces contraintes. Au-delà : PA-7500, clustering ou plusieurs boîtiers, à étudier avec l’avant-vente.' : blockersTxt())
        : (R.iso ? 'L’iso est déjà le plus gros modèle compatible.' : '');
      return h + '<p class="rp-empty">' + esc(why) + '</p></div>';
    }
    var cov = E.coverage(m, R.need);
    var load = R.need.tp / m.tp, pct = Math.round(load * 100);
    var lc = load > 1 ? ' is-crit' : load > 0.8 ? ' is-warn' : '';
    h += '<div class="rp-ph">' + photo(m) + '</div>'
      + '<div class="rp-name"><a href="pa-series.html?focus=' + encodeURIComponent(m.id) + '">' + esc(m.id) + '</a></div>'
      + '<div class="rp-meta">' + esc(m.s) + ' · ' + esc(m.target) + ' · ' + esc(m.f) + '</div>'
      + '<dl class="rp-kv">'
      + '<dt>Threat Prevention</dt><dd>' + gb(m.tp) + '</dd>'
      + '<dt>Firewall App-ID</dt><dd>' + gb(m.fw) + '</dd>'
      + '<dt>Sessions</dt><dd>' + big(m.sess) + '</dd>'
      + '<dt>CPS</dt><dd>' + big(m.cps) + '</dd>'
      + '<dt>VPN IPsec</dt><dd>' + gb(m.vpn) + '</dd>'
      + '<dt>vsys max</dt><dd>' + E.vsysMax(m) + '</dd>'
      + '<dt>HA</dt><dd>' + haTxt(m) + '</dd>'
      + (m.poeP ? '<dt>PoE</dt><dd>' + m.poeP + ' ports' + (m.poeW ? ', ' + m.poeW + ' W' : '') + '</dd>' : '')
      + '</dl>'
      + '<p class="rp-io"><span>Ports de données</span>' + esc(m.io) + '</p>'
      + '<div class="rp-load' + lc + '"><i style="transform:scaleX(' + Math.min(1, load).toFixed(3) + ')"></i></div>'
      + '<div class="rp-load-t">Charge au débit visé : ' + pct + ' %</div>';
    var li = [];
    cov.forEach(function (c) {
      if (c.ratio == null) li.push(['is-info', c.label + ' : non publié par la datasheet']);
      else if (c.ratio < 1) li.push(['is-short', 'Couvre ' + Math.round(c.ratio * 100) + ' % ' + (c.k === 'tp' ? 'du ' : c.k === 'vpn' ? 'du ' : 'des ') + c.label + ' visé' + (c.k === 'sess' ? 'es' : '') + ' (' + fmtVal(c.k, c.have) + ' pour ' + fmtVal(c.k, c.want) + ')']);
    });
    if (!li.some(function (x) { return x[0] === 'is-short'; })) li.push(['', 'Couvre toute la volumétrie demandée']);
    fitLines(R.fit(m)).forEach(function (x) { li.push(x); });
    if (ref && ref.v === 'pan' && ref.m.tp) {
      var d = Math.round((m.tp / ref.m.tp - 1) * 100);
      li.push(['is-info', (d >= 0 ? '+' : '') + d + ' % de Threat Prevention par rapport au ' + ref.m.id]);
    }
    if (m.panosMin) li.push(['is-info', 'PAN-OS ' + m.panosMin + ' minimum']);
    return h + '<ul class="rp-why">' + li.map(function (x) { return '<li class="' + x[0] + '">' + esc(x[1]) + '</li>'; }).join('') + '</ul></div>';
  }
  /* Raccordement : natif, avec optiques cuivre, ou ports manquants. */
  function fitLines(f) {
    var out = [], pf = f.ports;
    var asked = E.PORT_KEYS.some(function (k) { return q.ports[k] > 0; });
    if (asked && pf.level === 0) out.push(['', 'Toutes les interfaces en ports natifs']);
    if (pf.adapt.cg) out.push(['is-info', pf.adapt.cg + ' cuivre 1G sur cage SFP ou SFP+, avec l’optique PAN-SFP-CG']);
    if (pf.adapt.t10) out.push(['is-info', pf.adapt.t10 + ' cuivre 10G sur cage SFP+, avec l’optique PAN-L-SFP-PLUS-10GBASE-T']);
    if (pf.level === 1 && !pf.missing) out.push(['', 'Toutes les interfaces se raccordent']);
    if (pf.missing) out.push(['is-short', 'Manque ' + Object.keys(pf.short).map(function (k) { return pf.short[k] + ' × ' + E.PORT_LABEL[k]; }).join(', ') + ' : à reprendre sur un switch, ou modèle au-dessus']);
    if (f.poeShort) out.push(['is-short', 'PoE : ' + (q.poe - f.poeShort) + ' ports pour ' + q.poe + ' demandés, compléter par un switch ou des injecteurs PoE']);
    if (f.poeUnknown) out.push(['is-info', 'PoE présent, nombre de ports PoE non publié']);
    if (!asked && !q.poe) out.push(['', 'Contraintes tenues']);
    return out;
  }
  function fmtVal(k, v) { return k === 'tp' || k === 'vpn' ? gb(v) : big(v); }

  function blockersTxt() {
    var names = { 'variante 5G': 'les variantes 5G', 'vsys': 'le nombre de vsys', 'PoE': 'les ports PoE', 'HA A/P': 'la HA actif/passif', 'HA A/A': 'la HA actif/actif', 'clustering': 'le clustering', '5G': 'le modem 5G', 'alimentation': 'l’alimentation redondante', 'pas durci': 'le format durci', 'gamme durcie': 'le format', 'pas de bureau': 'le format bureau', 'pas en rack': 'le format rack' };
    var top = Object.keys(R.blockers).sort(function (a, b) { return R.blockers[b] - R.blockers[a]; }).slice(0, 3).map(function (k) { return names[k] || k; });
    return 'Aucun PA-Series ne tient toutes ces contraintes. Ce qui bloque le plus souvent : ' + top.join(', ') + '. Assouplissez une contrainte ou voyez l’avant-vente.';
  }

  function warn(ref) {
    var t = '<b>Propositions indicatives, à valider avec un avant-vente avant toute offre.</b> Calcul sur les chiffres datasheet PA-Series (Threat Prevention appmix, sans déchiffrement) : le profil de trafic réel, la part de trafic déchiffré, les services activés et la rétention des journaux peuvent faire monter d’un cran. Aucun prix ni référence de commande.';
    if (ref && ref.v !== 'pan') t += ' Le ' + esc(ref.name) + ' est mesuré par ' + esc(ref.vname) + ' avec un autre protocole : l’équivalence porte sur le débit saisi, pas sur une conversion.';
    if (ref && ref.v !== 'pan' && ref.m.sess && !(+q.sess > 0)) {
      var props = [R.lower, R.iso, R.upper].filter(Boolean);
      var lo = props.length ? Math.min.apply(null, props.map(function (m) { return m.sess; })) : 0;
      if (props.length && ref.m.sess > lo) t += ' <b>Sessions :</b> le ' + esc(ref.name) + ' annonce ' + big(ref.m.sess) + ' sessions simultanées (maximum ' + esc(ref.vname) + '), les propositions en tiennent ' + big(lo) + ' à ' + big(Math.max.apply(null, props.map(function (m) { return m.sess; }))) + '. Relevez l’usage réel sur le boîtier (<code>' + esc(SESS_CMD[ref.v]) + '</code>) et saisissez-le à l’étape 3.';
    }
    if (R.pick === 'upper' && R.iso && R.need.tp / R.iso.tp > 0.8) t += ' Le N+1 est conseillé : l’iso tournerait au-delà de 80 % de sa capacité datasheet.';
    if (q.ha === 'ap' || q.ha === 'aa') t += ' Haute disponibilité : prévoir deux boîtiers identiques.';
    if (q.ha === 'cl') t += ' Clustering : nombre de membres et version PAN-OS à confirmer par modèle.';
    var gone = MODELS.filter(function (m) { return !m.eos && m.eosD; }).map(function (m) { return m.s; });
    if (gone.length) t += ' Non proposés : modèles dont la fin de vente est annoncée (' + Array.from(new Set(gone)).join(', ') + ').';
    return t;
  }

  /* ── Texte a copier, lien, impression ───────────────────── */
  function plain() {
    var ref = q.old && byKey[q.old];
    var L = ['Proposition de remplacement PA-Series (indicative, à valider avec un avant-vente)', ''];
    L.push('Boîtier actuel : ' + (ref ? ref.vname + ' ' + ref.name : 'non renseigné'));
    STEPS.slice(2).forEach(function (s) { L.push('- ' + summary(s)); });
    L.push('');
    [['lower', 'N-1 au plus juste'], ['iso', 'Iso équivalent'], ['upper', 'N+1 avec marge']].forEach(function (x) {
      var m = R[x[0]];
      L.push(x[1] + (R.pick === x[0] ? ' (conseillé)' : '') + ' : ' + (m ? m.id + ' (' + gb(m.tp) + ' Threat Prevention, ' + big(m.sess) + ' sessions, charge ' + Math.round(R.need.tp / m.tp * 100) + ' %)' : 'aucun'));
    });
    L.push('', 'Chiffres datasheet Palo Alto, sans déchiffrement. Lien : ' + location.href);
    return L.join('\n');
  }
  function toast(s) { $('rp-toast').textContent = s; setTimeout(function () { $('rp-toast').textContent = ''; }, 2500); }
  function copy(s, ok) {
    if (navigator.clipboard) navigator.clipboard.writeText(s).then(function () { toast(ok); }, function () { toast('Copie impossible'); });
  }
  $('rp-copy').addEventListener('click', function () { copy(plain(), 'Proposition copiée'); });
  $('rp-link').addEventListener('click', function () { copy(location.href, 'Lien copié'); });
  $('rp-print').addEventListener('click', function () { window.print(); });
  $('rp-reset').addEventListener('click', function () { location.href = location.pathname; });

  function saveUrl() {
    var p = new URLSearchParams();
    if (q.old) p.set('old', q.old);
    ['tp', 'sess', 'cps', 'vpn'].forEach(function (k) { if (+q[k]) p.set(k, q[k]); });
    if (q.grow) p.set('grow', q.grow);
    E.PORT_KEYS.forEach(function (k) { if (q.ports[k]) p.set(k, q.ports[k]); });
    if (q.ha !== 'none') p.set('ha', q.ha);
    if (q.form !== 'any') p.set('form', q.form);
    if (q.vsys > 1) p.set('vsys', q.vsys);
    if (q.poe) p.set('poe', q.poe);
    if (q.cell) p.set('cell', 1);
    if (q.psu) p.set('psu', 1);
    history.replaceState(null, '', location.pathname + '?' + p.toString());
  }
  function loadUrl() {
    var p = new URLSearchParams(location.search);
    if (!p.has('tp')) return false;
    if (p.get('old') && byKey[p.get('old')]) pick(p.get('old'));
    var setv = function (id, v) { var el = $(id); el.value = v == null ? '' : v; el.classList.remove('is-pre'); };
    setv('f-tp', p.get('tp')); setv('f-sess', p.get('sess')); setv('f-cps', p.get('cps')); setv('f-vpn', p.get('vpn'));
    $('f-grow').value = p.get('grow') || '0';
    E.PORT_KEYS.forEach(function (k) { setv('p-' + k, p.get(k)); });
    setTiles('c-ha', p.get('ha') || 'none'); setTiles('c-form', p.get('form') || 'any');
    setv('c-vsys', p.get('vsys')); setv('c-poe', p.get('poe'));
    $('c-cell').checked = p.get('cell') === '1'; $('c-psu').checked = p.get('psu') === '1';
    read();
    STEPS.forEach(markDone);
    stepEls.forEach(function (s) { s.classList.remove('is-open'); });
    show(false);
    return true;
  }

  if (!loadUrl()) open('kind', false);
  window.__rp = { q: q, result: function () { return R; } };
})();
