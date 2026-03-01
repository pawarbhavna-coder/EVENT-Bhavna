import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Download, ExternalLink, Calendar, Users, Award, FileText, Image, Video } from 'lucide-react';

interface PressRelease {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  downloadUrl: string;
}

interface MediaAsset {
  id: string;
  title: string;
  type: 'logo' | 'photo' | 'video';
  url: string;
  description: string;
}

const pressReleases: PressRelease[] = [
  {
    id: '1',
    title: 'EventEase Launches Revolutionary Event Management Platform',
    date: '2024-01-15',
    excerpt: 'New platform streamlines event planning with AI-powered tools and comprehensive analytics.',
    downloadUrl: '#'
  },
  {
    id: '2',
    title: 'EventEase Partners with Leading Convention Centers Nationwide',
    date: '2024-01-08',
    excerpt: 'Strategic partnerships expand venue options and enhance event planning capabilities.',
    downloadUrl: '#'
  },
  {
    id: '3',
    title: 'EventEase Reaches 10,000 Successful Events Milestone',
    date: '2023-12-20',
    excerpt: 'Platform celebrates major milestone with over 10,000 events successfully planned and executed.',
    downloadUrl: '#'
  }
];

const mediaAssets: MediaAsset[] = [
  {
    id: '1',
    title: 'EventEase Logo - Primary',
    type: 'logo',
    url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'High-resolution primary logo in PNG and SVG formats'
  },
  {
    id: '2',
    title: 'Platform Screenshots',
    type: 'photo',
    url: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'High-quality screenshots of the EventEase platform interface'
  },
  {
    id: '3',
    title: 'CEO Interview Video',
    type: 'video',
    url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Recent interview with EventEase CEO discussing platform vision'
  },
  {
    id: '4',
    title: 'Event Success Stories',
    type: 'photo',
    url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Photos from successful events organized through EventEase'
  }
];

const companyStats = [
  { label: 'Events Organized', value: '10,000+' },
  { label: 'Active Users', value: '50,000+' },
  { label: 'Countries Served', value: '25+' },
  { label: 'Customer Satisfaction', value: '98%' }
];

const PressPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();

  React.useEffect(() => {
    setBreadcrumbs(['Press & Media']);
  }, [setBreadcrumbs]);

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'logo': return <Image className="w-5 h-5" />;
      case 'photo': return <Image className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4">
            PRESS & MEDIA
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Media resources, press releases, and company information for journalists and partners
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Company Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About EventEase</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  EventEase is a comprehensive event management platform that empowers organizers to create, manage, and execute successful events of all sizes. From intimate workshops to large-scale conferences, our platform provides the tools and insights needed to deliver exceptional experiences.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Founded in 2020, EventEase has quickly become a trusted partner for event professionals worldwide, facilitating over 10,000 successful events and serving more than 50,000 active users across 25 countries.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our mission is to democratize event planning by making professional-grade tools accessible to organizers of all experience levels, while fostering meaningful connections and memorable experiences for attendees.
                </p>
              </div>
            </div>

            {/* Press Releases */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Press Releases</h2>
              <div className="space-y-6">
                {pressReleases.map((release, index) => (
                  <div
                    key={release.id}
                    className="border-l-4 border-indigo-600 pl-6 py-4 hover:bg-gray-50 transition-colors duration-200"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{release.title}</h3>
                        <p className="text-gray-600 mb-3">{release.excerpt}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(release.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <a
                        href={release.downloadUrl}
                        className="ml-4 flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Download</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Assets */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Media Assets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mediaAssets.map((asset, index) => (
                  <div
                    key={asset.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        {getAssetIcon(asset.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{asset.title}</h3>
                        <span className="text-xs text-gray-500 capitalize">{asset.type}</span>
                      </div>
                    </div>
                    <img
                      src={asset.url}
                      alt={asset.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <p className="text-sm text-gray-600 mb-3">{asset.description}</p>
                    <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Stats</h3>
              <div className="space-y-4">
                {companyStats.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{stat.label}</span>
                    <span className="font-bold text-indigo-600">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Contact */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Media Contact</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Head of Communications</p>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">📧 tanmay365210mogabeera@gmail.com</p>
                  <p className="text-gray-700">📞 +91 8652601487</p>
                  <p className="text-gray-700">🕒 Mon-Fri, 9 AM - 6 PM PST</p>
                </div>
              </div>
            </div>

            {/* Awards & Recognition */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Awards & Recognition</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-gray-900">Best Event Tech Platform 2024</p>
                    <p className="text-sm text-gray-600">Event Industry Awards</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-gray-900">Innovation in Events 2023</p>
                    <p className="text-sm text-gray-600">TechCrunch Startup Awards</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-gray-900">Top 50 SaaS Companies</p>
                    <p className="text-sm text-gray-600">SaaS Weekly</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Company Fact Sheet</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Executive Bios</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Product Screenshots</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Brand Guidelines</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressPage;