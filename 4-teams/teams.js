// ==========================================
// NEXO - Teams & Organizations
// ==========================================

const grid = document.getElementById("grid");
const tabs = document.getElementById("tabs");
const cityFilter = document.getElementById("cityFilter");

// ==========================================
// الحسابات المسجلة
// ==========================================

function getTeams() {
  return JSON.parse(localStorage.getItem("nexoTeams")) || [];
}

// ==========================================
// إنشاء الفلاتر
// ==========================================

function setupFilters() {

  // التبويبات
  if (tabs) {
    tabs.innerHTML = `
      <button class="tab active" data-type="all">
        الكل
      </button>

      <button class="tab" data-type="team">
        الأندية
      </button>

      <button class="tab" data-type="provider">
        مقدمي الخدمة
      </button>

      <button class="tab" data-type="organization">
        الجهات
      </button>
    `;
  }

  // المدن
  if (cityFilter) {

    const teams = getTeams();

    const cities = [
      ...new Set([
        ...(window.SAUDI_CITIES || []),
        ...teams.map(team => team.city).filter(Boolean)
      ])
    ];

    cityFilter.innerHTML = `
      <option value="all" selected>المدينة</option>

      ${cities.map(city => `
        <option value="${city}">
          ${city}
        </option>
      `).join("")}
    `;
  }
}

// ==========================================
// رسالة عند عدم وجود حسابات
// ==========================================

function showEmptyState() {

  grid.innerHTML = `
    <div class="empty-state">
      <p role="status">لا توجد فرق مسجلة حالياً</p>
    </div>
  `;
}

// ==========================================
// إنشاء بطاقة الفريق
// ==========================================

function createTeamCard(team) {

  const card = document.createElement("div");

  card.className = "team-card";

  const firstLetter = team.name
    ? team.name.charAt(0).toUpperCase()
    : "N";

  card.innerHTML = `
    
    <div 
      class="card-cover"
      style="background: ${team.color || "#5424c7"};"
    ></div>

    <div class="team-logo">
      ${
        team.logo
          ? `<img src="${team.logo}" alt="${team.name}">`
          : `<span>${firstLetter}</span>`
      }
    </div>

    <div class="card-content">

      <h3>${team.name}</h3>

      <p>
        ${team.description || "فريق في الرياضات الإلكترونية"}
      </p>

      <div class="card-info">

        <span class="city">
          ${team.city || "الرياض"}
        </span>

        ${
          team.hasOpportunity
            ? `
              <span class="opportunity">
                لديه فرص للتقديم
              </span>
            `
            : ""
        }

      </div>

    </div>
  `;

  return card;
}

// ==========================================
// عرض جميع الفرق
// ==========================================

function renderTeams(teamsToShow = null) {

  const teams = teamsToShow || getTeams();

  grid.innerHTML = "";

  if (teams.length === 0) {
    showEmptyState();
    return;
  }

  teams.forEach(team => {
    grid.appendChild(createTeamCard(team));
  });
}

// ==========================================
// فلترة المدينة
// ==========================================

function filterByCity() {

  const selectedCity = cityFilter.value;

  const teams = getTeams();

  if (selectedCity === "all") {
    renderTeams();
    return;
  }

  const filteredTeams = teams.filter(
    team => team.city === selectedCity
  );

  renderTeams(filteredTeams);
}

// ==========================================
// تشغيل فلتر المدينة
// ==========================================

if (cityFilter) {

  cityFilter.addEventListener("change", filterByCity);

}

// ==========================================
// فلترة التبويبات
// ==========================================

if (tabs) {

  tabs.addEventListener("click", function(event) {

    const clickedTab = event.target.closest(".tab");

    if (!clickedTab) return;

    // إزالة active من جميع التبويبات
    document
      .querySelectorAll(".tab")
      .forEach(tab => {
        tab.classList.remove("active");
      });

    // إضافة active للتبويب المختار
    clickedTab.classList.add("active");

    const type = clickedTab.dataset.type;

    const teams = getTeams();

    // الكل
    if (type === "all") {
      renderTeams();
      return;
    }

    // تصفية حسب نوع الحساب
    const filteredTeams = teams.filter(team => {

      return team.type === type;

    });

    renderTeams(filteredTeams);
  });

}

// ==========================================
// تشغيل الصفحة
// ==========================================

setupFilters();

renderTeams();

/* زر تسجيل الدخول: يفتح صفحة الدخول (المسار الوحيد، ثم MFA) */
(function () {
  var login = document.getElementById("loginBtn");
  if (login) {
    login.addEventListener("click", function () {
      window.location.href = "/auth.html#/login";
    });
  }
})();
