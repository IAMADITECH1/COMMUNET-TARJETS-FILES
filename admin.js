const API_URL = 'https://script.google.com/macros/s/AKfycbxGwJuTev96tzN39kLuxQu0WO6JvWRahQ7dQg2DzA9CqIWbeUwmf-YHTUbRTSYHHNe5/exec';
const DEMO_ADMIN_KEY = 'BICHA-DEMO';
const form = document.querySelector('#adminForm');
const message = document.querySelector('#message');
const lastRegistration = document.querySelector('#lastRegistration');
function getCard() { return JSON.parse(localStorage.getItem('bicha-demo-card') || 'null') || { name:'Nombre de clienta', folio:'BS-DEMO-001', visits:[] }; }
function showLast(card) { const last=card.visits[card.visits.length-1]; if(last) lastRegistration.textContent=`${card.name} · Ticket ${last.ticket} · Socia: ${last.partner} · Sellos: ${card.visits.length}/10`; }
async function sendToGoogleSheets(payload) { await fetch(API_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)}); }
form.addEventListener('submit',async(event)=>{
  event.preventDefault(); const values=new FormData(form); const adminKey=String(values.get('adminKey')).trim(); const name=String(values.get('clientName')).trim(); const folio=String(values.get('clientFolio')).trim().toUpperCase(); const ticket=String(values.get('ticket')).trim(); const partner=String(values.get('partner')).trim(); const card=getCard();
  if(adminKey!==DEMO_ADMIN_KEY){message.textContent='Clave incorrecta para esta demostración. Usa BICHA-DEMO.';message.style.color='#a74568';return;}
  if(card.visits.some((visit)=>visit.ticket.toLowerCase()===ticket.toLowerCase())){message.textContent='Ese folio de ticket ya fue registrado localmente.';message.style.color='#a74568';return;}
  if(card.visits.length>=10){message.textContent='Esta tarjeta ya completó sus 10 sellos.';message.style.color='#a74568';return;}
  const now=new Date(); const payload={personal:partner,idPersonal:adminKey,ticket,cliente:name,idCliente:folio,compra:'Visita registrada',fechaServicio:now.toISOString()}; message.textContent='Enviando registro a Google Sheets...'; message.style.color='#684a56';
  try { await sendToGoogleSheets(payload); card.name=name; card.folio=folio; card.visits.push({ticket,partner,date:now.toISOString()}); localStorage.setItem('bicha-demo-card',JSON.stringify(card)); const clients=JSON.parse(localStorage.getItem('bicha-clientes')||'{}'); if(clients[folio]){clients[folio].name=name;clients[folio].visits=card.visits;localStorage.setItem('bicha-clientes',JSON.stringify(clients));} message.textContent=`Visita enviada. Sellos: ${card.visits.length}/10.`; message.style.color='#55784d'; showLast(card); form.reset(); } catch(error) { message.textContent='No se pudo conectar con Google Sheets. Revisa la URL del Apps Script.'; message.style.color='#a74568'; }
});
showLast(getCard());
