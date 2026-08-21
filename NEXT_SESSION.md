# Briefing session suivante - palo-sizing

> Mis a jour le 21 aout 2026 (session 15). A lire en debut de session avant de toucher quoi que ce soit.

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
| `npm run data` | `_data-audit.js` : coherence interne des 54 modeles. Une valeur non publiee par la datasheet sort en avertissement, pas en erreur |
| `npm run check` | `_check.js` : syntaxe JS, accolades CSS, assets manquants, appels CDN, cibles `getElementById`, compteurs de l'accueil et nombres de modeles ecrits dans les pages adosses aux donnees, emojis (entites HTML comprises), em-dash dans le contenu |
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

## Etat au 21 aout 2026 (session 15)

Le catalogue a ete recontrole datasheet par datasheet et complete.
Detail dans `CHANGELOG.md`. A retenir avant d'editer :

- **54 modeles, 12 series.** Ajoutees : PA-1500, PA-3500, PA-5500,
  PA-50R, plus PA-501 et PA-520-5G.
- **`data/pa-models.js` est la seule source.** La page recherche portait
  sa propre copie : elle a ete supprimee. Les bornes de serie de
  l'etabli et les boutons de filtre des deux pages sont derives des
  donnees, en calcul **paresseux** (au premier appel, pas au
  chargement : l'ordre des scripts differe entre navigateur et DOM de
  test).
- **Un champ nul veut dire « non publie ».** Le VPN IPsec et le CPS des
  PA-3500 et des trois premiers PA-5500 sont TBD chez Palo Alto. Ne pas
  les estimer. Dans l'etabli, une metrique nulle sort du calcul et un
  encart le dit ; ne pas la traiter comme une capacite infinie, cela
  revient a ne jamais proposer le modele.
- **Ne pas inventer de SKU.** Six modeles ont un `sku` nul parce que la
  datasheet ne publie pas la reference chassis.
- **Les couleurs de modele sont des fonds**, pas des encres : elles
  doivent tenir 4,5:1 avec le blanc ou le charbon. `npm run contrast`
  le verifie sur les 54.
- **`_data-audit.js` tourne au build.** Ajouter un modele incoherent
  fait echouer `npm run build`.

## Tache ouverte

`_to_verify.md` liste ce qui attend une confirmation Palo Alto : les
valeurs TBD, les references chassis manquantes, la contradiction de nom
sur le troisieme PA-50R, le statut de commercialisation de la PA-1400.

## Chantiers non traites

- passe de densite sur `pa-series.html`, le comparateur
- audit de la microcopie sur les pages produit (prisma, cortex, browser)
- `wizard.html` n'a recu que le nettoyage des emojis
- la PA-50R est volontairement hors du moteur de recommandation de
  l'etabli : un profil de bureau ne se dimensionne pas sur un boitier OT

## Regles non negociables (rappel)

- Stack inchangee : HTML/CSS/JS vanilla, pas de framework, pas de compilation
- Pas de prix, jamais
- Pas d'em-dash dans le contenu nouveau
- Noms officiels PAN en anglais (Mobile User, Service Connection, Remote Network)
- Donnees chiffrees sourcees uniquement, sinon champ nul + `_to_verify.md`
- Ne pas inventer de SKU
- Ne jamais nommer un document interne dans le depot ou sur le site :
  la source annoncee est la datasheet officielle
