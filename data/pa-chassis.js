/* Visuels de boitiers, decoupes dans le stencil Visio officiel Palo Alto
   (panw-visio-index-sheet.pdf). Fichiers dans img/hw/.

   Fond blanc rendu transparent et recadrage sur l'appareil : voir
   tools/detour.js et tools/recadre.js.

   Cinq references ont ete retirees le 20 aout 2026 : leurs fichiers ne
   contenaient pas d'appareil mais un fragment de legende decale d'une
   position (pa-5410.png montrait le texte « PA-3440 », pa-5420.png
   « PA-5410 », etc.). Le comparateur affiche ces colonnes sans
   vignette, ce que chassis() prevoit. A regenerer depuis la planche
   Visio si les visuels redeviennent disponibles. */

const PA_CHASSIS = {
"pa-410r": {
"label": "PA-410R",
"img": "img/hw/pa-410r.png",
"page": 1
},
"pa-410r-5g": {
"label": "PA-410R-5G",
"img": "img/hw/pa-410r-5g.png",
"page": 1
},
"pa-450r-5g": {
"label": "PA-450R-5G",
"img": "img/hw/pa-450r-5g.png",
"page": 1
},
"pa-455-5g": {
"label": "PA-455-5G",
"img": "img/hw/pa-455-5g.png",
"page": 1
},
"pa-455r-5g": {
"label": "PA-455R-5G",
"img": "img/hw/pa-455r-5g.png",
"page": 1
},
"pa-505": {
"label": "PA-505",
"img": "img/hw/pa-505.png",
"page": 1
},
"pa-510": {
"label": "PA-510",
"img": "img/hw/pa-510.png",
"page": 1
},
"pa-520": {
"label": "PA-520",
"img": "img/hw/pa-520.png",
"page": 1
},
"pa-540": {
"label": "PA-540",
"img": "img/hw/pa-540.png",
"page": 1
},
"pa-545-poe": {
"label": "PA-545-POE",
"img": "img/hw/pa-545-poe.png",
"page": 1
},
"pa-550": {
"label": "PA-550",
"img": "img/hw/pa-550.png",
"page": 1
},
"pa-5540": {
"label": "PA-5540",
"img": "img/hw/pa-5540.png",
"page": 1
},
"pa-5550": {
"label": "PA-5550",
"img": "img/hw/pa-5550.png",
"page": 1
},
"pa-555-poe": {
"label": "PA-555-POE",
"img": "img/hw/pa-555-poe.png",
"page": 1
},
"pa-5560": {
"label": "PA-5560",
"img": "img/hw/pa-5560.png",
"page": 1
},
"pa-5570": {
"label": "PA-5570",
"img": "img/hw/pa-5570.png",
"page": 1
},
"pa-5580": {
"label": "PA-5580",
"img": "img/hw/pa-5580.png",
"page": 1
},
"pa-560": {
"label": "PA-560",
"img": "img/hw/pa-560.png",
"page": 1
},
"pa-415-5g": {
"label": "PA-415-5G",
"img": "img/hw/pa-415-5g.png",
"page": 3
},
"pa-450r": {
"label": "PA-450R",
"img": "img/hw/pa-450r.png",
"page": 3
},
"pa-455": {
"label": "PA-455",
"img": "img/hw/pa-455.png",
"page": 3
},
"pa-5445": {
"label": "PA-5445",
"img": "img/hw/pa-5445.png",
"page": 3
},
"pa-7500": {
"label": "PA-7500",
"img": "img/hw/pa-7500.png",
"page": 3
},
"pa-7500-sfc-a": {
"label": "PA-7500-SFC-A",
"img": "img/hw/pa-7500-sfc-a.png",
"page": 3
},
"pa-7500-dpc-a": {
"label": "PA-7500-DPC-A",
"img": "img/hw/pa-7500-dpc-a.png",
"page": 3
},
"pa-7500-mpc-a": {
"label": "PA-7500-MPC-A",
"img": "img/hw/pa-7500-mpc-a.png",
"page": 3
},
"pa-7500-npc-a": {
"label": "PA-7500-NPC-A",
"img": "img/hw/pa-7500-npc-a.png",
"page": 3
},
"pa-1410": {
"label": "PA-1410",
"img": "img/hw/pa-1410.png",
"page": 4
},
"pa-1420": {
"label": "PA-1420",
"img": "img/hw/pa-1420.png",
"page": 4
},
"pa-415": {
"label": "PA-415",
"img": "img/hw/pa-415.png",
"page": 4
},
"pa-445": {
"label": "PA-445",
"img": "img/hw/pa-445.png",
"page": 4
},
"m-300": {
"label": "M-300",
"img": "img/hw/m-300.png",
"page": 5
},
"m-700": {
"label": "M-700",
"img": "img/hw/m-700.png",
"page": 5
},
"pa-3410": {
"label": "PA-3410",
"img": "img/hw/pa-3410.png",
"page": 5
},
"pa-3420": {
"label": "PA-3420",
"img": "img/hw/pa-3420.png",
"page": 5
},
"pa-3430": {
"label": "PA-3430",
"img": "img/hw/pa-3430.png",
"page": 5
},
"pa-3440": {
"label": "PA-3440",
"img": "img/hw/pa-3440.png",
"page": 5
},
"pa-5450-ac-ps": {
"label": "PA-5450 AC PS",
"img": "img/hw/pa-5450-ac-ps.png",
"page": 6
},
"pa-5450-dc-ps": {
"label": "PA-5450 DC PS",
"img": "img/hw/pa-5450-dc-ps.png",
"page": 6
},
"pa-440": {
"label": "PA-440",
"img": "img/hw/pa-440.png",
"page": 7
},
"pa-450": {
"label": "PA-450",
"img": "img/hw/pa-450.png",
"page": 7
},
"pa-460": {
"label": "PA-460",
"img": "img/hw/pa-460.png",
"page": 7
},
"pa-5400-blank": {
"label": "PA-5400 BLANK",
"img": "img/hw/pa-5400-blank.png",
"page": 7
},
"pa-5450": {
"label": "PA-5450",
"img": "img/hw/pa-5450.png",
"page": 7
},
"pan-pa-5400-dpc-a": {
"label": "PAN-PA-5400-DPC-A",
"img": "img/hw/pan-pa-5400-dpc-a.png",
"page": 7
},
"pan-pa-5400-mpc-a": {
"label": "PAN-PA-5400-MPC-A",
"img": "img/hw/pan-pa-5400-mpc-a.png",
"page": 7
},
"pan-pa-5400-nc-a": {
"label": "PAN-PA-5400-NC-A",
"img": "img/hw/pan-pa-5400-nc-a.png",
"page": 7
},
"pa-410": {
"label": "PA-410",
"img": "img/hw/pa-410.png",
"page": 7
},
"pan-pa-7000-100g-npc-a": {
"label": "PAN-PA-7000-100G-NPC-A",
"img": "img/hw/pan-pa-7000-100g-npc-a.png",
"page": 8
},
"pan-pa-7000-lfc-a": {
"label": "PAN-PA-7000-LFC-A",
"img": "img/hw/pan-pa-7000-lfc-a.png",
"page": 8
},
"pan-pa-7050-smc-b": {
"label": "PAN-PA-7050-SMC-B",
"img": "img/hw/pan-pa-7050-smc-b.png",
"page": 8
},
"pan-pa-7080-smc-b": {
"label": "PAN-PA-7080-SMC-B",
"img": "img/hw/pan-pa-7080-smc-b.png",
"page": 8
},
"pan-pa-7000-dpc-a": {
"label": "PAN-PA-7000-DPC-A",
"img": "img/hw/pan-pa-7000-dpc-a.png",
"page": 8
},
"m-200": {
"label": "M-200",
"img": "img/hw/m-200.png",
"page": 9
},
"m-600": {
"label": "M-600",
"img": "img/hw/m-600.png",
"page": 9
},
"pa-220r": {
"label": "PA-220R",
"img": "img/hw/pa-220r.png",
"page": 9
},
"pa-3220": {
"label": "PA-3220",
"img": "img/hw/pa-3220.png",
"page": 9
},
"pa-3250": {
"label": "PA-3250",
"img": "img/hw/pa-3250.png",
"page": 9
},
"pa-3260": {
"label": "PA-3260",
"img": "img/hw/pa-3260.png",
"page": 9
},
"pa-5280": {
"label": "PA-5280",
"img": "img/hw/pa-5280.png",
"page": 9
},
"gp-100": {
"label": "GP-100",
"img": "img/hw/gp-100.png",
"page": 10
},
"m-100": {
"label": "M-100",
"img": "img/hw/m-100.png",
"page": 10
},
"m-500": {
"label": "M-500",
"img": "img/hw/m-500.png",
"page": 10
},
"pa-200": {
"label": "PA-200",
"img": "img/hw/pa-200.png",
"page": 10
},
"pa-2020": {
"label": "PA-2020",
"img": "img/hw/pa-2020.png",
"page": 10
},
"pa-2050": {
"label": "PA-2050",
"img": "img/hw/pa-2050.png",
"page": 10
},
"pa-3020": {
"label": "PA-3020",
"img": "img/hw/pa-3020.png",
"page": 10
},
"pa-3050": {
"label": "PA-3050",
"img": "img/hw/pa-3050.png",
"page": 10
},
"pa-3060": {
"label": "PA-3060",
"img": "img/hw/pa-3060.png",
"page": 10
},
"pa-4020": {
"label": "PA-4020",
"img": "img/hw/pa-4020.png",
"page": 10
},
"pa-4050": {
"label": "PA-4050",
"img": "img/hw/pa-4050.png",
"page": 10
},
"pa-4060": {
"label": "PA-4060",
"img": "img/hw/pa-4060.png",
"page": 10
},
"pa-500": {
"label": "PA-500",
"img": "img/hw/pa-500.png",
"page": 10
},
"pa-5020": {
"label": "PA-5020",
"img": "img/hw/pa-5020.png",
"page": 10
},
"pa-5050": {
"label": "PA-5050",
"img": "img/hw/pa-5050.png",
"page": 10
},
"pa-5060": {
"label": "PA-5060",
"img": "img/hw/pa-5060.png",
"page": 10
},
"pa-7000-20g-npc": {
"label": "PA-7000-20G-NPC",
"img": "img/hw/pa-7000-20g-npc.png",
"page": 10
},
"pa-7000-2ogq-npc": {
"label": "PA-7000-2OGQ-NPC",
"img": "img/hw/pa-7000-2ogq-npc.png",
"page": 10
},
"pa-7000-20gq-npc": {
"label": "PA-7000-20GQ-NPC",
"img": "img/hw/pa-7000-20gq-npc.png",
"page": 10
},
"pa-7000-lpc": {
"label": "PA-7000-LPC",
"img": "img/hw/pa-7000-lpc.png",
"page": 10
},
"pa-7050": {
"label": "PA-7050",
"img": "img/hw/pa-7050.png",
"page": 10
},
"pa-7000-smc": {
"label": "PA-7000-SMC",
"img": "img/hw/pa-7000-smc.png",
"page": 10
},
"pa-7050-smc": {
"label": "PA-7050-SMC",
"img": "img/hw/pa-7050-smc.png",
"page": 10
},
"pa-7080-smc": {
"label": "PA-7080-SMC",
"img": "img/hw/pa-7080-smc.png",
"page": 10
},
"pan-airduct": {
"label": "PAN-AIRDUCT",
"img": "img/hw/pan-airduct.png",
"page": 10
},
"wf-500": {
"label": "WF-500",
"img": "img/hw/wf-500.png",
"page": 10
},
"pa-7000-blnk": {
"label": "PA-7000-BLNK",
"img": "img/hw/pa-7000-blnk.png",
"page": 10
},
"pa-7000-blank": {
"label": "PA-7000-Blank",
"img": "img/hw/pa-7000-blank.png",
"page": 10
},
"pa-220": {
"label": "PA-220",
"img": "img/hw/pa-220.png",
"page": 11
},
"pa-5220": {
"label": "PA-5220",
"img": "img/hw/pa-5220.png",
"page": 11
},
"pa-5250": {
"label": "PA-5250",
"img": "img/hw/pa-5250.png",
"page": 11
},
"pa-5260": {
"label": "PA-5260",
"img": "img/hw/pa-5260.png",
"page": 11
},
"pa-820": {
"label": "PA-820",
"img": "img/hw/pa-820.png",
"page": 11
},
"pa-850": {
"label": "PA-850",
"img": "img/hw/pa-850.png",
"page": 11
},
"pa-7050-ac-power-supply": {
"label": "PA-7050 AC Power Supply",
"img": "img/hw/pa-7050-ac-power-supply.png",
"page": 12
},
"pa-7050-dc-power-supply": {
"label": "PA-7050 DC Power Supply",
"img": "img/hw/pa-7050-dc-power-supply.png",
"page": 12
}
};
