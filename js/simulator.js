// ════════════════════════════════════════════════════════
// SECTION 5: POLICY SCENARIO SIMULATOR
// ════════════════════════════════════════════════════════

function initSimulator() {
  const sel = document.getElementById('sim-country');
  GDP_REFERENCE.forEach((item, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${item.display} — $${item.gdp.toLocaleString()}B`;
    if (item.country === 'China') opt.selected = true;
    sel.appendChild(opt);
  });
  updateSim();
}

function updateSim() {
  const delta  = +document.getElementById('sim-delta').value;
  const idx    = +document.getElementById('sim-country').value;
  const ref    = GDP_REFERENCE[idx];
  const gdpB   = ref.gdp;

  document.getElementById('sim-delta-val').textContent = '+' + delta.toFixed(1) + '%';
  document.getElementById('sim-country-gdp').textContent = '$' + gdpB.toLocaleString() + 'B GDP (2022)';

  const COEF  = 0.2367;
  const SE    = 0.0435;
  const effPP = COEF * delta;
  const ciLo  = (COEF - 1.96 * SE) * delta;
  const ciHi  = (COEF + 1.96 * SE) * delta;

  const extraBn = (effPP / 100) * gdpB;

  document.getElementById('sim-effect-num').textContent  = '+' + effPP.toFixed(3) + ' pp';
  document.getElementById('sim-spending-num').textContent = '$' + formatBn(extraBn);
  document.getElementById('sim-ci').textContent =
    `95% CI: [+${ciLo.toFixed(3)}, +${ciHi.toFixed(3)}] pp  ·  ` +
    `spending range: $${formatBn((ciLo/100)*gdpB)} – $${formatBn((ciHi/100)*gdpB)}`;

  REF_ITEMS.forEach(item => {
    const count = extraBn / item.cost;
    document.getElementById('ref-count-' + item.id).textContent = formatCount(count);
  });
}

function formatBn(v) {
  if (v >= 1000) return (v / 1000).toFixed(1) + 'T';
  if (v >= 1)    return v.toFixed(1) + 'B';
  return (v * 1000).toFixed(0) + 'M';
}

function formatCount(n) {
  if (n >= 1e6)  return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3)  return (n / 1e3).toFixed(1) + 'k';
  if (n >= 10)   return Math.round(n).toString();
  if (n >= 1)    return n.toFixed(1);
  return '< 1';
}
