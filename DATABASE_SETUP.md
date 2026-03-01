# Database Setup Guide

This guide will help you set up the EventEase database using Supabase.

## Prerequisites

- Supabase account and project
- Node.js installed
- Access to your Supabase project dashboard

## Database Configuration

The database is configured to use the following Supabase project:
- **URL**: `https://vjdsijuyzhhlofmlzexe.supabase.co`
- **Key**: `sb_publishable_GWjtMLOizuTEiRMn9Kn3eg_blxgSnB2`

## Manual Database Setup

### Step 1: Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/vjdsijuyzhhlofmlzexe)
2. Navigate to the SQL Editor

### Step 2: Execute Migration Files

Execute the following SQL files in order:

1. **001_initial_schema.sql** - Creates the main database tables
2. **002_sample_data.sql** - Inserts sample data for testing
3. **003_user_tables.sql** - Creates user-related tables (for future auth)

### Step 3: Verify Database Setup

Run the test script to verify everything is working:

```bash
node test-database.js
```

## Database Schema

### Core Tables

#### Events
- `events` - Main events table with all event information
- `event_speakers` - Junction table linking events to speakers
- `event_sponsors` - Junction table linking events to sponsors

#### Content
- `blog_posts` - Blog articles and content
- `speakers` - Speaker information and profiles
- `sponsors` - Sponsor information and logos
- `categories` - Event categories and classifications

#### User Tables (Future Auth)
- `user_profiles` - Extended user profiles
- `user_roles` - User role assignments
- `event_attendees` - Event registration and attendance
- `event_favorites` - User's favorite events
- `event_reviews` - User reviews and ratings
- `notifications` - User notifications
- `user_sessions` - User session tracking

## Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://vjdsijuyzhhlofmlzexe.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_GWjtMLOizuTEiRMn9Kn3eg_blxgSnB2
```

## Services Updated

The following services have been updated to use the real database:

1. **eventService.ts** - Event CRUD operations
2. **blogService.ts** - Blog article management
3. **speakerService.ts** - Speaker directory
4. **publicEventService.ts** - Public event viewing (NEW)

## Testing the Database

### Test Connection
```bash
node test-database.js
```

### Test in Application
1. Start the development server: `npm run dev`
2. Navigate to different pages to test database connectivity
3. Check browser console for any database errors

## Database Features

### Public Pages (No Auth Required)
- View all published events
- Browse event categories
- Search events
- View speaker directory
- Read blog articles
- View event details

### User Pages (Future Auth Implementation)
- Create and manage events
- Register for events
- Manage favorites
- Write reviews
- Receive notifications

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Verify Supabase URL and key are correct
   - Check if the database tables exist
   - Ensure RLS policies are properly configured

2. **Data Not Loading**
   - Check if sample data was inserted
   - Verify table relationships are correct
   - Check browser console for errors

3. **Permission Errors**
   - Ensure RLS policies allow public access to published content
   - Check if user tables are properly configured

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify the database setup in Supabase dashboard
3. Test individual services using the test script
4. Check the Supabase logs for detailed error information

## Next Steps

After setting up the database:
1. Test all public pages to ensure data loads correctly
2. Implement authentication when ready
3. Add more sample data as needed
4. Configure additional RLS policies for user-specific data



