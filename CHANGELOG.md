# Changelog

## Session 15 - 21 aout 2026 : le catalogue rattrape les datasheets

### Ce qui a declenche la session

Palo Alto a annonce les PA-1500 et PA-3500. La demande etait de les
ajouter, et de **recontroler toutes les valeurs deja publiees** sur le
site. Les douze datasheets PA-Series ont ete relues une par une.

### Les chiffres de performance etaient bons

C'est le premier resultat, et il vaut d'etre ecrit : sur les 33 modeles
deja presents, **aucun debit, aucune session, aucun CPS n'etait faux**.
Table 1 de chaque datasheet, ligne par ligne, tout concorde.

### Les comptes de ports, eux, ne l'etaient pas

C'est la Table 3 qui a livre les erreurs, toujours la meme : les ports
cuivre multi-gigabit etaient comptes comme des SFP+.

| Modeles | Etait affiche | Datasheet |
| --- | --- | --- |
| PA-3410 a PA-3440 | 22 x SFP+ | 12 x cuivre mGig + 10 x SFP+ |
| PA-5410 a PA-5445 | 20 x SFP+ | 8 x cuivre mGig + 12 x SFP+ |
| PA-1410, PA-1420 | 8 et 4 x RJ45 | 12 x RJ45, les ports PoE manquaient |
| PA-415, PA-445, PA-455, PA-455-5G | combo compte a la place du cuivre | jusqu'a 10 x RJ45 |

Le PA-7500 comptait **les memes ports physiques trois fois** : 24 en
SFP+, 24 en SFP28 et 40 en QSFP28, pour 40 ports reels. La configuration
de reference porte 24 SFP-DD et 16 QSFP-DD, rien d'autre.

### Quatre series et deux modeles manquaient

Le site s'arretait a 33 modeles. Il en compte 54.

- **PA-1500** : PA-1510-POE, PA-1520-POE, PA-1530-POE. Quantum-optimized,
  16 ports PoE++ 90 W, commutation de niveau 2 integree.
- **PA-3500** : PA-3510 a PA-3540, jusqu'a 35 Gbps Threat Prevention.
- **PA-5500** : PA-5510 a PA-5580, jusqu'a 300 Gbps Threat Prevention et
  des QSFP-DD 400G. Elle n'avait jamais ete saisie.
- **PA-50R** : quatre boitiers durcis pour l'OT, absents eux aussi.
- **PA-501** et **PA-520-5G**, oublies de la serie PA-500.

### Ce que la datasheet ne dit pas, le site ne le dit pas

Les datasheets d'aout 2026 portent **TBD** sur le VPN IPsec et le CPS des
PA-3500 et des trois premiers PA-5500. Ces champs restent nuls et
s'affichent en tiret. Consequence sur l'etabli de dimensionnement : une
metrique non publiee ne peut ni valider ni disqualifier un modele, elle
sort du calcul, et le volet de recommandation affiche un encart qui nomme
le trou.

L'inverse aurait ete plus simple a coder et faux : exclure ces modeles
par une capacite infinie revenait a ne jamais les proposer, y compris
quand ils tiennent tres bien le besoin.

Meme regle pour les references : les datasheets PA-500 et PA-50R ne
publient que des SKU d'accessoires. Les six modeles concernes portent un
`sku` nul plutot qu'une reference devinee.

### Trois listes ecrites a la main ont ete supprimees

Ajouter une serie demandait de la recopier a quatre endroits. Les trois
qui restaient sont maintenant derivees des donnees :

- les **bornes de serie** de l'etabli (`tpMin`, `tpMax`, `sessMax`,
  modeles couverts) etaient recopiees des datasheets a la main ;
- les **boutons de filtre** du comparateur et de la recherche etaient
  ecrits en dur, et une serie ajoutee aux donnees n'y apparaissait pas ;
- la page **recherche portait sa propre copie des 33 modeles**, figee une
  generation de catalogue en arriere.

Un seul jeu de donnees, `data/pa-models.js`, et une derivation
**paresseuse** : le calcul se fait au premier appel, pas au chargement,
parce que l'ordre d'execution des scripts n'est pas le meme dans un
navigateur et dans un DOM de test.

### Deux defauts trouves en chemin

**La serie de repli passait devant.** Une serie qui ne tenait qu'a 90% de
sa datasheet etait recommandee des qu'elle arrivait la premiere, meme si
une serie superieure tenait dans la marge des 65%. L'arrivee de la
PA-1500 a rendu le defaut visible : un besoin de 22,5 Gbps recommandait
un PA-1530-POE charge a 83%. Le repli n'est desormais propose que si rien
ne tient dans la marge.

**Le cas de test attendait la mauvaise serie.** 10 Gbps avec
dechiffrement et croissance forte donnaient une PA-5400 tant que c'etait
la premiere serie a tenir 22,5 Gbps. Le PA-3540 les tient a 64% de
charge. Le test attend maintenant la PA-3500.

### Favicone

Elle etait construite a plein cadre : les trois barres de la marque
touchaient les quatre bords et s'y trouvaient coupees. Elle est
refabriquee a partir du logo officiel, marque isolee du mot-symbole,
detouree puis reposee centree avec 12% de marge. Une version 180 px est
ajoutee pour l'icone d'ecran d'accueil.

### Six teintes ne tenaient pas le contraste

Le nom du modele est pose sur la couleur du modele. Six teintes
plafonnaient entre 4,1 et 4,5:1 avec la meilleure des deux encres, dont
trois deja en production. Elles sont assombries. Le controle porte
desormais sur les 54.

### La matrice des optiques

Elle etait construite en cartes : chaque module portait un cadre
arrondi, un fond teinte de la couleur de son support, une ombre et une
levitation au survol. Quarante-cinq cartes dans une grille, ce n'est
plus une matrice, c'est un mur. Les en-tetes de colonne, eux, etaient
des pastilles ovales centrees au-dessus de colonnes dont le contenu
commence a gauche.

- **L'en-tete de colonne est typographique** : le debit se lit comme un
  chiffre, son unite l'accompagne en petit, le form factor suit en
  capitales espacees. Plus d'ovale.
- **Un module tient en deux lignes** : reference et portee sur la
  premiere, norme, fibre, connecteur et badges sur la seconde. Les
  portees s'alignent a droite d'une entree a l'autre : c'est le chiffre
  qu'on vient chercher.
- **La couleur du support ne teinte plus les modules.** Elle vit sur un
  filet vertical en tete de ligne, et nulle part ailleurs. Quarante-cinq
  cadres teintes ne codent plus rien.
- **Une case vide reste vide**, avec un fond en retrait. Elle portait un
  caractere a 30% d'opacite, ce qui donnait a lire quelque chose la ou
  il n'y a rien.
- **Le debordement horizontal se voit** : un voile sur le bord droit
  signale qu'il reste des colonnes, et disparait a la derniere.

La matrice tient desormais ses quatre lignes de support dans un ecran,
la ou deux depassaient avant.

Au passage, sous 1100px le sous-titre des barres d'outils se comprimait
en colonne de trois mots entre le titre et les boutons. Il passe a la
ligne.

### Fins de ligne

`styles.css` portait encore des retours chariot isoles au milieu de
lignes, reliquat d'un ancien editeur. Le depot n'en contient plus.

### Garde-fous ajoutes

- `_data-audit.js` entre au build. Il verifie ce qu'aucune datasheet ne
  peut contredire : le debit Threat Prevention ne depasse pas l'App-ID,
  un modele superieur n'est pas en dessous de son cadet, les tunnels
  GlobalProtect ne depassent pas les sessions. Une valeur **non publiee**
  n'y est pas une erreur mais un avertissement : le controle separe ce
  qui est faux de ce qui manque.
- `_check.js` compare tout nombre de modeles ecrit dans une page au
  contenu reel des donnees. Le site a longtemps annonce 39 modeles pour
  33, et rien ne le signalait.

## Session 14 - 21 aout 2026 : l'etabli descend au modele

### Pourquoi l'etabli plutot que le wizard

Les deux outils se recouvraient en fonction et se completaient en
perimetre. Mesure : le wizard mentionne SASE, Cortex et XSIAM
**44 fois** contre 6 pour l'etabli ; l'etabli mentionne Threat
Prevention, WildFire et GlobalProtect **21 fois** contre 4.

L'investissement va a l'etabli : c'est l'outil technique pour
l'audience du site, il a l'interaction a recalcul continu, et le coeur
de valeur du site est le dimensionnement NGFW. Le wizard reste le
parcours business, inchange.

### Du modele, pas de la serie

L'etabli annonçait « PA-3400 Series, modeles candidats PA-3410 a
PA-3440 ». Un avant-vente ne commande pas une serie. Les donnees
portaient 33 champs par modele ; l'outil n'en affichait que la famille.

