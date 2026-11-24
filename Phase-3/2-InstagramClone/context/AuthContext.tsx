"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authApi } from "@/services";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { user: current } = await authApi.me();
      setUser(current);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = async (email: string, password: string) => {
    const { user: next } = await authApi.login({ email, password });
    setUser(next);
    toast.success(`Welcome back, ${next.name || next.username}`);
    router.push("/");
  };

  const register = async (username: string, email: string, password: string, name?: string) => {
    const { user: next } = await authApi.register({ username, email, password, name });
    setUser(next);
    toast.success("Account created");
    router.push("/");
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    toast.success("Signed out");
    router.push("/login");
  };

  const updateUser = (next: User) => setUser(next);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: Boolean(user), login, register, logout, updateUser, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};
