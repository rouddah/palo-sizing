/* Moteur de dimensionnement Prisma SASE.
   Entrees (voir defaults) -> nomenclature : une ligne par brique, avec la
   quantite, l'unite, la regle appliquee et la cle de source (SASE_RULES.src),
   plus des alertes de coherence. Aucun prix, aucune reference de commande.
   Une quantite que la doc ne permet pas de calculer reste nulle : l'interface
   l'affiche « unité non publiée ». */
(function (root) {
  'use strict';

  function defaults() {
    return {
      needs: { internet: true, privateApps: false, browser: false },
      edition: 'auto',          // auto | swg | ztna | enterprise
      coverage: 'auto',         // auto | local | worldwide
      locations: 0,             // lieux Prisma Access (pays / regions) a couvrir
      tenants: 1,
      mu: { users: 0, clientless: 0 },
      rn: { model: 'site', sites: [] },   // site | aggregate ; sites : [{ n, mbps, region, ha, sdwan, poe, cell, sfp10, rugged, virt }]
      dc: { count: 0, mbps: 0, sdwan: false, ha: false, virt: false },
      ztnaConnectors: 0,
      sdwanModel: 'device',     // device | site | aggregate
      addons: {}                // { id: true }
    };
  }

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
    o.locations = int(o.locations); o.tenants = Math.max(1, int(o.tenants, 1)); o.ztnaConnectors = int(o.ztnaConnectors);
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

    const muUnits = x.mu.users + x.mu.clientless;
    const sites = x.rn.sites;
    const nSites = sites.reduce((a, s) => a + s.n, 0);
    const hasMu = muUnits > 0, hasRn = nSites > 0;
    if (!hasMu && !hasRn) alert('info', 'Renseignez des utilisateurs nomades ou des sites pour obtenir une nomenclature.');

    /* 1. Edition */
    let ed = x.edition;
    if (ed === 'auto') {
      const inet = x.needs.internet, priv = x.needs.privateApps || x.dc.count > 0;
      ed = x.needs.browser || (inet && priv) ? 'enterprise' : priv ? 'ztna' : 'swg';
    }
    const E = R.editions.find(e => e.id === ed) || R.editions[2];
    line('base', 'Prisma Access ' + E.name, x.tenants, x.tenants > 1 ? 'tenants (une édition par tenant)' : 'tenant',
      x.edition === 'auto' ? 'Choisie d’après les besoins : ' + E.use : E.use, R.editionSrc,
      { incl: Object.keys(E.incl).filter(k => E.incl[k]).map(k => R.inclLabels[k]) });
    if (x.edition !== 'auto') {
      if (!E.privateApps && (x.needs.privateApps || x.dc.count > 0)) alert('crit', 'L’édition Secure Web Gateway ne couvre pas l’accès aux applications privées (« N/A » dans le guide). Prendre ZTNA ou Enterprise.', R.editionSrc);
      if (ed === 'ztna' && x.needs.internet) alert('warn', 'L’édition ZTNA n’inclut ni Advanced URL Filtering ni Advanced DNS Security : l’accès internet sécurisé relève de Secure Web Gateway ou d’Enterprise.', R.editionSrc);
      if (ed !== 'enterprise' && x.needs.browser) alert('warn', 'SaaS Inline Security et Prisma Browser Core ne sont inclus que dans Enterprise ; sinon ce sont des add-ons.', R.editionSrc);
    }
    if (x.tenants > 1) alert('info', 'Chaque tenant porte un seul type de licence Prisma Access ; on ne mélange pas les éditions dans un tenant.', 'allocl');

    /* 2. Couverture Local / Worldwide */
    let cov = x.coverage;
    const unitsPerTenant = Math.max(muUnits, 0) / x.tenants;
    if (cov === 'auto') cov = (x.locations > R.coverage.local.locations || unitsPerTenant >= R.coverage.worldwide.minUnits) ? 'worldwide' : 'local';
    const C = R.coverage[cov];
    line('base', 'Couverture ' + C.name, 1, 'par tenant',
      cov === 'local'
        ? C.locations + ' lieux Prisma Access par défaut, ' + C.sc + ' Service Connections au plus par tenant, minimum ' + C.minUnits + ' unités par tenant.'
        : 'Lieux Prisma Access illimités, minimum ' + C.minUnits + ' unités par tenant, 5 Service Connections par tenant à partir de 1 000 unités (2 en dessous).',
      C.src);
    if (cov === 'local' && x.locations > C.locations) {
      line('addon', 'Additional Locations', x.locations - C.locations, 'lieux', 'Couverture Local : ' + C.locations + ' lieux par défaut, ' + x.locations + ' demandés.', 'addloc');
    }
    if (cov === 'worldwide' && x.coverage === 'worldwide' && hasMu && unitsPerTenant < C.minUnits)
      alert('warn', 'Couverture Worldwide : minimum ' + C.minUnits + ' unités par tenant (root ou enfant), ' + Math.round(unitsPerTenant) + ' demandées.', 'allocl');

    /* 3. Mobile Users */
    if (hasMu) {
      const min = C.minUnits, q = Math.max(muUnits, min);
      line('mu', 'Mobile Users', q * 1, R.mu.unit + 's', R.mu.note + (q > muUnits ? ' Relevé au minimum de ' + min + ' unités par tenant (' + C.name + ').' : ''), 'lic, allocl');
      if (x.tenants > 1) alert('info', 'Chaque tenant doit recevoir au moins ' + min + ' unités (' + C.name + ').', 'allocl');
    }

    /* 4. Remote Networks */
    const regions = {};
    sites.forEach(s => { regions[s.region] = (regions[s.region] || 0) + s.n * s.mbps; });
    if (hasRn) {
      if (x.rn.model === 'site') {
        const T = R.rnSite.tiers, count = {};
        let split = 0;
        sites.forEach(s => {
          if (s.mbps > T[T.length - 1].mbps) {
            const k = Math.ceil(s.mbps / T[T.length - 1].mbps);
            count.xl = (count.xl || 0) + k * s.n; split += s.n;
          } else {
            const t = T.find(t => s.mbps <= t.mbps) || T[0];
            count[t.id] = (count[t.id] || 0) + s.n;
          }
        });
        T.forEach(t => { if (count[t.id]) line('rn', 'Remote Network, site ' + t.name, count[t.id], 'sites', 'Jusqu’à ' + fmtMbps(t.mbps) + ' par site (entrant + sortant), 10 % de dépassement toléré. Egress NAT et redondance régionale inclus.', R.rnSite.src); });
        if (split) {
          alert(x.needs.privateApps || x.dc.count ? 'crit' : 'warn', R.rnSite.splitNote, R.rnSite.src);
        }
        alert('info', 'Le modèle par site demande Prisma Access 6.0 ou plus.', 'site');
      } else {
        let total = 0;
        Object.keys(regions).forEach(r => {
          const mb = Math.max(R.rnAgg.minPerLocation, regions[r]);
          total += mb;
          const nodes = Math.ceil(mb / R.rnAgg.nodeMbps);
          line('rn', 'Remote Networks, bande passante ' + r, mb, 'Mbps', 'Somme entrant + sortant des sites de la compute location' + (mb > regions[r] ? ', relevée au minimum de ' + R.rnAgg.minPerLocation + ' Mbps par compute location' : '') + '. ' + nodes + ' IPSec Termination Node' + (nodes > 1 ? 's' : '') + ' (1 000 Mbps chacun).', R.rnAgg.src);
          const nS = sites.filter(s => s.region === r).reduce((a, s) => a + s.n, 0);
          if (nS > nodes * R.rnAgg.sitesPerNode) alert('warn', r + ' : ' + nS + ' sites pour ' + nodes + ' IPSec Termination Node(s), au plus ' + R.rnAgg.sitesPerNode + ' sites par nœud. Allouer plus de bande passante ou répartir.', 'rncheck');
        });
        notes.push({ text: 'Total Remote Networks : ' + total.toLocaleString('fr-FR') + ' Mbps (1 unité = 1 Mbps).', src: 'lic' });
        alert('info', R.rnAgg.noQosInbound, 'alloc');
      }
      if (sites.some(s => s.mbps > R.rnHp.tunnelMbps)) alert('info', 'Un tunnel de Remote Network porte au plus 2 Gbps : au-delà, plusieurs tunnels (ECMP, jusqu’à 4, BGP requis) ou Remote Network High Performance.', 'rnhp, alloc');
    }

    /* 5. Service Connections, ZTNA Connectors, Colo-Connect */
    const wantPriv = x.needs.privateApps || x.dc.count > 0;
    if (E.privateApps) {
      const incl = cov === 'local' ? R.coverage.local.sc : (unitsPerTenant >= 1000 || !hasMu ? R.coverage.worldwide.sc : R.coverage.worldwide.scBelow1000);
      let need = 0;
      if (x.dc.count) {
        const perDc = x.dc.mbps ? Math.max(1, Math.ceil(x.dc.mbps / R.scMbps)) : 1;
        need = x.dc.count * Math.min(perDc, R.scMaxRecommended);
        if (perDc > R.scMaxRecommended) alert('warn', 'Plus de ' + R.scMaxRecommended + ' Service Connections par data center ne sont pas recommandées (environ 1 Gbps chacune) : passer par ZTNA Connector ou Colo-Connect (jusqu’à 20 Gbps par région).', 'schb, palg');
      } else if (hasMu && hasRn) need = 1;
      if (need) line('pa', 'Service Connections', need, 'connexions', (x.dc.count ? 'Environ 1 Gbps par Service Connection, une par data center au moins. ' : R.scNote + ' ') + incl + ' incluses (' + E.name + ', ' + C.name + ').', 'sc, schb, scplan');
      const zc = x.ztnaConnectors;
      if (zc) line('pa', 'ZTNA Connectors', zc, 'connecteurs', '10 inclus dans ZTNA et Enterprise, jusqu’à 2 Gbps par connecteur.', 'ztna, ztnaon');
      if (need > incl || zc > E.ztnaConn) {
        line('addon', 'Private App Access', null, '', 'Besoin au-delà de l’édition : ' + (need > incl ? need + ' Service Connections pour ' + incl + ' incluses' : '') + (need > incl && zc > E.ztnaConn ? ', ' : '') + (zc > E.ztnaConn ? zc + ' ZTNA Connectors pour ' + E.ztnaConn + ' inclus' : '') + '. Jusqu’à 200 connecteurs par tenant.', R.privateAppSrc);
        if (need + zc > R.privateAppMax) alert('crit', 'Plus de ' + R.privateAppMax + ' connecteurs vers les applications privées : au-delà de ce que publie l’add-on Private App Access.', R.privateAppSrc);
      }
    } else if (hasMu && hasRn) {
      alert('warn', 'Mobile Users et Remote Networks communiquent par une Service Connection ; l’édition Secure Web Gateway n’en inclut pas.', 'sc, palg');
    } else if (wantPriv) {
      alert('crit', 'Accès aux applications privées demandé avec Secure Web Gateway, qui ne le couvre pas.', 'palg');
    }

    /* 6. Prisma SD-WAN */
    const sdSites = sites.filter(s => s.sdwan);
    let devCount = 0;
    sdSites.forEach(s => {
      const pick = pickIon(R, s, false);
      const per = s.ha ? 2 : 1;
      devCount += per * s.n;
      if (!pick) { alert('crit', 'Aucun ION ne tient le profil « ' + s.n + ' site(s) à ' + fmtMbps(s.mbps) + ' » avec ces contraintes.', R.ionSrc); return; }
      line('sdwan', pick.id + (s.virt ? '' : ''), per * s.n, 'appareils', 'Sites de ' + fmtMbps(s.mbps) + (s.ha ? ', en paire HA' : '') + ' : ' + pickWhy(pick, s, false) + '.', R.ionSrc, { ion: pick });
    });
    if (x.dc.sdwan && x.dc.count) {
      const s = { mbps: x.dc.mbps, poe: false, cell: false, sfp10: x.dc.mbps > 1000, rugged: false, virt: x.dc.virt };
      const pick = pickIon(R, s, true), per = x.dc.ha ? 2 : 1;
      if (pick) line('sdwan', pick.id + ' (data center)', per * x.dc.count, 'appareils', 'Data centers de ' + fmtMbps(x.dc.mbps) + (x.dc.ha ? ', en paire HA' : '') + ' : ' + pickWhy(pick, s, true) + '.', R.ionSrc, { ion: pick });
      else alert('crit', 'Aucun ION data center ne tient ' + fmtMbps(x.dc.mbps) + '.', R.ionSrc);
      line('sdwan', 'Abonnement Prisma SD-WAN Data Center', per * x.dc.count, 'abonnements', R.sdwan.dc, R.sdwan.src);
    }
    if (sdSites.length) {
      const S = R.sdwan;
      if (x.sdwanModel === 'device') {
        const c = {};
        sdSites.forEach(s => { const t = S.device.tiers.find(t => s.mbps <= t.mbps); const k = t ? t.id : null; c[k] = (c[k] || 0) + s.n * (s.ha ? 2 : 1); });
        S.device.tiers.forEach(t => { if (c[t.id]) line('sdwan', 'Abonnement Prisma SD-WAN Branch par appareil, ' + t.id, c[t.id], 'abonnements', 'Jusqu’à ' + fmtMbps(t.mbps) + ' par ION (entrant + sortant). ' + S.device.note, S.src); });
        if (c.null) alert('crit', 'Un site dépasse 2 500 Mbps, plafond de l’abonnement de branche Large.', S.src);
      } else if (x.sdwanModel === 'site') {
        const c = {};
        sdSites.forEach(s => { const t = S.site.tiers.find(t => s.mbps <= t.mbps); const k = t ? t.id : null; c[k] = (c[k] || 0) + s.n; });
        S.site.tiers.forEach(t => { if (c[t.id]) line('sdwan', 'Abonnement Prisma SD-WAN Branch par site, ' + t.id, c[t.id], 'abonnements', 'Jusqu’à ' + fmtMbps(t.mbps) + ' pour tous les ION du site. ' + S.site.note, S.src); });
        if (c.null) alert('crit', 'Un site dépasse 2 500 Mbps, plafond de l’abonnement de branche Large.', S.src);
      } else {
        const mb = sdSites.reduce((a, s) => a + s.n * s.mbps, 0);
        line('sdwan', 'Abonnement Prisma SD-WAN Branch en bande passante agrégée', mb, 'Mbps', S.aggregate.note, S.src);
        if (devCount && mb / devCount < S.aggregate.minAvgPerDevice) alert('warn', 'Bande passante agrégée : moyenne de ' + (mb / devCount).toFixed(1) + ' Mbps par ION, il en faut au moins ' + S.aggregate.minAvgPerDevice + '.', S.src);
      }
      alert('info', S.oneModel + ' Durée de 1 à 5 ans.', S.src);
      if (hasRn && x.rn.model === 'site') alert('info', S.paSiteIncl, S.paSiteInclSrc);
    }

    /* 7. Add-ons */
    R.addons.forEach(a => {
      if (!x.addons[a.id]) return;
      if (a.inEnterprise && ed === 'enterprise') { line('incl', a.name, null, '', 'Inclus dans l’édition Enterprise.', R.editionSrc); return; }
      if (a.id === 'privateApp' && lines.some(l => l.name === 'Private App Access')) return;
      if (a.id === 'rbi' && !hasMu && !hasRn) alert('warn', 'Remote Browser Isolation requiert un abonnement Mobile User ou Remote Network.', 'rbi');
      line('addon', a.name, null, '', a.desc, a.src || R.addonSrc);
    });
    if (x.addons.scmPro && hasRn && x.rn.model === 'aggregate') notes.push({ text: R.ademRn, src: R.ademRnSrc });

    return { input: x, edition: E, coverage: C, covId: cov, lines, alerts, notes, included: R.allEditions };
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
      const v = R.vion.find(v => v.dc === dc && s.mbps <= v.mbps);
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
