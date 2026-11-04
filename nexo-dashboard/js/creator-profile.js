// ===== البيانات (لاحقاً تجيبينها من FastAPI / Supabase) =====
const profiles = {
  khaled: {
    name: "خالد العتيبي", role: "صانع محتوى", tags: ["YouTube"], avatar: "/assets/creator-profile/khaled.jpg", cover: "",
    status: ["منضم لفريق", ""], views: 1000,
    bio: "صانع محتوى مهتم بالرياضات الإلكترونية والألعاب، أقدم محتوى متنوع يركز على تجارب الألعاب، التحديثات وأخبار مجتمع الـEsports. أسعى لتقديم محتوى مفيد وممتع وبناء مجتمع مهتم بالألعاب والرياضات الإلكترونية.",
    posts: ["كنت أبحث عن فكرة مختلفة للمحتوى، وقررت أجرب مجموعة من الألعاب الجديدة وأشارك تجربتي معكم. أول تجربة نزلت اليوم، والباقي قريب.",
            "نزلت اليوم فيديو جديد عن آخر تحديث للعبة، وتكلمت فيه عن أبرز التغييرات وتأثيرها على أسلوب اللعب.",
            "بدأت سلسلة جديدة أتكلم فيها عن تجارب اللاعبين في الرياضات الإلكترونية، وكيف يطورون مستواهم ويتعاملون مع المنافسات. الحلقة الأولى متاحة الآن."],
    leftTitle: "أبرز المحتوى",
    left: [{ thumb: "/assets/creator-profile/khaled.jpg", t: "فيديو أفضل إعدادات EA SPORTS FC للمبتدئين", lines: ["مشاهدة 120K"], chip: "YouTube" }],
    rightTitle: "المنصات",
    right: [{ icon: "yt", t: "اسم المنصة", chip: "متابع 80K" }]
  }
};


// ===== بياناتي الحقيقية من قاعدة البيانات =====
const initialAvatar = (name) => "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#201F49"/>' +
  '<text x="48" y="62" font-size="42" font-family="sans-serif" font-weight="700" fill="#fff" text-anchor="middle">' +
  (String(name || "?").trim().charAt(0).toUpperCase() || "?").replace(/[<>&]/g, "") + "</text></svg>");
function waitDB(ms) {
  return new Promise((res) => {
    const t = Date.now();
    (function chk() {
      if (window.nexoDB) return res(window.nexoDB);
      if (Date.now() - t > ms) return res(null);
      setTimeout(chk, 100);
    })();
  });
}
async function loadMine() {
  const db = await waitDB(8000);
  if (!db) return;
  try {
    const me = await db.getMe();
    let posts = [];
    try { posts = (await db.listPosts(db.uid)).map((x) => x.t).filter(Boolean); } catch (_) {}
    const name = me.n || "عضو نيكسو";
    profiles.me = {
      name, role: me.role || "صانع محتوى", tags: me.g ? [me.g] : [],
      avatar: me.ph || initialAvatar(name), cover: me.cv || "",
      status: [me.s || "", ""], views: 0, bio: me.bio || "",
      city: me.city || "", posts,
      leftTitle: "أبرز المحتوى", left: [], rightTitle: "المنصات", right: []
    };
  } catch (e) { console.error("تعذر تحميل ملفي:", e); }
}

