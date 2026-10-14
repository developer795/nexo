/* =========================================
   NEXO - HOME PAGE
   ========================================= */


(function () {
  /* Login button */
  var login = document.getElementById("loginBtn");

  if (login) {

    login.addEventListener("click", function () {

      /*
        لاحقاً نربط هذا الزر
        بصفحة تسجيل الدخول الحقيقية.
      */

      alert("سيتم ربط صفحة تسجيل الدخول لاحقاً.");

    });

  }


  /* Reveal animation */
  if ("IntersectionObserver" in window) {

    var io = new IntersectionObserver(
      function (entries) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            io.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12
      }
    );


    document
      .querySelectorAll(".reveal")
      .forEach(function (element) {

        io.observe(element);

      });

  } else {

    document
      .querySelectorAll(".reveal")
      .forEach(function (element) {

        element.classList.add("visible");

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
   REAL DATA
   ========================================= */

/*
  مهم:

  حذفنا الحسابات التجريبية بالكامل.

  لاحقاً هذه البيانات ستأتي من Supabase:

  TALENTS = حسابات المواهب الحقيقية
  TEAMS   = حسابات الفرق والجهات الحقيقية
  OPPS    = الفرص الحقيقية المنشورة من الجهات

  حالياً نخليها فارغة.
*/

var TALENTS = [];

var TEAMS = [];

var OPPS = [];


/* =========================================
   NEXO PATHS
   هذه ليست حسابات مستخدمين لذلك تبقى.
   ========================================= */

var PATHS = [

  {
    title: "NEXO Studio",
    badge: "انتظار",
    live: false,
    img: "yellow",

    desc:
      "مسار متخصص في إنتاج وتطوير المشاريع الإبداعية في قطاع الألعاب، يشمل تطوير الألعاب والمانجا والكوميكس والمحتوى البصري."
  },


  {
    title: "NEXO Player",
    badge: "متاح",
    live: true,
    img: "green",

    desc:
      "مسار يرفع أداء اللاعب بالأرقام والتحليلات، ويفتح له أبواب الفرص المناسبة لمسيرته في الألعاب الإلكترونية."
  },


  {
    title: "NEXO Agency",
    badge: "قريبا",
    live: false,
    img: "orange",

    desc:
      "مسار متخصص في إدارة المواهب وتنظيم العلاقات والعقود وبناء الهوية التي تساعد اللاعبين وصنّاع المحتوى على النمو."
  }

];


/* =========================================
   INITIALS
   ========================================= */

function initials(name) {

  if (!name) {
    return "";
  }

  var parts = name
    .replace(
      /[^A-Za-z0-9\u0600-\u06FF ]/g,
      " "
    )
    .trim()
    .split(/\s+/);


  if (parts.length > 1) {

    return (
      parts[0][0] +
      parts[1][0]
    ).toUpperCase();

  }


  return parts[0]
    .slice(0, 2)
    .toUpperCase();

}


/* =========================================
   TALENTS
   ========================================= */

var talentsGrid =
  document.getElementById("talentsGrid");


if (talentsGrid) {

  if (TALENTS.length === 0) {

    /*
      ما نعرض أي حسابات وهمية.

      لما نربط Supabase،
      الحسابات الحقيقية ستظهر هنا.
    */

    talentsGrid.innerHTML = "";

  } else {

    talentsGrid.innerHTML =
      TALENTS.map(function (talent) {

        var chip = talent.seeking
          ? '<span class="chip chip-green">يبحث عن فريق</span>'
          : '<span class="chip chip-grey">منضم لفريق</span>';


        return (

          '<article class="card" ' +
          'onclick="location.href=\'../3-talents/talents.html\'">' +

            '<div class="c-cover ' +
            talent.cover +
            '">' +

              '<div class="c-logo" style="background:' +
              talent.color +
              '">' +

                initials(talent.name) +

              '</div>' +

            '</div>' +


            '<div class="c-body">' +

              '<h3>' +
              talent.name +
              '</h3>' +

              '<p class="role">' +
              talent.role +
              '</p>' +

              '<span class="tag">' +
              talent.game +
              '</span>' +

            '</div>' +


            '<div class="c-foot">' +

              '<span class="loc">' +
              PIN_ICON +
              (talent.city || "") +
              '</span>' +

              chip +

            '</div>' +

          '</article>'

        );

      }).join("");

  }

}


/* =========================================
   TEAMS
   ========================================= */

var teamsGrid =
  document.getElementById("teamsGrid");


if (teamsGrid) {

  if (TEAMS.length === 0) {

    /*
      لا توجد فرق أو جهات افتراضية.

      الجهات الحقيقية ستأتي
      من قاعدة البيانات لاحقاً.
    */

    teamsGrid.innerHTML = "";

  } else {

    teamsGrid.innerHTML =
      TEAMS.map(function (team) {

        var fs =
          team.logo &&
          team.logo.length > 3
            ? "11px"
            : "18px";


        return (

          '<article class="card" ' +
          'onclick="location.href=\'../4-teams/teams.html\'">' +

            '<div class="c-cover ' +
            team.cover +
            '">' +

              '<div class="c-logo" ' +
              'style="background:' +
              team.color +
              ';font-size:' +
              fs +
              '">' +

                team.logo +

              '</div>' +

            '</div>' +


            '<div class="c-body">' +

              '<h3>' +
              team.name +
              '</h3>' +

              '<p class="role">' +
              team.label +
              '</p>' +

            '</div>' +


            '<div class="c-foot">' +

              '<span class="loc">' +
              PIN_ICON +
              (team.city || "") +
              '</span>' +

              '<span class="chip chip-yellow">' +
              'لديه فرص للتقديم' +
              '</span>' +

            '</div>' +

          '</article>'

        );

      }).join("");

  }

}


/* =========================================
   OPPORTUNITIES
   ========================================= */

var oppsGrid =
  document.getElementById("oppsGrid");


if (oppsGrid) {

  if (OPPS.length === 0) {

    /*
      ما نعرض فرص وهمية.

      لاحقاً الفرص التي تنشرها الجهات
      ستظهر هنا من قاعدة البيانات.
    */

    oppsGrid.innerHTML = "";

  } else {

    oppsGrid.innerHTML =
      OPPS.map(function (opportunity) {

        var fs =
          opportunity.logo &&
          opportunity.logo.length > 3
            ? "10px"
            : "16px";


        return (

          '<article class="opp-card" ' +
          'onclick="location.href=\'../5-opportunities/opportunities.html\'">' +

            '<div class="opp-top">' +

              '<div class="opp-logo" ' +
              'style="background:' +
              opportunity.color +
              ';font-size:' +
              fs +
              '">' +

                opportunity.logo +

              '</div>' +


              '<div class="opp-info">' +

                '<h3>' +
                opportunity.title +
                '</h3>' +

                '<p class="org">' +
                opportunity.org +
                '</p>' +

                '<span class="tag">' +
                opportunity.tag +
                '</span>' +

              '</div>' +


              '<span class="chip chip-green opp-kind">' +

                opportunity.kind +

              '</span>' +

            '</div>' +


            '<div class="opp-meta">' +

              '<span>' +
              (opportunity.city || "") +
              '</span>' +

              '<span>' +
              (opportunity.deadline || "") +
              '</span>' +

              '<span>' +
              (opportunity.applicants || "") +
              '</span>' +

            '</div>' +

          '</article>'

        );

      }).join("");

  }

}


/* =========================================
   NEXO PATHS
   ========================================= */

var pathsTrack =
  document.getElementById("pathsTrack");


if (pathsTrack) {

  pathsTrack.innerHTML =
    PATHS.map(function (path) {

      return (

        '<article class="path-card">' +

          '<div class="path-top">' +

            '<span class="badge' +
            (path.live ? " live" : "") +
            '">' +

              path.badge +

            '</span>' +


            '<img ' +
            'src="../assets/avatar-' +
            path.img +
            '.png" ' +
            'alt="" />' +

          '</div>' +


          '<h3>' +
          path.title +
          '</h3>' +


          '<p>' +
          path.desc +
          '</p>' +

        '</article>'

      );

    }).join("");

}


/* =========================================
   PATHS CAROUSEL
   ========================================= */

var track =
  document.getElementById("pathsTrack");


function slide(direction) {

  if (!track) {
    return;
  }


  track.scrollBy({

    left:
      direction *
      (track.clientWidth * 0.7),

    behavior: "smooth"

  });

}


var pathNext =
  document.getElementById("pathNext");


var pathPrev =
  document.getElementById("pathPrev");


if (pathNext) {

  pathNext.addEventListener(
    "click",
    function () {

      slide(-1);

    }
  );

}


if (pathPrev) {

  pathPrev.addEventListener(
    "click",
    function () {

      slide(1);

    }
  );

}


/* =========================================
   STATS COUNT-UP
   ========================================= */

(function () {

  var elements =
    document.querySelectorAll("[data-count]");


  if (!("IntersectionObserver" in window)) {
    return;
  }


  var io =
    new IntersectionObserver(

      function (entries) {

        entries.forEach(
          function (entry) {

            if (!entry.isIntersecting) {
              return;
            }


            var element =
              entry.target;


            var end =
              Number(element.dataset.count);


            var startTime = null;


            function step(timestamp) {

              if (!startTime) {
                startTime = timestamp;
              }


              var progress =
                Math.min(
                  (timestamp - startTime) / 1100,
                  1
                );


              element.textContent =
                Math.round(
                  end * progress
                ).toLocaleString("en-US");


              if (progress < 1) {

                requestAnimationFrame(step);

              }

            }


            requestAnimationFrame(step);

            io.unobserve(element);

          }
        );

      },

      {
        threshold: 0.6
      }

    );


  elements.forEach(
    function (element) {

      io.observe(element);

    }
  );

})();