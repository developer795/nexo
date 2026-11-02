document.addEventListener("DOMContentLoaded", () => {
  const toast = document.getElementById("toast");
  const planButtons = document.querySelectorAll(".plan-btn");
  const trialBtn = document.getElementById("trialBtn");
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelectorAll("#primary-navigation a");

  function setMenuOpen(isOpen) {
    navbar.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "إغلاق القائمة" : "فتح القائمة");
  }

  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!navbar.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.nexoToastTimer);
    window.nexoToastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  planButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const plan = button.dataset.plan;

      localStorage.setItem("nexoSelectedPlan", plan);

      if (plan === "yearly") {
        showToast("تم اختيار الباقة السنوية — سيتم الانتقال لخطوة التسجيل.");
      } else {
        showToast("تم اختيار الباقة الشهرية — سيتم الانتقال لخطوة التسجيل.");
      }
    });
  });

  trialBtn.addEventListener("click", () => {
    localStorage.setItem("nexoTrialStarted", "true");
    showToast("تم بدء الفترة التجريبية المجانية لمدة 7 أيام.");
  });

  // إبراز الباقة المحفوظة إذا عاد المستخدم للصفحة
  const savedPlan = localStorage.getItem("nexoSelectedPlan");

  if (savedPlan) {
    const selectedButton = document.querySelector(
      `.plan-btn[data-plan="${savedPlan}"]`
    );

    if (selectedButton) {
      selectedButton.setAttribute("aria-label", "الباقة المحددة حاليًا");
    }
  }
});
