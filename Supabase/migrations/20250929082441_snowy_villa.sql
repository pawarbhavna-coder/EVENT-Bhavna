/*
  # Fix User Creation Error

  This migration addresses the database error when creating new users.
  
  1. Database Issues Fixed
    - Ensure user_profiles table exists with correct structure
    - Fix RLS policies for user creation
    - Add proper trigger for automatic profile creation
    - Ensure proper foreign key relationships

  2. Security
    - Update RLS policies to allow user registration
    - Fix authentication flow issues
    - Ensure proper permissions for user creation

  3. Functions
    - Create or update user profile creation trigger
    - Fix any missing database functions
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function to get current user ID (fix if missing)
CREATE OR REPLACE FUNCTION uid() RETURNS uuid AS $$
  SELECT auth.uid()
$$ LANGUAGE sql STABLE;

-- Ensure user_profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email varchar(255) NOT NULL,
  full_name varchar(100),
  avatar_url text,
  bio text,
  company varchar(100),
  job_title varchar(100),
  phone varchar(20),
  website text,
  location varchar(100),
  timezone varchar(50) DEFAULT 'UTC',
  preferences jsonb DEFAULT '{}',
  role varchar(50) DEFAULT 'attendee' CHECK (role IN ('attendee', 'organizer', 'admin', 'speaker')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create or replace the trigger function for automatic profile creation
CREATE OR REPLACE FUNCTION create_user_profile()
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
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'attendee')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON user_profiles;

-- Create comprehensive RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow service role to insert profiles (for the trigger)
CREATE POLICY "Service role can insert profiles" ON user_profiles
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Create updated_at trigger for user_profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify the setup
SELECT 'User creation fix applied successfully!' as status;

-- Check if the trigger function exists
SELECT 'Trigger function exists: ' || CASE WHEN EXISTS (
  SELECT 1 FROM pg_proc WHERE proname = 'create_user_profile'
) THEN 'YES' ELSE 'NO' END as trigger_status;

-- Check if RLS is enabled
SELECT 'RLS enabled: ' || CASE WHEN rowsecurity THEN 'YES' ELSE 'NO' END as rls_status
FROM pg_tables WHERE tablename = 'user_profiles';