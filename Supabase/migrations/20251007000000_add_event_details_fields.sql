/*
  # Add Event Details Fields to Events Table

  1. Changes
    - Add speakers_data JSONB column to store speaker information directly in events table
    - Add sponsors_data JSONB column to store sponsor information directly in events table
    - Add schedule_data JSONB column to store schedule information directly in events table
    - These fields complement the relational tables and provide quick access to event details

  2. New Columns
    - `speakers_data`: JSONB array containing speaker details for the event
    - `sponsors_data`: JSONB array containing sponsor details for the event
    - `schedule_data`: JSONB array containing schedule items for the event

  3. Data Structure
    - speakers_data: [{ name, title, company, bio, imageUrl }]
    - sponsors_data: [{ name, logoUrl, website, tier, description }]
    - schedule_data: [{ title, description, startTime, endTime, location }]

  4. Security
    - No RLS changes needed - these are managed through existing event ownership policies
    - Data is public for published events
*/

-- Add JSONB columns for event details
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS speakers_data JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS sponsors_data JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS schedule_data JSONB DEFAULT '[]'::jsonb;

-- Create GIN indexes for JSONB columns for efficient querying
CREATE INDEX IF NOT EXISTS idx_events_speakers_data ON events USING gin(speakers_data);
CREATE INDEX IF NOT EXISTS idx_events_sponsors_data ON events USING gin(sponsors_data);
CREATE INDEX IF NOT EXISTS idx_events_schedule_data ON events USING gin(schedule_data);

-- Add comment to document the purpose
COMMENT ON COLUMN events.speakers_data IS 'JSONB array storing speaker details: [{ name, title, company, bio, imageUrl }]';
COMMENT ON COLUMN events.sponsors_data IS 'JSONB array storing sponsor details: [{ name, logoUrl, website, tier, description }]';
COMMENT ON COLUMN events.schedule_data IS 'JSONB array storing schedule items: [{ title, description, startTime, endTime, location }]';
