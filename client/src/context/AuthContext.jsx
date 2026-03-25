import { createContext, useContext, useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const persistAuth = (userData, tokenValue) => {
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  };

  const register = useCallback(async (name, email, password) => {
    const { data } = await axiosInstance.post("/auth/register", {
      name,
      email,
      password,
    });
    persistAuth(data.user, data.token);
    toast.success("Account created successfully!");
    return data;
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    persistAuth(data.user, data.token);
    toast.success(`Welcome back, ${data.user.name}!`);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    toast.success("Logged out");
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
