/*
  # Create User Profile Trigger

  This migration creates a database function and trigger to automatically create
  user profiles when new users sign up through Supabase Auth.

  1. Functions
    - create_user_profile(): Automatically creates profile entries
    
  2. Triggers
    - on_auth_user_created: Triggers profile creation on user signup
    
  3. Security
    - Ensures every authenticated user has a profile
    - Handles role assignment from signup metadata
*/

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (
    id,
    email,
    full_name,
    company,
    role
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'company', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'attendee')
  );
  
  -- Also create a user role entry
  INSERT INTO user_roles (
    user_id,
    role
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'attendee')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Update user_profiles table to include role column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN role varchar(50) DEFAULT 'attendee';
  END IF;
END $$;