// صفحة المحادثات: قائمة المحادثات يمين، والمحادثة المفتوحة يسار (جدول nexo_messages)
// تفتح محادثة جديدة من زر "مراسلة" في ملف أي شخص: dash-messages.html?to=<user_id>
v='msgs';
let MS=null,MERR='',PEO={},SEL=null,MF='',MQ='',MSENDING=false;
const MTO=(new URLSearchParams(location.search).get('to')||'').trim();
const MCHK='<svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m1 5 3 3 6-6M7 8l.5.5 6-6"/></svg>';
const MBACK='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
const MSRCH='<svg width="15" height="15" fill="none" stroke="#797992" stroke-width="2"><circle cx="6.5" cy="6.5" r="5"/><path d="M10.5 10.5l3.5 3.5"/></svg>';
const LOC='ar-SA-u-ca-gregory';
const mtime=t=>new Date(t).toLocaleTimeString(LOC,{hour:'numeric',minute:'2-digit'});
const sameDay=(a,b)=>a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
function mday(t){const d=new Date(t),n=new Date(),y=new Date();y.setDate(n.getDate()-1);
 const full=d.toLocaleDateString(LOC,{day:'numeric',month:'long',year:'numeric'});
 return sameDay(d,n)?'اليوم، '+full:sameDay(d,y)?'أمس، '+full:full}
function mshort(t){const d=new Date(t),n=new Date(),y=new Date();y.setDate(n.getDate()-1);
 return sameDay(d,n)?mtime(t):sameDay(d,y)?'أمس':d.toLocaleDateString(LOC,{day:'numeric',month:'long'})}
const other=m=>m.sender_id===nexoDB.uid?m.receiver_id:m.sender_id;
const pname=id=>(PEO[id]&&PEO[id].n)||'مستخدم نيكسو';
const plabel=p=>!p?'':p.kind==='team'?(p.type||'جهة'):(p.role||'');
const plink=id=>{const p=PEO[id];return p&&p.id!=null?(p.kind==='team'?'dash-entity-visitor.html':'dash-talent-visitor.html')+'?id='+encodeURIComponent(p.id):''};
function convs(){const by=new Map();
 (MS||[]).forEach(m=>{const o=other(m);let c=by.get(o);if(!c){c={id:o,msgs:[],unread:0};by.set(o,c)}c.msgs.push(m);if(m.receiver_id===nexoDB.uid&&!m.read_at)c.unread++});
 if(MTO&&MTO!==nexoDB.uid&&!by.has(MTO))by.set(MTO,{id:MTO,msgs:[],unread:0});
 return [...by.values()].map(c=>(c.last=c.msgs[c.msgs.length-1]||null,c)).sort((a,b)=>(b.last?+new Date(b.last.created_at):Infinity)-(a.last?+new Date(a.last.created_at):Infinity))}

V.msgs=function(){
 return `<h1>المحادثات</h1>
 <div class="mfl"><div id="mch"></div><label class="msr">${MSRCH}<input id="mq" placeholder="ابحث في المحادثات" aria-label="ابحث في المحادثات" value="${E(MQ)}"></label></div>
 <div class="mbox" id="mbox"><div class="mlist" id="mlist" role="list"></div>
 <div class="mth"><div class="mhd" id="mhd"></div><div class="mbody" id="mbody"></div>
 <form class="mcomp" id="mcomp" autocomplete="off"><input id="mtx" maxlength="2000" placeholder="اكتب رسالتك هنا..." aria-label="اكتب رسالتك"><button class="msend" type="submit">إرسال</button></form>
 <p class="merr" id="merr" role="alert"></p></div></div>`};

