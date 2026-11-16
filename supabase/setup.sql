-- Wall: database setup.
-- Run once, on a fresh Supabase project: SQL Editor -> New query -> paste -> Run.

-- 1. The posts table.
--    Limits are enforced here as well as in the page, so they hold even if
--    someone talks to the database directly.
--    user_id is unused for now: there is no sign-in, so it is always null and
--    visitors cannot set it. It is here so the table has a place for an account
--    id if sign-in is added later.
create table public.posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid,
  author_name text not null
              check (char_length(btrim(author_name)) between 1 and 40),
  body        text not null
              check (char_length(body) <= 280 and char_length(btrim(body)) >= 1),
  photo_path  text
              check (photo_path is null
                     or photo_path ~ '^[0-9a-f-]{36}\.(jpg|jpeg|png|gif|webp)$'),
  created_at  timestamptz not null default now()
);

create index posts_created_at_idx on public.posts (created_at desc);

-- 2. Access rules.
--    Visitors may read posts and add posts. They may not edit or delete them,
--    and may not choose a post's id or timestamp.
alter table public.posts enable row level security;

create policy "Anyone can read posts"
  on public.posts for select
  to anon, authenticated
  using (true);

create policy "Anyone can add posts"
  on public.posts for insert
  to anon, authenticated
  with check (true);

revoke all on public.posts from anon, authenticated;
grant select on public.posts to anon, authenticated;
grant insert (author_name, body, photo_path) on public.posts to anon, authenticated;

-- 3. Live feed: send new posts to every open page.
alter publication supabase_realtime add table public.posts;

-- 4. Photo storage: a public bucket limited to images of at most 5 MB.
--    Visitors may add files. They may not overwrite, list or delete them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wall-photos',
  'wall-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

create policy "Anyone can upload wall photos"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'wall-photos');

-- 5. Starter posts, so the wall is not empty on first load.
insert into public.posts (author_name, body, created_at) values
  ('Priya',  'Mika, I could hear your keyboard from the next room again. New project or just angry emails?', now() - interval '2 hours'),
  ('Ada',    'Found the viewpoint you told me about. You were right about the sunset.',                      now() - interval '3 hours'),
  ('Tomás',  'Saw your commit at 3am. Lisbon has daylight too, you know.',                                   now() - interval '5 hours'),
  ('Leila',  'Remember when we said the side project would take a weekend? Good times.',                     now() - interval '8 hours'),
  ('Jonas',  'First one to deploy on Friday buys the coffee. I have already lost.',                          now() - interval '1 day'),
  ('Noor',   'Your plants say hi. I watered them. Two of them, anyway.',                                     now() - interval '2 days');
