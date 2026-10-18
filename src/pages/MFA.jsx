
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const DASHBOARD_URL = '/nexo-dashboard/dash-home.html'

export default function MFA() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [mode, setMode] = useState('setup')
  const [factorId, setFactorId] = useState('')
  const [pendingFactorId, setPendingFactorId] = useState('')
  const [qr, setQr] = useState('')
  const [secret, setSecret] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function initialize() {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser()

        if (userError || !userData.user) {
          navigate('/login', { replace: true })
          return
        }

        const { data: aal, error: aalError } =
          await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

        if (aalError) throw aalError

        if (aal.currentLevel === 'aal2') {
          window.location.replace(DASHBOARD_URL)
          return
        }

        const { data, error: factorsError } =
          await supabase.auth.mfa.listFactors()

        if (factorsError) throw factorsError

        const verified = data.totp?.find(
          factor => factor.status === 'verified'
        )

        if (cancelled) return

        if (verified) {
          setFactorId(verified.id)
          setMode('verify')
          return
        }

        const pending = data.all?.find(
          factor =>
            factor.factor_type === 'totp' &&
            factor.status === 'unverified'
        )

        if (pending) {
          setPendingFactorId(pending.id)
          setMode('pending')
        } else {
          setMode('setup')
        }
      } catch (err) {
        console.error('MFA initialization error:', err)

        if (!cancelled) {
          setError('تعذر تحميل إعدادات المصادقة الثنائية.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    initialize()

    return () => {
      cancelled = true
    }
  }, [navigate])

  async function startEnrollment() {
    if (busy) return

    setBusy(true)
    setError('')

    try {
      const { data, error: enrollError } =
        await supabase.auth.mfa.enroll({
          factorType: 'totp',
          friendlyName: 'NEXO Authenticator'
        })

      if (enrollError) throw enrollError

      setFactorId(data.id)
      setQr(data.totp.qr_code)
      setSecret(data.totp.secret)
      setCode('')
      setMode('enroll')
    } catch (err) {
      console.error('MFA enrollment error:', err)
      setError(
        'تعذر إنشاء رمز QR. قد يكون هناك عامل مصادقة سابق بنفس الاسم.'
      )
    } finally {
      setBusy(false)
    }
  }

  async function restartEnrollment() {
    if (busy || !pendingFactorId) return

    setBusy(true)
    setError('')

    try {
      // إزالة عامل غير مكتمل فقط بعد موافقة المستخدم
      const { error: unenrollError } =
        await supabase.auth.mfa.unenroll({
          factorId: pendingFactorId
        })

      if (unenrollError) throw unenrollError

      setPendingFactorId('')
      setFactorId('')
      setQr('')
      setSecret('')
      setCode('')
      setMode('setup')
    } catch (err) {
      console.error('MFA restart error:', err)
      setError(
        'تعذر إعادة إعداد المصادقة. لا تحذفي أي عامل من Supabase يدويًا.'
      )
    } finally {
      setBusy(false)
    }
  }

  async function handleVerify(event) {
    event.preventDefault()

    if (busy || !factorId || !/^\d{6}$/.test(code)) return

    setBusy(true)
    setError('')

    try {
      const { data: challenge, error: challengeError } =
        await supabase.auth.mfa.challenge({
          factorId
        })

      if (challengeError) throw challengeError

      const { error: verifyError } =
        await supabase.auth.mfa.verify({
          factorId,
          challengeId: challenge.id,
          code
        })

      if (verifyError) throw verifyError

      const { data: aal, error: aalError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

      if (aalError || aal.currentLevel !== 'aal2') {
        throw new Error('MFA assurance level is not aal2')
      }

      window.location.replace(DASHBOARD_URL)
    } catch (err) {
      console.error('MFA verification error:', err)
      setError(
        'تعذر التحقق من الرمز. تأكدي من الرمز وحاولي مرة أخرى.'
      )
      setCode('')
    } finally {
      setBusy(false)
    }
  }

  async function handleCancel() {
    setBusy(true)
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  if (loading) {
    return (
      <main dir="rtl" style={styles.page}>
        جاري تحميل إعدادات التحقق...
      </main>
    )
  }

  return (
    <main dir="rtl" style={styles.page}>
      <section style={styles.card}>
        <h1>التحقق بخطوتين</h1>

        <p>
          لحماية حسابك في NEXO باستخدام Google Authenticator.
        </p>

        {mode === 'setup' && (
          <div>
            <p>
              اربطي حسابك بتطبيق المصادقة لإكمال تسجيل الدخول.
            </p>

            <button
              type="button"
              onClick={startEnrollment}
              disabled={busy}
              style={styles.button}
            >
              {busy
                ? 'جاري إنشاء رمز QR...'
                : 'ربط Google Authenticator'}
            </button>
          </div>
        )}

        {mode === 'pending' && (
          <div>
            <p>
              يوجد إعداد سابق للمصادقة الثنائية لم يكتمل.
              يمكنك بدء ربط جديد بدل الإعداد السابق.
            </p>

            <button
              type="button"
              onClick={restartEnrollment}
              disabled={busy}
              style={styles.button}
            >
              {busy
                ? 'جاري إعادة الإعداد...'
                : 'إعادة إعداد المصادقة'}
            </button>

            <p style={{ fontSize: 12, color: '#ddd' }}>
              هذا الخيار يلغي عامل المصادقة غير المكتمل
              فقط، وليس عاملًا تم تفعيله.
            </p>
          </div>
        )}

        {mode === 'enroll' && qr && (
          <div>
            <p>
              افتحي Google Authenticator وامسحي رمز QR:
            </p>

            <img
              src={qr}
              alt="رمز ربط تطبيق المصادقة"
              style={{
                width: 190,
                maxWidth: '100%',
                background: 'white',
                padding: 8,
                borderRadius: 8
              }}
            />

            <p>أو أدخلي مفتاح الربط يدويًا:</p>

            <code style={{ overflowWrap: 'anywhere' }}>
              {secret}
            </code>

            <p style={{ fontSize: 12 }}>
              لا تشاركين رمز QR أو مفتاح الربط مع أحد.
            </p>
          </div>
        )}

        {mode === 'verify' && (
          <p>
            افتحي Google Authenticator وأدخلي
            الرمز المكوّن من 6 أرقام.
          </p>
        )}

        {(mode === 'verify' || mode === 'enroll') && (
          <form onSubmit={handleVerify} style={styles.form}>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="رمز التحقق (6 أرقام)"
              value={code}
              maxLength={6}
              onChange={e =>
                setCode(
                  e.target.value.replace(/\D/g, '').slice(0, 6)
                )
              }
              style={styles.input}
              aria-label="رمز المصادقة"
            />

            <button
              type="submit"
              disabled={
                busy ||
                code.length !== 6 ||
                !factorId
              }
              style={styles.button}
            >
              {busy ? 'جاري التحقق...' : 'تحقق واستمر'}
            </button>
          </form>
        )}

        {error && (
          <p role="alert" style={{ color: '#ff7777' }}>
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleCancel}
          disabled={busy}
          style={styles.cancel}
        >
          إلغاء وتسجيل الخروج
        </button>
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#111027',
    color: 'white',
    display: 'grid',
    placeItems: 'center',
    padding: 20,
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    background: '#211c46',
    borderRadius: 18,
    padding: 30,
    width: '100%',
    maxWidth: 430,
    textAlign: 'center'
  },
  form: {
    display: 'grid',
    gap: 14,
    marginTop: 20
  },
  input: {
    padding: 14,
    borderRadius: 8,
    border: '1px solid #777',
    textAlign: 'center',
    fontSize: 18
  },
  button: {
    padding: 14,
    border: 0,
    borderRadius: 8,
    background: '#a8e66d',
    color: '#151515',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    marginTop: 12
  },
  cancel: {
    marginTop: 18,
    background: 'transparent',
    border: 0,
    color: '#ddd',
    cursor: 'pointer'
  }
}
