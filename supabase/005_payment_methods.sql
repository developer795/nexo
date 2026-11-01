-- =====================================================================
-- NEXO — طريقة الدفع (للعرض في صفحة الاشتراك والفوترة)
-- يحفظ آخر 4 أرقام ونوع البطاقة وتاريخ الانتهاء فقط.
-- رقم البطاقة الكامل ورمز الأمان (CVV) ما ينحفظون أبدًا.
-- شغّله مرة وحدة: Supabase ← SQL Editor ← New query ← الصق ← Run
-- (يحتاج إن schema.sql متشغّل قبل. آمن لو شغلته أكثر من مرة)
-- =====================================================================

create table if not exists public.nexo_payment_methods (
  user_id     uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  brand       text not null check (brand in ('visa', 'mastercard', 'mada', 'amex', 'card')),
  last4       text not null check (last4 ~ '^[0-9]{4}$'),
  exp_month   smallint not null check (exp_month between 1 and 12),
  exp_year    smallint not null check (exp_year between 2000 and 2100),
  updated_at  timestamptz not null default now()
);

alter table public.nexo_payment_methods enable row level security;

drop policy if exists "pm: read own"   on public.nexo_payment_methods;
drop policy if exists "pm: insert own" on public.nexo_payment_methods;
drop policy if exists "pm: update own" on public.nexo_payment_methods;
drop policy if exists "pm: delete own" on public.nexo_payment_methods;

-- كل مستخدم يشوف ويعدّل بطاقته بس
create policy "pm: read own" on public.nexo_payment_methods
  for select to authenticated using (user_id = auth.uid());

create policy "pm: insert own" on public.nexo_payment_methods
  for insert to authenticated
  with check (public.nexo_is_aal2() and user_id = auth.uid());

create policy "pm: update own" on public.nexo_payment_methods
  for update to authenticated
  using (public.nexo_is_aal2() and user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "pm: delete own" on public.nexo_payment_methods
  for delete to authenticated
  using (public.nexo_is_aal2() and user_id = auth.uid());

grant select, insert, update, delete on public.nexo_payment_methods to authenticated;
revoke all on public.nexo_payment_methods from anon;
