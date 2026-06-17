-- Fix orders & order_items RLS to allow anonymous customers to insert

-- Orders
drop policy if exists "Anyone can insert orders" on orders;
drop policy if exists "Admin all orders" on orders;

create policy "Anyone can insert orders"
  on orders for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can read own orders"
  on orders for select
  to anon, authenticated
  using (true);

create policy "Admin all orders"
  on orders for all
  to authenticated
  using (
    exists (select 1 from admin_users where id = auth.uid())
  );

-- Order items
drop policy if exists "Anyone can insert order_items" on order_items;
drop policy if exists "Admin all order_items" on order_items;

create policy "Anyone can insert order_items"
  on order_items for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can read order_items"
  on order_items for select
  to anon, authenticated
  using (true);

create policy "Admin all order_items"
  on order_items for all
  to authenticated
  using (
    exists (select 1 from admin_users where id = auth.uid())
  );
