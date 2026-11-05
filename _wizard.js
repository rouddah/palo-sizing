#!/usr/bin/env node
/* ============================================================
   Test du mode guide (wizard.html).
   ------------------------------------------------------------
   Charge wizard.html dans jsdom avec data/pa-models.js et verifie
   que la recommandation PA-Series :
     - couvre toute la gamme en vente (PA-500, PA-1400, PA-1500,
       PA-3400, PA-3500, PA-5400, PA-5500, PA-7500 atteignables) ;
     - ne propose jamais un modele en fin de vente (effective ou
       annoncee), un boitier durci, ni une variante 5G ;
     - suit les donnees : chaque modele propose tient le besoin a 65 %
       de sa datasheet, et c'est le plus petit candidat a le faire ;
     - s'affiche dans l'ecran de resultat apres les 7 questions.

     node _wizard.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = __dirname;
const failures = [];
function log(ok, msg) {
  console.log((ok ? '  [OK]  ' : '  [KO]  ') + msg);
  if (!ok) failures.push(msg);
}

/* Cas de reference, recalcules a la main depuis data/pa-models.js
   (5 Mbps et 10 sessions par utilisateur, entree a 65 %). */
const CASES = [
  // 10 x 5 Mbps = 0,05 Gbps : le plus petit boitier en vente.
  { users: 10,     series: 'PA-500',  entry: 'PA-501' },
  // 300 x 5 Mbps = 1,5 Gbps, il faut 2,31 Gbps TP : PA-540 (2,2) ne
  // tient pas, PA-550 (4,5) si.
  { users: 300,    series: 'PA-500',  entry: 'PA-550' },
  // 1000 users = 5 Gbps, il faut 7,7 Gbps : PA-3410 (7,5) ne tient pas,
  // PA-1510-POE (9) si.
  { users: 1000,   series: 'PA-1500', entry: 'PA-1510-POE' },
  // 1800 users = 9 Gbps, il faut 13,8 Gbps : PA-3510 et PA-3430 portent
  // 15 Gbps, la PA-3510 a moins de sessions, c'est la plus juste.
  { users: 1800,   series: 'PA-3500', entry: 'PA-3510' },
  // 5000 users = 25 Gbps, il faut 38,5 Gbps : PA-5510 (45).
  { users: 5000,   series: 'PA-5500', entry: 'PA-5510' },
  // 12000 users = 60 Gbps, il faut 92,3 Gbps : PA-5550 (120).
  { users: 12000,  series: 'PA-5500', entry: 'PA-5550' },
  // 60000 users = 300 Gbps : seule la PA-7500 tient.
  { users: 60000,  series: 'PA-7500', entry: 'PA-7500' }
];

