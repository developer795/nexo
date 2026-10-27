// =====================================================================
// NEXO — بيانات الصفحات العامة (الرئيسية، المواهب، الفرق، الفرص)
// يقرأ من Supabase (قراءة فقط) ويحوّل البيانات للشكل اللي تتوقعه
// سكربتات الصفحات، ثم يرسل حدث nexo:public مع البيانات في window.NEXO_DATA
// =====================================================================
import { supabase } from './lib/supabase.js'

// كل النصوص تُهرَّب هنا لأن سكربتات الصفحات تكتبها مباشرة في innerHTML
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

const ROLE_KEY = { 'لاعب': 'player', 'صانع محتوى': 'creator', 'ستريمر': 'streamer' }
const TEAM_KEY = { 'نادي': 'team', 'مقدم خدمة': 'provider', 'جهة': 'organization' }
const COVERS = ['cover-green', 'cover-purple', 'cover-blue', 'cover-tan', 'cover-red', 'cover-dark']
const COLORS = ['#1f1b55', '#5424c7', '#542400', '#0b6b4f', '#7a1f3d', '#2f4f8f']
const pick = (arr, id) => arr[[...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0) % arr.length]
const safeUrl = (u) => (/^https:\/\/[^\s"'()<>]+$/.test(String(u || '')) ? esc(u) : '')
const short = (name) => esc(String(name || 'NEXO').trim().slice(0, 4))

function mapTalent(r) {
  return {
    id: r.id,
    name: esc(r.name),
    role: esc(r.role || ''),
    type: ROLE_KEY[r.role] || '',
    game: esc(r.game || ''),
    city: esc(r.city || ''),
    status: r.status === 'منضم لفريق' ? 'joined' : 'seeking',
    seeking: r.status !== 'منضم لفريق',
    avatar: safeUrl(r.avatar_url),
    cover: pick(COVERS, r.id),
    color: pick(COLORS, r.id),
  }
}

function mapTeam(r, oppTeams, oppOrgs) {
  return {
    id: r.id,
    name: esc(r.name),
    type: TEAM_KEY[r.type] || '',
    label: esc(r.description || r.type || ''),
    description: esc(r.description || r.type || ''),
    city: esc(r.city || ''),
    logo: safeUrl(r.logo_url),
    logoText: short(r.name),
    cover: pick(COVERS, r.id),
    color: pick(COLORS, r.id),
    hasOpportunity: oppTeams.has(r.id) || oppOrgs.has(r.name),
  }
}

function mapOpp(r) {
  return {
    id: r.id,
    title: esc(r.title),
    org: esc(r.org),
    logo: short(r.org),
    logoUrl: safeUrl(r.logo_url),
    color: pick(COLORS, r.id),
    tags: [r.audience, r.game].filter(Boolean).map(esc),
    tag: esc(r.audience),
    kind: esc(r.type),
    kindClass: 'chip-green',
    cat: ROLE_KEY[r.audience] || '',
    city: esc(r.city || ''),
    deadline: esc(r.deadline || ''),
    applicants: r.applicants_count || 0,
  }
}

async function load() {
  const [t, tm, o] = await Promise.all([
    supabase.from('talents').select('id,name,role,game,city,status,avatar_url').order('created_at', { ascending: false }),
    supabase.from('teams').select('id,name,type,description,city,logo_url').order('created_at', { ascending: false }),
    supabase.from('nexo_opportunities').select('id,team_id,title,org,logo_url,type,audience,game,city,deadline,applicants_count').order('created_at', { ascending: false }),
  ])
  for (const r of [t, tm, o]) if (r.error) throw r.error

  const oppTeams = new Set(o.data.map((x) => x.team_id).filter(Boolean))
  const oppOrgs = new Set(o.data.map((x) => x.org))
  return {
    talents: t.data.map(mapTalent),
    teams: tm.data.map((r) => mapTeam(r, oppTeams, oppOrgs)),
    opps: o.data.map(mapOpp),
  }
}

load()
  .then((data) => {
    window.NEXO_DATA = data
    window.dispatchEvent(new Event('nexo:public'))
  })
  .catch((e) => console.error('NEXO public data failed to load:', e))
