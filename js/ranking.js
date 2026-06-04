// ════════════════════════════════════════════════════════
// SECTION 3: AGING RATE RANKING (2022)
// ════════════════════════════════════════════════════════

function renderRankingChart() {
  const YEAR = 2022;
  const HIGHLIGHT = new Set(['Malaysia', 'India', 'China', 'Bangladesh', 'Indonesia']);

  const sorted = PANEL_DATA
    .filter(d => d.year === YEAR && d.aging_rate != null)
    .sort((a, b) => b.aging_rate - a.aging_rate);

  const top20Set = new Set(sorted.slice(0, 20).map(d => d.country));

  // Top 20 + any highlighted country not already in top 20
  const combined = sorted.filter(d => top20Set.has(d.country) || HIGHLIGHT.has(d.country));

  const isHL = d => HIGHLIGHT.has(d.country);

  const trace = {
    type: 'bar',
    orientation: 'h',
    x: combined.map(d => d.aging_rate),
    y: combined.map(d => d.country),
    text: combined.map(d => d.aging_rate.toFixed(1) + '%'),
    textposition: 'outside',
    textfont: { size: 10, color: '#5c637a' },
    cliponaxis: false,
    marker: {
      color:   combined.map(d => isHL(d) ? '#ea580c' : '#2563eb'),
      opacity: combined.map(d => isHL(d) ? 0.92 : 0.62),
      line: { width: 0 },
    },
    hovertemplate: '<b>%{y}</b><br>Aging Rate: %{x:.1f}%<extra></extra>',
    name: '',
  };

  const n = combined.length;
  const layout = {
    ...PLOTLY_LAYOUT_BASE,
    height: n * 28 + 120,
    margin: { t: 40, r: 72, b: 50, l: 160 },
    xaxis: applyAxisStyle({
      title: { text: 'Aging Rate (% population aged 65+)' },
      range: [0, combined[0].aging_rate * 1.20],
    }),
    yaxis: applyAxisStyle({
      autorange: 'reversed',
      tickfont: { size: 10.5 },
    }),
    annotations: [{
      x: 0.5, y: 1.045,
      xref: 'paper', yref: 'paper',
      text: '<span style="color:#ea580c">■</span> Highlighted Asian economies &nbsp;|&nbsp; <span style="color:#2563eb">■</span> Other countries',
      showarrow: false,
      font: { size: 10, family: "'DM Mono', monospace", color: '#5c637a' },
      xanchor: 'center', yanchor: 'bottom',
    }],
    showlegend: false,
    bargap: 0.30,
  };

  Plotly.newPlot('ranking-plot', [trace], layout, { responsive: true, displayModeBar: false });
}
