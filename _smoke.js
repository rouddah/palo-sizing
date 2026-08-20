#!/usr/bin/env node
/* ============================================================
   Test de fumee de l'outil de dimensionnement.
   ------------------------------------------------------------
   Charge qualification.html dans un DOM headless, saisit des
   contraintes reelles et verifie que le volet de droite produit
   la bonne gamme. C'est ce qui remplace un `npm run build` sur un
   site sans etape de build : on ne compile pas, on execute.

     node _smoke.js

   Les cas attendus viennent des bornes de datasheet codees dans
   FAMILIES (qualification.html) : un debit de 200 Mbps avec SSL
   et croissance moderee donne 0,39 Gbps TP, soit la PA-400.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = __dirname;

/* Cas de reference : contraintes -> gamme attendue.
   Le debit TP requis se calcule (bw/1000) * croissance * facteurSSL. */
const CASES = [
  {
    name: 'Agence 200 Mbps, SSL actif, croissance moderee',
    set: { 'wiz-bw': '200', 'wiz-users': '250', 'wiz-type': 'branch',
           'wiz-ssl': 'yes', 'wiz-sites': '1', 'wiz-growth': 'moderate' },
    expectFamily: 'PA-400'
  },
  {
    // 1000 * 1,3 * 1,5 = 1,95 Gbps TP, soit exactement 65% de la PA-400 :
    // le cas limite haut de la gamme, la PA-400 doit encore passer.
    name: 'Siege 1 Gbps, SSL actif, croissance moderee (limite PA-400)',
    set: { 'wiz-bw': '1000', 'wiz-users': '800', 'wiz-type': 'campus',
           'wiz-ssl': 'yes', 'wiz-sites': '3', 'wiz-growth': 'moderate' },
    expectFamily: 'PA-400'
  },
  {
    // 1500 * 1,3 * 1,5 = 2,93 Gbps : au-dela des 65% ET des 90% de la
    // PA-400, la gamme doit basculer sur la PA-500.
    name: 'Siege 1,5 Gbps, SSL actif : bascule vers la gamme superieure',
    set: { 'wiz-bw': '1500', 'wiz-users': '900', 'wiz-type': 'campus',
           'wiz-ssl': 'yes', 'wiz-sites': '3', 'wiz-growth': 'moderate' },
    expectFamily: 'PA-500'
  },
  {
    name: 'Datacenter 10 Gbps, SSL actif, croissance forte',
    set: { 'wiz-bw': '10000', 'wiz-users': '5000', 'wiz-type': 'dc',
           'wiz-ssl': 'yes', 'wiz-sites': '1', 'wiz-growth': 'strong' },
    expectFamily: 'PA-5400'
  },
  {
    name: 'Tout vide : l outil doit quand meme repondre sur hypotheses',
    set: {},
    expectFamily: 'PA-400'
  }
];

const failures = [];

function log(ok, msg) {
  console.log((ok ? '  [OK]  ' : '  [KO]  ') + msg);
  if (!ok) failures.push(msg);
}

