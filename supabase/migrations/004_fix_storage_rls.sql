-- Allow authenticated admins to upload to the images bucket
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update set public = true;

-- Drop existing storage policies if any
drop policy if exists "Admin upload images" on storage.objects;
drop policy if exists "Public read images" on storage.objects;
drop policy if exists "Admin delete images" on storage.objects;

-- Public can read all images (so image URLs work in UI)
create policy "Public read images"
  on storage.objects for select
  to public
  using (bucket_id = 'images');

-- Authenticated admins can upload
create policy "Admin upload images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'images');

-- Authenticated admins can update/delete
create policy "Admin manage images"
  on storage.objects for update, delete
  to authenticated
  using (bucket_id = 'images');
