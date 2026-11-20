'use strict';
function selectGroup(selector,key,callback){
 const controls=[...document.querySelectorAll(selector)];
 if(!controls.length)return;
 const select=control=>{for(const c of controls)c.setAttribute('aria-pressed',String(c===control));callback(control.dataset[key]);};
 controls.forEach(c=>c.addEventListener('click',()=>select(c)));select(controls[0]);
}
const money=new Intl.NumberFormat('cs-CZ',{maximumFractionDigits:0});
selectGroup('[data-menu]','menu',name=>{for(const p of document.querySelectorAll('[data-panel]'))p.hidden=p.dataset.panel!==name;});
selectGroup('[data-term]','term',term=>{for(const p of document.querySelectorAll('[data-prices]'))p.textContent=money.format(Number(p.dataset.prices.split(',')[term]))+' $';});
const days=['Pondělí','Úterý','Středa','Čtvrtek','Pátek','Sobota','Neděle'];
const week=document.querySelector('#week');
const dayNames=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const currentDay=dayNames.indexOf(new Intl.DateTimeFormat('en-GB',{weekday:'short',timeZone:'Europe/Prague'}).format(new Date()));
const dialog=document.querySelector('#foto'), photo=dialog.querySelector('img'), controls=dialog.querySelector('.photo-controls');
const photos=[...document.querySelectorAll('.gallery-photo')]; let at=-1;
function openPhoto(src,alt,index=-1){at=index;photo.src=src;photo.alt=alt;controls.hidden=index<0;dialog.querySelector('#photo-caption').textContent=alt;if(!dialog.open)dialog.showModal();}
function step(by){const i=(at+by+photos.length)%photos.length;const a=photos[i];openPhoto(a.href,a.querySelector('img').alt,i);}
for(const link of document.querySelectorAll('[data-photo]'))link.addEventListener('click',event=>{if(event.ctrlKey||event.altKey||event.metaKey||event.shiftKey)return;event.preventDefault();openPhoto(link.href,link.dataset.alt||link.querySelector('img').alt,photos.indexOf(link));});
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
for(const b of controls.querySelectorAll('[data-step]'))b.addEventListener('click',()=>step(Number(b.dataset.step)));
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
dialog.addEventListener('keydown',e=>{if(at>=0&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();step(e.key==='ArrowLeft'?-1:1);}});
for(let i=0;i<days.length;i++){
 const event=window.SANCTUARY_PROGRAM?.[i]||{}, card=document.createElement('article');
  card.className='day';card.dataset.weekday=dayNames[i];
 const heading=document.createElement('h3');heading.textContent=days[i];card.append(heading);
 if(i===currentDay){
  card.classList.add('today');card.setAttribute('aria-current','date');
  const badge=document.createElement('span');badge.className='today-badge';badge.textContent='Dnes';card.append(badge);
 }
 const flyer=typeof event.flyer==='string'&&((/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/).test(event.flyer)||/^(?:https:\/\/|assets\/)[^\s]+$/.test(event.flyer))?event.flyer:'';
 if(flyer){const a=document.createElement('a'),img=document.createElement('img');a.href=flyer;img.src=flyer;img.alt=event.title||'Leták na '+days[i].toLowerCase();img.loading='lazy';a.append(img);a.addEventListener('click',e=>{e.preventDefault();openPhoto(a.href,img.alt);});card.append(a);}
  else if(!event.title){const q=document.createElement('span');q.className='placeholder';q.setAttribute('aria-hidden','true');q.textContent='?';card.append(q);}
 if(event.title){card.classList.add('event');if(event.time){const t=document.createElement('time');t.textContent=event.time;t.dateTime=event.time;card.append(t);}}
 const label=document.createElement('p');label.textContent=event.title||'Zatím bez akce';card.append(label);if(event.description){const d=document.createElement('p');d.className='event-description';d.textContent=event.description;card.append(d);}week.append(card);
}




