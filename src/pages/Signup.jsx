
import { useNavigate } from 'react-router-dom'
import nexoLogo from '../assets/nexo-logo.png'
import './Signup.css'

function Signup() {
  const navigate = useNavigate()

  return (
    <main className="signup-page" dir="rtl">

      {/* NEXO Logo */}
      <div className="signup-logo">
        <img src={nexoLogo} alt="NEXO" />
      </div>

      {/* Content */}
      <div className="signup-content">

        <h1 className="signup-title">
          اختر مسارك في عالم الرياضات الإلكترونية
        </h1>

        <div className="signup-options">

          {/* Individual */}
          <section className="signup-option">

            <div className="signup-tags">
              <span>لاعب</span>
              <span>صانع محتوى</span>
              <span>ستريمر</span>
            </div>

            <h2>أبحث عن فرصة</h2>

            <p>
              اكتشف الفرص، اعرض مهاراتك، وتواصل مع الجهات
              في منظومة الرياضات الإلكترونية.
            </p>

            <button
              type="button"
              className="signup-action"
              onClick={() => navigate('/register?type=individual')}
            >
              <span aria-hidden="true">♙</span>
              إنشاء حسابك
            </button>

          </section>

          {/* Entity */}
          <section className="signup-option">

            <div className="signup-tags">
              <span>الجهات</span>
            </div>

            <h2>أبحث عن موهبة</h2>

            <p>
              اكتشف المواهب، اعرض الفرص، وابنِ علاقاتك
              داخل منظومة الرياضات الإلكترونية.
            </p>

            <button
              type="button"
              className="signup-action"
              onClick={() => navigate('/entity-register')}
            >
              <span aria-hidden="true">▦</span>
              إنشاء حساب جهة
            </button>

          </section>

        </div>
      </div>
    </main>
  )
}

export default Signup
