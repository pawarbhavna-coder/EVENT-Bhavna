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

Remember, the key to successful virtual events is putting your audience first and creating experiences that are both valuable and enjoyable.', 'Learn how to create compelling virtual events that engage your audience and deliver real value with this comprehensive guide.', 'EventEase Team', '2024-01-20 14:30:00+00', 'https://images.unsplash.com/photo-1551818255-e6e10975cd17?w=800', 'create-engaging-virtual-events-complete-guide', 'published'),

('The Psychology of Event Networking: Building Meaningful Connections', 'Networking is often cited as one of the most valuable aspects of attending events, but many people struggle to make meaningful connections. Understanding the psychology behind networking can help you build stronger, more valuable relationships.

## The Science of Networking

### Why Networking Matters
Research shows that professional networks are crucial for career success:
- 85% of jobs are filled through networking
- Strong networks lead to better opportunities
- Networking improves job satisfaction and career growth
- Personal relationships drive business success

### The Psychology of First Impressions
First impressions are formed within seconds and are difficult to change:
- **Visual cues**: Appearance, body language, and facial expressions
- **Verbal cues**: Tone of voice, choice of words, and speaking pace
- **Behavioral cues**: Confidence, attentiveness, and engagement

## Building Your Networking Strategy

### Pre-Event Preparation
- Research attendees and speakers
- Prepare your elevator pitch
- Set specific networking goals
- Practice conversation starters

### During the Event
- Approach networking with a giving mindset
- Ask open-ended questions
- Listen actively and show genuine interest
- Exchange contact information meaningfully

### Post-Event Follow-up
- Send personalized follow-up messages
- Connect on professional platforms
- Schedule follow-up meetings
- Provide value through sharing resources

## Overcoming Networking Anxiety

### Common Fears
- Fear of rejection
- Imposter syndrome
- Social anxiety
- Fear of appearing pushy

### Strategies for Success
- Start with smaller, more intimate events
- Practice with friends or colleagues
- Focus on helping others rather than selling
- Remember that everyone is there to network

## The Art of Conversation

### Effective Conversation Starters
- Comment on the event or venue
- Ask about their experience or background
- Share relevant industry insights
- Ask for their opinion on a topic

### Keeping Conversations Going
- Ask follow-up questions
- Share relevant experiences
- Find common ground
- Be genuinely curious about their work

## Digital Networking

### Online Platforms
- LinkedIn for professional connections
- Industry-specific forums and groups
- Virtual networking events
- Social media engagement

### Virtual Networking Best Practices
- Use video when possible
- Be present and engaged
- Follow up promptly
- Maintain professional boundaries

## Building Long-term Relationships

### The Relationship Building Process
1. **Initial contact**: Make a good first impression
2. **Follow-up**: Maintain contact after the event
3. **Value exchange**: Provide mutual value over time
4. **Relationship maintenance**: Regular check-ins and updates

### Providing Value
- Share relevant articles or resources
- Make introductions to other contacts
- Offer your expertise or assistance
- Celebrate their successes

## Measuring Networking Success

### Key Metrics
- Number of meaningful connections made
- Quality of relationships developed
- Opportunities generated
- Long-term relationship value

### Tracking Your Network
- Use CRM systems to track contacts
- Set reminders for follow-ups
- Document important details about contacts
- Regularly review and update your network

## Common Networking Mistakes

- Being too focused on selling
- Not following up after initial contact
- Talking too much about yourself
- Failing to listen actively
- Not providing value to others

## Conclusion

Effective networking is about building genuine relationships based on mutual value and respect. By understanding the psychology behind networking and implementing these strategies, you can create a strong professional network that supports your career growth and personal development.

Remember, networking is not about collecting business cards—it''s about building relationships that matter. Focus on being helpful, authentic, and genuinely interested in others, and the connections will follow naturally.', 'Discover the psychological principles behind effective networking and learn how to build meaningful professional relationships at events.', 'EventEase Team', '2024-01-25 09:15:00+00', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800', 'psychology-event-networking-meaningful-connections', 'published');

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
