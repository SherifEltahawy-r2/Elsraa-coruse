begin;

create table if not exists public.live_calls (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  title_en text not null,
  call_type text not null check (call_type in ('group', 'private')),
  room_slug text not null unique,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists live_calls_active_created_at_idx
  on public.live_calls(is_active, created_at desc);

alter table public.live_calls enable row level security;

revoke all on table public.live_calls from public, anon, authenticated;
grant select on table public.live_calls to anon, authenticated;
grant insert, update, delete on table public.live_calls to authenticated;

drop policy if exists "Everyone reads active live calls" on public.live_calls;
create policy "Everyone reads active live calls"
on public.live_calls for select to anon, authenticated
using (is_active);

drop policy if exists "Admins read all live calls" on public.live_calls;
create policy "Admins read all live calls"
on public.live_calls for select to authenticated
using ((select public.is_admin()));

drop policy if exists "Admins create live calls" on public.live_calls;
create policy "Admins create live calls"
on public.live_calls for insert to authenticated
with check ((select public.is_admin()));

drop policy if exists "Admins update live calls" on public.live_calls;
create policy "Admins update live calls"
on public.live_calls for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Admins delete live calls" on public.live_calls;
create policy "Admins delete live calls"
on public.live_calls for delete to authenticated
using ((select public.is_admin()));

commit;
