import { EventDetail } from '../types/eventDetail';

export class EventDetailService {
  async getEventDetail(eventId: string): Promise<EventDetail> {
    // Mock event detail data - replace with actual API call
    return {
      id: eventId,
      title: 'Sample Event',
      description: 'This is a sample event description',
      fullDescription: 'This is a comprehensive description of the sample event with all the details attendees need to know.',
      date: new Date().toISOString(),
      time: '10:00 AM',
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
      location: 'Sample Location',
      category: 'Technology',
      organizer: {
        id: 'org-1',
        name: 'Sample Organizer',
        email: 'organizer@example.com',
        company: 'Sample Company',
        bio: 'Experienced event organizer',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        contact: 'organizer@example.com'
      },
      venue: {
        id: 'venue-1',
        name: 'Sample Venue',
        address: '123 Main St, City, State 12345',
        capacity: 100,
        amenities: ['WiFi', 'Parking', 'Catering'],
        coordinates: {
          lat: 40.7128,
          lng: -74.0060
        }
      },
      capacity: 100,
      maxAttendees: 100,
      registeredCount: 45,
      currentAttendees: 45,
      price: {
        early: 79.99,
        regular: 99.99,
        vip: 149.99,
        student: 49.99
      },
      currency: 'INR',
      status: 'upcoming',
      tags: ['conference', 'technology'],
      image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
      imageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
      gallery: [
        'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
        'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg'
      ],
      speakers: [
        {
          id: 'speaker-1',
          name: 'John Doe',
          title: 'Keynote Speaker',
          company: 'Tech Corp',
          bio: 'Industry expert with 10+ years experience',
          image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
          sessions: ['Opening Keynote'],
          social: {
            twitter: '@johndoe',
            linkedin: 'johndoe'
          }
        }
      ],
      sponsors: [
        {
          id: 'sponsor-1',
          name: 'Tech Sponsor',
          logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg',
          tier: 'gold',
          website: 'https://example.com'
        }
      ],
      schedule: [
        {
          id: 'session-1',
          time: '09:00',
          title: 'Opening Keynote',
          speaker: 'John Doe',
          duration: 60,
          description: 'Welcome and opening remarks',
          room: 'Main Hall',
          type: 'keynote'
        },
        {
          id: 'session-2',
          time: '10:30',
          title: 'Panel Discussion',
          speaker: 'Various Speakers',
          duration: 90,
          description: 'Industry panel discussion',
          room: 'Room A',
          type: 'session'
        }
      ],
      agenda: [
        {
          time: '09:00',
          title: 'Opening Keynote',
          speaker: 'John Doe',
          duration: 60
        },
        {
          time: '10:30',
          title: 'Panel Discussion',
          speaker: 'Various Speakers',
          duration: 90
        }
      ],
      isVirtual: false,
      isFeatured: true,
      registrationUrl: 'https://example.com/register',
      requirements: ['Valid ID', 'Registration confirmation'],
      whatToExpect: ['Networking opportunities', 'Expert presentations', 'Q&A sessions'],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      updatedAt: new Date().toISOString()
    };
  }
}

export const eventDetailService = new EventDetailService();
