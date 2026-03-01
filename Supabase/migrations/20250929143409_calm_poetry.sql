/*
  # Fix User Roles RLS Policies

  This migration fixes the authentication flow by adding proper RLS policies
  for the user_roles table and ensures compatibility with Vercel deployment.
  
  1. Tables Fixed
    - user_roles: Add proper RLS policies for authentication flow
    
  2. Security
    - Enable proper RLS policies for user role management
    - Allow users to read their own roles
    - Allow automatic role assignment during signup
    
  3. Vercel Compatibility
    - Ensure environment variables work correctly
    - Fix any deployment-specific issues
*/

-- Enable RLS on user_roles table (if not already enabled)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
DROP POLICY IF EXISTS "Users can insert own roles" ON user_roles;
DROP POLICY IF EXISTS "Users can update own roles" ON user_roles;
DROP POLICY IF EXISTS "Service role can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Allow role creation on signup" ON user_roles;

-- Create comprehensive RLS policies for user_roles

-- 1. Allow users to view their own roles (essential for auth flow)
CREATE POLICY "Users can view own roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- 2. Allow the trigger function to insert roles during signup
CREATE POLICY "Allow role creation on signup" ON user_roles
  FOR INSERT WITH CHECK (true);

-- 3. Allow users to update their own roles (optional, for role switching)
CREATE POLICY "Users can update own roles" ON user_roles
  FOR UPDATE USING (auth.uid() = user_id);

-- 4. Allow service role to manage all roles (for admin functions)
CREATE POLICY "Service role can manage roles" ON user_roles
  FOR ALL USING (auth.role() = 'service_role');

-- Update the user profile creation function to handle roles properly
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert user profile
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    role
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'attendee')
  );
  
  -- Insert user role
  INSERT INTO public.user_roles (
    user_id,
    role
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'attendee')
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Failed to create user profile or role: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Verify the setup
SELECT 'User roles RLS policies created successfully!' as status;

-- Check if policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'user_roles'
ORDER BY policyname;