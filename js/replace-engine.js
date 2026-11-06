/* Moteur de l'assistant de remplacement (remplacement.html).
   Fonctions pures, sans DOM : chargees par la page et par le test
   _replace.js (jsdom n'est pas necessaire, require() suffit).

   Principe
   --------
   1. Un boitier de reference (PA ou concurrent) pre-remplit le besoin :
      debit avec inspection, VPN, ports ; sessions et CPS seulement si
      c'est un PA (meme protocole de mesure). Tout reste modifiable.
   2. Contraintes dures : ports (avec reutilisation d'un port plus rapide),
      vsys, PoE, HA, format, modem 5G, alimentation redondante. Un modele
      qui ne les tient pas n'est jamais propose.
   3. Parmi les modeles qui les tiennent, tries par debit Threat Prevention :
        iso = le plus petit qui couvre toute la volumetrie demandee ;
        n-1 = celui juste en dessous (meme contraintes dures, volumetrie
              partiellement couverte : le manque est chiffre) ;
        n+1 = le premier au-dessus de l'iso offrant au moins 25 % de debit
              en plus (a defaut, le plus gros compatible au-dessus).
   Exclus d'office : fins de vente effectives ou annoncees (eos, eosD) ;
   gamme durcie sauf si demandee, et alors seulement elle.
   Une metrique nulle dans la datasheet ne bloque pas : elle est signalee. */
