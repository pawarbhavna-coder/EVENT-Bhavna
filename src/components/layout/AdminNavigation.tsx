import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Users, Calendar, FileText,
  LogOut, Menu, X, User, Bell, Shield,
  ChevronLeft, ChevronRight, Plus, LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../contexts/NewAuthContext';
import '../../styles/admin-panel.css';

const AdminNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobile && isMobileMenuOpen && !target.closest('.admin-sidebar') && !target.closest('.admin-mobile-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isMobileMenuOpen]);

  const navigationItems = [
    {
      group: 'Overview',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, description: 'Stats & Charts' },
      ]
    },
    {
      group: 'Management',
      items: [
        { label: 'Users', path: '/admin/users', icon: Users, description: 'Manage Users & Roles' },
        { label: 'Events', path: '/admin/events', icon: Calendar, description: 'All Platform Events' },
        { label: 'Create Event', path: '/admin/create-event', icon: Plus, description: 'Add New Event' },
        { label: 'Content', path: '/admin/content-management', icon: FileText, description: 'Site Content & Pages' },
      ]
    },
    {
      group: 'System',
      items: [
        { label: 'Notifications', path: '/notifications', icon: Bell, description: 'System Alerts' },
      ]
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    // Force-clear any stored Supabase session from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('sb-')) localStorage.removeItem(key);
    });
    navigate('/');
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="admin-mobile-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      <div
        className={`admin-sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''} ${isSidebarExpanded && !isMobile ? 'expanded' : ''}`}
        onMouseEnter={() => !isMobile && setIsSidebarExpanded(true)}
        onMouseLeave={() => !isMobile && setIsSidebarExpanded(false)}
      >
        {/* Sidebar Header */}
        <div className="admin-sidebar-header">
          <div className="admin-logo-container">
            <div className="admin-logo">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="admin-logo-text">EventEase</div>
              <div className="admin-badge">Admin Panel</div>
            </div>
          </div>

          {!isMobile && (
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="admin-expand-btn"
              aria-label={isSidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isSidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="admin-nav">
          {navigationItems.map((group) => (
            <div key={group.group} className="admin-nav-section">
              <div className="admin-nav-title">{group.group}</div>
              {group.items.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`admin-nav-item w-full text-left ${active ? 'active' : ''}`}
                  >
                    <IconComponent className="admin-nav-icon" />
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-75">{item.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="admin-user-profile">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              <User className="w-5 h-5" />
            </div>
            <div className="admin-user-details">
              <h4>{profile?.full_name || user?.email}</h4>
              <p>{profile?.role || 'admin'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn w-full mt-3">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminNavigation;
