import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Search, Download, BookOpen, Video, FileText, ExternalLink, Filter, Star } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'template' | 'video' | 'whitepaper' | 'checklist';
  category: string;
  downloadUrl: string;
  image: string;
  downloads: number;
  rating: number;
  featured: boolean;
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Complete Event Planning Checklist',
    description: 'A comprehensive 50-point checklist covering every aspect of event planning from conception to execution.',
    type: 'checklist',
    category: 'Planning',
    downloadUrl: '#',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    downloads: 2450,
    rating: 4.8,
    featured: true
  },
  {
    id: '2',
    title: 'Event Marketing Strategy Template',
    description: 'Ready-to-use marketing strategy template with timelines, channels, and budget allocation frameworks.',
    type: 'template',
    category: 'Marketing',
    downloadUrl: '#',
    image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400',
    downloads: 1890,
    rating: 4.7,
    featured: true
  },
  {
    id: '3',
    title: 'Virtual Event Best Practices Guide',
    description: 'Learn how to create engaging virtual events with this comprehensive guide covering technology, engagement, and production.',
    type: 'guide',
    category: 'Virtual Events',
    downloadUrl: '#',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    downloads: 1560,
    rating: 4.9,
    featured: false
  },
  {
    id: '4',
    title: 'Event ROI Measurement Whitepaper',
    description: 'Detailed analysis of how to measure and improve return on investment for corporate events and conferences.',
    type: 'whitepaper',
    category: 'Analytics',
    downloadUrl: '#',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
    downloads: 1200,
    rating: 4.6,
    featured: false
  },
  {
    id: '5',
    title: 'Speaker Management Masterclass',
    description: 'Video series covering speaker recruitment, management, and relationship building for successful events.',
    type: 'video',
    category: 'Speaker Management',
    downloadUrl: '#',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
    downloads: 980,
    rating: 4.5,
    featured: false
  },
  {
    id: '6',
    title: 'Sustainable Event Planning Guide',
    description: 'Comprehensive guide to organizing eco-friendly events that minimize environmental impact.',
    type: 'guide',
    category: 'Sustainability',
    downloadUrl: '#',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
    downloads: 750,
    rating: 4.8,
    featured: false
  }
];

const categories = ['All', 'Planning', 'Marketing', 'Virtual Events', 'Analytics', 'Speaker Management', 'Sustainability'];
const resourceTypes = ['All', 'Guide', 'Template', 'Video', 'Whitepaper', 'Checklist'];

const ResourcesPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  React.useEffect(() => {
    setBreadcrumbs(['Resources']);
  }, [setBreadcrumbs]);

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    const matchesType = selectedType === 'All' || resource.type === selectedType.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const featuredResources = filteredResources.filter(resource => resource.featured);
  const regularResources = filteredResources.filter(resource => !resource.featured);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <BookOpen className="w-5 h-5" />;
      case 'template': return <FileText className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'whitepaper': return <FileText className="w-5 h-5" />;
      case 'checklist': return <FileText className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'bg-blue-100 text-blue-600';
      case 'template': return 'bg-green-100 text-green-600';
      case 'video': return 'bg-purple-100 text-purple-600';
      case 'whitepaper': return 'bg-orange-100 text-orange-600';
      case 'checklist': return 'bg-indigo-100 text-indigo-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4">
            RESOURCE CENTER
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Free guides, templates, and tools to help you plan and execute successful events
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
              <div className="flex flex-wrap gap-2">
                {resourceTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedType === type
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Resources */}
        {featuredResources.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-indigo-900 mb-8">Featured Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredResources.map((resource, index) => (
                <div
                  key={resource.id}
                  className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white transform hover:scale-105 transition-all duration-300 shadow-2xl"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Star className="w-6 h-6 text-yellow-300" />
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <img
                      src={resource.image}
                      alt={resource.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                      <p className="text-white/90 text-sm mb-4">{resource.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Download className="w-4 h-4" />
                            <span>{resource.downloads.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-300 fill-current" />
                            <span>{resource.rating}</span>
                          </div>
                        </div>
                        <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Resources Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-indigo-900 mb-8">
            {featuredResources.length > 0 ? 'All Resources' : 'Available Resources'}
          </h2>
          
          {regularResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularResources.map((resource, index) => (
                <div
                  key={resource.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  style={{ animationDelay: `${(featuredResources.length + index) * 0.1}s` }}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(resource.type)}`}>
                        {getTypeIcon(resource.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(resource.type)}`}>
                            {resource.type}
                          </span>
                          <span className="text-xs text-gray-500">{resource.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                      {resource.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {resource.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{resource.downloads.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{resource.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
                