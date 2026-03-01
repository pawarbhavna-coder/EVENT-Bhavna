// src/services/organizerCrudService.ts
import { supabase } from '../lib/supabaseConfig';

// Interfaces for organizer service
export interface OrganizerEvent {
  id: string;
  organizer_id: string;
  title: string;
  description?: string;
  category: string;
  event_date: string;
  time: string;
  end_time?: string;
  venue: string;
  capacity: number;
  attendees?: number;
  image_url?: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  visibility: 'public' | 'private' | 'unlisted';
  created_at: string;
  updated_at: string;
  price?: number;
  currency?: string;
  organizer_name?: string;
  organizer_email?: string;
  organizer_phone?: string;
  organizer_bio?: string;
  organizer_image?: string;
  organizer_company?: string;
  organizer_website?: string;
}

export interface OrganizerTicketType {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  sold: number;
  sale_start: string;
  sale_end?: string;
  is_active: boolean;
  benefits: string[];
  restrictions: string[];
  created_at: string;
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  imageUrl: string;
}

export interface Sponsor {
    id: string;
    name: string;
    logoUrl: string;
    website: string;
    tier: string;
}

export interface ScheduleItem {
    id: string;
    startTime: string;
    endTime: string;
    title: string;
    description: string;
}


export interface OrganizerEventAnalytics {
  id: string;
  event_id: string;
  views: number;
  registrations: number;
  conversion_rate: number;
  revenue: number;
  top_referrers: string[];
  created_at: string;
  updated_at: string;
}

export interface OrganizerAttendee {
  id: string;
  event_id: string;
  user_id: string;
  ticket_type_id?: string;
  registration_date: string;
  check_in_status: 'pending' | 'checked-in' | 'no-show';
  payment_status: 'pending' | 'paid' | 'refunded';
  additional_info: Record<string, unknown>;
  user?: {
    full_name: string;
    email: string;
  };
  ticket_type?: {
    name: string;
    price: number;
  };
}

export interface MarketingCampaign {
  id: string;
  event_id: string;
  name: string;
  type: 'email' | 'social' | 'sms' | 'push';
  subject?: string;
  content?: string;
  audience?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  sent_date?: string;
  open_rate: number;
  click_rate: number;
  created_at: string;
}

export interface EventFormData {
  title: string;
  description?: string;
  category: string;
  event_date: string;
  time: string;
  end_time?: string;
  venue: string;
  capacity: number;
  image_url?: string;
  imageFile?: File;
  imagePreview?: string;
  visibility: 'public' | 'private' | 'unlisted';
  organizer_name?: string;
  organizer_email?: string;
  organizer_phone?: string;
  organizer_bio?: string;
  organizer_image?: string;
  organizer_company?: string;
  organizer_website?: string;
}

export interface TicketFormData {
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  sale_start: string;
  sale_end?: string;
  is_active: boolean;
  benefits: string[];
  restrictions: string[];
}

// Helper to transform raw Supabase event data into the OrganizerEvent format
const transformDbEventToOrganizerEvent = (event: any): OrganizerEvent => ({
    id: event.id,
    organizer_id: event.organizer_id,
    title: event.title,
    description: event.description,
    category: event.category,
    event_date: new Date(event.start_date).toISOString().split('T')[0],
    time: new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    end_time: event.end_date ? new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
    venue: event.location || event.venue_name,
    capacity: event.max_attendees || 0,
    attendees: event.event_attendees?.[0]?.count || 0,
    image_url: event.image_url,
    status: event.status,
    visibility: 'public', // Assuming default visibility
    created_at: event.created_at,
    updated_at: event.updated_at,
    price: event.price,
    organizer_name: event.organizer_name,
    organizer_email: event.organizer_email,
    organizer_phone: event.organizer_phone,
    organizer_bio: event.organizer_bio,
    organizer_image: event.organizer_image,
    organizer_company: event.organizer_company,
    organizer_website: event.organizer_website
});


class OrganizerCrudService {
  private static instance: OrganizerCrudService;
  private eventListeners: ((events: OrganizerEvent[]) => void)[] = [];

