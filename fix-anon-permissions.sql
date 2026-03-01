-- =====================================================
-- FIX: Grant ANON role access to public schema + tables
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- Safe version: uses DO blocks to skip tables that don't exist
-- =====================================================

-- Step 1: Grant schema usage to anon
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 2: Grant permissions on core tables (these must exist)
GRANT SELECT ON events    TO anon;
GRANT SELECT ON speakers  TO anon;
GRANT SELECT ON blog_posts TO anon;

GRANT ALL ON events         TO authenticated;
GRANT ALL ON speakers       TO authenticated;
GRANT ALL ON blog_posts     TO authenticated;
GRANT ALL ON user_profiles  TO authenticated;
GRANT ALL ON event_attendees TO authenticated;

-- Step 3: Optional tables — grant only if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_speakers' AND table_schema = 'public') THEN
    EXECUTE 'GRANT SELECT ON event_speakers TO anon';
    EXECUTE 'GRANT ALL ON event_speakers TO authenticated';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sponsors' AND table_schema = 'public') THEN
    EXECUTE 'GRANT SELECT ON sponsors TO anon';
    EXECUTE 'GRANT ALL ON sponsors TO authenticated';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_sponsors' AND table_schema = 'public') THEN
    EXECUTE 'GRANT SELECT ON event_sponsors TO anon';
    EXECUTE 'GRANT ALL ON event_sponsors TO authenticated';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_favorites' AND table_schema = 'public') THEN
    EXECUTE 'GRANT ALL ON event_favorites TO authenticated';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_reviews' AND table_schema = 'public') THEN
    EXECUTE 'GRANT SELECT ON event_reviews TO anon';
    EXECUTE 'GRANT ALL ON event_reviews TO authenticated';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications' AND table_schema = 'public') THEN
    EXECUTE 'GRANT ALL ON notifications TO authenticated';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_tickets' AND table_schema = 'public') THEN
    EXECUTE 'GRANT SELECT ON event_tickets TO anon';
    EXECUTE 'GRANT ALL ON event_tickets TO authenticated';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_schedule' AND table_schema = 'public') THEN
    EXECUTE 'GRANT SELECT ON event_schedule TO anon';
    EXECUTE 'GRANT ALL ON event_schedule TO authenticated';
  END IF;
END $$;

-- Step 4: RLS policies for core tables

-- events: public can see published
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public anon can view published events" ON events;
CREATE POLICY "Public anon can view published events" ON events
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Organizers can view own events" ON events;
CREATE POLICY "Organizers can view own events" ON events
  FOR SELECT USING (auth.uid() = organizer_id);

DROP POLICY IF EXISTS "Organizers can create events" ON events;
CREATE POLICY "Organizers can create events" ON events
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

DROP POLICY IF EXISTS "Organizers can update own events" ON events;
CREATE POLICY "Organizers can update own events" ON events
  FOR UPDATE USING (auth.uid() = organizer_id);

DROP POLICY IF EXISTS "Organizers can delete own events" ON events;
CREATE POLICY "Organizers can delete own events" ON events
  FOR DELETE USING (auth.uid() = organizer_id);

-- speakers: fully public read
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view speakers" ON speakers;
CREATE POLICY "Anyone can view speakers" ON speakers
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated can manage speakers" ON speakers;
CREATE POLICY "Authenticated can manage speakers" ON speakers
  FOR ALL USING (auth.role() = 'authenticated');

-- blog_posts: public can read published
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
CREATE POLICY "Anyone can view published blog posts" ON blog_posts
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Authenticated can manage blog posts" ON blog_posts;
CREATE POLICY "Authenticated can manage blog posts" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

-- Step 5: RLS for optional tables (safe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_speakers' AND table_schema = 'public') THEN
    EXECUTE 'ALTER TABLE event_speakers ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can view event speakers" ON event_speakers';
    EXECUTE 'CREATE POLICY "Anyone can view event speakers" ON event_speakers FOR SELECT USING (true)';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sponsors' AND table_schema = 'public') THEN
    EXECUTE 'ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can view sponsors" ON sponsors';
    EXECUTE 'CREATE POLICY "Anyone can view sponsors" ON sponsors FOR SELECT USING (true)';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_sponsors' AND table_schema = 'public') THEN
    EXECUTE 'ALTER TABLE event_sponsors ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can view event sponsors" ON event_sponsors';
    EXECUTE 'CREATE POLICY "Anyone can view event sponsors" ON event_sponsors FOR SELECT USING (true)';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_reviews' AND table_schema = 'public') THEN
    EXECUTE 'ALTER TABLE event_reviews ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can view event reviews" ON event_reviews';
    EXECUTE 'CREATE POLICY "Anyone can view event reviews" ON event_reviews FOR SELECT USING (true)';
  END IF;
END $$;

SELECT 'anon permissions fixed successfully!' AS status;
