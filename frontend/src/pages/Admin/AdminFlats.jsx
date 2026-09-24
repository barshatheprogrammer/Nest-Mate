import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle, XCircle, SearchX, MapPin, Eye } from 'lucide-react';
import api from '../../services/api';

const AdminFlats = () => {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFlats = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/flats?page=${page}&search=${searchTerm}&status=${filterStatus}`);
      setFlats(res.data.flats);
      setTotalPages(res.data.pages);
    } catch (error) {
      console.error("Failed to fetch flats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlats();
  }, [page, filterStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchFlats();
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this flat?`)) return;
    
    try {
      await api.put(`/admin/flats/${id}/status`, { status: newStatus });
      fetchFlats();
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Error updating status");
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          All Flats
        </h1>
        
        {/* Actions Bar */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Search by title or location..." 
              className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-pink-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          
            <div className="flex gap-4 w-full md:w-auto">
              <select 
                className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white/70 focus:outline-none focus:border-pink-500"
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium min-w-[250px]">Flat Details</th>
                  <th className="p-4 font-medium">Owner</th>
                  <th className="p-4 font-medium">Rent</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Submitted</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {loading ? (
                  <tr><td colSpan="6" className="p-8 text-center"><div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full mx-auto"></div></td></tr>
                ) : flats.length > 0 ? (
                  flats.map(flat => (
                    <tr key={flat._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={flat.images?.[0] || 'https://via.placeholder.com/150'} alt={flat.title} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-semibold text-white/90">{flat.title}</p>
                            <p className="text-xs text-white/50 flex items-center gap-1 mt-1"><MapPin size={12} /> {flat.location}, {flat.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-white/80">{flat.ownerId?.name || 'Unknown'}</p>
                        <p className="text-xs text-white/50">{flat.ownerId?.email}</p>
                      </td>
                      <td className="p-4 font-semibold text-pink-400">₹{flat.monthlyRent}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          flat.status === 'approved' ? 'bg-green-500/20 text-green-400' : 
                          flat.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                          flat.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {flat.status}
                        </span>
                      </td>
                      <td className="p-4 text-white/50">{new Date(flat.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/flats/${flat._id}`} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition tooltip" title="View Public Page">
                            <Eye size={16} />
                          </Link>
                          {flat.status !== 'approved' && (
                            <button onClick={() => handleStatusChange(flat._id, 'approved')} className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition tooltip" title="Approve">
                              <CheckCircle size={16} />
                            </button>
                          )}
                          {flat.status !== 'rejected' && (
                            <button onClick={() => handleStatusChange(flat._id, 'rejected')} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition tooltip" title="Reject">
                              <XCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-white/40">
                      <SearchX size={32} className="mx-auto mb-3 opacity-50" />
                      <p>No flats found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-white/10 flex justify-between items-center bg-black/20">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white/5 rounded-lg text-sm disabled:opacity-50 hover:bg-white/10"
              >
                Previous
              </button>
              <span className="text-sm text-white/50">Page {page} of {totalPages}</span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white/5 rounded-lg text-sm disabled:opacity-50 hover:bg-white/10"
              >
                Next
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminFlats;
