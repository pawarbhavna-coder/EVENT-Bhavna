# Event Management System - Wireframe Documentation

## Overview
This document outlines the comprehensive wireframe specifications, user flows, and UI requirements for the event creation and editing system.

## User Flow Diagram

```
[Event Edit Page] → [Ticket Pricing Page] → [Publish Success Page]
       ↓                    ↓                       ↓
   Save Draft         Configure Tickets        Event Goes Live
       ↓                    ↓                       ↓
   My Events Page     Validation & Preview    Discover Events Page
```

## Page 1: Event Edit Page

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Header: [Back Button] Event Title [Save Draft] [Next Button]│
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────────────────────────────────┐ │
│ │ Navigation  │ │ Main Content Area                       │ │
│ │ Sidebar     │ │                                         │ │
│ │             │ │ [Active Section Content]                │ │
│ │ • Basic     │ │                                         │ │
│ │ • Date/Time │ │                                         │ │
│ │ • Location  │ │                                         │ │
│ │ • Media     │ │                                         │ │
│ │ • Speakers  │ │                                         │ │
│ │ • Sponsors  │ │                                         │ │
│ │ • Organizer │ │                                         │ │
│ │             │ │                                         │ │
│ │ [Progress]  │ │                                         │ │
│ └─────────────┘ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Section Specifications

#### 1. Basic Information Section
**Required Fields:**
- Event Title (text input, max 100 chars)
- Short Description (textarea, 2-3 sentences)
- About This Event (rich textarea, detailed description)
- Event Category (dropdown)
- Maximum Capacity (number input, min 1)

**Validation Rules:**
- Title: Required, 5-100 characters
- Description: Required, 10-300 characters
- About Event: Required, 50-2000 characters
- Capacity: Required, positive integer

#### 2. Date & Time Section
**Required Fields:**
- Event Date (date picker, future dates only)
- Start Time (time picker)
- End Time (time picker, must be after start time)
- Timezone (dropdown with major timezones)

**Validation Rules:**
- Date: Must be in the future
- Start Time: Required
- End Time: Must be after start time
- Timezone: Required selection

#### 3. Location Section
**Event Type Selection:**
- Radio buttons: Physical Event / Virtual Event

**Physical Event Fields:**
- Venue Name (required)
- Street Address
- City, State, Country
- Venue capacity validation

**Virtual Event Fields:**
- Virtual Event Link (required, URL validation)
- Platform type (Zoom, Teams, etc.)

#### 4. Media Section
**Event Image:**
- File upload component
- Drag & drop functionality
- Image preview
- Size limit: 5MB
- Formats: PNG, JPG, GIF
- Recommended dimensions: 1920x1080

**Gallery Images (Optional):**
- Multiple image upload
- Thumbnail previews
- Reorder functionality

#### 5. Speakers Section
**Dynamic Speaker List:**
- Add/Remove speakers
- Speaker form fields:
  - Name (required)
  - Title/Position
  - Company
  - Bio (textarea)
  - Profile Image URL
  - Email
  - Social links (LinkedIn, Twitter, Website)

**Speaker Card Preview:**
- Shows speaker info as it will appear to attendees
- Edit/Delete actions

#### 6. Sponsors Section
**Dynamic Sponsor List:**
- Add/Remove sponsors
- Sponsor form fields:
  - Company Name (required)
  - Logo URL (required)
  - Sponsorship Tier (Platinum/Gold/Silver/Bronze)
  - Website URL
  - Description

**Tier-based Styling:**
- Different visual treatments for each tier
- Preview of sponsor display

#### 7. Organizer Information Section
**Organizer Details:**
- Name (required, pre-filled from user profile)
- Contact Email (required, pre-filled)
- Phone Number
- Company/Organization
- Bio (textarea)
- Profile Image URL
- Website

### Navigation & Progress
**Sidebar Navigation:**
- Section-based navigation
- Visual indicators for completed sections
- Progress bar showing completion percentage
- Sticky positioning

**Validation & Error Handling:**
- Real-time validation
- Error messages below fields
- Error summary at bottom
- Scroll to first error on submit
- Success indicators for completed sections

### Responsive Design
**Desktop (1024px+):**
- Sidebar + main content layout
- Full form fields visible
- Hover states and animations

**Tablet (768px-1023px):**
- Collapsible sidebar
- Adjusted spacing
- Touch-friendly buttons

**Mobile (< 768px):**
- Full-width layout
- Bottom navigation for sections
- Simplified forms
- Touch-optimized inputs

