/* =========================================
   NEXO - 17 الدفع والفوترة (الجهات)
   البيانات من ../assets/js/org-plans-data.js
   ========================================= */


/* =========================================
   STATE
   ========================================= */

var query = new URLSearchParams(location.search);

var state = {
  plan: query.get("plan") === "m" ? "m" : "y",
  trial: query.get("mode") !== "pay"
};

var $ = function (s) {
  return document.querySelector(s);
};


/* =========================================
   ICONS
   ========================================= */

var ICONS = {
  card:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A5A4B5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
  calendar:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A5A4B5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  lock:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A5A4B5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>',
  done:
    '<svg width="64" height="64" viewBox="0 0 24 24" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="12" fill="#E0FAE0"/>' +
    '<path d="M7.5 12.3l3 3 6-6.3" fill="none" stroke="#03BB43" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};


/* =========================================
   HELPERS
   ========================================= */

function arDate(d) {
  return d.toLocaleDateString("ar-SA-u-ca-gregory-nu-latn", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function trialEnd() {
  var d = new Date();
  d.setDate(d.getDate() + ORG_TRIAL_DAYS);
  return d;
}

function totals() {
  var p = ORG_PLANS[state.plan];
  var has = p.price != null;

  return {
    plan: p,
    price: orgAmount(p.price, p.placeholder),
    perMonth: orgAmount(has ? p.price / p.months : null, "000"),
    vat: has ? orgMoney(p.price * ORG_VAT) : "00",
    total: has ? orgMoney(p.price * (1 + ORG_VAT)) : p.placeholder
  };
}

function agreeText() {
  var t = totals();

  if (state.trial) {
    return "أوافق على بدء التجربة المجانية، وعلى خصم " + t.total +
      " ر.س في " + arDate(trialEnd()) + " ما لم ألغِ قبل ذلك.";
  }

  return "أوافق على خصم " + t.total + " ر.س الآن، وتجديد الاشتراك " +
    t.plan.per + " ما لم ألغِ قبل ذلك.";
}

function buttonText() {
  return state.trial
    ? "ابدأ التجربة المجانية لمدة " + ORG_TRIAL_DAYS + " أيام"
    : "ادفع " + totals().total + " ر.س واشترك";
}


/* =========================================
   ORDER SUMMARY
   ========================================= */

function renderSummary() {
  var t = totals();
  var yearly = state.plan === "y";

  $("#summary").innerHTML =
    "<h2>ملخص الطلب</h2>" +

    '<div class="switch" role="group" aria-label="مدة الاشتراك">' +
      '<button type="button" data-plan="y" class="' + (yearly ? "on" : "") + '">سنوي · وفّر ' + ORG_SAVE + "%</button>" +
      '<button type="button" data-plan="m" class="' + (yearly ? "" : "on") + '">شهري · ' +
        orgAmount(ORG_PLANS.m.price, ORG_PLANS.m.placeholder) + " ر.س</button>" +
    "</div>" +

    '<div class="plan-card">' +
      "<div><span>باقة الجهات " + t.plan.name + '</span><span class="amount">' + t.price + " ر.س</span></div>" +
      "<p>" + (yearly ? "ما يعادل " + t.perMonth + " ر.س شهريًا · " : "") + "مستخدمون غير محدودين</p>" +
    "</div>" +

    (state.trial
      ? '<div class="timeline">' +
          '<div class="line"><i class="on"></i><i></i></div>' +
          '<div class="steps">' +
            '<div><b class="green">اليوم</b><span>بدء التجربة</span></div>' +
            "<div><b>" + arDate(trialEnd()) + "</b><span>أول دفعة</span></div>" +
          "</div>" +
        "</div>"
      : '<div style="height:24px"></div>') +

    '<div class="rows">' +
      "<div><span>سعر الاشتراك " + (yearly ? "السنوي" : "الشهري") + "</span><span>" + t.price + " ر.س</span></div>" +
      "<div><span>ضريبة القيمة المضافة (15%)</span><span>" + t.vat + " ر.س</span></div>" +
    "</div>" +

    '<div class="rows total">' +
      "<div><b>" + (state.trial ? "الإجمالي بعد التجربة" : "الإجمالي") + "</b><b>" + t.total + " ر.س</b></div>" +
      "<div><span>المستحق اليوم</span><span class=\"" + (state.trial ? "green" : "") + "\">" +
        (state.trial ? "0" : t.total) + " ر.س</span></div>" +
    "</div>";

  $("#agreeText").textContent = agreeText();
  $("#submit").textContent = buttonText();
}


/* =========================================
   PAYMENT FORM
   ========================================= */

function renderForm() {
  $("#form").innerHTML =
    "<h2>بيانات الدفع والفوترة</h2>" +
    '<p class="box-sub">' + (state.trial ? "أدخل بياناتك لإتمام تفعيل التجربة" : "أدخل بياناتك لإتمام الاشتراك") + "</p>" +

    '<div class="methods"><span>طرق الدفع المدعومة</span>' +
      '<span class="mada" aria-label="مدى"><i></i><i></i><span>مدى<br>mada</span></span>' +
    "</div>" +

    '<div class="card-box">' +
      '<label for="cardNumber">رقم البطاقة</label>' +
      '<div class="field"><input id="cardNumber" inputmode="numeric" autocomplete="cc-number" dir="ltr" placeholder="0000  0000  0000  0000" maxlength="23">' + ICONS.card + "</div>" +

      '<div class="two">' +
        '<div><label for="cardExp">تاريخ الانتهاء</label>' +
          '<div class="field"><input id="cardExp" inputmode="numeric" autocomplete="cc-exp" dir="ltr" placeholder="MM / YY" maxlength="7">' + ICONS.calendar + "</div></div>" +
        '<div><label for="cardCvc">رمز الأمان</label>' +
          '<div class="field"><input id="cardCvc" inputmode="numeric" autocomplete="cc-csc" dir="ltr" placeholder="CVC" maxlength="4">' + ICONS.lock + "</div></div>" +
      "</div>" +

      '<label for="cardName">اسم حامل البطاقة</label>' +
      '<div class="field"><input id="cardName" autocomplete="cc-name" placeholder="الاسم كما يظهر على البطاقة"></div>' +
    "</div>" +

    '<label class="agree"><input type="checkbox" id="agree" checked><span id="agreeText"></span></label>' +
    '<p class="error" id="error" role="alert"></p>' +
    '<button class="btn" id="submit"></button>';
}


/* =========================================
   VALIDATION
   ========================================= */

function luhn(n) {
  var sum = 0, dbl = false;

  for (var i = n.length - 1; i >= 0; i--) {
    var x = +n[i];
    if (dbl && (x *= 2) > 9) x -= 9;
    sum += x;
    dbl = !dbl;
  }

  return sum % 10 === 0;
}

function showError(id, msg) {
  if (id) {
    $(id).closest(".field").classList.add("bad");
    $(id).focus();
  }
  $("#error").textContent = msg;
}

function submit(e) {
  e.preventDefault();

  document.querySelectorAll(".field.bad").forEach(function (f) {
    f.classList.remove("bad");
  });

  var number = $("#cardNumber").value.replace(/\D/g, "");
  var exp = $("#cardExp").value.split("/").map(function (x) { return +x.trim(); });
  var mm = exp[0], yy = exp[1];

  if (number.length < 13 || !luhn(number)) return showError("#cardNumber", "رقم البطاقة غير صحيح");
  if (!(mm >= 1 && mm <= 12) || isNaN(yy) || new Date(2000 + yy, mm) <= new Date()) return showError("#cardExp", "تاريخ الانتهاء غير صحيح");
  if (!/^\d{3,4}$/.test($("#cardCvc").value)) return showError("#cardCvc", "رمز الأمان غير صحيح");
  if (!$("#cardName").value.trim()) return showError("#cardName", "اكتب اسم حامل البطاقة");
  if (!$("#agree").checked) return showError(null, state.trial ? "لازم توافق على شروط التجربة المجانية" : "لازم توافق على شروط الاشتراك");

  /*
    مهم: بيانات البطاقة ما تنحفظ ولا تنرسل لأي مكان.
    الخصم الحقيقي يحتاج بوابة دفع (مثل Moyasar أو Tap أو HyperPay).
    هنا نحفظ اختيار الباقة فقط.
  */
  try {
    localStorage.setItem("nexo_org_sub", JSON.stringify({
      plan: state.plan,
      mode: state.trial ? "trial" : "paid",
      start: Date.now(),
      trialEnd: state.trial ? trialEnd().getTime() : null
    }));
  } catch (err) { /* empty */ }

  renderDone();
}


/* =========================================
   DONE
   ========================================= */

function renderDone() {
  var p = ORG_PLANS[state.plan];

  $("#pay").innerHTML =
    '<div class="box done" style="grid-column:1/-1">' +
      ICONS.done +
      "<h2>" + (state.trial ? "تم تفعيل تجربتك المجانية" : "تم الاشتراك بنجاح") + "</h2>" +
      "<p>" + (state.trial
        ? "استمتع بباقة الجهات " + p.name + " مجانًا حتى " + arDate(trialEnd()) + ". تقدر تلغي في أي وقت قبل هذا التاريخ."
        : "تم تفعيل باقة الجهات " + p.name + ". أهلاً بك في نيكسو.") +
      "</p>" +
      '<a class="btn" href="' + ORG_URLS.done + '">تسجيل الدخول</a>' +
    "</div>";
}


/* =========================================
   EVENTS
   ========================================= */

renderForm();
renderSummary();

$("#back").href = ORG_URLS.plans;

$("#summary").addEventListener("click", function (e) {
  var btn = e.target.closest("[data-plan]");
  if (!btn) return;

  state.plan = btn.dataset.plan;
  history.replaceState(null, "", "?plan=" + state.plan + "&mode=" + (state.trial ? "trial" : "pay"));
  renderSummary();
});

$("#cardNumber").addEventListener("input", function (e) {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1  ");
});

$("#cardExp").addEventListener("input", function (e) {
  var x = e.target.value.replace(/\D/g, "").slice(0, 4);
  e.target.value = x.length > 2 ? x.slice(0, 2) + " / " + x.slice(2) : x;
});

$("#cardCvc").addEventListener("input", function (e) {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
});

$("#form").addEventListener("submit", submit);
