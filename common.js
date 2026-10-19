const $=s=>document.querySelector(s);
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),2200)}
function openM(){$('#modal').classList.add('on');$('#ptxt').focus()}
function closeM(){$('#modal').classList.remove('on')}
function publishPost(){
  const t=$('#ptxt').value.trim();if(!t)return;
  const grid=$('#postGrid'),card=document.createElement('div');
  card.className='post';
  const p=document.createElement('p');p.textContent=t;card.appendChild(p);
  grid.prepend(card);
  if(grid.children.length>3)grid.lastElementChild.remove();
  $('#ptxt').value='';$('#pubBtn').disabled=true;closeM();toast('تم النشر');
}
const ptxt=$('#ptxt');if(ptxt)ptxt.oninput=e=>$('#pubBtn').disabled=!e.target.value.trim();
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#modal'))closeM()});
document.addEventListener('click',e=>{
  if(e.target.closest('.more,.pen,.row a[href="#"]')){e.preventDefault();toast('هذه الميزة خارج الصفحات المطلوبة');return}
  const t=e.target.closest('.post,.opp,.item');
  if(t&&!e.target.closest('button,a'))toast('تفاصيل هذا العنصر في صفحة أخرى');
});
