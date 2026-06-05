// ════════════════════════════════════════════════════════
// SECTION 3: DUAL-AXIS TREND CHART
// Left  Y-axis (solid lines)  → Aging Rate (%)
// Right Y-axis (dashed lines) → Health Expenditure (% GDP)
// ════════════════════════════════════════════════════════

function initTrendSelect() {
  const sel = document.getElementById('trend-country');
  COUNTRIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = opt.textContent = c;
    sel.appendChild(opt);
  });
  const defaults = ['Japan', 'Germany', 'United States', 'Malaysia', 'China', 'Nigeria'];
  defaults.forEach(name => {
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === name) sel.options[i].selected = true;
    }
  });
  updateTrend();
}

function updateTrend() {
  const sel      = document.getElementById('trend-country');
  const selected = Array.from(sel.selectedOptions).map(o => o.value);
  if (!selected.length) return;

  const years = Array.from({length: 23}, (_, i) => 2000 + i);

  const traces = selected.flatMap((country, i) => {
    const cData = countryIndex[country] || {};
    const color = COLORS_QUALITATIVE[i % COLORS_QUALITATIVE.length];

    return [
      // Solid line → aging rate (left axis)
      {
        type: 'scatter', mode: 'lines+markers',
        name: country,
        x: years,
        y: years.map(y => (cData[y] && cData[y].aging_rate != null) ? cData[y].aging_rate : null),
        yaxis: 'y',
        line: { color, width: 2.5, dash: 'solid' },
        marker: { size: 4, color },
        hovertemplate: `<b>${country}</b><br>Aging Rate: %{y:.2f}%<extra></extra>`,
        legendgroup: country,
        showlegend: true,
        connectgaps: false,
      },
      // Dashed line → health expenditure (right axis)
      {
        type: 'scatter', mode: 'lines+markers',
        name: country + ' (health)',
        x: years,
        y: years.map(y => (cData[y] && cData[y].health_exp != null) ? cData[y].health_exp : null),
        yaxis: 'y2',
        line: { color, width: 2, dash: 'dot' },
        marker: { size: 3, color, symbol: 'square' },
        hovertemplate: `<b>${country}</b><br>Health Expenditure: %{y:.2f}%<extra></extra>`,
        legendgroup: country,
        showlegend: false,
        connectgaps: false,
      },
    ];
  });

  const layout = {
    ...PLOTLY_LAYOUT_BASE,
    xaxis: applyAxisStyle({ title: { text: 'Year' }, dtick: 4, tickmode: 'linear' }),
    yaxis: applyAxisStyle({
      title: { text: 'Aging Rate (% aged 65+)', font: { color: '#ea580c' } },
      tickfont: { color: '#ea580c' },
    }),
    yaxis2: {
      ...applyAxisStyle({
        title: { text: 'Health Expenditure (% of GDP)', font: { color: '#2563eb' } },
        tickfont: { color: '#2563eb' },
      }),
      overlaying: 'y',
      side: 'right',
      showgrid: false,
    },
    showlegend: true,
    legend: {
      orientation: 'h', y: -0.22,
      font: { size: 10 },
      bgcolor: 'transparent',
    },
    hovermode: 'x unified',
  };

  Plotly.react('trend-plot', traces, layout, { responsive: true, displayModeBar: false });
}
