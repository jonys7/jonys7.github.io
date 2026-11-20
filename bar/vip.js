'use strict';
const roster=document.querySelector('#vip-roster');
if(roster){
 const search=document.querySelector('#vip-search'),filter=document.querySelector('#vip-filter');
 const notice=document.querySelector('#vip-count'),empty=document.querySelector('#vip-empty');
 const todayParts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Prague',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const parts=Object.fromEntries(todayParts.map(x=>[x.type,x.value]));
 const day=s=>Math.floor(Date.parse(s+'T00:00:00Z')/86400000);
 const today=day(parts.year+'-'+parts.month+'-'+parts.day);
 const rows=[...roster.querySelectorAll('tbody tr[data-member]')].map(row=>{
  const [start,end]=[...row.querySelectorAll('time')].map(t=>day(t.getAttribute('datetime')));
  const remaining=end-today, tag=row.querySelector('[data-status]'), meta=row.querySelector('[data-days]');
  let status='inactive',tone='expired',label='Neaktivní',detail='Platnost skončila';
  if(!Number.isFinite(start)||!Number.isFinite(end)||end<start){
   detail='Neplatné datum';tone='future';
  }else if(start>today){
   tone='future';detail='Platnost ještě nezačala';
  }else if(remaining>=0&&remaining<=30){
   status='ending';tone=remaining<=10?'urgent':'soon';label='Brzy končí';
   detail=remaining===0?'Končí dnes':remaining===1?'Zbývá 1 den':remaining<=4?'Zbývají '+remaining+' dny':'Zbývá '+remaining+' dní';
  }else if(remaining>30){
   status='active';tone='active';label='Aktivní';detail='';
  }
  row.dataset.tone=tone;tag.textContent=label;meta.textContent=detail;
  return {row,status,name:normalize(row.querySelector('th').textContent)};
 });
 function normalize(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('cs').trim();}
 function apply(){
  const q=normalize(search.value),selected=filter.value;
  let count=0;
  for(const {row,status,name} of rows){row.hidden=!name.includes(q)||(selected!=='all'&&selected!==status);if(!row.hidden)count++;}
  notice.textContent='Zobrazeno '+count+' z '+rows.length;
  empty.hidden=count>0;
 }
 search.addEventListener('input',apply);filter.addEventListener('change',apply);apply();
}
