// =====================================================================
// نافذة الباقة العليا ("الفرصة الخاصة ليست للجميع")
// الفرص للمشتركين أو اللي في التجربة المجانية فقط.
// لو غير المشترك ضغط "الفرص" (أو أي رابط فرصة) من أي صفحة، تطلع النافذة
// فوق نفس الصفحة، وزر X يقفلها ويبقى في مكانه.
// يحتاج window.nexoDB (من auth-guard.js)
// =====================================================================
(function(){
var CSS="/* ===== \u0646\u0627\u0641\u0630\u0629 \u0627\u0644\u0628\u0627\u0642\u0629 \u0627\u0644\u0639\u0644\u064a\u0627 ===== */\ndialog.pw{padding:0;width:min(420px,92vw);border-radius:28px;overflow:hidden}\ndialog.pw .pwt{position:relative;height:118px;background:radial-gradient(circle at 50% 50%,#3A3970 0 34px,#2E2D5E 35px 62px,#262556 63px 92px,#201F49 93px)}\ndialog.pw .crw{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:60px;height:60px;border-radius:50%;background:#55548A;display:grid;place-items:center}\ndialog.pw .x2{position:absolute;right:20px;top:20px;border:0;background:none;cursor:pointer;padding:6px}\ndialog.pw .dt1{position:absolute;right:56px;bottom:22px;width:9px;height:9px;border-radius:50%;background:#F3D52B}\ndialog.pw .spk{position:absolute;left:28px;top:28px;color:#F3D52B;font-size:22px}\ndialog.pw .pwb{padding:26px 26px 24px;text-align:center}.pwb h2{margin:0;font-size:22px;font-weight:700}\ndialog.pw .pwb p{margin:10px 0 18px;font-size:12.5px;color:#9A9AAE;line-height:1.8}\ndialog.pw .ft3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px}\ndialog.pw .ft3 div{border:1px solid #DFE2E6;border-radius:8px;padding:12px 4px;display:flex;flex-direction:column;align-items:center;gap:8px;font-size:11.5px;font-weight:600}\n\ndialog.pw .ap{width:100%;height:44px;border:0;border-radius:99px;background:#201F49;color:#fff;font-size:16px;font-weight:600;cursor:pointer}\ndialog.pw .x2{right:auto;left:20px}\ndialog.pw .spk{left:auto;right:28px}\ndialog.pw .dt1{right:auto;left:60px}\ndialog.pw .x2{z-index:2}\ndialog.pw{border:0;font-family:inherit;color:#000;margin:0;padding:0;position:fixed;left:50%;right:auto;bottom:auto;inset-inline:auto;left:50%;translate:-50% -50%;z-index:41;max-height:calc(100vh - 120px);overflow:auto;box-shadow:0 20px 60px rgba(32,31,73,.25)}\n#nxpwov{position:fixed;left:0;right:0;bottom:0;z-index:40;background:rgba(32,31,73,.45)}\nhtml.nxpw-on{overflow:hidden}\nhtml.nxpw-on .hd,html.nxpw-on nav.top{position:relative;z-index:42}\ndialog.pw::backdrop{background:rgba(32,31,73,.45)}\n";
var SUBST=null; // null = لسا ما تحمّل
function active(s){return !!(s&&(s.status==='active'||(s.status==='trialing'&&s.trialEnd>Date.now())))}
function load(){return window.nexoDB&&nexoDB.getSubscription?nexoDB.getSubscription().then(function(s){SUBST=active(s);return SUBST}).catch(function(){SUBST=false;return false}):Promise.resolve(false)}
var ready=new Promise(function(r){if(window.nexoDB)r();else addEventListener('nexo:ready',r,{once:true})}).then(load);
function show(onClose){
 if(!document.getElementById('nxpwcss')){var st=document.createElement('style');st.id='nxpwcss';st.textContent=CSS;document.head.appendChild(st)}
 var d=document.querySelector('dialog.pw');
 if(!d){var d=document.createElement('dialog');d.className='pw';
 var ic=p=>`<svg width="18" height="18" fill="none" stroke="#03BB43" stroke-width="1.5">${p}</svg>`;
 d.innerHTML=`<div class="pwt"><i class="dt1"></i><span class="spk">✦</span><div class="crw"><svg width="30" height="24" viewBox="0 0 30 24"><path d="M2 7l7 6 6-10 6 10 7-6-3 15H5z" fill="#F3D52B"/></svg></div></div>
 <div class="pwb"><h2>الفرصة الخاصة ليست للجميع</h2><p>اشترك في الباقة العليا للوصول إلى فرص موجهة ومحدودة لا تظهر في القائمة العامة.</p>
 <div class="ft3"><div>${ic('<path d="M3 9.5l3.5-4 2.5 2 2.5-2 3.5 4-6 5z"/>')}<span>تعاونات مختارة</span></div><div>${ic('<circle cx="9" cy="6" r="3"/><path d="M3 16c0-3.5 2.7-5 6-5s6 1.5 6 5"/>')}<span>استقطاب مباشر</span></div><div>${ic('<rect x="2" y="3.5" width="14" height="12" rx="2"/><path d="M2 7.5h14M6 1.5v3M12 1.5v3M7 11.5l1.5 1.5 3-3"/>')}<span>فعاليات خاصة</span></div></div>
 <button class="ap" onclick="location.href='dash-payment.html'">جرّب مجانًا</button></div>`;
  document.body.append(d);}
 d._onClose=onClose||null;
 /* بدون زر إغلاق: الهيدر يبقى ظاهر وقابل للضغط، والمستخدم يتنقل لأي صفحة منه */
 var hd=document.querySelector('.hd,nav.top');
 var ov=document.getElementById('nxpwov');
 if(!ov){ov=document.createElement('div');ov.id='nxpwov';document.body.appendChild(ov)}
 var place=function(){var b=hd?hd.getBoundingClientRect().bottom:0;ov.style.top=Math.max(0,b)+'px';d.style.top='calc('+Math.max(0,b)+'px + (100vh - '+Math.max(0,b)+'px)/2)'};
 place();addEventListener('resize',place);addEventListener('scroll',place,{passive:true});
 document.documentElement.classList.add('nxpw-on');
 if(!d.open){d.show();if(document.activeElement)document.activeElement.blur()}
}

window.nexoPaywall=show;

})();
