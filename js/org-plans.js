// =====================================================================
// باقات الجهات + صفحة الدفع (بعد إنهاء أونبوردنق الجهة، قبل تسجيل الدخول)
// الأسعار كلها هنا في مكان واحد — عدّلها من ORG_PLANS
// =====================================================================
var ORG_PLANS = {
  m: { key: 'm', name: 'الشهرية', short: 'شهري', price: 249, per: 'شهرياً', perMonth: 249 },
  y: { key: 'y', name: 'السنوية', short: 'سنوي', price: 2400, per: 'سنوياً', perMonth: 200 }
};
var ORG_VAT = 0.15;
var ORG_TRIAL_DAYS = 7;
var ORG_SAVE = Math.round((1 - ORG_PLANS.y.price / (ORG_PLANS.m.price * 12)) * 100); // 20%
var ORG_FEATURES = [
  'إنشاء حساب جهة رسمي موثق',
  'نشر الفرص الوظيفية والتدريبية',
  'إنشاء ونشر الفعاليات والبطولات',
  'التواصل مع اللاعبين وصناع المحتوى'
];

var CHK = '<svg width="22" height="22" aria-hidden="true"><circle cx="11" cy="11" r="11" fill="#E0FAE0"/><path d="M6.8 11.3l2.8 2.7 5.6-5.8" fill="none" stroke="#03BB43" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function money(n) {
  return (Math.round(n * 100) / 100).toLocaleString('en-US', { maximumFractionDigits: 2 });
}
function arDate(d) {
  return d.toLocaleDateString('ar-SA-u-ca-gregory-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' });
}
function trialEnd() {
  var d = new Date();
  d.setDate(d.getDate() + ORG_TRIAL_DAYS);
  return d;
}

// ---------------- صفحة الباقات ----------------
function renderPlans(el) {
  function card(p) {
    var best = p.key === 'y';
    return '<article class="plan' + (best ? ' best' : '') + '">' +
      '<div class="tag">' + (best ? 'وفّر ' + ORG_SAVE + '%' : 'الأكثر شيوعاً') + '</div>' +
      '<div class="in">' +
        '<h2>الباقة ' + p.name + '</h2>' +
        '<p class="sub">' + (best ? 'وفّر ما يعادل شهرين مجاناً مع الدفع السنوي' : 'اشترك شهرياً بدون التزام طويل المدى') + '</p>' +
        '<div class="price"><b>' + money(p.price) + '</b><span class="cur">ر.س</span><span class="per">/ ' + p.per + '</span></div>' +
        (best ? '<span class="save">' + p.perMonth + ' ر.س / شهرياً — بدلاً من ' + ORG_PLANS.m.price + ' ر.س</span>' : '') +
        '<ul class="feats">' + ORG_FEATURES.map(function (f) { return '<li>' + CHK + f + '</li>'; }).join('') + '</ul>' +
        '<div class="acts">' +
          '<a class="btn' + (best ? ' g' : '') + '" href="page-17-org-payment.html?plan=' + p.key + '&mode=pay">اشترك الآن' + (best ? ' ووفّر ' + ORG_SAVE + '%' : '') + '</a>' +
          '<a class="btn o" href="page-17-org-payment.html?plan=' + p.key + '&mode=trial">جرّب مجانًا</a>' +
        '</div>' +
      '</div></article>';
  }
  el.innerHTML =
    '<div class="ph"><span class="pill">خطط الاشتراك</span>' +
    '<h1>اختر الباقة المناسبة لجهتك</h1>' +
    '<p>ابدأ بالتجربة المجانية، وانتقل للباقة المناسبة عندما تكون مستعداً</p></div>' +
    '<div class="plans">' + card(ORG_PLANS.y) + card(ORG_PLANS.m) + '</div>';
}

