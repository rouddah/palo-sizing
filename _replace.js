/* Test du moteur de remplacement (js/replace-engine.js) sur les vraies
   donnees : n-1 < iso < n+1 en debit, l'iso couvre tout, aucun modele en
   fin de vente, contraintes dures toujours tenues. node _replace.js */
const fs = require('fs'), vm = require('vm');
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/data/pa-models.js', 'utf8') + ';this.MODELS=MODELS;', ctx);
vm.runInContext(fs.readFileSync(__dirname + '/data/competitors.js', 'utf8') + ';this.COMPETITORS=COMPETITORS;', ctx);
const E = require('./js/replace-engine.js');
const { MODELS, COMPETITORS } = ctx;
let fail = 0;
const ok = (c, msg) => { if (!c) { fail++; console.log('ECHEC', msg); } };
const P0 = { cu1: 0, cu25: 0, cu10: 0, sfp1: 0, sfp10: 0, sfp25: 0, sfp100: 0, sfp400: 0 };
function run(label, q) {
  q = Object.assign({ grow: 0, ha: 'none', form: 'any', vsys: 1, poe: 0, cell: false, psu: false }, q, { ports: Object.assign({}, P0, q.ports || {}) });
  const r = E.propose(MODELS, q);
  const id = m => m ? m.id : '-';
  console.log(label.padEnd(42), id(r.lower).padEnd(16), id(r.iso).padEnd(16), id(r.upper));
  if (!q.cell) [r.lower, r.iso, r.upper].filter(Boolean).forEach(m => ok(!/-5G$/.test(m.id) || !MODELS.some(x => x.id === m.id.replace(/(-D)?-5G$/, '')), label + ' : variante 5G non demandee ' + m.id));
  [r.lower, r.iso, r.upper].filter(Boolean).forEach(m => {
    ok(!E.hardFails(m, q).length, label + ' : ' + m.id + ' viole ' + E.hardFails(m, q));
    ok(!m.eos && !m.eosD, label + ' : fin de vente ' + m.id);
  });
  if (r.iso) ok(E.coverage(r.iso, r.need).every(c => c.ratio == null || c.ratio >= 1), label + ' iso ne couvre pas');
  if (r.lower && r.iso) ok(r.lower.tp < r.iso.tp, label + ' n-1 >= iso');
  if (r.upper && r.iso) ok(r.upper.tp > r.iso.tp, label + ' n+1 <= iso');
  if (r.upper && r.iso && r.upper.tp < r.iso.tp * 1.25) ok(!r.pool.some(m => m.tp >= r.iso.tp * 1.25), label + ' n+1 sans vrai cran');
  return r;
}
const pre = (m) => ({ tp: m.tp, vpn: m.v ? 0 : m.vpn, ports: E.portsNeedFrom(m) });
const C = id => COMPETITORS.models.find(c => c.id === id);
const M = id => MODELS.find(m => m.id === id);

// mgig10 : vitesses lues dans mgigSp
ok(E.mgig10(M('PA-1520-POE')) === 4, 'mgig10 PA-1520');
ok(E.mgig10(M('PA-1530-POE')) === 8, 'mgig10 PA-1530');
ok(E.mgig10(M('PA-3410')) === 12, 'mgig10 PA-3410');
ok(E.mgig10(M('PA-1410')) === 0, 'mgig10 PA-1410');
ok(E.mgig10(C('FG-200G')) === 0, 'mgig10 FG-200G');
ok(E.mgig10(C('FG-1000F')) === 8, 'mgig10 FG-1000F');
// un SFP+ sert un besoin SFP 1G, un multi-gig un besoin cuivre 1G
ok(E.fitPorts(M('PA-3410'), Object.assign({}, P0, { cu1: 12, sfp1: 10 })) === null, 'repli de ports');
ok(E.fitPorts(M('PA-1410'), Object.assign({}, P0, { cu10: 1 })) !== null, 'PA-1410 sans 10GBASE-T');

run('Sans reference, 2 Gbps', { tp: 2 });
run('Sans reference, 10 Gbps, 4 SFP28', { tp: 10, ports: { sfp25: 4 } });
run('PA-3220 absent : PA-850 a l identique', Object.assign(pre(M('PA-850')), { sess: M('PA-850').sess, cps: M('PA-850').cps }));
run('PA-1420 a l identique', Object.assign(pre(M('PA-1420')), { sess: M('PA-1420').sess, cps: M('PA-1420').cps }));
run('PA-5410 a l identique', Object.assign(pre(M('PA-5410')), { sess: M('PA-5410').sess, cps: M('PA-5410').cps }));
run('PA-7080 (fin de vente) a l identique', Object.assign(pre(M('PA-7080')), { sess: M('PA-7080').sess }));
run('FortiGate 60F', pre(C('FG-60F')));
run('FortiGate 200G', pre(C('FG-200G')));
run('FortiGate 200G, ports reduits', { tp: 6, ports: { cu1: 8, sfp10: 2 } });
run('FortiGate 1000F', pre(C('FG-1000F')));
run('FortiGate 1000F + HA A/A', Object.assign(pre(C('FG-1000F')), { ha: 'aa' }));
run('Check Point (premier)', pre(COMPETITORS.models.find(c => c.v === 'checkpoint')));
run('Cisco FP1120', pre(C('Cisco-FP1120')));
run('3 Gbps, 8 PoE, bureau', { tp: 3, poe: 8, form: 'desk' });
run('1 Gbps, 5G', { tp: 1, cell: true });
run('1 Gbps, durci', { tp: 1, form: 'rug' });
run('20 Gbps, 15 vsys', { tp: 20, vsys: 15 });
const r = run('Impossible : 2 Tbps', { tp: 2000 });
ok(!r.iso && r.lower, '2 Tbps : pas d iso, n-1 = plus gros');
const r2 = run('Impossible : bureau + 4 QSFP', { tp: 1, form: 'desk', ports: { sfp100: 4 } });
ok(!r2.pool.length && r2.blockers.ports, 'blocage par ports signale');
console.log(fail ? fail + ' echec(s)' : 'OK');
process.exit(fail ? 1 : 0);
