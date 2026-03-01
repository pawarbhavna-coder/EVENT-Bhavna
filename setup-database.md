# Manual Database Setup Instructions

Since the database tables don't exist yet, you need to manually create them in your Supabase dashboard.

## Step 1: Access Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/vjdsijuyzhhlofmlzexe
2. Click on "SQL Editor" in the left sidebar

## Step 2: Execute the Database Schema

Copy and paste the following SQL into the SQL Editor and execute it:

### 1. Initial Schema (001_initial_schema.sql)

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    organizer_id UUID, -- Will be linked to auth.users later
    max_attendees INTEGER,
    price DECIMAL(10,2) DEFAULT 0.00,
    image_url TEXT,
    venue_name VARCHAR(200),
    venue_address TEXT,
    is_online BOOLEAN DEFAULT FALSE,
    online_link TEXT,
    
    -- Add foreign key constraint to categories
    CONSTRAINT fk_events_category FOREIGN KEY (category) REFERENCES categories(name)
);

-- Create speakers table
CREATE TABLE speakers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    bio TEXT NOT NULL,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    image_url TEXT,
    social_linkedin TEXT,
    social_twitter TEXT,
    social_website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_speakers junction table
CREATE TABLE event_speakers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID NOT NULL,
    speaker_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_event_speakers_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_event_speakers_speaker FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE,
    CONSTRAINT unique_event_speaker UNIQUE (event_id, speaker_id)
);

-- Create blog_posts table
CREATE TABLE blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    image_url TEXT,
    slug VARCHAR(200) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published'))
);

-- Create sponsors table
CREATE TABLE sponsors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo_url TEXT NOT NULL,
    website_url TEXT,
    description TEXT,
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('platinum', 'gold', 'silver', 'bronze')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_sponsors junction table
CREATE TABLE event_sponsors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID NOT NULL,
    sponsor_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_event_sponsors_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_event_sponsors_sponsor FOREIGN KEY (sponsor_id) REFERENCES sponsors(id) ON DELETE CASCADE,
    CONSTRAINT unique_event_sponsor UNIQUE (event_id, sponsor_id)
);

-- Create indexes for better performance
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_speakers_name ON speakers(name);
CREATE INDEX idx_sponsors_tier ON sponsors(tier);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_speakers_updated_at BEFORE UPDATE ON speakers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsors_updated_at BEFORE UPDATE ON sponsors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Sample Data (002_sample_data.sql)

