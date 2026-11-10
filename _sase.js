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
const all = (r, re) => r.lines.filter(l => re.test(l.name));
const has = (r, lvl, re) => r.alerts.some(a => a.lvl === lvl && re.test(a.text));

/* Coherence des regles : sources connues, ni prix, ni reference, ni ancien axe */
const keys = new Set(Object.keys(R.src));
const srcOk = s => String(s).split(/,\s*/).every(k => keys.has(k));
R.addons.forEach(a => ok(srcOk(a.src), 'add-on ' + a.id + ' : source inconnue'));
const J = JSON.stringify(R);
ok(!/—/.test(J), 'em-dash dans les regles');
ok(!/[€$]|\bprix\b|\bprice\b|PAN-[A-Z0-9-]{4,}|\bSKU\b/i.test(J), 'prix ou reference de commande dans les regles');
ok(!/catalog|\.csv\b/i.test(J + require('fs').readFileSync(__dirname + '/js/sase-engine.js', 'utf8')), 'le document source ne doit pas etre nomme');
ok(!('coverage' in R), 'plus de couverture Local / Worldwide proposee');

/* 1. PME, 150 nomades, internet seulement : User SWG Core */
let r = run({ mu: { users: 150 }, needs: { internet: true } });
ok(r.edition.id === 'swg', '1 : SWG Core');
ok(find(r, /^Prisma Access User SWG Core$/).qty === 150, '1 : 150 utilisateurs, pas de minimum invente');
ok(find(r, /User SWG Core/).incl.indexOf('SaaS Inline') !== -1, '1 : SaaS Inline inclus dans User SWG Core');
ok(!find(r, /Service Connections/), '1 : pas de Service Connection');

/* 2. ETI : 2 000 nomades, 30 agences en Site Core, 2 DC, apps privees : Enterprise Core */
r = run({ mu: { users: 2000 }, needs: { internet: true, privateApps: true },
  rn: { model: 'site', sites: [{ n: 25, mbps: 100, region: 'Europe', sdwan: true }, { n: 5, mbps: 800, region: 'Europe', sdwan: true, ha: true }] },
  dc: { count: 2, mbps: 1500 }, sdwanModel: 'device' });
ok(r.edition.id === 'enterprise', '2 : Enterprise Core');
ok(find(r, /Site Enterprise Core, jusqu’à 250 Mbps/).qty === 25 && find(r, /Site Enterprise Core, jusqu’à 1 Gbps/).qty === 5, '2 : paliers Site 25 x 250 Mbps + 5 x 1 Gbps');
ok(find(r, /^Service Connections$/).qty === 4, '2 : 2 DC x 2 Service Connections');
ok(!find(r, /supplémentaires/), '2 : 4 SC <= 5 incluses');
ok(all(r, /^ION 1200$/).map(l => l.qty).join() === '25,10', '2 : 25 ION 1200 + 10 en HA');
ok(!find(r, /Abonnement ION Branch/), '2 : SD-WAN inclus dans Site Core, pas d’abonnement de branche');
ok(r.notes.some(x => /5 sites de 10 Mbps/.test(x.text)), '2 : 5 sites de 10 Mbps inclus a partir de 2 000 utilisateurs');

/* 3. Net Core par Mbps : 50 Mbps minimum par compute location */
r = run({ edition: 'swg', rn: { model: 'net', sites: [{ n: 1, mbps: 20, region: 'Asie' }, { n: 3, mbps: 400, region: 'Europe' }] } });
ok(find(r, /^Prisma Access Net SWG Core$/).qty === 1250, '3 : 50 (Asie, minimum) + 1 200 (Europe) = 1 250 Mbps');
ok(r.notes.some(x => /Europe : 1\s200 Mbps alloués, 2 IPSec/.test(x.text)), '3 : 2 noeuds pour 1 200 Mbps');

/* 4. Pas d'offre Net ZTNA Core */
r = run({ edition: 'ztna', needs: { privateApps: true, internet: false }, rn: { model: 'net', sites: [{ n: 2, mbps: 100 }] } });
ok(has(r, 'crit', /Net ZTNA Core/), '4 : Net ZTNA Core n’existe pas');

/* 5. Site de 5 Gbps avec apps privees : alerte critique */
r = run({ needs: { privateApps: true, internet: true }, rn: { model: 'site', sites: [{ n: 1, mbps: 5000 }] } });
ok(find(r, /jusqu’à 2,5 Gbps/).qty === 2, '5 : 2 sites de 2,5 Gbps');
ok(has(r, 'crit', /applications privées/), '5 : decoupage sans acces aux apps privees');

/* 6. SWG avec DC : Private App Access par persona */
r = run({ edition: 'swg', dc: { count: 1, mbps: 500 }, mu: { users: 300 }, rn: { model: 'site', sites: [{ n: 4, mbps: 50 }] } });
ok(find(r, /^Private App Access \(User\)$/).qty === 300, '6 : Private App Access par utilisateur');
ok(find(r, /^Private App Access \(Site, jusqu’à 50 Mbps\)$/).qty === 4, '6 : Private App Access par site et palier');

/* 7. Service Connections au-dela des 5 incluses */
r = run({ needs: { privateApps: true }, dc: { count: 4, mbps: 1800 }, mu: { users: 1000 } });
ok(find(r, /Service Connections supplémentaires/).qty === 3, '7 : 8 SC dont 5 incluses = 3 supplementaires');

