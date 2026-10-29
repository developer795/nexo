-- =====================================================================
-- NEXO — جدول عناصر الملف (الألعاب، المباريات، البثوث، المحتوى، المنصات، حسابات التواصل)
-- شغّله مرة وحدة: Supabase ← SQL Editor ← New query ← الصق ← Run
-- (يحتاج إن schema.sql متشغّل قبل. آمن لو شغلته أكثر من مرة)
-- =====================================================================

create table if not exists public.profile_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind        text not null check (kind in ('game', 'match', 'stream', 'content', 'platform', 'social')),
  data        jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object' and pg_column_size(data) <= 4000),
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists profile_items_user_idx on public.profile_items (user_id, kind, position);

alter table public.profile_items enable row level security;

drop policy if exists "items: members read" on public.profile_items;
drop policy if exists "items: insert own"   on public.profile_items;
drop policy if exists "items: update own"   on public.profile_items;
drop policy if exists "items: delete own"   on public.profile_items;

-- القراءة للمسجلين (مثل المنشورات)، والكتابة لصاحب الملف بعد MFA
create policy "items: members read" on public.profile_items
  for select to authenticated using (true);

create policy "items: insert own" on public.profile_items
  for insert to authenticated
  with check (public.nexo_is_aal2() and user_id = auth.uid());

create policy "items: update own" on public.profile_items
  for update to authenticated
  using (public.nexo_is_aal2() and user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "items: delete own" on public.profile_items
  for delete to authenticated
  using (public.nexo_is_aal2() and user_id = auth.uid());

grant select, insert, update, delete on public.profile_items to authenticated;
