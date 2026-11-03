-- =====================================================================
-- NEXO — حالة الفرص للجهات (تطلع في ملف الجهة: "فرص متاحة للتقديم")
-- يضيف عمود status لجدول teams
-- شغّله مرة وحدة: Supabase ← SQL Editor ← New query ← الصق ← Run
-- (آمن لو شغلته أكثر من مرة)
-- =====================================================================

alter table public.teams add column if not exists status text;

alter table public.teams drop constraint if exists teams_status_check;
alter table public.teams
  add constraint teams_status_check check (status is null or status in ('فرص متاحة للتقديم', 'لا توجد فرص حاليًا'));
