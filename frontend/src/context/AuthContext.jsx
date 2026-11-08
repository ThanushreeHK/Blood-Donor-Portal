/**
 * @file AuthContext.jsx
 * @description Global state management for user authentication.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on page load
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('bpt_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
        } catch (error) {
          console.error("Token expired or invalid");
          localStorage.removeItem('bpt_token');
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  /**
   * Logs the user in and saves the token.
   */
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data.data;
    localStorage.setItem('bpt_token', token);
    setUser(user);
    return user;
  };

  /**
   * Registers a user and logs them in.
   */
  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token, user } = res.data.data;
    localStorage.setItem('bpt_token', token);
    setUser(user);
    return user;
  };

  /**
   * Logs the user out and clears the token.
   */
  const logout = () => {
    localStorage.removeItem('bpt_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);