# Deployment Checklist for EventEase

## Pre-Deployment Steps

### 1. Database Setup ✅
- [x] Run all database migrations
- [ ] **CRITICAL: Run the new `fix_user_roles_policies.sql` migration**
- [x] Verify all tables exist
- [x] Check RLS policies are configured

### 2. Environment Variables
- [ ] Set `VITE_SUPABASE_URL` in Vercel
- [ ] Set `VITE_SUPABASE_ANON_KEY` in Vercel
- [ ] Verify variables are set for Production environment
- [ ] Test variables are accessible in build

### 3. Authentication Flow
- [ ] Test user registration
- [ ] Test user login
- [ ] Test role assignment (attendee/organizer)
- [ ] Test protected routes
- [ ] Test logout functionality

## Database Migration Required

**IMPORTANT:** Before deploying, you MUST run this SQL in your Supabase dashboard:

1. Go to: https://supabase.com/dashboard/project/vjdsijuyzhhlofmlzexe/sql
2. Copy and paste the entire contents of `supabase/migrations/fix_user_roles_policies.sql`
3. Click "Run" to execute the migration

This migration fixes the critical issue where `user_roles` table has RLS enabled but no policies, which blocks authentication.

## Vercel Environment Variables

Set these in your Vercel dashboard under Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://vjdsijuyzhhlofmlzexe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZHNpanV5emhobG9mbWx6ZXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NzcwNDQsImV4cCI6MjA3MTQ1MzA0NH0.T7pK7N0whtHSkXIXcttNFfyQMqtHlIQbVhYAe7s6UrM
```

## Post-Deployment Testing

### 1. Authentication Tests
- [ ] Sign up new user
- [ ] Sign in existing user
- [ ] Test role-based navigation
- [ ] Test protected routes
- [ ] Test logout

### 2. Database Tests
- [ ] Create new event (organizer)
- [ ] View events (attendee)
- [ ] Test user profile loading
- [ ] Test role switching

### 3. Error Handling
- [ ] Test with invalid credentials
- [ ] Test network disconnection
- [ ] Test database connection issues

## Common Issues and Solutions

### Issue: "Missing Supabase environment variables"
**Solution:** Ensure environment variables are set in Vercel dashboard and redeploy

### Issue: "No data will be selectable via Supabase APIs because RLS is enabled but no policies have been created yet"
**Solution:** Run the `fix_user_roles_policies.sql` migration

### Issue: "Profile Not Found" error
**Solution:** Check that the user profile creation trigger is working properly

### Issue: Authentication redirects not working
**Solution:** Verify that role-based routing is configured correctly

## Deployment Commands

```bash
# Build and test locally first
npm run build
npm run preview

# Deploy to Vercel
vercel --prod

# Check deployment logs
vercel logs [deployment-url]
```

## Monitoring

After deployment, monitor:
- User registration success rate
- Authentication error rates
- Database connection stability
- Page load times
- Error logs in Vercel dashboard

## Rollback Plan

If issues occur:
1. Check Vercel function logs
2. Verify environment variables
3. Test database connectivity
4. Rollback to previous deployment if needed: `vercel rollback`

Remember: The authentication flow depends on proper RLS policies, so the database migration is critical for deployment success.