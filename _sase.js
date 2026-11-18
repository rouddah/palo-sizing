#!/usr/bin/env node
/* ============================================================
   Dimensionnement SASE : cas types joues sur js/sase-engine.js
   avec data/sase-rules.js. Verifie aussi que chaque ligne de la
   nomenclature cite une source connue, que tout ce qui ne repose
   que sur une source non publique porte [a confirmer], que rien
   ne ressemble a un prix ou a une reference de commande, puis
   deroule le mode guide de sase.html dans jsdom.

     node _sase.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
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
R.explain.forEach(g => g.rows.forEach(x => ok(srcOk(x.src) && 'swg' in x.st && 'ztna' in x.st && 'enterprise' in x.st, 'fiche ' + x.n)));
R.glossary.forEach(x => ok(srcOk(x.src), 'glossaire ' + x.n));
R.addons.forEach(a => ok(srcOk(a.src) && (!a.unitSrc || srcOk(a.unitSrc)) && (!a.incSrc || srcOk(a.incSrc)), 'add-on ' + a.id + ' : source inconnue'));
const J = JSON.stringify(R);
ok(!/—/.test(J), 'em-dash dans les regles');
ok(!/[€$]|\bprix\b|\bprice\b|PAN-[A-Z0-9-]{4,}|\bSKU\b/i.test(J), 'prix ou reference de commande dans les regles');
const ENG = fs.readFileSync(path.join(__dirname, 'js/sase-engine.js'), 'utf8');
const PAGE = fs.readFileSync(path.join(__dirname, 'sase.html'), 'utf8');
ok(!/catalog|\.csv\b|\.xlsx\b/i.test(J + ENG + PAGE), 'le document source ne doit pas etre nomme');
ok(!/Exclusive/i.test(J + ENG + PAGE), 'aucune mention de distributeur');
ok(!/—/.test(ENG + PAGE), 'em-dash dans le moteur ou la page');
ok(!('coverage' in R), 'plus de couverture Local / Worldwide proposee');
ok(R.src.cat.pub === false && R.src.pbdeck.pub === false && Object.keys(R.src).filter(k => k !== 'cat' && k !== 'pbdeck').every(k => R.src[k].u), 'seules cat et pbdeck sont non publiques, toutes les autres ont un lien');
ok(R.editions.map(e => e.name).join() === 'Secure Web Gateway,Zero Trust Network Access (ZTNA),Enterprise', 'editions nommees comme le guide public');

/* 1. PME, 150 nomades, internet seulement : Secure Web Gateway */
let r = run({ mu: { users: 150 }, needs: { internet: true } });
ok(r.edition.id === 'swg', '1 : Secure Web Gateway');
let l = find(r, /^Prisma Access Secure Web Gateway, par utilisateur$/);
ok(l && l.qty === 150, '1 : 150 utilisateurs, pas de minimum invente');
ok(l && l.incl.indexOf('Advanced URL Filtering') !== -1 && l.incl.indexOf('SaaS Inline Security') === -1, '1 : guide public, SaaS Inline absent de SWG');
ok(l && l.inclTbc.indexOf('ADEM Core') !== -1 && !l.tbc, '1 : ADEM Core en [a confirmer], la ligne elle-meme est publique');
ok(r.notes.some(x => /SaaS Inline Security/.test(x.text)), '1 : divergence SaaS Inline signalee');
ok(!find(r, /Service Connections/), '1 : pas de Service Connection');

/* 2. ETI : 2 000 nomades, 30 agences au compteur par site, 2 DC, apps privees : Enterprise */
r = run({ mu: { users: 2000 }, needs: { internet: true, privateApps: true },
  rn: { model: 'site', sites: [{ n: 25, mbps: 100, region: 'Europe', sdwan: true }, { n: 5, mbps: 800, region: 'Europe', sdwan: true, ha: true }] },
  dc: { count: 2, mbps: 1500 }, sdwanModel: 'device' });
