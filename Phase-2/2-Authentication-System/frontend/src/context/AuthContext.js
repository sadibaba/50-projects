import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as authApi from "../api/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.getProfile();
      setUser(res.data);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
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
      setToken(res.data.token);
      if (res.data.user) {
        setUser(res.data.user);
      } else {
        const profileRes = await authApi.getProfile();
        setUser(profileRes.data);
      }
      return { success: true, data: res.data };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      setError(message);
      return { success: false, error: message };
    }
  };

  const signup = async (data) => {
    try {
      setError(null);
      await authApi.signup(data);
      return await login({ email: data.email, password: data.password });
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Signup failed";
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // The local session is cleared even if the API call fails.
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setError(null);
    }
  };

  const updateUser = (nextUser) => {
    setUser((current) => ({ ...current, ...nextUser }));
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout,
    checkAuth,
    updateUser,
    setError,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
