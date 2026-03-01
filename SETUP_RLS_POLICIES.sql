-- =====================================================
-- CRITICAL FIX: Row Level Security Policies for user_profiles
-- Run this in your Supabase SQL Editor to fix the 403 error
-- =====================================================

-- First, ensure the table has a role column
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'attendee';

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Create policies to allow users to access their own profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create or replace the trigger function for auto-creating profiles
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'attendee')
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, just return
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Also add RLS policies for user_roles table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
    ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
    DROP POLICY IF EXISTS "Users can insert own roles" ON user_roles;
    
    CREATE POLICY "Users can view own roles" ON user_roles
      FOR SELECT USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can insert own roles" ON user_roles
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON user_roles TO authenticated;

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE 'RLS policies successfully applied! Your 403 errors should be fixed now.';
END $$;
