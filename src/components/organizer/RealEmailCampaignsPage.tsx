import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import { Mail, Plus, Send, CreditCard as Edit, Trash2, Eye, Users, BarChart3, Calendar, Clock, Target, Filter, Search, Download, Loader2, CheckCircle, AlertTriangle, Copy } from 'lucide-react';
import { organizerCrudService, MarketingCampaign } from '../../services/organizerCrudService';

const RealEmailCampaignsPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'scheduled' | 'sent' | 'cancelled'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Partial<MarketingCampaign>>({});

  React.useEffect(() => {
    setBreadcrumbs(['Email Campaigns']);
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
          loadCampaigns(firstEvent.id);
        }
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCampaigns = async (eventId: string) => {
    try {
      const result = await organizerCrudService.getMarketingCampaigns(eventId);
      if (result.success && result.campaigns) {
        setCampaigns(result.campaigns);
      }
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    }
  };

  const handleEventChange = (eventId: string) => {
    setSelectedEvent(eventId);
    loadCampaigns(eventId);
  };

  const handleCreateCampaign = () => {
    setCurrentCampaign({
      name: '',
      type: 'email',
      subject: '',
      content: '',
      audience: 'all_subscribers',
      status: 'draft'
    });
    setShowCreateModal(true);
  };

  const handleSaveCampaign = async () => {
    if (!selectedEvent || !currentCampaign.name) return;

    try {
      const result = await organizerCrudService.createMarketingCampaign(selectedEvent, currentCampaign as any);
      if (result.success) {
        alert('Campaign created successfully!');
        setShowCreateModal(false);
        loadCampaigns(selectedEvent);
      } else {
        alert(result.error || 'Failed to create campaign');
      }
    } catch (error) {
      alert('Failed to create campaign');
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (campaign.subject || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const currentEvent = events.find(e => e.id === selectedEvent);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading email campaigns...</p>
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
          <h1 className="text-4xl font-bold text-gray-900">Email Campaigns</h1>
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
              onClick={handleCreateCampaign}
              disabled={!selectedEvent}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>
          </div>
        </div>

        {currentEvent ? (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
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
                    <option value="scheduled">Scheduled</option>
                    <option value="sent">Sent</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Campaigns List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {filteredCampaigns.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCampaigns.map((campaign) => (
                        <tr key={campaign.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{campaign.name}</p>
                              <p className="text-sm text-gray-500">{campaign.subject}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium capitalize">
                              {campaign.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                              campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              campaign.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {campaign.status === 'sent' ? (
                              <div className="text-sm">
                                <div className="flex items-center space-x-4">
                                  <span className="text-gray-600">Open: {campaign.open_rate.toFixed(1)}%</span>
                                  <span className="text-gray-600">Click: {campaign.click_rate.toFixed(1)}%</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">No data yet</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                className="p-1 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                                title="View Campaign"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                title="Edit Campaign"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1 text-gray-600 hover:text-red-600 transition-colors duration-200"
                                title="Delete Campaign"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm || statusFilter !== 'all'
                      ? 'No campaigns match your criteria'
                      : 'No email campaigns yet'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || statusFilter !== 'all'
                      ? 'Try adjusting your search or filter settings.'
                      : 'Create your first email campaign to engage with attendees.'}
                  </p>
                  {(!searchTerm && statusFilter === 'all') && (
                    <button
                      onClick={handleCreateCampaign}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Create First Campaign
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No published events found</h3>
              <p className="text-gray-600 mb-6">Publish an event to start creating email campaigns</p>
              <button
                onClick={() => navigate('/organizer/create-event')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Create Event
              </button>
            </div>
          </div>
        )}

        {/* Create Campaign Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create Email Campaign</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                  <input
                    type="text"
                    value={currentCampaign.name || ''}
                    onChange={(e) => setCurrentCampaign(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter campaign name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Subject</label>
                  <input
                    type="text"
                    value={currentCampaign.subject || ''}
                    onChange={(e) => setCurrentCampaign(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter email subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Content</label>
                  <textarea
                    value={currentCampaign.content || ''}
                    onChange={(e) => setCurrentCampaign(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your email content..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
                  <select
                    value={currentCampaign.audience || 'all_subscribers'}
                    onChange={(e) => setCurrentCampaign(prev => ({ ...prev, audience: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all_subscribers">All Subscribers</option>
                    <option value="registered_attendees">Registered Attendees</option>
                    <option value="past_attendees">Past Attendees</option>
                    <option value="vip_members">VIP Members</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCampaign}
                  disabled={!currentCampaign.name}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealEmailCampaignsPage;