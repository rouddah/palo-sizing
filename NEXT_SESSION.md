# Briefing session suivante - palo-sizing

> Mis a jour le 20 aout 2026 (session 6). A lire en debut de session avant de toucher quoi que ce soit.

## Contexte rapide

Repo : `C:\Users\rayna\Documents\palo-sizing` - HTML/CSS/JS vanilla, **aucune compilation**.
Remote GitHub : `https://github.com/rouddah/palo-sizing` (Git Credential Manager, `git push origin main`).
Production : https://palo-sizing.pages.dev
Token Cloudflare : `C:\Users\rayna\Desktop\tokencloudflare.txt`

## Verifier, puis deployer

Il n'y a rien a compiler, mais il y a de quoi verifier. **Lancer `npm run build`
avant tout deploiement.**

```bash
npm run build        # check + smoke + responsive
npm run deploy       # check + smoke + stage + wrangler
```

| commande | role |
| --- | --- |
| `npm run check` | `_check.js` : syntaxe JS, accolades CSS, assets manquants, appels CDN, cibles `getElementById`, compteurs de l'accueil adosses aux donnees, emojis (entites HTML comprises), em-dash dans le contenu |
| `npm test` | `_smoke.js` : charge `qualification.html` dans jsdom, joue 5 cas de dimensionnement, controle l'etiquetage des champs et l'echappement |
| `npm run responsive` | `_responsive.js` : 8 pages a 6 largeurs, refuse tout debordement horizontal |
| `npm run contrast` | `_contrast.js` : 13 pages x 2 themes, contraste AA, en composant les fonds translucides |
| `npm run keyboard` | `_keyboard.js` : 371 cibles interactives, noms accessibles et marque de focus reellement testee |
| `npm run stage` | `_stage.js` : construit `.deploy/` a partir d'une liste blanche, et echoue si un fichier appele par une page manque au bundle |

## Systeme de design, a respecter

**Jetons** : rayons `--r-xs` a `--r-pill`, espacement en base 4px avec trois
calibres de carte (`--pad-compact`, `--pad-card`, `--pad-large`), tailles de
texte sur 14 pas. Ne pas reintroduire de valeur en dur : aucun controle ne
l'attrape, et le systeme se defait vite. Il a fallu convertir 92 rayons et 43
tailles pour le remettre d'aplomb.

**Couleur de texte** : toujours `--accent-txt`, jamais `--accent`, qui ne tient
pas 4.5:1. Sur un aplat orange, `--on-accent` (le blanc y plafonne a 3,23).
Les couleurs de pilier et de produit ont des declinaisons assombries en theme
clair : elles sont faites pour la projection sur fond sombre.

**Une couleur de marque n'est pas une encre.** C'est la cause de presque tous
les ecarts de contraste trouves : elle habille un cadre ou un aplat, elle ne
porte pas de caracteres de 10px.

Le deploiement passe par `.deploy/`, **jamais par la racine** : Pages n'honore
ni `.gitignore` ni `.assetsignore`, et deployer `.` publiait le CHANGELOG, les
scripts de verification et `package.json`.

Le token doit etre en variable d'environnement avant wrangler :

```bash
export CLOUDFLARE_API_TOKEN="$(tr -d ' \t\r\n' < ~/Desktop/tokencloudflare.txt)"
npm run deploy
```

Le push GitHub ne declenche **pas** le deploiement Cloudflare. Toujours lancer
`npm run deploy` a la main.

## Etat au 20 aout 2026 (session 6)

Refonte du systeme de design et de l'outil de dimensionnement. Detail complet
dans `CHANGELOG.md`. Les points a retenir avant d'editer :

- **La couche decorative « FX v5 » a ete supprimee** (aurore de fond animee,
  texte en degrade, obliques derivantes, spot suivant le curseur, levitation
  des cartes, compteurs animes, jauge de lecture). C'etait une demande
  explicite : ne pas la reintroduire.
- **Typo** : pile `system-ui` pour l'interface, Geist Mono pour les seules
  metriques. C'est le dernier webfont du site, ne pas en rajouter.
- **Couleur** : passer par `--accent-txt` pour tout libelle colore (`#FA582D`
  ne tient pas 4.5:1 sur `--surface3`) et par `--on-accent` pour du texte pose
  sur un aplat orange (le blanc y plafonne a 3.23:1).
- **Pictogrammes** : `icons.js`, via `<span data-ic="nom">` ou `ic("nom")` en
  JS. **Plus aucun emoji sur le site**, `_check.js` le verifie.
- **`qualification.html` est un etabli a deux volets** : contraintes a gauche,
  recommandation a droite, recalcul continu a chaque saisie (il n'y a plus de
  bouton « calculer »). Classes prefixees `.wb-`.
- **Fins de ligne** : tout est en LF, fixe par `.gitattributes`. Le depot etait
  en CRLF/LF mixte, ce qui faisait echouer silencieusement les remplacements de
  chaines multilignes.

## Tache ouverte

**Jeu de pictogrammes officiel Palo Alto** : le pptx telecharge est chiffre par
la protection des droits Microsoft, donc inexploitable. Voir `_to_verify.md`.
Quand un export SVG sera disponible, il suffira de remplacer les traces de
`PATHS` dans `icons.js` : aucune page a modifier.

## Phases non traitees de la refonte

Les phases 1 et 2 (systeme de design, outil de dimensionnement) sont livrees.
Restent, si besoin :

- passe de densite sur `pa-series.html` (le comparateur)
- audit de la microcopie sur les pages produit (prisma, cortex, browser)
- `wizard.html` et `search.html` n'ont recu que le nettoyage des emojis

## Regles non negociables (rappel)

- Stack inchangee : HTML/CSS/JS vanilla, pas de framework, pas de compilation
- Pas de prix, jamais
- Pas d'em-dash dans le contenu nouveau
- Noms officiels PAN en anglais (Mobile User, Service Connection, Remote Network)
- Donnees chiffrees sourcees uniquement, sinon `[a confirmer]` + `_to_verify.md`
- Ne pas inventer de SKU
