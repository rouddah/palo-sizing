/* ============================================================
   Palo Alto Networks - Sizing Guide, couche d interactions  v6
   Chargee apres header.js sur toutes les pages.
   Aucune dependance, aucun build : du DOM et un IntersectionObserver.
   v5 : retrait du spot lumineux qui suivait le curseur, des compteurs
   animes (un chiffre de datasheet doit s'afficher juste, tout de suite)
   et de la jauge de lecture. Reste ce qui sert : revelation, copie,
   bulles d'aide - desormais atteignables au clavier.
   v6 : les chiffres d'inventaire de l'accueil montent au defilement
   (data-count). Les metriques de dimensionnement, elles, restent
   posees d'emblee : tant qu'un chiffre defile, il est faux.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Le masquage des elements a reveler n'existe que si ce script
     tourne : sans lui, aucune regle ne cache quoi que ce soit. */
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('rv');
  }

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
        e.target.style.animationDelay = Math.min(pos, 6) * 2 * tok('--stagger', 24) + 'ms';
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

  /* ── Chiffres qui montent ────────────────────────────────
     Sur un outil de dimensionnement, un chiffre anime est un risque :
     tant qu'il defile, il est faux. Trois garde-fous :

     - la valeur finale est ecrite dans data-count, jamais deduite de
       ce qui defile ;
     - elle est posee d'office au bout de la duree, meme si rAF est
       bride (onglet en arriere-plan, capture headless, batterie
       faible) ;
     - `prefers-reduced-motion` la pose immediatement.

     Le comptage ne sert qu'aux chiffres d'inventaire de l'accueil.
     Les metriques de dimensionnement, elles, s'affichent d'emblee. */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (!isFinite(target)) return;
    var dur = 1100, t0 = null;

    function settle() { el.textContent = String(target); }
    if (reduce) return settle();

    function frame(t) {
      if (t0 === null) t0 = t;
      var k = Math.min((t - t0) / dur, 1);
      // sortie douce : rapide au debut, pose a la fin
      var eased = 1 - Math.pow(1 - k, 3);
      el.textContent = String(Math.round(target * eased));
      if (k < 1) requestAnimationFrame(frame);
      else settle();
    }
    requestAnimationFrame(frame);
    setTimeout(settle, dur + 220);
  }

  function wireCounters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      for (var i = 0; i < nums.length; i++) {
        nums[i].textContent = nums[i].getAttribute('data-count');
      }
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        countUp(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    for (var j = 0; j < nums.length; j++) io.observe(nums[j]);
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
    // Clavier : la bulle doit s'ouvrir au focus, sinon l'aide est
    // inaccessible a qui n'utilise pas de souris (WCAG 1.4.13).
    document.addEventListener('focusin', function (e) {
      var el = e.target.closest ? e.target.closest('[data-tip]') : null;
      if (!el) return;
      var r = el.getBoundingClientRect();
      showTip(el, r.left, r.bottom);
    });
    document.addEventListener('focusout', hideTip);
    // Echap ferme la bulle
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideTip();
    });
    window.addEventListener('scroll', hideTip, { passive: true });
  }

  /* ── 6. Mouvement d'etat (window.Motion) ──────────────────
     Les pages appellent ces fonctions quand leur contenu change :
     filtre, tri, onglet, recalcul. Les durees et la courbe sont lues
     dans les jetons CSS (--dur, --ease...) : une seule source.
     Sous `prefers-reduced-motion`, chaque fonction applique le
     changement sans l'animer. */
  function tok(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (!v) return fallback;
    if (typeof fallback === 'number') {
      var n = parseFloat(v);
      return isFinite(n) ? n : fallback;
    }
    return v;
  }

  function inView(r) {
    return r.bottom > -40 && r.top < window.innerHeight + 40
        && r.right > -40 && r.left < window.innerWidth + 40;
  }

  /* FLIP : on mesure, on change le DOM, on remesure, et chaque element
     qui a bouge part de son ancienne place pour rejoindre la nouvelle.
     Les elements sont reconnus par un attribut (data-k par defaut).
     Seuls ceux qui sont a l'ecran sont animes : un tableau de deux
     mille cellules ne doit pas ralentir un filtre. */
  function flip(root, selector, mutate, opts) {
    opts = opts || {};
    var key = opts.key || 'data-k';
    if (reduce || !root || !root.animate) { mutate(); return; }
    var before = {};
    var olds = root.querySelectorAll(selector);
    for (var i = 0; i < olds.length; i++) {
      var k = olds[i].getAttribute(key);
      if (k != null) before[k] = olds[i].getBoundingClientRect();
    }
    mutate();
    var dur = tok('--dur-slow', 480), ease = tok('--ease', 'ease-out');
    var step = tok('--stagger', 24), shift = tok('--shift', 8);
    var news = root.querySelectorAll(selector), entering = 0;
    for (var j = 0; j < news.length; j++) {
      var el = news[j], kk = el.getAttribute(key);
      var r = el.getBoundingClientRect();
      var b = kk != null ? before[kk] : null;
      if (b) {
        var dx = b.left - r.left, dy = b.top - r.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
        if (!inView(r) && !inView(b)) continue;
        el.animate([
          { transform: 'translate(' + dx + 'px,' + dy + 'px)' },
          { transform: 'none' }
        ], { duration: dur, easing: ease });
      } else if (inView(r) && opts.enter !== false) {
        el.animate([
          { opacity: 0, transform: 'translate3d(0,' + shift + 'px,0)' },
          { opacity: 1, transform: 'none' }
        ], { duration: tok('--dur', 300), easing: ease,
             delay: Math.min(entering++, 8) * step, fill: 'backwards' });
      }
    }
  }

  /* Entree d'elements fraichement injectes, en cascade courte.
     dir : 0 vers le haut (defaut), 1 depuis la droite, -1 depuis la gauche. */
  function enter(els, dir) {
    if (reduce || !els) return;
    if (els.nodeType === 1) els = [els];
    var ease = tok('--ease', 'ease-out'), shift = tok('--shift', 8), step = tok('--stagger', 24);
    var n = 0;
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!el.animate || !inView(el.getBoundingClientRect())) continue;
      var from = dir ? 'translate3d(' + (dir * shift * 2) + 'px,0,0)' : 'translate3d(0,' + shift + 'px,0)';
      el.animate([{ opacity: 0, transform: from }, { opacity: 1, transform: 'none' }],
        { duration: tok('--dur', 300), easing: ease, delay: Math.min(n++, 8) * step, fill: 'backwards' });
    }
  }

  /* Une valeur qui vient de changer s'eclaire une fois. */
  function tick(el) {
    if (reduce || !el) return;
    el.classList.remove('m-tick');
    void el.offsetWidth;
    el.classList.add('m-tick');
  }

  /* Soulignement d'onglets qui glisse d'un onglet a l'autre. La liste
     doit etre en position relative ; l'onglet actif porte
     aria-selected="true" ou la classe .active. */
  function ink(list) {
    if (!list) return function () {};
    var bar = list.querySelector('.tab-ink');
    if (!bar) {
      bar = document.createElement('span');
      bar.className = 'tab-ink';
      bar.setAttribute('aria-hidden', 'true');
      list.appendChild(bar);
    }
    function place() {
      var on = list.querySelector('[aria-selected="true"], .active');
      if (!on) { bar.style.opacity = '0'; return; }
      bar.style.opacity = '1';
      bar.style.transform = 'translateX(' + on.offsetLeft + 'px) scaleX(' + on.offsetWidth + ')';
    }
    place();
    window.addEventListener('resize', place);
    return place;
  }

  window.Motion = { reduce: reduce, tok: tok, flip: flip, enter: enter, tick: tick, ink: ink };

  /* Les cartes copiables (optiques, accessoires) n'etaient atteignables
     qu'a la souris. Elles deviennent des boutons : Tab les atteint,
     Entree ou Espace copie. */
  function wireCopyKeys() {
    function arm(root) {
      var els = (root || document).querySelectorAll('[data-copy]:not(a):not(button)');
      for (var i = 0; i < els.length; i++) {
        if (els[i].hasAttribute('tabindex')) continue;
        els[i].setAttribute('tabindex', '0');
        els[i].setAttribute('role', 'button');
        if (!els[i].getAttribute('aria-label')) {
          els[i].setAttribute('aria-label', 'Copier ' + els[i].getAttribute('data-copy'));
        }
      }
    }
    arm();
    new MutationObserver(function () { arm(); })
      .observe(document.body, { childList: true, subtree: true });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var el = e.target;
      if (!el || !el.hasAttribute || !el.hasAttribute('data-copy')) return;
      if (el.tagName === 'A' || el.tagName === 'BUTTON') return;
      e.preventDefault();
      el.click();
    });
  }

  function init() {
    observe(tagTargets());
    wireCounters();
    wireCopy();
    wireCopyKeys();
    wireTips();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