**Trois metriques decident du dimensionnement d'un NGFW**, et c'est
toujours la plus contraignante qui impose le modele :

| metrique | ce qu'elle mesure |
| --- | --- |
| debit Threat Prevention | toutes protections actives |
| sessions concurrentes | flux ouverts simultanement |
| CPS | nouvelles connexions par seconde |

Un modele peut tenir le debit et s'ecrouler sur les sessions : le SaaS
et la visioconference ouvrent beaucoup de petites sessions pour peu de
bande passante. C'est pourquoi l'ecran **nomme desormais le facteur
dimensionnant**, et pas seulement le verdict.

Verifie au test : 3000 utilisateurs SaaS sur 300 Mbps donnent bien
« sessions » et non « debit ».

### Ce qui a ete ajoute

- **Besoin en CPS**, qui manquait entierement. Estime a partir des
  sessions et d'une duree de vie moyenne de 30 s, hypothese affichee
  comme telle et a remplacer par le CPS mesure des qu'il existe.
- **Selection du modele le plus juste** qui tienne les trois
  contraintes a 65% de la datasheet. Le plus juste, pas le plus large :
  un modele surdimensionne est un budget perdu, pas une securite.
- **Tableau des trois modeles pertinents** de la serie avec leur charge
  sur chaque metrique : on voit ce qu'on gagne a monter d'un cran.
- **Fiche materielle** : format, interfaces detaillees, nombre
  d'appliances, reference chassis.

### Deux incoherences corrigees au passage

**La jauge mesurait le haut de serie.** Elle affichait « Charge sur
PA-3440, 20 Gbps TP : 28% » quand le tableau juste en dessous
annonçait « PA-3420 RETENU, 56% ». Deux chiffres pour la meme chose,
dont un qui ne correspondait a aucune recommandation. La jauge mesure
desormais le modele retenu.

**L'outil affirmait « sans redondance »** quand la haute disponibilite
n'etait pas renseignee. Il ecrit maintenant « doubler si une paire HA
est retenue » : il dit ce qu'il sait et signale ce qu'il ignore.

### Le brief part chez le client

Il etait entierement desaccentue alors que l'ecran ne l'est pas, et
affichait les valeurs brutes du formulaire : « strong », « fortinet »,
« heavy ». Chaque code a desormais son libelle francais, et le
document porte la reference exacte, le facteur dimensionnant, les
interfaces et le nombre d'appliances.

## Session 13 - 21 aout 2026 : systeme de design, accessibilite, garde-fous

Session menee en autonomie, consigne : « ameliore l'UI et self improve ».

### Un systeme la ou il n'y en avait pas

Le depot posait ses valeurs au fil de l'eau. Mesure avant travaux :
**36 tailles de texte** distinctes dont des demi-pixels, **12 rayons**
de bordure, un padding different par composant (20/20/22, 22/20/24,
16/18, 10/12, 12/16, 18/18/16).

Aucune de ces valeurs n'est fausse prise seule. Ensemble, elles font
que rien ne repond a rien : un rayon dit a quel niveau appartient une
surface, douze valeurs ne disent plus rien.

- **Rayons** : cinq pas (`--r-xs` a `--r-pill`), 92 valeurs converties
  en jetons.
- **Tailles** : 43 valeurs ramenees sur l'echelle, 36 valeurs
  distinctes reduites a 14.
- **Espacement** : base de 4px, trois calibres de carte (compact,
  normal, large).

### Qualite typographique

Sans changer une taille ni une couleur : chiffres tabulaires et zero
barre sur tout le monospace, `text-wrap: balance` sur les titres et
`pretty` sur les paragraphes, longueur de ligne bornee a 72
caracteres, interlettrage systematique des capitales, trois paliers
d'interlignage, cesure des noms de produit longs.

### Contraste : 48 ecarts, deux tiers reels

Le controle ne couvrait que trois pages. Etendu a treize, il a remonte
48 ecarts. **Deux tiers etaient de vrais defauts, un tiers venait de
la sonde elle-meme.**

Defauts reels, tous du meme genre : des couleurs de marque employees
comme couleur de TEXTE.

