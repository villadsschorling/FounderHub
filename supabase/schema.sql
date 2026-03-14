-- Supabase schema for Founder Hub

-- 1. Create Tables
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  industry text,
  mrr numeric,
  role text,
  subscription_status text default 'inactive' check (subscription_status in ('active', 'inactive')),
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

create table if not exists public.private_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  category text not null, -- 'war-room', 'money', 'social'
  subcategory text, -- e.g., 'opportunities', 'meetings'
  created_at timestamptz default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- 2. Enable RLS
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.metrics enable row level security;
alter table public.messages enable row level security;
alter table public.private_messages enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

-- 3. Setup Policies (DROP IF EXISTS before CREATE to avoid "already exists" errors)

-- Posts
drop policy if exists "Authenticated can view all posts" on public.posts;
create policy "Authenticated can view all posts"
  on public.posts for select
  using (auth.role() = 'authenticated');

drop policy if exists "Authenticated can insert own posts" on public.posts;
create policy "Authenticated can insert own posts"
  on public.posts for insert
  with check (
    auth.role() = 'authenticated' AND
    author_id in (select id from public.profiles where user_id = auth.uid())
  );

drop policy if exists "Authenticated can update own posts" on public.posts;
create policy "Authenticated can update own posts"
  on public.posts for update
  using (author_id in (select id from public.profiles where user_id = auth.uid()));

drop policy if exists "Authenticated can delete own posts" on public.posts;
create policy "Authenticated can delete own posts"
  on public.posts for delete
  using (author_id in (select id from public.profiles where user_id = auth.uid()));

-- Comments
drop policy if exists "Authenticated can view all comments" on public.comments;
create policy "Authenticated can view all comments"
  on public.comments for select
  using (auth.role() = 'authenticated');

drop policy if exists "Authenticated can insert own comments" on public.comments;
create policy "Authenticated can insert own comments"
  on public.comments for insert
  with check (
    auth.role() = 'authenticated' AND
    author_id in (select id from public.profiles where user_id = auth.uid())
  );

drop policy if exists "Authenticated can update own comments" on public.comments;
create policy "Authenticated can update own comments"
  on public.comments for update
  using (author_id in (select id from public.profiles where user_id = auth.uid()));

drop policy if exists "Authenticated can delete own comments" on public.comments;
create policy "Authenticated can delete own comments"
  on public.comments for delete
  using (author_id in (select id from public.profiles where user_id = auth.uid()));

-- Profiles
drop policy if exists "Individuals can view own profile" on public.profiles;
create policy "Individuals can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Individuals can update own profile" on public.profiles;
create policy "Individuals can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

drop policy if exists "Individuals can insert own profile" on public.profiles;
create policy "Individuals can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Authenticated can view all profiles" on public.profiles;
create policy "Authenticated can view all profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');

-- Companies
drop policy if exists "Owners manage their companies" on public.companies;
create policy "Owners manage their companies"
  on public.companies for all
  using (auth.uid() = owner_id);

-- Metrics
drop policy if exists "Owners manage their metrics" on public.metrics;
create policy "Owners manage their metrics"
  on public.metrics for all
  using (
    auth.uid() in (
      select owner_id from public.companies c where c.id = company_id
    )
  );

-- Messages
drop policy if exists "Authenticated can read war room messages" on public.messages;
create policy "Authenticated can read war room messages"
  on public.messages for select
  using (auth.role() = 'authenticated');

drop policy if exists "Authenticated can insert own messages" on public.messages;
create policy "Authenticated can insert own messages"
  on public.messages for insert
  with check (auth.role() = 'authenticated');

-- Private Messages
drop policy if exists "Users can view their own private messages" on public.private_messages;
create policy "Users can view their own private messages"
  on public.private_messages for select
  using (
    auth.uid() in (
      select user_id from public.profiles where id = sender_id
      union
      select user_id from public.profiles where id = recipient_id
    )
  );

drop policy if exists "Users can send private messages" on public.private_messages;
create policy "Users can send private messages"
  on public.private_messages for insert
  with check (
    auth.uid() in (
      select user_id from public.profiles where id = sender_id
    )
  );

drop policy if exists "Users can update their received messages" on public.private_messages;
create policy "Users can update their received messages"
  on public.private_messages for update
  using (
    auth.uid() in (
      select user_id from public.profiles where id = recipient_id
    )
  );

-- 4. Automation: Create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
