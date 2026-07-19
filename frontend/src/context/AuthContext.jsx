import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.checkAuth();
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      // not authenticated
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      setUser(response.data.user);
      addToast('success', `Successfully logged in ${response.data.user.username}`);
      return true;
    } catch (error) {
      addToast('error', error.response?.data?.message || 'Login failed', 3200);
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);

      if (response.data.success) {
        setUser(response.data.user);
        addToast('success', response.data.message || 'Successfully signed up');
        return true;
      } else {
        const errorMsg = response.data.message || response.data.error || 'Signup failed';
        addToast('error', errorMsg, 3200);
        return false;
      }
    } catch (error) {
      let errorMsg = 'Signup failed';
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
        if (error.response.data.error) {
          errorMsg = error.response.data.error;
        }
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          errorMsg = error.response.data.errors.join(', ');
        }
      }

      addToast('error', errorMsg, 3200);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      addToast('success', 'Successfully logged out');
      return true;
    } catch (error) {
      addToast('error', 'Logout failed');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