(async () => {
  const html = fs.readFileSync(path.join(ROOT, 'wizard.html'), 'utf8');
  const dom = new JSDOM(html, {
    url: 'https://palo-sizing.pages.dev/wizard.html',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    beforeParse(win) {
      win.matchMedia = win.matchMedia || (q => ({ matches: false, media: q,
        addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
      win.alert = msg => { throw new Error('alert inattendue : ' + msg); };
    }
  });
  const win = dom.window, doc = win.document;
  // Meme methode que _smoke.js : vraies balises <script> pour que
  // `const MODELS` soit une liaison de script visible des autres.
  for (const src of ['header.js', 'ui.js', 'icons.js', 'data/pa-models.js']) {
    const el = doc.createElement('script');
    el.textContent = fs.readFileSync(path.join(ROOT, src), 'utf8');
    doc.head.appendChild(el);
  }
  await new Promise(r => setTimeout(r, 300));

  const W = win.WizReco;
  const MODELS = win.eval('MODELS');
  log(!!W && typeof W.ngfwModel === 'function', 'WizReco expose par wizard.html');
  if (!W) return done();

  console.log('Candidats');
  const cands = W.candidates();
  const ids = cands.map(m => m.id);
  log(cands.length > 20, cands.length + ' modeles candidats derives des donnees');
  const bad = cands.filter(m => m.eos || m.eosD || /durci/i.test(m.f) || /-5G$/.test(m.id));
  log(bad.length === 0, 'aucun candidat en fin de vente, durci ou 5G' + (bad.length ? ' : ' + bad.map(m => m.id).join(', ') : ''));
  ['PA-500', 'PA-1500', 'PA-3500', 'PA-5500', 'PA-1400', 'PA-3400', 'PA-5400', 'PA-7500'].forEach(s => {
    log(cands.some(m => m.s === s), 'serie ' + s + ' parmi les candidats');
  });
  ['PA-820', 'PA-850', 'PA-7050', 'PA-7080', 'PA-410', 'PA-460'].forEach(id => {
    log(ids.indexOf(id) === -1, id + ' (fin de vente effective ou annoncee) ecarte');
  });

  console.log('Cas de reference');
  CASES.forEach(c => {
    const r = W.ngfwModel(c.users);
    log(r && r.entry === c.entry && r.entryM.s === c.series,
      c.users + ' utilisateurs -> ' + (r ? r.entry : 'rien') + ' (attendu ' + c.entry + ', ' + c.series + ')');
  });

  console.log('Balayage de 1 a 250 000 utilisateurs');
  const reached = new Set();
  let maxErr = null, sweepBad = null, orderBad = null, prevTp = 0;
  for (let u = 1; u <= 250000; u = Math.ceil(u * 1.04)) {
    const r = W.ngfwModel(u);
    [r.entryM, r.comfortM].filter(Boolean).forEach(m => {
      reached.add(m.s);
      if (m.eos || m.eosD || /durci/i.test(m.f) || /-5G$/.test(m.id)) sweepBad = sweepBad || (u + ' -> ' + m.id);
    });
    if (!r.beyond) {
      // tient a 65 % et aucun candidat plus petit ne tient
      const ok = (r.entryM.tp == null || r.needTp <= r.entryM.tp * W.hyp.entry)
        && (r.entryM.sess == null || r.needSess <= r.entryM.sess * W.hyp.entry);
      const smaller = cands.slice(0, cands.indexOf(r.entryM)).find(m =>
        (m.tp == null || r.needTp <= m.tp * W.hyp.entry) && (m.sess == null || r.needSess <= m.sess * W.hyp.entry));
      if (!ok || smaller) maxErr = maxErr || (u + ' -> ' + r.entry + (smaller ? ', plus petit possible : ' + smaller.id : ''));
    }
    if (r.comfortM && !(r.comfortM.tp > r.entryM.tp)) orderBad = orderBad || (u + ' : confort ' + r.comfort + ' pas plus large que ' + r.entry);
    if ((r.entryM.tp || 0) < prevTp) orderBad = orderBad || (u + ' : le modele retenu baisse quand le besoin monte');
    prevTp = r.entryM.tp || 0;
  }
  log(!sweepBad, 'jamais de fin de vente, de durci ni de 5G' + (sweepBad ? ' : ' + sweepBad : ''));
  log(!maxErr, 'entree = plus petit candidat qui tient a 65 %' + (maxErr ? ' : ' + maxErr : ''));
  log(!orderBad, 'confort plus large que l entree, recommandation monotone' + (orderBad ? ' : ' + orderBad : ''));
  ['PA-500', 'PA-1500', 'PA-3500', 'PA-5500', 'PA-7500'].forEach(s => log(reached.has(s), 'serie ' + s + ' recommandee sur le balayage'));
  const huge = W.ngfwModel(10000000);
  log(huge.beyond && huge.entry === 'PA-7500', 'au-dela de la PA-7500 : signale comme etude dediee');
  log(W.ngfwModel(0) === null, '0 utilisateur sur site : pas de recommandation NGFW');

  console.log('Parcours complet (7 questions)');
  try { win.sessionStorage.clear(); } catch (e) {}
  const answers = [
    () => { doc.getElementById('wiz-num').value = '1800'; },
    () => { doc.getElementById('wiz-num').value = '50'; },
    () => { doc.getElementById('wiz-nb-sites').value = '2'; doc.getElementById('wiz-site-size').value = 'Moyen'; },
    () => doc.querySelector('.wiz-choice[data-val="Oui"]').click(),
    () => doc.querySelector('.wiz-choice[data-val="Oui"]').click(),
    () => doc.querySelector('.wiz-choice[data-val="Non"]').click(),
    () => doc.querySelectorAll('.wiz-choice')[0].click()
  ];
  try {
    answers.forEach(a => { a(); doc.getElementById('wiz-next').click(); });
    const entry = doc.getElementById('wiz-ngfw-entry');
    log(entry && entry.textContent === 'PA-3510', 'ecran de resultat : modele d entree ' + (entry ? entry.textContent : 'absent'));
    const link = doc.querySelector('.wiz-detail-link[href^="pa-series.html?cmp="]');
    log(!!link, 'lien vers le comparateur avec les modeles proposes');
    const txt = doc.getElementById('wiz-result').textContent;
    log(!/PA-(410|415|440|445|450|455|460|820|850|7050|7080)\b(?!-)/.test(txt), 'aucun modele en fin de vente cite dans le resultat');
  } catch (e) {
    log(false, 'parcours : ' + e.message);
  }
  done();

  function done() {
    console.log('');
    if (failures.length) { console.log('ECHEC - ' + failures.length + ' controle(s) en erreur.'); process.exit(1); }
    console.log('OK - le mode guide couvre la gamme en vente.');
    process.exit(0);
  }
})().catch(e => { console.error('ERREUR:', e); process.exit(1); });
