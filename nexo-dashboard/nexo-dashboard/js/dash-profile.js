v='profile';
const ED='<svg width="16" height="16" fill="none" stroke="#9A9AAE" stroke-width="1.4"><path d="M11.5 1.8l2.7 2.7-8.6 8.6-3.4.7.7-3.4z"/></svg>';
const EYE='<svg width="16" height="12" fill="none" stroke="#797992" stroke-width="1.2"><path d="M1 6s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"/><circle cx="8" cy="6" r="2"/></svg>';
const PPL='<svg width="16" height="14" fill="none" stroke="#797992" stroke-width="1.2"><circle cx="6" cy="4" r="2.6"/><path d="M1 13c0-3 2.5-4.5 5-4.5s5 1.5 5 4.5M11 1.6a2.6 2.6 0 010 5M12.5 8.8c1.6.5 2.5 1.8 2.5 4.2"/></svg>';
const ARW='<svg width="7" height="11" fill="none" stroke="#201F49" stroke-width="1.6"><path d="M6 1L1.5 5.5 6 10"/></svg>';
const SOC=[['x','إكس','https://x.com/username','<svg width="16" height="16" viewBox="0 0 24 24" fill="#201F49"><path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-6.4L6.3 22H3.2l7.3-8.3L1 2h6.3l4.4 5.8zm-1.1 18h1.7L6.3 3.9H4.5z"/></svg>'],
 ['tt','تيك توك','https://tiktok.com/@username','<svg width="15" height="16" viewBox="0 0 24 24" fill="#201F49"><path d="M16.5 2c.3 2.4 1.7 4 4.1 4.2v3.3c-1.5.1-2.9-.4-4.1-1.2v6.3c0 4-3.3 6.4-6.4 6.4A6.4 6.4 0 018 8.6v3.5a3 3 0 103 3V2z"/></svg>'],
 ['li','لينكدإن','https://linkedin.com/in/username','<svg width="16" height="16" viewBox="0 0 24 24"><rect width="24" height="24" rx="3" fill="#0A66C2"/><path fill="#fff" d="M7 9.5h2.6V18H7zM8.3 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11 9.5h2.5v1.2c.4-.7 1.3-1.4 2.7-1.4 2.8 0 3.3 1.8 3.3 4.2V18h-2.6v-4c0-1 0-2.2-1.4-2.2s-1.6 1-1.6 2.1V18H11z"/></svg>'],
 ['ph','رقم الجوال','+966 5XXXXXXXX','<svg width="16" height="16" fill="none" stroke="#201F49" stroke-width="1.3"><path d="M5.5 1.5l1.6 3.3-1.6 1.4a8.5 8.5 0 004.3 4.3l1.4-1.6 3.3 1.6v2.6c0 .6-.5 1.4-1.4 1.4C6.3 14.5 1.5 9.7 1.5 3c0-.9.8-1.5 1.4-1.5z"/></svg>'],
 ['em','البريد الإلكتروني','username@example.com','<svg width="16" height="14" fill="none" stroke="#201F49" stroke-width="1.3"><rect x="1" y="1.5" width="14" height="11" rx="1.5"/><path d="M1.5 2.5L8 8l6.5-5.5"/></svg>']];
