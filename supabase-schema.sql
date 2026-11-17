create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique check (email = lower(email)),
  full_name text not null check (char_length(btrim(full_name)) between 1 and 100),
  faculty text not null check (char_length(btrim(faculty)) between 1 and 120),
  academic_year text not null check (academic_year in ('1', '2', '3', '4')),
  phone text not null check (char_length(btrim(phone)) between 5 and 30),
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null check (char_length(btrim(title_ar)) between 1 and 140),
  title_en text not null check (char_length(btrim(title_en)) between 1 and 140),
  description_ar text not null default '',
  description_en text not null default '',
  price numeric(10, 2) not null default 0 check (price >= 0),
  academic_year text not null check (academic_year in ('1', '2', '3', '4')),
  video_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (video_path is null or video_path like (id::text || '/%'))
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  access_code text unique,
  created_at timestamptz not null default now(),
  unique (profile_id, course_id)
);

create table public.course_schedules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title_ar text not null,
  title_en text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  meeting_url text check (meeting_url is null or meeting_url like 'https://%'),
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at)
);

create table public.course_reviews (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now(),
  unique (profile_id, course_id)
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  title_en text not null,
  body_ar text not null,
  body_en text not null,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.announcement_reads (
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (announcement_id, profile_id)
);

create table public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  title_en text not null,
  body_ar text not null,
  body_en text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.community_messages (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  sender_name text not null default '',
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index enrollments_profile_id_idx on public.enrollments(profile_id);
create index enrollments_course_id_idx on public.enrollments(course_id);
create index schedules_starts_at_idx on public.course_schedules(starts_at);
create index announcements_created_at_idx on public.announcements(created_at desc);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.is_email_confirmed(p_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = auth
as $$
  select exists (
    select 1 from auth.users
    where id = p_profile_id and email_confirmed_at is not null
  );
$$;

revoke all on function public.is_email_confirmed(uuid) from public;
grant execute on function public.is_email_confirmed(uuid) to authenticated;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, faculty, academic_year, phone)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'faculty', ''),
    coalesce(new.raw_user_meta_data ->> 'academic_year', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  );
  insert into public.admin_notifications (title_ar, title_en, body_ar, body_en)
  values (
    'حساب طالب جديد', 'New student account',
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    lower(new.email)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.create_profile_for_new_user();

revoke all on function public.create_profile_for_new_user() from public, anon, authenticated;

create or replace function public.prevent_profile_email_change()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    raise exception 'Update email through Supabase Auth';
  end if;
  return new;
end;
$$;

create trigger keep_profile_email_in_sync
before update of email on public.profiles
for each row execute function public.prevent_profile_email_change();

create or replace function public.request_course_enrollment(p_course_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  enrollment_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Sign in is required';
  end if;

  if not exists (
    select 1 from auth.users
    where id = auth.uid() and email_confirmed_at is not null
  ) then
    raise exception 'Confirm your email before requesting a course';
  end if;

  if not exists (
    select 1 from public.courses
    where id = p_course_id and is_active
  ) then
    raise exception 'Course is unavailable';
  end if;

  insert into public.enrollments (profile_id, course_id)
  values (auth.uid(), p_course_id)
  on conflict (profile_id, course_id) do update
    set status = case
          when enrollments.status = 'rejected' then 'pending'
          else enrollments.status
        end,
        access_code = case
          when enrollments.status = 'rejected' then null
          else enrollments.access_code
        end
  returning id into enrollment_id;

  return enrollment_id;
end;
$$;

revoke all on function public.request_course_enrollment(uuid) from public;
grant execute on function public.request_course_enrollment(uuid) to authenticated;

create or replace function public.assign_enrollment_access_code()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if new.status = 'approved' and old.status is distinct from new.status then
    new.access_code := 'AL-' || upper(encode(gen_random_bytes(6), 'hex'));
  elsif new.status <> 'approved' then
    new.access_code := null;
  end if;
  return new;
end;
$$;

create trigger assign_access_code_on_approval
before update of status on public.enrollments
for each row execute function public.assign_enrollment_access_code();

create or replace function public.is_enrolled_in_course(p_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.enrollments
    where profile_id = (select auth.uid())
      and course_id = p_course_id
      and status = 'approved'
  );
$$;

revoke all on function public.is_enrolled_in_course(uuid) from public;
grant execute on function public.is_enrolled_in_course(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.course_schedules enable row level security;
alter table public.course_reviews enable row level security;
alter table public.announcements enable row level security;
alter table public.announcement_reads enable row level security;
alter table public.admin_notifications enable row level security;
alter table public.community_messages enable row level security;

create policy "Profiles are visible to their owner and admins"
on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select public.is_admin()));

create policy "Users update their own student profile"
on public.profiles for update to authenticated
using (id = (select auth.uid()) and role = 'student')
with check (id = (select auth.uid()) and role = 'student');

create policy "Admins manage profiles"
on public.profiles for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()) and (select public.is_email_confirmed(id)));

