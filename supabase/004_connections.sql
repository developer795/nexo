-- =====================================================================
-- NEXO — شبكة التواصل (الحسابات اللي ضفتها من زر "تواصل")
-- الصفحة الرئيسية تعرض منشوراتك ومنشورات اللي ضفتهم بس
-- شغّله مرة وحدة: Supabase ← SQL Editor ← New query ← الصق ← Run
-- (يحتاج إن schema.sql متشغّل قبل. آمن لو شغلته أكثر من مرة)
-- =====================================================================

create table if not exists public.nexo_connections (
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  target_id   uuid not null references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, target_id),
  check (user_id <> target_id)
);

create index if not exists nexo_connections_target_idx on public.nexo_connections (target_id);

alter table public.nexo_connections enable row level security;

drop policy if exists "conn: members read" on public.nexo_connections;
drop policy if exists "conn: add own"      on public.nexo_connections;
drop policy if exists "conn: remove own"   on public.nexo_connections;

-- القراءة للمسجلين (عشان عدد "شبكة التواصل")، والإضافة والحذف لصاحب الحساب بعد MFA
create policy "conn: members read" on public.nexo_connections
  for select to authenticated using (true);

create policy "conn: add own" on public.nexo_connections
  for insert to authenticated
  with check (public.nexo_is_aal2() and user_id = auth.uid());

create policy "conn: remove own" on public.nexo_connections
  for delete to authenticated
  using (public.nexo_is_aal2() and user_id = auth.uid());

grant select, insert, delete on public.nexo_connections to authenticated;
revoke all on public.nexo_connections from anon;
