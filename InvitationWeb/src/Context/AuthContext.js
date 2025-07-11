import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function will run on initial app load to check for an existing session
    const checkUserSession = async () => {
      try {
        // The browser automatically sends the http-only cookie
        const response = await api.get('/users/me');
        setUser(response.data);
      } catch (error) {
        // No valid session found
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const login = async (email, password) => {
    // The login function now gets the user data directly from the response
    // The token is handled automatically by the browser as a cookie
    const response = await api.post('/auth/login', { email, password });
    setUser(response.data.user); // The user object is now directly in response.data
    return response;
  };

  const logout = async () => {
    // Call the backend endpoint to clear the cookie
    await api.post('/auth/logout');
    setUser(null);
  };

  const register = async (username, email, password) => {
    return await api.post('/auth/register', { username, email, password });
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
