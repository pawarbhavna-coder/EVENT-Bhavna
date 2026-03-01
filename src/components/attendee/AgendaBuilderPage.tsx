import React from 'react';
import { useApp } from '../../contexts/AppContext';

const AgendaBuilderPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();

  React.useEffect(() => {
    setBreadcrumbs(['Agenda Builder']);
  }, [setBreadcrumbs]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Agenda Builder</h1>
          <p className="text-xl text-gray-600">Coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default AgendaBuilderPage;