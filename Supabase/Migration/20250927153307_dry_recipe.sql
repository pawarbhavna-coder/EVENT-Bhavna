/*
  # Database Verification and Setup

  This migration verifies and sets up the complete database schema for EventEase.
  
  1. Tables Created/Verified
    - user_profiles: User profile information with RLS
    - user_roles: Role-based access control
    - categories: Event categories
    - events: Main events table
    - speakers: Speaker information
    - event_speakers: Event-speaker relationships
    - sponsors: Sponsor information  
    - event_sponsors: Event-sponsor relationships
    - event_attendees: Event registrations with RLS
    - event_favorites: User favorites with RLS
    - event_reviews: Event reviews with RLS
    - notifications: User notifications with RLS
    - user_sessions: Session management with RLS
    - blog_posts: Blog content

  2. Security
    - Enable RLS on all user-related tables
    - Proper policies for data access control
    - User authentication integration

  3. Functions
    - Updated timestamp triggers
    - User ID helper function
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function to get current user ID
CREATE OR REPLACE FUNCTION uid() RETURNS uuid AS $$
  SELECT auth.uid()
$$ LANGUAGE sql STABLE;

-- Updated timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(100) UNIQUE NOT NULL,
  description text,
  color varchar(7) DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now()
);

-- User profiles table (extends Supabase auth.users)
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  role varchar(50) NOT NULL CHECK (role IN ('attendee', 'organizer', 'admin', 'speaker')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title varchar(200) NOT NULL,
  description text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  location varchar(200) NOT NULL,
  category varchar(100) NOT NULL REFERENCES categories(name),
  status varchar(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  organizer_id uuid REFERENCES user_profiles(id),
  max_attendees integer,
  price numeric(10,2) DEFAULT 0.00,
  image_url text,
  venue_name varchar(200),
  venue_address text,
  is_online boolean DEFAULT false,
  online_link text
);

-- Speakers table
CREATE TABLE IF NOT EXISTS speakers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(100) NOT NULL,
  bio text NOT NULL,
  title varchar(100) NOT NULL,
  company varchar(100) NOT NULL,
  image_url text,
  social_linkedin text,
  social_twitter text,
  social_website text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event speakers junction table
CREATE TABLE IF NOT EXISTS event_speakers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  speaker_id uuid NOT NULL REFERENCES speakers(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, speaker_id)
);

-- Sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(100) NOT NULL,
  logo_url text NOT NULL,
  website_url text,
  description text,
  tier varchar(20) NOT NULL CHECK (tier IN ('platinum', 'gold', 'silver', 'bronze')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event sponsors junction table
CREATE TABLE IF NOT EXISTS event_sponsors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  sponsor_id uuid NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, sponsor_id)
);

-- Event attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  registration_date timestamptz DEFAULT now(),
  status varchar(20) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled', 'waitlist')),
  ticket_type varchar(50),
  payment_status varchar(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_amount numeric(10,2),
  check_in_time timestamptz,
  notes text,
  UNIQUE(event_id, user_id)
);

-- Event favorites table
CREATE TABLE IF NOT EXISTS event_favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Event reviews table
CREATE TABLE IF NOT EXISTS event_reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  title varchar(200) NOT NULL,
  message text NOT NULL,
  type varchar(50) NOT NULL CHECK (type IN ('event_reminder', 'event_update', 'new_event', 'payment', 'system')),
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz,
  action_url text
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_token varchar(255) UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_activity timestamptz DEFAULT now(),
  ip_address inet,
  user_agent text
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title varchar(200) NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  author varchar(100) NOT NULL,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  image_url text,
  slug varchar(200) UNIQUE NOT NULL,
  status varchar(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_id ON event_attendees(user_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_status ON event_attendees(status);

CREATE INDEX IF NOT EXISTS idx_event_favorites_user_id ON event_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_event_favorites_event_id ON event_favorites(event_id);

CREATE INDEX IF NOT EXISTS idx_event_reviews_event_id ON event_reviews(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reviews_user_id ON event_reviews(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

CREATE INDEX IF NOT EXISTS idx_speakers_name ON speakers(name);
CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON sponsors(tier);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (uid() = id);

-- RLS Policies for event_attendees
CREATE POLICY "Users can view own event registrations" ON event_attendees
  FOR SELECT USING (uid() = user_id);

CREATE POLICY "Users can register for events" ON event_attendees
  FOR INSERT WITH CHECK (uid() = user_id);

CREATE POLICY "Users can update own registrations" ON event_attendees
  FOR UPDATE USING (uid() = user_id);

-- RLS Policies for event_favorites
CREATE POLICY "Users can view own favorites" ON event_favorites
  FOR SELECT USING (uid() = user_id);

CREATE POLICY "Users can manage own favorites" ON event_favorites
  FOR ALL USING (uid() = user_id);

-- RLS Policies for event_reviews
CREATE POLICY "Users can view all reviews" ON event_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create own reviews" ON event_reviews
  FOR INSERT WITH CHECK (uid() = user_id);

CREATE POLICY "Users can update own reviews" ON event_reviews
  FOR UPDATE USING (uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (uid() = user_id);

-- RLS Policies for user_sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT USING (uid() = user_id);

CREATE POLICY "Users can manage own sessions" ON user_sessions
  FOR ALL USING (uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_speakers_updated_at
  BEFORE UPDATE ON speakers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsors_updated_at
  BEFORE UPDATE ON sponsors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_reviews_updated_at
  BEFORE UPDATE ON event_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, description, color) VALUES
  ('Technology', 'Tech conferences, workshops, and seminars', '#3B82F6'),
  ('Business', 'Business networking and professional development', '#10B981'),
  ('Marketing', 'Marketing strategies and digital campaigns', '#F59E0B'),
  ('Design', 'Design thinking and creative workshops', '#8B5CF6'),
  ('Healthcare', 'Medical conferences and health seminars', '#EF4444'),
  ('Education', 'Educational workshops and training', '#06B6D4'),
  ('Finance', 'Financial planning and investment seminars', '#84CC16'),
  ('Sustainability', 'Environmental and sustainability events', '#22C55E')
ON CONFLICT (name) DO NOTHING;

-- Insert sample blog posts
INSERT INTO blog_posts (title, content, excerpt, author, slug, status, published_at, image_url) VALUES
  (
    'The Future of Virtual Events: Trends and Technologies',
    '<h2>Introduction</h2><p>The events industry has undergone a dramatic transformation in recent years...</p>',
    'Explore how virtual and hybrid events are reshaping the industry with cutting-edge technologies.',
    'Sarah Johnson',
    'future-of-virtual-events',
    'published',
    now(),
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'
  ),
  (
    'Creating Memorable Event Experiences',
    '<h2>The Art of Experience Design</h2><p>Creating memorable event experiences goes beyond logistics...</p>',
    'Learn the key principles of designing events that leave lasting impressions on attendees.',
    'Michael Chen',
    'creating-memorable-experiences',
    'published',
    now(),
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert sample speakers
INSERT INTO speakers (name, bio, title, company, image_url, social_linkedin, social_twitter) VALUES
  (
    'Zawadi Thandwe',
    'Professional with 20 years of experience helping brands reach their goals through innovative technology solutions.',
    'Chief Technology Officer',
    'TechCorp Industries',
    'https://images.pexels.com/photos/3211476/pexels-photo-3211476.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://linkedin.com/in/zawadi-thandwe',
    'https://twitter.com/zawadi_tech'
  ),
  (
    'Ejiro Rudo',
    'Skilled in problem solving, communication, and strategic thinking with a focus on user-centered design.',
    'Senior Product Manager',
    'Innovation Labs',
    'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://linkedin.com/in/ejiro-rudo',
    'https://twitter.com/ejiro_pm'
  ),
  (
    'Daniel Saoirse',
    'Dedicated to crafting innovative solutions throughout the year with change-driven creativity.',
    'Creative Director',
    'Design Studio Pro',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://linkedin.com/in/daniel-saoirse',
    'https://twitter.com/daniel_design'
  )
ON CONFLICT DO NOTHING;

-- Insert sample sponsors
INSERT INTO sponsors (name, logo_url, tier, website_url, description) VALUES
  (
    'TechCorp Industries',
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200',
    'platinum',
    'https://techcorp.com',
    'Leading technology solutions provider'
  ),
  (
    'Innovation Labs',
    'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=200',
    'gold',
    'https://innovationlabs.com',
    'Research and development company'
  ),
  (
    'Design Studio Pro',
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200',
    'silver',
    'https://designstudiopro.com',
    'Creative design agency'
  )
ON CONFLICT DO NOTHING;