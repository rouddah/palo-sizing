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
    var els = document.querySelectorAll(REVEAL);
    for (var i = 0; i < els.length; i++) {
      if (!els[i].hasAttribute('data-reveal')) els[i].setAttribute('data-reveal', '');
    }
    return els;
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

  /* ── 4. Jauge de lecture ────────────────────────────────── */
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
    wireProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
