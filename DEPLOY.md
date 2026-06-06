# 🚀 Deployment Guide — GitHub + Supabase + Vercel

Follow these steps in order. Takes ~15 minutes total.

---

## STEP 1 — Push to GitHub

```bash
# 1. Extract the zip, then open terminal inside the folder
cd grocery-whatsapp-platform

# 2. Initialize git and push
git init
git add .
git commit -m "Initial commit — Grocery WhatsApp Platform"

# 3. Create a new repo on github.com (name it: grocery-whatsapp-platform)
#    Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/grocery-whatsapp-platform.git
git branch -M main
git push -u origin main
```

---

## STEP 2 — Set up Supabase

### 2a. Create project
1. Go to https://supabase.com → **New Project**
2. Choose a name (e.g. `grocery-store`) and strong password
3. Select region closest to you (e.g. Mumbai/Singapore for India)
4. Wait ~2 min for provisioning

### 2b. Run database migration
1. In Supabase dashboard → **SQL Editor** → **New Query**
2. Open file: `supabase/migrations/001_initial_schema.sql`
3. Paste the entire content → click **Run**
4. You'll see: "Success. No rows returned" ✓

### 2c. Create Storage bucket
1. Left sidebar → **Storage** → **New bucket**
2. Name: `images`
3. Toggle **Public bucket** ON → **Create bucket**

### 2d. Get your API keys
Go to **Settings → API** and copy:
- `Project URL` → this is your `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role secret` key → this is your `SUPABASE_SERVICE_ROLE_KEY`

### 2e. Create your admin user
1. Left sidebar → **Authentication → Users → Add User**
2. Enter your email + a strong password → **Create User**
3. Copy the **User UID** (e.g. `a3f2b1c4-...`)
4. Go to **SQL Editor → New Query** and run:

```sql
INSERT INTO admin_users (id, email, name, role)
VALUES (
  'PASTE-YOUR-USER-UID-HERE',
  'your@email.com',
  'Your Name',
  'superadmin'
);
```

---

## STEP 3 — Deploy to Vercel

### 3a. Connect repo
1. Go to https://vercel.com → **Add New Project**
2. Click **Import Git Repository** → select `grocery-whatsapp-platform`
3. Framework: **Next.js** (auto-detected)

### 3b. Add Environment Variables
In Vercel's **Environment Variables** section, add these one by one:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service_role key |
| `NEXT_PUBLIC_STORE_NAME` | Your store name (e.g. `FreshMart`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number with country code, no `+` (e.g. `919876543210`) |

### 3c. Deploy
Click **Deploy** → wait ~2 minutes.

You'll get a URL like: `https://grocery-whatsapp-platform.vercel.app`

---

## STEP 4 — Add Supabase Domain to Allowed URLs

1. Supabase → **Authentication → URL Configuration**
2. Add your Vercel URL to **Redirect URLs**:
   ```
   https://grocery-whatsapp-platform.vercel.app/**
   ```
3. Set **Site URL** to: `https://grocery-whatsapp-platform.vercel.app`

---

## STEP 5 — Add GitHub Secrets (for CI)

In GitHub → your repo → **Settings → Secrets → Actions → New secret**:

Add these secrets so the CI build works:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_STORE_NAME`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

---

## ✅ You're Live!

| Page | URL |
|---|---|
| Customer Store | `https://your-app.vercel.app` |
| Admin Login | `https://your-app.vercel.app/admin/login` |
| Admin Dashboard | `https://your-app.vercel.app/admin` |

---

## 🔄 Future Deployments

Every `git push` to `main` automatically triggers a new Vercel deployment.

```bash
# Make changes, then:
git add .
git commit -m "your message"
git push
# Vercel auto-deploys in ~1 min
```

---

## 🆘 Troubleshooting

**Build fails on Vercel?**
- Check all env variables are set correctly (no extra spaces)
- Ensure Supabase project is active

**Admin login not working?**
- Verify your user UID is correct in the `admin_users` insert
- Check Supabase Auth → Users to confirm the user exists

**WhatsApp not opening?**
- Confirm `NEXT_PUBLIC_WHATSAPP_NUMBER` has no `+` sign and includes country code

**Images not uploading?**
- Confirm the `images` bucket exists and is set to **Public** in Supabase Storage
