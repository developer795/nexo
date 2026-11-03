// صفحة الاشتراك والفوترة — البيانات من جدول nexo_subscriptions
v='billing';
const BP={y:{n:'السنوية',cyc:'سنوية',base:0},m:{n:'الشهرية',cyc:'شهرية',base:0}};
const BVAT=.15;
const bday=t=>t?new Date(t).toLocaleDateString('ar-SA-u-ca-gregory-nu-latn',{day:'numeric',month:'long',year:'numeric'}):'—';
const bnum=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:2});
const BI={
 doc:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#03BB43" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
 swap:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-15-6.7L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/><path d="M21 21v-5h-5"/></svg>',
 org:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#03BB43" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>',
 ppl:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#201F49" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
 bld:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#201F49" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>',
 ok:'<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8" fill="#E0FAE0"/><path d="M4.8 8.2l2.1 2 4.3-4.4" fill="none" stroke="#03BB43" stroke-width="1.6"/></svg>',
 card:'<svg width="16" height="12" fill="none" stroke="#9A9AAE" stroke-width="1.2"><rect x=".6" y=".6" width="14.8" height="10.8" rx="1.6"/><path d="M.6 4h14.8"/></svg>',
 cal:'<svg width="14" height="14" fill="none" stroke="#9A9AAE" stroke-width="1.2"><rect x=".6" y="2" width="12.8" height="11.4" rx="1.6"/><path d="M.6 5.5h12.8M4 .5v3M10 .5v3"/></svg>',
 lock:'<svg width="13" height="15" fill="none" stroke="#9A9AAE" stroke-width="1.2"><rect x=".6" y="6" width="11.8" height="8.4" rx="1.6"/><path d="M3.3 6V4a3.2 3.2 0 016.4 0v2"/><circle cx="6.5" cy="10.2" r="1"/></svg>',
 dl:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>'
};
const BIC=()=>nexoDB.kind==='team'?BI.bld:BI.ppl;
function bplanName(s){return (nexoDB.kind==='team'?'باقة الجهات ':'باقة الأفراد ')+BP[s.plan==='m'?'m':'y'].n}
function brenew(s){
 if(s.status==='trialing')return s.trialEnd;
 if(s.status!=='active'||!s.start)return null;
 const d=new Date(s.start),now=Date.now();
 while(d.getTime()<=now){if(s.plan==='m')d.setMonth(d.getMonth()+1);else d.setFullYear(d.getFullYear()+1)}
 return d.getTime();
}
function bstate(s){
 if(!s)return['غير مشترك','nu'];
 if(s.status==='active')return['نشطة','gr'];
 if(s.status==='trialing')return s.trialEnd>Date.now()?['تجربة مجانية','gr']:['منتهية','nu'];
 return['ملغية','nu'];
}
// الفواتير: فاتورة لبداية الاشتراك (المبلغ حسب سعر الباقة، حاليًا 0)
function binvoices(s){
 if(!s||!s.start)return[];
 const p=BP[s.plan==='m'?'m':'y'],amt=s.status==='trialing'?0:Math.round(p.base*(1+BVAT)*100)/100,d=new Date(s.start);
 const no='INV-'+d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
 return[{no,date:s.start,plan:p.cyc==='سنوية'?'السنوية':'الشهرية',amt,state:s.status==='trialing'?'تجربة مجانية':'مدفوعة'}];
}
V.billing=function(){
 const s=D.sub,[st,sc]=bstate(s),inv=binvoices(s),p=s?BP[s.plan==='m'?'m':'y']:null;
 const plan=s?`<div class="bl-plan card">
   <div class="bl-ph"><span class="bl-ic">${BIC()}</span><div><small>الخطة الحالية</small><h2>${E(bplanName(s))}</h2></div><span class="bd bl-st ${sc==='gr'?'ok':'off'}">${st}</span></div>
   <div class="bl-boxes"><div><small>السعر قبل الضريبة</small><b>${bnum(p.base)} ر.س</b></div><div><small>${s.status==='trialing'?'نهاية التجربة':s.status==='active'?'التجديد القادم':'تاريخ البداية'}</small><b>${bday(s.status==='canceled'?s.start:brenew(s))}</b></div><div><small>الدورة</small><b>${p.cyc}</b></div></div>
   <div class="bl-act"><button type="button" class="bl-main" onclick="BCHANGE()">${BI.swap} تغيير الباقة</button>${s.status==='canceled'?'':`<button type="button" class="bl-link" onclick="BCANCEL()">إلغاء الاشتراك</button>`}</div>
  </div>`:`<div class="bl-plan card"><div class="bl-ph"><span class="bl-ic">${BIC()}</span><div><small>الخطة الحالية</small><h2>لا يوجد اشتراك</h2></div><span class="bd nu">غير مشترك</span></div><p class="bl-empty">اشترك في الباقة العليا للوصول إلى الفرص الحصرية.</p><div class="bl-act"><a class="bl-main" href="dash-payment.html">جرّب مجانًا</a></div></div>`;
 const pay=BPAY();
 const rows=inv.map(i=>`<tr><td dir="ltr">${E(i.no)}</td><td>${bday(i.date)}</td><td>${E(i.plan)}</td><td>${bnum(i.amt)} ر.س</td><td><span class="bd bl-st ${i.state==='مدفوعة'?'ok':'wait'}">${E(i.state)}</span></td><td><button type="button" class="bl-dl" aria-label="تنزيل الفاتورة" onclick="BINV('${E(i.no)}')">${BI.dl}</button></td></tr>`).join('');
 return`<h1>الاشتراك والفوترة</h1><p class="sb">تابع خطتك الحالية، طريقة الدفع، والفواتير من مكان واحد.</p>
 <div class="bl-top">${plan}${pay}</div>
 <div class="card bl-inv"><div class="bl-ih"><div><h3>الفواتير</h3><small>${D.me&&D.me.n?'السجل المالي لحساب '+E(D.me.n):'السجل الكامل لعمليات الدفع'}</small></div><button type="button" class="bl-out" onclick="BSTMT()" ${inv.length?'':'disabled'}>${BI.dl} تنزيل كشف الحساب</button></div>
 ${inv.length?`<div class="bl-tw"><table><thead><tr><th>رقم الفاتورة</th><th>التاريخ</th><th>الخطة</th><th>المبلغ</th><th>الحالة</th><th>تنزيل</th></tr></thead><tbody>${rows}</tbody></table></div>`:'<p class="bl-empty">لا توجد فواتير بعد</p>'}</div>`;
};
// ---------- النوافذ ----------
function BM(html){let m=document.getElementById('blm');if(!m){m=document.createElement('div');m.id='blm';m.className='blm';document.body.appendChild(m);m.addEventListener('click',e=>{if(e.target===m||e.target.closest('.blx,.blc'))m.classList.remove('on')})}
 m.innerHTML=`<div class="blb" role="dialog" aria-modal="true"><button type="button" class="blx" aria-label="إغلاق">✕</button>${html}</div>`;m.classList.add('on');return m}
