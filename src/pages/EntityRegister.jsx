
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import nexoLogo from '../assets/nexo-logo.png'
import './EntityRegister.css'

function EntityRegister() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordChecks = [
    {
      label: '8 أحرف على الأقل',
      valid: form.password.length >= 8,
    },
    {
      label: 'حرف إنجليزي كبير',
      valid: /[A-Z]/.test(form.password),
    },
    {
      label: 'حرف إنجليزي صغير',
      valid: /[a-z]/.test(form.password),
    },
    {
      label: 'رقم واحد على الأقل',
      valid: /[0-9]/.test(form.password),
    },
    {
      label: 'رمز خاص واحد على الأقل',
      valid: /[^A-Za-z0-9]/.test(form.password),
    },
  ]

  const passwordIsValid = passwordChecks.every(
    (item) => item.valid
  )

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))

    setServerError('')
  }

  const validateForm = () => {
    const newErrors = {}

    const email = form.email.trim()
    const phone = form.phone.replace(/[\s-]/g, '')

    if (!email) {
      newErrors.email = 'البريد الإلكتروني مطلوب'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'أدخل بريدًا إلكترونيًا صحيحًا'
    }

    if (!phone) {
      newErrors.phone = 'رقم الجوال مطلوب'
    } else if (!/^(?:\+966|00966|966|0)?5\d{8}$/.test(phone)) {
      newErrors.phone = 'أدخل رقم جوال سعودي صحيح'
    }

    if (!form.password) {
      newErrors.password = 'كلمة المرور مطلوبة'
    } else if (!passwordIsValid) {
      newErrors.password = 'كلمة المرور لا تحقق جميع الشروط'
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين'
    }

    if (!form.acceptTerms) {
      newErrors.acceptTerms = 'يجب الموافقة على الشروط والأحكام'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading || !validateForm()) return

    setLoading(true)
    setServerError('')

    try {
      const email = form.email.trim().toLowerCase()

      const { error } = await supabase.auth.signUp({
        email,
        password: form.password,
        options: {
          data: {
            account_type: 'entity',
            phone: form.phone.trim(),
          },
        },
      })

      if (error) {
        console.error('Entity registration error:', error.message)

        if (
          error.message
            .toLowerCase()
            .includes('already registered')
        ) {
          setServerError(
            'هذا البريد الإلكتروني مسجل مسبقًا. جربي تسجيل الدخول.'
          )
        } else {
          setServerError(
            'تعذر إنشاء الحساب. تأكدي من البيانات وحاولي مرة أخرى.'
          )
        }

        return
      }

      const params = new URLSearchParams({
        email,
        type: 'entity',
      })

      navigate(`/verify-email?${params.toString()}`)
    } catch (err) {
      console.error('Registration error:', err)

      setServerError(
        'حدث خطأ أثناء الاتصال بالخادم. حاولي مرة أخرى.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="entity-register-page" dir="rtl">
      {/* Logo */}
      <div className="entity-register-logo">
        <img src={nexoLogo} alt="NEXO" />
      </div>

      {/* Card */}
      <section className="entity-register-card">
        <h1>إنشاء حساب جهة</h1>

        <p className="entity-register-subtitle">
          أنشئ حساب جهتك وانضم إلى منظومة NEXO
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <label htmlFor="entity-email">
            البريد الإلكتروني
            <input
              id="entity-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="أدخل البريد الإلكتروني"
              autoComplete="email"
              dir="ltr"
              className={errors.email ? 'input-error' : ''}
            />
          </label>

          {errors.email && (
            <span className="entity-field-error">
              {errors.email}
            </span>
          )}

          {/* Phone */}
          <label htmlFor="entity-phone">
            رقم الجوال
            <input
              id="entity-phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="05XXXXXXXX"
              autoComplete="tel"
              dir="ltr"
              className={errors.phone ? 'input-error' : ''}
            />
          </label>

          {errors.phone && (
            <span className="entity-field-error">
              {errors.phone}
            </span>
          )}

          {/* Password */}
          <label htmlFor="entity-password">
            كلمة المرور
            <input
              id="entity-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="أدخل كلمة المرور"
              autoComplete="new-password"
              dir="ltr"
              className={errors.password ? 'input-error' : ''}
            />
          </label>

          {/* Password Requirements */}
          <div className="entity-password-rules">
            <p className="entity-rules-title">
              يجب أن تحتوي كلمة المرور على:
            </p>

            <ul>
              {passwordChecks.map((item) => (
                <li
                  key={item.label}
                  className={item.valid ? 'valid' : ''}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {errors.password && (
            <span className="entity-field-error">
              {errors.password}
            </span>
          )}

          {/* Confirm Password */}
          <label htmlFor="entity-confirm-password">
            تأكيد كلمة المرور
            <input
              id="entity-confirm-password"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="أعد إدخال كلمة المرور"
              autoComplete="new-password"
              dir="ltr"
              className={
                errors.confirmPassword ? 'input-error' : ''
              }
            />
          </label>

          {errors.confirmPassword && (
            <span className="entity-field-error">
              {errors.confirmPassword}
            </span>
          )}

          {/* Terms */}
          <label className="entity-terms">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={form.acceptTerms}
              onChange={handleChange}
            />

            <span>
              أوافق على الشروط والأحكام وسياسة الخصوصية
            </span>
          </label>

          {errors.acceptTerms && (
            <span className="entity-field-error">
              {errors.acceptTerms}
            </span>
          )}

          {/* Server Error */}
          {serverError && (
            <div
              className="entity-server-error"
              role="alert"
            >
              {serverError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="entity-register-submit"
            disabled={loading}
          >
            {loading
              ? 'جاري إنشاء الحساب...'
              : 'إنشاء حساب جهة'}
          </button>
        </form>

        {/* Login */}
        <div className="entity-login-link">
          <span>لديك حساب بالفعل؟</span>

          <button
            type="button"
            onClick={() => navigate('/login')}
          >
            تسجيل الدخول
          </button>
        </div>
      </section>
    </main>
  )
}

export default EntityRegister
