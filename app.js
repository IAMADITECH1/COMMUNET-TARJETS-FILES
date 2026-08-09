const API_URL='https://script.google.com/macros/s/AKfycbxtffspuIEkJKnGCHBpFbLwNdp6zIoEsp8pvB3nXBosAoz03IvjItDvC50D6cK08TEb/exec';
const TOTAL_STAMPS=4;
const folio=new URLSearchParams(location.search).get('folio');
const lockedView=document.querySelector('#lockedView');
const cardView=document.querySelector('#cardView');
const lockedTitle=document.querySelector('#lockedTitle');
const lockedMessage=document.querySelector('#lockedMessage');
function lock(title,message){lockedTitle.textContent=title;lockedMessage.textContent=message;lockedView.hidden=false;cardView.hidden=true;}
function render(c){
  document.querySelector('#clientName').textContent=c.name;
  document.querySelector('#clientFolio').textContent=c.folio;
  document.querySelector('#stamps').innerHTML=Array.from({length:TOTAL_STAMPS},(_,i)=>{const filled=i<c.visits;return `<span class="overlay-stamp ${filled?'filled':''}" aria-label="Sello ${i+1}">${filled?'♥':'♡'}</span>`;}).join('');
  const reward=document.querySelector('#rewardView');
  if(c.visits>=4){reward.hidden=false;reward.innerHTML='<strong>¡Beneficio desbloqueado!</strong><span>En tu próxima visita puedes elegir:</span><b>✂️ Corte para caballero</b><b>💅 Aplicación de gelish para dama</b>';}else{reward.hidden=true;reward.textContent='';}
  cardView.hidden=false;lockedView.hidden=true;
}
function lookup(){const cb=`bichaSecureLookup_${Date.now()}`,script=document.createElement('script'),timeout=setTimeout(()=>{clean();lock('No se pudo consultar la tarjeta','Intenta nuevamente en unos segundos.');},8000);function clean(){clearTimeout(timeout);delete window[cb];script.remove();}window[cb]=(result)=>{clean();if(result?.ok&&result.found&&Number(result.visits)>0)render({name:result.name,folio:result.folio,visits:Number(result.visits)});else lock('Tarjeta pendiente de activación','Tu registro está guardado, pero la administradora todavía no ha registrado una visita.');};script.onerror=()=>{clean();lock('No se pudo consultar la tarjeta','Intenta nuevamente en unos segundos.');};script.src=`${API_URL}?action=client&folio=${encodeURIComponent(folio)}&callback=${cb}`;document.head.appendChild(script);}
if(!folio)lock('Necesitas un enlace personal','Esta tarjeta solo puede abrirse desde el QR asignado a la clienta.');else lookup();