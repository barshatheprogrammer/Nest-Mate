import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Eye, Ban, CheckCircle, SearchX } from 'lucide-react';
import api from '../../services/api';

const AdminOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users?role=owner&page=${page}&search=${searchTerm}&status=${filterStatus}`);
      setOwners(res.data.users);
      setTotalPages(res.data.pages);
    } catch (error) {
      console.error("Failed to fetch owners", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, [page, filterStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOwners();
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to change this owner's status to ${newStatus}?`)) return;
    
    try {
      await api.put(`/admin/users/${id}/status`, { status: newStatus });
      fetchOwners(); // refresh
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Error updating status");
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Manage Owners</h1>
        
        {/* Actions Bar */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, or city..." 
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
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Owner</th>
                  <th className="p-4 font-medium">City</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Joined</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {loading ? (
                  <tr><td colSpan="6" className="p-8 text-center"><div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full mx-auto"></div></td></tr>
                ) : owners.length > 0 ? (
                  owners.map(owner => (
                    <tr key={owner._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={owner.profileImage !== 'default.jpg' ? owner.profileImage : `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.name)}&background=ec4899&color=fff`} alt={owner.name} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold">{owner.name}</p>
                            <p className="text-xs text-white/50">{owner.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-white/70">{owner.city || 'N/A'}</td>
                      <td className="p-4 text-white/70">{owner.phone || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          owner.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                          owner.status === 'suspended' ? 'bg-yellow-500/20 text-yellow-400' : 
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {owner.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-4 text-white/50">{new Date(owner.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {owner.status !== 'active' && (
                            <button onClick={() => handleStatusChange(owner._id, 'active')} className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition tooltip" title="Activate">
                              <CheckCircle size={16} />
                            </button>
                          )}
                          {owner.status !== 'suspended' && (
                            <button onClick={() => handleStatusChange(owner._id, 'suspended')} className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition tooltip" title="Suspend">
                              <Ban size={16} />
                            </button>
                          )}
                          {owner.status !== 'blocked' && (
                            <button onClick={() => handleStatusChange(owner._id, 'blocked')} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition tooltip" title="Block">
                              <Ban size={16} />
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
                      <p>No owners found.</p>
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

export default AdminOwners;
