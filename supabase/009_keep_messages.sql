-- =====================================================================
-- NEXO — الرسائل تبقى محفوظة حتى لو انحذف حساب المرسل أو المستلم
-- شغّله مرة وحدة: Supabase ← SQL Editor ← New query ← الصق ← Run
-- (يحتاج إن 007_messages.sql متشغّل قبل. آمن لو شغلته أكثر من مرة)
-- =====================================================================

alter table public.nexo_messages drop constraint if exists nexo_messages_sender_id_fkey;
alter table public.nexo_messages drop constraint if exists nexo_messages_receiver_id_fkey;

-- ما نسمح بإرسال رسالة لحساب مو موجود
create or replace function public.nexo_message_receiver_exists()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from auth.users where id = new.receiver_id) then
    raise exception 'receiver not found' using errcode = '23503';
  end if;
  return new;
end;
$$;

revoke execute on function public.nexo_message_receiver_exists() from public, anon, authenticated;

drop trigger if exists nexo_messages_receiver_exists on public.nexo_messages;
create trigger nexo_messages_receiver_exists before insert on public.nexo_messages
  for each row execute function public.nexo_message_receiver_exists();