| Cause | Detail |
| --- | --- |
| Couleurs de pilier | jaune Strata, cyan Prisma, vert Cortex : faits pour le fond sombre, ils tombent entre 1,5 et 2,2 sur blanc |
| Couleurs produit | meme traitement, declinaisons assombries pour le clair |
| `--identity` | a l'inverse trop sombre POUR le theme sombre (2,98) |
| Blanc sur orange | 3,23:1, dans neuf boutons |
| Deux replis de `--pillar` | celui sur `body` ecrasait celui sur `:root` |
| Cartes modele | dix sur trente-trois en texte blanc sur couleur trop claire, le PA-5445 a **1,44:1** |
| Pastille jaune sur carte jaune | 1,43:1 |
| `.info-note.purple` | pointait sur `--purple`, jeton retire en session 6 |

Pour les cartes modele, l'encre est desormais **calculee a partir du
fond**, en comparant le contraste des deux options plutot qu'en
devinant avec un seuil. Un seuil fixe a 0,45 laissait encore l'ambre
en blanc a 2,15 alors que le charbon y donne 8,6. Les 33 cartes
passent, la plus faible a 4,89. Retoucher dix couleurs a la main
aurait regle le symptome du jour ; calculer regle aussi celles qu'on
ajoutera.

### La sonde etait le maillon faible

Deux fois, l'outil de mesure a envoye corriger ce qui allait bien :

1. il ne composait pas les fonds translucides : un badge annonce a
   3,18 etait en fait a 5,50 ;
2. il lisait `color(srgb 1 1 1 / .9)`, syntaxe que Chrome renvoie pour
   tout `color-mix()`, comme du rgb 0-255. **Le blanc devenait noir**,
   d'ou 24 echecs imaginaires dont un titre a 1,09:1 parfaitement
   lisible a l'ecran.

Les deux sont corriges, et la sonde ecarte desormais les fonds en
degrade, dont la couleur n'est pas determinable.

### Parcours clavier

`_keyboard.js`, 371 cibles interactives sur huit pages, 13 defauts
invisibles a la souris :

- cinq champs sans nom accessible : les `<label>` existaient mais sans
  `for=`, ils n'etaient rattaches a rien ;
- huit champs annulaient le focus par `outline: none` sans rien mettre
  a la place, parfois en style en ligne que la feuille ne peut pas
  surcharger. L'anneau passe par `box-shadow`, qui y survit.

Le controle **met reellement le focus** et compare le rendu avant et
apres : lire la feuille de style ne suffirait pas, une regle peut etre
annulee plus loin.

### Etat vide

L'ecran d'attente de la recherche affichait une croix au milieu d'un
grand rien. La croix signifie annuler : sur un ecran qui attend une
saisie, elle se lisait comme une erreur alors que rien n'allait mal.
Refait en encart cadre, cale en haut, avec une jauge et une copie qui
dit quoi saisir.

### Regle em-dash

242 en avaient repris place, dont les titres de toutes les pages. 140
corriges dans le texte visible ; le marqueur d'absence dans un tableau
et les commentaires restent autorises. **La regle est desormais
verifiee au build**, parce qu'elle s'etait deja reperdue une fois.

### Le build compte cinq controles

| commande | role |
| --- | --- |
| `_check.js` | syntaxe, assets, CDN, identifiants, compteurs, emojis, em-dash |
| `_smoke.js` | dimensionnement dans jsdom, cinq cas |
| `_responsive.js` | 8 pages x 6 largeurs, debordement horizontal |
| `_contrast.js` | 13 pages x 2 themes, AA |
| `_keyboard.js` | 371 cibles, noms et focus |

### Signalement retire

Un point de ma liste d'ameliorations etait faux : `links.js` n'est
charge que par `index.html`, il n'y avait pas 27 Ko gaspilles sur
douze pages. Verifie avant d'agir.

## Session 12 - 20 aout 2026 : fond « obliques de la marque »

Troisieme et derniere piste de fond. Les deux precedentes ont ete
ecartees pour des raisons opposees : le maillage de particules parce
que c'est le fond « tech » le plus vu du web et qu'il ne dit rien du
produit, la telemetrie parce qu'elle etait trop sage.

**Obliques de la marque** : le motif du logo Palo Alto, trois barres
paralleles inclinees, porte a l'echelle de l'ecran. La barre mediane
monte plus haut et descend plus bas, ce qui fait lire le motif comme
le logo et non comme de simples rayures.

Deux plans a des vitesses differentes donnent la profondeur. Une bande
de lumiere balaie l'ecran : au repos les obliques sont presque
eteintes, elles n'apparaissent qu'au passage de la lumiere, comme une
surface metallique balayee. La barre mediane prend l'orange de la
marque une fois eclairee, les deux autres restent neutres : un seul
accent, jamais deux.

