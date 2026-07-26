-- FormSink initial schema
-- Run this in the Supabase SQL editor (or `supabase db push`) on a fresh project.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now()
);

create table public.forms (
  -- Short public id used in the endpoint URL: /f/<id>
  id text primary key default substr(replace(gen_random_uuid()::text, '-', ''), 1, 10),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  notify boolean not null default true,
  redirect_url text,
  created_at timestamptz not null default now()
);

create index forms_user_idx on public.forms (user_id);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  form_id text not null references public.forms (id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index submissions_form_created_idx on public.submissions (form_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- The public submission endpoint writes with the service-role key, which
-- bypasses RLS. These policies only govern the logged-in dashboard.
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.forms enable row level security;
alter table public.submissions enable row level security;

create policy "read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "manage own forms"
  on public.forms for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "read own submissions"
  on public.submissions for select
  using (exists (
    select 1 from public.forms f
    where f.id = submissions.form_id and f.user_id = auth.uid()
  ));

create policy "delete own submissions"
  on public.submissions for delete
  using (exists (
    select 1 from public.forms f
    where f.id = submissions.form_id and f.user_id = auth.uid()
  ));

-- ---------------------------------------------------------------------------
-- Auto-create a profile row when a user signs up
-- ---------------------------------------------------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
