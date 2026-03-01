import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, MapPin, Users, Clock, Star, Share2, Download,
  ExternalLink, Timer, Loader2, CheckCircle, AlertCircle, Play,
  User, Award, Globe, Mail, Phone, Ticket, Building
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import { supabase } from '../../lib/supabaseConfig';
// UPDATED: Import all necessary types from the service
import {
  organizerCrudService,
  OrganizerEvent,
  OrganizerTicketType,
  Speaker as SpeakerType, // Renaming to avoid conflict
  Sponsor as SponsorType,
  ScheduleItem as ScheduleItemType
} from '../../services/organizerCrudService';

// Tier colors for sponsor badges
const tierColors = {
  platinum: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-yellow-600',
  silver: 'from-gray-300 to-gray-500',
  bronze: 'from-orange-400 to-orange-600'
};

const EventDetailPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setRegistrationData } = useApp();
  const [event, setEvent] = useState<OrganizerEvent | null>(null);
  const [ticketTypes, setTicketTypes] = useState<OrganizerTicketType[]>([]);
  const [isOrganizer, setIsOrganizer] = useState(false);
  // ADDED: State for speakers, sponsors, and schedule
  const [speakers, setSpeakers] = useState<SpeakerType[]>([]);
  const [sponsors, setSponsors] = useState<SponsorType[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItemType[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<string>('');

  React.useEffect(() => {
    setBreadcrumbs(['Events', 'Event Details']);
    loadEvent();
  }, [eventId]);

  useEffect(() => {
    if (event && event.status === 'published') {
      const timer = setInterval(() => {
        const eventDateTime = new Date(`${event.event_date} ${event.time}`).getTime();
        const now = new Date().getTime();
        const difference = eventDateTime - now;

        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
          });
        } else {
          setTimeLeft(null);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [event]);

  // UPDATED: Now fetches all related event data
  const loadEvent = async () => {
    if (!eventId) {
      setError('Event ID not provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // First load the event
      const eventResult = await organizerCrudService.getEventById(eventId);

      if (!eventResult.success || !eventResult.event) {
        setError(eventResult.error || 'Event not found');
        return;
      }

      const eventData = eventResult.event;
      setEvent(eventData);

      // Check if current user is the organizer
      const { data: { user } } = await supabase.auth.getUser();
      if (user && eventData.organizer_id === user.id) {
        setIsOrganizer(true);
      }

      // Load tickets
      const ticketsResult = await organizerCrudService.getTicketTypes(eventId);
      if (ticketsResult.success && ticketsResult.tickets) {
        setTicketTypes(ticketsResult.tickets);
        if (ticketsResult.tickets.length > 0) {
          setSelectedTicketType(ticketsResult.tickets[0].id);
        }
      }

      // Load speakers from database tables (prioritize over JSONB)
      const speakersResult = await organizerCrudService.getEventSpeakers(eventId);
      if (speakersResult.success && speakersResult.speakers && speakersResult.speakers.length > 0) {
        setSpeakers(speakersResult.speakers);
      } else {
        // Fallback to JSONB if database tables are empty
        const speakersData = (eventData as any).speakers_data || [];
        const parsedSpeakers = speakersData.map((s: any, index: number) => ({
          id: `speaker_${index}`,
          name: s.name || '',
          title: s.title || '',
          company: s.company || '',
          bio: s.bio || '',
          imageUrl: s.imageUrl || s.image || ''
        }));
        setSpeakers(parsedSpeakers);
      }

      // Load sponsors from database tables (prioritize over JSONB)
      const sponsorsResult = await organizerCrudService.getEventSponsors(eventId);
      if (sponsorsResult.success && sponsorsResult.sponsors && sponsorsResult.sponsors.length > 0) {
        setSponsors(sponsorsResult.sponsors);
      } else {
        // Fallback to JSONB if database tables are empty
        const sponsorsData = (eventData as any).sponsors_data || [];
        const parsedSponsors = sponsorsData.map((s: any, index: number) => ({
          id: `sponsor_${index}`,
          name: s.name || '',
          logoUrl: s.logoUrl || s.logo || '',
          website: s.website || '',
          tier: s.tier || 'bronze'
        }));
        setSponsors(parsedSponsors);
      }

      // Load schedule from database tables (prioritize over JSONB)
      const scheduleResult = await organizerCrudService.getEventSchedule(eventId);
      if (scheduleResult.success && scheduleResult.schedule && scheduleResult.schedule.length > 0) {
        setSchedule(scheduleResult.schedule);
      } else {
        // Fallback to JSONB if database tables are empty
        const scheduleData = (eventData as any).schedule_data || [];
        const parsedSchedule = scheduleData.map((item: any, index: number) => ({
          id: `schedule_${index}`,
          title: item.title || '',
          description: item.description || '',
          startTime: item.startTime || '',
          endTime: item.endTime || ''
        }));
        setSchedule(parsedSchedule);
      }

    } catch (err) {
      setError('Failed to load event details. Please try again.');
      console.error('Error loading event:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description || '',
          url: window.location.href,
        });
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Event URL copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy URL. Please copy manually from the address bar.');
    });
  };

  const handleDownloadSchedule = () => {
    alert('Schedule PDF download would start here');
  };

  const handleRegister = () => {
    if (!isAuthenticated) {
      alert('Please log in to register for this event');
      return;
    }

    if (event) {
      const selectedTicket = ticketTypes.find(t => t.id === selectedTicketType);
      if (!selectedTicket) {
        alert("Please select a valid ticket type.");
        return;
      }

      const registrationInfo = {
        eventId: event.id,
        eventDetails: {
          title: event.title,
          description: event.description,
          date: event.event_date,
          time: event.time,
          location: event.venue,
          image: event.image_url,
          category: event.category
        },
        ticketType: selectedTicket.name,
        price: selectedTicket.price
      };

      setRegistrationData(registrationInfo);
      navigate('/event-payment');
    }
  };

  const getTicketPrice = () => {
    if (!event || !selectedTicketType) return 0;
    const ticket = ticketTypes.find(t => t.id === selectedTicketType);
    return ticket ? ticket.price : 0;
  };

  const getAvailabilityStatus = () => {
    if (!event) return 'unknown';
    const spotsLeft = event.capacity - (event.attendees || 0);
    if (spotsLeft <= 0) return 'sold-out';
    if (spotsLeft <= 50) return 'limited';
    return 'available';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-red-700 mb-4">{error || 'Event not found'}</p>
              <button
                onClick={() => window.history.back()}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const availabilityStatus = getAvailabilityStatus();
  const currentAttendees = event.attendees || 0;
  const maxAttendees = event.capacity;
  const spotsRemaining = maxAttendees - currentAttendees;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Sticky Register Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleRegister}
          disabled={availabilityStatus === 'sold-out'}
          className={`px-6 py-3 rounded-full font-medium shadow-lg transition-all duration-200 transform hover:scale-105 ${availabilityStatus === 'sold-out'
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl'
            }`}
        >
          {availabilityStatus === 'sold-out' ? 'Sold Out' : `Register Now - ₹${getTicketPrice()}`}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/discover')}
          className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <img src={event.image_url} alt={event.title} className="w-full h-64 md:h-80 object-cover" />
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">{event.category}</span>
                </div>
                <div className="absolute top-4 right-4">
                  <button onClick={handleShare} className="bg-white/90 backdrop-blur-sm text-gray-900 p-2 rounded-full hover:bg-white transition-colors duration-200">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
                <p className="text-xl text-gray-600 mb-6">{event.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p className="text-sm text-gray-600">{event.time} - {event.end_time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{event.venue}</p>
                      <p className="text-sm text-gray-600">Live Location</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-indigo-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{currentAttendees} / {maxAttendees} Attendees</p>
                      <p className="text-sm text-gray-600">{spotsRemaining} spots remaining</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-6 h-6 text-indigo-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Full Day Event</p>
                      <p className="text-sm text-gray-600">Event Duration</p>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg mb-6 ${availabilityStatus === 'sold-out' ? 'bg-red-50 border border-red-200' : availabilityStatus === 'limited' ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
                  {/* ... Availability status UI ... */}
                </div>
                <div className="mb-6">
                  {/* ... Progress Bar UI ... */}
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Organizer</h2>
              {event.organizer_name ? (
                <div className="flex items-start space-x-6">
                  {event.organizer_image && (
                    <img
                      src={event.organizer_image}
                      alt={event.organizer_name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.organizer_name}</h3>
                    {event.organizer_company && (
                      <p className="text-gray-600 mb-3 flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        {event.organizer_company}
                      </p>
                    )}
                    {event.organizer_bio && (
                      <p className="text-gray-700 mb-4">{event.organizer_bio}</p>
                    )}
                    <div className="space-y-2">
                      {event.organizer_email && (
                        <p className="text-gray-600 flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          <a href={`mailto:${event.organizer_email}`} className="text-indigo-600 hover:underline">
                            {event.organizer_email}
                          </a>
                        </p>
                      )}
                      {event.organizer_phone && (
                        <p className="text-gray-600 flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          <a href={`tel:${event.organizer_phone}`} className="text-indigo-600 hover:underline">
                            {event.organizer_phone}
                          </a>
                        </p>
                      )}
                      {event.organizer_website && (
                        <p className="text-gray-600 flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          <a href={event.organizer_website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                            Visit Website
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Organizer information will be available soon.</p>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Countdown Timer */}
            {/* ... */}

            {/* Ticket Pricing */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Options</h3>
              <div className="space-y-3">
                {ticketTypes.length > 0 ? ticketTypes.map((ticket) => (
                  <label key={ticket.id} className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedTicketType === ticket.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center space-x-3">
                      <input type="radio" name="ticketType" value={ticket.id} checked={selectedTicketType === ticket.id} onChange={(e) => setSelectedTicketType(e.target.value)} className="text-indigo-600 focus:ring-indigo-500" />
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{ticket.name}</p>
                        <p className="text-xs text-gray-500">{ticket.description}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">₹{ticket.price}</span>
                  </label>
                )) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>Ticketing information will be available soon.</p>
                  </div>
                )}
              </div>
              <button
                onClick={handleRegister}
                disabled={availabilityStatus === 'sold-out' || ticketTypes.length === 0}
                className={`w-full mt-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${availabilityStatus === 'sold-out' || ticketTypes.length === 0 ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'}`}
              >
                {availabilityStatus === 'sold-out' ? 'Sold Out' : `Register Now - ₹${getTicketPrice()}`}
              </button>
              {/* ... */}
            </div>

            {/* Quick Actions */}
            {/* ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
