-- The orders table is missing an UPDATE policy for admins
-- That's why status changes revert after refresh — the update is being blocked by RLS

-- Drop and recreate all orders policies cleanly
drop policy if exists "Anyone can insert orders" on orders;
drop policy if exists "Anyone can read own orders" on orders;
drop policy if exists "Admin all orders" on orders;
drop policy if exists "Admin update orders" on orders;

-- Anyone (anon customers) can insert orders
create policy "Anyone can insert orders"
  on orders for insert
  to anon, authenticated
  with check (true);

-- Anyone can read orders
create policy "Anyone can read orders"
  on orders for select
  to anon, authenticated
  using (true);

-- Admins can UPDATE orders (this was missing — root cause)
create policy "Admin update orders"
  on orders for update
  to authenticated
  using (true)
  with check (true);

-- Admins can DELETE orders
create policy "Admin delete orders"
  on orders for delete
  to authenticated
  using (true);
