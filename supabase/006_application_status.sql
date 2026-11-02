-- =====================================================================
-- NEXO — حالة التقديم على الفرص (لصفحة "متابعة الفرص")
-- يضيف عمود status لجدول applications: قيد المراجعة / مقبول / مرفوض
-- شغّله مرة وحدة: Supabase ← SQL Editor ← New query ← الصق ← Run
-- (يحتاج إن schema.sql متشغّل قبل. آمن لو شغلته أكثر من مرة)
-- =====================================================================

alter table public.applications
  add column if not exists status text not null default 'pending';

alter table public.applications drop constraint if exists applications_status_check;
alter table public.applications
  add constraint applications_status_check check (status in ('pending', 'accepted', 'rejected'));

-- صاحب الفرصة بس يغيّر حالة التقديم (المتقدم ما يقدر يقبل نفسه)
drop policy if exists "apps: owner sets status" on public.applications;
create policy "apps: owner sets status" on public.applications
  for update to authenticated
  using (
    public.nexo_is_aal2()
    and exists (select 1 from public.nexo_opportunities o
                 where o.id = opportunity_id and o.created_by = auth.uid())
  )
  with check (
    exists (select 1 from public.nexo_opportunities o
             where o.id = opportunity_id and o.created_by = auth.uid())
  );

revoke update on public.applications from authenticated;
grant update (status) on public.applications to authenticated;
