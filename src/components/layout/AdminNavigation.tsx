import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, Users, Calendar, FileText, Settings,
  LogOut, Menu, X, User, Bell, Shield, ChevronDown, BarChart3,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/NewAuthContext';
import '../../styles/admin-panel.css';

const AdminNavigation: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when clicking outside
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
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: Home,
      description: 'Overview & Analytics'
    },
    {
      label: 'User Management',
      path: '/admin/dashboard', // User management is part of admin dashboard
      icon: Users,
      description: 'Manage Users & Roles'
    },
    {
      label: 'Event Oversight',
      path: '/admin/event-oversight',
      icon: Calendar,
      description: 'Monitor Events'
    },
    {
      label: 'Content Management',
      path: '/admin/content-management',
      icon: FileText,
      description: 'Site Content & Pages'
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSidebarExpansion = () => {
    if (!isMobile) {
      setIsSidebarExpanded(!isSidebarExpanded);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="admin-mobile-toggle"
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`admin-sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Admin Sidebar */}
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
          
          {/* Desktop Expand/Collapse Button */}
          {!isMobile && (
            <button
              onClick={toggleSidebarExpansion}
              className="admin-expand-btn"
              aria-label={isSidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isSidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="admin-nav">
          <div className="admin-nav-section">
            <div className="admin-nav-title">Main Navigation</div>
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="admin-nav-item w-full text-left"
                >
                  <IconComponent className="admin-nav-icon" />
                  <div>
                    <div>{item.label}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="admin-nav-section">
            <div className="admin-nav-title">System</div>
            <button
              onClick={() => handleNavigation('/notifications')}
              className="admin-nav-item w-full text-left"
            >
              <div className="relative">
                <Bell className="admin-nav-icon" />
                <div className="admin-notification-dot"></div>
              </div>
              <div>
                <div>Notifications</div>
                <div className="text-xs opacity-75">System Alerts</div>
              </div>
            </button>
          </div>
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
          <button
            onClick={handleLogout}
            className="admin-logout-btn w-full mt-3"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminNavigation;
