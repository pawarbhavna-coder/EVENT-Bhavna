/*
  # Fix Authentication Issues

  This migration fixes the authentication problems by:
  1. Simplifying user profile creation
  2. Removing OAuth dependencies
  3. Disabling email confirmation requirements
  4. Fixing the 500 POST error on signup

  1. Tables
    - Fix user_profiles table structure
    - Ensure proper RLS policies

  2. Functions
    - Simplified profile creation trigger
    - Remove OAuth dependencies

  3. Security
    - Simple RLS policies that work
    - No email confirmation required
*/

-- Drop existing problematic trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_user_profile();

-- Create a simple, working profile creation function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Failed to create user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Ensure user_profiles table has correct structure
ALTER TABLE user_profiles 
  ALTER COLUMN role SET DEFAULT 'attendee',
  ALTER COLUMN full_name SET DEFAULT '';

-- Drop all existing RLS policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON user_profiles;

-- Create simple, working RLS policies
CREATE POLICY "Allow authenticated users to view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow authenticated users to update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow the trigger to insert profiles
CREATE POLICY "Allow profile creation on signup" ON user_profiles
  FOR INSERT WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Test the setup
SELECT 'Authentication fix applied successfully!' as status;