ok(r.edition.id === 'enterprise', '2 : Enterprise');
ok(find(r, /Enterprise, par site, jusqu’à 250 Mbps/).qty === 25 && find(r, /Enterprise, par site, jusqu’à 1 Gbps/).qty === 5, '2 : paliers 25 x 250 Mbps + 5 x 1 Gbps');
ok(find(r, /Enterprise, par site, jusqu’à 250 Mbps/).incl.indexOf('Egress NAT') !== -1, '2 : Egress NAT inclus au compteur par site');
ok(find(r, /^Service Connections$/).qty === 4, '2 : 2 DC x 2 Service Connections');
ok(!find(r, /supplémentaires/), '2 : 4 SC <= 5 incluses');
ok(all(r, /^ION 1200$/).map(l => l.qty).join() === '25,10', '2 : 25 ION 1200 + 10 en HA');
ok(!find(r, /Abonnement ION Branch/), '2 : abonnement de branche inclus au compteur par site');
const n2 = r.notes.find(x => /5 sites de 10 Mbps/.test(x.text));
ok(n2 && n2.tbc, '2 : 5 sites de 10 Mbps, description d offre seulement, [a confirmer]');

/* 3. Compteur par Mbps : 50 Mbps minimum par compute location */
r = run({ edition: 'swg', rn: { model: 'net', sites: [{ n: 1, mbps: 20, region: 'Asie' }, { n: 3, mbps: 400, region: 'Europe' }] } });
ok(find(r, /^Prisma Access Secure Web Gateway, par Mbps$/).qty === 1250, '3 : 50 (Asie, minimum) + 1 200 (Europe) = 1 250 Mbps');
ok(r.notes.some(x => /Europe : 1\s200 Mbps alloués, 2 IPSec/.test(x.text)), '3 : 2 noeuds pour 1 200 Mbps');

/* 4. Pas de ZTNA par Mbps : non publie, donc [a confirmer] */
r = run({ edition: 'ztna', needs: { privateApps: true, internet: false }, rn: { model: 'net', sites: [{ n: 2, mbps: 100 }] } });
ok(r.alerts.some(a => a.lvl === 'crit' && /ZTNA/.test(a.text) && a.tbc), '4 : pas de ZTNA par Mbps, alerte [a confirmer]');

/* 5. Site de 5 Gbps avec apps privees : alerte critique */
r = run({ needs: { privateApps: true, internet: true }, rn: { model: 'site', sites: [{ n: 1, mbps: 5000 }] } });
ok(find(r, /jusqu’à 2,5 Gbps/).qty === 2, '5 : 2 sites de 2,5 Gbps');
ok(has(r, 'crit', /applications privées/), '5 : decoupage sans acces aux apps privees');

/* 6. SWG avec DC : Private App Access par compteur, unite [a confirmer] */
r = run({ edition: 'swg', dc: { count: 1, mbps: 500 }, mu: { users: 300 }, rn: { model: 'site', sites: [{ n: 4, mbps: 50 }] } });
l = find(r, /^Private App Access \(par utilisateur\)$/);
ok(l && l.qty === 300 && l.unitTbc && !l.tbc, '6 : Private App Access par utilisateur, unite a confirmer');
ok(find(r, /^Private App Access \(par site, jusqu’à 50 Mbps\)$/).qty === 4, '6 : Private App Access par site et palier');

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

