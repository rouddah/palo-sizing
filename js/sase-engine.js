/* Moteur de dimensionnement Prisma SASE.
   Axe principal : l'offre « Core » par persona (User par utilisateur, Net par
   Mbps, Site par site et par palier), une edition par tenant (SWG, ZTNA ou
   Enterprise Core). Entrees (voir defaults) -> nomenclature : une ligne par
   brique, avec la quantite, l'unite, la regle appliquee et la cle de source
   (SASE_RULES.src), plus des alertes de coherence. Aucun prix, aucune
   reference de commande. Une quantite que les sources ne permettent pas de
   calculer reste nulle : l'interface l'affiche « unité non publiée ». */
(function (root) {
  'use strict';

  function defaults() {
    return {
      needs: { internet: true, privateApps: false, browser: false },
      edition: 'auto',          // auto | swg | ztna | enterprise
      tenants: 1,
      mu: { users: 0, clientless: 0 },
      rn: { model: 'site', sites: [] },   // site (Site Core par palier) | net (Net Core par Mbps) ; sites : [{ n, mbps, region, ha, sdwan, poe, cell, sfp10, rugged, virt }]
      dc: { count: 0, mbps: 0, sdwan: false, ha: false, virt: false },
      ztnaConnectors: 0,
      dataTB: 0,                // transfert annuel prevu, en To
      coloLinks: 0,
      sdwanModel: 'device',     // device | site | aggregate (sites hors Site Core)
      addons: {}                // { id: true }
    };
  }

  function num(v) { v = Number(v); return isFinite(v) && v >= 0 ? v : 0; }
  function int(v, d) { v = Math.floor(Number(v)); return isFinite(v) && v >= 0 ? v : (d || 0); }
  function merge(inp) {
    const d = defaults(), i = inp || {};
    const o = Object.assign(d, i);
    o.needs = Object.assign(defaults().needs, i.needs || {});
    o.mu = Object.assign(defaults().mu, i.mu || {});
    o.rn = Object.assign(defaults().rn, i.rn || {});
    o.dc = Object.assign(defaults().dc, i.dc || {});
    o.addons = Object.assign({}, i.addons || {});
    o.mu.users = int(o.mu.users); o.mu.clientless = int(o.mu.clientless);
    o.dc.count = int(o.dc.count); o.dc.mbps = int(o.dc.mbps);
    o.tenants = Math.max(1, int(o.tenants, 1)); o.ztnaConnectors = int(o.ztnaConnectors);
    o.dataTB = num(o.dataTB); o.coloLinks = int(o.coloLinks);
    if (o.rn.model !== 'net') o.rn.model = 'site';
    o.rn.sites = (o.rn.sites || []).map(s => ({
      n: int(s.n), mbps: int(s.mbps), region: String(s.region || '').trim() || 'Région 1',
      ha: !!s.ha, sdwan: !!s.sdwan, poe: !!s.poe, cell: !!s.cell, sfp10: !!s.sfp10, rugged: !!s.rugged, virt: !!s.virt
    })).filter(s => s.n > 0);
    return o;
  }

  function size(input, R) {
    R = R || root.SASE_RULES;
    const x = merge(input);
    const lines = [], alerts = [], notes = [];
    const line = (grp, name, qty, unit, why, src, extra) => lines.push(Object.assign({ grp, name, qty, unit, why, src }, extra || {}));
    const alert = (lvl, text, src) => alerts.push({ lvl, text, src: src || null });
    const T = R.rnSite.tiers, XL = T[T.length - 1].mbps;

    const users = x.mu.users + x.mu.clientless;
    const sites = x.rn.sites;
    const nSites = sites.reduce((a, s) => a + s.n, 0);
    const hasMu = users > 0, hasRn = nSites > 0;
    if (!hasMu && !hasRn) alert('info', 'Renseignez des utilisateurs nomades ou des sites pour obtenir une nomenclature.');

    /* 1. Edition (une par tenant) */
    let ed = x.edition;
    const wantPriv = x.needs.privateApps || x.dc.count > 0;
    if (ed === 'auto') ed = x.needs.browser || (x.needs.internet && wantPriv) ? 'enterprise' : wantPriv ? 'ztna' : 'swg';
    const E = R.editions.find(e => e.id === ed) || R.editions[2];
    if (x.edition !== 'auto') {
      if (!E.privateApps && wantPriv) alert('warn', 'SWG Core n’inclut pas l’accès aux applications privées : l’add-on Private App Access est ajouté pour chaque persona.', 'cat');
      if (ed === 'ztna' && x.needs.internet) alert('warn', 'ZTNA Core couvre l’accès aux applications privées ; la sécurité de l’accès internet relève de SWG Core ou d’Enterprise Core.', 'cat');
      if (ed !== 'enterprise' && x.needs.browser) alert('warn', 'Prisma Browser Core n’est inclus que dans Enterprise Core ; sinon, add-on Prisma Browser.', 'cat');
    }
    if (x.tenants > 1) alert('info', R.oneEdition, 'allocl');

    /* Personas presentes et leurs quantites */
    const useNet = hasRn && x.rn.model === 'net';
    const useSite = hasRn && x.rn.model === 'site';
    const siteTiers = {};
    let split = 0;
    if (useSite) sites.forEach(s => {
      if (s.mbps > XL) { siteTiers.xl = (siteTiers.xl || 0) + Math.ceil(s.mbps / XL) * s.n; split += s.n; }
      else { const t = T.find(t => s.mbps <= t.mbps) || T[0]; siteTiers[t.id] = (siteTiers[t.id] || 0) + s.n; }
    });
    const regions = {};
    sites.forEach(s => { regions[s.region] = (regions[s.region] || 0) + s.n * s.mbps; });
    let netMbps = 0;
    if (useNet) Object.keys(regions).forEach(r => { netMbps += Math.max(R.rnAgg.minPerLocation, regions[r]); });
    const present = { user: hasMu, net: useNet, site: useSite };

    /* Lignes d'une offre declinee par persona ; renvoie le nombre de personas servies. */
    const perPersona = (grp, label, why, src, only) => {
      let n = 0;
      const ok = p => present[p] && (!only || only.indexOf(p) !== -1);
      if (ok('user')) { n++; line(grp, label + ' (User)', users, R.personas.user.unit, why + ' Offre ' + R.personas.user.per + '.', src); }
      if (ok('net')) { n++; line(grp, label + ' (Net)', netMbps, R.personas.net.unit, why + ' Offre ' + R.personas.net.per + '.', src); }
      if (ok('site')) { n++; T.forEach(t => { if (siteTiers[t.id]) line(grp, label + ' (Site, ' + t.name + ')', siteTiers[t.id], 'sites', why + ' Offre par site et par an, au palier du site.', src); }); }
      return n;
    };

    /* 2. Offres Core */
    if (hasMu) {
      line('core', 'Prisma Access User ' + E.name, users, 'utilisateurs', R.mu.note, R.mu.src, { incl: E.incl.user });
      if (ed === 'enterprise' && users >= R.entUserSites.minUsers) notes.push({ text: 'User Enterprise Core à partir de 2 000 utilisateurs achetés : 5 sites de 10 Mbps inclus.', src: 'cat' });
    }
    if (useSite) {
      let first = true;
      T.forEach(t => { if (siteTiers[t.id]) { line('core', 'Prisma Access Site ' + E.name + ', ' + t.name, siteTiers[t.id], 'sites', 'Palier de bande passante du site (entrant + sortant), 10 % de dépassement toléré, Egress NAT et redondance régionale inclus.', R.rnSite.src, first ? { incl: E.incl.site } : {}); first = false; } });
      if (split) alert(wantPriv ? 'crit' : 'warn', R.rnSite.splitNote, 'site');
      alert('info', 'Le modèle par site demande Prisma Access 6.0 ou plus.', 'site');
    }
    if (useNet) {
      if (E.personas.indexOf('net') === -1) {
        alert('crit', 'Il n’existe pas d’offre Net ' + E.name + ' (par Mbps) : prendre l’offre par site, ou Net SWG Core ou Net Enterprise Core.', 'cat');
      } else {
        line('core', 'Prisma Access Net ' + E.name, netMbps, 'Mbps', 'Somme des débits (entrant + sortant) par compute location, 50 Mbps au moins par compute location.', R.rnAgg.src, { incl: E.incl.net });
      }
      Object.keys(regions).forEach(r => {
        const mb = Math.max(R.rnAgg.minPerLocation, regions[r]), nodes = Math.ceil(mb / R.rnAgg.nodeMbps);
        notes.push({ text: r + ' : ' + mb.toLocaleString('fr-FR') + ' Mbps alloués' + (mb > regions[r] ? ' (minimum de 50 par compute location)' : '') + ', ' + nodes + ' IPSec Termination Node' + (nodes > 1 ? 's' : '') + '.', src: 'alloc, rncheck' });
        const nS = sites.filter(s => s.region === r).reduce((a, s) => a + s.n, 0);
        if (nS > nodes * R.rnAgg.sitesPerNode) alert('warn', r + ' : ' + nS + ' sites pour ' + nodes + ' IPSec Termination Node(s), au plus ' + R.rnAgg.sitesPerNode + ' par nœud.', 'rncheck');
      });
      alert('info', R.rnAgg.noQosInbound, 'alloc');
    }
    if (hasRn && sites.some(s => s.mbps > R.rnHp.tunnelMbps)) alert('info', 'Un tunnel de Remote Network porte au plus 2 Gbps : au-delà, plusieurs tunnels (ECMP, jusqu’à 4, BGP requis) ou Remote Network High Performance.', 'rnhp, alloc');

    /* 3. Applications privees : Service Connections, ZTNA Connectors */
    let scNeed = 0;
    if (x.dc.count) {
      const perDc = x.dc.mbps ? Math.max(1, Math.ceil(x.dc.mbps / R.scMbps)) : 1;
      scNeed = x.dc.count * Math.min(perDc, R.scMaxRecommended);
      if (perDc > R.scMaxRecommended) alert('warn', 'Plus de ' + R.scMaxRecommended + ' Service Connections par data center ne sont pas recommandées (environ 1 Gbps chacune) : ZTNA Connector ou Colo-Connect.', 'schb');
    } else if (hasMu && hasRn) scNeed = 1;
    if (E.privateApps) {
      if (scNeed) line('pa', 'Service Connections', scNeed, 'connexions', (x.dc.count ? 'Environ 1 Gbps par Service Connection, une par data center au moins. ' : R.scNote + ' ') + E.sc + ' incluses dans ' + E.name + '.', 'sc, schb, cat');
      if (scNeed > E.sc) line('addon', 'Private App Access, Service Connections supplémentaires', scNeed - E.sc, 'Service Connections', 'Au-delà des ' + E.sc + ' incluses. Offre par Service Connection.', 'cat, sc');
      if (x.ztnaConnectors) line('pa', 'ZTNA Connectors', x.ztnaConnectors, 'connecteurs', E.ztnaConn + ' inclus dans ' + E.name + ', jusqu’à 2 Gbps par connecteur.', 'cat, ztnaon');
      if (x.ztnaConnectors > E.ztnaConn) alert('warn', x.ztnaConnectors + ' ZTNA Connectors pour ' + E.ztnaConn + ' inclus : la documentation annonce jusqu’à 200 connecteurs avec Private App Access ; l’unité de cette extension n’est pas publiée.', R.privateAppSrc);
    } else if (wantPriv || (hasMu && hasRn)) {
      perPersona('addon', 'Private App Access', 'Donne accès aux Service Connections et aux ZTNA Connectors à SWG Core.', 'cat');
      if (scNeed) line('pa', 'Service Connections', scNeed, 'connexions', (x.dc.count ? 'Environ 1 Gbps par Service Connection, une par data center au moins.' : R.scNote) + ' Nombre inclus avec Private App Access non publié.', 'sc, schb');
      if (x.ztnaConnectors) line('pa', 'ZTNA Connectors', x.ztnaConnectors, 'connecteurs', 'Jusqu’à 2 Gbps par connecteur. Nombre inclus avec Private App Access non publié.', 'ztnaon');
    }

    /* 4. Prisma SD-WAN */
    const sdSites = sites.filter(s => s.sdwan);
    let devCount = 0;
    sdSites.forEach(s => {
      const pick = pickIon(R, s, false), per = s.ha ? 2 : 1;
      devCount += per * s.n;
      if (!pick) { alert('crit', 'Aucun ION ne tient le profil « ' + s.n + ' site(s) à ' + fmtMbps(s.mbps) + ' » avec ces contraintes.', R.ionSrc); return; }
      line('sdwan', pick.id, per * s.n, 'appareils', 'Sites de ' + fmtMbps(s.mbps) + (s.ha ? ', en paire HA' : '') + ' : ' + pickWhy(pick, s, false) + '.', R.ionSrc, { ion: pick });
    });
    if (x.dc.sdwan && x.dc.count) {
      const s = { mbps: x.dc.mbps, sfp10: x.dc.mbps > 1000, virt: x.dc.virt };
      const pick = pickIon(R, s, true), per = x.dc.ha ? 2 : 1;
      if (pick) line('sdwan', pick.id + ' (data center)', per * x.dc.count, 'appareils', 'Data centers de ' + fmtMbps(x.dc.mbps) + (x.dc.ha ? ', en paire HA' : '') + ' : ' + pickWhy(pick, s, true) + '.', R.ionSrc, { ion: pick });
      else alert('crit', 'Aucun ION data center ne tient ' + fmtMbps(x.dc.mbps) + '.', R.ionSrc);
      line('sdwan', 'Abonnement ' + (x.dc.virt ? 'Virtual ION' : 'ION') + ' Data Center', per * x.dc.count, 'abonnements', R.sdwan.dc, R.sdwan.src);
    }
    if (sdSites.length) {
      const S = R.sdwan;
      if (useSite) {
        notes.push({ text: S.siteCoreIncl, src: 'cat' });
      } else if (x.sdwanModel === 'device') {
        const c = {};
        sdSites.forEach(s => {
          const tiers = s.virt ? S.device.vtiers : S.device.tiers, t = tiers.find(t => s.mbps <= t);
          const k = (s.virt ? 'v' : 'p') + (t || 'x'); c[k] = (c[k] || 0) + s.n * (s.ha ? 2 : 1);
        });
        Object.keys(c).sort((a, b) => (parseInt(a.slice(1)) || 1e9) - (parseInt(b.slice(1)) || 1e9)).forEach(k => {
          const v = k[0] === 'v', m = k.slice(1);
          if (m === 'x') { alert('crit', 'Un site dépasse le plus haut palier d’abonnement par appareil (' + (v ? '500 Mbps en ION virtuel' : '2,5 Gbps') + ').', S.src); return; }
          line('sdwan', 'Abonnement ' + (v ? 'Virtual ION' : 'ION') + ' Branch par appareil, ' + fmtMbps(+m), c[k], 'abonnements', S.device.note, S.src);
        });
      } else if (x.sdwanModel === 'site') {
        const c = {};
        sdSites.forEach(s => { const t = S.site.tiers.find(t => s.mbps <= t); const k = t || 'x'; c[k] = (c[k] || 0) + s.n; });
        S.site.tiers.forEach(t => { if (c[t]) line('sdwan', 'Abonnement ION Branch par site, jusqu’à ' + fmtMbps(t), c[t], 'abonnements', S.site.note, S.src); });
        if (c.x) alert('crit', 'Un site dépasse 2 500 Mbps, plafond de l’abonnement par site.', S.src);
      } else {
        const mb = sdSites.reduce((a, s) => a + s.n * s.mbps, 0);
        line('sdwan', 'Abonnement SD-WAN Branch par Mbps', mb, 'Mbps', S.aggregate.note, S.src);
        if (devCount && mb / devCount < S.aggregate.minAvgPerDevice) alert('warn', 'Bande passante agrégée : moyenne de ' + (mb / devCount).toFixed(1) + ' Mbps par ION, il en faut au moins ' + S.aggregate.minAvgPerDevice + '.', S.src);
      }
      if (!useSite) alert('info', S.oneModel + ' Durée de 1 à 5 ans.', 'sdwanlic');
      notes.push({ text: S.perDeviceAddons, src: 'cat' });
    }

    /* 5. Add-ons */
    R.addons.forEach(a => {
      if (!x.addons[a.id] || a.id === 'scQty') return;
      const inc = a.inc || [];
      if (inc.indexOf(ed) !== -1 || (a.id === 'privateApp' && E.privateApps)) { line('incl', a.name, null, '', 'Inclus dans ' + E.name + '.', R.editionSrc); return; }
      if (a.id === 'privateApp' && lines.some(l => l.name.indexOf('Private App Access (') === 0)) return;
      if (a.id === 'rbi' && !hasMu && !hasRn) alert('warn', 'Remote Browser Isolation requiert un abonnement Mobile User ou Remote Network.', 'rbi');
      if (a.per) {
        const only = a.per.filter(p => inc.indexOf(ed + ':' + p) === -1);
        if (inc.indexOf(ed + ':site') !== -1 && present.site) line('incl', a.name + ' (Site)', null, '', 'Inclus dans Site ' + E.name + '.', R.editionSrc);
        const n = perPersona('addon', a.name, a.desc, a.src, only);
        if (!n && !(inc.indexOf(ed + ':site') !== -1 && present.site)) line('addon', a.name, null, '', a.desc + ' Proposé ' + a.per.map(p => R.personas[p].per).join(', ') + ' : aucune persona correspondante dans ce besoin.', a.src);
        return;
      }
      let q = null;
      if (a.fixed === 'perTB') q = x.dataTB > R.includedGB / 1000 ? Math.ceil(x.dataTB - R.includedGB / 1000) : null;
      else if (a.fixed === 'perLink') q = x.coloLinks || null;
      else if (a.fixed === 'flat') q = 1;
      line('addon', a.name, q, a.fixed ? R.fixedUnits[a.fixed] : '', a.desc + (a.fixed === 'perTB' && q == null ? ' Indiquez le transfert annuel prévu.' : '') + (a.fixed === 'perLink' && q == null ? ' Indiquez le nombre de liens.' : ''), a.src);
    });
    if (x.addons.scmPro && useNet) notes.push({ text: R.ademRn, src: R.ademRnSrc });
    if (x.dataTB > R.includedGB / 1000 && !x.addons.excess) alert('warn', 'Transfert prévu de ' + x.dataTB.toLocaleString('fr-FR') + ' To pour 250 GB inclus par an : add-on Excess Data Transfer (1 To par unité).', 'cat, palg');

    return { input: x, edition: E, lines, alerts, notes, included: R.allEditions };
  }

  function fits(i, s, dc) {
    const cap = dc ? i.mbpsDC : i.mbpsB;
    if (cap == null || (dc ? !i.dc : i.dcOnly)) return false;
    if (s.mbps > cap) return false;
    if (s.poe && !i.poe) return false;
    if (s.cell && !i.cell) return false;
    if (s.sfp10 && !i.sfp10) return false;
    if (s.rugged && !i.rugged) return false;
    return true;
  }
  function pickIon(R, s, dc) {
    if (s.virt) {
      const v = R.vion.find(v => v.dc === !!dc && s.mbps <= v.mbps);
      return v ? { id: v.id, mbpsB: dc ? null : v.mbps, mbpsDC: dc ? v.mbps : null, virt: true } : null;
    }
    return R.ion.find(i => fits(i, s, dc)) || null;
  }
  function pickWhy(i, s, dc) {
    if (i.virt) return 'ION virtuel jusqu’à ' + fmtMbps(dc ? i.mbpsDC : i.mbpsB);
    const p = ['jusqu’à ' + fmtMbps(dc ? i.mbpsDC : i.mbpsB) + ' chiffrés en mode ' + (dc ? 'data center' : 'branche')];
    if (s.poe) p.push(i.poe + ' ports PoE++');
    if (s.cell) p.push(i.cell);
    if (s.sfp10) p.push(i.sfp10 + ' ports SFP+');
    if (s.rugged) p.push('version durcie');
    return 'le plus petit modèle qui tient, ' + p.join(', ');
  }
  function fmtMbps(m) { return m >= 1000 ? (m / 1000).toLocaleString('fr-FR') + ' Gbps' : m + ' Mbps'; }

  const api = { size, defaults, pickIon: (s, dc) => pickIon(root.SASE_RULES, s, dc), fmtMbps };
  root.SaseEngine = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
