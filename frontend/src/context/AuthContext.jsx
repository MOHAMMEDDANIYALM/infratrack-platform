import { createContext, useEffect, useRef, useState } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { authAPI } from '../services/api';

// MSAL configuration for SPA with configurable authority
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '3f2cb0db-c506-43d7-a008-2c7e5a77e230',
    // Allow overriding authority for personal accounts (consumers/common)
    authority: import.meta.env.VITE_MICROSOFT_AUTHORITY
      || (import.meta.env.VITE_MICROSOFT_TENANT_ID
        ? `https://login.microsoftonline.com/${import.meta.env.VITE_MICROSOFT_TENANT_ID}`
        : undefined),
    redirectUri: import.meta.env.VITE_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false, // Not needed for implicit flow
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, piiEnabled) => {
        if (level === 'verbose') return; // Suppress verbose logs
        console.log(`[MSAL] ${message}`);
      },
    },
  },
};

// Request token for the SPA client (frontend uses ID token implicitly via loginPopup)
const loginRequest = {
  scopes: ['openid', 'profile', 'email'],
};

// Silent token request for refreshing user info
const tokenRequest = {
  scopes: ['openid', 'profile', 'email'],
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const msalInstanceRef = useRef(null);

  useEffect(() => {
    const initializeMsal = async () => {
      try {
        // Check for existing auth token in localStorage
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }

        // Initialize MSAL only if config is complete
        if (msalConfig.auth.clientId && msalConfig.auth.authority) {
          msalInstanceRef.current = new PublicClientApplication(msalConfig);
          await msalInstanceRef.current.initialize();

          // Check if user is already signed in
          const accounts = msalInstanceRef.current.getAllAccounts();
          if (accounts.length > 0) {
            console.log('User already signed in:', accounts[0].username);
          }
        } else {
          console.error('MSAL not configured: missing clientId or authority');
          setError('Microsoft login not configured');
        }
      } catch (err) {
        console.error('MSAL initialization error:', err);
        setError('Failed to initialize Microsoft login');
      } finally {
        setLoading(false);
      }
    };

    initializeMsal();
  }, []);

  const loginWithMicrosoft = async () => {
    if (!msalInstanceRef.current) {
      throw new Error('Microsoft login is not configured. Missing client ID or tenant ID.');
    }

    try {
      setError(null);

      // Check if user is already signed in
      const accounts = msalInstanceRef.current.getAllAccounts();
      
      if (accounts.length > 0) {
        // User already has an account, get token silently
        console.log('User already signed in, acquiring token silently...');
        const msalResponse = await msalInstanceRef.current.acquireTokenSilent({
          ...tokenRequest,
          account: accounts[0],
        });

        // Send ID token to backend for verification and session creation
        const idToken = msalResponse.idToken;
        const response = await authAPI.loginWithMicrosoft(idToken);

        // Store backend tokens and user info
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));

        setToken(response.token);
        setUser(response.user);
        return response;
      }

      // First-time login: show popup
      console.log('First-time login, showing popup...');
      const msalResponse = await msalInstanceRef.current.loginPopup(loginRequest);

      if (!msalResponse) {
        throw new Error('No response from Microsoft login');
      }

      // Send ID token to backend for verification and session creation
      const idToken = msalResponse.idToken;
      const response = await authAPI.loginWithMicrosoft(idToken);

      // Store backend tokens and user info
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      setToken(response.token);
      setUser(response.user);

      return response;
    } catch (err) {
      console.error('Microsoft login failed:', err.message || err);
      setError(err.message || 'Login failed');

      // Handle specific MSAL errors
      if (err.message && err.message.includes('interaction_in_progress')) {
        throw new Error('A login is already in progress. Please wait or refresh the page.');
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setError(null);

      if (msalInstanceRef.current) {
        const accounts = msalInstanceRef.current.getAllAccounts();
        if (accounts.length > 0) {
          await msalInstanceRef.current.logoutPopup({
            postLogoutRedirectUri: window.location.origin,
            account: accounts[0],
          });
        }
      }
    } catch (err) {
      console.warn('Logout warning:', err);
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
        loginWithMicrosoft,
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