function MR(){if(v!=='msgs'||!$('#mbox'))return;
 const box=$('#mbox'),list=$('#mlist'),hd=$('#mhd'),body=$('#mbody'),comp=$('#mcomp');
 if(MERR){$('#mch').innerHTML='';list.innerHTML=`<p class="mempty">${E(MERR)}</p>`;hd.innerHTML='';body.innerHTML='';comp.hidden=true;return}
 if(!MS){list.innerHTML='<p class="mempty">جاري التحميل...</p>';comp.hidden=true;return}
 const all=convs(),unread=all.filter(c=>c.unread).length;
 $('#mch').innerHTML=[['الكل',''],['غير المقروءة','unread']].map(([t,k])=>`<button type="button" class="ch ${MF===k?'on':''}" data-mf="${k}">${t} (${k?unread:all.length})</button>`).join('');
 const q=MQ.toLowerCase(),shown=all.filter(c=>(!MF||c.unread)&&(!q||(pname(c.id)+' '+c.msgs.map(m=>m.body).join(' ')).toLowerCase().includes(q)));
 list.innerHTML=shown.map(c=>{const p=PEO[c.id],l=c.last,mine=l&&l.sender_id===nexoDB.uid;
  return`<button type="button" role="listitem" class="mrow${c.id===SEL?' on':''}${c.unread?' un':''}" data-cid="${E(c.id)}">${pic(p&&p.ph,pname(c.id))}<span class="mrc"><span class="mrt"><b>${E(pname(c.id))}</b><small>${E(plabel(p))}</small></span><span class="mrp">${l?(mine?'أنت: ':'')+E(l.body):'ابدأ المحادثة'}</span></span><span class="mrm"><time>${l?E(mshort(l.created_at)):''}</time>${c.unread?`<i class="mcnt">${c.unread}</i>`:''}</span></button>`}).join('')||`<p class="mempty">${all.length?'لا توجد محادثات مطابقة':'لا توجد محادثات بعد<br><small>افتح ملف أي شخص واضغط "مراسلة" عشان تبدأ</small>'}</p>`;
 box.classList.toggle('open',!!SEL);
 if(!SEL){hd.innerHTML='';body.innerHTML='<p class="mempty">اختر محادثة من القائمة</p>';comp.hidden=true;return}
 const p=PEO[SEL],c=all.find(x=>x.id===SEL)||{msgs:[]},lk=plink(SEL);
 hd.innerHTML=`<button type="button" class="mbk" aria-label="رجوع للمحادثات">${MBACK}</button>${lk?`<a class="mwho" href="${E(lk)}">`:'<span class="mwho">'}${pic(p&&p.ph,pname(SEL))}<span><span class="mrt"><b>${E(pname(SEL))}</b><small>${E(plabel(p))}</small></span>${p&&p.g?`<span class="tg">${E(p.g)}</span>`:''}</span>${lk?'</a>':'</span>'}`;
 const atEnd=body.scrollHeight-body.scrollTop-body.clientHeight<40||body.dataset.sel!==SEL;
 let lastDay='';
 body.innerHTML=c.msgs.map((m,i)=>{const d=mday(m.created_at),mine=m.sender_id===nexoDB.uid,sep=d!==lastDay?`<div class="mday">${E(d)}</div>`:'';lastDay=d;
  const lastMine=mine&&!c.msgs.slice(i+1).some(x=>x.sender_id===nexoDB.uid);
  return sep+`<div class="mmsg ${mine?'mine':'theirs'}"><p>${E(m.body)}</p><small>${E(mtime(m.created_at))}${mine&&lastMine&&m.read_at?` • تمت القراءة ${MCHK}`:''}</small></div>`}).join('')||'<p class="mempty">ما فيه رسائل بعد، اكتب أول رسالة</p>';
 body.dataset.sel=SEL;if(atEnd)body.scrollTop=body.scrollHeight;
 comp.hidden=false;
}
const _R=R;R=function(){_R();if(v==='msgs'&&LOADED&&!Q)MR()};

async function mload(first){
 try{const ms=await nexoDB.listMessages(),ids=ms.map(other);if(MTO)ids.push(MTO);
  const need=[...new Set(ids)].filter(id=>!PEO[id]);if(need.length)Object.assign(PEO,await nexoDB.getPeople(need));
  const changed=!MS||ms.length!==MS.length||ms.some((m,i)=>MS[i].id!==m.id||MS[i].read_at!==m.read_at);
  MS=ms;MERR='';if(first&&MTO&&MTO!==nexoDB.uid&&!SEL)SEL=MTO;
  if(changed||first){if(SEL)await mread(SEL);MR()}}
 catch(e){console.error(e);if(!MS){MERR=e.message||'تعذر تحميل المحادثات';MR()}}}
async function mread(id){const un=(MS||[]).filter(m=>m.sender_id===id&&m.receiver_id===nexoDB.uid&&!m.read_at);
 if(!un.length)return;const now=new Date().toISOString();un.forEach(m=>m.read_at=now);await nexoDB.markRead(id)}

document.addEventListener('click',async e=>{
 const r=e.target.closest('.mrow');if(r){SEL=r.dataset.cid;$('#merr').textContent='';MR();await mread(SEL);MR();const t=$('#mtx');if(t&&innerWidth>820)t.focus();return}
 const f=e.target.closest('[data-mf]');if(f){MF=f.dataset.mf;MR();return}
 if(e.target.closest('.mbk')){SEL=null;MR()}
});
document.addEventListener('input',e=>{if(e.target.id==='mq'){MQ=e.target.value.trim();MR()}});
document.addEventListener('submit',async e=>{if(e.target.id!=='mcomp')return;e.preventDefault();
 const t=$('#mtx'),txt=t.value.trim(),b=e.target.querySelector('.msend');if(!txt||!SEL||MSENDING)return;
 MSENDING=true;b.disabled=true;$('#merr').textContent='';
 try{const m=await nexoDB.sendMessage(SEL,txt);MS.push(m);t.value='';const bd=$('#mbody');if(bd)bd.dataset.sel='';MR()}
 catch(er){$('#merr').textContent=er.message||'تعذر إرسال الرسالة'}
 finally{MSENDING=false;b.disabled=false;t.focus()}});

start();
onReady(()=>{const t=setInterval(()=>{if(LOADED){clearInterval(t);if(MTO)history.replaceState(null,'',location.pathname);mload(true);
 setInterval(()=>{if(!document.hidden&&!MERR)mload(false)},8000)}},50)});
