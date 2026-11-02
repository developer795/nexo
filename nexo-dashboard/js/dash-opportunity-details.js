v='detail';
cur=+new URLSearchParams(location.search).get('id')||0;
V.detail=function(){const o=D.opps.find(x=>x.id===cur),own=o&&o.created_by===nexoDB.uid;if(!SUB()&&!own){location.replace('dash-opportunities.html');return''}if(!o){location.replace('dash-opportunities.html');return''}
 return`<div class="bc"><a href="dash-opportunities.html">الفرص</a><svg width="8" height="10" fill="none" stroke="#CACFD5"><path d="M6 1L2 5l4 4"/></svg><b>${E(o.title)}</b></div>
 <div class="big"><div class="dt">${pic(o.ph,o.org)}<div><span class="bd gr" style="font-weight:600">${E(otl(o.type))}</span><h2>${E(o.title)}</h2><div class="o">${E(o.org)}</div><div>${[o.city,o.aud,o.g].filter(Boolean).map(x=>`<span class="tg">${E(x)}</span>`).join('')}</div></div></div>
 <div class="dl"><div><span>${o.n} متقدم</span><span>آخر موعد: ${E(o.due||'غير محدد')}</span></div>${own?'':`<button class="ap" ${o.ap?'disabled':''} onclick="AP(${o.id})">${o.ap?'تم التقديم':'تقديم'}</button>`}</div></div>
 <div class="big ds" style="padding:24px 20px 50px"><h2>وصف الفرصه</h2><p>${E(o.d)}</p></div>${own?'<div class="big apl" id="apl"><h2>المتقدمين</h2><p class="apx">جاري التحميل...</p></div>':''}`};
start();

/* صاحب الفرصة: قائمة المتقدمين مع قبول / رفض (جدول applications) */
let APLS=null,APLE='';
const APST={pending:['قيد المراجعة','ast-p'],accepted:['مقبول','ast-a'],rejected:['مرفوض','ast-r']};
const apday=t=>t?new Date(t).toLocaleDateString('ar-SA-u-ca-gregory-nu-latn',{day:'numeric',month:'long',year:'numeric'}):'';
function APLR(){const b=$('#apl');if(!b)return;
 if(APLE){b.innerHTML=`<h2>المتقدمين</h2><p class="apx">${E(APLE)}</p>`;return}
 if(!APLS){if(!b.dataset.loading){b.dataset.loading=1;APLLOAD()}return}
 const n=k=>APLS.filter(a=>a.st===k).length;
 b.innerHTML=`<h2>المتقدمين <small>(${APLS.length})</small></h2>${APLS.length?`<p class="apsum">مقبول ${n('accepted')} · قيد المراجعة ${n('pending')} · مرفوض ${n('rejected')}</p>`:''}<p class="aperr" role="alert"></p>
 <div class="apls">${APLS.map(a=>{const p=a.p,nm=(p&&p.n)||'مستخدم نيكسو',lbl=p?(p.kind==='team'?(p.type||'جهة'):[p.role,p.g].filter(Boolean).join(' · ')):'',href=p&&p.id!=null?(p.kind==='team'?'dash-entity-visitor.html':'dash-talent-visitor.html')+'?id='+encodeURIComponent(p.id):'',s=APST[a.st]||APST.pending;
  return`<div class="apr">${href?`<a class="apw" href="${E(href)}">`:'<div class="apw">'}${pic(p&&p.ph,nm)}<span><b>${E(nm)}</b><small>${E(lbl)}${a.at?` · قدّم ${E(apday(a.at))}`:''}</small></span>${href?'</a>':'</div>'}
  <span class="bd bl-st ${s[1]}">${s[0]}</span><div class="apbt"><button type="button" class="apok${a.st==='accepted'?' on':''}" data-u="${E(a.user_id)}" data-s="accepted" ${a.st==='accepted'?'disabled':''}>قبول</button><button type="button" class="apno${a.st==='rejected'?' on':''}" data-u="${E(a.user_id)}" data-s="rejected" ${a.st==='rejected'?'disabled':''}>رفض</button>${href?`<a class="apmsg" href="dash-messages.html?to=${encodeURIComponent(a.user_id)}">مراسلة</a>`:''}</div></div>`}).join('')||'<p class="apx">ما تقدّم أحد على هذه الفرصة بعد</p>'}</div>`}
async function APLLOAD(){try{APLS=await nexoDB.listApplicants(cur)}catch(e){console.error(e);APLE=e.message||'تعذر تحميل المتقدمين'}APLR()}
document.addEventListener('click',async e=>{const b=e.target.closest('#apl [data-s]');if(!b||b.disabled)return;
 const u=b.dataset.u,st=b.dataset.s,er=$('#apl .aperr');b.closest('.apbt').querySelectorAll('button').forEach(x=>x.disabled=true);if(er)er.textContent='';
 try{await nexoDB.setApplicationStatus(cur,u,st);const a=APLS.find(x=>x.user_id===u);if(a)a.st=st;APLR()}
 catch(x){APLR();const e2=$('#apl .aperr');if(e2)e2.textContent=x.message||'تعذر تحديث حالة الطلب'}});
const _RD=R;R=function(){_RD();if(LOADED&&!Q)APLR()};
