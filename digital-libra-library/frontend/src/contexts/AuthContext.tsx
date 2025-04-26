import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/user/login', { email, password });
      localStorage.setItem('token', response.data.accessToken);
      setIsAuthenticated(true);
      setUser(response.data.user);
    } catch (error) {
      console.error('Помилка входу:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post('/user/register', {
        username,
        email,
        password,
        role: 'user'
      });
      localStorage.setItem('token', response.data.accessToken);
      setIsAuthenticated(true);
      setUser(response.data.user);
    } catch (error) {
      console.error('Помилка реєстрації:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Here you could also verify the token with the backend
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
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