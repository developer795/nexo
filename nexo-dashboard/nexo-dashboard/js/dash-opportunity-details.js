v='detail';
cur=+new URLSearchParams(location.search).get('id')||0;
V.detail=function(){if(!D.sub){location.replace('dash-opportunities.html');return''}const o=D.opps.find(x=>x.id===cur);if(!o){location.replace('dash-opportunities.html');return''}
 return`<div class="bc"><a href="dash-opportunities.html">الفرص</a><svg width="8" height="10" fill="none" stroke="#CACFD5"><path d="M6 1L2 5l4 4"/></svg><b>${E(o.title)}</b></div>
 <div class="big"><div class="dt">${pic(o.ph,o.org)}<div><span class="bd gr" style="font-weight:600">${E(o.type)}</span><h2>${E(o.title)}</h2><div class="o">${E(o.org)}</div><div>${[o.city,o.aud].map(x=>`<span class="tg">${E(x)}</span>`).join('')}</div></div></div>
 <div class="dl"><div><span>${o.n} متقدم</span><span>آخر موعد: ${E(o.due)}</span></div><button class="ap" ${o.ap?'disabled':''} onclick="AP(${o.id})">${o.ap?'تم التقديم':'تقديم'}</button></div></div>
 <div class="big ds" style="padding:24px 20px 50px"><h2>وصف الفرصه</h2><p>${E(o.d)}</p></div>`};
R();
