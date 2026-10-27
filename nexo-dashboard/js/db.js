// =====================================================================
// NEXO — طبقة البيانات (Supabase)
// كل صفحات الـ Dashboard تقرأ وتكتب من هنا بدل localStorage.
// يتم تحميلها من auth-guard.js بعد التحقق من الدخول وMFA،
// وتنكشف للسكربتات العادية عبر window.nexoDB
// =====================================================================
import { supabase } from '../../src/lib/supabase.js'

const BUCKET = 'media'
const OT = ['عقد عمل', 'تدريب تعاوني', 'تدريب مهني', 'حملة اعلانية', 'مشاركة في البطولة']

// ---------- تحويل الصفوف إلى شكل البيانات اللي تستخدمه الواجهة ----------
const talentFromRow = (r) => ({
  kind: 'talent', id: r.id, user_id: r.user_id, n: r.name, ph: r.avatar_url || '',
  cv: r.cover_url || '', role: r.role || '', g: r.game || '', city: r.city || '',
  s: r.status || '', bio: r.bio || '',
})
const teamFromRow = (r) => ({
  kind: 'team', id: r.id, user_id: r.user_id, n: r.name, ph: r.logo_url || '',
  cv: r.cover_url || '', type: r.type || '', sub: r.description || '', city: r.city || '',
  bio: r.bio || '',
})
const postFromRow = (r) => ({
  id: r.id, author_id: r.author_id, n: r.author_name, r: r.author_label || '',
  a: r.author_avatar || '', t: r.body, im: r.image_url || '', at: r.created_at,
  kind: r.author_kind, pid: r.author_profile_id,
})
const oppFromRow = (r, applied) => ({
  id: r.id, team_id: r.team_id, created_by: r.created_by, title: r.title, org: r.org,
  ph: r.logo_url || '', type: r.type, aud: r.audience, g: r.game || '', city: r.city || '',
  due: r.deadline || '', d: r.details, n: r.applicants_count || 0, ap: applied ? 1 : 0,
})

const talentToRow = (o) => clean({
  name: o.n, role: o.role, game: o.g, city: o.city, status: o.s, bio: o.bio,
  avatar_url: o.ph, cover_url: o.cv,
})
const teamToRow = (o) => clean({
  name: o.n, type: o.type, description: o.sub, city: o.city, bio: o.bio,
  logo_url: o.ph, cover_url: o.cv,
})
// يشيل القيم الفاضية عشان التعديل ما يمسح بيانات موجودة
function clean(o) {
  const r = {}
  for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== null && v !== '') r[k] = v
  return r
}

function fail(error, msg) {
  if (error) {
    console.error(msg, error)
    throw new Error(msg)
  }
}

