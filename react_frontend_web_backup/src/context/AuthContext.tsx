import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { tokenService } from '../services/tokenService';
import { apiService } from '../services/apiService';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check initial auth state
    const checkAuth = async () => {
      const hasToken = tokenService.hasToken();
      if (hasToken) {
        setIsAuthenticated(true);
        // Load user info from local storage
        const id = tokenService.getUserId();
        const email = tokenService.getUserEmail();
        const name = tokenService.getUserName();
        if (id && email && name) {
          setUser({ id, email, name });
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    tokenService.saveToken(token);
    tokenService.saveUserInfo(userData.id, userData.email, userData.name.split(' ')[0] || '', userData.name.split(' ')[1] || '');
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    await apiService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
