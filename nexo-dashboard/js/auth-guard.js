
import { supabase } from '../../src/lib/supabase.js'

const LOGIN_URL = '/auth.html#/login'
const MFA_URL = '/auth.html#/mfa'

function redirectTo(url) {
  window.location.replace(url)
}

async function checkAuthentication() {
  try {
    // 1. التحقق من وجود مستخدم مسجل دخوله
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      redirectTo(LOGIN_URL)
      return
    }

    // 2. التحقق من مستوى المصادقة الثنائية
    const { data: aal, error: aalError } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

    if (aalError || !aal) {
      console.error('Unable to check MFA level:', aalError)
      redirectTo(LOGIN_URL)
      return
    }

    // 3. منع الدخول قبل إكمال رمز Google Authenticator
    if (aal.currentLevel !== 'aal2') {
      redirectTo(MFA_URL)
      return
    }

    // 3.5 رابط "ملفي" يعتمد على نوع الحساب (فرد أو جهة)
    const profileUrl =
      data.user.user_metadata?.account_type === 'entity'
        ? 'dash-entity-profile.html'
        : 'dash-talent-profile.html'

    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-profile]')
      if (!a) return
      e.preventDefault()
      window.location.href = profileUrl
    })

    // 4. إظهار Dashboard بعد نجاح جميع الفحوصات
    document.documentElement.style.visibility = 'visible'

  } catch (error) {
    console.error('Authentication check failed:', error)
    redirectTo(LOGIN_URL)
  }
}

checkAuthentication()