## Page 2: Ticket Pricing Page

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Header: [Back] Ticket Pricing [Save] [Preview] [Publish]    │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────┐ ┌─────────────────────────┐ │
│ │ Main Content                │ │ Sidebar                 │ │
│ │                             │ │                         │ │
│ │ Pricing Settings            │ │ Pricing Summary         │ │
│ │ ┌─────────────────────────┐ │ │ • Total Tickets         │ │
│ │ │ Currency | Tax | Fees   │ │ │ • Potential Revenue     │ │
│ │ └─────────────────────────┘ │ │ • Price Range           │ │
│ │                             │ │                         │ │
│ │ Ticket Types                │ │ Ticket Preview          │ │
│ │ ┌─────────────────────────┐ │ │ [Live Preview Cards]    │ │
│ │ │ [Add Ticket Type]       │ │ │                         │ │
│ │ │                         │ │ │ Publish Section         │ │
│ │ │ Ticket 1: Early Bird    │ │ │ [Validation Status]     │ │
│ │ │ • Name, Price, Qty      │ │ │ [Publish Button]        │ │
│ │ │ • Sale Period           │ │ │                         │ │
│ │ │ • Benefits/Restrictions │ │ │                         │ │
│ │ │                         │ │ │                         │ │
│ │ │ Ticket 2: Regular       │ │ │                         │ │
│ │ │ [Same fields]           │ │ │                         │ │
│ │ └─────────────────────────┘ │ │                         │ │
│ │                             │ │                         │ │
│ │ Refund Policy               │ │                         │ │
│ └─────────────────────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Ticket Type Configuration

