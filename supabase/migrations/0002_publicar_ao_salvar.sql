-- Quando o admin salva uma empresa, o banco avisa o GitHub e o Actions
-- remonta o site (~2 min). O token do GitHub fica no Vault do Supabase,
-- nunca no repositório:
--   select vault.create_secret('<token>', 'github_token');
-- Sem o token, o gatilho não faz nada (o site atualiza no build diário).

create extension if not exists pg_net with schema extensions;

create or replace function public.avisar_github() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  token text;
begin
  select decrypted_secret into token from vault.decrypted_secrets where name = 'github_token';
  if token is null then
    return null;
  end if;
  perform net.http_post(
    url := 'https://api.github.com/repos/facincanitech/voala/dispatches',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || token,
      'Accept', 'application/vnd.github+json',
      'User-Agent', 'voala-supabase'
    ),
    body := jsonb_build_object('event_type', 'empresas-mudaram')
  );
  return null;
end;
$$;

revoke all on function public.avisar_github() from public, anon, authenticated;

-- Um aviso por comando (não por linha).
create trigger empresas_mudaram
  after insert or update on public.empresas
  for each statement execute function public.avisar_github();
