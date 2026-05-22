import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'; // Mampiasa axios tsotra eto
import axiosInstance from '../api/axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fonction Fidirana (Login)
  const loginUser = async (email, password) => {
    try {
      // Mampiasa axios tsotra mba tsy hisy conflict amin'ny Interceptor
      const res = await axios.post('http://127.0.0.1:8000/api/auth/login/', { 
        email, 
        password 
      });
      
      const { access, refresh } = res.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      const decoded = jwtDecode(access);
      
      const userData = {
        id: decoded.user_id || decoded.sub,
        email: decoded.email || email,
        username: decoded.username || '',
        role: decoded.role || 'etudiant'
      };

      setUser(userData); 
      return { success: true, user: userData };

    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: error.response?.data?.detail || "Diso ny mailaka na ny tenimiafina." 
      };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            logoutUser();
          } else {
            setUser({
              id: decoded.user_id || decoded.sub,
              email: decoded.email || '',
              username: decoded.username || '',
              role: decoded.role || 'etudiant'
            });
          }
        } catch (e) {
          logoutUser();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);