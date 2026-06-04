// ════════════════════════════════════════════════════════
// INITIALIZATION
// ════════════════════════════════════════════════════════

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });

async function initApp() {
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  const resp = await fetch('./data/panel_data.json');
  PANEL_DATA = await resp.json();
  buildIndexes();

  await initMap();
  updateScatter();
  renderRankingChart();
  initTrendSelect();
  initSimulator();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