/* 9. Abonnements SD-WAN hors compteur par site : par appareil, par site, par Mbps */
const sd = m => run({ edition: 'swg', rn: { model: 'net', sites: [{ n: 10, mbps: 100, sdwan: true }, { n: 2, mbps: 300, sdwan: true, ha: true }] }, sdwanModel: m });
r = sd('device');
ok(find(r, /par appareil, 150 Mbps/).qty === 10 && find(r, /par appareil, 500 Mbps/).qty === 4, '9 : par appareil 10 x 150 + 4 x 500 Mbps');
ok(!find(r, /par appareil, 150 Mbps/).tbc, '9 : paliers alternatifs publies par la doc SD-WAN');
r = sd('site');
ok(find(r, /par site, jusqu’à 250 Mbps/).qty === 10 && find(r, /par site, jusqu’à 2,5 Gbps/).qty === 2, '9 : par site 10 x 250 + 2 x 2 500');
r = sd('aggregate');
ok(find(r, /Branch par Mbps/).qty === 1600 && /WCR et DVR/.test(find(r, /Branch par Mbps/).why), '9 : 1 600 Mbps agreges, ZBFW WCR DVR inclus');
r = run({ rn: { model: 'net', sites: [{ n: 10, mbps: 5, sdwan: true }] }, sdwanModel: 'aggregate', edition: 'swg' });
ok(has(r, 'warn', /au moins 10/), '9 : moyenne < 10 Mbps par ION');
r = run({ edition: 'swg', rn: { model: 'net', sites: [{ n: 3, mbps: 100, sdwan: true, virt: true }] }, sdwanModel: 'device' });
ok(find(r, /Virtual ION Branch par appareil/).unitTbc, '9 : paliers ION virtuel [a confirmer]');

/* 10. Add-ons : unites par compteur, fixes, incluses */
r = run({ edition: 'ztna', needs: { privateApps: true, internet: false }, mu: { users: 500 }, rn: { model: 'site', sites: [{ n: 3, mbps: 200 }] }, coloLinks: 2,
  addons: { saasInline: true, interconnect: true, excess: true, colo: true, byoip: true, rbi: true, dlp: true } });
ok(find(r, /^SaaS Inline \(par utilisateur\)$/).qty === 500 && find(r, /^SaaS Inline \(par site, jusqu’à 250 Mbps\)$/).qty === 3, '10 : SaaS Inline par utilisateur et par site en ZTNA');
l = find(r, /^Interconnect \(par site\)$/);
ok(l && l.grp === 'incl' && l.tbc, '10 : Interconnect inclus en ZTNA par site, [a confirmer]');
ok(find(r, /^Colo-Connect$/).qty === 2 && find(r, /^Colo-Connect$/).unit === 'liens' && find(r, /^Colo-Connect$/).unitTbc, '10 : 2 liens Colo-Connect, unite a confirmer');
ok(find(r, /^Onboarding des IP du client$/).tbc, '10 : onboarding IP, description d offre seulement');
ok(find(r, /^Remote Browser Isolation$/).qty === null && !find(r, /^Remote Browser Isolation$/).tbc, '10 : RBI unite non publiee, add-on public');
ok(find(r, /^Data Loss Protection \(par utilisateur\)$/).qty === 500, '10 : DLP par utilisateur');
r = run({ edition: 'enterprise', mu: { users: 10 }, addons: { saasInline: true, aiAccess: true, browserCore: true } });
ok(find(r, /^SaaS Inline$/).grp === 'incl' && !find(r, /^SaaS Inline$/).tbc, '10 : SaaS Inline inclus en Enterprise (guide public)');
ok(find(r, /^AI Access$/).grp === 'incl' && find(r, /^AI Access$/).tbc, '10 : AI Access inclus en Enterprise selon une description, [a confirmer]');
ok(find(r, /^Prisma Browser Core$/).grp === 'incl', '10 : Prisma Browser Core inclus en Enterprise');
r = run({ edition: 'swg', mu: { users: 10 }, addons: { saasInline: true } });
ok(find(r, /^SaaS Inline \(par utilisateur\)$/).grp === 'addon', '10 : SaaS Inline en add-on pour SWG (guide public)');

/* 11. Transfert : 250 GB par unite et par an */
r = run({ mu: { users: 100 }, dataTB: 20 });
ok(!has(r, 'warn', /Excess Data Transfer/), '11 : 100 utilisateurs = 25 To alloues, 20 To tiennent');
r = run({ mu: { users: 100 }, dataTB: 40 });
ok(has(r, 'warn', /Excess Data Transfer/) && r.includedTB === 25, '11 : 40 To pour 25 To alloues, alerte');
r = run({ mu: { users: 100 }, dataTB: 40, addons: { excess: true } });
ok(find(r, /^Excess Data Transfer$/).qty === 15 && find(r, /^Excess Data Transfer$/).tbc, '11 : 15 To au-dela, unite non publique');
r = run({ rn: { model: 'site', sites: [{ n: 2, mbps: 100 }] }, dataTB: 40 });
ok(r.alerts.some(a => /compteurs par site non publiée/.test(a.text)), '11 : allocation par site non publiee');


