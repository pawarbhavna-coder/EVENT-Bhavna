import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import { Calendar, Users, BarChart3, TrendingUp, Eye, Plus, Settings, Ticket, Mail, Twitch as Switch, Home, BookOpen, CheckCircle, Clock, AlertTriangle, Loader2, ArrowRight, Star, MapPin, DollarSign } from 'lucide-react';
import { organizerCrudService, OrganizerEvent } from '../../services/organizerCrudService';

type ViewMode = 'attendee' | 'organizer';

interface DashboardStats {
  attendee: {
    upcomingEvents: number;
    networkConnections: number;
    eventsAttended: number;
    savedEvents: number;
  };
  organizer: {
    totalEvents: number;
    publishedEvents: number;
    draftEvents: number;
    totalRevenue: number;
    totalAttendees: number;
  };
}

const UnifiedDashboard: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('attendee');
  const [organizerEvents, setOrganizerEvents] = useState<OrganizerEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    attendee: {
      upcomingEvents: 0,
      networkConnections: 0,
      eventsAttended: 0,
      savedEvents: 0
    },
    organizer: {
      totalEvents: 0,
      publishedEvents: 0,
      draftEvents: 0,
      totalRevenue: 0,
      totalAttendees: 0
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    setBreadcrumbs(['Dashboard']);
    if (user?.id) {
      loadOrganizerEvents();
    }

    // Set up event listener for real-time updates
    const handleEventUpdate = (events: any[]) => {
      setOrganizerEvents(events.filter(e => e.organizer_id === user?.id));
    };

    organizerCrudService.addEventListener(handleEventUpdate);

    return () => {
      organizerCrudService.removeEventListener(handleEventUpdate);
    };
  }, [setBreadcrumbs, user?.id]);

  const loadOrganizerEvents = async () => {
    if (!user?.id) return;
    
    setIsLoadingEvents(true);
    try {
      const result = await organizerCrudService.getMyEvents(user.id);
      if (result.success && result.events) {
        setOrganizerEvents(result.events);
        // Update stats based on actual events
        setStats(prev => ({
          ...prev,
          organizer: {
            totalEvents: result.events.length,
            publishedEvents: result.events.filter(e => e.status === 'published').length,
            draftEvents: result.events.filter(e => e.status === 'draft').length,
            totalRevenue: result.events.reduce((sum, e) => sum + ((e.price || 0) * (e.attendees || 0)), 0),
            totalAttendees: result.events.reduce((sum, e) => sum + (e.capacity || 0), 0)
          }
        }));
      }
    } catch (error) {
      console.error('Failed to load organizer events:', error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const handleViewSwitch = () => {
    setViewMode(viewMode === 'attendee' ? 'organizer' : 'attendee');
    if (viewMode === 'attendee' && user?.id) {
      loadOrganizerEvents();
    }
  };

  const handleEventCardClick = (eventId: string) => {
    navigate(`/organizer/event/${eventId}/edit`);
  };

  const renderAttendeeView = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {profile?.full_name || user?.email}!</h2>
        <p className="text-indigo-100">Discover amazing events and connect with professionals</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-3xl font-bold text-gray-900">{stats.attendee.upcomingEvents}</p>
            </div>
            <Calendar className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Network Connections</p>
              <p className="text-3xl font-bold text-gray-900">{stats.attendee.networkConnections}</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Events Attended</p>
              <p className="text-3xl font-bold text-gray-900">{stats.attendee.eventsAttended}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saved Events</p>
              <p className="text-3xl font-bold text-gray-900">{stats.attendee.savedEvents}</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="font-medium text-gray-900">Registered for Tech Summit 2024</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Connected with Sarah Johnson</p>
              <p className="text-sm text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrganizerView = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Organizer Dashboard</h2>
        <p className="text-purple-100">Manage your events and track their performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-3xl font-bold text-gray-900">{stats.organizer.totalEvents}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-3xl font-bold text-gray-900">{stats.organizer.publishedEvents}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.organizer.draftEvents}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₹{stats.organizer.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendees</p>
              <p className="text-3xl font-bold text-gray-900">{stats.organizer.totalAttendees}</p>
            </div>
            <Users className="w-8 h-8 text-teal-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => window.location.href = '/organizer/create-event'}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </button>
          <button
            onClick={() => window.location.href = '/my-events'}
            className="flex items-center space-x-3 p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Calendar className="w-5 h-5" />
            <span>My Events</span>
          </button>
          <button
            onClick={() => window.location.href = '/organizer/ticketing'}
            className="flex items-center space-x-3 p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Ticket className="w-5 h-5" />
            <span>Ticketing</span>
          </button>
          <button
            onClick={() => window.location.href = '/organizer/analytics'}
            className="flex items-center space-x-3 p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Events</h3>
          <button
            onClick={() => window.location.href = '/organizer/create-event'}
            className="flex items-center space-x-2 px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create</span>
          </button>
        </div>
        {isLoadingEvents ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          </div>
        ) : organizerEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organizerEvents.slice(0, 4).map((event) => (
              <div 
                key={event.id}
                className="group bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => handleEventCardClick(event.id)}
              >
                <img
                  src={event.image_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={event.title}
                  className="w-full h-24 object-cover rounded-lg mb-3"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                    <p className="text-xs text-gray-500">{new Date(event.event_date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    event.status === 'published' ? 'bg-green-100 text-green-800' :
                    event.status === 'draft' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No events created yet</p>
            <button
              onClick={() => navigate('/organizer/create-event')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Create Your First Event
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with View Switcher */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {viewMode === 'attendee' ? 'My Dashboard' : 'Organizer Dashboard'}
            </h1>
            <p className="text-xl text-gray-600">
              {viewMode === 'attendee' 
                ? 'Manage your events, network, and resources' 
                : 'Manage your events and track their performance'
              }
            </p>
          </div>
          
          {/* View Switcher */}
          <div className="bg-white rounded-2xl shadow-lg p-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('attendee')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'attendee'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Attendee</span>
              </button>
              <button
                onClick={() => setViewMode('organizer')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'organizer'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Organizer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {viewMode === 'attendee' ? renderAttendeeView() : renderOrganizerView()}
      </div>
    </div>
  );
};

export default UnifiedDashboard;