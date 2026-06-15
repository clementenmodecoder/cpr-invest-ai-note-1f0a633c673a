/* =========================================================================
   CPR Invest - Artificial Intelligence | note de référence interne
   Moteur de graphique SVG maison (zéro dépendance, fonctionne hors-ligne)
   Charte CPR : #009EE0 / #001C4B / #FFFFFF / #F5F5F5 / #D6EAF7
   ========================================================================= */

/* ---------- Séries (fonds + concurrents) ---------- */
const SERIES = {
  cpram:    {name:"CPR Invest - Artificial Intelligence", short:"CPR Invest - AI", color:"#009EE0", width:3.4, fund:true, on:true},
  allianz:  {name:"Allianz Global Artificial Intelligence", short:"Allianz Global AI", color:"#001C4B", width:1.8, on:false},
  dwa:      {name:"DWA Intelligence Artificielle", short:"DWA Intelligence Artificielle", color:"#8E5BEF", width:1.8, on:false},
  oddo:     {name:"ODDO BHF Artificial Intelligence", short:"ODDO BHF AI", color:"#14B8A6", width:1.8, on:false},
  mirova:   {name:"Mirova Global Thematic AI & Robotics", short:"Mirova AI & Robotics", color:"#F59E0B", width:1.8, on:false},
  echiquier:{name:"Echiquier Artificial Intelligence", short:"Echiquier AI", color:"#D6336C", width:1.8, on:false},
  nvidia:   {name:"NVIDIA (action, pour repère)", short:"NVIDIA (action)", color:"#76B900", width:1.8, on:false, dash:"6 4"},
};
const SERIES_ORDER = ["cpram","allianz","dwa","oddo","mirova","echiquier","nvidia"];

/* ---------- Utilitaires dates / format ---------- */
const DAY = 86400000;
const MONTHS = ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
function parseD(s){const[y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d).getTime();}
function fmtDate(t){const d=new Date(t);return d.getDate()+" "+MONTHS[d.getMonth()]+" "+String(d.getFullYear()).slice(2);}
function fmtMonth(t){const d=new Date(t);return MONTHS[d.getMonth()]+" "+String(d.getFullYear()).slice(2);}
function fmtNum(v,dec){return v.toFixed(dec==null?2:dec).replace(".",",");}

/* ---------- Données -> {t,v} ---------- */
const DATA = {};
for(const k in SERIES){
  DATA[k] = (window.PRICE_DATA[k]||[]).map(p=>({t:parseD(p[0]), v:p[1]})).sort((a,b)=>a.t-b.t);
}
const GLOBAL_START = parseD("2024-10-10");
let GLOBAL_END = 0;
for(const k in DATA){ if(DATA[k].length) GLOBAL_END = Math.max(GLOBAL_END, DATA[k][DATA[k].length-1].t); }
const MIN_SPAN = 45*DAY;            // zoom maximum : fenêtre de ~6 semaines
const FULL_SPAN = GLOBAL_END-GLOBAL_START;
const ZOOM_IN = 0.88, ZOOM_OUT = 1/0.88;   // pas de zoom plus doux

/* ---------- Périodes & épisodes ---------- */
const RANGES = [
  {id:"ytd",      label:"2026 (YTD)",         start:parseD("2025-12-31"), end:GLOBAL_END},
  {id:"1an",      label:"1 an",               start:GLOBAL_END-365*DAY,   end:GLOBAL_END},
  {id:"6m",       label:"6 mois",             start:GLOBAL_END-182*DAY,   end:GLOBAL_END},
  {id:"3m",       label:"3 mois",             start:GLOBAL_END-91*DAY,    end:GLOBAL_END},
  {id:"creation", label:"Historique complet", start:GLOBAL_START,         end:GLOBAL_END},
];
const EPISODES = [
  {id:"deepseek", label:"Choc DeepSeek",    start:parseD("2025-01-06"), end:parseD("2025-03-03")},
  {id:"tarifs",   label:"Guerre tarifaire", start:parseD("2025-03-15"), end:parseD("2025-06-16")},
  {id:"saas",     label:"Correction software 2026", start:parseD("2026-01-02"), end:parseD("2026-03-06")},
  {id:"rally26",  label:"Rebond 2026",      start:parseD("2026-03-20"), end:GLOBAL_END},
];

/* =========================================================================
   ÉVÉNEMENTS VÉRIFIÉS (rattachés à un mouvement réel de la VL)
   short = aperçu (survol) | body = détail complet (clic)
   ========================================================================= */