const BFEAT=()=>nexoDB.kind==='team'?['إنشاء حساب جهة رسمي موثق','نشر الفرص الوظيفية والتدريبية','إنشاء ونشر الفعاليات والبطولات','التواصل مع اللاعبين وصناع المحتوى']:['وصول كامل للفرص الحصرية والموجهة','استقطاب مباشر من الأندية والجهات','فعاليات وبطولات خاصة بالمشتركين'];
function BCHANGE(){const s=D.sub;if(!s){location.href='dash-payment.html';return}
 const cur=s.status==='canceled'?'':(s.plan==='m'?'m':'y'),f=BFEAT().map(x=>`<li>${BI.ok}${E(x)}</li>`).join('');
 const card=k=>{const y=k==='y',p=BP[k],mo=Math.round(p.base/12);return`<div class="blpc${k===cur?' cur':''}"><div class="blph">${y?'وفّر 20%':'الأكثر شيوعاً'}</div><div class="blpb">
  <h4>${y?'الباقة السنوية':'الباقة الشهرية'}</h4><small>${y?'وفّر ما يعادل شهرين مجاناً مع الدفع السنوي':'اشتراك شهرياً بدون التزام طويل المدى'}</small>
  <div class="blpp"><span class="cur">ر.س</span><b>${bnum(p.base)}</b><span class="per">/ ${y?'سنوياً':'شهرياً'}</span></div>${y?`<span class="blps">${bnum(mo)} ر.س / شهرياً — بدلاً من ${bnum(BP.m.base)} ر.س</span>`:''}
  <ul>${f}</ul><button type="button" class="blpbtn" data-k="${k}" ${k===cur?'disabled':''}>${k===cur?'الباقة الحالية':'اشترك الآن'}</button></div></div>`};
 const m=BM(`<div class="blpl"><span class="blpt">خطط الاشتراك</span><h3>${nexoDB.kind==='team'?'اختر الباقة المناسبة لجهتك':'اختر الباقة المناسبة لك'}</h3><div class="blpg">${card('y')}${card('m')}</div><p class="blerr" role="alert"></p></div>`);
 m.querySelector('.blb').classList.add('wide');
 // "اشترك الآن" يودّي لصفحة الدفع بالباقة اللي اختارها
 m.querySelectorAll('.blpbtn:not([disabled])').forEach(b=>b.onclick=function(){location.href='dash-payment.html?plan='+this.dataset.k+'&change=1'})}
