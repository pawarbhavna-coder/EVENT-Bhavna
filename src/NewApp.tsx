import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/NewAuthContext';
import { AppProvider } from './contexts/AppContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import UnauthorizedPage from './components/pages/UnauthorizedPage';
import AdminShortcutLogin from './components/admin/AdminShortcutLogin';
import { useAdminShortcut } from './hooks/useAdminShortcut';
import './index.css';
import './components/chart-styles.css';
import { Loader2 } from 'lucide-react';

// Add console logging for debugging
console.log('NewApp.tsx loaded');

// --- Layout Components ---
import NewPublicNavigation from './components/layout/NewPublicNavigation';
import UnifiedNavigation from './components/layout/UnifiedNavigation';
import AdminNavigation from './components/layout/AdminNavigation';
import Breadcrumbs from './components/layout/Breadcrumbs';

// --- Lazy-loaded Page Components ---
const NewHomePage = lazy(() => import('./components/pages/NewHomePage'));
const EventDiscoveryPage = lazy(() => import('./components/pages/EventDiscoveryPage'));
const SpeakerDirectoryPage = lazy(() => import('./components/speakers/SpeakerDirectoryPage'));
const OrganizerDirectoryPage = lazy(() => import('./components/pages/OrganizerDirectoryPage'));
const BlogPage = lazy(() => import('./components/blog/BlogContainer'));
const EventDetailPage = lazy(() => import('./components/events/EventDetailPage'));
const EventPaymentPage = lazy(() => import('./components/events/EventPaymentPage'));
const EventPaymentSuccess = lazy(() => import('./components/events/EventPaymentSuccess'));
const ResourcesPage = lazy(() => import('./components/pages/ResourcesPage'));
const PressPage = lazy(() => import('./components/pages/PressPage'));
const AboutPage = lazy(() => import('./components/pages/AboutPage'));
const PricingPage = lazy(() => import('./components/pages/PricingPage'));
const ContactPage = lazy(() => import('./components/pages/ContactPage'));
const TermsPage = lazy(() => import('./components/pages/TermsPage'));
const PrivacyPage = lazy(() => import('./components/pages/PrivacyPage'));
const SimplePasswordReset = lazy(() => import('./components/auth/SimplePasswordReset'));

// Unified Dashboard Component
const UnifiedDashboard = lazy(() => import('./components/dashboard/UnifiedDashboard'));
const AttendeeMyEventsPage = lazy(() => import('./components/attendee/MyEventsPage'));
const NotificationsPage = lazy(() => import('./components/attendee/NotificationsPage'));
const AttendeeProfilePage = lazy(() => import('./components/attendee/AttendeeProfilePage'));
const AgendaBuilderPage = lazy(() => import('./components/attendee/AgendaBuilderPage'));
const NetworkingHubPage = lazy(() => import('./components/attendee/NetworkingHubPage'));
const LiveEventPage = lazy(() => import('./components/attendee/LiveEventPage'));
const ExpoHallPage = lazy(() => import('./components/attendee/ExpoHallPage'));

// Organizer Components (using Real versions)
const CreateEventPage = lazy(() => import('./components/organizer/CreateEventPage'));
const EventSettingsPage = lazy(() => import('./components/organizer/EventSettingsPage'));
const LandingCustomizerPage = lazy(() => import('./components/organizer/LandingCustomizerPage'));
const AgendaManagerPage = lazy(() => import('./components/organizer/AgendaManagerPage'));
const VenueManagerPage = lazy(() => import('./components/organizer/VenueManagerPage'));
const RealTicketingPage = lazy(() => import('./components/organizer/RealTicketingPage'));
const DiscountCodesPage = lazy(() => import('./components/organizer/DiscountCodesPage'));
const RealAttendeeManagementPage = lazy(() => import('./components/organizer/RealAttendeeManagementPage'));
const RealEmailCampaignsPage = lazy(() => import('./components/organizer/RealEmailCampaignsPage'));
const SpeakerPortalPage = lazy(() => import('./components/organizer/SpeakerPortalPage'));
const StaffRolesPage = lazy(() => import('./components/organizer/StaffRolesPage'));
const RealAnalyticsPage = lazy(() => import('./components/organizer/RealAnalyticsPage'));
const OrganizerSettingsPage = lazy(() => import('./components/organizer/OrganizerSettingsPage'));
const EventEditPage = lazy(() => import('./components/organizer/EventEditPage'));
const EventTicketingSetupPage = lazy(() => import('./components/organizer/EventTicketingSetupPage'));

