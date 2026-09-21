import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { mockRoommates } from '../data/mockRoommates';
import { ArrowLeft, MapPin, DollarSign, Home, Book, Coffee, Check, Clock, User, Briefcase, Cigarette } from 'lucide-react';

const RoommateProfile = () => {
  const { id } = useParams();
  const [roommate, setRoommate] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('none'); // 'none', 'sent', 'connected'
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    const found = mockRoommates.find(r => r.id === id);
    setRoommate(found);
  }, [id]);

  const handleConnect = () => {
    if (connectionStatus === 'none') {
      setConnectionStatus('sent');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  if (!roommate) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/50">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-8 pb-20 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-6 z-50 animate-fade-in-down">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-2">
            <Check size={18} />
            <span className="font-medium">Connection request sent successfully.</span>
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        <Link to="/explore" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Explore
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center sticky top-28">
              <div className="relative w-40 h-40 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full animate-spin-slow blur-md opacity-50"></div>
                <img 
                  src={roommate.image} 
                  alt={roommate.name} 
                  className="relative w-40 h-40 rounded-full object-cover border-4 border-black z-10"
                />
              </div>
              <h1 className="text-3xl font-bold mb-1">{roommate.name}</h1>
              <p className="text-pink-400 font-medium mb-2">{roommate.age} years old</p>
              <p className="text-white/50 text-sm mb-6">{roommate.location}, {roommate.city}</p>

              <div className="space-y-3 pt-6 border-t border-white/10">
                {connectionStatus === 'none' && (
                  <button 
                    onClick={handleConnect}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-medium shadow-lg shadow-pink-500/25 transition-all"
                  >
                    Connect
                  </button>
                )}
                {connectionStatus === 'sent' && (
                  <button 
                    disabled
                    className="w-full bg-white/10 border border-white/20 text-white/50 py-3.5 rounded-xl font-medium cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Check size={18} /> Request Sent
                  </button>
                )}
                {connectionStatus === 'connected' && (
                  <>
                    <button 
                      className="w-full bg-green-500/20 text-green-400 border border-green-500/30 py-3.5 rounded-xl font-medium cursor-default"
                    >
                      Connected
                    </button>
                    <button 
                      className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white py-3.5 rounded-xl font-medium transition-all"
                    >
                      Message
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Details & Compatibility */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            
            {/* Compatibility Badge */}
            <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 shrink-0 bg-black rounded-full border-4 border-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                  {roommate.compatibility}%
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Compatibility Score</h2>
                <p className="text-white/70">
                  Based on your profile, you and {roommate.name} have a very high match rate. 
                  Below is a breakdown of where your preferences align and differ.
                </p>
              </div>
            </div>

            {/* About */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User size={20} className="text-pink-400" /> About {roommate.name}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {roommate.bio}
              </p>
            </div>

            {/* Academic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 shrink-0">
                  <Book size={24} />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">College</p>
                  <p className="font-medium">{roommate.college}</p>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                  <Briefcase size={24} />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Course</p>
                  <p className="font-medium">{roommate.course}</p>
                </div>
              </div>
            </div>

            {/* Lifestyle & Preferences Grid */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Home size={20} className="text-pink-400" /> Lifestyle & Preferences
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 shrink-0"><DollarSign size={18} /></div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Budget</p>
                    <p className="font-medium text-sm">₹{roommate.budgetMin} - ₹{roommate.budgetMax} /mo</p>
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0"><Home size={18} /></div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Room Type</p>
                    <p className="font-medium text-sm">{roommate.roomType}</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0"><Coffee size={18} /></div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Food</p>
                    <p className="font-medium text-sm">{roommate.foodPreference}</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 shrink-0"><Cigarette size={18} /></div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Smoking</p>
                    <p className="font-medium text-sm">{roommate.smoking === 'No' ? 'Non-Smoker' : roommate.smoking}</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0"><Clock size={18} /></div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Sleep Schedule</p>
                    <p className="font-medium text-sm">{roommate.sleepSchedule}</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0"><Check size={18} /></div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Cleanliness</p>
                    <p className="font-medium text-sm">{roommate.cleanliness}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Common vs Different Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <h3 className="text-lg font-semibold mb-4 text-green-400 flex items-center gap-2">
                  <Check size={18} /> Common Preferences
                </h3>
                {roommate.commonPreferences.length > 0 ? (
                  <ul className="space-y-3">
                    {roommate.commonPreferences.map((pref, i) => (
                      <li key={i} className="flex items-center gap-2 text-white/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> {pref}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white/50 text-sm">No common preferences found.</p>
                )}
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <h3 className="text-lg font-semibold mb-4 text-red-400 flex items-center gap-2">
                  <span className="font-bold text-xl leading-none">✕</span> Different Preferences
                </h3>
                {roommate.differentPreferences.length > 0 ? (
                  <ul className="space-y-3">
                    {roommate.differentPreferences.map((pref, i) => (
                      <li key={i} className="flex items-center gap-2 text-white/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {pref}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white/50 text-sm">No conflicting preferences!</p>
                )}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RoommateProfile;