#### Ticket Form Fields
**Basic Information:**
- Ticket Name (required, e.g., "Early Bird", "VIP", "Student")
- Description (what's included)
- Price (number input with currency symbol)
- Quantity Available (number input)
- Active/Inactive toggle

**Sale Period:**
- Sale Start Date/Time (datetime picker)
- Sale End Date/Time (datetime picker)
- Validation: End must be after start

**Benefits & Restrictions:**
- Dynamic list of benefits (add/remove)
- Dynamic list of restrictions (add/remove)
- Visual indicators (checkmarks for benefits, warning icons for restrictions)

#### Advanced Pricing Options
**Discount Configuration:**
- Early Bird Discount (percentage)
- Group Discount (threshold and percentage)
- Promo Code Integration
- Dynamic pricing based on demand

**Pricing Tiers:**
- Multiple price points
- Tier-based benefits
- Upgrade/downgrade options

### Validation Rules

#### Ticket Validation
- At least one ticket type required
- Ticket names must be unique
- Prices cannot be negative
- Quantities must be positive integers
- Sale periods must be logical (start < end)
- Total tickets cannot exceed venue capacity

#### Business Logic Validation
- Free events can have $0 tickets
- Paid events must have at least one paid ticket
- Sale periods cannot overlap inappropriately
- Capacity limits respected

### Error Handling
**Field-Level Errors:**
- Inline validation messages
- Red border indicators
- Icon-based error states

**Form-Level Errors:**
- Error summary panel
- Scroll to first error
- Prevent submission until resolved

**Success States:**
- Green checkmarks for valid sections
- Progress indicators
- Ready-to-publish confirmation

## Page 3: Event Publish Success Page

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                    Success Header                           │
│              [Checkmark Icon]                               │
│           "Event Published Successfully!"                   │
│              Event URL with Copy Button                     │
├─────────────────────────────────────────────────────────────┤
│                 What Happens Next                           │
│              [Step-by-step process]                         │
├─────────────────────────────────────────────────────────────┤
│                   Next Steps Grid                           │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│ │ View Event  │ │ Share Event │ │ Analytics   │ │ Manage  │ │
│ │ [Button]    │ │ [Button]    │ │ [Button]    │ │ [Button]│ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│                  Quick Actions                              │
│        [View All Events] [Create Another] [Dashboard]       │
└─────────────────────────────────────────────────────────────┘
```

### Success Page Features

#### Immediate Actions
- Copy event URL to clipboard
- Share via native share API
- Open event in new tab
- Social media sharing buttons

#### Next Steps Cards
1. **View Your Event**
   - Navigate to public event page
   - See attendee perspective
   - Verify all information

2. **Share Your Event**
   - Social media integration
   - Email sharing
   - Direct link sharing

3. **Track Performance**
   - Analytics dashboard
   - Registration metrics
   - Engagement tracking

4. **Manage Attendees**
   - Registration management
   - Check-in system
   - Communication tools

## Integration Points

### Database Schema Requirements

#### Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  about_event TEXT NOT NULL,
  category TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  timezone TEXT DEFAULT 'UTC',
  venue TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  is_virtual BOOLEAN DEFAULT false,
  virtual_link TEXT,
  event_image TEXT,
  gallery_images TEXT[],
  capacity INTEGER NOT NULL,
  visibility TEXT DEFAULT 'public',
  require_approval BOOLEAN DEFAULT false,
  allow_waitlist BOOLEAN DEFAULT true,
  organizer_name TEXT NOT NULL,
  organizer_email TEXT NOT NULL,
  organizer_phone TEXT,
  organizer_bio TEXT,
  organizer_image TEXT,
  organizer_company TEXT,
  organizer_website TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### Speakers Table
```sql
CREATE TABLE event_speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  bio TEXT,
  image TEXT,
  email TEXT,
  linkedin TEXT,
  twitter TEXT,
  website TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### Sponsors Table
```sql
CREATE TABLE event_sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('platinum', 'gold', 'silver', 'bronze')),
  website TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### Ticket Types Table
```sql
CREATE TABLE ticket_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  quantity INTEGER NOT NULL,
  sold INTEGER DEFAULT 0,
  sale_start TIMESTAMPTZ NOT NULL,
  sale_end TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  benefits TEXT[],
  restrictions TEXT[],
  early_bird_discount DECIMAL(5,2),
  group_discount_threshold INTEGER,
  group_discount_percent DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### API Endpoints

#### Event Management
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `GET /api/events/:id` - Get event details
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/publish` - Publish event

#### Ticket Management
- `POST /api/events/:id/tickets` - Create ticket type
- `PUT /api/tickets/:id` - Update ticket type
- `DELETE /api/tickets/:id` - Delete ticket type
- `GET /api/events/:id/tickets` - Get event tickets

#### Media Management
- `POST /api/upload/image` - Upload event images
- `DELETE /api/upload/image/:id` - Delete uploaded image

## UI Component Specifications

### Form Components

#### Input Field Component
```typescript
interface InputFieldProps {
  label: string;
  name: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'number';
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  maxLength?: number;
  min?: number;
  max?: number;
}
```

#### Textarea Component
```typescript
interface TextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
}
```

#### File Upload Component
```typescript
interface FileUploadProps {
  label: string;
  accept: string;
  maxSize: number; // in bytes
  onUpload: (file: File) => void;
  preview?: string;
  error?: string;
  multiple?: boolean;
}
```

### Dynamic List Components

#### Speaker Manager Component
```typescript
interface SpeakerManagerProps {
  speakers: Speaker[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof Speaker, value: string) => void;
  onRemove: (index: number) => void;
  errors?: Record<string, string>;
}
```

#### Sponsor Manager Component
```typescript
interface SponsorManagerProps {
  sponsors: Sponsor[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof Sponsor, value: string) => void;
  onRemove: (index: number) => void;
  errors?: Record<string, string>;
}
```

### Ticket Pricing Components

#### Ticket Type Card
```typescript
interface TicketTypeCardProps {
  ticket: TicketType;
  index: number;
  onUpdate: (field: keyof TicketType, value: any) => void;
  onRemove: () => void;
  errors?: Record<string, string>;
  currency: string;
}
```

#### Pricing Summary
```typescript
interface PricingSummaryProps {
  ticketTypes: TicketType[];
  currency: string;
  taxRate: number;
  processingFee: number;
}
```

## Validation & Error Handling

### Client-Side Validation

#### Real-time Validation
- Field validation on blur
- Form validation on submit
- Cross-field validation (e.g., end time after start time)
- File size and type validation

#### Error Display Patterns
- Inline errors below fields
- Error summary panel
- Visual error indicators (red borders, icons)
- Success indicators (green checkmarks)

### Server-Side Validation
- Duplicate validation (event titles, speaker emails)
- Business rule validation (capacity limits, date constraints)
- Security validation (XSS prevention, file type verification)
- Data integrity checks

## Accessibility Requirements

### Keyboard Navigation
- Tab order follows logical flow
- All interactive elements keyboard accessible
- Skip links for screen readers
- Focus indicators clearly visible

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and descriptions
- Form field associations
- Error announcements
- Progress announcements

### Visual Accessibility
- High contrast mode support
- Minimum 4.5:1 color contrast ratio
- Scalable text (up to 200%)
- Clear focus indicators
- Alternative text for images

## Performance Considerations

### Loading States
- Skeleton loading for forms
- Progressive loading of sections
- Image lazy loading
- Optimistic updates

### Data Management
- Auto-save drafts every 30 seconds
- Debounced validation
- Efficient re-renders
- Memory management for large forms

### Network Optimization
- Image compression
- Chunked uploads for large files
- Request batching
- Offline support for drafts

## Security Considerations

### Data Protection
- Input sanitization
- XSS prevention
- CSRF protection
- File upload security

### Access Control
- User authentication required
- Organizer role verification
- Event ownership validation
- Rate limiting on API calls

## Testing Requirements

### Unit Tests
- Form validation logic
- Component rendering
- User interaction handling
- Error state management

### Integration Tests
- End-to-end event creation flow
- API integration
- File upload functionality
- Navigation between pages

### Accessibility Tests
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation
- Focus management

## Browser Support

### Minimum Requirements
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Progressive Enhancement
- Core functionality without JavaScript
- Enhanced experience with modern features
- Graceful degradation for older browsers

## Deployment Considerations

### Environment Configuration
- API endpoint configuration
- File upload service setup
- CDN configuration for images
- Analytics integration

### Monitoring & Analytics
- Error tracking (Sentry)
- Performance monitoring
- User behavior analytics
- Conversion tracking

This comprehensive wireframe documentation provides the foundation for implementing a robust, user-friendly event management system that meets all specified requirements while ensuring excellent user experience across all devices and use cases.