const EVENTS = [
{ id:1, date:"2024-10-10", cat:"fonds", title:"Création du fonds (base 100)",
  short:"Lancement de CPR Invest - Artificial Intelligence, part I EUR.",
  move:"VL de départ : base 100", moveSign:0,
  holdings:"Portefeuille initial à dominante infrastructures de l'IA (~81 %) : semi-conducteurs, hyperscalers, mémoire.",
  body:`<p>Lancement de <b>CPR Invest - Artificial Intelligence</b> (part I EUR, capitalisation), compartiment de la SICAV luxembourgeoise UCITS CPR Invest, gérée par CPR Asset Management (groupe Amundi). Code ISIN LU2860962476, indice de référence le MSCI ACWI IMI Artificial Intelligence Select Issuer Capped, co-développé avec MSCI.</p><p>L'univers d'investissement (~200 valeurs) est structuré en trois dimensions : infrastructures, facilitateurs et utilisateurs de l'IA. Dès l'origine, le fonds applique deux partis pris : une surpondération marquée des <b>infrastructures</b> et l'absence volontaire de robotique, jugée trop cyclique et trop dépendante du cycle industriel chinois et de l'automobile.</p><p>Toutes les courbes de cette page sont indexées en base 100 pour permettre une comparaison homogène entre le fonds et ses concurrents.</p>`,
  sources:[{l:"Factsheet CPRAM (31/05/2026)",u:"https://cpram.com/fra/fr/institutionnels/products/LU2860962476"}] },

{ id:2, date:"2024-11-06", cat:"macro", title:"Élection de Donald Trump",
  short:"Victoire de Trump : rallye record, baisses d'impôts et dérégulation anticipées.",
  move:"+3,9 % en séance (06/11)", moveSign:1,
  holdings:"Ensemble des valeurs technologiques américaines portées par le regain d'appétit pour le risque.",
  body:`<p>La victoire nette de Donald Trump déclenche le plus fort gain boursier journalier depuis deux ans. Le 6 novembre, le S&P 500 inscrit un record (+2,5 % la veille, sa meilleure séance post-électorale de l'histoire) et le Nasdaq franchit pour la première fois les 19 000 points ; le Dow Jones bondit de plus de 1 500 points.</p><p>Les investisseurs anticipent baisses d'impôts et dérégulation, favorables aux entreprises (banques, technologie). Très exposé aux grandes technologiques américaines, le fonds progresse de +3,9 % dans le sillage de ce «&nbsp;Trump trade&nbsp;».</p>`,
  sources:[{l:"CNBC",u:"https://www.cnbc.com/2024/11/06/stock-market-today-live-updates.html"},{l:"ABC News",u:"https://abcnews.com/Business/trump-trade-election-news-leads-biggest-1-day/story?id=115574588"}] },

{ id:3, date:"2024-12-18", cat:"macro", title:"Réserve fédérale : baisse de taux restrictive",
  short:"Baisse de 25 pb mais perspectives restrictives : les marchés cèdent ~3 %.",
  move:"-3,2 % en séance (18/12)", moveSign:-1,
  holdings:"Correction généralisée des valeurs de croissance, sensibles à la remontée des taux longs.",
  body:`<p>La Réserve fédérale abaisse ses taux directeurs de 25 pb (fourchette 4,25 à 4,50 %) mais son «&nbsp;dot plot&nbsp;» ne prévoit plus que deux baisses en 2025, contre davantage anticipé par le marché. Ce scénario de baisse restrictive surprend : les actions reculent de près de 3 % dans la séance et les taux remontent d'environ 10 pb sur l'ensemble de la courbe.</p><p>Les valeurs de croissance et de duration longue, cœur du portefeuille, sont les plus pénalisées par la remontée des taux. Le mouvement est en grande partie effacé dès le lendemain matin.</p>`,
  sources:[{l:"CNBC",u:"https://www.cnbc.com/2024/12/18/fed-rate-decision-december-2024-.html"},{l:"J.P. Morgan",u:"https://www.jpmorgan.com/insights/outlook/economic-outlook/fed-meeting-december-2024"}] },

{ id:4, date:"2025-01-27", cat:"ia", title:"Choc DeepSeek",
  short:"DeepSeek R1 fait douter du CAPEX IA : NVIDIA -17 %, ~600 Md$ effacés.",
  move:"-4,8 % (24/01 vers 27/01), rebond +3,4 % le 28/01", moveSign:-1,
  holdings:"NVIDIA, Broadcom, TSMC, AMD, SK Hynix : toute la chaîne semi-conducteurs touchée.",
  body:`<p>La start-up chinoise <b>DeepSeek</b> dévoile son modèle R1, open-source, dont elle affirme qu'il atteint des performances comparables aux modèles occidentaux pour un coût d'entraînement très inférieur (environ 6 M$ revendiqués). Le marché s'interroge brutalement sur la pérennité de la demande de puces haut de gamme et sur l'ampleur des investissements des hyperscalers.</p><p>NVIDIA chute de <b>17 % en une séance, soit près de 600 Md$ de capitalisation effacés</b> : la plus forte destruction de valeur en une journée de l'histoire des marchés américains. Les fournisseurs de centres de données dépendants de NVIDIA (Dell, Oracle, Super Micro) cèdent plus de 8 %.</p><p>À dominante infrastructures et semi-conducteurs, le fonds est directement exposé (-4,8 % entre le 24 et le 27 janvier), avant un rebond partiel de +3,4 % dès le 28. Jensen Huang (NVIDIA) estimera ensuite que les investisseurs avaient mal interprété l'événement.</p>`,
  sources:[{l:"CNBC",u:"https://www.cnbc.com/2025/01/27/nvidia-sheds-almost-600-billion-in-market-cap-biggest-drop-ever.html"},{l:"NBC News",u:"https://www.nbcnews.com/business/business-news/nvidia-loses-market-value-chinese-ai-startup-deepseek-debut-rcna189431"}] },

{ id:5, date:"2025-03-06", cat:"macro", title:"Guerre commerciale & correction technologique",
  short:"Tarifs Canada/Mexique/Chine en vigueur le 4 mars : peur de récession, le Nasdaq corrige.",
  move:"≈ -12 % du 28/02 au 10/03 (-4,6 % le 06/03)", moveSign:-1,
  holdings:"Magnificent 7 et semi-conducteurs en repli ; craintes sur la croissance mondiale.",
  body:`<p>Le 4 mars, les droits de douane de 25 % sur le Canada et le Mexique et de 20 % sur la Chine entrent en vigueur, immédiatement suivis de représailles (le Canada vise plus de 100 Md$ de produits américains, la Chine 20 % sur l'agroalimentaire). Le S&P 500 perd 1,2 % ce jour-là, effaçant la quasi-totalité de ses gains accumulés depuis l'élection.</p><p>La crainte d'une guerre commerciale élargie et d'un coup de frein sur la croissance (l'Atlanta Fed évoque alors un risque de contraction du PIB) déclenche une correction des «&nbsp;Magnificent 7&nbsp;» et du Nasdaq. Le fonds recule d'environ 12 % entre le 28 février et le 10 mars, dans le sillage des grandes technologiques.</p>`,
  sources:[{l:"NBC News",u:"https://www.nbcnews.com/business/markets/stock-tumble-second-straight-day-tariffs-take-effect-rcna194681"},{l:"ABC News",u:"https://abcnews.go.com/Business/tariffs-effect/story?id=119380711"}] },

{ id:6, date:"2025-04-03", cat:"macro", title:"« Liberation Day » : krach tarifaire",
  short:"Tarifs réciproques massifs annoncés le 2 avril : effondrement des marchés.",
  move:"-8,0 % le 03/04 ; creux le 08/04 (≈ -29 % depuis le pic)", moveSign:-1,
  holdings:"Choc sur toute la cote ; semis et valeurs émergentes (TSMC, Samsung, SK Hynix) en première ligne.",
  body:`<p>Le 2 avril, l'administration Trump annonce des droits de douane «&nbsp;réciproques&nbsp;» d'une ampleur inédite : 10 % minimum sur l'ensemble des importations, et des taux bien plus élevés sur de nombreux pays (jusqu'à 54 % sur la Chine). L'indice large américain chute d'environ <b>12 % en quelques séances</b>, sa pire correction depuis le Covid, accompagnée de la plus forte hausse du taux à 30 ans sur trois jours depuis 1982.</p><p>Le fonds perd 8 % dès le 3 avril et touche son point bas le <b>8 avril, en repli d'environ 29 % depuis son pic de février</b> : c'est le creux de toute son histoire à ce jour. Les semi-conducteurs et les valeurs des marchés émergents (Taïwan, Corée), surpondérés, sont en première ligne.</p>`,
  sources:[{l:"Wikipedia (Liberation Day tariffs)",u:"https://en.wikipedia.org/wiki/Liberation_Day_tariffs"},{l:"NTU (Tariff Timeline)",u:"https://www.ntu.org/publications/detail/liberation-day-tariff-timeline"}] },

{ id:7, date:"2025-04-09", cat:"macro", title:"Pause de 90 jours sur les tarifs douaniers",
  short:"Trump suspend les tarifs réciproques 90 jours : rallye historique.",
  move:"+9,2 % en séance (09/04) : plus forte hausse de l'histoire du fonds", moveSign:1,
  holdings:"Rebond marqué des semi-conducteurs et de l'ensemble des valeurs IA.",
  body:`<p>Une semaine après le krach, l'administration Trump annonce une <b>pause de 90 jours</b> sur les tarifs réciproques pays par pays (reportés au 9 juillet). Le soulagement est immédiat : le S&P 500 bondit d'environ +9,5 %, l'un des plus forts gains journaliers depuis 2008.</p><p>Le fonds gagne <b>+9,2 % en une seule séance</b>, sa meilleure journée historique. Les droits sur la Chine restant en vigueur, une partie du gain est rendue le lendemain. L'épisode illustre la très forte sensibilité du thème IA aux décisions de politique commerciale.</p>`,
  sources:[{l:"NTU (Tariff Timeline)",u:"https://www.ntu.org/publications/detail/liberation-day-tariff-timeline"},{l:"Wikipedia",u:"https://en.wikipedia.org/wiki/Liberation_Day_tariffs"}] },

{ id:8, date:"2025-05-02", cat:"macro", title:"Rebond : emploi solide & désescalade commerciale",
  short:"Bon rapport emploi d'avril et espoir de désescalade Chine : les indices repartent.",
  move:"+3,6 % en séance (02/05)", moveSign:1,
  holdings:"Résultats T1 résilients des grandes technologiques (Microsoft, Meta, Amazon, Apple).",
  body:`<p>Le rapport sur l'emploi américain d'avril, meilleur qu'attendu, éloigne le scénario de récession, tandis que Donald Trump évoque une baisse «&nbsp;substantielle&nbsp;» des tarifs sur la Chine. Les indices enchaînent une série de hausses pour ouvrir le mois de mai sur des niveaux records.</p><p>Les résultats du premier trimestre, jugés résilients pour les grandes technologiques (Microsoft, Meta, Amazon, Apple), confortent le rebond. Le fonds progresse de +3,6 %.</p>`,
  sources:[{l:"Yahoo Finance",u:"https://finance.yahoo.com/markets/stocks/live/stock-market-today-friday-may-1-records-apple-iran-231056146.html"}] },

{ id:9, date:"2025-05-12", cat:"macro", title:"Trêve commerciale USA-Chine (Genève)",
  short:"Tarifs US sur la Chine 145 % vers 30 %, Chine 125 % vers 10 % : trêve de 90 jours.",
  move:"+7,2 % en séance (12/05)", moveSign:1,
  holdings:"Détente sur les chaînes d'approvisionnement asiatiques (TSMC, Samsung, SK Hynix).",
  body:`<p>Réunis à Genève, Washington et Pékin s'accordent pour réduire massivement leurs droits de douane pendant 90 jours : les États-Unis ramènent les leurs de 145 % à 30 %, la Chine de 125 % à 10 %. La réduction dépasse les attentes du marché.</p><p>Les indices s'envolent : Dow +2,8 %, S&P 500 +3,3 % (plus haut depuis le 3 mars), Nasdaq +4,4 % ; le VIX repasse sous 20 pour la première fois depuis fin mars. Le fonds progresse de <b>+7,2 %</b>, la détente sur les chaînes d'approvisionnement asiatiques bénéficiant directement à ses positions semi-conducteurs.</p>`,
  sources:[{l:"CNBC",u:"https://www.cnbc.com/2025/05/12/us-china-trade-deal-markets-expect-tariffs-relief-new-highs-in-2025.html"},{l:"Virginia Business (AP)",u:"https://virginiabusiness.com/us-china-tariff-truce-trade-war-deal/"}] },

{ id:10, date:"2025-08-01", cat:"macro", title:"Choc sur l'emploi & nouveaux tarifs",
  short:"Emploi US faible (73k) et nouveaux tarifs (Inde, Taïwan, Corée) : repli marqué.",
  move:"-3,6 % en séance (01/08)", moveSign:-1,
  holdings:"Tarifs visant l'Asie (Taïwan 20 %, Corée 15 %) : pression sur Samsung, SK Hynix, TSMC.",
  body:`<p>Le rapport emploi de juillet déçoit fortement (73 000 créations de postes seulement, assorties de fortes révisions à la baisse des mois précédents), au moment même où entrent en vigueur de nouveaux droits de douane : Inde 25 %, Taïwan 20 %, Thaïlande 19 %, Corée 15 %.</p><p>Le S&P 500 perd 1,6 % (quatrième séance de baisse consécutive, la plus longue série depuis mai), le Nasdaq plus de 2 %. Les tarifs visant l'Asie pèsent particulièrement sur les positions coréennes et taïwanaises du fonds (mémoire, fonderie), qui recule de -3,6 %.</p>`,
  sources:[{l:"Bloomberg",u:"https://www.bloomberg.com/news/articles/2025-08-01/s-p-500-slides-after-weak-jobs-data-trump-s-new-tariff-salvos"},{l:"NPR",u:"https://www.npr.org/2025/08/01/nx-s1-5488804/stocks-trump-tariffs-economy"}] },

{ id:11, date:"2025-10-10", cat:"macro", title:"Menace de 100 % de tarifs sur la Chine",
  short:"Riposte aux restrictions chinoises sur les terres rares : ~2 000 Md$ effacés.",
  move:"-3,5 % en séance (10/10)", moveSign:-1,
  holdings:"Chaîne semi-conducteurs visée (terres rares + contrôles à l'export logiciel).",
  body:`<p>En réponse aux nouvelles restrictions chinoises sur l'exportation de terres rares, Donald Trump menace d'imposer <b>100 % de droits de douane</b> sur les importations chinoises à compter du 1er novembre, ainsi que des contrôles à l'export sur «&nbsp;tout logiciel critique&nbsp;».</p><p>Le S&P 500 chute de 2,7 %, sa pire séance depuis avril, effaçant environ 2 000 Md$ de capitalisation. La Chine contrôlant près de 70 % de l'offre mondiale de terres rares, indispensables aux semi-conducteurs, le fonds y est directement exposé et recule de -3,5 %.</p>`,
  sources:[{l:"CNBC",u:"https://www.cnbc.com/2025/10/11/trump-post-costs-stocks-2-trillion-in-single-day.html"},{l:"Fortune",u:"https://fortune.com/2025/10/10/trump-china-tariff-trade-war-rare-earths-software-export-controls/"}] },

{ id:12, date:"2025-11-20", cat:"ia", title:"Craintes de bulle IA & résultats NVIDIA",
  short:"Valorisations IA contestées ; NVIDIA bat le consensus mais le titre recule.",
  move:"-2,7 % le 20/11, rebond +3,0 % le 24/11", moveSign:-1,
  holdings:"NVIDIA, AMD, Broadcom : volatilité autour des publications et des craintes de valorisation.",
  body:`<p>Les craintes d'une «&nbsp;bulle IA&nbsp;» s'amplifient pendant plusieurs semaines, alimentées notamment par des investisseurs sceptiques comme Michael Burry. Le 20 novembre, Nasdaq et S&P 500 clôturent au plus bas depuis début septembre.</p><p>NVIDIA publie pourtant un trimestre record (chiffre d'affaires +62 % à 57 Md$, dont 51,2 Md$ pour les centres de données) mais le titre recule, incapable de dissiper les doutes de valorisation. Jensen Huang résume la situation : un bon trimestre est interprété comme «&nbsp;alimentant la bulle&nbsp;», un mauvais comme «&nbsp;la prouvant&nbsp;». Le fonds cède -2,7 % le 20 novembre avant un net rebond de +3,0 % le 24.</p>`,
  sources:[{l:"CNBC",u:"https://www.cnbc.com/2025/11/18/global-stocks-slide-as-valuation-fears-grow-ahead-of-nvidia-earnings.html"},{l:"Axios",u:"https://www.axios.com/2025/11/21/nvidia-stock-nvda-ai-sp500"}] },

{ id:13, date:"2026-01-20", cat:"ia", title:"Correction du software (« SaaSpocalypse »)",
  short:"Crainte que les agents IA remplacent le SaaS : ~2 000 Md$ effacés (15/01 au 14/02).",
  move:"-3,8 % le 20/01 puis -3,4 % le 04/02", moveSign:-1,
  holdings:"Software / facilitateurs sous pression ; point d'entrée saisi par la gestion (cf. fiche 16).",
  body:`<p>Un nouveau récit s'impose sur les marchés : les <b>agents IA</b> menaceraient le modèle par abonnement (per-seat) du logiciel d'entreprise. Déclenché par la publication de Palantir et le positionnement d'Anthropic (Claude), ce mouvement efface environ <b>2 000 Md$</b> de capitalisation du secteur logiciel entre le 15 janvier et le 14 février 2026, certaines valeurs mid-cap perdant plus de 30 % en un mois. Deloitte estimera alors qu'environ 40 % du chiffre d'affaires SaaS «&nbsp;par siège&nbsp;» est menacé à un horizon de 36 mois.</p><p>La poche «&nbsp;facilitateurs&nbsp;» (logiciel) du fonds ne pesant qu'environ 10 %, son repli (-3,8 % le 20/01, -3,4 % le 04/02) reste plus contenu que celui des indices software purs. Surtout, la gestion exploite la baisse comme un point d'entrée pour renforcer les logiciels de qualité (cybersécurité, DevOps, bases de données), choix qui s'avérera déterminant au printemps.</p>`,
  sources:[{l:"Fintool",u:"https://fintool.com/news/saaspocalypse-software-stocks-ai-selloff"},{l:"FinancialContent",u:"https://markets.financialcontent.com/stocks/article/marketminute-2026-3-24-the-2026-saaspocalypse-why-b2b-software-stocks-are-plunging-20"}] },

{ id:14, date:"2026-03-26", cat:"macro", title:"Krach technologique & correction du Nasdaq",
  short:"Pétrole en hausse, CAPEX décevant, incertitude à la Fed : Nasdaq -13 % vs sommet.",
  move:"-3,8 % le 26/03 ; creux le 30/03", moveSign:-1,
  holdings:"Correction de l'ensemble des valeurs IA ; point bas avant le rebond du printemps.",
  body:`<p>Une déroute de cinq semaines culmine le 27 mars 2026 : le Nasdaq entre en correction, en repli d'environ 13 % sous son sommet de janvier. Le cocktail à l'origine du mouvement combine flambée du pétrole (tensions au Moyen-Orient), rapports de CAPEX technologiques jugés décevants et incertitude sur la transition à la tête de la Réserve fédérale.</p><p>Le marché large touche son point bas le 30 mars (S&P 500 autour de 6 316 points), qui marque également le creux du fonds avant un net redressement. L'épisode rappelle la volatilité élevée du thème (volatilité ~21 % sur 1 an).</p>`,
  sources:[{l:"FinancialContent (27/03/2026)",u:"https://markets.financialcontent.com/workboat/article/marketminute-2026-3-27-wall-streets-dark-friday-nasdaq-sinks-into-correction-as-five-week-rout-deepens"},{l:"FinancialContent (rebond)",u:"https://markets.financialcontent.com/stocks/article/marketminute-2026-3-17-s-and-p-500-and-nasdaq-rebound-from-2026-lows-as-ai-trade-regains-momentum"}] },

{ id:15, date:"2026-04-08", cat:"ia", title:"Rebond IA & vague de CAPEX des hyperscalers",
  short:"Relèvements de CAPEX (≈725 Md$ en 2026) : le SOX au record, le S&P +10 % en avril.",
  move:"+3,9 % le 08/04 ; +10 % environ sur le mois d'avril", moveSign:1,
  holdings:"Semi-conducteurs & mémoire (NVIDIA, AMD, Broadcom, TSMC, SK Hynix, Samsung) portés par la vague de CAPEX.",
  body:`<p>Les hyperscalers (Alphabet, Amazon, Microsoft, Meta) relèvent leurs prévisions d'investissement à <b>environ 725 Md$ pour 2026</b>, dont près de 75 % vers l'infrastructure IA (GPU, réseau, centres de données) ; l'IA contribuerait à environ 40 % de la croissance des bénéfices du S&P 500 cette année.</p><p>L'indice des semi-conducteurs (SOX) inscrit un record le 17 avril ; sur le mois, le S&P 500 gagne plus de 10 % (son meilleur mois depuis novembre 2020) et le Nasdaq plus de 15 %. Positionné en amont de cette chaîne de valeur, le fonds (+3,9 % le 8 avril) entame ici son redressement du printemps 2026.</p>`,
  sources:[{l:"CNBC",u:"https://www.cnbc.com/2026/04/29/stock-market-today-live-updates.html"},{l:"Goldman Sachs",u:"https://www.goldmansachs.com/insights/articles/the-sp-500-expected-to-rally-12-this-year"}] },

{ id:16, date:"2026-05-29", cat:"fonds", title:"Surperformance du fonds : software & mémoire",
  short:"Convictions cybersécurité/DevOps/bases de données + mémoire : +19,2 % sur mai.",
  move:"+19,2 % sur le mois de mai ; +34,9 % YTD (indice +30,0 %)", moveSign:1,
  holdings:"Datadog & Snowflake +88 %, MongoDB +35 %, Palo Alto & CrowdStrike ≈ +60 %, Micron +89 %, SK Hynix +79 %, Samsung +42 %, AMD +46 %. Détracteur : Arista Networks -7 %.",
  body:`<p>Le positionnement de la gestion porte pleinement ses fruits. Selon le commentaire de gestion de mai 2026, le principal moteur est le <b>logiciel</b>, où les convictions avaient été concentrées (cybersécurité, DevOps, gestion de bases de données) pendant la correction du software : <b>Datadog +88 %, Snowflake +88 %, MongoDB +35 %, Palo Alto Networks et CrowdStrike environ +60 % chacun</b>.</p><p>En parallèle, le resserrement de l'offre en DRAM et HBM propulse la <b>mémoire</b> : Micron +89 %, SK Hynix +79 %, Samsung Electronics +42 %, AMD +46 %, soutenus par la vague de CAPEX des hyperscalers. Le fonds gagne environ +19 % sur le seul mois de mai et devance nettement son indice (+34,9 % YTD contre +30,0 %).</p><p>Seul détracteur notable : Arista Networks (-7 %), qui envoie un premier signal d'alerte sur l'infrastructure (relèvement d'objectifs annuels jugé décevant). La gestion prend par ailleurs des bénéfices sur certaines valeurs du logiciel aux multiples désormais élevés, pour les redéployer vers des segments jugés plus décotés.</p>`,
  sources:[{l:"Commentaire de gestion CPRAM (factsheet 31/05/2026)",u:"https://cpram.com/fra/fr/institutionnels/products/LU2860962476"}] },

{ id:17, date:"2026-06-05", cat:"macro", title:"Tensions USA-Iran & flambée du pétrole",
  short:"Escalade au Moyen-Orient, pétrole ~90 $, craintes inflation/Fed : prises de bénéfices.",
  move:"-5,6 % le 05/06 (après un pic à 162,2 le 02/06)", moveSign:-1,
  holdings:"Repli généralisé « risk-off » après un parcours exceptionnel ; rotation hors des gagnants.",
  body:`<p>Après un sommet historique début juin, le marché reflue. Donald Trump juge les négociations avec l'Iran «&nbsp;trop longues&nbsp;» et menace d'agir ; le pétrole grimpe (WTI autour de 90 $, Brent ~93 $) et les rendements obligataires montent sur fond de craintes inflationnistes. Le S&P 500 cède 1,6 % le 9 juin.</p><p>Le fonds, après une hausse marquée, subit d'importantes prises de bénéfices (-5,6 % le 5 juin, après un pic de la VL à 162,2 le 2 juin). Rappel utile pour le client : le thème reste volatil (volatilité ~21 % sur 1 an) et l'horizon de placement recommandé est de 5 ans minimum.</p>`,
  sources:[{l:"CNBC",u:"https://www.cnbc.com/2026/06/09/stock-market-today-live-updates.html"},{l:"Bloomberg",u:"https://www.bloomberg.com/news/articles/2026-06-07/us-stock-futures-drop-after-tech-selloff-oil-up-markets-wrap"}] },
];
EVENTS.forEach(e=>e.t=parseD(e.date));
const CAT_LABEL={ia:"IA",macro:"Macro / politique",fonds:"Fonds"};
const CAT_COLOR={ia:"#0082b8",macro:"#001C4B",fonds:"#9a6a00"};

