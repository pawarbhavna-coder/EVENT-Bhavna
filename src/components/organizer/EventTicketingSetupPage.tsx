import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import { 
  Ticket, Plus, Save, X, DollarSign, Users, Calendar, 
  Clock, Check, ArrowLeft, Loader2, AlertTriangle 
} from 'lucide-react';
import { organizerCrudService, OrganizerEvent, OrganizerTicketType } from '../../services/organizerCrudService';

interface TicketFormData {
  name: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  sale_start: string;
  sale_end: string;
  is_active: boolean;
}

const EventTicketingSetupPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<OrganizerEvent | null>(null);
  const [ticketTypes, setTicketTypes] = useState<OrganizerTicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<TicketFormData>({
    name: '',
    description: '',
    price: 0,
    currency: 'INR',
    quantity: 100,
    sale_start: new Date().toISOString().slice(0, 16),
    sale_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    is_active: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    setBreadcrumbs(['Event Ticketing Setup']);
    if (eventId) {
      loadEventAndTickets();
    }
  }, [setBreadcrumbs, eventId]);

  const loadEventAndTickets = async () => {
    if (!eventId) return;

    try {
      setIsLoading(true);

      const [eventResult, ticketsResult] = await Promise.all([
        organizerCrudService.getEventById(eventId),
        organizerCrudService.getTicketTypes(eventId)
      ]);

      if (eventResult.success && eventResult.event) {
        setEvent(eventResult.event);
      } else {
        console.error('Failed to load event:', eventResult.error);
      }

      if (ticketsResult.success && ticketsResult.tickets) {
        setTicketTypes(ticketsResult.tickets);
      } else {
        console.error('Failed to load tickets:', ticketsResult.error);
      }
    } catch (error) {
      console.error('Failed to load event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTicket = () => {
    setCurrentTicket({
      name: '',
      description: '',
      price: 0,
      currency: 'INR',
      quantity: 100,
      sale_start: new Date().toISOString().slice(0, 16),
      sale_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      is_active: true
    });
    setShowTicketForm(true);
    setErrors({});
  };

  const handleSaveTicket = async () => {
    if (!eventId) return;

    // Validate ticket form
    const newErrors: Record<string, string> = {};
    if (!currentTicket.name.trim()) newErrors.name = 'Ticket name is required';
    if (currentTicket.price < 0) newErrors.price = 'Price cannot be negative';
    if (currentTicket.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSaving(true);
      const result = await organizerCrudService.createTicketType(eventId, currentTicket);

      if (result.success && result.ticket) {
        setTicketTypes(prev => [...prev, result.ticket!]);
        setShowTicketForm(false);
        alert('Ticket type added successfully!');
      } else {
        alert(result.error || 'Failed to create ticket type');
      }
    } catch (error) {
      alert('Failed to create ticket type');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishEvent = async () => {
    if (!eventId || ticketTypes.length === 0) {
      alert('Please add at least one ticket type before publishing');
      return;
    }

    try {
      setIsSaving(true);
      const result = await organizerCrudService.publishEvent(eventId);
      
      if (result.success) {
        alert('Event published successfully! It will now appear in the Discover Events section.');
        navigate('/dashboard');
      } else {
        alert(result.error || 'Failed to publish event');
      }
    } catch (error) {
      alert('Failed to publish event');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to remove this ticket type?')) return;

    try {
      const result = await organizerCrudService.deleteTicketType(ticketId);

      if (result.success) {
        setTicketTypes(prev => prev.filter(ticket => ticket.id !== ticketId));
        alert('Ticket type removed successfully!');
      } else {
        alert(result.error || 'Failed to remove ticket type');
      }
    } catch (error) {
      alert('Failed to remove ticket type');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading event...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="text-center py-20">
          <p className="text-gray-600">Event not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Setup Ticketing</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Ticket Types for "{event.title}"</h2>
                <button
                  onClick={handleAddTicket}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Ticket Type</span>
                </button>
              </div>

              {ticketTypes.length > 0 ? (
                <div className="space-y-4">
                  {ticketTypes.map((ticket) => (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">{ticket.name}</h3>
                        <p className="text-sm text-gray-600">{ticket.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>₹{ticket.price}</span>
                          <span>{ticket.quantity} available</span>
                          <span className={ticket.is_active ? 'text-green-600' : 'text-red-600'}>
                            {ticket.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveTicket(ticket.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No ticket types added yet</p>
                  <button
                    onClick={handleAddTicket}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Add Your First Ticket Type
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Event</p>
                  <p className="font-medium text-gray-900">{event.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">{new Date(event.event_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Venue</p>
                  <p className="font-medium text-gray-900">{event.venue}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="font-medium text-gray-900">{event.capacity} attendees</p>
                </div>
              </div>
            </div>

            {/* Ticket Form */}
            {showTicketForm && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Add Ticket Type</h3>
                  <button
                    onClick={() => setShowTicketForm(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Name *</label>
                    <input
                      type="text"
                      value={currentTicket.name}
                      onChange={(e) => setCurrentTicket(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Early Bird, VIP, General"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={currentTicket.description}
                      onChange={(e) => setCurrentTicket(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="What's included with this ticket?"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                      <input
                        type="number"
                        value={currentTicket.price}
                        onChange={(e) => setCurrentTicket(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        min="0"
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                      {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                      <input
                        type="number"
                        value={currentTicket.quantity}
                        onChange={(e) => setCurrentTicket(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                        min="1"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.quantity ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="100"
                      />
                      {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sale Period</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="datetime-local"
                          value={currentTicket.sale_start}
                          onChange={(e) => setCurrentTicket(prev => ({ ...prev, sale_start: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Sale starts</p>
                      </div>
                      <div>
                        <input
                          type="datetime-local"
                          value={currentTicket.sale_end}
                          onChange={(e) => setCurrentTicket(prev => ({ ...prev, sale_end: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Sale ends</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveTicket}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Add Ticket Type</span>
                  </button>
                </div>
              </div>
            )}

            {/* Publish Button */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Publish?</h3>
              {ticketTypes.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 font-medium">Event is ready to publish</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      {ticketTypes.length} ticket type(s) configured
                    </p>
                  </div>
                  <button
                    onClick={handlePublishEvent}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>Publish Event Live</span>
                  </button>
                </div>
              ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span className="text-orange-800 font-medium">Add ticket types to publish</span>
                  </div>
                  <p className="text-orange-700 text-sm mt-1">
                    You need at least one ticket type before publishing your event
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTicketingSetupPage;