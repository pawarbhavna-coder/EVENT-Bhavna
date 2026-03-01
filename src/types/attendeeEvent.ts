export interface AttendeeEvent {
  id: string;
  eventId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  ticketType: 'early' | 'regular' | 'vip' | 'student';
  price: number;
  registrationDate: string;
  status: 'registered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  cancellationDate?: string;
  refundAmount?: number;
}

export interface RegistrationData {
  eventId: string;
  ticketType: 'early' | 'regular' | 'vip' | 'student';
  price: number;
  attendeeInfo: {
    name: string;
    email: string;
    phone?: string;
  };
}