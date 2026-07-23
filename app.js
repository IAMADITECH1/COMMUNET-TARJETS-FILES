const TOTAL_STAMPS = 10;
const clients = JSON.parse(localStorage.getItem('bicha-clientes') || '{}');
const folio = new URLSearchParams(window.location.search).get('folio');
const lockedView = document.querySelector('#lockedView');
const cardView = document.querySelector('#cardView');
const lockedTitle = document.querySelector('#lockedTitle');
const lockedMessage = document.querySelector('#lockedMessage');

function lock(title, message) {
  lockedTitle.textContent = title; lockedMessage.textContent = message; lockedView.hidden = false; cardView.hidden = true;
}
function renderCard(client) {
  document.querySelector('#clientName').textContent = client.name;
  document.querySelector('#clientFolio').textContent = client.folio;
  document.querySelector('#stamps').innerHTML = Array.from({length:TOTAL_STAMPS},(_,index)=>{ const filled=index<client.visits.length; return `<span class="overlay-stamp ${filled?'filled':''}" aria-label="Sello ${index+1}${filled?': registrado':': pendiente'}">${filled?'♥':'♡'}</span>`; }).join('');
  cardView.hidden = false; lockedView.hidden = true;
}

if (!folio) {
  lock('Necesitas un enlace personal', 'Esta tarjeta solo puede abrirse desde el QR asignado a la clienta.');
} else if (!clients[folio]) {
  lock('Registro no encontrado', 'El folio no está registrado en este dispositivo. Solicita un nuevo QR en recepción.');
} else if (!Array.isArray(clients[folio].visits) || clients[folio].visits.length === 0) {
  lock('Tarjeta pendiente de activación', 'Tu registro está guardado, pero la tarjeta se activará cuando administración registre tu primera visita.');
} else {
  renderCard(clients[folio]);
}
