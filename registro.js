const API_URL='https://script.google.com/macros/s/AKfycbxtffspuIEkJKnGCHBpFbLwNdp6zIoEsp8pvB3nXBosAoz03IvjItDvC50D6cK08TEb/exec';
const form=document.querySelector('#clientForm');const message=document.querySelector('#formMessage');
form.action=API_URL;form.method='POST';form.target='_self';
const action=document.createElement('input');action.type='hidden';action.name='action';action.value='register_client';form.appendChild(action);
form.addEventListener('submit',(event)=>{const raw=String(document.querySelector('#phone').value||'');if(raw.replace(/\D/g,'').length<10){event.preventDefault();message.textContent='Captura un teléfono válido de al menos 10 dígitos.';message.style.color='#a74568';return;}message.textContent='Guardando registro...';});