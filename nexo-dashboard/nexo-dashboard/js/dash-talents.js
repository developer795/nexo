v='talents';
V.talents=function(){const l=[...(D.me.n?[{...D.me,me:1}]:[]),...D.talents].filter(t=>(!F.talents||t.role===F.talents)&&(!X.talents.c||t.city===X.talents.c)&&(!X.talents.s||t.s===X.talents.s)&&hit(t));
 return head('استكشف المواهب','تعرّف على المواهب في مختلف الرياضات الإلكترونية')+bar('talents',[['الكل',''],['لاعبين','لاعب'],['صناع المحتوى','صانع محتوى'],['ستريمرز','ستريمر']],'role',sel('talents','c','المدينة',cities('talents'))+sel('talents','s','حالة التوفر',STS,SL))+
 `<div class="g4">${l.map(t=>`<a class="card t tl2" ${t.me?'data-profile ':''}href="${t.me?'dash-talent-profile.html':'dash-talent-visitor.html?t='+encodeURIComponent(t.id)}"><div class="cv" ${cv(t.cv)}></div>${ph(t.ph,t.n)}<h3>${E(t.n)}</h3><p class="r">${E(t.role)}</p>${t.g?`<span class="tg">${E(t.g)}</span>`:''}<div class="ft"><span>${PIN} ${E(t.city)}</span><span class="bd ${t.s===STS[0]?'gr':'nu'}">${E(t.s)}</span></div></a>`).join('')||em('لا توجد مواهب بعد')}</div>`};
R();
