import { createContext, useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const signup = async (name, email, password) => {
  console.log("➡️ Hitting signup:", `${API_BASE_URL}/api/users/register`);
  const res = await axios.post(`${API_BASE_URL}/api/users/register`, {
    name,
    email,
    password,
  });
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  setToken(res.data.token);
  setUser(res.data.user);
  return res.data;
};

// Login
const loginUser = async (email, password) => {
  console.log("➡️ Hitting login:", `${API_BASE_URL}/api/users/login`);
  const res = await axios.post(`${API_BASE_URL}/api/users/login`, {
    email,
    password,
  });
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  setToken(res.data.token);
  setUser(res.data.user);
  return res.data;
};
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  const refreshUser = async () => {
    try {
      const currentToken = localStorage.getItem("token");
      const currentUser = localStorage.getItem("user");
      
      if (currentToken && currentUser) {
        const userId = JSON.parse(currentUser).id;
        const res = await axios.get(`${API_BASE_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${currentToken}` }
        });
        
        const updatedUser = res.data;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser); // This will trigger re-render
        return updatedUser;
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, signup, loginUser, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
