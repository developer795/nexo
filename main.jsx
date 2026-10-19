import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './i18n.js'
import ResetPassword from './pages/ResetPassword.jsx'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'

import App from './App.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Register from './pages/Register.jsx'
import EntityRegister from './pages/EntityRegister.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'

import MFA from './pages/MFA.jsx'


// رجوع المستخدم من Google: نقرأ الرابط قبل ما Supabase يمسحه
const isOAuthReturn =
  window.location.hash.includes('access_token=') ||
  new URLSearchParams(window.location.search).has('code')

function RecoveryRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // بعد دخول Google: نفس مسار الدخول بكلمة المرور (MFA أولًا)
      if (
        isOAuthReturn &&
        session &&
        (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')
      ) {
        navigate('/mfa', { replace: true })
      }

      if (event === 'PASSWORD_RECOVERY') {
        sessionStorage.setItem('nexo_password_recovery', 'true')
        navigate('/reset-password', { replace: true })
      }

      if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem('nexo_password_recovery')
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <RecoveryRedirect />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Register />} />
        <Route path="/entity-register" element={<EntityRegister />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
<Route path="/mfa" element={<MFA />} />

        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
  </HashRouter>
  </StrictMode>,
)