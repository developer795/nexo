v='opps';
V.opps=function(){const l=D.opps.filter(o=>(!F.opps||o.aud===F.opps)&&(!X.opps.c||o.city===X.opps.c)&&(!X.opps.t||o.type===X.opps.t)&&hit(o));
 return head('ابحث عن فرصتك','اكتشف فرصًا جديدة وابدأ خطوتك القادمة في الرياضات الإلكترونية')+bar('opps',[['الكل',''],['لاعبين','لاعب'],['صناع المحتوى','صانع محتوى'],['ستريمرز','ستريمر']],'aud',sel('opps','t','نوع الفرصة',OT,OTL)+sel('opps','c','المدينة',cities('opps')))+
 `<div class="g2">${l.map(o=>`<button class="card op" onclick="SUB()?location.href='dash-opportunity-details.html?id=${o.id}':PW()"><div class="tp">${pic(o.ph,o.org)}<div style="flex:1"><h3>${E(o.title)}</h3><div class="o">${E(o.org)}</div><div class="tr"><div>${[o.aud,o.g].filter(Boolean).map(x=>`<span class="tg">${E(x)}</span>`).join('')}</div><span class="bd gr">${E(otl(o.type))}</span></div></div></div>
 <div class="mt"><span>${PIN} ${E(o.city)}</span><span>اخر موعد: ${E(o.due||'غير محدد')}</span><span>${o.n} متقدم ${USR}</span></div></button>`).join('')||em('لا توجد فرص بعد')}</div>`};
start();
/* الفرص للمشتركين: تظهر الفرص ورا، ونافذة الباقة العليا فوقها كبطاقة */
function PW(){if(SUB())return;nexoPaywall()}
/* نافذة الباقة تطلع بعد ما يتحمّل الاشتراك من قاعدة البيانات */
/* غير المشترك: النافذة فوق الفرص (مغبّشة) بدون زر إغلاق، ويتنقل من الهيدر */
onReady(()=>{const t=setInterval(()=>{if(LOADED){clearInterval(t);if(!SUB())nexoPaywall()}},50)});
