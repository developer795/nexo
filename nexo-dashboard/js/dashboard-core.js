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
const hit=o=>!Q||JSON.stringify(o).includes(Q);
const CITIES=['الرياض','جدة','مكة المكرمة','المدينة المنورة','الدمام','الخبر','الظهران','الأحساء','القطيف','الجبيل','الطائف','بريدة','عنيزة','الرس','حائل','تبوك','أبها','خميس مشيط','بيشة','نجران','جازان','صبيا','أبو عريش','ينبع','رابغ','الليث','القنفذة','الباحة','سكاكا','دومة الجندل','عرعر','رفحاء','طريف','القريات','حفر الباطن','الخرج','الدرعية','الزلفي','المجمعة','شقراء','الدوادمي','وادي الدواسر','الأفلاج','العلا','الوجه','ضباء','تيماء','خيبر','شرورة','محايل عسير','بقيق','رأس تنورة','النعيرية'];
const CL=c=>c&&!CITIES.includes(c)?[...CITIES,c]:CITIES;
const cities=k=>[...new Set([...CITIES,...D[k].map(x=>x.city).filter(Boolean)])];
const sel=(k,n,p,ops)=>`<select aria-label="${p}" onchange="X.${k}.${n}=this.value;R()"><option value="">${p}</option>${ops.map(o=>`<option ${X[k][n]===o?'selected':''}>${E(o)}</option>`).join('')}</select>`;
const bar=(k,ch,key,dd)=>`<div class="fl">${ch.map(([l,x])=>`<button class="ch ${F[k]===x?'on':''}" onclick="F.${k}='${x}';R()">${l} (${x?D[k].filter(i=>i[key]===x).length:D[k].length})</button>`).join('')}<div class="dd">${dd}</div></div>`;
const head=(t,s)=>`<h1>${t}</h1><p class="sb">${s}</p>`;
const em=m=>`<p class="empty">${m}<br>اضغط على زر + لإضافة أول عنصر</p>`;
const STS=['يبحث عن فريق','منضم لفريق'],ROLES=['لاعب','صانع محتوى','ستريمر'],OT=['عقد عمل','تدريب تعاوني','تدريب مهني','حملة اعلانية','مشاركة في البطولة'];
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
 $('#fm').innerHTML=`<h2>${t}</h2>`+f.map(([n,ty,l,op,opt])=>`<label for="f${n}">${l}</label>`+(ty==='textarea'?`<textarea id="f${n}" name="${n}" ${opt?'':'required'} placeholder="${l}">${E(m[n]||'')}</textarea>`:ty==='city'?`<select id="f${n}" name="${n}" required><option value="" disabled ${m[n]?'':'selected'}>اختر المدينة</option>${CL(m[n]).map(x=>`<option ${m[n]===x?'selected':''}>${E(x)}</option>`).join('')}</select>`:ty==='select'?`<select id="f${n}" name="${n}">${op.map(x=>`<option ${m[n]===x?'selected':''}>${x}</option>`).join('')}</select>`:ty==='file'?`<input id="f${n}" name="${n}" type="file" accept="image/*">`:`<input id="f${n}" name="${n}" type="${ty}" value="${E(m[n]||'')}" ${opt?'':'required'} placeholder="${l}">`)).join('')+`<div class="ac"><button class="ok">${ok}</button><button type="button" onclick="$('#dlg').close()">إلغاء</button></div>`;
 $('#fm').onsubmit=async e=>{e.preventDefault();const b=e.target.querySelector('.ok');if(b.disabled)return;b.disabled=true;const lbl=b.textContent;b.textContent='جاري الحفظ...';
  try{const o={};for(const[n,x]of new FormData(e.target).entries())o[n]=x instanceof File?await nexoDB.upload(await rz(x,n==='ph'?300:900)):String(x).trim();
   await add(o);await load();$('#dlg').close();R()}
  catch(err){console.error(err);alert(err.message||'حدث خطأ، حاول مرة ثانية')}
  finally{b.disabled=false;b.textContent=lbl}};$('#dlg').showModal()}
function R(){document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.v===(v==='detail'?'opps':v)));
 $('#mew').innerHTML=U(D.me.ph)?`<img class="me" src="${E(U(D.me.ph))}" alt="ملفي">`:`<b class="ini me">${ini(D.me.n)}</b>`;
 if(!LOADED){$('#m').innerHTML='<p class="empty">جاري التحميل...</p>';$('#fab').style.display='none';return}
 $('#m').innerHTML=V[v]();$('#fab').style.display=v==='home'||v==='detail'?'none':'block'}
$('#q').oninput=e=>{Q=e.target.value.trim();R()};$('#fab').onclick=()=>F_(v);
