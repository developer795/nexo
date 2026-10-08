// after account creation: opens the site. Change this path if you move the folders
const DONE_URL='../nexo-pages-16-20/page-16-home.html';
const $=s=>document.querySelector(s);
const CITIES=['الرياض','جدة','مكة المكرمة','المدينة المنورة','الدمام','الخبر','الظهران','الأحساء','القطيف','الجبيل','الطائف','تبوك','أبها','خميس مشيط','بريدة','عنيزة','حائل','جازان','نجران','ينبع','الباحة','عرعر','سكاكا'];
const SEL={k:'city',l:'الموقع',ph:'المدينة',sel:1};
const E=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DK='nexo_onboarding_draft';
let A={};try{A=JSON.parse(localStorage.getItem(DK))||{}}catch(e){}
const save=()=>{try{localStorage.setItem(DK,JSON.stringify(A))}catch(e){}};
const ok=c=>c.r?!!A[c.r[1]]:c.f.every(f=>(A[f.k]||'').trim());
function finish(c){
 A.type=c.type;
 try{
  localStorage.setItem('nexo_onboarding',JSON.stringify(A));localStorage.removeItem(DK);
  let D;try{D=JSON.parse(localStorage.getItem('nexo_p16_20_v3'))}catch(e){}
  if(!D||!D.opps)D={me:{},posts:[],talents:[],teams:[],opps:[]};
  if(A.type==='org')D.teams.unshift({n:A.org.trim(),type:{'فريق':'نادي','راعِ':'جهة','مقدم خدمة':'مقدم خدمة'}[A.orgPath],city:A.city});
  else Object.assign(D.me,{n:((A.fn||'')+' '+(A.ln||'')).trim()||D.me.n,role:A.path,city:A.city,s:A.status==='منضم لفريق'?'منضم لفريق':'يبحث عن فريق'});
  localStorage.setItem('nexo_p16_20_v3',JSON.stringify(D));
 }catch(e){}
 location.href=DONE_URL;
}
const Onboarding={start(c){
 if(c.r&&!A[c.r[1]]){A[c.r[1]]=c.r[2][0];save()}
 function render(){
 const narrow=innerWidth<=720,L=document.getElementById('lg');
 L.style.top=(narrow?24:c.lg[0])+'px';L.style[narrow?'right':'right']=(narrow?16:c.lg[1])+'px';
 const m=$('#m');m.style.marginTop=(narrow?110:260)+'px';
 const ab=(t,x)=>`style="top:${t}px;${x||''}"`;
 let h=`<div class="bar" aria-hidden="true">${Array.from({length:c.bar[1]},(_,i)=>`<i class="${i<c.bar[0]?'on':''}"></i>`).join('')}</div><h1 class="t" ${ab(c.t[0]+(narrow?0:0))}>${c.t[1]}</h1>`;
 if(c.s)h+=`<p class="s" ${ab(c.s[0])}>${c.s[1]}</p>`;
 if(c.r)h+=c.r[2].map((o,i)=>`<label class="rd" ${ab(c.r[0][i])}><input type="radio" name="r" value="${o}" ${A[c.r[1]]?(A[c.r[1]]===o?'checked':''):(i===0?'checked':'')}><b></b>${o}</label>`).join('');
 if(c.f)h+=c.f.map(f=>`<label class="lb" for="x${f.k}" ${ab(f.lt,`right:${f.lr}px`)}>${f.l}</label>`+(f.sel?`<div class="dd" ${ab(f.top,`right:${f.r}px;width:${f.w}px;height:66px`)}><button type="button" id="x${f.k}" class="fd ${A[f.k]?'v':''}" aria-haspopup="listbox">${A[f.k]||f.ph}</button><ul class="dl" role="listbox" hidden>${CITIES.map(x=>`<li role="option" data-v="${x}" class="${A[f.k]===x?'on':''}">${x}</li>`).join('')}</ul></div>`:`<input id="x${f.k}" class="fd" placeholder="${f.ph}" value="${E(A[f.k]||'')}" ${ab(f.top,`right:${f.r}px;width:${f.w}px`)}>`)).join('');
 h+=`<button class="bt" id="go" ${ab(c.b[0],`left:${c.b[3]}px;width:${c.b[1]}px`)}>${c.b[2]}</button>`;
 m.innerHTML=h;
 const go=$('#go'),upd=()=>{go.disabled=!ok(c);save()};upd();
 document.querySelectorAll('.rd input').forEach(i=>i.onclick=()=>{A[c.r[1]]=i.value;upd()});
 (c.f||[]).forEach(f=>{const e=$('#x'+f.k);if(f.sel){const ul=e.parentNode.querySelector('ul');e.onclick=()=>{ul.hidden=!ul.hidden};ul.querySelectorAll('li').forEach(li=>li.onclick=()=>{A[f.k]=li.dataset.v;e.textContent=li.dataset.v;e.classList.add('v');ul.hidden=true;ul.querySelectorAll('li').forEach(x=>x.classList.toggle('on',x===li));upd()});return}e.oninput=e.onchange=()=>{A[f.k]=e.value;if(e.tagName==='SELECT')e.classList.toggle('v',!!e.value);upd()}});
 go.onclick=()=>c.fin?finish(c):(location.href=c.next);
 }
 addEventListener('resize',render);
 addEventListener('click',ev=>document.querySelectorAll('.dl').forEach(u=>{if(!u.parentNode.contains(ev.target))u.hidden=true}));
 addEventListener('keydown',ev=>{if(ev.key==='Escape')document.querySelectorAll('.dl').forEach(u=>u.hidden=true)});
 render();
}};
