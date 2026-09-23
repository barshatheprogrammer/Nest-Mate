import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Home, PlusSquare, Users, User } from 'lucide-react';
import { motion } from 'motion/react';

const OwnerLayout = () => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      isActive 
        ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30' 
        : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
    }`;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-64 shrink-0"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sticky top-28">
            <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-6 px-4">Owner Portal</h2>
            
            <nav className="flex flex-col gap-2">
              <NavLink to="/owner/dashboard" className={navLinkClass}>
                <LayoutDashboard size={20} />
                <span className="font-medium">Dashboard</span>
              </NavLink>
              
              <NavLink to="/owner/flats" end className={navLinkClass}>
                <Home size={20} />
                <span className="font-medium">My Flats</span>
              </NavLink>
              
              <NavLink to="/owner/flats/add" className={navLinkClass}>
                <PlusSquare size={20} />
                <span className="font-medium">Add Flat</span>
              </NavLink>
              
              <NavLink to="/owner/interests" className={navLinkClass}>
                <Users size={20} />
                <span className="font-medium">Interests</span>
              </NavLink>
              
              <div className="my-2 border-t border-white/10"></div>
              
              <NavLink to="/owner/profile" className={navLinkClass}>
                <User size={20} />
                <span className="font-medium">Profile</span>
              </NavLink>
            </nav>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </div>
        
      </div>
    </div>
  );
};

export default OwnerLayout;
