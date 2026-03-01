import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Edit, Trash2, MapPin, Users, Building } from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  image: string;
  type: 'Conference Center' | 'Hotel' | 'Outdoor Space' | 'Unique Venue';
}

const mockVenues: Venue[] = [
  { id: '1', name: 'Grand Conference Hall', address: '123 Main St', city: 'Metropolis', capacity: 2000, image: 'https://images.pexels.com/photos/260689/pexels-photo-260689.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'Conference Center' },
  { id: '2', name: 'The Lakeside Hotel', address: '456 Lakeview Dr', city: 'Metropolis', capacity: 500, image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'Hotel' },
  { id: '3', name: 'City Park Pavilion', address: '789 Central Park', city: 'Metropolis', capacity: 1000, image: 'https://images.pexels.com/photos/175658/pexels-photo-175658.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'Outdoor Space' },
];

const VenueManagerPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const [venues, setVenues] = useState<Venue[]>(mockVenues);

  React.useEffect(() => {
    setBreadcrumbs(['Venue Manager']);
  }, [setBreadcrumbs]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Venue Manager</h1>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus size={16} />
            <span>Add New Venue</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map(venue => (
            <div key={venue.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group">
              <img src={venue.image} alt={venue.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{venue.name}</h3>
                    <p className="text-sm text-gray-500">{venue.type}</p>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-500 hover:text-blue-600"><Edit size={16} /></button>
                    <button className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin size={14} />
                    <span>{venue.address}, {venue.city}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users size={14} />
                    <span>Capacity: {venue.capacity.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenueManagerPage;
