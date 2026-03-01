# Vercel Deployment Guide for EventEase

## Environment Variables Setup

When deploying to Vercel, you need to set up the following environment variables in your Vercel dashboard:

### Required Environment Variables

1. **VITE_SUPABASE_URL**
   - Value: `https://vjdsijuyzhhlofmlzexe.supabase.co`
   - Description: Your Supabase project URL

2. **VITE_SUPABASE_ANON_KEY**
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZHNpanV5emhobG9mbWx6ZXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NzcwNDQsImV4cCI6MjA3MTQ1MzA0NH0.T7pK7N0whtHSkXIXcttNFfyQMqtHlIQbVhYAe7s6UrM`
   - Description: Your Supabase anonymous key

### How to Set Environment Variables in Vercel

1. **Via Vercel Dashboard:**
   - Go to your project in Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Add each variable with the values above
   - Make sure to set them for all environments (Production, Preview, Development)

2. **Via Vercel CLI:**
   ```bash
   vercel env add VITE_SUPABASE_URL
   # Enter the URL when prompted
   
   vercel env add VITE_SUPABASE_ANON_KEY
   # Enter the key when prompted
   ```

### Database Setup Required

Before deploying, make sure you've run the database migration to fix the user roles policies:

1. Go to your Supabase SQL Editor: https://supabase.com/dashboard/project/vjdsijuyzhhlofmlzexe/sql
2. Run the contents of `supabase/migrations/fix_user_roles_policies.sql`

### Deployment Steps

1. **Set Environment Variables** (as described above)
2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```
3. **Test Authentication** on the deployed site
4. **Verify Database Connection** works correctly

### Troubleshooting

#### Authentication Not Working
- Check that environment variables are set correctly in Vercel
- Verify the Supabase URL and key are correct
- Check browser console for any CORS or network errors

#### Database Connection Issues
- Ensure the database migration has been run
- Check that RLS policies are properly configured
- Verify that the user_roles table has the correct policies

#### Environment Variable Issues
- Make sure variable names start with `VITE_` (required for Vite)
- Check that variables are set for the correct environment (Production/Preview)
- Redeploy after adding environment variables

### Security Notes

- Never commit actual environment variables to your repository
- Use Vercel's environment variable system for production
- The provided keys are for your specific Supabase project
- Consider rotating keys periodically for enhanced security

### Testing the Deployment

After deployment, test these key features:
1. User registration (sign up)
2. User login (sign in)
3. Profile creation and role assignment
4. Navigation between different user roles
5. Database operations (creating events, etc.)

If any issues occur, check the Vercel function logs and browser console for detailed error messages.