/* 12. Flux des sites : remontee vers le DC, AD, clouds, Interconnect */
r = run({ mu: { users: 800 }, needs: { internet: true }, rn: { model: 'site', sites: [{ n: 20, mbps: 100 }] }, dc: { count: 2, mbps: 500 },
  flows: { toDc: true, toDcMbps: 3000, b2b: true }, apps: { ad: true, cloudEnvs: 2, cloudHa: true } });
ok(r.edition.id === 'enterprise', '12 : internet + remontee vers le DC = Enterprise');
ok(find(r, /^Service Connections$/).qty === 4, '12 : 3 Gbps remontes sur 2 DC = 1,5 Gbps chacun = 2 SC par DC');
ok(find(r, /^ZTNA Connectors$/).qty === 4, '12 : 2 clouds x 2 connecteurs');
ok(find(r, /^Interconnect \(par site\)$/).grp === 'incl', '12 : echanges entre sites, Interconnect inclus par site en Enterprise');
ok(r.decision.some(d => /remontées vers le data center/.test(d.t)), '12 : trace de decision');
ok(r.compare.find(c => c.id === 'ztna').block.length && r.compare.find(c => c.id === 'swg').gaps.length, '12 : ZTNA bloque (internet), SWG possible avec add-on');
r = run({ edition: 'swg', mu: { users: 100 }, rn: { model: 'net', sites: [{ n: 5, mbps: 100 }] }, flows: { b2b: true } });
ok(find(r, /^Interconnect \(par Mbps\)$/).qty === 500, '12 : Interconnect par Mbps au compteur agrege');
r = run({ mu: { users: 50 }, apps: { ad: true } });
ok(find(r, /^Service Connections$/).qty === 1 && has(r, 'warn', /Active Directory/), '12 : AD sur site = 1 Service Connection');

/* 13. Prisma Browser */
r = run({ pb: { ext: 200 }, needs: { internet: false } });
ok(!r.usePA && find(r, /^Prisma Browser Core, licence seule$/).qty === 200, '13 : prestataires seuls = Core en licence seule');
ok(!find(r, /^Prisma Access/), '13 : aucune ligne Prisma Access sans utilisateur ni site');
r = run({ pb: { ext: 200, priv: true } });
ok(find(r, /^Prisma Browser Connector, add-on/).qty === 200 && !find(r, /^Prisma Browser Connector, add-on/).tbc && find(r, /^Prisma Browser Connector, add-on/).unitTbc, '13 : licence seule + add-on Prisma Browser Connector (doc publique), unite a confirmer');
r = run({ pb: { ext: 200, priv: true, thick: true } });
ok(find(r, /^Prisma Browser Pro, licence seule$/) && !find(r, /Prisma Browser Connector, add-on/), '13 : besoin Pro, pas d add-on connecteur');
r = run({ pb: { staff: 300, edu: true } });
ok(find(r, /^Prisma Browser Education, licence seule$/).tbc, '13 : Education, description d offre');
r = run({ mu: { users: 1000 }, needs: { internet: true, privateApps: true }, pb: { staff: 300, ext: 50 } });
ok(r.edition.id === 'enterprise' && find(r, /Prisma Browser Core, inclus dans Enterprise/).qty === 300, '13 : salaries en Enterprise = Core inclus');
ok(find(r, /^Prisma Browser Core, licence seule$/).qty === 50 && r.alerts.some(a => /Cohabitation|cohabitation/.test(a.text) && a.tbc), '13 : prestataires en licence seule, cohabitation a confirmer');
r = run({ edition: 'swg', mu: { users: 100 }, pb: { staff: 80, ext: 40, extLic: 'mu', identity: true } });
l = find(r, /^Prisma Browser Pro, add-on Prisma Access$/);
ok(l && l.qty === 120 && l.unitTbc, '13 : SWG + Pro en add-on pour 120 utilisateurs');
ok(has(r, 'warn', /120 utilisateurs Prisma Browser/), '13 : plus d utilisateurs Prisma Browser que de Mobile Users');
r = run({ pb: { ext: 10, priv: true, ngfw: true } });
ok(r.notes.some(n => /PAN-OS 12\.1\.5/.test(n.text) && /Strata Cloud Manager/.test(n.text) && !n.tbc), '13 : NGFW Connector, doc publique');
r = run({ edition: 'swg', mu: { users: 500 }, pb: { staff: 80 } });
ok(find(r, /add-on Prisma Access$/).qty === 500, '13 : add-on Prisma Browser pour tous les Mobile Users du tenant');

/* Toutes les lignes ont une source connue ; une ligne sans source publique porte tbc */
[run({ mu: { users: 5000 }, needs: { privateApps: true, internet: true, browser: true }, ztnaConnectors: 30, dc: { count: 3, mbps: 2000, sdwan: true, ha: true }, dataTB: 5, coloLinks: 1,
  rn: { model: 'net', sites: [{ n: 40, mbps: 50, region: 'Europe', sdwan: true }] }, sdwanModel: 'site', addons: Object.fromEntries(R.addons.map(a => [a.id, true])),
  flows: { toDc: true, toDcMbps: 5000, b2b: true, toBranch: true }, apps: { ad: true, cloudEnvs: 3 }, pb: { staff: 100, ext: 100, priv: true, rdp: true, ngfw: true } }),
 run({ pb: { ext: 30, priv: true, edu: true, thick: true } }),
 run({ edition: 'swg', mu: { users: 300 }, needs: { privateApps: true }, rn: { model: 'site', sites: [{ n: 4, mbps: 900, sdwan: true }] }, addons: Object.fromEntries(R.addons.map(a => [a.id, true])) })]
  .forEach(x => x.lines.concat(x.alerts.filter(a => a.src), x.notes).forEach(l => {
    ok(srcOk(l.src), 'source inconnue : ' + l.src + ' (' + (l.name || l.text) + ')');
    if (!E.isPub(l.src)) ok(l.tbc, 'source non publique sans [a confirmer] : ' + (l.name || l.text));
  }));

/* Mode guide dans jsdom : chaque reponse ecrit dans l'etabli */
(async () => {
  const { JSDOM } = require('jsdom');
  let html = PAGE.replace(/<script src="vendor\/[^"]+"><\/script>/g, '')
    .replace(/<script src="([^"]+)"><\/script>/g, (m, f) => '<script>' + fs.readFileSync(path.join(__dirname, f), 'utf8').replace(/<\/script/gi, '<\\/script') + '</script>');
  const dom = new JSDOM(html, { url: 'https://palo-sizing.pages.dev/sase.html?mode=guide', runScripts: 'dangerously', pretendToBeVisual: true,
    beforeParse(w) { w.matchMedia = w.matchMedia || (q => ({ matches: false, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} })); } });
  const w = dom.window, d = w.document, $ = id => d.getElementById(id);
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const click = el => el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  const type = (el, v) => { el.value = v; el.dispatchEvent(new w.Event('input', { bubbles: true })); };
  await wait(50);
  ok(!$('sz-guide').hidden && $('sz-form').hidden, 'guide : ouvert par ?mode=guide, etabli masque');
  ok(w.SaseGuide.steps().join() === 'usage,mu,sites,pb,addons,end', 'guide : sans site ni app privee, ni question SD-WAN, flux ni hebergement');
  click(d.querySelector('[data-f="n-private"]'));
  ok($('n-private').checked, 'guide : la reponse coche l etabli');
  click($('sg-next'));
  type($('sg-f-mu'), '800');
  ok($('f-mu').value === '800', 'guide : utilisateurs reportes dans l etabli');
  click($('sg-next'));
  type($('sg-sites'), '12');
  click($('sg-next'));
  ok(!!d.querySelector('.sg-err'), 'guide : palier de debit exige avant de continuer');
  click(d.querySelector('[data-mbps="250"]'));
  click($('sg-next'));
  ok(/raccorde/.test($('sg-step').textContent), 'guide : question de raccordement quand il y a des sites');
  click(d.querySelector('[data-c="2"]'));
  click($('sg-next'));
  ok(/circulent/.test($('sg-step').textContent), 'guide : question des flux des sites');
  ok(!$('sg-f-todcm'), 'guide : volume remonte cache tant que la remontee n est pas cochee');
  click(d.querySelector('[data-f="f-todc"]'));
  type($('sg-f-todcm'), '3000');
  ok($('f-todcm').value === '3000', 'guide : volume remonte reporte');
  click($('sg-next'));
  ok(/hébergées/.test($('sg-step').textContent), 'guide : question d hebergement quand apps privees');
  type($('sg-f-dc'), '2');
  ok(!!$('sg-f-dcm'), 'guide : debit par DC affiche des qu il y a un DC');
  click($('sg-next'));
  type($('sg-pb-ext'), '60');
  ok(w.SaseGuide.steps().indexOf('pbuse') !== -1 && w.SaseGuide.steps().indexOf('pblic') !== -1, 'guide : questions Prisma Browser des qu il y a des prestataires');
  click($('sg-next'));
  click(d.querySelector('[data-f="pb-rdp"]'));
  click($('sg-next'));
  ok(/prestataires/.test($('sg-step').textContent), 'guide : licence des prestataires');
  click($('sg-next'));
  click(d.querySelector('[data-a="iot"]'));
  click($('sg-next'));
  await wait(250);
  const out = $('sz-out').textContent;
  ok(/Prisma Access Enterprise \+ Prisma Browser/.test(out), 'guide : Enterprise deduit, Prisma Browser ajoute');
  ok(/Pourquoi cette édition/.test(out) && /Retenue/.test(out), 'guide : raison du choix d edition');
  ok(/par site, jusqu’à 250 Mbps/.test(out) && /ION 1200/.test(out), 'guide : 12 sites Medium et leurs ION');
  ok(/IoT \(par site/.test(out), 'guide : add-on IoT par site');
  ok(/Prisma Browser Core, licence seule/.test(out), 'guide : prestataires en licence seule');
  ok(/\[à confirmer\]/.test(out), 'guide : la mention [a confirmer] est rendue');
  click($('sg-wb'));
  ok($('sz-guide').hidden && !$('sz-form').hidden, 'guide : bascule vers l etabli');
  ok(d.querySelector('#sz-profiles [data-k="n"]').value === '12' && d.querySelector('#sz-profiles [data-k="ha"]').checked, 'guide : profil de sites rempli dans l etabli');
  ok($('f-todc').checked && $('pb-ext').value === '60' && $('pb-rdp').checked, 'guide : flux et Prisma Browser dans l etabli');
  click($('sz-m-lic'));
  ok(d.body.classList.contains('lic-on') && d.querySelectorAll('#lic-in .lic-mx').length === 2, 'licences : vue ouverte, matrices editions et Prisma Browser');
  const rb = d.querySelector('#lic-in .rb');
  click(rb);
  ok(rb.getAttribute('aria-expanded') === 'true' && !$(rb.getAttribute('aria-controls')).hidden, 'licences : une ligne se deplie');
  ok(/Question à poser/.test($('lic-in').textContent), 'licences : question a poser');
  ok(!/—/.test($('lic-in').innerHTML), 'licences : pas d em-dash');
  click($('sz-m-wb'));
  ok(!d.body.classList.contains('lic-on'), 'licences : retour a l etabli');
  /* pas de w.close() : les observateurs de ui.js tourneraient sur un document detruit */

  if (fails) { console.error('SASE : ' + fails + ' echec(s) sur ' + n); process.exit(1); }
  console.log('SASE : OK, ' + n + ' controles.');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
