// =====================================================================
// صفحات الملفات (ملفي / ملف زائر) وصفحة إنشاء فرصة — البيانات من Supabase
// يشتغل بعد profile-common.js، ويستخدم window.nexoDB من auth-guard.js
// =====================================================================
(function () {
  var PAGE = location.pathname.split('/').pop().replace('.html', '');
  var OWN = PAGE === 'dash-talent-profile' || PAGE === 'dash-entity-profile';
  var VISITOR = PAGE === 'dash-talent-visitor' || PAGE === 'dash-entity-visitor';
  var CREATE = PAGE === 'dash-create-opportunity';
  var PROFILE = null; // الملف المعروض حاليًا

  var E = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var U = function (s) { return /^https:\/\/[^\s"'()<>]+$/.test(String(s || '')) ? s : ''; };
  var ini = function (n) { return E(String(n || '؟').trim()[0] || '؟'); };
  var img = function (src, n) { return U(src) ? '<img src="' + E(U(src)) + '" alt="">' : ini(n); };
  var q = function (s) { return document.querySelector(s); };
  var onReady = function (f) { window.nexoDB ? f() : addEventListener('nexo:ready', f, { once: true }); };

  // زر القلم في ملفي → يفتح تعديل الملف في الرئيسية
  document.addEventListener('click', function (e) {
    if (OWN && e.target.closest('.pen')) {
      e.preventDefault();
      e.stopImmediatePropagation();
      var sec = e.target.closest('section');
      if (sec && sec.querySelector('.bio') && PROFILE) { openBio(); return; }
      if (PROFILE) openEditProfile();
    }
  }, true);

  function navAvatar(me) {
    var a = q('.nav-av');
    if (a) a.innerHTML = U(me.ph)
      ? '<img src="' + E(U(me.ph)) + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">'
      : ini(me.n);
  }

  function renderHead(p) {
    var h1 = q('.head h1');
    if (!h1) return;
    h1.textContent = p.n || (OWN ? 'أكمل ملفك الشخصي' : '');
    var info = q('.head .info');
    info.querySelectorAll('.row').forEach(function (r) { r.remove(); });
    var label = p.kind === 'team' ? (p.sub || p.type) : p.role;
    var tags = [p.g, p.kind === 'team' ? p.type : ''].filter(Boolean)
      .map(function (t) { return '<span class="chip">' + E(t) + '</span>'; }).join('');
    var status = p.s ? '<span class="chip ' + (p.s === 'يبحث عن فريق' ? 'g' : '') + '">' + E(p.s) + '</span>' : '';
    if (label || tags || status) info.insertAdjacentHTML('beforeend', '<div class="row"><span class="role">' + E(label) + '</span>' + tags + status + '</div>');
    if (p.city) info.insertAdjacentHTML('beforeend', '<div class="row loc">📍 ' + E(p.city) + '</div>');

    q('.av-lg').innerHTML = img(p.ph, p.n);
    if (U(p.cv)) q('.banner').style.backgroundImage = 'url("' + U(p.cv) + '")';
    var bio = q('.bio');
    if (bio) bio.textContent = p.bio || (OWN ? 'اكتب نبذة عنك من زر التعديل' : 'لا توجد نبذة بعد');

    // نسبة اكتمال الملف
    var ring = q('.ring');
    if (ring) {
      var keys = p.kind === 'team' ? ['n', 'ph', 'cv', 'type', 'sub', 'city', 'bio'] : ['n', 'ph', 'cv', 'role', 'g', 'city', 's', 'bio'];
      var pct = Math.round(keys.filter(function (k) { return p[k]; }).length / keys.length * 100);
      ring.style.background = 'conic-gradient(var(--success) ' + pct + '%,var(--neutral-20) 0)';
      ring.querySelector('i').textContent = pct + '%';
    }
  }

  function subOf(grid) {
    return grid && grid.closest('section') && grid.closest('section').querySelector('.sub');
  }

  var POSTS = [];
  function renderPosts(posts) {
    POSTS = posts;
    var grid = q('#postGrid');
    if (!grid) return;
    var sec = grid.closest('section'), old = sec && sec.querySelector('.xall');
    if (old) old.remove();
    if (sec && posts.length) sec.insertAdjacentHTML('beforeend', '<button type="button" class="xall" data-all="posts">عرض الكل ' + CHV + '</button>');
    grid.innerHTML = posts.slice(0, 3).map(function (p) {
      return '<div class="post"><div class="h"><div class="a">' + img(p.a, p.n) + '</div><div><b>' + E(p.n) +
        '</b><small>' + E(p.r) + '</small></div></div><p>' + E(p.t) + '</p>' +
        (U(p.im) ? '<img src="' + E(U(p.im)) + '" alt="" style="width:100%;border-radius:8px;margin-top:12px">' : '') + '</div>';
    }).join('');
    var sub = subOf(grid);
    if (sub) sub.textContent = posts.length + ' منشورات';
  }

  function renderOpps(opps) {
    var grid = q('.grid2');
    if (!grid) return;
    grid.innerHTML = opps.map(function (o) {
      return '<a class="opp" style="text-decoration:none;color:inherit" href="dash-opportunity-details.html?id=' + E(o.id) + '">' +
        (U(o.ph) ? '<img src="' + E(U(o.ph)) + '" alt="">' : '<div style="width:90px;height:90px;border-radius:10px;background:var(--primary-100);color:#fff;display:grid;place-items:center;font-size:32px">' + ini(o.org) + '</div>') +
        '<div><b>' + E(o.title) + '</b><span class="co">' + E(o.org) + '</span><div class="tags"><div><span class="chip">' + E(o.aud) + '</span></div><span class="chip g">' + E(o.type) + '</span></div></div>' +
        '<div class="m"><span>📍 ' + E(o.city || 'غير محدد') + '</span><span>آخر موعد: ' + E(o.due || 'غير محدد') + '</span><span>' + E(o.n) + ' متقدم</span></div></a>';
    }).join('');
    var sub = subOf(grid);
    if (sub) sub.textContent = opps.length + ' فرص';
  }

  async function oppsFor(p) {
    var lists = [];
    if (p.kind === 'team') lists.push(nexoDB.listOpps({ team_id: p.id }));
    if (p.user_id) lists.push(nexoDB.listOpps({ created_by: p.user_id }));
    var seen = {}, out = [];
    (await Promise.all(lists)).flat().forEach(function (o) { if (!seen[o.id]) { seen[o.id] = 1; out.push(o); } });
    return out;
  }

  async function loadProfile() {
    var me = await nexoDB.getMe();
    navAvatar(me);
    if (CREATE) return;

    if (OWN) {
      PROFILE = me;
      PROFILE.user_id = nexoDB.uid;
    } else {
      var id = new URLSearchParams(location.search).get('id');
      var type = PAGE === 'dash-entity-visitor' ? 'team' : 'talent';
      PROFILE = id ? await nexoDB.getProfile(type, id) : null;
      if (!PROFILE) {
        location.replace(type === 'team' ? 'dash-teams.html' : 'dash-talents.html');
        return;
      }
      var crumb = q('.crumb');
      if (crumb) crumb.insertAdjacentHTML('beforeend', ' <b>' + E(PROFILE.n) + '</b>');
    }
    renderHead(PROFILE);
    var posts = PROFILE.user_id ? await nexoDB.listPosts(PROFILE.user_id) : [];
    renderPosts(posts);
    if (q('.grid2')) renderOpps(await oppsFor(PROFILE));
    await loadItems();
  }


  // ===================================================================
  // أقسام الملف + نوافذ "عرض الكل"
  //   الألعاب، المباريات والبطولات، أبرز البثوث، إبراز المحتوى،
  //   المنصات، حسابات التواصل، المنشورات
  // ===================================================================
  var CHV = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
  var ITEMS = null; // null = جدول profile_items لسا ما انضاف
  var SEC = {
    match:    { t: 'المباريات والبطولات', add: 'إضافة المباريات والبطولات', n: 1 },
    game:     { t: 'الألعاب', add: 'إضافة الألعاب', n: 1 },
    stream:   { t: 'أبرز البثوث', add: 'إضافة بث', n: 1 },
    content:  { t: 'إبراز المحتوى', add: 'إضافة محتوى', n: 1 },
    platform: { t: 'المنصات', add: 'إضافة منصة', n: 2 },
    social:   { t: 'حسابات التواصل', add: 'حسابات التواصل', n: 2 },
  };
  // الأقسام حسب نوع الحساب
  function kindsFor(p) {
    if (p.kind === 'team') return ['social'];
    if (p.role === 'ستريمر') return ['stream', 'platform', 'social'];
    if (p.role === 'صانع محتوى') return ['content', 'platform', 'social'];
    return ['match', 'game', 'social'];
  }
  var ICO = {
    'يوتيوب': '<svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="4" fill="#FF0000"/><path d="M10 8.5v7l6-3.5z" fill="#fff"/></svg>',
    'كيك': '<span class="kick">KICK</span>',
    'تويتش': '<svg viewBox="0 0 24 24"><path fill="#9146FF" d="M4 2 2.5 6v14h5v3h3l3-3h4l5-5V2zm16 12-3 3h-4l-3 3v-3H6V4h14z"/><path fill="#9146FF" d="M15 7h2v5h-2zm-5 0h2v5h-2z"/></svg>',
    'تيك توك': '<svg viewBox="0 0 24 24"><path fill="#25F4EE" d="M15.5 2c.3 2.4 1.7 4 4.1 4.2v3.3c-1.5.1-2.9-.4-4.1-1.2v6.3c0 4-3.3 6.4-6.4 6.4A6.4 6.4 0 0 1 7 8.6v3.5a3 3 0 1 0 3 3V2z" transform="translate(-.6 .4)"/><path fill="#FE2C55" d="M15.5 2c.3 2.4 1.7 4 4.1 4.2v3.3c-1.5.1-2.9-.4-4.1-1.2v6.3c0 4-3.3 6.4-6.4 6.4A6.4 6.4 0 0 1 7 8.6v3.5a3 3 0 1 0 3 3V2z" transform="translate(.6 -.4)"/><path fill="#000" d="M15.5 2c.3 2.4 1.7 4 4.1 4.2v3.3c-1.5.1-2.9-.4-4.1-1.2v6.3c0 4-3.3 6.4-6.4 6.4A6.4 6.4 0 0 1 7 8.6v3.5a3 3 0 1 0 3 3V2z"/></svg>',
    'سناب شات': '<svg viewBox="0 0 24 24"><path fill="#fff" stroke="#000" stroke-width="1.4" stroke-linejoin="round" d="M12 2.5c3 0 5 2.3 5 5.2v2.6l1.6-.5c.6-.1 1 .6.5 1-.6.5-1.6.8-2.3 1.1.6 1.7 2 3 3.7 3.6.4.2.3.8-.1.9-1 .3-1.6.4-1.9.8-.2.4-.1 1-.6 1.1-.8.1-1.6-.3-2.6.1-1 .5-1.7 1.6-3.3 1.6s-2.3-1.1-3.3-1.6c-1-.4-1.8 0-2.6-.1-.5-.1-.4-.7-.6-1.1-.3-.4-.9-.5-1.9-.8-.4-.1-.5-.7-.1-.9 1.7-.6 3.1-1.9 3.7-3.6-.7-.3-1.7-.6-2.3-1.1-.5-.4-.1-1.1.5-1l1.6.5V7.7c0-2.9 2-5.2 5-5.2z"/></svg>',
    'إكس': '<svg viewBox="0 0 24 24"><path fill="#000" d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-6.4L6.3 22H3.2l7.3-8.3L1 2h6.3l4.4 5.8zm-1.1 18h1.7L6.3 3.9H4.5z"/></svg>',
    'لينكدإن': '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="3" fill="#0A66C2"/><path fill="#fff" d="M7 9.5h2.6V18H7zM8.3 5.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM11 9.5h2.5v1.2c.4-.7 1.3-1.4 2.7-1.4 2.8 0 3.3 1.8 3.3 4.2V18h-2.6v-4c0-1 0-2.2-1.4-2.2s-1.6 1-1.6 2.1V18H11z"/></svg>',
    'إنستقرام': '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke="#E1306C" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#E1306C" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C"/></svg>',
    'رقم الجوال': '<svg viewBox="0 0 24 24" fill="none" stroke="#201F49" stroke-width="1.6"><path d="M8 3l2 4.5-2 1.7a11 11 0 0 0 5.8 5.8l1.7-2L20 15v3c0 1-.7 2-2 2C10.3 20 4 13.7 4 6c0-1.3 1-2 2-2z"/></svg>',
    'البريد الإلكتروني': '<svg viewBox="0 0 24 24" fill="none" stroke="#201F49" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/></svg>',
  };
  var PLATFORMS = ['يوتيوب', 'تويتش', 'كيك', 'تيك توك', 'سناب شات', 'إكس', 'إنستقرام'];
  var SOCIALS = ['إكس', 'تيك توك', 'لينكدإن', 'إنستقرام', 'سناب شات', 'رقم الجوال', 'البريد الإلكتروني'];
  var PLAY = '<span class="xplay"><svg viewBox="0 0 24 24"><path d="M9 7v10l8-5z" fill="#fff"/></svg></span>';
  var DEL = function (it) { return OWN ? '<button type="button" class="xdel" data-del="' + E(it.id) + '" aria-label="حذف">حذف</button>' : ''; };
  var pill = function (t) { return t ? '<span class="xpill">' + E(t) + '</span>' : ''; };
  var lines = function (arr) { return arr.filter(Boolean).map(function (x) { return '<p>' + E(x) + '</p>'; }).join(''); };
  var visit = function (u) { return U(u) ? '<a class="xvisit" href="' + E(U(u)) + '" target="_blank" rel="noopener">زيارة الحساب</a>' : ''; };
  var thumb = function (it) {
    return '<span class="xthumb">' + (U(it.img) ? '<img src="' + E(U(it.img)) + '" alt="">' : '') + PLAY + '</span>';
  };
  var ROW = {
    game: function (it) { return '<div class="xit xgame">' + DEL(it) + '<div class="xt"><h3>' + E(it.name) + '</h3>' + lines([it.level, it.role]) + '</div>' + pill(it.device) + '</div>'; },
    match: function (it) { return '<div class="xit">' + DEL(it) + '<div class="xt"><h3>' + E(it.title) + '</h3>' + lines([it.team, it.game, it.place]) + '</div>' + pill(it.device) + '</div>'; },
    stream: function (it) {
      var inner = thumb(it) + '<div class="xt"><h3>' + E(it.title) + '</h3>' + lines([it.views ? 'مشاهدة ' + it.views : '', it.duration ? 'مدة البث ' + it.duration : '']) + '</div>' + pill(it.platform);
      return U(it.url) ? '<div class="xit xmedia">' + DEL(it) + '<a class="xlink" href="' + E(U(it.url)) + '" target="_blank" rel="noopener">' + inner + '</a></div>' : '<div class="xit xmedia">' + DEL(it) + inner + '</div>';
    },
    content: function (it) {
      var inner = thumb(it) + '<div class="xt"><h3>' + E(it.title) + '</h3>' + lines([it.views ? 'مشاهدة ' + it.views : '']) + '</div>' + pill(it.platform);
      return U(it.url) ? '<div class="xit xmedia">' + DEL(it) + '<a class="xlink" href="' + E(U(it.url)) + '" target="_blank" rel="noopener">' + inner + '</a></div>' : '<div class="xit xmedia">' + DEL(it) + inner + '</div>';
    },
    platform: function (it) { return '<div class="xit xplat">' + DEL(it) + '<div class="xname"><span class="xico">' + (ICO[it.platform] || '') + '</span><b>' + E(it.platform) + '</b></div><span class="xpill xf">' + (it.followers ? 'متابع ' + E(it.followers) : '—') + '</span><span class="xv">' + visit(it.url) + '</span></div>'; },
    social: function (it) {
      var plain = it.type === 'رقم الجوال' || it.type === 'البريد الإلكتروني';
      return '<div class="xit xsoc">' + DEL(it) + '<div class="xname"><span class="xsbox">' + (ICO[it.type] || '') + '</span><div><b>' + E(it.type) + '</b>' + (plain ? '<small dir="ltr">' + E(it.value) + '</small>' : '') + '</div></div>' + (plain ? '' : visit(it.value)) + '</div>';
    },
  };
  function itemsOf(kind) { return (ITEMS || []).filter(function (x) { return x.kind === kind; }); }
  function listHTML(kind, list) {
    var head = kind === 'platform' && list.length ? '<div class="xhead"><span>المنصة</span><span>عدد المتابعين</span><span>زيارة الحساب</span></div>' : '';
    return head + '<div class="xlist' + (kind === 'game' ? ' xgrid' : '') + '">' + list.map(ROW[kind]).join('') + '</div>';
  }
  var PEN = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>';
  function preview(k, list) {
    if (k === 'social') return '<div class="xsp">' + list.map(function (it) {
      var plain = it.type === 'رقم الجوال' || it.type === 'البريد الإلكتروني';
      var href = it.type === 'رقم الجوال' ? '' : it.type === 'البريد الإلكتروني' ? 'mailto:' + it.value : U(it.value);
      var ic = '<span class="xspi">' + (ICO[it.type] || '') + '</span>';
      return href ? '<a class="xspb" href="' + E(href) + '" target="_blank" rel="noopener" title="' + E(it.type) + '">' + ic + '</a>'
        : '<span class="xspb" title="' + E(it.type) + '">' + ic + (plain ? '<small dir="ltr">' + E(it.value) + '</small>' : '') + '</span>';
    }).join('') + '</div>';
    return listHTML(k, list);
  }
  function renderItems() {
    var box = q('#xsecs');
    if (!box || !PROFILE) return;
    var ks = kindsFor(PROFILE);
    var one = function (k) {
      var S = SEC[k], all = itemsOf(k);
      var pen = OWN ? '<button type="button" class="xpen" data-add="' + k + '" aria-label="' + S.add + '">' + PEN + '</button>' : '';
      return '<section class="card pad xsec">' + pen + '<h2 class="sec">' + S.t + '</h2>' + (all.length ? preview(k, all.slice(0, S.n)) : '') +
        (all.length ? '<button type="button" class="xall" data-all="' + k + '">عرض الكل ' + CHV + '</button>' : '') + '</section>';
    };
    box.innerHTML = ks.length === 1 ? one(ks[0]) : one(ks[0]) + '<div class="xtwo">' + ks.slice(1).map(one).join('') + '</div>';
  }
  async function loadItems() {
    if (!q('#xsecs')) return;
    ITEMS = PROFILE.user_id ? await nexoDB.listItems(PROFILE.user_id) : [];
    renderItems();
  }

  // ---------- النافذة ----------
  function modal(title, html, wide, isForm) {
    var m = q('#xmodal');
    if (!m) {
      m = document.createElement('div'); m.id = 'xmodal'; m.className = 'xm'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
      document.body.appendChild(m);
      m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('.xclose')) closeX(); });
    }
    m.innerHTML = '<div class="xbox' + (wide ? ' wide' : '') + (isForm ? ' xfm' : '') + '"><header><h3>' + E(title) + '</h3><button type="button" class="xclose" aria-label="إغلاق"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg></button></header><div class="xbody">' + html + '</div></div>';
    m.classList.add('on'); document.body.style.overflow = 'hidden';
    var f = m.querySelector('input,select,textarea,button.xclose'); if (f) f.focus();
    return m;
  }
  function closeX() { var m = q('#xmodal'); if (m) m.classList.remove('on'); document.body.style.overflow = ''; }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeX(); });

  function ago(t) {
    var d = (Date.now() - new Date(t)) / 1000; if (!(d >= 0)) return '';
    if (d < 3600) return 'منذ ' + Math.max(1, Math.round(d / 60)) + ' دقيقة';
    if (d < 86400) return 'منذ ' + Math.round(d / 3600) + ' ساعات';
    var n = Math.round(d / 86400);
    return n === 1 ? 'أمس' : n < 7 ? 'منذ ' + n + ' أيام' : n < 14 ? 'منذ أسبوع' : new Date(t).toLocaleDateString('ar-SA-u-ca-gregory-nu-latn');
  }
  function openAll(k) {
    if (k === 'posts') {
      modal('منشورات', '<div class="xlist">' + POSTS.map(function (p) {
        return '<article class="xpost"><div class="xph"><span class="a">' + img(p.a, p.n) + '</span><div><b>' + E(p.n) + '</b><small>' + E(p.r) + '</small></div><time>' + E(ago(p.at)) + '</time></div><p>' + E(p.t) + '</p>' +
          (U(p.im) ? '<img src="' + E(U(p.im)) + '" alt="">' : '') + '</article>';
      }).join('') + '</div>', true);
      return;
    }
    modal(SEC[k].t, listHTML(k, itemsOf(k)), k === 'game' || k === 'platform');
  }

  // ---------- نماذج الإضافة (لصاحب الملف) ----------
  var opts = function (a) { return a.map(function (x) { return '<option>' + E(x) + '</option>'; }).join(''); };
  var F = function (id, label, ph, extra) { return '<label class="xf"><span>' + label + '</span><input id="' + id + '" ' + (extra || '') + '></label>'; };
  var GAMES = ['EA SPORTS FC', 'Rocket League', 'Valorant', 'Fortnite', 'Call of Duty', 'Overwatch 2', 'League of Legends', 'Apex Legends', 'Counter-Strike 2', 'PUBG', 'Dota 2'];
  var GSEL = function (id, label, req) { return '<label class="xf"><span>' + label + '</span><select id="' + id + '"' + (req ? ' required' : '') + '><option value="" disabled selected hidden></option>' + opts(GAMES) + '</select></label>'; };
  var FORMS = {
    game: { sub: 'أضف ألعابك ووضّح مستوى احترافك ودورك في الفريق.', html: GSEL('x_name', 'اسم اللعبة', 1) + F('x_level', 'مستوى الاحتراف', 'لاعب محترف') + F('x_role', 'دورك في اللعبة أو الفريق', 'لاعب أساسي') + F('x_device', 'الجهاز المستخدم', 'PC') },
    match: { sub: 'أضف مشاركاتك ونتائجك لعرضها على ملفك الشخصي.', html: F('x_title', 'اسم المباراة أو البطولة', 'كأس العالم للرياضات الإلكترونية', 'required').replace('class="xf"', 'class="xf xfull"') + F('x_team', 'اسم الفريق', 'فريق فالكونز') + GSEL('x_game', 'اسم اللعبة') + F('x_place', 'المركز', 'المركز الثاني') + F('x_device', 'اسم الجهاز', 'PC') },
    stream: { sub: 'أضف أبرز بثوثك مع رابطها.', html: F('x_title', 'عنوان البث', 'تحدي الوصول إلى أعلى رانك في Valorant', 'required') + F('x_views', 'عدد المشاهدات', '120K') + F('x_duration', 'مدة البث', 'ساعتين') + '<label class="xf"><span>المنصة</span><select id="x_platform">' + opts(['Twitch', 'Kick', 'YouTube', 'TikTok']) + '</select></label>' + F('x_url', 'رابط البث', 'https://', 'type="url" dir="ltr"') + '<label class="xf"><span>صورة البث (اختياري)</span><input id="x_img" type="file" accept="image/*"></label>' },
    content: { sub: 'أضف أبرز محتواك مع رابطه.', html: F('x_title', 'عنوان المحتوى', 'فيديو أفضل إعدادات EA SPORTS FC للمبتدئين', 'required') + F('x_views', 'عدد المشاهدات', '120K') + '<label class="xf"><span>المنصة</span><select id="x_platform">' + opts(['YouTube', 'TikTok', 'Instagram', 'Snapchat', 'X']) + '</select></label>' + F('x_url', 'رابط المحتوى', 'https://', 'type="url" dir="ltr"') + '<label class="xf"><span>صورة المحتوى (اختياري)</span><input id="x_img" type="file" accept="image/*"></label>' },
    platform: { sub: 'أضف منصاتك وعدد متابعينك.', html: '<label class="xf"><span>المنصة</span><select id="x_platform">' + opts(PLATFORMS) + '</select></label>' + F('x_followers', 'عدد المتابعين', '80K') + F('x_url', 'رابط الحساب', 'https://', 'type="url" dir="ltr"') },
    social: { sub: 'أضف روابط حساباتك ليسهل على مجتمع نيكسو التواصل معك.', multi: 1, html: '<label class="xf"><span>الحساب</span><select id="x_type">' + opts(SOCIALS) + '</select></label>' + F('x_value', 'الرابط أو الرقم أو البريد', 'https://example.com/username', 'required dir="ltr"') },
  };
  var CROPPED = null;
  var SOCF = [['إكس', 'https://example.com/username', 'url'], ['تيك توك', 'https://example.com/username', 'url'], ['لينكدإن', 'https://example.com/username', 'url'], ['رقم الجوال', '+966 5XXXXXXXX', 'tel'], ['البريد الإلكتروني', 'username@example.com', 'email']];
  function openSocial() {
    var cur = {}; itemsOf('social').forEach(function (it) { cur[it.type] = it.value; });
    var m = modal('حسابات التواصل', '<form class="xform" novalidate><p class="xsub">أضف روابط حساباتك ليسهل على مجتمع نيكسو التواصل معك.</p><div class="xsoc-f">' +
      SOCF.map(function (f, i) { return '<label class="xsr"><span class="xsl"><b>' + f[0] + '</b><span class="xico">' + (ICO[f[0]] || '') + '</span></span><input id="xs' + i + '" type="' + f[2] + '" dir="ltr" placeholder="' + E(f[1]) + '" value="' + E(cur[f[0]] || '') + '"></label>'; }).join('') +
      '</div><p class="xerr" role="alert"></p><button class="btn" type="submit">إضافة</button></form>', false, true);
    var form = m.querySelector('form');
    form.onsubmit = async function (e) {
      e.preventDefault();
      var err = form.querySelector('.xerr'), btn = form.querySelector('button[type=submit]'), vals = [];
      for (var i = 0; i < SOCF.length; i++) {
        var v = form.querySelector('#xs' + i).value.trim(), t = SOCF[i][0];
        if (!v) continue;
        if (t === 'البريد الإلكتروني' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { err.textContent = 'البريد الإلكتروني غير صحيح'; return; }
        if (t === 'رقم الجوال' && !/^\+?[\d\s-]{8,16}$/.test(v)) { err.textContent = 'رقم الجوال غير صحيح'; return; }
        if (SOCF[i][2] === 'url') { if (!/^https?:\/\//.test(v)) v = 'https://' + v.replace(/^\/+/, ''); }
        vals.push({ type: t, value: v });
      }
      btn.disabled = true; btn.textContent = 'جاري الحفظ...';
      try {
        var old = itemsOf('social');
        for (var j = 0; j < old.length; j++) await nexoDB.deleteItem(old[j].id);
        for (var k = 0; k < vals.length; k++) await nexoDB.addItem('social', vals[k]);
        closeX(); toast('تم الحفظ'); await loadItems();
      } catch (ex) { err.textContent = ex.message || 'تعذر الحفظ'; btn.disabled = false; btn.textContent = 'إضافة'; }
    };
  }
  // تعديل الملف (الاسم، الصور، الدور...) من قلم الغلاف — يبقى في صفحة الملف
  var CITIES = ['الرياض','جدة','مكة المكرمة','المدينة المنورة','الدمام','الخبر','الظهران','الأحساء','القطيف','الجبيل','الطائف','بريدة','عنيزة','الرس','حائل','تبوك','أبها','خميس مشيط','بيشة','نجران','جازان','صبيا','أبو عريش','ينبع','رابغ','الليث','القنفذة','الباحة','سكاكا','دومة الجندل','عرعر','رفحاء','طريف','القريات','حفر الباطن','الخرج','الدرعية','الزلفي','المجمعة','شقراء','الدوادمي','وادي الدواسر','الأفلاج','العلا','الوجه','ضباء','تيماء','خيبر','شرورة','محايل عسير','بقيق','رأس تنورة','النعيرية'];
  function openEditProfile() {
    var p = PROFILE, team = p.kind === 'team';
    var sel = function (id, label, list, val, labels) {
      return '<label class="xf"><span>' + label + '</span><select id="' + id + '" required><option value="" disabled hidden' + (val ? '' : ' selected') + '></option>' +
        list.map(function (x) { return '<option value="' + E(x) + '"' + (x === val ? ' selected' : '') + '>' + E((labels && labels[x]) || x) + '</option>'; }).join('') + '</select></label>';
    };
    var txt = function (id, label, val, req) { return '<label class="xf"><span>' + label + '</span><input id="' + id + '" value="' + E(val || '') + '"' + (req ? ' required' : '') + ' maxlength="80"></label>'; };
    var file = function (id, label) { return '<label class="xf"><span>' + label + '</span><input id="' + id + '" type="file" accept="image/*"></label>'; };
    var cl = CITIES.indexOf(p.city) < 0 && p.city ? CITIES.concat([p.city]) : CITIES;
    var html = team
      ? txt('e_n', 'اسم الجهة', p.n, 1) + file('e_ph', 'الشعار') + file('e_cv', 'صورة الغلاف') + sel('e_type', 'النوع', ['نادي', 'جهة', 'مقدم خدمة'], p.type) + txt('e_sub', 'وصف قصير', p.sub) + sel('e_city', 'المدينة', cl, p.city)
      : txt('e_n', 'الاسم', p.n, 1) + file('e_ph', 'صورتك الشخصية') + file('e_cv', 'صورة الغلاف') + sel('e_role', 'أنت', ['لاعب', 'صانع محتوى', 'ستريمر'], p.role) + txt('e_g', 'اللعبة أو المنصة', p.g) + sel('e_city', 'المدينة', cl, p.city) + sel('e_s', 'الحالة', ['يبحث عن فريق', 'منضم لفريق'], p.s, { 'يبحث عن فريق': 'يبحث عن فرصة' });
    var m = modal(team ? 'ملف الجهة' : 'ملفك الشخصي', '<form class="xform" novalidate><div class="xfields two">' + html + '</div><p class="xerr" role="alert"></p><button class="btn" type="submit">حفظ</button></form>', false, true);
    var form = m.querySelector('form'), IMG = {};
    form.querySelector('#e_n').closest('label').classList.add('xfull');
    ['e_ph', 'e_cv'].forEach(function (id) {
      var inp = form.querySelector('#' + id), key = id === 'e_ph' ? 'ph' : 'cv';
      var pick = async function (again) {
        var f = inp.files[0]; if (!f) return;
        var bl = window.CROP ? await CROP(f, CROPCFG[key]) : f;
        if (bl) { IMG[key] = bl; if (window.CPV) CPV(inp, bl, function () { pick(1); }); }
        else if (!again) { IMG[key] = null; inp.value = ''; if (window.CPV) CPV(inp, null); }
      };
      inp.onchange = function () { pick(0); };
    });
    form.onsubmit = async function (e) {
      e.preventDefault();
      var err = form.querySelector('.xerr'), btn = form.querySelector('button[type=submit]');
      var v = function (id) { var x = form.querySelector('#' + id); return x ? (x.value || '').trim() : ''; };
      if (!v('e_n')) { err.textContent = 'اكتب ' + (team ? 'اسم الجهة' : 'الاسم'); return; }
      btn.disabled = true; btn.textContent = 'جاري الحفظ...';
      try {
        var o = team ? { n: v('e_n'), type: v('e_type'), sub: v('e_sub'), city: v('e_city') }
                     : { n: v('e_n'), role: v('e_role'), g: v('e_g'), city: v('e_city'), s: v('e_s') };
        if (IMG.ph) o.ph = await nexoDB.upload(IMG.ph);
        if (IMG.cv) o.cv = await nexoDB.upload(IMG.cv);
        await nexoDB.saveMe(o);
        closeX(); toast('تم الحفظ');
        await loadProfile();
      } catch (ex) { err.textContent = ex.message || 'تعذر الحفظ'; btn.disabled = false; btn.textContent = 'حفظ'; }
    };
  }

  // تعديل النبذة من القلم في قسم النبذة
  function openBio() {
    var m = modal('تعديل النبذة', '<form class="xform" novalidate><p class="xsub">عرّف مجتمع نيكسو بك وبخبراتك وطموحاتك في عالم الألعاب.</p><label class="xf"><span>النبذة</span><textarea id="x_bio" maxlength="2000">' + E(PROFILE && PROFILE.bio || '') + '</textarea></label><p class="xerr" role="alert"></p><button class="btn" type="submit">إضافة</button></form>', false, true);
    var form = m.querySelector('form');
    form.onsubmit = async function (e) {
      e.preventDefault();
      var v = form.querySelector('#x_bio').value.trim(), err = form.querySelector('.xerr'), btn = form.querySelector('button[type=submit]');
      if (!v) { err.textContent = 'اكتب النبذة'; return; }
      btn.disabled = true; btn.textContent = 'جاري الحفظ...';
      try { await nexoDB.saveMe({ bio: v }); PROFILE.bio = v; var b = q('.bio'); if (b) b.textContent = v; closeX(); toast('تم الحفظ'); }
      catch (ex) { err.textContent = ex.message || 'تعذر الحفظ'; btn.disabled = false; btn.textContent = 'إضافة'; }
    };
  }
  function openAdd(k) {
    if (k === 'social') return openSocial();
    CROPPED = null;
    var m = modal(SEC[k].add, '<form class="xform" novalidate><p class="xsub">' + FORMS[k].sub + '</p><div class="xfields' + (k === 'social' || k === 'platform' ? '' : ' two') + '">' + FORMS[k].html + '</div><p class="xerr" role="alert"></p><button class="btn" type="submit">إضافة</button></form>', false, true);
    var form = m.querySelector('form'), file = m.querySelector('#x_img');
    if (file) file.onchange = async function () {
      var f = file.files[0]; if (!f) return;
      CROPPED = window.CROP ? await CROP(f, { ar: 16 / 9, w: 640, t: 'صورة ' + (k === 'stream' ? 'البث' : 'المحتوى') }) : f;
      if (!CROPPED) file.value = '';
      if (window.CPV) CPV(file, CROPPED, function () { file.onchange(); });
    };
    var ty = m.querySelector('#x_type');
    if (ty) ty.onchange = function () {
      var v = m.querySelector('#x_value');
      
    };
    form.onsubmit = async function (e) {
      e.preventDefault();
      var err = form.querySelector('.xerr'), btn = form.querySelector('button[type=submit]');
      var val = function (id) { var x = form.querySelector('#' + id); return x ? x.value.trim() : ''; };
      var data = {};
      form.querySelectorAll('input:not([type=file]),select').forEach(function (x) { if (x.value.trim()) data[x.id.replace('x_', '')] = x.value.trim(); });
      var req = form.querySelector('[required]');
      if (req && !(req.value || '').trim()) { err.textContent = (req.tagName === 'SELECT' ? 'اختر ' : 'اكتب ') + req.closest('label').querySelector('span').textContent; req.focus(); return; }
      if (data.url && !/^https:\/\//.test(data.url)) { err.textContent = 'الرابط لازم يبدأ بـ https://'; return; }
      if (k === 'social') {
        var t = val('x_type'), v = val('x_value');
        if (t === 'البريد الإلكتروني' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { err.textContent = 'البريد الإلكتروني غير صحيح'; return; }
        if (t === 'رقم الجوال' && !/^\+?[\d\s-]{8,16}$/.test(v)) { err.textContent = 'رقم الجوال غير صحيح'; return; }
        if (t !== 'رقم الجوال' && t !== 'البريد الإلكتروني' && !/^https:\/\//.test(v)) { err.textContent = 'رابط الحساب لازم يبدأ بـ https://'; return; }
      }
      btn.disabled = true; btn.textContent = 'جاري الحفظ...';
      try {
        if (CROPPED) data.img = await nexoDB.upload(CROPPED);
        await nexoDB.addItem(k, data);
        closeX(); toast('تمت الإضافة');
        await loadItems();
      } catch (ex) { err.textContent = ex.message || 'تعذر الحفظ'; btn.disabled = false; btn.textContent = 'إضافة'; }
    };
  }

  document.addEventListener('click', async function (e) {
    var a = e.target.closest('[data-all]'), ad = e.target.closest('[data-add]'), d = e.target.closest('[data-del]');
    if (a) { e.preventDefault(); openAll(a.dataset.all); }
    else if (ad) { e.preventDefault(); openAdd(ad.dataset.add); }
    else if (d) {
      e.preventDefault(); e.stopPropagation();
      if (d.dataset.sure !== '1') { d.dataset.sure = '1'; d.textContent = 'تأكيد الحذف'; setTimeout(function () { d.dataset.sure = ''; d.textContent = 'حذف'; }, 3000); return; }
      d.disabled = true;
      try {
        await nexoDB.deleteItem(d.dataset.del);
        await loadItems(); toast('تم الحذف');
        var open = q('#xmodal.on h3');
        if (open) { var k = Object.keys(SEC).find(function (x) { return SEC[x].t === open.textContent; }); if (k) openAll(k); }
      } catch (ex) { toast(ex.message || 'تعذر الحذف'); d.disabled = false; }
    }
  });

  // نشر منشور من صفحة ملفي (بدل النسخة المحلية في profile-common.js)
  window.publishPost = async function () {
    var t = q('#ptxt').value.trim();
    if (!t || !window.nexoDB) return;
    var b = q('#pubBtn');
    b.disabled = true;
    try {
      await nexoDB.addPost({ t: t });
      q('#ptxt').value = '';
      closeM();
      toast('تم النشر');
      renderPosts(await nexoDB.listPosts(nexoDB.uid));
    } catch (e) {
      toast(e.message || 'تعذر النشر');
      b.disabled = false;
    }
  };

  // صفحة إنشاء فرصة
  function setupCreate() {
    var btn = q('#opub');
    if (!btn) return;
    var TYPES = { 'حملة إعلانية': 'حملة اعلانية', 'مشاركة في بطولة': 'مشاركة في البطولة' };
    var CATS = { 'اللاعبين': 'لاعب', 'صناع المحتوى': 'صانع محتوى', 'ستريمرز': 'ستريمر' };
    var picked = function (id) {
      var b = document.querySelector('#' + id + ' [aria-pressed="true"]');
      return b ? b.dataset.v : '';
    };
    btn.onclick = async function () {
      var n = q('#oname').value.trim(), c = q('#ocity').value, d = q('#odesc').value.trim();
      if (!n || !c || !d) { toast('أكمل اسم الفرصة والمدينة والوصف'); return; }
      if (btn.disabled) return;
      btn.disabled = true;
      try {
        var me = await nexoDB.getMe();
        var type = picked('types'), aud = picked('cats');
        await nexoDB.addOpp({
          title: n, city: c, d: d, org: me.n || 'جهة', ph: me.ph,
          type: TYPES[type] || type, aud: CATS[aud] || aud,
        });
        toast('تم نشر الفرصة');
        setTimeout(function () { location.href = 'dash-entity-profile.html'; }, 900);
      } catch (e) {
        toast(e.message || 'تعذر نشر الفرصة');
        btn.disabled = false;
      }
    };
  }

  onReady(function () {
    if (CREATE) setupCreate();
    loadProfile().catch(function (e) { console.error(e); toast('تعذر تحميل البيانات'); });
  });
})();
