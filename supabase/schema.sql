-- =====================================================================
-- NEXO — قاعدة البيانات الكاملة (Supabase / Postgres)
--
-- طريقة التشغيل:
--   Supabase Dashboard → SQL Editor → New query → الصق الملف كامل → Run
--
-- الملف آمن للتشغيل أكثر من مرة (idempotent).
--
-- الجداول:
--   talents        المواهب (لاعب / صانع محتوى / ستريمر)
--   teams          الأندية والجهات ومقدمي الخدمة
--   posts          منشورات الصفحة الرئيسية والملفات الشخصية
--   nexo_opportunities  الفرص
--   applications   التقديمات على الفرص
--   profile_items  عناصر الملف: الألعاب، المباريات، البثوث، المحتوى، المنصات، حسابات التواصل
--   storage: nexo-media الصور (الصور الشخصية، الأغلفة، الشعارات، صور المنشورات)
--
-- ملاحظة: كل الأسماء هنا ما تتعارض مع الجداول الموجودة من قبل
-- (opportunities, organizations, profiles) — هذا الملف ما يلمسها أبد.
--
-- ملاحظة: بيانات التسجيل الحساسة (الجوال، تاريخ الميلاد) تبقى في
-- auth.users → user_metadata ولا تُنسخ لأي جدول عام.
-- =====================================================================


-- ---------------------------------------------------------------------
-- دوال مساعدة
-- ---------------------------------------------------------------------

-- هل المستخدم أكمل التحقق الثنائي (MFA)؟
-- الـ Dashboard يشترط aal2، فنفس الشرط مطبق على الكتابة في قاعدة البيانات
-- حتى ما يقدر أحد يتجاوز MFA ويكتب مباشرة عبر الـ API.
create or replace function public.nexo_is_aal2()
returns boolean
language sql stable
as $$
  select coalesce(auth.jwt() ->> 'aal', '') = 'aal2'
$$;

create or replace function public.nexo_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;


-- ---------------------------------------------------------------------
-- المواهب
-- user_id  = صاحب الحساب لو هذا ملفه الشخصي (حساب فرد)
-- created_by = من أضاف السجل (لو أُضيف يدويًا من زر + في صفحة المواهب)
-- ---------------------------------------------------------------------
create table if not exists public.talents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid unique references auth.users (id) on delete cascade,
  created_by  uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 80),
  role        text check (role in ('لاعب', 'صانع محتوى', 'ستريمر')),
  game        text check (char_length(game) <= 80),
  city        text check (char_length(city) <= 60),
  status      text check (status in ('يبحث عن فريق', 'منضم لفريق')),
  bio         text check (char_length(bio) <= 2000),
  avatar_url  text check (char_length(avatar_url) <= 500),
  cover_url   text check (char_length(cover_url) <= 500),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists talents_created_at_idx on public.talents (created_at desc);
create index if not exists talents_role_idx on public.talents (role);
create index if not exists talents_city_idx on public.talents (city);

drop trigger if exists talents_updated_at on public.talents;
create trigger talents_updated_at before update on public.talents
  for each row execute function public.nexo_set_updated_at();


-- ---------------------------------------------------------------------
-- الأندية والجهات
-- ---------------------------------------------------------------------
create table if not exists public.teams (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid unique references auth.users (id) on delete cascade,
  created_by  uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 80),
  type        text check (type in ('نادي', 'جهة', 'مقدم خدمة')),
  description text check (char_length(description) <= 160),
  bio         text check (char_length(bio) <= 2000),
  city        text check (char_length(city) <= 60),
  logo_url    text check (char_length(logo_url) <= 500),
  cover_url   text check (char_length(cover_url) <= 500),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists teams_created_at_idx on public.teams (created_at desc);
create index if not exists teams_type_idx on public.teams (type);

drop trigger if exists teams_updated_at on public.teams;
create trigger teams_updated_at before update on public.teams
  for each row execute function public.nexo_set_updated_at();


-- ---------------------------------------------------------------------
-- المنشورات
-- ---------------------------------------------------------------------
create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null default auth.uid() references auth.users (id) on delete cascade,
  body        text not null check (char_length(body) between 1 and 5000),
  image_url   text check (char_length(image_url) <= 500),
  created_at  timestamptz not null default now()
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_author_idx on public.posts (author_id);


