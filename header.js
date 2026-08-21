/* ============================================================
   Palo Alto Networks — Shared Header  v4
   Nav plate, couleurs par pilier, menu NGFW deroulant
   ============================================================ */
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';

  // Les pages regroupees sous l'entree NGFW
  const NGFW_PAGES = ['pa-series.html', 'qualification.html', 'optiques.html',
                      'accessoires.html', 'panorama.html'];

  function cls(href, pillarClass) {
    var base = 'nav-link';
    if (pillarClass) base += ' ' + pillarClass;
    if (page === href) base += ' active';
    return base;
  }

  const ngfwActive = NGFW_PAGES.indexOf(page) !== -1 ? ' active' : '';

  const ICONS = {
    table: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',
    optic: '<circle cx="12" cy="12" r="3"/><path d="M2 12h7M15 12h7M12 2v7M12 15v7"/>',
    box: '<path d="M21 16V8l-9-5-9 5v8l9 5 9-5z"/><path d="M3.3 7L12 12l8.7-5M12 22V12"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
  };

  function item(href, name, icon) {
    var cur = page === href ? ' current' : '';
    return '<a class="dropdown-item' + cur + '" href="' + href + '">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" '
      + 'stroke-linecap="round" stroke-linejoin="round">' + ICONS[icon] + '</svg>'
      + '<span class="dropdown-item-name">' + name + '</span></a>';
  }

  const headerHTML = `
<header class="site-header">
  <a class="header-logo" href="index.html" title="Accueil">
    <!-- Logos officiels au format vectoriel. Les deux PNG precedents
         pesaient 54 Ko a eux deux, se chargeaient sur chaque page alors
         qu'un seul est visible, et n'etaient meme pas le meme lockup :
         le theme clair affichait une version carree ecrasee. -->
    <img class="logo-dark"  src="img/logo-panw-dark.svg"  alt="Palo Alto Networks" width="150" height="42" />
    <img class="logo-light" src="img/logo-panw-light.svg" alt="Palo Alto Networks" width="150" height="42" />
  </a>

  <div class="logo-sep"></div>
  <span class="header-title">Sizing Guide <span>PANW</span></span>

  <div class="header-spacer"></div>

  <nav class="header-nav">
    <div class="dropdown">
      <a class="nav-link nav-link-netsec${ngfwActive}" href="pa-series.html" aria-haspopup="true" aria-expanded="false">NGFW<span class="nav-caret">&#9662;</span></a>
      <div class="dropdown-menu"><div class="dropdown-inner">
        ${item('pa-series.html', 'Comparateur', 'table')}
        ${item('qualification.html', 'Qualification', 'target')}
        ${item('optiques.html', 'Transceivers', 'optic')}
        ${item('accessoires.html', 'Accessoires', 'box')}
        <div class="dropdown-divider"></div>
        ${item('panorama.html', 'Panorama', 'grid')}
      </div></div>
    </div>

    <a class="${cls('prisma.html', 'nav-link-sase')}"    href="prisma.html">SASE</a>
    <a class="${cls('cortex.html', 'nav-link-cortex')}"  href="cortex.html">Cortex</a>
    <a class="${cls('idira.html', 'nav-link-identity')}" href="idira.html">Idira</a>

    <div class="nav-divider"></div>

    <a class="${cls('wizard.html')}"    href="wizard.html">Wizard</a>
    <a class="${cls('search.html')}"    href="search.html">Recherche</a>
    <a class="${cls('resources.html')}" href="resources.html">Ressources</a>

    <div class="nav-divider"></div>

    <button class="icon-btn" id="theme-toggle" title="Basculer dark / light" onclick="toggleTheme()">
      <svg id="icon-moon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/></svg>
      <svg id="icon-sun"  width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    </button>
  </nav>
</header>`;

  const root = document.getElementById('header-root');
  if (root) root.outerHTML = headerHTML;

  // ── Menu deroulant : clic, clavier, tactile ──
  (function () {
    const dd = document.querySelector('.dropdown');
    if (!dd) return;
    const trigger = dd.querySelector('.nav-link');
    const items = [].slice.call(dd.querySelectorAll('.dropdown-item'));

    function open(v) {
      dd.classList.toggle('open', v);
      trigger.setAttribute('aria-expanded', v ? 'true' : 'false');
    }

    // Le clic ouvre le menu au lieu de suivre le lien : sur tactile il n'y a
    // pas de survol, et sur desktop on evite de partir avant d'avoir choisi.
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      open(!dd.classList.contains('open'));
      if (dd.classList.contains('open') && items[0]) items[0].focus();
    });

    document.addEventListener('click', function (e) {
      if (!dd.contains(e.target)) open(false);
    });

    dd.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { open(false); trigger.focus(); return; }
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      open(true);
      const i = items.indexOf(document.activeElement);
      const n = e.key === 'ArrowDown' ? i + 1 : i - 1;
      (items[(n + items.length) % items.length] || items[0]).focus();
    });
  })();

  // ── Theme ──
  window.toggleTheme = function () {
    const next = (localStorage.getItem('pan-theme') || 'dark') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('pan-theme', next);
    applyTheme(next);
  };

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    const moon = document.getElementById('icon-moon');
    const sun  = document.getElementById('icon-sun');
    if (moon) moon.style.display = t === 'dark'  ? 'block' : 'none';
    if (sun)  sun.style.display  = t === 'light' ? 'block' : 'none';
  }

  applyTheme(localStorage.getItem('pan-theme') || 'dark');
})();
