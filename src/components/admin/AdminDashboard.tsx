import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/NewAuthContext';
import { organizerCrudService, OrganizerEvent } from '../../services/organizerCrudService';
import { Loader2, Users, Calendar, Trash2, AlertTriangle, X, Eye } from 'lucide-react';

interface AppUser {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  created_at: string;
}

interface UserActivity {
  createdEvents: OrganizerEvent[];
  purchasedTickets: any[]; // Replace 'any' with a proper ticket type if you have one
}

const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'user' | 'event'; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [activityUser, setActivityUser] = useState<AppUser | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
  const [isActivityLoading, setIsActivityLoading] = useState(false);


  const fetchData = async () => {
    setIsLoading(true);
    const [usersResult, eventsResult] = await Promise.all([
      organizerCrudService.getAllUsers(),
      organizerCrudService.getAllEvents()
    ]);

    if (usersResult.success && usersResult.users) {
      setUsers(usersResult.users);
    }
    if (eventsResult.success && eventsResult.events) {
      setEvents(eventsResult.events);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchData();
    }
  }, [profile]);

  const openDeleteModal = (item: { id: string; type: 'user' | 'event'; name: string }) => {
    setItemToDelete(item);
  };

  const closeDeleteModal = () => {
    setItemToDelete(null);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    let result;
    if (itemToDelete.type === 'user') {
      result = await organizerCrudService.adminDeleteUser(itemToDelete.id);
    } else {
      result = await organizerCrudService.adminDeleteEvent(itemToDelete.id);
    }

    if (!result.error) {
        alert(`${itemToDelete.type.charAt(0).toUpperCase() + itemToDelete.type.slice(1)} "${itemToDelete.name}" deleted successfully.`);
        fetchData(); // Refresh data
    } else {
        alert(`Error: ${result.error}`);
    }

    setIsDeleting(false);
    closeDeleteModal();
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


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><Users /> All Users ({users.length})</h2>
            <div className="max-h-[600px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-medium">{user.full_name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex gap-2">
                        <button onClick={() => viewUserActivity(user)} className="text-blue-600 hover:text-blue-900"><Eye size={18}/></button>
                        <button onClick={() => openDeleteModal({ id: user.id, type: 'user', name: user.full_name || user.email })} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Events Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><Calendar /> All Events ({events.length})</h2>
            <div className="max-h-[600px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map(event => (
                    <tr key={event.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-500">{new Date(event.event_date).toLocaleDateString()}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">{event.status}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => openDeleteModal({ id: event.id, type: 'event', name: event.title })} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <div className="flex flex-col items-center text-center">
                <div className="bg-red-100 p-3 rounded-full mb-4"><AlertTriangle className="text-red-600" size={32}/></div>
                <h3 className="text-lg font-bold">Confirm Deletion</h3>
                <p className="text-sm text-gray-500 mt-2">Are you sure you want to delete the {itemToDelete.type} "{itemToDelete.name}"? This action cannot be undone.</p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeDeleteModal} className="px-4 py-2 bg-gray-200 rounded-md text-sm">Cancel</button>
              <button onClick={confirmDelete} disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm flex items-center gap-2 disabled:bg-red-300">
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin"/>}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
       {/* User Activity Modal */}
      {activityUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setActivityUser(null)}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">Activity for {activityUser.full_name || activityUser.email}</h3>
            {isActivityLoading ? <Loader2 className="animate-spin my-4"/> : 
            userActivity && (
                <div className="mt-4 max-h-[400px] overflow-y-auto">
                    {userActivity.createdEvents.length > 0 && (
                        <div>
                            <h4 className="font-semibold">Events Created:</h4>
                            <ul className="list-disc pl-5 text-sm text-gray-600">
                                {userActivity.createdEvents.map(e => <li key={e.id}>{e.title}</li>)}
                            </ul>
                        </div>
                    )}
                     {userActivity.purchasedTickets.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold">Tickets Purchased:</h4>
                             <ul className="list-disc pl-5 text-sm text-gray-600">
                                {userActivity.purchasedTickets.map(t => <li key={t.id}>{t.events.title} ({t.ticket_type})</li>)}
                            </ul>
                        </div>
                    )}
                     {userActivity.createdEvents.length === 0 && userActivity.purchasedTickets.length === 0 && (
                        <p className="text-sm text-gray-500 mt-2">No activity found for this user.</p>
                     )}
                </div>
            )}
            <button onClick={() => setActivityUser(null)} className="mt-4 px-4 py-2 bg-gray-200 rounded-md text-sm">Close</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
