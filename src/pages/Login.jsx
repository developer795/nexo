
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './Login.css'
import nexoLogo from '../assets/nexo-logo.png'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [accountType, setAccountType] = useState('individual')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  // Forgot Password
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState('')
  const [resetSuccess, setResetSuccess] = useState('')

  // Login with Email and Password
  const handleLogin = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (!email.trim() || !password) {
      setError('يرجى تعبئة جميع الحقول المطلوبة')
      return
    }

    try {
      setLoading(true)

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        })

      if (loginError) {
        setError('تعذر تسجيل الدخول، تأكدي من البريد الإلكتروني وكلمة المرور')
        return
      }

      setSuccess('تم تسجيل الدخول بنجاح')
    } catch (err) {
      console.error(err)
      setError('حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  // Login with Google
  const handleGoogleLogin = async () => {
    setError('')
    setSuccess('')
    setGoogleLoading(true)

    try {
      const { error: googleError } =
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/login`
          }
        })

      if (googleError) {
        console.error('Google login error:', googleError)
        setError('تعذر تسجيل الدخول باستخدام Google')
        setGoogleLoading(false)
      }
    } catch (err) {
      console.error('Google login error:', err)
      setError('حدث خطأ أثناء الاتصال بـ Google')
      setGoogleLoading(false)
    }
  }

  // Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault()

    setResetError('')
    setResetSuccess('')

    const cleanEmail = resetEmail.trim()

    if (!cleanEmail) {
      setResetError('يرجى إدخال البريد الإلكتروني')
      return
    }

    try {
      setResetLoading(true)

      const { error: resetErrorResponse } =
        await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/reset-password`
        })

      if (resetErrorResponse) {
        console.error('Password reset error:', resetErrorResponse)
        setResetError('تعذر إرسال الطلب حاليًا، حاولي مرة أخرى لاحقًا')
        return
      }

      setResetSuccess(
        'إذا كان البريد مسجلًا، ستصلك رسالة لإعادة تعيين كلمة المرور'
      )
    } catch (err) {
      console.error(err)
      setResetError('حدث خطأ أثناء إرسال الطلب')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <main className="login-page" dir="rtl">

      {/* NEXO Logo */}
      <div className="nexo-logo">
        <img src={nexoLogo} alt="NEXO" />
      </div>

      {/* Login Card */}
      <section className="login-card">

        <div className="login-heading">
          <h1>مرحباً بعودتك</h1>
          <p>سجل دخولك للمتابعة إلى منصة نيكسو</p>
        </div>

        {/* Account Type */}
        <div className="account-type">

          <button
            type="button"
            className={`account-option ${
              accountType === 'individual' ? 'active' : ''
            }`}
            onClick={() => setAccountType('individual')}
          >
            <span className="account-icon">♙</span>

            <span className="account-info">
              <strong>فرد</strong>
              <small>لاعب، صانع محتوى، أو ستريمر</small>
            </span>
          </button>

          <button
            type="button"
            className={`account-option ${
              accountType === 'entity' ? 'active' : ''
            }`}
            onClick={() => setAccountType('entity')}
          >
            <span className="account-icon">▦</span>

            <span className="account-info">
              <strong>جهة</strong>
              <small>فريق، نادي، أو مؤسسة</small>
            </span>
          </button>

        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleLogin}>

          <div className="form-group">
            <label htmlFor="email">
              البريد الإلكتروني
            </label>

            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />

              <span className="input-icon">✉</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              كلمة المرور
            </label>

            <div className="input-wrapper">
              <input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <span className="input-icon">♙</span>
            </div>
          </div>

          {/* Forgot Password */}
          <button
            type="button"
            onClick={() => {
              setResetEmail(email)
              setResetError('')
              setResetSuccess('')
              setShowForgotPassword(true)
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#8b5cf6',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              alignSelf: 'flex-start',
              marginBottom: '12px'
            }}
          >
            نسيت كلمة المرور؟
          </button>

          {/* Error Message */}
          {error && (
            <p className="login-message error-message" role="alert">
              {error}
            </p>
          )}

          {/* Success Message */}
          {success && (
            <p className="login-message success-message" role="status">
              {success}
            </p>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={loading || googleLoading}
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>

        </form>

        {/* Divider */}
        <div className="divider">
          <span></span>
          <p>أو</p>
          <span></span>
        </div>

        {/* Google Login */}
        <button
          type="button"
          className="google-button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
        >
          <svg
            className="google-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"
            />

            <path
              fill="#34A853"
              d="M12 22c2.7 0 4.98-.9 6.64-2.36l-3.24-2.54c-.9.6-2.05.96-3.4.96-2.61 0-4.82-1.76-5.61-4.13H3.05v2.62A10 10 0 0 0 12 22Z"
            />

            <path
              fill="#FBBC05"
              d="M6.39 13.93A6.02 6.02 0 0 1 6.07 12c0-.67.12-1.32.32-1.93V7.45H3.05A10 10 0 0 0 2 12c0 1.61.39 3.14 1.05 4.55l3.34-2.62Z"
            />

            <path
              fill="#EA4335"
              d="M12 5.94c1.47 0 2.79.51 3.83 1.5l2.88-2.88A9.66 9.66 0 0 0 12 2a10 10 0 0 0-8.95 5.45l3.34 2.62C7.18 7.7 9.39 5.94 12 5.94Z"
            />
          </svg>

          <span>
            {googleLoading
              ? 'جاري الاتصال بـ Google...'
              : 'المتابعة باستخدام Google'}
          </span>
        </button>

      </section>

      {/* Create Account */}
      <p className="signup-text">
        ليس لديك حساب؟

        <button
          type="button"
          className="signup-link"
          onClick={() => navigate('/signup')}
        >
          إنشاء حساب
        </button>
      </p>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1000
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-title"
            style={{
              background: '#18152b',
              color: '#fff',
              padding: '30px',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '420px'
            }}
          >
            <h2 id="forgot-title">
              استعادة كلمة المرور
            </h2>

            <p style={{ margin: '12px 0 20px' }}>
              أدخلي بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور.
            </p>

            <form onSubmit={handleForgotPassword}>

              <div className="form-group">
                <label htmlFor="reset-email">
                  البريد الإلكتروني
                </label>

                <div className="input-wrapper">
                  <input
                    id="reset-email"
                    type="email"
                    required
                    placeholder="أدخل بريدك الإلكتروني"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    autoComplete="email"
                    dir="ltr"
                  />
                </div>
              </div>

              {resetError && (
                <p
                  className="login-message error-message"
                  role="alert"
                >
                  {resetError}
                </p>
              )}

              {resetSuccess && (
                <p
                  className="login-message success-message"
                  role="status"
                >
                  {resetSuccess}
                </p>
              )}

              <button
                type="submit"
                className="submit-button"
                disabled={resetLoading}
              >
                {resetLoading
                  ? 'جاري الإرسال...'
                  : 'إرسال رابط الاستعادة'}
              </button>

            </form>

            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              style={{
                marginTop: '16px',
                background: 'none',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              رجوع لتسجيل الدخول
            </button>
          </section>
        </div>
      )}

    </main>
  )
}

export default Login
