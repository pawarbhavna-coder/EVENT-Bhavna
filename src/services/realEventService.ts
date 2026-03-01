import { supabase } from '../lib/supabaseConfig';

export interface RealEvent {
  id: string;
  organizer_id: string;
  title: string;
  description?: string;
  event_date: string;
  time: string;
  end_time?: string;
  venue: string;
  capacity: number;
  image_url?: string;
  category: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  visibility: 'public' | 'private' | 'unlisted';
  created_at: string;
  updated_at: string;
}

export interface RealTicketType {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  sold: number;
  sale_start: string;
  sale_end: string;
  is_active: boolean;
  benefits: string[];
  restrictions: string[];
  created_at: string;
}

export interface RealAttendee {
  id: string;
  event_id: string;
  user_id: string;
  ticket_type_id: string;
  registration_date: string;
  check_in_status: 'pending' | 'checked-in' | 'no-show';
  payment_status: 'pending' | 'paid' | 'refunded';
  additional_info: any;
  user?: {
    full_name: string;
    email: string;
  };
  ticket_type?: {
    name: string;
    price: number;
  };
}

export interface RealEventAnalytics {
  id: string;
  event_id: string;
  views: number;
  registrations: number;
  conversion_rate: number;
  revenue: number;
  top_referrers: string[];
  updated_at: string;
}

export interface RealMarketingCampaign {
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
  event_date: string;
  time: string;
  end_time?: string;
  venue: string;
  capacity: number;
  image_url?: string;
  category: string;
  visibility: 'public' | 'private' | 'unlisted';
}

export interface TicketFormData {
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  sale_start: string;
  sale_end: string;
  is_active: boolean;
  benefits: string[];
  restrictions: string[];
}

export interface DashboardStats {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  upcomingEvents: number;
  completedEvents: number;
  averageAttendance: number;
}

class RealEventService {
  private static instance: RealEventService;
  private eventListeners: ((events: any[]) => void)[] = [];

  static getInstance(): RealEventService {
    if (!RealEventService.instance) {
      RealEventService.instance = new RealEventService();
    }
    return RealEventService.instance;
  }

  addEventListener(callback: (events: any[]) => void) {
    this.eventListeners.push(callback);
  }

  removeEventListener(callback: (events: any[]) => void) {
    this.eventListeners = this.eventListeners.filter(listener => listener !== callback);
  }

