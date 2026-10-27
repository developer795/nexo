v='pay';
let PL='y';
const VAT=.15,PLANS={y:{n:'سنوي',base:470,per:'سنويًا'},m:{n:'شهري',base:49,per:'شهريًا'}};
const ar=n=>(Math.round(n*100)/100).toLocaleString('en-US',{maximumFractionDigits:2});
const day=d=>d.toLocaleDateString('ar-SA-u-ca-gregory-nu-latn',{day:'numeric',month:'long',year:'numeric'});
const trialEnd=()=>{const d=new Date();d.setDate(d.getDate()+7);return d};
const CHK='<svg width="16" height="16"><circle cx="8" cy="8" r="8" fill="#E0FAE0"/><path d="M4.8 8.2l2.1 2 4.3-4.4" fill="none" stroke="#03BB43" stroke-width="1.6"/></svg>';
const ICO={card:'<svg width="16" height="12" fill="none" stroke="#9A9AAE" stroke-width="1.2"><rect x=".6" y=".6" width="14.8" height="10.8" rx="1.6"/><path d="M.6 4h14.8"/></svg>',cal:'<svg width="14" height="14" fill="none" stroke="#9A9AAE" stroke-width="1.2"><rect x=".6" y="2" width="12.8" height="11.4" rx="1.6"/><path d="M.6 5.5h12.8M4 .5v3M10 .5v3"/></svg>',lock:'<svg width="13" height="15" fill="none" stroke="#9A9AAE" stroke-width="1.2"><rect x=".6" y="6" width="11.8" height="8.4" rx="1.6"/><path d="M3.3 6V4a3.2 3.2 0 016.4 0v2"/><circle cx="6.5" cy="10.2" r="1"/></svg>'};
function sum(){const p=PLANS[PL],vat=p.base*VAT,tot=p.base+vat,end=day(trialEnd());
 return`<h2>ملخص الطلب</h2>
 <div class="plt"><button type="button" class="${PL==='y'?'on':''}" onclick="setPL('y')">سنوي · وفّر 20%</button><button type="button" class="${PL==='m'?'on':''}" onclick="setPL('m')">شهري · 49 ر.س</button></div>
 <div class="plc"><div><b>الباقة العليا للأفراد · ${p.n}</b><b class="pr3">${ar(p.base)} ر.س</b></div><p>${PL==='y'?`ما يعادل ${ar(p.base/12)} ر.س شهريًا · `:''}وصول كامل للفرص الحصرية</p></div>
 <div class="tl"><div class="ln"><i class="on"></i><i></i></div><div class="tlr"><div><b class="g">اليوم</b><span>بدء التجربة</span></div><div><b>${end}</b><span>أول دفعة</span></div></div></div>
 <div class="rows"><div><span>الباقة العليا للأفراد · ${p.n}</span><span>${ar(p.base)} ر.س</span></div><div><span>ضريبة القيمة المضافة (15%)</span><span>${ar(vat)} ر.س</span></div></div>
 <div class="rows tot"><div><b>الإجمالي بعد التجربة</b><b>${ar(tot)} ر.س</b></div><div><span>المستحق اليوم (7 أيام مجانًا)</span><span class="g">0 ر.س</span></div></div>
 <h4>ما تحصل عليه بالباقة العليا</h4><ul class="ben"><li>${CHK}وصول كامل للفرص الحصرية والموجهة</li><li>${CHK}استقطاب مباشر من الأندية والجهات</li><li>${CHK}فعاليات وبطولات خاصة بالمشتركين</li></ul>`}
