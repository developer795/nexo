
import { supabase } from '../../src/lib/supabase.js'

async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout failed:', error)
    alert('تعذر تسجيل الخروج، حاولي مرة أخرى')
    return
  }

  window.location.replace('/auth.html#/login')
}

window.nexoLogout = logout