create policy "Active courses are visible"
on public.courses for select to authenticated
using (
  is_active
  or (select public.is_admin())
  or (select public.is_enrolled_in_course(id))
);

create policy "Visitors can browse active courses"
on public.courses for select to anon
using (is_active);

create policy "Admins manage courses"
on public.courses for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Users view their enrollments and admins view all"
on public.enrollments for select to authenticated
using (profile_id = (select auth.uid()) or (select public.is_admin()));

create policy "Admins review enrollments"
on public.enrollments for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Schedules are visible to signed-in users"
on public.course_schedules for select to authenticated
using ((select public.is_admin()) or (select public.is_enrolled_in_course(course_id)));

create policy "Admins manage schedules"
on public.course_schedules for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Reviews are visible to signed-in users"
on public.course_reviews for select to authenticated
using (true);

create policy "Visitors can read course ratings"
on public.course_reviews for select to anon
using (true);

create policy "Approved students can review a course"
on public.course_reviews for insert to authenticated
with check (
  profile_id = (select auth.uid())
  and (select public.is_enrolled_in_course(course_id))
);

create policy "Students update their own reviews"
on public.course_reviews for update to authenticated
using (profile_id = (select auth.uid()))
with check (
  profile_id = (select auth.uid())
  and (select public.is_enrolled_in_course(course_id))
);

create policy "Review owners and admins delete reviews"
on public.course_reviews for delete to authenticated
using (profile_id = (select auth.uid()) or (select public.is_admin()));

create policy "Signed-in users read announcements"
on public.announcements for select to authenticated
using (true);

create policy "Admins publish announcements"
on public.announcements for insert to authenticated
with check ((select public.is_admin()) and created_by = (select auth.uid()));

create policy "Admins update announcements"
on public.announcements for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admins delete announcements"
on public.announcements for delete to authenticated
using ((select public.is_admin()));

create policy "Users manage their own announcement reads"
on public.announcement_reads for all to authenticated
using (profile_id = (select auth.uid()))
with check (profile_id = (select auth.uid()));

create policy "Admins read administration notifications"
on public.admin_notifications for select to authenticated
using ((select public.is_admin()));

create policy "Admins mark administration notifications read"
on public.admin_notifications for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Signed-in users read community messages"
on public.community_messages for select to authenticated
using (
  course_id is null
  or (select public.is_admin())
  or (select public.is_enrolled_in_course(course_id))
);

create policy "Signed-in users post their own messages"
on public.community_messages for insert to authenticated
with check (
  profile_id = (select auth.uid())
  and (course_id is null or (select public.is_enrolled_in_course(course_id)))
);

create or replace function public.set_community_sender_name()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  select full_name into new.sender_name
  from public.profiles where id = new.profile_id;
  return new;
end;
$$;

create trigger set_community_sender
before insert on public.community_messages
for each row execute function public.set_community_sender_name();

create or replace function public.notify_course_or_schedule()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  course_title_ar text;
  course_title_en text;
