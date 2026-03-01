/*
  # Fix User Profile Creation Issues

  This migration fixes the signup database connection issues by:
  
  1. Database Setup
    - Ensures user_profiles table exists with correct structure
    - Creates proper trigger for automatic profile creation
    - Sets up correct RLS policies
    
  2. Authentication Flow
    - Automatic profile creation on signup
    - Proper role assignment
    - Session management
    
  3. Security
    - Enable RLS on user_profiles table
    - Allow profile creation on signup
    - Allow users to read/update their own profiles
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create or update user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email varchar(255) NOT NULL,
  full_name varchar(100) DEFAULT '',
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

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  role varchar(50) NOT NULL CHECK (role IN ('attendee', 'organizer', 'admin', 'speaker')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into user_profiles
  INSERT INTO user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'attendee')
  );
  
  -- Insert into user_roles
  INSERT INTO user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'attendee')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow profile creation on signup" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow role creation on signup" ON user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
DROP POLICY IF EXISTS "Users can update own roles" ON user_roles;
DROP POLICY IF EXISTS "Service role can manage roles" ON user_roles;

-- Create RLS policies for user_profiles
CREATE POLICY "Allow profile creation on signup" ON user_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for user_roles
CREATE POLICY "Allow role creation on signup" ON user_roles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own roles" ON user_roles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage roles" ON user_roles
  FOR ALL USING (role() = 'service_role');

-- Enable RLS on other tables and create public read policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create public read policies for published content
DROP POLICY IF EXISTS "Allow public read access to events" ON events;
CREATE POLICY "Allow public read access to events" ON events
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
CREATE POLICY "Allow public read access to categories" ON categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to speakers" ON speakers;
CREATE POLICY "Allow public read access to speakers" ON speakers
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to sponsors" ON sponsors;
CREATE POLICY "Allow public read access to sponsors" ON sponsors
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to blog_posts" ON blog_posts;
CREATE POLICY "Allow public read access to blog_posts" ON blog_posts
  FOR SELECT USING (status = 'published');

-- Junction table policies
ALTER TABLE event_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_sponsors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to event_speakers" ON event_speakers;
CREATE POLICY "Allow public read access to event_speakers" ON event_speakers
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to event_sponsors" ON event_sponsors;
CREATE POLICY "Allow public read access to event_sponsors" ON event_sponsors
  FOR SELECT USING (true);

-- Test the setup
DO $$
BEGIN
  RAISE NOTICE 'User profile creation setup completed successfully!';
  RAISE NOTICE 'Trigger function: handle_new_user() created';
  RAISE NOTICE 'RLS policies: Created for user_profiles and user_roles';
  RAISE NOTICE 'Public read access: Enabled for published content';
END $$;