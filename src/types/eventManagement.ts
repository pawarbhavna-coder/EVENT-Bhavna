// Comprehensive event management types for EventEase

export interface Event {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  tags: string[];
  
  // Event timing
  startDate: string;
  endDate: string;
  timezone: string;
  
  // Location & Venue
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    capacity: number;
    type: 'physical' | 'virtual' | 'hybrid';
    amenities: string[];
    coordinates?: {
      lat: number;
      lng: number;
    };
    virtualLink?: string;
  };
  
  // Visual assets
  imageUrl: string;
  gallery: string[];
  
  // Pricing & Tickets
  ticketTypes: TicketType[];
  currency: string;
  
  // Registration settings
  maxAttendees: number;
  currentAttendees: number;
  registrationDeadline: string;
  requireApproval: boolean;
  allowWaitlist: boolean;
  maxTicketsPerPerson: number;
  
  // Event details
  whatToExpect: string[];
  requirements: string[];
  refundPolicy: string;
  
  // Organizer information
  organizer: {
    name: string;
    bio: string;
    contact: string;
    avatar: string;
  };
  
  // Additional content
  speakers: Speaker[];
  schedule: ScheduleItem[];
  
  // Meta information
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  visibility: 'public' | 'private' | 'unlisted';
  isFeatured: boolean;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  available: number;
  benefits: string[];
  restrictions: string[];
  saleStart: string;
  saleEnd: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Speaker {
  id: string;
  eventId: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  imageUrl: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  sessions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleItem {
  id: string;
  eventId: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  speakerId?: string;
  room: string;
  type: 'keynote' | 'session' | 'workshop' | 'break' | 'networking' | 'meal';
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  attendeeId: string;
  ticketTypeId: string;
  quantity: number;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  paymentId?: string;
  registrationData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    dietaryRequirements?: string;
    accessibilityNeeds?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface EventFormData {
  // Basic Information
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  tags: string[];
  
  // Date & Time
  startDate: string;
  endDate: string;
  timezone: string;
  
  // Location & Venue
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    capacity: number;
    type: 'physical' | 'virtual' | 'hybrid';
    amenities: string[];
    coordinates?: {
      lat: number;
      lng: number;
    };
    virtualLink?: string;
  };
  
  // Visual Assets
  image: File | string | null;
  gallery: (File | string)[];
  
  // Pricing & Tickets
  ticketTypes: TicketTypeFormData[];
  currency: string;
  
  // Registration Settings
  maxAttendees: number;
  registrationDeadline: string;
  requireApproval: boolean;
  allowWaitlist: boolean;
  maxTicketsPerPerson: number;
  
  // Event Details
  whatToExpect: string[];
  requirements: string[];
  refundPolicy: string;
  
  // Organizer Information
  organizer: {
    name: string;
    bio: string;
    contact: string;
    avatar: File | string | null;
  };
  
  // Speakers
  speakers: SpeakerFormData[];
  
  // Schedule/Agenda
  schedule: ScheduleItemFormData[];
  
  // Settings
  visibility: 'public' | 'private' | 'unlisted';
  status: 'draft' | 'published';
}

export interface TicketTypeFormData {
  id?: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  benefits: string[];
  restrictions: string[];
  saleStart: string;
  saleEnd: string;
  isActive: boolean;
}

export interface SpeakerFormData {
  id?: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  image: File | string | null;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  sessions: string[];
}

export interface ScheduleItemFormData {
  id?: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  speakerId?: string;
  room: string;
  type: 'keynote' | 'session' | 'workshop' | 'break' | 'networking' | 'meal';
}

// API Response types
export interface EventListResponse {
  events: Event[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface EventCreateResponse {
  success: boolean;
  event?: Event;
  error?: string;
}

export interface EventUpdateResponse {
  success: boolean;
  event?: Event;
  error?: string;
}

export interface EventDeleteResponse {
  success: boolean;
  error?: string;
}

// Filter and search types
export interface EventFilters {
  category?: string;
  status?: 'draft' | 'published' | 'cancelled' | 'completed';
  visibility?: 'public' | 'private' | 'unlisted';
  dateRange?: {
    start: string;
    end: string;
  };
  location?: {
    city?: string;
    state?: string;
    country?: string;
    type?: 'physical' | 'virtual' | 'hybrid';
  };
  priceRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
  organizerId?: string;
}

export interface EventSearchParams {
  query?: string;
  filters?: EventFilters;
  sortBy?: 'date' | 'title' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Dashboard types
export interface OrganizerDashboard {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  totalAttendees: number;
  totalRevenue: number;
  recentEvents: Event[];
  upcomingEvents: Event[];
  recentRegistrations: EventRegistration[];
}

export interface AttendeeDashboard {
  registeredEvents: Event[];
  favoriteEvents: Event[];
  upcomingEvents: Event[];
  pastEvents: Event[];
  notifications: Notification[];
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'event_created' | 'event_updated' | 'event_cancelled' | 'registration_confirmed' | 'payment_success' | 'event_reminder';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

// Realtime event types
export interface RealtimeEventUpdate {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: 'events' | 'ticket_types' | 'speakers' | 'schedule_items';
  record: any;
  old_record?: any;
}

// Validation types
export interface EventValidationErrors {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  venue?: string;
  ticketTypes?: string;
  speakers?: string;
  schedule?: string;
  general?: string;
}

export interface TicketTypeValidationErrors {
  name?: string;
  price?: string;
  quantity?: string;
  saleStart?: string;
  saleEnd?: string;
}

export interface SpeakerValidationErrors {
  name?: string;
  title?: string;
  bio?: string;
  image?: string;
}

export interface ScheduleItemValidationErrors {
  title?: string;
  startTime?: string;
  endTime?: string;
  room?: string;
}
