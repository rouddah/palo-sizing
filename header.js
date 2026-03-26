/* ============================================================
   Palo Alto Networks — Shared Header Component
   Inject into every page via: <div id="header-root"></div>
   ============================================================ */

(function () {
  const headerHTML = `
<header class="site-header">
  <a class="header-logo" href="index.html">
    <img src="img/logo-paloalto.svg" alt="Palo Alto Networks" />
    <span class="header-logo-text">Sizing Guide <span>Palo Alto</span></span>
  </a>

  <nav class="header-nav">
    <div class="dropdown">
      <button>Produits ▾</button>
      <div class="dropdown-menu">
        <a class="dropdown-item" href="pa-series.html">
          <img src="img/pa-series.svg" alt="PA-Series" />
          <div class="dropdown-item-text">
            <span class="dropdown-item-name">PA-Series</span>
            <span class="dropdown-item-sub">Next-Gen Firewalls</span>
          </div>
        </a>
        <a class="dropdown-item" href="panorama.html">
          <img src="img/panorama.svg" alt="Panorama" />
          <div class="dropdown-item-text">
            <span class="dropdown-item-name">Panorama</span>
            <span class="dropdown-item-sub">Management Platform</span>
          </div>
        </a>
        <a class="dropdown-item" href="prisma.html">
          <img src="img/prisma.svg" alt="Prisma" />
          <div class="dropdown-item-text">
            <span class="dropdown-item-name">Prisma Access</span>
            <span class="dropdown-item-sub">SASE / Zero Trust</span>
          </div>
        </a>
        <a class="dropdown-item" href="cortex.html" style="opacity:0.5;pointer-events:none;">
          <img src="img/prisma.svg" alt="Cortex" style="filter:hue-rotate(200deg)"/>
          <div class="dropdown-item-text">
            <span class="dropdown-item-name">Cortex XDR</span>
            <span class="dropdown-item-sub" style="color:var(--yellow)">Bientôt disponible</span>
          </div>
        </a>
      </div>
    </div>
    <a href="search.html">🔍 Recherche</a>

    <div class="header-badges">
      <span class="badge">2026-03-26 · Beta</span>
      <span class="badge">by : LGU@EXN</span>
    </div>

    <button id="theme-toggle" title="Basculer le thème" onclick="toggleTheme()">🌙</button>
  </nav>
</header>`;

  const root = document.getElementById('header-root');
  if (root) root.outerHTML = headerHTML;

  // ── Theme toggle ──
  window.toggleTheme = function () {
    const current = localStorage.getItem('pan-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('pan-theme', next);
    applyTheme(next);
  };

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '🌙' : '☀️';
  }

  // Apply saved theme on load
  const saved = localStorage.getItem('pan-theme') || 'dark';
  applyTheme(saved);
})();
