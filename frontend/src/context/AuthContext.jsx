import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Load user details if token exists
  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await authAPI.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (err) {
      console.warn('Auth token validation failed, logging out');
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (name, email, password, phone) => {
    const res = await authAPI.register({ name, email, password, phone });
    if (res.success && res.token) {
      localStorage.setItem('token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await authAPI.updateProfile(data);
    if (res.success && res.user) {
      setUser(res.user);
      if (res.token) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
      }
    }
    return res;
  };

  const changePassword = async (currentPassword, newPassword) => {
    return await authAPI.changePassword({ currentPassword, newPassword });
  };

  const addAddress = async (addressData) => {
    const res = await authAPI.addAddress(addressData);
    if (res.success && res.addresses) {
      setUser((prev) => ({ ...prev, addresses: res.addresses }));
    }
    return res;
  };

  const updateAddress = async (id, addressData) => {
    const res = await authAPI.updateAddress(id, addressData);
    if (res.success && res.addresses) {
      setUser((prev) => ({ ...prev, addresses: res.addresses }));
    }
    return res;
  };

  const deleteAddress = async (id) => {
    const res = await authAPI.deleteAddress(id);
    if (res.success && res.addresses) {
      setUser((prev) => ({ ...prev, addresses: res.addresses }));
    }
    return res;
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        addAddress,
        updateAddress,
        deleteAddress,
        refreshUser: loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