/* =========================================================================
   GRAPHIQUE SVG
   ========================================================================= */
const svg = document.getElementById("chart");
const tip = document.getElementById("tip");
const evtTip = document.getElementById("evtTip");
const chartwrap = svg.parentElement;
let state = { start:RANGES[0].start, end:RANGES[0].end, rangeId:"ytd", showEvents:true,
              lastPreset:{start:RANGES[0].start,end:RANGES[0].end,id:"ytd"} };
let CUR = null, drag = null, hoverMarker = null;

function visibleSeries(){ return SERIES_ORDER.filter(k=>SERIES[k].on); }
function windowed(key,start,end){
  const arr=DATA[key]; if(!arr||!arr.length) return null;
  const pts=arr.filter(p=>p.t>=start-1 && p.t<=end+1);
  if(pts.length<2) return null;
  const base=pts[0].v;
  return pts.map(p=>({t:p.t, y:p.v/base*100}));
}
function interpY(pts,t){
  if(t<=pts[0].t) return pts[0].y;
  if(t>=pts[pts.length-1].t) return pts[pts.length-1].y;
  for(let i=0;i<pts.length-1;i++){
    if(t>=pts[i].t && t<=pts[i+1].t){
      const r=(t-pts[i].t)/(pts[i+1].t-pts[i].t);
      return pts[i].y+(pts[i+1].y-pts[i].y)*r;
    }
  }
  return pts[pts.length-1].y;
}
function nearestPt(pts,t){ let best=pts[0],bd=Infinity; for(const p of pts){const d=Math.abs(p.t-t); if(d<bd){bd=d;best=p;}} return best; }
function clampWin(s,e){
  const span=Math.min(e-s, FULL_SPAN);
  if(s<GLOBAL_START){ s=GLOBAL_START; e=s+span; }
  if(e>GLOBAL_END){ e=GLOBAL_END; s=e-span; }
  if(s<GLOBAL_START) s=GLOBAL_START;
  return [s,e];
}

