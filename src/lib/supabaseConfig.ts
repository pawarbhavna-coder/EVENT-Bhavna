// Supabase configuration
import { createClient } from '@supabase/supabase-js'

// Hardcoded credentials — works locally and on Vercel without any .env file.
// Env vars override these if set (useful for CI / other deployments).
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://lalosqcsffemgqstgcwo.supabase.co'

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhbG9zcWNzZmZlbWdxc3RnY3dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNzc4ODYsImV4cCI6MjA4Nzk1Mzg4Nn0.Z-SiUJ4YwzkvgY2IhCHum9MmM-yYHCoiA2mJakck5cQ'

// Create Supabase client with environment variables
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
    debug: false
  }
})

// Log configuration for debugging
console.log('Supabase Configuration:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'Missing');

// Database types (will be updated as we create tables)
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string
          bio?: string
          company?: string
          job_title?: string
          phone?: string
          website?: string
          location?: string
          timezone: string
          preferences: any
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string
          bio?: string
          company?: string
          job_title?: string
          phone?: string
          website?: string
          location?: string
          timezone?: string
          preferences?: any
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string
          bio?: string
          company?: string
          job_title?: string
          phone?: string
          website?: string
          location?: string
          timezone?: string
          preferences?: any
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          start_date: string
          end_date: string
          location: string
          category: string
          status: 'draft' | 'published' | 'cancelled'
          created_at: string
          updated_at: string
          organizer_id?: string
          max_attendees?: number
          price: number
          image_url?: string
          venue_name?: string
          venue_address?: string
          is_online: boolean
          online_link?: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          start_date: string
          end_date: string
          location: string
          category: string
          status?: 'draft' | 'published' | 'cancelled'
          created_at?: string
          updated_at?: string
          organizer_id?: string
          max_attendees?: number
          price: number
          image_url?: string
          venue_name?: string
          venue_address?: string
          is_online?: boolean
          online_link?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          start_date?: string
          end_date?: string
          location?: string
          category?: string
          status?: 'draft' | 'published' | 'cancelled'
          created_at?: string
          updated_at?: string
          organizer_id?: string
          max_attendees?: number
          price?: number
          image_url?: string
          venue_name?: string
          venue_address?: string
          is_online?: boolean
          online_link?: string
        }
      }
      speakers: {
        Row: {
          id: string
          name: string
          bio: string
          title: string
          company: string
          image_url?: string
          social_linkedin?: string
          social_twitter?: string
          social_website?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          bio: string
          title: string
          company: string
          image_url?: string
          social_linkedin?: string
          social_twitter?: string
          social_website?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          bio?: string
          title?: string
          company?: string
          image_url?: string
          social_linkedin?: string
          social_twitter?: string
          social_website?: string
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string
          author: string
          published_at: string
          created_at: string
          updated_at: string
          image_url?: string
          slug: string
          status: 'draft' | 'published'
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt: string
          author: string
          published_at?: string
          created_at?: string
          updated_at?: string
          image_url?: string
          slug: string
          status?: 'draft' | 'published'
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string
          author?: string
          published_at?: string
          created_at?: string
          updated_at?: string
          image_url?: string
          slug?: string
          status?: 'draft' | 'published'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Export the typed client
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

export default supabase