function BCANCEL(){const m=BM(`<h3>إلغاء الاشتراك</h3><p>هل أنت متأكد من إلغاء اشتراكك؟ راح تفقد الوصول للفرص الحصرية.</p><p class="blerr" role="alert"></p><div class="blbt"><button type="button" class="blc">تراجع</button><button type="button" class="blok bldanger">إلغاء الاشتراك</button></div>`);
 m.querySelector('.blok').onclick=async function(){this.disabled=true;try{D.sub=await nexoDB.cancelSubscription();m.classList.remove('on');R()}catch(e){m.querySelector('.blerr').textContent=e.message||'تعذر الإلغاء';this.disabled=false}}}
// ---------- التنزيل ----------
function BSAVE(name,type,text){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+text],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function BINV(no){const i=binvoices(D.sub).find(x=>x.no===no);if(!i)return;const who=(D.me&&D.me.n)||'';const email=(nexoDB.user&&nexoDB.user.email)||'';
 BSAVE(no+'.html','text/html;charset=utf-8',`<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><title>${E(no)}</title><body style="font-family:Tahoma,sans-serif;max-width:640px;margin:40px auto;color:#000"><h1 style="color:#201F49">NEXO</h1><h2>فاتورة ${E(no)}</h2><p>التاريخ: ${bday(i.date)}</p><p>العميل: ${E(who)} ${E(email)}</p><table style="width:100%;border-collapse:collapse" border="1" cellpadding="8"><tr><th>الوصف</th><th>المبلغ</th></tr><tr><td>${E(bplanName(D.sub))} (${E(i.state)})</td><td>${bnum(i.amt)} ر.س</td></tr></table><p>الإجمالي شامل الضريبة: ${bnum(i.amt)} ر.س</p></body></html>`)}
function BSTMT(){const rows=binvoices(D.sub).map(i=>[i.no,bday(i.date),i.plan,bnum(i.amt)+' SAR',i.state].join(','));BSAVE('nexo-statement.csv','text/csv;charset=utf-8',['رقم الفاتورة,التاريخ,الخطة,المبلغ,الحالة'].concat(rows).join('\n'))}
// ---------- طريقة الدفع ----------
let BCARD;// undefined = لسا ما تحمّل
const BLOGO={mastercard:'<span class="bl-mc"><i></i><i></i></span>',visa:'<span class="bl-vi">VISA</span>',mada:'<span class="bl-md"><i></i><i></i><b>mada</b></span>',amex:'<span class="bl-vi">AMEX</span>',card:''};
const BNAME={mastercard:'Mastercard',visa:'Visa',mada:'مدى',amex:'American Express',card:'بطاقة'};
function BPAY(){const c=BCARD;
 const head=`<div class="bl-pyh"><div><h3>طريقة الدفع</h3><small>البطاقة الافتراضية للفوترة</small></div><button type="button" class="bl-upd" onclick="BCARDM()">تحديث</button></div>`;
 const body=c?`<div class="bl-cc">${BLOGO[c.brand]||''}<div><b dir="ltr">•••• •••• •••• ${E(c.last4)}</b><small><span dir="ltr">${E(BNAME[c.brand]||'')}</span> · تنتهي <span dir="ltr">${String(c.exp_month).padStart(2,'0')} / ${String(c.exp_year).slice(-2)}</span></small></div></div>`
  :`<div class="bl-cc"><span class="bl-mc"><i></i><i></i></span><div><b dir="ltr">•••• •••• •••• ••••</b><small>${BCARD===undefined?'جاري التحميل...':'لا توجد بطاقة محفوظة'}</small></div></div>`;
 return`<div class="bl-pay card">${head}${body}</div>`}
function BCARDM(){
 const m=BM(`<div class="blcm"><h3>طريقة الدفع</h3><p class="blcs">اختار طريقة الدفع المناسبة لك</p>
 <div class="blpm"><b>طرق الدفع المدعومة</b><span class="mada" aria-label="مدى"><span class="mdt"><b>مدى</b><b>mada</b></span><span class="mdb"><i></i><i></i></span></span></div>
 <form class="blcf2" novalidate><div class="cbox">
 <label for="bcn">رقم البطاقة</label><div class="fi">${BI.card}<input id="bcn" inputmode="numeric" autocomplete="cc-number" dir="ltr" maxlength="23" placeholder="0000  0000  0000  0000"></div>
 <div class="g2f"><div><label for="bce">تاريخ الانتهاء</label><div class="fi">${BI.cal}<input id="bce" inputmode="numeric" autocomplete="cc-exp" dir="ltr" maxlength="7" placeholder="MM / YY"></div></div>
 <div><label for="bcc">رمز الأمان</label><div class="fi">${BI.lock}<input id="bcc" inputmode="numeric" autocomplete="cc-csc" dir="ltr" maxlength="4" placeholder="CVC"></div></div></div>
 <label for="bch">اسم حامل البطاقة</label><div class="fi"><input id="bch" autocomplete="cc-name" placeholder="الاسم كما يظهر على البطاقة"></div></div>
 <p class="blerr" role="alert"></p><button class="blupd">تحديث</button></form></div>`);
 m.querySelector('.blb').classList.add('mid');
 const f=m.querySelector('form'),cn=f.querySelector('#bcn'),ce=f.querySelector('#bce'),cc=f.querySelector('#bcc'),ch=f.querySelector('#bch'),er=f.querySelector('.blerr');
 cn.oninput=()=>{cn.value=cn.value.replace(/\D/g,'').slice(0,19).replace(/(\d{4})(?=\d)/g,'$1  ')};
 ce.oninput=()=>{let x=ce.value.replace(/\D/g,'').slice(0,4);ce.value=x.length>2?x.slice(0,2)+' / '+x.slice(2):x};
 cc.oninput=()=>{cc.value=cc.value.replace(/\D/g,'').slice(0,4)};
 cn.focus();
 f.onsubmit=async e=>{e.preventDefault();const n=cn.value.replace(/\D/g,''),[mm,yy]=ce.value.split('/').map(x=>+x.trim());
  const luhn=d=>{let s=0,t=0;for(let i=d.length-1;i>=0;i--){let x=+d[i];if(t&&(x*=2)>9)x-=9;s+=x;t^=1}return s%10===0};
  if(n.length<13||!luhn(n)){er.textContent='رقم البطاقة غير صحيح';cn.focus();return}
  if(!(mm>=1&&mm<=12)||isNaN(yy)||new Date(2000+yy,mm)<=new Date()){er.textContent='تاريخ الانتهاء غير صحيح';ce.focus();return}
  if(!/^\d{3,4}$/.test(cc.value)){er.textContent='رمز الأمان غير صحيح';cc.focus();return}
  if(!ch.value.trim()){er.textContent='اكتب اسم حامل البطاقة';ch.focus();return}
  // نحفظ آخر 4 أرقام والنوع والانتهاء بس — الرقم الكامل ورمز الأمان ما يطلعون من المتصفح
  const card=CARDSUM(n,mm,yy);cn.value='';ce.value='';cc.value='';
  const b=f.querySelector('.blupd');b.disabled=true;
  try{await nexoDB.saveCard(card);BCARD=card;m.classList.remove('on');R()}catch(x){er.textContent=x.message||'تعذر الحفظ';b.disabled=false}};
}
onReady(()=>{(nexoDB.getCard?nexoDB.getCard():Promise.resolve(null)).then(c=>{BCARD=c||null;if(LOADED)R();else{const t=setInterval(()=>{if(LOADED){clearInterval(t);R()}},50)}})});
start();
