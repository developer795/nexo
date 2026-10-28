// =====================================================================
// قص الصور قبل الرفع: المستخدم يسحب الصورة ويكبّرها ويختار الجزء اللي يبيه
// يستخدمه dashboard-core.js (تعديل الملف والمنشورات) و profile-data.js
// (صور البثوث والمحتوى). الدوال متاحة عبر window: CROP و CPV و CROPCFG
// =====================================================================
(function(){
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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
window.CROP=CROP;window.CPV=CPV;window.CROPCFG=CROPCFG;
})();
