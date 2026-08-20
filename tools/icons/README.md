# Convertisseur DrawingML -> SVG

Extrait les pictogrammes officiels Palo Alto Networks du deck
« General Iconography (vector format) » et genere `icons.js`.

Les pictogrammes du deck ne sont pas des images : ce sont des formes
vectorielles DrawingML dans le XML des slides. Le jeu n'emploie que
`moveTo`, `lnTo`, `cubicBezTo` et `close`, donc la conversion vers SVG
est exacte, sans arc a approximer.

## Marche a suivre

```bash
cd tools/icons
unzip -q "General Iconography by dineche.pptx" -d pptx   # le deck officiel
node extract.js          # pptx -> catalogue.json  (458 pictogrammes)
node sheet.js            # planche.html, pour choisir a l oeil
node sheet.js Network    # une seule categorie
node build-iconsjs.js    # catalogue.json -> icons.generated.js
cp icons.generated.js ../../icons.js
```

`catalogue.json` fait ~3,7 Mo et n'est pas versionne : il se regenere en
quelques secondes depuis le pptx.

## Comment un pictogramme est reconnu

Dans chaque slide, un pictogramme est un `<p:grpSp>` suivi du `<p:sp>`
texte qui le nomme. Sont ecartes les groupes dont le rapport largeur /
hauteur sort de 0,45-2,4 : ce sont des logotypes, pas des pictogrammes.

Les coordonnees traversent trois espaces (trace local -> boite de la
forme -> groupes imbriques). `extract.js` compose la transformation puis
normalise chaque pictogramme dans une grille 24x24.

## Deux familles dans icons.js

`build-iconsjs.js` produit deux tables :

- **PAN** : les traces officiels, remplis en `currentColor`. Reserves
  aux concepts metier dans les titres de groupe et de section, **a 20px
  minimum**. Le jeu officiel est dessine pour la projection : en dessous
  de 20px ses traits les plus fins disparaissent, c'est mesure, pas
  suppose.
- **UI** : une geometrie minimale au trait pour les affordances
  d'interface (coche, croix, chevron, fleche, telechargement) rendues a
  12-15px, ou un dessin detaille deviendrait une tache.

Pour changer la correspondance entre un nom du site et un pictogramme
officiel, editer la table `PAN` en tete de `build-iconsjs.js`, puis
regenerer. **Ne jamais editer les traces a la main dans `icons.js`** :
ils seraient perdus a la prochaine generation.

## Poids

`optimize.js` ramene la precision a la decimale, regroupe les commandes
consecutives et convertit en lignes les cubiques quasi rectilignes :
environ -34% sur le catalogue entier. Les neuf pictogrammes officiels
retenus pesent ~21 Ko de traces. Verifier ce poids avant d'en ajouter :
certains pictogrammes du deck depassent 14 Ko a eux seuls.
