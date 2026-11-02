// صفحة متابعة الفرص: الفرص اللي تقدّمت عليها وحالة كل طلب (جدول applications)
v='apps';
let APL=null,APERR='',APF='';
const AST={pending:['قيد المراجعة','ast-p'],accepted:['مقبول','ast-a'],rejected:['مرفوض','ast-r']};
V.apps=function(){
 const top=head('الفرص التي تم التقديم عليها','تابع طلباتك وآخر تحديثات الجهات على الفرص التي تقدمت لها');
 if(APERR)return top+em(E(APERR));
 if(!APL)return top+em('جاري التحميل...');
 const n=k=>APL.filter(a=>a.st===k).length,l=APL.filter(a=>(!APF||a.st===APF)&&hit(a));
 const tabs=[['الكل',''],['مقبول','accepted'],['قيد المراجعة','pending'],['مرفوض','rejected']];
 return top+`<div class="fl">${tabs.map(([t,k])=>`<button class="ch ${APF===k?'on':''}" onclick="APF='${k}';R()">${t}${k?` (${n(k)})`:''}</button>`).join('')}</div>
 <div class="g2">${l.map(o=>{const s=AST[o.st]||AST.pending;return`<a class="card op apc" href="dash-opportunity-details.html?id=${encodeURIComponent(o.id)}"><div class="tp">${pic(o.ph,o.org)}<div style="flex:1"><h3>${E(o.title)}</h3><div class="o">${E(o.org)}</div><div class="tr"><div>${[o.aud,o.g].filter(Boolean).map(x=>`<span class="tg">${E(x)}</span>`).join('')}</div></div></div><div class="apb"><span class="bd ${s[1]}">${s[0]}</span><span class="bd gr">${E(otl(o.type))}</span></div></div>
 <div class="mt"><span>${PIN} ${E(o.city||'غير محدد')}</span><span>اخر موعد: ${E(o.due||'غير محدد')}</span><span>${o.n} متقدم ${USR}</span></div></a>`}).join('')||(APL.length?em('لا توجد فرص بهذه الحالة'):`<div class="empty">لم تتقدم على أي فرصة بعد<br><a class="nb" style="display:inline-flex;width:auto;margin-top:14px;padding:0 22px;text-decoration:none" href="dash-opportunities.html">تصفّح الفرص</a></div>`)}</div>`};
start();
onReady(()=>{const t=setInterval(async()=>{if(!LOADED)return;clearInterval(t);try{APL=await nexoDB.listMyApplications()}catch(e){console.error(e);APERR=e.message||'تعذر تحميل تقديماتك'}R()},50)});
