/* Planche de contact : rend le catalogue en HTML pour controle visuel. */
'use strict';
const fs = require('fs');
const cat = JSON.parse(fs.readFileSync('catalogue.json', 'utf8'));

const only = process.argv[2];               // filtre par categorie
const list = only ? cat.filter(c => c.category.toLowerCase().includes(only.toLowerCase())) : cat;

const byCat = {};
list.forEach(c => (byCat[c.category] = byCat[c.category] || []).push(c));

let html = `<meta charset="utf-8"><style>
 body{background:#0b0f14;color:#d5dde7;font:13px system-ui,sans-serif;margin:0;padding:20px}
 h2{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#FF8A66;
    border-bottom:1px solid #232c38;padding-bottom:6px;margin:26px 0 12px}
 .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:10px}
 .c{background:#151b23;border:1px solid #232c38;border-radius:6px;padding:10px 6px;text-align:center}
 svg{width:34px;height:34px;color:#d5dde7;display:block;margin:0 auto 6px}
 .n{font-size:9.5px;color:#93a1b3;line-height:1.25;word-break:break-word}
 .s{font-family:ui-monospace,monospace;font-size:8px;color:#5b6675;margin-top:3px}
</style><body>`;

for (const [c, items] of Object.entries(byCat)) {
  html += '<h2>' + c + ' (' + items.length + ')</h2><div class="grid">';
  for (const it of items) {
    html += '<div class="c"><svg viewBox="0 0 24 24" fill="currentColor">'
      + it.paths.map(p => '<path d="' + p.d + '"/>').join('')
      + '</svg><div class="n">' + it.label.replace(/&/g, '&amp;').replace(/</g, '&lt;')
      + '</div><div class="s">' + it.slug + '</div></div>';
  }
  html += '</div>';
}
html += '</body>';

const out = only ? 'planche-' + only + '.html' : 'planche.html';
fs.writeFileSync(out, html);
console.log(out + ' : ' + list.length + ' pictogrammes');
