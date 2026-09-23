import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCircle, 
  Home, Clock, AlertTriangle, 
  Heart, Link2, ShieldAlert, 
  Star, BarChart3, Bell, 
  Activity, Settings, LogOut,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 py-2 rounded-xl transition-all ${
      isCollapsed ? 'justify-center px-0' : 'px-4'
    } ${
      isActive 
        ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30' 
        : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
    }`;

  const renderSectionHeader = (title) => {
    if (isCollapsed) {
      return <div className="mt-4 mb-2 border-b border-white/10 w-8 mx-auto"></div>;
    }
    return (
      <div className="mt-4 mb-2 px-4 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">{title}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pt-8 pb-12 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar */}
        <motion.aside 
          initial={false}
          animate={{ width: isCollapsed ? 80 : 256 }}
          className="shrink-0 relative hidden md:block"
        >
          <div 
            className="bg-white/5 border border-white/10 rounded-2xl p-4 sticky top-8 overflow-y-auto max-h-[calc(100vh-60px)] custom-scrollbar"
            data-lenis-prevent="true"
          >
            
            <div className={`flex items-center mb-6 ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
              {!isCollapsed && (
                <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 truncate">
                  NestMate Admin
                </h2>
              )}
              
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-pink-400 transition-colors"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
            </div>
            
            <nav className="flex flex-col gap-1">
              <NavLink to="/admin/dashboard" className={navLinkClass} end title="Dashboard">
                <LayoutDashboard size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm truncate">Dashboard</span>}
              </NavLink>

              {renderSectionHeader('Users')}
              <NavLink to="/admin/students" className={navLinkClass} title="Students">
                <Users size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm truncate">Students</span>}
              </NavLink>
              <NavLink to="/admin/owners" className={navLinkClass} title="Owners">
                <UserCircle size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm truncate">Owners</span>}
              </NavLink>

              {renderSectionHeader('Properties')}
              <NavLink to="/admin/flats" className={navLinkClass} end title="All Flats">
                <Home size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm truncate">All Flats</span>}
              </NavLink>
              <NavLink to="/admin/flats/pending" className={navLinkClass} title="Pending Approval">
                <Clock size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm truncate">Pending Approval</span>}
              </NavLink>
              <NavLink to="/admin/flats/reported" className={navLinkClass} title="Reported Listings">
                <AlertTriangle size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm truncate">Reported Listings</span>}
              </NavLink>

              {renderSectionHeader('Matching')}
              <NavLink to="/admin/matches" className={navLinkClass} title="Matches">
                <Heart size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm truncate">Matches</span>}
              </NavLink>
              <NavLink to="/admin/connections" className={navLinkClass} title="Connections">
                <Link2 size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm truncate">Connections</span>}
              </NavLink>

              {renderSectionHeader('Moderation')}
              <NavLink to="/admin/reports" className={navLinkClass} title="Reports">
                <ShieldAlert size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm truncate">Reports</span>}
              </NavLink>
              <NavLink to="/admin/reviews" className={navLinkClass} title="Reviews">
                <Star size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm truncate">Reviews</span>}
              </NavLink>

              {renderSectionHeader('System')}
              <NavLink to="/admin/analytics" className={navLinkClass} title="Analytics">
                <BarChart3 size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm truncate">Analytics</span>}
              </NavLink>
              <NavLink to="/admin/notifications" className={navLinkClass} title="Notifications">
                <Bell size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm truncate">Notifications</span>}
              </NavLink>
              <NavLink to="/admin/activity" className={navLinkClass} title="Activity Log">
                <Activity size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm truncate">Activity Log</span>}
              </NavLink>
              <NavLink to="/admin/settings" className={navLinkClass} title="Settings">
                <Settings size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm truncate">Settings</span>}
              </NavLink>

              <div className="my-4 border-t border-white/10"></div>
              
              <button 
                onClick={handleLogout} 
                className={`flex items-center gap-3 py-2 rounded-xl transition-all text-white/60 hover:text-red-400 hover:bg-red-500/10 border border-transparent ${isCollapsed ? 'justify-center px-0' : 'text-left px-4'}`}
                title="Logout"
              >
                <LogOut size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm truncate">Logout</span>}
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
