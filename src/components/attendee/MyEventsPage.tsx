import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/NewAuthContext';
import { useApp } from '../../contexts/AppContext';
import { Plus, CreditCard as Edit, Trash2, Eye, Copy, Filter, Search, Calendar, Users, DollarSign, MoreVertical, AlertTriangle, CheckCircle, Clock, Globe, Loader2, ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { realEventService, RealEvent } from '../../services/realEventService';
import { organizerCrudService } from '../../services/organizerCrudService';

interface EventPageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const EventPageNavigation: React.FC<EventPageNavigationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 mb-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Previous</span>
      </button>
      
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => onPageChange(index + 1)}
            className={`w-8 h-8 rounded-lg font-medium transition-colors duration-200 ${
              currentPage === index + 1
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <span>Next</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const MyEventsPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [events, setEvents] = useState<RealEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'completed'>('all');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);

  const fetchEvents = async () => {
    if (!user || !profile) return;
    
    setIsLoading(true);
    try {
      // Use appropriate service based on user role
      const result = profile.role === 'organizer' 
        ? await organizerCrudService.getMyEvents(user.id)
        : await realEventService.getMyEvents(user.id);
        
      if (result.success && result.events) {
        setEvents(result.events);
      } else {
        console.error('Failed to fetch events:', result.error);
        setEvents([]); // Clear events on error
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]); // Clear events on error
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setBreadcrumbs(['My Events']);
    fetchEvents();

    // Set up event listener for real-time updates if organizer
    if (profile?.role === 'organizer') {
      const handleEventUpdate = (events: any[]) => {
        setEvents(events.filter(e => e.organizer_id === user?.id));
      };

      organizerCrudService.addEventListener(handleEventUpdate);

      return () => {
        organizerCrudService.removeEventListener(handleEventUpdate);
      };
    }
  }, [setBreadcrumbs, user, profile]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleSelectEvent = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    setSelectedEvents(
      selectedEvents.length === currentEvents.length 
        ? [] 
        : currentEvents.map(event => event.id)
    );
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      // Use appropriate service based on user role
      const result = profile?.role === 'organizer'
        ? await organizerCrudService.deleteEvent(eventId)
        : await realEventService.deleteEvent(eventId);
        
      if (result.success) {
        await fetchEvents();
        setShowDeleteModal(false);
        setEventToDelete(null);
        alert('Event deleted successfully!');
      } else {
        alert(result.error || 'Failed to delete event');
      }
    } catch (error) {
      alert('Failed to delete event');
    }
  };

  const handlePublishEvent = async (eventId: string) => {
    try {
      // Use appropriate service based on user role  
      const result = profile?.role === 'organizer'
        ? await organizerCrudService.publishEvent(eventId)
        : await realEventService.publishEvent(eventId);
        
      if (result.success) {
        await fetchEvents();
        alert('Event published successfully!');
      } else {
        alert(result.error || 'Failed to publish event');
      }
    } catch (error) {
      alert('Failed to publish event');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4 text-gray-500" />;
      case 'published': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'ongoing': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-indigo-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
          {profile?.role === 'organizer' && (
            <button
              onClick={() => navigate('/organizer/create-event')}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Page Navigation */}
        {totalPages > 1 && (
          <EventPageNavigation
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your events...</p>
            </div>
          </div>
        ) : currentEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentEvents.map((event, index) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Event Image */}
                <div className="relative">
                  <img
                    src={event.image_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800';
                    }}
                  />
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                    <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {event.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event.id)}
                      onChange={() => handleSelectEvent(event.id)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description || 'No description provided'}</p>

                  {/* Event Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.event_date).toLocaleDateString()}</span>
                      <span>at {event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Up to {event.capacity} attendees</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/event/${event.id}/edit`)}
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                        title="Edit Event"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {profile?.role === 'organizer' && (
                        <button
                          onClick={() => navigate('/organizer/ticketing')}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Manage Tickets"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEventToDelete(event.id);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex space-x-1">
                      {event.status === 'draft' && (
                        <button
                          onClick={() => handlePublishEvent(event.id)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                          title="Publish Event"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/event/${event.id}`)}
                        className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 && !isLoading ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No events found' : 'No events yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search criteria'
                  : 'Create your first event to get started'
                }
              </p>
              {profile?.role === 'organizer' && (
                <button
                  onClick={() => navigate('/organizer/create-event')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Create Your First Event
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No events on this page
              </h3>
              <p className="text-gray-600 mb-6">
                Try navigating to a different page or adjusting your filters
              </p>
              {profile?.role === 'organizer' && (
                <button
                  onClick={() => navigate('/organizer/create-event')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Create Event
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bottom Page Navigation */}
        {totalPages > 1 && currentEvents.length > 0 && (
          <div className="mt-8">
            <EventPageNavigation
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && eventToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Event</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this event? This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setEventToDelete(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(eventToDelete)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage;