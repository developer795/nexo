
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

    // 4. إظهار Dashboard بعد نجاح جميع الفحوصات
    document.documentElement.style.visibility = 'visible'

  } catch (error) {
    console.error('Authentication check failed:', error)
    redirectTo(LOGIN_URL)
  }
}

checkAuthentication()