function render(){
  const W=Math.max(320, svg.clientWidth||chartwrap.clientWidth);
  const H=svg.clientHeight||560;
  svg.setAttribute("width",W); svg.setAttribute("height",H);
  svg.setAttribute("viewBox","0 0 "+W+" "+H);
  const L=54,R=20,T=22,B=36;
  const pw=W-L-R, ph=H-T-B;
  const {start,end}=state;

  const reb={}; let yMin=Infinity,yMax=-Infinity;
  for(const k of visibleSeries()){
    const w=windowed(k,start,end); if(!w) continue;
    reb[k]=w;
    for(const p of w){ if(p.y<yMin)yMin=p.y; if(p.y>yMax)yMax=p.y; }
  }
  if(yMin===Infinity){yMin=90;yMax=110;}
  const pad=(yMax-yMin)*0.08||5; yMin-=pad; yMax+=pad;

  const sx=t=>L+(t-start)/(end-start)*pw;
  const sy=y=>T+(yMax-y)/(yMax-yMin)*ph;

  const AX="rgba(0,28,75,.5)", GRID="rgba(0,28,75,.07)", GRIDX="rgba(0,28,75,.045)";
  let s='';
  s+=`<rect x="${L}" y="${T}" width="${pw}" height="${ph}" fill="#fff"/>`;
  if(100>=yMin&&100<=yMax){
    s+=`<line x1="${L}" y1="${sy(100)}" x2="${W-R}" y2="${sy(100)}" stroke="rgba(0,28,75,.28)" stroke-width="1" stroke-dasharray="2 3"/>`;
    s+=`<text x="${W-R}" y="${sy(100)-5}" text-anchor="end" fill="rgba(0,28,75,.45)" font-size="10">base 100</text>`;
  }
  const ticks=5;
  for(let i=0;i<=ticks;i++){
    const yv=yMin+(yMax-yMin)*i/ticks, py=sy(yv);
    s+=`<line x1="${L}" y1="${py}" x2="${W-R}" y2="${py}" stroke="${GRID}" stroke-width="1"/>`;
    s+=`<text x="${L-9}" y="${py+3.5}" text-anchor="end" fill="${AX}" font-size="10.5">${Math.round(yv)}</text>`;
  }
  const xt=6;
  for(let i=0;i<=xt;i++){
    const tv=start+(end-start)*i/xt, px=sx(tv);
    s+=`<line x1="${px}" y1="${T}" x2="${px}" y2="${T+ph}" stroke="${GRIDX}" stroke-width="1"/>`;
    s+=`<text x="${px}" y="${T+ph+19}" text-anchor="middle" fill="${AX}" font-size="10.5">${fmtMonth(tv)}</text>`;
  }
  const drawOrder=visibleSeries().filter(k=>!SERIES[k].fund).concat(visibleSeries().filter(k=>SERIES[k].fund));
  for(const k of drawOrder){
    const w=reb[k]; if(!w) continue;
    const cfg=SERIES[k];
    let d="M";
    w.forEach((p,i)=>{ d+=(i?"L":"")+sx(p.t).toFixed(1)+" "+sy(p.y).toFixed(1)+" "; });
    s+=`<path d="${d}" fill="none" stroke="${cfg.color}" stroke-width="${cfg.width}" `+
       `${cfg.dash?`stroke-dasharray="${cfg.dash}" `:""}stroke-linejoin="round" stroke-linecap="round" `+
       `${cfg.fund?'filter="url(#glow)"':'opacity="0.95"'}/>`;
  }
  let markers='';
  if(state.showEvents && reb.cpram){
    for(const e of EVENTS){
      if(e.t<start||e.t>end) continue;
      const cx=sx(e.t), cy=sy(interpY(reb.cpram,e.t)), col=CAT_COLOR[e.cat];
      markers+=`<g class="evt-marker" data-id="${e.id}" transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">`+
        `<circle class="mk-ring" r="12" fill="none" stroke="${col}" stroke-width="2" opacity="0"/>`+
        `<circle r="9" fill="#ffffff" stroke="${col}" stroke-width="2.5"/>`+
        `<text y="3.4" text-anchor="middle" fill="${col}" font-size="10.5" font-weight="800">${e.id}</text>`+
        `</g>`;
    }
  }
  const defs=`<defs><filter id="glow" x="-25%" y="-25%" width="150%" height="150%">`+
    `<feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#009EE0" flood-opacity="0.35"/></filter></defs>`;

  svg.innerHTML = defs + s + `<g id="hoverLayer"></g>` + markers;
  CUR={start,end,L,R,T,B,pw,ph,W,H,reb,sx,sy,yMin,yMax};

  svg.querySelectorAll(".evt-marker").forEach(g=>{
    const id=+g.dataset.id;
    g.addEventListener("click",ev=>{ ev.stopPropagation(); openEvent(id); });
    g.addEventListener("mouseenter",()=>{ hoverMarker=id; hideHover(); showEvtTip(id); });
    g.addEventListener("mousemove",ev=>positionEvtTip(ev));
    g.addEventListener("mouseleave",()=>{ hoverMarker=null; hideEvtTip(); });
  });

  const n=visibleSeries().length;
  document.getElementById("baseNote").innerHTML=
    `Base 100 au <b>${fmtDate(start)}</b> · ${n} courbe${n>1?"s":""} affichée${n>1?"s":""}`;
  buildLiveLegend(reb);
}

