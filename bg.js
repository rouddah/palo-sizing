/* ============================================================
   Fond anime : maillage reseau
   ------------------------------------------------------------
   Un outil de dimensionnement de firewall merite un fond qui parle
   de son sujet plutot qu'un degrade decoratif. On dessine donc une
   topologie : des noeuds qui derivent lentement, des liens qui
   apparaissent quand deux noeuds se rapprochent, et des paquets qui
   circulent le long de ces liens.

   Contraintes tenues, dans cet ordre de priorite :

   1. Ne jamais gener la lecture. Le fond vit sous le contenu, en
      opacite tres basse, et se calme encore sur les pages denses
      (comparateur, etabli) via l'attribut data-bg="calme".
   2. Ne jamais couter de batterie pour rien. Le rendu s'arrete quand
      l'onglet passe en arriere-plan, quand la page n'est plus
      visible, et se limite a 30 images par seconde.
   3. Disparaitre completement sous prefers-reduced-motion : dans ce
      cas le canvas n'est meme pas cree.
   4. Ne rien casser si le canvas echoue : c'est un fond, son absence
      ne doit avoir aucune consequence.

   Aucune dependance. Charge apres ui.js sur toutes les pages.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  /* Un ecran tres etroit n'a pas la place, et souvent pas la machine. */
  if (window.innerWidth < 620) return;

  var canvas, ctx, W, H, dpr, nodes = [], packets = [], raf = null, last = 0;
  var running = false;

  /* Densite : proportionnelle a la surface, plafonnee. Sur les pages
     denses, on divise encore. */
  var calm = document.body.getAttribute('data-bg') === 'calme';
  var FPS = 30;
  var LINK_DIST = calm ? 140 : 170;   // distance en deca de laquelle deux noeuds se lient
  var ALPHA_NODE = calm ? 0.30 : 0.55;
  var ALPHA_LINK = calm ? 0.10 : 0.20;

  function palette() {
    var cs = getComputedStyle(document.documentElement);
    var light = document.documentElement.getAttribute('data-theme') === 'light';
    return {
      node: (cs.getPropertyValue('--wire') || '#4d9fff').trim(),
      pkt:  (cs.getPropertyValue('--accent') || '#FA582D').trim(),
      light: light
    };
  }
  var col = palette();

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    var target = Math.round((W * H) / (calm ? 34000 : 22000));
    target = Math.max(14, Math.min(target, calm ? 34 : 58));
    nodes = [];
    for (var i = 0; i < target; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        // derive tres lente : quelques pixels par seconde
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: 1 + Math.random() * 1.4
      });
    }
    packets = [];
  }

  /* Un paquet nait sur un lien existant et le parcourt une fois. */
  function spawnPacket() {
    if (packets.length > (calm ? 2 : 5)) return;
    var a = (Math.random() * nodes.length) | 0;
    var best = -1, bestD = LINK_DIST;
    for (var b = 0; b < nodes.length; b++) {
      if (b === a) continue;
      var d = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
      if (d < bestD) { bestD = d; best = b; }
    }
    if (best < 0) return;
    packets.push({ a: a, b: best, t: 0, speed: 0.006 + Math.random() * 0.008 });
  }

  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (now - last < 1000 / FPS) return;
    last = now;

    ctx.clearRect(0, 0, W, H);

    var i, j, n, m, d;

    /* Deplacement + rebond doux sur les bords */
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }

    /* Liens : l'opacite decroit avec la distance, le maillage respire
       donc tout seul sans qu'on anime quoi que ce soit. */
    ctx.lineWidth = 1;
    for (i = 0; i < nodes.length; i++) {
      for (j = i + 1; j < nodes.length; j++) {
        n = nodes[i]; m = nodes[j];
        d = Math.hypot(n.x - m.x, n.y - m.y);
        if (d > LINK_DIST) continue;
        var a = (1 - d / LINK_DIST) * ALPHA_LINK;
        ctx.strokeStyle = hexA(col.node, a);
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
      }
    }

    /* Noeuds */
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      ctx.fillStyle = hexA(col.node, ALPHA_NODE);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    /* Paquets : un point qui glisse d'un noeud a l'autre, avec une
       courte trainee. C'est le seul element vraiment « vivant ». */
    for (i = packets.length - 1; i >= 0; i--) {
      var p = packets[i];
      p.t += p.speed;
      if (p.t >= 1 || !nodes[p.a] || !nodes[p.b]) { packets.splice(i, 1); continue; }
      var A = nodes[p.a], B = nodes[p.b];
      var x = A.x + (B.x - A.x) * p.t;
      var y = A.y + (B.y - A.y) * p.t;
      var tx = A.x + (B.x - A.x) * Math.max(0, p.t - 0.16);
      var ty = A.y + (B.y - A.y) * Math.max(0, p.t - 0.16);
      // la trainee s'estompe aux deux extremites du parcours
      var fade = Math.sin(p.t * Math.PI);
      var g = ctx.createLinearGradient(tx, ty, x, y);
      g.addColorStop(0, hexA(col.pkt, 0));
      g.addColorStop(1, hexA(col.pkt, 0.5 * fade));
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.fillStyle = hexA(col.pkt, 0.75 * fade);
      ctx.beginPath();
      ctx.arc(x, y, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }

    if (Math.random() < (calm ? 0.012 : 0.03)) spawnPacket();
  }

  /* #RRGGBB -> rgba(). Les jetons du site sont en hexa. */
  function hexA(hex, a) {
    hex = (hex || '').trim();
    if (hex.charAt(0) !== '#') return 'rgba(120,150,190,' + a + ')';
    if (hex.length === 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    var r = parseInt(hex.substr(1, 2), 16),
        g = parseInt(hex.substr(3, 2), 16),
        b = parseInt(hex.substr(5, 2), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  function start() {
    if (running) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  function init() {
    try {
      canvas = document.createElement('canvas');
      canvas.id = 'bg-mesh';
      canvas.setAttribute('aria-hidden', 'true');
      ctx = canvas.getContext('2d');
      if (!ctx) return;
      document.body.appendChild(canvas);
      resize();
      start();

      var t = null;
      window.addEventListener('resize', function () {
        clearTimeout(t);
        t = setTimeout(resize, 180);
      });

      /* Onglet cache : on arrete tout. Un fond decoratif ne doit pas
         consommer une seconde de processeur quand personne ne regarde. */
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop(); else start();
      });

      /* Le bascule de theme change la palette. */
      var obs = new MutationObserver(function () { col = palette(); });
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
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
