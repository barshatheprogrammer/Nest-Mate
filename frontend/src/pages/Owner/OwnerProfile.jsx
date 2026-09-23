import React, { useContext, useState, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Mail, Phone, MapPin, Edit3, X, Image as ImageIcon, Upload, Trash2, Camera } from 'lucide-react';
import api from '../../services/api';

const OwnerProfile = () => {
  const { user, updateLocalUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const fileInputCoverRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await api.put('/owner/profile', { profileImage: reader.result });
        updateLocalUser(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to upload photo');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
    try {
      const res = await api.put('/owner/profile', { profileImage: 'default.jpg' });
      updateLocalUser(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to remove photo');
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await api.put('/owner/profile', { coverImage: reader.result });
        updateLocalUser(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to upload cover photo');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCover = async () => {
    try {
      const res = await api.put('/owner/profile', { coverImage: 'default_cover.jpg' });
      updateLocalUser(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to remove cover photo');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.put('/owner/profile', formData);
      updateLocalUser(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative">
        {/* Cover Photo */}
        <div 
          className="h-48 relative group cursor-pointer overflow-hidden" 
          onClick={() => setIsCoverModalOpen(true)}
        >
          {user.coverImage && user.coverImage !== 'default_cover.jpg' ? (
            <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-pink-600 to-purple-600"></div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="flex items-center gap-2 text-white font-medium bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
              <Camera size={18} /> Edit Cover Photo
            </span>
          </div>
        </div>

        <div className="px-8 pb-8 relative">
          <div 
            className="absolute -top-16 left-8 p-1 bg-black rounded-full cursor-pointer group"
            onClick={() => setIsPhotoModalOpen(true)}
          >
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-black">
              <img src={user.profileImage && user.profileImage !== 'default.jpg' ? user.profileImage : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ec4899&color=fff&size=150`} alt={user.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-xs font-semibold text-white">Change Photo</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/10"
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          </div>
          <div className="mt-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {user.name}
              <span className="bg-pink-500/20 text-pink-400 text-xs px-2 py-1 rounded-full uppercase tracking-wider font-semibold">Verified Owner</span>
            </h1>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-white/70 bg-white/5 p-4 rounded-xl">
                <Mail className="text-pink-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-white/70 bg-white/5 p-4 rounded-xl">
                <Phone className="text-pink-400" />
                <span>{user.phone || 'Phone number not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-white/70 bg-white/5 p-4 rounded-xl">
                <MapPin className="text-pink-400" />
                <span>{user.city || 'City not specified'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/5 p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm focus:border-pink-500 focus:outline-none" required />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm focus:border-pink-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm focus:border-pink-500 focus:outline-none" />
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-3 rounded-xl transition-all mt-6 disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Photo Options Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setIsPhotoModalOpen(false)}>
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-64 p-4 flex flex-col gap-3 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-white/70 mb-1 text-center">Profile Photo</h3>
            <button onClick={() => { fileInputRef.current?.click(); setIsPhotoModalOpen(false); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors">
              <Upload size={16} /> Upload Photo
            </button>
            <button onClick={() => { handleRemovePhoto(); setIsPhotoModalOpen(false); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-medium transition-colors">
              <Trash2 size={16} /> Remove Photo
            </button>
          </div>
        </div>
      )}

      {/* Cover Photo Options Modal */}
      {isCoverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setIsCoverModalOpen(false)}>
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-64 p-4 flex flex-col gap-3 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-white/70 mb-1 text-center">Cover Photo</h3>
            <button onClick={() => { fileInputCoverRef.current?.click(); setIsCoverModalOpen(false); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors">
              <Upload size={16} /> Upload Cover
            </button>
            <button onClick={() => { handleRemoveCover(); setIsCoverModalOpen(false); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-medium transition-colors">
              <Trash2 size={16} /> Remove Cover
            </button>
          </div>
        </div>
      )}
      
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
      <input type="file" ref={fileInputCoverRef} className="hidden" accept="image/*" onChange={handleCoverUpload} />
    </div>
  );
};

export default OwnerProfile;
