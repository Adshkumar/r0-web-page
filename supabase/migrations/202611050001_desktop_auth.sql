create table if not exists public.r0_accounts (
  id integer generated always as identity primary key,
  auth_user_id uuid not null unique references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  provider text,
  github_username text,
  created_at timestamptz not null default now()
);

create table if not exists public.r0_desktop_sessions (
  id uuid primary key,
  poll_secret_hash text not null,
  status text not null default 'pending' check (status in ('pending', 'authorized')),
  account_id integer references public.r0_accounts (id) on delete cascade,
  credential_ciphertext text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  check (
    (status = 'pending' and account_id is null and credential_ciphertext is null)
    or (status = 'authorized' and account_id is not null and credential_ciphertext is not null)
  )
);

create table if not exists public.r0_desktop_tokens (
  id uuid primary key,
  account_id integer not null references public.r0_accounts (id) on delete cascade,
  secret_hash text not null,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.r0_intelligence_settings (
  account_id integer not null references public.r0_accounts (id) on delete cascade,
  scope text not null check (scope = 'personal'),
  revision integer not null default 0 check (revision >= 0),
  preferences jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (account_id, scope)
);

create table if not exists public.r0_desktop_session_rate_limits (
  ip_hash text not null,
  window_start timestamptz not null,
  request_count integer not null default 0 check (request_count >= 0),
  primary key (ip_hash, window_start)
);

alter table public.r0_accounts enable row level security;
alter table public.r0_desktop_sessions enable row level security;
alter table public.r0_desktop_tokens enable row level security;
alter table public.r0_intelligence_settings enable row level security;
alter table public.r0_desktop_session_rate_limits enable row level security;

revoke all on public.r0_accounts, public.r0_desktop_sessions, public.r0_desktop_tokens,
  public.r0_intelligence_settings, public.r0_desktop_session_rate_limits
  from anon, authenticated;
grant all on public.r0_accounts, public.r0_desktop_sessions, public.r0_desktop_tokens
  to service_role;
grant all on public.r0_intelligence_settings to service_role;
grant all on public.r0_desktop_session_rate_limits to service_role;
grant usage, select on sequence public.r0_accounts_id_seq to service_role;

create or replace function public.r0_authorize_desktop_session(
  p_session_id uuid,
  p_account_id integer,
  p_token_id uuid,
  p_secret_hash text,
  p_encrypted_token text,
  p_token_expires_at timestamptz
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  changed_id uuid;
  current_status text;
  current_account_id integer;
begin
  update public.r0_desktop_sessions
  set status = 'authorized',
      account_id = p_account_id,
      credential_ciphertext = p_encrypted_token
  where id = p_session_id
    and status = 'pending'
    and expires_at > now()
  returning id into changed_id;

  if changed_id is null then
    select status, account_id
    into current_status, current_account_id
    from public.r0_desktop_sessions
    where id = p_session_id
      and expires_at > now();

    return current_status = 'authorized' and current_account_id = p_account_id;
  end if;

  insert into public.r0_desktop_tokens (id, account_id, secret_hash, expires_at)
  values (p_token_id, p_account_id, p_secret_hash, p_token_expires_at);

  return true;
end;
$$;

create or replace function public.r0_cleanup_desktop_auth()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.r0_desktop_sessions where expires_at <= now();
  delete from public.r0_desktop_tokens where expires_at <= now() or revoked_at is not null;
  delete from public.r0_desktop_session_rate_limits
  where window_start < now() - interval '1 day';
end;
$$;

create or replace function public.r0_check_desktop_session_rate_limit(
  p_ip_hash text,
  p_window_start timestamptz,
  p_limit integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  attempts integer;
begin
  insert into public.r0_desktop_session_rate_limits (ip_hash, window_start, request_count)
  values (p_ip_hash, p_window_start, 1)
  on conflict (ip_hash, window_start)
  do update set request_count = public.r0_desktop_session_rate_limits.request_count + 1
  returning request_count into attempts;

  return attempts <= p_limit;
end;
$$;

create or replace function public.r0_save_intelligence_settings(
  p_account_id integer,
  p_expected_revision integer,
  p_preferences jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved public.r0_intelligence_settings;
begin
  insert into public.r0_intelligence_settings (account_id, scope, revision, preferences)
  values (
    p_account_id,
    'personal',
    0,
    '{"defaultConnection":{"providerId":"auto","modelId":""},"tasks":{},"autoRouting":true}'::jsonb
  )
  on conflict (account_id, scope) do nothing;

  update public.r0_intelligence_settings
  set revision = revision + 1,
      preferences = p_preferences,
      updated_at = now()
  where account_id = p_account_id
    and scope = 'personal'
    and revision = p_expected_revision
  returning * into saved;

  if saved.account_id is null then
    return null;
  end if;
  return to_jsonb(saved);
end;
$$;

revoke all on function public.r0_authorize_desktop_session(uuid, integer, uuid, text, text, timestamptz)
  from public, anon, authenticated;
revoke all on function public.r0_cleanup_desktop_auth() from public, anon, authenticated;
revoke all on function public.r0_check_desktop_session_rate_limit(text, timestamptz, integer)
  from public, anon, authenticated;
revoke all on function public.r0_save_intelligence_settings(integer, integer, jsonb)
  from public, anon, authenticated;
grant execute on function public.r0_authorize_desktop_session(uuid, integer, uuid, text, text, timestamptz)
  to service_role;
grant execute on function public.r0_cleanup_desktop_auth() to service_role;
grant execute on function public.r0_check_desktop_session_rate_limit(text, timestamptz, integer)
  to service_role;
grant execute on function public.r0_save_intelligence_settings(integer, integer, jsonb)
  to service_role;
