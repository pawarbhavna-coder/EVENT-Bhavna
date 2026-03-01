import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Palette, Image, Type } from 'lucide-react';

const LandingCustomizerPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();

  React.useEffect(() => {
    setBreadcrumbs(['Landing Page Customizer']);
  }, [setBreadcrumbs]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Landing Page Customizer</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-4"><Palette className="mr-2"/> Branding</h3>
              <label className="block text-sm font-medium">Primary Color</label>
              <input type="color" defaultValue="#4f46e5" autoComplete="off" className="w-full h-10 p-1 border border-gray-300 rounded-lg"/>
            </div>
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-4"><Image className="mr-2"/> Banner</h3>
              <label className="block text-sm font-medium">Banner Image URL</label>
              <input type="text" placeholder="https://example.com/banner.jpg" autoComplete="url" className="w-full p-2 border rounded-lg"/>
            </div>
             <div>
              <h3 className="text-lg font-semibold flex items-center mb-4"><Type className="mr-2"/> Sections</h3>
                <label className="flex items-center justify-between"><span>Show Speakers</span><input type="checkbox" defaultChecked /></label>
                <label className="flex items-center justify-between"><span>Show Schedule</span><input type="checkbox" defaultChecked /></label>
                <label className="flex items-center justify-between"><span>Show Sponsors</span><input type="checkbox" /></label>
            </div>
             <button className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">Save Changes</button>
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-4">
             <h3 className="text-lg font-semibold text-center mb-4">Live Preview</h3>
             <div className="border rounded-lg aspect-video bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Your event landing page preview will appear here.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingCustomizerPage;
