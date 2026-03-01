import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Settings, Shield, Bell, Users } from 'lucide-react';

const EventSettingsPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();

  React.useEffect(() => {
    setBreadcrumbs(['Event Settings']);
  }, [setBreadcrumbs]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Event Settings</h1>
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center"><Shield className="mr-3 text-indigo-600" /> Privacy & Access</h2>
                <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <label htmlFor="visibility" className="font-medium text-gray-700">Event Visibility</label>
                        <select id="visibility" autoComplete="off" className="border-gray-300 rounded-md shadow-sm">
                            <option>Public</option>
                            <option>Private</option>
                            <option>Unlisted</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <label htmlFor="approval" className="font-medium text-gray-700">Require Registration Approval</label>
                        <input id="approval" type="checkbox" autoComplete="off" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                    </div>
                </div>
            </div>
             <div>
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center"><Bell className="mr-3 text-indigo-600" /> Notifications</h2>
                <p className="text-gray-600 mt-2">Manage automated email notifications for attendees.</p>
                 <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <label htmlFor="confirmation" className="font-medium text-gray-700">Send confirmation email</label>
                        <input id="confirmation" type="checkbox" autoComplete="off" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked/>
                    </div>
                     <div className="flex items-center justify-between p-4 border rounded-lg">
                        <label htmlFor="reminder" className="font-medium text-gray-700">Send 24-hour reminder email</label>
                        <input id="reminder" type="checkbox" autoComplete="off" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked/>
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">Save Settings</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EventSettingsPage;
