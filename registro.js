const PUBLIC_BASE_URL = 'https://tarjeta.communet.info';
const form = document.querySelector('#clientForm');
const success = document.querySelector('#success');
const message = document.querySelector('#formMessage');

function normalizePhone(value) { return value.replace(/\D/g, ''); }
function normalizeName(value) { return value.trim().toLocaleLowerCase('es-MX').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' '); }
function makeFolio() { const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let code='BS-'; for(let i=0;i<6;i+=1) code+=chars[Math.floor(Math.random()*chars.length)]; return code; }
function getClients() { return JSON.parse(localStorage.getItem('bicha-clientes') || '{}'); }
function saveClients(clients) { localStorage.setItem('bicha-clientes', JSON.stringify(clients)); }
function showCard(client) {
  const cardUrl = `${PUBLIC_BASE_URL}/index.html?folio=${encodeURIComponent(client.folio)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=12&data=${encodeURIComponent(cardUrl)}`;
  document.querySelector('#folio').textContent=client.folio; document.querySelector('#qrImage').src=qrUrl; document.querySelector('#cardLink').href=cardUrl;
  form.closest('.signup-card').classList.add('is-success'); form.hidden=true; success.hidden=false; message.textContent='';
}
form.addEventListener('submit',(event)=>{
  event.preventDefault();
  const values=new FormData(form); const name=String(values.get('name')).trim(); const phone=String(values.get('phone')).trim(); const phoneKey=normalizePhone(phone); const nameKey=normalizeName(name); const clients=getClients();
  if(phoneKey.length<10){ message.textContent='Captura un número de teléfono válido de al menos 10 dígitos.'; message.style.color='#a74568'; return; }
  const existing=Object.values(clients).find((client)=>client.phoneKey===phoneKey || (client.nameKey===nameKey && client.phone===phone));
  if(existing){ showCard(existing); message.textContent='Esta clienta ya está registrada. Se mostró su tarjeta existente.'; return; }
  let folio=makeFolio(); while(clients[folio]) folio=makeFolio();
  const client={folio,name,phone,phoneKey,nameKey,createdAt:new Date().toISOString(),visits:[]}; clients[folio]=client; saveClients(clients); localStorage.setItem('bicha-demo-card',JSON.stringify(client)); showCard(client);
});
document.querySelector('#newClient').addEventListener('click',()=>{form.reset();form.hidden=false;success.hidden=true;form.closest('.signup-card').classList.remove('is-success');});
