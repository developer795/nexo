/* ---- Opportunities page ---- */

/*
  الفرص تجي من Supabase عبر src/public-data.js
  إذا لم توجد فرص، ستكون الصفحة فارغة.
*/
var OPPS = [];


/* ---- Tabs ---- */

var TABS = [
  { key: "all",      label: "الكل" },
  { key: "player",   label: "لاعبين" },
  { key: "creator",  label: "صناع المحتوى" },
  { key: "streamer", label: "ستريمرز" }
];

var state = {
  tab: "all",
  city: "",
  kind: ""
};

var tabsEl = document.getElementById("tabs");
var gridEl = document.getElementById("grid");
var cityEl = document.getElementById("cityFilter");
var kindEl = document.getElementById("typeFilter");

var USERS_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>' +
  '<circle cx="9" cy="7" r="4"/>' +
  '<path d="M22 21v-2a4 4 0 0 0-3-3.87"/>' +
  '<path d="M16 3.13a4 4 0 0 1 0 7.75"/>' +
  '</svg>';

var PIN_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>' +
  '<circle cx="12" cy="10" r="3"/>' +
  '</svg>';


/* حساب عدد الفرص */

function countOf(key) {
  if (key === "all") {
    return OPPS.length;
  }

  return OPPS.filter(function (o) {
    return o.cat === key;
  }).length;
}


/* عرض التبويبات */

function renderTabs() {
  tabsEl.innerHTML = TABS.map(function (t) {

    var label = t.label;

    if (t.key !== "all") {
      label += " (" + countOf(t.key) + ")";
    }

    return (
      '<button class="tab' +
      (state.tab === t.key ? " active" : "") +
      '" data-key="' +
      t.key +
      '">' +
      label +
      "</button>"
    );

  }).join("");
}


/* تعبئة القوائم */

function fillSelect(el, placeholder, values) {

  el.innerHTML =
    '<option value="">' +
    placeholder +
    "</option>" +

    values.map(function (v) {
      var value = typeof v === "string" ? v : v.value;
      var label = typeof v === "string" ? v : v.label;

      return (
        '<option value="' +
        value +
        '">' +
        label +
        "</option>"
      );

    }).join("");
}


/* القيم غير المكررة */

function unique(field) {

  var out = [];

  OPPS.forEach(function (o) {

    if (
      o[field] &&
      out.indexOf(o[field]) === -1
    ) {
      out.push(o[field]);
    }

  });

  return out;
}


/* إنشاء بطاقة الفرصة */

function card(o, i) {

  var logo = o.logo || "NEXO";
  var color = o.color || "#542400";

  var fs = logo.length > 3 ? "11px" : "16px";

  var tags = (o.tags || []).map(function (t) {

    return '<span class="tag">' + t + "</span>";

  }).join("");


  return (

    '<article class="opp-card" style="animation-delay:' +
    (i * 40) +
    'ms">' +

      '<div class="opp-top">' +

        '<div class="opp-logo" style="background:' +
        color +
        ";font-size:" +
        fs +
        '">' +
        logo +
        "</div>" +

        '<div class="opp-info">' +

          "<h3>" +
          (o.title || "فرصة جديدة") +
          "</h3>" +

          '<p class="org">' +
          (o.org || "جهة جديدة") +
          "</p>" +

          '<div class="opp-tags">' +
          tags +
          "</div>" +

        "</div>" +

        '<span class="chip ' +
        (o.kindClass || "chip-green") +
        ' opp-kind">' +
        (o.kind || "فرصة") +
        "</span>" +

      "</div>" +

      '<div class="opp-meta">' +

        "<span>" +
        PIN_ICON +
        (o.city || "غير محدد") +
        "</span>" +

        "<span>آخر موعد: " +
        (o.deadline || "غير محدد") +
        "</span>" +

        "<span>" +
        USERS_ICON +
        (o.applicants || 0) +
        " متقدم</span>" +

      "</div>" +

    "</article>"

  );
}


/* عرض الفرص */

function render() {

  var list = OPPS.filter(function (o) {

    return (
      (state.tab === "all" || o.cat === state.tab) &&

      (!state.city || o.city === state.city) &&

      (!state.kind || o.cat === state.kind || o.kind === state.kind)
    );

  });


  if (list.length) {

    gridEl.innerHTML = list.map(card).join("");

  } else {

    gridEl.innerHTML =
      '<p class="empty">لا توجد فرص متاحة حالياً</p>';

  }
}


/* تغيير التبويب */

tabsEl.addEventListener("click", function (e) {

  var btn = e.target.closest(".tab");

  if (!btn) return;

  state.tab = btn.dataset.key;

  renderTabs();
  render();

});


/* تغيير المدينة */

cityEl.addEventListener("change", function () {

  state.city = cityEl.value;

  render();

});


/* تغيير نوع الفرصة */

kindEl.addEventListener("change", function () {

  state.kind = kindEl.value;

  render();

});


/* تشغيل الصفحة */

function initPage() {
renderTabs();

fillSelect(
  cityEl,
  "المدينة",
  Array.from(new Set((window.SAUDI_CITIES || []).concat(unique("city"))))
);

fillSelect(
  kindEl,
  "نوع الفرصة",
  [
    { value: "player", label: "لاعب" },
    { value: "creator", label: "صانع محتوى" },
    { value: "streamer", label: "ستريمر" }
  ]
);

render();
}

initPage();

/* بيانات Supabase: تجي من src/public-data.js (حدث nexo:public) */
function onPublic(f) {
  if (window.NEXO_DATA) f(window.NEXO_DATA);
  else window.addEventListener("nexo:public", function () { f(window.NEXO_DATA); }, { once: true });
}

onPublic(function (d) {
  OPPS = d.opps;
  initPage();
});

/* زر تسجيل الدخول: يفتح صفحة الدخول (المسار الوحيد، ثم MFA) */
(function () {
  var login = document.getElementById("loginBtn");
  if (login) {
    login.addEventListener("click", function () {
      window.location.href = "/auth.html#/login";
    });
  }
})();
