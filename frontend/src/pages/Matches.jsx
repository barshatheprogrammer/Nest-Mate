import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Home, ArrowRight, UserCheck } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Matches = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMatches = async () => {
      try {
        const { data } = await api.get('/matches');
        setMatches(data);
      } catch (err) {
        console.error("Error fetching matches", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [user, navigate]);

  const handleSendRequest = async (match) => {
    try {
      await api.post('/requests', {
        receiverId: match.matchedUser._id,
        flatId: match.flat._id,
        matchId: match._id,
        compatibilityScore: match.overallScore
      });
      alert('Request sent successfully!');
      // Update local state to reflect requested status
      setMatches(matches.map(m => m._id === match._id ? { ...m, status: 'requested' } : m));
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending request');
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex justify-center items-center">Loading matches...</div>;

  return (
    <div className="min-h-screen bg-black text-white pb-20 pt-12 relative overflow-hidden">
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="mb-12">
          <p className="text-pink-500 font-semibold tracking-wider text-sm mb-2 uppercase">Your Connections</p>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-400 mb-4">
            Roommate Matches
          </h1>
          <p className="text-white/60 text-lg">
            Review students who are highly compatible with you for the flats you are interested in.
          </p>
        </div>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match, idx) => (
              <motion.div 
                key={match._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden"
              >
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-pink-500/20 blur-2xl rounded-full" />
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <img src={match.matchedUser.profileImage || 'https://via.placeholder.com/150'} alt={match.matchedUser.name} className="w-16 h-16 rounded-full border-2 border-pink-500 object-cover" />
                    <div>
                      <h3 className="text-xl font-bold">{match.matchedUser.name}</h3>
                      <p className="text-white/60 text-sm">{match.matchedUser.college}</p>
                    </div>
                  </div>
                  <div className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-center">
                    <span className="block text-2xl font-bold text-green-400">{match.overallScore}%</span>
                    <span className="text-[10px] uppercase tracking-wider text-white/50">Match</span>
                  </div>
                </div>

                <div className="bg-black/30 rounded-2xl p-4 mb-6">
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <Home size={16} className="text-pink-400" />
                    <span className="font-medium">Interested in:</span>
                    <span className="truncate">{match.flat.title}, {match.flat.location}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl transition text-sm font-medium border border-white/10">
                    View Profile
                  </button>
                  {match.status === 'requested' ? (
                     <button disabled className="flex-1 bg-white/10 text-white/50 py-3 rounded-xl text-sm font-medium cursor-not-allowed">
                       Request Sent
                     </button>
                  ) : match.status === 'connected' ? (
                     <button className="flex-1 bg-green-500/20 text-green-400 border border-green-500/30 py-3 rounded-xl text-sm font-medium">
                       Connected
                     </button>
                  ) : (
                     <button 
                       onClick={() => handleSendRequest(match)}
                       className="flex-1 bg-pink-600 hover:bg-pink-700 py-3 rounded-xl transition text-sm font-medium shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2"
                     >
                       Send Request <ArrowRight size={16} />
                     </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <Users size={48} className="mx-auto text-white/20 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Matches Yet</h3>
            <p className="text-white/50 mb-6">Express interest in flats and select "I Need a Roommate" to get matched!</p>
            <Link to="/explore" className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-xl transition inline-block font-medium">
              Explore Flats
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