const EX={posts:0,matches:0,games:0,social:0};
const prf=()=>{const m=D.me;m.matches=m.matches||[];m.games=m.games||[];m.social=m.social||{};return m};
function pct(m){const c=[m.n,m.ph,m.cv,m.role,m.g,m.city,m.s,m.bio,m.matches.length,m.games.length,Object.values(m.social).some(Boolean)];return Math.round(100*c.filter(Boolean).length/c.length)}
function ring(p){const r=22,C=2*Math.PI*r;return`<svg width="54" height="54" viewBox="0 0 54 54"><circle cx="27" cy="27" r="${r}" fill="none" stroke="#E0FAE0" stroke-width="3"/><circle cx="27" cy="27" r="${r}" fill="none" stroke="#03BB43" stroke-width="3" stroke-linecap="round" stroke-dasharray="${C*p/100} ${C}" transform="rotate(-90 27 27)"/><text x="27" y="31.5" text-anchor="middle" font-size="12.5" font-weight="600" fill="#03BB43">${p}%</text></svg>`}
function ago(t){if(!t)return'';const s=(Date.now()-t)/1e3;if(s<60)return'الآن';const mn=s/60|0;if(mn<60)return`قبل ${mn} دقيقة`;const h=mn/60|0;if(h<24)return`قبل ${h} ساعة`;const d=h/24|0;return d<30?`قبل ${d} يوم`:new Date(t).toLocaleDateString('ar-SA-u-ca-gregory-nu-latn')}
const more=(k,n,lim)=>n>lim?`<button class="all" onclick="EX.${k}=!EX.${k};R()">${EX[k]?'عرض أقل':'عرض الكل'} ${ARW}</button>`:'';
const del=(k,i)=>`<button class="rm" aria-label="حذف" onclick="RMV('${k}',${i})">×</button>`;
function RMV(k,i){prf()[k].splice(i,1);sv();R()}
function BIO(){MD('تعديل النبذة','عرّف مجتمع نيكسو بك وبإنجازاتك وطموحاتك في عالم الألعاب.',`<label for="fb">النبذة</label><textarea id="fb" name="bio" required placeholder="اكتب نبذة عنك">${E(D.me.bio||'')}</textarea>`,'إضافة',o=>{D.me.bio=o.bio})}
function MAT(){const gl=prf().games.map(g=>`<option value="${E(g.n)}">`).join('');
 MD('إضافة المباريات والبطولات','أضف مشاركاتك ونتائجك لعرضها على ملفك الشخصي.',`<label for="mt">اسم المباراة أو البطولة</label><input id="mt" name="t" required placeholder="كأس العالم للرياضات الإلكترونية">
 <div class="g2f"><div><label for="mtm">اسم الفريق</label><input id="mtm" name="tm" placeholder="فريق فالكونز"></div><div><label for="mg">اسم اللعبة</label><input id="mg" name="g" list="mgl" required placeholder="اللعبة"><datalist id="mgl">${gl}</datalist></div>
 <div><label for="mp">المركز</label><input id="mp" name="p" placeholder="المركز الثاني"></div><div><label for="md">اسم الجهاز</label><input id="md" name="d" placeholder="PC"></div></div>`,'إضافة',o=>prf().matches.unshift(o))}
function GAM(){MD('إضافة الألعاب','أضف ألعابك ووضّح مستوى احترافك ودورك في الفريق.',`<div class="g2f"><div><label for="gn">اسم اللعبة</label><input id="gn" name="n" list="gnl" required placeholder="اللعبة"><datalist id="gnl"><option value="EA SPORTS FC"><option value="Rocket League"><option value="Valorant"><option value="Fortnite"><option value="Call of Duty"><option value="League of Legends"></datalist></div><div><label for="gr">مستوى الاحتراف</label><input id="gr" name="r" placeholder="لاعب محترف"></div>
 <div><label for="gt">دورك في اللعبة أو الفريق</label><input id="gt" name="t" placeholder="لاعب أساسي"></div><div><label for="gd">الجهاز المستخدم</label><input id="gd" name="d" placeholder="PC"></div></div>`,'إضافة',o=>prf().games.unshift(o))}
