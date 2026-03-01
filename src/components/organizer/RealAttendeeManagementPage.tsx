import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import {
  Users, Search, Filter, Download, Mail, CheckCircle,
  XCircle, Clock, Eye, MoreVertical, UserCheck, AlertCircle,
  Loader2, Calendar, MapPin, DollarSign, Ticket
} from 'lucide-react';
import { realEventService, RealEvent, RealAttendee } from '../../services/realEventService';
import { organizerCrudService, OrganizerEvent, OrganizerAttendee } from '../../services/organizerCrudService';

const RealAttendeeManagementPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [attendees, setAttendees] = useState<OrganizerAttendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'checked-in' | 'no-show'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'paid' | 'refunded'>('all');
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);

  useEffect(() => {
    setBreadcrumbs(['Attendee Management']);
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
          loadAttendees(firstEvent.id);
        }
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAttendees = async (eventId: string) => {
    try {
      const result = await organizerCrudService.getEventAttendees(eventId);
      if (result.success && result.attendees) {
        setAttendees(result.attendees);
      }
    } catch (error) {
      console.error('Failed to load attendees:', error);
    }
  };

  const handleEventChange = (eventId: string) => {
    setSelectedEvent(eventId);
    loadAttendees(eventId);
    setSelectedAttendees([]);
  };

  const handleStatusUpdate = async (attendeeId: string, status: 'pending' | 'checked-in' | 'no-show') => {
    try {
      const result = await organizerCrudService.updateAttendeeStatus(attendeeId, status);
      if (result.success) {
        await loadAttendees(selectedEvent);
        // Show success feedback
        const attendee = attendees.find(a => a.id === attendeeId);
        if (attendee) {
          alert(`${attendee.user?.full_name || 'Attendee'} status updated to ${status}`);
        }
      } else {
        alert(result.error || 'Failed to update status');
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleSelectAttendee = (attendeeId: string) => {
    setSelectedAttendees(prev =>
      prev.includes(attendeeId)
        ? prev.filter(id => id !== attendeeId)
        : [...prev, attendeeId]
    );
  };

  const handleSelectAll = () => {
    setSelectedAttendees(
      selectedAttendees.length === filteredAttendees.length
        ? []
        : filteredAttendees.map(attendee => attendee.id)
    );
  };

  const handleExportAttendees = () => {
    const csvContent = [
      ['Name', 'Email', 'Ticket Type', 'Price', 'Registration Date', 'Check-in Status', 'Payment Status'],
      ...filteredAttendees.map(attendee => [
        attendee.user?.full_name || 'N/A',
        attendee.user?.email || 'N/A',
        attendee.ticket_type?.name || 'N/A',
        attendee.ticket_type?.price || 0,
        new Date(attendee.registration_date).toLocaleDateString(),
        attendee.check_in_status,
        attendee.payment_status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendees-${selectedEvent}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = (attendee.user?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (attendee.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || attendee.check_in_status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || attendee.payment_status === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const currentEvent = events.find(e => e.id === selectedEvent);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checked-in': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'no-show': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getPaymentIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'refunded': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading attendee data...</p>
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
          <h1 className="text-4xl font-bold text-gray-900">Attendee Management</h1>
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
              onClick={handleExportAttendees}
              disabled={filteredAttendees.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {currentEvent ? (
          <>
            {/* Event Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{attendees.length}</p>
                  <p className="text-sm text-gray-600">Total Attendees</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {attendees.filter(a => a.check_in_status === 'checked-in').length}
                  </p>
                  <p className="text-sm text-gray-600">Checked In</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {attendees.filter(a => a.check_in_status === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {attendees.filter(a => a.check_in_status === 'no-show').length}
                  </p>
                  <p className="text-sm text-gray-600">No Shows</p>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search attendees by name or email..."
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
                    <option value="pending">Pending</option>
                    <option value="checked-in">Checked In</option>
                    <option value="no-show">No Show</option>
                  </select>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value as any)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Payments</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Attendees Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {filteredAttendees.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
                            onChange={handleSelectAll}
                            className="text-indigo-600 focus:ring-indigo-500 rounded"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAttendees.map((attendee) => (
                        <tr key={attendee.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedAttendees.includes(attendee.id)}
                              onChange={() => handleSelectAttendee(attendee.id)}
                              className="text-indigo-600 focus:ring-indigo-500 rounded"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{attendee.user?.full_name || 'N/A'}</p>
                              <p className="text-sm text-gray-500">{attendee.user?.email || 'N/A'}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium">
                                {attendee.ticket_type?.name || 'N/A'}
                              </span>
                              <p className="text-sm text-gray-500 mt-1">
                                ₹{attendee.ticket_type?.price || 0}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {new Date(attendee.registration_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(attendee.check_in_status)}
                              <select
                                value={attendee.check_in_status}
                                onChange={(e) => handleStatusUpdate(attendee.id, e.target.value as any)}
                                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500"
                              >
                                <option value="pending">Pending</option>
                                <option value="checked-in">Checked In</option>
                                <option value="no-show">No Show</option>
                              </select>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {getPaymentIcon(attendee.payment_status)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${attendee.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                attendee.payment_status === 'refunded' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                {attendee.payment_status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {/* View attendee details */ }}
                                className="p-1 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <a
                                href={`mailto:${attendee.user?.email}`}
                                className="p-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                title="Send Email"
                              >
                                <Mail className="w-4 h-4" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
                      ? 'No attendees match your criteria'
                      : 'No one has registered yet'}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
                      ? 'Try adjusting your search or filter settings.'
                      : 'When someone registers, their information will appear here.'}
                  </p>
                </div>
              )}
            </div>

            {/* Bulk Actions */}
            {selectedAttendees.length > 0 && (
              <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-2xl border border-gray-200 px-6 py-3">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">
                    {selectedAttendees.length} selected
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        selectedAttendees.forEach(id => handleStatusUpdate(id, 'checked-in'));
                        setSelectedAttendees([]);
                      }}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Check In All
                    </button>
                    <button
                      onClick={() => {/* Bulk email */ }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Send Email
                    </button>
                    <button
                      onClick={() => setSelectedAttendees([])}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No published events found</h3>
              <p className="text-gray-600 mb-6">Publish an event to start managing attendees</p>
              <button
                onClick={() => navigate('/organizer/create-event')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Create Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealAttendeeManagementPage;