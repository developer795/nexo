/* =========================================
   NEXO - TALENTS PAGE
   ========================================= */


(function () {
  var login = document.getElementById("loginBtn");

  if (login) {

    login.addEventListener("click", function () {

      window.location.href = "/auth.html#/login";

    });

  }

})();


/* =========================================
   LOCATION ICON
   ========================================= */

var PIN_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>' +
  '<circle cx="12" cy="10" r="3"/>' +
  '</svg>';


/* =========================================
   TALENTS DATA
   ========================================= */

/*
  لا توجد بيانات تجريبية.

  لاحقاً عند ربط Supabase:
  TALENTS ستحتوي فقط على الحسابات
  الحقيقية المسجلة في NEXO.
*/

var TALENTS = [];


/* =========================================
   TALENT TYPES
   ========================================= */

var TABS = [

  {
    key: "all",
    label: "الكل"
  },

  {
    key: "player",
    label: "لاعبين"
  },

  {
    key: "creator",
    label: "صناع المحتوى"
  },

  {
    key: "streamer",
    label: "ستريمرز"
  }

];


/* =========================================
   FILTER STATE
   ========================================= */

var state = {

  tab: "all",

  city: "",

  status: ""

};


/* =========================================
   ELEMENTS
   ========================================= */

var tabsEl =
  document.getElementById("tabs");

var gridEl =
  document.getElementById("grid");

var cityEl =
  document.getElementById("cityFilter");

var statusEl =
  document.getElementById("statusFilter");


/* =========================================
   COUNT TALENTS
   ========================================= */

function countOf(key) {

  if (key === "all") {

    return TALENTS.length;

  }


  return TALENTS.filter(function (talent) {

    return talent.type === key;

  }).length;

}


/* =========================================
   RENDER TABS
   ========================================= */

function renderTabs() {

  if (!tabsEl) {
    return;
  }


  tabsEl.innerHTML =
    TABS.map(function (tab) {

      var label =
        tab.label +
        " (" +
        countOf(tab.key) +
        ")";


      return (
        '<button ' +
        'type="button" ' +
        'class="tab' +
        (state.tab === tab.key ? " active" : "") +
        '" ' +
        'data-key="' +
        tab.key +
        '">' +
        label +
        "</button>"
      );

    }).join("");

}


/* =========================================
   RENDER CITIES
   ========================================= */

function renderCities() {

  if (!cityEl) {
    return;
  }


  var cities = (window.SAUDI_CITIES || []).slice();


  TALENTS.forEach(function (talent) {

    if (
      talent.city &&
      cities.indexOf(talent.city) === -1
    ) {

      cities.push(talent.city);

    }

  });


  cityEl.innerHTML =
    '<option value="">المدينة</option>' +

    cities.map(function (city) {

      return (
        '<option value="' +
        city +
        '">' +
        city +
        "</option>"
      );

    }).join("");

}


/* =========================================
   CREATE INITIALS
   ========================================= */

function initials(name) {

  if (!name) {
    return "";
  }


  var clean =
    name
      .replace(
        /[^A-Za-z0-9\u0600-\u06FF ]/g,
        " "
      )
      .trim()
      .split(/\s+/);


  if (clean.length > 1) {

    return (
      clean[0][0] +
      clean[1][0]
    ).toUpperCase();

  }


  return clean[0]
    .slice(0, 2)
    .toUpperCase();

}


/* =========================================
   TALENT CARD
   ========================================= */

function card(talent, index) {

  var chip =
    talent.status === "seeking"

      ? '<span class="chip chip-green">يبحث عن فريق</span>'

      : '<span class="chip chip-grey">منضم لفريق</span>';


  return (

    '<article class="talent-card" ' +
    'style="animation-delay:' +
    (index * 40) +
    'ms">' +


      '<div class="t-cover ' +
      (talent.cover || "cover-green") +
      '">' +


        '<div class="t-avatar" ' +
        'style="background:' +
        (talent.color || "#1f1b55") +
        '">' +

          (talent.avatar ? '<img src="' + talent.avatar + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">' : initials(talent.name)) +

        "</div>" +


      "</div>" +


      '<div class="t-body">' +

        "<h3>" +
        talent.name +
        "</h3>" +

        '<p class="role">' +
        talent.role +
        "</p>" +

        '<span class="tag">' +
        talent.game +
        "</span>" +

      "</div>" +


      '<div class="t-foot">' +

        '<span class="loc">' +

          PIN_ICON +

          (talent.city || "") +

        "</span>" +

        chip +

      "</div>" +


    "</article>"

  );

}


/* =========================================
   RENDER TALENTS
   ========================================= */

function render() {

  if (!gridEl) {
    return;
  }


  var list =
    TALENTS.filter(function (talent) {

      var tabMatches =
        state.tab === "all" ||
        talent.type === state.tab;


      var cityMatches =
        !state.city ||
        talent.city === state.city;


      var statusMatches =
        !state.status ||
        talent.status === state.status;


      return (
        tabMatches &&
        cityMatches &&
        statusMatches
      );

    });


  if (list.length > 0) {

    gridEl.innerHTML =
      list.map(card).join("");

  } else {

    gridEl.innerHTML =
      '<p class="empty">' +
      'لا توجد مواهب مسجلة حالياً' +
      '</p>';

  }

}


/* =========================================
   TAB CLICK
   ========================================= */

if (tabsEl) {

  tabsEl.addEventListener(
    "click",
    function (event) {

      var button =
        event.target.closest(".tab");


      if (!button) {
        return;
      }


      state.tab =
        button.dataset.key;


      renderTabs();

      render();

    }
  );

}


/* =========================================
   CITY FILTER
   ========================================= */

if (cityEl) {

  cityEl.addEventListener(
    "change",
    function () {

      state.city =
        cityEl.value;


      render();

    }
  );

}


/* =========================================
   STATUS FILTER
   ========================================= */

if (statusEl) {

  statusEl.addEventListener(
    "change",
    function () {

      state.status =
        statusEl.value;


      render();

    }
  );

}


/* =========================================
   INITIAL RENDER
   ========================================= */

renderTabs();

renderCities();

render();

/* بيانات Supabase: تجي من src/public-data.js (حدث nexo:public) */
function onPublic(f) {
  if (window.NEXO_DATA) f(window.NEXO_DATA);
  else window.addEventListener("nexo:public", function () { f(window.NEXO_DATA); }, { once: true });
}

onPublic(function (d) {
  TALENTS = d.talents;
  renderTabs();
  renderCities();
  render();
});