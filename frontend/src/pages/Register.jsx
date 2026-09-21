import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    city: ''
  });
  const [validationError, setValidationError] = useState('');
  const [isFocused, setIsFocused] = useState('');
  
  const { register, error } = useContext(AuthContext);
  const navigate = useNavigate();

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
      college: formData.college,
      city: formData.city
    });

    if (success) {
      navigate('/dashboard');
    }
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

            {/* Row 2: College and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              <UserPlus size={18} /> Complete Registration
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
