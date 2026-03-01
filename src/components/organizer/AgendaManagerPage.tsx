import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Edit, Trash2, Clock, User, Coffee, Award, Search, Filter } from 'lucide-react';

interface AgendaItem {
  id: string;
  time: string;
  title: string;
  type: 'session' | 'keynote' | 'break' | 'networking';
  speaker?: string;
  room: string;
  description: string;
}

const mockAgenda: AgendaItem[] = [
  { id: '1', time: '09:00 AM', title: 'Registration & Welcome Coffee', type: 'networking', room: 'Main Lobby', description: 'Check-in and network with fellow attendees.' },
  { id: '2', time: '10:00 AM', title: 'Opening Keynote: The Future of Tech', type: 'keynote', speaker: 'Zawadi Thandwe', room: 'Main Auditorium', description: 'A look into the next decade of technology.' },
  { id: '3', time: '11:00 AM', title: 'Coffee Break', type: 'break', room: 'Exhibition Hall', description: 'Enjoy refreshments and visit sponsor booths.' },
  { id: '4', time: '11:30 AM', title: 'Panel: AI in Business', type: 'session', speaker: 'Ejiro Rudo & Panel', room: 'Room A', description: 'Experts discuss the impact of AI on modern business.' },
  { id: '5', time: '01:00 PM', title: 'Lunch & Networking', type: 'networking', room: 'Dining Hall', description: 'Enjoy a catered lunch and make new connections.' },
];

const AgendaManagerPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const [agenda, setAgenda] = useState<AgendaItem[]>(mockAgenda);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);

  React.useEffect(() => {
    setBreadcrumbs(['Agenda Manager']);
  }, [setBreadcrumbs]);

  const getIconForType = (type: AgendaItem['type']) => {
    switch (type) {
      case 'session': return <User className="w-5 h-5 text-blue-600" />;
      case 'keynote': return <Award className="w-5 h-5 text-purple-600" />;
      case 'break': return <Coffee className="w-5 h-5 text-orange-600" />;
      case 'networking': return <Users className="w-5 h-5 text-green-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Agenda Manager</h1>
          <button
            onClick={() => { setEditingItem(null); setShowModal(true); }}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus size={16} />
            <span>Add Agenda Item</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="space-y-4">
            {agenda.sort((a, b) => a.time.localeCompare(b.time)).map(item => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  {getIconForType(item.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900">{item.time}</span>
                      <span className="ml-4 text-sm font-medium text-indigo-600 capitalize">{item.type}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => { setEditingItem(item); setShowModal(true); }} className="p-2 text-gray-500 hover:text-blue-600"><Edit size={16} /></button>
                      <button className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">{item.title}</h3>
                  {item.speaker && <p className="text-sm text-gray-600">Speaker: {item.speaker}</p>}
                  <p className="text-sm text-gray-600">Location: {item.room}</p>
                  <p className="text-sm text-gray-500 mt-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaManagerPage;
