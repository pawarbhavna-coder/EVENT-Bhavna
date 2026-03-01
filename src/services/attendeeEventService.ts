import { AttendeeEvent, RegistrationData } from '../types/attendeeEvent';
import { supabase } from '../lib/supabaseConfig';

class AttendeeEventService {
  private static instance: AttendeeEventService;

  static getInstance(): AttendeeEventService {
    if (!AttendeeEventService.instance) {
      AttendeeEventService.instance = new AttendeeEventService();
    }
    return AttendeeEventService.instance;
  }

  async getMyEvents(userId: string): Promise<AttendeeEvent[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('Not authenticated');
        return [];
      }

      // Use authenticated user's ID, not the parameter
      const { data, error } = await supabase
        .from('event_attendees')
        .select(`
          *,
          events!inner(
            id,
            title,
            description,
            start_date,
            end_date,
            location,
            image_url,
            category,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('registration_date', { ascending: false });

      if (error) {
        console.error('Error fetching attendee events:', error);
        return [];
      }

      return (data || []).map((record: any) => ({
        id: record.id,
        eventId: record.event_id,
        title: record.events.title,
        description: record.events.description || '',
        date: record.events.start_date.split('T')[0],
        time: record.events.start_date.split('T')[1].substring(0, 5),
        location: record.events.location,
        image: record.events.image_url,
        category: record.events.category,
        ticketType: record.ticket_type || 'General Admission',
        price: record.payment_amount || record.events.price || 0,
        registrationDate: record.registration_date,
        status: record.status === 'cancelled' ? 'cancelled' : 'registered',
        paymentStatus: record.payment_status,
        cancellationDate: record.status === 'cancelled' ? record.updated_at : undefined,
        refundAmount: record.status === 'cancelled' ? record.payment_amount * 0.9 : undefined
      }));
    } catch (error) {
      console.error('Error in getMyEvents:', error);
      return [];
    }
  }

  async registerForEvent(registrationData: RegistrationData, eventDetails: any): Promise<{ success: boolean; event?: AttendeeEvent; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Insert into event_attendees table
      const { data, error } = await supabase
        .from('event_attendees')
        .insert({
          event_id: registrationData.eventId,
          user_id: user.id,
          ticket_type: registrationData.ticketType,
          payment_amount: registrationData.price,
          payment_status: 'paid',
          status: 'registered',
          registration_date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Registration error:', error);
        return { success: false, error: error.message };
      }

      const newAttendeeEvent: AttendeeEvent = {
        id: data.id,
        eventId: registrationData.eventId,
        title: eventDetails.title,
        description: eventDetails.description,
        date: eventDetails.date,
        time: eventDetails.time,
        location: eventDetails.location,
        image: eventDetails.image,
        category: eventDetails.category,
        ticketType: registrationData.ticketType,
        price: registrationData.price,
        registrationDate: data.registration_date,
        status: 'registered',
        paymentStatus: 'paid'
      };

      return { success: true, event: newAttendeeEvent };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Failed to register for event' };
    }
  }

  async cancelRegistration(attendeeRegistrationId: string): Promise<{ success: boolean; refundAmount?: number; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Get the registration to calculate refund - using the attendee registration record ID
      const { data: registration, error: fetchError } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('id', attendeeRegistrationId)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !registration) {
        return { success: false, error: 'Event registration not found' };
      }

      const refundAmount = (registration.payment_amount || 0) * 0.9; // 90% refund

      // Update the registration status - using the attendee registration record ID
      const { error: updateError } = await supabase
        .from('event_attendees')
        .update({
          status: 'cancelled',
          payment_status: 'refunded'
        })
        .eq('id', attendeeRegistrationId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Cancel registration error:', updateError);
        return { success: false, error: updateError.message };
      }

      return { success: true, refundAmount };
    } catch (error) {
      console.error('Cancel registration error:', error);
      return { success: false, error: 'Failed to cancel registration' };
    }
  }

  async getEventById(attendeeRegistrationId: string): Promise<AttendeeEvent | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      // Query by the attendee registration record ID, not event ID
      const { data, error } = await supabase
        .from('event_attendees')
        .select(`
          *,
          events!inner(
            id,
            title,
            description,
            start_date,
            end_date,
            location,
            image_url,
            category,
            price
          )
        `)
        .eq('id', attendeeRegistrationId)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        console.error('Error fetching event:', error);
        return null;
      }

      return {
        id: data.id,
        eventId: data.event_id,
        title: data.events.title,
        description: data.events.description || '',
        date: data.events.start_date.split('T')[0],
        time: data.events.start_date.split('T')[1].substring(0, 5),
        location: data.events.location,
        image: data.events.image_url,
        category: data.events.category,
        ticketType: data.ticket_type || 'General Admission',
        price: data.payment_amount || data.events.price || 0,
        registrationDate: data.registration_date,
        status: data.status === 'cancelled' ? 'cancelled' : 'registered',
        paymentStatus: data.payment_status
      };
    } catch (error) {
      console.error('Error in getEventById:', error);
      return null;
    }
  }
}

export const attendeeEventService = AttendeeEventService.getInstance();
