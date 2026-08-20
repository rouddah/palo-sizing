# -*- coding: utf-8 -*-
"""Menu NGFW : reecriture complete.

Defauts corriges :
  - un vide de 6 px entre le bouton et la liste : la souris le traversait
    et le menu se refermait avant d'arriver dessus ;
  - .dropdown-item etait en flex-row, donc le libelle et son sous-titre
    s'affichaient cote a cote au lieu d'etre empiles ;
  - ouverture au survol uniquement : ni clic, ni clavier, ni tactile.
"""
import io
import re

p = 'styles.css'
s = io.open(p, encoding='utf8').read()

start = s.index('.dropdown { position: relative; }')
end = s.index('/* ── Hero ── */')
NEW = '''.dropdown { position: relative; }

/* la liste est collee au bouton et un pont transparent couvre le trajet
   de la souris : plus de fermeture intempestive */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: -10px;
  min-width: 300px;
  padding-top: 10px;
  z-index: 300;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-5px);
  transition: opacity .16s var(--ease-ui), transform .16s var(--ease-ui), visibility .16s;
}
.dropdown-menu > .dropdown-inner {
  background: var(--surface);
  border: 1px solid var(--border2);
  border-radius: 12px;
  box-shadow: 0 22px 50px -20px rgba(0,0,0,.75), 0 0 0 1px rgba(0,0,0,.25);
  padding: 7px;
}
.dropdown.open .dropdown-menu,
.dropdown:hover .dropdown-menu,
.dropdown:focus-within .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: grid !important;
  grid-template-columns: 3px 1fr;
  align-items: center;
  gap: 0 11px;
  padding: 9px 12px !important;
  border-radius: 8px;
  text-decoration: none;
  color: inherit !important;
  transition: background .14s, transform .14s var(--ease-ui);
}
.dropdown-item::before {
  content: '';
  grid-row: 1 / span 2;
  width: 3px;
  height: 0;
  border-radius: 2px;
  background: var(--net-sec);
  transition: height .18s var(--ease-ui);
}
.dropdown-item:hover { background: var(--surface2); transform: translateX(2px); }
.dropdown-item:hover::before { height: 26px; }
.dropdown-item.current { background: color-mix(in srgb, var(--net-sec) 10%, transparent); }
.dropdown-item.current::before { height: 26px; }
.dropdown-item.current .dropdown-item-name { color: var(--net-sec); }

.dropdown-item-name {
  grid-column: 2;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-bright);
  letter-spacing: -0.1px;
}
.dropdown-item-sub {
  grid-column: 2;
  font-size: 11px;
  line-height: 1.45;
  color: var(--text-muted);
  margin-top: 2px;
}

.dropdown-divider { height: 1px; background: var(--border); margin: 6px 8px; }
.dropdown-soon { opacity: .4; pointer-events: none; }

'''
s = s[:start] + NEW + s[end:]
io.open(p, 'w', encoding='utf8').write(s)
print('styles.css : menu deroulant reecrit')
