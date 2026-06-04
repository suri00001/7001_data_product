// ════════════════════════════════════════════════════════
// SECTION 2: SCATTER PLOT
// ════════════════════════════════════════════════════════

function updateScatter() {
  const year = +document.getElementById('scatter-year').value;
  document.getElementById('scatter-year-label').textContent = year;

  const yearData = PANEL_DATA.filter(d =>
    d.year === year && d.health_exp != null && d.aging_rate != null
  );

  const xVals = yearData.map(d => d.aging_rate);
  const xMin  = d3.min(xVals), xMax = d3.max(xVals);
  const slope = 0.232;
  const intercept = (() => {
    const mx = d3.mean(xVals);
    const my = d3.mean(yearData.map(d => d.health_exp));
    return my - slope * mx;
  })();

  const trendX = [xMin, xMax];
  const trendY = trendX.map(x => slope * x + intercept);

  const traces = [
    {
      type: 'scatter', mode: 'markers',
      x: yearData.map(d => d.aging_rate),
      y: yearData.map(d => d.health_exp),
      text: yearData.map(d => d.country),
      hovertemplate: '<b>%{text}</b><br>Ageing: %{x:.1f}%<br>Health Exp: %{y:.2f}% GDP<extra></extra>',
      marker: {
        size: 7,
        color: '#2563eb',
        opacity: 0.75,
        line: { color: 'rgba(30,32,48,0.12)', width: 0.5 },
      },
      name: 'Countries',
    },
    {
      type: 'scatter', mode: 'lines',
      x: trendX, y: trendY,
      line: { color: '#ea580c', width: 2, dash: 'dash' },
      hoverinfo: 'skip',
      name: 'Trend (slope ≈ 0.232)',
    },
  ];

  const layout = {
    ...PLOTLY_LAYOUT_BASE,
    xaxis: applyAxisStyle({ title: { text: 'Ageing Rate (% population aged 65+)' } }),
    yaxis: applyAxisStyle({ title: { text: 'Health Expenditure (% of GDP)' } }),
    showlegend: true,
    legend: {
      x: 0.01, y: 0.99,
      bgcolor: 'rgba(255,255,255,0.85)',
      bordercolor: '#dcdad4', borderwidth: 1,
      font: { size: 10 },
    },
    annotations: [{
      x: xMax * 0.7, y: slope * xMax * 0.7 + intercept + 1.5,
      text: `Year: <b>${year}</b> · n = ${yearData.length} countries`,
      showarrow: false,
      font: { size: 12, color: '#1e2030', family: "'DM Mono', monospace" },
      bgcolor: 'rgba(255,255,255,0.85)',
      bordercolor: '#dcdad4', borderwidth: 1, borderpad: 6,
    }],
  };

  Plotly.react('scatter-plot', traces, layout, { responsive: true, displayModeBar: false });
}
