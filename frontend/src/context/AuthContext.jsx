import { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(() => logout());
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { username, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const register = async (username, password, email, balance) => {
    const res = await axios.post(`${API_URL}/auth/register`, { username, password, email, balance });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const updateBalance = (newBalance) => {
    setUser(prev => ({ ...prev, balance: newBalance }));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
};
