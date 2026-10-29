// =====================================================================
// قائمة الحساب (الضغط على صورتك فوق): ملفك، الاشتراكات والفواتير، تسجيل الخروج
// يحتاج window.nexoDB (من auth-guard.js)
// =====================================================================
(function(){
var CSS=
'.nxam{position:fixed;z-index:60;width:230px;background:#fff;border:1px solid #DFE2E6;border-radius:12px;box-shadow:0 12px 32px rgba(32,31,73,.16);overflow:hidden;font-family:inherit;direction:rtl;color:#000}'+
'.nxam[hidden]{display:none}'+
'.nxam a,.nxam button{display:flex;align-items:center;gap:10px;width:100%;padding:11px 14px;border:0;border-top:1px solid #EEF0F2;background:none;font:inherit;font-size:12.5px;color:#000;text-decoration:none;cursor:pointer;text-align:right}'+
'.nxam>:first-child{border-top:0}'+
'.nxam a:hover,.nxam button:hover,.nxam a:focus-visible,.nxam button:focus-visible{background:#F6F6FA;outline:0}'+
'.nxam .nxu{padding:12px 14px}.nxam .nxu img,.nxam .nxu .nxi{width:30px;height:30px;border-radius:50%;object-fit:cover;flex:none;background:#201F49;color:#fff;display:grid;place-items:center;font-size:13px}'+
'.nxam .nxu b{display:block;font-size:13px;font-weight:700}.nxam .nxu small{display:block;font-size:10.5px;color:#9A9AAE;direction:ltr;text-align:right}'+
'.nxam .nxic{width:26px;height:26px;border-radius:7px;background:#F1F0FB;display:grid;place-items:center;flex:none}.nxam .nxic svg{width:14px;height:14px}'+
'.nxam .nxt{flex:1}.nxam .nxpro{font-size:9.5px;font-weight:700;background:#FAF999;color:#201F49;border-radius:99px;padding:1px 8px}'+
'.nxam .nxout{color:#BB0327}.nxam .nxout .nxic{background:#FDECEF}'+
'.nxcm{position:fixed;inset:0;z-index:70;background:rgba(32,31,73,.45);display:none;align-items:center;justify-content:center;padding:16px;font-family:inherit;direction:rtl}'+
'.nxcm.on{display:flex}'+
'.nxcm .nxb{position:relative;background:#fff;border-radius:28px;width:min(530px,100%);padding:30px 28px 28px;text-align:center;box-shadow:0 20px 60px rgba(32,31,73,.25);max-height:88vh;overflow:auto}'+
'.nxcm .nxx{position:absolute;left:22px;top:22px;width:32px;height:32px;border:0;background:none;border-radius:50%;cursor:pointer;display:grid;place-items:center}.nxcm .nxx:hover{background:#F4F4F6}'+
'.nxcm .nxx svg{width:18px;height:18px;stroke:#201F49;stroke-width:2;fill:none}'+
'.nxcm h3{margin:8px 0 8px;font-size:24px;font-weight:700;color:#000}'+
'.nxcm p{margin:0;font-size:14px;color:#797992;line-height:1.7}'+
'.nxcm .nxbt{display:flex;gap:12px;justify-content:center;margin-top:22px;flex-wrap:wrap}'+
'.nxcm .nxbt button,.nxcm .nxbt a{height:36px;min-width:124px;padding:0 24px;border-radius:99px;font:inherit;font-size:13px;font-weight:600;cursor:pointer;border:1px solid #201F49;display:inline-flex;align-items:center;justify-content:center;text-decoration:none}'+
'.nxcm .nxo{background:#fff;color:#201F49}.nxcm .nxf{background:#201F49;color:#fff;min-width:172px}'+
'.nxcm .nxf[disabled]{opacity:.6;cursor:default}'+
'.nxcm .nxs{margin-top:18px;text-align:right;border:1px solid #DFE2E6;border-radius:12px;padding:14px 16px}'+
'.nxcm .nxs div{display:flex;justify-content:space-between;gap:12px;font-size:13px;padding:6px 0}.nxcm .nxs span{color:#797992}'+
'.nxcm .nxs b{font-weight:600}.nxcm .nxok{color:#03BB43}.nxcm .nxno{color:#797992}'+
'.nxcm h4{margin:20px 0 8px;font-size:15px;text-align:right}'+
'.nxcm .nxinv{width:100%;border-collapse:collapse;font-size:12.5px;text-align:right}.nxcm .nxinv th{color:#9A9AAE;font-weight:500;padding:6px 4px;border-bottom:1px solid #EEF0F2}.nxcm .nxinv td{padding:10px 4px;border-bottom:1px solid #EEF0F2}'+
'.nxcm .nxe{font-size:12.5px;color:#9A9AAE;text-align:right;margin:0}';
var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
var E=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var U=function(s){return /^https:\/\/[^\s"'()<>]+$/.test(String(s||''))?s:''};
var IC={
 user:'<svg viewBox="0 0 24 24" fill="none" stroke="#201F49" stroke-width="2" stroke-linecap="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
 card:'<svg viewBox="0 0 24 24" fill="none" stroke="#201F49" stroke-width="2" stroke-linecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
 out:'<svg viewBox="0 0 24 24" fill="none" stroke="#BB0327" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>'
};
var XS='<button type="button" class="nxx" aria-label="إغلاق"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg></button>';
var ME=null,SUB=null,menu=null;
function ready(f){if(window.nexoDB)f();else addEventListener('nexo:ready',f,{once:true})}
function profileUrl(){return window.nexoDB&&nexoDB.kind==='team'?'dash-entity-profile.html':'dash-talent-profile.html'}
function active(s){return !!(s&&(s.status==='active'||(s.status==='trialing'&&s.trialEnd>Date.now())))}
function load(){return Promise.all([nexoDB.getMe().catch(function(){return {}}),nexoDB.getSubscription?nexoDB.getSubscription().catch(function(){return null}):null]).then(function(r){ME=r[0]||{};SUB=r[1]})}
function build(){
 var email=(nexoDB.user&&nexoDB.user.email)||'';
 var av=U(ME.ph)?'<img src="'+E(ME.ph)+'" alt="">':'<span class="nxi">'+E(String(ME.n||email||'؟').trim()[0]||'؟')+'</span>';
 menu.innerHTML=
  '<a class="nxu" href="'+profileUrl()+'" role="menuitem">'+av+'<span><b>'+E(ME.n||'ملفك الشخصي')+'</b><small>'+E(email)+'</small></span></a>'+
  '<button type="button" data-act="subs" role="menuitem"><span class="nxic">'+IC.card+'</span><span class="nxt">الاشتراكات والفواتير</span>'+(active(SUB)?'<span class="nxpro">Pro</span>':'')+'</button>'+
  '<button type="button" class="nxout" data-act="out" role="menuitem"><span class="nxic">'+IC.out+'</span><span class="nxt">تسجيل الخروج</span></button>';
}
function place(btn){var r=btn.getBoundingClientRect();menu.style.top=(r.bottom+8)+'px';var left=Math.max(8,Math.min(r.left,innerWidth-238));menu.style.left=left+'px'}
function closeMenu(){if(menu&&!menu.hidden){menu.hidden=true;var b=document.querySelector('[aria-expanded="true"][data-nxam]');if(b)b.setAttribute('aria-expanded','false')}}
function openMenu(btn){
 if(!menu){menu=document.createElement('div');menu.className='nxam';menu.setAttribute('role','menu');menu.hidden=true;document.body.appendChild(menu);
  menu.addEventListener('click',function(e){var b=e.target.closest('[data-act]');if(!b)return;closeMenu();if(b.dataset.act==='out')confirmOut();else showSubs()})}
 if(!menu.hidden){closeMenu();return}
 btn.setAttribute('data-nxam','');btn.setAttribute('aria-expanded','true');
 menu.innerHTML='<div class="nxu" style="padding:14px;font-size:12px;color:#9A9AAE">جاري التحميل...</div>';
 place(btn);menu.hidden=false;
 ready(function(){load().then(function(){build();place(btn)})});
}
function modal(html){
 var m=document.getElementById('nxcm');
 if(!m){m=document.createElement('div');m.id='nxcm';m.className='nxcm';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');document.body.appendChild(m);
  m.addEventListener('click',function(e){if(e.target===m||e.target.closest('.nxx,.nxo'))closeModal()})}
 m.innerHTML='<div class="nxb">'+XS+html+'</div>';m.classList.add('on');
 var f=m.querySelector('.nxo,.nxf,.nxx');if(f)f.focus();return m;
}
function closeModal(){var m=document.getElementById('nxcm');if(m)m.classList.remove('on')}
function confirmOut(){
 var m=modal('<h3>تأكيد تسجيل الخروج</h3><p>هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك في نيكسو؟</p><div class="nxbt"><button type="button" class="nxo">إلغاء</button><button type="button" class="nxf">تسجيل الخروج</button></div>');
 m.querySelector('.nxf').onclick=function(){
  var b=this;b.disabled=true;b.textContent='جاري تسجيل الخروج...';
  ready(function(){
   var go=function(){location.replace('/auth.html#/login')};
   (nexoDB.signOut?nexoDB.signOut():Promise.resolve()).then(function(r){if(r&&r.error)throw r.error;go()}).catch(function(e){console.error(e);b.disabled=false;b.textContent='تسجيل الخروج';var p=m.querySelector('p');p.textContent='تعذر تسجيل الخروج، حاول مرة ثانية'});
  });
 };
}
function day(t){return new Date(t).toLocaleDateString('ar-SA-u-ca-gregory-nu-latn',{day:'numeric',month:'long',year:'numeric'})}
function showSubs(){
 modal('<h3>الاشتراكات والفواتير</h3><p>جاري التحميل...</p>');
 ready(function(){load().then(function(){
  var s=SUB,on=active(s),plan=s&&(s.plan==='m'?'شهري':'سنوي');
  var state=!s?'<b class="nxno">غير مشترك</b>':s.status==='active'?'<b class="nxok">مشترك</b>':on?'<b class="nxok">تجربة مجانية</b>':'<b class="nxno">منتهي</b>';
  var rows='<div><span>الحالة</span>'+state+'</div>'+
   (s?'<div><span>الباقة</span><b>الباقة العليا · '+plan+'</b></div>':'')+
   (s&&s.start?'<div><span>تاريخ البداية</span><b>'+day(s.start)+'</b></div>':'')+
   (s&&s.status==='trialing'&&s.trialEnd?'<div><span>'+(on?'تنتهي التجربة':'انتهت التجربة')+'</span><b>'+day(s.trialEnd)+'</b></div>':'');
  var inv=s&&s.start?'<table class="nxinv"><thead><tr><th>التاريخ</th><th>الوصف</th><th>المبلغ</th></tr></thead><tbody><tr><td>'+day(s.start)+'</td><td>الباقة العليا · '+plan+(s.status==='trialing'?' (تجربة مجانية)':'')+'</td><td>0 ر.س</td></tr></tbody></table>':'<p class="nxe">لا توجد فواتير بعد</p>';
  var btns=on?'<button type="button" class="nxo">إغلاق</button>':'<button type="button" class="nxo">إغلاق</button><a class="nxf" href="dash-payment.html">جرّب مجانًا</a>';
  modal('<h3>الاشتراكات والفواتير</h3><div class="nxs">'+rows+'</div><h4>الفواتير</h4>'+inv+'<div class="nxbt">'+btns+'</div>');
 })});
}
// الضغط على صورتك فوق يفتح القائمة (بدل ما يروح للملف مباشرة)
document.addEventListener('click',function(e){
 var b=e.target.closest('#mew,.nav-av');
 if(b){e.preventDefault();e.stopImmediatePropagation();openMenu(b);return}
 if(menu&&!menu.hidden&&!e.target.closest('.nxam'))closeMenu();
},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeMenu();closeModal()}});
addEventListener('resize',closeMenu);addEventListener('scroll',closeMenu,{passive:true});
})();
