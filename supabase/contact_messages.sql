-- Rode no Supabase: SQL Editor > New query > cole tudo > Run.
create extension if not exists "pgcrypto";

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  contact text not null,
  service text,
  message text,
  status text not null default 'novo' check (status in ('novo','respondido','arquivado')),
  created_at timestamptz not null default now()
);

-- RLS ligado e SEM policy pública: ninguém lê/escreve pelo navegador.
-- Só a função /api/contact (service_role, no servidor) grava, e você lê pelo painel.
alter table public.contact_messages enable row level security;
