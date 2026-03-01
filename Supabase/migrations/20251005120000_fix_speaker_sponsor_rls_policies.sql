/*
  # Fix RLS Policies for event_speakers and event_sponsors tables

  1. Problem
    - Organizers get permission denied (42501) errors when fetching speakers and sponsors
    - The current policies only allow public read access
    - Organizers need to manage (INSERT, UPDATE, DELETE) their event speakers and sponsors

  2. Changes
    - Add policies for organizers to manage speakers and sponsors for their events
    - Allow organizers to INSERT, UPDATE, DELETE event_speakers records
    - Allow organizers to INSERT, UPDATE, DELETE event_sponsors records
    - Maintain existing public read access for published events

  3. Security
    - Organizers can only manage speakers/sponsors for events they own
    - Public users can still view speakers/sponsors for published events
*/

-- Add organizer policies for event_speakers
CREATE POLICY IF NOT EXISTS "Organizers can manage event speakers"
  ON event_speakers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_speakers.event_id
      AND events.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_speakers.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Add organizer policies for event_sponsors
CREATE POLICY IF NOT EXISTS "Organizers can manage event sponsors"
  ON event_sponsors
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_sponsors.event_id
      AND events.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_sponsors.event_id
      AND events.organizer_id = auth.uid()
    )
  );
