'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to set cookie
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// Helper function to delete cookie
const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCurrentUser = async (token: string) => {
    try {
      // Try to get user info from backend
      const response = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user from backend:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = authService.getToken();
      console.log('Loading user, token exists:', !!token);
      
      if (token) {
        try {
          // First try to get from localStorage
          const storedUser = localStorage.getItem('current_user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            console.log('Found stored user:', parsedUser);
            setUser(parsedUser);
          }
          
          // Then try to fetch fresh user data from backend
          const freshUser = await fetchCurrentUser(token);
          if (freshUser) {
            setUser(freshUser);
            localStorage.setItem('current_user', JSON.stringify(freshUser));
          }
        } catch (error) {
          console.error('Failed to load user:', error);
          authService.logout();
          deleteCookie('token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const response = await authService.login({ email, password });
      console.log('Login response:', response);
      
      if (response.token) {
        setCookie('token', response.token, 7);
        
        // Decode the JWT token to get user info
        try {
          const tokenParts = response.token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('Decoded token payload:', payload);
            
            // Fetch full user data including profile picture
            const userData = await fetchCurrentUser(response.token);
            
            if (userData) {
              console.log('Setting user from API:', userData);
              setUser(userData);
              localStorage.setItem('current_user', JSON.stringify(userData));
            } else {
              // Fallback: create user from token
              const fallbackUser: User = {
                _id: payload.id || payload.userId || '1',
                username: payload.username || email.split('@')[0],
                email: email,
                profilePicture: '',
                bio: '',
                followers: [],
                following: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              setUser(fallbackUser);
              localStorage.setItem('current_user', JSON.stringify(fallbackUser));
            }
            
            toast.success('Logged in successfully!');
            router.push('/');
          }
        } catch (decodeError) {
          console.error('Failed to decode token:', decodeError);
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || 'Login failed');
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      console.log('Attempting registration for:', email);
      await authService.register({ username, email, password });
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.error || 'Registration failed');
      throw error;
    }
  };

  const logout = async () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('current_user');
    deleteCookie('token');
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('current_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};