import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';

const OwnerFlats = () => {
  const [flats, setFlats] = useState([]);

  useEffect(() => {
    fetchFlats();
  }, []);

  const fetchFlats = async () => {
    try {
      const res = await api.get('/owner/flats');
      setFlats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this flat?')) {
      try {
        await api.delete(`/owner/flats/${id}`);
        fetchFlats();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">My Flats</h1>
          <Link to="/owner/flats/add" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={18} /> Add New Flat
          </Link>
        </div>

        <div className="space-y-4">
          {flats.map(flat => (
            <div key={flat._id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-center">
              <img src={flat.images?.[0] || 'https://via.placeholder.com/150'} alt={flat.title} className="w-full md:w-48 h-32 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="text-xl font-bold">{flat.title}</h3>
                <p className="text-white/50 flex items-center gap-1 my-1"><MapPin size={14}/> {flat.location}, {flat.city}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-pink-400 font-semibold">₹{flat.monthlyRent}/month</span>
                  <span className="text-white/70">{flat.bhk} BHK • {flat.bathrooms} Bath</span>
                  <span className={`px-2 rounded text-xs flex items-center ${flat.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {flat.status.charAt(0).toUpperCase() + flat.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0 shrink-0">
                <Link to={`/flats/${flat._id}`} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white">View</Link>
                <Link to={`/owner/flats/${flat._id}/edit`} className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg"><Edit size={18} /></Link>
                <button onClick={() => handleDelete(flat._id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
          {flats.length === 0 && (
            <div className="text-center py-12 text-white/50 bg-white/5 rounded-xl border border-white/10">
              No flats added yet. Click "Add New Flat" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerFlats;
