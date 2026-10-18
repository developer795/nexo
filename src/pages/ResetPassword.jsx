
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import nexoLogo from '../assets/nexo-logo.png'
import './Login.css'

function ResetPassword() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [canReset, setCanReset] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true

    const checkRecoverySession = async () => {
      try {
        // Supabase قد يعالج رابط الاستعادة عند تحميل الصفحة
        const { data, error: sessionError } =
          await supabase.auth.getSession()

        if (!active) return

        if (sessionError) {
          setError('تعذر التحقق من رابط الاستعادة')
        } else if (data.session) {
          // وجود جلسة وحده لا يكفي لإثبات أن الرابط رابط استعادة
          const isRecoveryLink =
  sessionStorage.getItem('nexo_password_recovery') === 'true' &&
  window.location.pathname === '/recovery.html'

          if (isRecoveryLink) {
            setCanReset(true)
          } else {
            setError('رابط الاستعادة غير صالح أو انتهت صلاحيته')
          }
        } else {
          setError('رابط الاستعادة غير صالح أو انتهت صلاحيته')
        }
      } catch {
        if (active) {
          setError('تعذر التحقق من رابط الاستعادة')
        }
      } finally {
        if (active) setChecking(false)
      }
    }

    const { data: authListener } =
      supabase.auth.onAuthStateChange((event) => {
        if (!active) return

        if (event === 'PASSWORD_RECOVERY') {
          setCanReset(true)
          setError('')
          setChecking(false)
        }
      })

    checkRecoverySession()

    return () => {
      active = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleResetPassword = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (!canReset || completed) {
      setError('افتح رابط الاستعادة المرسل إلى بريدك أولًا')
      return
    }

    if (password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      return
    }

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } =
        await supabase.auth.updateUser({
          password
        })

      if (updateError) {
        setError('تعذر تغيير كلمة المرور، حاولي مرة أخرى')
        return
      }

      setCompleted(true)
      setCanReset(false)
      sessionStorage.removeItem('nexo_password_recovery')
      setSuccess('تم تغيير كلمة المرور بنجاح!')

      await supabase.auth.signOut()

    } catch (err) {
      console.error(err)
      setError('حدث خطأ أثناء تغيير كلمة المرور')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page" dir="rtl">
      <div className="nexo-logo">
        <img src={nexoLogo} alt="NEXO" />
      </div>

      <section className="login-card">
        <div className="login-heading">
          <h1>إعادة تعيين كلمة المرور</h1>
          <p>اختاري كلمة مرور جديدة لحسابك في NEXO</p>
        </div>

        {checking ? (
          <p>جاري التحقق من رابط الاستعادة...</p>
        ) : completed ? (
          <>
            <p className="login-message success-message" role="status">
              {success}
            </p>

            <button
              type="button"
              className="submit-button"
              onClick={() => navigate('/login', { replace: true })}
            >
              العودة لتسجيل الدخول
            </button>
          </>
        ) : canReset ? (
          <form
            className="login-form"
            onSubmit={handleResetPassword}
          >
            <div className="form-group">
              <label htmlFor="new-password">
                كلمة المرور الجديدة
              </label>

              <div className="input-wrapper">
                <input
                  id="new-password"
                  type="password"
                  placeholder="أدخلي كلمة المرور الجديدة"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">
                تأكيد كلمة المرور
              </label>

              <div className="input-wrapper">
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="أعيدي كتابة كلمة المرور"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="login-message error-message" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading
                ? 'جاري تغيير كلمة المرور...'
                : 'حفظ كلمة المرور الجديدة'}
            </button>
          </form>
        ) : (
          <>
            <p className="login-message error-message" role="alert">
              {error || 'رابط الاستعادة غير صالح'}
            </p>

            <button
              type="button"
              className="submit-button"
              onClick={() => navigate('/login')}
            >
              العودة لتسجيل الدخول
            </button>
          </>
        )}
      </section>
    </main>
  )
}

export default ResetPassword
