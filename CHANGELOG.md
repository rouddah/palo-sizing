# Changelog

## Session 8 - 20 aout 2026 : couche de mouvement, accueil, densite

### Trois erreurs corrigees, trouvees en relisant la copie

1. **L'accueil annoncait 39 modeles PA-Series. `data/pa-models.js` en
   contient 33**, dont 4 en End of Sale. Sur un outil dont toute la
   valeur est l'exactitude des chiffres, un compteur decoratif qui
   derive est un bug de credibilite. Corrige, et `_check.js` compare
   desormais les trois compteurs de l'accueil au contenu reel des
   fichiers de donnees : le build echoue s'ils divergent.
2. **La jauge affichait « Charge estimee sur le haut de gamme PA-3400
   (20 Gbps TP) »** alors que le calcul se fait contre le membre le plus
   capable de la serie. Un lecteur pouvait comprendre que la PA-3410
   tient 20 Gbps. La jauge nomme maintenant le modele reel : « Charge
   sur PA-3440, 20 Gbps TP ».
3. **Le repere de la jauge disait « 65% marge cible »**, ce qui se lit
   « 65% de marge » alors que 65% est le plafond de charge vise, soit
   35% de reserve. Inversion de sens sur le repere le plus regarde de
   l'ecran. Devenu « 65% charge max ».

Deux fautes de forme au passage : l'option « Non prevu » s'affichait
sans accents alors que le brief exporte ecrit « Non prevu » accentue, et
le brief texte etait entierement desaccentue alors que l'ecran ne l'est
pas, pour un document destine au client.

### Couche de mouvement

Une seule courbe pour tout le site, `cubic-bezier(.25, 1, .5, 1)`, et
trois regles : le mouvement accompagne un changement d'etat, jamais une
boucle decorative ; il ne touche que `transform` et `opacity` ; il
disparait entierement sous `prefers-reduced-motion`.

- entree de l'accueil en cascade courte, cartes d'action qui montent de
  4px au survol avec un filet d'accent, boutons a `scale(1.02)` dont la
  fleche part en avant, anneaux de focus animes ;
- volet de recommandation en fondu a chaque recalcul, et liseré sur la
  carte de verdict **uniquement quand la gamme change** : rejouer a
  chaque frappe aurait donne un clignotement permanent ;
- nappe lumineuse discrete derriere le verdict, teintee par l'etat de
  charge (vert, ambre, rouge).

**Piege evite** : la premiere version posait `opacity: 0` dans la regle
de base avec `animation-fill-mode: forwards`. Rendu headless, tout
l'accueil etait invisible. Le contenu ne doit jamais dependre d'une
animation pour exister : la regle de base ne porte plus d'opacite et
l'animation est en `backwards`.

Les compteurs de l'accueil montent au defilement (`data-count`). La
valeur de reference vit dans l'attribut, jamais dans le texte qui
defile, et elle est posee d'office au bout de la duree meme si `rAF`
est bride. Les metriques de dimensionnement, elles, restent posees
d'emblee : tant qu'un chiffre defile, il est faux.

### Accueil

Le paragraphe defensif (« Aucun prix publie, aucune reference
inventee ») disparait au profit d'une ligne qui enonce le contrat de
l'outil : « Contraintes de trafic en entree, modele PA-Series et
subscriptions en sortie. » Les quatre chiffres deviennent un bandeau
continu separe par des filets de 1px, avec infobulle au survol et
au focus clavier.

### Matrice de comparaison

Rythme vertical resserre (5px au lieu de 8), chiffres alignes a droite
en monospace tabulaire pour que les ordres de grandeur se comparent a
la position, debits et sessions en gras, specifications secondaires et
valeurs absentes en retrait.

### Microcopie

