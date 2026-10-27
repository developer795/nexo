const $=s=>document.querySelector(s),E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PIN='<svg width="9" height="10" fill="none" stroke="#797992" stroke-width="1.2"><path d="M4.5 9C2 6.5 1 5 1 3.8a3.5 3.5 0 017 0C8 5 7 6.5 4.5 9z"/><circle cx="4.5" cy="3.8" r="1.2"/></svg>';
const USR='<svg width="10" height="10" fill="none" stroke="#797992" stroke-width="1.1"><circle cx="3.5" cy="3" r="1.6"/><circle cx="7.3" cy="3.6" r="1.2"/><path d="M1 8.5c0-2 5-2 5 0M6.5 6.5c2-.3 2.8 1 2.8 2"/></svg>';
const PEN='<svg width="12" height="12" fill="none" stroke="#fff" stroke-width="1.3"><path d="M5 2H3a1.500 1.500 0 00-1.500 1.500v5.500A1.500 1.500 0 003 10.500h5.500A1.500 1.500 0 0010 9V7M9 1.500l1.500 1.500-4.500 4.500H4.500V6z"/></svg>';
// البيانات تجي من Supabase (window.nexoDB من auth-guard.js → db.js)
let D={me:{},posts:[],talents:[],teams:[],opps:[]},LOADED=false;
const onReady=f=>window.nexoDB?f():addEventListener('nexo:ready',f,{once:true});
async function load(){D=await nexoDB.loadAll();LOADED=true}
function start(){onReady(async()=>{R();try{await load()}catch(e){console.error(e);$('#m').innerHTML='<p class="empty">تعذر تحميل البيانات، حدّث الصفحة وحاول مرة ثانية</p>';return}R()})}
// روابط الصور: نسمح فقط بروابط https (صور Supabase Storage) عشان الأمان
const U=s=>/^https:\/\/[^\s"'()<>]+$/.test(String(s||''))?s:'';
const ini=n=>E(String(n||'؟').trim()[0]||'؟');
const pic=(s,n)=>U(s)?`<img src="${E(U(s))}" alt="">`:`<b class="ini">${ini(n)}</b>`;
const ph=(s,n)=>U(s)?`<img class="ph" src="${E(U(s))}" alt="">`:`<div class="ph" style="background:#201F49">${ini(n)}</div>`;
const cv=s=>`style="background:${U(s)?`#000 url(&quot;${E(U(s))}&quot;) center/cover`:'#000'}"`;
let v='',cur=0,Q='';const F={talents:'',teams:'',opps:''},X={talents:{},teams:{},opps:{}};
const txt=o=>[o.n,o.role,o.g,o.city,o.s,o.title,o.org,o.type,o.aud,o.d,o.t,o.r,o.sub,o.bio].filter(Boolean).join(' ').toLowerCase();
const hit=o=>!Q||txt(o).includes(Q.toLowerCase());
const CITIES=['الرياض','جدة','مكة المكرمة','المدينة المنورة','الدمام','الخبر','الظهران','الأحساء','القطيف','الجبيل','الطائف','بريدة','عنيزة','الرس','حائل','تبوك','أبها','خميس مشيط','بيشة','نجران','جازان','صبيا','أبو عريش','ينبع','رابغ','الليث','القنفذة','الباحة','سكاكا','دومة الجندل','عرعر','رفحاء','طريف','القريات','حفر الباطن','الخرج','الدرعية','الزلفي','المجمعة','شقراء','الدوادمي','وادي الدواسر','الأفلاج','العلا','الوجه','ضباء','تيماء','خيبر','شرورة','محايل عسير','بقيق','رأس تنورة','النعيرية'];
const CL=c=>c&&!CITIES.includes(c)?[...CITIES,c]:CITIES;
const cities=k=>[...new Set([...CITIES,...D[k].map(x=>x.city).filter(Boolean)])];
const CHEV='<svg width="12" height="12" fill="none" stroke="#797992" stroke-width="1.6" aria-hidden="true"><path d="M2 4l4 4 4-4"/></svg>';
/* قائمة منسدلة بنفس تصميم فيجما: الكلمة تلميح وما تطلع ضمن الخيارات، واختيار نفس الخيار مرة ثانية يلغيه */
const sel=(k,n,p,ops,lab)=>{const val=X[k][n]||'',L=x=>(lab&&lab[x])||x;return`<div class="dsel${val?' on':''}"><button type="button" class="dsb" aria-haspopup="listbox" aria-expanded="false" aria-label="${p}" onclick="DS(this)"><span>${E(val?L(val):p)}</span>${CHEV}</button><div class="dsl" role="listbox" hidden>${ops.map(o=>`<button type="button" role="option" aria-selected="${val===o}" class="dso${val===o?' on':''}" data-v="${E(o)}" onclick="DSS('${k}','${n}',this.dataset.v)">${E(L(o))}</button>`).join('')}</div></div>`};
function DS(b){const l=b.nextElementSibling,open=l.hidden;document.querySelectorAll('.dsl').forEach(x=>{x.hidden=true;x.previousElementSibling.setAttribute('aria-expanded','false')});if(open){l.hidden=false;b.setAttribute('aria-expanded','true')}}
function DSS(k,n,v){X[k][n]=X[k][n]===v?'':v;R()}
document.addEventListener('click',e=>{if(!e.target.closest('.dsel'))document.querySelectorAll('.dsl').forEach(x=>x.hidden=true)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.dsl').forEach(x=>x.hidden=true)});
const SL={'يبحث عن فريق':'يبحث عن فرصة'};
/* أسماء أنواع الفرص كما تظهر للمستخدم (القيم المحفوظة في Supabase ما تتغير) */
const OTL={'حملة اعلانية':'حملة إعلانية','مشاركة في البطولة':'مشاركة في بطولة'},otl=x=>OTL[x]||x;
/* الاشتراك في الباقة العليا (واجهة فقط، يتحفظ في المتصفح) */
const SUB=()=>{try{return JSON.parse(localStorage.getItem('nexo_sub'))}catch(e){return null}};
const bar=(k,ch,key,dd)=>`<div class="fl">${ch.map(([l,x])=>`<button class="ch ${F[k]===x?'on':''}" onclick="F.${k}='${x}';R()">${l} (${x?D[k].filter(i=>i[key]===x).length:D[k].length})</button>`).join('')}<div class="dd">${dd}</div></div>`;
const head=(t,s)=>`<h1>${t}</h1><p class="sb">${s}</p>`;
const em=m=>`<p class="empty">${m}</p>`;
const STS=['يبحث عن فريق','منضم لفريق'],ROLES=['لاعب','صانع محتوى','ستريمر'],OT=['عقد عمل','تدريب تعاوني','حملة اعلانية','مشاركة في البطولة','تدريب مهني'];
const V={};
async function AP(id){const o=D.opps.find(x=>x.id===id);if(!o||o.ap)return;o.ap=1;o.n++;R();
 try{await nexoDB.apply(id);await load()}catch(e){o.ap=0;o.n--;alert(e.message)}R()}
const FM={
 me:['ملفك الشخصي','حفظ',[['n','text','الاسم'],['ph','file','صورتك الشخصية',0,1],['cv','file','صورة الغلاف',0,1],['role','select','أنت',ROLES],['g','text','اللعبة أو المنصة',0,1],['city','city','المدينة'],['s','select','الحالة',STS],['bio','textarea','نبذة عنك',0,1]],o=>nexoDB.saveMe(o)],
 meTeam:['ملف الجهة','حفظ',[['n','text','اسم الجهة'],['ph','file','الشعار',0,1],['cv','file','صورة الغلاف',0,1],['type','select','النوع',['نادي','جهة','مقدم خدمة']],['sub','text','وصف قصير',0,1],['city','city','المدينة'],['bio','textarea','نبذة عن الجهة',0,1]],o=>nexoDB.saveMe(o)],
 posts:['إنشاء منشور','نشر',[['t','textarea','شارك أفكارك مع مجتمع نيكسو'],['im','file','صورة (اختياري)',0,1]],o=>nexoDB.addPost(o)],
 talents:['إضافة موهبة','إضافة',[['n','text','الاسم'],['ph','file','الصورة الشخصية',0,1],['cv','file','صورة الغلاف',0,1],['role','select','الدور',ROLES],['g','text','اللعبة أو المنصة',0,1],['city','city','المدينة'],['s','select','الحالة',STS]],o=>nexoDB.addTalent(o)],
 teams:['إضافة نادي أو جهة','إضافة',[['n','text','الاسم'],['ph','file','الشعار',0,1],['cv','file','صورة الغلاف',0,1],['type','select','النوع',['نادي','جهة','مقدم خدمة']],['sub','text','وصف قصير',0,1],['city','city','المدينة']],o=>nexoDB.addTeam(o)],
 opps:['إنشاء فرصة','نشر الفرصة',[['title','text','اسم الفرصة'],['org','text','اسم الجهة'],['ph','file','شعار الجهة',0,1],['type','select','نوع الفرصة',OT],['aud','select','الفئة',ROLES],['g','text','اللعبة (اختياري)',0,1],['city','city','المدينة'],['due','date','آخر موعد'],['d','textarea','اكتب تفاصيل الفرصة']],o=>nexoDB.addOpp(o)]};
// تصغير الصورة قبل الرفع (يرجع Blob)
const rz=(f,w)=>new Promise(r=>{if(!f||!f.size)return r(null);const u=URL.createObjectURL(f),i=new Image();i.onload=()=>{const s=Math.min(1,w/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>r(b),f.type==='image/png'&&w<=300?'image/png':'image/jpeg',.78)};i.onerror=()=>r(null);i.src=u});
function F_(k){if(!LOADED)return;if(k==='posts'&&!D.me.n)k='me';if(k==='me'&&nexoDB.kind==='team')k='meTeam';const[t,ok,f,add]=FM[k],m=k.startsWith('me')?D.me:{};
 $('#fm').innerHTML=`<h2>${t}</h2>`+f.map(([n,ty,l,op,opt])=>`<label for="f${n}">${l}</label>`+(ty==='textarea'?`<textarea id="f${n}" name="${n}" ${opt?'':'required'} placeholder="${l}">${E(m[n]||'')}</textarea>`:ty==='city'?`<select id="f${n}" name="${n}" required><option value="" disabled hidden ${m[n]?'':'selected'}>المدينة</option>${CL(m[n]).map(x=>`<option ${m[n]===x?'selected':''}>${E(x)}</option>`).join('')}</select>`:ty==='select'?`<select id="f${n}" name="${n}">${op.map(x=>`<option ${m[n]===x?'selected':''}>${x}</option>`).join('')}</select>`:ty==='file'?`<input id="f${n}" name="${n}" type="file" accept="image/*">`:`<input id="f${n}" name="${n}" type="${ty}" value="${E(m[n]||'')}" ${opt?'':'required'} placeholder="${l}">`)).join('')+`<div class="ac"><button class="ok">${ok}</button><button type="button" onclick="$('#dlg').close()">إلغاء</button></div>`;
 const CB={};$('#fm').querySelectorAll('input[type=file]').forEach(inp=>{const pick=async again=>{const f=inp.files[0];if(!f)return;const bl=await CROP(f,CROPCFG[inp.name]||CROPCFG.im);if(bl){CB[inp.name]=bl;CPV(inp,bl,()=>pick(1))}else if(!again){CB[inp.name]=null;inp.value='';CPV(inp,null)}};inp.onchange=()=>pick(0)});
 $('#fm').onsubmit=async e=>{e.preventDefault();const b=e.target.querySelector('.ok');if(b.disabled)return;b.disabled=true;const lbl=b.textContent;b.textContent='جاري الحفظ...';
  try{const o={};for(const[n,x]of new FormData(e.target).entries())o[n]=x instanceof File?await nexoDB.upload(CB[n]||await rz(x,n==='ph'?300:900)):String(x).trim();
   await add(o);await load();$('#dlg').close();R()}
  catch(err){console.error(err);alert(err.message||'حدث خطأ، حاول مرة ثانية')}
  finally{b.disabled=false;b.textContent=lbl}};$('#dlg').showModal()}
function R(){document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.v===({detail:'opps',pay:'opps'}[v]||v)));
 $('#mew').innerHTML=U(D.me.ph)?`<img class="me" src="${E(U(D.me.ph))}" alt="ملفي">`:`<b class="ini me">${ini(D.me.n)}</b>`;
 if(!LOADED){$('#m').innerHTML='<p class="empty">جاري التحميل...</p>';return}
 $('#m').innerHTML=Q?SR():V[v]()}
$('#q').oninput=e=>{Q=e.target.value.trim();R()};
/* صورتك فوق تفتح ملفك (auth-guard يحدد ملف اللاعب أو الجهة حسب نوع الحساب) */
(function(){const w=$('#mew');if(w){w.onclick=null;w.setAttribute('data-profile','');w.title='ملفي'}const f=document.getElementById('fab');if(f)f.remove()})();
/* البحث الشامل: المواهب والفرق والجهات والفرص والمنشورات */
function SR(){const T=D.talents.filter(hit),TM=D.teams.filter(hit),O=D.opps.filter(hit),P=D.posts.filter(hit),all=T.length+TM.length+O.length+P.length,sub=SUB();
 const g=(t,list)=>list.length?`<h2 class="srh">${t} <span>${list.length}</span></h2><div class="srl">${list.join('')}</div>`:'';
 const row=(href,img,nm,s,tag='')=>`<a class="card sri" href="${href}">${img}<div><b>${E(nm)}</b><span>${E(s)}</span></div>${tag}</a>`;
 return`<h1>نتائج البحث</h1><p class="sb">عن "${E(Q)}" · ${all} نتيجة</p>`+(all?
  g('المواهب',T.map(t=>row('dash-talent-visitor.html?id='+encodeURIComponent(t.id),pic(t.ph,t.n),t.n,[t.role,t.g,t.city].filter(Boolean).join(' · '))))+
  g('الفرق والجهات',TM.map(t=>row('dash-entity-visitor.html?id='+encodeURIComponent(t.id),pic(t.ph,t.n),t.n,[t.sub||t.type,t.city].filter(Boolean).join(' · '))))+
  g('الفرص',O.map(o=>row(sub?'dash-opportunity-details.html?id='+encodeURIComponent(o.id):'dash-opportunities.html',pic(o.ph,o.org),o.title+' · '+o.org,[otl(o.type),o.city].filter(Boolean).join(' · '),sub?'':'<span class="lk">للمشتركين</span>')))+
  g('المنشورات',P.map(p=>row('dash-home.html',pic(p.a,p.n),p.n,String(p.t||'').length>90?String(p.t).slice(0,90)+'…':p.t)))
  :`<p class="empty">ما لقينا نتائج تطابق بحثك. جرّب كلمة ثانية.</p>`)}

/* ===== قص الصور قبل الرفع: المستخدم يسحب الصورة ويكبّرها ويختار الجزء اللي يبيه ===== */
const CROPCFG={ph:{ar:1,w:400,t:'الصورة الشخصية'},cv:{ar:3,w:1500,t:'صورة الغلاف'},im:{ar:0,w:1200,t:'صورة المنشور',opts:[['الأصلي',0],['مربع',1],['طولي 4:5',.8],['عرضي 16:9',16/9]]}};
function CPV(inp,bl,re){let p=inp.nextElementSibling;if(!p||!p.classList.contains('cpv')){p=document.createElement('div');p.className='cpv';inp.after(p)}
 if(!bl){p.remove();return}const old=p.querySelector('img');if(old)URL.revokeObjectURL(old.src);p.innerHTML=`<img src="${URL.createObjectURL(bl)}" alt="معاينة الصورة بعد القص"><button type="button">تعديل القص</button>`;p.querySelector('button').onclick=re}
function CROP(file,cfg){return new Promise(done=>{const url=URL.createObjectURL(file),im=new Image();
 im.onerror=()=>{URL.revokeObjectURL(url);alert('تعذر فتح الصورة، جرّب صورة ثانية');done(null)};
 im.onload=()=>{let d=document.getElementById('crp');if(!d){d=document.createElement('dialog');d.id='crp';d.className='crp';document.body.append(d)}
  const opts=cfg.opts||[];let ar=cfg.ar||im.naturalWidth/im.naturalHeight;
  d.innerHTML=`<h3>${E(cfg.t)}</h3><p class="nxch">اسحب الصورة واختر الجزء اللي تبيه، وكبّر أو صغّر من الشريط</p>
  ${opts.length?`<div class="nxca">${opts.map(([l,v],i)=>`<button type="button" data-i="${i}" class="${(v||0)===(cfg.ar||0)?'on':''}">${l}</button>`).join('')}</div>`:''}
  <div class="nxcw"><canvas></canvas></div>
  <div class="nxcz"><span aria-hidden="true">−</span><input type="range" min="1" max="4" step="0.01" value="1" aria-label="التكبير"><span aria-hidden="true">+</span></div>
  <div class="ac"><button type="button" class="ok">اعتماد</button><button type="button" class="cx">إلغاء</button></div>`;
  const cv=d.querySelector('canvas'),ctx=cv.getContext('2d'),rg=d.querySelector('input[type=range]'),iw=im.naturalWidth,ih=im.naturalHeight;
  let W,H,base,z=1,x=0,y=0;const dpr=Math.min(2,window.devicePixelRatio||1);
  const size=()=>{const box=d.querySelector('.nxcw'),mw=Math.max(120,Math.min(520,(box.clientWidth||window.innerWidth*.8)-20)),mh=Math.min(380,window.innerHeight*.5);W=mw;H=W/ar;if(H>mh){H=mh;W=H*ar}cv.style.width=W+'px';cv.style.height=H+'px';cv.width=W*dpr;cv.height=H*dpr;base=Math.max(W/iw,H/ih)};
  const clamp=()=>{const s=base*z,dw=iw*s,dh=ih*s;x=Math.min(0,Math.max(W-dw,x));y=Math.min(0,Math.max(H-dh,y))};
  const draw=()=>{clamp();const s=base*z;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);ctx.drawImage(im,x,y,iw*s,ih*s);
   ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1;ctx.beginPath();for(let i=1;i<3;i++){ctx.moveTo(W*i/3,0);ctx.lineTo(W*i/3,H);ctx.moveTo(0,H*i/3);ctx.lineTo(W,H*i/3)}ctx.stroke()};
  const center=()=>{const s=base*z;x=(W-iw*s)/2;y=(H-ih*s)/2};
  const zoomAt=(nz,cx,cy)=>{nz=Math.min(4,Math.max(1,nz));const s0=base*z,s1=base*nz;x=cx-(cx-x)*s1/s0;y=cy-(cy-y)*s1/s0;z=nz;rg.value=z;draw()};
  d.showModal();size();center();draw();
  d.querySelectorAll('.nxca button').forEach(b=>b.onclick=()=>{d.querySelectorAll('.nxca button').forEach(o=>o.classList.toggle('on',o===b));ar=opts[+b.dataset.i][1]||iw/ih;z=1;rg.value=1;size();center();draw()});
  rg.oninput=()=>zoomAt(+rg.value,W/2,H/2);
  cv.onwheel=e=>{e.preventDefault();const r=cv.getBoundingClientRect();zoomAt(z*(e.deltaY<0?1.08:1/1.08),e.clientX-r.left,e.clientY-r.top)};
  const P=new Map();let pd=0;
  cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);P.set(e.pointerId,{x:e.clientX,y:e.clientY})};
  cv.onpointermove=e=>{if(!P.has(e.pointerId))return;const o=P.get(e.pointerId),n={x:e.clientX,y:e.clientY};
   if(P.size===1){x+=n.x-o.x;y+=n.y-o.y;draw()}else{P.set(e.pointerId,n);const [a,b]=[...P.values()],dist=Math.hypot(a.x-b.x,a.y-b.y),r=cv.getBoundingClientRect();if(pd)zoomAt(z*dist/pd,(a.x+b.x)/2-r.left,(a.y+b.y)/2-r.top);pd=dist;return}
   P.set(e.pointerId,n)};
  const up=e=>{P.delete(e.pointerId);pd=0};cv.onpointerup=up;cv.onpointercancel=up;
  cv.onkeydown=e=>{const k={ArrowLeft:[10,0],ArrowRight:[-10,0],ArrowUp:[0,10],ArrowDown:[0,-10]}[e.key];if(k){e.preventDefault();x+=k[0];y+=k[1];draw()}};cv.tabIndex=0;
  const finish=bl=>{window.removeEventListener('resize',onRs);URL.revokeObjectURL(url);d.close();done(bl)};
  const onRs=()=>{const fx=-x/(base*z)/iw,fy=-y/(base*z)/ih;size();x=-fx*iw*base*z;y=-fy*ih*base*z;draw()};window.addEventListener('resize',onRs);
  d.querySelector('.cx').onclick=()=>finish(null);d.oncancel=e=>{e.preventDefault();finish(null)};
  d.querySelector('.ok').onclick=()=>{const s=base*z,sx=-x/s,sy=-y/s,sw=W/s,sh=H/s,ow=Math.round(Math.min(cfg.w,sw)),oh=Math.round(ow/ar),o=document.createElement('canvas');o.width=ow;o.height=oh;
   const c2=o.getContext('2d');c2.imageSmoothingQuality='high';c2.drawImage(im,sx,sy,sw,sh,0,0,ow,oh);o.toBlob(b=>finish(b),'image/jpeg',.86)};
  };im.src=url})}
