/* =========================================
   NEXO - 16 خطط الاشتراك (الجهات)
   البيانات من ../assets/js/org-plans-data.js
   ========================================= */


/* =========================================
   ICONS
   ========================================= */

var CHECK_ICON =
  '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">' +
  '<circle cx="12" cy="12" r="12" fill="#E0FAE0"/>' +
  '<path d="M7.5 12.3l3 3 6-6.3" fill="none" stroke="#03BB43" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
  "</svg>";


/* =========================================
   PLAN CARD
   ========================================= */

function planCard(plan) {

  var best = plan.key === "y";
  var monthly = ORG_PLANS.m;

  var perMonth = orgAmount(
    plan.price == null ? null : plan.price / plan.months,
    "000"
  );

  var link = ORG_URLS.payment + "?plan=" + plan.key;

  return (
    '<article class="plan' + (best ? " best" : "") + '">' +

      '<div class="plan-tag">' +
        (best ? "وفّر " + ORG_SAVE + "%" : "الأكثر شيوعاً") +
      "</div>" +

      '<div class="plan-body">' +

        "<h2>الباقة " + plan.name + "</h2>" +

        '<p class="plan-sub">' +
          (best
            ? "وفّر ما يعادل شهرين مجاناً مع الدفع السنوي"
            : "اشترك شهرياً بدون التزام طويل المدى") +
        "</p>" +

        '<div class="price">' +
          "<b>" + orgAmount(plan.price, plan.placeholder) + "</b>" +
          '<span class="cur">ر.س</span>' +
          '<span class="per">/ ' + plan.per + "</span>" +
        "</div>" +

        (best
          ? '<span class="save">' + perMonth + " ر.س / شهرياً — بدلاً من " +
            orgAmount(monthly.price, monthly.placeholder) + " ر.س</span>"
          : "") +

        '<ul class="feats">' +
          ORG_FEATURES.map(function (f) {
            return "<li>" + CHECK_ICON + f + "</li>";
          }).join("") +
        "</ul>" +

        '<div class="plan-actions">' +
          '<a class="btn' + (best ? " btn-green" : "") + '" href="' + link + '&mode=pay">' +
            "اشترك الآن" + (best ? " ووفّر " + ORG_SAVE + "%" : "") +
          "</a>" +
          '<a class="btn btn-outline" href="' + link + '&mode=trial">جرّب مجانًا</a>' +
        "</div>" +

      "</div>" +
    "</article>"
  );
}


/* =========================================
   RENDER
   ========================================= */

var plansEl = document.getElementById("plans");

if (plansEl) {
  // السنوية يمين والشهرية يسار (مثل التصميم)
  plansEl.innerHTML = planCard(ORG_PLANS.y) + planCard(ORG_PLANS.m);
}

var backEl = document.getElementById("back");

if (backEl) {
  backEl.href = ORG_URLS.back;
}
