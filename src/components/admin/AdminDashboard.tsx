import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/NewAuthContext';
import { organizerCrudService, OrganizerEvent } from '../../services/organizerCrudService';
import { supabase } from '../../lib/supabaseConfig';
import {
  Loader2, Users, Calendar, Trash2, AlertTriangle, X,
  Eye, TrendingUp, Shield, UserPlus, Edit, BarChart3,
  PieChart, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import '../../styles/admin-panel.css';

interface AppUser {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  created_at: string;
}

interface UserActivity {
  createdEvents: OrganizerEvent[];
  purchasedTickets: any[];
}

// ─── Pure SVG Bar Chart ───────────────────────────────────────────────────────
const BarChart: React.FC<{ data: { label: string; value: number }[]; color?: string }> = ({
  data,
  color = '#8b5cf6',
}) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  const chartH = 120;
  const barW = Math.floor(280 / Math.max(data.length, 1)) - 8;

  return (
    <svg width="100%" viewBox={`0 0 300 ${chartH + 30}`} className="w-full">
      {data.map((d, i) => {
        const barH = (d.value / max) * chartH;
        const x = i * (barW + 8) + 10;
        const y = chartH - barH;
        return (
          <g key={i}>
            <rect
              x={x} y={y} width={barW} height={barH}
              rx={4} fill={color} opacity={0.85}
            />
            <text x={x + barW / 2} y={chartH + 14} textAnchor="middle" fontSize={9} fill="#94a3b8">
              {d.label}
            </text>
            {d.value > 0 && (
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={9} fill={color} fontWeight="700">
                {d.value}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ─── Pure SVG Donut Chart ─────────────────────────────────────────────────────
const DonutChart: React.FC<{ slices: { label: string; value: number; color: string }[] }> = ({ slices }) => {
  const total = slices.reduce((s, d) => s + d.value, 0) || 1;
  const r = 60, cx = 80, cy = 80, strokeW = 22;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg viewBox="0 0 200 160" className="w-full">
      {slices.map((slice, i) => {
        const pct = slice.value / total;
        const dash = pct * circumference;
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={slice.color}
            strokeWidth={strokeW}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset * circumference}
            transform={`rotate(-90 ${cx} ${cy})`}
            opacity={0.9}
          />
        );
        offset += pct;
        return el;
      })}
      {/* Center label */}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={22} fontWeight="800" fill="#1e293b">{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize={9} fill="#64748b">USERS</text>
      {/* Legend */}
      {slices.map((slice, i) => (
        <g key={i} transform={`translate(165, ${20 + i * 22})`}>
          <rect width={10} height={10} rx={2} fill={slice.color} />
          <text x={14} y={9} fontSize={9} fill="#374151">
            {slice.label} ({slice.value})
          </text>
        </g>
      ))}
    </svg>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'user' | 'event'; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activityUser, setActivityUser] = useState<AppUser | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
  const [isActivityLoading, setIsActivityLoading] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('attendee');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [addUserMsg, setAddUserMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const [usersResult, eventsResult] = await Promise.all([
      organizerCrudService.getAllUsers(),
      organizerCrudService.getAllEvents()
    ]);
    if (usersResult.success && usersResult.users) setUsers(usersResult.users);
    if (eventsResult.success && eventsResult.events) setEvents(eventsResult.events);
    setIsLoading(false);
  };

  useEffect(() => {
    if (profile?.role !== 'admin') return;

    // Initial load
    fetchData();

    // ── Real-time: user_profiles ──────────────────────────────────────────────
    const usersChannel = supabase
      .channel('admin-users-rt')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_profiles' },
        async () => {
          // Re-fetch all users on any change (INSERT / UPDATE / DELETE)
          const result = await organizerCrudService.getAllUsers();
          if (result.success && result.users) setUsers(result.users);
        }
      )
      .subscribe();

    // ── Real-time: events ─────────────────────────────────────────────────────
    const eventsChannel = supabase
      .channel('admin-events-rt')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        async () => {
          // Re-fetch all events on any change (INSERT / UPDATE / DELETE)
          const result = await organizerCrudService.getAllEvents();
          if (result.success && result.events) setEvents(result.events);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(usersChannel);
      supabase.removeChannel(eventsChannel);
    };
  }, [profile]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: users.length,
    organizers: users.filter((u) => u.role === 'organizer').length,
    attendees: users.filter((u) => u.role === 'attendee').length,
    admins: users.filter((u) => u.role === 'admin').length,
    events: events.length,
    published: events.filter((e) => e.status === 'published').length,
  }), [users, events]);

  // ── Bar chart: events per month ────────────────────────────────────────────
  const eventsPerMonth = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts = new Array(12).fill(0);
    events.forEach((e) => {
      const m = new Date(e.event_date).getMonth();
      if (!isNaN(m)) counts[m]++;
    });
    // Show last 6 months
    const now = new Date().getMonth();
    return Array.from({ length: 6 }, (_, i) => {
      const idx = (now - 5 + i + 12) % 12;
      return { label: months[idx], value: counts[idx] };
    });
  }, [events]);

  // ── Donut chart: users by role ─────────────────────────────────────────────
  const roleSlices = useMemo(() => [
    { label: 'Attendee', value: stats.attendees, color: '#6366f1' },
    { label: 'Organizer', value: stats.organizers, color: '#8b5cf6' },
    { label: 'Admin', value: stats.admins, color: '#ec4899' },
  ].filter((s) => s.value > 0), [stats]);

  // ── Modals / handlers ──────────────────────────────────────────────────────
  const openDeleteModal = (item: { id: string; type: 'user' | 'event'; name: string }) => setItemToDelete(item);
  const closeDeleteModal = () => setItemToDelete(null);

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const result = itemToDelete.type === 'user'
      ? await organizerCrudService.adminDeleteUser(itemToDelete.id)
      : await organizerCrudService.adminDeleteEvent(itemToDelete.id);
    if (!result.error) fetchData();
    else alert(`Error: ${result.error}`);
    setIsDeleting(false);
    closeDeleteModal();
  };

  const viewUserActivity = async (user: AppUser) => {
    setActivityUser(user);
    setIsActivityLoading(true);
    if (user.role === 'organizer') {
      const { events: ev } = await organizerCrudService.getEventsForOrganizer(user.id);
      setUserActivity({ createdEvents: ev || [], purchasedTickets: [] });
    } else {
      const { registrations } = await organizerCrudService.getEventRegistrationsForUser(user.id);
      setUserActivity({ createdEvents: [], purchasedTickets: registrations || [] });
    }
    setIsActivityLoading(false);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserMsg(null);
    setIsAddingUser(true);
    try {
      // Step 1: Create auth user via signUp
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
        options: { data: { full_name: newUserName } },
      });

      if (authError) throw new Error(authError.message);
      const userId = authData.user?.id;
      if (!userId) throw new Error('User creation failed — no user ID returned.');

      // Step 2: Upsert into user_profiles with chosen role
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          email: newUserEmail,
          full_name: newUserName,
          role: newUserRole,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (profileError) throw new Error(profileError.message);

      setAddUserMsg({ type: 'success', text: `User "${newUserName}" created successfully! They can now log in with their email and password.` });
      setNewUserEmail('');
      setNewUserName('');
      setNewUserPassword('');
      setNewUserRole('attendee');
      // Refresh users list
      const result = await organizerCrudService.getAllUsers();
      if (result.success && result.users) setUsers(result.users);
    } catch (err: any) {
      setAddUserMsg({ type: 'error', text: err.message || 'Failed to create user.' });
    } finally {
      setIsAddingUser(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const map: Record<string, string> = {
      attendee: 'admin-badge-info',
      organizer: 'admin-badge-success',
      admin: 'admin-badge-danger',
    };
    return <span className={`admin-badge-status ${map[role] || 'admin-badge-info'}`}>{role}</span>;
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
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-3" style={{ color: 'var(--admin-primary)' }} />
            <p className="text-gray-500">Loading dashboard data…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-main">
      <div className="admin-content">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="admin-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="flex items-center gap-2">
                <Shield className="w-7 h-7" style={{ color: 'var(--admin-primary)' }} />
                Admin Dashboard
              </h1>
              <p>Welcome back, {profile?.full_name || 'Admin'} — here's your platform overview.</p>
            </div>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="admin-btn admin-btn-primary"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* ── Stats Cards ────────────────────────────────────────────────── */}
        <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {[
            { label: 'Total Users', value: stats.total, icon: Users, color: '#8b5cf6', change: null },
            { label: 'Organizers', value: stats.organizers, icon: TrendingUp, color: '#6366f1', change: null },
            { label: 'Attendees', value: stats.attendees, icon: Activity, color: '#ec4899', change: null },
            { label: 'Total Events', value: stats.events, icon: Calendar, color: '#0ea5e9', change: null },
            { label: 'Published', value: stats.published, icon: BarChart3, color: '#10b981', change: null },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="admin-stat-card">
                <div className="admin-stat-header">
                  <div className="admin-stat-icon" style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}99)` }}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="admin-stat-value">{stat.value}</div>
                <div className="admin-stat-label">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* ── Charts Row ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">
                <BarChart3 className="w-5 h-5" style={{ color: 'var(--admin-primary)' }} />
                Events by Month
              </h3>
              <p className="admin-card-subtitle">Last 6 months · {stats.events} total events</p>
            </div>
            <div className="admin-card-body" style={{ padding: '1.5rem' }}>
              {events.length > 0 ? (
                <BarChart data={eventsPerMonth} color="var(--admin-primary)" />
              ) : (
                <div className="admin-empty-state" style={{ padding: '2rem' }}>
                  <BarChart3 className="admin-empty-icon" />
                  <p className="admin-empty-description">No events to display yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Donut Chart */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">
                <PieChart className="w-5 h-5" style={{ color: 'var(--admin-primary)' }} />
                Users by Role
              </h3>
              <p className="admin-card-subtitle">{stats.total} total registered users</p>
            </div>
            <div className="admin-card-body" style={{ padding: '1.5rem' }}>
              {users.length > 0 ? (
                <DonutChart slices={roleSlices.length ? roleSlices : [{ label: 'No Users', value: 1, color: '#e2e8f0' }]} />
              ) : (
                <div className="admin-empty-state" style={{ padding: '2rem' }}>
                  <PieChart className="admin-empty-icon" />
                  <p className="admin-empty-description">No users to display yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Recent Tables Row ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5" style={{ color: 'var(--admin-primary)' }} />
                Recent Users
              </h2>
              <button
                onClick={() => navigate('/admin/users')}
                className="admin-btn admin-btn-secondary admin-btn-sm flex items-center gap-1"
              >
                View All <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="admin-table-container">
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 6).map((user) => (
                      <tr key={user.id}>
                        <td>
                          <p className="font-semibold text-sm">{user.full_name || 'N/A'}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </td>
                        <td>{getRoleBadge(user.role)}</td>
                        <td>
                          <div className="flex gap-1">
                            <button
                              onClick={() => viewUserActivity(user)}
                              className="admin-action-btn admin-tooltip"
                              data-tooltip="View Activity"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal({ id: user.id, type: 'user', name: user.full_name || user.email })}
                              className="admin-action-btn danger admin-tooltip"
                              data-tooltip="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={3} className="text-center text-gray-400 py-8">No users found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Events */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5" style={{ color: 'var(--admin-primary)' }} />
                Recent Events
              </h2>
              <button
                onClick={() => navigate('/admin/events')}
                className="admin-btn admin-btn-secondary admin-btn-sm flex items-center gap-1"
              >
                View All <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="admin-table-container">
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.slice(0, 6).map((event) => (
                      <tr key={event.id}>
                        <td>
                          <p className="font-semibold text-sm">{event.title}</p>
                          <p className="text-xs text-gray-400">{new Date(event.event_date).toLocaleDateString()}</p>
                        </td>
                        <td>{getStatusBadge(event.status)}</td>
                        <td>
                          <div className="flex gap-1">
                            <button
                              onClick={() => navigate(`/organizer/event/${event.id}/edit`)}
                              className="admin-action-btn admin-tooltip"
                              data-tooltip="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal({ id: event.id, type: 'event', name: event.title })}
                              className="admin-action-btn danger admin-tooltip"
                              data-tooltip="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {events.length === 0 && (
                      <tr><td colSpan={3} className="text-center text-gray-400 py-8">No events found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Delete Modal ──────────────────────────────────────────────────── */}
      {itemToDelete && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '420px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Confirm Deletion</h3>
              <button onClick={closeDeleteModal} className="admin-modal-close"><X className="w-5 h-5" /></button>
            </div>
            <div className="admin-modal-body text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#fee2e2' }}>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-gray-600">
                Are you sure you want to delete the {itemToDelete.type}{' '}
                <strong>"{itemToDelete.name}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button onClick={closeDeleteModal} className="admin-btn admin-btn-secondary">Cancel</button>
              <button onClick={confirmDelete} disabled={isDeleting} className="admin-btn admin-btn-danger">
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── User Activity Modal ───────────────────────────────────────────── */}
      {activityUser && (
        <div className="admin-modal-overlay" onClick={() => setActivityUser(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Activity: {activityUser.full_name || activityUser.email}</h3>
              <button onClick={() => setActivityUser(null)} className="admin-modal-close"><X className="w-5 h-5" /></button>
            </div>
            <div className="admin-modal-body">
              {isActivityLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--admin-primary)' }} />
                </div>
              ) : userActivity && (
                <div className="max-h-80 overflow-y-auto space-y-4">
                  {userActivity.createdEvents.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Events Created ({userActivity.createdEvents.length})</h4>
                      <ul className="space-y-1">
                        {userActivity.createdEvents.map((e) => (
                          <li key={e.id} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded p-2">
                            <Calendar className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--admin-primary)' }} />
                            {e.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {userActivity.purchasedTickets.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Tickets Purchased ({userActivity.purchasedTickets.length})</h4>
                      <ul className="space-y-1">
                        {userActivity.purchasedTickets.map((t) => (
                          <li key={t.id} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded p-2">
                            <Activity className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--admin-primary)' }} />
                            {t.events?.title || 'Unknown Event'} — {t.ticket_type || ''}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {userActivity.createdEvents.length === 0 && userActivity.purchasedTickets.length === 0 && (
                    <div className="admin-empty-state">
                      <Activity className="admin-empty-icon" />
                      <p className="admin-empty-description">No activity found for this user.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setActivityUser(null)} className="admin-btn admin-btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add User Modal ────────────────────────────────────────────────── */}
      {showAddUserModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '480px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Add New User</h3>
              <button onClick={() => { setShowAddUserModal(false); setAddUserMsg(null); }} className="admin-modal-close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="admin-modal-body space-y-4">
                {addUserMsg && (
                  <div className={`admin-alert ${addUserMsg.type === 'success' ? 'admin-alert-success' : 'admin-alert-danger'}`}>
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm">{addUserMsg.text}</p>
                  </div>
                )}
                <div className="admin-form-group">
                  <label className="admin-form-label">Full Name</label>
                  <input
                    type="text" required autoComplete="off"
                    value={newUserName} onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter full name" className="admin-form-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Email Address</label>
                  <input
                    type="email" required autoComplete="off"
                    value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="Enter email" className="admin-form-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Password</label>
                  <input
                    type="password" required minLength={6} autoComplete="new-password"
                    value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="Min. 6 characters" className="admin-form-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Role</label>
                  <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} className="admin-form-select">
                    <option value="attendee">Attendee</option>
                    <option value="organizer">Organizer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" onClick={() => { setShowAddUserModal(false); setAddUserMsg(null); }} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isAddingUser} className="admin-btn admin-btn-primary">
                  {isAddingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  {isAddingUser ? 'Creating…' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
