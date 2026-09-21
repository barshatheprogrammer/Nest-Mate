import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, Users, Search, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
          <Link to="/" className="flex items-center gap-2 hover:text-pink-400 transition-colors" style={{ color: 'var(--color-text-main)' }}>
            Home
          </Link>
          <Link to="/explore" className="flex items-center gap-2 hover:text-pink-400 transition-colors" style={{ color: 'var(--color-text-main)' }}>
            <Search size={18} /> Explore
          </Link>
          <a href="#how-it-works" className="flex items-center gap-2 hover:text-pink-400 transition-colors" style={{ color: 'var(--color-text-main)' }}>
            How It Works
          </a>
        </div>

        {/* Right: Auth / Profile */}
        <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="hidden md:flex items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
                <Users size={18} /> Dashboard
              </Link>
              <Link to="/profile" className="flex items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
                <UserIcon size={18} /> Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
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