function SCL(){const s=prf().social;MD('حسابات التواصل','أضف روابط حساباتك ليسهل على مجتمع نيكسو التواصل معك.',SOC.map(([k,l,p,ic])=>`<div class="sr2"><label for="s${k}">${l}<span>${ic}</span></label><input id="s${k}" name="${k}" type="${k==='em'?'email':k==='ph'?'tel':'text'}" dir="ltr" value="${E(s[k]||'')}" placeholder="${p}"></div>`).join(''),'حفظ',o=>{D.me.social=o})}
const url=(k,x)=>k==='ph'?'tel:'+x.replace(/\s/g,''):k==='em'?'mailto:'+x:/^https?:\/\//.test(x)?x:'https://'+x;
const sec=(t,act,body,extra='')=>`<section class="card sc">${act}<h2>${t}</h2>${body}${extra}</section>`;
const TID=new URLSearchParams(location.search).get('t'),OTH=TID?D.talents.find(x=>String(x.id)===TID):null,RO=!!OTH;
V.profile=function(){const m=RO?OTH:prf(),nw=!m.n;['matches','games'].forEach(k=>m[k]=m[k]||[]);m.social=m.social||{};
 const ed=(lab,fn)=>RO?'':`<button class="ed" aria-label="${lab}" onclick="${fn}">${ED}</button>`;
 const my=nw?[]:D.posts.filter(p=>p.n===m.n),ps=EX.posts?my:my.slice(0,3),ma=EX.matches?m.matches:m.matches.slice(0,2),ga=EX.games?m.games:m.games.slice(0,2),so=SOC.filter(([k])=>m.social[k]);
 const it=(x,k,i,h,ls)=>`<div class="it">${RO?'':del(k,i)}<div><h3>${E(h)}</h3>${ls.filter(Boolean).map(y=>`<p>${E(y)}</p>`).join('')}</div>${x.d?`<span class="dv">${E(x.d)}</span>`:''}</div>`;
 return`${RO?`<div class="bc"><a href="dash-talents.html">المواهب</a><svg width="8" height="10" fill="none" stroke="#CACFD5"><path d="M6 1L2 5l4 4"/></svg><b>${E(m.n)}</b></div>`:''}<div class="card pr" ${RO?'style="margin-top:20px"':''}><div class="pcv" ${cv(m.cv)}></div>${m.ph?`<img class="pph" src="${m.ph}" alt="">`:`<div class="pph ini">${ini(m.n)}</div>`}
 ${RO?'':`<button class="ed" aria-label="تعديل الملف" onclick="F_('me')">${ED}</button>`}
 <div class="pin"><h2>${nw?'اسمك':E(m.n)}</h2><div class="pr2"><span class="rl">${nw?'دورك':E(m.role)}</span>${m.g?`<span class="tg nu">${E(m.g)}</span>`:''}</div><div class="cty">${PIN} ${nw?'مدينتك':E(m.city)}</div>${nw?`<button class="nb" style="width:auto;padding:0 26px;margin-top:12px" onclick="F_('me')">أكمل ملفك</button>`:''}</div>
 ${m.s?`<span class="bd ${m.s===STS[0]?'gr':'nu'} pst">${E(RL[m.s]||m.s)}</span>`:''}
 <div class="sts"><div>${ring(pct(m))}<b class="sl">اكتمال الملف</b></div><div>${EYE}<b>${m.views||0}</b><span class="sl">مشاهدات الملف</span></div><div>${PPL}<b>${so.length}</b><span class="sl">شبكة التواصل</span></div></div></div>
 ${sec('نبذة',ed('تعديل النبذة','BIO()'),m.bio?`<p class="bio">${E(m.bio)}</p>`:'')}
 ${sec('منشورات',RO?'':`<button class="ob" onclick="F_('posts')">${PEN.replace('#fff','#201F49')} إنشاء منشور</button>`,my.length?`<p class="cnt">${my.length} منشورات</p><div class="pgd">${ps.map(p=>`<article class="pc"><div class="ph2">${pic(p.a,p.n)}<div><h4>${E(p.n)}</h4><p>${E(p.r)}</p>${p.at?`<p class="tm">${ago(p.at)}</p>`:''}</div></div><p class="tx">${E(p.t)}</p>${p.im?`<img class="pim" src="${p.im}" alt="">`:''}</article>`).join('')}</div>`:'',more('posts',my.length,3))}
 ${sec('المباريات والبطولات',ed('إضافة مباراة أو بطولة','MAT()'),ma.map((x,i)=>it(x,'matches',i,x.t,[x.tm,x.g,x.p])).join(''),more('matches',m.matches.length,2))}
 <div class="two">${sec('الألعاب',ed('إضافة لعبة','GAM()'),ga.map((x,i)=>it(x,'games',i,x.n,[x.r,x.t])).join(''),more('games',m.games.length,2))}
 ${sec('حسابات التواصل',ed('تعديل حسابات التواصل','SCL()'),so.length?`<div class="sl2">${(EX.social?so:so.slice(0,2)).map(([k,l,,ic])=>`<a class="sb2" href="${E(url(k,m.social[k]))}" target="_blank" rel="noopener" title="${l}">${ic}</a>`).join('')}</div>`:'',more('social',so.length,2))}</div>`};
