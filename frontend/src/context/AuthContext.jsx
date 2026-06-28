import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Loads the user profile if a JWT exists in local storage
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await authService.getProfile();
      // The profile API returns { "message": "...", "user": { "id", "username", "email" } }
      setUser(data.user);
    } catch (err) {
      console.error('Session validation failed:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    if (data && data.access_token) {
      localStorage.setItem('token', data.access_token);
      await loadUser();
    }
    return data;
  };

  const register = async (username, email, password) => {
    const data = await authService.register(username, email, password);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const deleteAccount = async () => {
    const data = await authService.deleteAccount();
    localStorage.removeItem('token');
    setUser(null);
    return data;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    deleteAccount,
    refreshUser: loadUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