Ce fond ne represente rien, et c'est voulu. Il porte la marque, ce qui
suffit.

Cout : 4,4% d'un coeur, contre 5,3% pour la telemetrie et 3,2% pour le
maillage. Rien n'est peint sous le seuil de visibilite (alpha < 0,005),
et le rendu plafonne a 24 images par seconde.

Garde-fous inchanges et reverifies : pas de canvas sous
prefers-reduced-motion, pas de canvas sous 620px, 0,0% de processeur
onglet cache, retrait silencieux en cas d'echec.

La version telemetrie est conservee hors depot en cas de retour en
arriere.

## Session 11 - 20 aout 2026 : fond telemetrie, logos vectoriels

### Le fond change de piste

Le maillage de particules de la session 10 a ete abandonne. Motif
assume : c'est le fond « tech » le plus vu du web depuis dix ans, et il
ne disait rien du produit. Un cliche avait remplace un autre.

Trois pistes ont ete construites et comparees a l'ecran : un flux de
paquets traversant une ligne d'inspection, les obliques du logo a
l'echelle de l'ecran, et une telemetrie. La telemetrie a ete retenue.

**Telemetrie** : des courbes de charge empilees, leur aire remplie, et
une graduation temporelle qui glisse vers la gauche comme l'axe d'un
graphe qui avance. L'outil parle de debit et de sessions, le fond
montre du debit.

Cout mesure et travaille : 7,8% d'un coeur a la premiere ecriture,
5,3% apres trois corrections.

| Correction | Gain |
| --- | --- |
| Trace calcule une fois, reutilise pour l'aire et le trait | 7,8 -> 7,0% |
| Graduation en un seul chemin, 20 images/s au lieu de 30 | 7,0 -> 6,2% |
| Profondeur de remplissage bornee a 300px | 6,2 -> 5,3% |

La derniere est la plus instructive : le degrade atteignait l'opacite
nulle bien avant le bas de l'ecran, on peignait donc des milliers de
pixels parfaitement transparents a chaque image.

Garde-fous inchanges et reverifies : pas de canvas sous
prefers-reduced-motion, pas de canvas sous 620px, 0,0% de processeur
onglet cache, retrait silencieux en cas d'echec.

### Logos : vectoriels, et enfin les bons

Le theme clair n'affichait pas le meme logo que le theme sombre :
PANW_BIG.D.png est un lockup horizontal (ratio 5,44), PANW.png un
lockup carre (ratio 1,39). En clair, le logo apparaissait ecrase.

Les deux PNG se chargeaient par ailleurs sur **chaque page** alors
qu'un seul est visible a la fois, l'autre etant en display:none.

Remplaces par les SVG officiels du pack de marque (Negative pour le
sombre, Positive pour le clair), 5,7 Ko chacun. L'accueil passe de
**275 Ko a 172 Ko**. PANW_BIG.D.png, PANW.png et logo-paloalto.svg
(une approximation dessinee a la main, jamais utilisee) sont supprimes.

## Session 10 - 20 aout 2026 : fond anime, profondeur

### Fond anime : un maillage reseau, pas un degrade

`bg.js` dessine une topologie sur un canvas place sous le contenu :
des noeuds qui derivent lentement, des liens qui apparaissent quand
deux noeuds se rapprochent, et des paquets qui parcourent ces liens.

Le choix n'est pas gratuit. Un degrade decoratif avait ete retire en
session 6 comme « AI slop », et le remettre aurait refait la meme
erreur. Un maillage reseau **represente le sujet de l'outil** : sur un
dimensionneur de firewall, c'est une illustration, pas un ornement.

Quatre garde-fous, verifies et non supposes :

| Situation | Comportement | Mesure |
| --- | --- | --- |
| `prefers-reduced-motion` | canvas jamais cree | verifie |
| Ecran < 620px | canvas jamais cree | verifie |
| Onglet en arriere-plan | rendu arrete | 0,0% processeur sur 2,5 s |
| Marche normale | 30 images/s plafonnees | 3,2% d'un coeur |

Le canvas est masque la ou le texte se lit : plein en haut a droite,
absent derriere la colonne de contenu. Sur les pages denses
(`data-bg="calme"` : comparateur, etabli, optiques, accessoires,
recherche, wizard) il ne vit que dans la bande haute, avec moins de
noeuds et une opacite reduite. La matrice de comparaison n'est pas
touchee du tout : un fond ne doit jamais concurrencer une colonne de
chiffres.