// Admin Components
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const EventOversightPage = lazy(() => import('./components/admin/EventOversightPage'));
const ContentManagementPage = lazy(() => import('./components/admin/ContentManagementPage'));
const AdminEventsPage = lazy(() => import('./components/admin/AdminEventsPage'));
const AdminCreateEventPage = lazy(() => import('./components/admin/AdminCreateEventPage'));
const UserManagementPage = lazy(() => import('./components/admin/UserManagementPage'));

const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  </div>
);


const AppContent: React.FC = () => {
  const { user, profile, isAuthenticated, loading } = useAuth();
  const { isModalOpen, closeModal } = useAdminShortcut();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('AppContent render:', { user, profile, isAuthenticated });

  // Auto-redirect to the correct dashboard after login based on REAL profile role
  useEffect(() => {
    if (!loading && isAuthenticated && profile) {
      const publicPaths = ['/', '/speakers', '/organizers', '/blog',
        '/resources', '/press', '/about', '/pricing', '/contact', '/terms', '/privacy'];
      const isOnPublicPage = publicPaths.includes(location.pathname);

      if (isOnPublicPage) {
        if (profile.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    }
  }, [isAuthenticated, profile, loading, location.pathname, navigate]);

  // Block rendering until Supabase has fully resolved auth state
  if (loading || user === undefined || (isAuthenticated && user && !profile)) {
    return <LoadingFallback />;
  }

  const renderNavigation = () => {
    if (isAuthenticated && user && profile) {
      if (profile.role === 'admin') {
        return <AdminNavigation />;
      } else {
        return <UnifiedNavigation />;
      }
    }
    return <NewPublicNavigation />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      {isModalOpen && <AdminShortcutLogin onClose={closeModal} />}
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<NewHomePage />} />
            <Route path="/discover" element={<EventDiscoveryPage />} />
            <Route path="/speakers" element={<SpeakerDirectoryPage />} />
            <Route path="/organizers" element={<OrganizerDirectoryPage />} />
            <Route path="/blog" element={<BlogPage isStandalone={true} />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/press" element={<PressPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/password-reset" element={<SimplePasswordReset />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/event/:eventId" element={<EventDetailPage />} />
            <Route path="/event-payment" element={<EventPaymentPage />} />
            <Route path="/event-payment-success" element={<EventPaymentSuccess />} />

            {/* --- Unified Dashboard Route --- */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['attendee', 'organizer', 'admin']}>
                  <UnifiedDashboard />
                </ProtectedRoute>
              }
            />

            {/* --- Shared Routes --- */}
            <Route
              path="/my-events"
              element={
                <ProtectedRoute allowedRoles={['attendee', 'organizer', 'admin']}>
                  <AttendeeMyEventsPage />
                </ProtectedRoute>
              }
            />

            {/* --- Attendee-specific Routes --- */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRoles={['attendee', 'organizer', 'admin']}>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['attendee', 'organizer', 'admin']}>
                  <AttendeeProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agenda-builder"
              element={
                <ProtectedRoute allowedRoles={['attendee']}>
                  <AgendaBuilderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/networking-hub"
              element={
                <ProtectedRoute allowedRoles={['attendee']}>
                  <NetworkingHubPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/live-event"
              element={
                <ProtectedRoute allowedRoles={['attendee']}>
                  <LiveEventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expo-hall"
              element={
                <ProtectedRoute allowedRoles={['attendee']}>
                  <ExpoHallPage />
                </ProtectedRoute>
              }
            />

            {/* --- Organizer Routes (Now with Admin Access) --- */}
            <Route
              path="/organizer/create-event"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <CreateEventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/analytics"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <RealAnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/settings"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <OrganizerSettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/event-settings"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <EventSettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/landing-customizer"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <LandingCustomizerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/agenda-manager"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <AgendaManagerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/venue-manager"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <VenueManagerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/ticketing"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <RealTicketingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/discount-codes"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <DiscountCodesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/email-campaigns"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <RealEmailCampaignsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/attendee-management"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <RealAttendeeManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/speaker-portal"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <SpeakerPortalPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/staff-roles"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <StaffRolesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/event/:eventId/edit"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <EventEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/event/:eventId/ticketing"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <EventTicketingSetupPage />
                </ProtectedRoute>
              }
            />

            {/* --- Admin Routes --- */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminEventsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/create-event"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminCreateEventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/event-oversight"
              element={
                <ProtectedRoute requiredRole="admin">
                  <EventOversightPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/content-management"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ContentManagementPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

function NewApp() {
  console.log('NewApp component rendering');

  return (
    <AppProvider>
      <AuthProvider>
        <React.Suspense fallback={<LoadingFallback />}>
          <AppContent />
        </React.Suspense>
      </AuthProvider>
    </AppProvider>
  );
}

export default NewApp;
