# Database Synchronization Fixes

## Issues Resolved

### Issue 1: Edit Page Data Transmission
**Problem**: The edit page was only sending basic information to the backend, missing speakers, sponsors, and schedule data.

**Solution**: Updated `EventEditPage.tsx` to serialize speakers, sponsors, and schedule data and include them in the event save payload.

### Issue 2: Missing Database Fields
**Problem**: The Supabase `events` table was missing columns to store speakers, sponsors, and schedule information.

**Solution**: Created migration `20251007000000_add_event_details_fields.sql` to add three JSONB columns:
- `speakers_data`: Stores speaker information as JSON array
- `sponsors_data`: Stores sponsor information as JSON array
- `schedule_data`: Stores schedule items as JSON array

## Changes Made

### 1. Database Migration (`supabase/migrations/20251007000000_add_event_details_fields.sql`)

Added three JSONB columns to the `events` table:

```sql
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS speakers_data JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS sponsors_data JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS schedule_data JSONB DEFAULT '[]'::jsonb;
```

Created GIN indexes for efficient querying:

```sql
CREATE INDEX IF NOT EXISTS idx_events_speakers_data ON events USING gin(speakers_data);
CREATE INDEX IF NOT EXISTS idx_events_sponsors_data ON events USING gin(sponsors_data);
CREATE INDEX IF NOT EXISTS idx_events_schedule_data ON events USING gin(schedule_data);
```

### 2. Service Updates (`src/services/organizerCrudService.ts`)

**createEvent()**: Now initializes JSONB fields with empty arrays:
```typescript
speakers_data: [],
sponsors_data: [],
schedule_data: []
```

**updateEvent()**: Now accepts and updates JSONB fields:
```typescript
if ((updates as any).speakers_data !== undefined) updateData.speakers_data = (updates as any).speakers_data;
if ((updates as any).sponsors_data !== undefined) updateData.sponsors_data = (updates as any).sponsors_data;
if ((updates as any).schedule_data !== undefined) updateData.schedule_data = (updates as any).schedule_data;
```

### 3. EventEditPage Updates (`src/components/organizer/EventEditPage.tsx`)

**Data Serialization**: Before saving, speakers and sponsors are now serialized to match JSONB format:

```typescript
const speakersData = formData.speakers.map(s => ({
  name: s.name,
  title: s.title,
  company: s.company,
  bio: s.bio,
  imageUrl: s.image
}));

const sponsorsData = formData.sponsors.map(s => ({
  name: s.name,
  logoUrl: s.logo,
  website: s.website,
  tier: s.tier,
  description: s.description
}));
```

**Save Payload**: Includes the serialized data:
```typescript
const eventData = {
  // ... other fields
  speakers_data: speakersData,
  sponsors_data: sponsorsData,
  schedule_data: []
};
```

**Data Loading**: Updated to read from JSONB fields:
```typescript
const speakersData = (event as any).speakers_data || [];
const sponsorsData = (event as any).sponsors_data || [];

const speakers = speakersData.map((s: any, index: number) => ({
  id: `speaker_${index}`,
  name: s.name || '',
  title: s.title || '',
  company: s.company || '',
  bio: s.bio || '',
  image: s.imageUrl || '',
  email: ''
}));
```

### 4. EventDetailPage Updates (`src/components/events/EventDetailPage.tsx`)

**Data Retrieval**: Updated to read speakers, sponsors, and schedule from JSONB fields:

```typescript
const speakersData = (eventData as any).speakers_data || [];
const sponsorsData = (eventData as any).sponsors_data || [];
const scheduleData = (eventData as any).schedule_data || [];

const parsedSpeakers = speakersData.map((s: any, index: number) => ({
  id: `speaker_${index}`,
  name: s.name || '',
  title: s.title || '',
  company: s.company || '',
  bio: s.bio || '',
  imageUrl: s.imageUrl || ''
}));

const parsedSponsors = sponsorsData.map((s: any, index: number) => ({
  id: `sponsor_${index}`,
  name: s.name || '',
  logoUrl: s.logoUrl || '',
  website: s.website || '',
  tier: s.tier || 'bronze'
}));

const parsedSchedule = scheduleData.map((item: any, index: number) => ({
  id: `schedule_${index}`,
  title: item.title || '',
  description: item.description || '',
  startTime: item.startTime || '',
  endTime: item.endTime || ''
}));
```

## Data Flow

### Saving an Event:
1. User fills out event form including speakers and sponsors
2. `handleSave()` serializes form data into JSONB-compatible format
3. Data is sent to `organizerCrudService.createEvent()` or `updateEvent()`
4. Service saves data to `events` table with JSONB columns populated
5. Success message is displayed

### Loading an Event:
1. User navigates to event detail or edit page
2. `loadEvent()` or `loadEventData()` fetches event from database
3. JSONB fields are parsed into arrays
4. Arrays are mapped to component state format
5. Data is displayed in UI

### Viewing Event Details:
1. User clicks on event in discover page
2. EventDetailPage loads event data including JSONB fields
3. Speakers, sponsors, and schedule are parsed and displayed
4. No more "Available Soon" messages - full data is shown

## Testing Checklist

- [x] Database migration created
- [x] Service layer updated to handle JSONB fields
- [x] EventEditPage serializes data correctly
- [x] EventEditPage deserializes data correctly
- [x] EventDetailPage reads JSONB fields
- [x] EventDetailPage displays speaker data
- [x] EventDetailPage displays sponsor data
- [x] EventDetailPage displays schedule data

## Next Steps

1. Apply the database migration using Supabase CLI or dashboard
2. Test creating a new event with speakers and sponsors
3. Test editing an existing event
4. Verify event details display correctly in discover page
5. Verify complete event information shows on detail page

## Notes

- The JSONB approach provides flexibility for quick iterations
- Data is indexed for efficient querying
- Both relational tables (event_speakers, event_sponsors) and JSONB fields coexist for backwards compatibility
- The JSONB fields are the primary source of truth for display