/* 8. ION : PoE + 5G, SFP+, durci, 2,5 Gbps, DC, virtuel */
ok(E.pickIon({ mbps: 200, poe: true, cell: true }, false).id === 'ION 1200-S', '8 : PoE + 5G = ION 1200-S');
ok(E.pickIon({ mbps: 500, sfp10: true }, false).id === 'ION 5200', '8 : SFP+ = ION 5200');
ok(E.pickIon({ mbps: 300, rugged: true }, false).id === 'ION 3200H', '8 : durci = ION 3200H');
ok(E.pickIon({ mbps: 2500 }, false).id === 'ION 5200', '8 : 2,5 Gbps = ION 5200');
ok(E.pickIon({ mbps: 9000 }, false) === null, '8 : 9 Gbps en branche = aucun ION');
ok(E.pickIon({ mbps: 20000 }, true).id === 'PA-5440', '8 : 20 Gbps DC = PA-5440');
ok(E.pickIon({ mbps: 300, virt: true }, false).id === 'ION 3108V', '8 : virtuel 300 Mbps = 3108V');

/* 9. Abonnements SD-WAN hors Site Core : par appareil, par site, par Mbps */
const sd = m => run({ edition: 'swg', rn: { model: 'net', sites: [{ n: 10, mbps: 100, sdwan: true }, { n: 2, mbps: 300, sdwan: true, ha: true }] }, sdwanModel: m });
r = sd('device');
ok(find(r, /par appareil, 150 Mbps/).qty === 10 && find(r, /par appareil, 500 Mbps/).qty === 4, '9 : par appareil 10 x 150 + 4 x 500 Mbps');
r = sd('site');
ok(find(r, /par site, jusqu’à 250 Mbps/).qty === 10 && find(r, /par site, jusqu’à 2,5 Gbps/).qty === 2, '9 : par site 10 x 250 + 2 x 2 500');
r = sd('aggregate');
ok(find(r, /par Mbps/).qty === 1600, '9 : 1 600 Mbps agreges');
r = run({ rn: { model: 'net', sites: [{ n: 10, mbps: 5, sdwan: true }] }, sdwanModel: 'aggregate', edition: 'swg' });
ok(has(r, 'warn', /au moins 10/), '9 : moyenne < 10 Mbps par ION');

/* 10. Add-ons : unites par persona, fixes, incluses */
r = run({ edition: 'ztna', needs: { privateApps: true, internet: false }, mu: { users: 500 }, rn: { model: 'site', sites: [{ n: 3, mbps: 200 }] }, dataTB: 3.5, coloLinks: 2,
  addons: { saasInline: true, interconnect: true, excess: true, colo: true, byoip: true, rbi: true, dlp: true } });
ok(find(r, /^SaaS Inline \(User\)$/).qty === 500 && find(r, /^SaaS Inline \(Site, jusqu’à 250 Mbps\)$/).qty === 3, '10 : SaaS Inline par utilisateur et par site en ZTNA');
ok(find(r, /^Interconnect \(Site\)$/).grp === 'incl', '10 : Interconnect inclus dans Site ZTNA Core');
ok(find(r, /^Excess Data Transfer$/).qty === 4, '10 : 3,5 To - 0,25 inclus = 4 To');
ok(find(r, /^Colo-Connect$/).qty === 2 && find(r, /^Colo-Connect$/).unit === 'liens', '10 : 2 liens Colo-Connect');
ok(find(r, /^Onboarding des IP du client$/).unit === 'forfait', '10 : forfait');
ok(find(r, /^Remote Browser Isolation$/).qty === null, '10 : RBI unite non publiee');
ok(find(r, /^DLP \(User\)$/).qty === 500, '10 : DLP par utilisateur');
r = run({ edition: 'enterprise', mu: { users: 10 }, addons: { saasInline: true, aiAccess: true } });
ok(find(r, /^SaaS Inline$/).grp === 'incl' && find(r, /^AI Access$/).grp === 'incl', '10 : SaaS Inline et AI Access inclus en Enterprise');

/* 11. Transfert au-dela de 250 GB sans add-on : alerte */
r = run({ mu: { users: 100 }, dataTB: 2 });
ok(has(r, 'warn', /Excess Data Transfer/), '11 : alerte transfert');

/* Toutes les lignes ont une source connue */
[run({ mu: { users: 5000 }, needs: { privateApps: true, internet: true, browser: true }, ztnaConnectors: 30, dc: { count: 3, mbps: 2000, sdwan: true, ha: true }, dataTB: 5, coloLinks: 1,
  rn: { model: 'net', sites: [{ n: 40, mbps: 50, region: 'Europe', sdwan: true }] }, sdwanModel: 'site', addons: Object.fromEntries(R.addons.map(a => [a.id, true])) }),
 run({ edition: 'swg', mu: { users: 300 }, needs: { privateApps: true }, rn: { model: 'site', sites: [{ n: 4, mbps: 900, sdwan: true }] }, addons: Object.fromEntries(R.addons.map(a => [a.id, true])) })]
  .forEach(x => x.lines.concat(x.alerts.filter(a => a.src), x.notes).forEach(l => ok(srcOk(l.src), 'source inconnue : ' + l.src + ' (' + (l.name || l.text) + ')')));

if (fails) { console.error('SASE : ' + fails + ' echec(s) sur ' + n); process.exit(1); }
console.log('SASE : OK, ' + n + ' controles.');
