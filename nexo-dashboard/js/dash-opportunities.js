v='opps';
V.opps=function(){const l=D.opps.filter(o=>(!F.opps||o.aud===F.opps)&&(!X.opps.c||o.city===X.opps.c)&&(!X.opps.t||o.type===X.opps.t)&&hit(o));
 return head('ابحث عن فرصتك','اكتشف فرصًا جديدة وابدأ خطوتك القادمة في الرياضات الإلكترونية')+bar('opps',[['الكل',''],['لاعبين','لاعب'],['صناع المحتوى','صانع محتوى'],['ستريمرز','ستريمر']],'aud',sel('opps','t','نوع الفرصة',OT,OTL)+sel('opps','c','المدينة',cities('opps')))+
 `<div class="g2">${l.map(o=>`<button class="card op" onclick="SUB()?location.href='dash-opportunity-details.html?id=${o.id}':PW()"><div class="tp">${pic(o.ph,o.org)}<div style="flex:1"><h3>${E(o.title)}</h3><div class="o">${E(o.org)}</div><div class="tr"><div>${[o.aud,o.g].filter(Boolean).map(x=>`<span class="tg">${E(x)}</span>`).join('')}</div><span class="bd gr">${E(otl(o.type))}</span></div></div></div>
 <div class="mt"><span>${PIN} ${E(o.city)}</span><span>اخر موعد: ${E(o.due||'غير محدد')}</span><span>${o.n} متقدم ${USR}</span></div></button>`).join('')||em('لا توجد فرص بعد')}</div>`};
start();
/* الفرص للمشتركين: تظهر الفرص ورا، ونافذة الباقة العليا فوقها كبطاقة */
function PW(){if(SUB())return;const old=document.querySelector('dialog.pw');if(old){old.showModal();return}
 const d=document.createElement('dialog');d.className='pw';
 const ic=p=>`<svg width="18" height="18" fill="none" stroke="#03BB43" stroke-width="1.5">${p}</svg>`;
 d.innerHTML=`<div class="pwt"><button class="x2" aria-label="إغلاق"><svg width="16" height="16" stroke="#fff" stroke-width="2"><path d="M2 2l12 12M14 2L2 14"/></svg></button><i class="dt1"></i><span class="spk">✦</span><div class="crw"><svg width="30" height="24" viewBox="0 0 30 24"><path d="M2 7l7 6 6-10 6 10 7-6-3 15H5z" fill="#F3D52B"/></svg></div></div>
 <div class="pwb"><h2>الفرصة الخاصة ليست للجميع</h2><p>اشترك في الباقة العليا للوصول إلى فرص موجهة ومحدودة لا تظهر في القائمة العامة.</p>
 <div class="ft3"><div>${ic('<path d="M3 9.5l3.5-4 2.5 2 2.5-2 3.5 4-6 5z"/>')}<span>تعاونات مختارة</span></div><div>${ic('<circle cx="9" cy="6" r="3"/><path d="M3 16c0-3.5 2.7-5 6-5s6 1.5 6 5"/>')}<span>استقطاب مباشر</span></div><div>${ic('<rect x="2" y="3.5" width="14" height="12" rx="2"/><path d="M2 7.5h14M6 1.5v3M12 1.5v3M7 11.5l1.5 1.5 3-3"/>')}<span>فعاليات خاصة</span></div></div>
 <button class="ap" onclick="location.href='dash-payment.html'">جرّب مجانًا</button></div>`;
 document.body.append(d);const cl=()=>d.close();d.querySelector('.x2').onclick=cl;d.addEventListener('cancel',cl);d.showModal()}
PW();
