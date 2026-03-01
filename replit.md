# EventEase - Event Management Platform

## Project Overview
EventEase is a comprehensive event management platform built with React, TypeScript, Vite, and Supabase. The application allows users to discover events, manage attendees, and organize conferences with features for organizers, attendees, speakers, and administrators.

## Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase (Auth + PostgreSQL)
- **Icons**: Lucide React

## Project Structure
- `/src` - Main application source code
  - `/components` - React components organized by feature
    - `/admin` - Admin dashboard components
    - `/attendee` - Attendee-specific features
    - `/organizer` - Event organizer tools
    - `/auth` - Authentication components
    - `/layout` - Navigation and layout components
    - `/pages` - Public pages
  - `/contexts` - React context providers
  - `/lib` - Utility libraries and configurations
  - `/services` - API service layers
  - `/types` - TypeScript type definitions
  - `/styles` - Global styles and CSS modules

## Environment Configuration
The application uses environment variables for Supabase configuration. These are stored in `.env` file (not committed to git) and should be configured in Replit Secrets for production.

Required environment variables:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Development Setup
1. Dependencies are auto-installed
2. Development server runs on port 5000
3. Vite is configured to accept connections from all hosts (required for Replit proxy)

## Deployment Configuration
- **Type**: Autoscale (stateless frontend)
- **Build**: `npm run build`
- **Run**: `npm run preview`

## Key Features
- Multi-role authentication (Attendee, Organizer, Sponsor, Admin)
- Event discovery and registration
- Organizer dashboard with analytics
- Speaker directory
- Blog system
- Payment processing integration
- Real-time updates via Supabase

## User Roles
1. **Attendee**: Browse and register for events, manage personal schedule
2. **Organizer**: Create and manage events, view analytics, manage speakers
3. **Admin**: Full system access, user management, content moderation
4. **Sponsor**: Virtual booth management, lead capture

## Recent Changes
- **September 30, 2025**: Successfully imported GitHub project to Replit environment
  - Installed all npm dependencies (React, Vite, Supabase, etc.)
  - Configured Vite to allow all hosts with `allowedHosts: true` (required for Replit proxy)
  - Set up environment variables (.env file) with Supabase credentials
  - Updated preview script to bind to 0.0.0.0:5000 for deployment
  - Configured autoscale deployment with build and preview scripts
  - Verified application runs successfully on port 5000
- Migrated Supabase credentials from hardcoded values to environment variables (security improvement)
- Configured Vite to bind to 0.0.0.0:5000 for Replit compatibility
- Fixed TypeScript configuration for proper JSX support

## Notes
- The app uses Supabase for both authentication and database
- Row-level security (RLS) policies protect user data
- Email verification is required for new accounts