function buildLiveLegend(reb){
  const box=document.getElementById("liveLegend"); box.innerHTML="";
  const rows=[];
  for(const k of visibleSeries()){
    const w=reb[k]; if(!w) continue;
    rows.push({k, perf:w[w.length-1].y-100});
  }
  rows.sort((a,b)=> (SERIES[b.k].fund?1:0)-(SERIES[a.k].fund?1:0) || b.perf-a.perf);
  for(const r of rows){
    const c=r.perf>=0?"var(--pos)":"var(--neg)";
    const el=document.createElement("span"); el.className="ll";
    el.innerHTML=`<i style="background:${SERIES[r.k].color}"></i>${SERIES[r.k].short} `+
      `<b style="color:${c}">${r.perf>=0?'+':''}${fmtNum(r.perf,1)}%</b>`;
    box.appendChild(el);
  }
}

/* ---------- Tooltip événement (survol des numéros) ---------- */
function showEvtTip(id){
  const e=EVENTS.find(x=>x.id===id); if(!e) return;
  const cls=e.moveSign>0?"pos":(e.moveSign<0?"neg":"");
  const arrow=e.moveSign>0?"▲":(e.moveSign<0?"▼":"■");
  evtTip.innerHTML=`<div class="ettitle"><span class="badge ${e.cat}">${CAT_LABEL[e.cat]}</span>${e.title}</div>`+
    `<div class="etshort">${e.short}</div>`+
    `<div class="etmove mv ${cls}">${arrow} ${e.move}</div>`+
    `<div class="ethint">Cliquer pour le détail complet</div>`;
  evtTip.style.opacity=1;
}
function positionEvtTip(ev){
  const rect=chartwrap.getBoundingClientRect();
  const w=evtTip.offsetWidth, h=evtTip.offsetHeight;
  let left=ev.clientX-rect.left+16, top=ev.clientY-rect.top+16;
  if(left+w>rect.width-6) left=ev.clientX-rect.left-w-16;
  if(top+h>rect.height-6) top=ev.clientY-rect.top-h-16;
  evtTip.style.left=Math.max(4,left)+"px";
  evtTip.style.top=Math.max(4,top)+"px";
}
function hideEvtTip(){ evtTip.style.opacity=0; }

/* ---------- Survol (crosshair + tooltip multi-séries) ---------- */
function showHover(clientX){
  if(!CUR||hoverMarker!==null) return;
  const rect=svg.getBoundingClientRect();
  const scale=CUR.W/rect.width;
  const mx=(clientX-rect.left)*scale;
  const {start,end,L,T,pw,ph,reb,sx,sy}=CUR;
  if(mx<L||mx>L+pw||!reb.cpram){ hideHover(); return; }
  const t=start+(mx-L)/pw*(end-start);
  const ref=nearestPt(reb.cpram,t);
  const xS=sx(ref.t);
  let g=`<line x1="${xS}" y1="${T}" x2="${xS}" y2="${T+ph}" stroke="rgba(0,28,75,.35)" stroke-width="1" stroke-dasharray="3 3"/>`;
  const rows=[];
  for(const k of visibleSeries()){
    const w=reb[k]; if(!w) continue;
    if(ref.t<w[0].t-1 || ref.t>w[w.length-1].t+1) continue;
    const yv=interpY(w,ref.t);
    g+=`<circle cx="${xS}" cy="${sy(yv)}" r="${SERIES[k].fund?4.5:3.5}" fill="${SERIES[k].color}" stroke="#fff" stroke-width="2"/>`;
    rows.push({k,yv});
  }
  const hl=document.getElementById("hoverLayer"); if(hl) hl.innerHTML=g;
  rows.sort((a,b)=>(SERIES[b.k].fund?1:0)-(SERIES[a.k].fund?1:0)||b.yv-a.yv);
  let html=`<div class="tdate">${fmtDate(ref.t)}</div>`;
  for(const r of rows){
    const perf=r.yv-100, pc=perf>=0?"#1f9d57":"#d0432b";
    html+=`<div class="trow"><span class="tn"><span class="sw" style="background:${SERIES[r.k].color}"></span>${SERIES[r.k].short}</span>`+
          `<span class="tv">${fmtNum(r.yv)} <span style="color:${pc};font-weight:600">(${perf>=0?'+':''}${fmtNum(perf,1)}%)</span></span></div>`;
  }
  tip.innerHTML=html; tip.style.opacity=1;
  const tw=tip.offsetWidth, ch=chartwrap.clientWidth;
  let left=(xS/scale)+14;
  if(left+tw>ch-6) left=(xS/scale)-tw-14;
  tip.style.left=Math.max(4,left)+"px";
  tip.style.top=(T/scale+6)+"px";
}
function hideHover(){ tip.style.opacity=0; const h=document.getElementById("hoverLayer"); if(h)h.innerHTML=""; }

