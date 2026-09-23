import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCircle, 
  Home, Clock, AlertTriangle, 
  Heart, Link2, ShieldAlert, 
  Star, BarChart3, Bell, 
  Activity, Settings, LogOut 
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@clerk/react'; // Assuming Clerk for SSO out, though AuthContext handles custom JWT

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
      isActive 
        ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30' 
        : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
    }`;

  const renderSectionHeader = (title) => (
    <div className="mt-4 mb-2 px-4">
      <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">{title}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-8 pb-12 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-64 shrink-0"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sticky top-8 overflow-y-auto max-h-[calc(100vh-60px)] custom-scrollbar">
            <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-6 px-4">NestMate Admin</h2>
            
            <nav className="flex flex-col gap-1">
              <NavLink to="/admin/dashboard" className={navLinkClass} end>
                <LayoutDashboard size={18} />
                <span className="font-medium text-sm">Dashboard</span>
              </NavLink>

              {renderSectionHeader('Users')}
              <NavLink to="/admin/students" className={navLinkClass}>
                <Users size={18} />
                <span className="font-medium text-sm">Students</span>
              </NavLink>
              <NavLink to="/admin/owners" className={navLinkClass}>
                <UserCircle size={18} />
                <span className="font-medium text-sm">Owners</span>
              </NavLink>

              {renderSectionHeader('Properties')}
              <NavLink to="/admin/flats" className={navLinkClass} end>
                <Home size={18} />
                <span className="font-medium text-sm">All Flats</span>
              </NavLink>
              <NavLink to="/admin/flats/pending" className={navLinkClass}>
                <Clock size={18} />
                <span className="font-medium text-sm">Pending Approval</span>
              </NavLink>
              <NavLink to="/admin/flats/reported" className={navLinkClass}>
                <AlertTriangle size={18} />
                <span className="font-medium text-sm">Reported Listings</span>
              </NavLink>

              {renderSectionHeader('Matching')}
              <NavLink to="/admin/matches" className={navLinkClass}>
                <Heart size={18} />
                <span className="font-medium text-sm">Matches</span>
              </NavLink>
              <NavLink to="/admin/connections" className={navLinkClass}>
                <Link2 size={18} />
                <span className="font-medium text-sm">Connections</span>
              </NavLink>

              {renderSectionHeader('Moderation')}
              <NavLink to="/admin/reports" className={navLinkClass}>
                <ShieldAlert size={18} />
                <span className="font-medium text-sm">Reports</span>
              </NavLink>
              <NavLink to="/admin/reviews" className={navLinkClass}>
                <Star size={18} />
                <span className="font-medium text-sm">Reviews</span>
              </NavLink>

              {renderSectionHeader('System')}
              <NavLink to="/admin/analytics" className={navLinkClass}>
                <BarChart3 size={18} />
                <span className="font-medium text-sm">Analytics</span>
              </NavLink>
              <NavLink to="/admin/notifications" className={navLinkClass}>
                <Bell size={18} />
                <span className="font-medium text-sm">Notifications</span>
              </NavLink>
              <NavLink to="/admin/activity" className={navLinkClass}>
                <Activity size={18} />
                <span className="font-medium text-sm">Activity Log</span>
              </NavLink>
              <NavLink to="/admin/settings" className={navLinkClass}>
                <Settings size={18} />
                <span className="font-medium text-sm">Settings</span>
              </NavLink>

              <div className="my-4 border-t border-white/10"></div>
              
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-white/60 hover:text-red-400 hover:bg-red-500/10 border border-transparent text-left">
                <LogOut size={18} />
                <span className="font-medium text-sm">Logout</span>
              </button>
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

export default AdminLayout;
