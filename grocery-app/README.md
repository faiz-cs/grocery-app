# 🛒 Grocery Store WhatsApp Ordering Platform

A production-ready Next.js + Supabase grocery ordering platform. Customers browse products, add to cart, and place orders via WhatsApp. Store owners manage everything through a clean admin dashboard.

---

## ✨ Features

**Customer Storefront**
- Mobile-first responsive design (PWA)
- Browse categories & products
- Product search
- Cart with persistent localStorage
- Checkout → WhatsApp order generation
- Order history

**Admin Dashboard** (`/admin`)
- Secure login via Supabase Auth
- Product CRUD with image upload
- Category management
- Order management with status updates
- Customer directory
- Banner/promotion management
- Analytics overview

---

## 🚀 Getting Started

### 1. Clone and install

```bash
git clone <your-repo>
cd grocery-whatsapp-platform
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full migration:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Go to **Storage** → Create a bucket named `images` (set to public)

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

NEXT_PUBLIC_STORE_NAME=Your Store Name
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210   # Country code + number, no +
```

### 4. Create your first admin user

In the Supabase dashboard:

1. **Authentication → Users → Add User** — create an account with your email/password
2. **SQL Editor** — insert into `admin_users`:

```sql
INSERT INTO admin_users (id, email, name, role)
VALUES (
  '<user-id-from-auth>',
  'admin@yourstore.com',
  'Your Name',
  'superadmin'
);
```

### 5. Run locally

```bash
npm run dev
```

- Storefront: http://localhost:3000
- Admin: http://localhost:3000/admin

---

## 📁 Project Structure

```
app/
├── (store)/                # Customer-facing pages
│   ├── page.tsx            # Homepage with banners & featured products
│   ├── categories/         # All categories
│   ├── category/[slug]/    # Products by category
│   ├── product/[slug]/     # Product detail
│   ├── search/             # Product search
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout + WhatsApp redirect
│   └── orders/             # Order history
├── admin/                  # Admin dashboard
│   ├── login/              # Admin login
│   ├── page.tsx            # Dashboard overview
│   ├── products/           # Product CRUD
│   ├── categories/         # Category CRUD
│   ├── orders/             # Order management
│   ├── customers/          # Customer directory
│   └── banners/            # Banner management
components/
├── store/                  # Storefront components
│   ├── Header.tsx
│   ├── BottomNav.tsx
│   ├── ProductCard.tsx
│   └── AddToCartButton.tsx
└── admin/                  # Admin components
    ├── AdminSidebar.tsx
    ├── ProductForm.tsx
    ├── CategoryForm.tsx
    └── BannerForm.tsx
lib/
├── cart.tsx                # Cart context + WhatsApp message generator
├── utils.ts                # Helpers, formatters
└── supabase/
    ├── client.ts           # Browser client
    └── server.ts           # Server client
types/index.ts              # TypeScript interfaces
supabase/migrations/        # Database schema
middleware.ts               # Auth protection for /admin
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Ordering | WhatsApp Deep Link |
| Deployment | Vercel |

---

## 🚢 Deploy to Vercel

```bash
npx vercel
```

Add all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

## 📱 WhatsApp Setup

The platform uses WhatsApp deep linking (`wa.me/{number}?text=...`). No API or business account required.

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to your store's WhatsApp number in international format without `+`:
- India: `919876543210`
- US: `12125551234`

---

## 🔐 Security Notes

- Admin routes are protected by Supabase Auth + middleware
- Row Level Security (RLS) is enabled on all tables
- Only users in the `admin_users` table can access admin features
- Customers can only read/insert their own data

---

## 📄 License

MIT
