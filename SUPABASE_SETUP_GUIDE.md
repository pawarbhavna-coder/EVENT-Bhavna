# 🚀 Supabase Setup Guide — EventEase

Follow these steps **in order** to set up a fresh Supabase project for this app.

---

## Step 1 — Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Fill in project name, password, and region → click **Create project**
4. Wait for the project to finish provisioning (~1 min)

---

## Step 2 — Get Your Project URL & Anon Key

1. Go to **Project Settings → API**
2. Copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon / public key** (the long JWT token)
3. Open `src/lib/supabaseConfig.ts` and replace:
   ```ts
   const FALLBACK_URL = 'https://vjdsijuyzhhlofmlzexe.supabase.co'   // ← your URL
   const FALLBACK_ANON_KEY = 'eyJ...'                                  // ← your anon key
   ```

---

## Step 3 — Run SQL Migrations (in order)

Go to your Supabase Dashboard → **SQL Editor** and run each file below **one at a time**, in the exact order listed.

### 📁 `Supabase/Migration/` folder

| Order | File | What it does |
|-------|------|-------------|
| 1 | `001_initial_schema.sql` | Creates core tables: `events`, `speakers`, `blog_posts`, `sponsors`, `categories`, `event_speakers`, `event_sponsors` |
| 2 | `003_user_tables.sql` | Creates `user_profiles`, `event_attendees`, `event_favorites`, `event_reviews`, `notifications` |

### 📁 `Supabase/migrations/` folder (run after the above)

| Order | File | What it does |
|-------|------|-------------|
| 3 | `20250929081026_empty_tree.sql` | Base setup fixes |
| 4 | `20250929082441_snowy_villa.sql` | User profile creation trigger + RLS |
| 5 | `20250929132353_lucky_cell.sql` | Additional table fixes |
| 6 | `20250929132422_rapid_bread.sql` | Minor schema updates |
| 7 | `20250929133552_billowing_salad.sql` | RLS policy updates |
| 8 | `20250929133559_cool_tower.sql` | Schema patch |
| 9 | `20250929143409_calm_poetry.sql` | Event-related updates |
| 10 | `20250929144258_muddy_sea.sql` | Full event schema with organizer fields |
| 11 | `20250929145241_rustic_spring.sql` | Additional columns |
| 12 | `20250929145246_maroon_villa.sql` | Final schema patch |
| 13 | `20251004143900_create_event_schedule.sql` | Creates `event_schedule` table |
| 14 | `20251005071700_create_event_tickets.sql` | Creates `event_tickets` table |
| 15 | `20251005120000_fix_speaker_sponsor_rls_policies.sql` | Fixes speaker/sponsor RLS |
| 16 | `20251006000000_add_organizer_info_to_events.sql` | Adds organizer info columns to events |
| 17 | `20251007000000_add_event_details_fields.sql` | Adds extra detail fields to events |

### 📁 Root folder — run last

| Order | File | What it does |
|-------|------|-------------|
| 18 | `FIX_ALL_DATABASE_ISSUES.sql` | Fixes all RLS policies for organizer + attendee flows, adds auto-profile trigger |
| 19 | `fix-anon-permissions.sql` | Grants public (anon) read access to events, speakers, blog — **required for public pages to load** |
| 20 | `fix-storage-rls.sql` | Fixes storage bucket RLS so images can be uploaded and read |

> **Tip:** If a file gives an error saying a table already exists, that's fine — just continue to the next file.

---

## Step 4 — Create Storage Buckets

Go to your Supabase Dashboard → **Storage** → Click **New Bucket** and create these 4 buckets:

| Bucket Name | Public? | Used For |
|-------------|---------|----------|
| `event-images` | ✅ Yes (Public) | Event cover images & gallery |
| `profile-pictures` | ✅ Yes (Public) | User avatar photos |
| `banners` | ✅ Yes (Public) | Event banner images |
| `documents` | ❌ No (Private) | Event documents/attachments |

**How to create each bucket:**
1. Click **New Bucket**
2. Enter the bucket name exactly as shown above
3. Toggle **Public bucket** on/off as shown
4. Click **Create bucket**

After creating all 4 buckets, run **`fix-storage-rls.sql`** in the SQL Editor (step 20 above) to apply the correct access policies.

---

## Step 5 — Set Admin User

1. Go to **Authentication → Users** in Supabase dashboard
2. After your friend signs up through the app, find their user
3. Go to **SQL Editor** and run:
   ```sql
   UPDATE user_profiles
   SET role = 'admin'
   WHERE email = 'your-email@example.com';
   ```
   Replace with the actual email address.

---

## Step 6 — Run the App Locally

```bash
npm install
npm run dev
```

The app will be running at **http://localhost:5000**

---

## ✅ Checklist Summary

- [ ] Created Supabase project
- [ ] Updated URL + anon key in `src/lib/supabaseConfig.ts`
- [ ] Ran `001_initial_schema.sql`
- [ ] Ran `003_user_tables.sql`
- [ ] Ran all 15 migration files from `Supabase/migrations/`
- [ ] Ran `FIX_ALL_DATABASE_ISSUES.sql`
- [ ] Ran `fix-anon-permissions.sql`
- [ ] Ran `fix-storage-rls.sql`
- [ ] Created 4 storage buckets (`event-images`, `profile-pictures`, `banners`, `documents`)
- [ ] Set admin role for admin user
- [ ] `npm install && npm run dev` works
