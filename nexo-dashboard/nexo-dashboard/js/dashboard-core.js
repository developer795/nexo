const $=s=>document.querySelector(s),E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PIN='<svg width="9" height="10" fill="none" stroke="#797992" stroke-width="1.2"><path d="M4.5 9C2 6.5 1 5 1 3.8a3.5 3.5 0 017 0C8 5 7 6.5 4.5 9z"/><circle cx="4.5" cy="3.8" r="1.2"/></svg>';
const USR='<svg width="10" height="10" fill="none" stroke="#797992" stroke-width="1.1"><circle cx="3.5" cy="3" r="1.6"/><circle cx="7.3" cy="3.6" r="1.2"/><path d="M1 8.5c0-2 5-2 5 0M6.5 6.5c2-.3 2.8 1 2.8 2"/></svg>';
const PEN='<svg width="12" height="12" fill="none" stroke="#fff" stroke-width="1.3"><path d="M5 2H3a1.500 1.500 0 00-1.500 1.500v5.500A1.500 1.500 0 003 10.500h5.500A1.500 1.500 0 0010 9V7M9 1.500l1.500 1.500-4.500 4.500H4.500V6z"/></svg>';
const K='nexo_p16_20_v3';let D;try{D=JSON.parse(localStorage.getItem(K))}catch(e){}
if(!D||!D.opps)D={me:{},posts:[],talents:[],teams:[],opps:[]};
const sv=()=>{try{localStorage.setItem(K,JSON.stringify(D))}catch(e){alert('مساحة التخزين ممتلئة، جرّب صورًا أصغر')}};
const ini=n=>E(String(n||'؟').trim()[0]||'؟');
const pic=(s,n)=>s?`<img src="${s}" alt="">`:`<b class="ini">${ini(n)}</b>`;
const ph=(s,n)=>s?`<img class="ph" src="${s}" alt="">`:`<div class="ph" style="background:#201F49">${ini(n)}</div>`;
const cv=s=>`style="background:${s?`#000 url('${s}') center/cover`:'#000'}"`;
let v='',cur=0,Q='';const F={talents:'',teams:'',opps:''},X={talents:{},teams:{},opps:{}};
const txt=o=>[o.n,o.role,o.g,o.city,o.s,o.title,o.org,o.type,o.aud,o.d,o.t,o.sub,o.bio,o.r].filter(Boolean).join(' ').toLowerCase();
const hit=o=>!Q||txt(o).includes(Q.toLowerCase());
const CITIES=['الرياض','جدة','مكة المكرمة','المدينة المنورة','الدمام','الخبر','الظهران','الأحساء','القطيف','الجبيل','الطائف','بريدة','عنيزة','الرس','حائل','تبوك','أبها','خميس مشيط','بيشة','نجران','جازان','صبيا','أبو عريش','ينبع','رابغ','الليث','القنفذة','الباحة','سكاكا','دومة الجندل','عرعر','رفحاء','طريف','القريات','حفر الباطن','الخرج','الدرعية','الزلفي','المجمعة','شقراء','الدوادمي','وادي الدواسر','الأفلاج','العلا','الوجه','ضباء','تيماء','خيبر','شرورة','محايل عسير','بقيق','رأس تنورة','النعيرية'];
const CL=c=>c&&!CITIES.includes(c)?[...CITIES,c]:CITIES;
const cities=k=>[...new Set([...CITIES,...D[k].map(x=>x.city).filter(Boolean)])];
const CHEV='<svg width="12" height="12" fill="none" stroke="#797992" stroke-width="1.6" aria-hidden="true"><path d="M2 4l4 4 4-4"/></svg>';
/* قائمة منسدلة بنفس تصميم فيجما (بدل select الافتراضي) — اختيار نفس الخيار مرة ثانية يلغيه */
const sel=(k,n,p,ops,lab)=>{const val=X[k][n]||'',L=x=>(lab&&lab[x])||x;return`<div class="dsel${val?' on':''}"><button type="button" class="dsb" aria-haspopup="listbox" aria-expanded="false" aria-label="${p}" onclick="DS(this)"><span>${E(val?L(val):p)}</span>${CHEV}</button><div class="dsl" role="listbox" hidden>${ops.map(o=>`<button type="button" role="option" aria-selected="${val===o}" class="dso${val===o?' on':''}" data-v="${E(o)}" onclick="DSS('${k}','${n}',this.dataset.v)">${E(L(o))}</button>`).join('')}</div></div>`};
function DS(b){const l=b.nextElementSibling,open=l.hidden;document.querySelectorAll('.dsl').forEach(x=>{x.hidden=true;x.previousElementSibling.setAttribute('aria-expanded','false')});if(open){l.hidden=false;b.setAttribute('aria-expanded','true')}}
function DSS(k,n,v){X[k][n]=X[k][n]===v?'':v;R()}
document.addEventListener('click',e=>{if(!e.target.closest('.dsel'))document.querySelectorAll('.dsl').forEach(x=>x.hidden=true)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.dsl').forEach(x=>x.hidden=true)});
const SL={'يبحث عن فريق':'يبحث عن فرصة'};
const bar=(k,ch,key,dd)=>`<div class="fl">${ch.map(([l,x])=>`<button class="ch ${F[k]===x?'on':''}" onclick="F.${k}='${x}';R()">${l} (${x?D[k].filter(i=>i[key]===x).length:D[k].length})</button>`).join('')}<div class="dd">${dd}</div></div>`;
const head=(t,s)=>`<h1>${t}</h1><p class="sb">${s}</p>`;
const em=m=>`<p class="empty">${m}</p>`;
const STS=['يبحث عن فريق','منضم لفريق'],ROLES=['لاعب','صانع محتوى','ستريمر'],OT=['عقد عمل','تدريب تعاوني','حملة إعلانية','مشاركة في بطولة','تدريب مهني'];
const M=D.me;
const V={};
function AP(id){const o=D.opps.find(x=>x.id===id);if(o&&!o.ap){o.ap=1;o.n++;sv();R()}}
const FM={
 me:['ملفك الشخصي','حفظ',[['n','text','الاسم'],['ph','file','صورتك الشخصية',0,1],['cv','file','صورة الغلاف',0,1],['role','select','أنت',ROLES],['g','text','اللعبة أو المنصة',0,1],['city','city','المدينة'],['s','radio','الحالة',STS]],o=>{Object.entries(o).forEach(([k,x])=>{if(x)D.me[k]=x})}],
 posts:['إنشاء منشور','نشر',[['t','textarea','شارك أفكارك مع مجتمع نيكسو'],['im','file','صورة (اختياري)',0,1]],o=>D.posts.unshift({n:D.me.n,r:D.me.role,a:D.me.ph,t:o.t,im:o.im,at:Date.now()})],
 talents:['إضافة موهبة','إضافة',[['n','text','الاسم'],['ph','file','الصورة الشخصية',0,1],['cv','file','صورة الغلاف',0,1],['role','select','الدور',ROLES],['g','text','اللعبة أو المنصة',0,1],['city','city','المدينة'],['s','select','الحالة',STS]],o=>D.talents.unshift(o)],
 teams:['إضافة نادي أو جهة','إضافة',[['n','text','الاسم'],['ph','file','الشعار',0,1],['cv','file','صورة الغلاف',0,1],['type','select','النوع',['نادي','جهة','مقدم خدمة']],['sub','text','وصف قصير',0,1],['city','city','المدينة']],o=>D.teams.unshift(o)],
 opps:['إنشاء فرصة','نشر الفرصة',[['title','text','اسم الفرصة'],['org','text','اسم الجهة'],['ph','file','شعار الجهة',0,1],['type','select','نوع الفرصة',OT],['aud','select','الفئة',ROLES],['g','text','اللعبة (اختياري)',0,1],['city','city','المدينة'],['due','date','آخر موعد'],['d','textarea','اكتب تفاصيل الفرصة']],o=>D.opps.unshift({...o,id:Date.now(),n:0})]};
const rz=(f,w)=>new Promise(r=>{if(!f||!f.size)return r('');const u=URL.createObjectURL(f),i=new Image();i.onload=()=>{const s=Math.min(1,w/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);r(c.toDataURL(f.type==='image/png'&&w<=300?'image/png':'image/jpeg',.78));URL.revokeObjectURL(u)};i.onerror=()=>r('');i.src=u});
const RL={'يبحث عن فريق':'أبحث عن فرصة','منضم لفريق':'منضم لفريق'};
const STEPS=[['لنبدأ بملفك','اسمك وصورك تظهر لمجتمع نيكسو',['n','ph','cv']],['وش دورك؟','اختر دورك واللعبة أو المنصة',['role','g']],['وين مدينتك؟','تساعدنا نعرض لك الفرص القريبة منك',['city']],['حدد وضعك الحالي','اختر الخيار المناسب لك',['s']]];
const XB=`<button type="button" class="x" onclick="$('#dlg').close()" aria-label="إغلاق"><svg width="14" height="14" stroke="#000" stroke-width="1.8"><path d="M1 1l12 12M13 1L1 13"/></svg></button>`;
function MD(t,sub,body,ok,done){$('#fm').noValidate=false;$('#fm').onchange=null;$('#fm').innerHTML=XB+`<h2 class="mt2">${t}</h2>${sub?`<p class="msub">${sub}</p>`:''}${body}<div class="ac"><button class="ok">${ok}</button></div>`;
 $('#fm').onsubmit=e=>{e.preventDefault();const o={};for(const[n,x]of new FormData(e.target).entries())o[n]=String(x).trim();done(o);sv();$('#dlg').close();R()};$('#dlg').showModal()}
function F_(k){if(k==='posts'&&!D.me.n)k='me';const[t,ok,f,add]=FM[k],m=k==='me'?D.me:{},wiz=k==='me'&&!D.me.n;
 const fld=([n,ty,l,op,opt])=>(ty==='radio'&&wiz?'':`<label for="f${n}">${l}</label>`)+(ty==='radio'?`<div class="rd">${op.map(x=>`<label class="ro"><input type="radio" name="${n}" value="${x}" ${m[n]===x?'checked':''} required><span>${RL[x]||x}</span></label>`).join('')}</div>`:ty==='textarea'?`<textarea id="f${n}" name="${n}" ${opt?'':'required'} placeholder="${l}"></textarea>`:ty==='city'?`<select id="f${n}" name="${n}" required><option value="" disabled hidden ${m[n]?'':'selected'}>المدينة</option>${CL(m[n]).map(x=>`<option ${m[n]===x?'selected':''}>${E(x)}</option>`).join('')}</select>`:ty==='select'?`<select id="f${n}" name="${n}">${op.map(x=>`<option ${m[n]===x?'selected':''}>${x}</option>`).join('')}</select>`:ty==='file'?`<input id="f${n}" name="${n}" type="file" accept="image/*">`:`<input id="f${n}" name="${n}" type="${ty}" value="${E(m[n]||'')}" ${opt?'':'required'} placeholder="${l}">`);
 let st=0;const fm=$('#fm');fm.noValidate=wiz;fm.onchange=null;
 fm.innerHTML=XB+(wiz?`<div class="pg4">${STEPS.map(()=>'<i></i>').join('')}</div>`+STEPS.map((s,i)=>`<div class="stp" ${i?'hidden':''}><h2>${s[0]}</h2><p class="msub">${s[1]}</p>${s[2].map(n=>fld(f.find(x=>x[0]===n))).join('')}</div>`).join('')+`<div class="ac"><button class="ok" id="wn">التالي</button><button type="button" id="wb" hidden>السابق</button></div>`:`<h2>${t}</h2>`+f.map(fld).join('')+`<div class="ac"><button class="ok">${ok}</button><button type="button" onclick="$('#dlg').close()">إلغاء</button></div>`);
 const S=[...fm.querySelectorAll('.stp')],last=S.length-1;
 const go=i=>{st=i;S.forEach((d,j)=>d.hidden=j!==i);fm.querySelectorAll('.pg4 i').forEach((b,j)=>b.classList.toggle('on',j<=i));$('#wb').hidden=!i;$('#wn').textContent=i===last?'إنشاء الحساب':'التالي';chk()};
 const chk=()=>{if(wiz)$('#wn').disabled=st===last&&!fm.querySelector('input[name="s"]:checked')};
 const okStep=d=>[...d.querySelectorAll('input,select,textarea')].every(x=>x.checkValidity()||(x.reportValidity(),0));
 if(wiz){go(0);fm.onchange=chk;$('#wb').onclick=()=>go(st-1)}
 fm.onsubmit=async e=>{e.preventDefault();if(wiz){if(!okStep(S[st]))return;if(st<last)return go(st+1);const bad=S.findIndex(d=>![...d.querySelectorAll('input,select,textarea')].every(x=>x.checkValidity()));if(bad>-1){go(bad);return okStep(S[bad])}}
  const o={};for(const[n,x]of new FormData(e.target).entries())o[n]=x instanceof File?await rz(x,n==='ph'?300:900):String(x).trim();add(o);sv();if(wiz){goMe();return}$('#dlg').close();R()};$('#dlg').showModal()}
function R(){document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.v===({detail:'opps',pay:'opps',talentview:'talents',teamview:'teams'}[v]||v)));
 $('#mew').innerHTML=D.me.ph?`<img class="me" src="${D.me.ph}" alt="ملفي">`:`<b class="ini me">${ini(D.me.n)}</b>`;
 $('#m').innerHTML=Q?SR():V[v]()}
