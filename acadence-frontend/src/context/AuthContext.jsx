import { createContext, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const signup = async (name, email, password) => {
  console.log("➡️ Hitting signup:", `${API_BASE_URL}/api/auth/signup`);
  const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
    name,
    email,
    password,
  });
  return res.data;
};

// Login
const loginUser = async (email, password) => {
  console.log("➡️ Hitting login:", `${API_BASE_URL}/api/auth/login`);
  const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
    email,
    password,
  });
  localStorage.setItem("token", res.data.token);
  setToken(res.data.token);
  setUser(res.data.user);
  return res.data;
};
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, signup, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
