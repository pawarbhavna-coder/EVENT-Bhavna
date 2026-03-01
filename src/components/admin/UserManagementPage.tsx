// src/components/admin/UserManagementPage.tsx

import React, { useState, useMemo } from 'react';
import { Users, Search, Edit, Trash2, UserPlus, AlertTriangle, X, User } from 'lucide-react';
import { organizerCrudService } from '../../services/organizerCrudService';
import '../../styles/admin-panel.css';

// ... (keep the interfaces)

interface AppUser {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  organizer_id?: string;
}


interface MemberManagementProps {
  users: AppUser[];
  events: Event[];
  onRefresh: () => void;
}

const MemberManagement: React.FC<MemberManagementProps> = ({ users, events, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        (user.full_name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const handleDelete = (user: AppUser) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    setIsLoading(true);
    
    const result = await organizerCrudService.deleteUser(selectedUser.id);
    
    if (result.success) {
        alert('User deleted successfully.');
        onRefresh(); // Refresh the user list
    } else {
        alert(`Failed to delete user: ${result.error}`);
    }
    
    setIsLoading(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
  };
  
  const getRoleBadge = (role: string) => {
    const colors: {[key: string]: string} = {
        attendee: 'admin-badge-info',
        organizer: 'admin-badge-success',
        admin: 'admin-badge-danger'
    };
    return <span className={`admin-badge-status ${colors[role] || 'admin-badge-info'}`}>{role}</span>
  }

  return (
    <div className="space-y-6">
      <div className="admin-card">
        <div className="admin-card-body !p-4 md:!p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="admin-search-container w-full md:flex-1 !m-0">
                  <Search className="admin-search-icon" />
                  <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoComplete="off"
                      className="admin-search-input"
                  />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="admin-filter-select w-full md:w-auto">
                      <option value="all">All Roles</option>
                      <option value="attendee">Attendee</option>
                      <option value="organizer">Organizer</option>
                      <option value="admin">Admin</option>
                  </select>
                </div>
            </div>
        </div>
      </div>

      <div className="admin-table-container">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <p className="font-medium text-gray-900">{user.full_name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleDelete(user)} className="admin-action-btn danger admin-tooltip" data-tooltip="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="admin-empty-state">
            <Users className="admin-empty-icon" />
            <h3 className="admin-empty-title">No members found</h3>
          </div>
        )}
      </div>

      {showDeleteModal && selectedUser && (
         <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Delete Member</h3>
              <button onClick={() => setShowDeleteModal(false)} className="admin-modal-close"><X className="w-5 h-5" /></button>
            </div>
            <div className="admin-modal-body text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600"/>
                </div>
                <p className="text-gray-600 mb-6">This will permanently delete "{selectedUser.full_name || selectedUser.email}". This action cannot be undone.</p>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setShowDeleteModal(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button onClick={confirmDelete} disabled={isLoading} className="admin-btn admin-btn-danger">
                {isLoading ? 'Deleting...' : 'Delete Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