Libelles et infobulles revus sur l'ensemble de l'outil. Changements de
fond : « Debit du lien Internet » devient « Debit a inspecter » (en
datacenter, le lien Internet n'est pas la bonne assiette de calcul) et
« Acces distant » devient « Utilisateurs distants » (le champ attend un
nombre). Les infobulles ajoutent une information que le libelle ne
porte pas deja, sinon elles ne servent a rien.

### Harnais de test

`_smoke.js` injectait les scripts via `win.eval`, ou un `const` de
premier niveau produit une liaison locale a l'eval. Une balise
`<script>` cree une liaison de script visible par les autres scripts,
comme dans un navigateur. La nuance a masque un appel a `MODELS` qui
marchait en production mais echouait au test.

Note d'outillage : `chrome --screenshot --virtual-time-budget` ne fait
pas avancer les animations CSS et rend les pages animees vides. Les
captures passent par Puppeteer.

## Session 7 - 20 aout 2026 : pictogrammes officiels Palo Alto

Le deck « General Iconography » a ete reexporte sans protection, donc
exploitable. Les pictogrammes n'y sont pas des images mais des formes
vectorielles DrawingML : un convertisseur les transforme en SVG.

- `tools/icons/` : extraction du pptx vers un catalogue de **458
  pictogrammes** repartis en 21 categories, planche de contact pour
  choisir a l'oeil, generation de `icons.js`. Conversion exacte : le jeu
  n'emploie que moveTo / lnTo / cubicBezTo / close, aucun arc a
  approximer.
- `icons.js` porte desormais **neuf pictogrammes officiels** pour les
  concepts metier (charge reseau, fonctions de securite, topologie, parc
  en place, comparateur, dimensionnement, hypotheses, equivalence
  boitier, dossier) et conserve douze affordances d'interface au trait.

**Ce qui a decide la repartition** : rendus a 13px, les pictogrammes
officiels deviennent illisibles. Ils sont dessines pour la projection, et
leurs traits les plus fins disparaissent. Verifie sur planche a 13, 14,
16, 18, 20, 22 et 24px : le seuil est **20px**. Les titres de groupe et
de section passent donc a 20px, et les coches, croix, chevrons et fleches
des listes et des boutons restent une geometrie simple, dessinee pour
12-15px. Melanger les deux familles dans une meme rangee aurait donne une
bouillie ; elles vivent dans des contextes distincts.

**Poids** : `optimize.js` ramene la precision a la decimale, regroupe les
commandes consecutives et redresse les cubiques quasi rectilignes, soit
-34% sur le catalogue entier. Les neuf traces retenus pesent 21 Ko, pour
un `icons.js` de 25 Ko. Certains pictogrammes du deck depassant 14 Ko a
eux seuls, la selection s'est faite, a lisibilite egale, sur le plus
leger.

`catalogue.json` (3,7 Mo) n'est pas versionne : il se regenere depuis le
pptx en quelques secondes. Voir `tools/icons/README.md`.

## Session 6 - 20 aout 2026 : refonte enterprise

Refonte du systeme de design et de l'outil de dimensionnement. Aucune donnee
de datasheet n'a ete modifiee : les valeurs de `data/pa-models.js` et les
seuils de `FAMILIES` sont ceux des sessions precedentes.

### Systeme de design

- **Typographie** : la pile `system-ui` remplace Poppins pour l'interface,
  Geist Mono reste pour les metriques (chiffres tabulaires). Suppression de
  6 fichiers de police - Poppins x4, Geist Sans, JetBrains Mono : **-130 Ko**
  de telechargement sur chaque premiere visite.
- **Palette** : neutres charbon/ardoise, Cyber Orange conserve mais ramene a
  un role fonctionnel (selection, focus, repere « votre besoin »). Nouveau
  jeton `--accent-txt` : `#FA582D` ne tenait pas 4.5:1 sur `--surface3`.
  Nouveau jeton `--on-accent` : le blanc sur orange ne tenait que 3.23:1.
  `--purple` retire.
- **Suppression du bloc « FX v5 »** : aurore de fond animee, texte en degrade
  anime, obliques derivantes, spot lumineux qui suivait le curseur,
  revelation avec flou, levitation des cartes au survol, jauge de lecture,
  compteurs animes. 22 degrades ramenes a 4 (teintes fonctionnelles).
- **Focus** : une regle `:focus-visible` globale, cibles tactiles 44px.

### Iconographie

- `icons.js` : 31 pictogrammes SVG traces (grille 24, trait 1.75), avec
  hydratation de `[data-ic]` et nom accessible optionnel.
- Tous les emoji et caracteres decoratifs remplaces sur les 14 pages.
  Un emoji change de dessin selon l'OS, ne prend pas la couleur du texte et
  n'a pas de nom accessible.
- Le jeu vectoriel officiel Palo Alto (« General Iconography ») n'a pas pu
  etre integre : le fichier telecharge est chiffre par la protection des
  droits Microsoft. Voir `_to_verify.md`.

### qualification.html : etabli a deux volets

- Le formulaire centre a 700px devient un **etabli plein ecran** : contraintes
  a gauche, recommandation a droite, chaque volet defile pour lui-meme. La
  page ne defile plus sur poste fixe (verifie a 1366, 1440 et 1920).
- **Recalcul continu** : plus de bouton « calculer ». Chaque saisie met a jour
  le volet droit (amorti a 180 ms au clavier, immediat sur les listes).
- Ajout d'une **jauge de charge** avec le repere des 65% (la marge de
  dimensionnement retenue par le projet) et d'un **tableau besoin/capacite**
  avec les unites explicites (Mbps, Gbps, sessions).
