/*
  # Auth + invite-only signup

  1. New tables
    - `profiles`            — 1:1 with `auth.users`, app-level fields
    - `invite_codes`        — invite codes (admin-issued or user-generated, ≤ 3 per user)
    - `invite_redemptions`  — audit trail; each user can redeem exactly one code

  2. Security
    - RLS enabled on all three tables
    - Profiles: users read/update their own row only
    - Invite codes:
        · users can SELECT codes they created
        · users can INSERT codes for themselves, capped at 3 by trigger
        · revocation / admin codes done via service role
    - Redemptions: users see redemptions of their codes or their own; INSERT only via service role
    - `generate_invite_code()` RPC creates a unique 8-char code for the caller

  3. Notes
    - The `signup-with-invite` Edge Function uses the service role to validate the code,
      create the auth user, increment uses, write the redemption + profile.
    - Bootstrap: insert the first invite code manually (see AUTH_SETUP.md).
*/

-- ── profiles ─────────────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  invited_by uuid references auth.users(id) on delete set null,
  invite_code_used text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own"
  on profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own"
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── invite_codes ─────────────────────────────────────────────────────
create table if not exists invite_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  created_by uuid references auth.users(id) on delete cascade,
  max_uses int not null default 1,
  uses int not null default 0,
  expires_at timestamptz,
  revoked boolean not null default false,
  created_at timestamptz default now()
);

create index if not exists invite_codes_created_by_idx on invite_codes (created_by);
create index if not exists invite_codes_code_idx on invite_codes (code);

alter table invite_codes enable row level security;

-- 3-per-user quota; admin-issued rows (created_by IS NULL) are not capped.
create or replace function enforce_invite_quota()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.created_by is not null then
    if (select count(*) from invite_codes where created_by = new.created_by) >= 3 then
      raise exception 'Invite quota exceeded: each user may create up to 3 codes';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_invite_quota_trigger on invite_codes;
create trigger enforce_invite_quota_trigger
  before insert on invite_codes
  for each row execute function enforce_invite_quota();

drop policy if exists "invite_codes_select_own" on invite_codes;
create policy "invite_codes_select_own"
  on invite_codes for select
  to authenticated
  using (created_by = auth.uid());

drop policy if exists "invite_codes_insert_own" on invite_codes;
create policy "invite_codes_insert_own"
  on invite_codes for insert
  to authenticated
  with check (created_by = auth.uid());

-- ── invite_redemptions ───────────────────────────────────────────────
create table if not exists invite_redemptions (
  id uuid primary key default gen_random_uuid(),
  invite_code_id uuid not null references invite_codes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  redeemed_at timestamptz default now(),
  unique (user_id)
);

create index if not exists invite_redemptions_code_idx
  on invite_redemptions (invite_code_id);

alter table invite_redemptions enable row level security;

drop policy if exists "invite_redemptions_select_self_or_owner" on invite_redemptions;
create policy "invite_redemptions_select_self_or_owner"
  on invite_redemptions for select
  to authenticated
  using (
    user_id = auth.uid()
    or invite_code_id in (
      select id from invite_codes where created_by = auth.uid()
    )
  );

-- ── generate_invite_code RPC ─────────────────────────────────────────
-- Returns a freshly created row for the caller. Quota and uniqueness are
-- enforced inside the trigger + unique index. Retries on accidental
-- collision until it succeeds (extremely rare for 8-char alphabet).
create or replace function generate_invite_code(
  p_max_uses int default 1,
  p_expires_at timestamptz default null
)
returns invite_codes
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';  -- no I/O/0/1
  v_code text;
  v_row invite_codes;
  v_attempt int := 0;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  loop
    v_code := '';
    for i in 1..8 loop
      v_code := v_code || substr(v_alphabet, 1 + floor(random() * length(v_alphabet))::int, 1);
    end loop;

    begin
      insert into invite_codes (code, created_by, max_uses, expires_at)
      values (v_code, v_uid, greatest(coalesce(p_max_uses, 1), 1), p_expires_at)
      returning * into v_row;
      return v_row;
    exception when unique_violation then
      v_attempt := v_attempt + 1;
      if v_attempt >= 5 then
        raise exception 'Could not allocate invite code, please try again';
      end if;
    end;
  end loop;
end;
$$;

revoke all on function generate_invite_code(int, timestamptz) from public;
grant execute on function generate_invite_code(int, timestamptz) to authenticated;

-- ── updated_at trigger for profiles ──────────────────────────────────
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on profiles;
create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();
