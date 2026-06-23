/* ============================================================
   Palo Alto Networks — Shared Header  v2
   ============================================================ */
(function () {
  // Detect current page for active nav state
  const page = location.pathname.split('/').pop() || 'index.html';

  function isActive(href) {
    return page === href ? 'style="color:var(--text-bright)"' : '';
  }

  const headerHTML = `
<header class="site-header">
  <!-- Logo -->
  <a class="header-logo" href="index.html" title="Accueil">
    <img class="logo-dark"  src="img/PANW_BIG.D.png" alt="Palo Alto Networks" />
    <img class="logo-light" src="img/PANW.png"        alt="Palo Alto Networks" />
  </a>

  <div class="logo-sep"></div>
  <span class="header-title">Sizing Guide <span>PANW</span></span>

  <div class="header-spacer"></div>

  <nav class="header-nav">
    <!-- Products dropdown -->
    <div class="dropdown">
      <button class="nav-btn">Produits ▾</button>
      <div class="dropdown-menu">
        <a class="dropdown-item" href="pa-series.html">
          <div class="dropdown-icon">PA</div>
          <div>
            <span class="dropdown-item-name">PA-Series</span>
            <span class="dropdown-item-sub">Next-Gen Firewalls · PA-400 → PA-7500</span>
          </div>
        </a>
        <a class="dropdown-item" href="panorama.html">
          <div class="dropdown-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>
          <div>
            <span class="dropdown-item-name">Panorama</span>
            <span class="dropdown-item-sub">Gestion centralisée</span>
          </div>
        </a>
        <a class="dropdown-item" href="prisma.html">
          <div class="dropdown-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg></div>
          <div>
            <span class="dropdown-item-name">Prisma Access</span>
            <span class="dropdown-item-sub">SASE · Zero Trust Network Access</span>
          </div>
        </a>
        <a class="dropdown-item" href="browser.html">
          <div class="dropdown-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
          <div>
            <span class="dropdown-item-name">Prisma Access Browser</span>
            <span class="dropdown-item-sub">Enterprise Browser · Zero Trust · Ex-Talon</span>
          </div>
        </a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" href="cortex.html">
          <div class="dropdown-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg></div>
          <div>
            <span class="dropdown-item-name">Cortex</span>
            <span class="dropdown-item-sub">XDR · XSIAM · XSOAR · Xpanse</span>
          </div>
        </a>
      </div>
    </div>

    <a class="nav-btn" href="search.html" ${isActive('search.html')}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>Recherche</a>

    <div class="nav-divider"></div>

    <span class="badge" style="display:none" id="badge-author">LGU@EXN</span>

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
    if (moon) moon.style.display = t === 'dark' ? 'block' : 'none';
    if (sun)  sun.style.display  = t === 'light' ? 'block' : 'none';
  }

  applyTheme(localStorage.getItem('pan-theme') || 'dark');
})();
