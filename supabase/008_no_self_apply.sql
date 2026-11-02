-- =====================================================================
-- NEXO — صاحب الفرصة ما يقدر يقدّم على فرصته
-- يمنع التقديم على فرصتك من قاعدة البيانات، ويحذف أي تقديم قديم سوّيته على فرصتك
-- (ويرجع عدد المتقدمين صحيح تلقائيًا)
-- شغّله مرة وحدة: Supabase ← SQL Editor ← New query ← الصق ← Run
-- (يحتاج إن schema.sql متشغّل قبل. آمن لو شغلته أكثر من مرة)
-- =====================================================================

drop policy if exists "apps: apply" on public.applications;
create policy "apps: apply" on public.applications
  for insert to authenticated
  with check (
    public.nexo_is_aal2()
    and user_id = auth.uid()
    and not exists (select 1 from public.nexo_opportunities o
                     where o.id = opportunity_id and o.created_by = auth.uid())
  );

-- تقديمات أصحاب الفرص على فرصهم (من التجارب قبل هذا التعديل)
delete from public.applications a
 using public.nexo_opportunities o
 where o.id = a.opportunity_id and o.created_by = a.user_id;
