#!/usr/bin/env node
/* ============================================================
   Dimensionnement SASE : cas types joues sur js/sase-engine.js
   avec data/sase-rules.js. Verifie aussi que chaque ligne de la
   nomenclature cite une source connue et que rien ne ressemble
   a un prix ou a une reference de commande.

     node _sase.js
   ============================================================ */
'use strict';
const { SASE_RULES: R } = require('./data/sase-rules.js');
globalThis.SASE_RULES = R;
const E = require('./js/sase-engine.js');

let fails = 0, n = 0;
const ok = (c, m) => { n++; if (!c) { fails++; console.error('  ECHEC ' + m); } };
const run = (inp) => E.size(inp, R);
const find = (r, re) => r.lines.find(l => re.test(l.name));
const has = (r, lvl, re) => r.alerts.some(a => a.lvl === lvl && re.test(a.text));

/* Coherence des regles */
const keys = new Set(Object.keys(R.src));
const srcOk = s => String(s).split(/,\s*/).every(k => keys.has(k));
R.addons.forEach(a => ok(!a.src || srcOk(a.src), 'add-on ' + a.id + ' : source inconnue'));
ok(/—/.test(JSON.stringify(R)) === false, 'em-dash dans les regles');
ok(!/[€$]|\bprix\b|PAN-[A-Z0-9-]{4,}/i.test(JSON.stringify(R)), 'prix ou reference de commande dans les regles');

/* 1. PME, 150 nomades, internet seulement : SWG Local, releve au minimum 200 */
let r = run({ mu: { users: 150 }, needs: { internet: true } });
ok(/Secure Web Gateway/.test(r.edition.name), '1 : edition SWG');
ok(r.covId === 'local', '1 : couverture Local');
ok(find(r, /^Mobile Users$/).qty === 200, '1 : minimum 200 unites Local');
ok(!find(r, /Service Connections/), '1 : pas de Service Connection en SWG');

/* 2. ETI : 1 500 nomades, 30 agences, 2 DC, apps privees : Enterprise Worldwide */
r = run({ mu: { users: 1500 }, needs: { internet: true, privateApps: true }, locations: 8,
  rn: { model: 'site', sites: [{ n: 25, mbps: 100, region: 'Europe', sdwan: true }, { n: 5, mbps: 800, region: 'Europe', sdwan: true, ha: true }] },
  dc: { count: 2, mbps: 1500 }, sdwanModel: 'device' });
ok(r.edition.id === 'enterprise', '2 : Enterprise');
ok(r.covId === 'worldwide', '2 : Worldwide (8 lieux)');
ok(find(r, /site Medium/).qty === 25 && find(r, /site Large/).qty === 5, '2 : paliers de site 25 Medium + 5 Large');
ok(find(r, /^Service Connections$/).qty === 4, '2 : 2 DC x 2 Service Connections (1,5 Gbps)');
ok(!find(r, /Private App Access/), '2 : 4 SC <= 5 incluses');
const ions = r.lines.filter(l => l.name === 'ION 1200').map(l => l.qty);
ok(ions.join() === '25,10', '2 : 25 ION 1200 + 10 en HA (800 Mbps)');
ok(find(r, /par appareil, M/).qty === 25 && find(r, /par appareil, L/).qty === 10, '2 : abonnements par appareil 25 M + 10 L');

/* 3. Agrege : 50 Mbps minimum par compute location */
r = run({ rn: { model: 'aggregate', sites: [{ n: 1, mbps: 20, region: 'Asie' }, { n: 3, mbps: 400, region: 'Europe' }] } });
ok(find(r, /bande passante Asie/).qty === 50, '3 : minimum 50 Mbps par compute location');
ok(find(r, /bande passante Europe/).qty === 1200, '3 : 1 200 Mbps Europe');
ok(/2 IPSec Termination Nodes/.test(find(r, /bande passante Europe/).why), '3 : 2 noeuds pour 1 200 Mbps');

