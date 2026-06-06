-- ============================================================
-- Grocery Store WhatsApp Platform - Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- CATEGORIES
-- ============================================================
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  image_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_categories_slug on categories(slug);
create index idx_categories_display_order on categories(display_order);

-- ============================================================
-- PRODUCTS
-- ============================================================
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  unit text not null default 'piece',
  image_url text,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  stock_quantity integer,
  created_at timestamptz not null default now()
);

create index idx_products_category_id on products(category_id);
create index idx_products_slug on products(slug);
create index idx_products_is_featured on products(is_featured);
create index idx_products_is_available on products(is_available);

-- ============================================================
-- CUSTOMERS
-- ============================================================
create table if not exists customers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  address text,
  created_at timestamptz not null default now()
);

create index idx_customers_phone on customers(phone);
create index idx_customers_user_id on customers(user_id);

-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customers(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  delivery_slot text,
  status text not null default 'pending'
    check (status in ('pending','confirmed','preparing','out_for_delivery','delivered','cancelled')),
  total_amount numeric(10,2) not null default 0,
  notes text,
  whatsapp_sent boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_orders_status on orders(status);
create index idx_orders_customer_id on orders(customer_id);
create index idx_orders_created_at on orders(created_at desc);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  product_price numeric(10,2) not null,
  quantity integer not null check (quantity > 0),
  subtotal numeric(10,2) not null
);

create index idx_order_items_order_id on order_items(order_id);

-- ============================================================
-- BANNERS
-- ============================================================
create table if not exists banners (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  subtitle text,
  image_url text,
  link_url text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_banners_is_active on banners(is_active);
create index idx_banners_display_order on banners(display_order);

-- ============================================================
-- ADMIN USERS (profile table — extends Supabase auth.users)
-- ============================================================
create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  role text not null default 'admin'
    check (role in ('superadmin', 'admin')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Public read for storefront
alter table categories enable row level security;
alter table products enable row level security;
alter table banners enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table customers enable row level security;
alter table admin_users enable row level security;

-- Categories: public read
create policy "Public read categories" on categories for select using (is_active = true);
create policy "Admin all categories" on categories for all using (
  exists (select 1 from admin_users where id = auth.uid())
);

-- Products: public read available
create policy "Public read products" on products for select using (is_available = true);
create policy "Admin all products" on products for all using (
  exists (select 1 from admin_users where id = auth.uid())
);

-- Banners: public read active
create policy "Public read banners" on banners for select using (is_active = true);
create policy "Admin all banners" on banners for all using (
  exists (select 1 from admin_users where id = auth.uid())
);

-- Orders: customers can insert & view own, admins all
create policy "Anyone can insert orders" on orders for insert with check (true);
create policy "Admin all orders" on orders for all using (
  exists (select 1 from admin_users where id = auth.uid())
);

-- Order items: insert for anyone, admin all
create policy "Anyone can insert order_items" on order_items for insert with check (true);
create policy "Admin all order_items" on order_items for all using (
  exists (select 1 from admin_users where id = auth.uid())
);

-- Customers: self manage + admin all
create policy "Customers can insert themselves" on customers for insert with check (true);
create policy "Customers can read own" on customers for select using (
  user_id = auth.uid() or
  exists (select 1 from admin_users where id = auth.uid())
);
create policy "Admin all customers" on customers for all using (
  exists (select 1 from admin_users where id = auth.uid())
);

-- Admin users: only admins
create policy "Admin read self" on admin_users for select using (id = auth.uid());
create policy "Superadmin all" on admin_users for all using (
  exists (select 1 from admin_users where id = auth.uid() and role = 'superadmin')
);

-- ============================================================
-- SEED DATA - Sample categories and products
-- ============================================================
insert into categories (name, slug, display_order, is_active) values
  ('Fruits & Vegetables', 'fruits-vegetables', 1, true),
  ('Dairy & Eggs', 'dairy-eggs', 2, true),
  ('Beverages', 'beverages', 3, true),
  ('Snacks', 'snacks', 4, true),
  ('Staples & Grains', 'staples-grains', 5, true),
  ('Personal Care', 'personal-care', 6, true);

-- Sample banner
insert into banners (title, subtitle, is_active, display_order) values
  ('Fresh Groceries Delivered', 'Order via WhatsApp — fast, easy, local', true, 1),
  ('Daily Fresh Vegetables', 'Sourced from local farms every morning', true, 2);
