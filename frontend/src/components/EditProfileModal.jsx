import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Save, User, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';

const EditProfileModal = ({ isOpen, onClose, currentProfile, currentUser, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    age: '',
    course: '',
    college: '',
    city: '',
    budgetMin: '',
    budgetMax: '',
    roomType: 'Any',
    foodPreference: 'Any',
    sleepSchedule: 'Flexible',
    studySchedule: 'Flexible',
    cleanliness: 'Average',
  });

  const [profileImage, setProfileImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && currentProfile && currentUser) {
      setFormData({
        name: currentUser.name || '',
        bio: currentProfile.bio || '',
        age: currentProfile.age || '',
        course: currentProfile.course || '',
        college: currentUser.college || '',
        city: currentUser.city || '',
        budgetMin: currentProfile.budgetMin || '',
        budgetMax: currentProfile.budgetMax || '',
        roomType: currentProfile.roomType || 'Any',
        foodPreference: currentProfile.foodPreference || 'Any',
        sleepSchedule: currentProfile.sleepSchedule || 'Flexible',
        studySchedule: currentProfile.studySchedule || 'Flexible',
        cleanliness: currentProfile.cleanliness || 'Average',
      });
      
      const img = currentUser.profileImage && currentUser.profileImage !== 'default.jpg' 
        ? currentUser.profileImage 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'User')}&background=ec4899&color=fff&size=150`;
      
      setProfileImage(currentUser.profileImage === 'default.jpg' ? '' : currentUser.profileImage);
      setPreviewImage(img);
    }
  }, [isOpen, currentProfile, currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = { ...formData };
      if (profileImage && profileImage.startsWith('data:image')) {
        payload.profileImage = profileImage;
      }

      const res = await axios.post('/profile', payload);
      onSaveSuccess(res.data); // Returns populated profile
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        ></motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#121212] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 bg-white/5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Settings className="text-pink-400" /> Edit Profile
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div 
            className="flex-1 overflow-y-auto p-6 custom-scrollbar"
            data-lenis-prevent="true"
          >
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <form id="editProfileForm" onSubmit={handleSubmit} className="space-y-8">
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer mb-4" onClick={() => fileInputRef.current.click()}>
                  <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden relative shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                      <Upload size={24} className="mb-1 text-pink-400" />
                      <span className="text-xs font-medium">Upload</span>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
                <p className="text-sm text-white/50">Click to change profile picture (Max 5MB)</p>
              </div>

              <div className="h-px bg-white/10 w-full"></div>

              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <User size={18} className="text-purple-400" /> Basic Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white/70 ml-1">Full Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white/70 ml-1">Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white/70 ml-1">College/University</label>
                    <input name="college" value={formData.college} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white/70 ml-1">Course</label>
                    <input name="course" value={formData.course} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-colors" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-white/70 ml-1">City/Location</label>
                    <input name="city" value={formData.city} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-colors" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-white/70 ml-1">Bio</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-colors resize-none placeholder-white/30" placeholder="Tell potential roommates about yourself..."></textarea>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10 w-full"></div>

              {/* Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Settings size={18} className="text-pink-400" /> Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white/70 ml-1">Min Budget (₹/mo)</label>
                    <input type="number" name="budgetMin" value={formData.budgetMin} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white/70 ml-1">Max Budget (₹/mo)</label>
                    <input type="number" name="budgetMax" value={formData.budgetMax} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-colors" />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white/70 ml-1">Room Type</label>
                    <select name="roomType" value={formData.roomType} onChange={handleChange} className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-pink-500 transition-colors">
                      <option value="Any">Any</option>
                      <option value="Single Room">Single Room</option>
                      <option value="Double Sharing">Double Sharing</option>
                      <option value="Triple+ Sharing">Triple+ Sharing</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white/70 ml-1">Food Preference</label>
                    <select name="foodPreference" value={formData.foodPreference} onChange={handleChange} className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-pink-500 transition-colors">
                      <option value="Any">Any</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white/70 ml-1">Sleep Schedule</label>
                    <select name="sleepSchedule" value={formData.sleepSchedule} onChange={handleChange} className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-pink-500 transition-colors">
                      <option value="Flexible">Flexible</option>
                      <option value="Early Bird (10 PM - 6 AM)">Early Bird (10 PM - 6 AM)</option>
                      <option value="Night Owl (2 AM - 10 AM)">Night Owl (2 AM - 10 AM)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white/70 ml-1">Study Schedule</label>
                    <select name="studySchedule" value={formData.studySchedule} onChange={handleChange} className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-pink-500 transition-colors">
                      <option value="Flexible">Flexible</option>
                      <option value="Quiet in Evenings">Quiet in Evenings</option>
                      <option value="Quiet in Mornings">Quiet in Mornings</option>
                      <option value="Always Quiet">Always Quiet</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-white/70 ml-1">Cleanliness</label>
                    <select name="cleanliness" value={formData.cleanliness} onChange={handleChange} className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-pink-500 transition-colors">
                      <option value="Average">Average</option>
                      <option value="Very Clean">Very Clean</option>
                      <option value="Messy">Messy</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 shrink-0 bg-white/5 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              form="editProfileForm"
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-pink-500/25 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><Save size={18} /> Save Changes</>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditProfileModal;
