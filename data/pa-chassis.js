/* Photos de facade des PA-Series, extraites des datasheets officielles
   Palo Alto (premiere page, photo legendee du modele). Genere par
   tools/photos.js : ne pas editer a la main. Provenance de chaque
   image : img/SOURCES.md.

   w / h : taille du WebP en pixels. view : face, ou trois-quarts quand
   la datasheet ne montre le boitier qu en perspective (chassis,
   boitiers durcis). ds : datasheet source. Un modele absent n a pas
   de photo de facade publiee : l interface dessine un plastron. */

const PA_CHASSIS = {
 "pa-410": {
  "label": "PA-410",
  "img": "img/front/pa-410.webp",
  "w": 720,
  "h": 147,
  "view": "face",
  "ds": "pa-400-series"
 },
 "pa-415": {
  "label": "PA-415",
  "img": "img/front/pa-415.webp",
  "w": 703,
  "h": 106,
  "view": "face",
  "ds": "pa-400-series"
 },
 "pa-415-5g": {
  "label": "PA-415-5G",
  "img": "img/front/pa-415-5g.webp",
  "w": 588,
  "h": 400,
  "view": "face",
  "ds": "pa-400-series"
 },
 "pa-440": {
  "label": "PA-440",
  "img": "img/front/pa-440.webp",
  "w": 476,
  "h": 111,
  "view": "face",
  "ds": "pa-400-series"
 },
 "pa-445": {
  "label": "PA-445",
  "img": "img/front/pa-445.webp",
  "w": 720,
  "h": 100,
  "view": "face",
  "ds": "pa-400-series"
 },
 "pa-450": {
  "label": "PA-450",
  "img": "img/front/pa-450.webp",
  "w": 475,
  "h": 110,
  "view": "face",
  "ds": "pa-400-series"
 },
 "pa-455": {
  "label": "PA-455",
  "img": "img/front/pa-455.webp",
  "w": 720,
  "h": 94,
  "view": "face",
  "ds": "pa-400-series"
 },
 "pa-455-5g": {
  "label": "PA-455-5G",
  "img": "img/front/pa-455-5g.webp",
  "w": 650,
  "h": 102,
  "view": "face",
  "ds": "pa-400-series"
 },
 "pa-460": {
  "label": "PA-460",
  "img": "img/front/pa-460.webp",
  "w": 474,
  "h": 110,
  "view": "face",
  "ds": "pa-400-series"
 },
 "pa-501": {
  "label": "PA-501",
  "img": "img/front/pa-501.webp",
  "w": 417,
  "h": 86,
  "view": "face",
  "ds": "pa-500-series"
 },
 "pa-505": {
  "label": "PA-505",
  "img": "img/front/pa-505.webp",
  "w": 433,
  "h": 89,
  "view": "face",
  "ds": "pa-500-series"
 },
 "pa-510": {
  "label": "PA-510",
  "img": "img/front/pa-510.webp",
  "w": 427,
  "h": 101,
  "view": "face",
  "ds": "pa-500-series"
 },
 "pa-520": {
  "label": "PA-520",
  "img": "img/front/pa-520.webp",
  "w": 431,
  "h": 100,
  "view": "face",
  "ds": "pa-500-series"
 },
 "pa-520-5g": {
  "label": "PA-520-5G",
  "img": "img/front/pa-520-5g.webp",
  "w": 291,
  "h": 331,
  "view": "face",
  "ds": "pa-500-series"
 },
 "pa-540": {
  "label": "PA-540",
  "img": "img/front/pa-540.webp",
  "w": 421,
  "h": 99,
  "view": "face",
  "ds": "pa-500-series"
 },
 "pa-545-poe": {
  "label": "PA-545-POE",
  "img": "img/front/pa-545-poe.webp",
  "w": 659,
  "h": 77,
  "view": "face",
  "ds": "pa-500-series"
 },
 "pa-550": {
  "label": "PA-550",
  "img": "img/front/pa-550.webp",
  "w": 661,
  "h": 95,
  "view": "face",
  "ds": "pa-500-series"
 },
 "pa-555-poe": {
  "label": "PA-555-POE",
  "img": "img/front/pa-555-poe.webp",
  "w": 659,
  "h": 77,
  "view": "face",
  "ds": "pa-500-series"
 },
 "pa-560": {
  "label": "PA-560",
  "img": "img/front/pa-560.webp",
  "w": 661,
  "h": 93,
  "view": "face",
  "ds": "pa-500-series"
 },
 "pa-850": {
  "label": "PA-850",
  "img": "img/front/pa-850.webp",
  "w": 720,
  "h": 121,
  "view": "face",
  "ds": "pa-800-series-datasheet"
 },
 "pa-1410": {
  "label": "PA-1410",
  "img": "img/front/pa-1410.webp",
  "w": 720,
  "h": 114,
  "view": "face",
  "ds": "pa-1400-series"
 },
 "pa-1420": {
  "label": "PA-1420",
  "img": "img/front/pa-1420.webp",
  "w": 720,
  "h": 114,
  "view": "face",
  "ds": "pa-1400-series"
 },
 "pa-1510-poe": {
  "label": "PA-1510-POE",
  "img": "img/front/pa-1510-poe.webp",
  "w": 720,
  "h": 110,
  "view": "face",
  "ds": "pa-1500-series"
 },
 "pa-1520-poe": {
  "label": "PA-1520-POE",
  "img": "img/front/pa-1520-poe.webp",
  "w": 720,
  "h": 110,
  "view": "face",
  "ds": "pa-1500-series"
 },
 "pa-1530-poe": {
  "label": "PA-1530-POE",
  "img": "img/front/pa-1530-poe.webp",
  "w": 720,
  "h": 110,
  "view": "face",
  "ds": "pa-1500-series"
 },
 "pa-3410": {
  "label": "PA-3410",
  "img": "img/front/pa-3410.webp",
  "w": 720,
  "h": 113,
  "view": "face",
  "ds": "pa-3400-series"
 },
 "pa-3420": {
  "label": "PA-3420",
  "img": "img/front/pa-3420.webp",
  "w": 720,
  "h": 113,
  "view": "face",
  "ds": "pa-3400-series"
 },
 "pa-3430": {
  "label": "PA-3430",
  "img": "img/front/pa-3430.webp",
  "w": 720,
  "h": 112,
  "view": "face",
  "ds": "pa-3400-series"
 },
 "pa-3440": {
  "label": "PA-3440",
  "img": "img/front/pa-3440.webp",
  "w": 720,
  "h": 112,
  "view": "face",
  "ds": "pa-3400-series"
 },
 "pa-3510": {
  "label": "PA-3510",
  "img": "img/front/pa-3510.webp",
  "w": 720,
  "h": 108,
  "view": "face",
  "ds": "pa-3500-series"
 },
 "pa-3520": {
  "label": "PA-3520",
  "img": "img/front/pa-3520.webp",
  "w": 720,
  "h": 108,
  "view": "face",
  "ds": "pa-3500-series"
 },
 "pa-3530": {
  "label": "PA-3530",
  "img": "img/front/pa-3530.webp",
  "w": 720,
  "h": 182,
  "view": "face",
  "ds": "pa-3500-series"
 },
 "pa-3540": {
  "label": "PA-3540",
  "img": "img/front/pa-3540.webp",
  "w": 720,
  "h": 182,
  "view": "face",
  "ds": "pa-3500-series"
 },
 "pa-5410": {
  "label": "PA-5410",
  "img": "img/front/pa-5410.webp",
  "w": 717,
  "h": 192,
  "view": "face",
  "ds": "pa-5400-series"
 },
 "pa-5420": {
  "label": "PA-5420",
  "img": "img/front/pa-5420.webp",
  "w": 717,
  "h": 192,
  "view": "face",
  "ds": "pa-5400-series"
 },
 "pa-5430": {
  "label": "PA-5430",
  "img": "img/front/pa-5430.webp",
  "w": 717,
  "h": 192,
  "view": "face",
  "ds": "pa-5400-series"
 },
 "pa-5440": {
  "label": "PA-5440",
  "img": "img/front/pa-5440.webp",
  "w": 717,
  "h": 192,
  "view": "face",
  "ds": "pa-5400-series"
 },
 "pa-5445": {
  "label": "PA-5445",
  "img": "img/front/pa-5445.webp",
  "w": 717,
  "h": 192,
  "view": "face",
  "ds": "pa-5400-series"
 },
 "pa-5510": {
  "label": "PA-5510",
  "img": "img/front/pa-5510.webp",
  "w": 665,
  "h": 144,
  "view": "face",
  "ds": "pa-5500-series"
 },
 "pa-5520": {
  "label": "PA-5520",
  "img": "img/front/pa-5520.webp",
  "w": 664,
  "h": 144,
  "view": "face",
  "ds": "pa-5500-series"
 },
 "pa-5530": {
  "label": "PA-5530",
  "img": "img/front/pa-5530.webp",
  "w": 670,
  "h": 145,
  "view": "face",
  "ds": "pa-5500-series"
 },
 "pa-5540": {
  "label": "PA-5540",
  "img": "img/front/pa-5540.webp",
  "w": 663,
  "h": 208,
  "view": "face",
  "ds": "pa-5500-series"
 },
 "pa-5550": {
  "label": "PA-5550",
  "img": "img/front/pa-5550.webp",
  "w": 661,
  "h": 207,
  "view": "face",
  "ds": "pa-5500-series"
 },
 "pa-5560": {
  "label": "PA-5560",
  "img": "img/front/pa-5560.webp",
  "w": 667,
  "h": 210,
  "view": "face",
  "ds": "pa-5500-series"
 },
 "pa-5570": {
  "label": "PA-5570",
  "img": "img/front/pa-5570.webp",
  "w": 658,
  "h": 208,
  "view": "face",
  "ds": "pa-5500-series"
 },
 "pa-5580": {
  "label": "PA-5580",
  "img": "img/front/pa-5580.webp",
  "w": 658,
  "h": 208,
  "view": "face",
  "ds": "pa-5500-series"
 },
 "pa-7050": {
  "label": "PA-7050",
  "img": "img/front/pa-7050.webp",
  "w": 439,
  "h": 400,
  "view": "trois-quarts",
  "ds": "pa-7000-series"
 },
 "pa-7080": {
  "label": "PA-7080",
  "img": "img/front/pa-7080.webp",
  "w": 223,
  "h": 400,
  "view": "trois-quarts",
  "ds": "pa-7000-series"
 },
 "pa-7500": {
  "label": "PA-7500",
  "img": "img/front/pa-7500.webp",
  "w": 312,
  "h": 400,
  "view": "trois-quarts",
  "ds": "pa-7500"
 },
 "pa-410r": {
  "label": "PA-410R",
  "img": "img/front/pa-410r.webp",
  "w": 343,
  "h": 176,
  "view": "trois-quarts",
  "ds": "pa-400r-series"
 },
 "pa-410r-5g": {
  "label": "PA-410R-5G",
  "img": "img/front/pa-410r-5g.webp",
  "w": 720,
  "h": 213,
  "view": "trois-quarts",
  "ds": "pa-400r-series"
 },
 "pa-450r": {
  "label": "PA-450R",
  "img": "img/front/pa-450r.webp",
  "w": 705,
  "h": 92,
  "view": "face",
  "ds": "pa-400r-series"
 },
 "pa-450r-5g": {
  "label": "PA-450R-5G",
  "img": "img/front/pa-450r-5g.webp",
  "w": 680,
  "h": 400,
  "view": "face",
  "ds": "pa-400r-series"
 },
 "pa-455r-5g": {
  "label": "PA-455R-5G",
  "img": "img/front/pa-455r-5g.webp",
  "w": 493,
  "h": 291,
  "view": "trois-quarts",
  "ds": "pa-400r-series"
 },
 "pa-52r-5g": {
  "label": "PA-52R-5G",
  "img": "img/front/pa-52r-5g.webp",
  "w": 653,
  "h": 189,
  "view": "face",
  "ds": "pa-50r-series"
 },
 "pa-54r-poe-d-5g": {
  "label": "PA-54R-POE-D-5G",
  "img": "img/front/pa-54r-poe-d-5g.webp",
  "w": 460,
  "h": 400,
  "view": "face",
  "ds": "pa-50r-series"
 },
 "pa-56r-poe-5g": {
  "label": "PA-56R-POE-5G",
  "img": "img/front/pa-56r-poe-5g.webp",
  "w": 720,
  "h": 175,
  "view": "face",
  "ds": "pa-50r-series"
 }
};
