-- جدول إعدادات الموقع (قابل للتعديل من الأدمن)
create table if not exists public.site_settings (
  key         text primary key,
  value       text,
  description text,
  updated_at  timestamptz default now()
);

-- القيم الافتراضية
insert into public.site_settings (key, value, description) values
  ('hook_line_1',    'جمهورك عُماني...',       'السطر الأول من الهوك'),
  ('hook_line_2',    'فلماذا تبحث عن',         'السطر الثاني من الهوك'),
  ('hook_line_3',    'صور أجنبية؟',            'السطر الثالث من الهوك'),
  ('nav_link_1_label','استكشاف المحتوى',       'رابط التنقّل الأول'),
  ('nav_link_2_label','القطاعات',              'رابط التنقّل الثاني'),
  ('nav_link_3_label','الأسعار',               'رابط التنقّل الثالث'),
  ('nav_link_4_label','كن مساهماً',            'رابط التنقّل الرابع'),
  ('nav_link_5_label','عن عُمان ستوك',         'رابط التنقّل الخامس')
on conflict (key) do nothing;

-- صلاحيات RLS
alter table public.site_settings enable row level security;

create policy "site_settings_public_read"
  on public.site_settings for select using (true);

create policy "site_settings_admin_write"
  on public.site_settings for all
  using (public.is_admin())
  with check (public.is_admin());