function setPL(x){PL=x;$('#sum').innerHTML=sum();$('#agt').textContent=agree()}
const agree=()=>{const p=PLANS[PL];return`أوافق على بدء التجربة المجانية لمدة 7 أيام، وعلى خصم ${ar(p.base*(1+VAT))} ر.س ${p.per} ابتداءً من ${day(trialEnd())} ما لم ألغِ قبل ذلك.`};
function done(){const s=D.sub;return`<div class="big okp"><div class="crn">👑</div><h2>تم تفعيل تجربتك المجانية</h2><p>استمتع بالباقة العليا (${PLANS[s.plan].n}) حتى ${day(new Date(s.trialEnd))}. تقدر تلغي في أي وقت قبل هذا التاريخ.</p><button class="ap" onclick="location.href='dash-opportunities.html'">تصفّح الفرص</button></div>`}
V.pay=function(){const bc=`<div class="bc"><a href="dash-opportunities.html">الفرص</a><svg width="8" height="10" fill="none" stroke="#CACFD5"><path d="M6 1L2 5l4 4"/></svg><b>الدفع</b></div>`;
 if(D.sub)return bc+done();
 return bc+`<div class="pay"><form class="card pf2" id="pfm" novalidate><h2>بيانات الدفع والفوترة</h2><p class="msub">أدخل بياناتك لإتمام تفعيل التجربة</p>
 <div class="pm"><b>طرق الدفع المدعومة</b><span class="mada"><i></i><i></i> مدى · Visa · Mastercard</span></div>
 <div class="cbox"><label for="cn">رقم البطاقة</label><div class="fi">${ICO.card}<input id="cn" inputmode="numeric" autocomplete="cc-number" dir="ltr" placeholder="0000  0000  0000  0000" maxlength="23"></div>
 <div class="g2f"><div><label for="ce">تاريخ الانتهاء</label><div class="fi">${ICO.cal}<input id="ce" inputmode="numeric" autocomplete="cc-exp" dir="ltr" placeholder="MM / YY" maxlength="7"></div></div><div><label for="cc">رمز الأمان</label><div class="fi">${ICO.lock}<input id="cc" inputmode="numeric" autocomplete="cc-csc" dir="ltr" placeholder="CVC" maxlength="4"></div></div></div>
 <label for="ch">اسم حامل البطاقة</label><div class="fi"><input id="ch" autocomplete="cc-name" placeholder="الاسم كما يظهر على البطاقة"></div></div>
 <label class="agr"><input type="checkbox" id="ag"><span id="agt">${agree()}</span></label>
 <p class="err" id="er" role="alert"></p>
 <button class="ap">ابدأ تجربتك المجانية · 7 أيام مجانًا</button></form>
 <aside class="card sm" id="sum">${sum()}</aside></div>`};
function luhn(n){let s=0,d=0;for(let i=n.length-1;i>=0;i--){let x=+n[i];if(d&&(x*=2)>9)x-=9;s+=x;d^=1}return s%10===0}
function bind(){const f=$('#pfm');if(!f)return;
 $('#cn').oninput=e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(0,19).replace(/(\d{4})(?=\d)/g,'$1  ')};
 $('#ce').oninput=e=>{let x=e.target.value.replace(/\D/g,'').slice(0,4);e.target.value=x.length>2?x.slice(0,2)+' / '+x.slice(2):x};
 $('#cc').oninput=e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(0,4)};
 f.onsubmit=e=>{e.preventDefault();const n=$('#cn').value.replace(/\D/g,''),[mm,yy]=$('#ce').value.split('/').map(x=>+x.trim()),now=new Date(),er=m=>{$('#er').textContent=m};
  f.querySelectorAll('.bad').forEach(x=>x.classList.remove('bad'));const bad=(id,m)=>{$(id).closest('.fi').classList.add('bad');$(id).focus();er(m)};
  if(n.length<13||!luhn(n))return bad('#cn','رقم البطاقة غير صحيح');
  if(!(mm>=1&&mm<=12)||isNaN(yy)||new Date(2000+yy,mm)<=now)return bad('#ce','تاريخ الانتهاء غير صحيح');
  if(!/^\d{3,4}$/.test($('#cc').value))return bad('#cc','رمز الأمان غير صحيح');
  if(!$('#ch').value.trim())return bad('#ch','اكتب اسم حامل البطاقة');
  if(!$('#ag').checked)return er('لازم توافق على شروط التجربة المجانية');
  D.sub={plan:PL,start:Date.now(),trialEnd:trialEnd().getTime()};sv();R()}}
const _R=R;R=function(){_R();bind()};
R();
