import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, Search, Home, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

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
          <p className="text-white/50 text-lg">Here's what's happening with your room searches.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Find Roommates Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group cursor-pointer"
          >
            <div className="w-14 h-14 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 text-pink-400 group-hover:scale-110 transition-transform">
              <Users size={28} />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Find Roommates</h3>
            <p className="text-white/50 mb-6">Connect with people who share your lifestyle and preferences.</p>
            <div className="flex items-center text-pink-400 font-medium">
              Start matching <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Browse Rooms Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group cursor-pointer"
          >
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
              <Home size={28} />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Browse Rooms</h3>
            <p className="text-white/50 mb-6">Explore available listings that match your criteria.</p>
            <div className="flex items-center text-purple-400 font-medium">
              View listings <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Complete Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group"
          >
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <Search size={28} />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Your Profile</h3>
            <p className="text-white/50 mb-6">Update your preferences to get better roommate matches.</p>
            <Link to="/profile" className="flex items-center text-blue-400 font-medium hover:text-blue-300">
              Update profile <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
