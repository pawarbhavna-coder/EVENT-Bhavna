import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseConfig';
import { User, Session } from '@supabase/supabase-js';

// Define the user profile shape to match your 'profiles' database table
interface UserProfile {
  id: string;
  full_name: string; // Corrected to match your database schema
  avatar_url: string;
  role: 'attendee' | 'organizer' | 'admin';
}

// Define all the functions and state values the context will provide
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, role?: 'attendee' | 'organizer' | 'admin') => Promise<void>;
  register: (email: string, password: string, fullName: string, role: 'attendee' | 'organizer' | 'admin', company?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The provider component that will wrap your app and provide auth state
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function runs once on app startup to check for an existing session.
    const getInitialSession = async () => {
      try {
        console.log('Checking initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // A user session exists. Now, we MUST verify their profile exists.
          console.log('Session found. Fetching user profile for:', session.user.id);
          const { data: userProfile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          // **THE CRITICAL FIX IS HERE**
          // If there's an error fetching the profile OR if the profile is null,
          // the user's state is inconsistent. We must log them out to prevent a stuck loading state.
          if (profileError || !userProfile) {
            console.error('Profile not found or error fetching profile. Forcing logout.', profileError?.message);
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setProfile(null);
          } else {
            // SUCCESS! Both session and profile are valid. Set the state.
            console.log('User profile loaded successfully:', userProfile);
            setSession(session);
            setUser(session.user);
            setProfile(userProfile);
          }
        } else {
            // No user session found. Ensure all state is clear.
            setSession(null);
            setUser(null);
            setProfile(null);
        }
      } catch (error) {
        console.error('Error during initial session check:', error);
        // Ensure we clear state even on unexpected errors.
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        // This is crucial: only set loading to false AFTER all checks are complete.
        setLoading(false);
      }
    };

    getInitialSession();

    // This listener handles subsequent auth changes (login, logout).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change event:', event);

      if (event === 'SIGNED_IN' && session?.user) {
        // Use async IIFE to avoid deadlock
        (async () => {
          setLoading(true);
          const { data: userProfile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError || !userProfile) {
            console.error('Profile fetch failed on SIGNED_IN. Logging out.');
            await supabase.auth.signOut();
            setProfile(null);
            setUser(null);
            setSession(null);
          } else {
            setProfile(userProfile);
            setUser(session.user);
            setSession(session);
          }
          setLoading(false);
        })();
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setUser(null);
        setSession(null);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setSession(session);
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, role?: 'attendee' | 'organizer' | 'admin') => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string, role: 'attendee' | 'organizer' | 'admin', company?: string) => {
    try {
      console.log('Starting registration process...', { email, fullName, role });
      
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            company: company || ''
          }
        }
      });
      
      if (error) {
        console.error('Supabase signup error:', error);
        throw error;
      }
      
      console.log('Registration successful, waiting for auth state change to fetch profile...');
      
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    session,
    isAuthenticated: !!user && !!profile, // User is only truly authenticated if they have a profile
    loading,
    login,
    register,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
