import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState('');
  const { user, login, error } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-pink-500/30"
            >
              <ShieldCheck className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
              Admin Portal
            </h2>
            <p className="text-white/50">Authorized Personnel Only</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400"
            >
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-white/70 ml-1">Admin Email</label>
              <div className={`relative flex items-center transition-all duration-300 rounded-xl border ${isFocused === 'email' ? 'border-pink-500 bg-white/10 shadow-[0_0_15px_rgba(236,72,153,0.15)]' : 'border-white/10 bg-white/5'}`}>
                <div className="pl-4 text-white/40">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  className="w-full bg-transparent border-none py-3 px-3 text-white placeholder-white/30 focus:outline-none focus:ring-0"
                  placeholder="admin@nestmate.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused('email')}
                  onBlur={() => setIsFocused('')}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-white/70 ml-1">Password</label>
              <div className={`relative flex items-center transition-all duration-300 rounded-xl border ${isFocused === 'password' ? 'border-pink-500 bg-white/10 shadow-[0_0_15px_rgba(236,72,153,0.15)]' : 'border-white/10 bg-white/5'}`}>
                <div className="pl-4 text-white/40">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  className="w-full bg-transparent border-none py-3 px-3 text-white placeholder-white/30 focus:outline-none focus:ring-0"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused('password')}
                  onBlur={() => setIsFocused('')}
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full mt-4 py-3.5 px-4 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition-all"
            >
              Secure Login <ArrowRight size={18} />
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
