import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, Users, BookOpen, Info, Phone, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/NewAuthContext';
import UnifiedAuthModal from '../auth/UnifiedAuthModal';

const NewPublicNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, profile, logout } = useAuth();

  const navigationItems = [
    { label: 'Events', path: '/discover', icon: Calendar },
    { label: 'Speakers', path: '/speakers', icon: Users },
    { label: 'Blog', path: '/blog', icon: BookOpen },
    { label: 'About', path: '/about', icon: Info },
    { label: 'Contact', path: '/contact', icon: Phone },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setShowProfileMenu(false);
  };



  const handleAuthAction = () => {
    if (isAuthenticated && user && profile) {
      // Route to appropriate dashboard based on role
      if (profile.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false);
    // Auto-redirect handled by the useEffect above watching profile.role
  };

  const handleLogout = async () => {
    setShowProfileMenu(false);
    setIsMobileMenuOpen(false);
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('sb-')) localStorage.removeItem(key);
    });
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 backdrop-blur-md bg-opacity-90 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex-shrink-0 cursor-pointer md:order-1"
              onClick={() => handleNavigation('/')}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
                </div>
                <span className="text-white font-bold text-xl">EventEase</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className="flex items-center space-x-2 text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg"
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => handleNavigation('/pricing')}
                className="text-white hover:text-indigo-200 text-sm font-medium transition-colors duration-200 px-3 py-2 hover:bg-white/10 rounded-lg"
              >
                Pricing
              </button>
              {isAuthenticated && user && profile ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 text-white hover:text-indigo-200 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">{profile.full_name || user.email}</span>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{profile.full_name || user.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{profile.role}</p>
                      </div>
                      <button
                        onClick={handleAuthAction}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        Dashboard
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
              ) : (
                <button
                  onClick={handleAuthAction}
                  className="bg-white text-indigo-600 hover:bg-gray-100 text-sm font-medium transition-colors duration-200 px-4 py-2 rounded-lg"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-white hover:text-indigo-200 p-3 rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 touch-manipulation"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
            ? 'max-h-screen opacity-100 transform translate-y-0'
            : 'max-h-0 opacity-0 overflow-hidden transform -translate-y-2'
            }`}>
            <div className="px-2 pt-2 pb-3 space-y-1 rounded-xl mt-2 shadow-xl border border-white/20" style={{ backgroundColor: '#1e1b4b' }}>
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="flex items-center space-x-3 block px-4 py-3 text-base font-medium w-full text-left rounded-lg transition-all duration-300 touch-manipulation hover:bg-white/20"
                    style={{ color: '#ffffff' }}
                  >
                    <IconComponent className="w-5 h-5" style={{ color: '#ffffff' }} />
                    <span style={{ color: '#ffffff' }}>{item.label}</span>
                  </button>
                );
              })}

              <div className="border-t border-white/20 pt-3 mt-3">
                <button
                  onClick={() => handleNavigation('/pricing')}
                  className="block px-4 py-3 text-base font-medium w-full text-left rounded-lg transition-all duration-300 touch-manipulation hover:bg-white/20"
                  style={{ color: '#ffffff' }}
                >
                  Pricing
                </button>
                {isAuthenticated && user && profile ? (
                  <>
                    <div className="flex items-center space-x-2 px-4 py-3" style={{ color: '#ffffff' }}>
                      <User className="w-4 h-4" style={{ color: '#ffffff' }} />
                      <span className="text-base font-medium">{profile.full_name || user.email}</span>
                    </div>
                    <button
                      onClick={handleAuthAction}
                      className="block px-4 py-3 text-base font-medium w-full text-left rounded-lg transition-all duration-300 touch-manipulation hover:bg-white/20"
                      style={{ color: '#ffffff' }}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 block px-4 py-3 text-base font-medium w-full text-left rounded-lg transition-all duration-300 touch-manipulation hover:bg-red-500/20"
                      style={{ color: '#ffffff' }}
                    >
                      <LogOut className="w-5 h-5" style={{ color: '#ffffff' }} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleAuthAction}
                    className="block px-4 py-3 text-base font-medium w-full text-left rounded-lg transition-all duration-300 touch-manipulation hover:bg-white/20"
                    style={{ color: '#ffffff' }}
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <UnifiedAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default NewPublicNavigation;
