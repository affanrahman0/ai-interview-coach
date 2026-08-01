// PHASE 1: Global auth state (current user, login/logout helpers).

import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  //useEffect runs every time the token variable changes.
  // When you log in, it saves the new token to localStorage.
  // When you log out , it wipes the token from localStorage.
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      setToken(data.access_token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, email, password) => {
    setLoading(true);
    try {
      const data = await registerUser(fullName, email, password);
      // Automatically log in after registration
      await login(email, password);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
