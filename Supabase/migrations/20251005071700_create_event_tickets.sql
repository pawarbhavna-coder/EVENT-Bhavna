/*
  # Create event_tickets table

  1. New Tables
    - `event_tickets`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key to events)
      - `name` (text, ticket type name like "General Admission", "VIP", etc.)
      - `description` (text, ticket description)
      - `price` (numeric, ticket price)
      - `currency` (varchar, default 'USD')
      - `quantity` (integer, total available tickets)
      - `sold` (integer, number of tickets sold)
      - `sale_start` (timestamptz, when ticket sales start)
      - `sale_end` (timestamptz, when ticket sales end)
      - `is_active` (boolean, whether ticket is currently available)
      - `benefits` (jsonb, array of ticket benefits)
      - `restrictions` (jsonb, array of ticket restrictions)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `event_tickets` table
    - Add policy for public to read tickets for published events
    - Add policy for organizers to manage their event tickets

  3. Indexes
    - Add index on event_id for faster lookups
    - Add index on is_active for filtering active tickets
*/

-- Create event_tickets table
CREATE TABLE IF NOT EXISTS event_tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  quantity INTEGER NOT NULL DEFAULT 0,
  sold INTEGER NOT NULL DEFAULT 0,
  sale_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  sale_end TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  benefits JSONB DEFAULT '[]'::jsonb,
  restrictions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT fk_event_tickets_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT check_sold_quantity CHECK (sold <= quantity),
  CONSTRAINT check_positive_price CHECK (price >= 0),
  CONSTRAINT check_positive_quantity CHECK (quantity >= 0),
  CONSTRAINT check_positive_sold CHECK (sold >= 0)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_event_tickets_event_id ON event_tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_event_tickets_is_active ON event_tickets(is_active);
CREATE INDEX IF NOT EXISTS idx_event_tickets_sale_dates ON event_tickets(sale_start, sale_end);

-- Enable RLS
ALTER TABLE event_tickets ENABLE ROW LEVEL SECURITY;

-- Policy for public to read tickets for published events
CREATE POLICY "Public can view tickets for published events"
  ON event_tickets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_tickets.event_id
      AND events.status = 'published'
    )
  );

-- Policy for organizers to read their own event tickets
CREATE POLICY "Organizers can view own event tickets"
  ON event_tickets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_tickets.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Policy for organizers to insert tickets
CREATE POLICY "Organizers can create event tickets"
  ON event_tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_tickets.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Policy for organizers to update their event tickets
CREATE POLICY "Organizers can update own event tickets"
  ON event_tickets
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_tickets.event_id
      AND events.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_tickets.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Policy for organizers to delete their event tickets
CREATE POLICY "Organizers can delete own event tickets"
  ON event_tickets
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_tickets.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_event_tickets_updated_at
  BEFORE UPDATE ON event_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
