-- =====================================================================
-- NEXO — المحادثات (الرسائل بين الحسابات)
-- شغّله مرة وحدة: Supabase ← SQL Editor ← New query ← الصق ← Run
-- (يحتاج إن schema.sql متشغّل قبل. آمن لو شغلته أكثر من مرة)
-- =====================================================================

create table if not exists public.nexo_messages (
  id          bigint generated always as identity primary key,
  sender_id   uuid not null default auth.uid() references auth.users (id) on delete cascade,
  receiver_id uuid not null references auth.users (id) on delete cascade,
  body        text not null check (char_length(body) between 1 and 2000),
  created_at  timestamptz not null default now(),
  read_at     timestamptz,
  check (sender_id <> receiver_id)
);

create index if not exists nexo_messages_sender_idx   on public.nexo_messages (sender_id, created_at);
create index if not exists nexo_messages_receiver_idx on public.nexo_messages (receiver_id, created_at);

alter table public.nexo_messages enable row level security;

drop policy if exists "msgs: read own"   on public.nexo_messages;
drop policy if exists "msgs: send"       on public.nexo_messages;
drop policy if exists "msgs: mark read"  on public.nexo_messages;

-- كل واحد يشوف الرسائل اللي أرسلها أو وصلته بس
create policy "msgs: read own" on public.nexo_messages
  for select to authenticated
  using (sender_id = auth.uid() or receiver_id = auth.uid());

-- الإرسال باسمك بس وبعد MFA
create policy "msgs: send" on public.nexo_messages
  for insert to authenticated
  with check (public.nexo_is_aal2() and sender_id = auth.uid());

-- المستلم يعلّم الرسالة مقروءة (عمود read_at بس)
create policy "msgs: mark read" on public.nexo_messages
  for update to authenticated
  using (public.nexo_is_aal2() and receiver_id = auth.uid())
  with check (receiver_id = auth.uid());

grant select, insert on public.nexo_messages to authenticated;
grant update (read_at) on public.nexo_messages to authenticated;
revoke all on public.nexo_messages from anon;
