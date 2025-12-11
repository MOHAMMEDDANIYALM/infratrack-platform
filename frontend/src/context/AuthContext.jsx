import { createContext, useEffect, useRef, useState } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { authAPI } from '../services/api';

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
    authority: import.meta.env.VITE_MICROSOFT_TENANT_ID
      ? `https://login.microsoftonline.com/${import.meta.env.VITE_MICROSOFT_TENANT_ID}`
      : undefined,
    redirectUri: window.location.origin,
  },
};

const microsoftScopes = ['User.Read', 'email', 'profile', 'openid'];

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const msalInstanceRef = useRef(null);

  useEffect(() => {
    const initializeMsal = async () => {
      // Check for existing auth token
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }

      if (msalConfig.auth.clientId) {
        try {
          msalInstanceRef.current = new PublicClientApplication(msalConfig);
          await msalInstanceRef.current.initialize();
        } catch (error) {
          console.error('MSAL initialization error:', error);
        }
      }

      setLoading(false);
    };

    initializeMsal();
  }, []);

  const loginWithMicrosoft = async () => {
    if (!msalInstanceRef.current) {
      throw new Error('Microsoft login is not configured. Missing client ID or tenant ID.');
    }

    try {
      // Check if interaction is already in progress
      if (msalInstanceRef.current.getAllAccounts().length > 0) {
        // User already signed in, just get token silently
        const msalResponse = await msalInstanceRef.current.acquireTokenSilent({
          scopes: microsoftScopes,
          account: msalInstanceRef.current.getAllAccounts()[0],
        });
        const idToken = msalResponse.idToken;

        if (!idToken) {
          throw new Error('No Microsoft token returned');
        }

        const response = await authAPI.loginWithMicrosoft(idToken);
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
        return response;
      }

      // First time login - use popup
      const msalResponse = await msalInstanceRef.current.loginPopup({ 
        scopes: microsoftScopes,
        redirectUri: window.location.origin,
      });
      const idToken = msalResponse.idToken;

      if (!idToken) {
        throw new Error('No Microsoft token returned');
      }

      const response = await authAPI.loginWithMicrosoft(idToken);

      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      setToken(response.token);
      setUser(response.user);

      return response;
    } catch (error) {
      console.error('Microsoft login failed:', error.message || error);
      // If interaction_in_progress, allow user to retry
      if (error.message && error.message.includes('interaction_in_progress')) {
        throw new Error('A login is already in progress. Please wait or refresh the page.');
      }
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);

    if (msalInstanceRef.current) {
      try {
        await msalInstanceRef.current.logoutPopup({ postLogoutRedirectUri: window.location.origin });
      } catch (error) {
        console.warn('Microsoft logout warning:', error);
      }
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
    } catch (error) {
      await logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token,
        loginWithMicrosoft,
        logout,
        refreshAccessToken,
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
