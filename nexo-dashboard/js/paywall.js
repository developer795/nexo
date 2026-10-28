// =====================================================================
// نافذة الباقة العليا ("الفرصة الخاصة ليست للجميع")
// الفرص للمشتركين أو اللي في التجربة المجانية فقط.
// لو غير المشترك ضغط "الفرص" (أو أي رابط فرصة) من أي صفحة، تطلع النافذة
// فوق نفس الصفحة، وزر X يقفلها ويبقى في مكانه.
// يحتاج window.nexoDB (من auth-guard.js)
// =====================================================================
(function(){
var CSS="/* ===== \u0646\u0627\u0641\u0630\u0629 \u0627\u0644\u0628\u0627\u0642\u0629 \u0627\u0644\u0639\u0644\u064a\u0627 ===== */\ndialog.pw{padding:0;width:min(420px,92vw);border-radius:28px;overflow:hidden}\ndialog.pw .pwt{position:relative;height:118px;background:radial-gradient(circle at 50% 50%,#3A3970 0 34px,#2E2D5E 35px 62px,#262556 63px 92px,#201F49 93px)}\ndialog.pw .crw{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:60px;height:60px;border-radius:50%;background:#55548A;display:grid;place-items:center}\ndialog.pw .x2{position:absolute;right:20px;top:20px;border:0;background:none;cursor:pointer;padding:6px}\ndialog.pw .dt1{position:absolute;right:56px;bottom:22px;width:9px;height:9px;border-radius:50%;background:#F3D52B}\ndialog.pw .spk{position:absolute;left:28px;top:28px;color:#F3D52B;font-size:22px}\ndialog.pw .pwb{padding:26px 26px 24px;text-align:center}.pwb h2{margin:0;font-size:22px;font-weight:700}\ndialog.pw .pwb p{margin:10px 0 18px;font-size:12.5px;color:#9A9AAE;line-height:1.8}\ndialog.pw .ft3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px}\ndialog.pw .ft3 div{border:1px solid #DFE2E6;border-radius:8px;padding:12px 4px;display:flex;flex-direction:column;align-items:center;gap:8px;font-size:11.5px;font-weight:600}\n\ndialog.pw .ap{width:100%;height:44px;border:0;border-radius:99px;background:#201F49;color:#fff;font-size:16px;font-weight:600;cursor:pointer}\ndialog.pw .x2{right:auto;left:20px}\ndialog.pw .spk{left:auto;right:28px}\ndialog.pw .dt1{right:auto;left:60px}\ndialog.pw .x2{z-index:2}\ndialog.pw{border:0;font-family:inherit;color:#000;margin:auto;padding:0;position:fixed;inset:0;height:fit-content;max-height:92vh;overflow:auto}\ndialog.pw::backdrop{background:rgba(32,31,73,.45)}\n";
var SUBST=null; // null = لسا ما تحمّل
function active(s){return !!(s&&(s.status==='active'||(s.status==='trialing'&&s.trialEnd>Date.now())))}
function load(){return window.nexoDB&&nexoDB.getSubscription?nexoDB.getSubscription().then(function(s){SUBST=active(s);return SUBST}).catch(function(){SUBST=false;return false}):Promise.resolve(false)}
var ready=new Promise(function(r){if(window.nexoDB)r();else addEventListener('nexo:ready',r,{once:true})}).then(load);
function show(onClose){
 if(!document.getElementById('nxpwcss')){var st=document.createElement('style');st.id='nxpwcss';st.textContent=CSS;document.head.appendChild(st)}
 var d=document.querySelector('dialog.pw');
 if(!d){var d=document.createElement('dialog');d.className='pw';
 var ic=p=>`<svg width="18" height="18" fill="none" stroke="#03BB43" stroke-width="1.5">${p}</svg>`;
 d.innerHTML=`<div class="pwt"><button class="x2" aria-label="إغلاق"><svg width="16" height="16" stroke="#fff" stroke-width="2"><path d="M2 2l12 12M14 2L2 14"/></svg></button><i class="dt1"></i><span class="spk">✦</span><div class="crw"><svg width="30" height="24" viewBox="0 0 30 24"><path d="M2 7l7 6 6-10 6 10 7-6-3 15H5z" fill="#F3D52B"/></svg></div></div>
 <div class="pwb"><h2>الفرصة الخاصة ليست للجميع</h2><p>اشترك في الباقة العليا للوصول إلى فرص موجهة ومحدودة لا تظهر في القائمة العامة.</p>
 <div class="ft3"><div>${ic('<path d="M3 9.5l3.5-4 2.5 2 2.5-2 3.5 4-6 5z"/>')}<span>تعاونات مختارة</span></div><div>${ic('<circle cx="9" cy="6" r="3"/><path d="M3 16c0-3.5 2.7-5 6-5s6 1.5 6 5"/>')}<span>استقطاب مباشر</span></div><div>${ic('<rect x="2" y="3.5" width="14" height="12" rx="2"/><path d="M2 7.5h14M6 1.5v3M12 1.5v3M7 11.5l1.5 1.5 3-3"/>')}<span>فعاليات خاصة</span></div></div>
 <button class="ap" onclick="location.href='dash-payment.html'">جرّب مجانًا</button></div>`;
  document.body.append(d);}
 d._onClose=onClose||null;
 d.querySelector('.x2').onclick=function(e){e.preventDefault();close(d)};
 d.oncancel=function(e){e.preventDefault();close(d)};
 if(!d.open)d.showModal();
}
function close(d){d.close();if(typeof d._onClose==='function')d._onClose()}
window.nexoPaywall=show;
// أي رابط للفرص أو تفاصيل فرصة: غير المشترك تطلع له النافذة بنفس الصفحة
document.addEventListener('click',function(e){
 var a=e.target.closest('a[href]');if(!a)return;
 var h=a.getAttribute('href')||'';
 if(!/(^|\/)dash-opportunit(ies|y-details)\.html/.test(h))return;
 if(SUBST===true)return;
 e.preventDefault();e.stopPropagation();
 ready.then(function(ok){if(ok)location.href=a.href;else show()});
},true);
})();
