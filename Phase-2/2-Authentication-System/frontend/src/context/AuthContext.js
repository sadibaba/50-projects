// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as authApi from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.getProfile();
      setUser(res.data);
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (data) => {
    try {
      setError(null);
      const res = await authApi.login(data);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        // Fetch user profile after login
        const profileRes = await authApi.getProfile();
        setUser(profileRes.data);
      }
      return { success: true, data: res.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const signup = async (data) => {
    try {
      setError(null);
      const res = await authApi.signup(data);
      // Auto login after signup
      await login({ email: data.email, password: data.password });
      return { success: true, data: res.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Signup failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    checkAuth,
    setError,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: value },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};