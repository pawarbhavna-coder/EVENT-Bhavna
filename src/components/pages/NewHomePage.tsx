import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Star, ArrowRight, Play, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/NewAuthContext';
import ParallaxSection from '../ParallaxSection';
import LoginPromptOverlay from '../common/LoginPromptOverlay';
import UnifiedAuthModal from '../auth/UnifiedAuthModal';
import { useState } from 'react';
import '../../styles/wave-animation.css';

const NewHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = React.useState(false);
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [authModalConfig, setAuthModalConfig] = React.useState<{
    defaultRole: 'user' | 'admin';
    redirectTo?: string;
  }>({
    defaultRole: 'user'
  });

  console.log('NewHomePage rendering');

  const featuredEvents = [
    {
      id: '1',
      title: 'Tech Innovation Summit 2024',
      date: 'March 15, 2024',
      location: 'San Francisco, CA',
      attendees: 2500,
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Technology'
    },
    {
      id: '2',
      title: 'Digital Marketing Conference',
      date: 'March 22, 2024',
      location: 'New York, NY',
      attendees: 1800,
      image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Marketing'
    },
    {
      id: '3',
      title: 'Sustainable Business Forum',
      date: 'April 5, 2024',
      location: 'Seattle, WA',
      attendees: 1200,
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Sustainability'
    }
  ];

  const benefits = [
    {
      icon: Calendar,
      title: 'Discover Amazing Events',
      description: 'Find conferences, workshops, and networking events tailored to your interests and industry.'
    },
    {
      icon: Users,
      title: 'Connect with Professionals',
      description: 'Build meaningful relationships with industry leaders, peers, and potential collaborators.'
    },
    {
      icon: Star,
      title: 'Learn from Experts',
      description: 'Gain insights from top speakers and thought leaders in your field.'
    }
  ];

  const testimonials = [
    {
      name: 'Alex Thompson',
      role: 'Product Manager',
      company: 'StartupCo',
      content: 'EventEase has transformed how I discover and attend professional events. The platform is intuitive and the events are top-quality.',
      avatar: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      name: 'Lisa Wang',
      role: 'Marketing Director',
      company: 'GrowthTech',
      content: 'As an event organizer, EventEase provides all the tools I need to create successful events. The analytics and attendee management features are excellent.',
      avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200'
    }
  ];
  
  const handleEventClick = (eventId: string) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    navigate(`/event/${eventId}`);
  };

  const handleLoginPromptClose = () => {
    setShowLoginPrompt(false);
  };

  const handleLoginPromptLogin = () => {
    setShowLoginPrompt(false);
    setAuthModalConfig({ defaultRole: 'user' });
    setShowAuthModal(true);
  };

  const handleOrganizerSignUp = () => {
    setAuthModalConfig({ 
      defaultRole: 'user',
      redirectTo: '/dashboard'
    });
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 overflow-hidden pt-16">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 opacity-70 animate-bounce" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 opacity-60 animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 opacity-50 animate-bounce" style={{ animationDuration: '3s' }} />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 leading-tight">
              Event
              <br />
              <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                Ease
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Discover, attend, and organize amazing events. Connect with professionals, learn from experts, and grow your network.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/discover')}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-indigo-600 bg-white rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10">Discover Events</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              
              <button
                onClick={() => navigate('/pricing')}
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-full hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-105"
              >
                <Play className="mr-2 w-5 h-5" />
                <span>Start Organizing</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Carousel */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="waves-container">
          <div className="wave one"></div>
          <div className="wave two"></div>
          <div className="wave three"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't miss these upcoming events from top organizers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event, index) => (
              <div
                key={event.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
                onClick={() => handleEventClick(event.id)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {event.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-200">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees.toLocaleString()} attendees</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">{event.location}</span>
                    <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/discover')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All Events
            </button>
          </div>
        </div>
      </section>

      {/* Parallax Section */}
      <ParallaxSection />

      {/* Platform Benefits */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="waves-container">
          <div className="wave one"></div>
          <div className="wave two"></div>
          <div className="wave three"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose EventEase?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to discover, attend, and organize successful events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={index}
                  className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="waves-container">
          <div className="wave one"></div>
          <div className="wave two"></div>
          <div className="wave three"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by Professionals
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of professionals who trust EventEase
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{testimonial.content}</p>
                <div className="flex items-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Company Logos */}
          <div className="text-center">
            <p className="text-gray-500 mb-8">Trusted by leading companies</p>
            <div className="flex items-center justify-center space-x-12 opacity-60">
              <div className="text-2xl font-bold text-gray-400">TechCorp</div>
              <div className="text-2xl font-bold text-gray-400">StartupCo</div>
              <div className="text-2xl font-bold text-gray-400">GrowthTech</div>
              <div className="text-2xl font-bold text-gray-400">InnovateLab</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join EventEase today and discover your next great event experience
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/discover')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Find Events
            </button>
            <button
              onClick={handleOrganizerSignUp}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
            >
              Start Organizing
            </button>
          </div>
        </div>
      </section>

      {/* Login Prompt Overlay */}
      <LoginPromptOverlay
        isOpen={showLoginPrompt}
        onClose={handleLoginPromptClose}
        onLogin={handleLoginPromptLogin}
      />

      {/* Auth Modal */}
      <UnifiedAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={() => setShowAuthModal(false)}
        defaultRole={authModalConfig.defaultRole}
        redirectTo={authModalConfig.redirectTo}
      />
    </div>
  );
};

export default NewHomePage;