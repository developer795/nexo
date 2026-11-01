// صفحة الاشتراك والفوترة — البيانات من جدول nexo_subscriptions
v='billing';
const BP={y:{n:'السنوية',cyc:'سنوية',base:0},m:{n:'الشهرية',cyc:'شهرية',base:0}};
const BVAT=.15;
const bday=t=>t?new Date(t).toLocaleDateString('ar-SA-u-ca-gregory-nu-latn',{day:'numeric',month:'long',year:'numeric'}):'—';
const bnum=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:2});
const BI={
 doc:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#03BB43" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
 swap:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-15-6.7L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/><path d="M21 21v-5h-5"/></svg>',
 dl:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>'
};
function bplanName(s){return (nexoDB.kind==='team'?'باقة الجهات ':'الباقة العليا ')+BP[s.plan==='m'?'m':'y'].n}
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
   <div class="bl-ph"><span class="bl-ic">${BI.doc}</span><div><small>الخطة الحالية</small><h2>${E(bplanName(s))}</h2></div><span class="bd ${sc}">${st}</span></div>
   <div class="bl-boxes"><div><small>السعر قبل الضريبة</small><b>${bnum(p.base)} ر.س</b></div><div><small>${s.status==='trialing'?'نهاية التجربة':s.status==='active'?'التجديد القادم':'تاريخ البداية'}</small><b>${bday(s.status==='canceled'?s.start:brenew(s))}</b></div><div><small>الدورة</small><b>${p.cyc}</b></div></div>
   <div class="bl-act"><button type="button" class="bl-main" onclick="BCHANGE()">${BI.swap} تغيير الخطة</button>${s.status==='canceled'?'':`<button type="button" class="bl-link" onclick="BCANCEL()">إلغاء الاشتراك</button>`}</div>
  </div>`:`<div class="bl-plan card"><div class="bl-ph"><span class="bl-ic">${BI.doc}</span><div><small>الخطة الحالية</small><h2>لا يوجد اشتراك</h2></div><span class="bd nu">غير مشترك</span></div><p class="bl-empty">اشترك في الباقة العليا للوصول إلى الفرص الحصرية.</p><div class="bl-act"><a class="bl-main" href="dash-payment.html">جرّب مجانًا</a></div></div>`;
 const pay=`<div class="bl-pay card"><div class="bl-pyh"><div><h3>طريقة الدفع</h3><small>البطاقة الافتراضية للفوترة</small></div></div>
   <div class="bl-cc"><span class="bl-mc"><i></i><i></i></span><div><b dir="ltr">•••• •••• •••• ••••</b><small>لا توجد بطاقة محفوظة</small></div></div></div>`;
 const rows=inv.map(i=>`<tr><td dir="ltr">${E(i.no)}</td><td>${bday(i.date)}</td><td>${E(i.plan)}</td><td>${bnum(i.amt)} ر.س</td><td><span class="bd ${i.state==='مدفوعة'?'gr':'yl'}">${E(i.state)}</span></td><td><button type="button" class="bl-dl" aria-label="تنزيل الفاتورة" onclick="BINV('${E(i.no)}')">${BI.dl}</button></td></tr>`).join('');
 return`<h1>الاشتراك والفوترة</h1><p class="sb">تابع خطتك الحالية، طريقة الدفع، والفواتير من مكان واحد.</p>
 <div class="bl-top">${plan}${pay}</div>
 <div class="card bl-inv"><div class="bl-ih"><div><h3>الفواتير</h3><small>السجل الكامل لعمليات الدفع</small></div><button type="button" class="bl-out" onclick="BSTMT()" ${inv.length?'':'disabled'}>${BI.dl} تنزيل كشف الحساب</button></div>
 ${inv.length?`<div class="bl-tw"><table><thead><tr><th>رقم الفاتورة</th><th>التاريخ</th><th>الخطة</th><th>المبلغ</th><th>الحالة</th><th>تنزيل</th></tr></thead><tbody>${rows}</tbody></table></div>`:'<p class="bl-empty">لا توجد فواتير بعد</p>'}</div>`;
};
// ---------- النوافذ ----------
function BM(html){let m=document.getElementById('blm');if(!m){m=document.createElement('div');m.id='blm';m.className='blm';document.body.appendChild(m);m.addEventListener('click',e=>{if(e.target===m||e.target.closest('.blx,.blc'))m.classList.remove('on')})}
 m.innerHTML=`<div class="blb" role="dialog" aria-modal="true"><button type="button" class="blx" aria-label="إغلاق">✕</button>${html}</div>`;m.classList.add('on');return m}
function BCHANGE(){const s=D.sub;if(!s){location.href='dash-payment.html';return}
 const cur=s.plan==='m'?'m':'y';
 const m=BM(`<h3>تغيير الخطة</h3><p>اختر الدورة المناسبة لك.</p><div class="blopts">${['y','m'].map(k=>`<label class="blo"><input type="radio" name="blp" value="${k}" ${k===cur?'checked':''}><span>${bplanName({plan:k})}<small>${bnum(BP[k].base)} ر.س · ${BP[k].cyc}</small></span></label>`).join('')}</div><p class="blerr" role="alert"></p><div class="blbt"><button type="button" class="blc">إلغاء</button><button type="button" class="blok">حفظ</button></div>`);
 m.querySelector('.blok').onclick=async function(){const k=m.querySelector('input[name=blp]:checked').value;if(k===cur&&s.status!=='canceled'){m.classList.remove('on');return}
  this.disabled=true;try{D.sub=await nexoDB.subscribe({plan:k,trial:s.status==='trialing'});m.classList.remove('on');R()}catch(e){m.querySelector('.blerr').textContent=e.message||'تعذر الحفظ';this.disabled=false}}}
function BCANCEL(){const m=BM(`<h3>إلغاء الاشتراك</h3><p>هل أنت متأكد من إلغاء اشتراكك؟ راح تفقد الوصول للفرص الحصرية.</p><p class="blerr" role="alert"></p><div class="blbt"><button type="button" class="blc">تراجع</button><button type="button" class="blok bldanger">إلغاء الاشتراك</button></div>`);
 m.querySelector('.blok').onclick=async function(){this.disabled=true;try{D.sub=await nexoDB.cancelSubscription();m.classList.remove('on');R()}catch(e){m.querySelector('.blerr').textContent=e.message||'تعذر الإلغاء';this.disabled=false}}}
// ---------- التنزيل ----------
function BSAVE(name,type,text){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+text],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function BINV(no){const i=binvoices(D.sub).find(x=>x.no===no);if(!i)return;const who=(D.me&&D.me.n)||'';const email=(nexoDB.user&&nexoDB.user.email)||'';
 BSAVE(no+'.html','text/html;charset=utf-8',`<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><title>${E(no)}</title><body style="font-family:Tahoma,sans-serif;max-width:640px;margin:40px auto;color:#000"><h1 style="color:#201F49">NEXO</h1><h2>فاتورة ${E(no)}</h2><p>التاريخ: ${bday(i.date)}</p><p>العميل: ${E(who)} ${E(email)}</p><table style="width:100%;border-collapse:collapse" border="1" cellpadding="8"><tr><th>الوصف</th><th>المبلغ</th></tr><tr><td>${E(bplanName(D.sub))} (${E(i.state)})</td><td>${bnum(i.amt)} ر.س</td></tr></table><p>الإجمالي شامل الضريبة: ${bnum(i.amt)} ر.س</p></body></html>`)}
function BSTMT(){const rows=binvoices(D.sub).map(i=>[i.no,bday(i.date),i.plan,bnum(i.amt)+' SAR',i.state].join(','));BSAVE('nexo-statement.csv','text/csv;charset=utf-8',['رقم الفاتورة,التاريخ,الخطة,المبلغ,الحالة'].concat(rows).join('\n'))}
start();
