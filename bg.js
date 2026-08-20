/* ============================================================
   Fond anime : obliques de la marque
   ------------------------------------------------------------
   Le motif du logo Palo Alto, trois barres paralleles inclinees,
   porte a l'echelle de l'ecran. Deux plans a des vitesses
   differentes donnent la profondeur, et une bande de lumiere les
   traverse lentement : les obliques ne sont visibles que lorsque la
   lumiere passe dessus, comme une surface metallique balayee.

   Pourquoi celui-la. Deux fonds ont ete essayes avant : un maillage
   de particules, qui est le fond « tech » le plus vu du web et ne
   dit rien du produit, puis une telemetrie, jugee trop sage. Celui-ci
   ne represente rien : il porte la marque, et c'est tout ce qu'un
   fond a besoin de faire.

   Contraintes tenues, dans cet ordre de priorite :

   1. Ne jamais gener la lecture. Le fond vit sous le contenu, masque
      la ou le texte se lit, et se calme sur les pages denses via
      data-bg="calme".
   2. Ne rien couter pour rien. Rendu arrete onglet cache, 24 images
      par seconde au plafond, rien peint sous le seuil de visibilite.
   3. Disparaitre sous prefers-reduced-motion : pas de canvas du tout.
   4. Ne rien casser en cas d'echec : c'est un fond.

   Aucune dependance.
   ============================================================ */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 620) return;

  var canvas, ctx, W, H, dpr, raf = null, last = 0, t = 0, running = false;
  var calm = document.body.getAttribute('data-bg') === 'calme';

  var FPS = 24;

  /* Geometrie du motif Palo Alto : trois barres, la mediane plus
     haute, inclinees vers la droite. */
  var SLANT = 0.30;                       // decalage horizontal par unite de hauteur
  var GROUP = calm ? 300 : 224;           // espace entre deux groupes de trois
  var BAR   = calm ? 16  : 21;            // epaisseur d'une barre
  var GAP   = calm ? 12  : 15;            // vide entre deux barres d'un groupe

  /* Le fond est presque eteint au repos : tout se joue au passage de
     la lumiere. */
  var A_REST  = calm ? 0.022 : 0.042;
  var A_LIT   = calm ? 0.085 : 0.34;
  var SWEEP_W = 330;   // plus etroit : la lumiere est plus franche

  var layers = [], col = {};

  function palette() {
    var cs = getComputedStyle(document.documentElement);
    col = {
      accent: (cs.getPropertyValue('--accent') || '#FA582D').trim(),
      light:  document.documentElement.getAttribute('data-theme') === 'light'
    };
  }

  function rgba(hex, a) {
    hex = (hex || '').trim();
    if (hex.charAt(0) !== '#') return 'rgba(140,160,190,' + a + ')';
    if (hex.length === 4) hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    return 'rgba(' + parseInt(hex.substr(1, 2), 16) + ','
                   + parseInt(hex.substr(3, 2), 16) + ','
                   + parseInt(hex.substr(5, 2), 16) + ',' + a + ')';
  }

  /* Deux plans : le lointain plus fin, plus lent, moins contraste ;
     le proche plus large et plus rapide. L'ecart de vitesse cree la
     profondeur sans qu'aucun element ne bouge vraiment vite. */
  function build() {
    layers = [
      { scale: 0.60, speed: 0.040, alpha: 0.55, xs: [] },
      { scale: 1.00, speed: 0.080, alpha: 1.00, xs: [] }
    ];
    var span = H * SLANT;
    for (var li = 0; li < layers.length; li++) {
      var L = layers[li];
      var g = GROUP * L.scale;
      for (var x = -span - g * 2; x < W + g; x += g) L.xs.push(x);
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

  /* Une barre : un parallelogramme incline, dessine d'un trait. */
  function bar(x, w, h0, h1) {
    var top = H * h0, bot = H * h1;
    var dx = (bot - top) * SLANT;
    ctx.beginPath();
    ctx.moveTo(x, bot);
    ctx.lineTo(x + dx, top);
    ctx.lineTo(x + dx + w, top);
    ctx.lineTo(x + w, bot);
    ctx.closePath();
    ctx.fill();
  }

  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (now - last < 1000 / FPS) return;
    last = now;
    t += 1;

    ctx.clearRect(0, 0, W, H);

    var neutral = col.light ? '#2b3646' : '#93a9c6';

    for (var li = 0; li < layers.length; li++) {
      var L = layers[li];
      var barW = BAR * L.scale, gapW = GAP * L.scale;
      var groupW = L.xs.length > 1 ? (L.xs[1] - L.xs[0]) : GROUP;
      var drift = (t * L.speed) % groupW;

      /* La lumiere balaie l'ecran de gauche a droite en boucle. Les
         deux plans avancent a des vitesses legerement differentes :
         le balayage ne se superpose jamais deux fois pareil. */
      var period = 2400;
      var phase = ((t * (0.55 + li * 0.14)) % period) / period;
      var sweep = -SWEEP_W + phase * (W + SWEEP_W * 2);

      for (var i = 0; i < L.xs.length; i++) {
        var gx = L.xs[i] + drift;

        for (var k = 0; k < 3; k++) {
          var x = gx + k * (barW + gapW);
          /* La barre mediane monte plus haut et descend plus bas :
             c'est ce decalage qui fait lire le motif comme le logo et
             non comme de simples rayures. */
          var h0 = (k === 1) ? 0.00 : 0.13;
          var h1 = (k === 1) ? 1.00 : 0.87;

          var d = Math.abs((x + H * SLANT * 0.5) - sweep);
          var lit = Math.max(0, 1 - d / SWEEP_W);
          lit = lit * lit * lit;                 // la lumiere se concentre nettement

          var a = (A_REST + lit * A_LIT) * L.alpha;
          if (a < 0.005) continue;               // invisible : on ne peint pas

          /* La barre mediane prend l'orange de la marque une fois
             eclairee ; les deux autres restent neutres. Un seul
             accent, jamais deux. */
          ctx.fillStyle = (k === 1 && lit > 0.10)
            ? rgba(col.accent, a * 1.55)
            : rgba(neutral, a);
          bar(x, barW, h0, h1);
        }
      }
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

      new MutationObserver(function () { palette(); })
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