/* 4. Site de 5 Gbps en modele par site avec apps privees : alerte critique */
r = run({ needs: { privateApps: true, internet: true }, rn: { model: 'site', sites: [{ n: 1, mbps: 5000, region: 'FR' }] } });
ok(find(r, /X-Large/).qty === 2, '4 : 2 sites X-Large');
ok(has(r, 'crit', /applications privées/), '4 : alerte modele par site sans apps privees');

/* 5. SWG force avec DC : incoherence */
r = run({ edition: 'swg', dc: { count: 1, mbps: 500 }, mu: { users: 300 } });
ok(has(r, 'crit', /applications privées/), '5 : SWG ne couvre pas les apps privees');

/* 6. Local au-dela de 5 lieux : Additional Locations */
r = run({ coverage: 'local', locations: 7, mu: { users: 300 } });
ok(find(r, /Additional Locations/).qty === 2, '6 : 2 lieux additionnels');

/* 7. ION : PoE + 5G -> ION 1200-S ; 10G -> ION 5200 ; durci -> 3200H ; 2,5 Gbps -> 5200 */
ok(E.pickIon({ mbps: 200, poe: true, cell: true }, false).id === 'ION 1200-S', '7 : PoE + 5G = ION 1200-S');
ok(E.pickIon({ mbps: 500, sfp10: true }, false).id === 'ION 5200', '7 : SFP+ = ION 5200');
ok(E.pickIon({ mbps: 300, rugged: true }, false).id === 'ION 3200H', '7 : durci = ION 3200H');
ok(E.pickIon({ mbps: 2500 }, false).id === 'ION 5200', '7 : 2,5 Gbps = ION 5200');
ok(E.pickIon({ mbps: 9000 }, false) === null, '7 : 9 Gbps en branche = aucun ION');
ok(E.pickIon({ mbps: 20000 }, true).id === 'PA-5440', '7 : 20 Gbps DC = PA-5440');
ok(E.pickIon({ mbps: 300, virt: true }, false).id === 'ION 3108V', '7 : virtuel 300 Mbps = 3108V');

/* 8. Agrege SD-WAN : moyenne < 10 Mbps par ION */
r = run({ rn: { model: 'aggregate', sites: [{ n: 10, mbps: 5, region: 'FR', sdwan: true }] }, sdwanModel: 'aggregate' });
ok(has(r, 'warn', /10/), '8 : alerte moyenne SD-WAN agrege');

/* 9. Add-ons : SaaS Inline inclus en Enterprise, RBI sans source de quantite */
r = run({ edition: 'enterprise', mu: { users: 2000 }, addons: { saasInline: true, rbi: true, dlp: true } });
ok(find(r, /SaaS Inline/).grp === 'incl', '9 : SaaS Inline inclus en Enterprise');
ok(find(r, /Remote Browser Isolation/).qty === null, '9 : quantite RBI non publiee');

/* 10. Plus de 4 SC par DC : alerte Colo-Connect */
r = run({ needs: { privateApps: true }, dc: { count: 1, mbps: 8000 }, mu: { users: 1000 } });
ok(has(r, 'warn', /Colo-Connect/), '10 : alerte au-dela de 4 SC par DC');

/* Toutes les lignes ont une source connue */
[run({ mu: { users: 5000 }, needs: { privateApps: true, internet: true, browser: true }, locations: 20, ztnaConnectors: 30, dc: { count: 3, mbps: 2000, sdwan: true, ha: true },
  rn: { model: 'aggregate', sites: [{ n: 40, mbps: 50, region: 'Europe', sdwan: true }] }, sdwanModel: 'site', addons: Object.fromEntries(R.addons.map(a => [a.id, true])) })]
  .forEach(x => x.lines.concat(x.alerts.filter(a => a.src)).forEach(l => ok(srcOk(l.src), 'source inconnue : ' + l.src + ' (' + (l.name || l.text) + ')')));

if (fails) { console.error('SASE : ' + fails + ' echec(s) sur ' + n); process.exit(1); }
console.log('SASE : OK, ' + n + ' controles.');
