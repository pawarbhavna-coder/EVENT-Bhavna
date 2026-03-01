import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import { Ticket, Plus, CreditCard as Edit, Trash2, Save, X, MoreVertical, Search, Hash, Calendar, Clock, BarChart3, Users, AlertTriangle, CheckCircle, Info, Loader2, ArrowLeft, ArrowRight, ToggleLeft, ToggleRight, Eye, EyeOff } from 'lucide-react';
import { realEventService, RealEvent, RealTicketType, TicketFormData } from '../../services/realEventService';
import { organizerCrudService, OrganizerEvent, OrganizerTicketType, TicketFormData as CrudTicketFormData } from '../../services/organizerCrudService';

const RealTicketingPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const { user } = useAuth();

  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<OrganizerEvent | null>(null);
  const [ticketTypes, setTicketTypes] = useState<OrganizerTicketType[]>([]);
  const [isLoading, setIsLoading] = useState({ events: true, tickets: false, form: false });

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<CrudTicketFormData | null>(null);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchEvents = async () => {
    if (!user?.id) {
      setIsLoading(prev => ({ ...prev, events: false }));
      return;
    }
    setIsLoading(prev => ({ ...prev, events: true }));
    try {
      const result = await organizerCrudService.getMyEvents(user.id);
      if (result.success && result.events) {
        setEvents(result.events);
        if (result.events.length > 0) {
          handleEventSelect(result.events[0]);
        }
      }
    } finally {
      setIsLoading(prev => ({ ...prev, events: false }));
    }
  };

  const fetchTicketTypes = async (eventId: string) => {
    setIsLoading(prev => ({ ...prev, tickets: true }));
    try {
      const result = await organizerCrudService.getTicketTypes(eventId);
      if (result.success && result.tickets) {
        setTicketTypes(result.tickets);
      }
    } finally {
      setIsLoading(prev => ({ ...prev, tickets: false }));
    }
  };

  useEffect(() => {
    setBreadcrumbs(['Ticketing']);
    fetchEvents();
  }, [setBreadcrumbs, user]);

  const handleEventSelect = (event: OrganizerEvent) => {
    setSelectedEvent(event);
    setShowForm(false);
    setIsEditing(false);
    fetchTicketTypes(event.id);
  };

  const resetForm = () => {
    setCurrentTicket({
      name: '',
      description: '',
      price: 0,
      currency: 'INR',
      quantity: 100,
      sale_start: new Date().toISOString().slice(0, 16),
      sale_end: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      is_active: true,
      benefits: [],
      restrictions: [],
    });
    setErrors({});
  };

  const handleCreateNew = () => {
    resetForm();
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (ticket: OrganizerTicketType) => {
    setCurrentTicket({
      ...ticket,
      sale_start: new Date(ticket.sale_start).toISOString().slice(0, 16),
      sale_end: ticket.sale_end ? new Date(ticket.sale_end).toISOString().slice(0, 16) : '',
    });
    setEditingTicketId(ticket.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const validateForm = (ticket: CrudTicketFormData): boolean => {
    const newErrors: Record<string, string> = {};
    if (!ticket.name.trim()) newErrors.name = 'Ticket name is required';
    if (ticket.price < 0) newErrors.price = 'Price cannot be negative';
    if (ticket.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    if (ticket.sale_end && new Date(ticket.sale_end) <= new Date(ticket.sale_start)) {
      newErrors.sale_end = 'Sale end date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentTicket || !selectedEvent) return;
    if (!validateForm(currentTicket)) return;

    setIsLoading(prev => ({ ...prev, form: true }));
    try {
      let result;
      if (isEditing && editingTicketId) {
        result = await organizerCrudService.updateTicketType(editingTicketId, currentTicket);
      } else {
        result = await organizerCrudService.createTicketType(selectedEvent.id, currentTicket);
      }

      if (result.success) {
        alert(`Ticket type ${isEditing ? 'updated' : 'created'} successfully!`);
        setShowForm(false);
        setIsEditing(false);
        setEditingTicketId(null);
        fetchTicketTypes(selectedEvent.id);
      } else {
        alert(result.error || 'Failed to save ticket type');
      }
    } finally {
      setIsLoading(prev => ({ ...prev, form: false }));
    }
  };

  const handleDelete = async (ticketId: string) => {
    if (window.confirm('Are you sure you want to delete this ticket type? This cannot be undone.')) {
      setIsLoading(prev => ({ ...prev, tickets: true }));
      try {
        const result = await organizerCrudService.deleteTicketType(ticketId);
        if (result.success) {
          alert('Ticket type deleted successfully!');
          if (selectedEvent) fetchTicketTypes(selectedEvent.id);
        } else {
          alert(result.error || 'Failed to delete ticket type.');
        }
      } finally {
        setIsLoading(prev => ({ ...prev, tickets: false }));
      }
    }
  };

  const toggleTicketStatus = async (ticket: OrganizerTicketType) => {
    setIsLoading(prev => ({ ...prev, tickets: true }));
    try {
      const result = await organizerCrudService.updateTicketType(ticket.id, { is_active: !ticket.is_active });
      if (result.success) {
        if (selectedEvent) fetchTicketTypes(selectedEvent.id);
      } else {
        alert(result.error || 'Failed to update ticket status');
      }
    } finally {
      setIsLoading(prev => ({ ...prev, tickets: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ticket Management</h1>
          <div className="flex space-x-4">
            <select
              onChange={(e) => {
                const event = events.find(event => event.id === e.target.value);
                if (event) handleEventSelect(event);
              }}
              value={selectedEvent?.id || ''}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading.events}
            >
              <option value="" disabled>Select an Event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
            <button
              onClick={handleCreateNew}
              disabled={!selectedEvent || isLoading.events}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Create Ticket Type</span>
            </button>
          </div>
        </div>

        {isLoading.events && (
          <div className="flex justify-center items-center py-16"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        )}

        {!isLoading.events && !selectedEvent && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Event Selected</h3>
            <p className="text-gray-600">Please select an event to manage its tickets.</p>
          </div>
        )}

        {selectedEvent && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`lg:col-span-2 ${showForm ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Tickets for "{selectedEvent.title}"</h2>
                {isLoading.tickets ? (
                  <div className="flex justify-center items-center py-16"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
                ) : ticketTypes.length > 0 ? (
                  <div className="space-y-4">
                    {ticketTypes.map(ticket => (
                      <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50">
                        <div>
                          <p className="font-bold text-gray-800">{ticket.name}</p>
                          <p className="text-sm text-gray-500">{ticket.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="flex items-center">₹{ticket.price}</span>
                            <span className="flex items-center"><Users className="w-4 h-4 mr-1" />{ticket.sold} / {ticket.quantity} sold</span>
                            <span className={`flex items-center font-medium ${ticket.is_active ? 'text-green-600' : 'text-red-600'}`}>
                              {ticket.is_active ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
                              {ticket.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => toggleTicketStatus(ticket)} className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100">
                            {ticket.is_active ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-red-500" />}
                          </button>
                          <button onClick={() => handleEdit(ticket)} className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(ticket.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <h3 className="text-lg font-semibold text-gray-800">No Tickets Yet</h3>
                    <p className="text-gray-500">Create the first ticket type for this event.</p>
                  </div>
                )}
              </div>
            </div>

            {showForm && currentTicket && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Ticket' : 'New Ticket Type'}</h2>
                    <button onClick={() => setShowForm(false)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name *</label>
                      <input type="text" value={currentTicket.name} onChange={e => setCurrentTicket({ ...currentTicket, name: e.target.value })} autoComplete="off" className={`w-full mt-1 p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`} />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea value={currentTicket.description} onChange={e => setCurrentTicket({ ...currentTicket, description: e.target.value })} rows={3} className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price *</label>
                        <input type="number" value={currentTicket.price} onChange={e => setCurrentTicket({ ...currentTicket, price: parseFloat(e.target.value) })} min="0" autoComplete="off" className={`w-full mt-1 p-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md`} />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                        <input type="number" value={currentTicket.quantity} onChange={e => setCurrentTicket({ ...currentTicket, quantity: parseInt(e.target.value) })} min="1" autoComplete="off" className={`w-full mt-1 p-2 border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-md`} />
                        {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sale Starts *</label>
                      <input type="datetime-local" value={currentTicket.sale_start} onChange={e => setCurrentTicket({ ...currentTicket, sale_start: e.target.value })} autoComplete="off" className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sale Ends *</label>
                      <input type="datetime-local" value={currentTicket.sale_end} onChange={e => setCurrentTicket({ ...currentTicket, sale_end: e.target.value })} autoComplete="off" className={`w-full mt-1 p-2 border ${errors.sale_end ? 'border-red-500' : 'border-gray-300'} rounded-md`} />
                      {errors.sale_end && <p className="text-red-500 text-sm mt-1">{errors.sale_end}</p>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Ticket Active</span>
                      <button onClick={() => setCurrentTicket({ ...currentTicket, is_active: !currentTicket.is_active })} className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100">
                        {currentTicket.is_active ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6 text-red-500" />}
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleFormSubmit}
                      disabled={isLoading.form}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isLoading.form ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>{isEditing ? 'Save Changes' : 'Create Ticket'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTicketingPage;
