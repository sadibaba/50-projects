import React, { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common.Authorization;
    setToken(null);
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/users/profile`);
      setUser(response.data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });
      const { token: nextToken, ...userData } = response.data;
      localStorage.setItem("token", nextToken);
      axios.defaults.headers.common.Authorization = `Bearer ${nextToken}`;
      setToken(nextToken);
      setUser(userData);
      toast.success("Signed in");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        username,
        email,
        password,
      });
      const { token: nextToken, ...userData } = response.data;
      localStorage.setItem("token", nextToken);
      axios.defaults.headers.common.Authorization = `Bearer ${nextToken}`;
      setToken(nextToken);
      setUser(userData);
      toast.success("Account created");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return false;
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await axios.put(`${API_URL}/users/profile`, data);
      setUser(response.data);
      toast.success("Profile updated");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update profile");
      return false;
    }
  };

  const changePassword = async (data) => {
    try {
      await axios.put(`${API_URL}/users/password`, data);
      toast.success("Password changed");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not change password");
      return false;
    }
  };

  const deleteAccount = async () => {
    try {
      await axios.delete(`${API_URL}/users/account`);
      logout();
      toast.success("Account deleted");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete account");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        deleteAccount,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