-- ---------------------------------------------------------------------
-- الفرص
-- applicants_count يتحدث تلقائيًا من جدول applications (ما ينكتب يدويًا)
-- ---------------------------------------------------------------------
create table if not exists public.nexo_opportunities (
  id               bigint generated always as identity primary key,
  created_by       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  team_id          uuid references public.teams (id) on delete set null,
  title            text not null check (char_length(title) between 1 and 120),
  org              text not null check (char_length(org) between 1 and 80),
  logo_url         text check (char_length(logo_url) <= 500),
  type             text not null check (type in ('عقد عمل', 'تدريب تعاوني', 'تدريب مهني', 'حملة اعلانية', 'مشاركة في البطولة')),
  audience         text not null check (audience in ('لاعب', 'صانع محتوى', 'ستريمر')),
  game             text check (char_length(game) <= 80),
  city             text check (char_length(city) <= 60),
  deadline         date,
  details          text not null check (char_length(details) between 1 and 5000),
  applicants_count integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists nexo_opportunities_created_at_idx on public.nexo_opportunities (created_at desc);
create index if not exists nexo_opportunities_audience_idx on public.nexo_opportunities (audience);
create index if not exists nexo_opportunities_team_idx on public.nexo_opportunities (team_id);
create index if not exists nexo_opportunities_created_by_idx on public.nexo_opportunities (created_by);

drop trigger if exists nexo_opportunities_updated_at on public.nexo_opportunities;
create trigger nexo_opportunities_updated_at before update on public.nexo_opportunities
  for each row execute function public.nexo_set_updated_at();

-- يمنع صاحب الفرصة من تعديل عدد المتقدمين يدويًا
create or replace function public.nexo_protect_applicants_count()
returns trigger
language plpgsql
as $$
begin
  if pg_trigger_depth() = 1 then
    new.applicants_count := old.applicants_count;
  end if;
  return new;
end;
$$;

drop trigger if exists nexo_opportunities_protect_count on public.nexo_opportunities;
create trigger nexo_opportunities_protect_count before update on public.nexo_opportunities
  for each row execute function public.nexo_protect_applicants_count();


-- ---------------------------------------------------------------------
-- التقديمات
-- ---------------------------------------------------------------------
create table if not exists public.applications (
  opportunity_id bigint not null references public.nexo_opportunities (id) on delete cascade,
  user_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at     timestamptz not null default now(),
  primary key (opportunity_id, user_id)
);

create index if not exists applications_user_idx on public.applications (user_id);

create or replace function public.nexo_sync_applicants_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.nexo_opportunities
       set applicants_count = applicants_count + 1
     where id = new.opportunity_id;
    return new;
  else
    update public.nexo_opportunities
       set applicants_count = greatest(applicants_count - 1, 0)
     where id = old.opportunity_id;
    return old;
  end if;
end;
$$;

drop trigger if exists applications_count on public.applications;
create trigger applications_count after insert or delete on public.applications
  for each row execute function public.nexo_sync_applicants_count();


-- ---------------------------------------------------------------------
-- عرض المنشورات مع اسم وصورة الكاتب (من ملفه في talents أو teams)
-- security_invoker = يطبق صلاحيات (RLS) المستخدم اللي يقرأ
-- ---------------------------------------------------------------------
create or replace view public.post_feed
with (security_invoker = on)
as
select
  p.id,
  p.author_id,
  p.body,
  p.image_url,
  p.created_at,
  coalesce(t.name, tm.name, 'عضو نيكسو')        as author_name,
  coalesce(t.avatar_url, tm.logo_url)           as author_avatar,
  coalesce(t.role, tm.type)                     as author_label,
  case when t.id is not null then 'talent'
       when tm.id is not null then 'team' end   as author_kind,
  coalesce(t.id, tm.id)                         as author_profile_id
from public.posts p
left join public.talents t on t.user_id = p.author_id
left join public.teams tm on tm.user_id = p.author_id;


-- =====================================================================
-- الصلاحيات (Row Level Security)
--   القراءة: المواهب والفرق والفرص عامة (تظهر في صفحات الموقع العامة)،
--            المنشورات للمسجلين فقط.
--   الكتابة: للمسجلين بعد MFA فقط، وكل واحد يعدّل/يحذف اللي له.
-- =====================================================================
alter table public.talents       enable row level security;
alter table public.teams         enable row level security;
alter table public.posts         enable row level security;
alter table public.nexo_opportunities enable row level security;
alter table public.applications  enable row level security;

-- talents -------------------------------------------------------------
drop policy if exists "talents: public read"  on public.talents;
drop policy if exists "talents: insert"       on public.talents;
drop policy if exists "talents: update own"   on public.talents;
drop policy if exists "talents: delete own"   on public.talents;

create policy "talents: public read" on public.talents
  for select to anon, authenticated using (true);

create policy "talents: insert" on public.talents
  for insert to authenticated
  with check (
    public.nexo_is_aal2()
    and created_by = auth.uid()
    and (user_id is null or user_id = auth.uid())
  );

create policy "talents: update own" on public.talents
  for update to authenticated
  using (public.nexo_is_aal2() and (user_id = auth.uid() or (user_id is null and created_by = auth.uid())))
  with check (user_id = auth.uid() or (user_id is null and created_by = auth.uid()));

create policy "talents: delete own" on public.talents
  for delete to authenticated
  using (public.nexo_is_aal2() and (user_id = auth.uid() or (user_id is null and created_by = auth.uid())));

-- teams ---------------------------------------------------------------
drop policy if exists "teams: public read" on public.teams;
drop policy if exists "teams: insert"      on public.teams;
drop policy if exists "teams: update own"  on public.teams;
drop policy if exists "teams: delete own"  on public.teams;

create policy "teams: public read" on public.teams
  for select to anon, authenticated using (true);

create policy "teams: insert" on public.teams
  for insert to authenticated
  with check (
    public.nexo_is_aal2()
    and created_by = auth.uid()
    and (user_id is null or user_id = auth.uid())
  );

create policy "teams: update own" on public.teams
  for update to authenticated
  using (public.nexo_is_aal2() and (user_id = auth.uid() or (user_id is null and created_by = auth.uid())))
  with check (user_id = auth.uid() or (user_id is null and created_by = auth.uid()));

create policy "teams: delete own" on public.teams
  for delete to authenticated
  using (public.nexo_is_aal2() and (user_id = auth.uid() or (user_id is null and created_by = auth.uid())));

-- posts ---------------------------------------------------------------
drop policy if exists "posts: members read" on public.posts;
drop policy if exists "posts: insert own"   on public.posts;
drop policy if exists "posts: update own"   on public.posts;
drop policy if exists "posts: delete own"   on public.posts;

create policy "posts: members read" on public.posts
  for select to authenticated using (true);

create policy "posts: insert own" on public.posts
  for insert to authenticated
  with check (public.nexo_is_aal2() and author_id = auth.uid());

create policy "posts: update own" on public.posts
  for update to authenticated
  using (public.nexo_is_aal2() and author_id = auth.uid())
  with check (author_id = auth.uid());

create policy "posts: delete own" on public.posts
  for delete to authenticated
  using (public.nexo_is_aal2() and author_id = auth.uid());

-- opportunities -------------------------------------------------------
drop policy if exists "opps: public read" on public.nexo_opportunities;
drop policy if exists "opps: insert"      on public.nexo_opportunities;
drop policy if exists "opps: update own"  on public.nexo_opportunities;
drop policy if exists "opps: delete own"  on public.nexo_opportunities;

create policy "opps: public read" on public.nexo_opportunities
  for select to anon, authenticated using (true);

create policy "opps: insert" on public.nexo_opportunities
  for insert to authenticated
  with check (
    public.nexo_is_aal2()
    and created_by = auth.uid()
    and applicants_count = 0
    -- لو الفرصة مربوطة بنادي/جهة لازم تكون أنت صاحبها
    and (team_id is null or exists (
      select 1 from public.teams t
       where t.id = team_id and (t.user_id = auth.uid() or t.created_by = auth.uid())
    ))
  );

create policy "opps: update own" on public.nexo_opportunities
  for update to authenticated
  using (public.nexo_is_aal2() and created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "opps: delete own" on public.nexo_opportunities
  for delete to authenticated
  using (public.nexo_is_aal2() and created_by = auth.uid());

-- applications --------------------------------------------------------
drop policy if exists "apps: read own or as owner" on public.applications;
drop policy if exists "apps: apply"                on public.applications;
drop policy if exists "apps: withdraw"             on public.applications;

-- المتقدم يشوف تقديماته، وصاحب الفرصة يشوف من تقدّم عليها
create policy "apps: read own or as owner" on public.applications
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from public.nexo_opportunities o
                where o.id = opportunity_id and o.created_by = auth.uid())
  );

