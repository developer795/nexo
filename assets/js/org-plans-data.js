/* =========================================
   NEXO - باقات الجهات (مشترك بين 16-plans و 17-payment)
   ========================================= */

/*
  الأسعار:
  price: null  → تظهر أصفار (000) مثل التصميم.
  حط رقم (مثل 249) وكل الحسابات تشتغل لحالها.
*/
window.ORG_PLANS = {
  m: { key: "m", name: "الشهرية", price: null, placeholder: "000", per: "شهرياً", months: 1 },
  y: { key: "y", name: "السنوية", price: null, placeholder: "0,000", per: "سنوياً", months: 12 }
};

window.ORG_VAT = 0.15;          // ضريبة القيمة المضافة
window.ORG_TRIAL_DAYS = 7;      // أيام التجربة المجانية
window.ORG_SAVE = 20;           // نسبة التوفير في الباقة السنوية

window.ORG_FEATURES = [
  "إنشاء حساب جهة رسمي موثق",
  "نشر الفرص الوظيفية والتدريبية",
  "إنشاء ونشر الفعاليات والبطولات",
  "التواصل مع اللاعبين وصناع المحتوى"
];

/* روابط الصفحات */
window.ORG_URLS = {
  back: "../page-15-org-path.html",
  plans: "../16-plans/plans.html",
  payment: "../17-payment/payment.html",
  done: "/auth.html#/login"
};

/* تنسيق الأرقام */
window.orgMoney = function (n) {
  return (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });
};

/* السعر أو الأصفار لو ما تحدد */
window.orgAmount = function (n, placeholder) {
  return n == null || isNaN(n) ? placeholder : window.orgMoney(n);
};
