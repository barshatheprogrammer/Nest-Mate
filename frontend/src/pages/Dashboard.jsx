import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Users, Inbox, MessageSquare, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    matches: 0,
    requests: 0,
  });

  useEffect(() => {
    if (user) {
      // Fetch some quick stats if possible, otherwise leave as 0
      api.get('/requests/received').then(res => {
        setStats(prev => ({ ...prev, requests: res.data.length }));
      }).catch(err => console.log(err));

      api.get('/matches').then(res => {
        setStats(prev => ({ ...prev, matches: res.data.length }));
      }).catch(err => console.log(err));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-pink-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-2">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-white/50 text-lg">Here's your NestMate dashboard.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Explore Flats */}
          <Link to="/explore">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group h-full flex flex-col"
            >
              <div className="w-14 h-14 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 text-pink-400 group-hover:scale-110 transition-transform">
                <Home size={28} />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Explore Flats</h3>
              <p className="text-white/50 mb-6 flex-1">Find your ideal flat and express your interest.</p>
              <div className="flex items-center text-pink-400 font-medium">
                Browse <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>

          {/* Roommate Matches */}
          <Link to="/matches">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group h-full flex flex-col relative"
            >
              {stats.matches > 0 && (
                <div className="absolute top-6 right-6 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-purple-500/30">
                  {stats.matches}
                </div>
              )}
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Matches</h3>
              <p className="text-white/50 mb-6 flex-1">Review students highly compatible with you.</p>
              <div className="flex items-center text-purple-400 font-medium">
                View Matches <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>

          {/* Connection Requests */}
          <Link to="/requests">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group h-full flex flex-col relative"
            >
              {stats.requests > 0 && (
                <div className="absolute top-6 right-6 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/30">
                  {stats.requests}
                </div>
              )}
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                <Inbox size={28} />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Requests</h3>
              <p className="text-white/50 mb-6 flex-1">Manage incoming connection requests.</p>
              <div className="flex items-center text-blue-400 font-medium">
                Review <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>

          {/* Messages */}
          <Link to="/messages">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group h-full flex flex-col"
            >
              <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Messages</h3>
              <p className="text-white/50 mb-6 flex-1">Chat with your potential roommates.</p>
              <div className="flex items-center text-green-400 font-medium">
                Open Chat <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
