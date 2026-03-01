-- =====================================================
-- COMPREHENSIVE DATABASE FIX
-- This fixes all RLS policies for organizer and attendee flows
-- Run this in your Supabase SQL Editor
-- =====================================================

-- ============ PART 1: Fix user_profiles and user_roles ============

-- Ensure role column exists
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'attendee';

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Fix user_roles if it exists
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

-- ============ PART 2: Fix EVENTS table (Critical for Organizers) ============

-- Ensure organizer_id column exists in events
ALTER TABLE events ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES auth.users(id);

-- Enable RLS on events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view published events" ON events;
DROP POLICY IF EXISTS "Organizers can view own events" ON events;
DROP POLICY IF EXISTS "Organizers can create events" ON events;
DROP POLICY IF EXISTS "Organizers can update own events" ON events;
DROP POLICY IF EXISTS "Organizers can delete own events" ON events;

-- Create comprehensive policies for events
-- Public can view published events
CREATE POLICY "Anyone can view published events" ON events
  FOR SELECT USING (status = 'published');

-- Organizers can view all their own events (any status)
CREATE POLICY "Organizers can view own events" ON events
  FOR SELECT USING (auth.uid() = organizer_id);

-- Organizers can create events
CREATE POLICY "Organizers can create events" ON events
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

-- Organizers can update their own events
CREATE POLICY "Organizers can update own events" ON events
  FOR UPDATE USING (auth.uid() = organizer_id);

-- Organizers can delete their own events
CREATE POLICY "Organizers can delete own events" ON events
  FOR DELETE USING (auth.uid() = organizer_id);

-- ============ PART 3: Fix EVENT_ATTENDEES table (Critical for Attendees) ============

-- Ensure event_attendees table RLS is properly set
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own registrations" ON event_attendees;
DROP POLICY IF EXISTS "Users can view own event registrations" ON event_attendees;
DROP POLICY IF EXISTS "Users can register for events" ON event_attendees;
DROP POLICY IF EXISTS "Users can update own registrations" ON event_attendees;
DROP POLICY IF EXISTS "Organizers can view event attendees" ON event_attendees;

-- Create comprehensive policies
-- Users can view their own registrations
CREATE POLICY "Users can view own registrations" ON event_attendees
  FOR SELECT USING (auth.uid() = user_id);

-- Organizers can view attendees for their events
CREATE POLICY "Organizers can view event attendees" ON event_attendees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_attendees.event_id 
      AND events.organizer_id = auth.uid()
    )
  );

-- Users can register for events
CREATE POLICY "Users can register for events" ON event_attendees
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own registrations
CREATE POLICY "Users can update own registrations" ON event_attendees
  FOR UPDATE USING (auth.uid() = user_id);

-- ============ PART 4: Fix OTHER TABLES ============

-- Enable RLS on categories (public read)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- Enable RLS on speakers (public read)
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view speakers" ON speakers;
CREATE POLICY "Anyone can view speakers" ON speakers
  FOR SELECT USING (true);

-- Enable RLS on blog_posts (public read for published)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
CREATE POLICY "Anyone can view published blog posts" ON blog_posts
  FOR SELECT USING (status = 'published');

-- Enable RLS on event_speakers (public read)
ALTER TABLE event_speakers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view event speakers" ON event_speakers;
CREATE POLICY "Anyone can view event speakers" ON event_speakers
  FOR SELECT USING (true);

-- Enable RLS on sponsors (public read)
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view sponsors" ON sponsors;
CREATE POLICY "Anyone can view sponsors" ON sponsors
  FOR SELECT USING (true);

-- Enable RLS on event_sponsors (public read)
ALTER TABLE event_sponsors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view event sponsors" ON event_sponsors;
CREATE POLICY "Anyone can view event sponsors" ON event_sponsors
  FOR SELECT USING (true);

-- ============ PART 5: Fix EVENT_FAVORITES and EVENT_REVIEWS ============

-- event_favorites
ALTER TABLE event_favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own favorites" ON event_favorites;
DROP POLICY IF EXISTS "Users can manage own favorites" ON event_favorites;

CREATE POLICY "Users can view own favorites" ON event_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites" ON event_favorites
  FOR ALL USING (auth.uid() = user_id);

-- event_reviews
ALTER TABLE event_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view all reviews" ON event_reviews;
DROP POLICY IF EXISTS "Users can create own reviews" ON event_reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON event_reviews;

CREATE POLICY "Users can view all reviews" ON event_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create own reviews" ON event_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON event_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- ============ PART 6: Fix NOTIFICATIONS ============

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ============ PART 7: Auto-create profile trigger ============

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'attendee')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- ============ PART 8: Grant permissions ============

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON events TO authenticated;
GRANT ALL ON event_attendees TO authenticated;
GRANT ALL ON event_favorites TO authenticated;
GRANT ALL ON event_reviews TO authenticated;
GRANT ALL ON notifications TO authenticated;
GRANT SELECT ON categories TO authenticated;
GRANT SELECT ON speakers TO authenticated;
GRANT SELECT ON blog_posts TO authenticated;

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE '✅ All database policies fixed! Organizer and attendee flows should work now.';
END $$;