Si le canvas echoue, il est retire et la page est simplement posee sur
son fond : un decor ne doit avoir aucune consequence.

### Profondeur

Trois procedes, tous a 1px ou en ombre tres basse, aucun n'ajoute de
couleur. Une interface dense se modernise par la lumiere, pas par la
saturation.

- **Filet superieur en degrade** sur les cartes et le bandeau de
  chiffres : un pixel de blanc a 7% decolle une surface de son fond.
  C'est ce qui separe une carte posee d'un rectangle.
- **Ombre a deux etages** : une courte et serree pour le contact, une
  longue et tres diffuse pour la masse. Une ombre unique et large fait
  « autocollant ».
- **Jauge avec matiere** : degrade vers le haut et lueur de la meme
  teinte sous la barre. La valeur se lit toujours au chiffre.

Les separateurs du bandeau de chiffres passent en degrade : ils
separent sans decouper le bandeau en quatre.

## Session 9 - 20 aout 2026 : emojis caches, vignettes detourees, mouvement

### 80 emojis invisibles a trois passes de nettoyage

Le site en contenait encore 80, sous forme d'**entites HTML numeriques**
(`&#128274;` pour un cadenas). Le fichier ne contenait alors que des
chiffres ASCII : aucune recherche de caractere ne pouvait les voir, et
le navigateur affichait pourtant bien un emoji. Ils ont survecu a trois
passes de nettoyage avant d'etre reperes a l'ecran, sur la page SASE.

`_check.js` **decode desormais les entites avant de balayer**. Les 80
sont remplaces par des SVG traces, cartes de `prisma.html` comprises
(lien, agence, cadenas, cloud, siege, poste de travail, formation,
documentation, echange).

Restent 14 fleches typographiques signalees mais **volontairement
conservees** : elles vivent dans du texte courant (`MTTR jours ->
secondes`) ou dans des `<option>`, ou un SVG est techniquement
impossible. Le controle les note sans bloquer.

### Vignettes materiel : fond blanc retire

Les 101 visuels etaient des PNG **sans canal alpha, sur fond blanc
plein** : sur le theme sombre, chaque boitier apparaissait dans un
rectangle blanc.

`tools/detour.js` rend le fond transparent par **diffusion depuis les
bords**, et non par simple seuil : un boitier PA-Series porte des
serigraphies et des LED blanches qu'un seuil global aurait percees.
Seul le blanc relie au bord est du fond. Les seuils ont ete resserres
apres un premier essai : a 200 de luminance, les chassis gris argent
etaient manges.

`tools/recadre.js` recadre ensuite sur l'appareil. Les decoupages de la
planche Visio avaient emporte la legende du boitier voisin : **234
fragments de texte parasites** flottaient au-dessus des appareils une
fois le fond transparent. La recherche de composantes connexes les
distingue du chassis, en gardant les parties legitimement detachees
(antennes d'un PA-415-5G, modules d'un PA-7000).

**Cinq fichiers etaient irrecuperables** et ont ete supprimes :
`pa-5410`, `pa-5420`, `pa-5430`, `pa-5440`, `pa-7080`. Ils ne
contenaient pas d'appareil mais un fragment de legende **decale d'une
position** : `pa-5410.png` montrait le texte « PA-3440 »,
`pa-5420.png` « PA-5410 », `pa-5430.png` « PA-5420 ». Le decoupage de
la planche a glisse d'un cran. Le comparateur affiche ces colonnes sans
vignette, ce que `chassis()` prevoyait deja.

### Mouvement, deuxieme passe

Cartes outil et cartes pilier de l'accueil : levee de 4px, filet
d'accent qui se trace, fleche qui part, pictogramme qui respire. Trois
signaux pour un seul geste, sans qu'aucun texte ne bouge. Filtres du
comparateur et colonnes de modele repondent au survol. L'entree en
cascade est etendue a six pages produit.

Toujours la meme courbe unique, toujours `transform` et `opacity`
seuls, toujours neutralise sous `prefers-reduced-motion`.

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

Le paragraphe defensif qui enumerait ce que le site ne fait pas
disparait au profit d'une ligne qui enonce le contrat de
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
- feat(data): pa-optics.js et pa-accessories.js generes depuis les references officielles Palo Alto par _extract_hw.py. Champs retenus, conformement a la regle du projet : SKU, description et attributs techniques uniquement.
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