$('#q').oninput=e=>{Q=e.target.value.trim();R()};

/* ===== بيانات تجريبية: مواهب وجهات وفرص (تُستبدل ببيانات المنصة الحقيقية) ===== */
const svgCv=(a,b)=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="120" fill="url(#g)"/><path d="M0 90L80 40l70 50 90-70 160 100V120H0z" fill="#fff" opacity=".08"/></svg>`);
const SEED={
 talents:[
  {id:'s1',n:'Rakan.FC',role:'لاعب',g:'EA SPORTS FC',city:'الرياض',s:'يبحث عن فريق',cv:svgCv('#201F49','#3B3A7A'),bio:'لاعب تنافسي في EA SPORTS FC، شاركت في عدة بطولات محلية وأطمح للانضمام لفريق محترف.',games:[{n:'EA SPORTS FC',r:'لاعب محترف',t:'تنافسي',d:'PS5'}],matches:[{t:'دوري النخبة للرياضات الإلكترونية',tm:'فريق مستقل',g:'EA SPORTS FC',p:'المركز الثالث',d:'PS5'}],social:{x:'x.com/rakanfc'}},
  {id:'s2',n:'Ziyad_RL',role:'لاعب',g:'Rocket League',city:'جدة',s:'منضم لفريق',cv:svgCv('#0B3D2E','#1F7A5A'),bio:'لاعب Rocket League منذ 2019، أركز على اللعب الجماعي وصناعة الأهداف.',games:[{n:'Rocket League',r:'لاعب',t:'تنافسي',d:'PC'}],matches:[],social:{x:'x.com/ziyad_rl',tt:'tiktok.com/@ziyad_rl'}},
  {id:'s3',n:'Faisal Strike',role:'لاعب',g:'Valorant',city:'الدمام',s:'يبحث عن فريق',cv:svgCv('#4A0D1A','#B3263E'),bio:'',games:[{n:'Valorant',r:'Duelist',t:'تنافسي',d:'PC'}],matches:[],social:{}},
  {id:'s4',n:'Lama Streams',role:'ستريمر',g:'Twitch',city:'الرياض',s:'منضم لفريق',cv:svgCv('#2B1055','#7597DE'),bio:'ستريمر أبث بشكل يومي ألعاب المغامرات والألعاب التنافسية.',games:[],matches:[],social:{x:'x.com/lamastreams'}},
  {id:'s5',n:'Nouf Creates',role:'صانع محتوى',g:'YouTube',city:'أبها',s:'يبحث عن فريق',cv:svgCv('#3D2C00','#C9A227'),bio:'صانعة محتوى عن أخبار الرياضات الإلكترونية والمراجعات.',games:[],matches:[],social:{tt:'tiktok.com/@noufcreates'}},
  {id:'s6',n:'Saud Plays',role:'صانع محتوى',g:'TikTok',city:'مكة المكرمة',s:'منضم لفريق',cv:svgCv('#00303A','#00A3B4'),bio:'',games:[],matches:[],social:{}}],
 teams:[
  {id:'t1',n:'نادي الصقور',type:'نادي',sub:'نادي رياضات إلكترونية',city:'الرياض',bio:'نادي سعودي للرياضات الإلكترونية ينافس في بطولات EA SPORTS FC و Rocket League، ويدعم المواهب المحلية ويطوّرها.',social:{x:'x.com/alsuqoor_esports'},cv:svgCv('#7A1F0E','#E0532F')},
  {id:'t2',n:'فريق نجم',type:'نادي',sub:'فريق الرياضات الإلكترونية',city:'جدة',bio:'فريق رياضات إلكترونية من جدة، يركّز على صناعة المحتوى والبث المباشر إلى جانب المنافسة.',social:{x:'x.com/najm_gg',tt:'tiktok.com/@najm_gg'},cv:svgCv('#24125C','#7B4DFF')},
  {id:'t3',n:'شركة ساحة للترفيه',type:'مقدم خدمة',sub:'مقدم خدمة',city:'الرياض',bio:'شركة تنظّم البطولات والفعاليات الترفيهية للرياضات الإلكترونية في المملكة.',social:{li:'linkedin.com/company/saha'},cv:svgCv('#111','#3A3A3A')},
  {id:'t4',n:'اتحاد الألعاب الإقليمي',type:'جهة',sub:'جهة منظمة للبطولات',city:'الخبر',bio:'جهة تنظّم البطولات الإقليمية وتطلق برامج تدريب لصنّاع المحتوى والمنظمين.',social:{},cv:svgCv('#0E3A66','#2C7FD1')}],
 opps:[
  {id:9001,title:'لاعب',org:'شركة ساحة للترفيه',type:'مشاركة في بطولة',aud:'لاعب',g:'EA SPORTS FC',city:'الرياض',due:'2026-12-15',n:6,d:'تعلن شركة ساحة للترفيه عن إتاحة فرصة للاعبين للمشاركة في بطولة تنافسية للعبة EA SPORTS FC ضمن فعاليات الرياضات الإلكترونية.\n\nالمتطلبات:\n• امتلاك حساب نشط في لعبة EA SPORTS FC.\n• معرفة جيدة بأساسيات اللعبة وقواعد المنافسات.\n• الالتزام بمواعيد المباريات والجدول المحدد.\n\nما تقدمه الفرصة:\n• المشاركة في بطولة EA SPORTS FC تنافسية.\n• مواجهة لاعبين آخرين ضمن منافسات منظمة.\n• فرصة لإظهار مهاراتك وتطوير مستواك التنافسي.'},
  {id:9002,title:'لاعب',org:'نادي الصقور',type:'عقد عمل',aud:'لاعب',g:'EA SPORTS FC',city:'الرياض',due:'2026-12-01',n:10,d:'يبحث نادي الصقور عن لاعب EA SPORTS FC للانضمام للفريق الأول بعقد احترافي.\n\nالمتطلبات:\n• خبرة في البطولات المحلية.\n• الالتزام بجدول التدريبات اليومي.'},
  {id:9003,title:'ستريمر',org:'فريق نجم',type:'حملة إعلانية',aud:'ستريمر',city:'جدة',due:'2026-11-30',n:4,d:'حملة إعلانية لبث مباشر خلال موسم البطولات مع فريق نجم.'},
  {id:9004,title:'متدرب',org:'اتحاد الألعاب الإقليمي',type:'تدريب تعاوني',aud:'صانع محتوى',city:'الخبر',due:'2027-01-10',n:3,d:'فرصة تدريب تعاوني في إدارة المحتوى والتغطية الإعلامية للبطولات.'},
  {id:9005,title:'صانع محتوى',org:'شركة ساحة للترفيه',type:'تدريب مهني',aud:'صانع محتوى',city:'الرياض',due:'2026-12-20',n:8,d:'برنامج تدريب مهني لصناع المحتوى في مجال الرياضات الإلكترونية.'}]};
if(!D.seed){D.seed=1;D.talents=[...SEED.talents,...D.talents];D.teams=[...SEED.teams,...D.teams];D.opps=[...SEED.opps,...D.opps];sv()}
D.talents.forEach((t,i)=>{if(!t.id)t.id='u'+i});
D.teams.forEach((t,i)=>{if(!t.id)t.id='j'+i;const sd=SEED.teams.find(x=>x.n===t.n);if(sd)Object.keys(sd).forEach(k=>{if(t[k]==null)t[k]=sd[k]})});
/* الضغط على بطاقة موهبة أو جهة يفتح صفحتها (يشتغل حتى مع ملفات الصفحات القديمة) */
document.addEventListener('click',e=>{const c=e.target.closest('#m .card.t');if(!c||c.tagName==='A')return;const n=(c.querySelector('h3')||{}).textContent;if(!n)return;
 if(v==='teams'){const t=D.teams.find(x=>x.n===n.trim());if(t)location.href='dash-entity-visitor.html?team='+encodeURIComponent(t.id)}
 else if(v==='talents'){if(D.me.n===n.trim())return goMe();const t=D.talents.find(x=>x.n===n.trim());if(t)location.href='dash-talent-visitor.html?t='+encodeURIComponent(t.id)}});
D.opps.forEach(o=>{o.type={'حملة اعلانية':'حملة إعلانية','مشاركة في البطولة':'مشاركة في بطولة'}[o.type]||o.type});
/* ===== البحث الشامل ===== */
function SR(){const T=[...(D.me.n?[{...D.me,me:1}]:[]),...D.talents].filter(hit),TM=D.teams.filter(hit),O=D.opps.filter(hit),P=D.posts.filter(hit),all=T.length+TM.length+O.length+P.length;
 const g=(t,list)=>list.length?`<h2 class="srh">${t} <span>${list.length}</span></h2><div class="srl">${list.join('')}</div>`:'';
 const row=(href,img,nm,sub,tag='')=>`<a class="card sri" href="${href}">${img}<div><b>${E(nm)}</b><span>${E(sub)}</span></div>${tag}</a>`;
 return`<h1>نتائج البحث</h1><p class="sb">عن "${E(Q)}" · ${all} نتيجة</p>`+(all?
  g('المواهب',T.map(t=>row(t.me?'dash-talent-profile.html" data-profile="':'dash-talent-visitor.html?t='+encodeURIComponent(t.id),pic(t.ph,t.n),t.n+(t.me?' (أنت)':''),[t.role,t.g,t.city].filter(Boolean).join(' · '))))+
  g('الفرق والجهات',TM.map(t=>row('dash-teams.html',pic(t.ph,t.n),t.n,[t.sub||t.type,t.city].filter(Boolean).join(' · '))))+
  g('الفرص',O.map(o=>row(D.sub?'dash-opportunity-details.html?id='+o.id:'dash-opportunities.html',pic(o.ph,o.org),o.title+' · '+o.org,[o.type,o.city].filter(Boolean).join(' · '),D.sub?'':'<span class="lk">للمشتركين</span>')))+
  g('المنشورات',P.map(p=>row(p.n===D.me.n?'dash-talent-profile.html" data-profile="':'dash-home.html',pic(p.a,p.n),p.n,p.t.length>90?p.t.slice(0,90)+'…':p.t)))
  :`<p class="empty">ما لقينا نتائج تطابق بحثك. جرّب كلمة ثانية.</p>`)}
/* الضغط على صورتك فوق يفتح صفحة البروفايل دائمًا (حتى لو كانت صفحة HTML قديمة) */
/* صورتك فوق تفتح ملفك (auth-guard يحدد صفحة اللاعب أو الجهة حسب نوع الحساب) */
function goMe(){const a=document.querySelector('[data-profile]');if(a)a.click();else location.href='dash-talent-profile.html'}
(function(){const w=$('#mew');if(w){w.onclick=null;w.setAttribute('data-profile','');w.title='ملفي'}})();
/* زر + انشال حسب ملاحظات المقطع — نحذفه لو كان موجود في صفحة HTML قديمة */
(function(){const f=document.getElementById('fab');if(f)f.remove()})();
