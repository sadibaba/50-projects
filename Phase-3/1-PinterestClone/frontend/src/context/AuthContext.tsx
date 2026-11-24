'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/auth.service";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const persist = (nextToken: string, nextUser: User) => {
    localStorage.setItem("token", nextToken);
    localStorage.setItem("current_user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const refresh = useCallback(async () => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      setLoading(false);
      return;
    }
    try {
      const fresh = await authService.me();
      setToken(stored);
      setUser(fresh);
      localStorage.setItem("current_user", JSON.stringify(fresh));
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("current_user");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email: string, password: string) => {
    const data = await authService.login({ email, password });
    persist(data.token, data.user);
    toast.success(`Welcome back, ${data.user.name}`);
    router.push("/");
  };

  const register = async (username: string, email: string, password: string) => {
    const data = await authService.register({ username, email, password });
    persist(data.token, data.user);
    toast.success("Account created");
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("current_user");
    setToken(null);
    setUser(null);
    toast.success("Signed out");
    router.push("/");
  };

  const updateUser = (nextUser: User) => {
    setUser(nextUser);
    localStorage.setItem("current_user", JSON.stringify(nextUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        updateUser,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
