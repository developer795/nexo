import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { supabase } from './lib/supabase'
import ResetPassword from './pages/ResetPassword.jsx'
import './index.css'
import './i18n.js'

const FLAG = 'nexo_password_recovery'

// نقرأ token_hash مرة وحدة عند تحميل الصفحة
const initialParams = new URLSearchParams(window.location.search)
const TOKEN_HASH = initialParams.get('token_hash')
const LINK_TYPE = initialParams.get('type')

function RecoveryPage() {
  // checking | confirm | verifying | ready | invalid
  const [stage, setStage] = useState(
    TOKEN_HASH && LINK_TYPE === 'recovery' ? 'confirm' : 'checking'
  )

  // الروابط القديمة (بدون token_hash): نفس المنطق السابق
  useEffect(() => {
    if (TOKEN_HASH) return

    let active = true

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' && active) {
        sessionStorage.setItem(FLAG, 'true')
        setStage('ready')
      }
    })

    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (!active) return
      const confirmed = sessionStorage.getItem(FLAG) === 'true'
      setStage(data.session && confirmed ? 'ready' : 'invalid')
    }

    check()

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  // التحقق الفعلي يصير فقط عند ضغط الزر، فالفاحص الآلي ما يقدر يحرق الرابط
  const handleConfirm = async () => {
    setStage('verifying')

    const { error } = await supabase.auth.verifyOtp({
      token_hash: TOKEN_HASH,
      type: 'recovery'
    })

    if (error) {
      console.error('verifyOtp error:', error)
      setStage('invalid')
      return
    }

    sessionStorage.setItem(FLAG, 'true')
    // نشيل token_hash من الرابط
    window.history.replaceState({}, '', window.location.pathname)
    setStage('ready')
  }

  if (stage === 'checking' || stage === 'verifying') {
    return <p>جاري التحقق من رابط الاستعادة...</p>
  }

  if (stage === 'confirm') {
    return (
      <main className="login-page" dir="rtl">
        <section className="login-card">
          <div className="login-heading">
            <h1>إعادة تعيين كلمة المرور</h1>
            <p>اضغطي المتابعة لاختيار كلمة مرور جديدة لحسابك في NEXO</p>
          </div>

          <button
            type="button"
            className="submit-button"
            onClick={handleConfirm}
          >
            متابعة
          </button>
        </section>
      </main>
    )
  }

  if (stage === 'invalid') {
    return (
      <main dir="rtl">
        <p>رابط الاستعادة غير صالح أو انتهت صلاحيته.</p>
        <a href="/auth.html#/login">العودة لتسجيل الدخول</a>
      </main>
    )
  }

  return <ResetPassword />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <RecoveryPage />
    </BrowserRouter>
  </StrictMode>
)
