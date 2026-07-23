const TOTAL_STAMPS = 10;
const clients = JSON.parse(localStorage.getItem('bicha-clientes') || '{}');
const params = new URLSearchParams(window.location.search);
const requestedFolio = params.get('folio');
const state = (requestedFolio && clients[requestedFolio]) || JSON.parse(localStorage.getItem('bicha-demo-card') || 'null') || {
  name: 'Nombre de clienta', folio: 'BS-DEMO-001', visits: []
};
const $ = (selector) => document.querySelector(selector);
function renderCard() {
  $('#clientName').textContent = state.name;
  $('#clientFolio').textContent = state.folio;
  $('#stamps').innerHTML = Array.from({ length: TOTAL_STAMPS }, (_, index) => {
    const filled = index < state.visits.length;
    return `<span class="overlay-stamp ${filled ? 'filled' : ''}" aria-label="Sello ${index + 1}${filled ? ': registrado' : ': pendiente'}">${filled ? '♥' : '♡'}</span>`;
  }).join('');
}
renderCard();
