-- Supabase schema for Founder Hub

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  industry text,
  stage text check (stage in ('Pre-Seed','Seed','Series A','Series B','Later')),
  website text,
  created_at timestamptz default now()
);

create table if not exists public.metrics (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  month date not null,
  monthly_revenue numeric not null,
  burn_rate numeric not null,
  headcount integer not null,
  created_at timestamptz default now(),
  unique (company_id, month)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_profile_id uuid not null references public.profiles(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  content text not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.metrics enable row level security;
alter table public.messages enable row level security;

create policy "Individuals can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Individuals can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "Owners manage their companies"
  on public.companies for all
  using (auth.uid() = owner_id);

create policy "Owners manage their metrics"
  on public.metrics for all
  using (
    auth.uid() in (
      select owner_id from public.companies c where c.id = company_id
    )
  );

create policy "Authenticated can read war room messages"
  on public.messages for select
  using (auth.role() = 'authenticated');

create policy "Authenticated can insert own messages"
  on public.messages for insert
  with check (auth.role() = 'authenticated');

