/* ---- About page behavior ---- */
(function () {
  var login = document.getElementById("loginBtn");
  if (login) {
    login.addEventListener("click", function () {
      window.location.href = "/auth.html#/login";
    });
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
  }
})();

var PIN_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';

/* ---- About page ---- */
document.getElementById("ctaBtn").addEventListener("click", function () {
  // غيّر الرابط إلى صفحة إنشاء الحساب عند توفرها
  window.location.href = "../3-talents/talents.html";
});
