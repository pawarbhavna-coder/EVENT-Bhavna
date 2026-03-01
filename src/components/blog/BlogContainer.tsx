import React, { useState } from 'react';
import BlogList from './BlogList';
import BlogArticle from './BlogArticle';

type BlogView = 'list' | 'article';

interface BlogContainerProps {
  isStandalone?: boolean;
  isAuthenticated?: boolean;
  user?: any;
  onLogin?: () => void;
  onLogout?: () => void;
  onShowEvents?: () => void;
  onShowSpeakers?: () => void;
  onShowSponsors?: () => void;
  onShowDashboard?: () => void;
}

const BlogContainer: React.FC<BlogContainerProps> = ({
  isStandalone = false,
  isAuthenticated = false,
  user = null,
  onLogin = () => {},
  onLogout = () => {},
  onShowEvents = () => {},
  onShowSpeakers = () => {},
  onShowSponsors = () => {},
  onShowDashboard = () => {}
}) => {
  const [currentView, setCurrentView] = useState<BlogView>('list');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string>('');

  const handleArticleClick = (slug: string) => {
    setSelectedArticleSlug(slug);
    setCurrentView('article');
    // Scroll to top when navigating to article
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedArticleSlug('');
    // Scroll to top when going back to list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'list' ? (
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4">
                BLOG
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Insights, tips, and trends from the world of event management
              </p>
            </div>
            <BlogList onArticleClick={handleArticleClick} />
          </div>
        </div>
      ) : (
        <BlogArticle
          slug={selectedArticleSlug}
          onBack={handleBackToList}
          onArticleClick={handleArticleClick}
        />
      )}
    </div>
  );
};

export default BlogContainer;