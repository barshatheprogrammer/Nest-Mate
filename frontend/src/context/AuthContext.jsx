import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUser, useAuth } from '@clerk/react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios defaults
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { getToken, signOut } = useAuth();

  useEffect(() => {
    // Do not finalize auth state until Clerk has finished loading
    if (!isLoaded) return;

    const checkLoggedIn = async () => {
      const storedUser = localStorage.getItem('user');
      
      // If signed in with Clerk but no custom user state, sync it
      if (isSignedIn && clerkUser && !storedUser) {
        try {
          const email = clerkUser.primaryEmailAddress?.emailAddress;
          const name = clerkUser.fullName || clerkUser.firstName || (email ? email.split('@')[0] : 'User');
          const imageUrl = clerkUser.imageUrl;
          if (email) {
            const res = await axios.post('/auth/clerk-sync', { email, clerkId: clerkUser.id, name, imageUrl });
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
          }
        } catch (err) {
          console.error("Clerk sync failed", err.response?.data || err);
          // If backend sync fails, we must sign out of Clerk to prevent being trapped in a half-logged-in state.
          await signOut();
        }
      } else if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
      }
      setLoading(false);
    };
    
    checkLoggedIn();
  }, [isLoaded, isSignedIn, clerkUser]);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await axios.post('/auth/login', { email, password });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const res = await axios.post('/auth/register', userData);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateLocalUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateLocalUser }}>
      {children}
    </AuthContext.Provider>
  );
};
