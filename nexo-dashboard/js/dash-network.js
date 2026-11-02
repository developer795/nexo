// صفحة شبكة التواصل: الأشخاص والجهات اللي ضفتهم من زر "تواصل" (جدول nexo_connections)
v='network';
let NW=null,NWE='',NWF='',NWQ='';
const NWCAT=[['الكل',''],['لاعبين','لاعب'],['صناع المحتوى','صانع محتوى'],['ستريمرز','ستريمر'],['الجهات','team']];
const nwcat=c=>c.p&&c.p.kind==='team'?'team':(c.p&&c.p.role)||'';
const nwname=c=>(c.p&&c.p.n)||'مستخدم نيكسو';
const nwlink=c=>c.p&&c.p.id!=null?(c.p.kind==='team'?'dash-entity-visitor.html':'dash-talent-visitor.html')+'?id='+encodeURIComponent(c.p.id):'';
const NWSEND='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>';
const NWDEL='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>';
const NWSRCH='<svg width="15" height="15" fill="none" stroke="#797992" stroke-width="2"><circle cx="6.5" cy="6.5" r="5"/><path d="M10.5 10.5l3.5 3.5"/></svg>';
V.network=function(){
 return `<h1>شبكة التواصل</h1><p class="sb">شبكة علاقاتك في مجتمع نيكسو</p>
 <div class="fl nwfl"><div id="nwch" class="nwch"></div><label class="msr nwsr">${NWSRCH}<input id="nwq" placeholder="ابحث في شبكة التواصل" aria-label="ابحث في شبكة التواصل" value="${E(NWQ)}"></label></div>
 <div class="g4 nwg" id="nwg"></div>`};
function NWR(){const g=$('#nwg');if(!g)return;
 if(NWE){$('#nwch').innerHTML='';g.innerHTML=em(E(NWE));return}
 if(!NW){g.innerHTML=em('جاري التحميل...');return}
 const n=k=>k?NW.filter(c=>nwcat(c)===k).length:NW.length;
 $('#nwch').innerHTML=NWCAT.map(([t,k])=>`<button type="button" class="ch ${NWF===k?'on':''}" data-nwf="${k}">${t}${k?` (${n(k)})`:''}</button>`).join('');
 const q=NWQ.toLowerCase(),l=NW.filter(c=>(!NWF||nwcat(c)===NWF)&&(!q||[nwname(c),c.p&&c.p.role,c.p&&c.p.type,c.p&&c.p.g,c.p&&c.p.city].filter(Boolean).join(' ').toLowerCase().includes(q)));
 g.innerHTML=l.map(c=>{const p=c.p||{},h=nwlink(c),team=p.kind==='team';
  return`<div class="card t nwc"${h?` role="link" tabindex="0" data-href="${E(h)}"`:''}><div class="cv" ${cv(p.cv)}></div>
  <div class="pmw"><button type="button" class="pmore" aria-label="خيارات" aria-haspopup="menu" aria-expanded="false" data-nwu="${E(c.user_id)}"><i></i><i></i><i></i></button><div class="pmenu" role="menu" hidden><button type="button" role="menuitem" class="nwdel"><span class="pdi">${NWDEL}</span>إزالة التواصل</button></div></div>
  ${ph(p.ph,nwname(c))}<h3>${E(nwname(c))}</h3><p class="r">${E(team?(p.type||'جهة'):(p.role||''))}</p>${!team&&p.g?`<span class="tg">${E(p.g)}</span>`:''}
  <div class="nwft"><span>${PIN} ${E(p.city||'غير محدد')}</span>${!team&&p.s?`<span class="bd ${p.s===STS[0]?'gr':'nu'}">${E(p.s)}</span>`:''}</div>
  <a class="nwmsg" href="dash-messages.html?to=${encodeURIComponent(c.user_id)}">${NWSEND} مراسلة</a></div>`}).join('')||em(NW.length?'لا يوجد أحد بهذا التصنيف':'ما أضفت أحد لشبكة تواصلك بعد. افتح ملف أي شخص واضغط "تواصل"')}
const _RN=R;R=function(){_RN();if(v==='network'&&LOADED&&!Q)NWR()};
function nwClose(){document.querySelectorAll('.nwg .pmenu:not([hidden])').forEach(x=>{x.hidden=true;x.previousElementSibling.setAttribute('aria-expanded','false')})}
document.addEventListener('click',e=>{
 const b=e.target.closest('.nwg .pmore');if(b){e.preventDefault();e.stopPropagation();const mn=b.nextElementSibling,open=mn.hidden;nwClose();if(open){mn.hidden=false;b.setAttribute('aria-expanded','true')}return}
 const d=e.target.closest('.nwdel');if(d){e.stopPropagation();const u=d.closest('.pmw').querySelector('.pmore').dataset.nwu;nwClose();NWDELC(u);return}
 if(!e.target.closest('.pmenu'))nwClose();
 const f=e.target.closest('[data-nwf]');if(f){NWF=f.dataset.nwf;NWR();return}
 const c=e.target.closest('.nwc[data-href]');if(c&&!e.target.closest('a,button'))location.href=c.dataset.href;
},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')nwClose();const c=e.target.closest&&e.target.closest('.nwc[data-href]');if(c&&e.key==='Enter'&&e.target===c)location.href=c.dataset.href});
document.addEventListener('input',e=>{if(e.target.id==='nwq'){NWQ=e.target.value.trim();NWR()}});
function NWDELC(u){const c=(NW||[]).find(x=>x.user_id===u);if(!c||!window.nexoModal)return;
 const m=nexoModal(`<h3>إزالة التواصل</h3><p>هل أنت متأكد من رغبتك في إلغاء التواصل مع ${E(nwname(c))}؟</p><p class="nxe" style="text-align:center;color:#BB0327"></p><div class="nxbt"><button type="button" class="nxo">إلغاء</button><button type="button" class="nxf">إزالة التواصل</button></div>`);
 m.querySelector('.nxf').onclick=async function(){this.disabled=true;this.textContent='جاري الإزالة...';
  try{await nexoDB.disconnect(u);NW=NW.filter(x=>x.user_id!==u);if(Array.isArray(D.following))D.following=D.following.filter(x=>x!==u);nexoCloseModal();NWR()}
  catch(er){this.disabled=false;this.textContent='إزالة التواصل';m.querySelector('.nxe').textContent=er.message||'تعذر الإزالة'}}}
start();
onReady(()=>{const t=setInterval(async()=>{if(!LOADED)return;clearInterval(t);try{NW=await nexoDB.listConnectionsOf(nexoDB.uid)}catch(e){console.error(e);NWE=e.message||'تعذر تحميل شبكة التواصل'}R()},50)});