create policy "apps: apply" on public.applications
  for insert to authenticated
  with check (public.nexo_is_aal2() and user_id = auth.uid());

create policy "apps: withdraw" on public.applications
  for delete to authenticated
  using (public.nexo_is_aal2() and user_id = auth.uid());


-- صلاحيات الجداول للأدوار (RLS فوقها يحدد الصفوف)
grant select on public.talents, public.teams, public.nexo_opportunities to anon;
grant select, insert, update, delete on
  public.talents, public.teams, public.posts, public.nexo_opportunities, public.applications
  to authenticated;
grant select on public.post_feed to authenticated;
revoke all on public.post_feed from anon;


-- =====================================================================
-- تخزين الصور: bucket اسمه nexo-media
--   القراءة عامة (روابط الصور تظهر في الموقع)
--   كل مستخدم يرفع داخل مجلد باسم الـ id حقه فقط: nexo-media/<user_id>/...
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('nexo-media', 'nexo-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "nexo-media: public read"  on storage.objects;
drop policy if exists "nexo-media: upload own"   on storage.objects;
drop policy if exists "nexo-media: update own"   on storage.objects;
drop policy if exists "nexo-media: delete own"   on storage.objects;

create policy "nexo-media: public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'nexo-media');

create policy "nexo-media: upload own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'nexo-media'
    and public.nexo_is_aal2()
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "nexo-media: update own" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'nexo-media'
    and public.nexo_is_aal2()
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "nexo-media: delete own" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'nexo-media'
    and public.nexo_is_aal2()
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- =====================================================================
-- عناصر الملف الشخصي — عرض الكل في صفحة الملف
--   الألعاب (game)، المباريات والبطولات (match)، أبرز البثوث (stream)،
--   إبراز المحتوى (content)، المنصات (platform)، حسابات التواصل (social)
-- كل صف = عنصر واحد، وتفاصيله في data (jsonb).
-- إضافة جديدة فقط: ما تغيّر أي جدول أو صلاحية موجودة.
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
