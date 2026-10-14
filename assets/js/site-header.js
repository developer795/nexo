(function () {
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("navLinks");
  var header = document.querySelector(".header");
  var mobileMenu = window.matchMedia("(max-width: 900px)");

  if (toggle && nav) {
    function setMenuOpen(open) {
      nav.classList.toggle("open", open);
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }

    toggle.addEventListener("click", function () {
      setMenuOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a") && mobileMenu.matches) {
        setMenuOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (
        mobileMenu.matches &&
        toggle.getAttribute("aria-expanded") === "true" &&
        !header.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    });

    mobileMenu.addEventListener("change", function (event) {
      if (!event.matches) {
        setMenuOpen(false);
      }
    });
  }

  if (header) {
    function updateHeaderShadow() {
      header.classList.toggle("scrolled", window.scrollY > 4);
    }

    window.addEventListener("scroll", updateHeaderShadow, { passive: true });
    updateHeaderShadow();
  }
})();