(async () => {
  const html = fs.readFileSync(path.join(ROOT, 'qualification.html'), 'utf8');
  const dom = new JSDOM(html, {
    url: 'https://palo-sizing.pages.dev/qualification.html',
    runScripts: 'dangerously',
    resources: undefined,
    pretendToBeVisual: true,
    beforeParse(win) {
      // jsdom n'implemente ni le presse-papier ni matchMedia complet
      win.matchMedia = win.matchMedia || (q => ({ matches: false, media: q,
        addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
      Object.defineProperty(win.navigator, 'clipboard', {
        value: { writeText: () => Promise.resolve() }, configurable: true
      });
    }
  });

  const win = dom.window;
  const doc = win.document;

  // Les <script src> locaux ne sont pas charges par jsdom sans serveur.
  // On les injecte comme de vraies balises <script> et non via win.eval :
  // un `const` de premier niveau evalue produit une liaison locale a
  // l'eval, alors qu'une balise <script> cree une liaison de script
  // visible par les autres scripts, exactement comme dans un navigateur.
  // La nuance compte : elle a masque un appel a MODELS qui fonctionnait
  // en production mais echouait ici.
  for (const src of ['header.js', 'ui.js', 'icons.js', 'data/pa-models.js']) {
    const el = doc.createElement('script');
    el.textContent = fs.readFileSync(path.join(ROOT, src), 'utf8');
    doc.head.appendChild(el);
  }

  await new Promise(r => {
    if (doc.readyState === 'complete') return r();
    win.addEventListener('load', r);
    setTimeout(r, 2500);
  });
  // le cablage se fait sur DOMContentLoaded, deja passe pour les scripts
  // injectes apres coup : on rejoue l'initialisation.
  win.eval('setMode("commercial"); wireWorkbench(); runCommercialWizard();');

  console.log('Structure');
  log(!!doc.getElementById('wb-out'), 'le volet de sortie existe');
  log(!!doc.getElementById('wb-form'), 'le volet de saisie existe');
  log(doc.querySelectorAll('.wb-pane').length === 2, 'deux volets rendus');
  log(doc.getElementById('wb-out').getAttribute('aria-live') === 'polite',
      'le volet de sortie est une region live');

  console.log('\nAccessibilite du formulaire');
  const controls = doc.querySelectorAll('#wb-form input, #wb-form select');
  let unlabelled = [];
  controls.forEach(c => {
    const lab = doc.querySelector('label[for="' + c.id + '"]');
    if (!lab && !c.getAttribute('aria-label')) unlabelled.push(c.id);
  });
  log(unlabelled.length === 0,
      controls.length + ' controles, tous etiquetes' + (unlabelled.length ? ' sauf ' + unlabelled.join(', ') : ''));

  const helps = doc.querySelectorAll('.wb-help');
  let notButtons = [...helps].filter(h => h.tagName !== 'BUTTON');
  log(notButtons.length === 0, helps.length + ' bulles d aide, toutes sur un <button> focusable');

  console.log('\nRecommandations');
  for (const c of CASES) {
    // remise a zero
    doc.querySelectorAll('#wb-form input').forEach(el => { el.value = ''; });
    doc.querySelectorAll('#wb-form select').forEach(el => { el.selectedIndex = 0; });
    Object.entries(c.set).forEach(([id, v]) => { doc.getElementById(id).value = v; });
    win.eval('runCommercialWizard()');

    const fam = doc.querySelector('#wb-out .wb-verdict-family');
    const got = fam ? fam.textContent.replace(' Series', '').trim() : '(rien)';
    log(got === c.expectFamily, c.name + ' -> ' + got + ' (attendu ' + c.expectFamily + ')');
  }

  console.log('\nContenu du volet de sortie');
  const out = doc.getElementById('wb-out');
  log(!!out.querySelector('.wb-gauge-fill'), 'jauge de charge presente');
  log(!!out.querySelector('.wb-metrics'), 'tableau besoin/capacite present');
  log(/Gbps|Mbps/.test(out.textContent), 'les unites de debit sont affichees');
  log(!!out.querySelector('#btn-pdf'), 'action PDF cablee');
  log(out.querySelectorAll('svg.ic').length > 0,
      out.querySelectorAll('svg.ic').length + ' pictogrammes SVG rendus');
  log(!/[\u{1F300}-\u{1FAFF}\u{2705}\u{274C}\u{2713}\u{2717}]/u.test(out.textContent),
      'aucun emoji dans la sortie');

  console.log('\nEchappement');
  doc.getElementById('wiz-client').value = '<img src=x onerror=alert(1)>';
  win.eval('runCommercialWizard()');
  log(doc.getElementById('wb-out').querySelectorAll('img').length === 0,
      'le nom du client est echappe (pas d injection HTML)');

  console.log('');
  if (failures.length) {
    console.log('ECHEC - ' + failures.length + ' verification(s) :');
    failures.forEach(f => console.log('  x ' + f));
    process.exit(1);
  }
  console.log('OK - le dimensionnement repond correctement.');
})().catch(e => { console.error('ERREUR:', e); process.exit(1); });