  static getInstance(): OrganizerCrudService {
    if (!OrganizerCrudService.instance) {
      OrganizerCrudService.instance = new OrganizerCrudService();
    }
    return OrganizerCrudService.instance;
  }

  addEventListener(callback: (events: OrganizerEvent[]) => void) {
    this.eventListeners.push(callback);
  }

  removeEventListener(callback: (events: OrganizerEvent[]) => void) {
    this.eventListeners = this.eventListeners.filter(listener => listener !== callback);
  }

  private async notifyEventListeners(organizerId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = organizerId || user?.id;
    
    if (!userId) return;
    
    const result = await this.getMyEvents(userId);
    if (result.success && result.events) {
      this.eventListeners.forEach(callback => callback(result.events!));
    }
  }

  private async checkOrganizerAccess(): Promise<{ success: boolean; error?: string }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }
    return { success: true };
  }

  private validateImageFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' };
    }

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size exceeds 5MB limit.' };
    }

    return { isValid: true };
  }

  private async uploadImage(file: File, eventId?: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${eventId || Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `event-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return { success: false, error: uploadError.message };
      }

      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      return { success: true, url: publicUrl };
    } catch (error) {
      console.error('Image upload error:', error);
      return { success: false, error: 'Failed to upload image' };
    }
  }

  async createEvent(eventData: EventFormData, organizerId: string): Promise<{ success: boolean; event?: OrganizerEvent; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      if (!eventData.title || !eventData.venue || !eventData.event_date || !eventData.time) {
        return { success: false, error: 'Missing required fields: title, venue, date, and time are required' };
      }

      if (eventData.imageFile) {
        const validation = this.validateImageFile(eventData.imageFile);
        if (!validation.isValid) {
          return { success: false, error: validation.error };
        }
      }

      let imageUrl = eventData.image_url;
      if (eventData.imageFile) {
        const uploadResult = await this.uploadImage(eventData.imageFile);
        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
        } else {
          return { success: false, error: uploadResult.error || 'Failed to upload image' };
        }
      }

      const { data, error } = await supabase
        .from('events')
        .insert({
          organizer_id: user.id,
          title: eventData.title,
          description: eventData.description || '',
          category: eventData.category || 'conference',
          start_date: `${eventData.event_date}T${eventData.time}:00`,
          end_date: eventData.end_time ? `${eventData.event_date}T${eventData.end_time}:00` : `${eventData.event_date}T${eventData.time}:00`,
          location: eventData.venue,
          venue_name: eventData.venue,
          max_attendees: eventData.capacity,
          image_url: imageUrl,
          status: 'draft',
          is_online: false,
          price: 0,
          organizer_name: eventData.organizer_name,
          organizer_email: eventData.organizer_email,
          organizer_phone: eventData.organizer_phone,
          organizer_bio: eventData.organizer_bio,
          organizer_image: eventData.organizer_image,
          organizer_company: eventData.organizer_company,
          organizer_website: eventData.organizer_website,
          speakers_data: [],
          sponsors_data: [],
          schedule_data: []
        })
        .select()
        .single();

      if (error) {
        console.error('Create event error:', error);
        return { success: false, error: error.message };
      }

      const newEvent = transformDbEventToOrganizerEvent(data);

      await this.notifyEventListeners(user.id);
      return { success: true, event: newEvent };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to create event: ${message}` };
    }
  }

  async getMyEvents(organizerId: string): Promise<{ success: boolean; events?: OrganizerEvent[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { data, error } = await supabase
        .from('events')
        .select(`*, event_attendees(count)`)
        .eq('organizer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get events error:', error);
        return { success: false, error: error.message };
      }

      const events: OrganizerEvent[] = (data || []).map(transformDbEventToOrganizerEvent);

      return { success: true, events };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to fetch events: ${message}` };
    }
  }
  
  async getPublishedEvents(): Promise<{ success: boolean; events?: OrganizerEvent[]; error?: string }> {
    try {
        const { data, error } = await supabase
            .from('events')
            .select(`*, event_attendees(count)`)
            .eq('status', 'published')
            .order('start_date', { ascending: true });

        if (error) {
            console.error('Get published events error:', error);
            return { success: false, error: error.message };
        }

        const events: OrganizerEvent[] = (data || []).map(transformDbEventToOrganizerEvent);

        return { success: true, events };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        return { success: false, error: `Failed to fetch published events: ${message}` };
    }
  }


  async getEventById(eventId: string): Promise<{ success: boolean; event?: OrganizerEvent; error?: string }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        let query = supabase
            .from('events')
            .select(`*, event_attendees(count)`)
            .eq('id', eventId);

        // If user is not logged in, they can only see published events
        if (!user) {
            query = query.eq('status', 'published');
        } else {
            // If logged in, they can see their own events (any status) OR any published event
            query = query.or(`organizer_id.eq.${user.id},status.eq.published`);
        }

        const { data, error } = await query.single();
        
        if (error) {
            console.error('Get event by ID error:', error);
            return { success: false, error: 'Event not found or you do not have permission to view it.' };
        }
        
        if (!data) {
            return { success: false, error: 'Event not found' };
        }

        const event = transformDbEventToOrganizerEvent(data);
        return { success: true, event };

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        return { success: false, error: `Failed to fetch event: ${message}` };
    }
  }


  async updateEvent(eventId: string, updates: Partial<EventFormData>): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      if (updates.imageFile) {
        const validation = this.validateImageFile(updates.imageFile);
        if (!validation.isValid) {
          return { success: false, error: validation.error };
        }
      }

      let imageUrl = updates.image_url;
      if (updates.imageFile) {
        const uploadResult = await this.uploadImage(updates.imageFile, eventId);
        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
        } else {
          return { success: false, error: uploadResult.error || 'Failed to upload image' };
        }
      }

      const updateData: any = {};
      if (updates.title) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.category) updateData.category = updates.category;
      if (updates.event_date && updates.time) {
        updateData.start_date = `${updates.event_date}T${updates.time}:00`;
        if (updates.end_time) {
          updateData.end_date = `${updates.event_date}T${updates.end_time}:00`;
        }
      }
      if (updates.venue) {
        updateData.location = updates.venue;
        updateData.venue_name = updates.venue;
      }
      if (updates.capacity) updateData.max_attendees = updates.capacity;
      if (imageUrl) updateData.image_url = imageUrl;
      if (updates.organizer_name !== undefined) updateData.organizer_name = updates.organizer_name;
      if (updates.organizer_email !== undefined) updateData.organizer_email = updates.organizer_email;
      if (updates.organizer_phone !== undefined) updateData.organizer_phone = updates.organizer_phone;
      if (updates.organizer_bio !== undefined) updateData.organizer_bio = updates.organizer_bio;
      if (updates.organizer_image !== undefined) updateData.organizer_image = updates.organizer_image;
      if (updates.organizer_company !== undefined) updateData.organizer_company = updates.organizer_company;
      if (updates.organizer_website !== undefined) updateData.organizer_website = updates.organizer_website;
      if ((updates as any).speakers_data !== undefined) updateData.speakers_data = (updates as any).speakers_data;
      if ((updates as any).sponsors_data !== undefined) updateData.sponsors_data = (updates as any).sponsors_data;
      if ((updates as any).schedule_data !== undefined) updateData.schedule_data = (updates as any).schedule_data;

      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', eventId)
        .eq('organizer_id', user.id);

      if (error) {
        console.error('Update event error:', error);
        return { success: false, error: error.message };
      }

      await this.notifyEventListeners();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update event' };
    }
  }

  async publishEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      // First, get the event data to sync speakers, sponsors, and schedule
      const { data: eventData, error: fetchError } = await supabase
        .from('events')
        .select('speakers_data, sponsors_data, schedule_data')
        .eq('id', eventId)
        .eq('organizer_id', user.id)
        .single();

      if (fetchError) {
        console.error('Fetch event error:', fetchError);
        return { success: false, error: fetchError.message };
      }

      // Sync speakers from JSONB to speakers table
      if (eventData.speakers_data && Array.isArray(eventData.speakers_data) && eventData.speakers_data.length > 0) {
        const speakersResult = await this.saveEventSpeakers(eventId, eventData.speakers_data);
        if (!speakersResult.success) {
          console.warn('Failed to sync speakers:', speakersResult.error);
        }
      }

      // Sync sponsors from JSONB to sponsors table
      if (eventData.sponsors_data && Array.isArray(eventData.sponsors_data) && eventData.sponsors_data.length > 0) {
        const sponsorsResult = await this.saveEventSponsors(eventId, eventData.sponsors_data);
        if (!sponsorsResult.success) {
          console.warn('Failed to sync sponsors:', sponsorsResult.error);
        }
      }

      // Sync schedule from JSONB to event_schedule table
      if (eventData.schedule_data && Array.isArray(eventData.schedule_data) && eventData.schedule_data.length > 0) {
        const scheduleResult = await this.saveEventSchedule(eventId, eventData.schedule_data);
        if (!scheduleResult.success) {
          console.warn('Failed to sync schedule:', scheduleResult.error);
        }
      }

      // Now publish the event
      const { error } = await supabase
        .from('events')
        .update({ status: 'published' })
        .eq('id', eventId)
        .eq('organizer_id', user.id);

      if (error) {
        console.error('Publish event error:', error);
        return { success: false, error: error.message };
      }

      await this.notifyEventListeners();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to publish event' };
    }
  }

  async deleteEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('organizer_id', user.id);

      if (error) {
        console.error('Delete event error:', error);
        return { success: false, error: error.message };
      }

      await this.notifyEventListeners();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete event' };
    }
  }

  async getEventAnalytics(eventId: string): Promise<{ success: boolean; analytics?: OrganizerEventAnalytics; error?: string }> {
     try {
      const accessCheck = await this.checkOrganizerAccess();
      if (!accessCheck.success) {
        return { success: false, error: accessCheck.error };
      }
      const { count } = await supabase.from('event_attendees').select('*', { count: 'exact', head: true }).eq('event_id', eventId);
      const registrations = count || 0;
      const mockAnalytics: OrganizerEventAnalytics = {
        id: 'analytics_1',
        event_id: eventId,
        views: 1250,
        registrations,
        conversion_rate: registrations > 0 ? (registrations / 1250) * 100 : 0,
        revenue: registrations * 150,
        top_referrers: ['Direct', 'Social Media', 'Email'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return { success: true, analytics: mockAnalytics };
    } catch (error) {
      return { success: false, error: 'Failed to fetch analytics' };
    }
  }

  async getEventAttendees(eventId: string): Promise<{ success: boolean; attendees?: OrganizerAttendee[]; error?: string }> {
     try {
      const accessCheck = await this.checkOrganizerAccess();
      if (!accessCheck.success) {
        return { success: false, error: accessCheck.error };
      }
      const { data, error } = await supabase.from('event_attendees').select(`*, user_profiles!inner(full_name, email)`).eq('event_id', eventId);
      if (error) {
        console.error('Get attendees error:', error);
        return { success: false, error: error.message };
      }
      const attendees: OrganizerAttendee[] = (data || []).map((attendee: any) => {
        // *** FIX: Correctly map database status to frontend check_in_status ***
        let check_in_status: 'pending' | 'checked-in' | 'no-show' = 'pending';
        if (attendee.status === 'attended') {
            check_in_status = 'checked-in';
        } else if (attendee.status === 'no-show') {
            check_in_status = 'no-show';
        } else if (attendee.status === 'registered') {
            check_in_status = 'pending';
        }

        return {
            id: attendee.id,
            event_id: attendee.event_id,
            user_id: attendee.user_id,
            ticket_type_id: attendee.ticket_type,
            registration_date: attendee.registration_date,
            check_in_status: check_in_status,
            payment_status: attendee.payment_status,
            additional_info: attendee.notes ? { notes: attendee.notes } : {},
            user: { full_name: attendee.user_profiles?.full_name || 'Unknown', email: attendee.user_profiles?.email || 'unknown@email.com' }
        };
      });
      return { success: true, attendees };
    } catch (error) {
      return { success: false, error: 'Failed to fetch attendees' };
    }
  }

    async updateAttendeeStatus(attendeeId: string, status: 'pending' | 'checked-in' | 'no-show'): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      // *** FIX: Map frontend status to the correct database status value ***
      let dbStatus: string;
      switch (status) {
          case 'checked-in':
              dbStatus = 'attended';
              break;
          case 'pending':
              dbStatus = 'registered';
              break;
          case 'no-show':
              dbStatus = 'no-show'; // Assumes you will add 'no-show' to your DB check constraint
              break;
          default:
              dbStatus = 'registered';
      }

      // *** FIX: Update the 'status' column, not 'check_in_status' ***
      const { error } = await supabase
        .from('event_attendees')
        .update({ status: dbStatus })
        .eq('id', attendeeId);

      if (error) {
        console.error('Update attendee status error:', error);
        // Provide a more helpful error if the 'no-show' status doesn't exist in the DB
        if (error.message.includes('check constraint')) {
            return { success: false, error: "Database error: The 'no-show' status is not allowed. Please update your database schema." };
        }
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to update status: ${message}` };
    }
  }
  
  async createTicketType(eventId: string, ticketData: TicketFormData): Promise<{ success: boolean; ticket?: OrganizerTicketType; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { data, error } = await supabase
        .from('event_tickets')
        .insert({
          event_id: eventId,
          name: ticketData.name,
          description: ticketData.description,
          price: ticketData.price,
          currency: ticketData.currency,
          quantity: ticketData.quantity,
          sold: 0,
          sale_start: ticketData.sale_start,
          sale_end: ticketData.sale_end,
          is_active: ticketData.is_active,
          benefits: ticketData.benefits,
          restrictions: ticketData.restrictions
        })
        .select()
        .single();

      if (error) {
        console.error('Create ticket type error:', error);
        return { success: false, error: error.message };
      }

      const newTicket: OrganizerTicketType = {
        id: data.id,
        event_id: data.event_id,
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        currency: data.currency,
        quantity: data.quantity,
        sold: data.sold,
        sale_start: data.sale_start,
        sale_end: data.sale_end,
        is_active: data.is_active,
        benefits: Array.isArray(data.benefits) ? data.benefits : [],
        restrictions: Array.isArray(data.restrictions) ? data.restrictions : [],
        created_at: data.created_at
      };

      return { success: true, ticket: newTicket };
    } catch (error: any) {
      console.error('Error creating ticket type:', error);
      return { success: false, error: 'Failed to create ticket type: ' + error.message };
    }
  }

  async getTicketTypes(eventId: string): Promise<{ success: boolean; tickets?: OrganizerTicketType[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('event_tickets')
        .select('*')
        .eq('event_id', eventId)
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) {
        console.error('Get ticket types error:', error);
        return { success: false, error: error.message };
      }

      const tickets: OrganizerTicketType[] = (data || []).map((ticket: any) => ({
        id: ticket.id,
        event_id: ticket.event_id,
        name: ticket.name,
        description: ticket.description,
        price: parseFloat(ticket.price),
        currency: ticket.currency,
        quantity: ticket.quantity,
        sold: ticket.sold,
        sale_start: ticket.sale_start,
        sale_end: ticket.sale_end,
        is_active: ticket.is_active,
        benefits: Array.isArray(ticket.benefits) ? ticket.benefits : [],
        restrictions: Array.isArray(ticket.restrictions) ? ticket.restrictions : [],
        created_at: ticket.created_at
      }));

      return { success: true, tickets };
    } catch (error: any) {
      console.error('Error fetching ticket types:', error);
      return { success: false, error: 'Failed to fetch ticket types: ' + error.message };
    }
  }

  async updateTicketType(ticketId: string, updates: Partial<TicketFormData>): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.currency !== undefined) updateData.currency = updates.currency;
      if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
      if (updates.sale_start !== undefined) updateData.sale_start = updates.sale_start;
      if (updates.sale_end !== undefined) updateData.sale_end = updates.sale_end;
      if (updates.is_active !== undefined) updateData.is_active = updates.is_active;
      if (updates.benefits !== undefined) updateData.benefits = updates.benefits;
      if (updates.restrictions !== undefined) updateData.restrictions = updates.restrictions;

      const { error } = await supabase
        .from('event_tickets')
        .update(updateData)
        .eq('id', ticketId);

      if (error) {
        console.error('Update ticket type error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error updating ticket type:', error);
      return { success: false, error: 'Failed to update ticket type: ' + error.message };
    }
  }

  async deleteTicketType(ticketId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { error } = await supabase
        .from('event_tickets')
        .delete()
        .eq('id', ticketId);

      if (error) {
        console.error('Delete ticket type error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting ticket type:', error);
      return { success: false, error: 'Failed to delete ticket type: ' + error.message };
    }
  }

  async createCampaign(eventId: string, campaignData: Partial<MarketingCampaign>): Promise<{ success: boolean; campaign?: MarketingCampaign; error?: string }> {
    const newCampaign: MarketingCampaign = { id: `campaign_${Date.now()}`, event_id: eventId, name: campaignData.name || 'New Campaign', type: campaignData.type || 'email', status: 'draft', open_rate: 0, click_rate: 0, created_at: new Date().toISOString(), ...campaignData };
    return { success: true, campaign: newCampaign };
  }

  async getCampaigns(eventId: string): Promise<{ success: boolean; campaigns?: MarketingCampaign[]; error?: string }> {
    return { success: true, campaigns: [] };
  }

  async updateCampaign(campaignId: string, updates: Partial<MarketingCampaign>): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  }

  async deleteCampaign(campaignId: string): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  }

  async getEventSpeakers(eventId: string): Promise<{ success: boolean; speakers?: Speaker[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('event_speakers')
        .select('speakers(*)')
        .eq('event_id', eventId);
      if (error) throw error;
      const speakers = data.map((item: any) => ({
        id: item.speakers.id,
        name: item.speakers.name,
        title: item.speakers.title,
        company: item.speakers.company,
        bio: item.speakers.bio,
        imageUrl: item.speakers.image_url
      }));
      return { success: true, speakers };
    } catch (error: any) {
      console.error("Error fetching speakers:", error);
      return { success: false, error: 'Failed to fetch speakers: ' + error.message };
    }
  }

  async getEventSponsors(eventId: string): Promise<{ success: boolean; sponsors?: Sponsor[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('event_sponsors')
        .select('sponsors(*)')
        .eq('event_id', eventId);
      if (error) throw error;
      const sponsors = data.map((item: any) => ({
        id: item.sponsors.id,
        name: item.sponsors.name,
        logoUrl: item.sponsors.logo_url,
        website: item.sponsors.website_url,
        tier: item.sponsors.tier
      }));
      return { success: true, sponsors };
    } catch (error: any) {
      console.error("Error fetching sponsors:", error);
      return { success: false, error: 'Failed to fetch sponsors: ' + error.message };
    }
  }

  async getEventSchedule(eventId: string): Promise<{ success: boolean; schedule?: ScheduleItem[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('event_schedule')
        .select('*')
        .eq('event_id', eventId)
        .order('start_time', { ascending: true });

      if (error) throw error;

      const schedule: ScheduleItem[] = data.map((item: any) => ({
        id: item.id,
        startTime: item.start_time,
        endTime: item.end_time,
        title: item.title,
        description: item.description || ''
      }));

      return { success: true, schedule };
    } catch (error: any) {
      console.error("Error fetching schedule:", error);
      return { success: false, error: 'Failed to fetch schedule: ' + error.message };
    }
  }
  
  async saveEventSpeakers(eventId: string, speakers: any[]): Promise<{ success: boolean; error?: string }> {
    try {
      const speakerUpserts = speakers.map(s => ({
        name: s.name,
        title: s.title,
        company: s.company,
        bio: s.bio,
        image_url: s.image || s.imageUrl,
      }));

      const { data: upsertedSpeakers, error: upsertError } = await supabase
        .from('speakers')
        .upsert(speakerUpserts, { onConflict: 'name, company' })
        .select('id, name');

      if (upsertError) throw upsertError;

      await supabase.from('event_speakers').delete().eq('event_id', eventId);

      const speakerLinks = upsertedSpeakers.map(us => ({
        event_id: eventId,
        speaker_id: us.id
      }));

      if (speakerLinks.length > 0) {
        const { error: linkError } = await supabase.from('event_speakers').insert(speakerLinks);
        if (linkError) throw linkError;
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error saving speakers:', error);
      return { success: false, error: 'Failed to save speakers: ' + error.message };
    }
  }

  async saveEventSponsors(eventId: string, sponsors: any[]): Promise<{ success: boolean; error?: string }> {
      try {
          const sponsorUpserts = sponsors.map(s => ({
            name: s.name,
            logo_url: s.logo || s.logoUrl,
            website_url: s.website,
            tier: s.tier,
            description: s.description || ''
          }));

          const { data: upsertedSponsors, error: upsertError } = await supabase
            .from('sponsors')
            .upsert(sponsorUpserts, { onConflict: 'name' })
            .select('id, name');

          if (upsertError) throw upsertError;

          await supabase.from('event_sponsors').delete().eq('event_id', eventId);

          const sponsorLinks = upsertedSponsors.map(us => ({
              event_id: eventId,
              sponsor_id: us.id
          }));

          if (sponsorLinks.length > 0) {
            const { error: linkError } = await supabase.from('event_sponsors').insert(sponsorLinks);
            if (linkError) throw linkError;
          }

          return { success: true };
      } catch (error: any) {
          console.error('Error saving sponsors:', error);
          return { success: false, error: 'Failed to save sponsors: ' + error.message };
      }
  }

  async saveEventSchedule(eventId: string, scheduleItems: any[]): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      await supabase.from('event_schedule').delete().eq('event_id', eventId);

      if (scheduleItems.length > 0) {
        const scheduleInserts = scheduleItems.map(item => ({
          event_id: eventId,
          title: item.title,
          description: item.description || '',
          start_time: item.startTime,
          end_time: item.endTime,
          location: item.location || null,
          speaker_id: item.speaker_id || null
        }));

        const { error: insertError } = await supabase
          .from('event_schedule')
          .insert(scheduleInserts);

        if (insertError) throw insertError;
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error saving schedule:', error);
      return { success: false, error: 'Failed to save schedule: ' + error.message };
    }
  }

  // --- ADMIN-SPECIFIC FUNCTIONS ---

  async getAllUsers(): Promise<{ success: boolean; users?: any[]; error?: string }> {
    try {
      // This requires admin privileges defined in RLS
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*');

      if (error) {
        console.error('Error fetching all users:', error);
        return { success: false, error: error.message };
      }
      return { success: true, users: data };
    } catch (error: any) {
      return { success: false, error: 'Failed to fetch all users: ' + error.message };
    }
  }

  async getAllEvents(): Promise<{ success: boolean; events?: OrganizerEvent[]; error?: string }> {
    try {
      // This requires admin privileges defined in RLS
      const { data, error } = await supabase
        .from('events')
        .select(`*, event_attendees(count)`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get all events error:', error);
        return { success: false, error: error.message };
      }

      const events: OrganizerEvent[] = (data || []).map(transformDbEventToOrganizerEvent);
      return { success: true, events };
    } catch (error: any) {
      return { success: false, error: `Failed to fetch all events: ${error.message}` };
    }
  }

  async adminDeleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Securely call the database function 'delete_user_by_admin'
      const { error } = await supabase.rpc('delete_user_by_admin', {
        user_id_to_delete: userId
      });

      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error: any) {
        const errorMessage = error.message || 'An unexpected error occurred.';
        console.error('Admin delete user error:', errorMessage);
        return { success: false, error: 'Failed to delete user: ' + errorMessage };
    }
  }

  async adminDeleteEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // This relies on the admin having a RLS policy that allows deleting any event.
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
      
      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      return { success: false, error: 'Failed to delete event: ' + error.message };
    }
  }

  async getEventsForOrganizer(organizerId: string): Promise<{ success: boolean, events?: OrganizerEvent[] }> {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', organizerId);
      if (error) return { success: false, events: [] };
      return { success: true, events: data.map(transformDbEventToOrganizerEvent) };
  }

  async getEventRegistrationsForUser(userId: string): Promise<{ success: boolean, registrations?: any[] }> {
      const { data, error } = await supabase
        .from('event_attendees')
        .select('*, events(title)')
        .eq('user_id', userId);
      if (error) return { success: false, registrations: [] };
      return { success: true, registrations: data };
  }
}

export const organizerCrudService = OrganizerCrudService.getInstance();
