import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Home, CheckCircle, Clock, Users } from 'lucide-react';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({ total: 0, active: 0, interested: 0 });
  const [recentFlats, setRecentFlats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const flatsRes = await api.get(`/owner/flats?t=${new Date().getTime()}`);
        const interestsRes = await api.get(`/owner/interests?t=${new Date().getTime()}`);
        const flats = flatsRes.data;
        const interests = interestsRes.data;
        
        setStats({
          total: flats.length,
          active: flats.filter(f => f.status === 'approved').length,
          interested: interests.length
        });
        
        setRecentFlats(flats.slice(0, 4)); // Show up to 4 recent flats
      } catch (err) {
        console.error("Failed to fetch owner stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Owner Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center gap-4">
            <div className="p-3 bg-pink-500/20 rounded-lg text-pink-500"><Home /></div>
            <div>
              <p className="text-white/50 text-sm">Total Flats</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg text-green-500"><CheckCircle /></div>
            <div>
              <p className="text-white/50 text-sm">Active Listings</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-500"><Users /></div>
            <div>
              <p className="text-white/50 text-sm">Interested Students</p>
              <p className="text-2xl font-bold">{stats.interested}</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Home className="text-pink-400" size={20} /> Recent Listings
          </h2>
          {recentFlats.length > 0 ? (
            <div className="space-y-4">
              {recentFlats.map(flat => (
                <div key={flat._id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-center hover:bg-white/10 transition-colors">
                  <img src={flat.images?.[0] || 'https://via.placeholder.com/150'} alt={flat.title} className="w-full md:w-32 h-24 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{flat.title}</h3>
                    <p className="text-white/50 text-sm mt-1">{flat.location}, {flat.city}</p>
                    <div className="mt-2 text-sm flex gap-3">
                      <span className={`px-2 py-0.5 rounded text-xs flex items-center font-medium ${flat.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {flat.status.charAt(0).toUpperCase() + flat.status.slice(1)}
                      </span>
                      <span className="text-white/70 text-xs py-0.5">{flat.bhk} BHK</span>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center shrink-0">
                     <div className="text-right">
                       <p className="text-xs text-white/50 mb-1">Monthly Rent</p>
                       <p className="text-pink-400 font-bold text-lg">₹{flat.monthlyRent}</p>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isLoading ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white/60 font-medium">Loading dashboard...</p>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center flex flex-col items-center">
              <Home size={40} className="text-white/20 mb-4" />
              <p className="text-white/60 font-medium">No flats added yet.</p>
              <p className="text-white/40 text-sm mt-1">When you add flats, they will appear here dynamically.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
