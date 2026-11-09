-- VoaLá: tabela de empresas + quem é admin + regras de acesso (RLS).
-- Rodar no SQL Editor do Supabase (ou `supabase db push`).

create table public.empresas (
  id             uuid primary key default gen_random_uuid(),
  nome           text not null check (length(trim(nome)) > 0),
  slug           text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  categoria      text not null,
  descricao      text not null default '',
  endereco       text not null default '',
  lat            double precision not null check (lat between -90 and 90),
  lng            double precision not null check (lng between -180 and 180),
  telefone       text not null default '',
  whatsapp       text not null default '',   -- só dígitos, com DDI: 5517999999999
  instagram      text not null default '',   -- só o usuário, sem @
  youtube_id     text not null default '' check (youtube_id = '' or youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  ativo          boolean not null default true,
  plano_vence_em date not null default (current_date + 30),
  criado_em      timestamptz not null default now()
);

create index empresas_publicas_idx on public.empresas (plano_vence_em) where ativo;

-- Quem pode mexer no painel. O cadastro público do Supabase Auth deve ficar
-- desligado; mesmo se ligarem sem querer, só quem está aqui escreve.
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- "Hoje" no fuso de Rio Preto, não em UTC: senão o plano some às 21h do último dia.
create or replace function public.hoje_br() returns date
language sql stable set search_path = '' as $$
  select (now() at time zone 'America/Sao_Paulo')::date;
$$;

alter table public.empresas enable row level security;
alter table public.admins enable row level security;

-- Público só enxerga empresa ativa com plano em dia (vence_em é o último dia válido).
create policy "publico le empresas em dia" on public.empresas
  for select to anon, authenticated
  using (ativo and plano_vence_em >= public.hoje_br());

create policy "admin le tudo" on public.empresas
  for select to authenticated using (public.is_admin());
create policy "admin cria" on public.empresas
  for insert to authenticated with check (public.is_admin());
create policy "admin edita" on public.empresas
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
-- Sem policy de delete de propósito: o painel desativa, não apaga.

create policy "admin se ve" on public.admins
  for select to authenticated using (user_id = auth.uid());
