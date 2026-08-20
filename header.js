/* ============================================================
   Palo Alto Networks — Shared Header  v3
   Nav plate, couleurs par pilier, sans dropdown
   ============================================================ */
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';

  function cls(href, pillarClass) {
    var base = 'nav-link';
    if (pillarClass) base += ' ' + pillarClass;
    if (page === href) base += ' active';
    return base;
  }

  const headerHTML = `
<header class="site-header">
  <a class="header-logo" href="index.html" title="Accueil">
    <img class="logo-dark"  src="img/PANW_BIG.D.png" alt="Palo Alto Networks" />
    <img class="logo-light" src="img/PANW.png"        alt="Palo Alto Networks" />
  </a>

  <div class="logo-sep"></div>
  <span class="header-title">Sizing Guide <span>PANW</span></span>

  <div class="header-spacer"></div>

  <nav class="header-nav">
    <a class="${cls('pa-series.html','nav-link-netsec')}" href="pa-series.html">Network Security</a>
    <a class="${cls('prisma.html','nav-link-sase')}"      href="prisma.html">SASE</a>
    <a class="${cls('cortex.html','nav-link-cortex')}"    href="cortex.html">Cortex</a>
    <a class="${cls('idira.html','nav-link-identity')}"   href="idira.html">Idira</a>

    <div class="nav-divider"></div>

    <a class="${cls('wizard.html')}"        href="wizard.html">Wizard</a>
    <a class="${cls('qualification.html')}" href="qualification.html">Qualification</a>
    <a class="${cls('search.html')}"    href="search.html">Comparateur</a>
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
