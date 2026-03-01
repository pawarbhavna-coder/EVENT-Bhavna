import { Speaker, SpeakerListResponse } from '../types/speaker';
import { supabase } from '../lib/supabaseConfig';

// Mock speaker data - fallback when database is not available
const mockSpeakers: Speaker[] = [
  {
    id: '1',
    name: 'ZAWADI THANDWE',
    title: 'Chief Technology Officer',
    company: 'TechCorp Industries',
    bio: 'Professional with 20 years of experience helping brands reach their goals through innovative technology solutions and strategic leadership.',
    fullBio: `Zawadi Thandwe is a visionary technology leader with over two decades of experience in driving digital transformation and innovation across Fortune 500 companies. As the Chief Technology Officer at TechCorp Industries, she leads a team of 200+ engineers and data scientists in developing cutting-edge solutions that have revolutionized the industry.

Her expertise spans artificial intelligence, machine learning, cloud architecture, and enterprise software development. Zawadi has been instrumental in launching over 15 major technology initiatives that have generated over $500M in revenue for her organizations.

She holds a Ph.D. in Computer Science from MIT and an MBA from Stanford Graduate School of Business. Zawadi is a frequent keynote speaker at major technology conferences and has been featured in Forbes, TechCrunch, and Wired magazine.

When she's not revolutionizing technology, Zawadi mentors young women in STEM and serves on the board of several non-profit organizations focused on technology education in underserved communities.`,
    image: 'https://images.pexels.com/photos/3211476/pexels-photo-3211476.jpeg?auto=compress&cs=tinysrgb&w=800',
    expertise: ['Technology', 'Leadership', 'Innovation', 'AI/ML', 'Cloud Architecture'],
    location: 'San Francisco, CA',
    rating: 4.9,
    events: 25,
    featured: true,
    achievements: [
      'Forbes 40 Under 40 Technology Leader',
      'MIT Technology Review Innovator',
      'Women in Tech Leadership Award',
      'Patent holder for 12 technology innovations'
    ],
    upcomingEvents: [
      {
        id: '1',
        name: 'Tech Innovation Summit 2024',
        date: '2024-03-15',
        location: 'San Francisco, CA',
        topic: 'The Future of AI in Enterprise'
      },
      {
        id: '2',
        name: 'Digital Transformation Conference',
        date: '2024-04-20',
        location: 'New York, NY',
        topic: 'Leading Through Technology Change'
      }
    ],
    pastEvents: [
      {
        id: '3',
        name: 'Global Tech Leaders Forum',
        date: '2023-11-10',
        location: 'London, UK',
        topic: 'Building Scalable Tech Teams'
      },
      {
        id: '4',
        name: 'Innovation Summit Asia',
        date: '2023-09-15',
        location: 'Singapore',
        topic: 'AI Ethics and Governance'
      }
    ],
    socialLinks: {
      email: 'zawadi@techcorp.com',
      linkedin: 'https://linkedin.com/in/zawadi-thandwe',
      twitter: 'https://twitter.com/zawadi_tech',
      website: 'https://zawadi-thandwe.com'
    },
    sessions: [
      {
        id: '1',
        title: 'The Future of AI in Enterprise',
        description: 'Exploring how artificial intelligence is transforming business operations and decision-making processes.',
        date: '2024-03-15',
        time: '10:00 AM',
        duration: '45 minutes',
        room: 'Main Auditorium',
        eventId: '1',
        eventName: 'Tech Innovation Summit 2024'
      },
      {
        id: '2',
        title: 'Building Scalable Tech Teams',
        description: 'Strategies for recruiting, managing, and scaling technology teams in fast-growing organizations.',
        date: '2024-03-15',
        time: '2:30 PM',
        duration: '60 minutes',
        room: 'Conference Room A',
        eventId: '1',
        eventName: 'Tech Innovation Summit 2024'
      }
    ]
  },
  {
    id: '2',
    name: 'EJIRO RUDO',
    title: 'Senior Product Manager',
    company: 'Innovation Labs',
    bio: 'Skilled in problem solving, communication, and strategic thinking with a focus on user-centered design and product development.',
    fullBio: `Ejiro Rudo is a seasoned product management professional with over 12 years of experience building and launching successful digital products. Currently serving as Senior Product Manager at Innovation Labs, she leads cross-functional teams in developing cutting-edge solutions that serve millions of users worldwide.

Her expertise lies in user research, product strategy, agile development, and data-driven decision making. Ejiro has successfully launched over 20 products, including three that achieved unicorn status. She's particularly passionate about creating inclusive products that serve diverse user bases.

Ejiro holds an MBA from Wharton and a BS in Computer Science from Stanford. She's a regular contributor to Product Management publications and has spoken at over 30 conferences worldwide. She also mentors aspiring product managers through various industry programs.

Outside of work, Ejiro is an advocate for diversity in tech and serves on the advisory board of several organizations promoting women and underrepresented minorities in technology careers.`,
    image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=800',
    expertise: ['Product Management', 'Strategy', 'Design', 'User Research', 'Agile'],
    location: 'New York, NY',
    rating: 4.8,
    events: 18,
    featured: true,
    achievements: [
      'Product Manager of the Year 2023',
      'Top 100 Product Leaders',
      'Innovation in UX Design Award',
      'Diversity in Tech Leadership Recognition'
    ],
    upcomingEvents: [
      {
        id: '5',
        name: 'Product Management Conference',
        date: '2024-03-22',
        location: 'New York, NY',
        topic: 'Building Products Users Love'
      }
    ],
    pastEvents: [
      {
        id: '6',
        name: 'UX Design Summit',
        date: '2023-10-15',
        location: 'Austin, TX',
        topic: 'User-Centered Product Development'
      }
    ],
    socialLinks: {
      email: 'ejiro@innovationlabs.com',
      linkedin: 'https://linkedin.com/in/ejiro-rudo',
      twitter: 'https://twitter.com/ejiro_pm',
      website: 'https://ejiro-rudo.com'
    },
    sessions: [
      {
        id: '3',
        title: 'Building Products Users Love',
        description: 'A deep dive into user research methodologies and product development best practices.',
        date: '2024-03-22',
        time: '11:00 AM',
        duration: '50 minutes',
        room: 'Workshop Room B',
        eventId: '2',
        eventName: 'Product Management Conference'
      }
    ]
  },
  {
    id: '3',
    name: 'DANIEL SAOIRSE',
    title: 'Creative Director',
    company: 'Design Studio Pro',
    bio: 'Dedicated to crafting innovative solutions throughout the year with change-driven creativity and forward-thinking design approaches.',
    fullBio: `Daniel Saoirse is an award-winning creative director with 15 years of experience in brand design, digital experiences, and creative strategy. As Creative Director at Design Studio Pro, he leads a team of 50+ designers and creatives in developing brand identities and digital experiences for Fortune 500 companies.

His work has been recognized with numerous industry awards, including Cannes Lions, D&AD Pencils, and Webby Awards. Daniel's approach combines strategic thinking with innovative design to create memorable brand experiences that drive business results.

He holds a Master's in Design from RISD and has taught design thinking workshops at leading universities. Daniel is also a frequent speaker at design conferences and has been featured in design publications worldwide.

Daniel is passionate about sustainable design practices and leads initiatives to reduce the environmental impact of creative work. He also mentors emerging designers through various industry programs.`,
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800',
    expertise: ['Design', 'Creativity', 'Innovation', 'Brand Strategy', 'Digital Experience'],
    location: 'Los Angeles, CA',
    rating: 4.7,
    events: 22,
    featured: false,
    achievements: [
      'Cannes Lions Gold Winner',
      'D&AD Pencil Award',
      'Webby Award for Best Design',
      'Design Leader of the Year 2023'
    ],
    upcomingEvents: [
      {
        id: '7',
        name: 'Creative Design Conference',
        date: '2024-04-10',
        location: 'Los Angeles, CA',
        topic: 'The Future of Brand Design'
      }
    ],
    pastEvents: [
      {
        id: '8',
        name: 'Design Thinking Workshop',
        date: '2023-09-20',
        location: 'San Francisco, CA',
        topic: 'Human-Centered Design Principles'
      }
    ],
    socialLinks: {
      email: 'daniel@designstudiopro.com',
      linkedin: 'https://linkedin.com/in/daniel-saoirse',
      twitter: 'https://twitter.com/daniel_design',
      website: 'https://daniel-saoirse.design'
    },
    sessions: [
      {
        id: '4',
        title: 'The Future of Brand Design',
        description: 'Exploring emerging trends and technologies shaping the future of brand identity and visual communication.',
        date: '2024-04-10',
        time: '9:30 AM',
        duration: '45 minutes',
        room: 'Design Studio',
        eventId: '3',
        eventName: 'Creative Design Conference'
      }
    ]
  }
];

