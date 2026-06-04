// ════════════════════════════════════════════════════════
// SECTION 4: MODEL RESULTS
// ════════════════════════════════════════════════════════

function renderCoefPlot() {
  const labels = COEF_DETAIL.map(d => d.label);
  const coefs  = COEF_DETAIL.map(d => d.coef);
  const errors = COEF_DETAIL.map(d => d.se * 1.96);
  const colors = COEF_DETAIL.map(d =>
    d.pval < 0.001 ? '#2563eb' : d.pval < 0.05 ? '#16a34a' : d.pval < 0.1 ? '#ca8a04' : '#9aa0b4'
  );

  const traces = [{
    type: 'scatter', mode: 'markers',
    x: coefs, y: labels,
    error_x: { type: 'data', array: errors, visible: true, color: '#9aa0b4', thickness: 2, width: 6 },
    marker: { color: colors, size: 10, symbol: 'circle' },
    hovertemplate: '<b>%{y}</b><br>Coef: %{x:.4f}<extra></extra>',
    orientation: 'h',
  }];

  const layout = {
    ...PLOTLY_LAYOUT_BASE,
    margin: { t: 20, r: 30, b: 40, l: 140 },
    xaxis: applyAxisStyle({
      title: { text: 'Coefficient (95% CI)' },
      zeroline: true, zerolinewidth: 1.5, zerolinecolor: '#ea580c',
    }),
    yaxis: applyAxisStyle({ zeroline: false, automargin: true }),
    shapes: [{
      type: 'line', x0: 0, x1: 0, y0: -0.5, y1: COEF_DETAIL.length - 0.5,
      line: { color: '#ea580c', width: 1.5, dash: 'dot' },
    }],
    annotations: [{
      x: 0.01, y: -0.5 + COEF_DETAIL.length,
      xref: 'paper', yref: 'y',
      text: '← Negative   Positive →',
      showarrow: false,
      font: { size: 9, color: '#9aa0b4', family: "'DM Mono', monospace" },
    }],
  };

  Plotly.newPlot('coef-plot', traces, layout, { responsive: true, displayModeBar: false });
}

function renderModelComparisonPlot() {
  const preferred = MODEL_DATA.find(m => m.preferred);
  const others    = MODEL_DATA.filter(m => !m.preferred);
  const allModels = [preferred, ...others];
  const barColors = allModels.map(m =>
    m.preferred ? '#2563eb' : (m.sig === 'ns' ? '#9aa0b4' : '#93afd4')
  );

  const traces = [{
    type: 'bar',
    x: allModels.map(m => m.coef),
    y: allModels.map(m => m.model),
    orientation: 'h',
    error_x: {
      type: 'data', array: allModels.map(m => m.se * 1.96),
      visible: true, color: '#9aa0b4', thickness: 1.5, width: 5,
    },
    marker: { color: barColors, opacity: allModels.map(m => m.preferred ? 1 : 0.6) },
    hovertemplate: '<b>%{y}</b><br>Coef: %{x:.4f}<extra></extra>',
  }];

  const layout = {
    ...PLOTLY_LAYOUT_BASE,
    margin: { t: 20, r: 30, b: 40, l: 110 },
    xaxis: applyAxisStyle({
      title: { text: 'Coef. of aging_rate (95% CI)' },
      zeroline: true, zerolinewidth: 1.5, zerolinecolor: '#dcdad4',
    }),
    yaxis: applyAxisStyle({ zeroline: false, automargin: true }),
    shapes: [{
      type: 'rect',
      x0: preferred.coef - preferred.se * 1.96,
      x1: preferred.coef + preferred.se * 1.96,
      y0: -0.5, y1: allModels.length - 0.5,
      fillcolor: 'rgba(37,99,235,0.06)', line: { width: 0 },
    }],
  };

  Plotly.newPlot('model-comparison-plot', traces, layout, { responsive: true, displayModeBar: false });
}

function renderCoefTable() {
  const interps = {
    aging_rate:  'Each +1 pp ageing rate → +0.237 pp health exp/GDP',
    log_gdp_pc:  'GDP per capita not significant within countries',
    urban:       'Urbanisation not significant within countries',
    beds:        'More beds marginally associated with lower spending (efficiency)',
  };

  const tbody = document.getElementById('coef-tbody');
  COEF_DETAIL.forEach(d => {
    const tr = document.createElement('tr');
    if (d.var === 'aging_rate') tr.className = 'highlight';
    const coefClass = d.coef > 0 ? (d.pval < 0.05 ? 'coef-pos' : 'coef-insig')
                                  : (d.pval < 0.05 ? 'coef-neg' : 'coef-insig');
    const sigClass  = d.pval < 0.001 ? 'sig-star' : 'sig-ns';
    tr.innerHTML = `
      <td style="color:var(--text)">${d.label}</td>
      <td class="${coefClass}">${d.coef > 0 ? '+' : ''}${d.coef.toFixed(4)}</td>
      <td>${d.se.toFixed(4)}</td>
      <td>${d.tstat > 0 ? '+' : ''}${d.tstat.toFixed(3)}</td>
      <td>${d.pval < 0.001 ? '<0.001' : d.pval.toFixed(3)}</td>
      <td class="${sigClass}">${d.sig || 'ns'}</td>
      <td style="color:var(--text-dim);font-size:11px;max-width:260px;">${interps[d.var]}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderModelTable() {
  const roles = {
    'Pooled OLS':       'Baseline — ignores panel structure',
    'Random Effects':   'Comparison model',
    'Country FE':       'Preferred — absorbs time-invariant country effects',
    'Two-way FE':       'Supplementary — ageing collinear with year FEs †',
    'First Difference': 'Robustness check (first-differenced)',
  };

  const tbody = document.getElementById('model-tbody');
  MODEL_DATA.forEach(d => {
    const tr = document.createElement('tr');
    if (d.preferred) tr.className = 'preferred';
    const sigClass = d.sig === 'ns' ? 'sig-ns' : 'sig-star';
    tr.innerHTML = `
      <td style="color:var(--text);font-weight:${d.preferred ? '600' : '400'}">${d.model}${d.preferred ? ' ⭐' : ''}</td>
      <td style="color:var(--text-dim);font-size:11px;">${roles[d.model]}</td>
      <td style="color:${d.preferred ? 'var(--accent)' : 'var(--text-dim)'}">${d.coef.toFixed(4)}</td>
      <td>${d.se.toFixed(4)}</td>
      <td>${d.pval < 0.001 ? '<0.001' : d.pval.toFixed(3)}</td>
      <td class="${sigClass}">${d.sig}</td>
      <td>${d.r2 != null ? d.r2.toFixed(4) : '—'}</td>
    `;
    tbody.appendChild(tr);
  });
}
