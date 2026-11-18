-- Schema PostgreSQL para Supabase (Vercel + Supabase Production Stack)
-- Execute este script no SQL Editor do seu projeto Supabase.

create extension if not exists "pgcrypto";

-- 1. Solicitações de Soluções Prontas e Sistemas Personalizados
create table if not exists public.solution_requests (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  company_name text not null,
  contact_channel text not null,
  niche text not null,
  solution_type text not null check (solution_type in ('pronta', 'personalizada', 'repositorio')),
  reference_project text,
  monthly_volume text,
  notes text,
  estimated_hours_saved integer,
  status text not null default 'novo' check (status in ('novo', 'em_analise', 'proposta_enviada', 'contratado')),
  created_at timestamptz not null default now()
);

-- 2. Catálogo Opcional de Projetos em Destaque (sincronizável com GitHub)
create table if not exists public.featured_repositories (
  id uuid primary key default gen_random_uuid(),
  github_repo_full_name text unique not null,
  title text not null,
  category text not null,
  business_impact text not null,
  demo_url text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Row-Level Security (RLS)
alter table public.solution_requests enable row level security;
alter table public.featured_repositories enable row level security;

-- Permite que visitantes enviem solicitações pelo site sem expor dados de outros clientes
create policy "Permitir insercao publica de solicitacoes"
  on public.solution_requests
  for insert
  to anon, authenticated
  with check (true);

-- Leitura de solicitações restrita apenas a usuários autenticados (administrador)
create policy "Leitura de solicitacoes apenas autenticado"
  on public.solution_requests
  for select
  to authenticated
  using (true);

-- Projetos em destaque públicos para vitrine
create policy "Leitura publica de projetos publicados"
  on public.featured_repositories
  for select
  to anon, authenticated
  using (is_published = true);
