import React from 'react';
import { AuthenticateWithRedirectCallback } from '@clerk/react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

const SSOCallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-4 text-center"
      >
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
        <h2 className="text-xl font-medium">Authenticating with Google...</h2>
        <p className="text-white/50 text-sm">Please wait while we securely sign you in.</p>
        
        <div className="hidden">
          <AuthenticateWithRedirectCallback 
            afterSignInUrl="/dashboard"
            afterSignUpUrl="/dashboard"
            signInForceRedirectUrl="/profile"
            signUpForceRedirectUrl="/profile"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SSOCallback;