(function (root) {
  'use strict';

  var PORT_KEYS = ['cu1', 'cu25', 'cu10', 'sfp1', 'sfp10', 'sfp25', 'sfp100', 'sfp400'];
  var PORT_LABEL = { cu1: 'cuivre 1G', cu25: 'cuivre 2,5/5G', cu10: 'cuivre 10G', sfp1: 'SFP 1G', sfp10: 'SFP+ 10G', sfp25: 'SFP28 25G', sfp100: 'QSFP 40/100G', sfp400: '400G' };

  /* Ports multi-gig capables de 10G. mgigSp : '1/2.5/5/10G', '10G mGig',
     '1/2.5/5G (8), 1/2.5/5/10G (4)', '10 GE / 5 GE / 2.5 GE / GE RJ45'... */
  function mgig10(m) {
    var n = m.mgig || 0, sp = m.mgigSp || '';
    if (!n || !sp) return 0;
    var parts = sp.split(/,\s*/), counted = 0, ten = 0, withCount = false;
    parts.forEach(function (p) {
      var c = p.match(/\((\d+)\)/);
      if (c) { withCount = true; counted += +c[1]; if (/(^|[^\d.])10\s*G/i.test(p)) ten += +c[1]; }
    });
    if (withCount) return Math.min(ten, n);
    return /(^|[^\d.])10\s*G/i.test(sp) ? n : 0;
  }

  /* Ports d'un modele, ramenes aux classes de l'assistant. */
  function portsOf(m) {
    var t10 = mgig10(m);
    return {
      cu1: m.rj45 || 0, combo: m.combo || 0, mg25: (m.mgig || 0) - t10, mg10: t10,
      sfp1: m.sfp1 || 0, sfp10: m.sfp10 || 0, sfp25: m.sfp25 || 0, sfp100: m.sfp100 || 0,
      sfp400: m.sfp400 || 0, sfpdd: m.sfpdd || 0
    };
  }

  /* Besoin pre-rempli depuis un boitier : ses ports presents. */
  function portsNeedFrom(m) {
    var p = portsOf(m);
    return {
      cu1: p.cu1 + p.combo, cu25: p.mg25, cu10: p.mg10,
      sfp1: p.sfp1, sfp10: p.sfp10, sfp25: p.sfp25, sfp100: p.sfp100 + p.sfpdd, sfp400: p.sfp400
    };
  }

  /* Affectation des ports. Chaque besoin accepte sa classe et quelques
     classes plus rapides (fenetre). Ordre qui ne gaspille rien :
     - cuivre : du plus exigeant au moins exigeant (fenetres imbriquees,
       10G puis 2,5/5G puis 1G) ;
     - optique : du plus lent au plus rapide, chacun prenant la classe la
       plus lente disponible (fenetres decalees : un SFP 1G ne va pas dans
       une cage SFP28, un SFP+ si). Un 200G Fortinet (4 SFP + 8 SFP+) tient
       ainsi dans 8 SFP+ + 4 SFP28.
     Les combos SFP/RJ45 servent d'abord l'optique 1G, puis le cuivre 1G. */
  var POOLS = [
    ['cu10',   ['mg10']],
    ['cu25',   ['mg25', 'mg10']],
    ['sfp1',   ['sfp1', 'combo', 'sfp10']],
    ['cu1',    ['cu1', 'combo', 'mg25', 'mg10']],
    ['sfp10',  ['sfp10', 'sfp25', 'sfpdd']],
    ['sfp25',  ['sfp25', 'sfpdd']],
    ['sfp100', ['sfp100', 'sfpdd']],
    ['sfp400', ['sfp400']]
  ];
  function fitPorts(m, need) {
    var have = portsOf(m), short = {}, any = false;
    POOLS.forEach(function (row) {
      var k = row[0], left = +need[k] || 0;
      row[1].forEach(function (pool) {
        var take = Math.min(left, have[pool]);
        have[pool] -= take; left -= take;
      });
      if (left > 0) { short[k] = left; any = true; }
    });
    return any ? short : null;
  }

  function vsysMax(m) {
    if (m.vsysMax) return m.vsysMax;
    var v = String(m.vsys || '').split('/').pop();
    return parseInt(v, 10) || 1;
  }
  var isRugged = function (m) { return /durci/i.test(m.f || ''); };
  var isDesk = function (m) { return /^Desktop/i.test(m.f || ''); };
  var isRack = function (m) { return /rack|chassis|\dU/i.test(m.f || ''); };
  var hasCell = function (m) { return /5G/.test(m.id) && !/^PA-(3|5|7)/.test(m.id); };
  var psuRedundant = function (m) { return /redond|1\+1|1:1|\(2|seconde|en option/i.test(m.psu || ''); };
  var retired = function (m) { return !!(m.eos || m.eosD); };
  /* Variante 5G d'un modele qui existe aussi sans modem (PA-415-5G,
     PA-520-5G, PA-410R-5G, PA-54R-POE-D-5G) : proposee seulement si le
     5G est demande. Un modele qui n'existe qu'en 5G (PA-52R-5G) reste. */
  var IDS = null;
  function cellVariant(m) {
    if (!IDS) { IDS = {}; (root.MODELS || []).forEach(function (x) { IDS[x.id] = 1; }); }
    return /-5G$/.test(m.id) && !!IDS[m.id.replace(/(-D)?-5G$/, '')];
  }

  /* Contraintes dures. Renvoie la liste des raisons d'exclusion. */
  function hardFails(m, q) {
    var r = [];
    if (retired(m)) r.push('fin de vente');
    if (q.form === 'rug') { if (!isRugged(m)) r.push('pas durci'); }
    else {
      if (isRugged(m)) r.push('gamme durcie');
      if (q.form === 'desk' && !isDesk(m)) r.push('pas de bureau');
      if (q.form === 'rack' && !isRack(m)) r.push('pas en rack');
    }
    var sp = fitPorts(m, q.ports || {});
    if (sp) r.push('ports');
    if ((q.vsys || 1) > vsysMax(m)) r.push('vsys');
    if (q.poe > 0 && !(m.poeP >= q.poe || (m.poeP == null && m.poe))) r.push('PoE');
    if (q.ha === 'ap' && m.haAP !== true) r.push('HA A/P');
    if (q.ha === 'aa' && m.haAA !== true) r.push('HA A/A');
    if (q.ha === 'cl' && !m.haCl) r.push('clustering');
    if (q.cell && !hasCell(m)) r.push('5G');
    if (!q.cell && cellVariant(m)) r.push('variante 5G');
    if (q.psu && !psuRedundant(m)) r.push('alimentation');
    return r;
  }

  /* Volumetrie : part couverte de chaque metrique demandee (1 = couvert). */
  var METRICS = [['tp', 'débit avec inspection'], ['sess', 'sessions'], ['cps', 'CPS'], ['vpn', 'VPN IPsec']];
  function coverage(m, need) {
    var out = [];
    METRICS.forEach(function (x) {
      var k = x[0], want = need[k];
      if (!want) return;
      if (m[k] == null) { out.push({ k: k, label: x[1], want: want, have: null, ratio: null }); return; }
      out.push({ k: k, label: x[1], want: want, have: m[k], ratio: m[k] / want });
    });
    return out;
  }
  var covers = function (cov) { return cov.every(function (c) { return c.ratio == null || c.ratio >= 1; }); };

  /* Besoin effectif : saisie + croissance. */
  function target(q) {
    var g = 1 + (+q.grow || 0) / 100;
    var t = {};
    ['tp', 'sess', 'cps', 'vpn'].forEach(function (k) { if (+q[k] > 0) t[k] = +q[k] * g; });
    return t;
  }

  var UP = 1.25;
  function propose(models, q) {
    IDS = {}; models.forEach(function (x) { IDS[x.id] = 1; });
    var need = target(q);
    var pool = models.filter(function (m) { return !hardFails(m, q).length; })
      .slice().sort(function (a, b) { return (a.tp - b.tp) || (a.sess - b.sess) || (a.cps - b.cps) || (a.id < b.id ? -1 : 1); });
    var isoI = -1;
    for (var i = 0; i < pool.length; i++) { if (covers(coverage(pool[i], need))) { isoI = i; break; } }
    var iso = isoI >= 0 ? pool[isoI] : null;
    var lower = null, upper = null;
    if (iso) {
      for (var j = isoI - 1; j >= 0; j--) { if (pool[j].tp < iso.tp) { lower = pool[j]; break; } }
      /* n+1 : un vrai cran, au moins 25 % de debit en plus de l'iso ;
         a defaut, le plus gros modele compatible au-dessus. */
      for (var k = isoI + 1; k < pool.length; k++) {
        if (pool[k].tp >= iso.tp * UP) { upper = pool[k]; break; }
        if (pool[k].tp > iso.tp) upper = pool[k];
      }
    } else if (pool.length) {
      lower = pool[pool.length - 1];   // rien ne couvre : le plus gros compatible
    }
    /* Pourquoi rien ne passe : raisons d'exclusion les plus frequentes. */
    var blockers = {};
    if (!pool.length) models.forEach(function (m) {
      if (retired(m)) return;
      hardFails(m, q).forEach(function (r) { blockers[r] = (blockers[r] || 0) + 1; });
    });
    return { need: need, pool: pool, lower: lower, iso: iso, upper: upper, blockers: blockers };
  }

  var api = { PORT_KEYS: PORT_KEYS, PORT_LABEL: PORT_LABEL, mgig10: mgig10, portsOf: portsOf, portsNeedFrom: portsNeedFrom,
    fitPorts: fitPorts, vsysMax: vsysMax, hardFails: hardFails, coverage: coverage, target: target, propose: propose,
    psuRedundant: psuRedundant, hasCell: hasCell, isRugged: isRugged };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ReplaceEngine = api;
})(this);
