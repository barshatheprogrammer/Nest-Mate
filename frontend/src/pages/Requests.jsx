import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Inbox, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Requests = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchRequests();
  }, [user, navigate]);

  const fetchRequests = async () => {
    try {
      const [receivedRes, sentRes] = await Promise.all([
        api.get('/requests/received'),
        api.get('/requests/sent')
      ]);
      setReceivedRequests(receivedRes.data);
      setSentRequests(sentRes.data);
    } catch (err) {
      console.error("Error fetching requests", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/requests/${id}`, { status });
      // Refresh requests
      fetchRequests();
    } catch (err) {
      alert("Error updating request status");
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex justify-center items-center">Loading requests...</div>;

  const displayRequests = activeTab === 'received' ? receivedRequests : sentRequests;

  return (
    <div className="min-h-screen bg-black text-white pb-20 pt-12 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Connection Requests</h1>

        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
          <button 
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'received' ? 'bg-pink-600 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            Received ({receivedRequests.length})
          </button>
          <button 
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'sent' ? 'bg-pink-600 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            Sent ({sentRequests.length})
          </button>
        </div>

        <div className="space-y-4">
          {displayRequests.length > 0 ? displayRequests.map((req, idx) => (
            <motion.div 
              key={req._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6"
            >
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-14 h-14 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-400 font-bold shrink-0">
                  {activeTab === 'received' ? req.senderId?.name?.[0] : req.receiverId?.name?.[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {activeTab === 'received' ? req.senderId?.name : req.receiverId?.name}
                  </h3>
                  <p className="text-white/60 text-sm">{req.flatId?.title}, {req.flatId?.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-center">
                   <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Status</p>
                   {req.status === 'pending' ? (
                     <span className="text-yellow-400 text-sm font-medium flex items-center gap-1"><Clock size={14}/> Pending</span>
                   ) : req.status === 'accepted' ? (
                     <span className="text-green-400 text-sm font-medium flex items-center gap-1"><CheckCircle size={14}/> Accepted</span>
                   ) : (
                     <span className="text-red-400 text-sm font-medium flex items-center gap-1"><XCircle size={14}/> Rejected</span>
                   )}
                </div>

                {activeTab === 'received' && req.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateStatus(req._id, 'accepted')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                      Accept
                    </button>
                    <button onClick={() => handleUpdateStatus(req._id, 'rejected')} className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 px-4 py-2 rounded-lg text-sm font-medium transition">
                      Decline
                    </button>
                  </div>
                )}
                
                {req.status === 'accepted' && (
                  <Link to="/messages" className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg shadow-pink-500/25">
                    Message
                  </Link>
                )}
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10">
              <Inbox size={40} className="mx-auto text-white/20 mb-4" />
              <p className="text-white/50">No {activeTab} requests found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;
