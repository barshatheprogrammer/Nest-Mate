import React, { useContext, useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/react';
import { AuthContext } from '../context/AuthContext';
import { Search, Bell, Settings, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    logout();
    await signOut();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 transition-colors ${
      isActive ? 'text-pink-400 font-semibold' : 'hover:text-pink-400'
    }`;

  const navLinkStyle = { color: 'var(--color-text-main)' };

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/40 backdrop-blur-2xl border-b border-white/10">
      <div className="container mx-auto px-6 flex justify-between items-center py-2">
        {/* Left: Logo */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-center" style={{ color: 'var(--color-primary)' }}>
            <img src="/assets/nestmate-logo.png" alt="NestMate Logo" className="h-16 object-contain" />
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-6">
          {user ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass} style={navLinkStyle}>
                Dashboard
              </NavLink>
              <NavLink to="/explore" className={navLinkClass} style={navLinkStyle}>
                Explore
              </NavLink>
              <NavLink to="/matches" className={navLinkClass} style={navLinkStyle}>
                Matches
              </NavLink>
              <NavLink to="/requests" className={navLinkClass} style={navLinkStyle}>
                Requests
              </NavLink>
              <NavLink to="/messages" className={navLinkClass} style={navLinkStyle}>
                Messages
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className={navLinkClass} style={navLinkStyle} end>
                Home
              </NavLink>
              <NavLink to="/explore" className={navLinkClass} style={navLinkStyle}>
                Explore
              </NavLink>
              <a href="#how-it-works" className="flex items-center gap-2 hover:text-pink-400 transition-colors" style={navLinkStyle}>
                How It Works
              </a>
            </>
          )}
        </div>

        {/* Right: Auth / Profile */}
        <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
                  className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                >
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-black">
                    3
                  </span>
                </button>
                
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-72 bg-[#121212] border border-white/10 rounded-xl shadow-2xl py-2 z-50 text-white"
                    >
                      <div className="px-4 py-2 border-b border-white/10 font-semibold text-sm">Notifications</div>
                      <div className="max-h-64 overflow-y-auto">
                        <Link to="/requests" className="block px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5">
                          <p className="text-sm font-medium">New connection request</p>
                          <p className="text-xs text-white/50 mt-0.5">Rahul wants to connect with you.</p>
                        </Link>
                        <Link to="/messages" className="block px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5">
                          <p className="text-sm font-medium">New message</p>
                          <p className="text-xs text-white/50 mt-0.5">Ananya sent you a message.</p>
                        </Link>
                        <Link to="/requests" className="block px-4 py-3 hover:bg-white/5 transition-colors">
                          <p className="text-sm font-medium text-pink-400">Request accepted!</p>
                          <p className="text-xs text-white/50 mt-0.5">You are now matched with Vikram.</p>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
                >
                  <img
                    src={user?.profileImage && user.profileImage !== 'default.jpg' ? user.profileImage : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=ec4899&color=fff&size=150`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                  />
                  <span className="text-sm font-medium text-white max-w-[100px] truncate">{user?.name || "User"}</span>
                  <ChevronDown size={14} className="text-white/50" />
                </button>
                
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-[#121212] border border-white/10 rounded-xl shadow-2xl py-2 z-50 text-white"
                    >
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors">
                        <UserIcon size={16} className="text-white/70" /> <span className="text-sm font-medium">Profile</span>
                      </Link>
                      <Link to="/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors">
                        <Settings size={16} className="text-white/70" /> <span className="text-sm font-medium">Settings</span>
                      </Link>
                      <div className="h-px bg-white/10 my-1"></div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors text-red-400 hover:text-red-300">
                        <LogOut size={16} /> <span className="text-sm font-medium">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--color-text-main)', fontWeight: 500 }}>Login</Link>
              <Link to="/register" className="btn btn-primary bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg shadow-lg shadow-pink-500/25 transition-all border-none" style={{ padding: '0.5rem 1.25rem' }}>Join</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
