import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../utils/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      const token = localStorage.getItem('gridshare_token');
      if (token) {
        try {
          const userData = await api.get('/auth/me');
          setUser({
            ...userData,
            id: userData._id,
            createdAt: new Date(userData.createdAt)
          });
        } catch (error) {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('gridshare_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response;
      
      localStorage.setItem('gridshare_token', token);
      setUser({
        ...userData,
        id: userData._id || userData.id,
        createdAt: new Date(userData.createdAt)
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      // Re-throw the error so the component can display the actual message
      throw error;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<boolean> => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user: newUser } = response;
      
      localStorage.setItem('gridshare_token', token);
      setUser({
        ...newUser,
        id: newUser._id || newUser.id,
        createdAt: new Date(newUser.createdAt)
      });
      return true;
    } catch (error) {
      console.error('Register error:', error);
      // Re-throw the error so the component can display the actual message
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gridshare_token');
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      try {
        const updatedUser = await api.put('/auth/profile', userData);
        setUser({
          ...updatedUser,
          id: updatedUser._id || updatedUser.id,
          createdAt: new Date(updatedUser.createdAt)
        });
      } catch (error) {
        console.error('Update user error:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};