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
      location.href = 'dash-home.html#edit';
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

  function renderPosts(posts) {
    var grid = q('#postGrid');
    if (!grid) return;
    grid.innerHTML = posts.map(function (p) {
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
  }

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