- Les champs que l'outil comble par hypothese portent un filet orange.
- Modes « express » et « approfondi » fusionnes : toutes les contraintes sont
  visibles, la densite du volet gauche les rend lisibles d'un coup d'oeil.
- Sous 1080px les volets s'empilent, **resultat en premier**.

### Corrections

- `fmtN(2500)` renvoyait `3K`. Un arrondi qui remonte est un chiffre faux :
  la decimale n'est desormais posee que si l'arrondi perd de l'information
  (`2,5K`). Ajout de `fmtExact` pour les valeurs saisies (debit du lien).
- Le nom du client etait reinjecte dans le HTML sans echappement.
- Le modele PDF importait Poppins depuis `fonts.googleapis.com`, contraire a
  la regle RGPD du projet et inutile dans une fenetre hors ligne.
- La barre de navigation debordait de la fenetre sous 400px sur toutes les
  pages ; le defaut etait masque par un `overflow` ailleurs. L'en-tete passe
  desormais sur deux lignes sous 768px.
- Les bulles d'aide etaient des `<span>` : elles sont maintenant des
  `<button>` atteignables au clavier, et `ui.js` ouvre la bulle au focus.
- Fins de ligne normalisees en LF (`.gitattributes`), le mixte CRLF/LF
  faisait echouer silencieusement les remplacements de chaines.

### Nettoyage

- 82 regles CSS orphelines retirees de `styles.css` (-10 Ko), 81 de la
  feuille inline de `qualification.html` (-12,8 Ko).
- `ui.js` : -30% (spot lumineux, compteurs animes, jauge de lecture).

### Verification

Le projet n'a toujours pas d'etape de build, et ne doit pas en avoir.
`npm run build` fait ce qu'un build ferait d'utile ici : verifier.

| commande | role |
| --- | --- |
| `npm run check` | `_check.js` : syntaxe JS, accolades CSS, assets manquants, appels CDN, cibles `getElementById`, emojis |
| `npm test` | `_smoke.js` : charge la page dans jsdom, joue 5 cas de dimensionnement, controle l'etiquetage des champs et l'echappement |
| `npm run responsive` | `_responsive.js` : ouvre 8 pages a 6 largeurs dans Chrome et refuse tout debordement horizontal |
| `npm run build` | les trois a la suite |

Contrastes mesures dans le navigateur : tous les elements de l'etabli
passent AA, le plus faible a 6.03:1.


## [Session 5] - 20 aout 2026