```sql
-- Insert sample categories
INSERT INTO categories (name, description, color) VALUES
('Technology', 'Tech conferences, workshops, and meetups', '#3B82F6'),
('Business', 'Business conferences, networking events, and seminars', '#10B981'),
('Education', 'Educational workshops, training sessions, and courses', '#F59E0B'),
('Healthcare', 'Medical conferences, health workshops, and wellness events', '#EF4444'),
('Arts & Culture', 'Art exhibitions, cultural events, and creative workshops', '#8B5CF6'),
('Sports & Fitness', 'Sports events, fitness workshops, and athletic competitions', '#06B6D4'),
('Food & Drink', 'Culinary events, wine tastings, and food festivals', '#84CC16'),
('Entertainment', 'Concerts, shows, and entertainment events', '#F97316');

-- Insert sample speakers
INSERT INTO speakers (name, bio, title, company, image_url, social_linkedin, social_twitter) VALUES
('Dr. Sarah Johnson', 'Renowned AI researcher with 15+ years of experience in machine learning and neural networks. Published author of "The Future of AI" and keynote speaker at major tech conferences worldwide.', 'Chief AI Officer', 'TechCorp Inc.', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400', 'https://linkedin.com/in/sarahjohnson', 'https://twitter.com/sarahjohnson'),
('Michael Chen', 'Serial entrepreneur and startup advisor with expertise in scaling technology companies. Founded three successful startups and currently mentors early-stage companies.', 'Founder & CEO', 'InnovateLab', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 'https://linkedin.com/in/michaelchen', 'https://twitter.com/michaelchen'),
('Dr. Emily Rodriguez', 'Leading expert in sustainable business practices and environmental impact assessment. Consultant to Fortune 500 companies on ESG initiatives.', 'Sustainability Director', 'GreenFuture Corp', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 'https://linkedin.com/in/emilyrodriguez', 'https://twitter.com/emilyrodriguez'),
('James Wilson', 'Digital marketing strategist with expertise in social media, content marketing, and brand development. Helped over 200 companies grow their online presence.', 'Marketing Director', 'Digital Growth Co', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'https://linkedin.com/in/jameswilson', 'https://twitter.com/jameswilson'),
('Lisa Thompson', 'UX/UI designer with 10+ years of experience creating user-centered digital products. Award-winning designer and author of "Design Thinking in Practice".', 'Senior UX Designer', 'Design Studio Pro', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', 'https://linkedin.com/in/lisathompson', 'https://twitter.com/lisathompson');

-- Insert sample events
INSERT INTO events (title, description, start_date, end_date, location, category, status, max_attendees, price, image_url, venue_name, venue_address, is_online) VALUES
('AI & Machine Learning Summit 2024', 'Join us for the premier AI and machine learning conference featuring cutting-edge research, practical applications, and networking opportunities with industry leaders.', '2024-03-15 09:00:00+00', '2024-03-15 18:00:00+00', 'San Francisco, CA', 'Technology', 'published', 500, 299.00, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800', 'Moscone Center', '747 Howard St, San Francisco, CA 94103', false),
('Sustainable Business Conference', 'Explore the latest trends in sustainable business practices, ESG investing, and environmental responsibility in corporate strategy.', '2024-04-20 10:00:00+00', '2024-04-20 17:00:00+00', 'New York, NY', 'Business', 'published', 300, 199.00, 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', 'Javits Center', '429 11th Ave, New York, NY 10001', false),
('Digital Marketing Masterclass', 'Learn advanced digital marketing strategies, social media optimization, and content marketing techniques from industry experts.', '2024-05-10 09:30:00+00', '2024-05-10 16:30:00+00', 'Online Event', 'Education', 'published', 200, 99.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'Virtual Conference', 'Online', true),
('Healthcare Innovation Summit', 'Discover the latest innovations in healthcare technology, telemedicine, and patient care solutions.', '2024-06-05 08:00:00+00', '2024-06-05 18:00:00+00', 'Boston, MA', 'Healthcare', 'published', 400, 249.00, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800', 'Boston Convention Center', '415 Summer St, Boston, MA 02210', false),
('UX Design Workshop', 'Hands-on workshop covering user research, prototyping, and design thinking methodologies for creating better user experiences.', '2024-07-12 10:00:00+00', '2024-07-12 17:00:00+00', 'Seattle, WA', 'Education', 'published', 50, 149.00, 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800', 'Seattle Design Center', '123 Design St, Seattle, WA 98101', false);

-- Link speakers to events
INSERT INTO event_speakers (event_id, speaker_id) 
SELECT e.id, s.id 
FROM events e, speakers s 
WHERE e.title = 'AI & Machine Learning Summit 2024' AND s.name = 'Dr. Sarah Johnson';

INSERT INTO event_speakers (event_id, speaker_id) 
SELECT e.id, s.id 
FROM events e, speakers s 
WHERE e.title = 'AI & Machine Learning Summit 2024' AND s.name = 'Michael Chen';

INSERT INTO event_speakers (event_id, speaker_id) 
SELECT e.id, s.id 
FROM events e, speakers s 
WHERE e.title = 'Sustainable Business Conference' AND s.name = 'Dr. Emily Rodriguez';

INSERT INTO event_speakers (event_id, speaker_id) 
SELECT e.id, s.id 
FROM events e, speakers s 
WHERE e.title = 'Digital Marketing Masterclass' AND s.name = 'James Wilson';

INSERT INTO event_speakers (event_id, speaker_id) 
SELECT e.id, s.id 
FROM events e, speakers s 
WHERE e.title = 'UX Design Workshop' AND s.name = 'Lisa Thompson';

-- Insert sample blog posts
INSERT INTO blog_posts (title, content, excerpt, author, published_at, image_url, slug, status) VALUES
('The Future of Event Technology: Trends to Watch in 2024', 'Event technology is rapidly evolving, and 2024 promises to bring exciting innovations that will transform how we plan, manage, and experience events. From AI-powered event management to immersive virtual experiences, the landscape is changing at an unprecedented pace.

## Key Trends Shaping Event Technology

### 1. Artificial Intelligence Integration
AI is becoming increasingly sophisticated in event management, offering personalized experiences, predictive analytics, and automated customer service. Event organizers can now leverage AI to:
- Predict attendee behavior and preferences
- Automate registration and check-in processes
- Provide real-time language translation
- Generate personalized event recommendations

### 2. Hybrid and Virtual Event Platforms
The pandemic accelerated the adoption of virtual events, and this trend continues to grow. Modern platforms now offer:
- Seamless integration between in-person and virtual attendees
- Interactive features like live Q&A and networking
- Advanced analytics and engagement tracking
- Multi-platform streaming capabilities

### 3. Sustainability and Green Technology
Environmental consciousness is driving innovation in event technology:
- Carbon footprint tracking and offsetting
- Digital-first approaches to reduce waste
- Sustainable venue management systems
- Green energy solutions for events

### 4. Immersive Technologies
Augmented and virtual reality are creating new possibilities for event experiences:
- Virtual venue tours and previews
- AR-powered networking and information displays
- Immersive product demonstrations
- Virtual reality event spaces

## The Impact on Event Professionals

These technological advances are not just changing how events are delivered; they''re transforming the role of event professionals. Success now requires:
- Technical proficiency with new platforms
- Data analysis and interpretation skills
- Creative thinking for hybrid experiences
- Strong digital communication abilities

## Looking Ahead

As we move through 2024, event technology will continue to evolve, offering new opportunities for engagement, efficiency, and innovation. The key to success will be staying informed about these trends and being willing to adapt and experiment with new technologies.

The future of events is digital, sustainable, and more engaging than ever before. Are you ready to embrace these changes?', 'Discover the latest trends in event technology that are reshaping the industry in 2024, from AI integration to immersive experiences.', 'EventEase Team', '2024-01-15 10:00:00+00', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800', 'future-event-technology-trends-2024', 'published'),

('How to Create Engaging Virtual Events: A Complete Guide', 'Virtual events have become a staple in the modern event landscape, but creating truly engaging online experiences requires careful planning and execution. This comprehensive guide will walk you through everything you need to know.

## Planning Your Virtual Event

### Define Your Objectives
Before diving into the technical aspects, clearly define what you want to achieve:
- What is the primary goal of your event?
- Who is your target audience?
- What outcomes do you want to measure?
- How will you define success?

### Choose the Right Platform
Selecting the appropriate platform is crucial for success:
- **All-in-one platforms**: Comprehensive solutions with built-in features
- **Video conferencing tools**: Best for simple meetings and presentations
- **Custom solutions**: For unique requirements and branding needs
- **Hybrid platforms**: Combining virtual and in-person elements

## Content Strategy

### Engaging Presentations
- Keep presentations concise and visually appealing
- Use interactive elements like polls and Q&A
- Include breaks to maintain attention
- Prepare backup content for technical issues

### Interactive Elements
- Live polls and surveys
- Breakout rooms for networking
- Chat features and discussion boards
- Gamification elements

## Technical Considerations

### Audio and Video Quality
- Invest in good equipment
- Test your setup beforehand
- Have backup plans for technical issues
- Provide technical support for attendees

### Platform Testing
- Conduct thorough testing before the event
- Train your team on the platform
- Prepare troubleshooting guides
- Have technical support available

## Engagement Strategies

### Pre-Event Engagement
- Send detailed instructions and materials
- Create anticipation through social media
- Offer networking opportunities before the event
- Provide agenda and speaker information

### During the Event
- Encourage participation through interactive features
- Use breakout rooms for smaller discussions
- Monitor chat and respond to questions
- Keep energy levels high with engaging content

### Post-Event Follow-up
- Send recordings and materials to attendees
- Conduct surveys for feedback
- Provide networking opportunities
- Share key takeaways and next steps

## Measuring Success

Track these key metrics to measure your event''s success:
- Attendance rates and engagement levels
- Session completion rates
- Feedback scores and comments
- Lead generation and conversion rates
- Social media engagement and reach

## Common Pitfalls to Avoid

- Overloading the agenda
- Ignoring technical preparation
- Failing to engage the audience
- Not providing clear instructions
- Neglecting post-event follow-up

## Conclusion

Creating engaging virtual events requires careful planning, the right technology, and a focus on audience engagement. By following this guide and continuously improving based on feedback, you can create memorable and effective virtual experiences that achieve your objectives.

Remember, the key to successful virtual events is putting your audience first and creating experiences that are both valuable and enjoyable.', 'Learn how to create compelling virtual events that engage your audience and deliver real value with this comprehensive guide.', 'EventEase Team', '2024-01-20 14:30:00+00', 'https://images.unsplash.com/photo-1551818255-e6e10975cd17?w=800', 'create-engaging-virtual-events-complete-guide', 'published');

-- Insert sample sponsors
INSERT INTO sponsors (name, logo_url, website_url, description, tier) VALUES
('TechCorp Solutions', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200', 'https://techcorp.com', 'Leading provider of enterprise technology solutions and cloud services.', 'platinum'),
('InnovateLab', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200', 'https://innovatelab.com', 'Innovation consulting firm specializing in digital transformation and startup acceleration.', 'gold'),
('GreenFuture Corp', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200', 'https://greenfuture.com', 'Sustainable technology company focused on environmental solutions and green energy.', 'gold'),
('Digital Growth Co', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200', 'https://digitalgrowth.com', 'Digital marketing agency helping businesses grow their online presence and reach.', 'silver'),
('Design Studio Pro', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=200', 'https://designstudiopro.com', 'Creative design agency specializing in UX/UI design and brand development.', 'silver'),
('CloudTech Inc', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200', 'https://cloudtech.com', 'Cloud infrastructure and data management solutions for modern businesses.', 'bronze'),
('DataViz Solutions', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200', 'https://dataviz.com', 'Data visualization and analytics platform for business intelligence.', 'bronze');

-- Link sponsors to events
INSERT INTO event_sponsors (event_id, sponsor_id) 
SELECT e.id, s.id 
FROM events e, sponsors s 
WHERE e.title = 'AI & Machine Learning Summit 2024' AND s.name = 'TechCorp Solutions';

INSERT INTO event_sponsors (event_id, sponsor_id) 
SELECT e.id, s.id 
FROM events e, sponsors s 
WHERE e.title = 'AI & Machine Learning Summit 2024' AND s.name = 'InnovateLab';

INSERT INTO event_sponsors (event_id, sponsor_id) 
SELECT e.id, s.id 
FROM events e, sponsors s 
WHERE e.title = 'Sustainable Business Conference' AND s.name = 'GreenFuture Corp';

INSERT INTO event_sponsors (event_id, sponsor_id) 
SELECT e.id, s.id 
FROM events e, sponsors s 
WHERE e.title = 'Digital Marketing Masterclass' AND s.name = 'Digital Growth Co';

INSERT INTO event_sponsors (event_id, sponsor_id) 
SELECT e.id, s.id 
FROM events e, sponsors s 
WHERE e.title = 'UX Design Workshop' AND s.name = 'Design Studio Pro';
```

## Step 3: Test the Database

After executing the SQL, run the test script:

```bash
node test-database.js
```

## Step 4: Start the Application

```bash
npm run dev
```

The application should now be connected to the real database and display the sample data.




