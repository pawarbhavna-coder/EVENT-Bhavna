import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { UserPlus, Shield } from 'lucide-react';

const StaffRolesPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();

  React.useEffect(() => {
    setBreadcrumbs(['Staff & Volunteer Roles']);
  }, [setBreadcrumbs]);

  const staff = [
    { name: 'Alice Johnson', role: 'Event Manager', email: 'alice@example.com' },
    { name: 'Bob Williams', role: 'Tech Support', email: 'bob@example.com' },
    { name: 'Charlie Brown', role: 'Volunteer Coordinator', email: 'charlie@example.com' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Staff & Volunteer Roles</h1>
             <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <UserPlus size={16} />
                <span>Add Team Member</span>
            </button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="min-w-full">
                 <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {staff.map(member => (
                        <tr key={member.name}>
                            <td className="px-6 py-4">
                                <p className="font-medium text-gray-900">{member.name}</p>
                                <p className="text-sm text-gray-500">{member.email}</p>
                            </td>
                            <td className="px-6 py-4"><span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">{member.role}</span></td>
                            <td className="px-6 py-4"><button className="text-indigo-600 hover:underline">Edit Permissions</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default StaffRolesPage;
