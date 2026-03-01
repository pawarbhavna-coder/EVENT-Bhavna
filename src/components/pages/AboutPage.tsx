import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Users, Target, Heart, Globe, Award, ArrowRight } from 'lucide-react';

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    bio: 'Former event director with 15+ years of experience in the industry.',
    image: 'https://images.pexels.com/photos/3211476/pexels-photo-3211476.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    name: 'Michael Chen',
    role: 'CTO',
    bio: 'Tech leader passionate about building scalable platforms.',
    image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    name: 'Emma Rodriguez',
    role: 'Head of Product',
    bio: 'UX expert focused on creating intuitive event management experiences.',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    name: 'David Park',
    role: 'VP of Sales',
    bio: 'Building relationships and helping customers achieve their event goals.',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const values = [
  {
    icon: Target,
    title: 'Innovation',
    description: 'We continuously push the boundaries of what\'s possible in event technology.'
  },
  {
    icon: Heart,
    title: 'Connection',
    description: 'We believe in the power of bringing people together for meaningful experiences.'
  },
  {
    icon: Globe,
    title: 'Accessibility',
    description: 'Making professional event planning tools accessible to everyone, everywhere.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for excellence in everything we do, from product design to customer service.'
  }
];

const milestones = [
  { year: '2020', event: 'EventEase founded with a vision to democratize event planning' },
  { year: '2021', event: 'Launched MVP and onboarded first 100 customers' },
  { year: '2022', event: 'Reached 1,000 successful events milestone' },
  { year: '2023', event: 'Expanded internationally and launched virtual event features' },
  { year: '2024', event: 'Achieved 10,000+ events and 50,000+ users milestone' }
];

const AboutPage: React.FC = () => {
  const { setBreadcrumbs, setCurrentView } = useApp();

  React.useEffect(() => {
    setBreadcrumbs(['About Us']);
  }, [setBreadcrumbs]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4">
            ABOUT EVENTEASE
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering event organizers to create extraordinary experiences through innovative technology
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white mb-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              To democratize event planning by providing powerful, intuitive tools that enable anyone to create memorable experiences, foster meaningful connections, and build thriving communities.
            </p>
          </div>
        </div>

        {/* Company Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="text-center group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative mx-auto mb-4 w-32 h-32 rounded-full overflow-hidden transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-indigo-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Company Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Our Journey</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {milestone.year}
                  </div>
                  <div className="flex-1 pt-3">
                    <p className="text-gray-700 leading-relaxed">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Ready to be part of the future of event planning? Start creating amazing events today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentView('event-discovery')}
              className="bg-white text-indigo-600 px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105"
            >
              Discover Events
            </button>
            <button
              onClick={() => setCurrentView('pricing')}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-indigo-600 transition-all duration-200 transform hover:scale-105"
            >
              Start Organizing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;