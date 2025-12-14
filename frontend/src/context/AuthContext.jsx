import { createContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing auth token in localStorage
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setError(null);
    } catch (err) {
      console.warn('Logout error:', err);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');
      
      const response = await authAPI.refreshToken(refreshToken);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      setToken(response.token);
      
      return response.token;
    } catch (err) {
      console.error('Token refresh failed:', err);
      await logout();
      throw err;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token,
        logout,
        refreshAccessToken,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
