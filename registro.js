const PUBLIC_BASE_URL = 'https://tarjeta.communet.info';
const form = document.querySelector('#clientForm');
const success = document.querySelector('#success');
const message = document.querySelector('#formMessage');
function makeFolio() { const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let code='BS-'; for(let i=0;i<6;i+=1) code+=chars[Math.floor(Math.random()*chars.length)]; return code; }
function getClients() { return JSON.parse(localStorage.getItem('bicha-clientes') || '{}'); }
function saveClients(clients) { localStorage.setItem('bicha-clientes', JSON.stringify(clients)); }
form.addEventListener('submit',(event)=>{ event.preventDefault(); const values=new FormData(form); const name=String(values.get('name')).trim(); const phone=String(values.get('phone')).trim(); const clients=getClients(); let folio=makeFolio(); while(clients[folio]) folio=makeFolio(); clients[folio]={folio,name,phone,createdAt:new Date().toISOString(),visits:[]}; saveClients(clients); localStorage.setItem('bicha-demo-card',JSON.stringify(clients[folio])); const cardUrl=`${PUBLIC_BASE_URL}/index.html?folio=${encodeURIComponent(folio)}`; const qrUrl=`https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=12&data=${encodeURIComponent(cardUrl)}`; document.querySelector('#folio').textContent=folio; document.querySelector('#qrImage').src=qrUrl; document.querySelector('#cardLink').href=cardUrl; form.closest('.signup-card').classList.add('is-success'); form.hidden=true; success.hidden=false; message.textContent=''; });
document.querySelector('#newClient').addEventListener('click',()=>{ form.reset(); form.hidden=false; success.hidden=true; form.closest('.signup-card').classList.remove('is-success'); });
