import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/react';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState('');
  const { user, login, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const clerk = useClerk();

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      
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
              <LogIn className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
              Welcome Back
            </h2>
            <p className="text-white/50">Sign in to continue to NestMate</p>
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
            <span className="text-white/40 text-sm">or sign in with email</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-white/70 ml-1">Email Address</label>
              <div className={`relative flex items-center transition-all duration-300 rounded-xl border ${isFocused === 'email' ? 'border-pink-500 bg-white/10 shadow-[0_0_15px_rgba(236,72,153,0.15)]' : 'border-white/10 bg-white/5'}`}>
                <div className="pl-4 text-white/40">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-transparent border-none py-3 px-3 text-white placeholder-white/30 focus:outline-none focus:ring-0"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused('email')}
                  onBlur={() => setIsFocused('')}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-white/70">Password</label>
                <a href="#" className="text-xs text-pink-400 hover:text-pink-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className={`relative flex items-center transition-all duration-300 rounded-xl border ${isFocused === 'password' ? 'border-pink-500 bg-white/10 shadow-[0_0_15px_rgba(236,72,153,0.15)]' : 'border-white/10 bg-white/5'}`}>
                <div className="pl-4 text-white/40">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  id="password"
                  className="w-full bg-transparent border-none py-3 px-3 text-white placeholder-white/30 focus:outline-none focus:ring-0"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused('password')}
                  onBlur={() => setIsFocused('')}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 py-1">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="peer appearance-none w-5 h-5 border border-white/20 rounded bg-white/5 checked:bg-pink-500 checked:border-pink-500 transition-all cursor-pointer"
                />
                <svg className="absolute w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 left-1 top-1 text-white transition-opacity duration-200" viewBox="0 0 14 10" fill="none">
                  <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <label htmlFor="remember" className="text-sm text-white/60 cursor-pointer hover:text-white/80 transition-colors">
                Remember me for 30 days
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition-all"
            >
              Sign In <ArrowRight size={18} />
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/50 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-white hover:text-pink-400 font-medium transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