  private async notifyEventListeners() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const result = await this.getMyEvents(user.id);
    if (result.success && result.events) {
      this.eventListeners.forEach(callback => callback(result.events!));
    }
  }

  private mapDbEventToRealEvent(dbEvent: any): RealEvent {
    const startDate = dbEvent.start_date ? new Date(dbEvent.start_date) : null;
    const endDate = dbEvent.end_date ? new Date(dbEvent.end_date) : null;

    return {
      id: dbEvent.id,
      organizer_id: dbEvent.organizer_id,
      title: dbEvent.title,
      description: dbEvent.description,
      event_date: startDate ? startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      time: startDate ? startDate.toTimeString().substring(0, 5) : '09:00',
      end_time: endDate ? endDate.toTimeString().substring(0, 5) : undefined,
      venue: dbEvent.location || dbEvent.venue_name || '',
      capacity: dbEvent.max_attendees || 100,
      image_url: dbEvent.image_url,
      category: dbEvent.category || 'conference',
      status: dbEvent.status || 'draft',
      visibility: dbEvent.visibility || 'public',
      created_at: dbEvent.created_at,
      updated_at: dbEvent.updated_at,
    };
  }

  async createEvent(eventData: EventFormData, organizerId: string): Promise<{ success: boolean; event?: RealEvent; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { data, error } = await supabase
        .from('events')
        .insert({
          organizer_id: user.id,
          title: eventData.title,
          description: eventData.description || '',
          category: eventData.category,
          start_date: `${eventData.event_date}T${eventData.time}:00`,
          end_date: eventData.end_time ? `${eventData.event_date}T${eventData.end_time}:00` : `${eventData.event_date}T${eventData.time}:00`,
          location: eventData.venue,
          venue_name: eventData.venue,
          max_attendees: eventData.capacity,
          image_url: eventData.image_url,
          status: 'draft',
          is_online: false,
          price: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Create event error:', error);
        return { success: false, error: error.message };
      }

      const newEvent = this.mapDbEventToRealEvent(data);
      await this.notifyEventListeners();
      return { success: true, event: newEvent };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to create event: ${message}` };
    }
  }

  async getMyEvents(organizerId: string): Promise<{ success: boolean; events?: RealEvent[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get events error:', error);
        return { success: false, error: error.message };
      }

      const events = (data || []).map(this.mapDbEventToRealEvent);
      return { success: true, events };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to fetch events: ${message}` };
    }
  }
  
  async getEventById(eventId: string): Promise<{ success: boolean; event?: RealEvent; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      // RLS ensures user can only access their own events
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .eq('organizer_id', user.id)
        .single();

      if (error) {
        console.error('Get event error:', error);
        return { success: false, error: error.message };
      }

      if (!data) {
        return { success: false, error: 'Event not found' };
      }

      const event = this.mapDbEventToRealEvent(data);
      return { success: true, event };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to fetch event: ${message}` };
    }
  }

  async updateEvent(eventId: string, updates: Partial<EventFormData>): Promise<{ success: boolean; event?: RealEvent; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
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
      if (updates.image_url) updateData.image_url = updates.image_url;

      // RLS ensures user can only update their own events
      const { data, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', eventId)
        .eq('organizer_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Update event error:', error);
        return { success: false, error: error.message };
      }

      await this.notifyEventListeners();

      const updatedEvent = this.mapDbEventToRealEvent(data);
      return { success: true, event: updatedEvent };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        return { success: false, error: `Failed to update event: ${message}` };
    }
  }
  
  async getDashboardStats(organizerId: string): Promise<{ success: boolean; stats?: DashboardStats; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id, status, max_attendees')
        .eq('organizer_id', user.id);

      if (eventsError) {
        console.error('Get dashboard stats error:', eventsError);
        return { success: false, error: eventsError.message };
      }

      const totalEvents = events?.length || 0;
      const publishedEvents = events?.filter(e => e.status === 'published').length || 0;
      const draftEvents = events?.filter(e => e.status === 'draft').length || 0;

      const stats: DashboardStats = {
        totalEvents,
        publishedEvents,
        draftEvents,
        totalTicketsSold: 0,
        totalRevenue: 0,
        upcomingEvents: 0,
        completedEvents: 0,
        averageAttendance: 0
      };

      return { success: true, stats };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to fetch dashboard stats: ${message}` };
    }
  }

  // Ticket and attendee methods (using mock data as tables may not exist yet)
  async createTicketType(eventId: string, ticketData: TicketFormData): Promise<{ success: boolean; ticket?: RealTicketType; error?: string }> {
    const newTicket: RealTicketType = {
      id: `ticket_${Date.now()}`,
      event_id: eventId,
      ...ticketData,
      sold: 0,
      created_at: new Date().toISOString()
    };
    return { success: true, ticket: newTicket };
  }

  async getTicketTypes(eventId: string): Promise<{ success: boolean; tickets?: RealTicketType[]; error?: string }> {
    return { success: true, tickets: [] };
  }

  async updateTicketType(ticketId: string, updates: Partial<TicketFormData>): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  }

  async getEventAttendees(eventId: string): Promise<{ success: boolean; attendees?: RealAttendee[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('event_attendees')
        .select(`
          *,
          user_profiles!inner(full_name, email)
        `)
        .eq('event_id', eventId);

      if (error) {
        console.error('Get attendees error:', error);
        return { success: false, error: error.message };
      }

      const attendees: RealAttendee[] = (data || []).map((attendee: any) => ({
        id: attendee.id,
        event_id: attendee.event_id,
        user_id: attendee.user_id,
        ticket_type_id: attendee.ticket_type || 'general',
        registration_date: attendee.registration_date,
        check_in_status: 'pending',
        payment_status: attendee.payment_status,
        additional_info: {},
        user: {
          full_name: attendee.user_profiles?.full_name || 'Unknown',
          email: attendee.user_profiles?.email || 'unknown@email.com'
        }
      }));

      return { success: true, attendees };
    } catch (error) {
      return { success: false, error: 'Failed to fetch attendees' };
    }
  }

  async getEventAnalytics(eventId: string): Promise<{ success: boolean; analytics?: RealEventAnalytics; error?: string }> {
    try {
      const { count } = await supabase
        .from('event_attendees')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId);

      const registrations = count || 0;

      const analytics: RealEventAnalytics = {
        id: 'analytics_1',
        event_id: eventId,
        views: 1250,
        registrations,
        conversion_rate: registrations > 0 ? (registrations / 1250) * 100 : 0,
        revenue: registrations * 150,
        top_referrers: ['Direct', 'Social Media', 'Email'],
        updated_at: new Date().toISOString()
      };

      return { success: true, analytics };
    } catch (error) {
      return { success: false, error: 'Failed to fetch analytics' };
    }
  }

  async createMarketingCampaign(eventId: string, campaignData: Partial<RealMarketingCampaign>): Promise<{ success: boolean; campaign?: RealMarketingCampaign; error?: string }> {
    const newCampaign: RealMarketingCampaign = {
      id: `campaign_${Date.now()}`,
      event_id: eventId,
      name: campaignData.name || 'New Campaign',
      type: campaignData.type || 'email',
      status: 'draft',
      open_rate: 0,
      click_rate: 0,
      created_at: new Date().toISOString(),
      ...campaignData
    };
    return { success: true, campaign: newCampaign };
  }

  async getMarketingCampaigns(eventId: string): Promise<{ success: boolean; campaigns?: RealMarketingCampaign[]; error?: string }> {
    return { success: true, campaigns: [] };
  }
}

export const realEventService = RealEventService.getInstance();
