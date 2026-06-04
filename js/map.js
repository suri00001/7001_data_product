// ════════════════════════════════════════════════════════
// SECTION 1: D3 BUBBLE MAP
// Color = aging rate (orange scale)
// Size  = health expenditure (% GDP)
// ════════════════════════════════════════════════════════

const mapW = () => document.getElementById('map-container').clientWidth;
const mapH = () => document.getElementById('map-container').clientHeight;

let mapSvg, mapPath, mapProjection, mapG, mapBubbleLayer, worldData;
let agingColorScale = null;
let healthSizeScale = null;

// ISO numeric -> ISO3 lookup (curated subset)
const NUMERIC_MAP = {
  4:'AFG',8:'ALB',12:'DZA',24:'AGO',32:'ARG',36:'AUS',40:'AUT',50:'BGD',56:'BEL',
  64:'BTN',68:'BOL',76:'BRA',100:'BGR',104:'MMR',116:'KHM',120:'CMR',124:'CAN',
  140:'CAF',148:'TCD',152:'CHL',156:'CHN',170:'COL',178:'COG',180:'COD',188:'CRI',
  191:'HRV',192:'CUB',196:'CYP',203:'CZE',208:'DNK',214:'DOM',218:'ECU',818:'EGY',
  222:'SLV',231:'ETH',246:'FIN',250:'FRA',266:'GAB',276:'DEU',288:'GHA',300:'GRC',
  320:'GTM',324:'GIN',332:'HTI',340:'HND',348:'HUN',356:'IND',360:'IDN',364:'IRN',
  368:'IRQ',372:'IRL',376:'ISR',380:'ITA',388:'JAM',392:'JPN',400:'JOR',398:'KAZ',
  404:'KEN',410:'KOR',414:'KWT',418:'LAO',422:'LBN',430:'LBR',434:'LBY',440:'LTU',
  442:'LUX',450:'MDG',454:'MWI',458:'MYS',484:'MEX',496:'MNG',504:'MAR',508:'MOZ',
  516:'NAM',524:'NPL',528:'NLD',554:'NZL',558:'NIC',566:'NGA',578:'NOR',586:'PAK',
  591:'PAN',598:'PNG',600:'PRY',604:'PER',608:'PHL',616:'POL',620:'PRT',634:'QAT',
  642:'ROU',643:'RUS',646:'RWA',682:'SAU',686:'SEN',694:'SLE',703:'SVK',705:'SVN',
  706:'SOM',710:'ZAF',724:'ESP',144:'LKA',729:'SDN',752:'SWE',756:'CHE',760:'SYR',
  764:'THA',768:'TGO',780:'TTO',788:'TUN',792:'TUR',800:'UGA',804:'UKR',784:'ARE',
  826:'GBR',840:'USA',858:'URY',862:'VEN',704:'VNM',887:'YEM',894:'ZMB',716:'ZWE',
  51:'ARM',31:'AZE',112:'BLR',470:'MLT',498:'MDA',417:'KGZ',762:'TJK',795:'TKM',
  860:'UZB',70:'BIH',807:'MKD',688:'SRB',499:'MNE',428:'LVA',233:'EST',232:'ERI',
  270:'GMB',384:'CIV',466:'MLI',478:'MRT',562:'NER',204:'BEN',854:'BFA',275:'PSE',
  48:'BHR',512:'OMN',132:'CPV',174:'COM',690:'SYC',108:'BDI',834:'TZA',426:'LSO',
  748:'SWZ',72:'BWA',566:'NGA',410:'KOR',
};

function getIso3(feature) {
  return NUMERIC_MAP[parseInt(feature.id)] || null;
}

async function initMap() {
  const topo = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
  worldData = topojson.feature(topo, topo.objects.countries);

  // Wait until the container has non-zero dimensions (layout may not be complete yet)
  await new Promise(resolve => {
    function check() {
      if (mapW() > 0) { resolve(); } else { requestAnimationFrame(check); }
    }
    check();
  });

  const svg = d3.select('#map-svg');
  const w = mapW(), h = mapH();

  mapProjection = d3.geoNaturalEarth1()
    .scale(w / 6.3)
    .translate([w / 2, h / 2]);

  mapPath = d3.geoPath().projection(mapProjection);
  mapG = svg.append('g');

  // Graticule
  mapG.append('path')
    .datum(d3.geoGraticule()())
    .attr('fill', 'none')
    .attr('stroke', '#c8d8e8')
    .attr('stroke-width', 0.5)
    .attr('d', mapPath);

  // Country base layer (grey fills)
  mapG.selectAll('.country')
    .data(worldData.features)
    .join('path')
    .attr('class', 'country')
    .attr('d', mapPath)
    .attr('fill', '#cdd8e6')
    .attr('stroke', '#b0bec8')
    .attr('stroke-width', 0.4);

  // Bubble layer on top
  mapBubbleLayer = mapG.append('g').attr('class', 'bubble-layer');

  buildScales();
  renderBubbles();
  renderMapLegend();
}

function buildScales() {
  const agingVals  = PANEL_DATA.map(d => d.aging_rate).filter(v => v != null);
  const healthVals = PANEL_DATA.map(d => d.health_exp).filter(v => v != null);

  agingColorScale = d3.scaleSequential(d3.interpolateOranges)
    .domain([
      d3.quantile(agingVals.sort(d3.ascending), 0.02),
      d3.quantile(agingVals, 0.98),
    ]);

  healthSizeScale = d3.scaleSqrt()
    .domain([0, d3.quantile(healthVals.sort(d3.ascending), 0.98)])
    .range([2, 22])
    .clamp(true);
}

function renderBubbles() {
  const year = +document.getElementById('map-year').value;
  document.getElementById('map-year-label').textContent = year;

  mapBubbleLayer.selectAll('circle').remove();

  worldData.features.forEach(feature => {
    const iso3 = getIso3(feature);
    if (!iso3) return;
    const rec = dataIndex[iso3 + '_' + year];
    if (!rec || rec.aging_rate == null || rec.health_exp == null) return;

    const centroid = mapPath.centroid(feature);
    if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) return;

    const r     = healthSizeScale(rec.health_exp);
    const color = agingColorScale(rec.aging_rate);

    mapBubbleLayer.append('circle')
      .attr('cx', centroid[0])
      .attr('cy', centroid[1])
      .attr('r', r)
      .attr('fill', color)
      .attr('fill-opacity', 0.78)
      .attr('stroke', 'rgba(255,255,255,0.6)')
      .attr('stroke-width', 0.8)
      .style('cursor', 'pointer')
      .on('mousemove', (event) => onBubbleHover(event, rec))
      .on('mouseleave', () => { document.getElementById('map-tooltip').style.display = 'none'; });
  });
}

function onBubbleHover(event, rec) {
  const tt   = document.getElementById('map-tooltip');
  const rect = document.getElementById('map-container').getBoundingClientRect();

  document.getElementById('tt-name').textContent = rec.country;
  document.getElementById('tt-aging').textContent = rec.aging_rate != null ? rec.aging_rate.toFixed(1) + '%' : 'N/A';
  document.getElementById('tt-health').textContent = rec.health_exp != null ? rec.health_exp.toFixed(2) + '%' : 'N/A';
  document.getElementById('tt-year').textContent = rec.year;

  const left = Math.min(event.clientX - rect.left + 12, rect.width - 210);
  const top  = Math.max(event.clientY - rect.top  - 70, 8);
  tt.style.left = left + 'px';
  tt.style.top  = top  + 'px';
  tt.style.display = 'block';
}

function renderMapLegend() {
  // Color legend (aging rate)
  const [lo, hi] = agingColorScale.domain();
  document.getElementById('leg-lo').textContent = lo.toFixed(1) + '%';
  document.getElementById('leg-hi').textContent = hi.toFixed(1) + '%';
  const stops = Array.from({length: 11}, (_, i) => agingColorScale(lo + (hi - lo) * i / 10));
  document.getElementById('legend-bar').style.background = `linear-gradient(90deg,${stops.join(',')})`;

  // Size legend (health exp)
  const sizeLegend = document.getElementById('size-legend');
  const sizes = [2, 7, 20];
  const labels = ['~2%', '~8%', '~20%'];
  sizeLegend.innerHTML = '<div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:6px;">Health Exp. % GDP</div>';
  sizes.forEach((r, i) => {
    const row = document.createElement('div');
    row.className = 'size-legend-row';
    row.innerHTML = `
      <div class="size-legend-circle" style="width:${r*2}px;height:${r*2}px;min-width:${r*2}px;"></div>
      <span style="color:var(--text-dim);font-size:10px;">${labels[i]}</span>
    `;
    sizeLegend.appendChild(row);
  });
}

function updateMap() {
  renderBubbles();
}

function toggleMapPlay() {
  mapPlaying = !mapPlaying;
  document.getElementById('map-play-btn').textContent = mapPlaying ? '⏸ Pause' : '▶ Play';
  if (mapPlaying) {
    mapTimer = setInterval(() => {
      const sl = document.getElementById('map-year');
      let v = +sl.value + 1;
      if (v > 2022) v = 2000;
      sl.value = v;
      renderBubbles();
    }, 400);
  } else {
    clearInterval(mapTimer);
  }
}
