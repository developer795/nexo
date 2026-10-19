import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import ResetPassword from './pages/ResetPassword.jsx'
import './index.css'
import './i18n.js'

function RecoveryPage() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [valid, setValid] = useState(false)

  useEffect(() => {
    let active = true

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY' && active) {
          sessionStorage.setItem('nexo_password_recovery', 'true')
          setValid(true)
          setReady(true)
        }
      })

    const check = async () => {
      const { data } = await supabase.auth.getSession()

      if (!active) return

      const confirmed =
        sessionStorage.getItem('nexo_password_recovery') === 'true'

      setValid(Boolean(data.session && confirmed))
      setReady(true)
    }

    check()

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  if (!ready) {
    return <p>جاري التحقق من رابط الاستعادة...</p>
  }

  if (!valid) {
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