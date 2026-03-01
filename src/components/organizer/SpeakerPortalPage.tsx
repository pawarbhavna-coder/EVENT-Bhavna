import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { UserPlus, Send, CheckCircle, XCircle } from 'lucide-react';

const SpeakerPortalPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();

  React.useEffect(() => {
    setBreadcrumbs(['Speaker Portal']);
  }, [setBreadcrumbs]);

  const speakers = [
    { name: 'Zawadi Thandwe', status: 'Confirmed', email: 'zawadi@example.com' },
    { name: 'Ejiro Rudo', status: 'Invited', email: 'ejiro@example.com' },
    { name: 'Daniel Saoirse', status: 'Declined', email: 'daniel@example.com' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Speaker Portal</h1>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <UserPlus size={16} />
            <span>Invite Speaker</span>
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
           <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Speaker</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {speakers.map(speaker => (
                        <tr key={speaker.name}>
                            <td className="px-6 py-4">
                                <p className="font-medium text-gray-900">{speaker.name}</p>
                                <p className="text-sm text-gray-500">{speaker.email}</p>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    speaker.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                    speaker.status === 'Invited' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                }`}>{speaker.status}</span>
                            </td>
                            <td className="px-6 py-4"><button className="text-indigo-600 hover:underline">Send Reminder</button></td>
                        </tr>
                    ))}
                </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default SpeakerPortalPage;
