create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  facebook_url text not null default ''
    check (facebook_url = '' or facebook_url ~ '^https://[^[:space:]]+$'),
  instagram_url text not null default ''
    check (instagram_url = '' or instagram_url ~ '^https://[^[:space:]]+$'),
  tiktok_url text not null default ''
    check (tiktok_url = '' or tiktok_url ~ '^https://[^[:space:]]+$'),
  whatsapp_number text not null default ''
    check (whatsapp_number = '' or whatsapp_number ~ '^[+0-9 ()-]{8,30}$'),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

alter table public.site_settings
  add column if not exists copyright_text_ar text not null default 'جميع الحقوق محفوظة لدى R2J WEB DEV',
  add column if not exists copyright_text_en text not null default 'All rights reserved by R2J WEB DEV',
  add column if not exists developer_name text not null default 'R2J WEB DEV',
  add column if not exists developer_url text not null default ''
    check (developer_url = '' or developer_url ~ '^https://[^[:space:]]+$'),
  add column if not exists developer_icon_url text not null default 'assets/r2j-web-dev.png';

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "Anyone can read social settings" on public.site_settings;
create policy "Anyone can read social settings"
on public.site_settings for select to anon, authenticated
using (true);

drop policy if exists "Admins update social settings" on public.site_settings;
create policy "Admins update social settings"
on public.site_settings for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;