class SpeakerService {
  private static instance: SpeakerService;
  private speakers: Speaker[] = mockSpeakers;

  static getInstance(): SpeakerService {
    if (!SpeakerService.instance) {
      SpeakerService.instance = new SpeakerService();
    }
    return SpeakerService.instance;
  }

  async getSpeakers(page: number = 1, limit: number = 9, expertise?: string, sortBy: 'name' | 'rating' | 'events' = 'name'): Promise<SpeakerListResponse> {
    try {
      // Try to fetch from database first
      let query = supabase
        .from('speakers')
        .select('*')
        .order('name', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching speakers:', error);
        // Fallback to mock data
        return this.getMockSpeakers(page, limit, expertise, sortBy);
      }

      if (!data || data.length === 0) {
        // Fallback to mock data if no speakers in database
        return this.getMockSpeakers(page, limit, expertise, sortBy);
      }

      // Transform database speakers to match Speaker type
      const speakers: Speaker[] = data.map(speaker => ({
        id: speaker.id,
        name: speaker.name,
        title: speaker.title,
        company: speaker.company,
        bio: speaker.bio,
        fullBio: speaker.bio, // Use bio as fullBio for now
        image: speaker.image_url || 'https://images.pexels.com/photos/3211476/pexels-photo-3211476.jpeg?auto=compress&cs=tinysrgb&w=800',
        expertise: [speaker.title], // Use title as expertise for now
        location: 'San Francisco, CA', // Default location
        rating: 4.5, // Default rating
        events: 10, // Default event count
        featured: false, // Default featured status
        achievements: [], // Empty achievements for now
        upcomingEvents: [], // Empty upcoming events for now
        pastEvents: [], // Empty past events for now
        socialLinks: {
          email: '',
          linkedin: speaker.social_linkedin || '',
          twitter: speaker.social_twitter || '',
          website: speaker.social_website || ''
        },
        sessions: [] // Empty sessions for now
      }));

      // Apply expertise filter
      let filteredSpeakers = [...speakers];
      if (expertise && expertise !== 'All') {
        filteredSpeakers = filteredSpeakers.filter(speaker =>
          speaker.expertise.includes(expertise)
        );
      }

      // Sort speakers
      filteredSpeakers.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'rating':
            return b.rating - a.rating;
          case 'events':
            return b.events - a.events;
          default:
            return 0;
        }
      });

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedSpeakers = filteredSpeakers.slice(startIndex, endIndex);

      return {
        speakers: paginatedSpeakers,
        hasMore: endIndex < filteredSpeakers.length,
        total: filteredSpeakers.length,
        page,
        limit
      };
    } catch (error) {
      console.error('Error fetching speakers:', error);
      // Fallback to mock data
      return this.getMockSpeakers(page, limit, expertise, sortBy);
    }
  }

  /**
   * Fallback method to get mock speakers
   */
  private async getMockSpeakers(page: number = 1, limit: number = 9, expertise?: string, sortBy: 'name' | 'rating' | 'events' = 'name'): Promise<SpeakerListResponse> {
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredSpeakers = [...this.speakers];

    if (expertise && expertise !== 'All') {
      filteredSpeakers = filteredSpeakers.filter(speaker =>
        speaker.expertise.includes(expertise)
      );
    }

    // Sort speakers
    filteredSpeakers.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'events':
          return b.events - a.events;
        default:
          return 0;
      }
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSpeakers = filteredSpeakers.slice(startIndex, endIndex);

    return {
      speakers: paginatedSpeakers,
      hasMore: endIndex < filteredSpeakers.length,
      total: filteredSpeakers.length,
      page,
      limit
    };
  }

  async getSpeakerById(id: string): Promise<Speaker | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.speakers.find(speaker => speaker.id === id) || null;
  }

  async searchSpeakers(query: string, limit: number = 10): Promise<Speaker[]> {
    const searchTerm = query.toLowerCase();
    
    return this.speakers
      .filter(speaker => 
        speaker.name.toLowerCase().includes(searchTerm) ||
        speaker.title.toLowerCase().includes(searchTerm) ||
        speaker.company.toLowerCase().includes(searchTerm) ||
        speaker.expertise.some(exp => exp.toLowerCase().includes(searchTerm))
      )
      .slice(0, limit);
  }

  async getFeaturedSpeakers(): Promise<Speaker[]> {
    return this.speakers.filter(speaker => speaker.featured);
  }
}

export const speakerService = SpeakerService.getInstance();