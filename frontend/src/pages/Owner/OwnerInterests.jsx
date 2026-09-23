import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const OwnerInterests = () => {
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    api.get('/owner/interests').then(res => setInterests(res.data)).catch(console.error);
  }, []);

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Interested Students</h1>
        <div className="space-y-4">
          {interests.map(interest => (
            <div key={interest._id} className="bg-white/5 border border-white/10 p-5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={interest.userId?.profileImage || 'https://via.placeholder.com/50'} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-lg">{interest.userId?.name}</h3>
                  <p className="text-white/50 text-sm">{interest.userId?.college} • {interest.userId?.email}</p>
                  {interest.userId?.phone && <p className="text-white/50 text-sm">Phone: {interest.userId?.phone}</p>}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-pink-400">{interest.flatId?.title}</p>
                <p className="text-white/50 text-sm">₹{interest.flatId?.monthlyRent}/mo</p>
              </div>
            </div>
          ))}
          {interests.length === 0 && <div className="text-center text-white/50 py-12 bg-white/5 rounded-xl border border-white/10">No interested students yet.</div>}
        </div>
      </div>
    </div>
  );
};
export default OwnerInterests;
