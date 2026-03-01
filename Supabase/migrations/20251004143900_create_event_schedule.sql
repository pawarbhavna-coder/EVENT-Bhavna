/*
  # Create event_schedule table

  1. New Tables
    - `event_schedule`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key to events)
      - `title` (text, session title)
      - `description` (text, session description)
      - `start_time` (time, session start time)
      - `end_time` (time, session end time)
      - `speaker_id` (uuid, optional foreign key to speakers)
      - `location` (text, room/venue within the event)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `event_schedule` table
    - Add policy for public to read schedule for published events
    - Add policy for organizers to manage their event schedules

  3. Indexes
    - Add index on event_id for faster lookups
    - Add index on start_time for ordering
*/

-- Create event_schedule table
CREATE TABLE IF NOT EXISTS event_schedule (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  speaker_id UUID,
  location VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT fk_event_schedule_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_event_schedule_speaker FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_event_schedule_event_id ON event_schedule(event_id);
CREATE INDEX IF NOT EXISTS idx_event_schedule_start_time ON event_schedule(start_time);

-- Enable RLS
ALTER TABLE event_schedule ENABLE ROW LEVEL SECURITY;

-- Policy for public to read schedule for published events
CREATE POLICY "Public can view schedules for published events"
  ON event_schedule
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_schedule.event_id
      AND events.status = 'published'
    )
  );

-- Policy for organizers to read their own event schedules
CREATE POLICY "Organizers can view own event schedules"
  ON event_schedule
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_schedule.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Policy for organizers to insert schedule items
CREATE POLICY "Organizers can create event schedules"
  ON event_schedule
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_schedule.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Policy for organizers to update their event schedules
CREATE POLICY "Organizers can update own event schedules"
  ON event_schedule
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_schedule.event_id
      AND events.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_schedule.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Policy for organizers to delete their event schedules
CREATE POLICY "Organizers can delete own event schedules"
  ON event_schedule
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_schedule.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_event_schedule_updated_at
  BEFORE UPDATE ON event_schedule
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
