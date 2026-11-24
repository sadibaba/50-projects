"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authApi } from "@/services";
import type { User } from "@/types";

interface AuthValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string; name?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthValue | undefined>(undefined);
export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try { setUser((await authApi.me()).user); } catch { setUser(null); } finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const login = async (email: string, password: string) => {
    const { user: next } = await authApi.login({ email, password });
    setUser(next);
    toast.success(`Welcome, ${next.name || next.username}`);
  };
  const register = async (data: { username: string; email: string; password: string; name?: string }) => {
    const { user: next } = await authApi.register(data);
    setUser(next);
    toast.success("Account created");
  };
  const logout = async () => {
    await authApi.logout();
    setUser(null);
    toast.success("Signed out");
  };
  const updateUser = (next: User) => setUser(next);

  return <AuthContext.Provider value={{ user, loading, isAuthenticated: Boolean(user), login, register, logout, refresh, updateUser }}>{children}</AuthContext.Provider>;
};