### Nouveaux outils NGFW (inspires du sizing guide Fortinet de Loic)
- feat(optiques): nouvelle page optiques.html - matrice des transceivers par debit (100M a 400G) et par support (multimode, monomode, cuivre, DAC/AOC). Filtres debit / support / portee / BiDi / TAA / durci + recherche. 45 modules.
- feat(accessoires): nouvelle page accessoires.html - 207 references d'alimentations, kits rack, ventilation, disques et divers, filtrables par rayon et par plateforme.
- feat(data): pa-optics.js et pa-accessories.js generes depuis la price list GLOBAL AUG 2026 par _extract_hw.py. AUCUN PRIX n'est repris, conformement a la regle du projet : SKU, description et attributs techniques uniquement.
- fix(data): PAN-SFP-100BASE-FX etait classe en 1G, sa description officielle se contredit ("100BASE-FX 100Mbps" puis "1000BASE-LX compliant"). Le motif 100 Mb est desormais teste en premier.

### Navigation
- feat(header): "Network Security" devient "NGFW" et porte un menu deroulant : Comparateur PA-Series, Qualification, Optiques, Accessoires, Panorama.
- feat(header): l'entree "Comparateur" qui pointait sur search.html devient "Recherche", son vrai role.
- feat(index): nouveau rayon "Outils du guide" en tete de l'accueil, avec les six outils du site.

### UI v4.1
- feat(styles): tableaux de reference repris - plus de grille verticale, lignes plus aerees, chiffres en chasse fixe, colonne de gauche collante sans trait dur, bande de section en degrade, repere d'accent sur la ligne survolee.
- feat(styles): encarts d'information avec pastille, degrade et variantes de couleur par pilier.
- fix(pages): suppression des regles .info-note et .section-title redefinies a l'identique dans les <style> de prisma, cortex, browser et panorama - elles ecrasaient la feuille commune par simple ordre de cascade.

## [Session 4] - 20 aout 2026

### Separation comparateur / qualification
- feat(pa-series): la page ne contient plus que le tableau de comparaison. Barre de modes, wizard commercial et guide de qualification retires.
- feat(qualification): nouvelle page qualification.html avec les deux vues sorties de pa-series (Qualification rapide, Guide de qualification) + lien retour vers le comparateur.
- feat(data): MODELS et fmtN externalises dans data/pa-models.js, source unique chargee par les deux pages (l'ancien data/pa-models.js etait obsolete et n'etait reference nulle part).
- feat(header): nouvel onglet Qualification dans la navigation.
- refactor(styles): .wiz-action-btn remonte de pa-series vers styles.css (utilise par le comparateur et par la qualification).
- fix(pa-series): hauteur du tableau recalculee (la barre de modes ne prend plus de place) et loadCompareFromURL n'appelle plus setMode.

