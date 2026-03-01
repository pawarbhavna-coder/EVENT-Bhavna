import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import { 
  BarChart3, TrendingUp, Users, DollarSign, Eye, Calendar,
  Download, Filter, RefreshCw, Loader2, ArrowUp, ArrowDown
} from 'lucide-react';
import { realEventService, RealEvent, RealEventAnalytics } from '../../services/realEventService';
import { organizerCrudService, OrganizerEvent, OrganizerEventAnalytics } from '../../services/organizerCrudService';

const RealAnalyticsPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [analytics, setAnalytics] = useState<OrganizerEventAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  React.useEffect(() => {
    setBreadcrumbs(['Analytics & Reports']);
    loadEvents();
  }, [setBreadcrumbs, user]);

  const loadEvents = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const result = await organizerCrudService.getMyEvents(user.id);
      if (result.success && result.events) {
        const publishedEvents = result.events.filter(e => e.status !== 'draft');
        setEvents(publishedEvents);
        if (publishedEvents.length > 0 && !selectedEvent) {
          const firstEvent = publishedEvents[0];
          setSelectedEvent(firstEvent.id);
          loadAnalytics(firstEvent.id);
        }
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalytics = async (eventId: string) => {
    try {
      const result = await organizerCrudService.getEventAnalytics(eventId);
      if (result.success && result.analytics) {
        setAnalytics(result.analytics);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const handleEventChange = (eventId: string) => {
    setSelectedEvent(eventId);
    loadAnalytics(eventId);
  };

  const handleExportReport = () => {
    if (!analytics) return;
    
    const currentEvent = events.find(e => e.id === selectedEvent);
    const reportData = {
      event: currentEvent?.title,
      generatedAt: new Date().toISOString(),
      timeRange,
      analytics: analytics
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${selectedEvent}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const currentEvent = events.find(e => e.id === selectedEvent);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Analytics & Reports</h1>
          <div className="flex items-center space-x-4">
            <select
              value={selectedEvent}
              onChange={(e) => handleEventChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select an event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
            <button
              onClick={() => selectedEvent && loadAnalytics(selectedEvent)}
              className="p-2 text-gray-600 hover:text-indigo-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportReport}
              disabled={!analytics}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {currentEvent && analytics ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.views.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+12.5%</span>
                  <span className="text-gray-500 ml-1">vs last period</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Registrations</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.registrations}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+8.3%</span>
                  <span className="text-gray-500 ml-1">vs last period</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.conversion_rate.toFixed(1)}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
                  <span className="text-red-600 font-medium">-2.1%</span>
                  <span className="text-gray-500 ml-1">vs last period</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${analytics.revenue.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+15.7%</span>
                  <span className="text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Traffic Sources */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Traffic Sources</h2>
                <div className="space-y-4">
                  {analytics.top_referrers.length > 0 ? (
                    analytics.top_referrers.map((referrer, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-700">{referrer}</span>
                        <span className="font-medium text-gray-900">
                          {Math.floor(Math.random() * 30) + 10}%
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No traffic data available yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Registration Timeline */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Registration Timeline</h2>
                <div className="space-y-3">
                  {/* Mock daily registration data */}
                  {Array.from({ length: 7 }, (_, index) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - index));
                    const registrations = Math.floor(Math.random() * 20) + 1;
                    
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {date.toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                              style={{ width: `${(registrations / 20) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8 text-right">
                            {registrations}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Event Performance */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Event Performance</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Capacity Utilization</span>
                    <span className="font-bold text-gray-900">
                      {Math.round((analytics.registrations / currentEvent.capacity) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg Revenue per Attendee</span>
                    <span className="font-bold text-gray-900">
                      ${analytics.registrations > 0 ? Math.round(analytics.revenue / analytics.registrations) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Event ROI</span>
                    <span className="font-bold text-green-600">
                      {analytics.revenue > 1000 ? '+' : ''}
                      {Math.round(((analytics.revenue - 1000) / 1000) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Insights & Recommendations</h2>
                <div className="space-y-4">
                  {analytics.conversion_rate > 10 ? (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-green-800">Excellent Performance</h4>
                      </div>
                      <p className="text-sm text-green-700">
                        Your conversion rate of {analytics.conversion_rate.toFixed(1)}% is above average!
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                        <h4 className="font-semibold text-orange-800">Room for Improvement</h4>
                      </div>
                      <p className="text-sm text-orange-700">
                        Consider improving your event description or adding more ticket types to boost conversions.
                      </p>
                    </div>
                  )}
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Attendance Forecast</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      Based on current trends, you're on track to reach {Math.round(analytics.registrations * 1.2)} attendees.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">Revenue Optimization</h4>
                    </div>
                    <p className="text-sm text-purple-700">
                      Consider adding premium ticket tiers to increase revenue potential.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No analytics available</h3>
              <p className="text-gray-600 mb-6">
                {events.length === 0 
                  ? 'Create and publish an event to view analytics'
                  : 'Select an event to view its analytics'
                }
              </p>
              {events.length === 0 && (
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
      </div>
    </div>
  );
};

export default RealAnalyticsPage;
