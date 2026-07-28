const API_URL = 'https://script.google.com/macros/s/AKfycbxo5714fCDqTJJzeQsbRzD8C79-AlCKNc5msIlRc4Xz6EXk1kRp3HmDpejZuST-t1_-/exec';
const TOTAL_STAMPS = 10;
const folio = new URLSearchParams(window.location.search).get('folio');
const lockedView = document.querySelector('#lockedView');
const cardView = document.querySelector('#cardView');
const lockedTitle = document.querySelector('#lockedTitle');
const lockedMessage = document.querySelector('#lockedMessage');
function lock(title, message) { lockedTitle.textContent=title; lockedMessage.textContent=message; lockedView.hidden=false; cardView.hidden=true; }
function renderCard(client) { document.querySelector('#clientName').textContent=client.name; document.querySelector('#clientFolio').textContent=client.folio; document.querySelector('#stamps').innerHTML=Array.from({length:TOTAL_STAMPS},(_,index)=>{const filled=index<client.visits;return `<span class="overlay-stamp ${filled?'filled':''}" aria-label="Sello ${index+1}${filled?': registrado':': pendiente'}">${filled?'♥':'♡'}</span>`;}).join(''); cardView.hidden=false; lockedView.hidden=true; }
function lookupClient() {
  const callbackName=`bichaSecureLookup_${Date.now()}`; const script=document.createElement('script'); const query=`${API_URL}?action=client&folio=${encodeURIComponent(folio)}&callback=${callbackName}`;
  const timeout=setTimeout(()=>{cleanup();lock('No se pudo consultar la tarjeta','Intenta nuevamente en unos segundos.');},8000);
  function cleanup(){clearTimeout(timeout);delete window[callbackName];script.remove();}
  window[callbackName]=(response)=>{cleanup();if(response?.ok&&response?.found&&Number(response.visits)>0)renderCard({name:response.name,folio:response.folio,visits:Number(response.visits)});else lock('Tarjeta pendiente de activación','Tu registro está guardado, pero la administradora todavía no ha registrado una visita.');};
  script.onerror=()=>{cleanup();lock('No se pudo consultar la tarjeta','Intenta nuevamente en unos segundos.');}; script.src=query; document.head.appendChild(script);
}
if(!folio) lock('Necesitas un enlace personal','Esta tarjeta solo puede abrirse desde el QR asignado a la clienta.'); else lookupClient();
