v='home';
const EMP='<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#797992" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
const IC_T='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>';
const IC_J='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>';
/* الرئيسية: منشوراتك ومنشورات اللي ضفتهم من "تواصل" بس (لو جدول التواصل ما انضاف: الكل مثل قبل) */
const FEED=()=>{const f=D.following;if(!Array.isArray(f))return D.posts;const ok=new Set(f.concat([nexoDB.uid]));return D.posts.filter(p=>ok.has(p.author_id))};
/* رابط ملف صاحب المنشور */
const AUTH=p=>p.author_id===nexoDB.uid?(nexoDB.kind==='team'?'dash-entity-profile.html':'dash-talent-profile.html'):p.pid?(p.kind==='team'?'dash-entity-visitor.html':'dash-talent-visitor.html')+'?id='+encodeURIComponent(p.pid):'';
V.home=function(){const m=D.me,has=m.n,ps=FEED().filter(hit);
 return`<div class="hm"><aside class="side">${has?`<a class="card pf hpf" data-profile href="dash-talent-profile.html" title="ملفي"><div class="cv" ${cv(m.cv)}></div>${ph(m.ph,m.n)}<h3>${E(m.n)}</h3><p class="r">${E(m.role||m.sub||m.type)}</p>${m.g?`<span class="tg">${E(m.g)}</span>`:''}<div class="ft"><span>${PIN} ${E(m.city)}</span>${m.s?`<span class="bd ${m.s===STS[0]?'gr':'nu'}">${E(m.s)}</span>`:''}</div></a>`:''}
 <div class="card" style="padding:14px 12px;margin-top:${has?12:0}px;display:grid;gap:10px">${has?'':`<button class="nb" onclick="F_('me')">أنشئ ملفك</button>`}<button class="nb" onclick="${has?"F_('posts')":"F_('me')"}">ابدا منشورك ${PEN}</button></div></aside>
 <section class="feed">${ps.length?ps.map(p=>{const h=AUTH(p);return`<article class="card post${h?' plink':''}"${h?` data-href="${E(h)}"`:''}>${h?`<a class="ph2" href="${E(h)}">`:'<div class="ph2">'}${pic(p.a,p.n)}<div><h4>${E(p.n)}</h4><p>${E(p.r)}</p></div>${h?'</a>':'</div>'}<p>${E(p.t)}</p>${U(p.im)?`<img src="${E(U(p.im))}" alt="" style="display:block;max-width:260px;width:100%;border-radius:8px;margin:14px 0 0 auto">`:''}</article>`}).join(''):
 `<div class="hemp">${EMP}<h3>لا توجد منشورات بعد</h3><p>تابع الأشخاص والجهات التي تهمك لتظهر أحدث منشوراتهم هنا</p><div class="hbt"><a href="dash-talents.html">${IC_T} المواهب</a><a href="dash-teams.html">${IC_J} الجهات</a></div></div>`}</section></div>`};
start();
// فتح تعديل الملف مباشرة لو جاي من زر القلم في صفحة ملفي
onReady(()=>{const t=setInterval(()=>{if(LOADED){clearInterval(t);if(location.hash==='#edit'){history.replaceState(null,'',location.pathname);F_('me')}}},50)});


/* نافذة "تم نشر المنشور" بعد ما ينشر من الرئيسية */
function POSTOK(){let m=document.getElementById('pok');
 if(!m){m=document.createElement('div');m.id='pok';m.className='pok';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');document.body.appendChild(m);
  m.addEventListener('click',e=>{if(e.target===m||e.target.closest('.pkx,.pkh'))m.classList.remove('on')})}
 m.innerHTML=`<div class="pkb"><button type="button" class="pkx" aria-label="إغلاق"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg></button>
 <div class="pkc"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></div>
 <h3>تم نشر المنشور</h3><p>منشورك أصبح متاحًا الآن على ملفك الشخصي وفي مجتمع نيكسو. شكرًا لمشاركتنا!</p>
 <div class="pkbt"><button type="button" class="pkh">العودة للرئيسية</button><button type="button" class="pkv">عرض المنشور</button></div></div>`;
 m.querySelector('.pkv').onclick=()=>{m.classList.remove('on');const a=[...document.querySelectorAll('.feed .post')].find(x=>x.querySelector('a.ph2[href*="-profile.html"]'))||document.querySelector('.feed .post');if(a){a.scrollIntoView({behavior:'smooth',block:'center'});a.classList.add('pnew');setTimeout(()=>a.classList.remove('pnew'),2200)}};
 m.classList.add('on');m.querySelector('.pkv').focus()}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const m=document.getElementById('pok');if(m)m.classList.remove('on')}});
