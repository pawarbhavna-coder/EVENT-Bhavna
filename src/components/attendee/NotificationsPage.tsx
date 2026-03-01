import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Bell, Check, Trash2, Mail, Users, Calendar } from 'lucide-react';

interface Notification {
  id: string;
  type: 'event' | 'network' | 'message';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'event',
    title: 'Reminder: Tech Innovation Summit 2024',
    message: 'Your event is starting in 24 hours. Get ready for an amazing experience!',
    timestamp: '2024-03-14T09:00:00Z',
    isRead: false
  },
  {
    id: '2',
    type: 'network',
    title: 'New Connection Request',
    message: 'John Doe wants to connect with you.',
    timestamp: '2024-03-13T15:30:00Z',
    isRead: false
  },
  {
    id: '3',
    type: 'message',
    title: 'New Message from Jane Smith',
    message: 'Hi there! Looking forward to connecting at the upcoming event.',
    timestamp: '2024-03-13T11:00:00Z',
    isRead: true
  },
    {
    id: '4',
    type: 'event',
    title: 'Session Change: AI in Healthcare',
    message: 'The session has been moved to Room 102. Please update your schedule.',
    timestamp: '2024-03-12T18:00:00Z',
    isRead: true
  }
];

const NotificationsPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  React.useEffect(() => {
    setBreadcrumbs(['Notifications']);
  }, [setBreadcrumbs]);

  const toggleReadStatus = (id: string) => {
    setNotifications(
      notifications.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };
  
  const markAllAsRead = () => {
      setNotifications(notifications.map(n => ({...n, isRead: true})));
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'event': return <Calendar className="w-5 h-5 text-indigo-600" />;
      case 'network': return <Users className="w-5 h-5 text-blue-600" />;
      case 'message': return <Mail className="w-5 h-5 text-green-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };
  
  const filteredNotifications = notifications.filter(n => filter === 'all' || !n.isRead);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                    <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>All</button>
                    <button onClick={() => setFilter('unread')} className={`px-4 py-2 rounded-lg ${filter === 'unread' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>Unread</button>
                </div>
                <button onClick={markAllAsRead} className="text-sm text-indigo-600 hover:underline">Mark all as read</button>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg">
            <ul className="divide-y divide-gray-200">
                {filteredNotifications.map(notification => (
                    <li key={notification.id} className={`p-6 transition-colors duration-200 ${!notification.isRead ? 'bg-indigo-50' : ''}`}>
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-md font-semibold text-gray-900">{notification.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-2">{new Date(notification.timestamp).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => toggleReadStatus(notification.id)} className="p-2 text-gray-400 hover:text-gray-600" title={notification.isRead ? 'Mark as unread' : 'Mark as read'}>
                                    <Check className="w-5 h-5" />
                                </button>
                                <button onClick={() => deleteNotification(notification.id)} className="p-2 text-gray-400 hover:text-red-600" title="Delete">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        {filteredNotifications.length === 0 && (
            <div className="text-center py-20">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900">No new notifications</h3>
                <p className="text-gray-600 mt-2">You're all caught up!</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
