/* Moteur de l'assistant de remplacement (remplacement.html).
   Fonctions pures, sans DOM : chargees par la page et par le test
   _replace.js (jsdom n'est pas necessaire, require() suffit).

   Principe
   --------
   1. Un boitier de reference (PA ou concurrent) pre-remplit le besoin :
      debit avec inspection, VPN, ports ; sessions et CPS seulement si
      c'est un PA (meme protocole de mesure). Tout reste modifiable.
   2. Contraintes dures : vsys, HA, format, modem 5G, alimentation
      redondante. Un modele qui ne les tient pas n'est jamais propose.
      Interfaces et PoE sont souples : ils departagent (port plus rapide,
      optique cuivre dans une cage libre, sinon ports manquants chiffres).
   3. Parmi les modeles qui les tiennent, tries par debit Threat Prevention :
        iso = parmi ceux qui couvrent la volumetrie (fenetre de 2,5 fois le
              plus petit), le mieux raccorde puis le plus petit ;
        n-1 = le plus gros en dessous, sans remonter de gamme, aussi bien
              raccorde si possible ;
        n+1 = le premier au-dessus de l'iso offrant au moins 25 % de debit
              en plus, sans redescendre de gamme (a defaut, le plus gros
              compatible au-dessus). Conseil : l'iso si sa charge reste sous
              80 %, sinon le n+1.
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

  /* Raccordement realiste : apres l'affectation native, le cuivre qui
     reste passe par des optiques cuivre du catalogue Palo Alto dans les
     cages libres : PAN-SFP-CG (1000BASE-T) dans une cage SFP ou SFP+,
     PAN-L-SFP-PLUS-10GBASE-T dans une cage SFP+. Le cuivre 2,5/5G n'a pas
     d'optique publiee : il reste manquant.
     level 0 = ports natifs, 1 = avec optiques cuivre, 2 = ports manquants. */
  function portFit(m, need) {
    var have = portsOf(m), short = {};
    POOLS.forEach(function (row) {
      var k = row[0], left = +need[k] || 0;
      row[1].forEach(function (pool) { var t = Math.min(left, have[pool]); have[pool] -= t; left -= t; });
      if (left > 0) short[k] = left;
    });
    var adapt = { cg: 0, t10: 0 };
    if (short.cu10) {
      var t = Math.min(short.cu10, have.sfp10); have.sfp10 -= t; short.cu10 -= t; adapt.t10 = t;
      if (!short.cu10) delete short.cu10;
    }
    if (short.cu1) {
      ['sfp1', 'sfp10'].forEach(function (pool) { var t = Math.min(short.cu1, have[pool]); have[pool] -= t; short.cu1 -= t; adapt.cg += t; });
      if (!short.cu1) delete short.cu1;
    }
    var missing = 0; Object.keys(short).forEach(function (k) { missing += short[k]; });
    return { level: missing ? 2 : (adapt.cg || adapt.t10) ? 1 : 0, short: short, adapt: adapt, missing: missing };
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
    if ((q.vsys || 1) > vsysMax(m)) r.push('vsys');
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

  var UP = 1.25, SPAN = 2.5;
  /* Ecart d'un modele au besoin d'interfaces et de PoE (souple). */
  function fit(m, q) {
    var pf = portFit(m, q.ports || {});
    var poeShort = 0, poeUnknown = false;
    if (q.poe > 0) {
      if (m.poeP == null && m.poe) poeUnknown = true;
      else poeShort = Math.max(0, q.poe - (m.poeP || 0));
    }
    return { ports: pf, poeShort: poeShort, poeUnknown: poeUnknown, gap: pf.missing + poeShort };
  }

  /* Choix des trois propositions. Les ports et le PoE ne bloquent plus :
     ils departagent. L'iso est cherche parmi les modeles qui couvrent la
     volumetrie, dans une fenetre de taille raisonnable (jusqu'a 2,5 fois le
     debit du plus petit qui couvre) : celui qui laisse le moins de ports
     manquants, puis le plus petit. Un client a qui il manque quatre ports
     cuivre ne se voit donc pas proposer un boitier trois fois trop gros :
     on lui dit ce qui manque et comment le raccorder. */
  function propose(models, q) {
    IDS = {}; models.forEach(function (x) { IDS[x.id] = 1; });
    var need = target(q);
    var pool = models.filter(function (m) { return !hardFails(m, q).length; })
      .slice().sort(function (a, b) { return (a.tp - b.tp) || (a.sess - b.sess) || (a.cps - b.cps) || (a.id < b.id ? -1 : 1); });
    var RANK = {}; models.forEach(function (m) { if (!(m.s in RANK)) RANK[m.s] = Object.keys(RANK).length; });
    var rank = function (m) { return RANK[m.s]; };
    var F = {}; pool.forEach(function (m) { F[m.id] = fit(m, q); });
    var gap = function (m) { return F[m.id].gap; };
    var best = function (list) { return list.slice().sort(function (a, b) { return (gap(a) - gap(b)) || (a.tp - b.tp); })[0] || null; };
    var covering = pool.filter(function (m) { return covers(coverage(m, need)); });
    var iso = null, lower = null, upper = null;
    if (covering.length) {
      var lim = covering[0].tp * SPAN;
      iso = best(covering.filter(function (m) { return m.tp <= lim; }));
      /* Rang de gamme : ordre des series dans les donnees (PA-400, PA-500,
         ... PA-7500). Un n-1 ne remonte jamais dans une gamme superieure
         (une PA-3410 n'est pas le « plus juste » d'une PA-1510, meme si
         son debit d'inspection est plus bas), un n+1 ne redescend pas. */
      var below = pool.filter(function (m) { return m.tp < iso.tp && rank(m) <= rank(iso); });
      var belowOk = below.filter(function (m) { return gap(m) <= gap(iso); });
      lower = (belowOk.length ? belowOk : below)[(belowOk.length ? belowOk : below).length - 1] || null;
      var above = pool.filter(function (m) { return m.tp >= iso.tp * UP && rank(m) >= rank(iso); });
      var aboveOk = above.filter(function (m) { return gap(m) === 0; });
      upper = aboveOk[0] || best(above.slice(0, 3)) || null;
      if (!upper) { var more = pool.filter(function (m) { return m.tp > iso.tp && rank(m) >= rank(iso); }); upper = more[more.length - 1] || null; }
    } else if (pool.length) {
      lower = pool.slice(-3).sort(function (a, b) { return (gap(a) - gap(b)) || (b.tp - a.tp); })[0];   // rien ne couvre : parmi les plus gros, le mieux raccorde
    }
    var blockers = {};
    if (!pool.length) models.forEach(function (m) {
      if (retired(m)) return;
      hardFails(m, q).forEach(function (r) { blockers[r] = (blockers[r] || 0) + 1; });
    });
    /* Conseil : l'iso s'il garde de la marge (charge <= 80 %), sinon le
       n+1 s'il raccorde au moins aussi bien. */
    var pick = iso && (need.tp / iso.tp <= 0.8 || !upper || gap(upper) > gap(iso)) ? 'iso' : upper ? 'upper' : null;
    return { need: need, pool: pool, lower: lower, iso: iso, upper: upper, blockers: blockers, pick: pick, fit: function (m) { return F[m.id] || fit(m, q); } };
  }

  var api = { PORT_KEYS: PORT_KEYS, PORT_LABEL: PORT_LABEL, mgig10: mgig10, portsOf: portsOf, portsNeedFrom: portsNeedFrom,
    fitPorts: fitPorts, portFit: portFit, fit: fit, vsysMax: vsysMax, hardFails: hardFails, coverage: coverage, target: target, propose: propose,
    psuRedundant: psuRedundant, hasCell: hasCell, isRugged: isRugged };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ReplaceEngine = api;
})(this);
