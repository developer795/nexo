
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import nexoLogo from '../assets/nexo-logo.png'
import './Register.css'

function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    phone: '',
    day: '',
    month: '',
    year: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const currentYear = new Date().getFullYear()

  const passwordChecks = [
    { label: '8 أحرف على الأقل', valid: form.password.length >= 8 },
    { label: 'حرف إنجليزي كبير', valid: /[A-Z]/.test(form.password) },
    { label: 'حرف إنجليزي صغير', valid: /[a-z]/.test(form.password) },
    { label: 'رقم واحد على الأقل', valid: /[0-9]/.test(form.password) },
    { label: 'رمز خاص واحد على الأقل', valid: /[^A-Za-z0-9]/.test(form.password) },
  ]

  const passwordIsValid = passwordChecks.every((item) => item.valid)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
      ...(name === 'day' || name === 'month' || name === 'year'
        ? { birthDate: '' }
        : {}),
    }))

    setServerError('')
  }

  const getBirthDate = () => {
    const day = Number(form.day)
    const month = Number(form.month)
    const year = Number(form.year)

    if (!day || !month || !year) return null

    const date = new Date(year, month - 1, day)
    const today = new Date()

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day ||
      date > today ||
      year < 1900
    ) {
      return null
    }

    return [
      String(year).padStart(4, '0'),
      String(month).padStart(2, '0'),
      String(day).padStart(2, '0'),
    ].join('-')
  }

  const validateForm = () => {
    const nextErrors = {}
    const email = form.email.trim()
    const phone = form.phone.replace(/[\s-]/g, '')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'أدخلي بريدًا إلكترونيًا صحيحًا'
    }

    if (!/^(?:\+966|00966|966|0)?5\d{8}$/.test(phone)) {
      nextErrors.phone = 'أدخلي رقم جوال سعودي صحيح'
    }

    if (!getBirthDate()) {
      nextErrors.birthDate = 'اختاري تاريخ ميلاد صحيح'
    }

    if (!passwordIsValid) {
      nextErrors.password = 'كلمة المرور لا تحقق جميع الشروط'
    }

    if (form.password !== form.confirmPassword || !form.confirmPassword) {
      nextErrors.confirmPassword = 'كلمتا المرور غير متطابقتين'
    }

    if (!form.acceptTerms) {
      nextErrors.acceptTerms = 'يجب الموافقة على الشروط والأحكام'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
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
            account_type: 'individual',
            phone: form.phone.trim(),
            birth_date: getBirthDate(),
          },
        },
      })

      if (error) {
        console.error('Registration error:', error.message)
        setServerError(
          error.message.toLowerCase().includes('already registered')
            ? 'هذا البريد الإلكتروني مسجل مسبقًا'
            : 'تعذر إنشاء الحساب، حاولي مرة أخرى'
        )
        return
      }

      const params = new URLSearchParams({
        email,
        type: 'individual',
      })

      navigate(`/verify-email?${params.toString()}`)
    } catch (error) {
      console.error(error)
      setServerError('تعذر الاتصال بالخادم، حاولي مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="register-page" dir="rtl">
      <div className="register-logo">
        <img src={nexoLogo} alt="NEXO" />
      </div>

      <section className="register-card">
        <h1>إنشاء حساب فرد</h1>
        <p className="register-subtitle">
          أنشئ حسابك وانضم إلى مجتمع NEXO
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="register-email">
            البريد الإلكتروني
            <input
              id="register-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="أدخل البريد الإلكتروني"
              autoComplete="email"
              dir="ltr"
              className={errors.email ? 'input-error' : ''}
            />
          </label>
          {errors.email && (
            <span className="register-field-error">{errors.email}</span>
          )}

          <label htmlFor="register-phone">
            رقم الجوال
            <input
              id="register-phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="05XXXXXXXX"
              autoComplete="tel"
              dir="ltr"
              className={errors.phone ? 'input-error' : ''}
            />
          </label>
          {errors.phone && (
            <span className="register-field-error">{errors.phone}</span>
          )}

          <div className="register-birth-field">
            <span className="register-field-label">تاريخ الميلاد</span>

            <div className="register-birth-grid">
              <label>
                اليوم
                <select
                  name="day"
                  value={form.day}
                  onChange={handleChange}
                  aria-label="اليوم"
                >
                  <option value="">اليوم</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </label>

              <label>
                الشهر
                <select
                  name="month"
                  value={form.month}
                  onChange={handleChange}
                  aria-label="الشهر"
                >
                  <option value="">الشهر</option>
                  {[
                    'يناير', 'فبراير', 'مارس', 'أبريل',
                    'مايو', 'يونيو', 'يوليو', 'أغسطس',
                    'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
                  ].map((month, index) => (
                    <option key={month} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                السنة
                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  aria-label="السنة"
                >
                  <option value="">السنة</option>
                  {Array.from(
                    { length: currentYear - 1899 },
                    (_, i) => currentYear - i
                  ).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </label>
            </div>

            {errors.birthDate && (
              <span className="register-field-error">
                {errors.birthDate}
              </span>
            )}
          </div>

          <label htmlFor="register-password">
            كلمة المرور
            <input
              id="register-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="أدخل كلمة المرور"
              autoComplete="new-password"
              dir="ltr"
              className={errors.password ? 'input-error' : ''}
            />
          </label>

          <div className="password-requirements">
            <p>يجب أن تحتوي كلمة المرور على:</p>
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
            <span className="register-field-error">{errors.password}</span>
          )}

          <label htmlFor="register-confirm-password">
            تأكيد كلمة المرور
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="أعد إدخال كلمة المرور"
              autoComplete="new-password"
              dir="ltr"
              className={errors.confirmPassword ? 'input-error' : ''}
            />
          </label>

          {errors.confirmPassword && (
            <span className="register-field-error">
              {errors.confirmPassword}
            </span>
          )}

          <label className="register-terms">
            <input
              name="acceptTerms"
              type="checkbox"
              checked={form.acceptTerms}
              onChange={handleChange}
            />
            <span>أوافق على الشروط والأحكام وسياسة الخصوصية</span>
          </label>

          {errors.acceptTerms && (
            <span className="register-field-error">
              {errors.acceptTerms}
            </span>
          )}

          {serverError && (
            <div className="register-server-error" role="alert">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            className="register-submit"
            disabled={loading}
          >
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب فرد'}
          </button>
        </form>

        <div className="register-login">
          <span>لديك حساب بالفعل؟</span>
          <button type="button" onClick={() => navigate('/login')}>
            تسجيل الدخول
          </button>
        </div>
      </section>
    </main>
  )
}

export default Register
