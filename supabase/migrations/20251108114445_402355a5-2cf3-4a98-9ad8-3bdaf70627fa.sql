-- ÚNICA COMMAND CENTER - FASE 1: FUNDACIÓN
-- Estructura de base de datos core (orden corregido)

-- 1. ROLES Y PERMISOS
create type public.app_role as enum ('admin', 'client', 'collaborator');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamp with time zone default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Función segura para verificar roles (SECURITY DEFINER evita recursión RLS)
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Políticas RLS para user_roles
create policy "Users can view their own roles"
on public.user_roles for select
using (auth.uid() = user_id);

create policy "Admins can manage all roles"
on public.user_roles for all
using (public.has_role(auth.uid(), 'admin'));

-- 2. PERFILES DE USUARIO
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id);

create policy "Admins can view all profiles"
on public.profiles for select
using (public.has_role(auth.uid(), 'admin'));

-- Trigger para crear perfil automáticamente
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. ORGANIZACIONES (Agencias)
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  owner_id uuid references auth.users(id) not null,
  settings jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.organizations enable row level security;

-- 4. MIEMBROS DE ORGANIZACIONES (crear antes de usar en policies)
create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null default 'member',
  created_at timestamp with time zone default now(),
  unique (organization_id, user_id)
);

alter table public.organization_members enable row level security;

create policy "Members can view their memberships"
on public.organization_members for select
using (user_id = auth.uid());

create policy "Admins can manage organization members"
on public.organization_members for all
using (
  exists (
    select 1 from public.organizations
    where id = organization_members.organization_id
    and owner_id = auth.uid()
  )
);

-- Ahora sí podemos crear las policies de organizations
create policy "Admins can manage their organization"
on public.organizations for all
using (public.has_role(auth.uid(), 'admin') and owner_id = auth.uid());

create policy "Users can view organizations they belong to"
on public.organizations for select
using (
  exists (
    select 1 from public.organization_members
    where organization_id = organizations.id
    and user_id = auth.uid()
  )
);

-- 5. MARCAS (Brands)
create table public.brands (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  name text not null,
  slug text not null,
  industry text,
  logo_url text,
  website text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique (organization_id, slug)
);

alter table public.brands enable row level security;

create policy "Organization members can view brands"
on public.brands for select
using (
  exists (
    select 1 from public.organization_members
    where organization_id = brands.organization_id
    and user_id = auth.uid()
  )
);

create policy "Admins can manage brands"
on public.brands for all
using (
  exists (
    select 1 from public.organizations
    where id = brands.organization_id
    and owner_id = auth.uid()
  )
);

-- 6. BRAND KITS (Identidad de marca)
create table public.brand_kits (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references public.brands(id) on delete cascade not null unique,
  primary_color text,
  secondary_color text,
  accent_color text,
  primary_font_name text,
  secondary_font_name text,
  font_source text check (font_source in ('adobe_fonts', 'google_fonts', 'upload')),
  logo_url text,
  style_restrictions jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.brand_kits enable row level security;

create policy "Organization members can view brand kits"
on public.brand_kits for select
using (
  exists (
    select 1 from public.brands b
    join public.organization_members om on b.organization_id = om.organization_id
    where b.id = brand_kits.brand_id
    and om.user_id = auth.uid()
  )
);

create policy "Admins can manage brand kits"
on public.brand_kits for all
using (
  exists (
    select 1 from public.brands b
    join public.organizations o on b.organization_id = o.id
    where b.id = brand_kits.brand_id
    and o.owner_id = auth.uid()
  )
);

-- 7. PLANES DE SUSCRIPCIÓN
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  price_monthly numeric(10,2),
  price_yearly numeric(10,2),
  features jsonb default '[]'::jsonb,
  limits jsonb default '{}'::jsonb,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

alter table public.plans enable row level security;

create policy "Everyone can view active plans"
on public.plans for select
using (is_active = true);

-- 8. SUSCRIPCIONES
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  plan_id uuid references public.plans(id) not null,
  status text not null default 'active' check (status in ('active', 'cancelled', 'expired', 'trial')),
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  stripe_subscription_id text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.subscriptions enable row level security;

create policy "Organization owners can view their subscriptions"
on public.subscriptions for select
using (
  exists (
    select 1 from public.organizations
    where id = subscriptions.organization_id
    and owner_id = auth.uid()
  )
);

-- 9. PROYECTOS
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references public.brands(id) on delete cascade not null,
  name text not null,
  description text,
  status text default 'draft' check (status in ('draft', 'in_progress', 'review', 'approved', 'published', 'archived')),
  start_date date,
  end_date date,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.projects enable row level security;

create policy "Organization members can view projects"
on public.projects for select
using (
  exists (
    select 1 from public.brands b
    join public.organization_members om on b.organization_id = om.organization_id
    where b.id = projects.brand_id
    and om.user_id = auth.uid()
  )
);

create policy "Organization members can create projects"
on public.projects for insert
with check (
  exists (
    select 1 from public.brands b
    join public.organization_members om on b.organization_id = om.organization_id
    where b.id = brand_id
    and om.user_id = auth.uid()
  )
);

-- Trigger para updated_at
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_organizations_updated_at
  before update on public.organizations
  for each row execute function public.update_updated_at_column();

create trigger update_brands_updated_at
  before update on public.brands
  for each row execute function public.update_updated_at_column();

create trigger update_brand_kits_updated_at
  before update on public.brand_kits
  for each row execute function public.update_updated_at_column();

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger update_projects_updated_at
  before update on public.projects
  for each row execute function public.update_updated_at_column();

create trigger update_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.update_updated_at_column();