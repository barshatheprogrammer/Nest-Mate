import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, MapPin, Briefcase, Calendar, DollarSign, Home, Coffee, Clock, Book, Check, Settings, Edit3, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import EditProfileModal from '../components/EditProfileModal';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, loading: authLoading, updateLocalUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return; // Wait for AuthContext to finish checking/syncing user

    if (!user) {
      setError("Please log in to view your profile.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setError(null);
        const res = await axios.get('/profile');
        setProfile(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          // Do not set error for 404, let the UI show "Profile Not Setup"
          setProfile(null);
        } else {
          setError(err.response?.data?.message || 'Failed to fetch profile');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, authLoading]);

  const handleSaveSuccess = (updatedProfile) => {
    setProfile(updatedProfile);
    if (updatedProfile.user) {
      updateLocalUser({
        name: updatedProfile.user.name,
        profileImage: updatedProfile.user.profileImage,
        college: updatedProfile.user.college,
        city: updatedProfile.user.city
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-black text-white">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24 pb-20 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              My Profile
            </h1>
            <p className="text-white/50 mt-1">Manage your information and roommate preferences.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl px-5 py-2.5 flex items-center justify-center gap-2 transition-all"
          >
            <Settings size={18} /> Edit Profile
          </button>
        </motion.div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 max-w-3xl"
          >
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {!profile && !error ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center shadow-2xl max-w-2xl mx-auto mt-10"
          >
            <div className="w-24 h-24 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-400">
              <User size={48} />
            </div>
            <h2 className="text-2xl font-bold mb-3">Profile Not Setup</h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto">
              You haven't set up your roommate preferences yet. Complete your profile to start finding compatible roommates.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-pink-500/25 transition-all"
            >
              Create Profile
            </button>
          </motion.div>
        ) : profile ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Basic Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 space-y-8"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full animate-spin-slow blur-md opacity-50"></div>
                  <div 
                    className="relative w-32 h-32 rounded-full mx-auto z-10 group overflow-hidden border-4 border-black cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <img 
                      src={user?.profileImage && user.profileImage !== 'default.jpg' ? user.profileImage : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=ec4899&color=fff&size=150`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-xs font-semibold text-white">Change Photo</p>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-1">{user?.name || 'User'}</h2>
                <p className="text-pink-400 font-medium mb-6">{user?.college || 'University not set'}</p>
                
                <div className="space-y-4 text-left border-t border-white/10 pt-6">
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-pink-400">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-white/40">Course</p>
                      <p className="font-medium text-sm">{profile.course !== 'Not specified' ? profile.course : 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-purple-400">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-white/40">City / Location</p>
                      <p className="font-medium text-sm">{user?.city || 'City not set'} <span className="text-white/40">({profile.location !== 'Not specified' ? profile.location : 'Any area'})</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-400">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-white/40">Age</p>
                      <p className="font-medium text-sm">{profile.age ? `${profile.age} years old` : 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Right Column: Details & Preferences */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* About Me */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User size={20} className="text-pink-400" /> About Me
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {profile.bio || "No bio provided yet. Add a short bio to let potential roommates know more about you!"}
                </p>
              </div>

              {/* Preferences Grid */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Settings size={20} className="text-purple-400" /> Roommate Preferences
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pref 1 */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 shrink-0">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-0.5">Budget</p>
                      <p className="font-medium text-sm text-white/90">
                        {profile.budgetMin || profile.budgetMax ? `₹${profile.budgetMin} - ₹${profile.budgetMax}` : 'Not set'} <span className="text-white/40">/mo</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Pref 2 */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                      <Home size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-0.5">Room Type</p>
                      <p className="font-medium text-sm text-white/90 capitalize">{profile.roomType}</p>
                    </div>
                  </div>

                  {/* Pref 3 */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
                      <Coffee size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-0.5">Food</p>
                      <p className="font-medium text-sm text-white/90 capitalize">{profile.foodPreference}</p>
                    </div>
                  </div>

                  {/* Pref 4 */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-0.5">Sleep Schedule</p>
                      <p className="font-medium text-sm text-white/90 capitalize">{profile.sleepSchedule}</p>
                    </div>
                  </div>

                  {/* Pref 5 */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 shrink-0">
                      <Book size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-0.5">Study Schedule</p>
                      <p className="font-medium text-sm text-white/90 capitalize">{profile.studySchedule}</p>
                    </div>
                  </div>

                  {/* Pref 6 */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
                      <Check size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-0.5">Cleanliness</p>
                      <p className="font-medium text-sm text-white/90 capitalize">{profile.cleanliness}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentProfile={profile || {}}
        currentUser={user}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
};

export default Profile;
