v='teams';
V.teams=function(){const l=D.teams.filter(t=>(!F.teams||t.type===F.teams)&&(!X.teams.c||t.city===X.teams.c)&&hit(t));
 return head('الفرق والجهات','استكشف مختلف الفرق والجهات في الرياضات الإلكترونية')+bar('teams',[['الكل',''],['الأندية','نادي'],['مقدمين الخدمة','مقدم خدمة'],['الجهات','جهة']],'type',sel('teams','c','المدينة',cities('teams')))+
 `<div class="g4">${l.map(t=>`<a class="card t tl2" href="dash-entity-visitor.html?team=${encodeURIComponent(t.id)}"><div class="cv" ${cv(t.cv)}></div>${ph(t.ph,t.n)}<h3>${E(t.n)}</h3><p class="r">${E(t.sub||t.type)}</p><div class="ft"><span>${PIN} ${E(t.city)}</span>${D.opps.some(o=>o.org===t.n)?'<span class="bd yl">لديه فرص للتقديم</span>':''}</div></a>`).join('')||em('لا توجد أندية أو جهات بعد')}</div>`};
R();
