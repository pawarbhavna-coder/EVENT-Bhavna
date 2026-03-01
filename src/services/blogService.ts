import { BlogArticle, BlogListResponse } from '../types/blog';

// Mock blog data - in a real app, this would come from your backend/CMS
const mockArticles: BlogArticle[] = [
  {
    id: '1',
    title: 'The Future of Virtual Events: Trends and Technologies',
    excerpt: 'Explore how virtual and hybrid events are reshaping the industry with cutting-edge technologies and innovative engagement strategies.',
    content: `
      <h2>Introduction</h2>
      <p>The events industry has undergone a dramatic transformation in recent years. Virtual and hybrid events have moved from being a novelty to becoming an essential part of the event landscape.</p>
      
      <h2>Key Technologies Driving Change</h2>
      <p>Several technologies are at the forefront of this revolution:</p>
      <ul>
        <li><strong>Virtual Reality (VR)</strong>: Creating immersive event experiences</li>
        <li><strong>Artificial Intelligence</strong>: Personalizing attendee experiences</li>
        <li><strong>Live Streaming Platforms</strong>: Enabling global reach</li>
        <li><strong>Interactive Tools</strong>: Facilitating engagement and networking</li>
      </ul>
      
      <h2>Benefits of Virtual Events</h2>
      <p>Virtual events offer numerous advantages over traditional in-person gatherings:</p>
      <p>Cost-effectiveness, global accessibility, environmental sustainability, and detailed analytics are just a few of the benefits that make virtual events attractive to organizers and attendees alike.</p>
      
      <h2>The Future Outlook</h2>
      <p>As we look ahead, the future of events will likely be hybrid - combining the best of both virtual and in-person experiences. This approach maximizes reach while maintaining the human connection that makes events special.</p>
      
      <h2>Conclusion</h2>
      <p>The evolution of event technology continues to open new possibilities for creating meaningful connections and delivering value to attendees worldwide.</p>
    `,
    author: 'Sarah Johnson',
    publishedDate: '2024-01-15',
    readTime: '5 min read',
    category: 'Technology',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
    slug: 'future-of-virtual-events',
    tags: ['Virtual Events', 'Technology', 'Future Trends'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Creating Memorable Event Experiences',
    excerpt: 'Learn the key principles of designing events that leave lasting impressions on attendees and drive meaningful connections.',
    content: `
      <h2>The Art of Experience Design</h2>
      <p>Creating memorable event experiences goes beyond logistics and planning. It's about crafting moments that resonate with attendees long after the event ends.</p>
      
      <h2>Understanding Your Audience</h2>
      <p>The foundation of any great event experience is a deep understanding of your audience. Consider their:</p>
      <ul>
        <li>Demographics and psychographics</li>
        <li>Professional goals and challenges</li>
        <li>Preferred communication styles</li>
        <li>Technology comfort levels</li>
      </ul>
      
      <h2>Key Elements of Memorable Events</h2>
      <h3>1. Storytelling</h3>
      <p>Every great event tells a story. From the opening keynote to the closing remarks, ensure your narrative is cohesive and compelling.</p>
      
      <h3>2. Interactive Elements</h3>
      <p>Passive consumption is forgettable. Include workshops, Q&A sessions, networking activities, and hands-on demonstrations.</p>
      
      <h3>3. Surprise and Delight</h3>
      <p>Unexpected moments create lasting memories. Consider surprise speakers, unique venues, or creative giveaways.</p>
      
      <h2>Measuring Success</h2>
      <p>Track both quantitative metrics (attendance, engagement rates) and qualitative feedback (testimonials, social media sentiment) to understand your event's impact.</p>
    `,
    author: 'Michael Chen',
    publishedDate: '2024-01-12',
    readTime: '7 min read',
    category: 'Strategy',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    slug: 'creating-memorable-event-experiences',
    tags: ['Event Design', 'Strategy', 'User Experience'],
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '3',
    title: 'Sustainable Event Planning: A Complete Guide',
    excerpt: 'Discover practical strategies for organizing eco-friendly events that minimize environmental impact while maximizing attendee satisfaction.',
    content: `
      <h2>Why Sustainable Events Matter</h2>
      <p>As environmental consciousness grows, event organizers have a responsibility to minimize their ecological footprint while still delivering exceptional experiences.</p>
      
      <h2>Planning Phase Sustainability</h2>
      <h3>Venue Selection</h3>
      <p>Choose venues that prioritize sustainability:</p>
      <ul>
        <li>LEED-certified buildings</li>
        <li>Locations accessible by public transportation</li>
        <li>Venues with renewable energy sources</li>
        <li>Facilities with comprehensive recycling programs</li>
      </ul>
      
      <h3>Digital-First Approach</h3>
      <p>Reduce paper waste by implementing digital solutions:</p>
      <ul>
        <li>Electronic invitations and tickets</li>
        <li>Mobile event apps for schedules and networking</li>
        <li>Digital signage instead of printed materials</li>
        <li>QR codes for information sharing</li>
      </ul>
      
      <h2>Sustainable Catering</h2>
      <p>Food and beverage choices significantly impact an event's environmental footprint:</p>
      <ul>
        <li>Source locally-grown, seasonal ingredients</li>
        <li>Offer plant-based menu options</li>
        <li>Use reusable or compostable serving materials</li>
        <li>Implement food waste reduction strategies</li>
      </ul>
      
      <h2>Transportation and Accommodation</h2>
      <p>Encourage sustainable travel options and partner with eco-friendly hotels to reduce the overall carbon footprint of your event.</p>
      
      <h2>Measuring Impact</h2>
      <p>Track your sustainability metrics to continuously improve your environmental performance and communicate your impact to stakeholders.</p>
    `,
    author: 'Emma Rodriguez',
    publishedDate: '2024-01-10',
    readTime: '6 min read',
    category: 'Sustainability',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    slug: 'sustainable-event-planning-guide',
    tags: ['Sustainability', 'Green Events', 'Environmental Impact'],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '4',
    title: 'Maximizing ROI from Corporate Events',
    excerpt: 'Strategic approaches to measuring and improving the return on investment for your corporate events and conferences.',
    content: `
      <h2>Understanding Event ROI</h2>
      <p>Return on Investment (ROI) for corporate events extends beyond simple financial metrics. It encompasses brand awareness, lead generation, employee engagement, and relationship building.</p>
      
      <h2>Setting Clear Objectives</h2>
      <p>Before planning your event, establish SMART goals:</p>
      <ul>
        <li><strong>Specific</strong>: Define exactly what you want to achieve</li>
        <li><strong>Measurable</strong>: Identify quantifiable metrics</li>
        <li><strong>Achievable</strong>: Set realistic expectations</li>
        <li><strong>Relevant</strong>: Align with business objectives</li>
        <li><strong>Time-bound</strong>: Establish clear deadlines</li>
      </ul>
      
      <h2>Key Performance Indicators (KPIs)</h2>
      <h3>Quantitative Metrics</h3>
      <ul>
        <li>Attendance rates and registration numbers</li>
        <li>Lead generation and conversion rates</li>
        <li>Revenue attributed to the event</li>
        <li>Cost per lead and cost per acquisition</li>
        <li>Social media engagement and reach</li>
      </ul>
      
      <h3>Qualitative Metrics</h3>
      <ul>
        <li>Attendee satisfaction scores</li>
        <li>Brand perception changes</li>
        <li>Quality of leads generated</li>
        <li>Networking effectiveness</li>
        <li>Content engagement levels</li>
      </ul>
      
      <h2>Technology for ROI Tracking</h2>
      <p>Leverage event technology to capture and analyze data:</p>
      <ul>
        <li>Event management platforms with analytics</li>
        <li>Mobile apps with engagement tracking</li>
        <li>CRM integration for lead management</li>
        <li>Survey tools for feedback collection</li>
      </ul>
      
      <h2>Post-Event Analysis</h2>
      <p>Conduct thorough post-event analysis to understand what worked and what didn't. Use these insights to improve future events and demonstrate value to stakeholders.</p>
    `,
    author: 'David Park',
    publishedDate: '2024-01-08',
    readTime: '8 min read',
    category: 'Business',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    slug: 'maximizing-roi-corporate-events',
    tags: ['ROI', 'Corporate Events', 'Business Strategy'],
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-08T10:00:00Z'
  },
  {
    id: '5',
    title: 'Event Marketing in the Digital Age',
    excerpt: 'Master the art of promoting your events across digital channels to reach and engage your target audience effectively.',
    content: `
      <h2>The Digital Marketing Landscape</h2>
      <p>Event marketing has evolved dramatically with the rise of digital channels. Today's event marketers must navigate a complex ecosystem of platforms, tools, and strategies to effectively reach their target audience.</p>
      
      <h2>Multi-Channel Marketing Strategy</h2>
      <h3>Social Media Marketing</h3>
      <p>Leverage different platforms for maximum reach:</p>
      <ul>
        <li><strong>LinkedIn</strong>: Professional networking and B2B events</li>
        <li><strong>Twitter</strong>: Real-time updates and industry conversations</li>
        <li><strong>Instagram</strong>: Visual storytelling and behind-the-scenes content</li>
        <li><strong>Facebook</strong>: Community building and event pages</li>
      </ul>
      
      <h3>Email Marketing</h3>
      <p>Create targeted email campaigns:</p>
      <ul>
        <li>Save-the-date announcements</li>
        <li>Early bird registration promotions</li>
        <li>Speaker spotlights and agenda reveals</li>
        <li>Post-event follow-ups and thank you messages</li>
      </ul>
      
      <h2>Content Marketing</h2>
      <p>Develop valuable content that attracts and engages your audience:</p>
      <ul>
        <li>Blog posts about industry trends and insights</li>
        <li>Video interviews with speakers and thought leaders</li>
        <li>Infographics highlighting event statistics and benefits</li>
        <li>Podcasts featuring industry discussions</li>
      </ul>
      
      <h2>Influencer Partnerships</h2>
      <p>Collaborate with industry influencers and thought leaders to expand your reach and credibility. Their endorsement can significantly boost registration and attendance.</p>
      
      <h2>Measuring Digital Marketing Success</h2>
      <p>Track key metrics across all channels:</p>
      <ul>
        <li>Website traffic and conversion rates</li>
        <li>Social media engagement and reach</li>
        <li>Email open rates and click-through rates</li>
        <li>Registration sources and attribution</li>
      </ul>
    `,
    author: 'Lisa Thompson',
    publishedDate: '2024-01-05',
    readTime: '4 min read',
    category: 'Marketing',
    image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    slug: 'event-marketing-digital-age',
    tags: ['Digital Marketing', 'Social Media', 'Content Strategy'],
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z'
  },
  {
    id: '6',
    title: 'Building Strong Speaker Relationships',
    excerpt: 'Tips and strategies for finding, engaging, and maintaining relationships with top-tier speakers for your events.',
    content: `
      <h2>The Importance of Great Speakers</h2>
      <p>Speakers can make or break an event. They're often the primary draw for attendees and can significantly impact the perceived value and success of your event.</p>
      
      <h2>Finding the Right Speakers</h2>
      <h3>Research and Discovery</h3>
      <ul>
        <li>Industry publications and thought leadership content</li>
        <li>Professional associations and networking groups</li>
        <li>Social media platforms and online communities</li>
        <li>Previous event recordings and speaker bureaus</li>
        <li>Recommendations from industry contacts</li>
      </ul>
      
      <h3>Evaluation Criteria</h3>
      <p>When evaluating potential speakers, consider:</p>
      <ul>
        <li>Expertise and credibility in their field</li>
        <li>Speaking experience and presentation skills</li>
        <li>Audience alignment and appeal</li>
        <li>Availability and scheduling flexibility</li>
        <li>Budget considerations and fee structure</li>
      </ul>
      
      <h2>The Outreach Process</h2>
      <h3>Initial Contact</h3>
      <p>Craft compelling outreach messages that include:</p>
      <ul>
        <li>Clear event details and value proposition</li>
        <li>Specific reasons for selecting them</li>
        <li>Audience demographics and expected attendance</li>
        <li>Speaking requirements and expectations</li>
        <li>Compensation and benefits offered</li>
      </ul>
      
      <h2>Building Long-term Relationships</h2>
      <p>Great speaker relationships extend beyond single events:</p>
      <ul>
        <li>Provide excellent support and communication</li>
        <li>Deliver on all promises and commitments</li>
        <li>Share event success metrics and feedback</li>
        <li>Maintain regular contact throughout the year</li>
        <li>Offer opportunities for ongoing collaboration</li>
      </ul>
      
      <h2>Speaker Support and Success</h2>
      <p>Ensure speaker success by providing:</p>
      <ul>
        <li>Detailed briefing materials and audience insights</li>
        <li>Technical requirements and venue information</li>
        <li>Rehearsal opportunities and AV support</li>
        <li>Clear timeline and logistics coordination</li>
        <li>Post-event feedback and recognition</li>
      </ul>
    `,
    author: 'James Wilson',
    publishedDate: '2024-01-03',
    readTime: '5 min read',
    category: 'Networking',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    slug: 'building-strong-speaker-relationships',
    tags: ['Speaker Management', 'Networking', 'Event Planning'],
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-03T10:00:00Z'
  }
];

class BlogService {
  private static instance: BlogService;
  private articles: BlogArticle[] = mockArticles;

  static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  /**
   * Get paginated list of blog articles
   */
  async getArticles(page: number = 1, limit: number = 6, category?: string): Promise<BlogListResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredArticles = [...this.articles];

    // Filter by category if specified
    if (category && category !== 'all') {
      filteredArticles = filteredArticles.filter(
        article => article.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Sort by published date (newest first)
    filteredArticles.sort((a, b) => 
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    return {
      articles: paginatedArticles,
      hasMore: endIndex < filteredArticles.length,
      total: filteredArticles.length,
      page,
      limit
    };
  }

  /**
   * Get a single article by slug
   */
  async getArticleBySlug(slug: string): Promise<BlogArticle | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const article = this.articles.find(article => article.slug === slug);
    return article || null;
  }

  /**
   * Get related articles (excluding the current article)
   */
  async getRelatedArticles(currentSlug: string, limit: number = 3): Promise<BlogArticle[]> {
    const currentArticle = this.articles.find(article => article.slug === currentSlug);
    if (!currentArticle) return [];

    // Find articles in the same category, excluding the current one
    const relatedArticles = this.articles
      .filter(article => 
        article.slug !== currentSlug && 
        article.category === currentArticle.category
      )
      .slice(0, limit);

    // If not enough related articles in the same category, fill with other articles
    if (relatedArticles.length < limit) {
      const additionalArticles = this.articles
        .filter(article => 
          article.slug !== currentSlug && 
          !relatedArticles.includes(article)
        )
        .slice(0, limit - relatedArticles.length);
      
      relatedArticles.push(...additionalArticles);
    }

    return relatedArticles;
  }

  /**
   * Get featured articles
   */
  async getFeaturedArticles(): Promise<BlogArticle[]> {
    return this.articles.filter(article => article.featured);
  }

  /**
   * Search articles by title or content
   */
  async searchArticles(query: string, limit: number = 10): Promise<BlogArticle[]> {
    const searchTerm = query.toLowerCase();
    
    return this.articles
      .filter(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.excerpt.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
      .slice(0, limit);
  }
}

export const blogService = BlogService.getInstance();