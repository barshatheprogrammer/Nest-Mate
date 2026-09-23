import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, DollarSign, Home, Check, Users, ArrowLeft, Shield, Calendar, X } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { mockFlats } from '../data/mockFlats';

const FlatDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [flat, setFlat] = useState(null);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interestStatus, setInterestStatus] = useState(null);
  
  const [showRoommateModal, setShowRoommateModal] = useState(false);
  const [roommatePrefs, setRoommatePrefs] = useState({
    budget: '',
    foodPreference: 'Any',
    smoking: 'Any',
    drinking: 'Any',
    pets: 'Any',
    studySchedule: 'Any',
    sleepSchedule: 'Any',
    cleanliness: 'Moderate',
    socialPreference: 'Balanced'
  });

  useEffect(() => {
    const fetchFlatData = async () => {
      try {
        setLoading(true);
        // Try real API first
        const { data: flatData } = await api.get(`/flats/${id}`);
        setFlat(flatData);

        if (user) {
          const { data: usersData } = await api.get(`/flats/${id}/interested-users`);
          setInterestedUsers(usersData);
          
          const { data: myInterests } = await api.get(`/flats/my-interests`);
          const existing = myInterests.find(i => i.flatId?._id === id || i.flatId === id);
          if (existing) setInterestStatus(existing.status);
        }
      } catch (error) {
        console.error("Error fetching flat details, falling back to mock", error);
        const mockFlat = mockFlats.find(f => f._id === id);
        setFlat(mockFlat);
        // Mock some interested users for demo
        if (user) {
          setInterestedUsers([
             { _id: 'u1', userId: { _id: 'mock1', name: 'Ananya Sharma', college: 'Panjab University', city: 'Chandigarh' } }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlatData();
  }, [id, user]);

  const handleImInterested = async () => {
    if (!user) return alert("Please login first");
    try {
      await api.post(`/flats/${id}/interest`, { lookingForRoommate: false });
      setInterestStatus('interested');
      alert("Interest saved!");
    } catch (err) {
      alert("Error saving interest");
    }
  };

  const handleNeedRoommateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/flats/${id}/interest`, { 
        lookingForRoommate: true,
        roommateRequirements: roommatePrefs
      });
      setInterestStatus('looking_for_roommate');
      setShowRoommateModal(false);
      alert("Roommate preferences saved! We will notify you of matches.");
    } catch (err) {
      alert("Error saving roommate preferences");
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  if (!flat) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Flat not found</div>;

  return (
    <div className="min-h-screen bg-black text-white pb-20 pt-8 relative">
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <Link to="/explore" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 transition">
          <ArrowLeft size={18} /> Back to Explore
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="w-full h-[400px] rounded-2xl overflow-hidden relative">
             <img src={flat.images?.[0] || 'https://via.placeholder.com/800x600'} alt={flat.title} className="w-full h-full object-cover" />
             <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                 <span className="text-sm font-semibold text-white">{flat.furnished}</span>
             </div>
          </div>
          
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{flat.title}</h1>
            <p className="text-pink-400 text-lg flex items-center gap-2 mb-6">
              <MapPin size={20} /> {flat.location}, {flat.city}
            </p>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex flex-wrap gap-6">
               <div>
                  <p className="text-white/50 text-sm mb-1">Monthly Rent</p>
                  <p className="text-2xl font-bold">₹{flat.monthlyRent}</p>
               </div>
               {flat.securityDeposit && (
                 <div>
                    <p className="text-white/50 text-sm mb-1">Security Deposit</p>
                    <p className="text-2xl font-bold">₹{flat.securityDeposit}</p>
                 </div>
               )}
               <div>
                  <p className="text-white/50 text-sm mb-1">Roommates Needed</p>
                  <p className="text-2xl font-bold text-pink-400">{flat.roommatesNeeded}</p>
               </div>
            </div>

            <div className="flex flex-wrap gap-4">
               {interestStatus === 'looking_for_roommate' ? (
                 <div className="w-full bg-green-500/20 text-green-400 border border-green-500/30 py-3 px-6 rounded-xl text-center font-medium">
                   You are looking for a roommate here
                 </div>
               ) : interestStatus === 'interested' ? (
                 <>
                   <div className="w-full md:w-auto bg-pink-500/20 text-pink-400 border border-pink-500/30 py-3 px-6 rounded-xl text-center font-medium">
                     Interest Saved
                   </div>
                   <button onClick={() => setShowRoommateModal(true)} className="flex-1 bg-pink-600 hover:bg-pink-700 py-3 px-6 rounded-xl font-medium transition">
                     I Need a Roommate
                   </button>
                 </>
               ) : (
                 <>
                   <button onClick={handleImInterested} className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 py-3 px-6 rounded-xl font-medium transition">
                     I'm Interested
                   </button>
                   <button onClick={() => setShowRoommateModal(true)} className="flex-1 bg-pink-600 hover:bg-pink-700 py-3 px-6 rounded-xl font-medium transition shadow-lg shadow-pink-500/25">
                     I Need a Roommate
                   </button>
                 </>
               )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-4">About this flat</h2>
              <p className="text-white/70 leading-relaxed mb-6">{flat.description}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-t border-white/10">
                 <div>
                   <p className="text-white/50 text-sm mb-1">BHK</p>
                   <p className="font-semibold">{flat.bhk} BHK</p>
                 </div>
                 <div>
                   <p className="text-white/50 text-sm mb-1">Bedrooms</p>
                   <p className="font-semibold">{flat.bedrooms}</p>
                 </div>
                 <div>
                   <p className="text-white/50 text-sm mb-1">Bathrooms</p>
                   <p className="font-semibold">{flat.bathrooms}</p>
                 </div>
                 <div>
                   <p className="text-white/50 text-sm mb-1">Available</p>
                   <p className="font-semibold">{new Date(flat.availableFrom || Date.now()).toLocaleDateString()}</p>
                 </div>
              </div>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {flat.amenities?.map((am, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/80">
                    <Check size={18} className="text-pink-500" /> {am}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            {/* Owner Info */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Shield className="text-pink-400" /> Owner Information
              </h3>
              {flat.ownerId ? (
                <div className="flex items-center gap-4">
                  <img src={flat.ownerId.profileImage && flat.ownerId.profileImage !== 'default.jpg' ? flat.ownerId.profileImage : `https://ui-avatars.com/api/?name=${encodeURIComponent(flat.ownerId.name || 'Owner')}&background=ec4899&color=fff`} alt={flat.ownerId.name} className="w-12 h-12 rounded-full border border-white/20 object-cover" />
                  <div>
                    <p className="font-bold text-lg">{flat.ownerId.name}</p>
                    <p className="text-pink-400 text-[10px] font-semibold uppercase tracking-wider bg-pink-500/10 px-2 py-0.5 rounded inline-block mt-1">Verified Owner</p>
                  </div>
                </div>
              ) : (
                <p className="text-white/50 text-sm">Owner details not available.</p>
              )}
            </div>

            <div className="bg-gradient-to-b from-pink-900/40 to-black border border-pink-500/20 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Users className="text-pink-400" /> Students Looking
              </h3>
              <p className="text-white/60 text-sm mb-6">These students are also interested in this flat and looking for a roommate.</p>
              
              <div className="space-y-4">
                {interestedUsers.length > 0 ? interestedUsers.map((interest, idx) => (
                  <div key={idx} className="bg-black/50 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold shrink-0">
                      {interest.userId?.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{interest.userId?.name}</p>
                      <p className="text-xs text-white/50">{interest.userId?.college}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-white/40 text-sm text-center py-4">No students are currently looking for a roommate for this flat.</p>
                )}
              </div>
              
              {interestedUsers.length > 0 && user && (
                <Link to="/matches" className="block w-full text-center mt-6 text-pink-400 text-sm hover:text-pink-300 transition">
                  View your compatibility matches →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Roommate Modal */}
      <AnimatePresence>
        {showRoommateModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#121212] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-[#121212]/90 backdrop-blur-md p-6 border-b border-white/10 flex justify-between items-center z-10">
                <h3 className="text-xl font-bold">I Need a Roommate</h3>
                <button onClick={() => setShowRoommateModal(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleNeedRoommateSubmit} className="p-6 space-y-6">
                <p className="text-white/60 text-sm">Tell us about your ideal roommate for this flat so we can match you with compatible students.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Food Preference</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-pink-500 outline-none"
                            value={roommatePrefs.foodPreference} onChange={e => setRoommatePrefs({...roommatePrefs, foodPreference: e.target.value})}>
                      <option value="Any">Any</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Smoking</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-pink-500 outline-none"
                            value={roommatePrefs.smoking} onChange={e => setRoommatePrefs({...roommatePrefs, smoking: e.target.value})}>
                      <option value="Any">Any</option>
                      <option value="Yes">Smoker ok</option>
                      <option value="No">Non-smoker only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Sleep Schedule</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-pink-500 outline-none"
                            value={roommatePrefs.sleepSchedule} onChange={e => setRoommatePrefs({...roommatePrefs, sleepSchedule: e.target.value})}>
                      <option value="Any">Any</option>
                      <option value="Early Sleeper">Early Sleeper</option>
                      <option value="Late Sleeper">Late Sleeper</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Cleanliness</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-pink-500 outline-none"
                            value={roommatePrefs.cleanliness} onChange={e => setRoommatePrefs({...roommatePrefs, cleanliness: e.target.value})}>
                      <option value="Any">Any</option>
                      <option value="Low">Low</option>
                      <option value="Moderate">Moderate</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setShowRoommateModal(false)} className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl transition">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 bg-pink-600 hover:bg-pink-700 py-3 rounded-xl transition shadow-lg shadow-pink-500/25">
                    Find My Match
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlatDetails;
