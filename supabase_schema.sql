-- Tabela para receber os cadastros do formulário PastorForm
create table if not exists public.igreja_cadastros (
  id uuid primary key default gen_random_uuid(),
  nome_pastor text not null,
  telefone text not null,
  email text not null,
  endereco text not null,
  cep text not null,
  cnpj text not null,
  numero_fieis text not null,
  modelo_desejado text not null,
  banco text,
  banco_numero text,
  agencia text,
  conta text,
  correntista_nome text,
  tracking_id text unique,
  payment_status text default 'pending',
  payment_id text,
  payment_details jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz
);

-- Habilitar Row Level Security (RLS)
alter table public.igreja_cadastros enable row level security;

-- Remover políticas existentes se houver
drop policy if exists "Allow edge function inserts" on public.igreja_cadastros;
drop policy if exists "Allow edge function reads" on public.igreja_cadastros;
drop policy if exists "Allow edge function updates" on public.igreja_cadastros;

-- Política para permitir inserções via Edge Functions
create policy "Allow edge function inserts"
  on public.igreja_cadastros
  for insert
  to authenticated
  with check (true);

-- Política para permitir leitura via Edge Functions
create policy "Allow edge function reads"
  on public.igreja_cadastros
  for select
  to authenticated
  using (true);

-- Política para permitir atualizações via Edge Functions
create policy "Allow edge function updates"
  on public.igreja_cadastros
  for update
  to authenticated
  using (true)
  with check (true);
