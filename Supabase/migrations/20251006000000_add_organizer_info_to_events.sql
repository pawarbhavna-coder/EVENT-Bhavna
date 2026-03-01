/*
  # Add Organizer Information to Events Table

  1. Changes
    - Add organizer information columns to events table
    - These fields store organizer details entered during event creation/editing
    - Enables proper display of organizer information on event discovery and detail pages

  2. New Columns
    - `organizer_name`: Name of the organizer or organization
    - `organizer_email`: Contact email for the organizer
    - `organizer_phone`: Contact phone number (optional)
    - `organizer_bio`: Biography or description of the organizer
    - `organizer_image`: Profile image URL for the organizer
    - `organizer_company`: Company or organization name
    - `organizer_website`: Website URL for the organizer

  3. Security
    - No RLS changes needed - these are public fields for published events
    - Organizer fields are managed by event owner through existing RLS policies
*/

-- Add organizer information columns to events table
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS organizer_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS organizer_email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS organizer_phone VARCHAR(20),
  ADD COLUMN IF NOT EXISTS organizer_bio TEXT,
  ADD COLUMN IF NOT EXISTS organizer_image TEXT,
  ADD COLUMN IF NOT EXISTS organizer_company VARCHAR(100),
  ADD COLUMN IF NOT EXISTS organizer_website TEXT;

-- Create index for organizer name for faster lookups
CREATE INDEX IF NOT EXISTS idx_events_organizer_name ON events(organizer_name);
