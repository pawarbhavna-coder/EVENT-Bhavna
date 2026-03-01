import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, Users, Bell, User, Settings, Menu, X, Ticket, BookOpen, LogOut, ChevronDown, Plus, BarChart3, Mail, ShoppingCart, Twitch as Switch } from 'lucide-react';
import { useAuth } from '../../contexts/NewAuthContext';

type ViewMode = 'attendee' | 'organizer';

const UnifiedNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('attendee');
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();

  const attendeeNavItems = [
    { label: 'Discover', path: '/discover', icon: Home },
    { label: 'My Events', path: '/my-events', icon: Calendar },
    { label: 'Resources', path: '/resources', icon: BookOpen },
  ];

  const organizerNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Create Event', path: '/organizer/create-event', icon: Plus },
    { label: 'My Events', path: '/my-events', icon: Calendar },
    { label: 'Attendees', path: '/organizer/attendee-management', icon: Users },
    { label: 'Analytics', path: '/organizer/analytics', icon: BarChart3 },
    { label: 'Ticketing', path: '/organizer/ticketing', icon: Ticket },
  ];

  const currentNavItems = viewMode === 'attendee' ? attendeeNavItems : organizerNavItems;

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setShowProfileMenu(false);
  };

  const handleViewSwitch = () => {
    const newMode = viewMode === 'attendee' ? 'organizer' : 'attendee';
    setViewMode(newMode);
    
    // Navigate to appropriate dashboard
    if (newMode === 'organizer') {
      navigate('/dashboard');
    } else {
      navigate('/dashboard');
    }
    
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowProfileMenu(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer"
            onClick={() => handleNavigation('/dashboard')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span className="text-gray-900 font-bold text-xl">EventEase</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {currentNavItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-indigo-50 rounded-lg"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* View Switcher */}
            <button
              onClick={handleViewSwitch}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
            >
              <Switch className="w-4 h-4" />
              <span>Switch to {viewMode === 'attendee' ? 'Organizer' : 'Attendee'} View</span>
            </button>

            {/* Cart (for attendee view) */}
            {viewMode === 'attendee' && (
              <button
                onClick={() => handleNavigation('/cart')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            )}

            {/* Notifications */}
            <button
              onClick={() => handleNavigation('/notifications')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{profile?.full_name || user?.email}</p>
                  <p className="text-gray-500 capitalize">{viewMode} Mode</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              
              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 animate-fade-in border border-gray-200">
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className="w-full text-left flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Profile & Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 p-3 rounded-lg hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 touch-manipulation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Sub-navigation for Organizer Mode */}
        {viewMode === 'organizer' && (
          <div className="border-t bg-gray-50 hidden md:block">
            <div className="flex items-center space-x-8 py-3">
              <span className="text-sm font-medium text-gray-500">Organizer Tools:</span>
              <button
                onClick={() => handleNavigation('/organizer/settings')}
                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                Settings
              </button>
              <button
                onClick={() => handleNavigation('/organizer/discount-codes')}
                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                Discount Codes
              </button>
              <button
                onClick={() => handleNavigation('/organizer/speaker-portal')}
                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                Speakers
              </button>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-screen opacity-100 transform translate-y-0' 
            : 'max-h-0 opacity-0 overflow-hidden transform -translate-y-2'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-xl mt-2 shadow-xl border border-gray-200">
            {/* View Mode Indicator */}
            <div className="px-4 py-2 bg-indigo-50 rounded-lg mb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-indigo-600 capitalize">{viewMode} Mode</span>
                <button
                  onClick={handleViewSwitch}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Switch to {viewMode === 'attendee' ? 'Organizer' : 'Attendee'}
                </button>
              </div>
            </div>

            {/* Navigation Items */}
            {currentNavItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="mobile-nav-item flex items-center space-x-3 text-gray-700 hover:text-indigo-600 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 touch-manipulation"
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="mobile-nav-item flex items-center space-x-2 text-gray-700 px-4 py-3">
                <User className="w-4 h-4" />
                <span className="text-base font-medium">{profile?.full_name || user?.email}</span>
              </div>
              <button
                onClick={() => handleNavigation('/notifications')}
                className="mobile-nav-item flex items-center space-x-3 text-gray-700 hover:text-indigo-600 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 touch-manipulation"
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => handleNavigation('/profile')}
                className="mobile-nav-item flex items-center space-x-3 text-gray-700 hover:text-indigo-600 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 touch-manipulation"
              >
                <Settings className="w-5 h-5" />
                <span>Profile & Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="mobile-nav-item flex items-center space-x-3 text-red-600 hover:text-red-700 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-105 touch-manipulation"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UnifiedNavigation;