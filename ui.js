/* ============================================================
   Palo Alto Networks — Sizing Guide, couche d'interactions  v4
   Chargee apres header.js sur toutes les pages.
   Aucune dependance, aucun build : du DOM et un IntersectionObserver.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Revelation au defilement ────────────────────────── */
  var REVEAL = [
    '.page-wrap > .info-note',
    '.section-title',
    '.tool-card', '.metric-card', '.addon-card', '.policy-card',
    '.product-card', '.pillar-card', '.bento-card',
    '.table-wrapper', '.arch-diagram', '.tools-grid > *'
  ].join(',');

  function tagTargets() {
    var auto = document.querySelectorAll(REVEAL);
    for (var i = 0; i < auto.length; i++) {
      if (!auto[i].hasAttribute('data-reveal')) auto[i].setAttribute('data-reveal', '');
    }
    // on observe TOUT ce qui porte data-reveal, y compris ce qui a ete
    // marque a la main dans le HTML : sinon ces elements restent invisibles.
    return document.querySelectorAll('[data-reveal]');
  }

  function observe(els) {
    if (reduce || !('IntersectionObserver' in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add('is-in');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        // leger decalage entre voisins : la grille se remplit en cascade
        var sibs = e.target.parentNode ? e.target.parentNode.children : [];
        var pos = Array.prototype.indexOf.call(sibs, e.target);
        e.target.style.transitionDelay = Math.min(pos, 6) * 55 + 'ms';
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);

    // Filet de securite : du contenu ne doit JAMAIS rester invisible parce que
    // l'observateur n'a pas declenche. Tout ce qui est dans la fenetre au bout
    // d'une seconde est revele d'office.
    setTimeout(function () {
      for (var k = 0; k < els.length; k++) {
        var r = els[k].getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) els[k].classList.add('is-in');
      }
    }, 1000);
  }

  /* ── 2. Compteurs : les chiffres montent a l'arrivee ────── */
  function countUp(el) {
    var raw = el.textContent.trim();
    var m = raw.match(/^([^\d-]*)(-?[\d   ,.]+)(.*)$/);
    if (!m) return;
    var num = parseFloat(m[2].replace(/[   ]/g, '').replace(',', '.'));
    if (!isFinite(num) || num === 0) return;
    var dec = (m[2].split(/[.,]/)[1] || '').length;
    var pre = m[1], post = m[3], t0 = null, dur = 900;
    function frame(t) {
      if (t0 === null) t0 = t;
      var k = Math.min((t - t0) / dur, 1);
      var v = num * (1 - Math.pow(1 - k, 3));
      el.textContent = pre + v.toFixed(dec) + post;
      if (k < 1) requestAnimationFrame(frame);
      else el.textContent = raw;
    }
    requestAnimationFrame(frame);
    // filet de securite : si rAF est bride (onglet en arriere-plan, capture
    // headless), la valeur finale est posee quoi qu'il arrive.
    setTimeout(function () { el.textContent = raw; }, dur + 260);
  }

  function wireCounters() {
    var nums = document.querySelectorAll('.metric-val, .bento-stat-number, [data-count]');
    if (!nums.length || reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        countUp(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    for (var i = 0; i < nums.length; i++) io.observe(nums[i]);
  }

  /* ── 3. Copie au clic ───────────────────────────────────── */
  /* Tout element portant data-copy copie sa valeur. Delegue sur le document
     pour fonctionner aussi sur du contenu injecte apres coup. */
  var toastEl = null, toastT = null;

  function toast(msg, ok) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'copy-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.toggle('err', ok === false);
    toastEl.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 1900);
  }

  function write(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // repli pour les contextes non securises (ouverture en file://)
    return new Promise(function (res, rej) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? res() : rej();
    });
  }

  function wireCopy() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest ? e.target.closest('[data-copy]') : null;
      if (!el) return;
      e.preventDefault();
      var val = el.getAttribute('data-copy');
      var label = el.getAttribute('data-copy-label') || val;
      write(val).then(function () {
        el.classList.add('copied');
        setTimeout(function () { el.classList.remove('copied'); }, 900);
        toast(label.length > 46 ? 'Copié' : label + ' copié');
      }, function () {
        toast('Copie impossible dans ce contexte', false);
      });
    });
  }

  /* ── 3bis. Spot lumineux qui suit le pointeur ───────────── */
  /* Une seule ecoute deleguee, deux variables CSS mises a jour :
     pas de listener par carte, pas de layout thrash. */
  var SPOT = '.tool-card, .metric-card, .addon-card, .policy-card, .product-card, .pillar-card, .part, .slr-panel, .fx-spot';

  function wireSpot() {
    if (reduce) return;
    document.querySelectorAll(SPOT).forEach(function (el) { el.classList.add('fx-spot'); });
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest ? e.target.closest('.fx-spot') : null;
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ── 5. Bulles de survol riches ─────────────────────────── */
  /* data-tip="Titre|Corps" : une carte flottante remplace l'infobulle
     systeme. Elle suit le curseur et se recadre pour rester a l'ecran. */
  var tipEl = null, tipT = null;

  function tipNode() {
    if (!tipEl) {
      tipEl = document.createElement('div');
      tipEl.id = 'tip';
      tipEl.innerHTML = '<div class="tt"></div><div class="tb"></div>';
      document.body.appendChild(tipEl);
    }
    return tipEl;
  }

  function placeTip(x, y) {
    var t = tipNode(), r = t.getBoundingClientRect();
    var nx = x + 18, ny = y + 18;
    if (nx + r.width > window.innerWidth - 12) nx = x - r.width - 14;
    if (ny + r.height > window.innerHeight - 12) ny = y - r.height - 14;
    t.style.left = Math.max(10, nx) + 'px';
    t.style.top = Math.max(10, ny) + 'px';
  }

  function showTip(el, x, y) {
    var raw = el.getAttribute('data-tip');
    if (!raw) return;
    var parts = raw.split('|');
    var t = tipNode();
    t.querySelector('.tt').innerHTML = parts.length > 1 ? parts[0] : '';
    t.querySelector('.tb').innerHTML = parts.length > 1 ? parts.slice(1).join('|') : parts[0];
    t.querySelector('.tt').style.display = parts.length > 1 ? '' : 'none';
    // la bulle emprunte la couleur d'accent de l'element survole
    var c = getComputedStyle(el).getPropertyValue('--fx')
         || getComputedStyle(el).getPropertyValue('--oc')
         || getComputedStyle(el).getPropertyValue('--bc');
    t.style.setProperty('--tipc', (c && c.trim()) || 'var(--accent)');
    placeTip(x, y);
    t.classList.add('on');
  }

  function hideTip() {
    clearTimeout(tipT);
    if (tipEl) tipEl.classList.remove('on');
  }

  function wireTips() {
    document.addEventListener('pointerover', function (e) {
      var el = e.target.closest ? e.target.closest('[data-tip]') : null;
      if (!el) return;
      clearTimeout(tipT);
      var x = e.clientX, y = e.clientY;
      tipT = setTimeout(function () { showTip(el, x, y); }, 190);
    });
    document.addEventListener('pointermove', function (e) {
      if (tipEl && tipEl.classList.contains('on')) placeTip(e.clientX, e.clientY);
    }, { passive: true });
    document.addEventListener('pointerout', function (e) {
      var el = e.target.closest ? e.target.closest('[data-tip]') : null;
      if (el) hideTip();
    });
    window.addEventListener('scroll', hideTip, { passive: true });
  }

  /* ── 6. Jauge de lecture ────────────────────────────────── */
  function wireProgress() {
    if (document.querySelector('.table-outer')) return; // le comparateur scrolle en interne
    var bar = document.createElement('div');
    bar.id = 'read-progress';
    document.body.appendChild(bar);
    function upd() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0';
    }
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  function init() {
    observe(tagTargets());
    wireCounters();
    wireCopy();
    wireSpot();
    wireTips();
    wireProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
