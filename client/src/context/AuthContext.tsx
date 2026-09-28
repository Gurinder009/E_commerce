import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { IUser } from '../types';
import { useToast } from '../utils/toast';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<IUser>;
  register: (data: any) => Promise<IUser>;
  logout: () => void;
  updateUser: (updatedUser: IUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(() => {
    const saved = localStorage.getItem('shopsphere_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('shopsphere_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const toast = useToast();

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('shopsphere_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data.success && response.data.data?.user) {
          setUser(response.data.data.user);
          localStorage.setItem('shopsphere_user', JSON.stringify(response.data.data.user));
        }
      } catch (error) {
        localStorage.removeItem('shopsphere_token');
        localStorage.removeItem('shopsphere_user');
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (email: string, password: string): Promise<IUser> => {
    const response = await api.post('/auth/login', { email, password });
    const { user: userData, token: authToken } = response.data.data;

    setUser(userData);
    setToken(authToken);
    localStorage.setItem('shopsphere_token', authToken);
    localStorage.setItem('shopsphere_user', JSON.stringify(userData));

    toast.success(`Welcome back, ${userData.name}!`);
    return userData;
  };

  const register = async (data: any): Promise<IUser> => {
    const response = await api.post('/auth/register', data);
    const { user: userData, token: authToken } = response.data.data;

    setUser(userData);
    setToken(authToken);
    localStorage.setItem('shopsphere_token', authToken);
    localStorage.setItem('shopsphere_user', JSON.stringify(userData));

    toast.success(`Welcome to ShopSphere, ${userData.name}!`);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('shopsphere_token');
    localStorage.removeItem('shopsphere_user');
    setUser(null);
    setToken(null);
    toast.info('You have been logged out.');
  };

  const updateUser = (updatedUser: IUser) => {
    setUser(updatedUser);
    localStorage.setItem('shopsphere_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
