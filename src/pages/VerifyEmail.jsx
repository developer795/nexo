
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import nexoLogo from '../assets/nexo-logo.png'
import './VerifyEmail.css'

function VerifyEmail() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const isArabic = i18n.language === 'ar'
  const email = searchParams.get('email') || ''
  const accountType = searchParams.get('type') || 'individual'

  const CODE_LENGTH = 8

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleCodeChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, '')
      .slice(0, CODE_LENGTH)

    setCode(value)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading || verified) return

    if (!email) {
      setError(
        isArabic
          ? 'البريد الإلكتروني غير موجود، ارجع لصفحة التسجيل'
          : 'Email is missing. Please return to registration.'
      )
      return
    }

    if (code.length !== CODE_LENGTH) {
      setError(
        isArabic
          ? 'أدخل رمز التحقق المكوّن من 8 أرقام'
          : 'Enter the 8-digit verification code'
      )
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { data, error: verifyError } =
        await supabase.auth.verifyOtp({
          email,
          token: code,
          type: 'signup'
        })

      if (verifyError) {
        console.error('Verification error:', verifyError.message)

        setError(
          isArabic
            ? 'رمز التحقق غير صحيح أو انتهت صلاحيته'
            : 'Invalid or expired verification code'
        )
        return
      }

      if (!data?.user?.email_confirmed_at) {
        setError(
          isArabic
            ? 'تعذر تأكيد البريد الإلكتروني، حاول مرة أخرى'
            : 'Could not confirm your email. Please try again.'
        )
        return
      }

      setVerified(true)

      setSuccess(
        isArabic
          ? 'تم التحقق من بريدك الإلكتروني بنجاح!'
          : 'Your email has been verified successfully!'
      )

      // تسجيل الخروج حتى ينتقل المستخدم لصفحة الدخول
      // ولا يبقى مسجلاً تلقائياً بعد التحقق
      await supabase.auth.signOut()

      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1200)

    } catch (err) {
      console.error('Verification error:', err)

      setError(
        isArabic
          ? 'حدث خطأ أثناء التحقق، حاول مرة أخرى'
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email || resending || loading || verified) return

    setResending(true)
    setError('')
    setSuccess('')

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email
      })

      if (resendError) {
        console.error('Resend error:', resendError.message)

        setError(
          isArabic
            ? 'تعذر إعادة إرسال الرمز، انتظر قليلًا وحاول مرة أخرى'
            : 'Could not resend the code. Wait a moment and try again.'
        )
        return
      }

      setCode('')

      setSuccess(
        isArabic
          ? 'تم طلب إرسال رمز تحقق جديد إلى بريدك الإلكتروني'
          : 'A new verification code has been requested'
      )

    } catch (err) {
      console.error('Resend error:', err)

      setError(
        isArabic
          ? 'حدث خطأ أثناء إعادة الإرسال'
          : 'Something went wrong while resending'
      )
    } finally {
      setResending(false)
    }
  }

  return (
    <main className="verify-page" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="verify-logo">
        <img src={nexoLogo} alt="NEXO" />
      </div>

      <div className="verify-language" dir="ltr">
        <button
          type="button"
          className={isArabic ? 'selected' : ''}
          onClick={() => i18n.changeLanguage('ar')}
        >
          العربية
        </button>

        <span>|</span>

        <button
          type="button"
          className={!isArabic ? 'selected' : ''}
          onClick={() => i18n.changeLanguage('en')}
        >
          English
        </button>
      </div>

      <section className="verify-card">
        <h1>
          {isArabic ? 'التحقق من إيميلك' : 'Verify your email'}
        </h1>

        <p className="verify-subtitle">
          {isArabic
            ? 'أدخل رمز التحقق المكوّن من 8 أرقام المرسل إلى بريدك الإلكتروني'
            : 'Enter the 8-digit verification code sent to your email'}
        </p>

        {email && (
          <p className="verify-email" dir="ltr">
            {email}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label>
            {isArabic ? 'أدخل رمز التحقق' : 'Enter verification code'}

            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={CODE_LENGTH}
              value={code}
              onChange={handleCodeChange}
              placeholder={isArabic ? '8 أرقام' : '8 digits'}
              dir="ltr"
              className={error ? 'input-error' : ''}
              disabled={loading || verified}
            />
          </label>

          {error && (
            <span className="verify-error" role="alert">
              {error}
            </span>
          )}

          {success && (
            <p
              role="status"
              style={{
                color: '#16a34a',
                textAlign: 'center'
              }}
            >
              {success}
            </p>
          )}

          <button
            type="button"
            className="verify-resend"
            onClick={handleResend}
            disabled={resending || loading || !email || verified}
          >
            {resending
              ? (isArabic ? 'جاري الإرسال...' : 'Sending...')
              : (isArabic ? 'إعادة إرسال الكود' : 'Resend code')}
          </button>

          <button
            type="submit"
            className="verify-submit"
            disabled={
              code.length !== CODE_LENGTH ||
              loading ||
              !email ||
              verified
            }
          >
            {loading
              ? (isArabic ? 'جاري التحقق...' : 'Verifying...')
              : (isArabic ? 'استمر' : 'Continue')}
          </button>
        </form>

        <button
          type="button"
          className="verify-back"
          onClick={() =>
            navigate(
              accountType === 'entity'
                ? '/entity-register'
                : '/register?type=individual'
            )
          }
        >
          {isArabic
            ? 'العودة إلى إنشاء الحساب'
            : 'Back to registration'}
        </button>
      </section>
    </main>
  )
}

export default VerifyEmail