// ---------------- صفحة الدفع ----------------
function renderPayment(el) {
  var q = new URLSearchParams(location.search);
  var PL = q.get('plan') === 'm' ? 'm' : 'y';
  var TRIAL = q.get('mode') !== 'pay';

  var ICO = {
    card: '<svg width="20" height="15" fill="none" stroke="#9A9AAE" stroke-width="1.3" aria-hidden="true"><rect x=".7" y=".7" width="18.6" height="13.6" rx="2"/><path d="M.7 5h18.6"/></svg>',
    cal: '<svg width="18" height="18" fill="none" stroke="#9A9AAE" stroke-width="1.3" aria-hidden="true"><rect x=".7" y="2.5" width="16.6" height="14.8" rx="2"/><path d="M.7 7h16.6M5 .5v4M13 .5v4"/></svg>',
    lock: '<svg width="16" height="18" fill="none" stroke="#9A9AAE" stroke-width="1.3" aria-hidden="true"><rect x=".7" y="7.5" width="14.6" height="9.8" rx="2"/><path d="M4 7.5V5a4 4 0 018 0v2.5"/><circle cx="8" cy="12.4" r="1.2"/></svg>'
  };

  function totals() {
    var p = ORG_PLANS[PL], vat = p.price * ORG_VAT;
    return { p: p, vat: vat, total: p.price + vat };
  }

  function summary() {
    var t = totals(), p = t.p;
    return '<h2>ملخص الطلب</h2>' +
      '<div class="plt" role="group" aria-label="مدة الاشتراك">' +
        '<button type="button" data-pl="y" class="' + (PL === 'y' ? 'on' : '') + '">سنوي · وفّر ' + ORG_SAVE + '%</button>' +
        '<button type="button" data-pl="m" class="' + (PL === 'm' ? 'on' : '') + '">شهري · ' + ORG_PLANS.m.price + ' ر.س</button>' +
      '</div>' +
      '<div class="plc"><div><span>باقة الجهات ' + p.name + '</span><span class="amt">' + money(p.price) + ' ر.س</span></div>' +
        '<p>' + (PL === 'y' ? 'ما يعادل ' + p.perMonth + ' ر.س شهريًا · ' : '') + 'مستخدمون غير محدودين</p></div>' +
      (TRIAL
        ? '<div class="tl"><div class="ln"><i class="on"></i><b></b><i></i></div><div class="tlr">' +
            '<div><b class="g">اليوم</b><span>بدء التجربة</span></div>' +
            '<div><b>' + arDate(trialEnd()) + '</b><span>أول دفعة</span></div></div></div>'
        : '<div style="height:22px"></div>') +
      '<div class="rows"><div><span>سعر الاشتراك ' + (PL === 'y' ? 'السنوي' : 'الشهري') + '</span><span class="n">' + money(p.price) + ' ر.س</span></div>' +
        '<div><span>ضريبة القيمة المضافة (15%)</span><span class="n">' + money(t.vat) + ' ر.س</span></div></div>' +
      '<div class="rows tot"><div><b>' + (TRIAL ? 'الإجمالي بعد التجربة' : 'الإجمالي') + '</b><span class="n"><b>' + money(t.total) + ' ر.س</b></span></div>' +
        '<div><span>المستحق اليوم</span><span class="n ' + (TRIAL ? 'g' : '') + '">' + (TRIAL ? '0' : money(t.total)) + ' ر.س</span></div></div>';
  }

  function agreeText() {
    var t = totals();
    return TRIAL
      ? 'أوافق على بدء التجربة المجانية، وعلى خصم ' + money(t.total) + ' ر.س في ' + arDate(trialEnd()) + ' ما لم ألغِ قبل ذلك.'
      : 'أوافق على خصم ' + money(t.total) + ' ر.س الآن، وتجديد الاشتراك ' + t.p.per + ' ما لم ألغِ قبل ذلك.';
  }
  function btnText() {
    return TRIAL ? 'ابدأ التجربة المجانية لمدة ' + ORG_TRIAL_DAYS + ' أيام' : 'ادفع ' + money(totals().total) + ' ر.س واشترك';
  }

  el.innerHTML =
    '<div class="pay">' +
    '<form class="box" id="pfm" novalidate>' +
      '<h2>بيانات الدفع والفوترة</h2><p class="msub">' + (TRIAL ? 'أدخل بياناتك لإتمام تفعيل التجربة' : 'أدخل بياناتك لإتمام الاشتراك') + '</p>' +
      '<div class="pm"><span>طرق الدفع المدعومة</span><span class="mada" aria-label="مدى"><i></i><i></i><span>مدى<br>mada</span></span></div>' +
      '<div class="cbox">' +
        '<label for="cn">رقم البطاقة</label><div class="fi"><input id="cn" inputmode="numeric" autocomplete="cc-number" dir="ltr" placeholder="0000  0000  0000  0000" maxlength="23">' + ICO.card + '</div>' +
        '<div class="g2f">' +
          '<div><label for="ce">تاريخ الانتهاء</label><div class="fi"><input id="ce" inputmode="numeric" autocomplete="cc-exp" dir="ltr" placeholder="MM / YY" maxlength="7">' + ICO.cal + '</div></div>' +
          '<div><label for="cc">رمز الأمان</label><div class="fi"><input id="cc" inputmode="numeric" autocomplete="cc-csc" dir="ltr" placeholder="CVC" maxlength="4">' + ICO.lock + '</div></div>' +
        '</div>' +
        '<label for="ch">اسم حامل البطاقة</label><div class="fi"><input id="ch" autocomplete="cc-name" placeholder="الاسم كما يظهر على البطاقة"></div>' +
      '</div>' +
      '<label class="agr"><input type="checkbox" id="ag" checked><span id="agt">' + agreeText() + '</span></label>' +
      '<p class="err" id="er" role="alert"></p>' +
      '<button class="btn" id="go">' + btnText() + '</button>' +
    '</form>' +
    '<aside class="box sum" id="sum">' + summary() + '</aside>' +
    '</div>';

  var $ = function (s) { return document.querySelector(s); };

  $('#sum').addEventListener('click', function (e) {
    var b = e.target.closest('[data-pl]');
    if (!b) return;
    PL = b.dataset.pl;
    history.replaceState(null, '', '?plan=' + PL + '&mode=' + (TRIAL ? 'trial' : 'pay'));
    $('#sum').innerHTML = summary();
    $('#agt').textContent = agreeText();
    $('#go').textContent = btnText();
  });

  $('#cn').oninput = function (e) { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1  '); };
  $('#ce').oninput = function (e) { var x = e.target.value.replace(/\D/g, '').slice(0, 4); e.target.value = x.length > 2 ? x.slice(0, 2) + ' / ' + x.slice(2) : x; };
  $('#cc').oninput = function (e) { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); };

  function luhn(n) {
    var s = 0, d = 0;
    for (var i = n.length - 1; i >= 0; i--) { var x = +n[i]; if (d && (x *= 2) > 9) x -= 9; s += x; d ^= 1; }
    return s % 10 === 0;
  }

  $('#pfm').onsubmit = function (e) {
    e.preventDefault();
    var f = e.target, er = function (m) { $('#er').textContent = m; };
    f.querySelectorAll('.bad').forEach(function (x) { x.classList.remove('bad'); });
    var bad = function (id, m) { $(id).closest('.fi').classList.add('bad'); $(id).focus(); er(m); };
    var n = $('#cn').value.replace(/\D/g, '');
    var parts = $('#ce').value.split('/').map(function (x) { return +x.trim(); });
    var mm = parts[0], yy = parts[1];
    if (n.length < 13 || !luhn(n)) return bad('#cn', 'رقم البطاقة غير صحيح');
    if (!(mm >= 1 && mm <= 12) || isNaN(yy) || new Date(2000 + yy, mm) <= new Date()) return bad('#ce', 'تاريخ الانتهاء غير صحيح');
    if (!/^\d{3,4}$/.test($('#cc').value)) return bad('#cc', 'رمز الأمان غير صحيح');
    if (!$('#ch').value.trim()) return bad('#ch', 'اكتب اسم حامل البطاقة');
    if (!$('#ag').checked) return er(TRIAL ? 'لازم توافق على شروط التجربة المجانية' : 'لازم توافق على شروط الاشتراك');

    // مهم: بيانات البطاقة ما تنحفظ ولا تنرسل لأي مكان.
    // الخصم الحقيقي يحتاج بوابة دفع (مثل Moyasar أو Tap أو HyperPay) تستقبل البطاقة بنفسها.
    // هنا نحفظ اختيار الباقة فقط، وينتقل للحساب بعد تسجيل الدخول.
    try {
      localStorage.setItem('nexo_org_sub', JSON.stringify({
        plan: PL, mode: TRIAL ? 'trial' : 'paid', start: Date.now(),
        trialEnd: TRIAL ? trialEnd().getTime() : null
      }));
    } catch (x) { /* empty */ }

    var p = ORG_PLANS[PL];
    el.innerHTML = '<div class="box done">' +
      '<div class="ic">' + CHK.replace('width="22" height="22"', 'width="44" height="44" viewBox="0 0 22 22"') + '</div>' +
      '<h2>' + (TRIAL ? 'تم تفعيل تجربتك المجانية' : 'تم الاشتراك بنجاح') + '</h2>' +
      '<p>' + (TRIAL
        ? 'استمتع بباقة الجهات ' + p.name + ' مجانًا حتى ' + arDate(trialEnd()) + '. تقدر تلغي في أي وقت قبل هذا التاريخ.'
        : 'تم تفعيل باقة الجهات ' + p.name + '. أهلاً بك في نيكسو.') + '</p>' +
      '<a class="btn" href="/auth.html#/login">تسجيل الدخول</a></div>';
  };
}

(function () {
  var el = document.getElementById('m');
  if (!el) return;
  if (el.dataset.page === 'plans') renderPlans(el);
  else if (el.dataset.page === 'payment') renderPayment(el);
})();
