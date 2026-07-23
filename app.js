const TOTAL_STAMPS = 10;
const SHEET_ID = '1CXyRAaQXF1YWW0ZkQttnLmN2hPbRKyPJ-47oFXP98h0';
const folio = new URLSearchParams(window.location.search).get('folio');
const lockedView = document.querySelector('#lockedView');
const cardView = document.querySelector('#cardView');
const lockedTitle = document.querySelector('#lockedTitle');
const lockedMessage = document.querySelector('#lockedMessage');

function lock(title, message) { lockedTitle.textContent=title; lockedMessage.textContent=message; lockedView.hidden=false; cardView.hidden=true; }
function renderCard(client) {
  document.querySelector('#clientName').textContent=client.name;
  document.querySelector('#clientFolio').textContent=client.folio;
  document.querySelector('#stamps').innerHTML=Array.from({length:TOTAL_STAMPS},(_,index)=>{const filled=index<client.visits;return `<span class="overlay-stamp ${filled?'filled':''}" aria-label="Sello ${index+1}${filled?': registrado':': pendiente'}">${filled?'♥':'♡'}</span>`;}).join('');
  cardView.hidden=false; lockedView.hidden=true;
}
function lookupClient() {
  const callbackName=`bichaLookup_${Date.now()}`;
  const query=`select D,E,count(E) where E='${folio.replace(/'/g,"''")}' group by D,E`;
  const script=document.createElement('script');
  const timeout=setTimeout(()=>{cleanup();lock('No se pudo consultar la tarjeta','Intenta nuevamente en unos segundos.');},8000);
  function cleanup(){clearTimeout(timeout);delete window[callbackName];script.remove();}
  window[callbackName]=(response)=>{cleanup();const row=response?.table?.rows?.[0]?.c||[];const name=row[0]?.v;const id=row[1]?.v;const visits=Number(row[2]?.v||0);if(id&&visits>0)renderCard({name,folio:id,visits});else lock('Tarjeta pendiente de activación','Tu registro existe, pero la administradora todavía no ha registrado una visita.');};
  script.onerror=()=>{cleanup();lock('No se pudo consultar la tarjeta','Intenta nuevamente en unos segundos.');};
  script.src=`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=responseHandler:${callbackName}&tq=${encodeURIComponent(query)}`;
  document.head.appendChild(script);
}
if(!folio) lock('Necesitas un enlace personal','Esta tarjeta solo puede abrirse desde el QR asignado a la clienta.'); else lookupClient();
