import './App.css'

import avatarYellow from './assets/avatars/avatar-yellow.png'
import avatarGreen from './assets/avatars/avatar-green.png'
import avatarOrange from './assets/avatars/avatar-orange.png'

const talents = [
  { name: 'Twis Nwpo', role: 'لاعب', game: 'Rocket League' },
  { name: 'GoatMoh', role: 'لاعب', game: 'EA SPORTS FC' },
  { name: 'AbuMakkah', role: 'لاعب', game: 'EA SPORTS FC' },
  { name: 'THE1OS', role: 'لاعب', game: 'EA SPORTS FC' },
]

const teams = [
  { name: 'فالكونز', type: 'فريق رياضات إلكترونية', letter: 'F' },
  { name: 'نافس', type: 'فريق رياضات إلكترونية', letter: 'N' },
  { name: 'القادسية', type: 'نادي رياضي', letter: 'Q' },
  { name: 'NEXO', type: 'جهة رياضات إلكترونية', letter: 'N' },
]

const opportunities = [
  {
    title: 'صانع محتوى',
    company: 'نافس',
    location: 'الرياض',
    type: 'دوام كامل',
    letter: 'N',
  },
  {
    title: 'Valorant محترف',
    company: 'فريق رياضات إلكترونية',
    location: 'الرياض',
    type: 'دوام كامل',
    letter: 'V',
  },
]

const nexoPaths = [
  {
    title: 'NEXO Studio',
    description:
      'مسار لصناع المحتوى والمبدعين في مجال الرياضات الإلكترونية.',
    image: avatarYellow,
  },
  {
    title: 'NEXO Player',
    description:
      'مسار يساعد اللاعبين على تطوير مهاراتهم وبناء مسيرتهم الاحترافية.',
    image: avatarGreen,
  },
  {
    title: 'NEXO Talent',
    description:
      'مسار لاكتشاف المواهب وربطها بالفرص المناسبة داخل القطاع.',
    image: avatarOrange,
  },
]

