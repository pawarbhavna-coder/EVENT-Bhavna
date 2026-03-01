export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  fullBio: string;
  image: string;
  expertise: string[];
  location: string;
  rating: number;
  events: number;
  featured: boolean;
  achievements: string[];
  upcomingEvents: SpeakerEvent[];
  pastEvents: SpeakerEvent[];
  socialLinks: {
    email?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  sessions: Session[];
}

export interface SpeakerEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  topic: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  room: string;
  eventId: string;
  eventName: string;
}

export interface SpeakerListResponse {
  speakers: Speaker[];
  hasMore: boolean;
  total: number;
  page: number;
  limit: number;
}