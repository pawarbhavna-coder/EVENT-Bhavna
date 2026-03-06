// src/components/admin/UserManagementPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/NewAuthContext';
import { organizerCrudService, OrganizerEvent } from '../../services/organizerCrudService';
import {
  Users, Search, Trash2, AlertTriangle, X, Eye, UserPlus,
  Loader2, Activity, Calendar
} from 'lucide-react';
import { supabase } from '../../lib/supabaseConfig';
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

const UserManagementPage: React.FC = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Delete modal
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Activity modal
  const [activityUser, setActivityUser] = useState<AppUser | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
  const [isActivityLoading, setIsActivityLoading] = useState(false);

  // Add user modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('attendee');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [addMsg, setAddMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    const result = await organizerCrudService.getAllUsers();
    if (result.success && result.users) setUsers(result.users);
    setIsLoading(false);
  };

  useEffect(() => {
    if (profile?.role === 'admin') fetchUsers();
  }, [profile]);

  const filteredUsers = useMemo(() =>
    users.filter((u) => {
      const matchSearch =
        (u.full_name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      return matchSearch && matchRole;
    }),
    [users, searchTerm, roleFilter]
  );

  const confirmDelete = async () => {
    if (!selectedUser) return;
    setIsDeleting(true);
    const result = await organizerCrudService.adminDeleteUser(selectedUser.id);
    if (result.success) fetchUsers();
    else alert(`Failed to delete user: ${result.error}`);
    setIsDeleting(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const viewUserActivity = async (user: AppUser) => {
    setActivityUser(user);
    setIsActivityLoading(true);
    if (user.role === 'organizer') {
      const { events } = await organizerCrudService.getEventsForOrganizer(user.id);
      setUserActivity({ createdEvents: events || [], purchasedTickets: [] });
    } else {
      const { registrations } = await organizerCrudService.getEventRegistrationsForUser(user.id);
      setUserActivity({ createdEvents: [], purchasedTickets: registrations || [] });
    }
    setIsActivityLoading(false);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddMsg(null);
    setIsAddingUser(true);
    try {
      // Step 1: Create auth user via signUp (DB trigger handles profile creation)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
        options: {
          data: {
            full_name: newUserName,
            role: newUserRole
          }
        },
      });

      if (authError) throw new Error(authError.message);
      const userId = authData.user?.id;
      if (!userId) throw new Error('User creation failed — no user ID returned.');

      setAddMsg({ type: 'success', text: `User "${newUserName}" created successfully! They can log in immediately.` });
      setNewUserEmail('');
      setNewUserName('');
      setNewUserPassword('');
      setNewUserRole('attendee');
      // Refresh users list
      fetchUsers();
    } catch (err: any) {
      setAddMsg({ type: 'error', text: err.message || 'Failed to create user.' });
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

  const roleCounts = useMemo(() => ({
    all: users.length,
    attendee: users.filter((u) => u.role === 'attendee').length,
    organizer: users.filter((u) => u.role === 'organizer').length,
    admin: users.filter((u) => u.role === 'admin').length,
  }), [users]);

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
                <Users className="w-7 h-7" style={{ color: 'var(--admin-primary)' }} />
                User Management
              </h1>
              <p>Manage all platform users — attendees, organisers, and admins.</p>
            </div>
            <button onClick={() => { setShowAddModal(true); setAddMsg(null); }} className="admin-btn admin-btn-primary">
              <UserPlus className="w-4 h-4" /> Add User
            </button>
          </div>
        </div>

        {/* Summary pill tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {(['all', 'attendee', 'organizer', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${roleFilter === r
                ? 'border-transparent text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300'
                }`}
              style={roleFilter === r ? { background: 'linear-gradient(135deg, var(--admin-primary), var(--admin-secondary))' } : {}}
            >
              {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
              <span className="ml-2 bg-white bg-opacity-25 px-1.5 py-0.5 rounded-full text-xs">
                {roleCounts[r]}
              </span>
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="admin-card mb-4">
          <div className="admin-card-body" style={{ padding: '1rem 1.5rem' }}>
            <div className="admin-search-container" style={{ marginBottom: 0 }}>
              <Search className="admin-search-icon" />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
                className="admin-search-input"
              />
            </div>
          </div>
        </div>

        {/* Users table */}
        <div className="admin-table-container">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, var(--admin-primary), var(--admin-secondary))' }}
                        >
                          {(user.full_name || user.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{user.full_name || 'N/A'}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td className="text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewUserActivity(user)}
                          className="admin-action-btn admin-tooltip"
                          data-tooltip="View Activity"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                          className="admin-action-btn danger admin-tooltip"
                          data-tooltip="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-16">
                      <div className="admin-empty-state" style={{ padding: 0 }}>
                        <Users className="admin-empty-icon" />
                        <h3 className="admin-empty-title">No users found</h3>
                        <p className="admin-empty-description">Try adjusting your search or filter.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-right">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '420px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Delete User</h3>
              <button onClick={() => setShowDeleteModal(false)} className="admin-modal-close"><X className="w-5 h-5" /></button>
            </div>
            <div className="admin-modal-body text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#fee2e2' }}>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-gray-600">
                This will permanently delete <strong>"{selectedUser.full_name || selectedUser.email}"</strong>. This action cannot be undone.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setShowDeleteModal(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button onClick={confirmDelete} disabled={isDeleting} className="admin-btn admin-btn-danger">
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />} Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Modal */}
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
              ) : userActivity ? (
                <div className="max-h-80 overflow-y-auto space-y-4">
                  {userActivity.createdEvents.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Events Created ({userActivity.createdEvents.length})</h4>
                      <ul className="space-y-1">
                        {userActivity.createdEvents.map((e) => (
                          <li key={e.id} className="flex gap-2 items-center text-sm p-2 bg-gray-50 rounded">
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
                          <li key={t.id} className="flex gap-2 items-center text-sm p-2 bg-gray-50 rounded">
                            <Activity className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--admin-primary)' }} />
                            {t.events?.title || 'Unknown Event'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {userActivity.createdEvents.length === 0 && userActivity.purchasedTickets.length === 0 && (
                    <div className="admin-empty-state"><p className="admin-empty-description">No activity found for this user.</p></div>
                  )}
                </div>
              ) : null}
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setActivityUser(null)} className="admin-btn admin-btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '480px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Add New User</h3>
              <button onClick={() => setShowAddModal(false)} className="admin-modal-close"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="admin-modal-body space-y-4">
                {addMsg && (
                  <div className={`admin-alert ${addMsg.type === 'success' ? 'admin-alert-success' : 'admin-alert-danger'}`}>
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm">{addMsg.text}</p>
                  </div>
                )}
                <div className="admin-form-group">
                  <label className="admin-form-label">Full Name</label>
                  <input type="text" required autoComplete="off" value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)} placeholder="Enter full name" className="admin-form-input" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Email Address</label>
                  <input type="email" required autoComplete="off" value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)} placeholder="Enter email" className="admin-form-input" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Password</label>
                  <input type="password" required minLength={6} autoComplete="new-password" value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)} placeholder="Min. 6 characters" className="admin-form-input" />
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
                <button type="button" onClick={() => setShowAddModal(false)} className="admin-btn admin-btn-secondary">Cancel</button>
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

export default UserManagementPage;
