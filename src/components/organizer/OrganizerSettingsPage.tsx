import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import { User, Mail, LogOut, Shield } from 'lucide-react';

const OrganizerSettingsPage: React.FC = () => {
  const { setBreadcrumbs, setCurrentView } = useApp();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();

  React.useEffect(() => {
    setBreadcrumbs(['Account Settings']);
  }, [setBreadcrumbs]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{profile?.full_name || user?.email}</h1>
            <p className="text-gray-600 capitalize">{profile?.role || 'organizer'}</p>
          </div>

          <div className="space-y-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
               <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Account</p>
                  <a href="#" className="font-medium text-indigo-600 hover:underline">Change Password</a>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerSettingsPage;
