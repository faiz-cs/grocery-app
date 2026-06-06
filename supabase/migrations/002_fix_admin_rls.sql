-- Fix admin_users RLS so server-side reads work correctly
-- Drop existing restrictive policies
drop policy if exists "Admin read self" on admin_users;
drop policy if exists "Superadmin all" on admin_users;

-- Allow any authenticated user to read admin_users
-- (server layout will check if their id exists)
create policy "Authenticated can read admin_users"
  on admin_users for select
  to authenticated
  using (true);

-- Only superadmins can modify admin_users
create policy "Superadmin manage admin_users"
  on admin_users for all
  to authenticated
  using (
    exists (
      select 1 from admin_users
      where id = auth.uid() and role = 'superadmin'
    )
  );