### UI v4 - diffusion du langage visuel NGFW aux autres pages
- feat(styles): heros de page animes (lueur radiale, obliques du logo Palo en filigrane, titre en degrade Precision AI, puces de contexte).
- feat(styles): accent par pilier pose sur <body data-pillar> - SASE violet, Cortex vert, Idira ambre. La famille Network Security garde l'orange etabli.
- feat(ui.js): revelation au defilement en cascade, compteurs animes sur les chiffres cles, jauge de lecture. IntersectionObserver, aucune dependance, prefers-reduced-motion respecte.
- feat(styles): motion sur les cartes (elevation + bordure d'accent), trait de section qui se dessine a l'arrivee, lignes de tableau teintees au survol.
- feat(pages): prisma, browser, cortex, panorama, idira et resources passent au hero enrichi.
- fix(styles): garde-fou impression - les blocs a revelation restent visibles a l'impression.

## [Session 3] — 30 juin 2026 (après-midi)

### prisma.html (refonte totale)
- feat: réécriture complète avec navigation par onglets JavaScript
- feat: onglet Prisma Access (SSE) — tout le contenu SSE existant préservé
- feat: onglet Prisma SD-WAN — tableaux ION physiques et vION séparés + 4 overview cards
- feat: onglet Prisma Browser — tableau comparatif Education/Core/Pro (source: deck licensing)
- feat: détail PRO avec AWP/AXS/ABP, Advanced Data Protection (Beyond), Advanced Identity Protection (Web PAM), ADEM RUM
- feat: options de connectivité Prisma Browser Connector / NGFW Connector / ZTNA Connector
- feat: lien vers browser.html depuis l'onglet Browser
- fix: section Ressources toujours visible (hors onglets)
- fix: plus d'em-dash dans le nouveau contenu (tirets normaux)
- fix: encodage UTF-8 avec HTML entities pour les caractères accentués

### wizard.html (corrections V3 — WIZARD_V3_POLISH.md)
- fix: boutons choix remplacés par .wiz-choice (styled, hover, .selected accent)
- fix: texte d'aide via .wiz-helper (p, pas div/input — plus de champ désactivé)
- fix: tous les accents français corrigés (UTF-8 natif : Précédent, catégories, etc.)
- fix: bouton Précédent visible : background surface2, border, color text
- feat: logique Cortex V3 complète (5 cas A/B/C/D/E per spec)
  - Cas A (externalise) : bloc MSSP sans aucun SKU Cortex
  - Cas B (SOC moderniser) : Cortex XSIAM + Cortex Cloud
  - Cas C (SOC construire) : Cortex XDR Pro + Cortex Cloud
  - Cas D (< 200 endpoints) : XDR Prevent ou MSSP, pas de Cortex Pro
  - Cas E (Je ne sais pas) : 4 questions de qualification, pas de SKU
- feat: bloc pitch client copy-paste en haut de la page résultat (4 gabarits selon profil)
- feat: bouton Copier fonctionnel (clipboard API + fallback execCommand)
- fix: lien pa-series.html#PA-400 (ancre dynamique selon famille recommandée)
- fix: buildExport() corrigé pour les 5 cas Cortex

### pa-series.html
- fix: ajout id="PA-400" sur le bouton filtre PA-400 (ancre pour wizard)

### resources.html
- fix: ajout id="mssp" sur la section 8 (ancre resources.html#mssp pour wizard)

---

## [Session 2] — 30 juin 2026

### wizard.html (réécriture totale v2)
- feat: v2 complète — spec WIZARD_V2_DELTA.md implémentée
- feat: seuils commerciaux — Prisma Access < 200 unités → encart jaune avec alternatives
- feat: seuils commerciaux — Cortex < 200 endpoints → XDR Prevent ou MSSP
- feat: Local Edition (< 1000 unités) vs Worldwide Edition (>= 1000)
- feat: sizing NGFW recalibré — 13 paliers PA-410 → PA-7500 (source WIZARD_V2_DELTA.md)
- feat: Q3 tailles de site recalibrées — Tres petit 20 Mbps / Petit 50 / Moyen 100 / Grand 250 / Tres grand 500
- feat: formulations Q1-Q7 exactes conformes spec v2
- feat: bouton Export — génère texte markdown copiable + copie dans le presse-papier si disponible
- feat: add-ons ADEM (users_remote > 500), App Acceleration (site_size >= Moyen)
- feat: mention Cortex Cloud sur le bloc SecOps
- fix: classe sessionStorage key renommée wiz_state
- fix: classes CSS préfixées .wiz-

### pa-series.html
- fix: 4 occurrences "IoT Security" → "Device Security" (lignes 1174, 1361, 1365, 2390)

### links.js
- fix: "IoT Security" → "Device Security" dans description Subscriptions NGFW
- fix: "150+ Points of Presence" → "100+" (cohérence avec prisma.html)
- feat: ajout carte AI Runtime Security (AIRS) dans catégorie SASE & Cloud
- feat: ajout catégorie "Identite" avec 5 cartes Idira (PAM, IAM, EPM, Agentic, overview)

### header.js
- feat: ajout entrée Idira dans le dropdown Produits
- feat: ajout nav-btn "Mode guide" pointant vers wizard.html

### browser.html
- fix: "150+ mondiaux" → "100+ mondiaux" dans le noeud Prisma Access PoP (cohérence)
- feat: lien "Toutes les ressources" ajouté en bas de section Ressources

### cortex.html
- feat: lien "Toutes les ressources" ajouté en bas de section Ressources officielles

### prisma.html
- feat: section Ressources ajoutée (4 liens : page produit, licensing guide, docs, LIVEcommunity)
- feat: lien "Toutes les ressources" vers resources.html

### panorama.html
- feat: section Ressources ajoutée (4 liens : Panorama, SCM, Compatibility Matrix, LIVEcommunity)
- feat: lien "Toutes les ressources" vers resources.html

### pa-series.html
- feat: lien "Toutes les ressources" ajouté dans le footer

### resources.html (nouveau)
- feat: page dédiée avec 9 catégories de liens validés (portails, pages produit, datasheets, docs, EoS/EoL, formation, benchmarks, partenaires, liens obsolètes)
- feat: tableau "Liens à ne plus utiliser" (Beacon, Prisma Cloud, CDL docs, GP NGFW SKUs)

### idira.html (nouveau)
- feat: page Idira avec 3 domaines (humain, agentique, machine), tableau des 7 composants
- feat: note d'intro : nouveau pilier identite, détails SKU en attente, contacter SE

---

## [Refonte ciblée] — 29 juin 2026

### prisma.html
- fix: sous-titre page-header mis à jour avec mention Prisma Access Agent (ex-GlobalProtect SKUs)
- fix: info-note transition GlobalProtect SKUs ajoutée avant le bloc architecture overview
- fix: "150+ PoP mondiaux" → "100+ PoP mondiaux" (carte PoP + tableau MU + note connectivité)
- fix: carte CDSS "IoT / Device Security" renommée en "Device Security"
- fix: add-on "IoT Security" renommé en "Device Security" dans la section add-ons MU (SKU conservé)
- fix: "Strata Cloud Manager (base)" → "Strata Cloud Manager Essentials" + ligne séparée "Strata Cloud Manager Pro (Add-on)"
- fix: "Strata Logging Service" reformulé en "requis · SKU séparée" dans les tableaux MU et NET

### cortex.html
- fix: sous-titre page-header : "Cortex Data Lake" → "AgentiX · Cortex Cloud"
- fix: "Vue d'ensemble — 4 produits" → "5 produits"
- feat: ajout 5e product-card Cortex Cloud (CNAPP + CDR, remplace Prisma Cloud, v2.0 oct. 2025)
- fix: XSIAM card-desc : "Inclut XDR, XSOAR et CDL" → "Inclut XDR, AgentiX et Strata Logging Service"
- fix: module XSIAM "Cortex Data Lake (CDL)" → "Strata Logging Service (ex-CDL)"
- fix: note transition AgentiX rafraîchie (standalone disponible début 2026)
- feat: lien ressource Cortex Cloud ajouté dans la section Ressources officielles

### panorama.html
- fix: note d'intro enrichie avec mention ESA Pro (1er nov. 2025, inclut SCM)
- fix: note bas de page reformulée pour Strata Cloud Manager vs Panorama

### header.js
- fix: sous-titre dropdown Cortex : "XDR · XSIAM · XSOAR · Xpanse" → "XDR · XSIAM · AgentiX · Xpanse · Cloud"

### index.html
- feat: carte "🧙 Mode guidé (non-technique)" ajoutée en tête de page (lien vers wizard.html)

### search.html
- feat: bandeau discret ajouté en haut de page "Pas à l'aise avec les filtres techniques ? Essayez le mode guidé →"

### wizard.html (nouveau)
- feat: page wizard complète — 7 questions business linéaires avec progress bar
- feat: Q1-Q2 nombre d'utilisateurs on-site / en mobilité
- feat: Q3 nombre et taille des sites distants
- feat: Q4-Q6 filtrage Internet, apps privées, IoT (Oui / Non / Je ne sais pas)
- feat: Q7 maturité SOC (4 options)
- feat: état sauvegardé dans sessionStorage (retour arrière possible)
- feat: résultat en 5 blocs (Prisma Access, PA-Series, Cortex, éléments obligatoires, disclaimer)
- feat: liens "Voir les détails techniques" vers pa-series.html, prisma.html, cortex.html, panorama.html