begin
  if tg_op = 'UPDATE' then
    if tg_table_name = 'courses'
      and new.title_ar is not distinct from old.title_ar
      and new.title_en is not distinct from old.title_en
      and new.description_ar is not distinct from old.description_ar
      and new.description_en is not distinct from old.description_en
      and new.price is not distinct from old.price
      and new.academic_year is not distinct from old.academic_year
      and new.video_path is not distinct from old.video_path
      and new.is_active is not distinct from old.is_active then
      return new;
    elsif tg_table_name = 'course_schedules'
      and new.course_id is not distinct from old.course_id
      and new.title_ar is not distinct from old.title_ar
      and new.title_en is not distinct from old.title_en
      and new.starts_at is not distinct from old.starts_at
      and new.ends_at is not distinct from old.ends_at
      and new.meeting_url is not distinct from old.meeting_url then
      return new;
    end if;
  end if;

  if auth.uid() is null then
    return new;
  end if;

  if tg_table_name = 'courses' then
    if not new.is_active then
      return new;
    end if;
    insert into public.announcements (title_ar, title_en, body_ar, body_en, created_by)
    values ('مقرر جديد', 'New course', new.title_ar, new.title_en, auth.uid());
  else
    select title_ar, title_en into course_title_ar, course_title_en
    from public.courses where id = new.course_id;
    insert into public.announcements (title_ar, title_en, body_ar, body_en, created_by)
    values (
      'موعد كورس جديد', 'New course session',
      new.title_ar || ' — ' || coalesce(course_title_ar, ''),
      new.title_en || ' — ' || coalesce(course_title_en, ''),
      auth.uid()
    );
  end if;
  return new;
end;
$$;

create trigger announce_new_course
after insert or update on public.courses
for each row execute function public.notify_course_or_schedule();

create trigger announce_new_schedule
after insert or update on public.course_schedules
for each row execute function public.notify_course_or_schedule();

create or replace function public.notify_admin_of_enrollment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  course_title_ar text;
  course_title_en text;
begin
  select title_ar, title_en into course_title_ar, course_title_en
  from public.courses where id = new.course_id;
  insert into public.admin_notifications (title_ar, title_en, body_ar, body_en)
  values (
    'طلب التحاق جديد', 'New enrollment request',
    coalesce(course_title_ar, ''), coalesce(course_title_en, '')
  );
  return new;
end;
$$;

create trigger notify_admin_on_enrollment
after insert on public.enrollments
for each row execute function public.notify_admin_of_enrollment();

create trigger notify_admin_on_enrollment_resubmission
after update of status on public.enrollments
for each row
when (old.status = 'rejected' and new.status = 'pending')
execute function public.notify_admin_of_enrollment();

create or replace function public.notify_admin_of_review()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  course_title_ar text;
  course_title_en text;
begin
  select title_ar, title_en into course_title_ar, course_title_en
  from public.courses where id = new.course_id;
  insert into public.admin_notifications (title_ar, title_en, body_ar, body_en)
  values (
    'تقييم جديد', 'New course review',
    coalesce(course_title_ar, '') || ' · ' || new.rating || ' من 5',
    coalesce(course_title_en, '') || ' · ' || new.rating || ' out of 5'
  );
  return new;
end;
$$;

create trigger notify_admin_on_review
after insert on public.course_reviews
for each row execute function public.notify_admin_of_review();

grant select on public.courses, public.course_reviews to anon;
grant select, insert, update, delete on public.profiles, public.courses,
  public.enrollments, public.course_schedules, public.course_reviews,
  public.announcements, public.announcement_reads, public.admin_notifications,
  public.community_messages to authenticated;

insert into storage.buckets (id, name, public, file_size_limit)
values ('course-videos', 'course-videos', false, 52428800)
on conflict (id) do update
set public = false, file_size_limit = excluded.file_size_limit;

create policy "Approved students and admins can view course videos"
on storage.objects for select to authenticated
using (
  bucket_id = 'course-videos'
  and (
    (select public.is_admin())
    or exists (
      select 1 from public.enrollments e
      where e.profile_id = (select auth.uid())
        and e.status = 'approved'
        and (storage.foldername(name))[1] = e.course_id::text
    )
  )
);

create policy "Admins upload course videos"
on storage.objects for insert to authenticated
with check (bucket_id = 'course-videos' and (select public.is_admin()));

create policy "Admins update course videos"
on storage.objects for update to authenticated
using (bucket_id = 'course-videos' and (select public.is_admin()))
with check (bucket_id = 'course-videos' and (select public.is_admin()));

create policy "Admins delete course videos"
on storage.objects for delete to authenticated
using (bucket_id = 'course-videos' and (select public.is_admin()));

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'announcements'
  ) then
    alter publication supabase_realtime add table public.announcements;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'course_schedules'
  ) then
    alter publication supabase_realtime add table public.course_schedules;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'admin_notifications'
  ) then
    alter publication supabase_realtime add table public.admin_notifications;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'community_messages'
  ) then
    alter publication supabase_realtime add table public.community_messages;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'enrollments'
  ) then
    alter publication supabase_realtime add table public.enrollments;
  end if;
end;
$$;
