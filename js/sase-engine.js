/* Moteur de dimensionnement Prisma SASE.
   Axe principal : les trois editions du guide de licences public (Secure Web
   Gateway, ZTNA, Enterprise), une par tenant, et ses trois compteurs (par
   utilisateur, par Mbps, par site et par palier). Entrees (voir defaults) ->
   nomenclature : une ligne par brique, avec la quantite, l'unite, la regle
   appliquee et la cle de source (SASE_RULES.src), plus des alertes de
   coherence. Aucun prix, aucune reference de commande.
   - Une quantite que les sources ne permettent pas de calculer reste nulle :
     l'interface l'affiche « unité non publiée ».
   - tbc : la ligne ne repose que sur une source non publique (src.pub ===
     false) ; unitTbc : seule l'unite en depend. L'interface ecrit alors
     « [à confirmer] ». */
(function (root) {
  'use strict';

  function defaults() {
    return {
      needs: { internet: true, privateApps: false, browser: false },
      edition: 'auto',          // auto | swg | ztna | enterprise
      tenants: 1,
      mu: { users: 0, clientless: 0 },
      rn: { model: 'site', sites: [] },   // site (compteur par site et par palier) | net (compteur par Mbps) ; sites : [{ n, mbps, region, ha, sdwan, poe, cell, sfp10, rugged, virt }]
      dc: { count: 0, mbps: 0, sdwan: false, ha: false, virt: false },
      ztnaConnectors: 0,
      dataTB: 0,                // transfert annuel prevu, en To
      coloLinks: 0,
      sdwanModel: 'device',     // device | site | aggregate (sites hors compteur par site)
      addons: {},               // { id: true }
      flows: { toDc: false, toDcMbps: 0, b2b: false, toBranch: false },   // trafic des sites
      apps: { ad: false, cloudEnvs: 0, cloudHa: false },                   // hebergement des applications privees
      pb: { staff: 0, ext: 0, extLic: 'auto', priv: false, rdp: false, thick: false, identity: false, rum: false, advWeb: false, edu: false, ngfw: false }
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
    o.flows = Object.assign(defaults().flows, i.flows || {});
    o.apps = Object.assign(defaults().apps, i.apps || {});
    o.pb = Object.assign(defaults().pb, i.pb || {});
    o.flows.toDcMbps = int(o.flows.toDcMbps); o.apps.cloudEnvs = int(o.apps.cloudEnvs);
    o.pb.staff = int(o.pb.staff); o.pb.ext = int(o.pb.ext);
    if (['auto', 'mu', 'standalone'].indexOf(o.pb.extLic) === -1) o.pb.extLic = 'auto';
    ['toDc', 'b2b', 'toBranch'].forEach(k => { o.flows[k] = !!o.flows[k]; });
    o.apps.ad = !!o.apps.ad; o.apps.cloudHa = !!o.apps.cloudHa;
    ['priv', 'rdp', 'thick', 'identity', 'rum', 'advWeb', 'edu', 'ngfw'].forEach(k => { o.pb[k] = !!o.pb[k]; });
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

  /* Une liste de cles est publique si l'une au moins renvoie a une source publiee. */
  function isPub(R, keys) {
    const k = String(keys || '').split(/,\s*/).filter(Boolean);
    return k.some(x => R.src[x] && R.src[x].pub !== false);
  }

  function size(input, R) {
    R = R || root.SASE_RULES;
    const x = merge(input);
    const lines = [], alerts = [], notes = [];
    const line = (grp, name, qty, unit, why, src, extra) => lines.push(Object.assign({ grp, name, qty, unit, why, src, tbc: !isPub(R, src) }, extra || {}));
    const alert = (lvl, text, src) => alerts.push({ lvl, text, src: src || null, tbc: !!src && !isPub(R, src) });
    const note = (text, src) => notes.push({ text, src, tbc: !isPub(R, src) });
    const T = R.rnSite.tiers, XL = T[T.length - 1].mbps;

    const users = x.mu.users + x.mu.clientless;
    const sites = x.rn.sites;
    const nSites = sites.reduce((a, s) => a + s.n, 0);
    const hasMu = users > 0, hasRn = nSites > 0;
    const pbN = x.pb.staff + x.pb.ext;
    if (!hasMu && !hasRn && !pbN) alert('info', 'Renseignez des utilisateurs nomades, des sites ou des utilisateurs Prisma Browser pour obtenir une nomenclature.');
    /* Flux des sites et hebergement des applications : ils font naitre le besoin d'applications privees */
    const F = x.flows, A = x.apps;
    if (hasRn && (F.b2b || F.toBranch)) x.addons.interconnect = true;

    /* 1. Edition (une par tenant), tableau 1 du guide public */
    let ed = x.edition;
    const privWhy = [];
    if (x.needs.privateApps) privWhy.push('applications internes à atteindre');
    if (x.dc.count) privWhy.push(x.dc.count + ' data center' + (x.dc.count > 1 ? 's' : ''));
    if (A.cloudEnvs) privWhy.push('applications dans ' + A.cloudEnvs + ' environnement' + (A.cloudEnvs > 1 ? 's' : '') + ' cloud');
    if (hasRn && F.toDc) privWhy.push('données des sites remontées vers le data center');
    if (hasRn && hasMu && F.toBranch) privWhy.push('serveurs des sites joints par les nomades');
    if (A.ad) privWhy.push('authentification sur l’Active Directory du data center');
    const wantPriv = privWhy.length > 0;
    const usePA = hasMu || hasRn;
    if (ed === 'auto') ed = x.needs.browser || (x.needs.internet && wantPriv) ? 'enterprise' : wantPriv ? 'ztna' : 'swg';
    /* Trace de decision et ecarts de chaque edition avec le besoin */
    const decision = [];
    if (x.needs.internet) decision.push({ t: 'Accès internet à sécuriser', e: 'Advanced URL Filtering et Advanced DNS Security : Secure Web Gateway ou Enterprise.' });
    if (wantPriv) decision.push({ t: 'Applications privées : ' + privWhy.join(', '), e: 'Service Connections et ZTNA Connectors : ZTNA ou Enterprise, ou Secure Web Gateway avec Private App Access.' });
    if (x.needs.browser) decision.push({ t: 'Navigateur d’entreprise ou données SaaS à protéger', e: 'Prisma Browser Core et SaaS Inline Security ne sont inclus que dans Enterprise.' });
    const useNetPre = hasRn && x.rn.model === 'net';
    const compare = R.editions.map(e => {
      const gaps = [], block = [];
      if (x.needs.internet && e.id === 'ztna') block.push('ni Advanced URL Filtering ni Advanced DNS Security : l’accès internet n’est pas couvert');
      if (wantPriv && !e.privateApps) gaps.push('Private App Access en add-on');
      if (x.needs.browser && e.id !== 'enterprise') gaps.push('SaaS Inline et Prisma Browser en add-ons');
      if (useNetPre && e.personas.indexOf('net') === -1) block.push('pas de compteur par Mbps');
      if (e.id === 'enterprise' && !wantPriv && !x.needs.browser) gaps.push('inclut applications privées et Prisma Browser, non demandés ici');
      return { id: e.id, name: e.name, gaps, block };
    });
    const E = R.editions.find(e => e.id === ed) || R.editions[2];
    if (x.edition !== 'auto' && usePA) {
      if (!E.privateApps && wantPriv) alert('warn', 'Secure Web Gateway n’inclut pas la connexion aux applications privées : l’add-on Private App Access est ajouté pour chaque compteur.', 'palg');
      if (ed === 'ztna' && x.needs.internet) alert('warn', 'ZTNA n’inclut ni Advanced URL Filtering ni Advanced DNS Security : la sécurité de l’accès internet relève de Secure Web Gateway ou d’Enterprise.', 'palg');
      if (ed !== 'enterprise' && x.needs.browser) alert('warn', 'Prisma Browser Core et SaaS Inline Security ne sont inclus que dans Enterprise ; sinon, add-ons.', 'palg');
    }
    if (x.tenants > 1) alert('info', R.oneEdition, 'allocl');
    if (ed === 'swg' && usePA) R.conflicts.forEach(c => note(c, 'palg, cat'));

    /* Compteurs presents et leurs quantites */
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

    /* Lignes d'une offre declinee par compteur ; renvoie le nombre de compteurs servis. */
    const perPersona = (grp, label, why, src, only, extra) => {
      let n = 0;
      const ok = p => present[p] && (!only || only.indexOf(p) !== -1);
      if (ok('user')) { n++; line(grp, label + ' (par utilisateur)', users, R.personas.user.unit, why, src, extra); }
      if (ok('net')) { n++; line(grp, label + ' (par Mbps)', netMbps, R.personas.net.unit, why, src, extra); }
      if (ok('site')) { n++; T.forEach(t => { if (siteTiers[t.id]) line(grp, label + ' (par site, ' + t.name + ')', siteTiers[t.id], 'sites', why + ' Au palier du site.', src, extra); }); }
      return n;
    };
    const inclOf = p => ({ incl: E.pub.concat(R.personaPub[p] || []), inclTbc: (E.extra[p] || []).slice() });

    /* 2. Editions par compteur */
    const base = 'Prisma Access ' + E.name;
    if (hasMu) {
      line('core', base + ', par utilisateur', users, 'utilisateurs', R.mu.note + ' Compteur par utilisateur et par an.', R.mu.src + ', palg', inclOf('user'));
      if (ed === 'enterprise' && users >= R.entUserSites.minUsers) note('Enterprise par utilisateur, à partir de 2 000 utilisateurs : 5 sites de 10 Mbps inclus.', 'cat');
    }
    if (useSite) {
      let first = true;
      T.forEach(t => { if (siteTiers[t.id]) { line('core', base + ', par site, ' + t.name, siteTiers[t.id], 'sites', 'Palier de bande passante du site (entrant + sortant), 10 % de dépassement toléré, Egress NAT et redondance régionale inclus. Compteur par site et par an.', R.rnSite.src + ', palg', first ? inclOf('site') : {}); first = false; } });
      if (split) alert(wantPriv ? 'crit' : 'warn', R.rnSite.splitNote, 'site');
      alert('info', 'Le compteur par site demande Prisma Access 6.0 ou plus.', 'site');
    }
    if (useNet) {
      if (E.personas.indexOf('net') === -1) {
        alert('crit', 'Pas d’édition ' + E.name + ' au compteur par Mbps : prendre le compteur par site, ou Secure Web Gateway ou Enterprise par Mbps.', 'cat');
      } else {
        line('core', base + ', par Mbps', netMbps, 'Mbps', 'Somme des débits (entrant + sortant) par compute location, 50 Mbps au moins par compute location. Compteur par Mbps et par an.', R.rnAgg.src + ', palg', inclOf('net'));
      }
      Object.keys(regions).forEach(r => {
        const mb = Math.max(R.rnAgg.minPerLocation, regions[r]), nodes = Math.ceil(mb / R.rnAgg.nodeMbps);
        note(r + ' : ' + mb.toLocaleString('fr-FR') + ' Mbps alloués' + (mb > regions[r] ? ' (minimum de 50 par compute location)' : '') + ', ' + nodes + ' IPSec Termination Node' + (nodes > 1 ? 's' : '') + '.', 'alloc, rncheck');
        const nS = sites.filter(s => s.region === r).reduce((a, s) => a + s.n, 0);
        if (nS > nodes * R.rnAgg.sitesPerNode) alert('warn', r + ' : ' + nS + ' sites pour ' + nodes + ' IPSec Termination Node(s), au plus ' + R.rnAgg.sitesPerNode + ' par nœud.', 'rncheck');
      });
      alert('info', R.rnAgg.noQosInbound, 'alloc');
    }
    if (hasRn && sites.some(s => s.mbps > R.rnHp.tunnelMbps)) alert('info', 'Un tunnel de Remote Network porte au plus 2 Gbps : au-delà, plusieurs tunnels (ECMP, jusqu’à 4, BGP requis) ou Remote Network High Performance.', 'rnhp, alloc');

    /* 3. Applications privees : Service Connections, ZTNA Connectors */
    let scNeed = 0;
    let dcMbps = x.dc.mbps;
    if (x.dc.count && hasRn && F.toDc && F.toDcMbps) {
      const per = Math.ceil(F.toDcMbps / x.dc.count);
      if (per > dcMbps) { dcMbps = per; note('Débit par data center porté à ' + fmtMbps(per) + ' : ' + fmtMbps(F.toDcMbps) + ' remontés des sites, répartis sur ' + x.dc.count + ' data center' + (x.dc.count > 1 ? 's' : '') + '.', 'sc, schb'); }
    }
    if (x.dc.count) {
      const perDc = dcMbps ? Math.max(1, Math.ceil(dcMbps / R.scMbps)) : 1;
      scNeed = x.dc.count * Math.min(perDc, R.scMaxRecommended);
      if (perDc > R.scMaxRecommended) alert('warn', 'Plus de ' + R.scMaxRecommended + ' Service Connections par data center ne sont pas recommandées (environ 1 Gbps chacune) : ZTNA Connector ou Colo-Connect.', 'schb');
    } else if ((hasMu && hasRn) || (A.ad && usePA)) scNeed = 1;
    if (A.ad && usePA) note(R.adOnPrem, 'sc');
    if (A.ad && !x.dc.count && usePA) alert('warn', 'Active Directory sur site sans data center saisi : une Service Connection est comptée vers le site qui l’héberge.', 'sc');
    let zc = x.ztnaConnectors;
    if (A.cloudEnvs && usePA) {
      const need = A.cloudEnvs * (A.cloudHa ? 2 : 1);
      if (need > zc) zc = need;
      note(R.cloudZtna + ' ' + A.cloudEnvs + ' environnement' + (A.cloudEnvs > 1 ? 's' : '') + (A.cloudHa ? ', deux connecteurs chacun pour la redondance.' : ', un connecteur chacun.'), 'ztnaon, ztna');
    }
    if (E.privateApps) {
      if (scNeed) line('pa', 'Service Connections', scNeed, 'connexions', (x.dc.count ? 'Environ 1 Gbps par Service Connection, une par data center au moins. ' : R.scNote + ' ') + E.sc + ' incluses dans ' + E.name + '.', 'sc, schb, palg');
      if (scNeed > E.sc) line('addon', 'Private App Access, Service Connections supplémentaires', scNeed - E.sc, 'Service Connections', 'Au-delà des ' + E.sc + ' incluses. Private App Access porte jusqu’à 200 connecteurs ; unité par Service Connection.', 'palg, cat, sc', { unitTbc: true });
      if (zc) line('pa', 'ZTNA Connectors', zc, 'connecteurs', E.ztnaConn + ' inclus dans ' + E.name + ', jusqu’à 2 Gbps par connecteur.', 'palg, ztnaon');
      if (zc > E.ztnaConn) alert('warn', zc + ' ZTNA Connectors pour ' + E.ztnaConn + ' inclus : Private App Access porte jusqu’à 200 connecteurs ; l’unité de cette extension n’est pas publiée.', R.privateAppSrc);
    } else if (wantPriv || (hasMu && hasRn)) {
      perPersona('addon', 'Private App Access', 'Connexion aux Service Connections et aux ZTNA Connectors, absente de Secure Web Gateway.', 'palg', null, { unitTbc: true });
      if (scNeed) line('pa', 'Service Connections', scNeed, 'connexions', (x.dc.count ? 'Environ 1 Gbps par Service Connection, une par data center au moins.' : R.scNote) + ' Nombre inclus avec Private App Access non publié.', 'sc, schb');
      if (zc) line('pa', 'ZTNA Connectors', zc, 'connecteurs', 'Jusqu’à 2 Gbps par connecteur. Nombre inclus avec Private App Access non publié.', 'ztnaon');
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
      const s = { mbps: dcMbps, sfp10: dcMbps > 1000, virt: x.dc.virt };
      const pick = pickIon(R, s, true), per = x.dc.ha ? 2 : 1;
      if (pick) line('sdwan', pick.id + ' (data center)', per * x.dc.count, 'appareils', 'Data centers de ' + fmtMbps(dcMbps) + (x.dc.ha ? ', en paire HA' : '') + ' : ' + pickWhy(pick, s, true) + '.', R.ionSrc, { ion: pick });
      else alert('crit', 'Aucun ION data center ne tient ' + fmtMbps(dcMbps) + '.', R.ionSrc);
      line('sdwan', 'Abonnement ' + (x.dc.virt ? 'Virtual ION' : 'ION') + ' Data Center', per * x.dc.count, 'abonnements', R.sdwan.dc, R.sdwan.src);
    }
    if (sdSites.length) {
      const S = R.sdwan;
      if (useSite) {
        note(S.siteCoreIncl, 'palg');
      } else if (x.sdwanModel === 'device') {
        const c = {};
        sdSites.forEach(s => {
          const tiers = s.virt ? S.device.vtiers : S.device.tiers, t = tiers.find(t => s.mbps <= t);
          const k = (s.virt ? 'v' : 'p') + (t || 'x'); c[k] = (c[k] || 0) + s.n * (s.ha ? 2 : 1);
        });
        Object.keys(c).sort((a, b) => (parseInt(a.slice(1)) || 1e9) - (parseInt(b.slice(1)) || 1e9)).forEach(k => {
          const v = k[0] === 'v', m = k.slice(1);
          if (m === 'x') { alert('crit', 'Un site dépasse le plus haut palier d’abonnement par appareil (' + (v ? '500 Mbps en ION virtuel' : '2,5 Gbps') + ').', v ? S.device.vtiersSrc : S.src); return; }
          line('sdwan', 'Abonnement ' + (v ? 'Virtual ION' : 'ION') + ' Branch par appareil, ' + fmtMbps(+m), c[k], 'abonnements', S.device.note, S.src + (v ? ', ' + S.device.vtiersSrc : ''), v ? { unitTbc: true } : {});
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
      note(S.perDeviceAddons, 'cat');
    }

    /* 4 bis. Prisma Browser : seul ou en add-on de Prisma Access.
       Salaries : add-on des Mobile Users quand le projet a Prisma Access,
       licence seule sinon. Prestataires : licence seule par defaut (aucun
       Mobile User consomme), ou comptes en Mobile Users avec l'add-on. */
    const P = x.pb, PB = R.pb;
    const pbOut = { groups: [] };
    if (pbN) {
      const pro = Object.keys(PB.proWhy).filter(k => P[k]);
      const needPriv = P.priv || P.rdp;
      const extMu = P.ext && usePA && P.extLic === 'mu';
      const extStd = P.ext && !extMu;
      const staffAddon = P.staff && usePA;
      const pickEd = (addon) => {
        if (pro.length) return { id: 'pro', why: 'Pro : ' + pro.map(k => PB.proWhy[k]).join(', ') + '.' };
        if (addon) return { id: 'core', why: 'Core suffit : internet, SaaS' + (needPriv ? ', et applications privées par les connexions du tenant Prisma Access' : '') + '.' };
        if (P.edu) return { id: 'edu', why: 'Education : établissement d’enseignement, contenu de Core.' };
        return { id: 'core', why: 'Core : internet et SaaS' + (needPriv ? ' ; les applications privées passent par l’extension Private App Access (Pro les inclut)' : '') + '.' };
      };
      const edName = id => PB.editions.find(e => e.id === id).name;
      /* Add-on : salaries, et prestataires comptes en Mobile Users */
      const addN = (staffAddon ? P.staff : 0) + (extMu ? P.ext : 0);
      if (addN) {
        const e = pickEd(true);
        if (e.id === 'core' && ed === 'enterprise' && hasMu) {
          line('pb', 'Prisma Browser Core, inclus dans Enterprise', addN, 'utilisateurs', 'Enterprise par utilisateur inclut Prisma Browser Core. ' + e.why, 'palg');
        } else {
          line('pb', edName(e.id) + ', add-on Prisma Access', addN, 'utilisateurs', e.why + ' ' + PB.addonPerUser, 'palg, cat', { unitTbc: true, tbc: false });
        }
        if (needPriv) note(PB.addonPriv, 'cat');
        if (addN > users) alert('warn', addN.toLocaleString('fr-FR') + ' utilisateurs Prisma Browser en add-on pour ' + users.toLocaleString('fr-FR') + ' Mobile Users : ' + PB.addonPerUser, 'cat');
        pbOut.groups.push({ who: 'add-on', n: addN, ed: e.id });
      }
      /* Licence seule : salaries sans Prisma Access, prestataires par defaut */
      const stdN = (P.staff && !usePA ? P.staff : 0) + (extStd ? P.ext : 0);
      if (stdN) {
        const e = pickEd(false);
        line('pb', edName(e.id) + ', licence seule', stdN, 'utilisateurs', e.why + ' Par utilisateur et par an, quel que soit le nombre d’appareils.' + (extStd && usePA ? ' Prestataires sans Mobile User ni agent.' : ''), e.id === 'edu' ? 'cat' : 'pbsa, palg', { unitTbc: true });
        if (needPriv && e.id !== 'pro') line('pb', PB.standalonePriv.name, stdN, 'utilisateurs', PB.standalonePriv.desc, 'cat');
        note(PB.alloc, 'pbsa');
        note(PB.aiAccess, 'pbsa');
        if (needPriv) {
          note(P.ngfw ? PB.ngfwPath : PB.pbcPath, 'pbdeck');
          if (!usePA && x.dc.count) alert('info', 'Sans Prisma Access, les data centers se joignent par le Prisma Browser Connector ou les ZTNA Connectors, pas par des Service Connections.', 'pbdeck');
        }
        if (extStd && usePA) alert('info', PB.mix, 'cat');
        pbOut.groups.push({ who: 'seule', n: stdN, ed: e.id });
      }
      if (P.rdp) note(PB.rdp, 'pbdeck');
      if (P.edu && pro.length) note('Education n’existe qu’au niveau de Core : un besoin Pro fait passer à Prisma Browser Pro.', 'cat');
    }

    /* 5. Add-ons */
    R.addons.forEach(a => {
      if (!x.addons[a.id] || a.id === 'scQty') return;
      if (pbN && (a.id === 'browserCore' || a.id === 'browserPro')) return;
      const inc = a.inc || [];
      const incSrc = a.incSrc ? a.src + ', ' + a.incSrc : R.editionSrc;
      const incTbc = !!a.incSrc && !isPub(R, a.incSrc);
      if (inc.indexOf(ed) !== -1 || (a.id === 'privateApp' && E.privateApps)) { line('incl', a.name, null, '', 'Inclus dans ' + E.name + '.', incSrc, { tbc: incTbc }); return; }
      if (a.id === 'privateApp' && lines.some(l => l.name.indexOf('Private App Access (') === 0)) return;
      if (a.id === 'rbi' && !hasMu && !hasRn) alert('warn', 'Remote Browser Isolation requiert un abonnement Mobile User ou Remote Network.', 'rbi');
      const uTbc = !!a.unitSrc && !isPub(R, a.unitSrc);
      if (a.per) {
        const only = a.per.filter(p => inc.indexOf(ed + ':' + p) === -1);
        const inSite = inc.indexOf(ed + ':site') !== -1 && present.site;
        if (inSite) line('incl', a.name + ' (par site)', null, '', 'Inclus dans ' + E.name + ' par site.', incSrc, { tbc: incTbc });
        const n = perPersona('addon', a.name, a.desc, a.src, only, { unitTbc: uTbc });
        if (!n && !inSite) line('addon', a.name, null, '', a.desc + ' Proposé ' + a.per.map(p => R.personas[p].per).join(', ') + ' : aucun compteur correspondant dans ce besoin.', a.src, { unitTbc: uTbc });
        return;
      }
      let q = null;
      const units = users + netMbps, inclTB = units * R.includedGB / 1000;
      if (a.fixed === 'perTB') q = x.dataTB > inclTB && !useSite ? Math.ceil(x.dataTB - inclTB) : null;
      else if (a.fixed === 'perLink') q = x.coloLinks || null;
      else if (a.fixed === 'flat') q = 1;
      line('addon', a.name, q, a.fixed ? R.fixedUnits[a.fixed] : '', a.desc + (a.fixed === 'perTB' && q == null ? (useSite ? ' Allocation des compteurs par site non publiée.' : ' Indiquez le transfert annuel prévu.') : '') + (a.fixed === 'perLink' && q == null ? ' Indiquez le nombre de liens.' : ''), a.src, { unitTbc: uTbc });
    });
    if (x.addons.scmPro && useNet) note(R.ademRn, R.ademRnSrc);

    /* Transfert de donnees : 250 GB par unite et par an (1 Mobile User ou 1 Mbps) */
    const units = users + netMbps, inclTB = units * R.includedGB / 1000;
    if (x.dataTB > 0) {
      if (useSite) alert('info', 'Allocation de transfert des compteurs par site non publiée : à vérifier avec Palo Alto Networks.', 'cat');
      else if (x.dataTB > inclTB && !x.addons.excess) alert('warn', 'Transfert prévu de ' + x.dataTB.toLocaleString('fr-FR') + ' To pour ' + inclTB.toLocaleString('fr-FR') + ' To alloués (250 GB par unité et par an, ' + units.toLocaleString('fr-FR') + ' unités) : add-on Excess Data Transfer.', R.includedSrc);
    }

    return { input: x, edition: E, lines, alerts, notes, decision, compare, privWhy, pb: pbOut, usePA, included: R.allEditions, includedTB: useSite ? null : inclTB };
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

  const api = { size, defaults, isPub: k => isPub(root.SASE_RULES, k), pickIon: (s, dc) => pickIon(root.SASE_RULES, s, dc), fmtMbps };
  root.SaseEngine = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
