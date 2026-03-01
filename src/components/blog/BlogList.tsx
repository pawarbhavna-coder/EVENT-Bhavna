import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, Clock, Search, Filter, Loader2 } from 'lucide-react';
import { BlogArticle, BlogListResponse } from '../../types/blog';
import { blogService } from '../../services/blogService';

interface BlogListProps {
  onArticleClick: (slug: string) => void;
}

const categories = ['All', 'Technology', 'Strategy', 'Sustainability', 'Business', 'Marketing', 'Networking'];

const BlogList: React.FC<BlogListProps> = ({ onArticleClick }) => {
  const [blogData, setBlogData] = useState<BlogListResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadArticles = async (page: number = 1, category: string = 'All', reset: boolean = false) => {
    try {
      if (reset) {
        setIsLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      const categoryFilter = category === 'All' ? undefined : category;
      const response = await blogService.getArticles(page, 6, categoryFilter);

      if (reset || page === 1) {
        setBlogData(response);
      } else {
        setBlogData(prev => prev ? {
          ...response,
          articles: [...prev.articles, ...response.articles]
        } : response);
      }

      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load articles. Please try again.');
      console.error('Error loading articles:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadArticles(1, selectedCategory, true);
  }, [selectedCategory]);

  const handleLoadMore = () => {
    if (blogData && blogData.hasMore && !isLoadingMore) {
      loadArticles(currentPage + 1, selectedCategory, false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadArticles(1, selectedCategory, true);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const searchResults = await blogService.searchArticles(searchTerm);
      setBlogData({
        articles: searchResults,
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
    loadArticles(1, selectedCategory, true);
  };

  if (isLoading && !blogData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => loadArticles(1, selectedCategory, true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const featuredArticle = blogData?.articles.find(article => article.featured);
  const regularArticles = blogData?.articles.filter(article => !article.featured) || [];

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3">
          <Filter className="w-5 h-5 text-gray-500 mt-2" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Article */}
      {featuredArticle && selectedCategory === 'All' && !searchTerm && (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {featuredArticle.category}
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {featuredArticle.title}
              </h3>
              <p className="text-white/90 text-lg mb-6 leading-relaxed">
                {featuredArticle.excerpt}
              </p>
              <div className="flex items-center space-x-6 mb-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{featuredArticle.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{new Date(featuredArticle.publishedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{featuredArticle.readTime}</span>
                </div>
              </div>
              <button 
                onClick={() => onArticleClick(featuredArticle.slug)}
                className="group inline-flex items-center space-x-2 bg-white text-indigo-600 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                <span>Read Article</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
            <div className="relative">
              <div className="aspect-w-16 aspect-h-10 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                 autoComplete="off"
                  className="w-full h-64 lg:h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {blogData && blogData.articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(selectedCategory === 'All' && !searchTerm ? regularArticles : blogData.articles).map((article, index) => (
              <article
                key={article.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
                onClick={() => onArticleClick(article.slug)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                    <span className="text-gray-500 text-sm">{article.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="group/btn inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 font-medium">
                      <span>Read</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          {blogData.hasMore && (
            <div className="text-center">
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
                  <span>Load More Articles</span>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <div className="bg-gray-50 rounded-2xl p-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `No articles match your search for "${searchTerm}"`
                : `No articles found in the ${selectedCategory} category`
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
  );
};

export default BlogList;