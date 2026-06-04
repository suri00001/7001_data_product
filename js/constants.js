// ════════════════════════════════════════════════════════
// STATIC CONSTANTS
// ════════════════════════════════════════════════════════

const COUNTRIES = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas, The", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Dem. Rep.", "Congo, Rep.", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominican Republic", "Ecuador", "Egypt, Arab Rep.", "El Salvador", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia, The", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran, Islamic Rep.", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Korea, Rep.", "Kuwait", "Kyrgyz Republic", "Lao PDR", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Mongolia", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russian Federation", "Rwanda", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovak Republic", "Slovenia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syrian Arab Republic", "Tajikistan", "Tanzania", "Thailand", "Togo", "Trinidad and Tobago", "Tunisia", "Turkiye", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Viet Nam", "Yemen, Rep.", "Zambia"];

const MODEL_DATA = [{"model":"Pooled OLS","coef":0.232,"se":0.0494,"pval":0.0,"sig":"***","r2":0.0929,"preferred":false},{"model":"Random Effects","coef":0.2337,"se":0.0378,"pval":0.0,"sig":"***","r2":0.1076,"preferred":false},{"model":"Country FE","coef":0.2367,"se":0.0435,"pval":0.0,"sig":"***","r2":0.1079,"preferred":true},{"model":"Two-way FE","coef":0.0487,"se":0.0564,"pval":0.388,"sig":"ns","r2":0.0312,"preferred":false},{"model":"First Difference","coef":0.2992,"se":0.0519,"pval":0.0,"sig":"***","r2":null,"preferred":false}];

const COEF_DETAIL = [{"var":"aging_rate","label":"Aging Rate","coef":0.2367,"se":0.0435,"tstat":5.437,"pval":0.0,"sig":"***"},{"var":"log_gdp_pc","label":"Log GDP per Capita","coef":0.1142,"se":0.1113,"tstat":1.026,"pval":0.305,"sig":""},{"var":"urban","label":"Urbanisation Rate","coef":0.0289,"se":0.0191,"tstat":1.511,"pval":0.131,"sig":""},{"var":"beds","label":"Hospital Beds/1000","coef":-0.1565,"se":0.0814,"tstat":-1.923,"pval":0.055,"sig":"·"}];

// ════════════════════════════════════════════════════════
// GDP REFERENCE — 2022 World Bank estimates (USD billion)
// Country keys match PANEL_DATA country names exactly
// ════════════════════════════════════════════════════════
const GDP_REFERENCE = [
  { country: 'United States',      display: 'United States',   gdp: 25462 },
  { country: 'China',              display: 'China',           gdp: 17963 },
  { country: 'Japan',              display: 'Japan',           gdp:  4231 },
  { country: 'Germany',            display: 'Germany',         gdp:  4073 },
  { country: 'India',              display: 'India',           gdp:  3386 },
  { country: 'United Kingdom',     display: 'United Kingdom',  gdp:  3071 },
  { country: 'France',             display: 'France',          gdp:  2779 },
  { country: 'Canada',             display: 'Canada',          gdp:  2140 },
  { country: 'Italy',              display: 'Italy',           gdp:  2011 },
  { country: 'Brazil',             display: 'Brazil',          gdp:  1920 },
  { country: 'Australia',          display: 'Australia',       gdp:  1703 },
  { country: 'Korea, Rep.',        display: 'South Korea',     gdp:  1665 },
  { country: 'Spain',              display: 'Spain',           gdp:  1418 },
  { country: 'Mexico',             display: 'Mexico',          gdp:  1314 },
  { country: 'Indonesia',          display: 'Indonesia',       gdp:  1319 },
  { country: 'Saudi Arabia',       display: 'Saudi Arabia',    gdp:  1109 },
  { country: 'Turkiye',            display: 'Türkiye',         gdp:   906 },
  { country: 'Netherlands',        display: 'Netherlands',     gdp:   991 },
  { country: 'Singapore',          display: 'Singapore',       gdp:   467 },
  { country: 'Thailand',           display: 'Thailand',        gdp:   495 },
  { country: 'Malaysia',           display: 'Malaysia',        gdp:   406 },
  { country: 'Viet Nam',           display: 'Vietnam',         gdp:   409 },
  { country: 'Nigeria',            display: 'Nigeria',         gdp:   477 },
  { country: 'South Africa',       display: 'South Africa',    gdp:   406 },
  { country: 'Egypt, Arab Rep.',   display: 'Egypt',           gdp:   477 },
];

// ════════════════════════════════════════════════════════
// SIMULATOR REFERENCE ITEMS (cost in USD billion)
// ════════════════════════════════════════════════════════
const REF_ITEMS = [
  { id: 'metro',    icon: '🚇', name: 'Metro Lines',         unit: 'lines',     cost: 1.5,  desc: '~15km incl. stations',              source: 'World Bank urban transport avg. 2020' },
  { id: 'hospital', icon: '🏥', name: 'General Hospitals',   unit: 'hospitals', cost: 0.5,  desc: '500-bed tertiary-level',             source: 'WHO capital cost benchmarks 2022' },
  { id: 'wind',     icon: '⚡', name: 'Offshore Wind Farms', unit: 'farms',     cost: 2.0,  desc: '500MW installed capacity',           source: 'IRENA offshore wind cost 2023' },
  { id: 'highway',  icon: '🛣️', name: 'Motorway',            unit: '100km',     cost: 0.8,  desc: 'incl. interchanges & infrastructure', source: 'World Bank road infrastructure avg.' },
  { id: 'research', icon: '🔬', name: 'Research Grants',     unit: 'projects',  cost: 0.1,  desc: 'Major national R&D grants',          source: 'OECD R&D grant avg.' },
];

// ════════════════════════════════════════════════════════
// CHART COLORS & LAYOUT
// ════════════════════════════════════════════════════════
const COLORS_QUALITATIVE = [
  '#2563eb','#ea580c','#16a34a','#ca8a04','#7c3aed',
  '#db2777','#0891b2','#65a30d','#d97706','#9333ea'
];

const PLOTLY_LAYOUT_BASE = {
  paper_bgcolor: 'transparent',
  plot_bgcolor:  '#fafaf8',
  font: { family: "'DM Mono', monospace", color: '#5c637a', size: 11 },
  margin: { t: 20, r: 20, b: 50, l: 50 },
};

function applyAxisStyle(ax) {
  return {
    ...ax,
    gridcolor: '#e8e4dc',
    zerolinecolor: '#d0ccc4',
    tickfont: { color: '#5c637a', size: 10 },
    titlefont: { color: '#5c637a', size: 11 },
    linecolor: '#dcdad4',
  };
}

// ════════════════════════════════════════════════════════
// RUNTIME GLOBALS (populated after data load)
// ════════════════════════════════════════════════════════
let PANEL_DATA = [];
const dataIndex    = {};  // iso3_year -> record
const countryIndex = {};  // country -> { year -> record }

let mapMetric   = 'aging_rate';
let mapPlaying  = false;
let mapTimer    = null;

function buildIndexes() {
  PANEL_DATA.forEach(d => {
    dataIndex[d.iso3 + '_' + d.year] = d;
    if (!countryIndex[d.country]) countryIndex[d.country] = {};
    countryIndex[d.country][d.year] = d;
  });
}
