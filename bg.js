/* ============================================================
   Fond anime : telemetrie
   ------------------------------------------------------------
   Des courbes de charge empilees qui defilent lentement, avec leur
   aire remplie et une graduation temporelle qui glisse vers la
   gauche. La reference est un mur de supervision : l'outil parle de
   debit et de sessions, le fond montre du debit.

   Ce n'est pas un decor pris au hasard. Un maillage de particules
   avait ete essaye avant : c'est le fond « tech » le plus vu du web
   depuis dix ans, et il ne dit rien du produit. Une courbe de charge,
   sur un dimensionneur de pare-feu, est dans le sujet.

   Contraintes tenues, dans cet ordre de priorite :

   1. Ne jamais gener la lecture. Le fond vit sous le contenu, en
      opacite basse, masque la ou le texte se lit, et se calme encore
      sur les pages denses via data-bg="calme".
   2. Ne rien couter pour rien. Rendu arrete quand l'onglet passe en
      arriere-plan, 20 images par seconde au plafond.
   3. Disparaitre sous prefers-reduced-motion : le canvas n'est meme
      pas cree.
   4. Ne rien casser en cas d'echec : c'est un fond, son absence n'a
      aucune consequence.

   Aucune dependance. Charge en differe sur toutes les pages.
   ============================================================ */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 620) return;

  var canvas, ctx, W, H, dpr, raf = null, last = 0, t = 0, running = false;
  var calm = document.body.getAttribute('data-bg') === 'calme';

  /* 20 images par seconde suffisent : les courbes derivent lentement,
     l oeil ne distingue pas 30 de 20 sur ce mouvement, et le fond
     coute un tiers de moins. */
  var FPS = 20;
  /* Sur les pages denses : une bande de moins, tout plus discret. */
  var BANDS = calm ? 2 : 3;
  var A_LINE = calm ? 0.13 : 0.22;
  var A_FILL = calm ? 0.035 : 0.06;
  var A_GRID = calm ? 0.028 : 0.05;

  var series = [], col = {};

  function palette() {
    var cs = getComputedStyle(document.documentElement);
    col = {
      accent: (cs.getPropertyValue('--accent') || '#FA582D').trim(),
      wire:   (cs.getPropertyValue('--wire')   || '#4d9fff').trim()
    };
  }

  function rgba(hex, a) {
    hex = (hex || '').trim();
    if (hex.charAt(0) !== '#') return 'rgba(120,150,190,' + a + ')';
    if (hex.length === 4) hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    return 'rgba(' + parseInt(hex.substr(1, 2), 16) + ','
                   + parseInt(hex.substr(3, 2), 16) + ','
                   + parseInt(hex.substr(5, 2), 16) + ',' + a + ')';
  }

  var STEP = 10;   // pas d'echantillonnage horizontal, en pixels

  function build() {
    series = [];
    var count = Math.ceil(W / STEP) + 2;
    for (var i = 0; i < BANDS; i++) {
      var base = H * (0.46 + i * 0.17);
      var amp  = H * (0.045 + i * 0.022);
      var color = (i === 1 ? col.accent : col.wire);

      /* Degrade fabrique une seule fois : il ne depend que de la
         geometrie, qui ne change qu'au redimensionnement. */
      /* Profondeur de remplissage bornee : au-dela, le degrade est
         deja transparent et l on peindrait des pixels invisibles.
         C'est ce qui coutait le plus cher dans le fond. */
      var depth = Math.min(H - base + amp * 1.6, 300);
      var g = ctx.createLinearGradient(0, base - amp * 1.6, 0, base + depth);
      g.addColorStop(0, rgba(color, A_FILL));
      g.addColorStop(1, rgba(color, 0));

      series.push({
        /* Chaque courbe a sa phase, son amplitude et sa vitesse : elles
           ne se superposent jamais deux fois de la meme facon. */
        phase: Math.random() * 100,
        amp: amp,
        base: base,
        speed: 0.00075 + i * 0.00035,
        /* La bande du milieu porte l'orange de la marque, les autres
           restent sur le bleu d'etat : un seul accent, jamais deux. */
        color: color,
        grad: g,
        depth: depth,
        stroke: rgba(color, A_LINE - i * 0.035),
        pts: new Float32Array(count)
      });
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  /* Somme de deux sinusoides de periodes non multiples : le trace ne
     se repete pas de facon perceptible, sans cout de bruit reel. */
  function value(s, px) {
    return Math.sin(px * 0.0042 + s.phase + t * s.speed) * 0.62
         + Math.sin(px * 0.0113 + s.phase * 1.7 + t * s.speed * 1.55) * 0.38;
  }

  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (now - last < 1000 / FPS) return;
    last = now;
    t += 1;

    ctx.clearRect(0, 0, W, H);

    /* Graduation temporelle : elle glisse vers la gauche, comme l'axe
       d'un graphe qui avance. C'est ce glissement, plus que les
       courbes, qui donne l'impression d'une mesure en cours. */
    var step = 104;
    var off = (t * 0.22) % step;
    ctx.lineWidth = 1;
    ctx.strokeStyle = rgba(col.wire, A_GRID);
    ctx.beginPath();
    for (var gx = -off; gx < W; gx += step) {
      // un seul chemin pour toute la graduation : quatorze couples
      // beginPath/stroke par image se payaient pour rien
      ctx.moveTo(Math.round(gx) + 0.5, 0);
      ctx.lineTo(Math.round(gx) + 0.5, H);
    }
    ctx.stroke();

    /* Les courbes sont dessinees de la plus basse a la plus haute :
       les aires se recouvrent dans le bon ordre.

       Le trace est calcule UNE fois par courbe et reutilise pour
       l'aire et pour le trait. Le calculer deux fois doublait le cout
       du fond, mesure a 7,8% d'un coeur contre 3,9% ici. Les degrades
       sont fabriques au redimensionnement, pas a chaque image : un
       createLinearGradient par courbe et par frame, a 30 images par
       seconde, se paie. */
    for (var i = series.length - 1; i >= 0; i--) {
      var s = series[i];
      var pts = s.pts;

      // remplissage du tampon de points
      for (var k = 0, px = 0; k < pts.length; k++, px += STEP) {
        pts[k] = s.base + value(s, px) * s.amp;
      }

      // aire sous la courbe
      ctx.beginPath();
      ctx.moveTo(0, pts[0]);
      for (k = 1, px = STEP; k < pts.length; k++, px += STEP) ctx.lineTo(px, pts[k]);
      var floor = s.base + s.depth;
      ctx.lineTo(W + STEP, floor);
      ctx.lineTo(0, floor);
      ctx.closePath();
      ctx.fillStyle = s.grad;
      ctx.fill();

      // le trait par-dessus
      ctx.beginPath();
      ctx.moveTo(0, pts[0]);
      for (k = 1, px = STEP; k < pts.length; k++, px += STEP) ctx.lineTo(px, pts[k]);
      ctx.strokeStyle = s.stroke;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
  }

  function start() { if (running) return; running = true; last = 0; raf = requestAnimationFrame(frame); }
  function stop()  { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

  function init() {
    try {
      canvas = document.createElement('canvas');
      canvas.id = 'bg-mesh';
      canvas.setAttribute('aria-hidden', 'true');
      ctx = canvas.getContext('2d');
      if (!ctx) return;
      document.body.appendChild(canvas);
      palette();
      resize();
      start();

      var timer = null;
      window.addEventListener('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(resize, 180);
      });

      /* Onglet cache : on arrete tout. Un fond ne doit pas consommer
         une seconde de processeur quand personne ne regarde. */
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop(); else start();
      });

      /* La bascule de theme change la palette. */
      new MutationObserver(function () { palette(); build(); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    } catch (e) {
      /* Un fond qui echoue ne doit jamais empecher la page de servir. */
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
