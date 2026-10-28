-- =====================================================================
-- NEXO — جدول الاشتراكات
-- شغّله مرة وحدة: Supabase ← SQL Editor ← New query ← الصق ← Run
-- (يحتاج إن schema.sql متشغّل قبل. آمن لو شغلته أكثر من مرة)
-- =====================================================================

create table if not exists public.nexo_subscriptions (
  user_id        uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  audience       text not null check (audience in ('individual', 'org')),
  plan           text not null check (plan in ('m', 'y')),
  status         text not null check (status in ('trialing', 'active', 'canceled')),
  started_at     timestamptz not null default now(),
  trial_ends_at  timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- قاعدة البيانات هي اللي تحدد بداية الاشتراك ونهاية التجربة (7 أيام)
-- عشان ما أحد يقدر يمدد تجربته من المتصفح
create or replace function public.nexo_subscription_dates()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    new.started_at := now();
    new.created_at := now();
    new.trial_ends_at := case when new.status = 'trialing' then now() + interval '7 days' else null end;
  else
    new.user_id := old.user_id;
    new.started_at := old.started_at;
    new.created_at := old.created_at;
    new.trial_ends_at := old.trial_ends_at;
    -- التجربة ما تتكرر: لو انتهت ما يرجع لها
    if new.status = 'trialing' and old.status <> 'trialing' then
      new.status := old.status;
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists nexo_subscriptions_dates on public.nexo_subscriptions;
create trigger nexo_subscriptions_dates before insert or update on public.nexo_subscriptions
  for each row execute function public.nexo_subscription_dates();

alter table public.nexo_subscriptions enable row level security;

drop policy if exists "subs: read own"   on public.nexo_subscriptions;
drop policy if exists "subs: insert own" on public.nexo_subscriptions;
drop policy if exists "subs: update own" on public.nexo_subscriptions;

create policy "subs: read own" on public.nexo_subscriptions
  for select to authenticated
  using (user_id = auth.uid());

create policy "subs: insert own" on public.nexo_subscriptions
  for insert to authenticated
  with check (public.nexo_is_aal2() and user_id = auth.uid());

create policy "subs: update own" on public.nexo_subscriptions
  for update to authenticated
  using (public.nexo_is_aal2() and user_id = auth.uid())
  with check (user_id = auth.uid());

grant select, insert, update on public.nexo_subscriptions to authenticated;
revoke all on public.nexo_subscriptions from anon;
