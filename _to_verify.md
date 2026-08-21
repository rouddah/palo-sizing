# Points a confirmer a la source

> Ce fichier ne liste que ce qui est **volontairement en attente** : une
> valeur qu'aucune datasheet ne publie, une contradiction interne a un
> document officiel, un arbitrage editorial non tranche. Une valeur
> fausse ne se met pas ici, elle se corrige.
>
> Releve du 21 aout 2026, apres relecture des douze datasheets PA-Series.

## Valeurs portees TBD par les datasheets d'aout 2026

Ces champs sont **nuls** dans `data/pa-models.js` et s'affichent en tiret
sur tout le site. Ils ne sont pas estimes : sur un outil de
dimensionnement, un chiffre invente est pire qu'un trou.

| Serie | Champ | Etat |
| --- | --- | --- |
| PA-3500, les quatre modeles | debit VPN IPsec | TBD dans la datasheet |
| PA-3500, les quatre modeles | nouvelles sessions/s (CPS) | TBD dans la datasheet |
| PA-5510, PA-5520, PA-5530 | debit VPN IPsec | TBD dans la datasheet |
| PA-5510, PA-5520, PA-5530 | nouvelles sessions/s (CPS) | TBD dans la datasheet |

Consequence dans l'etabli de dimensionnement : une metrique non publiee
ne peut ni valider ni disqualifier un modele. Elle sort du calcul, et le
volet de recommandation affiche un encart qui nomme le trou. A reprendre
des que Palo Alto publie les chiffres.

## References chassis : quinze modeles sans SKU

Controle fait contre le catalogue courant, le 21 aout 2026. Le champ
`sku` est nul partout ou la reference n'existe pas encore.

**Confirme au catalogue** : PA-501 porte bien `PAN-PA-501`, et les
PA-5540 a PA-5580 leurs references `-AC` / `-DC`.

**Annonce mais pas encore commandable**, donc `sku` nul : les trois
PA-1500, les quatre PA-3500, les PA-5510 a PA-5530, le PA-520-5G et les
quatre PA-50R. Ces references avaient d'abord ete deduites du motif des
series precedentes ; c'est exactement ce que la regle interdit, elles ont
ete retirees.

A reprendre a chaque nouveau catalogue : un modele qui obtient sa
reference doit la voir apparaitre ici.

## PA-50R : nom du troisieme modele

La datasheet se contredit d'une table a l'autre :

- Table 1, performances : le modele est nomme **PA-54R-POE-5G**
- Table 4, materiel : il est nomme **PA-54R-POE** et porte « N/A » dans
  la colonne cellulaire

Le site retient **PA-54R-POE**, sans 5G : c'est la table materielle qui
decrit les interfaces, et elle est explicite sur l'absence de modem. A
confirmer aupres de Palo Alto.

## PA-400R : serie absente du site

Le catalogue courant contient PA-410R, PA-450R, PA-410R-5G, PA-450R-5G et
PA-455R-5G, la gamme durcie de generation precedente. Le site ne les
porte pas, et la datasheet PA-400 ne publie pas leurs performances. A
arbitrer : les ajouter demande une source chiffree.

## PA-50R : budget PoE

Trois des quatre modeles annoncent PoE. La datasheet donne la
consommation maximale du boitier (225,1 W) mais pas le budget PoE
disponible. Le champ `poeW` reste nul.

## PA-1400 : statut de commercialisation

La page End of Life de Palo Alto comporte une entree PA-1400, mais elle
voisine des lignes ION (Prisma SD-WAN) et les dates lues ne collent pas
avec une serie encore mise en avant. La serie est donc laissee **active**
sur le site. A verifier sur la matrice EoL officielle avant d'y poser un
drapeau EoS.

## Capacites de configuration

Zones, politiques, tunnels IPsec site-a-site, sessions de dechiffrement,
objets adresses, regles NAT, profils de securite : **les datasheets 2026
ne les publient plus**. Elles ne sont renseignees que sur les modeles
pour lesquels une edition anterieure les donnait. Les series ajoutees en
aout 2026 les portent a nul, et le comparateur affiche un tiret.

## PA-800 et PA-7000 : datasheets retirees

Les deux series sont End of Sale et leurs datasheets ne sont plus
publiees. Leurs valeurs viennent des editions anterieures et n'ont pas pu
etre recontrolees a la source. Elles restent affichees avec leur drapeau
EoS et leur date de fin de vie.

## PA-500 : systemes virtuels du bas de gamme

La datasheet PA-500 ecrit « -- » en systemes virtuels pour PA-501,
PA-505, PA-510 et PA-520, la ou celle du PA-400 ecrit « 1/1 » pour ses
propres entrees de gamme. Le site suit la datasheet et n'affiche rien
pour ces quatre modeles. Si la distinction n'est qu'une coquetterie de
mise en page chez Palo Alto, il faudra remettre « 1 / 1 ».

## PA-50R hors du moteur de recommandation

La gamme durcie est presente dans le comparateur et dans la recherche,
mais elle ne figure pas dans les series que l'etabli de dimensionnement
peut recommander : un profil de bureau ne se dimensionne pas sur un
boitier OT. Arbitrage editorial, a revoir si le site couvre un jour
l'industriel pour lui-meme.

## Chiffres produit non confirmes a la source

Releve du 21 aout 2026. Ces valeurs sont affichees sur les pages produit
mais je n'ai pas trouve de document officiel qui les porte. A confirmer
ou a retirer.

| Page | Valeur | Etat |
| --- | --- | --- |
| prisma | 66 000+ apps SaaS, 25+ integrations API | non retrouve |
| prisma | 600+ applications GenAI | non retrouve |
| prisma | 1 000+ classificateurs DLP, 22 profils reglementaires | non retrouve |
| prisma | 85+ categories PAN-DB | non retrouve |
| prisma | 3 600+ attributs Device-ID | non retrouve |
| prisma | SKU des add-ons Mobile Users et Remote Networks | non recontroles |
| cortex | 15 PB/jour d'ingestion | non retrouve |
| cortex | 1,2 milliard d'executions de playbooks | non retrouve |
| cortex | MITRE ATT&CK Turla 2024, 100% bloque | non retrouve |
| panorama | 16 500 / 25 000 / 36 500 logs/s en mode mixte | non retrouve |
| panorama | 4 TB / 24 TB / 48 TB de stockage local | le catalogue donne 16 TB en configuration de base |

**Confirme en revanche**, et laisse tel quel : les editions Prisma
Browser Education, Core et Pro, dont les references figurent au
catalogue, Pro etant la seule a inclure l'acces aux applications privees.

## pa-series.html : CN-Series et AI Runtime Security

La page mentionne peut-etre encore CN-Series sans signaler la transition
vers AI Runtime Security (Prisma AIRS 2.0, oct. 2025). A verifier lors
d'une prochaine passe sur la page.

## Jeu de pictogrammes officiel - resolu le 20 aout 2026

458 pictogrammes convertis du DrawingML vers SVG, neuf employes par le
site. Le convertisseur vit dans `tools/icons/`.

Mesure a retenir : le jeu officiel est dessine pour la projection. En
dessous de 20 px ses traits les plus fins disparaissent. Les affordances
d'interface (coche, croix, chevron, fleche) restent donc une geometrie au
trait, dessinee pour ces tailles-la.

## IoT Security vers Device Security - resolu

La transition est appliquee partout : plus aucune occurrence d'« IoT
Security » dans les pages ni dans les scripts.
