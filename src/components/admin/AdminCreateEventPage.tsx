// src/components/admin/AdminCreateEventPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateEventPage from '../organizer/CreateEventPage';
import { Shield, ArrowLeft } from 'lucide-react';
import '../../styles/admin-panel.css';

const AdminCreateEventPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="admin-main">
            <div className="admin-content">
                {/* Admin-branded sub-header */}
                <div className="admin-header" style={{ marginBottom: '1.5rem' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="flex items-center gap-2">
                                <Shield className="w-6 h-6" style={{ color: 'var(--admin-primary)' }} />
                                Create Event
                                <span
                                    className="text-sm font-normal px-2 py-0.5 rounded-full ml-1"
                                    style={{ background: 'var(--admin-bg-purple)', color: 'var(--admin-primary)' }}
                                >
                                    Admin
                                </span>
                            </h1>
                            <p>Create a new event on behalf of the platform.</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/events')}
                            className="admin-btn admin-btn-secondary flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Events
                        </button>
                    </div>
                </div>

                {/* Reuse the organizer CreateEventPage – it is fully functional for admin too */}
                <CreateEventPage />
            </div>
        </div>
    );
};

export default AdminCreateEventPage;
