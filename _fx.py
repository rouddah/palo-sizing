# -*- coding: utf-8 -*-
"""Couche d'effets v5 : aurore de fond, cartes a spot lumineux, bordures en
   degrade Precision AI, revelations avec flou, titres a balayage.
   Tout en CSS + quelques variables mises a jour par le pointeur."""
import io

CSS = r'''

/* ============================================================
   FX v5 — le langage visuel Palo Alto applique au site
   Degrade Precision AI (orange -> magenta -> bleu), obliques du
   logo, lueurs radiales. Aucune image, aucune librairie.
   ============================================================ */

:root {
  --pai-1: #FA582D;   /* orange Palo */
  --pai-2: #E5127D;   /* magenta */
  --pai-3: #2A3EFF;   /* bleu */
  --pai-4: #38BDF8;   /* cyan */
  --pai: linear-gradient(96deg, var(--pai-1), var(--pai-2) 42%, var(--pai-3) 78%, var(--pai-4));
}

/* ── Aurore de fond ────────────────────────────────────────── */
/* Trois masses floues qui derivent lentement. Elles remplacent la
   grille plate : le fond respire sans jamais attirer l'oeil. */
body::after {
  content: '';
  position: fixed;
  inset: -20vmax;
  z-index: -2;
  pointer-events: none;
  opacity: .5;
  background:
    radial-gradient(38vmax 32vmax at 12% 8%,  color-mix(in srgb, var(--pai-1) 34%, transparent), transparent 62%),
    radial-gradient(34vmax 30vmax at 88% 14%, color-mix(in srgb, var(--pai-3) 40%, transparent), transparent 60%),
    radial-gradient(42vmax 34vmax at 62% 92%, color-mix(in srgb, var(--pai-2) 24%, transparent), transparent 64%);
  filter: blur(28px);
  animation: aurora 34s ease-in-out infinite alternate;
}
[data-theme="light"] body::after { opacity: .22; }
@keyframes aurora {
  0%   { transform: translate3d(0,0,0) scale(1); }
  50%  { transform: translate3d(2.5vmax,-2vmax,0) scale(1.06); }
  100% { transform: translate3d(-2vmax,1.5vmax,0) scale(1.03); }
}

/* la grille existante s'affine pour laisser respirer l'aurore */
body::before { opacity: .05; background-size: 72px 72px; }

/* ── Cartes a spot lumineux ────────────────────────────────── */
/* --mx/--my sont mis a jour par ui.js au passage du pointeur. */
.fx-spot { position: relative; isolation: isolate; overflow: hidden; }
.fx-spot::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity .3s var(--ease-ui);
  background: radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%),
              color-mix(in srgb, var(--fx, var(--accent)) 20%, transparent), transparent 62%);
}
.fx-spot:hover::before { opacity: 1; }
.fx-spot > * { position: relative; z-index: 1; }

/* filet en degrade qui s'allume sur le bord haut */
.fx-edge { position: relative; }
.fx-edge::after {
  content: '';
  position: absolute;
  left: 0; right: 0; top: 0;
  height: 1.5px;
  border-radius: 2px;
  background: var(--pai);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .45s var(--ease-ui);
}
.fx-edge:hover::after { transform: scaleX(1); }

/* ── Revelation : le flou se leve en meme temps que l'opacite ── */
[data-reveal] {
  opacity: 0;
  transform: translateY(16px);
  filter: blur(7px);
  transition: opacity .6s var(--ease-ui), transform .6s var(--ease-ui), filter .6s var(--ease-ui);
}
[data-reveal].is-in { opacity: 1; transform: none; filter: none; }

/* ── Titres : un balayage traverse le degrade ──────────────── */
.fx-grad {
  background: var(--pai);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: sheen 9s ease-in-out infinite;
}
@keyframes sheen {
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}

/* ── Obliques du logo, en filigrane anime ──────────────────── */
.fx-slashes {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .14;
  background-image: repeating-linear-gradient(112deg,
    currentColor 0 6px, transparent 6px 28px);
  -webkit-mask-image: linear-gradient(100deg, transparent 8%, #000 55%, transparent 96%);
          mask-image: linear-gradient(100deg, transparent 8%, #000 55%, transparent 96%);
  animation: slashDrift 16s linear infinite;
}

/* ── Compteurs ─────────────────────────────────────────────── */
.fx-stat {
  font-family: var(--disp, var(--font));
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: -2px;
  line-height: 1;
  background: var(--pai);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ── Boutons ───────────────────────────────────────────────── */
.fx-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font);
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-bright);
  background: var(--surface2);
  border: 1px solid var(--border2);
  border-radius: 10px;
  padding: 12px 20px;
  text-decoration: none;
  overflow: hidden;
  transition: transform .2s var(--ease-ui), border-color .2s, box-shadow .2s;
}
.fx-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--pai);
  opacity: 0;
  transition: opacity .22s;
  z-index: -1;
}
.fx-btn:hover {
  transform: translateY(-2px);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 14px 30px -14px color-mix(in srgb, var(--pai-1) 70%, transparent);
}
.fx-btn:hover::before { opacity: 1; }
.fx-btn.ghost { background: transparent; }

@media (prefers-reduced-motion: reduce) {
  body::after, .fx-slashes, .fx-grad { animation: none; }
  [data-reveal] { opacity: 1 !important; transform: none !important; filter: none !important; }
  .fx-spot::before { display: none; }
}
'''

p = 'styles.css'
s = io.open(p, encoding='utf8').read()
assert 'FX v5' not in s, 'deja applique'
io.open(p, 'w', encoding='utf8').write(s.rstrip() + '\n' + CSS)
print('styles.css : couche FX v5 (%d lignes)' % len(CSS.split('\n')))
