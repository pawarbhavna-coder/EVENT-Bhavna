// src/components/admin/AdminEventsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/NewAuthContext';
import { organizerCrudService, OrganizerEvent } from '../../services/organizerCrudService';
import {
    Calendar, Search, Trash2, AlertTriangle, X, Edit,
    Plus, Loader2, Users, MapPin
} from 'lucide-react';
import '../../styles/admin-panel.css';

const AdminEventsPage: React.FC = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState<OrganizerEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchEvents = async () => {
        setIsLoading(true);
        const result = await organizerCrudService.getAllEvents();
        if (result.success && result.events) setEvents(result.events);
        setIsLoading(false);
    };

    useEffect(() => {
        if (profile?.role === 'admin') fetchEvents();
    }, [profile]);

    const filteredEvents = useMemo(() =>
        events.filter((e) => {
            const matchSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (e.venue || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = statusFilter === 'all' || e.status === statusFilter;
            return matchSearch && matchStatus;
        }),
        [events, searchTerm, statusFilter]
    );

    const statusCounts = useMemo(() => ({
        all: events.length,
        published: events.filter((e) => e.status === 'published').length,
        draft: events.filter((e) => e.status === 'draft').length,
        cancelled: events.filter((e) => e.status === 'cancelled').length,
        completed: events.filter((e) => e.status === 'completed').length,
    }), [events]);

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        const result = await organizerCrudService.adminDeleteEvent(itemToDelete.id);
        if (result.success) fetchEvents();
        else alert(`Error: ${result.error}`);
        setIsDeleting(false);
        setItemToDelete(null);
    };

    const getStatusBadge = (status: string) => {
        const map: Record<string, string> = {
            published: 'admin-badge-success',
            draft: 'admin-badge-info',
            cancelled: 'admin-badge-danger',
            ongoing: 'admin-badge-warning',
            completed: 'admin-badge-info',
        };
        return <span className={`admin-badge-status ${map[status] || 'admin-badge-info'}`}>{status}</span>;
    };

    if (isLoading) {
        return (
            <div className="admin-main">
                <div className="flex justify-center items-center h-screen">
                    <Loader2 className="w-12 h-12 animate-spin" style={{ color: 'var(--admin-primary)' }} />
                </div>
            </div>
        );
    }

    return (
        <div className="admin-main">
            <div className="admin-content">
                {/* Header */}
                <div className="admin-header">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="flex items-center gap-2">
                                <Calendar className="w-7 h-7" style={{ color: 'var(--admin-primary)' }} />
                                Events Management
                            </h1>
                            <p>Oversee, edit, and manage all events on the platform.</p>
                        </div>
                        <button onClick={() => navigate('/admin/create-event')} className="admin-btn admin-btn-primary">
                            <Plus className="w-4 h-4" /> Create Event
                        </button>
                    </div>
                </div>

                {/* Status filter pills */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {(['all', 'published', 'draft', 'cancelled', 'completed'] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${statusFilter === s
                                ? 'border-transparent text-white'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300'
                                }`}
                            style={statusFilter === s ? { background: 'linear-gradient(135deg, var(--admin-primary), var(--admin-secondary))' } : {}}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                            <span className="ml-2 bg-white bg-opacity-25 px-1.5 py-0.5 rounded-full text-xs">
                                {statusCounts[s] ?? 0}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="admin-card mb-4">
                    <div className="admin-card-body" style={{ padding: '1rem 1.5rem' }}>
                        <div className="admin-search-container" style={{ marginBottom: 0 }}>
                            <Search className="admin-search-icon" />
                            <input
                                type="text"
                                placeholder="Search by event title or venue…"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoComplete="off"
                                className="admin-search-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Events table */}
                <div className="admin-table-container">
                    <div className="overflow-x-auto">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Event</th>
                                    <th>Venue</th>
                                    <th>Date</th>
                                    <th>Capacity</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEvents.map((event) => (
                                    <tr key={event.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                {event.image_url ? (
                                                    <img
                                                        src={event.image_url}
                                                        alt={event.title}
                                                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                                                        style={{ background: 'linear-gradient(135deg, var(--admin-primary), var(--admin-secondary))' }}
                                                    >
                                                        {event.title[0]}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-sm leading-tight">{event.title}</p>
                                                    <p className="text-xs text-gray-400 capitalize">{event.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate max-w-[120px]">{event.venue || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="text-sm text-gray-600 whitespace-nowrap">
                                            {new Date(event.event_date).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Users className="w-3 h-3" />
                                                {event.attendees ?? 0}/{event.capacity}
                                            </div>
                                        </td>
                                        <td>{getStatusBadge(event.status)}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/organizer/event/${event.id}/edit`)}
                                                    className="admin-action-btn admin-tooltip"
                                                    data-tooltip="Edit Event"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setItemToDelete({ id: event.id, name: event.title })}
                                                    className="admin-action-btn danger admin-tooltip"
                                                    data-tooltip="Delete Event"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredEvents.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-16">
                                            <div className="admin-empty-state" style={{ padding: 0 }}>
                                                <Calendar className="admin-empty-icon" />
                                                <h3 className="admin-empty-title">No events found</h3>
                                                <p className="admin-empty-description">Try changing your search or filter.</p>
                                                <button onClick={() => navigate('/admin/create-event')} className="admin-btn admin-btn-primary mt-4">
                                                    <Plus className="w-4 h-4" /> Create First Event
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-right">
                    Showing {filteredEvents.length} of {events.length} events
                </p>
            </div>

            {/* Delete Confirmation Modal */}
            {itemToDelete && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '420px' }}>
                        <div className="admin-modal-header">
                            <h3 className="admin-modal-title">Delete Event</h3>
                            <button onClick={() => setItemToDelete(null)} className="admin-modal-close"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="admin-modal-body text-center">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#fee2e2' }}>
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <p className="text-gray-600">
                                Are you sure you want to delete <strong>"{itemToDelete.name}"</strong>? All associated data will be permanently removed.
                            </p>
                        </div>
                        <div className="admin-modal-footer">
                            <button onClick={() => setItemToDelete(null)} className="admin-btn admin-btn-secondary">Cancel</button>
                            <button onClick={confirmDelete} disabled={isDeleting} className="admin-btn admin-btn-danger">
                                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />} Delete Event
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEventsPage;
