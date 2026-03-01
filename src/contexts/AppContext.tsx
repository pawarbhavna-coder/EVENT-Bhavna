import React, { createContext, useContext, useState, ReactNode } from 'react';

type AppView = 
  // Public Module
  | 'home' 
  | 'event-discovery' 
  | 'speaker-directory' 
  | 'sponsor-directory'
  | 'organizer-directory'
  | 'blog' 
  | 'resources' 
  | 'press' 
  | 'about' 
  | 'pricing' 
  | 'contact'
  | 'terms'
  | 'privacy'
  | 'password-reset'
  | 'auth-callback'
  | 'auth-reset-password'
  | 'event-payment'
  | 'event-payment-success'
  // Attendee Module
  | 'attendee-dashboard'
  | 'my-events'
  | 'my-network'
  | 'notifications'
  | 'attendee-profile'
  | 'event-page'
  | 'agenda-builder'
  | 'networking-hub'
  | 'live-event'
  | 'session-room'
  | 'expo-hall'
  | 'resource-library'
  // Organizer Module
  | 'organizer-dashboard'
  | 'event-builder'
  | 'event-settings'
  | 'landing-customizer'
  | 'agenda-manager'
  | 'venue-manager'
  | 'ticketing'
  | 'discount-codes'
  | 'email-campaigns'
  | 'attendee-management'
  | 'speaker-portal'
  | 'staff-roles'
  | 'analytics'
  | 'organizer-settings'

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  breadcrumbs: string[];
  setBreadcrumbs: (breadcrumbs: string[]) => void;
  registrationData: any;
  setRegistrationData: (data: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [registrationData, setRegistrationData] = useState<any>(null);

  console.log('AppProvider state:', { currentView, selectedEventId });

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedEventId,
        setSelectedEventId,
        breadcrumbs,
        setBreadcrumbs,
        registrationData,
        setRegistrationData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
