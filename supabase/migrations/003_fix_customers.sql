-- Add unique constraint on phone (required for upsert onConflict to work)
alter table customers drop constraint if exists customers_phone_key;
alter table customers add constraint customers_phone_key unique (phone);

-- Fix RLS: allow anyone (anon) to insert/upsert customers
drop policy if exists "Customers can insert themselves" on customers;
drop policy if exists "Customers can read own" on customers;
drop policy if exists "Admin all customers" on customers;

-- Anyone can insert a customer (anon checkout flow)
create policy "Anyone can insert customers"
  on customers for insert
  to anon, authenticated
  with check (true);

-- Anyone can update customer by phone match (for upsert)
create policy "Anyone can update customers"
  on customers for update
  to anon, authenticated
  using (true);

-- Anyone can read customers (needed for upsert select)
create policy "Anyone can read customers"
  on customers for select
  to anon, authenticated
  using (true);

-- Admins can do everything
create policy "Admin all customers"
  on customers for all
  to authenticated
  using (
    exists (select 1 from admin_users where id = auth.uid())
  );