if(RO){v='talentview';V.talentview=V.profile}
/* ===== بروفايل الجهة ===== */
const JID=new URLSearchParams(location.search).get('team'),TEAM=JID?D.teams.find(x=>String(x.id)===JID):null;
if(TEAM){v='teamview';V.teamview=function(){const m=TEAM,so=SOC.filter(([k])=>(m.social||{})[k]),os=D.opps.filter(o=>o.org===m.n),ap=os.reduce((a,o)=>a+(+o.n||0),0);
 return`<div class="bc"><a href="dash-teams.html">الفرق والجهات</a><svg width="8" height="10" fill="none" stroke="#CACFD5"><path d="M6 1L2 5l4 4"/></svg><b>${E(m.n)}</b></div>
 <div class="card pr" style="margin-top:20px"><div class="pcv" ${cv(m.cv)}></div>${m.ph?`<img class="pph" src="${m.ph}" alt="">`:`<div class="pph ini">${ini(m.n)}</div>`}
 <div class="pin"><h2>${E(m.n)}</h2><div class="pr2"><span class="rl">${E(m.type||'')}</span>${m.sub&&m.sub!==m.type?`<span class="tg nu">${E(m.sub)}</span>`:''}</div><div class="cty">${PIN} ${E(m.city||'')}</div></div>
 ${os.length?'<span class="bd yl pst">لديه فرص للتقديم</span>':''}
 <div class="sts"><div><b>${os.length}</b><span class="sl">الفرص المتاحة</span></div><div>${USR}<b>${ap}</b><span class="sl">المتقدمين</span></div><div>${PPL}<b>${so.length}</b><span class="sl">شبكة التواصل</span></div></div></div>
 ${sec('نبذة','',m.bio?`<p class="bio">${E(m.bio)}</p>`:'')}
 ${sec('الفرص',D.sub?'':`<button class="ob" onclick="location.href='dash-payment.html'">جرّب مجانًا</button>`,(os.length?`<p class="cnt">${os.length} فرص${D.sub?'':' · متاحة للمشتركين'}</p>`:'')+os.map(o=>`<a class="it oit" href="${D.sub?'dash-opportunity-details.html?id='+o.id:'dash-opportunities.html'}"><div><h3>${E(o.title)}</h3>${[o.type,o.city,o.due?'آخر موعد: '+o.due:''].filter(Boolean).map(y=>`<p>${E(y)}</p>`).join('')}</div><span class="dv">${D.sub?'عرض':'للمشتركين'}</span></a>`).join(''))}
 ${sec('حسابات التواصل','',so.length?`<div class="sl2">${so.map(([k,l,,ic])=>`<a class="sb2" href="${E(url(k,m.social[k]))}" target="_blank" rel="noopener" title="${l}">${ic}</a>`).join('')}</div>`:'')}`}}
else if(JID||/entity-visitor/.test(location.pathname)){location.replace('dash-teams.html')}
if(RO){OTH.views=(OTH.views||0)+1;sv()}else if(TID||/talent-visitor/.test(location.pathname)){location.replace('dash-talents.html')}
R();
