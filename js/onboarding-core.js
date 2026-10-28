// بعد إنهاء الأونبوردنق: صفحة الدخول (ثم MFA ثم الـ Dashboard)
const DONE_URL='/auth.html#/login';
// الجهات: بعد صفحة 15 تروح لاختيار الباقة (16-plans) ثم الدفع (17-payment)
const ORG_PLANS_URL='/16-plans/plans.html';
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
  // تُنقل لقاعدة البيانات تلقائيًا أول ما يدخل المستخدم الـ Dashboard (auth-guard → db.syncOnboarding)
  localStorage.setItem('nexo_onboarding',JSON.stringify(A));localStorage.removeItem(DK);
 }catch(e){}
 // الجهات: بعد إنشاء الحساب تختار الباقة وتدفع، وبعدها تسجيل الدخول
 location.href=c.type==='org'?ORG_PLANS_URL:DONE_URL;
}
// زر العودة: back = اسم الصفحة السابقة، أو -1 = يرجع للصفحة اللي قبلها في المتصفح
const BACK_SVG='<svg width="10" height="18" fill="none" stroke="#201F49" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 2l6 7-6 7"/></svg>';
function backLink(back){
 if(!back)return null;
 let a=document.getElementById('bk');
 if(!a){a=document.createElement('a');a.id='bk';a.className='back';a.innerHTML=BACK_SVG+'العودة';document.body.insertBefore(a,document.getElementById('m'))}
 if(back===-1){a.href='/1-home/home.html';a.onclick=e=>{if(history.length>1){e.preventDefault();history.back()}}}else a.href=back;
 return a;
}
function placeTop(lg){
 const narrow=innerWidth<=720,L=document.getElementById('lg'),B=document.getElementById('bk');
 L.style.top=(narrow?24:lg[0])+'px';L.style.right=(narrow?16:lg[1])+'px';
 if(B){B.style.top=(narrow?64:lg[0]+140)+'px';B.style.right=(narrow?16:lg[1])+'px'}
 return narrow;
}
const Onboarding={start(c){
 backLink(c.back);
 if(c.r&&!A[c.r[1]]){A[c.r[1]]=c.r[2][0];save()}
 function render(){
 const narrow=placeTop(c.lg);
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
