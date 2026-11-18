alter table public.profiles
  add column if not exists account_status text not null default 'active'
  check (account_status in ('active', 'banned')),
  add column if not exists muted_until timestamptz,
  add column if not exists kicked_until timestamptz,
  add column if not exists avatar_path text;

create table if not exists public.course_videos (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title_ar text not null default '',
  title_en text not null default '',
  video_source text not null check (char_length(btrim(video_source)) between 1 and 1000),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.call_rooms (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  room_type text not null default 'group' check (room_type in ('group', 'private')),
  is_locked boolean not null default false,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.call_participants (
  room_id uuid not null references public.call_rooms(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  profile_name text not null default '',
  avatar_path text,
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  primary key (room_id, profile_id)
);

alter table public.call_participants
  add column if not exists profile_name text not null default '',
  add column if not exists avatar_path text;

create table if not exists public.call_signals (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.call_rooms(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid references public.profiles(id) on delete cascade,
  signal jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.community_typing (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  room_key text not null check (
    room_key = 'public'
    or room_key ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  ),
  is_typing boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (profile_id, room_key)
);

create index if not exists community_typing_room_updated_idx
on public.community_typing (room_key, updated_at desc)
where is_typing;

alter table public.course_videos enable row level security;
alter table public.call_rooms enable row level security;
alter table public.call_participants enable row level security;
alter table public.call_signals enable row level security;
alter table public.community_typing enable row level security;

grant select, insert, update, delete on public.course_videos to authenticated;
grant select, insert, update, delete on public.call_rooms to authenticated;
grant select, insert, update on public.call_participants to authenticated;
grant select, insert, update, delete on public.call_signals to authenticated;
grant select, insert, update on public.community_typing to authenticated;

drop policy if exists "Chat members read typing status" on public.community_typing;
create policy "Chat members read typing status"
on public.community_typing for select to authenticated
using (
  (select public.is_admin())
  or case
    when room_key = 'public' then true
    else (select public.is_enrolled_in_course(room_key::uuid))
  end
);

drop policy if exists "Chat members share typing status" on public.community_typing;
create policy "Chat members share typing status"
on public.community_typing for insert to authenticated
with check (
  profile_id = (select auth.uid())
  and (
    (select public.is_admin())
    or case
      when room_key = 'public' then true
      else (select public.is_enrolled_in_course(room_key::uuid))
    end
  )
);

drop policy if exists "Users update their typing status" on public.community_typing;
create policy "Users update their typing status"
on public.community_typing for update to authenticated
using (profile_id = (select auth.uid()))
with check (
  profile_id = (select auth.uid())
  and (
    (select public.is_admin())
    or case
      when room_key = 'public' then true
      else (select public.is_enrolled_in_course(room_key::uuid))
    end
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-avatars', 'profile-avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public profile avatars are readable" on storage.objects;
create policy "Public profile avatars are readable"
on storage.objects for select to anon, authenticated
using (bucket_id = 'profile-avatars');

drop policy if exists "Users upload their own profile avatar" on storage.objects;
create policy "Users upload their own profile avatar"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users update their own profile avatar" on storage.objects;
create policy "Users update their own profile avatar"
on storage.objects for update to authenticated
using (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users delete their own profile avatar" on storage.objects;
create policy "Users delete their own profile avatar"
on storage.objects for delete to authenticated
using (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create or replace function public.get_community_members()
returns table (id uuid, first_name text, avatar_path text, role text)
language sql
stable
security definer
set search_path = public
as $$
  select p.id,
         split_part(btrim(p.full_name), ' ', 1),
         p.avatar_path,
         p.role
  from public.profiles p
  where auth.uid() is not null
    and p.account_status = 'active'
  order by p.full_name;
$$;

revoke all on function public.get_community_members() from public;
grant execute on function public.get_community_members() to authenticated;

drop policy if exists "Courses expose lesson videos" on public.course_videos;
create policy "Courses expose lesson videos"
on public.course_videos for select to authenticated
using ((select public.is_admin()) or (select public.is_enrolled_in_course(course_id)));

drop policy if exists "Admins manage lesson videos" on public.course_videos;
create policy "Admins manage lesson videos"
on public.course_videos for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Call room participants read rooms" on public.call_rooms;
create policy "Call room participants read rooms"
on public.call_rooms for select to authenticated
using (
  (select public.is_admin())
  or (room_type = 'group' and course_id is null)
  or created_by = (select auth.uid())
  or (select public.is_enrolled_in_course(course_id))
);

drop policy if exists "Admins manage call rooms" on public.call_rooms;
drop policy if exists "Admins and owners manage call rooms" on public.call_rooms;
create policy "Admins and owners manage call rooms"
on public.call_rooms for all to authenticated
using ((select public.is_admin()) or created_by = (select auth.uid()))
with check ((select public.is_admin()) or created_by = (select auth.uid()));

drop policy if exists "Participants read and join rooms" on public.call_participants;
create policy "Participants read and join rooms"
on public.call_participants for select to authenticated
using (
  profile_id = (select auth.uid())
  or (select public.is_admin())
  or exists (
    select 1 from public.call_rooms r
    where r.id = room_id
      and (
        r.course_id is null
        or r.created_by = (select auth.uid())
        or (select public.is_enrolled_in_course(r.course_id))
      )
  )
);

drop policy if exists "Users manage their presence" on public.call_participants;
create policy "Users manage their presence"
on public.call_participants for all to authenticated
using (profile_id = (select auth.uid()) or (select public.is_admin()))
with check (profile_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Call users exchange signals" on public.call_signals;
create policy "Call users exchange signals"
on public.call_signals for all to authenticated
using (sender_id = (select auth.uid()) or receiver_id = (select auth.uid()) or (select public.is_admin()))
with check (sender_id = (select auth.uid()));

drop policy if exists "Review owners and admins delete reviews" on public.course_reviews;
create policy "Review owners and admins delete reviews"
on public.course_reviews for delete to authenticated
using (profile_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Users and admins manage community messages" on public.community_messages;
drop policy if exists "Users and admins delete community messages" on public.community_messages;
create policy "Users and admins delete community messages"
on public.community_messages for delete to authenticated
using (profile_id = (select auth.uid()) or (select public.is_admin()));

create or replace function public.moderate_profile(
  p_profile_id uuid,
  p_action text,
  p_minutes integer default 0
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Administrator access required';
  end if;
  if p_profile_id = auth.uid() then
    raise exception 'Cannot moderate your own administrator account';
  end if;

  if p_action = 'ban' then
    update public.profiles set account_status = 'banned', muted_until = null, kicked_until = null
    where id = p_profile_id;
  elsif p_action = 'unban' then
    update public.profiles set account_status = 'active', muted_until = null, kicked_until = null
    where id = p_profile_id;
  elsif p_action = 'mute' then
    update public.profiles set muted_until = now() + make_interval(mins => greatest(p_minutes, 1))
    where id = p_profile_id;
  elsif p_action = 'kick' then
    update public.profiles set kicked_until = now() + make_interval(mins => greatest(p_minutes, 1))
    where id = p_profile_id;
  elsif p_action = 'unmute' then
    update public.profiles set muted_until = null
    where id = p_profile_id;
  elsif p_action = 'delete' then
    delete from auth.users where id = p_profile_id;
  else
    raise exception 'Unknown moderation action';
  end if;
end;
$$;

revoke all on function public.moderate_profile(uuid, text, integer) from public;
grant execute on function public.moderate_profile(uuid, text, integer) to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'community_messages'
  ) then
    alter publication supabase_realtime add table public.community_messages;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'call_signals'
  ) then
    alter publication supabase_realtime add table public.call_signals;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'call_participants'
  ) then
    alter publication supabase_realtime add table public.call_participants;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'community_typing'
  ) then
    alter publication supabase_realtime add table public.community_typing;
  end if;
end;
$$;