function App() {
  return (
    <div className="app" dir="rtl">

      {/* NAVBAR */}
      <header className="header">
        <div className="container navbar">

          <a className="logo" href="#home">
            NEXO
          </a>

          <nav className="nav-links">
            <a className="active" href="#home">الرئيسية</a>
            <a href="#paths">المسارات</a>
            <a href="#teams">الفرق والجهات</a>
            <a href="#talents">المواهب</a>
            <a href="#about">عن نيسكو</a>
          </nav>

          <button className="main-button login-button">
            تسجيل الدخول
          </button>

        </div>
      </header>


      <main>

        {/* HERO */}
        <section className="hero container" id="home">

          <div className="hero-content">

            <h1>
              مكانك في مجتمع الرياضات
              <br />
              الإلكترونية يبدأ معنا
            </h1>

            <p>
              اكتشف المواهب والفرص، وابدأ مسارك المهني
              <br />
              في مجتمع الرياضات الإلكترونية.
            </p>

            <button className="main-button hero-button">
              ابدأ الآن
            </button>

          </div>


          <div className="hero-visual">

            <div className="hero-line green-line">
              <img
                src={avatarYellow}
                className="character character-yellow"
                alt=""
              />
            </div>

            <div className="hero-line blue-line">

              <img
                src={avatarGreen}
                className="character character-green"
                alt=""
              />

              <img
                src={avatarOrange}
                className="character character-orange"
                alt=""
              />

            </div>

            <div className="hero-line yellow-line" />

          </div>

        </section>


        {/* STATS */}
        <section className="stats container">

          <div className="stat">
            <span className="stat-symbol">♙</span>
            <strong>200</strong>
            <span>موهبة</span>
          </div>

          <div className="stat">
            <span className="stat-symbol">▦</span>
            <strong>85</strong>
            <span>فريق وجهة</span>
          </div>

          <div className="stat">
            <span className="stat-symbol">◉</span>
            <strong>1,200</strong>
            <span>فرصة</span>
          </div>

        </section>


        {/* CHOOSE PATH */}
        <section className="section container" id="paths">

          <div className="center-title">
            <h2>اختر مسارك في عالم الرياضات الإلكترونية</h2>
          </div>

          <div className="choice-grid">

            <article className="choice-card">

              <span className="green-tag">للفرق والجهات</span>

              <h3>ابحث عن موهبة</h3>

              <p>
                اكتشف المواهب وابحث عن الشخص المناسب
                لفريقك أو مشروعك في مجال الرياضات الإلكترونية.
              </p>

              <button className="dark-card-button">
                <span>اكتشف المواهب</span>
                <span>←</span>
              </button>

            </article>


            <article className="choice-card">

              <div className="tags">
                <span className="green-tag">وظائف</span>
                <span className="green-tag">فرق</span>
                <span className="green-tag">تطوير</span>
              </div>

              <h3>ابحث عن فرصة</h3>

              <p>
                اكتشف الفرص المهنية والتعليمية وابدأ
                خطوتك القادمة في عالم الرياضات الإلكترونية.
              </p>

              <button className="dark-card-button">
                <span>تصفح الفرص</span>
                <span>←</span>
              </button>

            </article>

          </div>

        </section>


        {/* TALENTS */}
        <section className="section container" id="talents">

          <SectionHeader
            title="المواهب المتنوعة"
            subtitle="تعرف على مواهب مجتمع الرياضات الإلكترونية"
          />

          <a className="view-all" href="#talents">
            عرض الكل
            <span>‹</span>
          </a>

          <div className="four-grid">

            {talents.map((talent, index) => (
              <article className="talent-card" key={talent.name}>

                <div className={`talent-photo talent-photo-${index + 1}`}>
                  <div className="photo-placeholder">
                    {talent.name.charAt(0)}
                  </div>
                </div>

                <div className="card-content">

                  <h3>{talent.name}</h3>

                  <p>{talent.role}</p>

                  <span className="game-tag">
                    {talent.game}
                  </span>

                </div>

              </article>
            ))}

          </div>

        </section>


        {/* TEAMS */}
        <section className="section container" id="teams">

          <SectionHeader
            title="فرق وجهات"
            subtitle="استكشف الفرق والأندية والجهات في مجتمع الرياضات الإلكترونية"
          />

          <a className="view-all" href="#teams">
            عرض الكل
            <span>‹</span>
          </a>

          <div className="four-grid">

            {teams.map((team, index) => (
              <article className="team-card" key={`${team.name}-${index}`}>

                <div className={`team-cover team-cover-${index + 1}`}>

                  <div className="team-logo-placeholder">
                    {team.letter}
                  </div>

                </div>

                <div className="card-content">

                  <h3>{team.name}</h3>

                  <p>{team.type}</p>

                  <span className="small-status">
                    فريق
                  </span>

                </div>

              </article>
            ))}

          </div>

        </section>


        {/* OPPORTUNITIES */}
        <section className="section container">

          <SectionHeader
            title="أحدث الفرص"
            subtitle="فرص جديدة للانضمام والتطور في مجال الرياضات الإلكترونية"
          />

          <a className="view-all" href="#opportunities">
            عرض الكل
            <span>‹</span>
          </a>

          <div className="opportunities" id="opportunities">

            {opportunities.map((item) => (
              <article className="opportunity-card" key={item.title}>

                <div className="opportunity-logo">
                  {item.letter}
                </div>

                <div className="opportunity-text">
                  <h3>{item.title}</h3>
                  <p>{item.company}</p>
                </div>

                <span className="job-type">
                  {item.type}
                </span>

                <div className="opportunity-details">
                  <span>{item.location}</span>
                  <span>•</span>
                  <span>منذ 3 أيام</span>
                </div>

              </article>
            ))}

          </div>

        </section>


        {/* NEXO PATHS */}
        <section className="section paths-section">

          <div className="container">

            <div className="center-title">
              <h2>مسارات نيسكو</h2>
            </div>

            <div className="nexo-paths">

              {nexoPaths.map((path) => (
                <article className="nexo-path-card" key={path.title}>

                  <span className="path-pill">
                    اكتشف
                  </span>

                  <img
                    src={path.image}
                    alt=""
                    className="path-character"
                  />

                  <h3>{path.title}</h3>

                  <p>{path.description}</p>

                  <button className="path-arrow">
                    ‹
                  </button>

                </article>
              ))}

            </div>

          </div>

        </section>

      </main>


      {/* FOOTER */}
      <footer className="footer" id="about">

        <div className="container footer-content">

          <div className="footer-main-logo">
            NEXO
          </div>

          <div className="footer-column">
            <h4>عن المنصة</h4>
            <a href="#about">عن نيسكو</a>
          </div>

          <div className="footer-column">
            <h4>الخدمات</h4>
            <a href="#talents">المواهب</a>
            <a href="#teams">الفرق والجهات</a>
            <a href="#paths">المسارات</a>
          </div>

          <div className="social-links">
            <span>𝕏</span>
            <span>♪</span>
            <span>◎</span>
            <span>in</span>
          </div>

        </div>

        <div className="container footer-bottom">
          <span>© 2026 NEXO. جميع الحقوق محفوظة</span>
          <span>Nexo.team1@gmail.com</span>
        </div>

      </footer>

    </div>
  )
}


function SectionHeader({ title, subtitle }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  )
}

export default App