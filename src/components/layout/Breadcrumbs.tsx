import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const Breadcrumbs: React.FC = () => {
  const { breadcrumbs, setCurrentView } = useApp();

  if (breadcrumbs.length === 0) return null;

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center space-x-2 text-sm">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <Home className="w-4 h-4" />
          </button>
          
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className={`${
                index === breadcrumbs.length - 1 
                  ? 'text-gray-900 font-medium' 
                  : 'text-gray-500 hover:text-gray-700 cursor-pointer'
              }`}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumbs;