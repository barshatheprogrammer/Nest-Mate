import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const OwnerFlatForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '', description: '', location: '', city: '', monthlyRent: '', securityDeposit: '', bhk: '', bedrooms: '', bathrooms: '', furnished: 'Unfurnished', amenities: '', nearbyCollege: '', nearbyTransport: '', availableFrom: '', roommatesNeeded: 1, images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/owner/flats/${id}`).then(res => {
        setFormData({ ...res.data, amenities: res.data.amenities.join(', '), images: res.data.images || [], availableFrom: res.data.availableFrom ? res.data.availableFrom.split('T')[0] : '' });
      }).catch(console.error);
    }
  }, [id, isEdit]);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) return alert('An image is too large (max 5MB)');
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const payload = { ...formData, amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean), monthlyRent: Number(formData.monthlyRent), securityDeposit: Number(formData.securityDeposit), bhk: Number(formData.bhk), bedrooms: Number(formData.bedrooms), bathrooms: Number(formData.bathrooms), roommatesNeeded: Number(formData.roommatesNeeded) };
    try {
      if (isEdit) await api.put(`/owner/flats/${id}`, payload);
      else await api.post('/owner/flats', payload);
      navigate('/owner/flats');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Flat' : 'Add New Flat'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Flat Title" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg h-32" required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg" required />
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg" required />
            <input type="number" name="monthlyRent" value={formData.monthlyRent} onChange={handleChange} placeholder="Monthly Rent" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg" required />
            <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleChange} placeholder="Security Deposit" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg" />
            <input type="number" name="bhk" value={formData.bhk} onChange={handleChange} placeholder="BHK" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg" required />
            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="Bedrooms" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg" required />
            <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="Bathrooms" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg" required />
            <select name="furnished" value={formData.furnished} onChange={handleChange} className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white/70">
              <option value="Fully Furnished">Fully Furnished</option><option value="Semi Furnished">Semi Furnished</option><option value="Unfurnished">Unfurnished</option>
            </select>
          </div>
          <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="Amenities (comma separated)" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg" />
          
          <div>
            <label className="text-xs text-white/50 mb-2 block uppercase tracking-wider">Flat Images</label>
            <div className="flex flex-wrap gap-3">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/10 group">
                  <img src={img} alt="flat preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 rounded-lg border-2 border-dashed border-white/30 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-pink-500 transition-colors">
                <svg className="w-6 h-6 text-white/50 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <span className="text-[10px] text-white/50 uppercase font-medium">Upload</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="date" name="availableFrom" value={formData.availableFrom} onChange={handleChange} className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white/70" />
            <input type="number" name="roommatesNeeded" value={formData.roommatesNeeded} onChange={handleChange} placeholder="Roommates Needed" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg" required min="1"/>
          </div>
          <button disabled={isSubmitting} type="submit" className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 p-3 rounded-lg font-bold transition-all disabled:opacity-50">
            {isSubmitting ? 'Saving...' : (isEdit ? 'Update Flat' : 'Create Flat')}
          </button>
        </form>
      </div>
    </div>
  );
};
export default OwnerFlatForm;
