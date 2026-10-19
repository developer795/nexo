import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// لازم نقرأ الرابط قبل createClient، لأن Supabase يعالج الـ hash
// ويمسحه فورًا، وحدث PASSWORD_RECOVERY يطلع قبل ما React يشتغل.
const hash = new URLSearchParams(window.location.hash.substring(1))
const query = new URLSearchParams(window.location.search)
const isRecoveryPath = ['/recovery', '/recovery.html'].includes(
  window.location.pathname
)
const hasLinkError =
  hash.has('error') || hash.has('error_code') || query.has('error')

if (
  isRecoveryPath &&
  !hasLinkError &&
  (hash.get('type') === 'recovery' || query.get('type') === 'recovery')
) {
  sessionStorage.setItem('nexo_password_recovery', 'true')
} else if (isRecoveryPath && hasLinkError) {
  sessionStorage.removeItem('nexo_password_recovery')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// احتياط: لو الحدث وصل بطريقة ثانية
supabase.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') {
    sessionStorage.setItem('nexo_password_recovery', 'true')
  }
})
