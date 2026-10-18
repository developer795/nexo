import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// لازم نلتقط الرابط قبل createClient، لأن Supabase يمسح الـ hash
// من الرابط بعد ما يعالجه، وبعدها ما نقدر نعرف إنه رابط استعادة.
const initialHash = new URLSearchParams(window.location.hash.substring(1))
const initialQuery = new URLSearchParams(window.location.search)

export const recoveryLinkInfo = {
  isRecovery:
    initialHash.get('type') === 'recovery' ||
    initialQuery.get('type') === 'recovery' ||
    initialQuery.has('code'),
  hasError:
    initialHash.has('error') ||
    initialHash.has('error_code') ||
    initialQuery.has('error')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