export function createDB(user) {
  const uid = user.id
  const kind = user.user_metadata?.account_type === 'entity' ? 'team' : 'talent'
  const myTable = kind === 'team' ? 'teams' : 'talents'

  // ---------- الصور ----------
  async function upload(blob) {
    if (!blob || !blob.size) return ''
    const ext = blob.type === 'image/png' ? 'png' : 'jpg'
    const path = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
      contentType: blob.type || 'image/jpeg', upsert: false,
    })
    fail(error, 'تعذر رفع الصورة')
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
  }

  // ---------- ملفي ----------
  async function getMe() {
    const { data, error } = await supabase.from(myTable).select('*').eq('user_id', uid).maybeSingle()
    fail(error, 'تعذر تحميل ملفك')
    return data ? (kind === 'team' ? teamFromRow(data) : talentFromRow(data)) : { kind }
  }

  async function saveMe(o) {
    const row = kind === 'team' ? teamToRow(o) : talentToRow(o)
    const { data: existing } = await supabase.from(myTable).select('id').eq('user_id', uid).maybeSingle()
    if (existing) {
      const { error } = await supabase.from(myTable).update(row).eq('id', existing.id)
      fail(error, 'تعذر حفظ الملف')
    } else {
      if (!row.name) row.name = user.email?.split('@')[0] || 'عضو نيكسو'
      const { error } = await supabase.from(myTable).insert({ ...row, user_id: uid })
      fail(error, 'تعذر حفظ الملف')
    }
  }

  // ---------- القوائم ----------
  async function listTalents() {
    const { data, error } = await supabase.from('talents').select('*').order('created_at', { ascending: false })
    fail(error, 'تعذر تحميل المواهب')
    return data.map(talentFromRow)
  }
  async function listTeams() {
    const { data, error } = await supabase.from('teams').select('*').order('created_at', { ascending: false })
    fail(error, 'تعذر تحميل الأندية والجهات')
    return data.map(teamFromRow)
  }
  async function listPosts(authorId) {
    let q = supabase.from('post_feed').select('*').order('created_at', { ascending: false }).limit(100)
    if (authorId) q = q.eq('author_id', authorId)
    const { data, error } = await q
    fail(error, 'تعذر تحميل المنشورات')
    return data.map(postFromRow)
  }
  async function listOpps(filter = {}) {
    let q = supabase.from('opportunities').select('*').order('created_at', { ascending: false })
    if (filter.created_by) q = q.eq('created_by', filter.created_by)
    if (filter.team_id) q = q.eq('team_id', filter.team_id)
    const [{ data, error }, { data: mine }] = await Promise.all([
      q,
      supabase.from('applications').select('opportunity_id').eq('user_id', uid),
    ])
    fail(error, 'تعذر تحميل الفرص')
    const applied = new Set((mine || []).map((a) => a.opportunity_id))
    return data.map((r) => oppFromRow(r, applied.has(r.id)))
  }

  async function loadAll() {
    const [me, posts, talents, teams, opps] = await Promise.all([
      getMe(), listPosts(), listTalents(), listTeams(), listOpps(),
    ])
    return { me, posts, talents, teams, opps }
  }

  // ---------- الإضافة ----------
  async function addPost({ t, im }) {
    const { error } = await supabase.from('posts').insert({ author_id: uid, body: t, image_url: im || null })
    fail(error, 'تعذر نشر المنشور')
  }
  async function addTalent(o) {
    const { error } = await supabase.from('talents').insert({ ...talentToRow(o), created_by: uid })
    fail(error, 'تعذر إضافة الموهبة')
  }
  async function addTeam(o) {
    const { error } = await supabase.from('teams').insert({ ...teamToRow(o), created_by: uid })
    fail(error, 'تعذر إضافة النادي أو الجهة')
  }
  async function addOpp(o) {
    let team_id = null
    if (kind === 'team') {
      const { data } = await supabase.from('teams').select('id').eq('user_id', uid).maybeSingle()
      team_id = data?.id || null
    }
    const row = {
      created_by: uid, team_id, title: o.title, org: o.org, logo_url: o.ph || null,
      type: OT.includes(o.type) ? o.type : OT[0], audience: o.aud, game: o.g || null,
      city: o.city || null, deadline: o.due || null, details: o.d,
    }
    const { data, error } = await supabase.from('opportunities').insert(row).select('id').single()
    fail(error, 'تعذر نشر الفرصة')
    return data.id
  }
  async function apply(id) {
    const { error } = await supabase.from('applications').insert({ opportunity_id: id, user_id: uid })
    if (error && error.code !== '23505') fail(error, 'تعذر التقديم على الفرصة') // 23505 = سبق التقديم
  }

  // ---------- ملف شخص آخر (صفحات الزائر) ----------
  async function getProfile(type, id) {
    const table = type === 'team' ? 'teams' : 'talents'
    const { data, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle()
    fail(error, 'تعذر تحميل الملف')
    if (!data) return null
    return type === 'team' ? teamFromRow(data) : talentFromRow(data)
  }

  // ---------- مزامنة الأونبوردنق ----------
  // صفحات الأونبوردنق تشتغل قبل تسجيل الدخول، فتحفظ الإجابات مؤقتًا في
  // localStorage. أول ما يدخل المستخدم الـ Dashboard ننقلها لقاعدة البيانات.
  async function syncOnboarding() {
    let A = null, old = null
    try { A = JSON.parse(localStorage.getItem('nexo_onboarding')) } catch { /* empty */ }
    try { old = JSON.parse(localStorage.getItem('nexo_p16_20_v3'))?.me } catch { /* empty */ }
    if (!A && !(old && old.n)) return

    const { data: existing } = await supabase.from(myTable).select('id').eq('user_id', uid).maybeSingle()
    if (!existing) {
      if (A && A.type === 'org' && kind === 'team') {
        const type = { 'فريق': 'نادي', 'راعِ': 'جهة', 'مقدم خدمة': 'مقدم خدمة' }[A.orgPath] || 'جهة'
        await saveMe({ n: (A.org || '').trim(), type, city: A.city })
      } else if (A && A.type === 'ind' && kind === 'talent') {
        await saveMe({
          n: `${A.fn || ''} ${A.ln || ''}`.trim(),
          role: A.path, city: A.city,
          s: A.status === 'منضم لفريق' ? 'منضم لفريق' : 'يبحث عن فريق',
        })
      } else if (old && old.n) {
        // بيانات قديمة من نسخة localStorage: ننقل الملف الشخصي مع الصور
        const toBlob = async (u) => (u && u.startsWith('data:') ? (await fetch(u)).blob() : null)
        const [ph, cv] = await Promise.all([toBlob(old.ph), toBlob(old.cv)])
        await saveMe({ ...old, ph: await upload(ph), cv: await upload(cv) })
      }
    }
    try {
      localStorage.removeItem('nexo_onboarding')
      localStorage.removeItem('nexo_p16_20_v3')
    } catch { /* empty */ }
  }

  return {
    uid, kind, user, upload, getMe, saveMe, loadAll, listTalents, listTeams, listPosts,
    listOpps, addPost, addTalent, addTeam, addOpp, apply, getProfile, syncOnboarding,
  }
}