// ===== الأيقونات =====
const I = {
  pen: '<svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  chev: '<svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg>',
  users: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-4 3-6 6.500-6s6 2 6.500 6M16 4.500a3.500 3.500 0 0 1 0 7M18 14c2 .7 3.200 2.700 3.500 6"/></svg>',
  eye: '<svg viewBox="0 0 24 24"><path d="M2 12s3.500-7 10-7 10 7 10 7-3.500 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
  add: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.500"/><path d="M2.500 20c.5-4 3-6 6.500-6s6 2 6.500 6M19 8v6M16 11h6"/></svg>',
  send: '<svg viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4ZM22 2 11 13"/></svg>',
  img: '<svg viewBox="0 0 24 24" style="fill:currentColor;stroke:none"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm3 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-3 11h14l-4.500-6-3.500 4.500L9 14Z"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M17.800 3h3l-6.600 7.500L22 21h-6l-4.700-6.200L5.800 21h-3l7-8L2 3h6.200l4.200 5.600ZM16.800 19.200h1.700L7.300 4.700H5.500Z"/></svg>',
  tt: '<svg viewBox="0 0 24 24"><path d="M16.600 2h-3.200v13.300a2.700 2.700 0 1 1-2.700-2.700c.3 0 .6 0 .8.100V9.400a6 6 0 1 0 5.100 5.900V8.500a7.300 7.300 0 0 0 4.200 1.300V6.600A4.300 4.300 0 0 1 16.600 2Z"/></svg>',
  yt: '<svg viewBox="0 0 32 24" style="fill:none;stroke:none"><rect width="32" height="24" rx="7" fill="#f00"/><path d="m13 7 8 5-8 5Z" fill="#fff"/></svg>',
  tw: '<svg viewBox="0 0 24 24" style="fill:none;stroke:none"><rect width="24" height="24" rx="5" fill="#9146ff"/><path d="M6 5h13v9l-3 3h-3l-2 2v-2H6Zm3 2v7h2v-2h0M13 7v4m3-4v4" stroke="#fff" stroke-width="1.500"/></svg>'
};

// ===== الرسم =====
const state = { p: "khaled", owner: true };
// الصلاحية: بس صاحب الملف يقدر ينشر. (الحماية الحقيقية تكون في الباكند / Supabase RLS)
const canPost = () => state.owner === true;
const app = document.getElementById("app");
const pen = (on) => on ? `<button class="edit" aria-label="تعديل">${I.pen}</button>` : "";
const more = `<button class="more">عرض الكل ${I.chev}</button>`;

function postCard(p, text, img) {
  return `<article class="post"><header><img src="${p.avatar}" alt="">
    <div><strong>${p.name}</strong><small>${p.role}</small><small>٣ ساعات</small></div></header>
    <p>${text}</p>${img ? `<div class="ph">${I.img}</div>` : ""}</article>`;
}
function items(list) {
  if (!list.length) return `<small>لا يوجد بعد</small>`;
  return list.map(i => `<div class="item ${i.thumb || i.icon ? "row" : ""}">
    ${i.thumb ? `<img src="${i.thumb}" alt="">` : ""}${i.icon ? `<div class="ic">${I[i.icon]}</div>` : ""}
    <div class="tx"><strong>${i.t}</strong>${(i.lines || []).map(l => `<small>${l}</small>`).join("")}</div>
    ${i.chip ? `<span class="tag">${i.chip}</span>` : ""}</div>`).join("");
}

