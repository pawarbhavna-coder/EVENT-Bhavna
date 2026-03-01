import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Percent, Edit, Trash2 } from 'lucide-react';

const DiscountCodesPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();

  React.useEffect(() => {
    setBreadcrumbs(['Discount Codes']);
  }, [setBreadcrumbs]);

  const codes = [
    { code: 'EARLYBIRD20', discount: '20%', used: '50/100', status: 'Active' },
    { code: 'SPEAKER50', discount: '50%', used: '15/20', status: 'Active' },
    { code: 'EXPIRED10', discount: '10%', used: '30/30', status: 'Expired' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Discount Codes</h1>
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <Plus size={16} />
                <span>Create Code</span>
            </button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {codes.map(c => (
                        <tr key={c.code}>
                            <td className="px-6 py-4 font-mono text-gray-900">{c.code}</td>
                            <td className="px-6 py-4 font-semibold text-indigo-600">{c.discount}</td>
                            <td className="px-6 py-4">{c.used}</td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{c.status}</span></td>
                            <td className="px-6 py-4 flex space-x-2"><button className="p-2 text-gray-500 hover:text-blue-600"><Edit size={16}/></button><button className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={16}/></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default DiscountCodesPage;