/* ---------- Zoom (molette) / déplacement (glisser) / reset ---------- */
function setView(s,e,presetId){
  [s,e]=clampWin(s,e);
  state.start=s; state.end=e; state.rangeId=presetId||null;
  syncActive(); render();
}
svg.addEventListener("wheel",function(e){
  if(!CUR) return;
  e.preventDefault();
  const rect=svg.getBoundingClientRect(), scale=CUR.W/rect.width;
  const x=(e.clientX-rect.left)*scale;
  const {L,pw}=CUR; if(x<L||x>L+pw) return;
  const span=state.end-state.start;
  const tc=state.start+(x-L)/pw*span;
  const f=e.deltaY<0?ZOOM_IN:ZOOM_OUT;
  let ns=Math.max(MIN_SPAN, Math.min(FULL_SPAN, span*f));
  let s=tc-(tc-state.start)*(ns/span), en=s+ns;
  hideEvtTip();
  setView(s,en,null);
},{passive:false});

svg.addEventListener("pointerdown",function(e){
  if(!CUR) return;
  const rect=svg.getBoundingClientRect(), scale=CUR.W/rect.width;
  const x=(e.clientX-rect.left)*scale;
  if(x<CUR.L||x>CUR.L+CUR.pw) return;
  drag={x0:e.clientX, s0:state.start, e0:state.end};
  try{svg.setPointerCapture(e.pointerId);}catch(_){}
  svg.classList.add("grabbing"); hideHover();
});
svg.addEventListener("pointermove",function(e){
  if(drag){
    const rect=svg.getBoundingClientRect(), scale=CUR.W/rect.width;
    const dxpx=(e.clientX-drag.x0)*scale;
    const span=drag.e0-drag.s0;
    const dt=dxpx/CUR.pw*span;
    let s=drag.s0-dt, en=drag.e0-dt;
    [s,en]=clampWin(s,en);
    state.start=s; state.end=en; state.rangeId=null; syncActive(); render();
  } else {
    showHover(e.clientX);
  }
});
function endDrag(e){ if(drag){ try{svg.releasePointerCapture(e.pointerId);}catch(_){} drag=null; svg.classList.remove("grabbing"); } }
svg.addEventListener("pointerup",endDrag);
svg.addEventListener("pointercancel",endDrag);
svg.addEventListener("pointerleave",function(){ if(!drag) hideHover(); });
svg.addEventListener("dblclick",function(){ resetZoom(); });
function resetZoom(){ const p=state.lastPreset; setView(p.start,p.end,p.id); }

/* =========================================================================
   MODALE
   ========================================================================= */
const modal=document.getElementById("modal"), modalBg=document.getElementById("modalBg");
function openEvent(id){
  const e=EVENTS.find(x=>x.id===id); if(!e) return;
  document.getElementById("mDate").innerHTML=
    `<span class="badge ${e.cat}">${CAT_LABEL[e.cat]}</span><span>${fmtDate(e.t)}</span><span>Événement n°${e.id}</span>`;
  document.getElementById("mTitle").textContent=e.title;
  document.getElementById("mBody").innerHTML=e.body;
  const cls=e.moveSign>0?"pos":(e.moveSign<0?"neg":"");
  const arrow=e.moveSign>0?"▲":(e.moveSign<0?"▼":"■");
  document.getElementById("mImpact").innerHTML=
    `<div class="il">Impact sur le fonds</div>`+
    `<div class="ival mv ${cls}">${arrow} ${e.move}</div>`+
    `<div class="hold"><b>Valeurs concernées :</b> ${e.holdings}</div>`;
  let src=`<div class="sl">Sources vérifiées</div>`;
  e.sources.forEach(s=>{ src+=`<a href="${s.u}" target="_blank" rel="noopener">${s.l} ↗</a>`; });
  document.getElementById("mSources").innerHTML=src;
  modalBg.classList.add("open"); modal.classList.add("open");
  document.body.style.overflow="hidden";
}
function closeModal(){ modalBg.classList.remove("open"); modal.classList.remove("open"); document.body.style.overflow=""; }
modalBg.addEventListener("click",closeModal);
document.getElementById("modalClose").addEventListener("click",closeModal);
document.addEventListener("keydown",e=>{ if(e.key==="Escape") closeModal(); });

/* =========================================================================
   CONTRÔLES + LISTE D'ÉVÉNEMENTS
   ========================================================================= */
function buildControls(){
  const rb=document.getElementById("rangeBtns");
  RANGES.forEach(r=>{
    const b=document.createElement("button");
    b.className="chip"+(r.id===state.rangeId?" active":"");
    b.textContent=r.label; b.dataset.rid=r.id;
    b.onclick=()=>{ state.lastPreset={start:r.start,end:r.end,id:r.id}; setView(r.start,r.end,r.id); };
    rb.appendChild(b);
  });
  const eb=document.getElementById("epBtns");
  EPISODES.forEach(ep=>{
    const b=document.createElement("button");
    b.className="chip ep"; b.textContent=ep.label; b.dataset.rid="ep-"+ep.id;
    b.onclick=()=>{ state.lastPreset={start:ep.start,end:ep.end,id:"ep-"+ep.id}; setView(ep.start,ep.end,"ep-"+ep.id); };
    eb.appendChild(b);
  });
  const sb=document.getElementById("seriesBtns");
  SERIES_ORDER.forEach(k=>{
    const cfg=SERIES[k];
    const b=document.createElement("button");
    b.className="chip series"+(cfg.on?" active":"")+(cfg.fund?" fund":"");
    b.innerHTML=`<span class="dot" style="background:${cfg.color}"></span>${cfg.short}`;
    b.dataset.k=k;
    b.onclick=()=>{ if(cfg.fund) return; cfg.on=!cfg.on; b.classList.toggle("active",cfg.on); render(); };
    if(cfg.fund){ b.style.cursor="default"; b.title="Toujours affiché"; }
    sb.appendChild(b);
  });
}
function syncActive(){
  document.querySelectorAll("#rangeBtns .chip,#epBtns .chip").forEach(b=>{
    b.classList.toggle("active", b.dataset.rid===state.rangeId);
  });
}
function buildEventList(){
  const grid=document.getElementById("eventsGrid");
  EVENTS.forEach(e=>{
    const cls=e.moveSign>0?"pos":(e.moveSign<0?"neg":"");
    const arrow=e.moveSign>0?"▲":(e.moveSign<0?"▼":"■");
    const card=document.createElement("div"); card.className="evt-card";
    card.innerHTML=
      `<div class="evt-num" style="background:${CAT_COLOR[e.cat]}">${e.id}</div>`+
      `<div class="evt-meta">`+
        `<div class="dt"><span class="badge ${e.cat}">${CAT_LABEL[e.cat]}</span><span>${fmtDate(e.t)}</span></div>`+
        `<h4>${e.title}</h4><div class="sh">${e.short}</div>`+
        `<div class="mv ${cls}" style="margin-top:7px;font-size:12.5px">${arrow} ${e.move}</div>`+
      `</div>`;
    card.onclick=()=>openEvent(e.id);
    grid.appendChild(card);
  });
}

/* =========================================================================
   CONTENU STATIQUE (top 10, géo, secteurs, légende footer)
   ========================================================================= */
const HOLDINGS=[
  ["Alphabet Inc (Cl A)",6.76,"Infrastructures · Hyperscalers"],
  ["Broadcom",6.25,"Infrastructures · Design & Production"],
  ["TSMC (ADR)",5.72,"Infrastructures · Fonderie"],
  ["Advanced Micro Devices (AMD)",5.61,"Infrastructures · Design & Production"],
  ["NVIDIA",5.29,"Infrastructures · Design & Production"],
  ["SK Hynix",5.24,"Infrastructures · Mémoire"],
  ["Meta Platforms (Cl A)",4.19,"Infrastructures · Hyperscalers"],
  ["Amazon.com",4.15,"Infrastructures · Hyperscalers"],
  ["Samsung Electronics",3.99,"Infrastructures · Hyperscalers"],
  ["Oracle",3.58,"Infrastructures · Cloud"],
];
function buildHoldings(){
  const max=HOLDINGS[0][1], box=document.getElementById("holdings");
  HOLDINGS.forEach((h,i)=>{
    const r=document.createElement("div"); r.className="hold-row";
    r.innerHTML=`<div class="rk">${i+1}</div><div class="nm">${h[0]}<small>${h[2]}</small></div>`+
      `<div class="bar"><i style="width:${(h[1]/max*100).toFixed(0)}%"></i></div>`+
      `<div class="wt">${fmtNum(h[1])}%</div>`;
    box.appendChild(r);
  });
}
const GEO=[
  ["Amérique du Nord",75.18,80.88,"#001C4B"],
  ["Pays émergents",19.39,10.86,"#009EE0"],
  ["Zone Euro",2.60,4.22,"#8E5BEF"],
  ["Japon",2.24,2.69,"#14B8A6"],
  ["Europe hors UEM",0.99,null,"#9aa7b8"],
];
const SECTOR=[
  ["Technologies de l'information",80.47,79.57,"#001C4B"],
  ["Services de communication",12.65,13.85,"#009EE0"],
  ["Consommation cyclique",5.72,6.57,"#5cc6f2"],
  ["Autres secteurs",0.58,null,"#9aa7b8"],
];
function buildAlloc(boxId,rows){
  const box=document.getElementById(boxId);
  rows.forEach(r=>{
    const div=document.createElement("div"); div.className="arow";
    const idx=r[2]!=null?`<span class="idx">indice ${fmtNum(r[2])}%</span>`:"";
    div.innerHTML=`<div class="at"><span>${r[0]} ${idx}</span><b>${fmtNum(r[1])}%</b></div>`+
      `<div class="bar2"><i style="width:${r[1].toFixed(1)}%;background:${r[3]}"></i></div>`;
    box.appendChild(div);
  });
}
function buildFootLegend(){
  const box=document.getElementById("footLegend");
  SERIES_ORDER.forEach(k=>{
    const s=document.createElement("span");
    s.innerHTML=`<i style="background:${SERIES[k].color}"></i>${SERIES[k].short}`;
    box.appendChild(s);
  });
}

/* ---------- INIT ---------- */
buildControls();
buildEventList();
buildHoldings();
buildAlloc("geo",GEO);
buildAlloc("sector",SECTOR);
buildFootLegend();
render();
let rT; window.addEventListener("resize",()=>{ clearTimeout(rT); rT=setTimeout(render,120); });