function render() {
  const p = profiles[state.p], o = state.owner;
  document.getElementById("me").src = profiles.me ? profiles.me.avatar : (o ? p.avatar : "/assets/creator-profile/twis.jpg");
  document.getElementById("tabTalents").classList.toggle("on", !o);   // في ملفي ما في تبويب نشط (مثل التصميم)
  const stats = o
    ? `<div><span class="ring">70%</span>اكتمال الملف</div><div>${I.eye}<b>${p.views}</b>${p.role === "لاعب" ? "المشاهدات" : "المشاهدات"}</div><div>${I.users}<b>200</b>شبكة التواصل</div>`
    : `<div><button class="btn">تواصل ${I.add}</button></div><div><button class="btn ghost">مراسلة ${I.send}</button></div><div>${I.users}<b>200</b>شبكة التواصل</div>`;
  app.innerHTML = `
  ${o ? "" : `<div class="crumb"><span>المواهب</span>${I.chev}<b>${p.name}</b></div>`}
  <section class="card">
    <div class="cover" style="${p.cover ? `background-image:url(${p.cover})` : ""}"></div>
    <div class="hbody">${pen(o)}
      <img class="avatar" src="${p.avatar}" alt="">
      <div class="name">${p.name}</div>
      <div class="role"><span>${p.role}</span>${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}${p.live ? `<span class="tag live">${p.live}</span>` : ""}</div>
      <div class="city">${I.pin}${p.city || "الرياض"}</div>
      ${p.status[0] ? `<span class="status ${p.status[1]}">${p.status[0]}</span>` : ""}
    </div>
    <div class="stats">${stats}</div>
  </section>
  <section class="card pad">${pen(o)}<h2>نبذة</h2><p class="bio">${p.bio || "ما أضفتِ نبذة بعد"}</p></section>
  <section class="card">
    <div class="pad" style="padding-bottom:0">${pen(o)}
      <div class="ptop"><div><h2>منشورات</h2><small>${p.posts.length} منشورات</small></div>
        ${o ? `<button class="btn ghost" id="newPost">${I.pen} انشاء منشور</button>` : ""}</div>
      <div class="posts" id="posts">${p.posts.map((t, i) => postCard(p, t, i === 1)).join("")}</div>
    </div>${more}
  </section>
  <section class="card">${pen(o)}<div class="pad" style="padding-bottom:0"><h2>${p.leftTitle}</h2>${items(p.left)}</div>${more}</section>
  <div class="two">
    <section class="card">${pen(o)}<div class="pad grow"><h2>${p.rightTitle}</h2>${items(p.right)}</div>${more}</section>
    <section class="card">${pen(o)}<div class="pad grow"><h2>حسابات التواصل</h2>
      <button class="soc" aria-label="X">${I.x}</button><button class="soc" aria-label="TikTok">${I.tt}</button></div>${more}</section>
  </div>`;
  const nb = document.getElementById("newPost");
  if (nb) nb.onclick = () => { if (canPost()) modal.hidden = false; };
  document.querySelectorAll("[data-p]").forEach(b => b.classList.toggle("on", b.dataset.p === state.p));
  document.querySelectorAll("[data-o]").forEach(b => b.classList.toggle("on", (b.dataset.o === "true") === o));
}

// الشاشات (صفحات 24 و 25 فقط):
//   #own      شاشة 24  ملف صانع المحتوى (ملفي)
//   #visitor  شاشة 25  ملف صانع المحتوى (زائر)
//   #own-modal  شاشة 22  نافذة انشاء منشور
function show(h) {
  state.owner = h === "own" || h === "own-modal";
  state.p = state.owner && profiles.me ? "me" : "khaled";
  render();
  modal.hidden = h !== "own-modal";
  window.scrollTo(0, 0);
}
function fromHash() { show(location.hash.slice(1) || "own"); }
// قائمة "الصفحات": تبدل الصفحة مباشرة بدون ما نعتمد على تغير الرابط
document.querySelector(".pages").addEventListener("click", (e) => {
  const a = e.target.closest("a"); if (!a) return;
  e.preventDefault();
  try { history.replaceState(null, "", a.getAttribute("href")); } catch (_) {}
  show(a.getAttribute("href").slice(1));
  e.currentTarget.open = false;
});
window.addEventListener("hashchange", fromHash);

// نافذة انشاء منشور (شاشة 22)
const modal = document.getElementById("modal"), text = document.getElementById("postText"), publish = document.getElementById("publish");
text.oninput = () => (publish.disabled = !text.value.trim());
document.getElementById("close").onclick = () => (modal.hidden = true);
modal.onclick = (e) => { if (e.target === modal) modal.hidden = true; };
publish.onclick = () => {
  if (!canPost()) { modal.hidden = true; return; }   // ممنوع على الزائر
  const p = profiles[state.p], v = text.value.trim().slice(0, 500);
  if (!v) return;
  if (state.p === "me" && window.nexoDB) window.nexoDB.addPost({ t: v }).catch((e) => console.error(e));
  p.posts.unshift(v);
  document.getElementById("posts").insertAdjacentHTML("afterbegin", postCard(p, v, false));
  text.value = ""; publish.disabled = true; modal.hidden = true;
};
loadMine().finally(fromHash);
