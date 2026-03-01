import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, ArrowRight, User, Star, Award, Loader2, Plus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import { Speaker, SpeakerListResponse } from '../../types/speaker';
import { speakerService } from '../../services/speakerService';

const expertiseAreas = ['All', 'Technology', 'Leadership', 'Design', 'Marketing', 'Strategy', 'Sustainability', 'AI/ML', 'Innovation'];

const SpeakerDirectoryPage: React.FC = () => {
  const { setBreadcrumbs, setCurrentView } = useApp();
  const { isAuthenticated } = useAuth();
  const [speakerData, setSpeakerData] = useState<SpeakerListResponse | null>(null);
  const [selectedExpertise, setSelectedExpertise] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'events'>('name');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mySchedule, setMySchedule] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    setBreadcrumbs(['Speaker Directory']);
  }, [setBreadcrumbs]);

  const loadSpeakers = async (page: number = 1, expertise: string = 'All', reset: boolean = false) => {
    try {
      if (reset) {
        setIsLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      const expertiseFilter = expertise === 'All' ? undefined : expertise;
      const response = await speakerService.getSpeakers(page, 9, expertiseFilter, sortBy);

      if (reset || page === 1) {
        setSpeakerData(response);
      } else {
        setSpeakerData(prev => prev ? {
          ...response,
          speakers: [...prev.speakers, ...response.speakers]
        } : response);
      }

      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load speakers. Please try again.');
      console.error('Error loading speakers:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadSpeakers(1, selectedExpertise, true);
  }, [selectedExpertise, sortBy]);

  const handleLoadMore = () => {
    if (speakerData && speakerData.hasMore && !isLoadingMore) {
      loadSpeakers(currentPage + 1, selectedExpertise, false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadSpeakers(1, selectedExpertise, true);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const searchResults = await speakerService.searchSpeakers(searchTerm);
      setSpeakerData({
        speakers: searchResults,
        hasMore: false,
        total: searchResults.length,
        page: 1,
        limit: searchResults.length
      });
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    loadSpeakers(1, selectedExpertise, true);
  };

  const handleAddToSchedule = (speakerId: string) => {
    if (!isAuthenticated) {
      alert('Please log in to add speakers to your schedule');
      return;
    }

    setMySchedule(prev => {
      const newSchedule = new Set(prev);
      if (newSchedule.has(speakerId)) {
        newSchedule.delete(speakerId);
      } else {
        newSchedule.add(speakerId);
      }
      return newSchedule;
    });
  };

  const handleSpeakerClick = (speakerId: string) => {
    // Navigate to speaker profile (this would be implemented in the router)
    console.log('Navigate to speaker profile:', speakerId);
  };

  if (isLoading && !speakerData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading speakers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="text-center py-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => loadSpeakers(1, selectedExpertise, true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const featuredSpeakers = speakerData?.speakers.filter(speaker => speaker.featured) || [];
  const regularSpeakers = speakerData?.speakers.filter(speaker => !speaker.featured) || [];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4">
            SPEAKER DIRECTORY
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our incredible lineup of industry experts, thought leaders, and innovators
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search speakers by name, title, company, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Search
                </button>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expertise Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Expertise</label>
              <div className="flex flex-wrap gap-2">
                {expertiseAreas.map((expertise) => (
                  <button
                    key={expertise}
                    onClick={() => setSelectedExpertise(expertise)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedExpertise === expertise
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {expertise}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'rating' | 'events')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              >
                <option value="name">Name (A-Z)</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="events">Events (Most to Least)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Speakers */}
        {featuredSpeakers.length > 0 && selectedExpertise === 'All' && !searchTerm && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Featured Speakers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredSpeakers.map((speaker, index) => (
                <div
                  key={speaker.id}
                  className="group bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-2xl"
                  onClick={() => handleSpeakerClick(speaker.id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Award className="w-6 h-6 text-yellow-300" />
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/20">
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{speaker.name}</h3>
                    <p className="text-white/90 text-sm mb-1">{speaker.title}</p>
                    <p className="text-white/80 text-sm mb-4">{speaker.company}</p>
                    
                    <div className="flex items-center justify-center space-x-4 mb-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-300 fill-current" />
                        <span>{speaker.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{speaker.events} events</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {speaker.expertise.slice(0, 2).map((exp) => (
                        <span key={exp} className="bg-white/20 text-white px-2 py-1 rounded-full text-xs">
                          {exp}
                        </span>
                      ))}
                    </div>

                    {isAuthenticated && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToSchedule(speaker.id);
                        }}
                        className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          mySchedule.has(speaker.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {mySchedule.has(speaker.id) ? 'Added to Schedule' : 'Add to Schedule'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Speakers Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">
            {featuredSpeakers.length > 0 && selectedExpertise === 'All' && !searchTerm ? 'All Speakers' : 'Our Speakers'}
          </h2>
          
          {speakerData && speakerData.speakers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(selectedExpertise === 'All' && !searchTerm ? regularSpeakers : speakerData.speakers).map((speaker, index) => (
                  <div
                    key={speaker.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
                    onClick={() => handleSpeakerClick(speaker.id)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                          <img
                            src={speaker.image}
                            alt={speaker.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                            {speaker.name}
                          </h3>
                          <p className="text-sm text-gray-600">{speaker.title}</p>
                          <p className="text-sm text-gray-500">{speaker.company}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {speaker.bio}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{speaker.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{speaker.events}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{speaker.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {speaker.expertise.slice(0, 3).map((exp) => (
                          <span key={exp} className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium">
                            {exp}
                          </span>
                        ))}
                      </div>

                      {/* Social Links */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-2">
                          {speaker.socialLinks.linkedin && (
                            <a
                              href={speaker.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-200"
                            >
                              <span className="text-xs font-bold">in</span>
                            </a>
                          )}
                          {speaker.socialLinks.twitter && (
                            <a
                              href={speaker.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors duration-200"
                            >
                              <span className="text-xs font-bold">T</span>
                            </a>
                          )}
                          {speaker.socialLinks.website && (
                            <a
                              href={speaker.socialLinks.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors duration-200"
                            >
                              <span className="text-xs font-bold">W</span>
                            </a>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>

                      {/* Add to Schedule Button */}
                      {isAuthenticated && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToSchedule(speaker.id);
                          }}
                          className={`w-full flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            mySchedule.has(speaker.id)
                              ? 'bg-green-500 text-white'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                          <span>{mySchedule.has(speaker.id) ? 'Added to Schedule' : 'Add to Schedule'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {speakerData.hasMore && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <span>Load More Speakers</span>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="bg-white rounded-2xl p-12 shadow-lg">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No speakers found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? `No speakers match your search for "${searchTerm}"`
                    : `No speakers found in the ${selectedExpertise} category`
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakerDirectoryPage;