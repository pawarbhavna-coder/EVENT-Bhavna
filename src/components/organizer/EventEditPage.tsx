import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Calendar, MapPin, Users, Clock, 
  Upload, X, Plus, Trash2, User, Building, Mail,
  Globe, Image as ImageIcon, Type, FileText, Star,
  AlertTriangle, CheckCircle, Loader2
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';

interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  image: string;
  email: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  website: string;
  description: string;
}

interface EventFormData {
  // Basic Information
  title: string;
  description: string;
  aboutEvent: string;
  category: string;
  
  // Date & Time
  eventDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  
  // Location
  venue: string;
  address: string;
  city: string;
  state: string;
  country: string;
  isVirtual: boolean;
  virtualLink?: string;
  
  // Media
  eventImage: string;
  galleryImages: string[];
  
  // People
  speakers: Speaker[];
  sponsors: Sponsor[];
  
  // Organizer
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  organizerBio: string;
  organizerImage: string;
  organizerCompany: string;
  organizerWebsite: string;
  
  // Settings
  capacity: number;
  visibility: 'public' | 'private' | 'unlisted';
  requireApproval: boolean;
  allowWaitlist: boolean;
}

const EventEditPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { setBreadcrumbs } = useApp();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    aboutEvent: '',
    category: 'conference',
    eventDate: '',
    startTime: '',
    endTime: '',
    timezone: 'UTC',
    venue: '',
    address: '',
    city: '',
    state: '',
    country: '',
    isVirtual: false,
    virtualLink: '',
    eventImage: '',
    galleryImages: [],
    speakers: [],
    sponsors: [],
    organizerName: user?.name || '',
    organizerEmail: user?.email || '',
    organizerPhone: '',
    organizerBio: '',
    organizerImage: '',
    organizerCompany: '',
    organizerWebsite: '',
    capacity: 100,
    visibility: 'public',
    requireApproval: false,
    allowWaitlist: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  React.useEffect(() => {
    setBreadcrumbs(['Event Management', eventId ? 'Edit Event' : 'Create Event']);
    
    if (eventId) {
      loadEventData();
    }
  }, [setBreadcrumbs, eventId]);

  const loadEventData = async () => {
    setIsLoading(true);
    try {
      const { organizerCrudService } = await import('../../services/organizerCrudService');

      const eventResult = await organizerCrudService.getEventById(eventId!);

      if (!eventResult.success || !eventResult.event) {
        throw new Error(eventResult.error || 'Failed to load event');
      }

      const event = eventResult.event;

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

      const sponsors = sponsorsData.map((s: any, index: number) => ({
        id: `sponsor_${index}`,
        name: s.name || '',
        logo: s.logoUrl || '',
        tier: s.tier as 'platinum' | 'gold' | 'silver' | 'bronze',
        website: s.website || '',
        description: s.description || ''
      }));

      setFormData(prev => ({
        ...prev,
        title: event.title,
        description: event.description || '',
        aboutEvent: event.description || '',
        category: event.category,
        eventDate: event.event_date,
        startTime: event.time,
        endTime: event.end_time || '',
        venue: event.venue,
        capacity: event.capacity,
        eventImage: event.image_url || '',
        visibility: event.visibility,
        speakers,
        sponsors,
        organizerName: event.organizer_name || prev.organizerName,
        organizerEmail: event.organizer_email || prev.organizerEmail,
        organizerPhone: event.organizer_phone || '',
        organizerBio: event.organizer_bio || '',
        organizerImage: event.organizer_image || '',
        organizerCompany: event.organizer_company || '',
        organizerWebsite: event.organizer_website || ''
      }));

      setImagePreview(event.image_url || '');
    } catch (error) {
      console.error('Failed to load event data:', error);
      alert('Failed to load event data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ eventImage: 'Image size must be less than 5MB' });
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ eventImage: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image' });
        return;
      }
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        handleInputChange('eventImage', result); // Store preview for immediate UI feedback
      };
      reader.readAsDataURL(file);
      
      // Store the file for backend processing
      setSelectedImage(file);
      setErrors(prev => ({ ...prev, eventImage: '' }));
    }
  };

  const addSpeaker = () => {
    const newSpeaker: Speaker = {
      id: `speaker_${Date.now()}`,
      name: '',
      title: '',
      company: '',
      bio: '',
      image: '',
      email: ''
    };
    handleInputChange('speakers', [...formData.speakers, newSpeaker]);
  };

  const updateSpeaker = (index: number, field: keyof Speaker, value: string) => {
    const updatedSpeakers = [...formData.speakers];
    updatedSpeakers[index] = { ...updatedSpeakers[index], [field]: value };
    handleInputChange('speakers', updatedSpeakers);
  };

  const removeSpeaker = (index: number) => {
    const updatedSpeakers = formData.speakers.filter((_, i) => i !== index);
    handleInputChange('speakers', updatedSpeakers);
  };

  const addSponsor = () => {
    const newSponsor: Sponsor = {
      id: `sponsor_${Date.now()}`,
      name: '',
      logo: '',
      tier: 'bronze',
      website: '',
      description: ''
    };
    handleInputChange('sponsors', [...formData.sponsors, newSponsor]);
  };

  const updateSponsor = (index: number, field: keyof Sponsor, value: string) => {
    const updatedSponsors = [...formData.sponsors];
    updatedSponsors[index] = { ...updatedSponsors[index], [field]: value };
    handleInputChange('sponsors', updatedSponsors);
  };

  const removeSponsor = (index: number) => {
    const updatedSponsors = formData.sponsors.filter((_, i) => i !== index);
    handleInputChange('sponsors', updatedSponsors);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validation
    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.description.trim()) newErrors.description = 'Event description is required';
    if (!formData.aboutEvent.trim()) newErrors.aboutEvent = 'About event section is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.venue.trim() && !formData.isVirtual) newErrors.venue = 'Venue is required for physical events';
    if (!formData.virtualLink?.trim() && formData.isVirtual) newErrors.virtualLink = 'Virtual link is required for virtual events';
    if (!formData.organizerName.trim()) newErrors.organizerName = 'Organizer name is required';
    if (!formData.organizerEmail.trim()) newErrors.organizerEmail = 'Organizer email is required';
    if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';

    // Date validation
    if (formData.eventDate) {
      const eventDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        newErrors.eventDate = 'Event date cannot be in the past';
      }
    }

    // Time validation
    if (formData.startTime && formData.endTime) {
      if (formData.endTime <= formData.startTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    // Email validation
    if (formData.organizerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.organizerEmail)) {
      newErrors.organizerEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSaving(true);
    try {
      const { organizerCrudService } = await import('../../services/organizerCrudService');

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

      const eventData = {
        title: formData.title,
        description: formData.description,
        event_date: formData.eventDate,
        time: formData.startTime,
        end_time: formData.endTime,
        venue: formData.venue,
        capacity: formData.capacity,
        image_url: formData.eventImage,
        imageFile: selectedImage,
        imagePreview: imagePreview,
        category: formData.category,
        visibility: formData.visibility,
        organizerName: formData.organizerName,
        organizerEmail: formData.organizerEmail,
        organizerPhone: formData.organizerPhone,
        organizerBio: formData.organizerBio,
        organizerImage: formData.organizerImage,
        organizerCompany: formData.organizerCompany,
        organizerWebsite: formData.organizerWebsite,
        speakers_data: speakersData,
        sponsors_data: sponsorsData,
        schedule_data: []
      };

      let result;
      let savedEventId: string;

      if (eventId) {
        result = await organizerCrudService.updateEvent(eventId, eventData);
        savedEventId = eventId;
      } else {
        result = await organizerCrudService.createEvent(eventData, user?.id || '');
        savedEventId = result.event?.id || '';
      }

      if (!result.success) {
        alert(`Failed to save event: ${result.error}`);
        return;
      }

      alert('Event saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save event. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Navigate to ticket pricing page
      navigate(`/organizer/event/${eventId || 'new'}/ticketing`);
    } catch (error) {
      alert('Failed to save event. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: Type },
    { id: 'datetime', label: 'Date & Time', icon: Calendar },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'organizer', label: 'Organizer', icon: Building }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading event data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/my-events')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to My Events</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {eventId ? 'Edit Event' : 'Create New Event'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Draft</span>
            </button>
            
            <button
              onClick={handleNext}
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200"
            >
              <span>Next: Ticket Pricing</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                        activeSection === section.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
              
              {/* Progress Indicator */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Completion Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Required Fields</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Basic Information Section */}
              {activeSection === 'basic' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Type className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your event title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Brief description for event cards (2-3 sentences)"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      About This Event *
                    </label>
                    <textarea
                      name="aboutEvent"
                      value={formData.aboutEvent}
                      onChange={(e) => handleInputChange('aboutEvent', e.target.value)}
                      rows={8}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                        errors.aboutEvent ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Detailed description that will appear on the event detail page. Include what attendees can expect, agenda highlights, networking opportunities, etc."
                    />
                    {errors.aboutEvent && <p className="text-red-500 text-sm mt-1">{errors.aboutEvent}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      >
                        <option value="conference">Conference</option>
                        <option value="workshop">Workshop</option>
                        <option value="seminar">Seminar</option>
                        <option value="networking">Networking Event</option>
                        <option value="webinar">Webinar</option>
                        <option value="training">Training</option>
                        <option value="meetup">Meetup</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Capacity *
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                        min="1"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                          errors.capacity ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Maximum attendees"
                      />
                      {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Date & Time Section */}
              {activeSection === 'datetime' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Date & Time</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Date *
                      </label>
                      <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={(e) => handleInputChange('eventDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                          errors.eventDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time *
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                          errors.startTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                          errors.endTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={formData.timezone}
                      onChange={(e) => handleInputChange('timezone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Location Section */}
              {activeSection === 'location' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Location & Venue</h2>
                  </div>

                  <div className="flex items-center space-x-4 mb-6">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="eventType"
                        checked={!formData.isVirtual}
                        onChange={() => handleInputChange('isVirtual', false)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-medium text-gray-900">Physical Event</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="eventType"
                        checked={formData.isVirtual}
                        onChange={() => handleInputChange('isVirtual', true)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-medium text-gray-900">Virtual Event</span>
                    </label>
                  </div>

                  {!formData.isVirtual ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Venue Name *
                        </label>
                        <input
                          type="text"
                          name="venue"
                          value={formData.venue}
                          onChange={(e) => handleInputChange('venue', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                            errors.venue ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Convention Center, Hotel Name, etc."
                        />
                        {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                          placeholder="123 Main Street"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            placeholder="San Francisco"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State/Province
                          </label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            placeholder="CA"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            placeholder="United States"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Virtual Event Link *
                      </label>
                      <input
                        type="url"
                        name="virtualLink"
                        value={formData.virtualLink || ''}
                        onChange={(e) => handleInputChange('virtualLink', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                          errors.virtualLink ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij"
                      />
                      {errors.virtualLink && <p className="text-red-500 text-sm mt-1">{errors.virtualLink}</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Organizer Section */}
              {activeSection === 'organizer' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Building className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Organizer Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organizer Name *
                      </label>
                      <input
                        type="text"
                        name="organizerName"
                        value={formData.organizerName}
                        onChange={(e) => handleInputChange('organizerName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                          errors.organizerName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Your name or organization name"
                      />
                      {errors.organizerName && <p className="text-red-500 text-sm mt-1">{errors.organizerName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        name="organizerEmail"
                        value={formData.organizerEmail}
                        onChange={(e) => handleInputChange('organizerEmail', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                          errors.organizerEmail ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="contact@example.com"
                      />
                      {errors.organizerEmail && <p className="text-red-500 text-sm mt-1">{errors.organizerEmail}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.organizerPhone}
                        onChange={(e) => handleInputChange('organizerPhone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        value={formData.organizerCompany}
                        onChange={(e) => handleInputChange('organizerCompany', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="Your company or organization"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organizer Bio
                    </label>
                    <textarea
                      value={formData.organizerBio}
                      onChange={(e) => handleInputChange('organizerBio', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="Tell attendees about yourself or your organization"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Image URL
                      </label>
                      <input
                        type="url"
                        value={formData.organizerImage}
                        onChange={(e) => handleInputChange('organizerImage', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="https://example.com/profile.jpg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.organizerWebsite}
                        onChange={(e) => handleInputChange('organizerWebsite', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="https://your-website.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Error Summary */}
              {Object.keys(errors).length > 0 && (
                <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="font-medium text-red-800">Please fix the following errors:</h3>
                  </div>
                  <ul className="text-sm text-red-700 space-y-1">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Success Message */}
              {Object.keys(errors).length === 0 && formData.title && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Event details look good! Ready to proceed to ticket pricing.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventEditPage;