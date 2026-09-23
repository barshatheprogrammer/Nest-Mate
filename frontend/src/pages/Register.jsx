import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/react';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Mail, Lock, AlertCircle, ArrowRight, User, Building, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    city: '',
    phone: '',
    role: 'student'
  });
  const [validationError, setValidationError] = useState('');
  const [isFocused, setIsFocused] = useState('');
  
  const { user, register, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const clerk = useClerk();

  useEffect(() => {
    if (user) {
      if (user.role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/profile');
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      college: formData.role === 'student' ? formData.college : undefined,
      city: formData.city,
      phone: formData.role === 'owner' ? formData.phone : undefined,
      role: formData.role
    });

    // Redirect is handled by the useEffect watching the 'user' state
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 py-20 overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30"
            >
              <UserPlus className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
              Create an Account
            </h2>
            <p className="text-white/50">Join NestMate and find your perfect roommate.</p>
          </div>

          {(error || validationError) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400"
            >
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm font-medium">{validationError || error}</p>
            </motion.div>
          )}

          <div className="space-y-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!clerk.loaded) return;
                try {
                  clerk.client.signIn.authenticateWithRedirect({
                    strategy: 'oauth_google',
                    redirectUrl: '/sso-callback',
                    redirectUrlComplete: '/profile',
                  });
                } catch (e) {
                  console.error(e);
                }
              }}
              type="button"
              className="w-full py-3.5 px-4 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </motion.button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-white/40 text-sm">or register with email</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <div className="flex bg-white/5 rounded-xl p-1 mb-6 border border-white/10">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'student' })}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                formData.role === 'student' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'owner' })}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                formData.role === 'owner' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              Owner
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-white/70 ml-1">Full Name</label>
                <div className={`relative flex items-center transition-all duration-300 rounded-xl border ${isFocused === 'name' ? 'border-purple-500 bg-white/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'border-white/10 bg-white/5'}`}>
                  <div className="pl-4 text-white/40">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-transparent border-none py-3 px-3 text-white placeholder-white/30 focus:outline-none focus:ring-0"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setIsFocused('name')}
                    onBlur={() => setIsFocused('')}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-white/70 ml-1">Email Address</label>
                <div className={`relative flex items-center transition-all duration-300 rounded-xl border ${isFocused === 'email' ? 'border-purple-500 bg-white/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'border-white/10 bg-white/5'}`}>
                  <div className="pl-4 text-white/40">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-transparent border-none py-3 px-3 text-white placeholder-white/30 focus:outline-none focus:ring-0"
                    placeholder="name@college.edu"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setIsFocused('email')}
                    onBlur={() => setIsFocused('')}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2: College/Phone and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {formData.role === 'student' ? (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-white/70 ml-1">College / University</label>
                  <div className={`relative flex items-center transition-all duration-300 rounded-xl border ${isFocused === 'college' ? 'border-purple-500 bg-white/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'border-white/10 bg-white/5'}`}>
                    <div className="pl-4 text-white/40">
                      <Building size={18} />
                    </div>
                    <input
                      type="text"
                      id="college"
                      className="w-full bg-transparent border-none py-3 px-3 text-white placeholder-white/30 focus:outline-none focus:ring-0"
                      placeholder="State University"
                      value={formData.college}
                      onChange={handleChange}
                      onFocus={() => setIsFocused('college')}
                      onBlur={() => setIsFocused('')}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-white/70 ml-1">Phone Number</label>
                  <div className={`relative flex items-center transition-all duration-300 rounded-xl border ${isFocused === 'phone' ? 'border-purple-500 bg-white/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'border-white/10 bg-white/5'}`}>
                    <div className="pl-4 text-white/40">
                      <User size={18} />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full bg-transparent border-none py-3 px-3 text-white placeholder-white/30 focus:outline-none focus:ring-0"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setIsFocused('phone')}
                      onBlur={() => setIsFocused('')}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-white/70 ml-1">City</label>
                <div className={`relative flex items-center transition-all duration-300 rounded-xl border ${isFocused === 'city' ? 'border-purple-500 bg-white/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'border-white/10 bg-white/5'}`}>
                  <div className="pl-4 text-white/40">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    id="city"
                    className="w-full bg-transparent border-none py-3 px-3 text-white placeholder-white/30 focus:outline-none focus:ring-0"
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleChange}
                    onFocus={() => setIsFocused('city')}
                    onBlur={() => setIsFocused('')}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-white/70 ml-1">Password</label>
                <div className={`relative flex items-center transition-all duration-300 rounded-xl border ${isFocused === 'password' ? 'border-purple-500 bg-white/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'border-white/10 bg-white/5'}`}>
                  <div className="pl-4 text-white/40">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    id="password"
                    className="w-full bg-transparent border-none py-3 px-3 text-white placeholder-white/30 focus:outline-none focus:ring-0"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setIsFocused('password')}
                    onBlur={() => setIsFocused('')}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-white/70 ml-1">Confirm Password</label>
                <div className={`relative flex items-center transition-all duration-300 rounded-xl border ${isFocused === 'confirm' ? 'border-purple-500 bg-white/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'border-white/10 bg-white/5'}`}>
                  <div className="pl-4 text-white/40">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full bg-transparent border-none py-3 px-3 text-white placeholder-white/30 focus:outline-none focus:ring-0"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setIsFocused('confirm')}
                    onBlur={() => setIsFocused('')}
                    required
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 px-4 mt-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <UserPlus size={18} /> {formData.role === 'owner' ? 'Create Owner Account' : 'Complete Registration'}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/50 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:text-purple-400 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
