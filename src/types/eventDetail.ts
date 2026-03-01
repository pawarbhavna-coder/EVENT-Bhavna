export interface EventDetail {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  date: string;
  time: string;
  endTime: string;
  location: string;
  venue: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    capacity: number;
    amenities: string[];
  };
  price: {
    early: number;
    regular: number;
    vip: number;
    student: number;
  };
  maxAttendees: number;
  currentAttendees: number;
  image: string;
  gallery: string[];
  organizer: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    contact: string;
  };
  speakers: EventSpeaker[];
  sponsors: EventSponsor[];
  schedule: ScheduleItem[];
  tags: string[];
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  isVirtual: boolean;
  isFeatured: boolean;
  registrationUrl: string;
  requirements: string[];
  whatToExpect: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventSpeaker {
  id: string;
  name: string;
  title: string;
  company: string;
  image: string;
  bio: string;
  sessions: string[];
}

export interface EventSponsor {
  id: string;
  name: string;
  logo: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  website: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  speaker?: string;
  room: string;
  type: 'keynote' | 'session' | 'workshop' | 'break' | 'networking';
}